var MCObject = function() { }

MCObject.decode = function(data, version) {
	switch (data.t) {
		case "i":
			return MCItem.decode(data, version);
			break;
	}
	return null;
}

MCObject.prototype.getName = function(data) {
	return "[MCObject]";
}

MCObject.prototype.encode = function(data) {
	if (this instanceof MCItem) {
		data.t = "i";
	}
}

MCObject.prototype.decode = function(data, version) {
	// To be overridden.
}

MCObject.prototype.createDiv = function() {
	var $div = $(document.createElement('div'));
	$div.addClass("object");
	$div.html(this.getName());
	return $div;
}
