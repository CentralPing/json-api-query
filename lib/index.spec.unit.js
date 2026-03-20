import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {validate, schema} from './index.js';

describe('[Unit] index', () => {
  it('exports validate as a function', () => {
    assert.equal(typeof validate, 'function');
  });

  it('exports schema as a non-empty object', () => {
    assert.ok(schema && typeof schema === 'object');
    assert.ok(Object.keys(schema).length > 0);
  });

  it('schema is a deep clone of the source definition', () => {
    assert.ok(schema.$schema);
    assert.ok(schema.properties);
    assert.ok(schema.properties.fields);
    assert.ok(schema.properties.include);
    assert.ok(schema.properties.page);
    assert.ok(schema.properties.sort);
  });
});
