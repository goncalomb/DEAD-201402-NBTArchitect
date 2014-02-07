var MCItem = function(id) {
	MCObject.call(this);
	this.id = (isDefined(id) ? id : 0);
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
	return MC_ITEM_NAMES[this.id];
}

MCItem.prototype.getName = function(data) {
	if (!isEmpty(this.name)) {
		return this.name;
	}
	return this.getTypeName();
}

MCObject.prototype.getIconClass = function(data) {
	return "object-icon mc-icon-" + this.id + "-" + this.damage;
}

MCItem.prototype.encode = function(data) {
	MCObject.prototype.encode.call(this, data);
	data.i = this.id;
	data.d = this.damage;
	if (!isEmpty(this.name)) {
		data.n = this.name;
	}
	if (!isEmpty(this.lore)) {
		data.l = this.lore;
	}
}

MCItem.prototype.decode = function(data, version) {
	this.id = data.i;
	this.damage = data.d;
	if (isDefined(data.n)) {
		this.name = data.n;
	}
	if (isDefined(data.l)) {
		this.lore = data.l;
	}
}
