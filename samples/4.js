/* eslint-disable no-console */
const { Schema } = require('../index')();

const BookSchema = new Schema({
  title: { type: String, required: true },
  year: Number,
  author: { type: Schema.Types.ObjectId, required: true, ref: 'Person' },
});

BookSchema.add({
  isbn: { type: String, required: true },
});

BookSchema.path('year').required(true);

console.dir(BookSchema.jsonSchema(), { depth: null });

console.dir(BookSchema);
