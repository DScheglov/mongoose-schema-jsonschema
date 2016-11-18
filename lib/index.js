'use strict';

var mongoose = require('mongoose');
var jssPath = require('./jss-path');

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
  this.__jsonSchema = this.__jsonSchema || describe(name, this.tree);
  var result = JSON.parse(JSON.stringify(this.__jsonSchema));
  if (name) {
    result.title = name;
  } else {
    delete result.title;
  }
  return result;
}

function model_jsonSchema(fields, populate) {
  var jsonSchema = this.schema.jsonSchema(this.modelName);

  jsonSchema = __select(this.schema, jsonSchema, fields);

  if (populate != null) {
    jsonSchema = __populate(jsonSchema, populate);
  }

  if (fields) __removeRequired(jsonSchema);

  return jsonSchema;
};

function describe(name, type) {

  if (!type) return {};

  if (type instanceof mongoose.Schema) return type.jsonSchema(name);
  if (type instanceof Array) {
    var t = {
      type: "array",
      items: describe(name && ('itemOf_' + name), type[0])
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
    var t = describe(name, type.type);
    t.__required = !!type.required;
    if (type.enum) t.enum = type.enum;
    if (type.ref) t['x-ref'] = type.ref;
    if (type.min != null) t.minimun = type.min;
    if (type.max != null) t.maximum = type.max;
    if (type.minLength) t.minLength = type.minLength;
    if (type.maxLength) t.maxLength = type.maxLength;
    if (type.match) t.pattern = type.match.toString();
    if (type.default != null) t.default = type.default;
    t.description = type.description || type.ref && 'Refers to ' + type.ref;
    if (!t.description) delete t.description;
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
    result.properties[p] = describe(p, type[p]);
    if (result.properties[p].__required) {
      result.required.push(p);
    }
    delete result.properties[p].__required;
  });
  if (result.required.length === 0) delete result.required;
  return result;
}


/**
 * __populate - enreaches jsonSchema with a sub-document schemas
 *
 * @param  {Object} jsonSchema              jsonSchema object
 * @param  {String|Array|Object} populate   mongoose populate object
 * @return {Object}                         enreached json-schema
 */
function __populate(jsonSchema, populate) {
  var pTree = normailizePopulationTree(populate);
  var path, model, subDoc, jss;
  for (path of pTree) {

    jss = jssPath(jsonSchema, path.path);

    if (!jss.spec) continue;

    model = jss.spec['x-ref'] || path.model;
    if (!model) continue;
    try {
      if (typeof model === 'string') model = mongoose.model(model);
    } catch(e) {
      continue;
    }
    subDoc = model.jsonSchema(path.select, path.populate);
    subDoc['x-ref'] = jss.spec['x-ref'];
    if (jss.spec.description) subDoc.description = jss.spec.description;
    if (jss.isArray) {
      jss.cont.items = subDoc;
    } else {
      jss.cont[jss.prop] = subDoc;
    }
  }
  return jsonSchema;
}


/**
 * __select - cleans the json schema from unwanted fields
 *
 * @param  {mongoose.Schema} schema    schema
 * @param  {Object} jsonSchema         jsonSchema object
 * @param  {String|Array|Object} fields     mongoose fields selection
 * @return {Object}                    cleaned josn schema
 */
function __select(schema, jsonSchema, fields) {
  var _dP = delPath.bind(null, jsonSchema);
  __excludedPath(schema, fields).forEach(_dP);
  return jsonSchema;
}


function delPath(jsonSchema, path) {
  var jss = jssPath(jsonSchema, path);
  delete jss.baseCont[jss.prop];
  if (Object.keys(jss.baseCont).length === 0) {
    delPath(jsonSchema, path.split('.').slice(0, -1).join('.'))
  }
}

/**
 * __removeRequired - removes required fields specification
 *
 * @param  {Object} jsonSchema schema
 */
function __removeRequired(obj) {
  while (obj && obj.type === 'array') obj = obj.items;
  delete obj.required;
  if (obj.properties) Object.keys(obj.properties).forEach(p => {
    __removeRequired(obj.properties[p]);
  });
}

function normailizePopulationTree(populate) {

  if (typeof(populate) === 'string') populate = populate.split(' ');
  if (populate['path']) populate = [populate];
  return populate.map( p => {
    if (!p.path) return {path: p}
    return p;
  });

}

function __excludedPath(schema, selection) {

  var paths = Object.keys(schema.paths);
  var virtuals = Object.keys(schema.virtuals);
  var exclude = paths.reduce((excl, p) => {
    if (!schema.paths[p].options) return excl;
    if (schema.paths[p].options.select === false) excl[p] = 0;
    return excl;
  }, {});

  selection = selection || {};

  if (typeof(selection) === 'string') {
    selection = selection.split(/\s+/);
  }

  if (selection instanceof Array) {
    selection = selection.reduce( (sel, p) => {
      if (p[0] === '+') {
        delete exclude[p];
        p = p.substr(1);
      }
      if (p[0] === '-') sel[p.substr(1)] = 0;
      else sel[p] = 1;
      return sel;
    }, {})
  }

  var needToAddVirtuals = schema.options && schema.options.toJSON &&
      (schema.options.toJSON.virtuals || schema.options.toJSON.getters);

  paths = paths.concat(virtuals);
  if (!needToAddVirtuals) {
    exclude = virtuals.reduce((excl, p) => {
      excl[p] = 0;
      return excl;
    }, exclude);
  }

  var explicitlyInclude = Object.keys(selection).some(p => selection[p] === 1);
  Object.assign(selection, exclude);

  if (explicitlyInclude) {
    selection._id = (typeof selection._id === 'number') ? selection._id : 1;
    if (needToAddVirtuals) {
      selection.id = (typeof selection.id === 'number') ?
        selection.id :
        selection._id;
    }
    return paths.filter(p => !selection[p]);
  }

  return Object.keys(selection);

}
