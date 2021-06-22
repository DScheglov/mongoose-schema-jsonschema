const mongoose = require('../../index')(require('mongoose'));
const Ajv = require('ajv');
const assert = require('assert');

const models = require('../models');

describe('Validation: schema.jsonSchema()', () => {
  it('should build schema and validate numbers', () => {
    const mSchema = new mongoose.Schema({
      n: { type: Number, min: 0, max: 10 },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        n: {
          type: 'number',
          minimum: 0,
          maximum: 10,
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ n: 3 }));
    assert.ok(isValid({ n: 0 }));
    assert.ok(isValid({ n: 10 }));
    assert.ok(!isValid({ n: -1 }));
    assert.ok(!isValid({ n: 13 }));
    assert.ok(!isValid({ n: 'a' }));
    assert.ok(isValid({ }));
  });

  it('should build schema and validate strings by length', () => {
    const mSchema = new mongoose.Schema({
      s: { type: String, minLength: 3, maxLength: 5 },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        s: {
          type: 'string',
          minLength: 3,
          maxLength: 5,
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ s: 'abc' }));
    assert.ok(isValid({ s: 'abcd' }));
    assert.ok(isValid({ s: 'abcde' }));
    assert.ok(!isValid({ s: 'ab' }));
    assert.ok(!isValid({ s: '' }));
    assert.ok(!isValid({ s: 'abcdef' }));
    assert.ok(!isValid({ s: new Date() }));
    assert.ok(isValid({ }));
  });

  it('should build schema and validate strings with enum', () => {
    const mSchema = new mongoose.Schema({
      s: { type: String, enum: ['abc', 'bac', 'cab'] },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        s: {
          type: 'string',
          enum: ['abc', 'bac', 'cab'],
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ s: 'abc' }));
    assert.ok(isValid({ s: 'bac' }));
    assert.ok(isValid({ s: 'cab' }));
    assert.ok(!isValid({ s: 'bca' }));
    assert.ok(!isValid({ s: 'acb' }));
    assert.ok(!isValid({ s: 123 }));
    assert.ok(!isValid({ s: '' }));
  });

  it('should build schema and validate strings with regExp', () => {
    const mSchema = new mongoose.Schema({
      s: { type: String, match: /^(abc|bac|cab)$/ },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        s: {
          type: 'string',
          pattern: '^(abc|bac|cab)$',
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(!isValid({ s: '(abc|bac|cab)' }));
    assert.ok(isValid({ s: 'abc' }));
    assert.ok(!isValid({ s: 'ABC' }));
    assert.ok(!isValid({ s: 'cba' }));
    assert.ok(!isValid({ s: '' }));
    assert.ok(!isValid({ s: 12 }));
    assert.ok(!isValid({ _id: '^[0-9a-fA-F]{24}$' }));
    assert.ok(!isValid({ _id: 'Hello world' }));
    assert.ok(isValid({ _id: '564e0da0105badc887ef1d3e' }));
  });

  it('should build schema and validate strings with regExp (as string constant)', () => {
    const mSchema = new mongoose.Schema({
      s: { type: String, match: 'Hello world!' },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        s: {
          type: 'string',
          pattern: 'Hello world!',
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ s: 'Hello world!' }));
    assert.ok(!isValid({ s: '(abc|bac|cab)' }));
    assert.ok(!isValid({ s: 'abc' }));
    assert.ok(!isValid({ s: 'ABC' }));
    assert.ok(!isValid({ s: 'cba' }));
    assert.ok(!isValid({ s: '' }));
    assert.ok(!isValid({ s: 12 }));
    assert.ok(!isValid({ _id: '^[0-9a-fA-F]{24}$' }));
    assert.ok(!isValid({ _id: 'Hello world!' }));
    assert.ok(isValid({ _id: '564e0da0105badc887ef1d3e' }));
  });

  it('should build schema and validate arrays with minItems constraint', () => {
    const mSchema = mongoose.Schema({
      a: [{
        type: Number,
        required: true,
      }],
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        a: {
          type: 'array',
          items: { type: 'number' },
          minItems: 1,
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ a: [0, 1] }));
    assert.ok(isValid({ a: [0] }));
    assert.ok(isValid({ }));
    assert.ok(!isValid({ a: [] }));
    assert.ok(!isValid({ a: [0, 1, 'a'] }));
  });

  it('should build schema and validate mixed', () => {
    const mSchema = new mongoose.Schema({
      m: { type: mongoose.Schema.Types.Mixed, required: true, default: {} },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: { },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
      required: ['m'],
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ m: 3 }));
    assert.ok(isValid({ m: null }));
    assert.ok(isValid({ m: { } }));
    assert.ok(isValid({ m: 'Hello world' }));
    assert.ok(isValid({ m: '' }));
    assert.ok(isValid({ m: true }));
    assert.ok(isValid({ m: false }));

    assert.ok(!isValid({ }));
    assert.ok(!isValid({ s: '13234' }));
  });

  it('should build schema and validate mixed with description', () => {
    const mSchema = new mongoose.Schema({
      m: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        description: 'Some mixed content here',
        default: {},
      },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: {
          description: 'Some mixed content here',
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
      required: ['m'],
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ m: 3 }));
    assert.ok(isValid({ m: null }));
    assert.ok(isValid({ m: { } }));
    assert.ok(isValid({ m: 'Hello world' }));
    assert.ok(isValid({ m: '' }));
    assert.ok(isValid({ m: true }));
    assert.ok(isValid({ m: false }));

    assert.ok(!isValid({ }));
    assert.ok(!isValid({ s: '13234' }));
  });

  it('should build schema and validate mixed with description and title', () => {
    const mSchema = new mongoose.Schema({
      m: {
        type: mongoose.Schema.Types.Mixed,
        title: 'MegaField',
        description: 'Some mixed content here',
        default: {},
      },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: {
          title: 'MegaField',
          description: 'Some mixed content here',
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ m: 3 }));
    assert.ok(isValid({ m: null }));
    assert.ok(isValid({ m: { } }));
    assert.ok(isValid({ m: 'Hello world' }));
    assert.ok(isValid({ m: '' }));
    assert.ok(isValid({ m: true }));
    assert.ok(isValid({ m: false }));

    assert.ok(isValid({ }));
    assert.ok(isValid({ s: '13234' }));
  });

  it('should work with nullable types', () => {
    const mSchema = new mongoose.Schema({
      x: { type: Number, default: null },
      y: { type: Number, default: 1 },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        x: { type: ['number', 'null'], default: null },
        y: { type: 'number', default: 1 },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ y: 3 }));
    assert.ok(isValid({ y: 3, x: null }));
    assert.ok(isValid({ y: 3, x: 2 }));
    assert.ok(isValid({ }));
    assert.ok(isValid({ x: null }));

    assert.ok(!isValid({ y: null }));
  });

  it('should build schema and validate Map types', () => {
    const mSchema = new mongoose.Schema({
      m: { type: Map, required: true },
    }, { _id: false });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: {
          type: 'object',
          additionalProperties: true,
        },
      },
      required: ['m'],
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ m: { x: 1, y: 'string' } }));
    assert.ok(isValid({ m: { } }));

    assert.ok(!isValid({ y: null }));
  });

  it('should build schema and validate Map types (with subschema)', () => {
    const mSchema = new mongoose.Schema({
      m: { type: Map, required: true, of: { type: String } },
    }, { _id: false });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
      },
      required: ['m'],
    });

    const ajv = new Ajv();
    const isValid = data => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ m: { x: 'x', y: 'y' } }));
    assert.ok(isValid({ m: { } }));

    assert.ok(!isValid({ m: { x: 1, y: 'string' } }));
    assert.ok(!isValid({ y: null }));
  });
});

describe('Validation: model.jsonSchema()', () => {
  it('should process flat schema and -- validate correct entity', () => {
    const jsonSchema = models.Person.jsonSchema();

    const validPerson = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@mail.net',
    };
    const ajv = new Ajv();
    const aPerson = new models.Person(validPerson);
    assert.ok(!aPerson.validateSync());
    assert.ok(ajv.validate(jsonSchema, validPerson));
  });

  it('should process flat schema and -- mark invalid entity (wrong field type)', () => {
    const jsonSchema = models.Person.jsonSchema();

    const invalidPerson = {
      firstName: 'John',
      lastName: 'Smith',
      email: 12,
    };
    const ajv = new Ajv();
    const aPerson = new models.Person(invalidPerson);
    assert.ok(aPerson.validateSync());
    assert.ok(!ajv.validate(jsonSchema, invalidPerson));
  });

  it('should process flat schema and -- mark invalid entity (required field missed)', () => {
    const jsonSchema = models.Person.jsonSchema();

    const invalidPerson = {
      lastName: 'Smith',
      email: 'john.smith@mail.com',
    };
    const ajv = new Ajv();
    const aPerson = new models.Person(invalidPerson);
    assert.ok(aPerson.validateSync());
    assert.ok(!ajv.validate(jsonSchema, invalidPerson));
  });
});
