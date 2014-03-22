var Mojangson = {
	FORMATTING_REGEX: /[0-9a-aA-Zk-oK-OrR]/
}

Mojangson.stringify = function(object, formattingChar) {
	if (typeof object == "string") {
		return "\"" + this.escape(object, formattingChar) + "\"";
	} else if (typeof object == "number") {
		return "" + object;
	} else if (object instanceof Array) {
		var values = [];
		for (var i = 0, l = object.length; i < l; ++i) {
			values.push(this.stringify(object[i], formattingChar));
		}
		return "[" + values.join(",") + "]";
	} else {
		var values = [];
		for (var key in object) {
			values.push(key + ":" + this.stringify(object[key], formattingChar));
		}
		return "{" + values.join(",") + "}";
	}
}

Mojangson.escape = function(string, formattingChar) {
	if (!formattingChar || typeof formattingChar != "string" || formattingChar.length != 1 || formattingChar == "§") {
		formattingChar = null;
	}
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
		} else if (formattingChar && c == "§" && i + 1 < l && this.FORMATTING_REGEX.exec(string.charAt(i + 1))) {
			if (j != i) {
				result.push(string.substr(j, i - j));
			}
			result.push(formattingChar);
			j = i + 1;
		}
	}
	if (j != l) {
		result.push(string.substr(j, i - j));
	}
	return result.join("");
}
