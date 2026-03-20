/**
 * @fileoverview JSON:API query module with AJV 8 and JSON Schema 2020-12.
 *
 * Provides the JSON:API query parameter validator and the default schema as a deep-cloneable
 * getter. The schema clone pattern prevents mutation from affecting the original definition.
 *
 * @module @centralping/json-api-query
 * @version 1.0.0
 * @since 1.0.0
 * @requires ./schema.json
 * @requires ./validate.js
 */
import schemaSource from './schema.json' with {type: 'json'};

export {default as validate} from './validate.js';

/**
 * A deep copy of the default JSON API query schema, computed once at module load.
 * Callers should clone again if mutation is needed.
 *
 * @member {object} schema JSON Schema 2020-12
 */
export const schema = structuredClone(schemaSource);
