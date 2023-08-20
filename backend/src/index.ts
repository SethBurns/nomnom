import knex from 'knex';
import config from './knexfile';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'

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
}

app.use(bodyParser.json());
app.use(cors());
app.use(express.json())


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
    .update(req.body as Partial<Ingredient>, ['id', 'name', 'protein_in_grams', 'carbs_in_grams', 'fat_in_grams', 'mass_in_grams']);
  res.status(200).json(patchResponse[0]);
});
