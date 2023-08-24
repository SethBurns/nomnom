import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', function (table) {
    table.decimal('fiber').nullable();
    table.integer('calories').nullable();
    table.text('img_url').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', function (table) {
    table.dropColumn('fiber');
    table.dropColumn('calories');
    table.dropColumn('img_url');
  });
}
