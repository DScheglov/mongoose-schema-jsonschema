# mongoose-schema-jsonschema

The module allows to create json schema from Mongoose schema by adding
`jsonSchema` method to `mongoose.Schema` and `mongoose.Model` classes

#### [Installation](#installation) | [Samples](#samples) | [Specifications](#specifications) | [Command line](#command-line)

-----------------

## Installation
```shell
npm install mongoose-schema-jsonschema
```

## Samples

Let's build json schema from simple mongoose schema
```javascript
'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {type: String, required: true},
  year: Number,
  author: {type: String, required: true}
});

let jsonSchema = BookSchema.jsonSchema();

console.dir(jsonSchema, {depth: null});

```
Output:
```javascript
{
  type: 'object',
  properties: {
    title: { type: 'string' },
    year: { type: 'number' },
    author: { type: 'string' },
    _id: { type: 'string', format: 'uuid', pattern: '^[0-9a-fA-F]{24}$' }
  },
  required: [ 'title', 'author' ]
}
```

The mongoose.Model.jsonSchema method allows to build json schema considering
the field selection and population

```javascript
'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {type: String, required: true},
  year: Number,
  author: {type: Schema.Types.ObjectId, required: true, ref: 'Person'}
});

const PersonSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  dateOfBirth: Date
});

const Book = mongoose.model('Book', BookSchema);
const Person = mongoose.model('Person', PersonSchema)

console.dir(Book.jsonSchema('title year'), {depth: null});
console.dir(Book.jsonSchema('', 'author'), {depth: null});

```

Output:
```javascript
{
  title: 'Book',
  type: 'object',
  properties: {
    title: { type: 'string' },
    year: { type: 'number' },
    _id: { type: 'string', format: 'uuid', pattern: '^[0-9a-fA-F]{24}$' }
  }
}
{
  title: 'Book',
  type: 'object',
  properties: {
    title: { type: 'string' },
    year: { type: 'number' },
    author: {
      title: 'Person',
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        dateOfBirth: { type: 'string', format: 'date-time' },
        _id: { type: 'string', format: 'uuid', pattern: '^[0-9a-fA-F]{24}$' },
        __v: { type: 'number' }
      },
      required: [ 'firstName', 'lastName' ],
      'x-ref': 'Person',
      description: 'Refers to Person'
    },
    _id: { type: 'string', format: 'uuid', pattern: '^[0-9a-fA-F]{24}$' },
    __v: { type: 'number' }
  },
  required: [ 'title', 'author' ]
}
```

## Specifications

### mongoose.Schema.prototpye.jsonSchema
Builds the json schema based on the Mongooose schema.
if schema has been already built the method returns new deep copy

Method considers the `schema.options.toJSON.virtuals` to included
the virtual paths (without detailed description)

Declaration:
```javascript
function schema_jsonSchema(name) { ... }
```

Parameters:
 - **name**: `String` -  Name of the object
 - *Returns* `Object` - json schema


### mongoose.Model.jsonSchema
Builds json schema for model considering the selection and population

if `fields` specified the method removes `required` contraints

Declaration:
```javascript
function model_jsonSchema(fields, populate) { ... }
```

 Parameters:
 - **fields**: `String`|`Array`|`Object` - mongoose selection object
 - **populate**: `String`|`Object` - mongoose population options
 - *Returns* `Object` - json schema


## Command line

There is a command line utility to build schema without importing `mongoose-schema-jsonschema`
to your project

```shell
npm i -g jsonschema-builder
```

### Usage

Getting options:
```shell
jsonschema-builder --help
```

Output:
```shell
  Usage: index [options] <pathToModels>

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -j, --json     JSON format for output
    -n, --noid     Removes id field from resulting schema
```
Samples and other details can be reached by the link:
[jsonschema-builder](https://www.npmjs.com/package/jsonschema-builder)
