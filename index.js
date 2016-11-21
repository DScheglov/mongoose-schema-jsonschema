'use strict';

var lib = require('./lib');
var translators = require('./lib/schema');

module.exports = exports = function(mongoose) {
  mongoose = mongoose || require('mongoose');
  var Types = mongoose.Schema.Types;

  mongoose.SchemaType.prototype.jsonSchema = translators.simpleType_jsonSchema;

  Types.Date.prototype.jsonSchema = translators.date_jsonSchema;
  Types.ObjectId.prototype.jsonSchema = translators.objectId_jsonSchema;

  Types.Array.prototype.jsonSchema =
  Types.DocumentArray.prototype.jsonSchema = translators.array_jsonSchema;

  Types.Embedded.prototype.jsonSchema = 
  Types.Mixed.prototype.jsonSchema = translators.mixed_jsonSchema;

  mongoose.Schema.prototype.jsonSchema = lib.schema_jsonSchema;
  mongoose.Model.jsonSchema = lib.model_jsonSchema;
  return mongoose;
}
