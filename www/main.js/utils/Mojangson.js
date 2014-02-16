var Mojangson = {}

Mojangson.stringify = function(object) {
	if (typeof object == "string") {
		return "\"" + this.escape(object) + "\"";
	} else if (typeof object == "number") {
		return "" + object;
	} else if (object instanceof Array) {
		var values = [];
		for (var i = 0, l = object.length; i < l; ++i) {
			values.push(this.stringify(object[i]));
		}
		return "[" + values.join(",") + "]";
	} else {
		var values = [];
		for (var key in object) {
			values.push(key + ":" + this.stringify(object[key]));
		}
		return "{" + values.join(",") + "}";
	}
}

Mojangson.escape = function(string) {
	var result = [];
	var j = 0, l = string.length;
	for (var i = 0; i < l; ++i) {
		var c = string.charAt(i);
		if (c == "\\" || c == "\"") {
			if (j != i) {
				result.push(string.substr(j, i - j));
			}
			result.push("\\" + c);
			j = i + 1;
		}
	}
	if (j != l) {
		result.push(string.substr(j, i - j));
	}
	return result.join("");
}
