'use strict';

var mongoose = require('../../index')(require('mongoose'));
var assert = require('assert');

var Generic = mongoose.model('Generic', new mongoose.Schema({
  title: String,
  value: String
}));

var Tagged = Generic.discriminator('Tagged', new mongoose.Schema({
  tags: [String]
}));

describe('Discriminators: Model.jsonSchema()', function () {

  it('should build schema for discriminator', function () {
    var jsonSchema = Tagged.jsonSchema();
    assert.deepEqual(jsonSchema, {
      title: 'Tagged',
      type: 'object',
      properties: {
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        title: { type: 'string' },
        value: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        __v: { type: 'number' },
        __t: { type: 'string', default: 'Tagged' }
      }
    });
  });

  it('should consider the field selection', function () {
    var jsonSchema = Tagged.find({}, 'title tags -_id').jsonSchema();
    assert.deepEqual(jsonSchema, {
      title: 'List of Taggeds',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        }
      }
    });
  });

});
