/* eslint-disable no-console */
const mongoose = require('mongoose');
require('../index')(mongoose);

const { Schema } = mongoose;

const BookSchema = new Schema({
  title: { type: String, required: true },
  year: Number,
  author: { type: Schema.Types.ObjectId, required: true, ref: 'Person' },
});

const PersonSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: Date,
});

const Book = mongoose.model('Book', BookSchema);
mongoose.model('Person', PersonSchema);

console.dir(Book.jsonSchema('title year'), { depth: null });
console.dir(Book.jsonSchema('', 'author'), { depth: null });
