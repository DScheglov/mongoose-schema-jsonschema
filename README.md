[![Build status](https://travis-ci.org/DScheglov/mongoose-schema-jsonschema.svg?branch=master)](https://travis-ci.org/DScheglov/mongoose-schema-jsonschema)
[![Coverage Status](https://coveralls.io/repos/github/DScheglov/mongoose-schema-jsonschema/badge.svg?branch=master)](https://coveralls.io/github/DScheglov/)
[![npm downloads](https://img.shields.io/npm/dm/mongoose-schema-jsonschema)](https://www.npmjs.com/package/mongoose-schema-jsonschema)
[![David](https://img.shields.io/david/DScheglov/mongoose-schema-jsonschema)](https://www.npmjs.com/package/mongoose-schema-jsonschema)
[![NPM](https://img.shields.io/npm/l/mongoose-schema-jsonschema)](https://github.com/DScheglov/mongoose-schema-jsonschema/blob/master/LICENSE)

# mongoose-schema-jsonschema

The module allows to create json schema from Mongoose schema by adding
`jsonSchema` method to `mongoose.Schema`, `mongoose.Model` and `mongoose.Query`
classes

## Contents
 - [Installation](#installation)
 - [Schema Build Configuration](#schema-build-configuration)
 - [Samples](#samples)
 - [Validation tools](#validation-tools)
 - [Specifications](#specifications)
 - [Custom Schema Types Support](#custom-schema-types-support)
 - [Releases](#releases)
 - [Supported Versions](#supported-versions)
 

-----------------

## Installation
```shell
npm install mongoose-schema-jsonschema
```


## Schema Build Configuration

Since v1.4.0 it is able to configure how `jsonSchema()` works.

To do that package was extended with `config` function.

```js
const config = require('mongoose-schema-jsonschema/config');

config({
  // ... options go here
});
```

Currently there are two options that affects build process:

- **forceRebuild**: `boolean` -- **mongoose-schema-jsonschema** caches json schemas built for mongoose schemas.
  That means we cannot built updated jsonSchema after some updates were made in the mongoose schema
  that already has jsonSchema.
  To resolve this issue the `forceRebuild` was added (see sample bellow)

- **fieldOptionsMapping**: `{ [key: string]: string } | Array<string|[string, string]>` - allows to specify how to convert some custom options specified in the mongoose field definition.

```js
const mongoose = require('mongoose-schema-jsonschema')();
const config = require('mongoose-schema-jsonschema/config');

const { Schema } = mongoose;

const BookSchema = new Schema({
  title: { type: String, required: true, notes: 'Book Title' },
  year: Number,
  author: { type: String, required: true },
});

const fieldOptionsMapping = {
  notes: 'x-notes',
};

config({ fieldOptionsMapping });
console.dir(BookSchema.jsonSchema(), { depth: null });

config({ fieldOptionsMapping: [], forceRebuild: true }); // reseting
console.dir(BookSchema.jsonSchema(), { depth: null });
```

**Output**:
```js
{
  type: 'object',
  properties: {
    title: { type: 'string', 'x-notes': 'Book Title' },
    year: { type: 'number' },
    author: { type: 'string' },
    _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
  },
  required: [ 'title', 'author' ]
}
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




## Samples

Let's build json schema from simple mongoose schema
```javascript
const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  year: Number,
  author: { type: String, required: true },
});

const jsonSchema = BookSchema.jsonSchema();

console.dir(jsonSchema, { depth: null });

```

**Output**:

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
const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  year: Number,
  author: { type: Schema.Types.ObjectId, required: true, ref: 'Person' }
});

const PersonSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: Date
});

const Book = mongoose.model('Book', BookSchema);
const Person = mongoose.model('Person', PersonSchema)

console.dir(Book.jsonSchema('title year'), { depth: null });
console.dir(Book.jsonSchema('', 'author'), { depth: null });

```

**Output**:

```javascript
{
  title: 'Book',
  type: 'object',
  properties: {
    title: { type: 'string'  },
    year: { type: 'number'  },
    _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
  }
}
{
  title: 'Book',
  type: 'object',
  properties: {
    title: { type: 'string'  },
    year: { type: 'number'  },
    author: {
      title: 'Person',
      type: 'object',
      properties: {
        firstName: { type: 'string'  },
        lastName: { type: 'string'  },
        dateOfBirth: { type: 'string', format: 'date-time'  },
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'  },
        __v: { type: 'number' }
       },
      required: [ 'firstName', 'lastName' ],
      'x-ref': 'Person',
      description: 'Refers to Person'
     },
    _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$'  },
    __v: { type: 'number' }
   },
  required: [ 'title', 'author' ]
}
```

```javascript
const mongoose = require('mongoose');
const extendMongooose = require('mongoose-schema-jsonschema');

extendMongooose(mongoose);

const { Schema } = mongoose;

const BookSchema = new Schema({
  title: { type: String, required: true  },
  year: Number,
  author: { type: Schema.Types.ObjectId, required: true, ref: 'Person' }
});

const Book = mongoose.model('Book', BookSchema);
const Q = Book.find().select('title').limit(5);


console.dir(Q.jsonSchema(), { depth: null });
```

**Output**:

```javascript
{
  title: 'List of books',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      title: { type: 'string'  },
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
  const jsonSchema = mongoose.SchemaType.prototype.jsonSchema.call(this);

  // Date:
  const jsonSchema = Types.Date.prototype.jsonSchema.call(this);

  // ObjectId
  const jsonSchema = Types.ObjectId.prototype.jsonSchema.call(this);

  // for Array (or DocumentArray)
  const jsonSchema = Types.Array.prototype.jsonSchema.call(this);

  // for Embedded documents
  const jsonSchema = Types.Embedded.prototype.jsonSchema.call(this);

  // for Mixed documents:
  const jsonSchema = Types.Mixed.prototype.jsonSchema.call(this);

  /*
   *
   * Place your code instead of this comment
   *
   */

   return jsonSchema;
}
```

## Releases
 - version 1.0 - Basic functionality
 - version 1.1 - Mongoose.Query support implemented
 - version 1.1.5 - uuid issue fixed, ajv compliance verified
 - version 1.1.8 - Schema.Types.Mixed issue fixed
 - version 1.1.9 - readonly settings support added
 - version 1.1.11 - required issue fixed [issue#2](https://github.com/DScheglov/mongoose-schema-jsonschema/issues/2)
 - version 1.1.12 - mixed-type fields description and title support added (fix for issue: [issue#3](https://github.com/DScheglov/mongoose-schema-jsonschema/issues/3))
 - version 1.1.15 - support for mongoose@5.x ensured [issue#8](https://github.com/DScheglov/mongoose-schema-jsonschema/issues/8)
 - version 1.3.0
   - nullable types support (as union: `[type, 'null']`)
   - `examples` option support [issue#14](https://github.com/DScheglov/mongoose-schema-jsonschema/issues/14) 
   - support for fields dynamicly marked as `required` [issue#16](https://github.com/DScheglov/mongoose-schema-jsonschema/issues/16)
   - Node support restricted to 8.x, 9.x, 10.x, 12.x
   - Monggose support restricted to 5.x
   - _Development_:
     - migrated from `mocha` + `istanbul` to `jest`
     - added `eslint`
 - version 1.3.1 - support `minlenght` and `maxlength` [issue#21](https://github.com/DScheglov/mongoose-schema-jsonschema/issues/21)
 - version 1.4.0 - **broken** - schema build configurations (`forceRebuild` and `fieldOptionsMapping`)
 - version 1.4.2 - fix for broken version 1.4.0 [issue#22](https://github.com/DScheglov/mongoose-schema-jsonschema/issues/22)
 - version 1.4.4 - fix for field constaints [issue#25](https://github.com/DScheglov/mongoose-schema-jsonschema/issues/25)

 
## Supported versions
  - node.js: 8.x, 9.x, 10.x, 12.x
  - mongoose: 5.x