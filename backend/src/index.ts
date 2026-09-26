import express from 'express';
import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

const app = express();
app.use(express.json({ limit: '1mb' }));
const file = process.env.NOMNOM_DB_PATH || path.resolve(__dirname, '../data/nomnom.sqlite');
fs.mkdirSync(path.dirname(file), { recursive: true });
const db = new DatabaseSync(file);
db.exec(`
 PRAGMA foreign_keys = ON;
 PRAGMA journal_mode = WAL;
 CREATE TABLE IF NOT EXISTS ingredients (
   id INTEGER PRIMARY KEY, name TEXT NOT NULL, mass_in_grams REAL NOT NULL CHECK(mass_in_grams > 0),
   calories REAL, protein_in_grams REAL, carbs_in_grams REAL, fat_in_grams REAL, fiber_in_grams REAL,
   img_url TEXT, micros TEXT NOT NULL DEFAULT '{}', fdc_id INTEGER UNIQUE);
 CREATE TABLE IF NOT EXISTS recipes (
   id INTEGER PRIMARY KEY, name TEXT NOT NULL, servings REAL NOT NULL CHECK(servings > 0),
   instructions TEXT NOT NULL DEFAULT '[]');
 CREATE TABLE IF NOT EXISTS recipe_ingredients (
   recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
   ingredient_id INTEGER NOT NULL REFERENCES ingredients(id),
   quantity_in_grams REAL NOT NULL CHECK(quantity_in_grams > 0),
   PRIMARY KEY(recipe_id, ingredient_id));
 CREATE TABLE IF NOT EXISTS food_log (
   id INTEGER PRIMARY KEY, eaten_on TEXT NOT NULL, meal TEXT NOT NULL,
   ingredient_id INTEGER REFERENCES ingredients(id), recipe_id INTEGER REFERENCES recipes(id),
   quantity REAL NOT NULL CHECK(quantity > 0),
   CHECK((ingredient_id IS NULL) != (recipe_id IS NULL)));
 CREATE INDEX IF NOT EXISTS food_log_date ON food_log(eaten_on);
`);

const macros = ['calories', 'protein_in_grams', 'carbs_in_grams', 'fat_in_grams', 'fiber_in_grams'] as const;
const micros = ['vitamin_a_mcg', 'vitamin_c_mg', 'vitamin_d_mcg', 'vitamin_b12_mcg', 'folate_mcg',
  'calcium_mg', 'iron_mg', 'magnesium_mg', 'potassium_mg', 'sodium_mg', 'zinc_mg'] as const;
const keys = [...macros, ...micros];
type Nutrients = Record<string, number | null>;
type Food = { id: number; name: string; mass_in_grams: number; img_url: string | null; micros: string } &
  Partial<Record<typeof macros[number], number | null>>;
type RecipeRow = { id: number; name: string; servings: number; instructions: string };
type RecipeIngredient = Food & { quantity_in_grams: number };
const num = (value: unknown) => {
  if (value === '' || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};
const bad = (res: express.Response, message: string, status = 400) => res.status(status).json({ error: message });
const foods = () => db.prepare('SELECT * FROM ingredients ORDER BY name COLLATE NOCASE').all() as Food[];
function nutrients(food: Food, grams: number): Nutrients {
  const extra = JSON.parse(food.micros || '{}') as Nutrients;
  return Object.fromEntries(keys.map(key => {
    const value = macros.includes(key as typeof macros[number]) ? food[key as typeof macros[number]] : extra[key];
    return [key, value == null ? null : Number(value) * grams / food.mass_in_grams];
  }));
}
function sum(parts: Nutrients[]): Nutrients {
  return Object.fromEntries(keys.map(key => {
    const known = parts.map(part => part[key]).filter((v): v is number => v != null);
    return [key, known.length ? known.reduce((a, b) => a + b, 0) : null];
  }));
}
const scale = (values: Nutrients, factor: number): Nutrients =>
  Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value == null ? null : value * factor]));
function recipes() {
  const rows = db.prepare('SELECT * FROM recipes ORDER BY name COLLATE NOCASE').all() as RecipeRow[];
  const select = db.prepare(`SELECT i.*, ri.quantity_in_grams FROM recipe_ingredients ri
    JOIN ingredients i ON i.id = ri.ingredient_id WHERE ri.recipe_id = ?`);
  return rows.map(recipe => {
    const ingredients = select.all(recipe.id) as RecipeIngredient[];
    return { ...recipe, instructions: JSON.parse(recipe.instructions) as string[], ingredients,
      nutrients_per_serving: scale(sum(ingredients.map(i => nutrients(i, i.quantity_in_grams))), 1 / recipe.servings) };
  });
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/ingredients', (_req, res) => res.json(foods()));
const usdaKey = process.env.FDC_API_KEY || 'DEMO_KEY';
const usdaUrl = 'https://api.nal.usda.gov/fdc/v1';
async function usda(endpoint: string) {
  const response = await fetch(`${usdaUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${encodeURIComponent(usdaKey)}`,
    { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(response.status === 429 ? 'USDA search limit reached. Try later or set your own FDC_API_KEY.' : 'USDA food search is unavailable.');
  return response.json();
}
app.get('/api/usda/search', async (req, res) => {
  const query = String(req.query.q || '').trim();
  if (query.length < 2 || query.length > 100) return bad(res, 'Enter at least two characters.');
  try {
    const data = await usda('/foods/search?query=' + encodeURIComponent(query) + '&pageSize=15') as
      { foods?: { fdcId: number; description: string; dataType: string; brandOwner?: string }[] };
    res.json((data.foods || []).map(food => ({
      id: food.fdcId, name: food.description, type: food.dataType, brand: food.brandOwner || null,
    })));
  } catch (error) { bad(res, (error as Error).message, 502); }
});
app.post('/api/usda/import', async (req, res) => {
  const id = Number(req.body?.id);
  if (!Number.isInteger(id) || id <= 0) return bad(res, 'Choose a USDA food.');
  const existing = db.prepare('SELECT * FROM ingredients WHERE fdc_id = ?').get(id);
  if (existing) return res.json(existing);
  try {
    const data = await usda('/food/' + id) as {
      description: string; brandOwner?: string; foodNutrients?: {
        nutrient?: { id: number; unitName: string }; nutrientId?: number; amount?: number; value?: number;
      }[];
    };
    if (!data.description || !Array.isArray(data.foodNutrients)) return bad(res, 'USDA returned incomplete food data.', 502);
    const nutrientIds: Record<string, number[]> = {
      calories: [1008, 2047, 2048], protein_in_grams: [1003], carbs_in_grams: [1005],
      fat_in_grams: [1004], fiber_in_grams: [1079], vitamin_a_mcg: [1106],
      vitamin_c_mg: [1162], vitamin_d_mcg: [1114], vitamin_b12_mcg: [1178],
      folate_mcg: [1177], calcium_mg: [1087], iron_mg: [1089], magnesium_mg: [1090],
      potassium_mg: [1092], sodium_mg: [1093], zinc_mg: [1095],
    };
    const values: Nutrients = {};
    for (const key of keys) {
      const match = nutrientIds[key].map(id => data.foodNutrients!.find(n => (n.nutrient?.id || n.nutrientId) === id &&
        (n.amount ?? n.value) != null)).find(Boolean);
      values[key] = match ? Number(match.amount ?? match.value) : null;
    }
    const name = (data.brandOwner ? data.brandOwner + ' — ' : '') + data.description;
    const result = db.prepare(`INSERT INTO ingredients (name, mass_in_grams, calories,
      protein_in_grams, carbs_in_grams, fat_in_grams, fiber_in_grams, micros, fdc_id)
      VALUES (?, 100, ?, ?, ?, ?, ?, ?, ?)`).run(name,
        ...macros.map(key => values[key]), JSON.stringify(Object.fromEntries(micros.map(key => [key, values[key]]))), id);
    res.status(201).json(db.prepare('SELECT * FROM ingredients WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) { bad(res, (error as Error).message, 502); }
});
app.post('/api/ingredients', (req, res) => {
  const { name, mass_in_grams, img_url, micros: extra = {} } = req.body || {};
  const mass = num(mass_in_grams);
  if (typeof name !== 'string' || !name.trim() || !mass || !extra || typeof extra !== 'object' || Array.isArray(extra))
    return bad(res, 'Enter a name and a positive reference weight.');
  const values: Record<string, number | null> = {};
  for (const key of keys) {
    const raw = macros.includes(key as typeof macros[number]) ? req.body[key] : extra[key];
    if (raw != null && raw !== '' && num(raw) === null) return bad(res, key + ' must be nonnegative.');
    values[key] = num(raw);
  }
  const result = db.prepare(`INSERT INTO ingredients (name, mass_in_grams, img_url, calories,
    protein_in_grams, carbs_in_grams, fat_in_grams, fiber_in_grams, micros)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(name.trim(), mass,
      typeof img_url === 'string' ? img_url.trim() : null,
      ...macros.map(key => values[key]), JSON.stringify(Object.fromEntries(micros.map(key => [key, values[key]]))));
  res.status(201).json(db.prepare('SELECT * FROM ingredients WHERE id = ?').get(result.lastInsertRowid));
});
app.get('/api/recipes', (_req, res) => res.json(recipes()));
app.post('/api/recipes', (req, res) => {
  const { name, servings, instructions, ingredients } = req.body || {};
  const count = num(servings);
  if (typeof name !== 'string' || !name.trim() || !count || !Array.isArray(ingredients) || !ingredients.length ||
      !Array.isArray(instructions) || instructions.some(i => typeof i !== 'string') ||
      ingredients.some(i => !Number.isInteger(i.id) || !num(i.quantity_in_grams) ||
        !db.prepare('SELECT id FROM ingredients WHERE id = ?').get(i.id)) ||
      new Set(ingredients.map(i => i.id)).size !== ingredients.length)
    return bad(res, 'Enter a name, servings, and valid ingredient weights.');
  db.exec('BEGIN');
  try {
    const result = db.prepare('INSERT INTO recipes (name, servings, instructions) VALUES (?, ?, ?)')
      .run(name.trim(), count, JSON.stringify(instructions.map((i: string) => i.trim()).filter(Boolean)));
    const insert = db.prepare('INSERT INTO recipe_ingredients VALUES (?, ?, ?)');
    for (const i of ingredients) insert.run(result.lastInsertRowid, i.id, i.quantity_in_grams);
    db.exec('COMMIT');
    res.status(201).json(recipes().find(r => r.id === Number(result.lastInsertRowid)));
  } catch {
    db.exec('ROLLBACK');
    bad(res, 'Could not save the recipe.');
  }
});
app.get('/api/log', (req, res) => {
  const date = String(req.query.date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return bad(res, 'Use YYYY-MM-DD for the date.');
  const allFoods = new Map(foods().map(food => [food.id, food]));
  const allRecipes = new Map(recipes().map(recipe => [recipe.id, recipe]));
  const rows = db.prepare('SELECT * FROM food_log WHERE eaten_on = ? ORDER BY id DESC').all(date) as
    { id: number; eaten_on: string; meal: string; ingredient_id: number | null; recipe_id: number | null; quantity: number }[];
  const entries = rows.map(row => {
    const food = row.ingredient_id ? allFoods.get(row.ingredient_id) : null;
    const recipe = row.recipe_id ? allRecipes.get(row.recipe_id) : null;
    return { ...row, name: food?.name || recipe?.name || 'Unknown item', unit: food ? 'g' : 'servings',
      nutrients: food ? nutrients(food, row.quantity) : scale(recipe?.nutrients_per_serving || {}, row.quantity) };
  });
  res.json({ date, entries, totals: sum(entries.map(entry => entry.nutrients)) });
});
app.post('/api/log', (req, res) => {
  const { date, meal, ingredient_id, recipe_id, quantity } = req.body || {};
  const amount = num(quantity);
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !['Breakfast', 'Lunch', 'Dinner', 'Snack'].includes(meal) || !amount ||
      Boolean(ingredient_id) === Boolean(recipe_id)) return bad(res, 'Enter a date, meal, item, and positive portion.');
  const table = ingredient_id ? 'ingredients' : 'recipes';
  const id = ingredient_id || recipe_id;
  if (!Number.isInteger(id) || !db.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(id))
    return bad(res, 'That item does not exist.');
  const result = db.prepare('INSERT INTO food_log (eaten_on, meal, ingredient_id, recipe_id, quantity) VALUES (?, ?, ?, ?, ?)')
    .run(date, meal, ingredient_id || null, recipe_id || null, amount);
  res.status(201).json({ id: Number(result.lastInsertRowid) });
});
app.delete('/api/log/:id', (req, res) => {
  const result = db.prepare('DELETE FROM food_log WHERE id = ?').run(req.params.id);
  if (!result.changes) return bad(res, 'Entry not found.', 404);
  res.status(204).send();
});

const frontend = path.resolve(__dirname, '../../frontend/build');
if (fs.existsSync(frontend)) {
  app.use(express.static(frontend));
  app.get('*', (_req, res) => res.sendFile(path.join(frontend, 'index.html')));
}
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
app.listen(port, host, () => console.log(`NomNom running at http://${host}:${port}`));
