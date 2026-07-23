# TugaToBrasa (frontend) — contexto do projeto

Frontend do TugaToBrasa: tradutor open source bidirecional pt-PT ⇌ pt-BR com alerta de falsos amigos. Next.js + TypeScript. A tradução acontece na [tugatobrasa-api](https://github.com/carloseorsantos/tugatobrasa-api) — **este repo nunca implementa regra de tradução** (nem "um replace simples"): isso duplicaria a fonte da verdade.

## Princípios

1. Simplicidade radical: um input e uma resposta; cada elemento a mais precisa se justificar.
2. **O falso amigo é a feature mais importante** — o alerta nunca passa despercebido.
3. Registro sempre visível (badge com cor E rótulo, nunca só cor).
4. NOT_FOUND é convite de contribuição, não erro.
5. UI bilíngue: copy adapta a variante de quem digita ("escreve" pt-PT / "digite" pt-BR). Sem emojis na UI.
6. Acessibilidade não é fase 2: AA, teclado completo, `aria-live` no resultado, alvos de toque ≥44px.

## Stack e arquitetura

- Next.js App Router + TypeScript. 2 páginas: `/` (tradutor) e `/glossario` (SSR).
- Server Components por padrão; `"use client"` só com interação. Sem lib de estado (fetch + React state).
- Chamadas à API via route handler (`/app/api/translate/route.ts`) fazendo proxy — sem CORS, URL do back oculta.
- Tipos gerados do `openapi.yml` da API (`openapi-typescript`) — nunca redeclarar interfaces à mão.
- Estados obrigatórios de toda tela: idle, loading, success, not_found, error.

## Design system

Fonte da verdade visual: pasta `tugatobrasa-design-system` (projeto Claude Design) — tokens (`--brasa-600`, `--paper-50`, escala `--text-*`), componentes React prontos (Card, Badge, SearchInput, DirectionToggle, TranslationResult, FalseFriendAlert…), keyframes `ds-rise`/`ds-pulse`. Fraunces (serif, voz do dicionário) + Inter (UI). Protótipo de referência: `prototipo-tradutor.html`.

## Testes

Testing Library para componentes com lógica; Playwright para E2E (fluxo completo, toggle de direção, NOT_FOUND, navegação por teclado). Não testar estilo.

## Convenções

Conventional Commits em inglês; branches `feat/...`/`fix/...`; PRs pequenos com screenshot quando há UI.

## Equipe e fluxo (skills em .claude/skills/)

Papéis: `tugatobrasa-design`, `tugatobrasa-dev-senior`, `tugatobrasa-qa`, `tugatobrasa-arquiteto`, `tugatobrasa-sm`, `tugatobrasa-fluxo` (ciclo: planning → refinamento → implementação → QA gate → encerramento). Peça "roda o fluxo" para executar um ciclo.

## Links

- Kanban (fonte da verdade do trabalho): https://app.notion.com/p/TugaToBrasa-3a5d2ee1c20d806a8e21c0d87f34f1f7
- API: https://github.com/carloseorsantos/tugatobrasa-api
- Roadmap: Fase 1 (base API + glossário) → 2 (/translate) → 3 (este front) → 4 (regras + CI) → 5 (glossário UI + feedback)

## Licença

MIT.
