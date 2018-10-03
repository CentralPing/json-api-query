const validate = require('./validate');

describe('[Unit] validate', () => {
  it('should be a function', () => {
    expect(validate).toBeInstanceOf(Function);
  });

  it('should return a function', () => {
    const validator = validate();

    expect(validator).toBeInstanceOf(Function);
  });

  describe('with default validations', () => {
    it('should validate and cast valid query objects', () => {
      const validator = validate();
      let data;

      // Empty
      data = {};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({});

      // Validate any fields object
      data = {fields: {foo: ['bar']}};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({fields: {foo: ['bar']}});

      // Validate any fields object and cast values to array
      data = {fields: {foo: 'bar'}};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({fields: {foo: ['bar']}});

      // Validate any filter object but no casting
      data = {filter: {foo: '1'}};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({filter: {foo: '1'}});

      data = {filter: {foo: ['1']}};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({filter: {foo: ['1']}});

      // Validate include
      data = {include: ['foo']};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({include: ['foo']});

      // Validate include and cast to array
      data = {include: 'foo'};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({include: ['foo']});

      // Cast page size to number
      data = {page: {size: '13'}};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({page: {size: 13}});

      // Cast page size to number
      data = {page: {size: 'Infinity'}};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({page: {size: Infinity}});

      // Cast page limit to number
      data = {page: {limit: '13'}};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({page: {limit: 13}});

      // Cast page limit to number
      data = {page: {limit: 'Infinity'}};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({page: {limit: Infinity}});

      // Validate sort
      data = {sort: ['foo']};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({sort: ['foo']});

      // Validate sort and cast to array
      data = {sort: 'foo'};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({sort: ['foo']});
    });

    it('should invalidate invalid query objects', () => {
      const validator = validate();
      let data;

      // Fail fields with non-object
      data = {fields: 'abc'};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.fields',
        keyword: 'type',
        message: 'should be object',
        params: {type: 'object'},
        schemaPath: '#/properties/fields/type'
      }]);

      // Fail fields with empty object
      data = {fields: {}};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.fields',
        keyword: 'minProperties',
        message: 'should NOT have fewer than 1 properties',
        params: {limit: 1},
        schemaPath: '#/properties/fields/minProperties'
      }]);

      // Fail fields with non-array (or string)
      data = {fields: {foo: {}}};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.fields[\'foo\']',
        keyword: 'type',
        message: 'should be array',
        params: {type: 'array'},
        schemaPath: '#/properties/fields/additionalProperties/type'
      }]);

      // Fail fields with empty array
      data = {fields: {foo: []}};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.fields[\'foo\']',
        keyword: 'minItems',
        message: 'should NOT have fewer than 1 items',
        params: {limit: 1},
        schemaPath: '#/properties/fields/additionalProperties/minItems'
      }]);

      // Fail filter with non-object
      data = {filter: 'abc'};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.filter',
        keyword: 'type',
        message: 'should be object',
        params: {type: 'object'},
        schemaPath: '#/properties/filter/type'
      }]);

      // Fail filter with empty object
      data = {filter: {}};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.filter',
        keyword: 'minProperties',
        message: 'should NOT have fewer than 1 properties',
        params: {limit: 1},
        schemaPath: '#/properties/filter/minProperties'
      }]);

      // Fail include with non-array (or string)
      data = {include: {foo: 'abc'}};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.include',
        keyword: 'type',
        message: 'should be array',
        params: {type: 'array'},
        schemaPath: '#/properties/include/type'
      }]);

      // Fail include with empty array
      data = {include: []};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.include',
        keyword: 'minItems',
        message: 'should NOT have fewer than 1 items',
        params: {limit: 1},
        schemaPath: '#/properties/include/minItems'
      }]);

      // Fail page with non-numeric string
      data = {page: {size: 'abc'}};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.page.size',
        keyword: 'type',
        message: 'should be integer',
        params: {type: 'integer'},
        schemaPath: '#/properties/page/properties/size/type'
      }]);

      // Fail page with size too small
      data = {page: {size: '0'}};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.page.size',
        keyword: 'minimum',
        message: 'should be >= 1',
        params: {
          comparison: '>=',
          exclusive: false,
          limit: 1
        },
        schemaPath: '#/properties/page/properties/size/minimum'
      }]);

      // Fail page with limit too small
      data = {page: {limit: '0'}};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.page.limit',
        keyword: 'minimum',
        message: 'should be >= 1',
        params: {
          comparison: '>=',
          exclusive: false,
          limit: 1
        },
        schemaPath: '#/properties/page/properties/limit/minimum'
      }]);

      // Fail sort with non-array (or string)
      data = {sort: {foo: 'abc'}};
      expect(validator(data)).toBe(false);
      expect(validator.errors).toEqual([{
        dataPath: '.sort',
        keyword: 'type',
        message: 'should be array',
        params: {type: 'array'},
        schemaPath: '#/properties/sort/type'
      }]);
    });
  });

  describe('with custom properties', () => {
    it('should validate and cast query object', () => {
      const {schema} = require('./main');

      schema.properties.fields.propertyNames = {enum: ['foo']};
      schema.properties.filter.properties = {
        foo: {
          type: 'object',
          properties: {
            foo: {type: 'integer'},
            bar: {type: 'boolean'}
          }
        },
        bar: {type: 'boolean'}
      };
      schema.properties.include.items.enum = ['foo'];
      schema.properties.page.properties.size.minimum = 10;
      schema.properties.page.properties.size.maximum = 1000;
      schema.properties.page.properties.limit.minimum = 20;
      schema.properties.page.properties.limit.maximum = 500;
      schema.properties.sort.items.enum = ['foo'];

      const validatorDefault = validate();
      const validator = validate({}, schema);
      let data;

      // Validate custom fields
      data = {fields: {bar: 'foo'}};
      expect(validator(data)).toBe(false);
      expect(validatorDefault(data)).toBe(true);
      data = {fields: {foo: 'bar'}};
      expect(validator(data)).toBe(true);
      data = {fields: {foo: ['bar']}};
      expect(validator(data)).toBe(true);

      // Validate custom filter
      data = {filter: {bar: 'foo'}};
      expect(validator(data)).toBe(false);
      expect(validatorDefault(data)).toBe(true);
      data = {filter: {bar: true}};
      expect(validator(data)).toBe(true);
      data = {filter: {foo: 'bar'}};
      expect(validator(data)).toBe(false);
      data = {filter: {foo: {foo: 1, bar: true}}};
      expect(validator(data)).toBe(true);

      // Validate custom include
      data = {include: 'bar'};
      expect(validator(data)).toBe(false);
      expect(validatorDefault(data)).toBe(true);
      data = {include: 'foo'};
      expect(validator(data)).toBe(true);
      data = {include: ['foo']};
      expect(validator(data)).toBe(true);

      // Validate custom page size
      data = {page: {size: '9'}};
      expect(validator(data)).toBe(false);
      expect(validatorDefault(data)).toBe(true);
      data = {page: {size: '10'}};
      expect(validator(data)).toBe(true);
      data = {page: {size: '1000'}};
      expect(validator(data)).toBe(true);
      data = {page: {size: '1001'}};
      expect(validator(data)).toBe(false);
      expect(validatorDefault(data)).toBe(true);

      // Validate custom page limit
      data = {page: {limit: '19'}};
      expect(validator(data)).toBe(false);
      expect(validatorDefault(data)).toBe(true);
      data = {page: {limit: '20'}};
      expect(validator(data)).toBe(true);
      data = {page: {limit: '500'}};
      expect(validator(data)).toBe(true);
      data = {page: {limit: '501'}};
      expect(validator(data)).toBe(false);
      expect(validatorDefault(data)).toBe(true);

      // Validate custom sort
      data = {sort: 'bar'};
      expect(validator(data)).toBe(false);
      expect(validatorDefault(data)).toBe(true);
      data = {sort: 'foo'};
      expect(validator(data)).toBe(true);
      data = {sort: ['foo']};
      expect(validator(data)).toBe(true);
    });
  });

  describe('with custom options', () => {
    it('should validate query objects', () => {
      const validator = validate({coerceTypes: false});
      let data;

      // Validate fields
      data = {fields: {foo: ['bar']}};
      expect(validator(data)).toBe(true);
      expect(data).toEqual({fields: {foo: ['bar']}});

      // Fail any fields not explicitly an array
      data = {fields: {foo: 'bar'}};
      expect(validator(data)).toBe(false);
    });
  });
});
