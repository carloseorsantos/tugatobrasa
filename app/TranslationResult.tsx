import type { components } from "@/lib/api-client";

type TranslateResponse = components["schemas"]["TranslateResponse"];
type Direction = "PT_TO_BR" | "BR_TO_PT";

export type ViewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; data: TranslateResponse }
  | { kind: "not_found"; data: TranslateResponse }
  | { kind: "error" };

function confidenceLabel(confidence: number | undefined): string {
  if (confidence === undefined) return "sugestão aproximada";
  if (confidence >= 0.95) return "confiança alta";
  if (confidence >= 0.8) return "confiança média";
  return "sugestão aproximada";
}

function registerLabel(register: string | undefined): string | null {
  if (register === "GIRIA") return "gír.";
  if (register === "CALAO") return "calão";
  return null;
}

export default function TranslationResult({ state, direction }: { state: ViewState; direction: Direction }) {
  if (state.kind === "loading") {
    return (
      <div className="ds-loading" aria-busy="true">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        a procurar no glossário<span className="sr-only"> — aguarde</span>
      </div>
    );
  }

  if (state.kind === "success") {
    const [primary, ...rest] = state.data.translations ?? [];
    if (!primary) return null;

    const directionLabel = direction === "PT_TO_BR" ? "pt-PT → pt-BR" : "pt-BR → pt-PT";
    const falseFriends = (state.data.translations ?? []).filter((t) => t.falseFriend);

    return (
      <article className="ds-card">
        <div className="headline">
          <h2 className="headword">{primary.target}</h2>
          {registerLabel(primary.register) && <span className="ds-badge-pos">{registerLabel(primary.register)}</span>}
        </div>
        <p className="src-note">
          tradução de <b>{state.data.input}</b> · {directionLabel}
        </p>
        {rest.length > 0 && (
          <div className="senses">
            {[primary, ...rest].map((sense, i) => (
              <div className="sense" key={i}>
                <span className="sense-n">{i + 1}.</span>
                <span className="sense-t">{sense.target}</span>
              </div>
            ))}
          </div>
        )}
        {primary.example && <p className="example">{primary.example}</p>}
        {falseFriends.map((ff, i) => (
          <aside className="ds-ff-alert" role="alert" key={i}>
            <span className="label">Falso amigo</span>
            <p>{ff.note}</p>
          </aside>
        ))}
        <div className="card-meta">
          <span>glossário da comunidade · {confidenceLabel(primary.confidence)}</span>
        </div>
      </article>
    );
  }

  if (state.kind === "not_found") {
    const suggestions = state.data.suggestions ?? [];
    return (
      <div className="ds-card">
        <h2 className="nf-word">{state.data.input}</h2>
        <p className="nf-note">
          Ainda não temos entrada para este termo.
          {suggestions.length > 0 && ` Veja se ajuda: ${suggestions.join(", ")}.`}
          <br />
          Conhece o significado? Este dicionário é escrito pela comunidade.
        </p>
        {state.data.contributeUrl && (
          <a className="ds-contribute" href={state.data.contributeUrl} target="_blank" rel="noopener">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M8 3v10M3 8h10" />
            </svg>
            Contribuir com este termo
          </a>
        )}
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="ds-card err" role="alert">
        <strong>Não foi possível traduzir agora.</strong>
        <p>
          Verifique a ligação e tente novamente. Se persistir,{" "}
          <a href="https://github.com/carloseorsantos/tugatobrasa/issues" target="_blank" rel="noopener">
            reporte o problema
          </a>
          .
        </p>
      </div>
    );
  }

  return null;
}
