/*
 An Ant task that merges js files.
*/

importPackage(java.io);
importPackage(java.lang);

var dir = new File(attributes.get("dir"));
var destfile = new File(attributes.get("destfile"));

function getScriptFiles(dir) {
	var file = new File(dir + "/jsmerge-list.txt");
	var scripts = [];
	var reader = new BufferedReader(new FileReader(file));
	var line;
	while ((line = reader.readLine()) != null) {
		line = line.trim();
		if (line.length() > 0 && !line.substr(0, 1).equals('#')) {
			scripts.push(line);
		}
	}
	return scripts;
}

function appendFileToWriter(writer, file) {
	var reader = new BufferedReader(new FileReader(file));
	var line;
	while ((line = reader.readLine()) != null) {
		if (line.length() > 0) {
			writer.write("\t");
			writer.write(line);
		}
		writer.write("\n");
	}
}

destfile.getParentFile().mkdirs();
var writer = new BufferedWriter(new FileWriter(destfile));
writer.write("(function() {\n\n");

var scripts = getScriptFiles(dir);
println("Merging " + scripts.length + " script(s)");
for (var i = 0; i < scripts.length; ++i) {
	appendFileToWriter(writer, new File(dir, scripts[i]));
	writer.write("\n");
}

writer.write("})();\n");
writer.close();
