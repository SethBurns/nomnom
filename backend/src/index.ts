console.log('Hello World!!')
import knex from 'knex'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('..', '.env') })
const pg = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: process.env.PG_USER,
    database: 'nomnom',
    password: process.env.PG_PASSWORD,
    // ssl: config["DB_SSL"] ? { rejectUnauthorized: false } : false,
  }
});

const result = pg('ingredients')
  .first()
  .then(res => console.log(res))