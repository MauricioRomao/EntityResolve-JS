# EntityResolve-JS

Motor de **resolução de entidades (Entity Resolution)** em Node.js para detectar e unificar registos de clientes duplicados em bases de dados bancárias — construído para resolver um problema real do sector bancário angolano, onde agências locais alimentam a base de dados central sem validação, gerando duplicidade massiva de clientes.

> Um cliente que abre conta na agência do Huambo e depois usa um caixa em Luanda pode facilmente virar "dois clientes diferentes" no BD central, por causa de um erro de digitação no BI, um nome escrito de forma diferente, ou um número de telefone desatualizado. Este projecto identifica esses casos automaticamente e propõe (ou aplica) a unificação.

---

## Problema

Bancos com estrutura descentralizada (agência → BD central) sofrem de duplicidade de clientes porque:

- Cada agência insere dados manualmente, sem validação cruzada com o BD central.
- Nomes angolanos têm variações ortográficas comuns (José/Jose, Manuel/Manoel).
- Números de BI são digitados incorretamente (erro humano, OCR falho).
- Telefones mudam de formato (com/sem +244, com/sem espaços).

Resultado: o mesmo cliente físico existe como 2, 3 ou mais registos "diferentes" no sistema — o que gera problemas de risco de crédito, KYC, relatórios regulatórios e experiência do cliente.

## Como o EntityResolve-JS resolve isto

Pipeline de resolução de entidades em tempo real, aplicado a cada novo registo assim que chega de uma agência:

```
Registo novo (agência)
        │
        ▼
 1. Normalização        → limpa nome, BI, telefone
        │
        ▼
 2. Blocking             → encontra candidatos prováveis via chave indexada (evita comparar com o BD inteiro)
        │
        ▼
 3. Matching             → calcula similaridade campo a campo (Jaro-Winkler, exato, etc.)
        │
        ▼
 4. Scoring              → soma pesos por campo → score final de 0 a 1
        │
        ▼
 5. Decisão
    score ≥ 0.90   → merge automático na entidade existente
    0.60–0.90      → vai para fila de revisão humana
    < 0.60         → cria nova entidade
        │
        ▼
 6. Golden Record        → entidade única e canónica do cliente
```

### Modelo de scoring (pesos por campo)

| Campo | Peso máximo | Lógica |
|---|---|---|
| BI normalizado (match exato) | 0.60 | Identificador mais forte disponível |
| BI com 1 caractere de diferença | 0.35 | Tolerante a erro de digitação |
| Nome (Jaro-Winkler) | 0.30 | Proporcional à similaridade textual |
| Telefone (match exato) | 0.25 | Peso menor — números mudam com frequência |

Cada decisão de match gera um relatório explicável (`explainability report`), essencial em contexto bancário onde toda unificação de clientes precisa ser auditável:

```json
{ "bi": 0.60, "nome": 0.24, "telefone": 0.25, "total": 0.87, "decisao": "pending_review" }
```

---

## Arquitetura técnica

- **API**: Fastify — recebe registos das agências via `POST /records`
- **Base de dados**: PostgreSQL + extensão `pg_trgm` (fuzzy search nativo, sem motor de busca externo)
- **Similaridade de strings**: Jaro-Winkler / Levenshtein (`natural` ou `string-similarity`)
- **Clustering de entidades**: Union-Find (Disjoint Set) implementado do zero, com path compression e union by rank
- **Validação de input**: `zod`
- **Testes**: Jest

### Schema (resumo)

- `raw_records` — todo registo bruto recebido das agências (nunca apagado, auditoria completa)
- `entities` — o "golden record": cliente único e canónico
- `review_queue` — casos de score intermédio, pendentes de decisão humana

---

## Estrutura do projecto

```
entityresolve-js/
├── src/
│   ├── routes/          # endpoints Fastify
│   ├── services/         # lógica de negócio (matching, scoring, blocking)
│   ├── repositories/     # acesso à base de dados
│   ├── lib/
│   │   ├── normalize.js  # normalização de nome/BI/telefone
│   │   ├── similarity.js # Jaro-Winkler, Levenshtein
│   │   └── unionFind.js  # estrutura de clustering
│   └── app.js
├── tests/
├── scripts/
│   └── generate-synthetic-data.js  # gera dataset de teste com duplicados propositais
├── docs/
│   └── architecture.md
└── README.md
```

---

## Roadmap / plano de estudo

Este projecto foi desenhado também como percurso de aprendizagem prática. Cada fase corresponde a um conceito de ciência da computação/engenharia de dados aplicado a um problema real:

- [ ] **Fase 1 — Normalização**: regex, Unicode normalization, testes de casos limite
- [ ] **Fase 2 — Blocking**: complexidade algorítmica (Big O), técnicas de blocking em record linkage
- [ ] **Fase 3 — Matching**: Levenshtein vs Jaro-Winkler, benchmark com nomes angolanos reais
- [ ] **Fase 4 — Scoring**: modelo Fellegi-Sunter, explainability report
- [ ] **Fase 5 — Clustering**: Union-Find (Disjoint Set) implementado do zero
- [ ] **Fase 6 — Base de dados**: índices GIN/GiST, `pg_trgm`, `EXPLAIN ANALYZE`
- [ ] **Fase 7 — API**: padrão Repository/Service, validação, testes de integração

---

## Como correr o projecto

```bash
# instalar dependências
npm install

# subir PostgreSQL local (ou usar um já existente)
createdb entityresolve

# correr migrações
npm run migrate

# gerar dataset sintético de teste
npm run generate-data

# iniciar servidor
npm run dev
```

## Testar um registo

```bash
curl -X POST http://localhost:3000/records \
  -H "Content-Type: application/json" \
  -d '{
    "agencia_id": "AG-LUANDA-004",
    "nome": "Jose Manuel da Silva",
    "bi": "003456789LA042",
    "telefone": "+244923456789"
  }'
```

---

## Status

🚧 Em desenvolvimento — construído em público como projecto de portfolio e estudo aplicado de Entity Resolution / record linkage.

## Autor

Mauro — desenvolvedor em Luanda, Angola.
