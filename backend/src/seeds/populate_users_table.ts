import { Knex } from 'knex';
import { createHash } from 'crypto';
import { salt } from '../salt';

export async function seed(knex: Knex): Promise<void> {
  // delete entries and reset id counter to 1
  await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  const seth = {
    user_name: 'SethBurns',
    email: 'seth@sethburns.com',
    salted_hashed_password: createHash('sha256', {encoding: 'utf-8'})
      .update(`mygoodpassword${salt}`)
      .digest('hex'),
  };
  console.log(seth);

  await knex('users').insert([
    {
      user_name: 'SethBurns',
      email: 'seth@sethburns.com',
      salted_hashed_password: createHash('sha256', {encoding: 'utf-8'})
        .update(`mygoodpassword${salt}`)
        .digest('hex'),
    },
    {
      user_name: 'TrevorScheer',
      email: 'trevor.scheer@gmail.com',
      salted_hashed_password: createHash('sha256', {encoding: 'utf-8'})
        .update(`lamepassword${salt}`)
        .digest('hex'),
    },
  ]);
}
