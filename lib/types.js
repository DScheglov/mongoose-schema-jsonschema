const config = require('./config');
const [FIELDS_MAPPING] = require('./options/fieldOptionsMapping');
const { readConstraint } = require('./helpers');

module.exports = {
  simpleType_jsonSchema,
  objectId_jsonSchema,
  date_jsonSchema,
  array_jsonSchema,
  mixed_jsonSchema,
  map_jsonSchema,
};

/**
 * simpleType_jsonSchema - returns jsonSchema for simple-type parameter
 *
 * @memberof mongoose.Schema.Types.String
 *
 * @return {object}      the jsonSchema for parameter
 */
function simpleType_jsonSchema() {
  const result = {};

  result.type = this.instance.toLowerCase();

  __processOptions(result, extendOptions(this));

  return checkNullable(result);
}

function map_jsonSchema(name) {
  const result = {
    type: 'object',
    additionalProperties:
      this.options.of != null
        ? __describe(`itemOf_${name}`, this.options.of)
        : { type: {} },
  };

  __processOptions(result, extendOptions(this));

  delete result.additionalProperties.__required;

  return checkNullable(result);
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
  const result = simpleType_jsonSchema.call(this, name);

  result.type = 'string';
  result.pattern = '^[0-9a-fA-F]{24}$';

  return checkNullable(result);
}

/**
 * date_jsonSchema - description
 *
 * @param  {type} name description
 * @return {type}      description
 */
function date_jsonSchema(name) {
  const result = simpleType_jsonSchema.call(this, name);

  result.type = 'string';
  result.format = 'date-time';

  return checkNullable(result);
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
  const result = {};

  const itemName = `itemOf_${name}`;

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

  __processOptions(result, extendOptions(this));
  delete result.items.__required;

  return checkNullable(result);
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
  const result = __describe(name, this.options.type);
  __processOptions(result, extendOptions(this));

  return checkNullable(result);
}

const transformMatch = match => (
  match instanceof RegExp
    ? match.toString().split('/').slice(1, -1).join('/')
    : match.toString()
);

function __processOptions(t, type) {
  t.__required = !!readConstraint(type.required);
  if (type.enum && type.enum.slice) t.enum = type.enum.slice();
  if (type.ref) t['x-ref'] = type.ref;
  if (type.min != null) t.minimum = readConstraint(type.min);
  if (type.max != null) t.maximum = readConstraint(type.max);
  if (type.minLength != null) t.minLength = readConstraint(type.minLength);
  if (type.maxLength != null) t.maxLength = readConstraint(type.maxLength);
  if (type.minlength != null) t.minLength = readConstraint(type.minlength);
  if (type.maxlength != null) t.maxLength = readConstraint(type.maxlength);
  if (type.examples != null) t.examples = type.examples;
  if (type.match != null) t.pattern = transformMatch(readConstraint(type.match));
  if (type.default !== undefined) t.default = type.default;

  t.description = type.description || type.descr || type.ref && `Refers to ${type.ref}`;
  if (!t.description) delete t.description;

  if (!t.title && type.title) t.title = type.title;

  const customFieldsMapping = config.get(FIELDS_MAPPING);

  Object.assign(t, customFieldsMapping(type));

  return t;
}

function __describe(name, type) {
  if (!type) return {};

  if (type.jsonSchema instanceof Function) return type.jsonSchema(name);

  if (type.__buildingSchema) {
    type.__jsonSchemaId = type.__jsonSchemaId
      || `#subschema_${++__describe.__jsonSchemaIdCounter}`;
    return { $ref: type.__jsonSchemaId };
  }

  if (type instanceof Array) {
    type.__buildingSchema = true;
    const t = {
      type: 'array',
      items: __describe(name && (`itemOf_${name}`), type[0]),
    };
    delete type.__buildingSchema;
    if (t.items.__required) {
      t.minItems = 1;
    }
    delete t.items.__required;
    return t;
  }

  if (type === Date) {
    return {
      type: 'string',
      format: 'date-time',
    };
  }

  if (type instanceof Function) {
    type = type.name.toLowerCase();
    if (type === 'objectid') {
      return {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}$',
      };
    } if (type === 'mixed') {
      return { };
    }
    return {
      type,
    };
  }

  if (type.type) {
    type.__buildingSchema = true;
    const ts = __describe(name, type.type);
    delete type.__buildingSchema;
    __processOptions(ts, type);
    return checkNullable(ts);
  }

  if (type.constructor.name !== 'Object') {
    return {
      type: type.constructor.name.toLowerCase(),
    };
  }

  const result = {
    type: 'object',
    properties: {},
    required: [],
  };

  result.title = name;

  const props = Object.keys(type);
  type.__buildingSchema = true;
  props.forEach(p => {
    result.properties[p] = __describe(p, type[p]);
    if (result.properties[p].__required) {
      result.required.push(p);
    }
    delete result.properties[p].__required;
  });
  delete type.__buildingSchema;
  if (result.required.length === 0) delete result.required;
  return result;
}

__describe.__jsonSchemaIdCounter = 0;

function checkNullable(typeDef) {
  if (typeDef.default === null) {
    typeDef.type = [typeDef.type, 'null'];
  }

  return typeDef;
}

function extendOptions(mongooseTypeDef) {
  return { ...mongooseTypeDef.options, required: mongooseTypeDef.isRequired };
}
