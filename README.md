# NomNom

A personal food journal for tracking portions, recipes, macronutrients, and the vitamins and minerals you have data for.

## Run locally

Requires Node.js 24 or newer. From the repository root:

```sh
npm ci --prefix backend
npm ci --prefix frontend
npm run build
npm start
```

Open http://localhost:3000. The same server serves the app and API, bound to your computer by default. It creates a durable SQLite database at `backend/data/nomnom.sqlite` automatically. Back up that file to keep your journal. Set `NOMNOM_DB_PATH` to an absolute path on persistent storage if you run the server elsewhere, `PORT` to change its port, and `HOST` to change its bind address.

For development, run `npm run dev:api` and `npm run dev:web` in separate terminals. The web dev server uses port 3001 and proxies API calls to port 3000.

## How the journal works

1. Search USDA FoodData Central and save a matching food, or enter a food from a nutrition label. Manual nutrient amounts are for the reference weight in grams. Leave unknown nutrients blank.
2. Optionally combine saved foods into recipes. Enter the whole recipe's ingredient weights and its number of servings.
3. On the daily diary, log a food in grams or a recipe by servings. Use the date control to review another day. Remove an entry if you made a mistake.

Daily totals sum known values. A dash means no logged food has data for that nutrient; a displayed number is only as complete as the food data you enter. Recipe values are calculated from ingredient weights and divided by the number of servings. Existing entries reference your saved foods and recipes, so edits to that data in a future version would update historical totals.

For hosting, the `render.yaml` Blueprint provisions a paid web service with a persistent disk. Set `NOMNOM_PASSWORD` privately during Blueprint setup; `SESSION_SECRET` is generated automatically. All journal API routes require a password when configured. The server refuses network access without both secrets. Back up the SQLite file periodically; disk snapshots alone are not a database backup strategy. The previous PostgreSQL migration and seed files remain in `backend/src` as reference; the new app starts with an empty SQLite library and does not automatically import an old PostgreSQL database.

USDA search uses the limited public `DEMO_KEY` by default. For regular use, [get a free FoodData Central API key](https://fdc.nal.usda.gov/api-key-signup/) and set `FDC_API_KEY` on the server. Imported foods are saved locally, so logging them later does not require another USDA request. USDA FoodData Central data is public domain; specific branded foods may have limited micronutrient data.
