const mongoose = require('../../index')(require('mongoose'));

const { Schema } = mongoose;
const assert = require('assert');

describe('Required fields: schema.jsonSchema', () => {
  it('should correctly translate field requirement', () => {
    const bookSchema = new Schema({
      name: {
        type: String,
        required() {
          return this.year > 2000;
        },
      },
      year: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
      },
      internalName: {
        type: String,
        required: [true, 'Internal name is required'],
      },
      author: {
        type: String,
        required: [
          function () {
            return this.year > 2000;
          },
          'Author is required if year > 2000',
        ],
      },
    }, { _id: false });

    const jsonSchema = bookSchema.jsonSchema('book');

    assert.deepEqual(jsonSchema, {
      title: 'book',
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        year: {
          type: 'number',
        },
        description: {
          type: 'string',
        },
        internalName: {
          type: 'string',
        },
        author: {
          type: 'string',
        },
      },
      required: [
        'year',
        'internalName',
      ],
    });
  });
});
