var PanelEditItem = new Panel("edit-item");

PanelEditItem.item = null;

PanelEditItem.createInput = function(parent, type, placeholder) {
	var id = randomInt(0, 1000000);
	var input;
	$.newDomChunk(parent, [{
		tag: "div",
		"class": "form-group",
		childs: [{
			tag: "label",
			"class": "control-label col-sm-2",
			"for": id,
			childs: [placeholder]
		}, {
			tag: "div",
			"class": "col-sm-10",
			childs: [{
				tag: (type != "textarea" ? "input" : "textarea"),
				"class": "form-control",
				id: id,
				placeholder: placeholder,
				creation: function() { $input = $(this); }
			}]
		}]
	}]);
	if (type != "textarea") {
		$input.attr("type", type);
	}
	return $input;
}

PanelEditItem.initialize = function(){
	this.$form = $("#panel-edit-item .form-horizontal");

	var self = this;
	$.newDomChunk(this.$form, [{
		tag: "div",
		"class": "row",
		childs: [{
			tag: "div",
			"class": "col-sm-2",
			childs: [{
				tag: "div",
				"class": "object-icon pull-right",
				creation: function() { self.$div_icon = $(this); }
			}]
		}, {
			tag: "div",
			"class": "col-sm-10",
			creation: function() { self.$div_name = $(this); }
		}]
	}]);

	this.$input_name = this.createInput(this.$form, "text", "Name");
	this.$input_lore = this.createInput(this.$form, "textarea", "Lore");

	$("input, textarea", this.$form).on("change keydown", function() {
		Workspace.setDirty(true);
	});
}

PanelEditItem.open = function(item) {
	if (Panel.prototype.open.call(this)) {
		this.item = item;

		this.$div_icon.attr("class", "pull-right " + item.getIconClass());
		this.$div_name.text(item.getTypeName());

		this.$input_name.val(item.name);
		this.$input_lore.val(item.lore.join("\n"));
	}
}

PanelEditItem.save = function() {
	this.item.name = this.$input_name.val();
	this.item.lore = this.$input_lore.val().split("\n");
	this.item.updateDiv();
}
