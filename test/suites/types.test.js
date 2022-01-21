const mongoose = require('../../index')(require('mongoose'));

const { Schema } = mongoose;
const assert = require('assert');

describe('types', () => {
  it('array of array should not cause any issue', () => {
    const bookSchema = new Schema({
      name: [[String]],

    }, { _id: false });

    const jsonSchema = bookSchema.jsonSchema('book');

    assert.deepEqual(jsonSchema, { properties: { name: { items: { items: { type: 'string' }, type: 'array' }, type: 'array' } }, title: 'book', type: 'object' });
  });
});
