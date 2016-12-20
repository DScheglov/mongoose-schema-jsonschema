'use strict';

var mongoose = require('../../index')(require('mongoose'));
var validate = require('jsonschema').validate;
var assert = require('assert');

var models = require('../models');

describe('Field selection: model.jsonSchema()', function() {

  it('should build schema for fields pointed explicitly (string)', function() {

    var jsonSchema = models.Book.jsonSchema('title year');
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    });

  });

  it('should build schema for fields pointed explicitly (array)', function() {

    var jsonSchema = models.Book.jsonSchema(['title','year']);
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    });

  });

  it('should build schema for fields pointed explicitly (object)', function() {

    var jsonSchema = models.Book.jsonSchema({title: 1, year: true});
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    });

  });

  it('should build schema for fields pointed explicitly, excluding _id (string)', function() {

    var jsonSchema = models.Book.jsonSchema('title year -_id');
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' }
      }
    })

  });

  it('should build schema for fields pointed explicitly, excluding _id (array)', function() {

    var jsonSchema = models.Book.jsonSchema(['title','year', '-_id']);
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' }
      }
    })

  });

  it('should build schema for fields pointed explicitly, excluding _id (object)', function() {

    var jsonSchema = models.Book.jsonSchema({title: 1, year: true, _id: 0});
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' }
      }
    })

  });

  it('should build schema excluding pointed fields (string)', function() {

    var jsonSchema = models.Book.jsonSchema(
      '-author -comment -official -publisher -description -__v'
    );
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    });

  });

  it('should build schema excluding pointed fields (array)', function() {

    var jsonSchema = models.Book.jsonSchema([
      '-author', '-comment', '-official', '-publisher', '-description', '-__v'
    ]);
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    });

  });

  it('should build schema excluding pointed fields (object)', function() {

    var jsonSchema = models.Book.jsonSchema({
      author: false,
      comment: false,
      official: false,
      publisher: false,
      description: false,
      __v: false
    });
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    });

  });

  it('should build schema for fields of nested objects (string)', function() {

    var jsonSchema = models.Book.jsonSchema('title official.slogan');

    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        official: {
          title: 'official',
          type: 'object',
          properties: {
            slogan: { type: 'string' }
          }
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    });

  });

  it('should build schema for fields of nested array (string)', function() {

    var jsonSchema = models.Book.jsonSchema('title comment.body');
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        comment: {
          type: 'array',
          items: {
            title: 'itemOf_comment',
            type: 'object',
            properties: {
              body: { type: 'string' }
            }
          }
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    });

  });


  it('should build schema for fields of nested array explicitly included by array name (string)', function() {

    var jsonSchema = models.Book.jsonSchema('title comment');

    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        comment: {
          type: 'array',
          items: {
            title: 'itemOf_comment',
            type: 'object',
            properties: {
              body: { type: 'string' },
              editor: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                'x-ref': 'Person',
                description: 'Refers to Person'
              },
              _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
            }
          }
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    });

  });

  it('should build schema for fields of nested array explicitly included by array name (string) and excluding some nested field', function() {

    var jsonSchema = models.Book.jsonSchema('title comment -comment._id');

    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        comment: {
          type: 'array',
          items: {
            title: 'itemOf_comment',
            type: 'object',
            properties: {
              body: { type: 'string' },
              editor: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                'x-ref': 'Person',
                description: 'Refers to Person'
              }
            }
          }
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    });

  });

  it('should correctly process fields deselected on schema-level', function() {

    var mSchema = new mongoose.Schema({
      x: Number,
      y: {type: Number, required: true, select: false}
    });

    var aModel = mongoose.model('aModel', mSchema);

    var jsonSchema = aModel.jsonSchema('x y');

    assert.deepEqual(jsonSchema, {
      title: 'aModel',
      type: 'object',
      properties: {
        x: {type: 'number'},
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    })

  });

  it('should correctly process overriding of deselection on schema-level', function() {

    var mSchema = new mongoose.Schema({
      x: Number,
      y: {type: Number, required: true, select: false}
    });

    var zModel = mongoose.model('zModel', mSchema);

    var jsonSchema = zModel.jsonSchema('x +y');

    assert.deepEqual(jsonSchema, {
      title: 'zModel',
      type: 'object',
      properties: {
        x: {type: 'number'},
        y: {type: 'number'},
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
      }
    });

  });

  it('should correctly process id field selection (virtuals)', function() {

    var mSchema = new mongoose.Schema({
      x: Number
    }, {
      toJSON: {virtuals: true}
    });

    var zModel = mongoose.model('z1Model', mSchema);

    var jsonSchema = zModel.jsonSchema('x +y -_id id');

    assert.deepEqual(jsonSchema, {
      title: 'z1Model',
      type: 'object',
      properties: {
        x: {type: 'number'},
        id: { }
      }
    });

  });

  it('should correctly process id field selection (getters)', function() {

    var mSchema = new mongoose.Schema({
      x: Number
    }, {
      toJSON: {getters: true}
    });

    var zModel = mongoose.model('z2Model', mSchema);

    var jsonSchema = zModel.jsonSchema('x +y id');

    assert.deepEqual(jsonSchema, {
      title: 'z2Model',
      type: 'object',
      properties: {
        x: {type: 'number'},
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        id: { }
      }
    });

  });

});
