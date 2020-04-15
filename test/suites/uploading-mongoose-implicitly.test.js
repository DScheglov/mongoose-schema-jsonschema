const assert = require('assert');

describe('Mongoose', () => {
  it('should be uploaded without explicit request', () => {
    const mongoose = require('../../index')();
    assert.equal(mongoose.constructor.name, 'Mongoose');
  });
});
