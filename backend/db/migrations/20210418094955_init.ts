import { Knex } from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema
    .createTable('users', (table: Knex.TableBuilder) => {
      table.increments('id').primary();
      table.string('username');
      table.string('password');
    })
    .createTable('notes', (table: Knex.TableBuilder) => {
      table.increments('id').primary();
      table.integer('author_id').notNullable().references('id').inTable('users');
      table.string('title');
      table.string('content');
    });
}
export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('notes').dropTableIfExists('users');
}
