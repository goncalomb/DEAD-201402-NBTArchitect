$.extend ({

	newElement: function(tag, attr, parent) {
		$elem = $(document.createElement(tag));
		if (attr) {
			if ($.type(attr) == "string") {
				$elem.addClass(attr);
			} else {
				$elem.attr(attr);
			}
		}
		if (parent) {
			$elem.appendTo(parent);
		}
		return $elem;
	},

	newDomChunk: function(parent, data) {
		for (var i = 0, l = data.length; i < l; i++) {
			if (data[i] instanceof Node) {
				$(data[i]).appendTo(parent);
			} else if (data[i] instanceof jQuery) {
				data[i].appendTo(parent);
			} else if ($.type(data[i]) == "string") {
				$(document.createTextNode(data[i])).appendTo(parent);
			} else {
				var tag = data[i].tag;
				delete data[i].tag;
				var childs = data[i].childs;
				delete data[i].childs;
				var creation = data[i].creation;
				delete data[i].creation;
				$elem = $.newElement(tag, data[i], parent);
				if (creation) {
					creation.call($elem[0]);
				}
				if (childs) {
					$.newDomChunk($elem, childs);
				}
			}
		}
	}

});
