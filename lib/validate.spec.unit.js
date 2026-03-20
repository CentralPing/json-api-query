import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import validate from './validate.js';
import {validate as createValidator, schema} from './index.js';

describe('[Unit] validate', () => {
  it('is a function', () => {
    assert.equal(typeof validate, 'function');
  });

  it('returns a compiled validator function', () => {
    const validator = validate();
    assert.equal(typeof validator, 'function');
  });

  describe('with default validations', () => {
    const validator = validate();

    it('validates empty query', () => {
      const data = {};
      assert.equal(validator(data), true);
      assert.deepStrictEqual(data, {});
    });

    it('validates fields object', () => {
      const data = {fields: {foo: ['bar']}};
      assert.equal(validator(data), true);
      assert.deepStrictEqual(data, {fields: {foo: ['bar']}});
    });

    it('coerces fields string value to array', () => {
      const data = {fields: {foo: 'bar'}};
      assert.equal(validator(data), true);
      assert.deepStrictEqual(data, {fields: {foo: ['bar']}});
    });

    it('validates filter object without casting', () => {
      const data = {filter: {foo: '1'}};
      assert.equal(validator(data), true);
      assert.deepStrictEqual(data, {filter: {foo: '1'}});
    });

    it('validates include array', () => {
      const data = {include: ['foo']};
      assert.equal(validator(data), true);
      assert.deepStrictEqual(data, {include: ['foo']});
    });

    it('coerces include string to array', () => {
      const data = {include: 'foo'};
      assert.equal(validator(data), true);
      assert.deepStrictEqual(data, {include: ['foo']});
    });

    it('coerces page size string to integer', () => {
      const data = {page: {size: '13'}};
      assert.equal(validator(data), true);
      assert.deepStrictEqual(data, {page: {size: 13}});
    });

    it('coerces page limit string to integer', () => {
      const data = {page: {limit: '13'}};
      assert.equal(validator(data), true);
      assert.deepStrictEqual(data, {page: {limit: 13}});
    });

    it('validates sort array', () => {
      const data = {sort: ['foo']};
      assert.equal(validator(data), true);
      assert.deepStrictEqual(data, {sort: ['foo']});
    });

    it('coerces sort string to array', () => {
      const data = {sort: 'foo'};
      assert.equal(validator(data), true);
      assert.deepStrictEqual(data, {sort: ['foo']});
    });

    it('rejects fields non-object', () => {
      assert.equal(validator({fields: 'abc'}), false);
    });

    it('rejects fields empty object', () => {
      assert.equal(validator({fields: {}}), false);
    });

    it('rejects fields with non-array value', () => {
      assert.equal(validator({fields: {foo: {}}}), false);
    });

    it('rejects fields with empty array value', () => {
      assert.equal(validator({fields: {foo: []}}), false);
    });

    it('rejects filter non-object', () => {
      assert.equal(validator({filter: 'abc'}), false);
    });

    it('rejects filter empty object', () => {
      assert.equal(validator({filter: {}}), false);
    });

    it('rejects include non-array/string', () => {
      assert.equal(validator({include: {foo: 'abc'}}), false);
    });

    it('rejects include empty array', () => {
      assert.equal(validator({include: []}), false);
    });

    it('rejects page size non-numeric string', () => {
      assert.equal(validator({page: {size: 'abc'}}), false);
    });

    it('rejects page size zero', () => {
      assert.equal(validator({page: {size: 0}}), false);
    });

    it('rejects page limit zero', () => {
      assert.equal(validator({page: {limit: 0}}), false);
    });

    it('rejects sort non-array/string', () => {
      assert.equal(validator({sort: {foo: 'abc'}}), false);
    });

    it('populates errors on failure', () => {
      validator({fields: 'not-an-object'});
      assert.ok(Array.isArray(validator.errors));
      assert.ok(validator.errors.length > 0);
    });
  });

  describe('with custom schema', () => {
    it('applies extended schema constraints', () => {
      const customSchema = structuredClone(schema);
      customSchema.properties.fields.propertyNames = {enum: ['foo']};
      customSchema.properties.include.items.enum = ['foo'];
      customSchema.properties.sort.items.enum = ['foo'];

      const validatorDefault = createValidator();
      const validatorCustom = createValidator({}, customSchema);

      assert.equal(validatorCustom({fields: {bar: 'foo'}}), false);
      assert.equal(validatorDefault({fields: {bar: 'foo'}}), true);
      assert.equal(validatorCustom({fields: {foo: 'bar'}}), true);

      assert.equal(validatorCustom({include: 'bar'}), false);
      assert.equal(validatorDefault({include: 'bar'}), true);
      assert.equal(validatorCustom({include: 'foo'}), true);

      assert.equal(validatorCustom({sort: 'bar'}), false);
      assert.equal(validatorDefault({sort: 'bar'}), true);
      assert.equal(validatorCustom({sort: 'foo'}), true);
    });
  });

  describe('with custom options', () => {
    it('respects coerceTypes: false', () => {
      const validator = validate({coerceTypes: false});

      const data = {fields: {foo: ['bar']}};
      assert.equal(validator(data), true);
      assert.deepStrictEqual(data, {fields: {foo: ['bar']}});

      assert.equal(validator({fields: {foo: 'bar'}}), false);
    });
  });
});
