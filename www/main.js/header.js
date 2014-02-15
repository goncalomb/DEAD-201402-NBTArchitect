/**
 * @preserve NBT Architect v@VERSION@
 * Copyright (C) 2014 - Gonçalo Baltazar <http://goncalomb.com>
 * All rights reserved.
 */

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

var parseIntRange = function(value, min, max) {
	var i = parseInt(value);
	return (isNaN(i) || i != value || i < min || i > max ? null : i);
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
