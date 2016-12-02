'use strict';

var schema_jsonSchema = require('./lib/schema');
var model_jsonSchema = require('./lib/model');
var query_jsonSchema = require('./lib/query');
var types = require('./lib/types');

module.exports = exports = function(mongoose) {
  mongoose = mongoose || require('mongoose');
  var Types = mongoose.Schema.Types;

  mongoose.SchemaType.prototype.jsonSchema = types.simpleType_jsonSchema;

  Types.Date.prototype.jsonSchema = types.date_jsonSchema;
  Types.ObjectId.prototype.jsonSchema = types.objectId_jsonSchema;

  Types.Array.prototype.jsonSchema =
  Types.DocumentArray.prototype.jsonSchema = types.array_jsonSchema;

  Types.Embedded.prototype.jsonSchema =
  Types.Mixed.prototype.jsonSchema = types.mixed_jsonSchema;

  mongoose.Schema.prototype.jsonSchema = schema_jsonSchema;
  mongoose.Model.jsonSchema = model_jsonSchema;
  mongoose.Query.prototype.jsonSchema = query_jsonSchema;

  return mongoose;
}
