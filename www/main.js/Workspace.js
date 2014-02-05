var Workspace = {
	OBJECTS: [],
	isDirty: false
}

Workspace.unserialize = function(data) {
	try {
		var workspace = JSON.parse(Base64.decode(data));
		this.OBJECTS = [];
		$objects = $("#objects");
		for (var i = 0, l = workspace.o.length; i < l; ++i) {
			var obj = MCObject.decode(workspace.o[i], workspace.v);
			this.OBJECTS.push(obj);
			$objects.append(obj.createDiv());
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

Workspace.load = function(data) {
	var data = localStorage.getItem("Workspace");
	if (data && this.unserialize(data)) {
		this.setDirty(false);
		console.log("Workspace loaded, " + this.OBJECTS.length + " objects.");
	} else {
		console.log("New Workspace.");
	}
}

Workspace.save = function(force) {
	if (this.isDirty || force) {
		var data = this.serialize();
		if (data) {
			localStorage.setItem("Workspace", data);
			console.log("Worksapce saved, " + this.OBJECTS.length + " objects.");
			this.setDirty(false);
		}
	}
}

Workspace.addObject = function(object) {
	this.OBJECTS.push(object);
	$("#objects").append(object.createDiv());
	this.save(true);
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
