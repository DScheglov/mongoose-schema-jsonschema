const mongoose = require('../../index')(require('mongoose'));
const config = require('../../config');

const { Schema } = mongoose;

describe('Custom Field Options Mapping', () => {
  it('should be possible to configure mapping', () => {
    const description = 'Some Descriptions';
    const mSchema = new Schema({
      s: {
        type: String,
        required: true,
        description,
      },
    });

    config({
      fieldOptionsMapping: {
        description: 'x-notes',
      },
    });

    expect(mSchema.jsonSchema()).toEqual({
      type: 'object',
      properties: {
        s: {
          type: 'string',
          description,
          'x-notes': description,
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
      required: ['s'],
    });
  });
});
