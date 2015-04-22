'use strict';

var translate = require("../translate");

describe("i18n-translate ", function () {

	it("should not fail", function (done) {
		true.should.equal(true);
		return done();
	});

	it("should create a translation file for english (en)", function(done) {

		// run a translation batch
		translate.run("test/data/", ["en"], function(err, result) {

			//err.should.equal(null);
			result.should.not.equal(null);
			result.length.should.not.equal(0);
			return done();
		});
	});
});