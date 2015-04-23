'use strict';

var translate = require("../translate");
//var config    = require("./config");

describe("i18n-translate ", function () {

	it("should not fail", function (done) {
		true.should.equal(true);
		return done();
	});

	it("should create a translation file for en,fr)", function(done) {

		// run a translation batch
		translate.run(null/*config.apiKey*/, "test/data/", "de", ["en", "fr"], function(err, result) {

			result.should.not.equal(null);
			result.length.should.not.equal(0);

			var merged = [];
			merged = merged.concat.apply(merged, result[0]);
			console.log(merged);
			return done();
		});
	});
});