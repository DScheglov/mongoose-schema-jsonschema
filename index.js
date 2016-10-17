'use strict';

var lib = require('./lib');

module.exports = exports = function(mongoose) {
  mongoose = mongoose || require('mongoose');
  mongoose.Schema.prototype.jsonSchema = lib.schema_jsonSchema;
  mongoose.Model.jsonSchema = lib.model_jsonSchema;
  return mongoose;
}
