var PanelOptions = new Panel("options");

PanelOptions.initialize = function() {
	this.addButton($("#btn-options"));

	$("#options-username, #options-f-char").on("change keydown", function() {
		Workspace.setDirty(true);
	});

	$("#btn-clear-workspace").click(function() {
		if (confirm("This will remove ALL the objects permanently.")) {
			Workspace.clear();
			PanelHome.open();
		}
	});

	$("#btn-reset-workspace").click(function() {
		if (confirm("This will remove ALL data stored on your browser, including your objects, permanently.")) {
			Workspace.reset();
			PanelHome.open();
			window.location.reload();
		}
	});
}

PanelOptions.open = function() {
	if (Panel.prototype.open.call(this)) {
		$("#options-f-char").val(Workspace.getOption("char", "&"));
		$("#options-username").val(Workspace.getOption("username", "@p"));
	}
}

PanelOptions.save = function() {
	var fChar = $("#options-f-char").val();
	if (fChar.length != 1) {
		alert("Invalid formating character.");
		return false;
	}
	Workspace.setOption("char", fChar);
	var username = $("#options-username").val();
	if (username.length == 0 || username.indexOf(" ") != -1) {
		alert("Invalid username.");
		return false;
	}
	Workspace.setOption("username", username);
}
