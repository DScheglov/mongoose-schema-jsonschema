const mongoose = require('../../index')(require('mongoose'));

const { Schema } = mongoose;
const assert = require('assert');

describe('schema.jsonSchema', () => {
  it('should correctly translate all simmple types', () => {
    const bookSchema = new Schema({
      name: {
        type: String,
        required: true,
        unique: true,
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
        required() {
          return this.year > 2000;
        },
        unique: true,
      },
      manage: {
        offline: {
          type: Boolean,
          default: true,
        },
        startAt: {
          type: Date,
          required: true,
        },
        endAt: {
          type: Date,
          required: true,
        },
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
        manage: {
          title: 'manage',
          type: 'object',
          properties: {
            offline: {
              type: 'boolean',
              default: true,
            },
            startAt: {
              type: 'string',
              format: 'date-time',
            },
            endAt: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['startAt', 'endAt'],
        },
      },
      required: [
        'name',
        'year',
      ],
    });
  });
});
