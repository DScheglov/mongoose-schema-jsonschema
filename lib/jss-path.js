module.exports = exports = findPath;

function findPath(obj, path) {
  var spec, isArray, jssPath, cont, prop, baseCont;
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
    isArray: isArray
  };
}
