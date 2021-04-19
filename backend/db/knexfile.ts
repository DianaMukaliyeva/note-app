import { knexSnakeCaseMappers } from 'objection';

const knexConfig = {
  development: {
    client: 'postgresql',
    connection: {
      user: 'hive',
      password: 'hive',
      database: 'notes',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
  ...knexSnakeCaseMappers,
};

export default knexConfig;
