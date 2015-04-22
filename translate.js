var fs = require("fs");
var async = require("async");
var traverse = require("traverse");

// RUN
var run = function(dir, languages, finish) {

	// TRANSLATE
	var translate = function(text, callback) {

		// TODO: passthrough if contains HTML or is an URL

		// return translation
		return callback(null, text);
	};

	// PROCESS FILE
	var processFile = function(file, callback) {

		// open file
		fs.readFile(dir + file, function (err, data) {
			
			// bubble up error
			if(err) return callback(err, null);

			// replace define braces
			data = data.toString();
			data = data.replace("define({", "{");
			data = data.replace("});", "}");

			// try to parse remainder to JSON
			var parsed;
			try {
				parsed = JSON.parse(data);	
			}
			catch(e) {
				return callback(e, null);
			}

			// check if file has root element
			if("root" in parsed) {

				var traversed = traverse(parsed["root"]);

				// "deep clone" the root element into a target object
				var target = traverse(traversed.clone());

				// find all paths of the object keys recursively
				var paths = traversed.paths();

				// translate each path
				async.each(paths, function(path, done) {

					var text = traversed.get(path);

					// only continue for strings
					if(typeof(text) !== "string") {
						return done(null);
					}

					// translate the text
					translate(text, function(err, translation) {

						if(err) return done(err);

						// add new value to path
						target.set(path, translation);
						console.log(translation);

						return done(null);
					});
				}, 

				// all are translated
				function(err) {
					return callback(err, true);
				});
			}
			else {
				return callback("no root element found", null);
			}
		});
	};

	// read all files in directory
	fs.readdir(dir, function(err, files) {

		// could not read directory, bubble up error
		if(err) return callback(err, null);

		// filter out all other files then .js
		files = files.filter(function(file) {
			return file.indexOf(".js") > 0;
		});

		// process each file individually
		async.map(files, processFile, finish);
	});
};

// EXPORTS
module.exports = {
	"run": run
}