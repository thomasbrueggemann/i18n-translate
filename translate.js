var fs 			= require("fs");
var async 		= require("async");
var traverse 	= require("traverse");
var google 		= require("google-translate");

var TRANSERR = {
	NOT_TRANSLATED: 1,
	IS_URL: 2
};

// RUN
var run = function(apiKey, dir, sourceLanguage, languages, finish) {

	google = google(apiKey);

	// TRANSLATE
	var translate = function(text, language, callback) {

		// passthrough if contains HTML
		if(/<[a-z][\s\S]*>/i.test(text) == true) {
			return callback(TRANSERR.NOT_TRANSLATED, text);
		}

		// it is just a url
		if(text.indexOf("http://") == 0 && text.indexOf(" ") < 0) {
			return callback(TRANSERR.IS_URL, text); 
		}

		if(apiKey) {

			// fire the google translation
			google.translate(text, sourceLanguage, language, function(err, translation) {
			  	
			  	if(err) {
			  		return callback(TRANSERR.NOT_TRANSLATED, text);
			  	}

			  	// return the translated text
			  	return callback(null, translation.translatedText);
			});
		}
		else {

			// bypass translation
			return callback(null, text);	
		}
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
				var targets = {}; 

				// create targets for every language
				for(var l in languages) {
					var lang = languages[l];
					targets[lang] = traverse(traversed.clone());

					// prepare output directories
					var outDir = dir + lang + "/";
					if(!fs.existsSync(outDir)) {
						fs.mkdirSync(outDir);
					}
				}

				// find all paths of the object keys recursively
				var paths = traversed.paths();

				// translate each path
				async.map(paths, function(path, done) {

					var text = traversed.get(path);

					// only continue for strings
					if(typeof(text) !== "string") {
						return done(null);
					}

					// translate every language for this path
					async.map(languages, function(language, translated) {

						// translate the text
						translate(text, language, function(err, translation) {

							// add new value to path
							targets[language].set(path, translation);

							var e = null;
							if(err === TRANSERR.NOT_TRANSLATED) {
								e = {
									"text": text,
									"source": sourceLanguage,
									"target": language
								};
							}

							return translated(null, e);
						});

					// all languages have been translated for this path,
					// so call the done callback of the map through all paths
					}, done);
				}, 

				// all are translated
				function(err, results) {

					// write translated targets to files
					for(var t in targets) {
						var transStr = JSON.stringify(targets[t].value, null, "\t");
						transStr = "define(" + transStr + ");";
						
						var p = dir + t + "/" + file;
						fs.writeFile(p, transStr, function() {});

						// add language to source file
						parsed[t] = true;
					}

					// prepare a new source file with appended languages
					var transStr = JSON.stringify(parsed, null, "\t");
					transStr = "define(" + transStr + ");";
					
					var p = dir + file;
					fs.writeFile(p, transStr, function() {});

					// filter out null results, to just return the not translated ones
					notTranslated = results.filter(function(item) {
						return item != null;
					});

					return callback(err, notTranslated);
				});
			}
			else {
				return callback("no root element found", []);
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