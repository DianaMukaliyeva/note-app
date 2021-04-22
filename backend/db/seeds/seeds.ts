import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('notes').del();

  // Inserts seed entries
  await knex('users').insert([
    { id: 1, username: 'user1', password: 'user1' },
    { id: 2, username: 'user2', password: 'user2' },
  ]);
  await knex('notes').insert([
    { authorId: 1, title: 'user1 note', content: 'some test' },
    { authorId: 2, title: 'user2 note', content: 'some test' },
  ]);
}
