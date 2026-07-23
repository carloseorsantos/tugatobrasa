# tugatobrasa 🇵🇹⇌🇧🇷

🔗 **[tugatobrasa.vercel.app](https://tugatobrasa.vercel.app)**

**A mesma língua, duas conversas.** Tradutor open source de palavras, gírias e expressões entre o português de Portugal (pt-PT) e o português do Brasil (pt-BR) — com aviso de **falsos amigos**: palavras que mudam de sentido (ou viram ofensa) ao cruzar o Atlântico.

> «propina» em Portugal é a mensalidade da universidade. No Brasil, é suborno. O TugaToBrasa te avisa antes de você passar vergonha.

## Como funciona

Tradução **100% determinística** — sem IA, sem API paga, sem mágica: um glossário curado pela comunidade + regras linguísticas (gerúndio ⇌ "estar a", próclise ⇌ ênclise). O que não está no glossário vira um convite para contribuir.

Este repositório é o **frontend** (Next.js). A tradução acontece na [tugatobrasa-api](https://github.com/carloseorsantos/tugatobrasa-api) (Java 21 + Spring Boot), onde também vive o glossário.

| Repo | Conteúdo |
|------|----------|
| [`tugatobrasa`](https://github.com/carloseorsantos/tugatobrasa) (este) | Frontend Next.js/TypeScript, design system |
| [`tugatobrasa-api`](https://github.com/carloseorsantos/tugatobrasa-api) | API Spring Boot, glossário CSV, regras, docs da API |

## Rodando localmente

```bash
# pré-requisito: a API rodando (ver README da tugatobrasa-api)
npm install
npm run dev        # http://localhost:3000
```

Configure a URL da API em `.env.local` (ver `.env.example`).

### Gerando os tipos da API

Os tipos de `TranslateRequest`/`TranslateResponse` (`lib/api-client.ts`) são gerados a partir do contrato **real** publicado pela API rodando localmente — nunca redeclare essas interfaces à mão.

```bash
# com a API rodando em localhost:8080 (docker compose up no repo tugatobrasa-api)
npm run generate-types
```

## Contribuindo

- **Conhece uma palavra ou gíria que falta?** Não precisa saber programar: [abra uma issue de novo termo](https://github.com/carloseorsantos/tugatobrasa-api/issues/new/choose) no repo da API.
- **Bug ou melhoria na interface?** Issues e PRs aqui mesmo.
- Guia completo no [CONTRIBUTING.md da API](https://github.com/carloseorsantos/tugatobrasa-api/blob/main/CONTRIBUTING.md).

## Roadmap

- [x] Protótipo navegável + design system
- [x] Fase 1 — Base da API + glossário inicial (~100 pares)
- [x] Fase 2 — `POST /translate` + fluxo de termo não encontrado
- [x] Fase 3 — Esta interface consumindo a API
- [ ] Fase 4 — Tradução de frases (regras) + CI do glossário
- [ ] Fase 5 — Página do glossário + feedback
- [x] Fase 6 — Deploy (front na Vercel, API no AWS Lightsail)

## Licença

Código sob [MIT](LICENSE). O glossário (no repo da API) é dado aberto sob **CC-BY-SA 4.0**.

---

feito pela comunidade · pt-PT ⇌ pt-BR
