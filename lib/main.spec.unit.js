const {parse, schema, validate} = require('./main');

describe('[Unit] `main`', () => {
  describe('with `parse`', () => {
    it('should be a function', () => {
      expect(parse).toBeInstanceOf(Function);
    });
  });

  describe('with `schema`', () => {
    it('should be an object', () => {
      expect(schema).toBeInstanceOf(Object);
    });

    it('should return a unique copy for each import', () => {
      const {schema: secondSchema} = require('./main');
      secondSchema.foo = 'bar';

      expect(schema.foo).toBeUndefined();
      expect(secondSchema.foo).toBe('bar');
    });
  });

  describe('with `validate`', () => {
    it('should be a function', () => {
      expect(validate).toBeInstanceOf(Function);
    });
  });
});
