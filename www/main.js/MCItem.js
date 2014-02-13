var MCItem = function(material) {
	MCObject.call(this);
	this.material = material;
	this.damage = 0;
	this.name = null;
	this.lore = [];
	this.enchantments = [];
	var self = this;
	this.$div.click(function() {
		PanelEditItem.open(self);
	});
}

inherit(MCObject, MCItem);

MCItem.decode = function(data, version) {
	var o = new MCItem();
	o.decode(data);
	return o;
}

MCItem.prototype.getTypeName = function(data) {
	return this.material.name;
}

MCItem.prototype.getName = function(data) {
	if (!isEmpty(this.name)) {
		return this.name;
	}
	return this.getTypeName();
}

MCObject.prototype.getIconClass = function(data) {
	return "object-icon mc-icon-" + this.material.id + "-" + this.damage;
}

MCItem.prototype.encode = function(data) {
	MCObject.prototype.encode.call(this, data);
	data.i = this.material.id;
	data.d = this.damage;
	if (!isEmpty(this.name)) {
		data.n = this.name;
	}
	if (!isEmpty(this.lore)) {
		data.l = this.lore;
	}
}

MCItem.prototype.decode = function(data, version) {
	this.material = Material.BY_ID[data.i];
	this.damage = data.d;
	if (isDefined(data.n)) {
		this.name = data.n;
	}
	if (isDefined(data.l)) {
		this.lore = data.l;
	}
}

MCItem.prototype.getCommand = function() {
	var data = {};
	if (!isEmpty(this.name) || !isEmpty(this.lore)) {
		data.display = {};
	}
	if (!isEmpty(this.name)) {
		data.display.Name = this.name;
	}
	if (!isEmpty(this.lore)) {
		data.display.Lore = this.lore;
	}
	return "/give " + Workspace.getOption("username", "@p") + " " + this.material.name + " 1 " + this.damage + " " + Mojangson.stringify(data);
}
