
const mongoose = require('../../index')(require('mongoose'));
const assert = require('assert');

const models = require('../models');

describe('Field selection: model.jsonSchema()', () => {
  it('should build schema for fields pointed explicitly (string)', () => {
    const jsonSchema = models.Book.jsonSchema('title year');
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

  it('should build schema for fields pointed explicitly (array)', () => {
    const jsonSchema = models.Book.jsonSchema(['title', 'year']);
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

  it('should build schema for fields pointed explicitly (object)', () => {
    const jsonSchema = models.Book.jsonSchema({ title: 1, year: true });
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

  it('should build schema for fields pointed explicitly, excluding _id (string)', () => {
    const jsonSchema = models.Book.jsonSchema('title year -_id');
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
      },
    });
  });

  it('should build schema for fields pointed explicitly, excluding _id (array)', () => {
    const jsonSchema = models.Book.jsonSchema(['title', 'year', '-_id']);
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
      },
    });
  });

  it('should build schema for fields pointed explicitly, excluding _id (object)', () => {
    const jsonSchema = models.Book.jsonSchema({ title: 1, year: true, _id: 0 });
    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
      },
    });
  });

  it('should build schema excluding pointed fields (string)', () => {
    const jsonSchema = models.Book.jsonSchema(
      '-author -comment -official -publisher -description -__v',
    );
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

  it('should build schema excluding pointed fields (array)', () => {
    const jsonSchema = models.Book.jsonSchema([
      '-author', '-comment', '-official', '-publisher', '-description', '-__v',
    ]);
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

  it('should build schema excluding pointed fields (object)', () => {
    const jsonSchema = models.Book.jsonSchema({
      author: false,
      comment: false,
      official: false,
      publisher: false,
      description: false,
      __v: false,
    });
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

  it('should build schema for fields of nested objects (string)', () => {
    const jsonSchema = models.Book.jsonSchema('title official.slogan');

    assert.deepEqual(jsonSchema, {
      title: 'Book',
      type: 'object',
      properties: {
        title: { type: 'string' },
        official: {
          title: 'official',
          type: 'object',
          properties: {
            slogan: { type: 'string' },
          },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should build schema for fields of nested array (string)', () => {
    const jsonSchema = models.Book.jsonSchema('title comment.body');
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
            },
          },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });


  it('should build schema for fields of nested array explicitly included by array name (string)', () => {
    const jsonSchema = models.Book.jsonSchema('title comment');

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
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                'x-ref': 'Person',
                description: 'Refers to Person',
              },
              _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
            },
          },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should build schema for fields of nested array explicitly included by array name (string) and excluding some nested field', () => {
    const jsonSchema = models.Book.jsonSchema('title comment -comment._id');

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
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                'x-ref': 'Person',
                description: 'Refers to Person',
              },
            },
          },
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should correctly process fields deselected on schema-level', () => {
    const mSchema = new mongoose.Schema({
      x: Number,
      y: { type: Number, required: true, select: false },
    });

    const aModel = mongoose.model('aModel', mSchema);

    const jsonSchema = aModel.jsonSchema('x y');

    assert.deepEqual(jsonSchema, {
      title: 'aModel',
      type: 'object',
      properties: {
        x: { type: 'number' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should correctly process overriding of deselection on schema-level', () => {
    const mSchema = new mongoose.Schema({
      x: Number,
      y: { type: Number, required: true, select: false },
    });

    const zModel = mongoose.model('zModel', mSchema);

    const jsonSchema = zModel.jsonSchema('x +y');

    assert.deepEqual(jsonSchema, {
      title: 'zModel',
      type: 'object',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should correctly process id field selection (virtuals)', () => {
    const mSchema = new mongoose.Schema({
      x: Number,
    }, {
      toJSON: { virtuals: true },
    });

    const zModel = mongoose.model('z1Model', mSchema);

    const jsonSchema = zModel.jsonSchema('x +y -_id id');

    assert.deepEqual(jsonSchema, {
      title: 'z1Model',
      type: 'object',
      properties: {
        x: { type: 'number' },
        id: { },
      },
    });
  });

  it('should correctly process id field selection (getters)', () => {
    const mSchema = new mongoose.Schema({
      x: Number,
    }, {
      toJSON: { getters: true },
    });

    const zModel = mongoose.model('z2Model', mSchema);

    const jsonSchema = zModel.jsonSchema('x +y id');

    assert.deepEqual(jsonSchema, {
      title: 'z2Model',
      type: 'object',
      properties: {
        x: { type: 'number' },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        id: { },
      },
    });
  });
});
