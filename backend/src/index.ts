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
// type RecipeWithIngredient = Recipe &
//   Ingredient & {
//     ingredient_name: string;
//     recipe_name: string;
//     recipe_id: number;
//     ingredient_id: number;
//   };

// interface Recipe {
//   id: number;
//   name: string;
//   instructions: string[];
// }


type RecipeWithIngredient = any;
type Recipe = any;

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
  // alias recipes name column as recipe_name
  const recipeWithIngredients = (await pg<RecipeWithIngredient>('recipes')
    .select(
      '*',
      'recipes.name as recipe_name',
      'ingredients.name as ingredient_name'
    )
    .where('recipes.id', req.params.id)
    .join('recipe_ingredients', 'recipes.id', 'recipe_ingredients.recipe_id')
    .join(
      'ingredients',
      'recipe_ingredients.ingredient_id',
      'ingredients.id'
    )) as RecipeWithIngredient[];
  const recipe = recipeWithIngredients.reduce((acc, curr) => {
    acc.ingredients = acc.ingredients || [];
    acc.ingredients.push({
      id: curr.ingredient_id,
      name: curr.name,
      calories: curr.calories,
      carbs_in_grams: curr.carbs_in_grams,
      fat_in_grams: curr.fat_in_grams,
      fiber_in_grams: curr.fiber_in_grams,
      protein_in_grams: curr.protein_in_grams,
      mass_in_grams: curr.mass_in_grams,
      img_url: curr.img_url,
    });

    return {
      ...acc,
      recipe_id: curr.recipe_id,
      name: curr.recipe_name,
      instructions: curr.instructions,
    };
  }, {} as { recipe_id: number; name: string; instructions: string[]; ingredients: Ingredient[] });
  res.json(recipe);
});

app.get('/recipes', async (req, res) => {
  const recipes = await pg<Recipe>('recipes');
  res.json(recipes);
});

//     return {...acc, recipe_id: curr.recipe_id, name: 'string', instructions: curr.instructions};
//   },
//   {} as { recipe_id: number; name: string; instructions: string[]; ingredients: Ingredient[] });
//   res.json(recipe);
// });

app.post('/recipes', async (req, res) => {
  const body: {
    name: string,
    instructions: string[],
    ingredients: {id: number, quantity: number}[]
  } = req.body;
  console.log('body', body)
  const result = await pg.transaction((trx) => {
    return trx<any>('recipes')
      .insert({name: body.name, instructions: JSON.stringify(body.instructions)}, ['id'])
      .then((insertResult) => {
        console.log('insertResult', insertResult)
        const recipeIngredients = body.ingredients.map((ingredient) => ({
          recipe_id: insertResult[0].id,
          ingredient_id: ingredient.id,
          quantity_in_grams: ingredient.quantity,
        }));
        return trx('recipe_ingredients').insert(recipeIngredients);
      });
  })
  console.log('result', result)
  // const insertResult = await pg<Recipe>('recipes').insert(req.body, ['id']);
  res.status(201);
});
