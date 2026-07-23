# Especificação — Página do tradutor (`/`)

Fonte visual: `context/prototipo-tradutor.html` (protótipo já aprovado, espelha `tugatobrasa-design-system`). Este documento mapeia os estados do protótipo para o **contrato real** da API (`POST /api/v1/translate`) e resolve as decisões de escopo desta fase.

## Estados

### `idle`
- Hero: "A mesma língua, *duas conversas*." + subtítulo.
- Toggle de direção 🇵🇹⇄🇧🇷 (`role="group"`, `aria-label="Direção da tradução"`), padrão `PT_TO_BR`.
- Input com placeholder que troca por direção: `PT_TO_BR` → "escreve uma palavra ou gíria"; `BR_TO_PT` → "digite uma palavra ou gíria" (code-switch de copy, já no protótipo).
- Sugestões de exemplo abaixo do input ("experimenta: fixe, bué, propina, rapariga") — **nesta fase, lista estática curada** (não vem da API); melhora futura: puxar termos populares do `translation_log`.
- Dica de teclado `Enter ↵` visível.

### `loading`
- Substitui a área de resultado por `ds-loading` (3 pontos animados) com `aria-busy="true"`, texto "a procurar no glossário" (`sr-only`: "— aguarde").
- Dispara no submit do form (`Enter` ou clique em "Traduzir").

### `success`
Mapeamento do `TranslateResponse` real (`translations[0]` é a acepção primária; `translations[1..]` são acepções adicionais, ex.: propina):

| Elemento visual | Campo da API |
|---|---|
| Headword (`.headword`) | `translations[0].target` |
| Badge de registro (`.ds-badge-pos`) | `translations[0].register` — **mostrar só se `GIRIA`/`CALAO`** (rótulo `gír.`/`calão`); `NEUTRO` fica sem badge (evita ruído em toda palavra comum — desvio deliberado do princípio "registro sempre visível" da skill de Design, registrado aqui) |
| `src-note` ("tradução de X · pt-PT → pt-BR") | `input` (echo do request) + direção |
| Lista de acepções (`.senses`), só se >1 `translations[]` | cada `translations[i]`: número + `target`; se o item tiver `alternatives`, junta como texto secundário |
| Exemplo (`.example`) | `translations[0].example` — **se `null`, omitir o bloco inteiro** (nem toda entrada tem exemplo, ao contrário do protótipo que sempre tem) |
| Alerta de falso amigo (`.ds-ff-alert`, `role="alert"`) | renderiza se **qualquer** `translations[i].falseFriend === true`; texto = `note` daquele item (não `warnings[]` bruto — `warnings` é a lista pronta pra exibir direto, pode usar `warnings[0]` como atalho quando só uma acepção) |
| Confiança ("glossário da comunidade · confiança alta") | `translations[0].confidence`: ≥0.95 → "confiança alta"; ≥0.8 → "confiança média"; abaixo → "sugestão aproximada" |
| Feedback (👍/👎 "está correta?") | **fora de escopo nesta fase** — `POST /feedback` não existe (Fase 5). Renderizar a UI visualmente (mantém o design coeso) mas **sem ação real**: botões desabilitados ou omitidos — decisão do Dev na implementação, não bloqueia o card |

### `not_found`
| Elemento visual | Campo da API |
|---|---|
| Palavra buscada (`.nf-word`) | `input` |
| Sugestões (`ds-chip`, clicáveis → repetem a busca) | `suggestions[]` — **se vazio, omitir a frase "Veja se ajuda: ..."**, manter só o convite de contribuição |
| Botão "Contribuir com este termo" (`.ds-contribute`) | `href = contributeUrl` **verbatim da resposta** (não reconstruir a URL no front — a API já monta com `termo=` pré-preenchido) |

### `error`
- Card com `role="alert"`, título "Não foi possível traduzir agora.", texto pedindo verificar conexão + link para abrir issue em `tugatobrasa` (não `tugatobrasa-api` — bug de UI é do front).
- Dispara em falha de rede ou 5xx do route handler proxy (card separado). Nunca mostrar stacktrace/detalhe técnico ao usuário.

## Toggle de direção

- Clique inverte `PT_TO_BR ⇄ BR_TO_PT`, anima rotação do ícone (`ds-icon-button.flip`), limpa resultado, foca o input, atualiza placeholder e sugestões.
- Rótulos: `PT_TO_BR` → "Portugal `pt-PT`" / "Brasil `pt-BR`"; invertido no outro sentido.

## Acessibilidade (herdada do protótipo, obrigatória na implementação)

- `#resultado` com `aria-live="polite"` — toda troca de estado é anunciada.
- Foco visível (`:focus-visible`) em todo elemento interativo, cor do token `--focus-ring`.
- Alvos de toque ≥ `--hit-min` (2.75rem) em botões de ícone e feedback.
- Fluxo completo por teclado: digitar → `Enter` → resultado, sem depender de mouse.
- Sem emojis na UI (bandeiras 🇵🇹🇧🇷 do toggle são exceção documentada no protótipo — comunicam país de forma universal, mantém).

## Responsivo

Breakpoints já definidos no protótipo: `480px` (ajusta paddings, tipografia, toggle vira full-width) e `340px` (esconde o rótulo `pt-PT`/`pt-BR` do toggle, mantém só "Portugal"/"Brasil"). Mobile-first — maioria do uso é durante conversa, no celular.

## UX copy exata

Extraída do protótipo, reutilizar literalmente (não parafrasear):
- Hero: "A mesma língua, **duas conversas**." / "Traduza palavras, gírias e expressões entre o português de Portugal e o do Brasil — com aviso quando uma palavra engana."
- Placeholder: ver tabela de `idle` acima.
- Not found: "Ainda não temos entrada para este termo. Veja se ajuda: {sugestões}." / "Conhece o significado? Este dicionário é escrito pela comunidade."
- Error: "Não foi possível traduzir agora." / "Verifique a ligação e tente novamente. Se persistir, reporte o problema."
- Footer: "feito pela comunidade · MIT"
