'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: { type: String, required: true, index: true },
	year: { type: Number, required: true, index: true },
	author: {
		type: [{type: Schema.Types.ObjectId, required: true, ref: 'Person'}],
		index: true,
    required: true
	},
  comment: [{
    body: String,
    editor: {type: Schema.Types.ObjectId, required: true, ref: 'Person'}
  }],
  official: {
    slogan: String,
    announcement: String
  },
  publisher: { type: Schema.Types.ObjectId, required: true, ref: 'Person' },
	description: String
});

module.exports = exports = mongoose.model('Book', BookSchema);
