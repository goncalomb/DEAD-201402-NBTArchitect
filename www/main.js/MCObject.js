var MCObject = function() {
	this.$div = $(document.createElement("div"));
	this.$div.addClass("object");
}

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

MCObject.prototype.getIconClass = function(data) {
	return "object-icon mc-icon-void";
}

MCObject.prototype.encode = function(data) {
	if (this instanceof MCItem) {
		data.t = "i";
	}
}

MCObject.prototype.decode = function(data, version) {
	// To be overridden.
}

MCObject.prototype.updateDiv = function() {
	this.$div.empty();

	$div_controls = $(document.createElement("div"));
	$div_controls.addClass("object-controls");

	$btn_delete = $(document.createElement("button"));
	$btn_delete.attr("type", "button")
	$btn_delete.addClass("btn btn-primary btn-xs");
	$btn_delete.html("<i class=\"fa fa-trash-o\"></i>");
	var self = this;
	$btn_delete.click(function() {
		if (confirm("This will remove the object permanently.")) {
			Workspace.removeObject(self);
		}
	});
	$div_controls.append($btn_delete);
	this.$div.append($div_controls);

	$icon = $(document.createElement("div"));
	$icon.addClass(this.getIconClass());
	this.$div.append($icon);

	$div_info = $(document.createElement("div"));
	$div_info.addClass("object-info");
	$div_info.text(this.getName());
	this.$div.append($div_info);
	return this.$div;
}
