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
		var material = null;
		if (isDefined(Material.BY_ID[value])) {
			material = Material.BY_ID[value];
		} else if (isDefined(Material.BY_NAME[value])) {
			material = Material.BY_NAME[value];
		} else if (isDefined(Material.BY_NAME["minecraft:" + value])) {
			material = Material.BY_NAME["minecraft:" + value];
		} else {
			alert("Invalid item type!");
		}
		if (material) {
			var item = new MCItem(material);
			Workspace.addObject(item);
			PanelEditItem.open(item);
		}
	});

	$new_item_id.typeahead({
		name: "Items",
		local: Material.DATUMS
	});
}
