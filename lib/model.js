
const { findPath } = require('./helpers');

module.exports = model_jsonSchema;


/**
 * model_jsonSchema - builds json schema for model considering
 * the selection and population
 *
 * if `fields` specified the method removes `required` contraints
 *
 * @memberof mongoose.Model
 *
 * @param  {String|Array|Object} fields   mongoose selection object
 * @param  {String|Object} populate mongoose population options
 * @return {object}          json schema
 */
function model_jsonSchema(fields, populate, readonly) {
  let jsonSchema = this.schema.jsonSchema(this.modelName);

  if (populate != null) {
    jsonSchema = __populate.call(this, jsonSchema, populate);
  }

  __excludedPaths(this.schema, fields).forEach(
    __delPath.bind(null, jsonSchema),
  );

  if (readonly) {
    __excludedReadonlyPaths(jsonSchema, readonly);
  }

  if (fields) __removeRequired(jsonSchema);

  return jsonSchema;
}

/**
 * __populate - enreaches jsonSchema with a sub-document schemas
 *
 * @param  {Object} jsonSchema              jsonSchema object
 * @param  {String|Array|Object} populate   mongoose populate object
 * @return {Object}                         enreached json-schema
 */
function __populate(jsonSchema, populate) {
  const pTree = normailizePopulationTree(populate);
  let path; let model; let subDoc; let
    jss;
  for (path of pTree) {
    jss = findPath(jsonSchema, path.path);

    if (!jss.spec) continue;

    model = jss.spec['x-ref'] || path.model;
    if (!model) continue;
    try {
      if (typeof model === 'string') model = this.base.model(model);
    } catch (e) {
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
 * __delPath - removes path specified from the json-schema as also as
 * empty parent paths
 *
 * @param  {object} jsonSchema description
 * @param  {String} path       description
 */
function __delPath(jsonSchema, path) {
  const jss = findPath(jsonSchema, path);
  delete jss.baseCont[jss.prop];
  if (jss.parent.required && jss.parent.required.length) {
    jss.parent.required = jss.parent.required.filter(f => f !== jss.prop);
  }
  if (Object.keys(jss.baseCont).length === 0) {
    __delPath(jsonSchema, path.split('.').slice(0, -1).join('.'));
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
  if (obj.properties) {
    Object.keys(obj.properties).forEach(p => {
      __removeRequired(obj.properties[p]);
    });
  }
}

function normailizePopulationTree(populate) {
  if (typeof (populate) === 'string') populate = populate.split(' ');
  if (populate.path) populate = [populate];
  return populate.map(p => {
    if (!p.path) return { path: p };
    return p;
  });
}

function __excludedPaths(schema, selection) {
  const virtuals = Object.keys(schema.virtuals);
  let paths = __allPaths(schema);
  let exclude = paths.reduce((excl, p) => {
    const path = __getPath(schema, p);
    if (path && path.options && path.options.select === false) excl[p] = 0;
    return excl;
  }, {});

  selection = selection || {};

  if (typeof (selection) === 'string') {
    selection = selection.split(/\s+/);
  }

  if (selection instanceof Array) {
    selection = selection.reduce((sel, p) => {
      if (p[0] === '+') {
        p = p.substr(1);
        delete exclude[p];
      }
      if (p[0] === '-') {
        sel[p.substr(1)] = 0;
      } else sel[p] = 1;
      return sel;
    }, {});
  }

  const needToAddVirtuals = schema.options && schema.options.toJSON
      && (schema.options.toJSON.virtuals || schema.options.toJSON.getters);

  paths = paths.concat(virtuals);
  if (!needToAddVirtuals) {
    exclude = virtuals.reduce((excl, p) => {
      excl[p] = 0;
      return excl;
    }, exclude);
  }

  const explicitlyInclude = Object.keys(selection).some(p => selection[p] === 1);
  Object.assign(selection, exclude);

  if (explicitlyInclude) {
    selection._id = (typeof selection._id === 'number') ? selection._id : 1;
    if (needToAddVirtuals) {
      selection.id = (typeof selection.id === 'number')
        ? selection.id
        : selection._id;
    }
    return paths.filter(p => {
      if (selection[p] != null) return !selection[p];
      return !Object.keys(selection).some(
        s => p.indexOf(`${s}.`) === 0 && selection[s],
      );
    });
  }

  return Object.keys(selection);
}

function __allPaths(schema) {
  return Object.keys(schema.paths).reduce((paths, p) => {
    const path = schema.paths[p];
    if (path.instance !== 'Array' || !path.schema) {
      paths.push(p);
      return paths;
    }
    __allPaths(path.schema).forEach(subPath => {
      paths.push(`${p}.${subPath}`);
    });
    return paths;
  }, []);
}

function __getPath(schema, path) {
  let p = schema.paths[path];
  if (p) return p;

  path = path.split('.');
  const l = path.length;
  p = '';
  for (let i = 0; i < l; i++) {
    p += path[i];
    if (schema.paths[p] && schema.paths[p].schema) {
      return __getPath(schema.paths[p].schema, path.slice(i + 1).join('.'));
    }
    p += '.';
  }
  return null;
}


function __excludedReadonlyPaths(schema, rules, prefix) {
  prefix = prefix || '';

  while (schema.type === 'array') schema = schema.items;
  const props = schema.properties;

  if (!props) return;

  Object.keys(props).forEach(f => {
    for (const rule of rules) {
      if (rule.path.test(prefix + f)) {
        delete props[f];
        if (schema.required && schema.required.length) {
          schema.required = schema.required.filter(r => r !== f);
          if (!schema.required.length) delete schema.required;
        }
        return;
      }
    }
    if (props[f].type === 'object' || props[f].type === 'array') {
      __excludedReadonlyPaths(props[f], rules, `${prefix + f}.`);
    }
  });
}
