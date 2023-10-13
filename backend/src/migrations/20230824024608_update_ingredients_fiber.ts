import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', function (table) {
    table.dropColumn('fiber');
    table.decimal('fiber_in_grams').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', function (table) {
    table.dropColumn('fiber_in_grams');
    table.decimal('fiber').nullable();
  });
}