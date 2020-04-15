const mongoose = require('mongoose');

const { Schema } = mongoose;

const UglySchema = new Schema({
  title: { type: String, required: true, index: true },
  year: { type: Number, required: true, index: true },
  publisher: { type: Schema.Types.ObjectId, required: true, ref: 'UnExistingModel' },
  description: String,
});

module.exports = mongoose.model('Ugly', UglySchema);
