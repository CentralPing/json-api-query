/**
 * @fileoverview JSON:API query parameter validator using AJV 8 with JSON Schema 2020-12.
 *
 * Compiles the JSON:API query schema once and returns a validator function. The compiled
 * validator is augmented with an `errors` property (populated on validation failure) for
 * downstream error reporting.
 *
 * Options mirror a subset of AJV constructor options. By default, array coercion is enabled
 * to handle single-value query parameters that may be strings instead of arrays.
 *
 * @module @centralping/json-api-query/validate
 * @version 1.0.0
 * @since 1.0.0
 * @requires ajv/dist/2020.js
 * @requires ./schema.json
 *
 * @example
 * import {validate} from '@centralping/json-api-query';
 *
 * const validator = validate();
 * const valid = validator({include: ['author'], fields: {articles: ['title']}});
 * if (!valid) console.log(validator.errors);
 */
import Ajv2020 from 'ajv/dist/2020.js';

import defaultSchema from './schema.json' with {type: 'json'};

/**
 * Creates a compiled JSON API query validator.
 *
 * @example
 * const validator = validate();
 * const valid = validator(queryParams); // where queryParams is an object
 *
 * if (!valid) {
 *   console.log(validator.errors);
 * }
 *
 * @param {object} [options] - Any AJV option.
 * @param {boolean|string} [options.coerceTypes='array'] - Coerce validated values to specified types.
 * @param {boolean} [options.ownProperties=true] - Restrict validation to own properties of data object.
 * @param {object} [schema] - JSON Schema 2020-12. Defaults to the included schema.
 * @returns {function} - The configured validator function.
 */
export default (
  {coerceTypes = 'array', ownProperties = true, ...ajvOptions} = {},
  schema = defaultSchema
) => {
  const ajv = new Ajv2020({
    ...ajvOptions,
    coerceTypes,
    ownProperties
  });

  return ajv.compile(schema);
};
