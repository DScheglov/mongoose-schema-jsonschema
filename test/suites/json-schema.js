var mongoose = require('../../index')(require('mongoose'));
var validate = require('jsonschema').validate;
var assert = require('assert');

var models = require('../models');

describe('model.jsonSchema', function() {

  it ('should process flat schema and -- validate correct entity', function () {
    var jsonSchema = models.Person.jsonSchema();

    var validPerson = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@mail.net'
    };
    var aPerson = new models.Person(validPerson);
    assert.ok(!aPerson.validateSync());
    assert.equal(validate(validPerson, jsonSchema).errors.length, 0);

  });

  it ('should process flat schema and -- mark invalid entity', function () {
    var jsonSchema = models.Person.jsonSchema();

    var invalidPerson = {
      firstName: 'John',
      lastName: 'Smith',
      email: 12
    };
    var aPerson = new models.Person(invalidPerson);
    assert.ok(aPerson.validateSync());
    assert.equal(validate(invalidPerson, jsonSchema).errors.length, 1);

  });


  it ('jsonSchema should process ref schema', function () {
    var jsonSchema = models.Book.jsonSchema();

  });

  it ('jsonSchema should process complex schema', function () {
    var jsonSchema = models.Vector.jsonSchema();

  });

  it ('jsonSchema should process very complex schema', function () {
    var jsonSchema = models.Polynom.jsonSchema();

  });

});
