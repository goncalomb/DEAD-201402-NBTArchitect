var MC_COLORS = {
	"0": "000000",
	"1": "0000AA",
	"2": "00AA00",
	"3": "00AAAA",
	"4": "AA0000",
	"5": "AA00AA",
	"6": "FFAA00",
	"7": "AAAAAA",
	"8": "555555",
	"9": "5555FF",
	"a": "55FF55",
	"b": "55FFFF",
	"c": "FF5555",
	"d": "FF55FF",
	"e": "FFFF55",
	"f": "FFFFFF"
};
var MC_STYLES = {
	"l": "font-weight: bold;",
	"m": "text-decoration: line-through;",
	"n": "text-decoration: underline;",
	"o": "font-style: italic;"
}

var randomInt = function(min, max) {
	return Math.floor(Math.random()*(max - min + 1) + min);
}

var parseMinecraftColors = function(string) {
	var result = [];
	var color = false;
	var style = false;
	var j = 0;
	for (var i = 0, l = string.length - 1; i < l; ++i) {
		var c = string.charAt(i);
		if (c == "§") {
			var d = string.charAt(i + 1);
			var isFormattingCode = (isDefined(MC_COLORS[d]) || isDefined(MC_STYLES[d]) || d == "k" || d == "r");
			if (isFormattingCode) {
				result.push(string.substr(j, i - j));
				if (style) result.push("</span>");
			}
			if (isDefined(MC_COLORS[d])) {
				if (style) style = false;
				if (color) result.push("</span>");
				result.push("<span style=\"color: #" + MC_COLORS[d] + ";\">");
				color = true;
			} else if (isDefined(MC_STYLES[d])) {
				result.push("<span style=\"" + MC_STYLES[d] + "\">");
				style = true;
			} else if (d == "k") {
				result.push("<span class=\"mc-k\">");
				style = true;
			} else if (d == "r") {
				if (color) result.push("</span>");
				color = style = false;
			}
			if (isFormattingCode) {
				j = i + 2;
				++i;
			}
		}
	}
	result.push(string.substr(j));
	if (color) result.push("</span>");
	if (style) result.push("</span>");
	return result.join("");
}

var randomizeChars = function() {
	$("span.mc-k").find("*").andSelf().contents().filter(function() { return (this.nodeType == 3); }).each(function() {
		var text = "";
		for (var i = 0, l = this.nodeValue.length; i < l; ++i) {
			text += String.fromCharCode(randomInt(33, 126));
		}
		this.nodeValue = text;
	});
	setTimeout(randomizeChars, 200);
}

$(document).ready(randomizeChars);
