import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('recipe_ingredients', function (table) {
    table.decimal('quantity_in_grams').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('recipe_ingredients', function (table) {
    table.dropColumn('quantity_in_grams');
  });
}