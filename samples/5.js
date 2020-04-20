/* eslint-disable no-console */
const mongoose = require('../index')();
const config = require('../config');

config({
  fieldOptionsMapping: {
    notes: 'x-notes',
  },
});

const { Schema } = mongoose;

const BookSchema = new Schema({
  title: { type: String, required: true, notes: 'Book Title' },
  year: Number,
  author: { type: String, required: true },
});

console.dir(BookSchema.jsonSchema(), { depth: null });

config({
  fieldOptionsMapping: [],
  forceRebuild: true,
});

console.dir(BookSchema.jsonSchema(), { depth: null });

config({ forceRebuild: false });
