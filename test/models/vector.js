'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VectorSchema = new Schema({
  x: Number,
  y: Number,
  label: String,
  info : {
    d: Date,
    tags: [String]
  }
});

var Vector = mongoose.model('Vector', VectorSchema);
module.exports = exports = {
  model: Vector,
  schema: VectorSchema
};
