import knex from 'knex';
import config from './knexfile';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const pg = knex(config.development);

const app = express();
const port = 3000;

interface Ingredient {
  id: number;
  name: string;
  protein_in_grams: string;
  carbs_in_grams: string;
  fat_in_grams: string;
  mass_in_grams: string;
  fiber_in_grams: string;
  calories: string;
  img_url: string;
}

// improve this type later
type RecipeWithIngredient = Recipe & Ingredient & {
  recipe_id: number;
  ingredient_id: number;
}

interface Recipe {
  id: number;
  name: string;
  instructions: Record<string, any>;
}

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/ingredients', async (req, res) => {
  res.json(await pg<Ingredient>('ingredients'));
});

app.get('/ingredients/:id', async (req, res) => {
  res.json(
    await pg<Ingredient>('ingredients').where('id', req.params.id).first()
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post('/ingredients', async (req, res) => {
  const insertResult = await pg<Ingredient>('ingredients').insert(req.body, [
    'id',
  ]);
  res.status(201).json(insertResult[0]);
});

app.delete('/ingredients/:id', async (req, res) => {
  await pg<Ingredient>('ingredients').where('id', req.params.id).del();
  res.status(204).send();
});

app.patch('/ingredients/:id', async (req, res) => {
  // Fix this when you update the table you idiots.
  const patchResponse = await pg<Ingredient>('ingredients')
    .where({ id: parseInt(req.params.id) })
    .update(req.body as Partial<Ingredient>, [
      'id',
      'name',
      'protein_in_grams',
      'carbs_in_grams',
      'fat_in_grams',
      'mass_in_grams',
    ]);
  res.status(200).json(patchResponse[0]);
});

app.get('/recipes/:id', async (req, res) => {
  // TODO: Fix the types here, this shouldn't be any []
  const recipeWithIngredients = await pg<RecipeWithIngredient>('recipes')
    .where('recipes.id', req.params.id)
    .join(
      'recipe_ingredients',
      'recipes.id',
      'recipe_ingredients.recipe_id'
    )
    .join('ingredients', 'recipe_ingredients.ingredient_id', 'ingredients.id')
    recipeWithIngredients.reduce((acc, curr) => {
      acc = {
        recipe_id: curr.recipe_id,
        name: curr.recipeName,
        instructions: curr.instructions,
        ingredients: [],
      }
      acc.ingredients.push()
      return acc
    }, {})
});

app.post('/recipes', async (req, res) => {
  const insertResult = await pg<Recipe>('recipes').insert(req.body, ['id']);
  res.status(201).json(insertResult[0]);
});
