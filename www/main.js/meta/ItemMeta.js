var ItemMeta = function() {
	this.name = "";
	this.lore = [];
	this.enchantments = [];
	this.modifiers = [];
}

ItemMeta.ENCHANTMENTS = {
	0: "Protection",
	1: "Fire Protection",
	2: "Feather Falling",
	3: "Blast Protection",
	4: "Projectile Protection",
	5: "Respiration",
	6: "Aqua Affinity",
	7: "Thorns",
	16: "Sharpness",
	17: "Smite",
	18: "Bane of Arthropods",
	19: "Knockback",
	20: "Fire Aspect",
	21: "Looting",
	32: "Efficiency",
	33: "Silk Touch",
	34: "Unbreaking",
	35: "Fortune",
	48: "Power",
	49: "Punch",
	50: "Flame",
	51: "Infinity",
	61: "Luck of the Sea",
	62: "Lure"
}

ItemMeta.ATTRIBUTES = {
	"generic.maxHealth": "MaxHealth",
	"generic.followRange": "FollowRange",
	"generic.knockbackResistance": "KnockbackResistance",
	"generic.movementSpeed": "MovementSpeed",
	"generic.attackDamage": "AttackDamage",
	"horse.jumpStrength": "JumpStrength (Horses)",
	"zombie.spawnReinforcements": "SpawnReinforcements (Zombies)"
}

ItemMeta.prototype.addEnchantment = function(id, lvl) {
	for (var i = 0, l = this.enchantments.length; i < l; ++i) {
		if (this.enchantments[i][0] == id) {
			this.enchantments[i][1] = lvl;
			return;
		}
	}
	this.enchantments.push([id, lvl]);
}

ItemMeta.prototype.removeEnchantment = function(id) {
	for (var i = 0, l = this.enchantments.length; i < l; ++i) {
		if (this.enchantments[i][0] == id) {
			this.enchantments.splice(i, 1);
			return true;
		}
	}
	return false;
}

ItemMeta.prototype.addModifier = function(attribute, operation, amount) {
	this.modifiers.push([attribute, operation, amount]);
	console.log(this.modifiers);
}

ItemMeta.prototype.removeModifier = function(index) {
	this.modifiers.splice(index, 1);
}

ItemMeta.prototype.encode = function(data) {
	if (!isEmpty(this.name)) {
		data.n = this.name;
	}
	if (!isEmpty(this.lore)) {
		data.l = this.lore;
	}
	if (!isEmpty(this.enchantments)) {
		data.e = this.enchantments;
	}
	if (!isEmpty(this.modifiers)) {
		data.m = this.modifiers;
	}
}

ItemMeta.prototype.decode = function(data, version) {
	if (isDefined(data.n)) {
		this.name = data.n;
	}
	if (isDefined(data.l)) {
		this.lore = data.l;
	}
	if (isDefined(data.e)) {
		this.enchantments = data.e;
	}
	if (isDefined(data.m)) {
		this.modifiers = data.m;
	}
}

ItemMeta.prototype.clone = function(data) {
	var data = {};
	this.encode(data);
	var clone = new this.constructor();
	// A very dirt clone.
	clone.decode(JSON.parse(JSON.stringify(data)));
	return clone;
}

ItemMeta.prototype.toNBT = function(data) {
	data = data || {};
	if (!isEmpty(this.name)) {
		data.display = { Name: this.name };
	}
	if (!isEmpty(this.lore)) {
		(data.display || (data.display = {})).Lore = this.lore;
	}
	if (!isEmpty(this.enchantments)) {
		data.ench = [];
		for (var i = 0, l = this.enchantments.length; i < l; ++i) {
			data.ench.push({
				id: this.enchantments[i][0],
				lvl: this.enchantments[i][1]
			});
		}
	}
	if (!isEmpty(this.modifiers)) {
		data.AttributeModifiers = [];
		console.log(this.modifiers);
		for (var i = 0, l = this.modifiers.length; i < l; ++i) {
			data.AttributeModifiers.push({
				Name: "", // The name has no purpose.
				AttributeName: this.modifiers[i][0],
				Operation: this.modifiers[i][1],
				Amount: this.modifiers[i][2],
				// By far not the best and correct way to generate UUIDs. For now it works.
				// I know, UUIDs are 128 bits not 64.
				UUIDMost: randomInt(1 << 31, ~(1 << 31)),
				UUIDLeast: randomInt(1 << 31, ~(1 << 31))
			});
		}
	}
	return data;
}
