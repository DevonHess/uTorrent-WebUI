var ELE_A = new Element("a");
var ELE_LI = new Element("li");
var ELE_SPAN = new Element("span");
var Tabs = new Class({
	active: "",
	tabs: {},
	lazyshow: false,
	tabchange: Function.from(),
	initialize: function(c, a) {
		this.element = $(c);
		this.tabs = a.tabs;
		this.lazyshow = !!a.lazyshow;
		if (typeof(a.onChange) == "function") {
			this.tabchange = a.onChange
		}
		var b = this;
		this.element.addStopEvent("click", function(e) {
			var d = e.target;
			if (d && (d.get("tag") == "span")) {
				d = d.getParent("a")
			}
			if (d && (d.get("tag") == "a")) {
				b.show(d.retrieve("showId"))
			}
		})
	},
	draw: function() {
		this.element.set("html", "");
		Object.each(this.tabs, function(c, d) {
			var b = ELE_LI.clone(false);
			if (this.lazyshow) {
				b.hide();
				var a = function() {
					b.show();
					$(d).removeEvent("show", a)
				};
				$(d).addEvent("show", a)
			}
			this.element.adopt(b.set("id", "tab_" + d).adopt(ELE_A.clone(false).setProperty("href", "#").store("showId", d).adopt(ELE_SPAN.clone(false).adopt(ELE_SPAN.clone(false).set("class", "tabIcon")).appendText(c))))
		}, this);
		return this
	},
	onChange: function() {
		if (arguments.length > 0) {
			this.tabchange.apply(this, arguments)
		} else {
			this.tabchange.call(this, this.active)
		}
	},
	setNames: function(a) {
		Object.each(a, function(b, e) {
			var d = $("tab_" + e);
			var c = d.getElement("span span");
			if (c) {
				c.dispose()
			}
			d.getElement("span").set("html", b);
			if (c) {
				d.getElement("span").grab(c, "top")
			}
		});
		return this
	},
	show: function(a) {
		if (!has(this.tabs, a)) {
			return
		}
		Object.each(this.tabs, function(b, c) {
			if (c == a) {
				$(c).show();
				$("tab_" + c).addClass("selected")
			} else {
				$(c).hide();
				$("tab_" + c).removeClass("selected")
			}
		});
		this.active = a;
		this.onChange(a);
		return this
	}
});
