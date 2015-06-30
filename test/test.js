'use strict';

var translate = require("../translate");

// dummy config
var config = {
	"apiKey": null
};

// try to overwrite config with local file
try {
	config = require("./config");
} catch (e) {}

describe("i18n-translate ", function() {

	it("should create a translation file for en, fr", function(done) {

		// run a translation batch
		translate.run(config.apiKey, "test/data1/", "de", ["en", "fr"], null, function(err, result) {

			result.should.not.equal(null);
			result.length.should.not.equal(0);

			var merged = [];
			merged = merged.concat.apply(merged, result[0]);
			console.log(merged);

			return done();
		});
	});

	it("should throw an error for malformed json", function(done) {

		translate.run(config.apiKey, "test/data2/", "de", ["en"], null, function(err, result) {

			console.log("ERROR:");
			console.log(err);

			err.should.not.equal(null);
			return done();
		});

	});

	it("should only translate the test2.js file and leave the test.js file untranslated", function(done) {

		translate.run(config.apiKey, "test/data3/", "de", ["en"], ["test2.js"], function(err, result) {

			result.should.not.equal(null);
			result.length.should.not.equal(0);
			return done();
		});

	});
});