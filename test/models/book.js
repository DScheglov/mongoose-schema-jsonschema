
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: {type: String, required: true, index: true},
	year: {type: Number, required: true, index: true},
	author: {
		type: [{type: Schema.Types.ObjectId, required: true, ref: 'Person'}],
		index: true
	},
	description: String
});

module.exports = exports = mongoose.model('Book', BookSchema);
