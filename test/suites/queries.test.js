require('../../index')(require('mongoose'));
const assert = require('assert');

const models = require('../models');

describe('Queries: query.jsonSchema()', () => {
  it('should build schema for query result', () => {
    const jsonSchema = models.Book.find().jsonSchema();

    assert.deepEqual(jsonSchema, {
      title: 'List of Books',
      type: 'array',
      items: {
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

              pattern: '^[0-9a-fA-F]{24}$',
            },
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

                  pattern: '^[0-9a-fA-F]{24}$',
                },
                _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
              },
              required: ['editor'],
            },
          },
          official: {
            title: 'official',
            type: 'object',
            properties: {
              slogan: { type: 'string' },
              announcement: { type: 'string' },
            },
          },
          publisher: {
            type: 'string',
            'x-ref': 'Person',
            description: 'Refers to Person',

            pattern: '^[0-9a-fA-F]{24}$',
          },
          description: { type: 'string' },
          _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
          __v: { type: 'number' },
        },
      },
    });
  });

  it('should build schema for query result (selected fields)', () => {
    const jsonSchema = models.Book.find({}, 'title author').jsonSchema();

    assert.deepEqual(jsonSchema, {
      title: 'List of Books',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          author: {
            type: 'array',
            items: {
              type: 'string',
              'x-ref': 'Person',
              description: 'Refers to Person',

              pattern: '^[0-9a-fA-F]{24}$',
            },
          },
          _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        },
      },
    });
  });

  it('should build schema for query result (populate)', () => {
    const jsonSchema = models.Book
      .find({}, 'title author')
      .populate('author')
      .jsonSchema();

    assert.deepEqual(jsonSchema, {
      title: 'List of Books',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          author: {
            type: 'array',
            items: {
              title: 'Person',
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                isPoet: { type: 'boolean', default: false },
                _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
                __v: { type: 'number' },
              },
              'x-ref': 'Person',
              description: 'Refers to Person',
            },
          },
          _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        },
      },
    });
  });

  it('should build schema for query result and reflect limit', () => {
    const jsonSchema = models.Book
      .find({}, 'title year')
      .limit(5)
      .jsonSchema();

    assert.deepEqual(jsonSchema, {
      title: 'List of Books',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          year: { type: 'number' },
          _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        },
      },
      maxItems: 5,
    });
  });

  it('should build schema for findOne-query result', () => {
    const jsonSchema = models.Book
      .findOne({}, 'title year')
      .limit(5)
      .jsonSchema();

    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });
});
