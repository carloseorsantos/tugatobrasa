import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tugatobrasa — tradutor pt-PT ⇌ pt-BR",
  description:
    "Traduza palavras, gírias e expressões entre o português de Portugal e o do Brasil — com aviso de falsos amigos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        {children}
        <footer>
          <span>feito pela comunidade · MIT</span>
          <span>
            <a href="https://github.com/carloseorsantos/tugatobrasa" target="_blank" rel="noopener">
              github
            </a>
          </span>
        </footer>
      </body>
    </html>
  );
}
