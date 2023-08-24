import { Knex } from 'knex';

export async function up(knex: Knex) {
  const recipeTablePromise = knex.schema.createTable(
    'recipes',
    function (table) {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.json('instructions').notNullable();
    }
  );
  const recipeIngredientsJoinTable = knex.schema.createTable(
    'recipe_ingredients',
    function (table) {
      table.integer('recipe_id').notNullable();
      table.integer('ingredient_id').notNullable();
      table.primary(['recipe_id', 'ingredient_id']);
      table.foreign('recipe_id').references('id').inTable('recipes');
      table.foreign('ingredient_id').references('id').inTable('ingredients');
    }
  );
  return Promise.all([recipeTablePromise, recipeIngredientsJoinTable]);
}

export async function down(knex: Knex) {
  return Promise.all([
    knex.schema.dropTable('recipes'),
    knex.schema.dropTable('recipe_ingredients'),
  ]);
}
