const {parse, schema, validate} = require('./index');

describe('[Unit] `index`', () => {
  describe('with `parse`', () => {
    it('should be a function', () => {
      expect(parse).toBeInstanceOf(Function);
    });
  });

  describe('with `schema`', () => {
    it('should be a function', () => {
      expect(schema).toBeInstanceOf(Object);
    });
  });

  describe('with `validate`', () => {
    it('should be a function', () => {
      expect(validate).toBeInstanceOf(Function);
    });
  });
});
