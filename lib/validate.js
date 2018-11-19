// ESM syntax is supported.
// export {};

/**
 * @module jsonApiQuery
*/

const Ajv = require('ajv');

const defaultSchema = require('./schema.json');

/**
 *
 * @example
const validator = validate();
const valid = validator(queryParams); // where queryParams is an object

if (!valid) {
  // Log errors
  console.log(validator.errors);
}
 * @name validate
 * @param {Object} [options] any AJV option.
 * @param {Boolean|String} [options.coerceTypes='array'] coerce validated
 * values to specified types.
 * @param {Boolean} [options.ownProperties=true] restrict validation to own
 * properties of data object.
 * @param {Object} [schema] JSON Schema. Defaults to the included `schema`.
 * @return {Function} the configured validator function
 */
module.exports = (
  {
    coerceTypes = 'array',
    ownProperties = true,
    ...ajvOptions
  } = {},
  schema = defaultSchema
) => {
  const ajv = new Ajv({
    ...ajvOptions,
    coerceTypes,
    ownProperties
  });

  return ajv.compile(schema);
};
