var CMENU_SEP = 0;
var CMENU_CHILD = 1;
var CMENU_SEL = 2;
var CMENU_CHECK = 3;
var ELE_A = new Element("a");
var ELE_DIV = new Element("div");
var ELE_LI = new Element("li");
var ELE_UL = new Element("ul");
var ContextMenu = {
	element: null,
	hideAfterClick: true,
	hidden: true,
	add: function() {
		function a(d) {
			return (function(e) {
				if (ContextMenu.hideAfterClick) {
					ContextMenu.hide()
				}
				if (typeof(d) == "function") {
					d(e)
				}
			})
		}
		var b = Array.from(arguments);
		var c = b[0];
		if (typeOf(c) == "element") {
			if (!c.getParent().hasClass("CMenu")) {
				return
			}
			b.splice(0, 1)
		} else {
			c = this.getElement().getElement("ul")
		}
		b.each(function(h) {
			if (!h) {
				return
			}
			var e = ELE_LI.clone(false);
			c.adopt(e);
			switch (h[0]) {
				case CMENU_SEP:
					e.addClass("sep");
					break;
				case CMENU_SEL:
					e.adopt(ELE_A.clone(false).addClass("sel").set("text", h[1]));
					break;
				case CMENU_CHECK:
					e.adopt(ELE_A.clone(false).addClass("check").set("text", h[1]).addStopEvents({
						mouseup: a(h[2]),
						click: null
					}));
					break;
				case CMENU_CHILD:
					e.adopt(ELE_A.clone(false).addClass("exp").set("text", h[1]));
					var g = ELE_UL.clone(false);
					var i = (ELE_DIV.clone(false).addClass("CMenu").grab(g));
					e.adopt(i).addStopEvents({
						mouseenter: function() {
							ContextMenu.show(this.getCoordinates(), i)
						},
						mouseleave: function() {
							ContextMenu.hide(i)
						}
					});
					for (var f = 0, d = h[2].length; f < d; f++) {
						this.add(g, h[2][f])
					}
					break;
				default:
					if (h[1] === undefined) {
						e.adopt(ELE_A.clone(false).addClass("dis").set("text", h[0]))
					} else {
						e.adopt(ELE_A.clone(false).set("text", h[0]).addStopEvents({
							mouseup: a(h[1]),
							click: null
						}))
					}
			}
		}, this)
	},
	clear: function() {
		this.getElement().getElement("ul").set("html", "")
	},
	getElement: function() {
		if (!this.element) {
			this.element = (ELE_DIV.clone(false).addClass("CMenu").inject(document.body).addStopEvent("mousedown").grab(ELE_UL.clone(false)))
		}
		return this.element
	},
	hide: function(a) {
		a = a || this.getElement();
		a.hide();
		a.getElement("ul").setStyle("top");
		a.removeEvents("mousemove");
		if (a === this.getElement()) {
			this.hidden = true;
			this.clear()
		}
	},
	scroll: function(e) {
		if (this.__scrolling__) {
			return
		}
		this.__scrolling__ = true;
		var d = this.getElement("ul");
		var b = d.getChildren()[0];
		if (b) {
			var c = b.getHeight() / 2;
			var f = this.getCoordinates();
			var a = (f.height - d.getHeight() - d.getDimensions({
				computeSize: true
			})["padding-top"]);
			var g;
			if (e.page.y < f.top + c) {
				g = 0
			} else {
				if (f.bottom - c < e.page.y) {
					g = a
				} else {
					g = (a * (e.page.y - f.top - c) / (f.height - c - c)).toFixed(0).toInt()
				}
			}
			d.setStyle("top", g)
		}
		this.__scrolling__ = false
	},
	show: function(e, f) {
		f = f || this.getElement();
		f.setStyles({
			height: undefined,
			width: undefined,
			left: 0,
			top: 0
		});
		e = Object.merge({
			x: 0,
			y: 0
		}, e);
		if (typeof(e.left) === "undefined") {
			e.left = e.x
		}
		if (typeof(e.right) === "undefined") {
			e.right = e.x
		}
		if (typeof(e.top) === "undefined") {
			e.top = e.y
		}
		if (typeof(e.bottom) === "undefined") {
			e.bottom = e.y
		}
		f.show();
		this.hidden = false;
		var c = window.getSize();
		var b = f.getDimensions({
			computeSize: true
		});
		var d = {
			x: b.totalWidth,
			y: b.totalHeight
		};
		if (d.x > c.x) {
			d.x = c.x;
			f.setStyle("width", d.x)
		}
		f.getElements("> ul > li > a.exp").each(function(h) {
			h.setStyle("background-position", (d.x - 16) + "px center")
		});
		var a = e.right;
		if (a + d.x > c.x) {
			if (d.x <= e.left) {
				a = e.left - d.x
			} else {
				a = c.x - d.x
			}
		}
		var g = e.top;
		if (g + d.y > c.y) {
			if (d.y <= e.bottom) {
				g = e.bottom - d.y
			} else {
				if (e.bottom < c.y - e.top) {
					f.setStyle("height", c.y - e.top - 5)
				} else {
					f.setStyle("height", e.bottom);
					g = 0
				}
				f.addStopEvent("mousemove", this.scroll)
			}
		}
		f.addStopEvent("mousemove");
		f.setStyles({
			left: a.max(0),
			top: g.max(0)
		})
	}
};
