var mongoose = require('mongoose');

module.exports = exports = {
  simpleType_jsonSchema: simpleType_jsonSchema,
  objectId_jsonSchema: objectId_jsonSchema,
  date_jsonSchema: date_jsonSchema,
  array_jsonSchema: array_jsonSchema,
  mixed_jsonSchema: mixed_jsonSchema
}

/**
 * simpleType_jsonSchema - returns jsonSchema for simple-type parameter
 *
 * @memberof mongoose.Schema.Types.String
 *
 * @param  {String} name the name of parameter
 * @return {object}      the jsonSchema for parameter
 */
function simpleType_jsonSchema(name) {
  var result = {};
  result.type = this.instance.toLowerCase();

  if (this.options != null) {
    __processOptions(result, this.options)
  }
  return result;
}


/**
 * objectId_jsonSchema - returns the jsonSchema for ObjectId parameters
 *
 * @memberof mongoose.Schema.Types.ObjectId
 *
 * @param  {String} name the name of parameter
 * @return {object}      the jsonSchema for parameter
 */
function objectId_jsonSchema(name) {

  var result = simpleType_jsonSchema.call(this, name);

  result.type = 'string';
  result.format = 'uuid';
  result.pattern = '[0-9a-fA-F]{24}';

  return result;
}


/**
 * date_jsonSchema - description
 *
 * @param  {type} name description
 * @return {type}      description
 */
function date_jsonSchema(name) {

  var result = simpleType_jsonSchema.call(this, name);

  result.type = 'string';
  result.format = 'date-time';

  return result;
}


/**
 * array_jsonSchema - returns jsonSchema for array parameters
 *
 * @memberof mongoose.Schema.Types.SchemaArray
 * @memberof mongoose.Schema.Types.DocumentArray
 *
 * @param  {String} name parameter name
 * @return {object}      json schema
 */
function array_jsonSchema(name) {
  var result = {};
  var itemName;
  if (name) {
    itemName = 'itemOf_'+name;
  }
  result.type = 'array';
  if (this.options.required) result.__required = true;

  if (this.schema) {
    result.items = this.schema.jsonSchema(itemName);
  } else {
    result.items = this.caster.jsonSchema(itemName);
  }

  if (result.items.__required) {
    result.minItems = 1;
  }

  delete result.items.__required;

  return result;
}


/**
 * mixed_jsonSchema - returns jsonSchema for Mixed parameter
 *
 * @memberof mongoose.Schema.Types.Mixed
 *
 * @param  {String} name parameter name
 * @return {object}      json schema
 */
function mixed_jsonSchema(name) {
  var result = __describe(name, this.options.type);
  if (this.isRequired) result.__required = true;
  return result;
}


function __processOptions(t, type) {
  t.__required = !!type.required;
  if (type.enum && type.enum.slice) t.enum = type.enum.slice();
  if (type.ref) t['x-ref'] = type.ref;
  if (type.min != null) t.minimun = type.min;
  if (type.max != null) t.maximum = type.max;
  if (type.minLength != null) t.minLength = type.minLength;
  if (type.maxLength != null) t.maxLength = type.maxLength;
  if (type.match) t.pattern = type.match.toString();
  if (type.default != null) t.default = type.default;
  t.description = type.description || type.ref && 'Refers to ' + type.ref;
  if (!t.description) delete t.description;
  return t;
}


function __describe(name, type) {

  if (!type) return {};

  if (type instanceof mongoose.Schema) return type.jsonSchema(name);
  if (type instanceof Array) {
    var t = {
      type: "array",
      items: __describe(name && ('itemOf_' + name), type[0])
    }
    if (t.items.__required) {
      t.minItems = 1;
    }
    delete t.items.__required;
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
    var t = __describe(name, type.type);
    __processOptions(t, type);
    return t;
  }

  var result = {
    type: 'object',
    properties: {},
    required: []
  };

  if (name) result.title = name;

  var props = Object.keys(type);
  props.forEach(p => {
    result.properties[p] = __describe(p, type[p]);
    if (result.properties[p].__required) {
      result.required.push(p);
    }
    delete result.properties[p].__required;
  });
  if (result.required.length === 0) delete result.required;
  return result;
}
