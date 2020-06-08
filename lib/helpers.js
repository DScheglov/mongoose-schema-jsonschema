
const assert = require('assert');

function findPath(obj, path) {
  let spec;
  let isArray;
  let cont;
  const jssPath = path.split('.');
  const prop = jssPath.pop();

  if (jssPath.length) {
    cont = jssPath.reduce((o, p) => {
      while (o && o.type === 'array') o = o.items;
      return o.properties[p];
    }, obj);
    while (cont && cont.type === 'array') cont = cont.items;
  } else {
    cont = obj;
  }
  const parent = cont;
  cont = cont.properties;
  const baseCont = cont;

  spec = cont[prop];
  isArray = false;
  while (spec && spec.type === 'array') {
    isArray = true;
    cont = spec;
    spec = spec.items;
  }

  return {
    spec,
    cont,
    baseCont,
    prop,
    isArray,
    parent,
  };
}


function ensurePath(obj, path) {
  assert.ok(obj);

  let cont;

  const jssPath = path.split('.');
  const first = jssPath.shift();

  cont = obj;

  while (cont.type === 'array') cont = cont.items;

  if (!cont.properties) cont.properties = {};

  if (jssPath.length === 0) {
    return {
      cont,
      prop: first,
    };
  }

  cont.properties[first] = cont.properties[first] || {
    title: first,
    type: 'object',
  };

  const spec = cont.properties[first];

  return ensurePath(spec, jssPath.join('.'));
}

const compose2 = (f, g) => (...args) => f(g(...args));

const idX = x => x;

const compose = (...fns) => (
  fns.length > 0 ? fns.reduce(compose2) : idX
);

const hasProperty = Function.prototype.call.bind(
  Object.prototype.hasOwnProperty,
);

const readConstraint = constraint => (Array.isArray(constraint) ? constraint[0] : constraint);

module.exports = {
  findPath,
  ensurePath,
  compose,
  idX,
  hasProperty,
  readConstraint,
};
