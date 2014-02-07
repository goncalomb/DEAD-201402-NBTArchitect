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

MCObject.prototype.clone = function(data, version) {
	// The easiest way to do a deep clone is to encode and then decode.
	var data = {};
	this.encode(data);
	return MCObject.decode(data);
}

MCObject.prototype.createControlBtn = function($parent, title, icon, click) {
	$btn = $(document.createElement("button"));
	$btn.attr({
		"type": "button",
		"title": title
	});
	$btn.addClass("btn btn-primary btn-xs");
	$btn.html("<i class=\"fa " + icon + "\"></i>");
	$btn.click(click);
	$parent.append($btn);
}

MCObject.prototype.updateDiv = function() {
	this.$div.empty();

	$div_controls = $(document.createElement("div"));
	$div_controls.addClass("object-controls btn-group btn-xs");

	var self = this;
	this.createControlBtn($div_controls, "Clone", "fa-files-o", function(e) {
		e.stopPropagation();
		Workspace.addObject(self.clone());
	});
	this.createControlBtn($div_controls, "Delete", "fa-trash-o", function(e) {
		e.stopPropagation();
		if (confirm("This will remove the object permanently.")) {
			Workspace.removeObject(self);
			if (PanelEditItem.item == self) {
				Workspace.setDirty(false);
				PanelHome.open();
			}
		}
	});

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
