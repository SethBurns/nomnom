import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', function (table) {
    table.decimal('protein_in_grams').nullable();
    table.dropColumn('protein');
    table.decimal('carbs_in_grams').nullable();
    table.decimal('fat_in_grams').nullable();
    table.dropColumn('unit');
    table.decimal('mass_in_grams').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', function (table) {
    table.string('protein', 255).alter();
    table.dropColumn('carbs');
    table.dropColumn('fat');
    table.string('unit', 255).notNullable();
    table.dropColumn('mass_in_grams');
  });
}
