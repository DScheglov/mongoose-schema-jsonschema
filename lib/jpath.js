
module.exports = exports = {
  get: get,
  set: set
}


/**
 * get - returns value by path
 *
 * @param  {Object} obj  object to search by path
 * @param  {String} path searching path
 * @param  {any} def  default value
 * @return {any}      value that was found by path
 *
 * @example:
 * var obj = {x: 1, y: [-1, {t: -2}, {t: -3}], z: 0};
 * console.log(get(obj, 'x')); // prints 1
 * console.log(get(obj, 'r')); // prints `undefined`
 * console.log(get(obj, 'y.1.t')); // prints -2
 *
 */
function get(obj, path, def) {
  return obj && path && path
    .toString()
    .split('.')
    .reduce((o, p) => o && o[p], obj)
  || def;
}


/**
 * set - set the value by path
 *
 * @param  {Object} obj  object to search by path
 * @param  {String} path searching path
 * @param  {any} def  value to assign the path
 * @return {any}      assigned value or raises an error
 * if path couldn't be reached
 */
function set(obj, path, val) {
  var field;
  if (!path) return ;
  path = path.toString().split('.');
  field = path.pop();
  if (!path.length) return obj[field] = val;

  return path.reduce((o, p) => o && o[p], obj)[field] = val;
}
