'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VectorSchema = require('./vector').schema;

var PolynomSchema = new Schema({
  title: { type: String, required: true},
  points: [VectorSchema],
  _points: [{x: Number, y: Number, name: String}]
});

var Polynom = mongoose.model('Polynom', PolynomSchema);
module.exports = exports = Polynom;
