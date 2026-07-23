"use client";

import { useState } from "react";

type Direction = "PT_TO_BR" | "BR_TO_PT";

const COPY: Record<Direction, { placeholder: string; tryLabel: string; from: string; to: string }> = {
  PT_TO_BR: { placeholder: "escreve uma palavra ou gíria", tryLabel: "experimenta", from: "Portugal", to: "Brasil" },
  BR_TO_PT: { placeholder: "digite uma palavra ou gíria", tryLabel: "experimente", from: "Brasil", to: "Portugal" },
};

// lista estática curada nesta fase — ver docs/design/pagina-tradutor.md (estado idle)
const SUGGESTIONS: Record<Direction, string[]> = {
  PT_TO_BR: ["fixe", "bué", "propina", "rapariga"],
  BR_TO_PT: ["legal", "ônibus", "terno", "propina"],
};

export default function TranslatorForm() {
  const [direction, setDirection] = useState<Direction>("PT_TO_BR");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const copy = COPY[direction];

  function toggleDirection() {
    setDirection((d) => (d === "PT_TO_BR" ? "BR_TO_PT" : "PT_TO_BR"));
    setQuery("");
  }

  async function translate(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setIsLoading(true);
    // TODO(route handler proxy + card de resultado): troca por fetch real e renderiza
    // success/not_found/error — por ora só demonstra o estado de loading funcionando.
    await new Promise((resolve) => setTimeout(resolve, 650));
    setIsLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    translate(query);
  }

  return (
    <>
      <div className="ds-direction" role="group" aria-label="Direção da tradução">
        <span className="dir">
          {copy.from}
          <small>{direction === "PT_TO_BR" ? "pt-PT" : "pt-BR"}</small>
        </span>
        <button
          type="button"
          className="ds-icon-button"
          onClick={toggleDirection}
          aria-label="Inverter direção da tradução"
          title="Inverter direção"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 5h11M10 2l3 3-3 3M14 11H3M6 8l-3 3 3 3" />
          </svg>
        </button>
        <span className="dir">
          {copy.to}
          <small>{direction === "PT_TO_BR" ? "pt-BR" : "pt-PT"}</small>
        </span>
      </div>

      <form className="ds-search" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={copy.placeholder}
          aria-label="Palavra ou frase para traduzir"
          autoComplete="off"
          spellCheck={false}
          autoFocus
        />
        <button className="ds-button" type="submit" disabled={isLoading}>
          Traduzir
        </button>
      </form>
      <div className="under">
        <span className="idle">
          {copy.tryLabel}:{" "}
          {SUGGESTIONS[direction].map((word, i) => (
            <span key={word}>
              {i > 0 && ", "}
              <button type="button" className="ds-chip" onClick={() => translate(word)}>
                {word}
              </button>
            </span>
          ))}
        </span>
        <span className="kbd-hint">
          <kbd>Enter ↵</kbd>
        </span>
      </div>

      <div id="resultado" aria-live="polite">
        {isLoading && (
          <div className="ds-loading" aria-busy="true">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            a procurar no glossário<span className="sr-only"> — aguarde</span>
          </div>
        )}
      </div>
    </>
  );
}
