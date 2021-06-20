/* eslint-disable func-names */
const mongoose = require('../../index')(require('mongoose'));

const { Schema } = mongoose;
const assert = require('assert');

describe('schema.jsonSchema', () => {
  it('should correctly translate all simmple types', () => {
    const mSchema = new Schema({
      n: Number,
      s: String,
      d: Date,
      b: Boolean,
      u: Schema.Types.ObjectId,
    });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        n: { type: 'number' },
        s: { type: 'string' },
        d: { type: 'string', format: 'date-time' },
        b: { type: 'boolean' },
        u: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should correctly translate all simmple types and virtuals', () => {
    const mSchema = new Schema({
      n: Number,
      s: String,
      d: Date,
      b: Boolean,
      u: Schema.Types.ObjectId,
    }, {
      toJSON: { virtuals: true },
    });

    mSchema.virtual('id').get(function () {
      return this._id;
    });

    mSchema.virtual('summary').get(function () {
      return this.s + this.n;
    });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        n: { type: 'number' },
        s: { type: 'string' },
        d: { type: 'string', format: 'date-time' },
        b: { type: 'boolean' },
        u: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        id: {},
        summary: {},
      },
    });
  });

  it('should correctly translate all simmple types and virtuals (through getters options)', () => {
    const mSchema = new Schema({
      n: Number,
      s: String,
      d: Date,
      b: Boolean,
      u: Schema.Types.ObjectId,
    }, {
      toJSON: { getters: true },
    });

    mSchema.virtual('id').get(function () {
      return this._id;
    });

    mSchema.virtual('summary').get(function () {
      return this.s + this.n;
    });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        n: { type: 'number' },
        s: { type: 'string' },
        d: { type: 'string', format: 'date-time' },
        b: { type: 'boolean' },
        u: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        id: {},
        summary: {},
      },
    });
  });

  it('should correctly translate all simmple types in arrays', () => {
    const mSchema = new Schema({
      n: [Number],
      s: [String],
      d: [Date],
      b: [Boolean],
      u: [Schema.Types.ObjectId],
    });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        n: {
          type: 'array',
          items: { type: 'number' },
        },
        s: {
          type: 'array',
          items: { type: 'string' },
        },
        d: {
          type: 'array',
          items: { type: 'string', format: 'date-time' },
        },
        b: {
          type: 'array',
          items: { type: 'boolean' },
        },
        u: {
          type: 'array',
          items: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        },
        _id: {
          type: 'string', pattern: '^[0-9a-fA-F]{24}$',
        },
      },
    });
  });

  it('should correctly translate all simmple types when required', () => {
    const mSchema = new Schema({
      n: { type: Number, required: true },
      s: { type: String, required: true },
      d: { type: Date, required: true },
      b: { type: Boolean, required: true },
      u: { type: Schema.Types.ObjectId, required: true },
    });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        n: { type: 'number' },
        s: { type: 'string' },
        d: { type: 'string', format: 'date-time' },
        b: { type: 'boolean' },
        u: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
      required: ['n', 's', 'd', 'b', 'u'],
    });
  });

  it('should correctly translate all simmple types in embedded doc', () => {
    const mSchema = new Schema({
      embededDoc: {
        n: Number,
        s: String,
        d: Date,
        b: Boolean,
        u: Schema.Types.ObjectId,
      },
    });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        embededDoc: {
          title: 'embededDoc',
          type: 'object',
          properties: {
            n: { type: 'number' },
            s: { type: 'string' },
            d: { type: 'string', format: 'date-time' },
            b: { type: 'boolean' },
            u: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
          },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should correctly translate all simmple types in required embedded doc', () => {
    const mSchema = new Schema({
      embededDoc: {
        type: {
          n: Number,
          s: String,
          d: Date,
          b: Boolean,
          u: Schema.Types.ObjectId,
        },
        required: true,
      },
    });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        embededDoc: {
          title: 'embededDoc',
          type: 'object',
          properties: {
            n: { type: 'number' },
            s: { type: 'string' },
            d: { type: 'string', format: 'date-time' },
            b: { type: 'boolean' },
            u: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
          },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
      required: ['embededDoc'],
    });
  });

  it('should corretly translate all supported types', () => {
    const mSchema = new Schema({
      n: Number,
      s: String,
      d: Date,
      b: Boolean,
      u: Schema.Types.ObjectId,
      r: { type: Schema.Types.ObjectId, ref: 'Book' },
      nestedDoc: {
        n: Number,
        s: String,
      },
      an: [Number],
      as: [String],
      ad: [Date],
      ab: [Boolean],
      au: [Schema.Types.ObjectId],
      ar: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
      aNestedDoc: [{
        n: Number,
        s: String,
      }],
      rn: { type: Number, required: true },
      rs: { type: String, required: true },
      rd: { type: Date, required: true },
      rb: { type: Boolean, required: true },
      ru: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      rr: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Book',
      },
      rNestedDoc: {
        type: {
          n: Number,
          s: String,
        },
        required: true,
      },
      rar: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
        required: true,
      },
      described: {
        type: String,
        description: 'Described field',
        required: true,
      },
    });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        n: { type: 'number' },
        s: { type: 'string' },
        d: { type: 'string', format: 'date-time' },
        b: { type: 'boolean' },
        u: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        r: {
          type: 'string',
          pattern: '^[0-9a-fA-F]{24}$',
          'x-ref': 'Book',
          description: 'Refers to Book',
        },
        nestedDoc: {
          title: 'nestedDoc',
          type: 'object',
          properties: {
            n: { type: 'number' },
            s: { type: 'string' },
          },
        },
        an: { type: 'array', items: { type: 'number' } },
        as: { type: 'array', items: { type: 'string' } },
        ad: {
          type: 'array',
          items: { type: 'string', format: 'date-time' },
        },
        ab: { type: 'array', items: { type: 'boolean' } },
        au: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
          },
        },
        ar: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
            'x-ref': 'Book',
            description: 'Refers to Book',
          },
        },
        aNestedDoc: {
          type: 'array',
          items: {
            title: 'itemOf_aNestedDoc',
            type: 'object',
            properties: {
              s: { type: 'string' },
              n: { type: 'number' },
              _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
            },
          },
        },
        rn: { type: 'number' },
        rs: { type: 'string' },
        rd: { type: 'string', format: 'date-time' },
        rb: { type: 'boolean' },
        ru: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        rr: {
          type: 'string',
          pattern: '^[0-9a-fA-F]{24}$',
          'x-ref': 'Book',
          description: 'Refers to Book',
        },
        rNestedDoc: {
          title: 'rNestedDoc',
          type: 'object',
          properties: {
            n: { type: 'number' },
            s: { type: 'string' },
          },
        },
        rar: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
            'x-ref': 'Book',
            description: 'Refers to Book',
          },
        },
        described: {
          type: 'string',
          description: 'Described field',
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
      required: [
        'rn', 'rs', 'rd', 'rb', 'ru', 'rr', 'rNestedDoc', 'rar', 'described',
      ],
    });
  });

  it('should correctly translate nested schemas', () => {
    const mSchema1 = new Schema({
      k: String,
      v: Number,
    }, { id: false, _id: false });
    const mSchema2 = new Schema({
      t: { type: String, required: true },
      nD: mSchema1,
      rND: {
        type: mSchema1,
        required: true,
      },
      aND: [mSchema1],
      rAND: {
        type: [mSchema1],
        required: true,
      },
    });

    const jsonSchema = mSchema2.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        t: { type: 'string' },
        nD: {
          type: 'object',
          title: 'nD',
          properties: {
            k: { type: 'string' },
            v: { type: 'number' },
          },
        },
        rND: {
          title: 'rND',
          type: 'object',
          properties: {
            k: { type: 'string' },
            v: { type: 'number' },
          },
        },
        aND: {
          type: 'array',
          items: {
            title: 'itemOf_aND',
            type: 'object',
            properties: {
              k: { type: 'string' },
              v: { type: 'number' },
            },
          },
        },
        rAND: {
          type: 'array',
          items: {
            title: 'itemOf_rAND',
            type: 'object',
            properties: {
              k: { type: 'string' },
              v: { type: 'number' },
            },
          },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
      required: ['t', 'rND', 'rAND'],
    });
  });

  it('should correctly translate many levels of nested Schemas', () => {
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
          any: { type: Schema.Types.Mixed, required: true },
        },
        required: true,
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
          type: 'object',
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
            any: { },
          },
          required: ['y', 'any'],
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
      required: ['xyz'],
    });
  });

  it('should correctly translate number value constaints', () => {
    const mSchema = new Schema({
      value: {
        type: Number, min: -5, max: 50, default: 0, required: true,
      },
    }, { id: false, _id: false });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        value: {
          type: 'number',
          minimum: -5,
          maximum: 50,
          default: 0,
        },
      },
      required: ['value'],
    });
  });

  it('should correctly translate number value constaints with error messages', () => {
    const mSchema = new Schema({
      value: {
        type: Number,
        min: [-5, 'Value shoule be greater or equal to -5'],
        max: [50, 'Value should be less or equal to 50'],
        required: [true, 'Value should be specified'],
        default: 0,
      },
    }, { id: false, _id: false });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        value: {
          type: 'number',
          minimum: -5,
          maximum: 50,
          default: 0,
        },
      },
      required: ['value'],
    });
  });

  it('should correctly translate number value constaints with error messages (not requires)', () => {
    const mSchema = new Schema({
      value: {
        type: Number,
        min: [-5, 'Value shoule be greater or equal to -5'],
        max: [50, 'Value should be less or equal to 50'],
        required: [false, 'Value is not required'],
        default: 0,
      },
    }, { id: false, _id: false });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        value: {
          type: 'number',
          minimum: -5,
          maximum: 50,
          default: 0,
        },
      },
    });
  });

  it('should correctly translate string value constaints', () => {
    const mSchema = new Schema({
      valueFromList: {
        type: String,
        enum: ['red', 'green', 'yellow'],
        required: true,
      },
      value20_30: {
        type: String,
        minLength: 20,
        maxLength: 30,
      },
      value: { type: String, match: /^(?:H|h)ello, .+$/ },
    }, { id: false, _id: false });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        valueFromList: {
          type: 'string',
          enum: ['red', 'green', 'yellow'],
        },
        value20_30: {
          type: 'string',
          minLength: 20,
          maxLength: 30,
        },
        value: {
          type: 'string',
          pattern: '^(?:H|h)ello, .+$',
        },
      },
      required: ['valueFromList'],
    });
  });

  it('should correctly translate string value constaints with error message', () => {
    const mSchema = new Schema({
      valueFromList: {
        type: String,
        enum: ['red', 'green', 'yellow'],
        required: true,
      },
      value20_30: {
        type: String,
        minLength: [20, 'Value should have at least 20 characters'],
        maxLength: [30, 'Value should not be longer then 30 characters'],
      },
      value: { type: String, match: [/^(?:H|h)ello, .+$/, 'Value should start from greating'] },
    }, { id: false, _id: false });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        valueFromList: {
          type: 'string',
          enum: ['red', 'green', 'yellow'],
        },
        value20_30: {
          type: 'string',
          minLength: 20,
          maxLength: 30,
        },
        value: {
          type: 'string',
          pattern: '^(?:H|h)ello, .+$',
        },
      },
      required: ['valueFromList'],
    });
  });

  it('should correctly translate string value constaints (minlength and maxlength)', () => {
    const mSchema = new Schema({
      valueFromList: {
        type: String,
        enum: ['red', 'green', 'yellow'],
        required: true,
      },
      value20_30: {
        type: String,
        minlength: 20,
        maxlength: 30,
      },
      value: { type: String, match: /^(?:H|h)ello, .+$/ },
    }, { id: false, _id: false });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        valueFromList: {
          type: 'string',
          enum: ['red', 'green', 'yellow'],
        },
        value20_30: {
          type: 'string',
          minLength: 20,
          maxLength: 30,
        },
        value: {
          type: 'string',
          pattern: '^(?:H|h)ello, .+$',
        },
      },
      required: ['valueFromList'],
    });
  });

  it('should correctly translate Mixed type', () => {
    const mSchema = new Schema({
      m: Schema.Types.Mixed,
    });

    const jsonSchema = mSchema.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        m: { },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should correctly transform Map type (String)', () => {
    const mS = new Schema({
      m: { type: Map, of: String },
    });

    const jsonSchema = mS.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        m: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should correctly transform Map type (String, required: false)', () => {
    const mS = mongoose.Schema({
      name: { type: String },
      language: {
        type: Map,
        of: { type: String },
      },
    });

    const jsonSchema = mS.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        name: { type: 'string' },
        language: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should correctly transform Map type (Mixed)', () => {
    const mS = new Schema({
      m: Map,
    });

    const jsonSchema = mS.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        m: {
          type: 'object',
          additionalProperties: { type: {} },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should correctly transform Map type (SubSchema)', () => {
    const mS = new Schema({
      m: {
        type: Map,
        of: new Schema({
          x: Number,
          y: String,
        }, { _id: false }),
      },
    });

    const jsonSchema = mS.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        m: {
          type: 'object',
          additionalProperties: {
            title: 'itemOf_m',
            type: 'object',
            properties: { x: { type: 'number' }, y: { type: 'string' } },
          },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should correctly transform additionalProperties boolean', () => {
    const mS = new Schema({
      m: {
        type: Map,
        additionalProperties: true
      },
    });

    const jsonSchema = mS.jsonSchema('Sample');

    assert.deepEqual(jsonSchema, {
      title: 'Sample',
      type: 'object',
      properties: {
        m: {
          type: 'object',
          additionalProperties: true
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });
});
