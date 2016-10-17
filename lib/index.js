var mongoose = require('mongoose');

module.exports = exports = {
  schema_jsonSchema: schema_jsonSchema,
  model_jsonSchema: model_jsonSchema
};

/**
 * schema_jsonSchema - builds the json schema based on the Mongooose schems
 *
 * @memberof mongoose.Schema
 *
 * @param  {String} name Name of the object
 * @param  {String|Array|Object} fields   mongoose fields specification
 * @param  {String|Array|Object} populate mongoose fields specification
 * @return {Object}          json schema
 */
function schema_jsonSchema(name) {
  return describe(name, this.tree);
}

function model_jsonSchema(fields, populate) {
  var jsonSchema = this.schema.jsonSchema(this.modelName);
  if (populate != null) {
    jsonSchema = __populate(this, this.schema, jsonSchema, populate);
  }
  if (fields != null) {
    jsonSchema = __clean(this, this.schema, jsonSchema, fields);
  }
  return jsonSchema;
};

function describe(name, type) {

  if (!type) return {};

  if (type instanceof mongoose.Schema) return type.jsonSchema(name);
  if (type instanceof Array) {
    var t = {
      type: "array",
      items: describe('', type[0])
    }
    if (t.items.required) {
      t.minItems = 1;
      delete t.items.required;
    }
    return t;
  }
  if (type === Date) return {
    type: 'string',
    format: 'date-time'
  }
  if (type instanceof Function) {
    type = type.name.toLowerCase();
    if (type === 'objectid') {
      return {
        type: 'string',
        format: 'uuid',
        pattern: '[0-9a-fA-F]{24}'
      }
    }
    return {
      type: type
    }
  }

  if (type.constructor.name === 'VirtualType') return {};

  if (type.type) {
    var t = describe('', type.type);
    t.required = !!type.required;
    if (type.enum) t.enum = type.enum;
    if (type.ref) t['x-ref'] = type.ref;
    if (type.min != null) t.minimun = type.min;
    if (type.max != null) t.maximum = type.max;
    if (type.minLength) t.minLength = type.minLength;
    if (type.maxLength) t.maxLength = type.maxLength;
    if (type.match) t.pattern = type.match.toString();
    if (type.default) t.default = type.default;
    t.description = type.description || t.ref && 'Refers to ' + t.ref;
    if (!t.description) delete t.description;
    return t;
  }

  if (typeof(type) === 'object') {
    var result = {
      type: 'object',
      properties: {},
      required: []
    };

    if (name) result.title = name;

    var props = Object.keys(type);
    props.forEach(p => {
      result.properties[p] = describe(p, type[p]);
      if (result.properties[p].required) {
        result.required.push(p);
      }
      delete result.properties[p].required;
    });
    if (result.required.length === 0) delete result.required;
    return result;
  }

  throw new Error('Colud not map unknown type of ' + name + ': '+ type);
}


/**
 * __populate - enreaches jsonSchema with a sub-document schemas
 *
 * @param  {mongoose.Model} model      model
 * @param  {mongoose.Schema} schema    schema
 * @param  {Object} jsonSchema         jsonSchema object
 * @param  {String|Array|Object} populate   mongoose populate object
 * @return {Object}                enreached json-schema
 */
function __populate(model, schema, jsonSchema, populate) {
  return jsonSchema;
}


/**
 * __clean - cleans the json schema from unwanted fields
 *
 * @param  {mongoose.Model} model      model
 * @param  {mongoose.Schema} schema    schema
 * @param  {Object} jsonSchema         jsonSchema object
 * @param  {String|Array|Object} fields     mongoose fields selection
 * @return {Object}                    cleaned josn schema
 */
function __clean(model, schema, jsonSchema, fields, populate) {
  return jsonSchema;
}


function normailizePopulationTree(populate) {

  if (typeof(populate) === 'string') populate = populate.split(' ');
  if (populate['path']) populate = [populate];
  return populate.map( p => {
    if (!p.path) return {path: p}
    return p;
  });

}
