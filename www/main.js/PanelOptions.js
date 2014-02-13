var PanelOptions = new Panel("options");

PanelOptions.initialize = function() {
	this.addButton($("#btn-options"));

	$("#options-username").on("change keydown", function() {
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
		$("#options-username").val(Workspace.getOption("username", "@p"));
	}
}

PanelOptions.save = function() {
	Workspace.setOption("username", $("#options-username").val());
}
