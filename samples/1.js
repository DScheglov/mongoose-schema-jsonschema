'use strict';

const mongoose = require('mongoose');
require('../index')(mongoose);

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {type: String, required: true},
  year: Number,
  author: {type: String, required: true}
});

let jsonSchema = BookSchema.jsonSchema();

console.dir(jsonSchema, {depth: null});
