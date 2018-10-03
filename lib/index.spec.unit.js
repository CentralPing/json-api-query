const {schema, validate} = require('./index');

describe('[Unit] `index`', () => {
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
