(function() {
	var b = document.id;
	$ = function(d, e) {
		return b(((typeof(d) === "string") ? (document.getElementById(d) || d) : d), e, document)
	};
	var a = ({}).constructor.prototype.hasOwnProperty;
	has = function(e, d) {
		return a.apply(e, [d])
	};
	var c = Function.from(true);
	isEmpty = function(d) {
		return !Object.some(d, c)
	}
})();

function favicon(u) {
	return "https://www.google.com/s2/favicons?domain=" + u;
}

function eventToKey(a) {
	return ((a.shift ? "shift " : "") + (a.control ? "ctrl " : "") + (a.alt ? "alt " : "") + (a.meta ? "meta " : "") + a.key)
}

function ctrlToMeta(c) {
	for (var b in c) {
		var a = b.split(" ");
		if (a.length === 2 && a[0] === "ctrl") {
			a[0] = "meta";
			c[a.join(" ")] = c[b];
			delete c[b]
		}
	}
	return c
}

function $chk(a) {
	return !!(a || a === 0)
}

function $each(b, a, c) {
	switch (typeOf(b)) {
		case "array":
		case "collection":
		case "elements":
			return Array.each(b, a, c);
		default:
			return Object.each(b, a, c)
	}
}

function changePort(b) {
	function d(e) {
		return (e.search(/\[.*?\]/) >= 0)
	}
	var a = window.location.hostname;
	if (d(window.location.host) && !d(a)) {
		a = "[" + a + "]"
	}
	var c = window.location.protocol + "//" + a + ":" + b + window.location.pathname + window.location.search;
	return c
}

function openURL(a, b) {
	window.open(a, b || "_utwebui_blank" + encodeID(a))
}

function decodeID(a) {
	return unescape(a.replace(/_/g, "%"))
}

function encodeID(a) {
	return escape(a.replace(/[A-Za-z0-9\*\@\-\_\+\.\/]/g, function(b) {
		return "_" + b.charCodeAt(0).toString(16)
	})).replace(/%/g, "_")
}(function() {
	var d = Math.ceil;
	var c = Math.floor;
	var a = Math.round;
	Array.implement({
		binarySearch: function(k, g, j, f) {
			if (typeof(g) != "function") {
				g = function(m, l) {
					if (m === l) {
						return 0
					}
					if (m < l) {
						return -1
					}
					return 1
				}
			}
			j = j || 0;
			f = f || this.length;
			while (j < f) {
				var i = parseInt((j + f) / 2, 10);
				var h = g(k, this[i]);
				if (h < 0) {
					f = i
				} else {
					if (h > 0) {
						j = i + 1
					} else {
						return i
					}
				}
			}
			return -(j + 1)
		},
		insertAt: function(g, f) {
			this.splice(f, 0, g);
			return this
		},
		invert: function() {
			var h = {};
			for (var g = 0, f = this.length; g < f; ++g) {
				h[this[g]] = g
			}
			return h
		},
		swap: function(h, g) {
			var f = this[h];
			this[h] = this[g];
			this[g] = f;
			return this
		},
		remove: function(g) {
			for (var f = this.length; f--;) {
				if (this[f] === g) {
					this.splice(f, 1);
					return f
				}
			}
			return -1
		}
	});
	String.implement({
		pad: function(f, i, g) {
			var h = this;
			i = i || " ";
			g = g || "right";
			f -= h.length;
			if (f < 0) {
				return h
			}
			i = (new Array(d(f / i.length) + 1)).join(i).substr(0, f);
			return ((g == "left") ? (i + h) : (h + i))
		},
		splitLimit: function(l, k) {
			k = c(k);
			if (0 < k && k !== Infinity) {
				var j = this.split(l, k);
				var f = j.length;
				if (f === k) {
					for (var h = 0, g = j.length; h < g; ++h) {
						f += j[h].length
					}
					if (f <= this.length) {
						j.push(this.slice(f + l.length - 1))
					}
				}
				return j
			} else {
				return [this]
			}
		}
	});
	var e, b;
	Number.implement({
		pad: function(f, h, g) {
			return String(this).pad(f, h || "0", g || "left")
		},
		toFixedNR: function(f) {
			f = (Number(f) || 0);
			if (f <= 0) {
				f = -1
			}
			var g = this.toFixed(20);
			return g.substring(0, g.length - (20 - f))
		},
		toFileSize: function(f, h) {
			if (!e) {
				e = ["SIZE_B", "SIZE_KB", "SIZE_MB", "SIZE_GB", "SIZE_TB", "SIZE_PB", "SIZE_EB"].map(L_);
				b = e.length - 1
			}
			var g = this;
			h = Number(h);
			if (isNaN(h) || h < 1) {
				h = 1;
				g /= 1024
			}
			while ((g >= 1024) && (h < b)) {
				g /= 1024;
				h++
			}
			return (g.toFixedNR(typeof(f) === "number" ? f : 1) + " " + e[h])
		},
		toTimeDelta: function() {
			var k = Number(this);
			if (k > 63072000) {
				return "\u221E"
			}
			var f, n, o, l, j, i, p, g = "";
			n = c(k / 31536000);
			f = k % 31536000;
			o = c(f / 604800);
			f = f % 604800;
			l = c(f / 86400);
			f = f % 86400;
			j = c(f / 3600);
			f = f % 3600;
			i = c(f / 60);
			p = f % 60;
			if (n > 0) {
				g = L_("TIME_YEARS_WEEKS").replace(/%d/, n).replace(/%d/, o)
			} else {
				if (o > 0) {
					g = L_("TIME_WEEKS_DAYS").replace(/%d/, o).replace(/%d/, l)
				} else {
					if (l > 0) {
						g = L_("TIME_DAYS_HOURS").replace(/%d/, l).replace(/%d/, j)
					} else {
						if (j > 0) {
							g = L_("TIME_HOURS_MINS").replace(/%d/, j).replace(/%d/, i)
						} else {
							if (i > 0) {
								g = L_("TIME_MINS_SECS").replace(/%d/, i).replace(/%d/, p)
							} else {
								g = L_("TIME_SECS").replace(/%d/, p)
							}
						}
					}
				}
			}
			return g
		}
	});
	Date.implement({
		isValid: function(f) {
			return !isNaN((f || this).valueOf())
		},
		getGMTOffset: function() {
			var f = this.getTimezoneOffset();
			return ((f > 0) ? "-" : "+") + (f.abs() / 60).floor().pad(2) + (f % 60).pad(2)
		},
		getTimezone: function() {
			return this.toString().replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, "$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3")
		},
		format: function(g) {
			if (!this.isValid()) {
				return "invalid date"
			}
			var h = this;
			return g.replace(/%([a-z%])/gi, function(i, f) {
				switch (f) {
					case "d":
						return h.getDate().pad(2);
					case "e":
						return h.getDate().pad(2, " ");
					case "H":
						return h.getHours().pad(2);
					case "I":
						return ((h.getHours() % 12) || 12).pad(2);
					case "k":
						return h.getHours().pad(2, " ");
					case "l":
						return ((h.getHours() % 12) || 12).pad(2, " ");
					case "L":
						return h.getMilliseconds().pad(3);
					case "m":
						return (h.getMonth() + 1).pad(2);
					case "M":
						return h.getMinutes().pad(2);
					case "s":
						return a(h / 1000);
					case "S":
						return h.getSeconds().pad(2);
					case "w":
						return h.getDay();
					case "y":
						return h.getFullYear().toString().substr(2);
					case "Y":
						return h.getFullYear();
					case "z":
						return h.getGMTOffset();
					case "Z":
						return h.getTimezone()
				}
				return f
			})
		},
		toISOString: function() {
			return this.format("%Y-%m-%dT%H:%M:%S%z")
		}
	});
	Element.implement({
		show: function(f) {
			this.fireEvent("show");
			return this.setStyle("display", f ? "" : "block")
		},
		hide: function() {
			this.fireEvent("hide");
			return this.setStyle("display", "none")
		},
		center: function() {
			this.show();
			var f = window.getSize();
			var g = this.getSize();
			return this.setStyles({
				left: ((f.x - g.x) / 2).max(0),
				top: ((f.y - g.y) / 2).max(0)
			})
		},
		addClasses: function() {
			var h = arguments.length,
				f = false,
				i = false;
			if (typeOf(arguments[h - 1]) == "boolean") {
				f = arguments[--h]
			}
			var g = f ? "" : this.className;
			while (h--) {
				var j = arguments[h];
				if ((j != "") && !g.contains(j, " ")) {
					g += " " + j;
					i = true
				}
			}
			if (i) {
				this.className = g.clean()
			}
			return this
		}
	});
	DOMEvent.implement({
		isRightClick: function() {
			return !!(this.rightClick || (this.control && (this.event.button === 0) && Browser.Platform.mac))
		},
		withinScroll: function(g) {
			g = g || this.target;
			if (!g) {
				return false
			}
			var i = g.getPosition(),
				f = this.page.x,
				h = this.page.y;
			return (i.x <= f && f <= i.x + g.clientWidth && i.y <= h && h <= i.y + g.clientHeight)
		}
	});
	[Document, Window].invoke("implement", {
		getZoomSize: function() {
			if (Browser.opera && Browser.version >= 9.6) {
				return {
					x: document.body.clientWidth,
					y: document.body.clientHeight
				}
			}
			return this.getSize()
		}
	});
	[Element, Window, Document].invoke("implement", {
		addStopEvent: function(g, f) {
			return this.addEvent(g, function(i) {
				var h;
				if (typeof(f) === "function") {
					h = f.apply(this, arguments)
				}
				if (!h) {
					i.stop();
					return false
				}
			})
		},
		addStopEvents: function(f) {
			Object.each(f, function(h, g) {
				this.addStopEvent(g, h)
			}, this);
			return this
		}
	});
	Object.append(Element.NativeEvents, {
		dragstart: 2,
		drag: 2,
		dragover: 2,
		dragenter: 2,
		dragleave: 2,
		drop: 2,
		dragend: 2
	})
})();
