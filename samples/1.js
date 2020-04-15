/* eslint-disable no-console */

const mongoose = require('mongoose');
require('../index')(mongoose);

const { Schema } = mongoose;

const BookSchema = new Schema({
  title: { type: String, required: true },
  year: Number,
  author: { type: String, required: true },
});

const jsonSchema = BookSchema.jsonSchema();

console.dir(jsonSchema, { depth: null });
