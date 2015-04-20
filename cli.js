#!/usr/bin/env node

'use strict';

var translate = require("./translate");

var args = process.argv;

if(args.length <= 2) {
	throw "not enough arguments: i18n-translate ./startDir";
}

// get the start directory from parameters
var startDir = args[2];

// run translation
translate.run(startDir);
