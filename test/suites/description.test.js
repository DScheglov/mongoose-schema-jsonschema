const mongoose = require('../../index')(require('mongoose'));
const assert = require('assert');

describe('Description: Schema.jsonSchema()', () => {
  it('should add description when it is specified (as description)', () => {
    const aDescrription = 'Just a string field';

    const mSchema = new mongoose.Schema({
      s: {
        type: String,
        required: true,
        description: aDescrription,
      },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.equal(jsonSchema.properties.s.description, aDescrription);
  });

  it('should add description when it is specified (as descr)', () => {
    const aDescrription = 'Just a string field';

    const mSchema = new mongoose.Schema({
      s: {
        type: String,
        required: true,
        descr: aDescrription,
      },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.equal(jsonSchema.properties.s.description, aDescrription);
  });

  it('should add title when it is specified', () => {
    const mSchema = new mongoose.Schema({
      s: {
        title: 'S',
        type: String,
        required: true,
      },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.equal(jsonSchema.properties.s.title, 'S');
  });

  it('should add title and description when they are specified', () => {
    const mSchema = new mongoose.Schema({
      s: {
        title: 'S',
        type: mongoose.Schema.Types.Mixed,
        required: true,
        descr: 'mixed content',
      },
    }, { _id: null });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        s: {
          description: 'mixed content',
          title: 'S',
        },
      },
      required: ['s'],
    });
  });

  it('should add description for array', () => {
    const mSchema = new mongoose.Schema({
      name: String,
      inputs: {
        type: [String],
        index: true,
        description: 'Information operated on by rule',
      },
      outputs: {
        type: [String],
        description: 'Information produced by rule',
      },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        name: { type: 'string' },
        inputs: {
          type: 'array',
          items: { type: 'string' },
          description: 'Information operated on by rule',
        },
        outputs: {
          type: 'array',
          items: { type: 'string' },
          description: 'Information produced by rule',
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should add examples when it is specified (as examples)', () => {
    const examples = ['Just a string field'];

    const mSchema = new mongoose.Schema({
      s: {
        type: String,
        required: true,
        examples,
      },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema.properties.s.examples, examples);
  });

  it('should add examples for array', () => {
    const mSchema = new mongoose.Schema({
      name: String,
      inputs: {
        type: [String],
        index: true,
        examples: [
          ['a', 'b', 'c'],
          ['A', 'B', 'C'],
        ],
      },
      outputs: {
        type: [String],
        examples: [
          ['z', 'y', 'x'],
          ['Z', 'Y', 'X'],
        ],
      },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        name: { type: 'string' },
        inputs: {
          type: 'array',
          items: { type: 'string' },
          examples: [
            ['a', 'b', 'c'],
            ['A', 'B', 'C'],
          ],
        },
        outputs: {
          type: 'array',
          items: { type: 'string' },
          examples: [
            ['z', 'y', 'x'],
            ['Z', 'Y', 'X'],
          ],
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });

  it('should add examples for an object', () => {
    const mSchema = new mongoose.Schema({
      name: String,
      vector: {
        type: { x: Number, y: Number },
        default: null,
        examples: [
          { x: 1, y: 2 },
          { x: 3, y: -1 },
          null,
        ],
      },
    });

    const jsonSchema = mSchema.jsonSchema();

    assert.deepEqual(jsonSchema, {
      type: 'object',
      properties: {
        name: { type: 'string' },
        vector: {
          title: 'vector',
          type: ['object', 'null'],
          default: null,
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
          },
          examples: [
            { x: 1, y: 2 },
            { x: 3, y: -1 },
            null,
          ],
        },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
    });
  });
});
