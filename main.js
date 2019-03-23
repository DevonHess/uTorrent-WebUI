var g_winTitle = "\u00B5Torrent WebUI v" + CONST.VERSION;
var g_perSec;
var g_dayCodes;
var g_dayNames;
var g_schLgndEx;
var g_feedItemQlty = [
	["?", CONST.RSSITEMQUALITY_NONE],
	["DSRip", CONST.RSSITEMQUALITY_DSRIP],
	["DVBRip", CONST.RSSITEMQUALITY_DVBRIP],
	["DVDR", CONST.RSSITEMQUALITY_DVDR],
	["DVDRip", CONST.RSSITEMQUALITY_DVDRIP],
	["DVDScr", CONST.RSSITEMQUALITY_DVDSCR],
	["HDTV", CONST.RSSITEMQUALITY_HDTV],
	["HR.HDTV", CONST.RSSITEMQUALITY_HRHDTV],
	["HR.PDTV", CONST.RSSITEMQUALITY_HRPDTV],
	["PDTV", CONST.RSSITEMQUALITY_PDTV],
	["SatRip", CONST.RSSITEMQUALITY_SATRIP],
	["SVCD", CONST.RSSITEMQUALITY_SVCD],
	["TVRip", CONST.RSSITEMQUALITY_TVRIP],
	["WebRip", CONST.RSSITEMQUALITY_WEBRIP],
	["720p", CONST.RSSITEMQUALITY_720P],
	["1080i", CONST.RSSITEMQUALITY_1080I],
	["1080p", CONST.RSSITEMQUALITY_1080P]
];
var ELE_TD = new Element("td");
var ELE_TR = new Element("tr");
window.addEvent("domready", function() {
	try {
		$(document.body);
		setupGlobalEvents();
		setupUserInterface();
		utWebUI.init()
	} catch (a) {
		Overlay.err(a)
	}
});
var __executed_setupGlobalEvents__;

function setupGlobalEvents() {
	if (__executed_setupGlobalEvents__) {
		return
	}
	__executed_setupGlobalEvents__ = true;
	Overlay.init("overlay");
	window.addEvent("resize", resizeUI);
	if (!isGuest) {
		document.body.onhashchange = function() {
			utWebUI.addHashURL();
		}
	}
	if (!isGuest) {
		window.addEvent("unload", function() {
			utWebUI.saveConfig(false)
		})
	}
	if (!isGuest) {
		document.addStopEvents({
			dragenter: null,
			dragover: null,
			drop: function(g) {
				var f = g.event.dataTransfer;
				if (!f) {
					return
				}
				var h;
				if ((h = f.getData("Text"))) {
					h = h.split(/[\r\n]+/g).map(String.trim);
					utWebUI.addURL({
						url: h
					})
				}
				if ((h = f.files) && h.length > 0) {
					utWebUI.addFile({
						file: h
					})
				}
			}
		})
	}
	var e = function(h) {
		var g = h.target,
			f = g.tagName.toLowerCase();
		return (g.retrieve("mousewhitelist") || ("textarea" === f) || (("input" === f) && !g.disabled && ["text", "file", "password"].contains(g.type.toLowerCase())) || (("select" === f) && !h.isRightClick()))
	};
	var a = function(f) {
		return !f.isRightClick() || e(f)
	};
	window.addStopEvent("mousedown", e);
	document.addStopEvents({
		mousedown: function(f) {
			ContextMenu.hide();
			return a(f)
		},
		contextmenu: e,
		mouseup: a,
		click: a
	});
	if (Browser.opera && !("oncontextmenu" in document.createElement("foo"))) {
		var c;
		document.addEvents({
			mousedown: function(f) {
				if (!c && f.isRightClick()) {
					var g = f.target.ownerDocument;
					c = g.createElement("input");
					c.type = "button";
					c.style.cssText = "z-index:1000;position:fixed;top:" + (f.client.y - 2) + "px;left:" + (f.client.x - 2) + "px;width:5px;height:5px;opacity:0.01";
					(g.body || g.documentElement).appendChild(c)
				}
			},
			mouseup: function(f) {
				if (c) {
					c.destroy();
					c = undefined
				}
			}
		})
	}
	if (!isGuest) {
		var b = {
			"ctrl a": Function.from(),
			"ctrl e": Function.from(),
			"ctrl f": Function.from(),
			"ctrl o": utWebUI.showAddTorrent.bind(utWebUI),
			"ctrl p": utWebUI.showSettings.bind(utWebUI),
			"ctrl u": utWebUI.showAddURL.bind(utWebUI),
			f1: utWebUI.showManual.bind(utWebUI),
			f2: utWebUI.showAbout.bind(utWebUI),
			f4: utWebUI.toggleToolbar.bind(utWebUI),
			f6: utWebUI.toggleDetPanel.bind(utWebUI),
			f7: utWebUI.toggleCatPanel.bind(utWebUI),
			esc: function() {
				if (!ContextMenu.hidden) {
					ContextMenu.hide()
				} else {
					if (DialogManager.showing.length > 0) {
						DialogManager.hideTopMost(true)
					} else {
						utWebUI.showResetUI()
					}
				}
			}
		};
		var d = {
			esc: 1
		};
		if (Browser.Platform.mac) {
			ctrlToMeta(b)
		}
		document.addStopEvent("keydown", function(g) {
			var f = eventToKey(g);
			if (b[f]) {
				if (!DialogManager.modalIsVisible() || d[f]) {
					b[f]()
				}
			} else {
				return true
			}
		});
		if (Browser.opera) {
			document.addEvent("keypress", function(f) {
				return !b[eventToKey(f)]
			})
		}
	}
}
var __resizeUI_ready__ = false;

function resizeUI(f, j) {
	if (!__resizeUI_ready__) {
		return
	}
	__resizeUI_ready__ = false;
	if (!ContextMenu.hidden) {
		ContextMenu.hide()
	}
	var m = (typeOf(f) == "number"),
		b = (typeOf(j) == "number");
	var q = window.getZoomSize(),
		D = q.x,
		d = q.y;
	var C = utWebUI.config || utWebUI.defConfig,
		l = utWebUI.limits,
		g = l.minHSplit,
		r = l.minVSplit,
		w = l.minTrtH,
		h = l.minTrtW;
	var t = (Browser.ie && Browser.version <= 6);
	var u = C.showCategories,
		p = C.showDetails,
		o = C.showStatusBar,
		B,
		v = true,
		wide = false;
	if (!isGuest) {
		B = C.showToolbar;
		v = !!utWebUI.settings["gui.tall_category_list"]
		wide = !!utWebUI.settings["gui.wide_toolbar"]
	}
	var k = $("mainToolbar");
	var e = (B ? k.getHeight() : 0);
	if (B) {
		var z = k.getElements(".tbbutton");
		var a = false;
		for (var y = z.length - 1; y >= 0; --y) {
			if (z[y].getPosition().y > e) {
				a = true;
				break
			}
		}
		if (a) {
			$("tbchevron").show()
		} else {
			$("tbchevron").hide()
		}
	}
	var x = (o ? $("mainStatusBar").getHeight() : 0);
	if (m) {
		f -= 2;
		if (f < g) {
			f = g
		} else {
			if (f > D - h) {
				f = D - h
			}
		}
	} else {
		f = 0;
		if (u) {
			f = C.hSplit;
			if ((typeOf(f) != "number") || (f < g)) {
				f = l.defHSplit
			}
		}
	}
	if (b) {
		j += x - 2;
		if (j > d - r) {
			j = d - r
		} else {
			if (j < e + w) {
				j = e + w
			}
		}
	} else {
		j = 0;
		if (p) {
			j = C.vSplit;
			if ((typeOf(j) != "number") || (j < r)) {
				j = l.defVSplit
			}
		}
		j = d - j
	}
	var c = D - (f + 2 + (u ? 5 : 0)) - (t ? 1 : 0),
		s = j - (e + x) - (!p ? 2 : 0) - (t ? 1 : 0);
	if (u) {
		$("mainCatList").show();
		if (c < h) {
			f -= h - c;
			if (f < g) {
				$("mainCatList").hide();
				u = false;
				c = D - 2
			} else {
				c = h
			}
		}
	}
	if (p) {
		$("mainInfoPane").show();
		if (s < w) {
			j += w - s;
			if (j > d - r) {
				$("mainInfoPane").hide();
				p = false;
				s = d - e - x - 2
			} else {
				s = w
			}
		}
	}
	if (u) {
		if (f) {
			$("mainCatList").setStyle("width", f - (t ? 2 : 0))
		}
		if (wide) {
			if ($("mainToolbar")) {
				document.body.insertBefore($("mainToolbar"), $("mainCatList"));
			}
			if (v) {
				$("mainCatList").setStyle("height", d - e - x - 2)
			} else {
				if (s) {
					$("mainCatList").setStyle("height", s)
				}
			}
		} else {
			if ($("mainToolbar")) {
				document.body.insertBefore($("mainCatList"), $("mainToolbar"));
			}
			if (v) {
				$("mainCatList").setStyle("height", d - x - 2)
			} else {
				if (s) {
					$("mainCatList").setStyle("height", s + e)
				}
			}
		}
	}
	if (p) {
		var n = D - (u && v ? f + 5 : 0);
		if (j) {
			var A = d - j - $("mainInfoPane-tabs").getSize().y - (o ? 1 : 0) - 14;
			$("mainInfoPane-content").setStyles({
				width: n - 8,
				height: A
			});
			$("mainInfoPane-generalTab").setStyles({
				width: n - 10,
				height: A - 2
			});
			utWebUI.spdGraph.resizeTo(n - 8, A);
			$("mainInfoPane-loggerTab").setStyles({
				width: n - 14,
				height: A - 6
			});
			utWebUI.traTable.resizeTo(n - 10, A - 2);
			utWebUI.flsTable.resizeTo(n - 10, A - 2)
		}
	}
	if ($("mainHDivider")) {
		$("mainHDivider").setStyles({
			height: v ? d - e - x : s + 2,
			left: u ? f + 2 : -10,
			top: e
		})
	}
	if ($("mainVDivider")) {
		$("mainVDivider").setStyles({
			width: v && u ? D - (f + 5) : D,
			left: v && u ? f + 5 : 0,
			top: p ? j - x + 2 : -10
		})
	}
	if (f && u && m) {
		C.hSplit = f
	}
	if (j && p && b) {
		C.vSplit = (d - j)
	}
	utWebUI.trtTable.resizeTo(c, s);
	if (!t) {
		utWebUI.trtTable.resizeTo(undefined, s)
	}
	__resizeUI_ready__ = true
}
var __executed_setupUserInterface__;

function setupUserInterface() {
	if (__executed_setupUserInterface__) {
		return
	}
	__executed_setupUserInterface__ = true;
	document.title = g_winTitle;
	$("cat_find").addEvent("mousedown", function(i) {
		$("query").focus();
	});
	$("feed_all").addEvent("mousedown", function(i) {
		if (!i.rightClick) {
			utWebUI.showRSSDownloader();
		}
		i.target = $("rssfeed_all");
		utWebUI.feedListClick.delay(0, utWebUI, i);
	});
	["mainCatList-categories", "mainCatList-labels"].each(function(h) {
		$(h).addEvent("mousedown", function(i) {
			utWebUI.catListClick(i, h)
		})
	});
	utWebUI.trtTable.create("mainTorList", utWebUI.trtColDefs, Object.append({
		format: utWebUI.trtFormatRow.bind(utWebUI),
		sortCustom: utWebUI.trtSortCustom.bind(utWebUI),
		onColReset: utWebUI.trtColReset.bind(utWebUI),
		onColResize: utWebUI.trtColResize.bind(utWebUI),
		onColMove: utWebUI.trtColMove.bind(utWebUI),
		onColToggle: utWebUI.trtColToggle.bind(utWebUI),
		onKeyDown: function(h) {
			switch (eventToKey(h)) {
				case "alt enter":
					utWebUI.showProperties();
					break;
				case "shift delete":
				case "delete":
					utWebUI.removeDefault(h.shift);
					break
			}
		},
		onSort: utWebUI.trtSort.bind(utWebUI),
		onSelect: utWebUI.trtSelect.bind(utWebUI),
		onDblClick: utWebUI.trtDblClk.bind(utWebUI)
	}, utWebUI.defConfig.torrentTable));
	utWebUI.mainTabs = new Tabs("mainInfoPane-tabs", {
		tabs: {
			"mainInfoPane-generalTab": "",
			"mainInfoPane-trackersTab": "",
			"mainInfoPane-filesTab": "",
			"mainInfoPane-speedTab": "",
			"mainInfoPane-loggerTab": ""
		},
		onChange: utWebUI.detPanelTabChange.bind(utWebUI)
	}).draw().show("mainInfoPane-generalTab");
	$$("#mainInfoPane-generalTab td").addEvent("mousedown", function(j) {
		if (!j.isRightClick()) {
			return
		}
		var h = j.target;
		if (h.tagName.toLowerCase() !== "td") {
			h = h.getParent("td")
		}
		if (h) {
			var i = h.getElement("span");
			if (i) {
				j.target = i;
				utWebUI.showGeneralMenu(j)
			}
		}
	});
	utWebUI.traTable.create("mainInfoPane-trackersTab", utWebUI.traColDefs, Object.append({
		format: utWebUI.traFormatRow.bind(utWebUI),
		onColReset: utWebUI.traColReset.bind(utWebUI),
		onColResize: utWebUI.traColResize.bind(utWebUI),
		onColMove: utWebUI.traColMove.bind(utWebUI),
		onColToggle: utWebUI.traColToggle.bind(utWebUI),
		onSort: utWebUI.traSort.bind(utWebUI),
		onSelect: utWebUI.traSelect.bind(utWebUI)
	}, utWebUI.defConfig.peerTable));
	$("mainInfoPane-trackersTab").addEvent("mousedown", function(h) {
		if (h.isRightClick() && h.target.hasClass("stable-body")) {
			utWebUI.showProperties(h)
		}
	});
	utWebUI.flsTable.create("mainInfoPane-filesTab", utWebUI.flsColDefs, Object.append({
		format: utWebUI.flsFormatRow.bind(utWebUI),
		onColReset: utWebUI.flsColReset.bind(utWebUI),
		onColResize: utWebUI.flsColResize.bind(utWebUI),
		onColMove: utWebUI.flsColMove.bind(utWebUI),
		onColToggle: utWebUI.flsColToggle.bind(utWebUI),
		onSort: utWebUI.flsSort.bind(utWebUI),
		onSelect: utWebUI.flsSelect.bind(utWebUI),
		onDblClick: utWebUI.flsDblClk.bind(utWebUI)
	}, utWebUI.defConfig.fileTable));
	utWebUI.spdGraph.create("mainInfoPane-speedTab");
	Logger.init("mainInfoPane-loggerTab");
	$("mainInfoPane-loggerTab").addEvent("mousedown", function(h) {
		h.target.store("mousewhitelist", true)
	});
	new Drag("mainHDivider", {
		modifiers: {
			x: "left",
			y: ""
		},
		onDrag: function() {
			resizeUI(this.value.now.x, null)
		},
		onComplete: function() {
			if (Browser.opera) {
				utWebUI.saveConfig(true)
			}
		}
	});
	new Drag("mainVDivider", {
		modifiers: {
			x: "",
			y: "top"
		},
		onDrag: function() {
			resizeUI(null, this.value.now.y)
		},
		onComplete: function() {
			if (Browser.opera) {
				utWebUI.saveConfig(true)
			}
		}
	});
	__resizeUI_ready__ = true;
	if (isGuest) {
		resizeUI();
		return
	}
	var c = Browser.ie ? "click" : "change";
	utWebUI.updateToolbar();
	["add", "addurl", "remove", "start", "pause", "stop", "queueup", "queuedown", "rssdownloader", "setting"].each(function(h) {
		$(h).addStopEvent("click", function(j) {
			if (j.target.hasClass("disabled")) {
				return
			}
			var i;
			switch (h) {
				case "add":
					utWebUI.showAddTorrent();
					break;
				case "addurl":
					utWebUI.showAddURL();
					break;
				case "rssdownloader":
					utWebUI.showRSSDownloader();
					break;
				case "setting":
					utWebUI.showSettings();
					break;
				case "remove":
					utWebUI.removeDefault(j.shift);
					break;
				case "queueup":
				case "queuedown":
					i = j.shift;
				default:
					utWebUI[h](i)
			}
		})
	});
	$("tbchevron").addStopEvents({
		mousedown: function(h) {
			utWebUI.toolbarChevronShow(this)
		},
		click: null
	});
	$("query").addEvent("keydown", function(h) {
		if (h.key == "enter") {
			utWebUI.searchExecute()
		}
	});
	$("search").addStopEvents({
		mousedown: function(h) {
			if (h.isRightClick()) {
				utWebUI.searchMenuShow(this)
			}
		},
		click: function(h) {
			utWebUI.searchExecute()
		}
	});
	$("searchsel").addStopEvents({
		mousedown: function(h) {
			utWebUI.searchMenuShow(this)
		},
		click: null
	});
	DialogManager.init();
	["Manual", "About", "Add", "AddEditRSSFeed", "AddURL", "Props", "ResetUI", "RSSDownloader", "Settings"].each(function(h) {
		var i = ["AddEditRSSFeed", "Props", "ResetUI"].contains(h);
		DialogManager.add(h, i, {
			Add: function() {
				utWebUI.getDirectoryList()
			},
			AddURL: function() {
				utWebUI.getDirectoryList()
			},
			RSSDownloader: function() {
				utWebUI.rssDownloaderShow(true)
			},
			Settings: function() {
				utWebUI.stpanes.onChange()
			}
		}[h])
	});
	$("dlgManual-iframe").onload = function() {
		$("dlgManual-head").innerHTML = $("dlgManual-iframe").contentWindow.document.title;
	}
	$("MANUAL_OPEN").addEvent("click", function() {
		openURL($("dlgManual-iframe").contentWindow.location.href)
		DialogManager.hide("Manual")
	});
	$("MANUAL_CLOSE").addEvent("click", function() {
		DialogManager.hide("Manual")
	});
	$("RESET_UI_OK").addEvent("click", function() {
		utWebUI.resetUI();
		DialogManager.hide("ResetUI")
	});
	$("RESET_UI_CANCEL").addEvent("click", function(h) {
		DialogManager.hide("ResetUI")
	});
	$("dlgResetUI-form").addEvent("submit", Function.from(false));
	$("dlgResetUI-everything").addEvent(c, function() {
		_link(this, 0, ["dlgResetUI-interface", "dlgResetUI-grid", "dlgResetUI-cookie", "dlgResetUI-extra"], null, true)
	}).fireEvent(c);
	$("DLG_ADDEDITRSSFEED_01").addEvent("click", function() {
		utWebUI.feedAddEditOK();
		DialogManager.hide("AddEditRSSFeed")
	});
	$("DLG_ADDEDITRSSFEED_02").addEvent("click", function(h) {
		DialogManager.hide("AddEditRSSFeed")
	});
	$("dlgAddEditRSSFeed-form").addEvent("submit", Function.from(false));
	$("aerssfd-cookieDetect").addEvent("click", function(i) {
		var h = utWebUI.retrieveURLCookie($("aerssfd-url").get("value").trim());
		if (h) {
			$("aerssfd-cookie").set("value", h)
		}
	});
	$("aerssfd-use_custom_alias").addEvent(c, function() {
		_link(this, 0, ["aerssfd-custom_alias"])
	});
	$("aerssfd-subscribe_0").addEvent("click", function() {
		_link(this, 0, ["aerssfd-smart_ep"], null, true)
	}).fireEvent("click");
	$("aerssfd-subscribe_1").addEvent("click", function() {
		_link(this, 0, ["aerssfd-smart_ep"])
	});
	$("ADD_FILE_OK").addEvent("click", function() {
		var h = $("dlgAdd-basePath").value || 0;
		var i = encodeURIComponent($("dlgAdd-subPath").get("value"));
		$("dlgAdd-form").set("action", "about:blank").submit()
		utWebUI.addFile({
			"file": $("dlgAdd-file").files
		}, h, i);
	});
	$("ADD_FILE_CANCEL").addEvent("click", function(h) {
		DialogManager.hide("Add")
	});
	var b = new IFrame({
		id: "uploadfrm",
		src: "about:blank",
		styles: {
			display: "none",
			height: 0,
			width: 0
		},
		onload: function(i) {
			$("dlgAdd-file").set("value", "");
			$("ADD_FILE_OK").disabled = false;
			if (!i) {
				return
			}
			var j = $(i.body).get("text");
			if (j) {
				var h = JSON.decode(j);
				if (has(h, "error")) {
					alert(h.error);
					log("[Add Torrent File Error] " + h.error)
				}
			}
		}
	}).inject(document.body);
	$("dlgAdd-form").set("target", b.get("id"));
	$("ADD_URL_OK").addEvent("click", function() {
		if ($("dlgAddURL-url").get("value").trim().length > 0) {
			DialogManager.hide("AddURL");
			var h = {
				url: $("dlgAddURL-url").get("value"),
				cookie: $("dlgAddURL-cookie").get("value"),
				dir: $("dlgAddURL-basePath").value,
				sub: $("dlgAddURL-subPath").get("value")
			};
			utWebUI.addURL(h, function() {
				$("dlgAddURL-url").set("value", "");
				$("dlgAddURL-cookie").set("value", "")
			})
		}
	});
	$("ADD_URL_CANCEL").addEvent("click", function(h) {
		DialogManager.hide("AddURL")
	});
	$("dlgAddURL-cookieDetect").addEvent("click", function(i) {
		var h = utWebUI.retrieveURLCookie($("dlgAddURL-url").get("value").trim());
		if (h) {
			$("dlgAddURL-cookie").set("value", h)
		}
	});
	$("dlgAddURL-form").addEvent("submit", Function.from(false));
	$("DLG_TORRENTPROP_01").addEvent("click", function() {
		DialogManager.hide("Props");
		utWebUI.setProperties()
	});
	$("DLG_TORRENTPROP_02").addEvent("click", function(h) {
		$("dlgProps").getElement(".dlg-close").fireEvent("click", h)
	});
	$("dlgProps").getElement(".dlg-close").addEvent("click", function(h) {
		if (utWebUI.propID == "multi") {
			[11, 17, 18, 19].each(function(i) {
				$("DLG_TORRENTPROP_1_GEN_" + i).removeEvents("click")
			})
		}
		this.propID = ""
	});
	$("dlgProps-form").addEvent("submit", Function.from(false));
	$("DLG_RSSDOWNLOADER_01").addEvent("click", function(h) {
		DialogManager.hide("RSSDownloader")
	});
	$("dlgRSSDownloader-feedsMenu").addEvent("mousedown", function(h) {
		utWebUI.feedListClick.delay(0, utWebUI, h)
	});
	utWebUI.rssfdTable.create("dlgRSSDownloader-feedItemList", utWebUI.fdColDefs, Object.append({
		format: utWebUI.fdFormatRow.bind(utWebUI),
		onColReset: utWebUI.fdColReset.bind(utWebUI),
		onColResize: utWebUI.fdColResize.bind(utWebUI),
		onColMove: utWebUI.fdColMove.bind(utWebUI),
		onColToggle: utWebUI.fdColToggle.bind(utWebUI),
		onSort: utWebUI.fdSort.bind(utWebUI),
		onSelect: utWebUI.fdSelect.bind(utWebUI),
		onDblClick: utWebUI.fdDblClk.bind(utWebUI)
	}, utWebUI.defConfig.feedTable));
	var a = $("dlgRSSDownloader-content").getDimensions({
		computeSize: true
	});
	utWebUI.rssfdTable.resizeTo(a.x - 15, a.y - 2);
	$("dlgRSSDownloader-filtersMenu").addEvent("mousedown", function(h) {
		utWebUI.rssfilterListClick.delay(0, utWebUI, h)
	}).addEvent(c, function(h) {
		utWebUI.rssfilterCheckboxClick(h)
	});
	$("dlgRSSDownloader-filterSettings").getElements("input, select").addEvent("change", function(h) {
		utWebUI.rssfilterEdited(h)
	});
	$("rssfilter_edit_apply").addStopEvent("click", function(h) {
		utWebUI.rssfilterEditApply()
	});
	$("rssfilter_edit_cancel").addStopEvent("click", function(h) {
		utWebUI.rssfilterEditCancel()
	});
	$("rssfilter_quality").addStopEvent("mousedown", function(h) {
		utWebUI.rssfilterQualityClick(h)
	});
	$("rssfilter_episode_enable").addEvent(c, function() {
		_link(this, 0, ["rssfilter_episode"])
	});
	utWebUI.rssDownloaderTabs = new Tabs("dlgRSSDownloader-tabs", {
		tabs: {
			"dlgRSSDownloader-feedsTab": "",
			"dlgRSSDownloader-filtersTab": ""
		},
		onChange: utWebUI.rssDownloaderTabChange.bind(utWebUI)
	}).draw().show("dlgRSSDownloader-feedsTab");
	$("DLG_SETTINGS_03").addEvent("click", function() {
		DialogManager.hide("Settings");
		utWebUI.setSettings()
	});
	$("DLG_SETTINGS_04").addEvent("click", function(h) {
		$("dlgSettings").getElement(".dlg-close").fireEvent("click", h)
	});
	$("DLG_SETTINGS_05").addEvent("click", function(h) {
		utWebUI.setSettings()
	});
	$("dlgSettings").getElement(".dlg-close").addEvent("click", function(h) {
		utWebUI.loadSettings()
	});
	$("dlgSettings-form").addEvent("submit", Function.from(false));
	utWebUI.stpanes = new Tabs("dlgSettings-menu", {
		tabs: {
			"dlgSettings-General": "",
			"dlgSettings-UISettings": "",
			"dlgSettings-Directories": "",
			"dlgSettings-Connection": "",
			"dlgSettings-Bandwidth": "",
			"dlgSettings-BitTorrent": "",
			"dlgSettings-TransferCap": "",
			"dlgSettings-Queueing": "",
			"dlgSettings-Scheduler": "",
			"dlgSettings-Remote": "",
			"dlgSettings-Advanced": "",
			"dlgSettings-UIExtras": "",
			"dlgSettings-DiskCache": "",
			"dlgSettings-WebUI": "",
			"dlgSettings-RunProgram": "",
			"dlgSettings-CookieManager": "",
		},
		lazyshow: true,
		onChange: utWebUI.settingsPaneChange.bind(utWebUI)
	}).draw().show("dlgSettings-WebUI");
	var f = [];
	$each(LANG_LIST, function(i, h) {
		f.push({
			lang: i,
			code: h
		})
	});
	f.sort(function(h, i) {
		return (h.lang < i.lang ? -1 : (h.lang > i.lang ? 1 : 0))
	});
	var e = $("webui.lang");
	e.options.length = f.length;
	Array.each(f, function(i, h) {
		e.options[h] = new Option(i.lang, i.code, false, false)
	});
	e.set("value", utWebUI.defConfig.lang);
	$("DLG_SETTINGS_4_CONN_04").addEvent("click", function() {
		var h = utWebUI.settings.bind_port,
			i = 0;
		do {
			i = (Math.random() * 50000).toInt() + 15000
		} while (h == i);
		$("bind_port").set("value", i)
	});
	$("enable_bw_management").addEvent("click", function() {
		utWebUI.setAdvSetting("bt.transp_disposition", (this.checked ? utWebUI.settings["bt.transp_disposition"] | CONST.TRANSDISP_UTP : utWebUI.settings["bt.transp_disposition"] & ~CONST.TRANSDISP_UTP))
	});
	$("multi_day_transfer_limit_span").addEvent("change", function() {
		utWebUI.getTransferHistory()
	});
	$("DLG_SETTINGS_7_TRANSFERCAP_12").addEvent("click", function() {
		utWebUI.resetTransferHistory()
	});
	$("sched_table").addEvent("change", function() {
		var h = (utWebUI.settings.sched_table || "").pad(7 * 24, "0").substring(0, 7 * 24);
		var l = new Element("tbody");
		var o = false;
		var p = 0;
		for (var m = 0; m < 7; m++) {
			var n = ELE_TR.clone(false);
			for (var k = 0; k < 25; k++) {
				var q = ELE_TD.clone(false);
				if (k == 0) {
					if ($chk(g_dayCodes)) {
						q.set("text", g_dayCodes[m]).addClass("daycode")
					}
				} else {
					(function() {
						var i = m * 24 + k - 1;
						q.set("class", "block mode" + h.substr(i, 1)).addEvents({
							mousedown: function() {
								if (!o && $("sched_enable").checked) {
									for (var j = 0; j <= 3; j++) {
										if (this.hasClass("mode" + j)) {
											p = (j + 1) % 4;
											this.set("class", "block mode" + p);
											h = h.substring(0, i) + p + h.substring(i + 1);
											break
										}
									}
									o = true
								}
								return false
							},
							mouseup: function() {
								if ($("sched_enable").checked) {
									$("sched_table").set("value", h)
								}
								o = false
							},
							mouseenter: function() {
								var r = Math.floor(i / 24),
									j = (i % 24);
								$("sched_table_info").set("text", g_dayNames[r] + ", " + j + ":00 - " + j + ":59");
								if ($("sched_enable").checked && o && !this.hasClass("mode" + p)) {
									this.set("class", "block mode" + p);
									h = h.substring(0, i) + p + h.substring(i + 1)
								}
							},
							mouseleave: function() {
								$("sched_table_info").set("html", "")
							}
						});
						if (Browser.ie) {
							q.addEvent("selectstart", Function.from(false))
						}
					})()
				}
				n.grab(q)
			}
			l.grab(n)
		}
		$("sched_table").set("html", "").grab(l)
	}).fireEvent("change");
	$$("#sched_table_lgnd ul li").addEvents({
		mouseenter: function() {
			$("sched_table_info").set("text", g_schLgndEx[this.get("id").match(/.*_([^_]+)$/)[1]])
		},
		mouseleave: function() {
			$("sched_table_info").getChildren().destroy()
		}
	});
	utWebUI.advOptTable.create("dlgSettings-advOptList", utWebUI.advOptColDefs, Object.append({
		format: utWebUI.advOptFormatRow.bind(utWebUI),
		onColReset: utWebUI.advOptColReset.bind(utWebUI),
		onSelect: utWebUI.advOptSelect.bind(utWebUI),
		onDblClick: utWebUI.advOptDblClk.bind(utWebUI)
	}, utWebUI.defConfig.advOptTable));
	$("DLG_SETTINGS_A_ADVANCED_05").addEvent("click", utWebUI.advOptChanged.bind(utWebUI));
	$("dlgSettings-advTrue").addEvent("click", utWebUI.advOptChanged.bind(utWebUI));
	$("dlgSettings-advFalse").addEvent("click", utWebUI.advOptChanged.bind(utWebUI));
	var d = $("dlgSettings-Advanced").getDimensions({
		computeSize: true
	});
	utWebUI.advOptTable.resizeTo(d.x - 15, d.y - 70);
	utWebUI.ckMgrTable.create("dlgSettings-cookieList", utWebUI.ckMgrColDefs, Object.append({
		format: utWebUI.ckMgrFormatRow.bind(utWebUI),
		onColReset: utWebUI.ckMgrColReset.bind(utWebUI),
		onSelect: utWebUI.ckMgrSelect.bind(utWebUI)
	}, utWebUI.defConfig.ckMgrTable));
	$("dlgSettings-cookieSet").addEvent("click", utWebUI.ckMgrChanged.bind(utWebUI));
	var g = $("dlgSettings-CookieManager").getDimensions({
		computeSize: true
	});
	utWebUI.ckMgrTable.resizeTo(g.x - 15, g.y - 90);
	var c = Browser.ie ? "click" : "change";
	$("proxy.type").addEvent("change", function() {
		_link(this, 0, ["proxy.proxy", "proxy.port", "proxy.auth", "proxy.resolve", "proxy.p2p", "no_local_dns", "private_ip", "only_proxied_conns"])
	});
	$("proxy.auth").addEvent(c, function() {
		_link(this, 0, ["proxy.username"]);
		_link(this, 0, ["proxy.password"], null, (this.checked && ($("proxy.type").get("value").toInt() == 1)))
	});
	$("cache.override").addEvent(c, function() {
		_link(this, 0, ["cache.override_size"], ["cache.override_size"])
	});
	$("cache.write").addEvent(c, function() {
		_link(this, 0, ["cache.writeout", "cache.writeimm"])
	});
	$("cache.read").addEvent(c, function() {
		_link(this, 0, ["cache.read_turnoff", "cache.read_prune", "cache.read_thrash"])
	});
	$("prop-seed_override").addEvent(c, function() {
		_link(this, 0, ["prop-seed_ratio", "prop-seed_time"])
	});
	$("webui.uconnect_enable").addEvent(c, function() {
		_link(this, 0, ["webui.uconnect_username", "webui.uconnect_password"])
	});
	$("webui.enable").addEvent(c, function() {
		_link(this, 0, ["webui.username", "webui.password", "webui.enable_guest", "webui.enable_listen", "webui.restrict"]);
		_link(this, 0, ["webui.guest"], null, (this.checked && !$("webui.enable_guest").checked));
		_link(this, 0, ["webui.port"], null, (this.checked && !$("webui.enable_listen").checked))
	});
	$("webui.enable_guest").addEvent(c, function() {
		_link(this, 0, ["webui.guest"])
	});
	$("webui.enable_listen").addEvent(c, function() {
		_link(this, 0, ["webui.port"])
	});
	$("multi_day_transfer_limit_en").addEvent(c, function() {
		_link(this, 0, ["multi_day_transfer_mode", "multi_day_transfer_limit_value", "multi_day_transfer_limit_unit", "multi_day_transfer_limit_span"])
	});
	$("seed_prio_limitul_flag").addEvent(c, function() {
		_link(this, 0, ["seed_prio_limitul"])
	});
	$("sched_enable").addEvent(c, function() {
		_link(this, 0, ["sched_ul_rate", "sched_dl_rate", "sched_dis_dht"]);
		["sched_table", "sched_table_lgnd", "sched_table_info"].each(this.checked ? function(h) {
			$(h).removeClass("disabled")
		} : function(h) {
			$(h).addClass("disabled")
		})
	});
	$("dir_active_download_flag").addEvent(c, function() {
		_link(this, 0, ["always_show_add_dialog", "dir_active_download"])
	});
	$("dir_completed_download_flag").addEvent(c, function() {
		_link(this, 0, ["dir_add_label", "dir_completed_download", "move_if_defdir"])
	});
	$("dir_torrent_files_flag").addEvent(c, function() {
		_link(this, 0, ["dir_torrent_files"])
	});
	$("dir_completed_torrents_flag").addEvent(c, function() {
		_link(this, 0, ["dir_completed_torrents"])
	});
	$("dir_autoload_flag").addEvent(c, function() {
		_link(this, 0, ["dir_autoload_delete", "dir_autoload"])
	});
	$("max_ul_rate_seed_flag").addEvent(c, function() {
		_link(this, 0, ["max_ul_rate_seed"])
	});
	$("gui.manual_ratemenu").addEvent(c, function() {
		_link(this, 0, ["gui.ulrate_menu", "gui.dlrate_menu"])
	});
	_unhideSetting(["webui.lang", "enable_bw_management", "multi_day_transfer_mode", "total_uploaded_history", "total_downloaded_history", "total_updown_history", "history_period", "DLG_SETTINGS_7_TRANSFERCAP_12", "DLG_SETTINGS_A_ADVANCED_02", "webui.showToolbar", "webui.showCategories", "webui.showDetails", "webui.showStatusBar", "webui.maxRows", "webui.updateInterval", "webui.useSysFont", "dlgSettings-cookieDomain", "dlgSettings-cookieData", "dlgSettings-cookieSet", "webui.notify", "webui.showFeeds", "webui.mobile", "webui.checkPort", "webui.root", "webui.space", "webui.theme", "webui.links", "webui.search"]);
	$("mainStatusBar-menu").addStopEvent("mousedown", function(h) {
		return utWebUI.statusMenuShow(h)
	});
	$("mainStatusBar-download").addStopEvent("mousedown", function(h) {
		return utWebUI.statusDownloadMenuShow(h)
	});
	$("mainStatusBar-upload").addStopEvent("mousedown", function(h) {
		return utWebUI.statusUploadMenuShow(h)
	});
	resizeUI()
}

function _link(f, b, h, a, k) {
	a = a || [];
	var d = true,
		m = f.get("tag");
	if (m == "input") {
		if (f.type == "checkbox" || f.type == "radio") {
			d = !f.checked || f.disabled
		}
		if (k) {
			d = !d
		}
	} else {
		if (m == "select") {
			d = (f.get("value") == b)
		} else {
			return
		}
	}
	var g;
	for (var e = 0, c = h.length; e < c; e++) {
		if (!(g = $(h[e]))) {
			continue
		}
		if (g.type != "checkbox") {
			g[(d ? "add" : "remove") + "Class"]("disabled")
		}
		g.disabled = d;
		g.fireEvent(((m == "input") && Browser.ie) ? "click" : "change");
		if (a.contains(h[e])) {
			continue
		}
		var l = g.getPrevious();
		if (!l || (l.get("tag") != "label")) {
			l = g.getNext();
			if (!l || (l.get("tag") != "label")) {
				continue
			}
		}
		l[(d ? "add" : "remove") + "Class"]("disabled")
	}
}

function _unhideSetting(a) {
	Array.from(a).each(function(b) {
		b = $(b);
		if (!b) {
			return
		}
		b = b.getParent();
		while (b && !b.hasClass("settings-pane") && b.getStyle("display") !== "") {
			b.show();
			b = b.getParent()
		}
		if (b.hasClass("settings-pane")) {
			b.fireEvent("show")
		}
	}, this)
}

function loadLangStrings(b) {
	if (b) {
		var a = false;
		Asset.javascript("lang/" + b.lang + ".js", {
			onload: function() {
				if (a) {
					return
				}
				a = true;
				loadLangStrings();
				if (b.onload) {
					b.onload()
				}
			}
		});
		return
	}
	g_perSec = "/" + L_("TIME_SECS").replace(/%d/, "").trim();
	g_dayCodes = L_("ST_SCH_DAYCODES").split("||");
	g_dayNames = L_("ST_SCH_DAYNAMES").split("||");
	g_schLgndEx = {
		full: L_("ST_SCH_LGND_FULLEX"),
		limited: L_("ST_SCH_LGND_LIMITEDEX"),
		off: L_("ST_SCH_LGND_OFFEX"),
		seeding: L_("ST_SCH_LGND_SEEDINGEX")
	};
	_loadStrings("text", ["OV_CAT_ALL", "OV_CAT_DL", "OV_CAT_COMPL", "OV_CAT_ACTIVE", "OV_CAT_INACTIVE", "OV_CAT_NOLABEL"]);
	utWebUI.trtTable.refreshRows();
	utWebUI.trtTable.setConfig({
		resetText: L_("MENU_RESET"),
		colText: {
			name: L_("OV_COL_NAME", 1),
			order: L_("OV_COL_ORDER", 1),
			size: L_("OV_COL_SIZE", 1),
			remaining: L_("OV_COL_REMAINING", 1),
			done: L_("OV_COL_DONE", 1),
			status: L_("OV_COL_STATUS", 1),
			seeds: L_("OV_COL_SEEDS", 1),
			peers: L_("OV_COL_PEERS", 1),
			seeds_peers: L_("OV_COL_SEEDS_PEERS", 1),
			downspeed: L_("OV_COL_DOWNSPD", 1),
			upspeed: L_("OV_COL_UPSPD", 1),
			eta: L_("OV_COL_ETA", 1),
			downloaded: L_("OV_COL_DOWNLOADED", 1),
			uploaded: L_("OV_COL_UPPED", 1),
			ratio: L_("OV_COL_SHARED", 1),
			availability: L_("OV_COL_AVAIL", 1),
			label: L_("OV_COL_LABEL", 1),
			added: L_("OV_COL_DATE_ADDED", 1),
			completed: L_("OV_COL_DATE_COMPLETED", 1),
			url: L_("OV_COL_SOURCE_URL", 1)
		}
	});
	var d = L_("OV_TABS").split("||");
	utWebUI.mainTabs.setNames({
		"mainInfoPane-generalTab": d[0],
		"mainInfoPane-trackersTab": d[1],
		"mainInfoPane-filesTab": d[4],
		"mainInfoPane-speedTab": d[5],
		"mainInfoPane-loggerTab": d[6]
	});
	_loadStrings("text", ["GN_TRANSFER", "GN_TP_01", "GN_TP_02", "GN_TP_03", "GN_TP_04", "GN_TP_05", "GN_TP_06", "GN_TP_07", "GN_TP_08", "GN_GENERAL", "GN_TP_09", "GN_TP_10"]);
	utWebUI.traTable.refreshRows();
	utWebUI.traTable.setConfig({
		resetText: L_("MENU_RESET"),
		colText: {
			name: L_("OV_COL_NAME", 1),
			status: L_("OV_COL_STATUS", 1),
		}
	});
	utWebUI.flsTable.refreshRows();
	utWebUI.flsTable.setConfig({
		resetText: L_("MENU_RESET"),
		colText: {
			name: L_("FI_COL_NAME", 1),
			size: L_("FI_COL_SIZE", 1),
			done: L_("FI_COL_DONE", 1),
			pcnt: L_("FI_COL_PCNT", 1),
			firstpc: L_("FI_COL_FIRSTPC", 1),
			numpcs: L_("FI_COL_NUMPCS", 1),
			prio: L_("FI_COL_PRIO", 1)
		}
	});
	utWebUI.spdGraph.setLabels(L_("OV_COL_UPSPD", 1), L_("OV_COL_DOWNSPD", 1));
	utWebUI.updateStatusBar();
	if (isGuest) {
		return
	}
	_loadStrings("title", {
		add: "OV_TB_ADDTORR",
		addurl: "OV_TB_ADDURL",
		remove: "OV_TB_REMOVE",
		start: "OV_TB_START",
		pause: "OV_TB_PAUSE",
		stop: "OV_TB_STOP",
		queueup: "OV_TB_QUEUEUP",
		queuedown: "OV_TB_QUEUEDOWN",
		rssdownloader: "OV_TB_RSSDOWNLDR",
		setting: "OV_TB_PREF"
	});
	_loadStrings("text", {
		"dlgAdd-head": "OV_TB_ADDTORR",
		"dlgAddURL-head": "OV_TB_ADDURL",
		"dlgProps-head": "DLG_TORRENTPROP_00",
		"dlgRSSDownloader-head": "OV_TB_RSSDOWNLDR",
		"dlgSettings-head": "OV_TB_PREF"
	});
	_loadStrings("value", {
		ADD_FILE_OK: "DLG_BTN_OK",
		ADD_FILE_CANCEL: "DLG_BTN_CANCEL",
		DLG_ADDEDITRSSFEED_01: "DLG_BTN_OK",
		DLG_ADDEDITRSSFEED_02: "DLG_BTN_CANCEL",
		ADD_URL_OK: "DLG_BTN_OK",
		ADD_URL_CANCEL: "DLG_BTN_CANCEL",
		DLG_TORRENTPROP_01: "DLG_BTN_OK",
		DLG_TORRENTPROP_02: "DLG_BTN_CANCEL",
		DLG_RSSDOWNLOADER_01: "DLG_BTN_CLOSE",
		rssfilter_edit_cancel: "DLG_BTN_CANCEL",
		rssfilter_edit_apply: "DLG_BTN_APPLY",
		RESET_UI_OK: "DLG_BTN_OK",
		RESET_UI_CANCEL: "DLG_BTN_CANCEL",
		DLG_SETTINGS_03: "DLG_BTN_OK",
		DLG_SETTINGS_04: "DLG_BTN_CANCEL",
		DLG_SETTINGS_05: "DLG_BTN_APPLY"
	});
	$("dlgAbout-version").set("text", "v" + CONST.VERSION + (CONST.BUILD ? " (" + CONST.BUILD + ")" : ""));
	_loadStrings("text", ["DLG_TORRENTPROP_1_GEN_01", "DLG_TORRENTPROP_1_GEN_03", "DLG_TORRENTPROP_1_GEN_04", "DLG_TORRENTPROP_1_GEN_06", "DLG_TORRENTPROP_1_GEN_08", "DLG_TORRENTPROP_1_GEN_10", "DLG_TORRENTPROP_1_GEN_11", "DLG_TORRENTPROP_1_GEN_12", "DLG_TORRENTPROP_1_GEN_14", "DLG_TORRENTPROP_1_GEN_16", "DLG_TORRENTPROP_1_GEN_17", "DLG_TORRENTPROP_1_GEN_18", "DLG_TORRENTPROP_1_GEN_19"]);
	_loadStrings("text", ["DLG_ADDEDITRSSFEED_03", "DLG_ADDEDITRSSFEED_04", "DLG_ADDEDITRSSFEED_05", "DLG_ADDEDITRSSFEED_06", "DLG_ADDEDITRSSFEED_07", "DLG_ADDEDITRSSFEED_08", "DLG_ADDEDITRSSFEED_09"]);
	var c = L_("DLG_RSSDOWNLOADER_02").split("||");
	utWebUI.mainTabs.setNames({
		"dlgRSSDownloader-feedsTab": c[0],
		"dlgRSSDownloader-filtersTab": c[1]
	});
	_loadStrings("text", "DLG_RSSDOWNLOADER_03");
	utWebUI.rssfdTable.refreshRows();
	utWebUI.rssfdTable.setConfig({
		resetText: L_("MENU_RESET"),
		colText: {
			fullname: L_("FEED_COL_FULLNAME", 1),
			name: L_("FEED_COL_NAME", 1),
			episode: L_("FEED_COL_EPISODE", 1),
			format: L_("FEED_COL_FORMAT", 1),
			codec: L_("FEED_COL_CODEC", 1),
			date: L_("FEED_COL_DATE", 1),
			feed: L_("FEED_COL_FEED", 1),
			url: L_("FEED_COL_URL", 1)
		}
	});
	_loadStrings("text", ["DLG_RSSDOWNLOADER_04", "DLG_RSSDOWNLOADER_05", "DLG_RSSDOWNLOADER_06", "DLG_RSSDOWNLOADER_07", "DLG_RSSDOWNLOADER_08", "DLG_RSSDOWNLOADER_09", "DLG_RSSDOWNLOADER_10", "DLG_RSSDOWNLOADER_11", "DLG_RSSDOWNLOADER_12", "DLG_RSSDOWNLOADER_13", "DLG_RSSDOWNLOADER_14", "DLG_RSSDOWNLOADER_15", "DLG_RSSDOWNLOADER_16", "DLG_RSSDOWNLOADER_17"]);
	_loadComboboxStrings("rssfilter_min_interval", L_("DLG_RSSDOWNLOADER_31").split("||"));
	utWebUI.stpanes.setNames({
		"dlgSettings-General": L_("ST_CAPT_GENERAL"),
		"dlgSettings-UISettings": L_("ST_CAPT_UI_SETTINGS"),
		"dlgSettings-Directories": L_("ST_CAPT_FOLDER"),
		"dlgSettings-Connection": L_("ST_CAPT_CONNECTION"),
		"dlgSettings-Bandwidth": L_("ST_CAPT_BANDWIDTH"),
		"dlgSettings-BitTorrent": L_("ST_CAPT_BITTORRENT"),
		"dlgSettings-TransferCap": L_("ST_CAPT_TRANSFER_CAP"),
		"dlgSettings-Queueing": L_("ST_CAPT_QUEUEING"),
		"dlgSettings-Scheduler": L_("ST_CAPT_SCHEDULER"),
		"dlgSettings-Remote": L_("ST_CAPT_REMOTE"),
		"dlgSettings-Advanced": L_("ST_CAPT_ADVANCED"),
		"dlgSettings-UIExtras": "&nbsp;&nbsp;&nbsp;&nbsp;" + L_("ST_CAPT_UI_EXTRAS"),
		"dlgSettings-DiskCache": "&nbsp;&nbsp;&nbsp;&nbsp;" + L_("ST_CAPT_DISK_CACHE"),
		"dlgSettings-WebUI": "&nbsp;&nbsp;&nbsp;&nbsp;" + L_("ST_CAPT_WEBUI"),
		"dlgSettings-RunProgram": "&nbsp;&nbsp;&nbsp;&nbsp;" + L_("ST_CAPT_RUN_PROGRAM"),
		"dlgSettings-CookieManager": "&nbsp;&nbsp;&nbsp;&nbsp;Cookie Manager",
	});
	_loadStrings("text", ["DLG_SETTINGS_1_GENERAL_01", "DLG_SETTINGS_1_GENERAL_02", "DLG_SETTINGS_1_GENERAL_10", "DLG_SETTINGS_1_GENERAL_11", "DLG_SETTINGS_1_GENERAL_12", "DLG_SETTINGS_1_GENERAL_13", "DLG_SETTINGS_1_GENERAL_17", "DLG_SETTINGS_1_GENERAL_18", "DLG_SETTINGS_1_GENERAL_19", "DLG_SETTINGS_1_GENERAL_20", "DLG_SETTINGS_2_UI_01", "DLG_SETTINGS_2_UI_02", "DLG_SETTINGS_2_UI_03", "DLG_SETTINGS_2_UI_04", "DLG_SETTINGS_2_UI_05", "DLG_SETTINGS_2_UI_06", "DLG_SETTINGS_2_UI_07", "DLG_SETTINGS_2_UI_15", "DLG_SETTINGS_2_UI_16", "DLG_SETTINGS_2_UI_17", "DLG_SETTINGS_2_UI_18", "DLG_SETTINGS_2_UI_19", "DLG_SETTINGS_2_UI_20", "DLG_SETTINGS_2_UI_22", "DLG_SETTINGS_3_PATHS_01", "DLG_SETTINGS_3_PATHS_02", "DLG_SETTINGS_3_PATHS_03", "DLG_SETTINGS_3_PATHS_06", "DLG_SETTINGS_3_PATHS_07", "DLG_SETTINGS_3_PATHS_10", "DLG_SETTINGS_3_PATHS_11", "DLG_SETTINGS_3_PATHS_12", "DLG_SETTINGS_3_PATHS_15", "DLG_SETTINGS_3_PATHS_18", "DLG_SETTINGS_3_PATHS_19", "DLG_SETTINGS_4_CONN_01", "DLG_SETTINGS_4_CONN_02", "DLG_SETTINGS_4_CONN_05", "DLG_SETTINGS_4_CONN_06", "DLG_SETTINGS_4_CONN_07", "DLG_SETTINGS_4_CONN_08", "DLG_SETTINGS_4_CONN_09", "DLG_SETTINGS_4_CONN_11", "DLG_SETTINGS_4_CONN_13", "DLG_SETTINGS_4_CONN_15", "DLG_SETTINGS_4_CONN_16", "DLG_SETTINGS_4_CONN_18", "DLG_SETTINGS_4_CONN_19", "DLG_SETTINGS_4_CONN_20", "DLG_SETTINGS_4_CONN_21", "DLG_SETTINGS_4_CONN_22", "DLG_SETTINGS_4_CONN_23", "DLG_SETTINGS_4_CONN_24", "DLG_SETTINGS_4_CONN_25", "DLG_SETTINGS_5_BANDWIDTH_01", "DLG_SETTINGS_5_BANDWIDTH_02", "DLG_SETTINGS_5_BANDWIDTH_05", "DLG_SETTINGS_5_BANDWIDTH_07", "DLG_SETTINGS_5_BANDWIDTH_08", "DLG_SETTINGS_5_BANDWIDTH_10", "DLG_SETTINGS_5_BANDWIDTH_11", "DLG_SETTINGS_5_BANDWIDTH_14", "DLG_SETTINGS_5_BANDWIDTH_15", "DLG_SETTINGS_5_BANDWIDTH_17", "DLG_SETTINGS_5_BANDWIDTH_18", "DLG_SETTINGS_5_BANDWIDTH_19", "DLG_SETTINGS_5_BANDWIDTH_20", "DLG_SETTINGS_6_BITTORRENT_01", "DLG_SETTINGS_6_BITTORRENT_02", "DLG_SETTINGS_6_BITTORRENT_03", "DLG_SETTINGS_6_BITTORRENT_04", "DLG_SETTINGS_6_BITTORRENT_05", "DLG_SETTINGS_6_BITTORRENT_06", "DLG_SETTINGS_6_BITTORRENT_07", "DLG_SETTINGS_6_BITTORRENT_08", "DLG_SETTINGS_6_BITTORRENT_10", "DLG_SETTINGS_6_BITTORRENT_11", "DLG_SETTINGS_6_BITTORRENT_13", "DLG_SETTINGS_6_BITTORRENT_14", "DLG_SETTINGS_6_BITTORRENT_15", "DLG_SETTINGS_7_TRANSFERCAP_01", "DLG_SETTINGS_7_TRANSFERCAP_02", "DLG_SETTINGS_7_TRANSFERCAP_03", "DLG_SETTINGS_7_TRANSFERCAP_04", "DLG_SETTINGS_7_TRANSFERCAP_05", "DLG_SETTINGS_7_TRANSFERCAP_06", "DLG_SETTINGS_7_TRANSFERCAP_07", "DLG_SETTINGS_7_TRANSFERCAP_08", "DLG_SETTINGS_7_TRANSFERCAP_09", "DLG_SETTINGS_7_TRANSFERCAP_10", "DLG_SETTINGS_8_QUEUEING_01", "DLG_SETTINGS_8_QUEUEING_02", "DLG_SETTINGS_8_QUEUEING_04", "DLG_SETTINGS_8_QUEUEING_06", "DLG_SETTINGS_8_QUEUEING_07", "DLG_SETTINGS_8_QUEUEING_09", "DLG_SETTINGS_8_QUEUEING_11", "DLG_SETTINGS_8_QUEUEING_12", "DLG_SETTINGS_8_QUEUEING_13", "DLG_SETTINGS_9_SCHEDULER_01", "DLG_SETTINGS_9_SCHEDULER_02", "DLG_SETTINGS_9_SCHEDULER_04", "DLG_SETTINGS_9_SCHEDULER_05", "DLG_SETTINGS_9_SCHEDULER_07", "DLG_SETTINGS_9_SCHEDULER_09", "ST_SCH_LGND_FULL", "ST_SCH_LGND_LIMITED", "ST_SCH_LGND_OFF", "ST_SCH_LGND_SEEDING", "DLG_SETTINGS_10_REMOTE_02", "DLG_SETTINGS_10_REMOTE_03", "DLG_SETTINGS_10_REMOTE_04", "DLG_SETTINGS_10_REMOTE_05", "DLG_SETTINGS_A_ADVANCED_01", "DLG_SETTINGS_A_ADVANCED_02", "DLG_SETTINGS_A_ADVANCED_03", "DLG_SETTINGS_A_ADVANCED_04", "DLG_SETTINGS_B_ADV_UI_01", "DLG_SETTINGS_B_ADV_UI_02", "DLG_SETTINGS_B_ADV_UI_03", "DLG_SETTINGS_B_ADV_UI_05", "DLG_SETTINGS_B_ADV_UI_07", "DLG_SETTINGS_B_ADV_UI_08", "DLG_SETTINGS_C_ADV_CACHE_01", "DLG_SETTINGS_C_ADV_CACHE_02", "DLG_SETTINGS_C_ADV_CACHE_03", "DLG_SETTINGS_C_ADV_CACHE_05", "DLG_SETTINGS_C_ADV_CACHE_06", "DLG_SETTINGS_C_ADV_CACHE_07", "DLG_SETTINGS_C_ADV_CACHE_08", "DLG_SETTINGS_C_ADV_CACHE_09", "DLG_SETTINGS_C_ADV_CACHE_10", "DLG_SETTINGS_C_ADV_CACHE_11", "DLG_SETTINGS_C_ADV_CACHE_12", "DLG_SETTINGS_C_ADV_CACHE_13", "DLG_SETTINGS_C_ADV_CACHE_14", "DLG_SETTINGS_C_ADV_CACHE_15", "DLG_SETTINGS_9_WEBUI_01", "DLG_SETTINGS_9_WEBUI_02", "DLG_SETTINGS_9_WEBUI_03", "DLG_SETTINGS_9_WEBUI_05", "DLG_SETTINGS_9_WEBUI_07", "DLG_SETTINGS_9_WEBUI_09", "DLG_SETTINGS_9_WEBUI_10", "DLG_SETTINGS_9_WEBUI_12", "MM_OPTIONS_SHOW_CATEGORY", "MM_OPTIONS_SHOW_DETAIL", "MM_OPTIONS_SHOW_STATUS", "MM_OPTIONS_SHOW_TOOLBAR", "DLG_SETTINGS_C_ADV_RUN_01", "DLG_SETTINGS_C_ADV_RUN_02", "DLG_SETTINGS_C_ADV_RUN_04", "DLG_SETTINGS_C_ADV_RUN_06"]);
	utWebUI.advOptTable.refreshRows();
	utWebUI.advOptTable.setConfig({
		resetText: L_("MENU_RESET"),
		colText: {
			name: L_("ST_COL_NAME", 1),
			value: L_("ST_COL_VALUE", 1)
		}
	});
	utWebUI.ckMgrTable.refreshRows();
	utWebUI.ckMgrTable.setConfig({
		resetText: L_("MENU_RESET"),
		colText: {
			domain: "Domain",
			data: "Data"
		}
	});
	_loadStrings("value", ["DLG_SETTINGS_4_CONN_04", "DLG_SETTINGS_7_TRANSFERCAP_12", "DLG_SETTINGS_A_ADVANCED_05"]);
	_loadComboboxStrings("gui.dblclick_seed", L_("ST_CBO_UI_DBLCLK_TOR").split("||"), utWebUI.settings["gui.dblclick_seed"]);
	_loadComboboxStrings("gui.dblclick_dl", L_("ST_CBO_UI_DBLCLK_TOR").split("||"), utWebUI.settings["gui.dblclick_dl"]);
	_loadComboboxStrings("encryption_mode", L_("ST_CBO_ENCRYPTIONS").split("||"), utWebUI.settings.encryption_mode);
	_loadComboboxStrings("proxy.type", L_("ST_CBO_PROXY").split("||"), utWebUI.settings["proxy.type"]);
	_loadComboboxStrings("multi_day_transfer_mode", L_("ST_CBO_TCAP_MODES").split("||"), utWebUI.settings.multi_day_transfer_mode);
	_loadComboboxStrings("multi_day_transfer_limit_unit", L_("ST_CBO_TCAP_UNITS").split("||"), utWebUI.settings.multi_day_transfer_limit_unit);
	_loadComboboxStrings("multi_day_transfer_limit_span", L_("ST_CBO_TCAP_PERIODS").split("||"), utWebUI.settings.multi_day_transfer_limit_span);
	_loadComboboxStrings("webui.theme", utWebUI.themes.map(function(t){return t[0]}), utWebUI.config.theme);
	$("sched_table").fireEvent("change")
}

function _loadComboboxStrings(f, c, b) {
	try {
		var a = $(f);
		a.options.length = 0;
		$each(c, function(g, e) {
			if (!g) {
				return
			}
			switch (typeOf(g)) {
				case "array":
					a.options[a.options.length] = new Option(g[1], g[0], false, false);
					break;
				default:
					a.options[a.options.length] = new Option(g, e, false, false)
			}
		});
		a.set("value", b || 0)
	} catch (d) {
		console.log("Error attempting to assign values to combobox with id='" + f + "'... ");
		console.log(d.name + ": " + d.message)
	}
}

function _loadStrings(c, a) {
	var b;
	switch (typeOf(a)) {
		case "object":
			b = function(e, d) {
				$(d).set(c, L_(e))
			};
			break;
		default:
			a = Array.from(a);
			b = function(d) {
				$(d).set(c, L_(d))
			}
	}
	$each(a, function(g, d) {
		try {
			b(g, d)
		} catch (f) {
			console.log("Error attempting to assign string '" + g + "' to element...")
		}
	})
};
