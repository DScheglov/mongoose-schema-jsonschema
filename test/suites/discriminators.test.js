const mongoose = require('../../index')(require('mongoose'));
const assert = require('assert');

const Generic = mongoose.model('Generic', new mongoose.Schema({
  title: String,
  value: String,
}));

const Tagged = Generic.discriminator('Tagged', new mongoose.Schema({
  tags: [String],
}));

describe('Discriminators: Model.jsonSchema()', () => {
  it('should build schema for discriminator', () => {
    const jsonSchema = Tagged.jsonSchema();
    assert.deepEqual(jsonSchema, {
      title: 'Tagged',
      type: 'object',
      properties: {
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        title: { type: 'string' },
        value: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        __v: { type: 'number' },
        __t: { type: 'string', default: 'Tagged' },
      },
    });
  });

  it('should consider the field selection', () => {
    const jsonSchema = Tagged.find({}, 'title tags -_id').jsonSchema();
    assert.deepEqual(jsonSchema, {
      title: 'List of Taggeds',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    });
  });
});
