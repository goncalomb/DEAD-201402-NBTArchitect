if (typeof Storage === "undefined" || typeof JSON === "undefined") {
	$(document).ready(function() {
		$("#container").css("text-align", "center").html("<h2>Woops!</h2><p class=\"text-danger\"><strong>Your stone age browser does not support this application.</strong></p><p>Go find yourself a better one!<br>IE9+, Firefox, Opera, Chrome or Safari.</p>");
	});
} else {
	$(document).ready(function() {
		console.log("Hi, there.");

		// Hack to find last element with focus.
		// Cannot use document.activeElement because it changes when clicking a button.
		var lastFocus = document.body;
		$(document.body).focusin(function(e) {
			lastFocus = e.target;
		});

		$btn_section_sign = $("#btn-section-sign");
		$btn_section_sign.attr("title", "Inserts the section sign (§) on the current field.\nMost strings in Minecraft support it as a formatting character.")
		$btn_section_sign.click(function() {
			var $elem = $(lastFocus).filter("input[type=\"text\"], textarea").not(".tt-query, [disabled], [readonly]");
			if ($elem.length > 0) {
				var i = $elem[0].selectionStart;
				var j = $elem[0].selectionEnd;
				var val = $elem.val();
				$elem.val(val.substr(0, i) + "§" + val.substr(j));
				$elem.focus();
				$elem[0].selectionStart = $elem[0].selectionEnd = i + 1;
			}
		});

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
