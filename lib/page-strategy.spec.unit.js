import {describe, it} from 'node:test';
import assert from 'node:assert/strict';

import {JSON_API_PAGE_STRATEGY_GROUPS} from './index.js';
import schema from './schema.json' with {type: 'json'};

describe('[Module] JSON_API_PAGE_STRATEGY_GROUPS alignment', () => {
  it('matches schema page property keys', () => {
    const schemaKeys = new Set(Object.keys(schema.properties.page.properties));
    const wireKeys = new Set(JSON_API_PAGE_STRATEGY_GROUPS.flat());

    for (const key of wireKeys) {
      assert.ok(schemaKeys.has(key), `schema page is missing key ${key}`);
    }
  });

  it('defines mutually exclusive pagination strategy groups', () => {
    assert.deepEqual(JSON_API_PAGE_STRATEGY_GROUPS, [
      ['number', 'size'],
      ['offset', 'limit'],
      ['cursor']
    ]);
  });
});
