# @CentralPing/json-api-query

[![Build Status](https://travis-ci.org/CentralPing/json-api-query.svg?branch=master)](https://travis-ci.org/CentralPing/json-api-query)
[![Coverage Status](https://coveralls.io/repos/github/CentralPing/json-api-query/badge.svg)](https://coveralls.io/github/CentralPing/json-api-query)
[![Dependency Status](https://david-dm.org/CentralPing/json-api-query.svg)](https://david-dm.org/CentralPing/json-api-query)
[![Greenkeeper Status](https://badges.greenkeeper.io/CentralPing/json-api-query.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/centralping/json-api-query/badge.svg)](https://snyk.io/test/github/centralping/json-api-query)

An extensible [JSON Schema](http://json-schema.org) for validating and optionally coercing [JSON API](http://jsonapi.org/) query parameters for [fetching data](http://jsonapi.org/format/#fetching).

## Notes

* The request querystring is expected to have been parsed into an object.
```js
// Example Original URL:
// http://localhost:3000/?include=author&fields%5Barticles%5D=title%2Cbody&fields%5Bpeople%5D=name

// Parsed querystring:
{
  include: 'author',
  fields: {
    articles: ['title', 'body']
  },
  fields: {
    people: 'name'
  }
}
```
* The values of the query object can be strings or coerced to expected value types prior to validation. By default the object values will be coerced if strings and validation succeeds.
* Per the JSON API specification, any additional query parameters are ignored for validation and coercion by the validation method.

## Installation

`npm i --save @centralping/json-api-query`

## API Reference

<a name="module_jsonApiQuery..schema"></a>

### jsonApiQuery~schema : <code>Object</code>
Module property that generates a new deep copy of the default schema
on every import. Apply any extensions and provide as an optional schema
for the `validate` method.

**Kind**: inner property of [<code>jsonApiQuery</code>](#module_jsonApiQuery)  
<a name="module_jsonApiQuery..validate"></a>

### jsonApiQuery~validate ⇒ <code>function</code>
**Kind**: inner property of [<code>jsonApiQuery</code>](#module_jsonApiQuery)  
**Returns**: <code>function</code> - the configured validator function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | any AJV option. |
| [options.coerceTypes] | <code>Boolean</code> \| <code>String</code> | <code>&#x27;array&#x27;</code> | coerce validated values to specified types. |
| [options.ownProperties] | <code>Boolean</code> | <code>true</code> | restrict validation to own properties of data object. |
| [schema] | <code>Object</code> |  | JSON Schema. Defaults to the included `schema`. |

**Example**  
```js
const validator = validate();
const valid = validator(queryParams); // where queryParams is an object

if (!valid) {
  // Log errors
  console.log(validator.errors);
}
```

## Examples

### For Default Verification

```js
const {validate} = require('json-api-query');

const validator = validate();

// queryParams would be an query param object to validate/coerce
const valid = validator(queryParams);

if (!valid) {
  // Log errors
  console.log(validator.errors);
}
```

### For Extended Verification

```js
const {validate, schema} = require('json-api-query');

// extend schema

const validator = validate(undefined, schema);

// queryParams would be an query param object to validate/coerce
const valid = validator(queryParams);

if (!valid) {
  // Log errors
  console.log(validator.errors);
}
```

### For AJV options

```js
const {validate} = require('json-api-query');

const validator = validate({allErrors: true});

// queryParams would be an query param object to validate/coerce
const valid = validator(queryParams);

if (!valid) {
  // Log errors
  console.log(validator.errors);
}

## Test

`npm test`

With coverage reporting:

`npm test -- --coverage`

With file watch:

`npm run watch`

## License

MIT
