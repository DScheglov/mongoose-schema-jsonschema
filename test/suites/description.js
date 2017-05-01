'use strict';

var mongoose = require('../../index')(require('mongoose'));
var assert = require('assert');


describe('Description: Schema.jsonSchema()', function() {

  it('should add description when it is specified (as description)', function () {

    var aDescrription = 'Just a string field';

    var mSchema = new mongoose.Schema({
      s: {
        type: String,
        required: true,
        description: aDescrription
      }
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.equal(jsonSchema.properties.s.description, aDescrription);

  });

  it('should add description when it is specified (as descr)', function () {

    var aDescrription = 'Just a string field';

    var mSchema = new mongoose.Schema({
      s: {
        type: String,
        required: true,
        descr: aDescrription
      }
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.equal(jsonSchema.properties.s.description, aDescrription);

  });

  it('should add title when it is specified', function () {

    var mSchema = new mongoose.Schema({
      s: {
        title: 'S',
        type: String,
        required: true
      }
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.equal(jsonSchema.properties.s.title, 'S');

  });


  it('should add title when it is specified', function () {

    var mSchema = new mongoose.Schema({
      s: {
        title: 'S',
        type: mongoose.Schema.Types.Mixed,
        required: true,
        descr: 'mixed content'
      }
    }, { _id: null });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        s: {
          description: 'mixed content',
          title: 'S'
        }
      },
      required: [ 's' ]
    });

  });

  it('should add description for array', function () {

    var mSchema = new mongoose.Schema({
      name: String,
      inputs: {
        type: [String], 
        index: true, 
        description: 'Information operated on by rule'
      },
      outputs: {
        type: [String],
        description: 'Information produced by rule'
      },
    });

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        name: { type: 'string' },
        inputs: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Information operated on by rule'
        },
        outputs: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Information produced by rule'
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' } 
      } 
    })

  });

});
