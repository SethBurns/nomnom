import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', function (table) {
   table.string('serving_label').nullable();
   table.decimal('serving_mass_in_grams').nullable();
   table.string('volume_label').nullable();
   table.decimal('volume_mass_in_grams').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', function (table) {
    table.dropColumn('serving_label');
    table.dropColumn('serving_mass_in_grams');
    table.dropColumn('volume_label');
    table.dropColumn('volume_mass_in_grams');
  });
}
