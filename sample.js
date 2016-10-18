var mongoose = require('./index')(require('mongoose'));
var models = require('./test/models');

module.exports = exports = models;

var jsSchema1 = models.Book.jsonSchema('', 'comment.editor');

console.dir(jsSchema1, {depth: null});

var jsSchema2 = models.Book.jsonSchema('', 'author');

console.dir(jsSchema2, {depth: null});


var jsSchema3 = models.Book.jsonSchema('', 'publisher');

console.dir(jsSchema3, {depth: null});


var jsSchema4 = models.Book.jsonSchema('', 'author comment.editor publisher');

console.dir(jsSchema4, {depth: null});

var jsSchema5 = models.Book.jsonSchema('title author', {path: 'author', select: '-_id -__v'});
console.dir(jsSchema5 , {depth: null});
