(function() {
	var a = (document.documentMode !== "undefined" && document.documentMode) || 6;
	if (a <= 8) {
		document.write('<style type="text/css">@import "./ie.css";</style>')
	}
	if (a <= 7) {
		document.write('<style type="text/css">@import "./ie7.css";</style>')
	}
})();
