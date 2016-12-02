'use strict';

const mongoose = require('mongoose');
require('../index')(mongoose);

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {type: String, required: true},
  year: Number,
  author: {type: Schema.Types.ObjectId, required: true, ref: 'Person'}
});

const Book = mongoose.model('Book', BookSchema);
const Q = Book.find().select('title').limit(5);


console.dir(Q.jsonSchema(), {depth: null});
