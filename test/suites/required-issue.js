'use strict';

var mongoose = require('../../index')(require('mongoose'));
var Schema = mongoose.Schema;
var validate = require('jsonschema').validate;
var assert = require('assert');

describe('schema.jsonSchema', function() {

  it ('should correctly translate all simmple types', function () {
    var bookSchema = new Schema({
      name: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String,
      },
      internalName: {
        type: String,
        required: true,
        unique: true
      },
      manage: {
        offline: {
          type: Boolean,
          default: true
        },
        startAt: {
          type: Date,
          required: true
        },
        endAt: {
          type: Date,
          required: true
        }
      }
    }, { _id: false });

    var jsonSchema = bookSchema.jsonSchema('book');

    assert.deepEqual(jsonSchema, {
      "title": "book",
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "internalName": {
          "type": "string"
        },
        "manage": {
          "title": "manage",
          "type": "object",
          "properties": {
            "offline": {
              "type": "boolean",
              "default": true
            },
            "startAt": {
              "type": "string",
              "format": "date-time"
            },
            "endAt": {
              "type": "string",
              "format": "date-time"
            }
          },
          required: [ "startAt", "endAt"]
        }
      },
      "required": [
        "name",
        "internalName"
      ]
    });

  });

});
