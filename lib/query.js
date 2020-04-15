
const { plural } = require('pluralize');

module.exports = query_jsonSchema;


/**
 * query_jsonSchema - returns json schema considering the query type and options
 *
 * @return {Object}  json schema
 */
function query_jsonSchema() {
  let { populate } = this._mongooseOptions;
  if (populate) {
    populate = Object.keys(populate).map(k => populate[k]);
  }
  let jsonSchema = this.model.jsonSchema(
    this._fields, populate,
  );

  delete jsonSchema.required;

  if (this.op.indexOf('findOne') === 0) return jsonSchema;

  delete jsonSchema.title;

  jsonSchema = {
    title: `List of ${plural(this.model.modelName)}`,
    type: 'array',
    items: jsonSchema,
  };

  if (this.options.limit) {
    jsonSchema.maxItems = this.options.limit;
  }

  return jsonSchema;
}
