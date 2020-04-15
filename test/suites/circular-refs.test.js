
const mongoose = require('../../index')(require('mongoose'));
const assert = require('assert');


describe('Circular refs: Schema.jsonSchema()', () => {
  it('should replace schema with $ref to it', () => {
    const mSchema = new mongoose.Schema({
      title: String,
    });
    mSchema.add({ child: mSchema });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      id: '#schema-1',
      type: 'object',
      properties: {
        title: { type: 'string' },
        child: { $ref: '#schema-1' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });
});
