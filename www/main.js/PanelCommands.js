var PanelCommands = new Panel("commands", true);

PanelCommands.initialize = function() {
	$("#command").click(function() {
		this.select();
	});
}

PanelCommands.open = function(object) {
	if (Panel.prototype.open.call(this)) {
		$("#command").val(object.getCommand());
	}
}
