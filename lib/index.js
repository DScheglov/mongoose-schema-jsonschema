var mongoose = require('mongoose');

module.exports = exports = jsonSchema;

/**
 * jsonSchema - builds the json schema based on the Mongooose schems
 *
 * @memberof mongoose.Schema
 *
 * @param  {String} name Name of the object
 * @param  {String|Array|Object} fields   mongoose fields specification
 * @param  {String|Array|Object} populate mongoose fields specification
 * @return {Object}          json schema
 */
function jsonSchema(name, fields, populate) {
  return describe(name, this.tree);
}

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
