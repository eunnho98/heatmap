import axios from '.';

/**
 * @param {string[]} columns
 * @param {string} table
 * @param {string } [schema=public]
 * @returns {object}
 */
export const readDBAPI = (table, columns, schema = 'public') => {
  const columnsQuery = columns
    .map((value) => `columns=${encodeURIComponent(value)}`)
    .join('&');

  return axios.get(`/db?${columnsQuery}&table=${table}&schema=${schema}`);
};

/**
 * @param {string} table
 * @param {Object.<string, string>} data
 * @param {string} [schema=public]
 */
export const insertDBAPI = (table, data, schema = 'public') => {
  console.log('call api');
  return axios.post(`/db?table=${table}&schema=${schema}`, data);
};
