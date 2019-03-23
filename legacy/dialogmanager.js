var DialogManager = {
	winZ: 500,
	items: {},
	showing: [],
	init: function() {
		var a = this.create("Popup");
		this.add("Popup");
		$(a).getElement(".dlg-body").adopt(new Element("span", {
			id: a + "-message"
		}), new Element("div.textarea_wrap").grab(new Element("textarea.wide", {
			id: a + "-input",
			styles: {
				marginTop: "5px"
			}
		}).setProperty("wrap", "off")))
	},
	create: function(c) {
		var b = "dlg" + c;
		var a = new Element("div.dlg-window", {
			id: b
		}).adopt(new Element("a.dlg-close", {
			href: "#"
		}), new Element("div.dlg-head", {
			id: b + "-head"
		}), new Element("form", {
			action: ""
		}).adopt(new Element("div.dlg-body"), new Element("div.dlg-foot")).addEvent("submit", Function.from(false))).inject(document.body);
		return b
	},
	popup: function(l) {
		l = l || {};
		var d;
		var c = "Popup";
		var j = "dlg" + c;
		var a = $(j);
		var e = a.getElement(".dlg-head");
		var g = a.getElement(".dlg-foot");
		var h = $(j + "-message");
		var k = $(j + "-input");
		if ((d = e.retrieve("icon"))) {
			e.removeClass(d)
		}
		g.set("html", "");
		e.set("text", l.title || "");
		h.set("text", l.message || "");
		k.set("value", l.input || "");
		if ((d = l.icon || "")) {
			e.store("icon", d);
			e.addClass(d)
		}
		var i;
		if ((d = l.buttons || []).length) {
			var f = this;
			d.each(function(m) {
				var n = new Element("input.btn", {
					type: m.submit ? "submit" : "button",
					value: m.text
				}).addStopEvent("click", function(o) {
					if (typeof(m.click) === "function") {
						if (m.click(k.get("value")) === false) {
							return
						}
					}
					f.hide(c)
				});
				g.grab(n).appendText(" ");
				if (m.focus) {
					i = n
				}
			})
		}
		var b = [l.width, "25em"].pick();
		a.setStyle("width", b);
		if (undefined !== l.input) {
			k.measure(function() {
				var n = (l.input.split("\n").length || 1).min(5);
				k.setStyle("height", (n * 1.3) + "em");
				var p = k.getDimensions({
					computeSize: true
				});
				var o = p["border-bottom-width"] + p["border-top-width"];
				var m = k.offsetHeight - (k.clientHeight + o);
				if (m > 0) {
					k.setStyle("height", k.offsetHeight - o + m)
				}
			})
		}
		this.items[c].modal = !![l.modal, true].pick();
		this.show(c);
		if (undefined !== l.input) {
			k.show();
			k.select();
			k.focus()
		} else {
			k.hide();
			if (i) {
				i.focus()
			}
		}
	},
	add: function(d, c, a) {
		if (has(this.items, d)) {
			return
		}
		this.items[d] = {
			modal: !!c,
			onShow: a
		};
		var b = "dlg" + d;
		$(b).addEvent("mousedown", this.bringToFront.bind(this, d)).getElement(".dlg-close").addStopEvent("click", this.hide.bind(this, d));
		new Drag(b, {
			handle: b + "-head",
			snap: 1
		})
	},
	show: function(a) {
		if (!ContextMenu.hidden) {
			ContextMenu.hide()
		}
		this.bringToFront(a);
		if (this.items[a].modal) {
			$("modalbg").show().setStyle("zIndex", this.winZ)
		} else {
			if (!this.modalIsVisible()) {
				$("modalbg").hide()
			}
		}
		if (this.isOffScreen(a)) {
			$("dlg" + a).center()
		}
		if (this.items[a].onShow) {
			this.items[a].onShow()
		}
	},
	hide: function(d) {
		var a = $("dlg" + d);
		a.hide();
		try {
			if (a.contains(document.activeElement)) {
				document.activeElement.blur();
				document.activeElement = null
			}
		} catch (c) {}
		this.showing = this.showing.erase(d);
		if (this.items[d].modal) {
			var b = this.getTopModal();
			if (b) {
				$("modalbg").setStyle("zIndex", $("dlg" + b).getStyle("zIndex"))
			} else {
				$("modalbg").hide()
			}
		}
		if (this.showing.length) {
			this.bringToFront(this.showing.getLast())
		}
	},
	hideTopMost: function(a) {
		if (!this.showing.length) {
			return
		}
		var b = this.showing.pop();
		this.hide(b);
		if (a) {
			$("dlg" + b).getElement(".dlg-close").fireEvent("click", {
				stop: Function.from()
			})
		}
	},
	isOffScreen: function(e) {
		var b = 150,
			a = 50;
		var c = window.getSize();
		var d = $("dlg" + e + "-head").getCoordinates();
		return ((d.left > c.x - b) || (d.right < b) || (d.top > c.y - a) || (d.bottom < a))
	},
	bringToFront: function(d) {
		this.showing = this.showing.erase(d);
		if (this.showing.length) {
			$("dlg" + this.showing.getLast()).removeClass("dlg-top")
		}
		this.showing.push(d);
		var c = $("dlg" + d);
		c.addClass("dlg-top").setStyle("zIndex", ++this.winZ);
		try {
			var a = document.activeElement;
			if (a && (a !== document.body) && !c.contains(a)) {
				a.blur();
				document.activeElement = null
			}
		} catch (b) {}
	},
	getTopModal: function() {
		for (var a = this.showing.length - 1; a >= 0; --a) {
			if (this.items[this.showing[a]].modal) {
				return this.showing[a]
			}
		}
		return null
	},
	modalIsVisible: function() {
		return !!this.getTopModal()
	}
};
