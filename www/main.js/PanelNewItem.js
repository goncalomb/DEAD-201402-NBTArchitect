var PanelNewItem = new Panel("new-item", true);

PanelNewItem.initialize = function() {
	$btn_new_item = $("#btn-new-item");
	$form_new_item = $("#panel-new-item form");
	$new_item_id = $("#new-item-id");

	this.addButton($btn_new_item);

	var self = this;
	$form_new_item.submit(function(e) {
		e.preventDefault();
		var value = $new_item_id.val();
		var id = 0;
		if (isDefined(MC_ITEM_NAMES[value])) {
			id = parseInt(value);
		} else if (isDefined(MC_ITEM_NAMES_REVERSE[value])) {
			id = MC_ITEM_NAMES_REVERSE[value];
		} else if (isDefined(MC_ITEM_NAMES_REVERSE["minecraft:" + value])) {
			id = MC_ITEM_NAMES_REVERSE["minecraft:" + value];
		} else {
			self.error("Invalid item type!");
		}
		if (id != 0) {
			Workspace.addObject(new MCItem(id));
			PanelHome.open();
		}
	});

	$new_item_id.typeahead({
		name: "Items",
		local: MC_ITEM_NAMES_DATUMS
	});
}
