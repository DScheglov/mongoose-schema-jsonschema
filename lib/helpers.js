'use strict';

var assert = require('assert');

module.exports = exports = {
  findPath: findPath,
  ensurePath: ensurePath
}

function findPath(obj, path) {
  let spec, isArray, jssPath, cont, prop, baseCont, parent;
  jssPath = path.split('.');
  prop = jssPath.pop();
  if (jssPath.length) {
    cont = jssPath.reduce( (o, p) => {
      while (o && o.type === 'array') o = o.items;
      return o.properties[p];
    }, obj);
    while (cont && cont.type === 'array') cont = cont.items;
  } else {
    cont = obj;
  }
  parent = cont;
  baseCont = cont = cont.properties;
  spec = cont[prop];
  isArray = false;
  while (spec && spec.type === 'array') {
    isArray = true;
    cont = spec;
    spec = spec.items;
  }

  return {
    spec: spec,
    cont: cont,
    baseCont: baseCont,
    prop: prop,
    isArray: isArray,
    parent: parent
  };
}


function ensurePath(obj, path) {
  assert.ok(obj);

  var spec, jssPath, cont, first;
  jssPath = path.split('.');
  first = jssPath.shift();

  cont = obj;

  while (cont.type === 'array') cont = cont.items;

  if (!cont.properties) cont.properties = {};

  if (jssPath.length === 0) return {
    cont: cont,
    prop: first
  }

  cont.properties[first] = cont.properties[first] || {
    title: first,
    type: 'object'
  }

  spec = cont.properties[first];

  return ensurePath(spec, jssPath.join('.'));

}
