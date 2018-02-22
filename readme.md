[![Build status](https://travis-ci.org/DScheglov/mongoose-schema-jsonschema.svg?branch=master)](https://travis-ci.org/DScheglov/mongoose-schema-jsonschema)
[![Coverage Status](https://coveralls.io/repos/github/DScheglov/mongoose-schema-jsonschema/badge.svg?branch=master)](https://coveralls.io/github/DScheglov/mongoose-schema-jsonschema?branch=master)

# mongoose-schema-jsonschema

The module allows to create json schema from Mongoose schema by adding
`jsonSchema` method to `mongoose.Schema`, `mongoose.Model` and `mongoose.Query`
classes

## Contents
 - [Installation](#installation)
 - [Samples](#samples)
 - [Validation tools](#validation-tools)
 - [Specifications](#specifications)
 - [Custom Schema Types Support](#custom-schema-types-support)
 - [Command line](#command-line)

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
    _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
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
    _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
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
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        __v: { type: 'number' }
      },
      required: [ 'firstName', 'lastName' ],
      'x-ref': 'Person',
      description: 'Refers to Person'
    },
    _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
    __v: { type: 'number' }
  },
  required: [ 'title', 'author' ]
}
```

```javascript
'use strict';

const extendMongooose = require('mongoose-schema-jsonschema');
const mongoose = extendMongooose(require('mongoose'));

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {type: String, required: true},
  year: Number,
  author: {type: Schema.Types.ObjectId, required: true, ref: 'Person'}
});

const Book = mongoose.model('Book', BookSchema);
const Q = Book.find().select('title').limit(5);


console.dir(Q.jsonSchema(), {depth: null});
```

Output:
```javascript
{
  title: 'List of books',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
    }
  },
  maxItems: 5
}
```

## Validation tools
Created by **mongoose-schema-jsonschema** json-schema's could be used for
document validation with:
 - [`ajv`](https://www.npmjs.com/package/ajv)
 - [`jsonschema`](https://www.npmjs.com/package/jsonschema)

## Specifications

### mongoose.Schema.prototype.jsonSchema
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

if `fields` specified the method removes `required` constraints

Declaration:
```javascript
function model_jsonSchema(fields, populate) { ... }
```

 Parameters:
 - **fields**: `String`|`Array`|`Object` - mongoose selection object
 - **populate**: `String`|`Object` - mongoose population options
 - *Returns* `Object` - json schema


 ### mongoose.Query.prototype.jsonSchema
 Builds json schema considering the query type and query options.
 The method returns the schema for array if query type is `find` and
 the schema for single document if query type is `findOne` or `findOneAnd*`.

 In case when the method returns schema for array the collection name is used to
 form title of the resulting schema. In `findOne*` case the title is the name
 of the appropriate model.

 Declaration:
 ```javascript
 function query_jsonSchema() { ... }
 ```

  Parameters:
  - *Returns* `Object` - json schema


## Custom Schema Types Support

If you use custom Schema Types you should define the jsonSchema method
for your type-class(es).

The base functionality is accessible from your code by calling base-class methods:

```javascript
newSchemaType.prototype.jsonSchema = function() {
  // Simple types (strings, numbers, bools):
  var jsonSchema = mongoose.SchemaType.prototype.jsonSchema.call(this);

  // Date:
  var jsonSchema = Types.Date.prototype.jsonSchema.call(this);

  // ObjectId
  var jsonSchema = Types.ObjectId.prototype.jsonSchema.call(this);

  // for Array (or DocumentArray)
  var jsonSchema = Types.Array.prototype.jsonSchema.call(this);

  // for Embedded documents
  var jsonSchema = Types.Embedded.prototype.jsonSchema.call(this);

  // for Mixed documents:
  var jsonSchema = Types.Mixed.prototype.jsonSchema.call(this);

  /*
   *
   * Place your code instead of this comment
   *
   */

   return jsonSchema;
}
```



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
  Usage: jsonschema-builder [options] <pathToModels>

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -j, --json     JSON format for output
    -n, --noid     Removes id field from resulting schema
```
Samples and other details can be reached by the link:
[jsonschema-builder](https://www.npmjs.com/package/jsonschema-builder)


### Releases:
 - version 1.0 - Basic functionality
 - version 1.1 - Mongoose.Query support implemented
 - version 1.1.5 - uuid issue fixed, ajv compliance verified
 - version 1.1.8 - Schema.Types.Mixed issue fixed
 - version 1.1.9 - readonly settings support added
 - version 1.1.11 - required issue fixed [issue#2](https://github.com/DScheglov/mongoose-schema-jsonschema/issues/2)
 - version 1.1.12 - mixed-type fields description and title support added (fix for issue: [issue#3](https://github.com/DScheglov/mongoose-schema-jsonschema/issues/3))
 - version 1.1.15 - support for mongoose@5.x ensured [issue#8](https://github.com/DScheglov/mongoose-schema-jsonschema/issues/8)

### Supported versions:
  - node.js: 4.x, 5.x, 6.x, 8.x, 9.x
  - mongoose: 4.x, 5.x