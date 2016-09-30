'use strict';

var jsonSchema = require('./lib');

module.exports = exports = function(mongoose) {
  mongoose = mongoose || require('mongoose');
  mongoose.Schema.prototype.jsonSchema = jsonSchema;
  mongoose.Model.jsonSchema = function jsonSchema(fields, populate) {
    return this.schema.jsonSchema(this.modelName, fields, populate);
  };
  return mongoose;
}
