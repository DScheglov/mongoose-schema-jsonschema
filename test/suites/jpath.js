var assert = require('assert');
var jpath = require('../../lib/jpath');

describe('jpath.', function () {

  it("get({x:1}, 'x') should return 1", function () {
    assert.equal(jpath.get({x:1}, 'x'), 1);
  });

  it("get({x:1}, 'y') should return undefined", function () {
    var res = jpath.get({x:1}, 'y');
    assert.equal(typeof(res), 'undefined');
  });

  it("get({x:1, y: [2, 3]}, 'y') should return [2, 3]", function () {
    var res = jpath.get({x:1, y: [2, 3]}, 'y');
    assert.deepEqual(res, [2, 3]);
  });

  it("get({x:1, y: [2, 3]}, 'y.0') should return 2", function () {
    var res = jpath.get({x:1, y: [2, 3]}, 'y.0');
    assert.deepEqual(res, 2);
  });

  it("get({x:1, y: [{t: -1}, {t: -2}]}, 'y.1.t') should return -2", function () {
    var res = jpath.get({x:1, y: [{t: -1}, {t: -2}]}, 'y.1.t');
    assert.deepEqual(res, -2);
  });

  it("get({x:1, y: [{t: -1}, {t: -2}]}, 'y.3.t') should return undefined", function () {
    var res = jpath.get({x:1, y: [{t: -1}, {t: -2}]}, 'y.3.t');
    assert.deepEqual(typeof(res), 'undefined');
  });

});
