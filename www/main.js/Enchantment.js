Enchantment = {}

Enchantment.LIST = {
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

Enchantment.add = function(list, id, lvl) {
	for (var i = 0, l = list.length; i < l; ++i) {
		if (list[i][0] == id) {
			list[i][1] = lvl;
			return;
		}
	}
	list.push([id, lvl]);
}

Enchantment.remove = function(list, id) {
	for (var i = 0, l = list.length; i < l; ++i) {
		if (list[i][0] == id) {
			list.splice(i, 1);
			return true;
		}
	}
	return false;
}

Enchantment.clone = function(list) {
	var result = [];
	for (var i = 0, l = list.length; i < l; ++i) {
		result.push([list[i][0], list[i][1]]);
	}
	return result;
}

Enchantment.toNBT = function(list) {
	var result = [];
	for (var i = 0, l = list.length; i < l; ++i) {
		result.push({
			id: list[i][0],
			lvl: list[i][1]
		});
	}
	return result;
}
