var assert = require('assert');

describe('Mongoose', function() {

  it ('should be uploaded without explicit request', function() {
    var mongoose = require('../../index')();
    assert.equal(mongoose.constructor.name, 'Mongoose');

  });

});
