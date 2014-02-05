var PanelExportImport = new Panel("export-import");

PanelExportImport.initialize = function() {
	this.addButton($("#btn-export-import"));
	$("#export-string").click(function() {
		this.select();
	});
}

PanelExportImport.open = function() {
	Panel.prototype.open.call(this);
	$("#export-string").val(Workspace.serialize());
}
