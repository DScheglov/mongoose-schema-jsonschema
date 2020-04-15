const { Schema } = require('../../index')(require('mongoose'));
const assert = require('assert');

describe('nullable: schema.jsonSchema', () => {
  it('should correctly translate all simmple types with default equals to null', () => {
    const mSchema = new Schema({
      n: { type: Number, default: null },
      s: { type: String, default: null },
      d: { type: Date, default: null },
      b: { type: Boolean, default: null },
      u: { type: Schema.Types.ObjectId, default: null },
    });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        n: { type: ['number', 'null'], default: null },
        s: { type: ['string', 'null'], default: null },
        d: { type: ['string', 'null'], default: null, format: 'date-time' },
        b: { type: ['boolean', 'null'], default: null },
        u: { type: ['string', 'null'], default: null, pattern: '^[0-9a-fA-F]{24}$' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should correctly translate many levels of nested Schemas with default nulls', () => {
    const mSchema1 = new Schema({ x: Number }, { id: false, _id: false });
    const mSchema2 = new Schema({ y: Number, x: mSchema1 }, { id: false, _id: false });
    const mSchema3 = new Schema({ z: Number, y: mSchema2 }, { id: false, _id: false });
    const mSchema4 = new Schema({
      t: Number,
      xyz: {
        type: {
          x: [{
            type: mSchema1,
            required: true,
          }],
          y: { type: mSchema2, required: true },
          z: { type: [mSchema3] },
          t: { type: [{ x: Number, y: Number }], default: null },
          any: { type: Schema.Types.Mixed, required: true },
        },
        default: null,
      },
    });

    const jsonSchema = mSchema4.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        t: { type: 'number' },
        xyz: {
          title: 'xyz',
          type: ['object', 'null'],
          default: null,
          properties: {
            x: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                title: 'itemOf_x',
                properties: {
                  x: { type: 'number' },
                },
              },
            },
            y: {
              type: 'object',
              title: 'y',
              properties: {
                y: { type: 'number' },
                x: {
                  type: 'object',
                  title: 'x',
                  properties: {
                    x: { type: 'number' },
                  },
                },
              },
            },
            z: {
              type: 'array',
              items: {
                type: 'object',
                title: 'itemOf_z',
                properties: {
                  z: { type: 'number' },
                  y: {
                    type: 'object',
                    title: 'y',
                    properties: {
                      y: { type: 'number' },
                      x: {
                        type: 'object',
                        title: 'x',
                        properties: {
                          x: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
            t: {
              type: ['array', 'null'],
              default: null,
              items: {
                type: 'object',
                title: 'itemOf_t',
                properties: {
                  x: { type: 'number' },
                  y: { type: 'number' },
                },
              },
            },
            any: { },
          },
          required: ['y', 'any'],
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });
});
