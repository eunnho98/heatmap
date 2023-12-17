const makeClient = async () => {
  const pg = require('pg');
  const client = new pg.Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'touch',
    password: 'skadhlehd12',
    port: 5432,
  });
  await client.connect();
  return client;
};

const insertDB = async (client, schema, table, data) => {
  if (client) {
    const columns = Object.keys(data).join(',');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(',');
    const sql = `INSERT INTO ${schema}.${table}(${columns}) VALUES (${placeholders})`;

    client
      .query(sql, values)
      .then((res) => console.log('insert successfully'))
      .catch((err) => console.log(err));
  } else {
    console.log('Client is Down');
  }
};

const readDB = async (client, schema, table, columns) => {
  if (client) {
    const cols = columns.join(',');
    const sql = `SELECT ${cols} FROM ${schema}.${table}`;
    try {
      const result = await client.query(sql);
      return result;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('Client is Down');
  }
};

const updateDB = (client, schema, table, coulmns, values, conditions) => {};

const deleteDB = (client, schema, table, conditions) => {};

const deleteClient = async (client) => {
  await client.end();
  console.log('Client has disconnected');
};

export default {
  makeClient,
  insertDB,
  readDB,
  updateDB,
  deleteDB,
  deleteClient,
};
