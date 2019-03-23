var TYPE_STRING = 0;
var TYPE_NUMBER = 1;
var TYPE_DATE = 2;
var TYPE_NUM_ORDER = 3;
var TYPE_NUM_PROGRESS = 4;
var TYPE_CUSTOM = 5;
var ALIGN_AUTO = 0;
var ALIGN_LEFT = 1;
var ALIGN_CENTER = 2;
var ALIGN_RIGHT = 3;
var MODE_PAGE = 0;
var MODE_VIRTUAL = 1;
var NO_CHANGE = 0;
var HAS_CHANGED = 1;
var MATH_CEIL = Math.ceil;
var MATH_FLOOR = Math.floor;
var TD = new Element("td");
var TR = new Element("tr");
var DIV = new Element("div");
var SPAN = new Element("span");

function simpleClone(a, b) {
	a = $(a.cloneNode(!!b));
	a.uid = null;
	Slick.uidOf(a);
	return a
}
var PBAR = simpleClone(DIV, false).addClass("stable-progress").grab(simpleClone(DIV, false).addClass("stable-progress-bar").grab(simpleClone(DIV, false)));

function progressBar(b) {
	var c = b.toFixedNR(1) + "%";
	var a = simpleClone(PBAR, true);
	(a.appendText(c, "top").children[0].setStyle("width", c).children[0].appendText(c, "top").setStyle("width", (b ? (100 * 100 / b).toFixedNR(1) + "%" : 0)));
	return a
}
var STable = new Class({
	Implements: [Options, Events],
	rows: 0,
	rowData: {},
	rowId: [],
	rowSel: {},
	selectedRows: [],
	stSel: null,
	activeId: [],
	cols: 0,
	colData: [],
	sortCustom: null,
	dCont: null,
	dHead: null,
	dBody: null,
	tHead: null,
	tBody: null,
	tb: {
		head: null,
		body: null,
		rowheight: 0
	},
	sIndex: -1,
	reverse: 0,
	secIndex: 0,
	secRev: 0,
	colOrder: [],
	colHeader: [],
	options: {
		format: function() {
			return arguments[0]
		},
		maxRows: 25,
		alternateRows: true,
		mode: MODE_PAGE,
		rowsSelectable: true,
		rowMultiSelect: true,
		refreshable: false
	},
	tHeadCols: [],
	tBodyCols: [],
	cancelSort: false,
	cancelMove: false,
	hotCell: -1,
	colMove: null,
	colSep: null,
	isMoving: false,
	isResizing: false,
	isSorting: false,
	isScrolling: false,
	curPage: 0,
	pageCount: 0,
	rowCache: [],
	rowModel: null,
	resetText: null,
	filterShow: false,
	filterQuery: null,
	create: function(c, g, n) {
		this.cols = g.length;
		var f = -1;
		this.colIcon = [];
		this.colFilter = [];
		this.colHeader = g.map(function(o, i) {
			if (f < 0 && o.type === TYPE_STRING) {
				f = i
			}
			if (!!o.icon) {
				this.colIcon.push(i)
			}
			if (!!o.filter) {
				this.colFilter.push(i)
			}
			return {
				id: (o.id || ""),
				align: [o.align, ALIGN_AUTO].pick(),
				filter: (o.filter && o.type === TYPE_STRING),
				hidden: !![o.hidden, !o.width].pick(),
				icon: !!o.icon,
				text: (o.text || o.id || ""),
				type: [o.type, TYPE_STRING].pick(),
				width: (o.width || 0)
			}
		}, this);
		if (!this.colIcon.length) {
			this.colHeader[0].icon = true;
			this.colIcon.push(0)
		}
		if (!this.colFilter.length && f >= 0) {
			this.colHeader[f].filter = true;
			this.colFilter.push(f)
		}
		this.colOrder = (n.colOrder && (n.colOrder.length == this.cols)) ? n.colOrder : g.map(function(p, o) {
			return o
		});
		this.sIndex = isNaN(n.sIndex) ? -1 : n.sIndex.toInt().limit(-1, this.cols - 1);
		delete n.colOrder;
		delete n.sIndex;
		if (n.sortCustom) {
			this.sortCustom = n.sortCustom;
			delete n.sortCustom
		}
		this.setOptions(n);
		this.cmp = (function() {
			var i = {
				DEFAULT: function(o, p) {
					return Comparator.compare(o.v, p.v)
				}
			};
			i[TYPE_STRING] = this.sortAlphaNumeric.bind(this);
			i[TYPE_DATE] = i[TYPE_NUMBER] = i[TYPE_NUM_PROGRESS] = this.sortNumeric.bind(this);
			i[TYPE_NUM_ORDER] = this.sortNumOrder.bind(this);
			return i
		}).apply(this);
		var k = (Browser.ie && Browser.version <= 7);
		var m, e, b, j = this;
		this.id = "stable-" + c;
		this.idprefix = new RegExp("^" + this.id + "-row-", "");
		this.dCont = $(c).addClass("stable");
		this.dHead = simpleClone(DIV, false).addClass("stable-head").inject(this.dCont);
		this.dBody = simpleClone(DIV, false).addClass("stable-body").inject(this.dCont);
		this.dHead.addEvents({
			mousedown: function(i) {
				if (i.isRightClick()) {
					j.colMenu.delay(0, j, i.page)
				}
			}
		});
		this.tHead = new Element("table", {
			cellpadding: 0,
			cellspacing: 0
		}).inject(this.dHead);
		this.tb.head = new Element("tbody").inject(this.tHead);
		m = simpleClone(TR, false);
		var d = new Drag(m, {
			modifiers: {
				x: "left",
				y: false
			},
			snap: 1,
			onStart: function() {
				ColumnHandler.start(j, this)
			},
			onDrag: function() {
				ColumnHandler.drag(j, this)
			},
			onComplete: function() {
				ColumnHandler.end(j, this)
			},
			onCancel: function(i, o) {
				this.detach();
				j.cancelSort = false;
				if (!o.isRightClick()) {
					if (this.element.tagName !== "TD") {
						this.element = this.element.getParent("td")
					}
					j.sort(this.element, o.shift, true)
				}
			}
		}).detach();
		m.addEvents({
			mousemove: function(i) {
				var o = i.target;
				if (!o || o.tagName === "TR") {
					return
				}
				if (o.tagName !== "TD") {
					o = o.getParent("td")
				}
				if (o.tagName === "TD") {
					ColumnHandler.check.apply(j, [i, o])
				}
			},
			mousedown: function(i) {
				var o = i.target;
				if (!o || o.tagName === "TR") {
					return
				}
				if (o.tagName !== "TD") {
					o = o.getParent("td")
				}
				if (o.tagName === "TD") {
					d.element = d.handles = o;
					d.attach().start(i)
				}
			}
		});
		var l = this.cols;
		this.rowModel = simpleClone(TR, false);
		for (var h = 0; h < l; h++) {
			this.colOrder[h] = (typeOf(this.colOrder[h]) == "number") ? this.colOrder[h].limit(0, l - 1) : h;
			this.colData[h] = this.colHeader[this.colOrder[h]];
			this.rowModel.grab(simpleClone(TD, false).addClass(this.id + "-col-" + this.colOrder[h]).setStyle(k ? "visibility" : "display", k ? (this.colData[h].hidden ? "hidden" : "visible") : (this.colData[h].hidden ? "none" : "")));
			e = simpleClone(TD, false).grab(new Element("div#" + this.id + "-head-" + this.colData[h].id, {
				text: this.colData[h].text
			})).setStyles({
				width: this.colHeader[h].width,
				display: this.colData[h].hidden ? "none" : ""
			}).store("index", h).inject(m);
			this.tHeadCols[h] = e
		}
		this.tb.head.grab(m);
		this.dPad = simpleClone(DIV, false).addClass("stable-pad").inject(this.dBody);
		this.tBody = new Element("table", {
			cellpadding: 0,
			cellspacing: 0
		}).inject(this.dPad);
		var a = new Element("colgroup").inject(this.tBody);
		for (var h = 0; h < l; h++) {
			this.tBodyCols[h] = new Element("col", {
				styles: {
					width: this.colHeader[h].width,
					display: this.colData[h].hidden ? "none" : ""
				},
				width: this.colHeader[h].width,
				span: 1
			}).inject(a)
		}
		this.tb.body = new Element("tbody");
		if (Browser.ie) {
			this.tb.body.addEvent("selectstart", function() {
				return false
			})
		}
		this.colDragEle = null;
		this.colDragObj = simpleClone(DIV, false).addClass("stable-move-header").inject(this.dHead);
		this.colSep = simpleClone(DIV, false).addClass("stable-separator-header").inject(this.dHead);
		if (this.options.rowsSelectable) {
			this.dBody.addEvent("mousedown", function(i) {
				var o = i.target;
				if (o.get("tag") != "td") {
					o = o.getParent("td")
				}
				if (o) {
					j.selectRow(i, o.getParent())
				}
				if (Browser.ie9 && document.documentMode >= 9) {
					ContextMenu.hide();
					i.stopPropagation()
				}
			}).addEvent("click", function(i) {
				if (i.control || i.shift || i.meta) {
					return
				}
				var o = i.target;
				if (!(o.get("tag") == "td" || o.getParent("td"))) {
					var p = this.getPosition();
					if ((this.clientWidth > i.page.x - p.x - this.scrollLeft + 2) && (this.clientHeight > i.page.y - p.y - this.scrollTop + 2)) {
						j.clearSelection();
						j.fireEvent.delay(0, j, ["onSelect", [i, ""]])
					}
				}
				i.preventDefault()
			}).addEvent("dblclick", function(i) {
				if (i.control || i.shift || i.meta) {
					return
				}
				var o = i.target;
				if (o.get("tag") != "td") {
					o = o.getParent("td")
				}
				if (o) {
					j.fireEvent("onDblClick", o.getParent().id.replace(j.idprefix, ""))
				}
				i.preventDefault()
			})
		}
		for (var h = 0; h < this.options.maxRows; h++) {
			this.tb.body.appendChild(simpleClone(this.rowModel, true).hide())
		}
		this.tBody.grab(this.tb.body);
		this.infoBar = simpleClone(DIV, false).addClass("stable-infobar").inject(this.dCont);
		this.filterBar = (new Element("span.filterbar").appendText("Find:").grab(new Element("a.filterbar-close", {
			href: "#"
		}).addStopEvent("click", this.hideFilterBar.bind(this))).grab(new Element("input.filterbar-query").addEvents({
			keydown: (function(o) {
				var i = eventToKey(o).trim();
				switch (i) {
					case "delete":
						o.stopPropagation();
						break;
					case "esc":
						this.hideFilterBar();
						o.stop();
						break
				}
			}).bind(this),
			keyup: (function(i) {
				this.applyFilter(i.target.get("value"))
			}).bind(this)
		})).inject(this.infoBar));
		this.filterBarQueryInput = this.filterBar.getElement(".filterbar-query");
		if (this.options.refreshable) {
			this.infoBar.grab(new Element("div.refreshBtn").grab(new Element("span.refreshIcon").addEvent("click", function(i) {
				if (j.rows) {
					j.fireEvent("onRefresh")
				}
			})))
		}
		this.pageChanger = new Element("div.pageChanger").inject(this.infoBar);
		this.pagePrev = (new Element("a.prevlink.disabled").addEvent("click", this.prevPage.bind(this)).inject(this.pageChanger));
		this.pageSelect = (new Element("select.pageSelector").addEvent("change", function() {
			j.gotoPage(this.get("value").toInt())
		}).inject(this.pageChanger));
		this.pageNext = (new Element("a.nextlink.disabled").addEvent("click", this.nextPage.bind(this)).inject(this.pageChanger));
		this.assignEvents();
		this.setAlignment()
	},
	assignEvents: function() {
		this.lastScrollUp = false;
		this.lastScroll = 0;
		var b = this.dBody;
		var e = (function() {
			var f = b.scrollTop;
			if (this.lastScroll !== f) {
				this.lastScrollUp = (f < this.lastScroll);
				this.resizePads();
				this.lastScroll = f
			}
		}).bind(this);
		var d = (Browser.ie && Browser.version <= 7);
		var c = (function() {
			try {
				this.dHead.scrollLeft = b.scrollLeft;
				if (this.options.mode === MODE_VIRTUAL) {
					if (d) {
						this.keepScroll(e)
					} else {
						e()
					}
				}
			} catch (f) {}
			this.isScrolling = false
		}).bind(this);
		this.scrollEvent = (function() {
			if (this.isScrolling) {
				return
			}
			this.isScrolling = true;
			c.delay(0);
			return false
		}).bind(this);
		b.addEvent("scroll", this.scrollEvent);
		if (this.options.rowsSelectable) {
			this.dBody.addEvent("mousedown", function(f) {
				this.focus();
				try {
					document.activeElement = this
				} catch (g) {}
			}).setProperty("tabIndex", -1);
			var a = {
				"ctrl a": this.selectAll.bind(this),
				"ctrl e": this.unselectAll.bind(this),
				"ctrl f": this.showFilterBar.bind(this)
			};
			if (Browser.Platform.mac) {
				ctrlToMeta(a)
			}
			this.dCont.addStopEvent("keydown", function(g) {
				var f = eventToKey(g);
				if (a[f]) {
					a[f](g)
				} else {
					return true
				}
			});
			this.dCont.addEvent("keydown", (function(f) {
				this.fireEvent("onKeyDown", f)
			}).bind(this))
		}
	},
	setAlignment: function() {
		var d = "",
			e = this.tBody.getElement("colgroup").getElements("col");
		var h = this.tb.body,
			g = h.childNodes,
			k = g.length;
		for (var b = 0, f = this.cols; b < f; ++b) {
			var c = "left";
			switch (this.colData[b].align) {
				case ALIGN_LEFT:
					break;
				case ALIGN_CENTER:
					c = "center";
					break;
				case ALIGN_RIGHT:
					c = "right";
					break;
				case ALIGN_AUTO:
				default:
					switch (this.colData[b].type) {
						case TYPE_NUM_ORDER:
						case TYPE_NUMBER:
							c = "right";
							break;
						case TYPE_NUM_PROGRESS:
							c = "center";
							break
					}
			}
			this.tHeadCols[b].setStyle("textAlign", c);
			for (var a = 0; a < k; ++a) {
				g[a].childNodes[b].setStyle("textAlign", c)
			}
		}
	},
	isValidCol: function(b, a) {
		return ($chk(b) && 0 <= b && (a ? b <= this.cols : b < this.cols))
	},
	setColumnHidden: function(c, h) {
		if (!this.isValidCol(c)) {
			return
		}
		var g = (Browser.ie && Browser.version <= 7);
		this.colData[c].hidden = h;
		this.tHeadCols[c].setStyle("display", h ? "none" : "");
		this.tBodyCols[c].setStyle("display", h ? "none" : "");
		var a = g ? "visibility" : "display";
		var e = g ? (h ? "hidden" : "visible") : (h ? "none" : "");
		this.rowModel.childNodes[c].setStyle(a, e);
		var f = this.tb.body.childNodes;
		for (var d = 0, b = f.length; d < b; d++) {
			f[d].childNodes[c].setStyle(a, e)
		}
	},
	setColumnPosition: function(h, c) {
		h = this.colOrder[h];
		if (c < 0 || h == c) {
			return
		}
		var b = this.tHeadCols[c],
			a = this.tHeadCols[h];
		var i = this.tBody.getElement("colgroup"),
			f = i.childNodes[c],
			d = i.childNodes[h].dispose();
		if (c == this.cols) {
			a.getParent().grab(a.dispose(), "bottom");
			i.grab(d, "bottom");
			this.rowModel.grab(this.rowModel.childNodes[h].dispose(), "bottom");
			$each(this.tb.body.childNodes, function(j) {
				j.grab(j.childNodes[h].dispose(), "bottom")
			})
		} else {
			a.dispose().inject(b, "before");
			d.inject(f, "before");
			var g = this.rowModel.childNodes[c];
			this.rowModel.childNodes[h].dispose().inject(g, "before");
			$each(this.tb.body.childNodes, function(j) {
				g = j.childNodes[c];
				j.childNodes[h].dispose().inject(g, "before")
			})
		}

		function e(j) {
			j.splice(c - (h < c ? 1 : 0), 0, j.splice(h, 1)[0])
		}
		e(this.tHeadCols);
		e(this.tBodyCols);
		e(this.colData);
		this.colOrder = this.colHeader.map(function(j) {
			return this.colData.indexOf(j)
		}, this)
	},
	getColumnWidths: function() {
		return this.colHeader.map(function(a) {
			return a.width
		})
	},
	setColumnWidth: function(b, e) {
		if (!this.isValidCol(b)) {
			return
		}
		var d = (Browser.ie && Browser.version <= 7);
		var a = 32;
		var c = this.tHeadCols[b];
		var f = (c.offsetWidth - parseInt(c.style.width, 10)).max(0);
		if (e < a) {
			e = a
		}
		c.setStyle("width", (e - f).max(0));
		this.tBodyCols[b].setStyle("width", e - (d ? 10 : 0));
		this.tBody.setStyle("width", this.tHead.getWidth());
		this.tb.body.setStyle("width", this.tHead.getWidth());
		this.colData[b].width = e
	},
	setConfig: function(a) {
		var h, e = false;
		var g = this.colHeader;
		var d = g.map(function(j, i) {
			return i
		}).associate(g.map(function(i) {
			return i.id
		}));
		h = a.resetText;
		if (typeOf(h) === "string") {
			this.resetText = h
		}
		h = a.colText;
		if (typeOf(h) === "object") {
			this.outOfDOM((function() {
				var k, l, i;
				var j = this.dHead.getElement("tr").childNodes;
				Object.each(h, function(n, m) {
					k = d[m];
					if ($chk(g[k])) {
						l = j[this.colOrder[k]].getElement("div");
						i = l.getElement("span");
						if (i) {
							i.dispose()
						}
						l.set("html", n);
						if (i) {
							l.grab(i)
						}
						g[k].text = n
					}
				}, this)
			}).bind(this))
		}
		h = a.colType;
		if (typeOf(h) === "object") {
			var c = [];
			Object.each(h, function(j, i) {
				ind = d[i];
				if ($chk(g[ind]) && g[ind].type != j) {
					c.push(ind);
					g[ind].type = j
				}
			}, this);
			e = true
		}
		h = a.colAlign;
		if (typeOf(h) === "object") {
			Object.each(h, function(j, i) {
				ind = d[i];
				if ($chk(g[ind])) {
					g[ind].align = j
				}
			}, this);
			this.setAlignment()
		}
		h = a.colMask;
		if (typeOf(h) === "number") {
			this.outOfDOM((function() {
				for (var k = 0, l = 1, j = this.cols; k < j; ++k, l <<= 1) {
					this.setColumnHidden(this.colOrder[k], !!(h & l))
				}
			}).bind(this));
			this.calcSize();
			e = true
		}
		h = a.colOrder;
		if (typeOf(h) === "array") {
			if (h.length == this.cols) {
				this.outOfDOM((function() {
					var n = true,
						k = Array.clone(h).sort(function(l, i) {
							return (l - i)
						});
					for (var m = 0, j = k.length; m < j; ++m) {
						if (m != k[m]) {
							n = false;
							break
						}
					}
					if (n) {
						Array.each(h, function(o, l, i) {
							if (i.indexOf(l) != this.colOrder.indexOf(l)) {
								this.setColumnPosition(i.indexOf(l), l)
							}
						}, this)
					}
				}).bind(this))
			}
		}
		h = a.colWidth;
		if (typeOf(h) === "array") {
			if (h.length == this.cols) {
				this.outOfDOM((function() {
					Array.each(h, function(j, i) {
						this.setColumnWidth(this.colOrder[i], j)
					}, this)
				}).bind(this))
			}
		}
		h = a.colSort;
		if (typeOf(h) === "array") {
			this.outOfDOM((function() {
				if ($chk(h[1])) {
					this.options.reverse = !!h[1]
				}
				this.sort(h[0])
			}).bind(this))
		}
		h = parseInt(a.rowMaxCount, 10);
		if (!isNaN(h) && (h >= 1)) {
			var f = this.tb.body,
				b = f.childNodes.length;
			this.outOfDOM((function() {
				while (b++ < h) {
					f.appendChild(simpleClone(this.rowModel, true).hide())
				}
			}).bind(this));
			this.options.maxRows = h;
			this.curPage = 0;
			this.setAlignment();
			this.updatePageMenu();
			e = true
		}
		h = a.rowAlternate;
		if (typeOf(h) === "boolean" && h !== this.options.alternateRows) {
			this.options.alternateRows = !!h;
			e = true
		}
		h = parseInt(a.rowMode, 10);
		if (!isNaN(h) && (h != this.options.mode)) {
			this.pageChanger.setStyle("display", (h == MODE_VIRTUAL ? "none" : "block"));
			this.options.mode = h;
			this.calcSize()
		}
		if (e) {
			this.refreshRows()
		}
	},
	getCache: function(a) {
		if (!this.isValidCol(a)) {
			return
		}
		if (this.rowCache.length != this.rows) {
			this.clearCache();
			this.rowCache = new Array(this.rows)
		}
		var d = 0;
		for (var b in this.rowData) {
			this.rowCache[d++] = {
				key: b,
				v: this.rowData[b].data[a]
			}
		}
	},
	clearCache: function(c) {
		var b = this.rowCache.length;
		while (b--) {
			this.rowCache[b].key = null;
			this.rowCache[b].v = null;
			this.rowCache[b] = null
		}
		this.rowCache.empty()
	},
	sort: function(d, b, k) {
		if (this.cancelSort) {
			return
		}
		this.isSorting = true;
		var j = true,
			a = true;
		if (!$chk(d)) {
			d = this.sIndex
		}
		if (typeOf(d) == "number") {
			if (!this.isValidCol(d)) {
				return
			}
			d = this.tHeadCols[this.colOrder[d]];
			j = !!this.options.reverse;
			a = false
		}
		if (d.get("tag") != "td") {
			d = d.getParent("td")
		}
		if (!$chk(d)) {
			return
		}
		var c = d.retrieve("index");
		if (b) {
			if (c == this.sIndex || !this.isValidCol(this.sIndex)) {
				this.secIndex = 0;
				return
			}
			if (this.secIndex == c) {
				this.secRev = 1 - this.secRev
			} else {
				this.secRev = 0
			}
			this.secIndex = c;
			c = this.sIndex;
			j = false;
			d = this.tHeadCols[this.colOrder[c]];
			a = false
		}
		if (j && !!k) {
			this.options.reverse = (this.sIndex == c) ? !this.options.reverse : false
		}
		if ((this.sIndex != c) || (this.rowCache.length != this.rows)) {
			a = false;
			this.getCache(c);
			if (this.isValidCol(this.sIndex)) {
				this.tHeadCols[this.colOrder[this.sIndex]].removeClass("sorted").getElements("span").destroy()
			}
		}
		d.getElements("span").destroy();
		d.addClass("sorted").getElement("div").grab(new Element("span.sorticon." + ((this.options.reverse) ? "desc" : "asc")));
		this.calcSize();
		this.sIndex = c;
		if (!a) {
			var g = this.colHeader[c].type;
			var h = (TYPE_CUSTOM === g ? this.sortCustomWrap(c) : h = this.cmp[g]) || this.cmp.DEFAULT;
			this.rowCache.sort(h)
		}
		this.clearActive();
		var e = this.rows,
			f = 0,
			l = 1;
		if (this.options.reverse) {
			e = l = -1;
			f = this.rows - 1
		}
		while (f != e) {
			var m = this.rowCache[f].key;
			if (!this.rowData[m].hidden) {
				this.rowData[m].activeIndex = this.activeId.length;
				this.activeId.push(m)
			}
			this.rowData[m].index = f;
			f += l
		}
		if (this.options.mode == MODE_PAGE) {
			this.pageCount = MATH_CEIL([this.activeId.visCount, this.activeId.length].pick() / this.options.maxRows)
		}
		this.isSorting = false;
		this.curPage = 0;
		this.refreshRows();
		this.fireEvent("onSort", [this.sIndex, this.options.reverse])
	},
	cmp: {},
	sortCustomWrap: function(a) {
		if (this.sortCustom) {
			if (!this.sortCustomCache) {
				this.sortCustomCache = []
			}
			return this.sortCustomCache[a] || (this.sortCustomCache[a] = (function(b, d) {
				var c = this.sortCustom(a, this.rowData[b.key].data, this.rowData[d.key].data);
				return (((c == 0) && (this.secIndex != this.sIndex)) ? this.sortSecondary(b, d) : c)
			}).bind(this))
		}
	},
	sortNumeric: function(a, c) {
		var b = Comparator.compareNumeric(a.v, c.v);
		return (((b == 0) && (this.secIndex != this.sIndex)) ? this.sortSecondary(a, c) : b)
	},
	sortNumOrder: function(a, c) {
		var b = Comparator.compareNumeric(a.v, c.v);
		if (b != 0) {
			if (a.v == -1) {
				b = 1
			} else {
				if (c.v == -1) {
					b = -1
				}
			}
		}
		return (((b == 0) && (this.secIndex != this.sIndex)) ? this.sortSecondary(a, c) : b)
	},
	sortAlphaNumeric: function(a, c) {
		var b = Comparator.compareAlphaNumeric(a.v, c.v);
		return (((b == 0) && (this.secIndex != this.sIndex)) ? this.sortSecondary(a, c) : b)
	},
	sortSecondary: function(b, f) {
		var c = this.secIndex;
		if (!this.isValidCol(c)) {
			return
		}
		var a = this.rowData[b.key].data[c];
		var e = this.rowData[f.key].data[c];
		var d = 0;
		switch (this.colHeader[c].type) {
			case TYPE_STRING:
				d = Comparator.compareAlphaNumeric(a, e);
				break;
			case TYPE_DATE:
			case TYPE_NUMBER:
			case TYPE_NUM_PROGRESS:
				d = Comparator.compareNumeric(a, e);
				break;
			case TYPE_NUM_ORDER:
				d = Comparator.compareNumeric(a, e);
				if (d != 0) {
					if (a == -1) {
						d = 1
					} else {
						if (e == -1) {
							d = -1
						}
					}
				}
				break;
			case TYPE_CUSTOM:
				if (this.sortCustom) {
					d = this.sortCustom(c, this.rowData[b.key].data, this.rowData[f.key].data);
					break
				}
			default:
				d = Comparator.compare(a, e)
		}
		if (d == 0) {
			d = this.rowData[b.key].index - this.rowData[f.key].index
		}
		if (this.options.reverse) {
			d = -d
		}
		if (this.secRev) {
			d = -d
		}
		return d
	},
	getActiveRange: function() {
		var f = this.options.maxRows,
			g = 0,
			d = 0;
		if (this.options.mode == MODE_VIRTUAL) {
			g = (this.activeId.length > 0 ? (MATH_FLOOR(this.tBody.offsetTop / this.tb.rowheight) || 0) : 0).min(this.activeId.length - f).max(0)
		} else {
			g = f * this.curPage
		}
		d = (g + f - 1).min(this.activeId.length - 1).max(0);
		g = g.max(0);
		var a = this.activeId,
			h = this.rowData;
		var c = 0;
		for (var e = g; e <= d; ++e) {
			var j = h[a[e]];
			if (j && !(j.hidden || j.filtOut)) {
				++c
			}
		}
		for (var b = this.activeId.length - 1; c < f && d < b; ++d) {
			var j = h[a[d]];
			if (j && !(j.hidden || j.filtOut)) {
				++c
			}
		}
		return (this.activeRange = [g, d, c])
	},
	refreshRows: function() {
		if (this.__refreshRows_refreshing__) {
			return
		}
		this.__refreshRows_refreshing__ = true;
		this.refresh();
		var f = this.getActiveRange(),
			g = filtCount = 0,
			k = this.tb.body.childNodes,
			o = this.options.alternateRows;
		var b = this.activeId,
			l = this.rowData;
		for (var e = f[0], j = f[1]; e <= j; e++) {
			var a = b[e],
				n = l[a],
				m = k[g - filtCount];
			if (!(n && m)) {
				continue
			}
			n.rowIndex = g++ - filtCount;
			if (n.filtOut) {
				++filtCount;
				continue
			}
			var c = "",
				h = false;
			if (has(this.rowSel, a)) {
				c += "selected"
			}
			h = (c.test("selected") != m.hasClass("selected"));
			if (o) {
				if ((e - filtCount) & 1) {
					c += " odd";
					h = h || !m.hasClass("odd")
				} else {
					c += " even";
					h = h || !m.hasClass("even")
				}
			} else {
				h = h || m.hasClass("odd") || m.hasClass("even")
			}
			if (h) {
				m.className = c.clean()
			}
			var d = this.options.format(Array.clone(n.data));
			this.fillRow(m, d);
			m.setProperties({
				title: d[0],
				id: this.id + "-row-" + a
			}).show(true);
			this.setIcon(a, n.icon)
		}
		for (var e = g - filtCount, j = k.length; e < j; e++) {
			k[e].setProperty("id", "").hide()
		}
		if (Browser.ie && Browser.version <= 7) {
			this.outOfDOM(Function.from())
		}
		this.requiresRefresh = false;
		this.__refreshRows_refreshing__ = false
	},
	refresh: function() {
		if (this.isScrolling) {
			return
		}
		this.updatePageMenu();
		this.dHead.setStyle("width", this.dBody.clientWidth)
	},
	selectRow: function(l, n) {
		var b = n.id.replace(this.idprefix, "");
		if (!(l.isRightClick() && has(this.rowSel, b))) {
			var h = !!this.options.rowMultiSelect;
			var a = ((Browser.Platform.mac && l.meta) || (!Browser.Platform.mac && l.control));
			if (h && l.shift) {
				if (this.stSel === null) {
					this.stSel = b;
					this.rowSel[b] = 0;
					this.selectedRows.push(b)
				} else {
					var d = this.rowData[this.stSel].activeIndex;
					var c = this.rowData[b].activeIndex;
					var k = d.min(c);
					var e = d.max(c);
					this.selectedRows.empty();
					delete this.rowSel;
					this.rowSel = {};
					for (var g = k; g <= e; g++) {
						var m = this.activeId[g];
						this.rowSel[m] = this.selectedRows.length;
						this.selectedRows.push(m)
					}
				}
			} else {
				if (h && a) {
					this.stSel = b;
					if (has(this.rowSel, b)) {
						this.selectedRows.splice(this.rowSel[b], 1);
						for (var g = this.rowSel[b], f = this.selectedRows.length; g < f; g++) {
							this.rowSel[this.selectedRows[g]] = g
						}
						delete this.rowSel[b]
					} else {
						this.rowSel[b] = this.selectedRows.length;
						this.selectedRows.push(b)
					}
				} else {
					this.stSel = b;
					this.selectedRows.empty();
					delete this.rowSel;
					this.rowSel = {};
					this.rowSel[b] = 0;
					this.selectedRows.push(b)
				}
			}
			if (this.selectedRows.length == 0) {
				this.stSel = null
			}
			this.refreshSelection()
		}
		this.fireEvent.delay(0, this, ["onSelect", [l, b]])
	},
	addRow: function(d, e, b, c, a) {
		if (d.length != this.cols) {
			return
		}
		e = e || (1000 + this.rows);
		this.rowData[e] = {
			data: d,
			icon: b || "",
			hidden: c || false,
			index: -1,
			rowIndex: -1,
			activeIndex: -1
		};
		if ([a, true].pick()) {
			this._insertRow(e)
		}
		this.rows++
	},
	_insertRow: function(l, v) {
		var f = this.activeId;
		var m = this.sIndex;
		var e = this.options.reverse;
		var s = this.rowCache;
		var h = this.rowData;
		var b = h[l];
		var c;
		if (this.isValidCol(m)) {
			if (!v) {
				var t = {
					key: l,
					v: b.data[m]
				};
				var n = 0,
					p = s.length,
					k = b.index;
				var r = this.colHeader[m].type;
				var u = (TYPE_CUSTOM === r ? this.sortCustomWrap(m) : u = this.cmp[r]) || this.cmp.DEFAULT;
				if (k >= 0) {
					if ((k != 0) && (u(t, s[k - 1]) < 0)) {
						p = k + 1
					} else {
						if ((k < s.length - 1) && (u(t, s[k + 1]) > 0)) {
							n = k
						}
					}
				}
				c = s.binarySearch(t, u, n, p);
				if (c < 0) {
					c = -(c + 1)
				}
				if (c == k) {
					s[c].v = t.v;
					t = t.key = t.v = null
				} else {
					if (k >= 0) {
						if (k < c) {
							c--
						}
						s.splice(k, 1)
					}
					s.splice(c, 0, t);
					if (k == -1) {
						for (var q = c, o = s.length; q < o; q++) {
							h[s[q].key].index = q
						}
					} else {
						var d = k,
							a = c;
						if (c < k) {
							d = c;
							a = k
						}
						for (var q = d; q < p; q++) {
							h[s[q].key].index = q
						}
					}
				}
			}
			if (b.activeIndex != -1) {
				f.splice(b.activeIndex, 1);
				b.rowIndex = b.activeIndex = -1;
				for (var q = 0, o = f.length; q < o; q++) {
					h[f[q]].activeIndex = q
				}
				if (b.hidden) {
					this.requiresRefresh = true
				}
			}
			if (!b.hidden) {
				c = f.binarySearch(l, (e ? function(i, j) {
					return h[j].index - h[i].index
				} : function(i, j) {
					return h[i].index - h[j].index
				}));
				if (c < 0) {
					c = -(c + 1)
				}
				f.splice(c, 0, l);
				for (var q = c, o = f.length; q < o; q++) {
					h[f[q]].activeIndex = q
				}
				var g = (this.activeRange || this.getActiveRange());
				if ((g[0] <= c) && (c <= g[1])) {
					b.rowIndex = (c - g[0]);
					this.requiresRefresh = true
				}
			}
		} else {
			if (b.hidden) {
				c = b.activeIndex;
				if (c != -1) {
					b.activeIndex = -1;
					f.splice(c, 1);
					for (var q = c, o = f.length; q < o; q++) {
						h[f[q]].activeIndex = q
					}
					this.requiresRefresh = true
				}
			} else {
				if (b.activeIndex == -1) {
					c = b.activeIndex = f.length;
					f.push(l);
					var g = (this.activeRange || this.getActiveRange());
					if ((g[0] <= c) && (c <= g[1])) {
						this.requiresRefresh = true
					}
				}
			}
		}
		if (this.options.mode == MODE_PAGE) {
			this.pageCount = MATH_CEIL(f.length / this.options.maxRows)
		}
	},
	clearActive: function() {
		var d = this.activeId,
			c = this.rowData;
		for (var b = 0, a = this.activeId.length; b < a; b++) {
			c[d[b]].activeIndex = -1
		}
		this.activeId.empty()
	},
	requiresRefresh: false,
	fillRow: function(d, b) {
		var a = d.childNodes;
		var c = this.colHeader;
		this.colOrder.each(function(f, e) {
			switch (c[e].type) {
				case TYPE_DATE:
					a[f].set("text", (b[e] > 0 ? new Date(b[e]).toISOString() : ""));
					break;
				case TYPE_NUM_PROGRESS:
					a[f].set("html", "").grab(progressBar(parseFloat(b[e]) || 0));
					break;
				default:
					if (c[e].icon) {
						a[f].set("html", "").grab(simpleClone(DIV, false).grab(simpleClone(SPAN, false).set("class", "icon")).appendText(b[e]))
					} else {
						a[f].set("text", b[e])
					}
			}
		})
	},
	isDetached: false,
	detachBody: function() {
		if (this.isDetached) {
			return
		}
		this.tb.body.dispose();
		this.isDetached = true
	},
	attachBody: function() {
		if (!this.isDetached) {
			return
		}
		this.tBody.grab(this.tb.body);
		this.isDetached = false
	},
	removeRow: function(f) {
		var d = this.rowData[f],
			e;
		if (d == null) {
			return
		}
		if (e = $(f)) {
			e.setProperty("id", "")
		}
		var b = d.activeIndex;
		if (b != -1) {
			this.activeId.splice(b, 1);
			for (var c = b, a = this.activeId.length; c < a; c++) {
				this.rowData[this.activeId[c]].activeIndex = c
			}
			if (this.options.mode == MODE_PAGE) {
				this.pageCount = MATH_CEIL([this.activeId.visCount, this.activeId.length].pick() / this.options.maxRows);
				if (this.curPage > this.pageCount) {
					this.curPage--
				}
			}
			this.requiresRefresh = true
		}
		if (has(this.rowSel, f)) {
			b = this.rowSel[f];
			this.selectedRows.splice(b, 1);
			for (var c = b, a = this.selectedRows.length; c < a; c++) {
				this.rowSel[this.selectedRows[c]] = c
			}
			delete this.rowSel[f]
		}
		if (this.sIndex >= 0) {
			this.rowCache.splice(d.index, 1);
			for (var c = d.index, a = this.rowCache.length; c < a; c++) {
				this.rowData[this.rowCache[c].key].index = c
			}
		}
		if (this.stSel == f) {
			this.stSel = null
		}
		d = null;
		delete this.rowData[f];
		this.rows--;
		this.refresh()
	},
	clearRows: function(a) {
		if (this.rows <= 0) {
			return
		}
		this.stSel = null;
		this.clearCache();
		Array.each(this.tb.body.rows, function(b) {
			Array.each(b.cells, function(c) {
				c.set("html", "")
			});
			b.setProperty("id", "").hide()
		});
		delete this.rowData;
		this.rowData = {};
		this.rows = this.curPage = this.pageCount = 0;
		this.activeId.empty();
		if (!a) {
			this.resetScroll();
			this.resizePads();
			delete this.rowSel;
			this.rowSel = {};
			this.selectedRows.empty()
		}
		this.updatePageMenu()
	},
	calcRowHeight: function() {
		var a = simpleClone(this.rowModel, true);
		a.children[0].set("html", "&nbsp;");
		this.tb.body.appendChild(a);
		this.tb.rowheight = (a.getDimensions({
			computeSize: true
		}).totalHeight || a.getDimensions().height);
		a.destroy();
		return this.tb.rowheight
	},
	calcSize: function() {
		var c = (this.options.mode == MODE_PAGE);
		if (c) {
			this.pageChanger.show()
		} else {
			this.pageChanger.hide()
		}
		var e = !(c || this.options.refreshable);
		var a = (!e || this.filterShow);
		if (a) {
			this.infoBar.show();
			if (e) {
				(this.filterBar.setStyle("paddingLeft", "20px").getElement("a.filterbar-close").show())
			} else {
				(this.filterBar.setStyle("paddingLeft").getElement("a.filterbar-close").hide())
			}
		} else {
			this.infoBar.hide()
		}
		this.dBody.setStyles({
			height: (this.dCont.clientHeight - this.dHead.offsetHeight - (a ? this.infoBar.offsetHeight : 0)),
			width: (this.dCont.offsetWidth - 2).max(0)
		});
		this.dHead.setStyle("width", this.dBody.clientWidth);
		this.calcRowHeight();
		if (!this.isResizing) {
			for (var d = 0, b = this.cols; d < b; d++) {
				if (this.colData[d].hidden) {
					continue
				}
				var f = (this.tHeadCols[d].offsetWidth - parseInt(this.tHeadCols[d].style.width, 10)).max(0);
				this.tHeadCols[d].setStyle("width", (this.colData[d].width - f).max(f))
			}
		}
		this.tBody.setStyle("width", this.tHead.getWidth())
	},
	hideRow: function(a) {
		this.rowData[a].hidden = true;
		this.rowData[a].rowIndex = -1;
		this._insertRow(a, true)
	},
	unhideRow: function(a) {
		this.rowData[a].hidden = false;
		this._insertRow(a, true)
	},
	refreshSelection: function() {
		if (!this.options.rowsSelectable) {
			return
		}
		var d = this.idprefix;
		var c = this.tb.body.childNodes;
		for (var b = 0, a = c.length; b < a; ++b) {
			if (has(this.rowSel, c[b].id.replace(d, ""))) {
				c[b].addClass("selected")
			} else {
				c[b].removeClass("selected")
			}
		}
	},
	clearSelection: function(a) {
		if (this.selectedRows.length == 0) {
			return
		}
		this.selectedRows.empty();
		delete this.rowSel;
		this.rowSel = {};
		this.stSel = null;
		if (!a) {
			this.refreshSelection()
		}
	},
	fillSelection: function(d) {
		var f = this.activeId,
			c = this.rowData;
		this.selectedRows = [];
		for (var b = 0, a = f.length; b < a; ++b) {
			var e = c[f[b]];
			if (e && !(e.hidden || e.filtOut)) {
				this.selectedRows.push(f[b])
			}
		}
		for (var b = 0, a = this.selectedRows.length; b < a; ++b) {
			this.rowSel[this.selectedRows[b]] = b
		}
		if (!d) {
			this.refreshSelection()
		}
	},
	copySelection: function(b) {
		b = [b, "\t"].pick();
		var a = this.colOrder.map(function(c) {
			if (!this.colHeader[c].hidden) {
				return c
			}
		}, this).clean();
		return (a.map(function(c) {
			return this.colHeader[c].text
		}, this).join(b) + "\r\n" + this.getSortedSelection().map(function(d) {
			var c = Array.clone(this.rowData[d].data);
			return a.map(function(e) {
				return this.options.format(c, e)
			}, this).join(b)
		}, this).join("\r\n"))
	},
	getSortedSelection: function() {
		var a = Object.map(this.rowData, function(b) {
			return b.activeIndex
		});
		return Array.clone(this.selectedRows).sort(function(b, c) {
			if (a[b] < a[c]) {
				return -1
			}
			if (a[c] < a[b]) {
				return 1
			}
			return 0
		}, this)
	},
	matchFilter: function(d) {
		var c = this.rowData[d];
		if (!c) {
			return false
		}
		if (!this.filterQuery) {
			return true
		}
		for (var b = 0, a = this.colFilter.length; b < a; ++b) {
			if (String(c.data[this.colFilter[b]]).toLowerCase().indexOf(this.filterQuery) >= 0) {
				return true
			}
		}
		return false
	},
	applyFilter: function(b) {
		if (typeof(b) === "undefined") {
			b = this.filterQuery
		}
		if (!b) {
			this.resetFilter()
		} else {
			this.filterQuery = b.toLowerCase();
			var c = 0;
			var a = this.rowData;
			for (var e in a) {
				var d = a[e];
				if (d && !d.hidden) {
					d.filtOut = !this.matchFilter(e);
					if (!d.filtOut) {
						++c
					}
				}
			}
			this.activeId.visCount = c;
			this.refreshRows();
			this.resizePads()
		}
	},
	resetFilter: function() {
		this.filterQuery = null;
		var a = this.rowData;
		for (var c in a) {
			var b = a[c];
			if (b && !b.hidden) {
				b.filtOut = false
			}
		}
		this.activeId.visCount = this.activeId.length;
		this.refreshRows()
	},
	hideFilterBar: function() {
		this.filterShow = false;
		this.calcSize();
		this.filterBarQueryInput.blur();
		this.filterBarQueryInput.set("value", "");
		this.dBody.focus();
		try {
			document.activeElement = this.dBody
		} catch (a) {}
		this.resetFilter()
	},
	showFilterBar: function() {
		this.filterShow = true;
		this.calcSize();
		this.filterBarQueryInput.focus();
		this.filterBarQueryInput.select();
		try {
			document.activeElement = this.filterBarQueryInput
		} catch (a) {}
	},
	selectAll: function(a) {
		if (this.options.rowMultiSelect) {
			this.clearSelection();
			this.fillSelection();
			this.fireEvent("onSelect", a)
		}
	},
	unselectAll: function(a) {
		this.clearSelection();
		this.fireEvent("onSelect", a)
	},
	updateCell: function(b, d, e) {
		var i = this.rowData[b];
		if (i == null) {
			return
		}
		e = (e || i.data);
		var f = ((this.sIndex >= 0) && (d == this.sIndex));
		var c = ((i.data[d] != e[d]) && f);
		i.data[d] = e[d];
		if (f) {
			this._insertRow(b)
		}
		if (this.requiresRefresh || i.hidden || (i.rowIndex == -1) || !$(this.id + "-row-" + b)) {
			return c
		}
		var a = this.tb.body.childNodes[i.rowIndex],
			h = a.childNodes[this.colOrder[d]],
			g = this.options.format(Array.clone(e), d);
		switch (this.colHeader[d].type) {
			case TYPE_DATE:
				h.set("text", (g > 0 ? new Date(g).toISOString() : ""));
				break;
			case TYPE_NUM_PROGRESS:
				h.set("html", "").grab(progressBar(parseFloat(g) || 0));
				break;
			default:
				if (this.colHeader[d].icon) {
					h.set("html", "").grab(simpleClone(DIV, false).grab(simpleClone(SPAN, false).set("class", "icon")).appendText(g))
				} else {
					h.set("text", g)
				}
		}
		return c
	},
	setIcon: function(c, h) {
		var k = this.rowData[c];
		if (!k || (k.rowIndex < 0) || !$(this.id + "-row-" + c)) {
			return
		}
		var b = this.tb.body.childNodes[k.rowIndex];
		var a = b.childNodes;
		var e = b.retrieve("icon");
		var d;
		for (var f = 0, j = this.colIcon.length; f < j; ++f) {
			var g = this.colOrder[this.colIcon[f]];
			if (this.colHeader[this.colIcon[f]].icon) {
				a[g].removeClass(e).removeClass("stable-icon");
				if (d === undefined && !this.colHeader[f].hidden) {
					d = g
				}
			}
		}
		if (d === undefined || this.colHeader[d].hidden) {
			d = this.colOrder[0]
		}
		if (h) {
			h = h.trim();
			a[d].addClass("stable-icon").addClass(h)
		}
		b.store("icon", h);
		k.icon = h
	},
	resizeTo: function(a, c) {
		var b = {};
		if (typeof(a) !== "number" || a > 0) {
			b.width = a
		}
		if (typeof(c) !== "number" || c > 0) {
			b.height = c
		}
		this.isResizing = true;
		this.dCont.setStyles(b);
		this.calcSize();
		this.isResizing = false
	},
	scrollTo: function(h) {
		var g = this.activeId,
			e = this.rowData;
		var b = e[h];
		if (b && !(b.hidden || b.filtOut)) {
			var a = 0;
			for (var d = 0, c = g.length; d < c && g[d] != h; ++d) {
				var f = e[g[d]];
				if (f && !(f.hidden || f.filtOut)) {
					++a
				}
			}
			this.dBody.scrollTop = (a * this.tb.rowheight)
		}
	},
	colMenu: function(a) {
		ContextMenu.clear();
		this.colHeader.each(function(c, b) {
			var d = [c.text, this.toggleColumn.bind(this, b)];
			if (!c.hidden) {
				d.unshift(CMENU_CHECK)
			}
			ContextMenu.add(d)
		}, this);
		if (this.resetText) {
			ContextMenu.add([CMENU_SEP]);
			ContextMenu.add([this.resetText, (function() {
				this.fireEvent("onColReset");
				this.scrollEvent()
			}).bind(this)])
		}
		ContextMenu.show(a)
	},
	toggleColumn: function(a) {
		var b = !this.colHeader[a].hidden;
		this.setColumnHidden(this.colOrder[a], b);
		this.calcSize();
		this.fireEvent("onColToggle", [a, b]);
		this.refreshRows();
		return true
	},
	resizePads: function() {
		var a = false;
		this.noScrollEvent((function() {
			switch (this.options.mode) {
				case MODE_PAGE:
					this.dPad.setStyle("height", 0);
					this.tBody.setStyle("top", 0);
					break;
				case MODE_VIRTUAL:
					var b = this.tb.rowheight;
					var e = [this.activeId.visCount, this.activeId.length].pick() * b;
					var d = (this.options.maxRows * b).min(e);
					var f = this.dBody.scrollTop;
					var c = d - this.dBody.clientHeight;
					f -= (f % c);
					if (f + d > e) {
						f = e - d
					}
					f = f.max(0) || 0;
					a = !((this.__resizePads_prevTop__ === f) && (this.__resizePads_prevHeight__ === e));
					this.__resizePads_prevTop__ = f;
					this.__resizePads_prevHeight__ = e;
					this.dPad.setStyle("height", e);
					this.tBody.setStyles({
						paddingBottom: (e <= 0 ? 1 : undefined),
						top: f
					});
					break
			}
			if (a || this.requiresRefresh) {
				this.applyFilter()
			}
		}).bind(this));
		return a
	},
	resetScroll: function() {
		this.noScrollEvent((function() {
			this.lastScrollUp = false;
			++this.dBody.scrollTop;
			--this.dBody.scrollTop;
			this.dBody.scrollTop = this.lastScroll = 0;
			if (this.activeId.length > 0) {
				this.resizePads()
			}
		}).bind(this))
	},
	restoreScroll: function() {
		this.noScrollEvent((function() {
			if (this.activeId.length > 0) {
				this.resizePads()
			}++this.dBody.scrollTop;
			--this.dBody.scrollTop;
			this.dBody.scrollTop = this.lastScroll || 0
		}).bind(this))
	},
	keepScroll: function(a) {
		if (typeof(a) !== "function") {
			return
		}
		this.noScrollEvent((function() {
			var b = this.lastScrollUp;
			var c = this.dBody.scrollTop;
			a();
			this.lastScrollUp = b;
			this.dBody.scrollTop = this.lastScroll = c
		}).bind(this))
	},
	noScrollEvent: function(a) {
		if (typeof(a) !== "function") {
			return
		}
		if (this.__noScrollEvent_removed__) {
			a()
		} else {
			this.__noScrollEvent_removed__ = true;
			this.dBody.removeEvents("scroll", this.scrollEvent);
			a();
			this.dBody.addEvent("scroll", this.scrollEvent);
			this.__noScrollEvent_removed__ = false
		}
	},
	outOfDOM: function(a) {
		if (typeof(a) !== "function") {
			return
		}
		if (this.__outOfDOM_removed__) {
			a()
		} else {
			this.__outOfDOM_removed__ = true;
			this.dBody.dispose();
			a();
			this.dBody.inject(this.dCont);
			this.__outOfDOM_removed__ = false
		}
	},
	updatePageMenu: function() {
		if (this.options.mode != MODE_PAGE) {
			this.pageCount = 0
		} else {
			this.pageCount = MATH_CEIL([this.activeId.visCount, this.activeId.length].pick() / this.options.maxRows)
		}
		if (this.curPage >= this.pageCount) {
			this.curPage = this.pageCount - 1
		}
		if (this.curPage > 0) {
			this.pagePrev.removeClass("disabled")
		} else {
			this.pagePrev.addClass("disabled")
		}
		if (this.curPage < this.pageCount - 1) {
			this.pageNext.removeClass("disabled")
		} else {
			this.pageNext.addClass("disabled")
		}
		this.pageSelect.options.length = 0;
		this.pageSelect.set("html", "");
		if (this.pageCount <= 1) {
			this.pageSelect.disabled = true;
			return
		}
		this.pageSelect.disabled = false;
		for (var a = 0; a < this.pageCount; a++) {
			this.pageSelect.options[a] = new Option(a + 1, a);
			if (a == this.curPage) {
				this.pageSelect.options[a].selected = true
			}
		}
	},
	gotoPage: function(c) {
		if (this.curPage == c) {
			return
		}
		this.curPage = c;
		var a = this.getActiveRange();
		for (var b = a[0]; b <= a[1]; b++) {
			this.rowData[this.activeId[b]].rowIndex = -1
		}
		this.refreshRows()
	},
	prevPage: function() {
		if (this.curPage > 0) {
			this.gotoPage(this.curPage - 1)
		}
	},
	nextPage: function() {
		if (this.curPage < this.pageCount - 1) {
			this.gotoPage(this.curPage + 1)
		}
	}
});
var ColumnHandler = {
	check: function(e, b) {
		if (this.isResizing) {
			return
		}
		var a = e.page.x - b.getPosition().x;
		var d = this.colOrder[b.retrieve("index")];
		if ((a <= 4) && (d > 0)) {
			var c = d - 1;
			while (c >= 0 && this.colData[c].hidden) {
				--c
			}
			if (c >= 0) {
				a += b.offsetWidth;
				d = c
			}
		}
		if (a >= b.offsetWidth - 6) {
			this.hotCell = d;
			b.setStyle("cursor", "e-resize")
		} else {
			this.hotCell = -1;
			b.setStyle("cursor", "default")
		}
	},
	start: function initColAct(c, d) {
		c.cancelSort = true;
		if (c.hotCell != -1) {
			var b = c.tHeadCols[c.hotCell];
			var a = b.getWidth();
			var e = b.getPosition(c.dCont).x + a + c.dBody.scrollLeft;
			c.resizeCol = {
				width: b.getStyle("width").toInt(),
				left: e
			};
			d.value.now.x = e;
			d.mouse.pos.x = d.mouse.start.x - e;
			c.cancelMove = true;
			c.isResizing = true;
			c.colDragEle = d.element;
			d.limit.x = [];
			d.options.limit = true
		} else {
			var e = d.element.getPosition(c.dCont).x + c.dBody.scrollLeft - ((Browser.firefox && Browser.version >= 3) ? 4 : 0);
			d.value.now.x = e;
			d.mouse.pos.x = d.mouse.start.x - e;
			c.colDragObj.set("html", d.element.get("text")).setStyles({
				visibility: "visible",
				left: e,
				width: d.element.getStyle("width").toInt(),
				textAlign: d.element.getStyle("textAlign")
			});
			c.colDragEle = d.element;
			d.element = d.handle = c.colDragObj;
			c.cancelMove = false;
			c.colMove = {
				from: c.colDragEle.retrieve("index"),
				to: -1
			};
			document.body.setStyle("cursor", "move")
		}
	},
	drag: function(c, e) {
		if (c.cancelMove) {
			var f = c.tHeadCols[c.hotCell];
			var b = e.value.now.x - c.resizeCol.left + c.resizeCol.width + (f.offsetWidth - parseInt(f.style.width, 10));
			e.limit.x[0] = f.getPosition(c.dCont).x + c.dBody.getScrollLeft();
			c.setColumnWidth(c.hotCell, b);
			$(document.body).setStyle("cursor", "e-resize")
		} else {
			var d = 0,
				a = e.mouse.now.x;
			while ((d < c.cols) && (c.colData[d].hidden || ((c.tHeadCols[d].getLeft() + (c.tHeadCols[d].getWidth() / 2)) < a))) {
				++d
			}
			if (d >= c.cols) {
				d = c.cols;
				c.colSep.setStyle("left", c.tHeadCols[d - 2].offsetLeft + c.tHeadCols[d - 2].getWidth() - 1)
			} else {
				c.colSep.setStyle("left", c.tHeadCols[d].offsetLeft)
			}
			c.colSep.setStyle("visibility", "visible");
			c.colMove.to = d
		}
	},
	end: function(a, b) {
		b.element = b.handle = a.colDragEle;
		a.colDragEle = null;
		if (a.isResizing) {
			a.isResizing = false;
			a.fireEvent("onColResize");
			document.body.setStyle("cursor", "default");
			b.options.limit = false
		} else {
			a.colDragObj.setStyles({
				left: 0,
				width: 0,
				visibility: "hidden"
			});
			a.colSep.setStyle("visibility", "hidden");
			document.body.setStyle("cursor", "default");
			a.setColumnPosition(a.colMove.from, a.colMove.to);
			a.cancelSort = false;
			a.fireEvent("onColMove")
		}
		a.cancelSort = false
	}
};
var Comparator = {
	compare: function(d, f) {
		var e = "" + d,
			c = "" + f;
		return (e < c) ? -1 : (e > c) ? 1 : 0
	},
	compareNumeric: function(a, b) {
		return (parseFloat(a) - parseFloat(b))
	},
	compareAlphaNumeric: function(d, f) {
		var e = ("" + d).toLowerCase(),
			c = ("" + f).toLowerCase();
		return (e < c) ? -1 : (e > c) ? 1 : 0
	}
};
