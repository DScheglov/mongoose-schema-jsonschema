'use strict';

var mongoose = require('../../index')(require('mongoose'));
var validate = require('jsonschema').validate;
var assert = require('assert');

var models = require('../models');


describe('Validation: schema.jsonSchema()', function() {

  it ('should build schema and validate numbers', function () {
    var mSchema = new mongoose.Schema({
      n: {type: Number, min: 0, max: 10}
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

    var errors;
    errors = validate({n: 3}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({n: 0}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({n: 10}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({n: -1}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({n: 13}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({n: 'a'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({}, jsonSchema).errors;
    assert.equal(errors.length, 0);

  });

  it ('should build schema and validate strings by length', function () {

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

    var errors;
    errors = validate({s: 'abc'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    var errors;
    errors = validate({s: 'abcd'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    var errors;
    errors = validate({s: 'abcde'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    var errors;
    errors = validate({s: 'ab'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    var errors;
    errors = validate({s: ''}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    var errors;
    errors = validate({s: 'abcdef'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    var errors;
    errors = validate({s: new Date()}, jsonSchema).errors;
    assert.equal(errors.length, 1);

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

    var errors;
    errors = validate({s: 'abc'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({s: 'bac'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({s: 'cab'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({s: 'bca'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({s: 'acb'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({s: 123}, jsonSchema).errors;
    assert.equal(errors.length, 2);

    errors = validate({s: ''}, jsonSchema).errors;
    assert.equal(errors.length, 1);

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

    var errors;
    errors = validate({s: '(abc|bac|cab)'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({s: 'abc'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({s: 'ABC'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({s: 'cba'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({s: ''}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({s: 12}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({_id: '^[0-9a-fA-F]{24}$'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({_id: 'Hello World'}, jsonSchema).errors;
    assert.equal(errors.length, 1)

    errors = validate({_id: '564e0da0105badc887ef1d3e'}, jsonSchema).errors;
    assert.equal(errors.length, 0)

  });

  it ('should build schema and validate strings with regExp', function () {

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

    var errors;
    errors = validate({s: 'Hello world!'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({s: '(abc|bac|cab)'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({s: 'abc'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({s: 'ABC'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({s: 'cba'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({s: ''}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({s: 12}, jsonSchema).errors;
    assert.equal(errors.length, 1);


    errors = validate({_id: '564e0da0105badc887ef1d3e'}, jsonSchema).errors;
    assert.equal(errors.length, 0)

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

    var errors;
    errors = validate({a: [0, 1]}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({a: [0]}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({a: []}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({a: [0, 1, 'a']}, jsonSchema).errors;
    assert.equal(errors.length, 1);

  });

  it ('should build schema and validate numbers', function () {
    var mSchema = new mongoose.Schema({
      n: {type: Number, min: 0, max: 10}
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

    var errors;
    errors = validate({n: 3}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({n: 0}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({n: 10}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({n: -1}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({n: 13}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({n: 'a'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({}, jsonSchema).errors;
    assert.equal(errors.length, 0);

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

    var errors;
    errors = validate({m: 3}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: null}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: {} }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: 'Hello world'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: ''}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: true}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: false}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: '13234'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

  });

  it ('should build schema and validate mixed with description', function () {

    var mSchema = new mongoose.Schema({
      m: {
        type: mongoose.Schema.Types.Mixed,
        descr: 'some mixed content here',
        required: true,
        default: {} }
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: {
          description: 'some mixed content here'
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      },
      required: ['m']
    });

    var errors;
    errors = validate({m: 3}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: null}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: {} }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: 'Hello world'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: ''}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: true}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: false}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ }, jsonSchema).errors;
    assert.equal(errors.length, 1);

    errors = validate({ s: '13234'}, jsonSchema).errors;
    assert.equal(errors.length, 1);

  });

  it ('should build schema and validate mixed with description and title', function () {

    var mSchema = new mongoose.Schema({
      m: {
        title: 'MegaField',
        type: mongoose.Schema.Types.Mixed,
        descr: 'some mixed content here',
        default: {} }
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        m: {
          title: 'MegaField',
          description: 'some mixed content here'
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });

    var errors;
    errors = validate({m: 3}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: null}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: {} }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: 'Hello world'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: ''}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: true}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({m: false}, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ }, jsonSchema).errors;
    assert.equal(errors.length, 0);

    errors = validate({ s: '13234'}, jsonSchema).errors;
    assert.equal(errors.length, 0);

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
    var aPerson = new models.Person(validPerson);
    assert.ok(!aPerson.validateSync());
    assert.equal(validate(validPerson, jsonSchema).errors.length, 0);

  });

  it ('should process flat schema and -- mark invalid entity', function () {
    var jsonSchema = models.Person.jsonSchema();

    var invalidPerson = {
      firstName: 'John',
      lastName: 'Smith',
      email: 12
    };
    var aPerson = new models.Person(invalidPerson);
    assert.ok(aPerson.validateSync());
    assert.equal(validate(invalidPerson, jsonSchema).errors.length, 1);

  });


});
