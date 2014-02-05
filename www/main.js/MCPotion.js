var MCPotion = function(id) {
	MCItem.call(this, id);
	this.effects = [];
}

inherit(MCItem, MCPotion);
