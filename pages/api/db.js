import { NextApiRequest, NextApiResponse } from 'next';

const pool = require('../../lib/db');

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async (req, res) => {
  if (req.method === 'GET') {
    const client = await pool.connect();
    const { schema, table, columns } = req.query;
    if (!schema || !table || !columns) {
      res.statusCode = 400;
      return res.send('필요한 데이터가 없습니다.');
    }
    console.log(client);
    console.log(columns);
    // try {

    // } catch (error) {

    // }
  } else if (req.method === 'POST') {
    const client = await pool.connect();
    const { schema, table } = req.query;
    if (!schema || !table) {
      res.statusCode = 400;
      return res.send('필요한 데이터가 없습니다.');
    }
    const values = Object.values(req.body);
    const columns = Object.keys(req.body).join(',');
    const placeholders = values.map((_, index) => `$${index + 1}`).join(',');
    const sql = `INSERT INTO ${schema}.${table}(${columns}) VALUES(${placeholders})`;

    try {
      await client.query(sql, values);
    } catch (error) {
      res.statusCode = 500;
      return res.send(error);
    } finally {
      client.release();
      res.statusCode = 200;
      return res.send('Insert successfully');
    }
  }
};
