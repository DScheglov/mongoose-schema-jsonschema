'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UglySchema = new Schema({
	title: { type: String, required: true, index: true },
	year: { type: Number, required: true, index: true },
  publisher: { type: Schema.Types.ObjectId, required: true, ref: 'UnExistingModel' },
	description: String
});

module.exports = exports =  mongoose.model('Ugly', UglySchema);