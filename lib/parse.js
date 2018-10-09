// ESM syntax is supported.
// export {};

/**
 * @module jsonApiQuery
*/

const {parse: urlParse} = require('url');

const keyRegex = /^([^[]+)(?:\[(.+)\]|)$/;
const splitValues = ['fields', 'include', 'sort'];

/**
 *
 * @example
const url = '/foo/bar?include=author&fields%5Barticles%5D=title%2Cbody&fields%5Bpeople%5D=name';
const {query, pathname, ...extra} = parse(url);
// query
// {
//   include: [ 'author' ],
//   fields: {
//     articles: ['title', 'body'],
//     people: ['name']
//   }
// }
// pathname
// '/foo/bar'
 * @name parse
 * @param {String} url Any URL string.
 * @return {Object} A url parse object.
 */
module.exports = (url) => {
  const {query, ...extra} = urlParse(url, true);

  const formattedQuery = Object.entries(query).reduce((acc, [k, v]) => {
    const [, prop, subprop] = keyRegex.exec(k);
    const vs = splitValues.includes(prop)
      ? v.split(',').map((s) => s.trim())
      : v;

    acc[prop] = subprop !== undefined ? {...acc[prop], [subprop]: vs} : vs;

    return acc;
  }, {});

  return {query: formattedQuery, ...extra};
};
