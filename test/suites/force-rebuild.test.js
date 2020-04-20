const { Schema } = require('../../index')(require('mongoose'));
const config = require('../../config');

describe('Force rebuild', () => {
  it('should cache by default', () => {
    const description = 'Some Descriptions';
    const mSchema = new Schema({
      s: {
        type: String,
        required: true,
        description,
      },
    });

    const jsonSchema = mSchema.jsonSchema();
    mSchema.add({ t: Number });

    expect(mSchema.jsonSchema()).toEqual(jsonSchema);
  });

  it('should be able to rebuild schema', () => {
    const description = 'Some Descriptions';
    const mSchema = new Schema({
      s: {
        type: String,
        required: true,
        description,
      },
    });

    const jsonSchema = mSchema.jsonSchema();
    mSchema.add({ t: Number });

    config({ forceRebuild: true });

    const newJsonSchema = mSchema.jsonSchema();
    expect(newJsonSchema).not.toEqual(jsonSchema);
    expect(newJsonSchema).toEqual({
      type: 'object',
      properties: {
        s: {
          type: 'string',
          description,
        },
        t: { type: 'number' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
      required: ['s'],
    });
  });
});
