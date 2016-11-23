'use strict';

var async = require("async");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, required: true, index: true, unique: true},
  isPoet: {type: Boolean, default: false}
});

PersonSchema.virtual("fullName").set(function (v) {
	var parts = v.split(/\s/);
	this.firtsName = parts.shift() || '';
	this.lastName = parts.join(' ') || '';
	return this.get("fullName");
}).get(function () {
	return this.firstName + " " + this.lastName;
});

PersonSchema.path("email").set(function(v) {
	return v.toLowerCase();
});

PersonSchema.methods.toUpperCase = function(req, callback) {
	this.firstName = this.firstName.toUpperCase();
	this.lastName = this.lastName.toUpperCase();
	this.save(function (err) {
		if (err) return callback(err, null);
		callback(null, {status: "Ok"});
	});
}

PersonSchema.methods.Reverse = function(req, callback) {
	this.firstName = this.firstName.split("").reverse().join("");
	this.lastName = this.lastName.split("").reverse().join("");
	this.save(function (err) {
		if (err) return callback(err, null);
		callback(null, {status: "Ok"});
	});
}


PersonSchema.statics.emailList = function(req, callback) {
	this.find({}, {"email": true}).sort('email').exec(function(err, results) {
		if (err) return callback(err, null);
		callback(null, results.map(function (p) { return p.email;} ));
	});
}


module.exports = exports = mongoose.model('Person', PersonSchema);
