import { NextRequest, NextResponse } from "next/server";
import type { components } from "@/lib/api-client";

type TranslateRequest = components["schemas"]["TranslateRequest"];

export async function POST(request: NextRequest) {
  let body: TranslateRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    return NextResponse.json({ error: "Não foi possível traduzir agora." }, { status: 500 });
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${apiBaseUrl}/api/v1/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // API indisponível — nunca vaza a URL/erro interno pro cliente
    return NextResponse.json({ error: "Não foi possível traduzir agora." }, { status: 502 });
  }

  try {
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch {
    return NextResponse.json({ error: "Não foi possível traduzir agora." }, { status: 502 });
  }
}
