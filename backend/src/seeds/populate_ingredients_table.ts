import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // delete entries and reset id counter to 1
  await knex.raw('TRUNCATE TABLE ingredients RESTART IDENTITY CASCADE');
  await knex.raw('TRUNCATE TABLE recipes RESTART IDENTITY CASCADE');
  await knex('recipe_ingredients').del();

  // Inserts seed entries
  await knex('ingredients').insert([
    {
      name: 'Celery',
      protein_in_grams: 0.7,
      carbs_in_grams: 3.4,
      fat_in_grams: 0.2,
      mass_in_grams: 100,
      fiber_in_grams: 1.6,
      calories: 14,
      serving_label: '1 Stalk',
      serving_mass_in_grams: 25,
      volume_label: null,
      volume_mass_in_grams: null,
      img_url:
        'https://images.immediate.co.uk/production/volatile/sites/30/2020/02/Celery-stalks-and-leaves-7860193.jpg?quality=90&resize=556,505',
    },
    {
      name: 'Yellow Onion',
      protein_in_grams: 0.9,
      carbs_in_grams: 10.1,
      fat_in_grams: 1.4,
      mass_in_grams: 100,
      fiber_in_grams: 1.4,
      calories: 42,
      serving_label: null,
      serving_mass_in_grams: null,
      volume_label: 'ml',
      volume_mass_in_grams: 1,
      img_url:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Onion_on_White.JPG/1200px-Onion_on_White.JPG',
    },
    {
      name: 'Green Pepper',
      protein_in_grams: 0.9,
      carbs_in_grams: 4.6,
      fat_in_grams: 0.2,
      mass_in_grams: 100,
      fiber_in_grams: 1.7,
      calories: 20,
      serving_label: '1 Pepper',
      serving_mass_in_grams: 50,
      volume_label: 'Cup',
      volume_mass_in_grams: 45,
      img_url:
        'https://hips.hearstapps.com/goodhousekeeping-uk/main/embedded/36870/green-peppers.jpg',
    },
    {
      name: 'Carrot',
      protein_in_grams: 0.9,
      carbs_in_grams: 9.6,
      fat_in_grams: 0.2,
      mass_in_grams: 100,
      fiber_in_grams: 2.8,
      calories: 41,
      serving_label: '1 Carrot',
      serving_mass_in_grams: 55,
      volume_label: 'Cup',
      volume_mass_in_grams: 65,
      img_url:
        'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Fycm90fGVufDB8fDB8fHww&w=1000&q=80',
    },
  ]);
  // Inserts seed entries
  await knex('recipes').insert([
    {
      name: 'Stone Soup',
      instructions: JSON.stringify(['Add stone', 'Add water', 'Boil']),
    },
  ]);

  await knex('recipe_ingredients').insert([
    { recipe_id: 1, ingredient_id: 1, unit: 'Serving', unit_quantity: 2 },
    { recipe_id: 1, ingredient_id: 2, unit: 'Cup', unit_quantity: 1 },
    { recipe_id: 1, ingredient_id: 3, unit: 'Serving', unit_quantity: 1 },
    { recipe_id: 1, ingredient_id: 4, unit: 'Tablespoon', unit_quantity: 6 },
  ]);
}
