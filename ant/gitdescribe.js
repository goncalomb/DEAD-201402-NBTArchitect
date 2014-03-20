/*
 An Ant task that fetches the version from git.
*/

importPackage(java.io);
importPackage(java.lang);
importClass(java.text.SimpleDateFormat);

var property = attributes.get("property");
var alternative = attributes.get("alternative").trim();

function readAll(input) {
	var output = new ByteArrayOutputStream();
	var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
	var l;
	while ((l = input.read(buffer)) != -1) {
		output.write(buffer, 0, l);
	}
	return output.toString("UTF-8");
}

var process = null;
try {
	process = Runtime.getRuntime().exec(["git", "describe", "--dirty", "--match", "v[0-9]*",  "--always"]);
} catch (e) {
	println("Error while executing git:");
	println(e.message);
}

var version = null;
if (process) {
	if (process.waitFor() == 0) {
		var output = readAll(process.getInputStream()).trim();
		if (output.matches("^[0-9a-f]{7}.*$")) {
			println("Git found no version tags, using alternative.");
			version = alternative + "-" + output;
		} else {
			version = output.substr(1);
		}
	} else {
		var error = readAll(process.getErrorStream());
		println(error.trim());
	}
}

if (!version) {
	println("Using alternative version.");
	var dateFormat = new SimpleDateFormat("yyyyMMdd.HHmmss");
	version = alternative + "-" + dateFormat.format(new Date());
}

println("Version: " + version);
project.setProperty(property, version);
