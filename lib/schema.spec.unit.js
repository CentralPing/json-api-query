import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import Ajv2020 from 'ajv/dist/2020.js';
import schema from './schema.json' with {type: 'json'};

describe('[Unit] schema', () => {
  it('exports a valid JSON Schema object', () => {
    assert.ok(schema && typeof schema === 'object');
    assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  });

  describe('with AJV 2020-12 validation', () => {
    const ajv = new Ajv2020({coerceTypes: 'array'});
    const validate = ajv.compile(schema);

    it('validates empty query', () => {
      assert.equal(validate({}), true);
    });

    describe('extra properties', () => {
      it('rejects all-lowercase keys', () => {
        assert.equal(validate({foo: 1}), false);
      });

      it('allows keys containing non-lowercase characters per JSON:API spec', () => {
        assert.equal(validate({Foo: 1}), true);
        assert.equal(validate({_foo: 1}), true);
      });
    });

    describe('filter', () => {
      it('rejects non-object', () => {
        assert.equal(validate({filter: true}), false);
      });

      it('rejects empty object', () => {
        assert.equal(validate({filter: {}}), false);
      });

      it('accepts non-empty object', () => {
        assert.equal(validate({filter: {foo: 1}}), true);
      });
    });

    describe('sort', () => {
      it('rejects non-array', () => {
        assert.equal(validate({sort: {}}), false);
      });

      it('rejects empty array', () => {
        assert.equal(validate({sort: []}), false);
      });

      it('rejects array of non-strings', () => {
        assert.equal(validate({sort: [{}]}), false);
      });

      it('accepts array of unique strings', () => {
        assert.equal(validate({sort: ['foo']}), true);
        assert.equal(validate({sort: ['foo', 'bar']}), true);
      });

      it('rejects duplicate items', () => {
        assert.equal(validate({sort: ['foo', 'foo']}), false);
      });
    });

    describe('include', () => {
      it('rejects non-array', () => {
        assert.equal(validate({include: {}}), false);
      });

      it('rejects empty array', () => {
        assert.equal(validate({include: []}), false);
      });

      it('rejects array of non-strings', () => {
        assert.equal(validate({include: [{}]}), false);
      });

      it('accepts array of unique strings', () => {
        assert.equal(validate({include: ['foo']}), true);
        assert.equal(validate({include: ['foo', 'bar']}), true);
      });

      it('rejects duplicate items', () => {
        assert.equal(validate({include: ['foo', 'foo']}), false);
      });
    });

    describe('page', () => {
      it('rejects empty page object', () => {
        assert.equal(validate({page: {}}), false);
      });

      describe('size & number pagination', () => {
        it('rejects size of zero', () => {
          assert.equal(validate({page: {size: 0}}), false);
        });

        it('rejects non-integer size', () => {
          assert.equal(validate({page: {size: 1.1}}), false);
        });

        it('accepts valid size', () => {
          assert.equal(validate({page: {size: 1}}), true);
        });

        it('requires size when number is present', () => {
          assert.equal(validate({page: {number: 1}}), false);
        });

        it('rejects number of zero', () => {
          assert.equal(validate({page: {size: 1, number: 0}}), false);
        });

        it('accepts valid size and number', () => {
          assert.equal(validate({page: {size: 1, number: 1}}), true);
        });

        it('rejects non-integer number', () => {
          assert.equal(validate({page: {size: 1, number: 1.1}}), false);
        });

        it('rejects extra properties', () => {
          assert.equal(validate({page: {size: 1, number: 1, foo: 1}}), false);
        });

        it('can be used with other query parameters', () => {
          assert.equal(validate({page: {size: 1, number: 1}, filter: {foo: 1}}), true);
        });
      });

      describe('limit & offset pagination', () => {
        it('rejects limit of zero', () => {
          assert.equal(validate({page: {limit: 0}}), false);
        });

        it('rejects non-integer limit', () => {
          assert.equal(validate({page: {limit: 1.1}}), false);
        });

        it('accepts valid limit', () => {
          assert.equal(validate({page: {limit: 1}}), true);
        });

        it('requires limit when offset is present', () => {
          assert.equal(validate({page: {offset: 1}}), false);
        });

        it('accepts valid limit and offset', () => {
          assert.equal(validate({page: {limit: 1, offset: 0}}), true);
        });

        it('rejects non-integer offset', () => {
          assert.equal(validate({page: {limit: 1, offset: 0.1}}), false);
        });

        it('rejects extra properties', () => {
          assert.equal(validate({page: {limit: 1, offset: 1, foo: 1}}), false);
        });

        it('can be used with other query parameters', () => {
          assert.equal(validate({page: {limit: 1, offset: 1}, filter: {foo: 1}}), true);
        });
      });

      describe('cursor pagination', () => {
        it('rejects non-string cursor', () => {
          assert.equal(validate({page: {cursor: {}}}), false);
        });

        it('rejects empty string cursor', () => {
          assert.equal(validate({page: {cursor: ''}}), false);
        });

        it('accepts valid cursor', () => {
          assert.equal(validate({page: {cursor: 'foo'}}), true);
        });

        it('rejects extra properties', () => {
          assert.equal(validate({page: {cursor: 'foo', foo: 1}}), false);
        });

        it('cannot be used with other query parameters', () => {
          assert.equal(validate({page: {cursor: 'foo'}, filter: {foo: 1}}), false);
        });
      });

      describe('pagination type mixing', () => {
        it('rejects cursor with size', () => {
          assert.equal(validate({page: {cursor: 'foo', size: 1}}), false);
        });

        it('rejects cursor with limit', () => {
          assert.equal(validate({page: {cursor: 'foo', limit: 1}}), false);
        });

        it('rejects size with limit', () => {
          assert.equal(validate({page: {size: 1, limit: 1}}), false);
        });
      });
    });
  });
});
