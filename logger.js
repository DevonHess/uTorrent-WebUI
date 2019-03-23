var Logger = {
	element: null,
	log_date: false,
	init: function(a) {
		this.element = document.id(a)
	},
	log: function() {
		if (!this.element) {
			return
		}
		var a = (new Date()).format((this.log_date ? "%Y-%m-%d " : "") + "%H:%M:%S");
		var b = Array.from(arguments).join(" ");
		this.element.grab(new Element("p").grab(new Element("span.timestamp", {
			text: "[" + a + "] "
		})).appendText(b));
		this.scrollBottom()
	},
	scrollBottom: function() {
		if (!this.element) {
			return
		}
		this.element.scrollTo(0, this.element.getScrollSize().y)
	},
	setLogDate: function(a) {
		this.log_date = !!a
	}
};
var Overlay = {
	element: null,
	msgBody: null,
	init: function(a) {
		this.element = document.id(a);
		this.msgBody = this.element.getElement(".msg")
	},
	err: function(a) {
		var b = [];
		switch (typeof(a)) {
			case "object":
				for (var c in a) {
					b.push(c.toUpperCase() + " : " + a[c])
				}
				break;
			default:
				b.push(a)
		}
		this.msg('<p>An error has occurred.</p><textarea readonly="readonly" class="error">' + (new Element("p", {
			text: b.join("\n\n")
		})).get("html") + '</textarea><p>Try <a href="#" onclick="window.location.reload(true);">reloading</a> the page.</p>')
	},
	hide: function() {
		if (!this.element) {
			return
		}
		this.element.hide()
	},
	msg: function(a) {
		if (!this.msgBody) {
			return
		}
		if (typeOf(a) === "element") {
			this.msgBody.clear().grab(a)
		} else {
			this.msgBody.set("html", a)
		}
		this.show()
	},
	show: function() {
		if (!this.element) {
			return
		}
		this.element.show()
	},
	visible: function() {
		if (!this.element) {
			return false
		}
		return (this.element.getStyle("display").trim().toLowerCase() !== "none")
	}
};
(function(c) {
	c.log = function() {
		Logger.log.apply(Logger, arguments)
	};
	c.onerror = function(g, f, e) {
		log("JS error: [" + f.split("/").slice(-1)[0] + ":" + e + "] " + g)
	};
	var a = (c.console || {});
	if (!a.log) {
		a.log = c.log
	}
	if (!a.info) {
		a.info = c.log
	}
	if (!a.warn) {
		a.warn = c.log
	}
	if (!a.error) {
		a.error = c.log
	}
	if (!a.debug) {
		a.debug = c.log
	}
	if (!a.assert) {
		a.assert = function() {
			if (!arguments[0]) {
				throw new Error(arguments[1])
			}
		}
	}
	var d = {};
	if (!a.time) {
		a.time = function(e) {
			if (e) {
				d[e] = Date.now()
			}
		}
	}
	if (!a.timeEnd) {
		a.timeEnd = function(e) {
			if (d.hasOwnProperty(e)) {
				a.log(e + ": " + (Date.now() - d[e]) + "ms");
				delete d[e]
			}
		}
	}
	var b = {};
	if (!a.count) {
		a.count = function(e) {
			if (e) {
				if (!b[e]) {
					b[e] = 0
				}
				a.log(e + ": " + (++b[e]))
			}
		}
	}
	if (!c.console) {
		c.console = a
	}
})(this);
