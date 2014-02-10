var PanelOptions = new Panel("options");

PanelOptions.initialize = function() {
	this.addButton($("#btn-options"));

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
