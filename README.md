# Barreiro Digest

Notícias diárias do Barreiro, automaticamente publicadas.

## Sobre

Um digest diário de notícias relevantes para o Barreiro, incluindo:
- Portal institucional da Câmara Municipal do Barreiro
- Google News RSS para notícias locais
- Contratos públicos e obras municipais

## Stack

- **Framework**: Astro (geração estática)
- **Estilo**: Tailwind CSS com tema escuro inspirado no Hermes
- **Deploy**: Vercel (auto-deploy no push)
- **Conteúdo**: Markdown com frontmatter YAML

## Estrutura

```
src/
├── content/digests/    # Digests diários em Markdown
├── layouts/            # Layout base
├── pages/              # Páginas (index + individual)
└── styles/             # CSS global com Tailwind
```

## Desenvolvimento

```bash
npm install
npm run dev
```

## Deploy

Push para o branch `main` → Vercel faz auto-deploy.
