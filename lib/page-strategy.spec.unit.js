import {describe, it} from 'node:test';
import assert from 'node:assert/strict';

import {JSON_API_PAGE_STRATEGY_GROUPS} from './index.js';
import schema from './schema.json' with {type: 'json'};

describe('[Module] JSON_API_PAGE_STRATEGY_GROUPS alignment', () => {
  it('matches schema page property keys (set equality)', () => {
    const schemaKeys = [...Object.keys(schema.properties.page.properties)].sort();
    const wireKeys = [...new Set(JSON_API_PAGE_STRATEGY_GROUPS.flat())].sort();

    assert.deepEqual(wireKeys, schemaKeys);
  });

  it('defines mutually exclusive pagination strategy groups', () => {
    assert.deepEqual(JSON_API_PAGE_STRATEGY_GROUPS, [
      ['number', 'size'],
      ['offset', 'limit'],
      ['cursor']
    ]);

    const flat = JSON_API_PAGE_STRATEGY_GROUPS.flat();
    assert.equal(flat.length, new Set(flat).size, 'strategy groups must be pairwise disjoint');
  });
});
