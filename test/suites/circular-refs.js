'use strict';

var mongoose = require('../../index')(require('mongoose'));
var assert = require('assert');


describe('Circular refs: Schema.jsonSchema()', function() {

  it('should replace schema with $ref to it', function () {

    var mSchema = new mongoose.Schema({
      title: String
    });
    mSchema.add({child: mSchema});

    var jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      id: '#schema-1',
      type: 'object',
      properties: {
        title: {type: 'string'},
        child: {$ref: '#schema-1'},
        _id: {type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    })

  });

});
