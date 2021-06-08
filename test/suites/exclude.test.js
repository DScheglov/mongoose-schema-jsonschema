
const mongoose = require('../../index')(require('mongoose'));
const assert = require('assert');


describe('Exclude: Schema.jsonSchema()', () => {
  it('should exclude fields marked with excludeFromJSONSchema = true', () => {

    const mSchema = new mongoose.Schema({
      s: {
        type: String,
        excludeFromJSONSchema: true,
      },
      c: {
        type: String,
        required: true,
      }
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.equal(jsonSchema.properties.s, undefined);
  });



  it('should not exclude fields with excludeFromJSONSchema = false', () => {

    const mSchema = new mongoose.Schema({
      s: {
        type: String,
        excludeFromJSONSchema: false,
      },
      c: {
        type: String,
        required: true,
      }
    });

    const jsonSchema = mSchema.jsonSchema();
    assert.ok(!!jsonSchema.properties.s)

  });

  it('should not exclude fields with !excludeFromJSONSchema', () => {

    const mSchema = new mongoose.Schema({
      s: {
        type: String,
        excludeFromJSONSchema: false,
      },
      c: {
        type: String,
        required: true,
      }
    });

    const jsonSchema = mSchema.jsonSchema();
    assert.ok(!!jsonSchema.properties.c)

  });


});
