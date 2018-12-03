'use strict';

var mongoose = require('../../index')(require('mongoose'));
var assert = require('assert');

var models = require('../models');

describe('Population: Model.jsonSchema()', function () {

  it('should build schema and populate child-field', function () {
    var jsonSchema = models.Book.jsonSchema('title publisher', 'publisher');
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: {type: 'string'},
        publisher: {
          title: 'Person',
          type: 'object',
          properties: {
            firstName: {type: 'string'},
            lastName: {type: 'string'},
            email: {type: 'string'},
            isPoet: {type: 'boolean', default: false},
            _id: {type: 'string', pattern: '^[0-9a-fA-F]{24}$'},
            __v: {type: 'number'}
          },
          'x-ref': 'Person',
          description: 'Refers to Person'
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });
  });

  it('should build schema and populate child-field with selected fields', function () {
    var jsonSchema = models.Book.jsonSchema('title publisher', {
      path: 'publisher',
      select: 'email -_id'
    });

    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: {type: 'string'},
        publisher: {
          title: 'Person',
          type: 'object',
          properties: {
            email: {type: 'string'},
          },
          'x-ref': 'Person',
          description: 'Refers to Person'
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });
  });

  it('should build schema and populate array item', function () {
    var jsonSchema = models.Book.jsonSchema('title author', 'author');
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: {type: 'string'},
        author: {
          type: 'array',
          items: {
            title: 'Person',
            type: 'object',
            properties: {
              firstName: {type: 'string'},
              lastName: {type: 'string'},
              email: {type: 'string'},
              isPoet: {type: 'boolean', default: false},
              _id: {type: 'string', pattern: '^[0-9a-fA-F]{24}$'},
              __v: {type: 'number'}
            },
            'x-ref': 'Person',
            description: 'Refers to Person'
          },
          minItems: 1
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });
  });


  it('should build schema and populate array item with selected fields', function () {
    var jsonSchema = models.Book.jsonSchema('title author', {
      path: 'author',
      select: 'firstName isPoet'
    });
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: {type: 'string'},
        author: {
          type: 'array',
          items: {
            title: 'Person',
            type: 'object',
            properties: {
              firstName: {type: 'string'},
              isPoet: {type: 'boolean', default: false},
              _id: {type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
            },
            'x-ref': 'Person',
            description: 'Refers to Person'
          },
          minItems: 1
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });
  });

  it('should build schema and should not populate unselected child-field', function () {
    var jsonSchema = models.Book.jsonSchema('title', 'publisher');
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: {type: 'string'},
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });
  });

  it('should build schema and populate field of array item', function () {
    var jsonSchema = models.Book.jsonSchema('title author comment', 'author comment.editor');

    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        comment: {
          type: 'array',
          items: {
            title: 'itemOf_comment',
            type: 'object',
            properties: {
              body: { type: 'string' },
              editor: {
                title: 'Person',
                type: 'object',
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  isPoet: {type: 'boolean', default: false },
                  _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
                  __v: { type: 'number' }
                },
                'x-ref': 'Person',
                description: 'Refers to Person'
              },
              _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
            }
          }
        },
        author: {
          type: 'array',
          items: {
            title: 'Person',
            type: 'object',
            properties: {
              firstName: {type: 'string'},
              lastName: {type: 'string'},
              email: {type: 'string'},
              isPoet: {type: 'boolean', default: false},
              _id: {type: 'string', pattern: '^[0-9a-fA-F]{24}$'},
              __v: {type: 'number'}
            },
            'x-ref': 'Person',
            description: 'Refers to Person'
          },
          minItems: 1
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'}
      }
    });

  });

  it('should populate before paths excluded', function() {
    const jsonSchema = models.Book.jsonSchema(
      "-publisher._id -publisher.__v",
      "publisher"
    );

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
              editor: {
                type: 'string',
                'x-ref': 'Person',
                description: 'Refers to Person',
                pattern: '^[0-9a-fA-F]{24}$'
              },
              _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
            }
          }
        },
        official: {
          title: 'official',
          type: 'object',
          properties: { slogan: { type: 'string' }, announcement: { type: 'string' } }
        },
        publisher: {
          title: 'Person',
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            isPoet: { type: 'boolean', default: false }
          },
          'x-ref': 'Person',
          description: 'Refers to Person'
        },
        description: { type: 'string' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        __v: { type: 'number' }
      }
    });
  });

  it('should not fail when populating not a field', function() {
    const jsonSchema = models.Book.jsonSchema(
      "",
      "a_publisher"
    );
  });

  it('should not fail when populating a non-object field', function() {
    const jsonSchema = models.Book.jsonSchema(
      "",
      "year"
    );
  });

  it('should not fail when populating field with incorrect reference', function() {
    const Ugly = require('../models/ugly');
    const jsonSchema = Ugly.jsonSchema("", "publisher");
  });

});
