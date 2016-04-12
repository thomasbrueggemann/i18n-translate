#!/usr/bin/env node

'use strict';

var translate = require("./translate");
var path = require("path");

var args = process.argv;

if (args.length < 6) {
	throw "not enough arguments: i18n-translate apiKey startDir sourceLang targetLang1,targetLang2,.. (file1,file2,..)";
}

// get the start directory from parameters
var apiKey = args[2];
var startDir = args[3];
var sourceLang = args[4];
var targetLang = args[5].split(",");
var fileFilter = (args.length == 7) ? args[6].split(",") : null;

// trim whitespaces for targetlangs
for (var i = 0; i < targetLang.length; i++) {
	targetLang[i] = targetLang[i].trim();
}

// trim whitespaces for filefilter
if (fileFilter) {
	for (var i = 0; i < fileFilter.length; i++) {
		fileFilter[i] = fileFilter[i].trim();
	}
}

// append / at the end of directory
if (startDir[startDir.length - 1] != "/") {
	startDir += "/";
}

path.resolve(__dirname, startDir);

// run translation
translate.run(apiKey, startDir, sourceLang, targetLang, fileFilter, function(err, result) {

	if (err) {
		console.log("ERROR:");
		console.log(err);
		process.exit(0);
	}

	var merged = [];
	merged = merged.concat.apply(merged, result[0]);

	console.log("\nThese paths are left untranslated:\n");

	for (var i in merged)  {
		console.log("File: " + merged[i]["target"] + "/" + merged[i]["file"]);
		console.log("Path: " + merged[i]["path"][0]);
		console.log("-----------------------------------");
	}

	process.exit(0);
});