# Há Caracóis 🐌

Mapa colaborativo de sítios onde se comem **caracóis**. Descobre locais perto de ti,
adiciona os teus e partilha-os.

## Funcionalidades

- **Mapa** (OpenStreetMap + Leaflet) com todos os locais; centra-se na tua localização ao abrir.
- Carregar num ponto abre um **cartão** com avaliação, dose, preço e notas, com link para a página do local.
- **Página de cada local** com partilha (WhatsApp, Telegram, email, copiar link) e pré-visualização (Open Graph).
- **Assistente de adição** passo-a-passo: procura o estabelecimento por nome (Nominatim/OpenStreetMap)
  ou marca o ponto no mapa → preço → dose (pires/prato/travessa) → avaliação 0–5 → notas.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Leaflet](https://leafletjs.com) / react-leaflet com tiles do OpenStreetMap
- [Supabase](https://supabase.com) (Postgres) — tabela `caracois_spots`, leitura/escrita públicas via RLS
- Pesquisa de locais via [Nominatim](https://nominatim.org) (OpenStreetMap)
- Deploy na [Vercel](https://vercel.com)

## Desenvolvimento

```bash
npm install
cp .env.example .env.local   # preenche os valores
npm run dev
```

### Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave publishable/anon (segura no browser) |
| `NEXT_PUBLIC_SITE_URL` | URL canónico do site (links de partilha / Open Graph) |

## Base de dados

Tabela `caracois_spots` (com Row Level Security: leitura e inserção públicas; sem update/delete anónimos):

| coluna | tipo |
| --- | --- |
| `id` | uuid (PK) |
| `name` | text |
| `lat`, `lng` | double precision |
| `address` | text |
| `price` | numeric |
| `serving_size` | `pires` \| `prato` \| `travessa` |
| `rating` | int 0–5 |
| `notes` | text |
| `osm_id` | text |
| `created_at` | timestamptz |
