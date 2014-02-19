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
			"class": material.getIconClass(damage)
		}],
		creation: function() { $button = $(this); }
	}]);
	var self = this;
	$button.click(function() {
		$this = $(this);
		$this.siblings().removeClass("active");
		$this.addClass("active");
		self.damage = damage;
		self.$div_icon.attr("class", "pull-right object-icon " + material.getIconClass(damage));
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

PanelEditItem.updateEnchatmentList = function($div) {
	$div.empty();
	var self = this;
	for (var i = 0, l = self.meta.enchantments.length; i < l; ++i) {
		(function(i) {
			var id = self.meta.enchantments[i][0];
			var lvl = self.meta.enchantments[i][1];
			$.newDomChunk($div, [{
				tag: "p",
				childs: [{
					tag: "button",
					type: "button",
					title: "Remove",
					"class": "btn btn-primary btn-xs",
					creation: function() {
						$(this).click(function() {
							self.meta.removeEnchantment(id);
							Workspace.setDirty(true);
							$(this).parent().remove();
						});
					},
					childs: [{
						tag: "i",
						"class": "fa fa-minus"
					}]
				}, " " + ItemMeta.ENCHANTMENTS[id] + " " + lvl]
			}]);
		})(i);
	}
}

PanelEditItem.updateModifiersList = function($div) {
	$div.empty();
	var self = this;
	for (var i = 0, l = self.meta.modifiers.length; i < l; ++i) {
		(function(i) {
			var attr = self.meta.modifiers[i][0];
			var op = self.meta.modifiers[i][1];
			var amount = self.meta.modifiers[i][2];
			$.newDomChunk($div, [{
				tag: "p",
				childs: [{
					tag: "button",
					type: "button",
					title: "Remove",
					"class": "btn btn-primary btn-xs",
					creation: function() {
						$(this).click(function() {
							self.meta.removeModifier(i);
							Workspace.setDirty(true);
							// We are removing by index so we need to update the list.
							self.updateModifiersList($div);
						});
					},
					childs: [{
						tag: "i",
						"class": "fa fa-minus"
					}]
				}, " " + ItemMeta.ATTRIBUTES[attr] + " " + amount + " (Op. " + op + ") "]
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

	this.$input_durability = this.createInput(this.$form, "text", "Durability");
	this.$input_durability.attr("maxlength", 5);
	this.$input_durability.parent().addClass("input-group").attr("style", "width: 250px;");

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
		"class": "form-control input-sm",
		creation: function() {
			for (var key in ItemMeta.ENCHANTMENTS) {
				$.newElement("option", { value: key }, this).text(ItemMeta.ENCHANTMENTS[key]);
			}
			select_ench = $(this);
		}
	}, " ", {
		tag: "input",
		"class": "form-control input-sm",
		"style": "width: 80px",
		type: "text",
		placeholder: "Level",
		maxlength: "5",
		creation: function() { input_ench_level = $(this); }
	}, " ", {
		tag: "button",
		"class": "btn btn-primary btn-sm",
		type: "button",
		childs: [{tag: "i", "class": "fa fa-plus"}, " Add"],
		creation: function() {
			$(this).click(function() {
				var lvl = parseIntRange(input_ench_level.val(), 1, 32767);
				if (lvl === null) {
					alert("Invalid level (1 - 32767).");
					return;
				}
				self.meta.addEnchantment(parseInt(select_ench.val()), lvl);
				self.updateEnchatmentList(self.$div_ench);
				Workspace.setDirty(true);
			});
		}
	}]);

	var div_mod_outer = this.createRow(this.$form, "Modifiers");
	div_mod_outer.addClass("form-inline");
	var select_attr, select_op, input_mod_amount;
	$.newDomChunk(div_mod_outer, [{
		tag: "div",
		creation: function() { self.$div_mod = $(this); }
	}, {
		tag: "select",
		"class": "form-control input-sm",
		creation: function() {
			for (var key in ItemMeta.ATTRIBUTES) {
				$.newElement("option", { value: key }, this).text(ItemMeta.ATTRIBUTES[key]);
			}
			select_attr = $(this);
		}
	}, " ", {
		tag: "select",
		"class": "form-control input-sm",
		childs: [
			{ tag: "option", value:"0", childs: ["Op. 0"] },
			{ tag: "option", value:"1", childs: ["Op. 1"] },
			{ tag: "option", value:"2", childs: ["Op. 2"] }
		],
		creation: function() { select_op = $(this); }
	}, " ", {
		tag: "input",
		"class": "form-control input-sm",
		"style": "width: 120px",
		type: "text",
		placeholder: "Amount",
		creation: function() { input_mod_amount = $(this); }
	}, " ", {
		tag: "button",
		"class": "btn btn-primary btn-sm",
		type: "button",
		childs: [{tag: "i", "class": "fa fa-plus"}, " Add"],
		creation: function() {
			$(this).click(function() {
				var amount = parseFloatExact(input_mod_amount.val());
				if (amount === null) {
					alert("Invalid amount.");
					return;
				}
				self.meta.addModifier(select_attr.val(), parseInt(select_op.val()), amount);
				self.updateModifiersList(self.$div_mod);
				Workspace.setDirty(true);
			});
		}
	}]);

}

PanelEditItem.open = function(item) {
	if (Panel.prototype.open.call(this)) {
		// Keep the instance of the item we are working, clone the damage and meta.
		this.item = item;
		this.damage = this.item.damage;
		this.meta = item.meta.clone();

		var material = item.material;
		this.$div_icon.attr("class", "pull-right " + item.getIconClass());
		this.$div_name.text(item.getTypeName());

		this.$input_durability.parent().parent().addClass("hidden");
		this.$div_variants.empty().parent().addClass("hidden");
		if (material.maxDurability > 0) {
			// A item with durability, tool or piece of armor.
			this.$input_durability.val(this.damage);
			this.$input_durability.siblings().remove();
			this.$input_durability.after($.newElement("span", "input-group-addon").text("Max. " + material.maxDurability));
			this.$input_durability.parent().parent().removeClass("hidden");
		} else if (material.variants.length > 0) {
			// A block/item with more variants.
			for (var i = 0, l = material.variants.length; i < l; ++i) {
				this.createVariantButton(this.$div_variants, material, material.variants[i]);
			}
			this.$div_variants.parent().removeClass("hidden");
		}

		this.$input_name.val(this.meta.name);
		this.$input_lore.val(this.meta.lore.join("\n"));
		this.updateEnchatmentList(this.$div_ench);
		this.updateModifiersList(this.$div_mod);
	}
}

PanelEditItem.save = function() {
	// Store name and lore.
	this.meta.name = this.$input_name.val();
	var lore = this.$input_lore.val();
	this.meta.lore = (lore == "" ? [] : lore.split("\n"));
	// Durability?
	var dur = this.item.material.maxDurability;
	if (dur > 0) {
		this.damage = parseIntRange(this.$input_durability.val(), 0, dur);
		if (this.damage === null) {
			alert("Invalid durability (0 - " + dur + ").");
			return false;
		}
	}
	// Apply damage and meta.
	this.item.damage = this.damage;
	this.item.meta = this.meta;
	this.item.updateDiv();
}
