/**
 * Bug Fix for: https://github.com/DScheglov/mongoose-schema-jsonschema/issues/37
 *
 * Based on the sample taken from the issue
 */
const mongoose = require('../../index')(require('mongoose'));

describe('array of array', () => {
  const VariableSchema = mongoose.Schema({
    name: { type: String, required: true },
    value: {},
  });

  const ElementPathSchema = new mongoose.Schema({
    paths: {
      paths: {
        type: [[VariableSchema]],
        validate: {
          validator: function validateTemplate(arrayOfVariables) {
            return arrayOfVariables.every(variables => VariableSchema.statics.validateTemplate(variables, 'elementQuery'));
          },
          message: 'elementPath.paths not valid',
        },
      },
    },
  });

  it('builds the json schema', () => {
    expect(ElementPathSchema.jsonSchema()).toEqual({
      type: 'object',
      properties: {
        paths: {
          title: 'paths',
          type: 'object',
          properties: {
            paths: {
              type: 'array',
              items: {
                type: 'array',
                items: {
                  title: 'itemOf_itemOf_paths',
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    value: {},
                    _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
                  },
                  required: ['name'],
                },
              },
            },
          },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });
});
