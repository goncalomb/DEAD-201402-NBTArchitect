var PanelExportImport = new Panel("export-import", true);

PanelExportImport.initialize = function() {
	this.addButton($("#btn-export-import"));
	$("#export-string").click(function() {
		this.select();
	});
	$("#panel-export-import form").submit(function(e) {
		e.preventDefault();
		if (Workspace.unserialize($("#import-string").val())) {
			PanelHome.open();
		}
	});
}

PanelExportImport.open = function() {
	Panel.prototype.open.call(this);
	$("#export-string").val(Workspace.serialize());
}
