import TranslatorForm from "./TranslatorForm";

export default function Home() {
  return (
    <div className="page">
      <header>
        <div className="ds-wordmark">
          tuga<em>to</em>brasa
        </div>
        <a
          className="ds-chip-link"
          href="https://github.com/carloseorsantos/tugatobrasa"
          target="_blank"
          rel="noopener"
        >
          código aberto ↗
        </a>
      </header>

      <div className="hero">
        <h1>
          A mesma língua, <em>duas conversas</em>.
        </h1>
        <p>
          Traduza palavras, gírias e expressões entre o português de Portugal e o do Brasil — com
          aviso quando uma palavra engana.
        </p>
      </div>

      <TranslatorForm />
    </div>
  );
}
