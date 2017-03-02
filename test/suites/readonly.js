'use strict';

const mongoose = require('../../index')(require('mongoose'));
const assert = require('assert');

const models = require('../models');

describe('readonly: model.jsonSchema', function () {

  it('should consider the readonly parameter', function () {

    let rules = [
      {
        name: '**_id',
        path: /^([^.]?\.?)*_id$/,
        strict: false,
        message: null
      }, {
        name: '**__v',
        path: /^([^.]?\.?)*__v$/,
        strict: false,
        message: null
      }, {
        name: 'author',
        path: /^author$/,
        strict: false,
        message: null
      }
    ];

    let jsonSchema = models.Book.jsonSchema(null, null, rules);

    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
        comment: {
          type: 'array',
          items: {
            title: 'itemOf_comment',
            type: 'object',
            properties: {
              body: { type: 'string' },
              editor: {
                type: 'string',
                'x-ref': 'Person',
                description: 'Refers to Person',
                pattern: '^[0-9a-fA-F]{24}$'
              }
            },
            required: [ 'editor' ]
          }
        },
        official: {
          title: 'official',
          type: 'object',
          properties: { slogan: { type: 'string' }, announcement: { type: 'string' } }
        },
        publisher: {
          type: 'string',
          'x-ref': 'Person',
          description: 'Refers to Person',
          pattern: '^[0-9a-fA-F]{24}$'
        },
        description: { type: 'string' }
      },
      required: [ 'title', 'year', 'publisher' ]
    });

  });

  it('should exclude comment.editor', function () {

    let rules = [
      {
        name: '**_id',
        path: /^([^.]?\.?)*_id$/,
        strict: false,
        message: null
      }, {
        name: '**__v',
        path: /^([^.]?\.?)*__v$/,
        strict: false,
        message: null
      }, {
        name: 'comment.editor',
        path: /^comment\.editor$/,
        strict: false,
        message: null
      }
    ];

    let jsonSchema = models.Book.jsonSchema(null, null, rules);
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
        author: {
          type: 'array',
          items: {
            type: 'string',
            'x-ref': 'Person',
            description: 'Refers to Person',
            pattern: '^[0-9a-fA-F]{24}$'
          },
          minItems: 1
        },
        comment: {
          type: 'array',
          items: {
            title: 'itemOf_comment',
            type: 'object',
            properties: {
              body: { type: 'string' },
            }
          }
        },
        official: {
          title: 'official',
          type: 'object',
          properties: { slogan: { type: 'string' }, announcement: { type: 'string' } }
        },
        publisher: {
          type: 'string',
          'x-ref': 'Person',
          description: 'Refers to Person',
          pattern: '^[0-9a-fA-F]{24}$'
        },
        description: { type: 'string' }
      },
      required: [ 'title', 'year', 'author', 'publisher' ]
    });

  })

});
