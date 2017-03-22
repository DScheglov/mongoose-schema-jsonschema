'use strict';

var mongoose = require('../../index')(require('mongoose'));
var Ajv = require('ajv');
var assert = require('assert');

var models = require('../models');


describe('Validation: schema.jsonSchema()', function() {

  it ('should build schema and validate numbers', function () {
    var mSchema = new mongoose.Schema({
      n: { type: Number, min: 0, max: 10 }
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        n: {
          type: 'number',
          minimum: 0,
          maximum: 10
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });

    var ajv = new Ajv();
    var isValid = (data) => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ n: 3 }));
    assert.ok(isValid({ n: 0 }));
    assert.ok(isValid({ n: 10 }));
    assert.ok(!isValid({ n: -1 }));
    assert.ok(!isValid({ n: 13 }));
    assert.ok(!isValid({ n: 'a' }));
    assert.ok(isValid({ }));

  });

  it('should build schema and validate strings by length', function () {

    var mSchema = new mongoose.Schema({
      s: {type: String, minLength: 3, maxLength: 5}
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        s: {
          type: 'string',
          minLength: 3,
          maxLength: 5
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });

    var ajv = new Ajv();
    var isValid = (data) => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ s: 'abc' }));
    assert.ok(isValid({ s: 'abcd' }));
    assert.ok(isValid({ s: 'abcde' }));
    assert.ok(!isValid({ s: 'ab' }));
    assert.ok(!isValid({ s: '' }));
    assert.ok(!isValid({ s: 'abcdef' }));
    assert.ok(!isValid({ s: new Date() }));
    assert.ok(isValid({ }));

  });

  it ('should build schema and validate strings with enum', function () {

    var mSchema = new mongoose.Schema({
      s: {type: String, enum: ['abc', 'bac', 'cab']}
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        s: {
          type: 'string',
          enum: ['abc', 'bac', 'cab']
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });

    var ajv = new Ajv();
    var isValid = (data) => ajv.validate(jsonSchema, data);

    assert.ok(isValid({ s: 'abc' }));
    assert.ok(isValid({ s: 'bac' }));
    assert.ok(isValid({ s: 'cab' }));
    assert.ok(!isValid({ s: 'bca' }));
    assert.ok(!isValid({ s: 'acb' }));
    assert.ok(!isValid({ s: 123 }));
    assert.ok(!isValid({ s: '' }));

  });

  it ('should build schema and validate strings with regExp', function () {

    var mSchema = new mongoose.Schema({
      s: {type: String, match: /^(abc|bac|cab)$/}
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        s: {
          type: 'string',
          pattern: '^(abc|bac|cab)$'
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });

    var ajv = new Ajv();
    var isValid = (data) => ajv.validate(jsonSchema, data);

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

  it ('should build schema and validate strings with regExp (as string constant)', function () {

    var mSchema = new mongoose.Schema({
      s: {type: String, match: 'Hello world!'}
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        s: {
          type: 'string',
          pattern: 'Hello world!'
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });

    var ajv = new Ajv();
    var isValid = (data) => ajv.validate(jsonSchema, data);

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

  it ('should build schema and validate arrays with minItems constraint', function() {

    var mSchema = mongoose.Schema({
      a: [{
          type: Number,
          required: true
        }]
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        a: {
          type: 'array',
          items: { type: 'number' },
          minItems: 1
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });

    var ajv = new Ajv();
    var isValid = (data) => ajv.validate(jsonSchema, data);

    assert.ok(isValid({a: [0, 1]}));
    assert.ok(isValid({a: [0]}));
    assert.ok(isValid({ }));
    assert.ok(!isValid({a: [] }));
    assert.ok(!isValid({a: [0, 1, 'a'] }));
  });

  it ('should build schema and validate mixed', function () {
    var mSchema = new mongoose.Schema({
      m: { type: mongoose.Schema.Types.Mixed, required: true, default: {} }
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: { },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      },
      required: ['m']
    });

    var ajv = new Ajv();
    var isValid = (data) => ajv.validate(jsonSchema, data);

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

  it ('should build schema and validate mixed with description', function () {
    var mSchema = new mongoose.Schema({
      m: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        description: 'Some mixed content here',
        default: {}
      }
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: {
          description: 'Some mixed content here'
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      },
      required: ['m']
    });

    var ajv = new Ajv();
    var isValid = (data) => ajv.validate(jsonSchema, data);

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

  it ('should build schema and validate mixed with description and title', function () {
    var mSchema = new mongoose.Schema({
      m: {
        type: mongoose.Schema.Types.Mixed,
        title: 'MegaField',
        description: 'Some mixed content here',
        default: {}
      }
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: {
          title: 'MegaField',
          description: 'Some mixed content here'
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });

    var ajv = new Ajv();
    var isValid = (data) => ajv.validate(jsonSchema, data);

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

});

describe('Validation: model.jsonSchema()', function() {

  it ('should process flat schema and -- validate correct entity', function () {
    var jsonSchema = models.Person.jsonSchema();

    var validPerson = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@mail.net'
    };
    var ajv = new Ajv();
    var aPerson = new models.Person(validPerson);
    assert.ok(!aPerson.validateSync());
    assert.ok(ajv.validate(jsonSchema, validPerson));

  });

  it ('should process flat schema and -- mark invalid entity (wrong field type)', function () {
    var jsonSchema = models.Person.jsonSchema();

    var invalidPerson = {
      firstName: 'John',
      lastName: 'Smith',
      email: 12
    };
    var ajv = new Ajv();
    var aPerson = new models.Person(invalidPerson);
    assert.ok(aPerson.validateSync());
    assert.ok(!ajv.validate(jsonSchema, invalidPerson));
  });

  it ('should process flat schema and -- mark invalid entity (required field missed)', function () {
    var jsonSchema = models.Person.jsonSchema();

    var invalidPerson = {
      lastName: 'Smith',
      email: 'john.smith@mail.com'
    };
    var ajv = new Ajv();
    var aPerson = new models.Person(invalidPerson);
    assert.ok(aPerson.validateSync());
    assert.ok(!ajv.validate(jsonSchema, invalidPerson));
  });

});
