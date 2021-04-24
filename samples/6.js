const { Schema } = require('../index')();

const BookSchema = new Schema({
  title: { type: String, required: true, notes: 'Book Title' },
  year: Number,
  author: { type: String, required: true },
  comments: {
    type: Map,
    of: new Schema({
      createdAt: { type: Number, required: true },
      author: { type: String, required: true },
      body: String,
    }, { _id: false }),
  },
});

console.dir(BookSchema.jsonSchema(), { depth: null });
