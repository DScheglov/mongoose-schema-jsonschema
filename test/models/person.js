const mongoose = require('mongoose');

const { Schema } = mongoose;

const PersonSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String, required: true, index: true, unique: true,
  },
  isPoet: { type: Boolean, default: false },
});

PersonSchema.virtual('fullName').set(function setFullName(v) {
  const parts = v.split(/\s/);
  this.firtsName = parts.shift() || '';
  this.lastName = parts.join(' ') || '';
  return this.get('fullName');
}).get(function getFullName() {
  return `${this.firstName} ${this.lastName}`;
});

PersonSchema.path('email').set(v => v.toLowerCase());

PersonSchema.methods.toUpperCase = function toLowerCase(req, callback) {
  this.firstName = this.firstName.toUpperCase();
  this.lastName = this.lastName.toUpperCase();
  this.save(err => {
    if (err) return callback(err, null);
    return callback(null, { status: 'Ok' });
  });
};

PersonSchema.methods.Reverse = function Reverse(req, callback) {
  this.firstName = this.firstName.split('').reverse().join('');
  this.lastName = this.lastName.split('').reverse().join('');
  this.save(err => {
    if (err) return callback(err, null);
    return callback(null, { status: 'Ok' });
  });
};


PersonSchema.statics.emailList = function emailList(req, callback) {
  this.find({}, { email: true }).sort('email').exec((err, results) => {
    if (err) return callback(err, null);
    return callback(null, results.map(p => p.email));
  });
};


module.exports = mongoose.model('Person', PersonSchema);
