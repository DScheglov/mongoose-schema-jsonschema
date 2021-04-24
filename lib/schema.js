const { ensurePath } = require('./helpers');
const config = require('./config');
const [FORCE_REBUILD] = require('./options/forceRebuild');

module.exports = schema_jsonSchema;

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
  name = name || this.options.name;

  if (this.__buildingSchema) {
    this.__jsonSchemaId = this.__jsonSchemaId
      || `#schema-${++schema_jsonSchema.__jsonSchemaIdCounter}`;
    return { $ref: this.__jsonSchemaId };
  }

  if (!this.__jsonSchema || config.get(FORCE_REBUILD)) {
    this.__buildingSchema = true;
    this.__jsonSchema = __build(name, this);
    this.__buildingSchema = false;
    if (this.__jsonSchemaId) {
      this.__jsonSchema = {
        id: this.__jsonSchemaId, ...this.__jsonSchema,
      };
    }
  }

  const result = JSON.parse(JSON.stringify(this.__jsonSchema));

  if (name) {
    result.title = name;
  } else {
    delete result.title;
  }

  return result;
}

schema_jsonSchema.__jsonSchemaIdCounter = 0;

function __build(name, schema) {
  const paths = Object
    .keys(schema.paths)
    .filter(path => !/\.\$\*$/.test(path)); // removing Map.item paths

  let path; let jss; let
    sch;
  const result = {};
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
      jss.cont.required = jss.cont.required || [];
      jss.cont.required.push(jss.prop);
    }
    delete sch.__required;
  }

  if (result.required.length === 0) delete result.required;

  const needToAddVirtuals = schema.options && schema.options.toJSON
      && (schema.options.toJSON.virtuals || schema.options.toJSON.getters);

  if (needToAddVirtuals) {
    Object.keys(schema.virtuals).forEach(v => {
      result.properties[v] = {};
    });
  }

  return result;
}
