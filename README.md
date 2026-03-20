<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-wordmark-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/logo-wordmark-light.svg">
    <img alt="CentralPing" src="assets/logo-wordmark-light.svg" width="240">
  </picture>
</p>

[![CI](https://github.com/CentralPing/json-api-query/actions/workflows/ci.yml/badge.svg)](https://github.com/CentralPing/json-api-query/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/CentralPing/json-api-query/branch/main/graph/badge.svg)](https://codecov.io/gh/CentralPing/json-api-query)
[![npm version](https://img.shields.io/npm/v/@centralping/json-api-query.svg)](https://www.npmjs.com/package/@centralping/json-api-query)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/CentralPing/json-api-query/badge)](https://scorecard.dev/viewer/?uri=github.com/CentralPing/json-api-query)
[![Node.js >=22](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An extensible [JSON Schema](https://json-schema.org/) for validating and optionally coercing [JSON:API](https://jsonapi.org/) query parameters for [fetching data](https://jsonapi.org/format/#fetching). Uses [AJV 8](https://ajv.js.org/) with [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/schema).

## Features

- **Validates** `fields`, `filter`, `include`, `page`, and `sort` query parameters per the [JSON:API specification](https://jsonapi.org/format/#fetching)
- **Coerces** single-value strings to arrays (e.g. `include: 'author'` becomes `include: ['author']`)
- **Pagination** supports cursor, page/size, and limit/offset strategies with mutual exclusion rules
- **Extensible** schema can be cloned and customized for application-specific constraints
- **Zero config** sensible defaults out of the box

## Installation

```bash
npm install @centralping/json-api-query
```

Requires **Node.js >= 22**.

## Usage

### Default Validation

```js
import {validate} from '@centralping/json-api-query';

const validator = validate();
const valid = validator(queryParams); // where queryParams is a parsed object

if (!valid) {
  console.log(validator.errors);
}
```

### Extended Schema

```js
import {validate, schema} from '@centralping/json-api-query';

// Clone and extend the default schema
const customSchema = structuredClone(schema);
customSchema.properties.fields.propertyNames = {enum: ['articles', 'people']};
customSchema.properties.include.items.enum = ['author', 'comments'];

const validator = validate({}, customSchema);
```

### Custom AJV Options

```js
import {validate} from '@centralping/json-api-query';

const validator = validate({allErrors: true, coerceTypes: false});
```

## API

### `validate([options], [schema])`

Creates a compiled validator function.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `options` | `object` | `{}` | Any [AJV option](https://ajv.js.org/options.html). |
| `options.coerceTypes` | `boolean\|string` | `'array'` | Coerce validated values to specified types. |
| `options.ownProperties` | `boolean` | `true` | Restrict validation to own properties. |
| `schema` | `object` | built-in | JSON Schema 2020-12 definition. |

**Returns** a validator function. Call it with a query object; it returns `true`/`false` and populates `.errors` on failure.

### `schema`

A deep copy of the default JSON:API query schema. Clone with `structuredClone(schema)` before mutating.

## Notes

- The request querystring is expected to have been parsed into an object before validation.
- Per the JSON:API specification, custom query parameters whose names contain only lowercase `a-z` characters are rejected. Parameters with at least one non-lowercase character (e.g. `_meta`, `Foo`) are allowed.
- Cursor-based pagination cannot be combined with `fields`, `filter`, `include`, or `sort`.

## Development

```bash
npm install
npm test            # lint + format check + tests with coverage
npm run test:watch  # watch mode
npm run lint        # ESLint
npm run format      # Prettier
```

## License

[MIT](LICENSE) &copy; 2018-present Jason Cust
