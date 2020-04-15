
const assert = require('assert');

module.exports = {
  findPath,
  ensurePath,
};

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
