/**
 * @preserve NBT Architect v@VERSION@
 * Copyright (C) 2014 - Gonçalo Baltazar <http://goncalomb.com>
 * All rights reserved.
 */

//var MC_ITEM_NAMES = {} // See MC_ITEM_NAMES.js.
var MC_ITEM_NAMES_REVERSE = {};
var MC_ITEM_NAMES_DATUMS = []; // For typeahead.js.

var $objects;

var inherit = function(parent, child) {
	var tmp = function() { };
	tmp.prototype = parent.prototype;
	//child._parent = parent.prototype;
	child.prototype = new tmp();
	child.prototype.constructor = child;
}

/*
var base = new function(self) {
	var caller = arguments.callee.caller;
	if (caller._parent) {
		caller.superClass_.constructor.apply(self, arguments.slice(1));
	}
}
*/

var randomInt = function(min, max) {
	return Math.floor(Math.random()*(max - min + 1) + min);
}

var isDefined = function(value) {
	return (typeof value !== "undefined");
}

var isEmpty = function(value) {
	if (isDefined(value) && value !== null) {
		if (value instanceof Array || value instanceof String || typeof value === 'string') {
			return (value.length == 0);
		}
		return false;
	}
	return true;
}

for (var id in MC_ITEM_NAMES) {
	// Create reverse object;
	MC_ITEM_NAMES_REVERSE[MC_ITEM_NAMES[id]] = parseInt(id);
	// Create datum;
	var clear_name = MC_ITEM_NAMES[id].substr(10);
	var tokens = clear_name.split("_");
	tokens.push(clear_name);
	tokens.push(MC_ITEM_NAMES[id]);
	tokens.push(id);
	MC_ITEM_NAMES_DATUMS.push({
		"value": MC_ITEM_NAMES[id],
		"tokens": tokens
	});
}

