if (typeof Storage === "undefined" || typeof JSON === "undefined") {
	$(document).ready(function() {
		$("#container").css("text-align", "center").html("<h2>Woops!</h2><p class=\"text-danger\"><strong>Your stone age browser does not support this application.</strong></p><p>Go find yourself a better one!<br>IE9+, Firefox, Opera, Chrome or Safari.</p>");
	});
} else {
	$(document).ready(function() {
		console.log("Hi, there.");

		// Workspace.
		Workspace.load();
		$("#btn-save").click(function() {
			Panel.currentPanel.save();
			Workspace.save();
		});
		$(window).on("beforeunload", function() {
			if (Workspace.isDirty) {
				return "Your work is not saved.\nIf you proceed you will lose it.";
			}
		});

		// Panels.
		Panel.initializeAllPanels();
		Panel.currentPanel = PanelHome;
	});
}
