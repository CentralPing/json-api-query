// ESM syntax is supported.
// export {};

const schema = require('./schema');

/**
 * @module jsonApiQuery
*/

exports.parse = require('./parse');
exports.validate = require('./validate');

/**
 * Module property that generates a new deep copy of the default schema
 * on every import. Apply any extensions and provide as an optional schema
 * for the `validate` method.
 * @member {Object} schema JSON Schema
 */
Object.defineProperty(exports, 'schema', {
  configurable: true,
  enumerable: true,
  // clone schema for all external requires
  get: () => JSON.parse(JSON.stringify(schema))
});
