var Panel = function(name, resetForm) {
	this.name = name;
	this.resetForm = (resetForm || false);
	this.$element = null;
	this.$errorElement = null;
	this.constructor.PANELS.push(this);
}

Panel.PANELS = [];
Panel.$panels = null;
Panel.currentPanel = null;

Panel.initializeAllPanels = function() {
	var elements = [];
	for (var i = 0, l = this.PANELS.length; i < l; ++i) {
		var panel = this.PANELS[i];
		panel.$element = $("#panel-" + panel.name);
		elements.push(panel.$element[0]);
		this.PANELS[i].initialize();
	};
	this.$panels = $(elements);
}

Panel.prototype.initialize = function() {
	// To be overridden.
}

Panel.prototype.save = function() {
	// To be overridden.
}

Panel.prototype.open = function() {
	if (Workspace.dirtyConfirm()) {
		this.constructor.$panels.addClass("hidden");
		this.$element.removeClass("hidden");
		this.constructor._currentPanel = this;
		if (this.resetForm) {
			$form = $("form", this.$element);
			$('.tt-query', $form).typeahead("setQuery", "");
			$("input:not([disabled])", $form).first().focus();
			$form.each(function() {
				this.reset();
			});
		}
		this.error('');
	}
}

Panel.prototype.error = function (error) {
	if (!this.$errorElement && error) {
		$h3 = $(">h3:first-child", this.$element);
		this.$errorElement = $(document.createElement("p")).addClass("text-danger");
		this.$errorElement.insertAfter($h3);
		var self = this;
		$("input, select, textarea", this.$element).on("change keydown", function() {
			self.$errorElement.text("");
		});
	}
	if (this.$errorElement) {
		this.$errorElement.text(error || "");
	}
}

Panel.prototype.addButton = function($button) {
	var self = this;
	$button.click(function() {
		self.open();
	});
}
