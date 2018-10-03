const Ajv = require('ajv');

const schema = require('./schema');

describe('[Unit] schema', () => {
  describe('`json`', () => {
    it('should export a schema', () => {
      expect(schema).toBeInstanceOf(Object);
    });
  });

  describe('with validations', () => {
    const ajv = new Ajv({
      coerceTypes: 'array'
    });

    const validate = ajv.compile(schema);
    it('should validate query object', () => {
      // Empty
      expect(validate({})).toBe(true);

      // Extra properties allowed
      expect(validate({foo: 1})).toBe(true);

      /* Filter */
      // Only validate objects
      expect(validate({filter: true})).toBe(false);
      expect(validate({filter: {}})).toBe(false);
      expect(validate({filter: {foo: 1}})).toBe(true);

      /* Sort */
      // Only validate arrays of unique strings
      expect(validate({sort: {}})).toBe(false);
      expect(validate({sort: []})).toBe(false);
      expect(validate({sort: [{}]})).toBe(false);
      expect(validate({sort: ['foo']})).toBe(true);
      expect(validate({sort: ['foo', 'bar']})).toBe(true);
      expect(validate({sort: ['foo', 'foo']})).toBe(false);

      /* Include */
      // Only validate arrays of unique strings
      expect(validate({include: {}})).toBe(false);
      expect(validate({include: []})).toBe(false);
      expect(validate({include: [{}]})).toBe(false);
      expect(validate({include: ['foo']})).toBe(true);
      expect(validate({include: ['foo', 'bar']})).toBe(true);
      expect(validate({include: ['foo', 'foo']})).toBe(false);

      /* Page */
      // Only validate with one of three paging types
      expect(validate({page: {}})).toBe(false);
      // Do not allow combining paging types
      expect(validate({page: {cursor: 'foo', size: 1}})).toBe(false);
      expect(validate({page: {cursor: 'foo', limit: 1}})).toBe(false);
      expect(validate({page: {size: 1, limit: 1}})).toBe(false);
      // Size & Number
      // - size must be positive integer <= 100 (default)
      expect(validate({page: {size: 0}})).toBe(false);
      expect(validate({page: {size: 1.1}})).toBe(false);

      expect(validate({page: {size: 1}})).toBe(true);
      expect(validate({page: {size: Infinity}})).toBe(true);
      // - number must be positive integer with size
      expect(validate({page: {number: 1}})).toBe(false);
      expect(validate({page: {size: 1, number: 0}})).toBe(false);
      expect(validate({page: {size: 1, number: 1}})).toBe(true);
      expect(validate({page: {size: 1, number: 1.1}})).toBe(false);
      // - no extra properties allowed
      expect(validate({page: {size: 1, number: 1, foo: 1}})).toBe(false);
      // - can be used with other properties
      expect(validate({
        page: {size: 1, number: 1},
        filter: {foo: 1}
      })).toBe(true);
      // Limit & Offset
      // - limit must be positive integer <= 100 (default)
      expect(validate({page: {limit: 0}})).toBe(false);
      expect(validate({page: {limit: 1.1}})).toBe(false);
      expect(validate({page: {limit: 1}})).toBe(true);
      expect(validate({page: {limit: Infinity}})).toBe(true);
      // - number must be positive integer with limit
      expect(validate({page: {offset: 1}})).toBe(false);
      expect(validate({page: {limit: 1, offset: 0}})).toBe(true);
      expect(validate({page: {limit: 1, offset: 0.1}})).toBe(false);
      // - no extra properties allowed
      expect(validate({page: {limit: 1, offset: 1, foo: 1}})).toBe(false);
      // - can be used with other properties
      expect(validate({
        page: {limit: 1, offset: 1},
        filter: {foo: 1}
      })).toBe(true);
      // Cursor
      // - cursor must be non-empty string
      expect(validate({page: {cursor: {}}})).toBe(false);
      expect(validate({page: {cursor: ''}})).toBe(false);
      expect(validate({page: {cursor: 'foo'}})).toBe(true);
      // - no extra properties allowed
      expect(validate({page: {cursor: 'foo', foo: 1}})).toBe(false);
      // - cannot be used with other properties
      expect(validate({page: {cursor: 'foo'}, filter: {foo: 1}})).toBe(false);
    });
  });
});
