var fs = require("fs");
var path = require("path");
var JavaScriptObfuscator = require('javascript-obfuscator');
var dir = './dist/';
fs.readdir(dir, function(err, list) {
    if (err) { throw err; }
    list.forEach(function(file) {
        if(file.slice(-2) === 'js' && (file.substr(0,5) === 'main.' || file.substr(0,10) === 'polyfills.')) {
            var filepath = path.resolve(dir, file);
            var backup = filepath + ".bak";
            fs.renameSync(filepath,backup);
            fs.readFile(backup, "UTF-8", function(err, data) {
                if (err) { throw err; }
                // Obfuscate content of the JS file
                var obfuscationResult = JavaScriptObfuscator.obfuscate(data);
                // Write the obfuscated code into a new file
                fs.writeFile(filepath, obfuscationResult.getObfuscatedCode() , function(err) {
                    if(err) { return console.log(err); }
                    console.log(filepath + " obfuscated!");
                });
            });
        }
    });
});
