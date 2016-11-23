'use strict';

var mongoose = require('mongoose');
var ensurePath = require('./helpers').ensurePath;

module.exports = exports = schema_jsonSchema;

/**
 * schema_jsonSchema - builds the json schema based on the Mongooose schema.
 * if schema has been already built the method returns new deep copy
 *
 * Method considers the `schema.options.toJSON.virtuals` to included
 * the virtual paths (without detailed description)
 *
 * @memberof mongoose.Schema
 *
 * @param  {String} name Name of the object
 * @return {Object}          json schema
 */
function schema_jsonSchema(name) {
  this.__jsonSchema = this.__jsonSchema || __build(name, this);
  var result = JSON.parse(JSON.stringify(this.__jsonSchema));

  if (name) {
    result.title = name;
  } else {
    delete result.title;
  }
  return result;
}


function __build(name, schema) {
  var paths = Object.keys(schema.paths);
  var path, jss, sch;
  var result = {};
  if (name) {
    result.title = name;
  }
  result.type = 'object';
  result.properties = {};
  result.required = [];

  for (path of paths) {
    jss = ensurePath(result, path);
    sch = schema.paths[path].jsonSchema(jss.prop);
    jss.cont.properties[jss.prop] = sch;
    if (sch.__required) {
      result.required.push(jss.prop);
    }
    delete sch.__required;
  };

  if (result.required.length === 0) delete result.required;

  var needToAddVirtuals = schema.options && schema.options.toJSON &&
      (schema.options.toJSON.virtuals || schema.options.toJSON.getters);

  if (needToAddVirtuals) {
    Object.keys(schema.virtuals).forEach( v => {
      result.properties[v] = {};
    });
  }

  return result;
}
