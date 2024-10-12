const mongoose = require('../../index')(require('mongoose'));
const { validate } = require('jsonschema');
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

    let errors;
    errors = validate({ n: 3 }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ n: 0 }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ n: 10 }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ n: -1 }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ n: 13 }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ n: 'a' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({}, jsonSchema).errors;
    assert.equal(errors.length, 0);
  });

  it('should build schema and validate strings by length', () => {
    let errors;

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

    errors = validate({ s: 'abc' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ s: 'abcd' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ s: 'abcde' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ s: 'ab' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: '' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: 'abcdef' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: new Date() }, jsonSchema).errors;
    assert.equal(errors.length, 1);
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

    let errors;
    errors = validate({ s: 'abc' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ s: 'bac' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ s: 'cab' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ s: 'bca' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: 'acb' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: 123 }, jsonSchema).errors;
    assert.equal(errors.length, 2);

    errors = validate({ s: '' }, jsonSchema).errors;
    assert.equal(errors.length, 1);
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

    let errors;
    errors = validate({ s: '(abc|bac|cab)' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: 'abc' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ s: 'ABC' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: 'cba' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: '' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: 12 }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ _id: '^[0-9a-fA-F]{24}$' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ _id: 'Hello World' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ _id: '564e0da0105badc887ef1d3e' }, jsonSchema).errors;
    assert.equal(errors.length, 0);
  });

  it('should build schema and validate strings with regExp (Hello world)', () => {
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

    let errors;
    errors = validate({ s: 'Hello world!' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ s: '(abc|bac|cab)' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: 'abc' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: 'ABC' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: 'cba' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: '' }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: 12 }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ _id: '564e0da0105badc887ef1d3e' }, jsonSchema).errors;
    assert.equal(errors.length, 0);
  });

  it('should build schema and validate arrays with**out** minItems constraint', () => {
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
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });

    let errors;
    errors = validate({ a: [0, 1] }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ a: [0] }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ a: [] }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ a: [0, 1, 'a'] }, jsonSchema).errors;
    assert.equal(errors.length, 1);
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

    let errors;
    errors = validate({ m: 3 }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: null }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: {} }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: 'Hello world' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: '' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: true }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: false }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: '13234' }, jsonSchema).errors;
    assert.equal(errors.length, 1);
  });

  it('should build schema and validate mixed with description', () => {
    const mSchema = new mongoose.Schema({
      m: {
        type: mongoose.Schema.Types.Mixed,
        descr: 'some mixed content here',
        required: true,
        default: {},
      },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: {
          description: 'some mixed content here',
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
      required: ['m'],
    });

    let errors;
    errors = validate({ m: 3 }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: null }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: {} }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: 'Hello world' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: '' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: true }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: false }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: '13234' }, jsonSchema).errors;
    assert.equal(errors.length, 1);
  });

  it('should build schema and validate mixed with description and title', () => {
    const mSchema = new mongoose.Schema({
      m: {
        title: 'MegaField',
        type: mongoose.Schema.Types.Mixed,
        descr: 'some mixed content here',
        default: {},
      },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: {
          title: 'MegaField',
          description: 'some mixed content here',
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });

    let errors;
    errors = validate({ m: 3 }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: null }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: {} }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: 'Hello world' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: '' }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: true }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ m: false }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ s: '13234' }, jsonSchema).errors;
    assert.equal(errors.length, 0);
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

    let errors;
    errors = validate({ y: 3 }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ y: 3, x: null }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ y: 3, x: 2 }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ y: null }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ x: null }, jsonSchema).errors;
    assert.equal(errors.length, 0);
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

    const isValid = data => validate(data, jsonSchema).errors.length === 0;

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

    const isValid = data => validate(data, jsonSchema).errors.length === 0;

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
    const aPerson = new models.Person(validPerson);
    assert.ok(!aPerson.validateSync());
    assert.equal(validate(validPerson, jsonSchema).errors.length, 0);
  });

  it('should process flat schema and -- mark invalid entity', () => {
    const jsonSchema = models.Person.jsonSchema();

    const invalidPerson = {
      firstName: 'John',
      lastName: 'Smith',
      email: 12,
    };
    const aPerson = new models.Person(invalidPerson);
    assert.ok(aPerson.validateSync());
    assert.equal(validate(invalidPerson, jsonSchema).errors.length, 1);
  });
});
