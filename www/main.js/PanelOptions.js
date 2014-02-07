var PanelOptions = new Panel("options");

PanelOptions.initialize = function() {
	this.addButton($("#btn-options"));

	$("#btn-clear-workspace").click(function() {
		if (confirm("This will remove ALL the objects permanently.")) {
			Workspace.clear();
			PanelHome.open();
		}
	});
}
