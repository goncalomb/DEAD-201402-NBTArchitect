var PanelEditItem = new Panel("edit-item");

PanelEditItem.item = null;

PanelEditItem.createRow = function(parent, right) {
	if ($.type(right) == "string") {
		$right = $.newElement("label", "control-label col-sm-2");
		$right.text(right);
	} else {
		$right = $.newElement("div", "col-sm-2");
		$right.append(right);
	}
	$.newDomChunk(parent, [{
		tag: "div",
		"class": "row",
		childs: [ $right, {
			tag: "div",
			"class": "col-sm-10",
			creation: function() { $left = $(this); }
		}]
	}]);
	return $left;
}

PanelEditItem.createVariantButton = function(parent, material, damage) {
	$.newDomChunk(parent, [{
		tag: "button",
		"class": "btn btn-default",
		"style": "padding-top: 5px;",
		childs: [{
			tag: "div",
			"class": "mc-icon-" + material.id + "-" + damage
		}],
		creation: function() { $button = $(this); }
	}]);
	var self = this;
	$button.click(function() {
		$this = $(this);
		$this.siblings().removeClass("active");
		$this.addClass("active");
		self.damage = damage;
		self.$div_icon.attr("class", "pull-right object-icon mc-icon-" + material.id + "-" + damage);
		Workspace.setDirty(true);
	})
	if (this.damage == damage) {
		$button.addClass("active");
	}
	return $button;
}

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

PanelEditItem.updateEnchatmentList = function($div, list) {
	$div.empty();
	for (var i = 0, l = list.length; i < l; ++i) {
		(function(i) {
			var id = list[i][0];
			var lvl = list[i][1];
			$.newDomChunk($div, [{
				tag: "p",
				childs: [{
					tag: "button",
					type: "button",
					title: "Remove",
					"class": "btn btn-primary btn-xs",
					creation: function() {
						$(this).click(function() {
							Enchantment.remove(list, id);
							Workspace.setDirty(true);
							$(this).parent().remove();
						});
					},
					childs: [{
						tag: "i",
						"class": "fa fa-minus"
					}]
				}, " " + Enchantment.LIST[id] + " " + lvl]
			}]);
		})(i);
	}
}

PanelEditItem.initialize = function(){
	this.$form = $("#panel-edit-item .form-horizontal");

	var self = this;

	this.$div_icon = $.newElement("div");
	this.$div_name = this.createRow(this.$form, self.$div_icon);

	this.$div_variants = this.createRow(this.$form, "Variants");
	this.$div_variants.addClass("btn-group btn-group-xs");

	this.$input_name = this.createInput(this.$form, "text", "Name");
	this.$input_lore = this.createInput(this.$form, "textarea", "Lore");

	$("input, textarea", this.$form).on("change keydown", function() {
		Workspace.setDirty(true);
	});

	this.enchantments = {};

	var div_ench_outer = this.createRow(this.$form, "Enchantments");
	div_ench_outer.addClass("form-inline");
	var select_ench, input_ench_level;
	$.newDomChunk(div_ench_outer, [{
		tag: "div",
		creation: function() { self.$div_ench = $(this); }
	}, {
		tag: "select",
		"class": "form-control",
		creation: function() {
			for (var key in Enchantment.LIST) {
				$.newElement("option", { value: key }, this).text(Enchantment.LIST[key]);
			}
			select_ench = $(this);
		}
	}, " ", {
		tag: "input",
		"class": "form-control",
		"style": "width: 80px",
		type: "text",
		placeholder: "Level",
		maxlength: "5",
		creation: function() { input_ench_level = $(this); }
	}, " ", {
		tag: "button",
		"class": "btn btn-default",
		type: "button",
		childs: ["Add"],
		creation: function() {
			$(this).click(function() {
				var lvl = parseIntRange(input_ench_level.val(), 1, 32767);
				if (lvl === null) {
					alert("Invalid level (1 - 32767).");
					return;
				}
				Enchantment.add(self.enchantments, parseInt(select_ench.val()), lvl);
				self.updateEnchatmentList(self.$div_ench, self.enchantments);
				Workspace.setDirty(true);
			});
		}
	}]);
}

PanelEditItem.open = function(item) {
	if (Panel.prototype.open.call(this)) {
		this.item = item;

		var material = item.material;
		this.$div_icon.attr("class", "pull-right " + item.getIconClass());
		this.$div_name.text(item.getTypeName());

		this.damage = this.item.damage;
		this.$div_variants.empty().parent().addClass("hidden");
		if (material.variants.length > 0) {
			for (var i = 0, l = material.variants.length; i < l; ++i) {
				this.createVariantButton(this.$div_variants, material, material.variants[i]);
			}
			this.$div_variants.parent().removeClass("hidden");
		}

		this.$input_name.val(item.name);
		this.$input_lore.val(item.lore.join("\n"));

		this.enchantments = Enchantment.clone(item.enchantments);
		this.updateEnchatmentList(this.$div_ench, this.enchantments);
	}
}

PanelEditItem.save = function() {
	this.item.damage = this.damage;
	this.item.name = this.$input_name.val();
	var lore = this.$input_lore.val();
	this.item.lore = (lore == "" ? [] : lore.split("\n"));
	this.item.enchantments = this.enchantments;
	this.item.updateDiv();
}
