var MCItem = function(material) {
	MCObject.call(this);
	this.material = material;
	this.damage = 0;
	this.meta = new ItemMeta();
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
	if (!isEmpty(this.meta.name)) {
		return this.meta.name;
	}
	return this.getTypeName();
}

MCObject.prototype.getIconClass = function(data) {
	return "object-icon " + this.material.getIconClass(this.damage);
}

MCItem.prototype.encode = function(data) {
	MCObject.prototype.encode.call(this, data);
	data.i = this.material.id;
	data.d = this.damage;
	data.m = {};
	this.meta.encode(data.m);
}

MCItem.prototype.decode = function(data, version) {
	this.material = Material.BY_ID[data.i];
	this.damage = data.d;
	this.meta.decode(data.m);
}

MCItem.prototype.getCommand = function() {
	return "/give " + Workspace.getOption("username", "@p") + " " + this.material.name + " 1 " + this.damage + " " + Mojangson.stringify(this.meta.toNBT());
}
