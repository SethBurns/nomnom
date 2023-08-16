import knex from 'knex';
import config from './knexfile';

const pg = knex(config.development);

const result = pg('ingredients')
  .first()
  .then((res) => console.log(res));
