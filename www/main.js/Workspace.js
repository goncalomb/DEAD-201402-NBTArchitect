var Workspace = {
	OBJECTS: [],
	options: {},
	isDirty: false
}

Workspace.unserialize = function(data) {
	try {
		var workspace = JSON.parse(Base64.decode(data));
		this.OBJECTS = [];
		$objects = $("#objects");
		$objects.empty();
		for (var i = 0, l = workspace.o.length; i < l; ++i) {
			var obj = MCObject.decode(workspace.o[i], workspace.v);
			this.OBJECTS.push(obj);
			$objects.append(obj.updateDiv());
		}
		return true;
	} catch (e) {
		alert("Error while loading your Workspace, sorry.");
	}
	return false;
}

Workspace.serialize = function() {
	try {
		Panel.currentPanel.save();
		var workspace = {
			v: 1, // Version.
			o: [] // Objects.
		};
		for (var i = 0, l = this.OBJECTS.length; i < l; ++i) {
			var data = {};
			this.OBJECTS[i].encode(data);
			workspace.o.push(data);
		}
		return Base64.encode(JSON.stringify(workspace));
	} catch (e) {
		alert("Error while saving your Workspace, sorry.");
	}
	return null;
}

Workspace.load = function() {
	// Load options.
	var dataOp = localStorage.getItem("WorkspaceOptions");
	try {
		this.options = JSON.parse(Base64.decode(dataOp));
	} catch (e) { }
	// Load objects.
	var data = localStorage.getItem("Workspace");
	if (data && this.unserialize(data)) {
		this.setDirty(false);
		console.log("Workspace loaded, " + this.OBJECTS.length + " objects.");
	} else {
		console.log("New Workspace.");
		this.defaultObjects();
	}
}

Workspace.save = function(force) {
	if (this.isDirty || force) {
		// Save options.
		try {
			var dataOp = Base64.encode(JSON.stringify(this.options))
			localStorage.setItem("WorkspaceOptions", dataOp);
		} catch (e) { }
		// Save objects.
		var data = this.serialize();
		if (data) {
			localStorage.setItem("Workspace", data);
			console.log("Worksapce saved, " + this.OBJECTS.length + " objects.");
			if (!force) {
				this.setDirty(false);
			}
		}
	}
}

Workspace.addObject = function(object) {
	this.OBJECTS.push(object);
	$("#objects").append(object.updateDiv());
	this.save(true);
}

Workspace.removeObject = function(object) {
	for (var i = 0, l = this.OBJECTS.length; i < l; ++i) {
		if (this.OBJECTS[i] == object) {
			this.OBJECTS.splice(i, 1);
			$("#objects .object:nth-child(" + (i + 1) + ")").remove();
			this.save(true);
			return;
		}
	}
}

Workspace.setOption = function(key, value) {
	this.options[key] = value;
}

Workspace.getOption = function(key, def) {
	if (isDefined(this.options[key])) {
		return this.options[key];
	} else if (def) {
		return def;
	}
	return null;
}

Workspace.clear = function(object) {
	this.OBJECTS = [];
	$("#objects").empty();
	this.save(true);
	this.setDirty(false);
}

Workspace.reset = function() {
	this.OBJECTS = [];
	$("#objects").empty();
	localStorage.removeItem("Workspace");
	localStorage.removeItem("WorkspaceOptions");
	this.setDirty(false);
}

Workspace.defaultObjects = function() {
	var obj;

	obj = new MCItem(Material.BY_NAME["minecraft:fish"]);
	obj.damage = 3;
	obj.name = "§3Fishy Friend";
	obj.lore = ["I smell something fishy."]
	this.OBJECTS.push(obj);

	obj = new MCItem(Material.BY_NAME["minecraft:dragon_egg"]);
	obj.name = "§0§k---§0 Dark Egg §k---";
	this.OBJECTS.push(obj);

	// Add the default objects without saving.
	$objects = $("#objects");
	for (var i = 0, l = this.OBJECTS.length; i < l; ++i) {
		$objects.append(this.OBJECTS[i].updateDiv());
	}
}

Workspace.setDirty = function(value) {
	if (value && !this.isDirty) {
		this.isDirty = true;
		$("#btn-save").show(200);
	} else if (!value && this.isDirty) {
		this.isDirty = false;
		$("#btn-save").hide(200);
	}
}

Workspace.dirtyConfirm = function(value) {
	if (this.isDirty) {
		if (confirm("Your work is not saved.\nIf you proceed you will lose it.")) {
			this.setDirty(false);
			return true;
		}
		return false;
	}
	return true;
}
