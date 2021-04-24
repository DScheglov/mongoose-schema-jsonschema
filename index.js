const schema_jsonSchema = require('./lib/schema');
const model_jsonSchema = require('./lib/model');
const query_jsonSchema = require('./lib/query');
const types = require('./lib/types');

module.exports = function moduleFactory(mongoose) {
  // eslint-disable-next-line global-require
  mongoose = mongoose || require('mongoose');
  const { Types } = mongoose.Schema;

  mongoose.SchemaType.prototype.jsonSchema = types.simpleType_jsonSchema;

  Types.Date.prototype.jsonSchema = types.date_jsonSchema;
  Types.ObjectId.prototype.jsonSchema = types.objectId_jsonSchema;

  Types.Array.prototype.jsonSchema = types.array_jsonSchema;
  Types.DocumentArray.prototype.jsonSchema = types.array_jsonSchema;

  Types.Embedded.prototype.jsonSchema = types.mixed_jsonSchema;
  Types.Mixed.prototype.jsonSchema = types.mixed_jsonSchema;

  Types.Map.prototype.jsonSchema = types.map_jsonSchema;

  mongoose.Schema.prototype.jsonSchema = schema_jsonSchema;
  mongoose.Model.jsonSchema = model_jsonSchema;
  mongoose.Query.prototype.jsonSchema = query_jsonSchema;

  return mongoose;
};
