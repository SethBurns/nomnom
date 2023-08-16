import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ingredients', function (table) {
    table.increments('id');
    table.string('name', 255).notNullable();
    table.string('unit', 255).notNullable();
    table.string('protein', 255).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('ingredients');
}
