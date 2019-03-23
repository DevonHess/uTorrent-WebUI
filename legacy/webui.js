var LANG_LIST = LANG_LIST || {};
var urlBase = window.location.pathname.split("/gui", 1)[0].replace(/\/+$/, "");
var guiBase = urlBase + "/gui/";
var proxyBase = urlBase + "/proxy";
var isGuest = window.location.pathname.test(/.*guest.html$/);
var utWebUI = {
	torrents: {},
	rssfeeds: {},
	rssfilters: {},
	peerlist: [],
	filelist: [],
	settings: {},
	props: {},
	xferhist: {},
	dirlist: [],
	categories: {
		cat_all: 0,
		cat_dls: 0,
		cat_com: 0,
		cat_act: 0,
		cat_iac: 0,
		cat_nlb: 0
	},
	labels: {},
	torGroups: {},
	defTorGroup: {
		cat: {},
		lbl: {}
	},
	torQueueMax: -1,
	cacheID: 0,
	limits: {
		reqRetryDelayBase: 2,
		reqRetryMaxAttempts: 5,
		minTableRows: 5,
		maxVirtTableRows: Math.ceil(screen.height / 16) || 100,
		minUpdateInterval: 500,
		minDirListCache: 30,
		minFileListCache: 60,
		minPeerListCache: 5,
		minXferHistCache: 60,
		defHSplit: 140,
		defVSplit: 225,
		minHSplit: 25,
		minVSplit: 150,
		minTrtH: 100,
		minTrtW: 150
	},
	defConfig: {
		showDetails: true,
		showDetailsIcons: true,
		showCategories: true,
		showToolbar: true,
		showStatusBar: true,
		useSysFont: true,
		updateInterval: 3000,
		maxRows: 0,
		lang: "en",
		hSplit: -1,
		vSplit: -1,
		torrentTable: {
			colMask: 0,
			colOrder: [],
			colWidth: [],
			reverse: false,
			sIndex: -1
		},
		peerTable: {
			colMask: 0,
			colOrder: [],
			colWidth: [],
			reverse: false,
			sIndex: -1
		},
		fileTable: {
			colMask: 0,
			colOrder: [],
			colWidth: [],
			reverse: false,
			sIndex: -1
		},
		feedTable: {
			colMask: 0,
			colOrder: [],
			colWidth: [],
			reverse: false,
			sIndex: -1
		},
		advOptTable: {
			rowMultiSelect: false
		},
		ckMgrTable: {
			reverse: false,
			sIndex: -1
		},
		activeSettingsPane: "",
		activeRssFeeds: {
			rssfeed_all: 1
		},
		activeTorGroups: {
			cat: {
				cat_all: 1
			},
			lbl: {}
		},
		urlCookies: []
	},
	resetConfigMap: {
		"interface": ["showDetails", "showDetailsIcons", "showCategories", "showToolbar", "showStatusBar", "useSysFont", "updateInterval", "maxRows", "lang", "hSplit", "vSplit", "activeSettingsPane", "activeRssFeeds", "activeTorGroups"],
		grid: ["torrentTable", "peerTable", "fileTable", "feedTable", "advOptTable", "ckMgrTable"],
		cookie: ["urlCookies"]
	},
	torrentID: "",
	propID: "",
	rssfilterId: "",
	spdGraph: new SpeedGraph(),
	trtTable: new STable(),
	prsTable: new STable(),
	flsTable: new STable(),
	rssfdTable: new STable(),
	advOptTable: new STable(),
	ckMgrTable: new STable(),
	trtColDefs: [{
		id: "name",
		width: 220,
		type: TYPE_STRING
	}, {
		id: "order",
		width: 35,
		type: TYPE_NUM_ORDER
	}, {
		id: "size",
		width: 75,
		type: TYPE_NUMBER
	}, {
		id: "remaining",
		width: 90,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "done",
		width: 60,
		type: TYPE_NUM_PROGRESS
	}, {
		id: "status",
		width: 100,
		type: TYPE_CUSTOM
	}, {
		id: "seeds",
		width: 60,
		type: TYPE_NUMBER
	}, {
		id: "peers",
		width: 60,
		type: TYPE_NUMBER
	}, {
		id: "seeds_peers",
		width: 80,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "downspeed",
		width: 80,
		type: TYPE_NUMBER
	}, {
		id: "upspeed",
		width: 80,
		type: TYPE_NUMBER
	}, {
		id: "eta",
		width: 60,
		type: TYPE_NUM_ORDER
	}, {
		id: "uploaded",
		width: 75,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "downloaded",
		width: 75,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "ratio",
		width: 50,
		type: TYPE_NUMBER
	}, {
		id: "availability",
		width: 50,
		type: TYPE_NUMBER
	}, {
		id: "label",
		width: 80,
		type: TYPE_STRING,
		hidden: true
	}, {
		id: "added",
		width: 150,
		type: TYPE_DATE,
		hidden: true,
		align: ALIGN_LEFT
	}, {
		id: "completed",
		width: 150,
		type: TYPE_DATE,
		hidden: true,
		align: ALIGN_LEFT
	}, {
		id: "url",
		width: 250,
		type: TYPE_STRING,
		hidden: true
	}],
	prsColDefs: [{
		id: "ip",
		width: 200,
		type: TYPE_STRING
	}, {
		id: "port",
		width: 60,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "client",
		width: 125,
		type: TYPE_STRING
	}, {
		id: "flags",
		width: 60,
		type: TYPE_STRING
	}, {
		id: "pcnt",
		width: 80,
		type: TYPE_NUM_PROGRESS
	}, {
		id: "relevance",
		width: 70,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "downspeed",
		width: 80,
		type: TYPE_NUMBER
	}, {
		id: "upspeed",
		width: 80,
		type: TYPE_NUMBER
	}, {
		id: "reqs",
		width: 40,
		type: TYPE_STRING
	}, {
		id: "waited",
		width: 60,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "uploaded",
		width: 70,
		type: TYPE_NUMBER
	}, {
		id: "downloaded",
		width: 70,
		type: TYPE_NUMBER
	}, {
		id: "hasherr",
		width: 70,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "peerdl",
		width: 70,
		type: TYPE_NUMBER
	}, {
		id: "maxup",
		width: 70,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "maxdown",
		width: 70,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "queued",
		width: 70,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "inactive",
		width: 60,
		type: TYPE_NUMBER,
		hidden: true
	}],
	flsColDefs: [{
		id: "name",
		width: 300,
		type: TYPE_STRING
	}, {
		id: "size",
		width: 75,
		type: TYPE_NUMBER
	}, {
		id: "done",
		width: 75,
		type: TYPE_NUMBER
	}, {
		id: "pcnt",
		width: 60,
		type: TYPE_NUM_PROGRESS
	}, {
		id: "firstpc",
		width: 70,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "numpcs",
		width: 70,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "prio",
		width: 65,
		type: TYPE_NUMBER,
		align: ALIGN_LEFT
	}],
	fdColDefs: [{
		id: "fullname",
		width: 355,
		type: TYPE_STRING,
		icon: true
	}, {
		id: "name",
		width: 215,
		type: TYPE_STRING,
		hidden: true,
		icon: true
	}, {
		id: "episode",
		width: 70,
		type: TYPE_NUMBER,
		hidden: true
	}, {
		id: "format",
		width: 70,
		type: TYPE_NUMBER,
		hidden: true,
		align: ALIGN_LEFT
	}, {
		id: "codec",
		width: 70,
		type: TYPE_NUMBER,
		hidden: true,
		align: ALIGN_LEFT
	}, {
		id: "date",
		width: 150,
		type: TYPE_DATE,
		align: ALIGN_LEFT
	}, {
		id: "feed",
		width: 130,
		type: TYPE_STRING,
		hidden: true
	}, {
		id: "url",
		width: 250,
		type: TYPE_STRING,
		hidden: true
	}],
	advOptColDefs: [{
		id: "name",
		width: 240,
		type: TYPE_STRING
	}, {
		id: "value",
		width: 235,
		type: TYPE_STRING
	}],
	ckMgrColDefs: [{
		id: "domain",
		width: 200,
		type: TYPE_STRING
	}, {
		id: "data",
		width: 275,
		type: TYPE_STRING
	}],
	trtColDoneIdx: -1,
	trtColStatusIdx: -1,
	flsColPrioIdx: -1,
	updateTimeout: null,
	totalDL: 0,
	totalUL: 0,
	TOKEN: "",
	delActions: ["remove", "removetorrent", "removedata", "removedatatorrent"],
	advSettings: {
		"bt.allow_same_ip": "",
		"bt.auto_dl_enable": "",
		"bt.auto_dl_factor": "",
		"bt.auto_dl_interval": "",
		"bt.auto_dl_qos_min": "",
		"bt.auto_dl_sample_average": "",
		"bt.auto_dl_sample_window": "",
		"bt.ban_ratio": "",
		"bt.ban_threshold": "",
		"bt.compact_allocation": "",
		"bt.connect_speed": "",
		"bt.determine_encoded_rate_for_streamables": "",
		"bt.enable_pulse": "",
		"bt.enable_tracker": "",
		"bt.failover_peer_speed_threshold": "",
		"bt.graceful_shutdown": "",
		"bt.multiscrape": "",
		"bt.no_connect_to_services": "",
		"bt.no_connect_to_services_list": "",
		"bt.prio_first_last_piece": "",
		"bt.prioritize_partial_pieces": "",
		"bt.pulse_interval": "",
		"bt.pulse_weight": "",
		"bt.ratelimit_tcp_only": "",
		"bt.save_resume_rate": "",
		"bt.scrape_stopped": "",
		"bt.send_have_to_seed": "",
		"bt.set_sockbuf": "",
		"bt.shutdown_tracker_timeout": "",
		"bt.shutdown_upnp_timeout": "",
		"bt.tcp_rate_control": "",
		"bt.transp_disposition": "",
		"bt.use_ban_ratio": "",
		"bt.use_rangeblock": "",
		"btapps.app_store": "",
		"btapps.auto_update_btapps": "",
		"btapps.auto_update_btinstalls": "",
		"btapps.enable_activex": "",
		"btapps.install_unsigned_apps": "",
		"dht.rate": "",
		"diskio.coalesce_write_size": "",
		"diskio.coalesce_writes": "",
		"diskio.flush_files": "",
		"diskio.max_write_queue": "",
		"diskio.no_zero": "",
		"diskio.resume_min": "",
		"diskio.smart_hash": "",
		"diskio.smart_sparse_hash": "",
		"diskio.sparse_files": "",
		"diskio.use_partfile": "",
		"gui.auto_restart": "",
		"gui.bypass_search_redirect": "",
		"gui.color_progress_bars": "",
		"gui.combine_listview_status_done": "",
		"gui.compat_diropen": "",
		"gui.default_del_action": "",
		"gui.delete_to_trash": "",
		"gui.enable_comments": "",
		"gui.enable_ratings": "",
		"gui.enable_sidebar_buttons": "",
		"gui.graph_legend": "",
		"gui.graph_overhead": "",
		"gui.graph_tcp_rate_control": "",
		"gui.graphic_progress": "",
		"gui.log_date": "",
		"gui.overhead_in_statusbar": "",
		"gui.piecebar_progress": "",
		"gui.report_problems": "",
		"gui.show_av_icon": "",
		"gui.show_dropzone": "",
		"gui.show_notorrents_node": "",
		"gui.show_rss_favicons": "",
		"gui.show_status_icon_in_dl_list": "",
		"gui.show_welcome_node": "",
		"gui.tall_category_list": "",
		"gui.toolbar_labels": "",
		"gui.transparent_graph_legend": "",
		"gui.update_rate": "",
		"gui.use_fuzzy_dates": "",
		"ipfilter.enable": "",
		"isp.bep22": "",
		"isp.fqdn": "",
		"isp.peer_policy_enable": "",
		"isp.peer_policy_override": "",
		"isp.peer_policy_url": "",
		"isp.primary_dns": "",
		"isp.secondary_dns": "",
		"net.bind_ip": "",
		"net.calc_rss_overhead": "",
		"net.calc_tracker_overhead": "",
		"net.disable_ipv6": "",
		"net.disable_incoming_ipv6": "",
		"net.discoverable": "",
		"net.limit_excludeslocal": "",
		"net.low_cpu": "",
		"net.max_halfopen": "",
		"net.outgoing_ip": "",
		"net.outgoing_max_port": "",
		"net.outgoing_port": "",
		"net.upnp_tcp_only": "",
		"net.utp_dynamic_packet_size": "",
		"net.utp_initial_packet_size": "",
		"net.utp_packet_size_interval": "",
		"net.utp_receive_target_delay": "",
		"net.utp_target_delay": "",
		"net.wsaevents": "",
		"peer.disconnect_inactive": "",
		"peer.disconnect_inactive_interval": "",
		"peer.lazy_bitfield": "",
		"peer.resolve_country": "",
		"queue.dont_count_slow_dl": "",
		"queue.dont_count_slow_ul": "",
		"queue.prio_no_seeds": "",
		"queue.slow_dl_threshold": "",
		"queue.slow_ul_threshold": "",
		"queue.use_seed_peer_ratio": "",
		remote_torrent_files_with_private_data: "",
		"rss.feed_as_default_label": "",
		"rss.smart_repack_filter": "",
		"rss.update_interval": "",
		"streaming.failover_rate_factor": "",
		"streaming.failover_set_percentage": "",
		"streaming.min_buffer_piece": "",
		"streaming.safety_factor": "",
		"sys.enable_wine_hacks": "",
		"webui.allow_pairing": "",
		"webui.token_auth": ""
	},
	init: function() {
		this.config = Object.merge({}, this.defConfig);
		this.config.lang = "";
		this.trtColDoneIdx = this.trtColDefs.map(function(a) {
			return (a.id == "done")
		}).indexOf(true);
		this.trtColStatusIdx = this.trtColDefs.map(function(a) {
			return (a.id == "status")
		}).indexOf(true);
		this.flsColPrioIdx = this.flsColDefs.map(function(a) {
			return (a.id == "prio")
		}).indexOf(true);
		this.trtColDefs.each(function(b, a) {
			this.trtColToggle(a, b.hidden, true)
		}, this);
		this.prsColDefs.each(function(b, a) {
			this.prsColToggle(a, b.hidden, true)
		}, this);
		this.flsColDefs.each(function(b, a) {
			this.flsColToggle(a, b.hidden, true)
		}, this);
		this.fdColDefs.each(function(b, a) {
			this.fdColToggle(a, b.hidden, true)
		}, this);
		this.getSettings((function() {
			this.update.delay(0, this, (function() {
				try {
					this.refreshSelectedTorGroups();
					resizeUI();
					Overlay.hide()
				} catch (a) {
					Overlay.err(a)
				}
			}).bind(this))
		}).bind(this))
	},
	beginPeriodicUpdate: function(a) {
		this.endPeriodicUpdate();
		a = parseInt(a, 10);
		if (isNaN(a)) {
			a = this.config.updateInterval
		}
		this.config.updateInterval = a = a.max(this.limits.minUpdateInterval);
		this.updateTimeout = this.update.delay(a, this)
	},
	endPeriodicUpdate: function() {
		clearTimeout(this.updateTimeout);
		clearInterval(this.updateTimeout)
	},
	proxyFiles: function(a, c, b) {
		if (undefined === this.settings["webui.uconnect_enable"]) {
			return
		}
		$each($$(".downloadfrm"), function(d) {
			d.dispose().destroy()
		}, this);
		$each(c, function(d) {
			new IFrame({
				"class": "downloadfrm",
				src: proxyBase + "?sid=" + a + "&file=" + d + "&disposition=" + (b ? "INLINE" : "ATTACHMENT") + "&service=DOWNLOAD&qos=0",
				styles: {
					display: "none",
					height: 0,
					width: 0
				}
			}).inject(document.body)
		}, this)
	},
	request: function(a, e, d, b) {
		if (typeOf(b) != "array") {
			b = [0]
		}
		var c = this;
		var f = function() {
			try {
				new Request.JSON({
					url: guiBase + "?token=" + c.TOKEN + "&" + a + "&t=" + Date.now(),
					method: "get",
					async: typeof(d) === "undefined" || !!d,
					onError: function(j, h) {
						try {
							h.text = JSON.stringify(j)
						} catch (i) {}
						console.log(h);
						if (Overlay.visible()) {
							Overlay.err(h)
						}
					},
					onFailure: function() {
						c.endPeriodicUpdate();
						b[0]++;
						var h = Math.pow(c.limits.reqRetryDelayBase, b[0]);
						if (b[0] <= c.limits.reqRetryMaxAttempts) {
							log("Request failure #" + b[0] + " (will retry in " + h + " seconds): " + a)
						} else {
							window.removeEvents("unload");
							Overlay.msg('<p>WebUI is having trouble connecting to &micro;Torrent.</p><p>Try <a href="#" onclick="window.location.reload(true);">reloading</a> the page.</p>');
							return
						}
						c.TOKEN = "";
						c.request.delay(h * 1000, c, [a, function(i) {
							if (b[0]) {
								b[0] = 0;
								log("Request retry succeeded: " + a);
								if (e) {
									e.delay(0, c, i)
								}
								c.beginPeriodicUpdate()
							}
						}, d, b])
					},
					onSuccess: (e ? e.bind(c) : Function.from())
				}).send()
			} catch (g) {}
		};
		if (!c.TOKEN) {
			c.requestToken(f, true)
		} else {
			f()
		}
	},
	requestToken: function(c, b) {
		var a = this;
		try {
			new Request({
				url: guiBase + "token.html?t=" + Date.now(),
				method: "get",
				async: !!b,
				onFailure: (c) ? c.bind(a) : Function.from(),
				onSuccess: function(f) {
					var e = f.match(/>([^<]+)</);
					if (e) {
						a.TOKEN = e[e.length - 1]
					}
					if (c) {
						c.delay(0)
					}
				}
			}).send()
		} catch (d) {}
	},
	perform: function(c) {
		var b = false;
		switch (c) {
			case "pauseall":
				c = "pause";
				b = true;
				break;
			case "unpauseall":
				c = "unpause";
				b = true;
				break
		}
		var a = this.getHashes(c, b);
		switch (c) {
			case "pause":
				if (!b && a.length === 0) {
					c = "unpause";
					a = this.getHashes(c)
				}
				break
		}
		if (a.length == 0) {
			return
		}
		if (c.test(/^remove/) && a.contains(this.torrentID)) {
			this.torrentID = "";
			this.clearDetails()
		}
		this.getList("action=" + c + "&hash=" + a.join("&hash="), (function() {
			this.updateToolbar()
		}).bind(this))
	},
	getHashes: function(j, l) {
		var o = [];
		var i = (l ? Object.keys(this.torrents) : this.trtTable.selectedRows);
		var h = i.length;
		while (h--) {
			var m = i[h];
			var d = this.torrents[m][CONST.TORRENT_STATUS];
			switch (j) {
				case "forcestart":
					if ((d & 1) && !(d & 64) && !(d & 32)) {
						continue
					}
					break;
				case "start":
					if ((d & 1) && !(d & 32) && (d & 64)) {
						continue
					}
					break;
				case "pause":
					if ((d & 32) || (!(d & 64) && !(d & 1))) {
						continue
					}
					break;
				case "unpause":
					if (!(d & 32)) {
						continue
					}
					break;
				case "stop":
					if (!(d & 1) && !(d & 2) && !(d & 16) && !(d & 64)) {
						continue
					}
					break;
				case "recheck":
					if (d & 2) {
						continue
					}
					break;
				case "queueup":
				case "queuedown":
				case "queuetop":
				case "queuebottom":
					m = {
						qnum: this.torrents[m][CONST.TORRENT_QUEUE_POSITION],
						hash: m
					};
					if (m.qnum <= 0) {
						continue
					}
					break;
				case "remove":
				case "removetorrent":
				case "removedata":
				case "removedatatorrent":
					break;
				default:
					continue
			}
			o.push(m)
		}
		var g = o.length;
		if (g > 0 && j.test(/^queue/)) {
			var a = 1,
				e = this.torQueueMax;
			var k;
			switch (j) {
				case "queuedown":
				case "queuetop":
					k = -1;
					break;
				case "queueup":
				case "queuebottom":
					k = 1;
					break
			}
			var c, f;
			switch (j) {
				case "queuedown":
					c = function(p) {
						if (p.qnum == e) {
							--e
						}
					};
					f = function(p) {
						return (p.qnum <= e)
					};
					break;
				case "queueup":
					c = function(p) {
						if (p.qnum == a) {
							++a
						}
					};
					f = function(p) {
						return (a <= p.qnum)
					};
					break;
				case "queuebottom":
					var n = Number.MAX_VALUE;
					c = function(p, q, s) {
						var r = s[g - q - 1].qnum;
						if (r == e) {
							--e
						}
						if (r < n) {
							n = r
						}
					};
					f = function(p) {
						return (n < e)
					};
					break;
				case "queuetop":
					var b = -Number.MAX_VALUE;
					c = function(p, q, s) {
						var r = s[g - q - 1].qnum;
						if (r == a) {
							++a
						}
						if (b < r) {
							b = r
						}
					};
					f = function(p) {
						return (a < b)
					};
					break;
				default:
					c = Function.from();
					f = Function.from(true)
			}
			o = o.sort(function(p, q) {
				return k * (p.qnum < q.qnum ? -1 : (p.qnum > q.qnum ? 1 : 0))
			}).each(c).filter(f).map(function(p) {
				return p.hash
			})
		}
		return o
	},
	forcestart: function() {
		this.perform("forcestart")
	},
	start: function() {
		this.perform("start")
	},
	pause: function() {
		this.perform("pause")
	},
	stop: function() {
		this.perform("stop")
	},
	queueup: function(a) {
		this.perform(!!a ? "queuetop" : "queueup")
	},
	queuedown: function(a) {
		this.perform(!!a ? "queuebottom" : "queuedown")
	},
	removeDefault: function(a) {
		this.remove((this.settings["gui.default_del_action"] || 0) | (a ? 2 : 0))
	},
	remove: function(d) {
		if (DialogManager.modalIsVisible()) {
			return
		}
		var b = this.trtTable.selectedRows.length;
		if (b == 0) {
			return
		}
		d = parseInt(d, 10);
		if (isNaN(d) || d < 0 || this.delActions.length <= d) {
			d = this.settings["gui.default_del_action"] || 0
		}
		if (undefined === this.settings["webui.uconnect_enable"]) {
			d &= ~1
		}
		var a = this.perform.bind(this, this.delActions[d]);
		if ([this.settings.confirm_when_deleting, true].pick()) {
			var c;
			switch (d) {
				case CONST.TOR_REMOVE:
				case CONST.TOR_REMOVE_TORRENT:
					c = ((b == 1) ? "OV_CONFIRM_DELETE_ONE" : "OV_CONFIRM_DELETE_MULTIPLE");
					break;
				case CONST.TOR_REMOVE_DATA:
				case CONST.TOR_REMOVE_DATATORRENT:
					c = ((b == 1) ? "OV_CONFIRM_DELETEDATA_ONE" : "OV_CONFIRM_DELETEDATA_MULTIPLE");
					break
			}
			DialogManager.popup({
				title: "Remove Torrent(s)",
				icon: "dlgIcon-Delete",
				message: L_(c).replace(/%d/, b),
				buttons: [{
					text: L_("DLG_BTN_YES"),
					focus: true,
					click: a
				}, {
					text: L_("DLG_BTN_NO")
				}]
			})
		} else {
			a()
		}
	},
	recheck: function() {
		this.perform("recheck")
	},
	pauseAll: function() {
		this.perform("pauseall")
	},
	unpauseAll: function() {
		this.perform("unpauseall")
	},
	rssRemove: function(a) {
		if (undefined === this.settings["webui.uconnect_enable"]) {
			return
		}
		Array.from(a).each(function(b) {
			b = parseInt(b, 10);
			if (isNaN(b) || b < 0) {
				return
			}
			this.request("action=rss-remove&feed-id=" + b)
		}, this)
	},
	rssUpdate: function(b, a) {
		if (undefined === this.settings["webui.uconnect_enable"]) {
			return
		}
		Array.from(b.id).each(function(e) {
			var c = "action=rss-update";
			if (b) {
				var d;
				if (undefined !== e) {
					c += "&feed-id=" + (parseInt(e, 10) || -1)
				}
				if (undefined !== b.url) {
					c += "&url=" + encodeURIComponent(b.url)
				}
				if (undefined !== b.name) {
					c += "&alias=" + encodeURIComponent(b.name)
				}
				if (undefined !== b.subscribe) {
					c += "&subscribe=" + (!!b.subscribe ? 1 : 0)
				}
				if (undefined !== b.smart_ep) {
					c += "&smart-filter=" + (!!b.smart_ep ? 1 : 0)
				}
				if (undefined !== b.enabled) {
					c += "&enabled=" + (!!b.enabled ? 1 : 0)
				}
				if (undefined !== b.update) {
					c += "&update=" + (!!b.update ? 1 : 0)
				}
			}
			this.request(c, a)
		}, this)
	},
	rssfilterRemove: function(a) {
		if (undefined === this.settings["webui.uconnect_enable"]) {
			return
		}
		Array.from(a).each(function(b) {
			b = parseInt(b, 10);
			if (isNaN(b) || b < 0) {
				return
			}
			this.request("action=filter-remove&filter-id=" + b)
		}, this)
	},
	rssfilterUpdate: function(b, a) {
		if (undefined === this.settings["webui.uconnect_enable"]) {
			return
		}
		if (!b) {
			b = {
				id: -1,
				feed: -1
			}
		}
		Array.from(b.id).each(function(e) {
			var c = "action=filter-update";
			if (b) {
				var d;
				if (undefined !== e) {
					c += "&filter-id=" + (parseInt(e, 10) || -1)
				}
				if (undefined !== b.name) {
					c += "&name=" + encodeURIComponent(b.name)
				}
				if (undefined !== b.filter) {
					c += "&filter=" + encodeURIComponent(b.filter)
				}
				if (undefined !== b.not) {
					c += "&not-filter=" + encodeURIComponent(b.not)
				}
				if (undefined !== b.orig_name) {
					c += "&origname=" + (!!b.orig_name ? 1 : 0)
				}
				if (undefined !== b.episode_enable) {
					c += "&episode-filter=" + (!!b.episode_enable ? 1 : 0)
				}
				if (undefined !== b.episode) {
					c += "&episode=" + encodeURIComponent(b.episode)
				}
				if (undefined !== b.smart_ep) {
					c += "&smart-ep-filter=" + (!!b.smart_ep ? 1 : 0)
				}
				if (undefined !== b.add_stopped) {
					c += "&add-stopped=" + (!!b.add_stopped ? 1 : 0)
				}
				if (undefined !== b.prio) {
					c += "&prio=" + (!!b.prio ? 1 : 0)
				}
				if (undefined !== b.savein) {
					c += "&save-in=" + encodeURIComponent(b.savein)
				}
				if (undefined !== b.label) {
					c += "&label=" + encodeURIComponent(b.label)
				}
				if (undefined !== b.postpone_mode) {
					d = parseInt(b.postpone_mode, 10);
					c += "&postpone-mode=" + (isNaN(d) ? 0 : d)
				}
				if (undefined !== b.quality) {
					d = parseInt(b.quality, 10);
					c += "&quality=" + (isNaN(d) ? -1 : d)
				}
				if (undefined !== b.feed) {
					d = parseInt(b.feed, 10);
					c += "&feed-id=" + (isNaN(d) ? -1 : d)
				}
			}
			this.request(c, a)
		}, this)
	},
	getList: function(a, b) {
		this.endPeriodicUpdate();
		a = a || "";
		if (a != "") {
			a += "&"
		}
		this.request(a + "list=1&cid=" + this.cacheID + "&getmsg=1", (function(c) {
			this.loadList(c);
			if (b) {
				b(c)
			}
		}).bind(this))
	},
	getStatusInfo: function(c, a) {
		var b = ["", ""];
		if (c & CONST.STATE_PAUSED) {
			b = ["Status_Paused", (c & CONST.STATE_CHECKING) ? L_("OV_FL_CHECKED").replace(/%:\.1d%/, (a / 10).toFixedNR(1)) : L_("OV_FL_PAUSED")]
		} else {
			if (c & CONST.STATE_STARTED) {
				b = (a == 1000) ? ["Status_Up", L_("OV_FL_SEEDING")] : ["Status_Down", L_("OV_FL_DOWNLOADING")];
				if (!(c & CONST.STATE_QUEUED)) {
					b[1] = "[F] " + b[1]
				}
			} else {
				if (c & CONST.STATE_CHECKING) {
					b = ["Status_Checking", L_("OV_FL_CHECKED").replace(/%:\.1d%/, (a / 10).toFixedNR(1))]
				} else {
					if (c & CONST.STATE_ERROR) {
						b = ["Status_Error", L_("OV_FL_ERROR").replace(/%s/, "??")]
					} else {
						if (c & CONST.STATE_QUEUED) {
							b = (a == 1000) ? ["Status_Queued_Up", L_("OV_FL_QUEUED_SEED")] : ["Status_Queued_Down", L_("OV_FL_QUEUED")]
						} else {
							if (a == 1000) {
								b = ["Status_Completed", L_("OV_FL_FINISHED")]
							} else {
								b = ["Status_Incomplete", L_("OV_FL_STOPPED")]
							}
						}
					}
				}
			}
		}
		return b
	},
	loadList: function(b) {
		function a(m, e, p, o, g) {
			var f = {
				hasChanged: false
			};
			if (!has(b, m)) {
				if (!has(b, e)) {
					f[m] = f[p] = [];
					f.hasChanged = false
				} else {
					f[m] = b[e];
					delete b[e];
					f[p] = b[p];
					delete b[p];
					f.hasChanged = ((f[m].length + f[p].length) > 0)
				}
			} else {
				f.hasChanged = true;
				var l = f[m] = b[m];
				delete b[m];
				var j = f[p] = [];
				var n = {};
				for (var c in g) {
					n[c] = 1
				}
				for (var d = 0, h = l.length; d < h; d++) {
					if (has(n, l[d][o])) {
						delete n[l[d][o]]
					}
				}
				for (var c in n) {
					j.push(c)
				}
			}
			return f
		}
		this.cacheID = b.torrentc;
		if (typeOf(b.label) === "array") {
			this.loadLabels(Array.clone(b.label))
		}(function(c) {
			var d = false;
			this.trtTable.keepScroll((function() {
				c.torrents.each(function(k) {
					this.totalDL += k[CONST.TORRENT_DOWNSPEED];
					this.totalUL += k[CONST.TORRENT_UPSPEED];
					var l = k[CONST.TORRENT_HASH];
					var i = this.getStatusInfo(k[CONST.TORRENT_STATUS], k[CONST.TORRENT_PROGRESS]);
					this.torGroups[l] = this.getTorGroups(k);
					var n = this.trtDataToRow(k);
					var j = false,
						h = false;
					if (has(this.torrents, l)) {
						var m = this.trtTable.rowData[l];
						h = (m.hidden == this.torrentIsVisible(l));
						if (h) {
							m.hidden = !m.hidden
						}
						this.trtTable.setIcon(l, i[0]);
						n.each(function(p, o) {
							if (p != m.data[o]) {
								j = this.trtTable.updateCell(l, o, n) || j;
								if ("done" == this.trtColDefs[o].id) {
									j = this.trtTable.updateCell(l, this.trtColStatusIdx, n) || j
								}
							}
						}, this);
						if (!j && h) {
							this.trtTable._insertRow(l)
						}
					} else {
						this.trtTable.addRow(n, l, i[0], !this.torrentIsVisible(l));
						j = true
					}
					this.torrents[l] = k;
					d = d || j
				}, this);
				this.trtTable.requiresRefresh = d || this.trtTable.requiresRefresh;
				var e = false;
				c.torrentm.each(function(h) {
					Object.each(this.torGroups[h].cat, function(j, i) {
						--this.categories[i]
					}, this);
					delete this.torGroups[h];
					delete this.torrents[h];
					this.trtTable.removeRow(h);
					if (this.torrentID == h) {
						e = true
					}
				}, this);
				if (e) {
					this.torrentID = "";
					this.clearDetails()
				}
				var f = -1,
					g = CONST.TORRENT_QUEUE_POSITION;
				Object.each(this.torrents, function(h) {
					if (f < h[g]) {
						f = h[g]
					}
				});
				this.torQueueMax = f
			}).bind(this));
			this.trtTable.resizePads();
			this.updateLabels();
			this.trtTable.refresh()
		}).bind(this)(a("torrents", "torrentp", "torrentm", CONST.TORRENT_HASH, this.torrents));
		(function(c) {
			var d = CONST.RSSFEED_ID;
			c.rssfeeds.sort(function(e, h) {
				var g = e[d],
					f = h[d];
				if (g < f) {
					return -1
				}
				if (f < g) {
					return 1
				}
				return 0
			}).each(function(e) {
				this.rssfeeds[e[d]] = e
			}, this);
			c.rssfeedm.each(function(e) {
				delete this.rssfeeds[e]
			}, this);
			if (typeof(DialogManager) !== "undefined") {
				if (DialogManager.showing.contains("RSSDownloader")) {
					if (c.hasChanged) {
						this.rssDownloaderShow()
					}
				}
			}
		}).bind(this)(a("rssfeeds", "rssfeedp", "rssfeedm", CONST.RSSFEED_ID, this.rssfeeds));
		(function(c) {
			var d = CONST.RSSFILTER_ID;
			c.rssfilters.sort(function(e, h) {
				var g = e[d],
					f = h[d];
				if (g < f) {
					return -1
				}
				if (f < g) {
					return 1
				}
				return 0
			}).each(function(e) {
				this.rssfilters[e[d]] = e
			}, this);
			c.rssfilterm.each(function(e) {
				delete this.rssfilters[e]
			}, this);
			if (typeof(DialogManager) !== "undefined") {
				if (DialogManager.showing.contains("RSSDownloader")) {
					if (c.hasChanged) {
						this.rssDownloaderShow()
					}
				}
			}
		}).bind(this)(a("rssfilters", "rssfilterp", "rssfilterm", CONST.RSSFILTER_ID, this.rssfilters));
		b = null;
		this.beginPeriodicUpdate()
	},
	loadRSSFeedList: function() {
		var b = $("dlgRSSDownloader-feeds");
		var a = $("rssfeed_all").dispose();
		b.empty();
		Object.each(this.rssfeeds, function(c, d) {
			b.grab(new Element("li", {
				id: "rssfeed_" + d,
				text: c[CONST.RSSFEED_URL].split("|")[0],
				"class": (c[CONST.RSSFEED_ENABLED] ? "" : "disabled")
			}).grab(new Element("span", {
				"class": "icon"
			}), "top"))
		}, this);
		b.grab(a, "top");
		this.refreshSelectedRSSFeeds()
	},
	loadRSSFilterList: function() {
		var a = $("dlgRSSDownloader-filters");
		a.empty();
		$each(this.rssfilters, function(b, c) {
			if (c === "EDIT") {
				return
			}
			a.grab(new Element("li", {
				id: "rssfilter_" + c,
				text: b[CONST.RSSFILTER_NAME]
			}).grab(new Element("input", {
				type: "checkbox",
				id: "rssfilter_toggle_" + c,
				checked: !!(b[CONST.RSSFILTER_FLAGS] & CONST.RSSFILTERFLAG_ENABLE)
			}), "top"))
		}, this);
		this.switchRSSFilter($(this.rssfilterId))
	},
	loadRSSFilter: function(b) {
		var c = this.rssfilters[b] || [];
		var d = $("rssfilter_toggle_" + b);
		if (d) {
			d.checked = !!(c[CONST.RSSFILTER_FLAGS] & CONST.RSSFILTERFLAG_ENABLE)
		}
		var a = [
			[-1, L_("DLG_RSSDOWNLOADER_30")]
		];
		Object.map(this.rssfeeds, function(g, f) {
			a.push([f, g[CONST.RSSFEED_URL].split("|")[0]])
		}, this);
		_loadComboboxStrings("rssfilter_feed", a, [c[CONST.RSSFILTER_FEED], -1].pick());
		$("rssfilter_name").set("value", c[CONST.RSSFILTER_NAME] || "");
		$("rssfilter_filter").set("value", c[CONST.RSSFILTER_FILTER] || "");
		$("rssfilter_not").set("value", c[CONST.RSSFILTER_NOT_FILTER] || "");
		$("rssfilter_save_in").set("value", c[CONST.RSSFILTER_DIRECTORY] || "");
		$("rssfilter_episode").set("value", c[CONST.RSSFILTER_EPISODE_FILTER_STR] || "");
		$("rssfilter_episode_enable").checked = !!c[CONST.RSSFILTER_EPISODE_FILTER];
		$("rssfilter_quality").set("value", this.rssfilterQualityText(c[CONST.RSSFILTER_QUALITY]));
		$("rssfilter_orig_name").checked = !!(c[CONST.RSSFILTER_FLAGS] & CONST.RSSFILTERFLAG_ORIG_NAME);
		$("rssfilter_add_stopped").checked = !!(c[CONST.RSSFILTER_FLAGS] & CONST.RSSFILTERFLAG_ADD_STOPPED);
		$("rssfilter_prio").checked = !!(c[CONST.RSSFILTER_FLAGS] & CONST.RSSFILTERFLAG_HIGH_PRIORITY);
		$("rssfilter_smart_ep").checked = !!(c[CONST.RSSFILTER_FLAGS] & CONST.RSSFILTERFLAG_SMART_EP_FILTER);
		$("rssfilter_min_interval").set("value", c[CONST.RSSFILTER_POSTPONE_MODE] || 0);
		$("rssfilter_label").set("value", c[CONST.RSSFILTER_LABEL] || "");
		var e = $("dlgRSSDownloader-filterSettings");
		if (b) {
			e.removeClass("disabled");
			e.getElements("input, select").each(function(f) {
				f.disabled = false
			});
			$("rssfilter_episode_enable").fireEvent("change");
			if (Browser.ie) {
				$("rssfilter_episode_enable").fireEvent("click")
			}
		} else {
			e.addClass("disabled");
			e.getElements("input, select").each(function(f) {
				f.disabled = true
			})
		}
	},
	update: function(a) {
		this.totalDL = 0;
		this.totalUL = 0;
		this.getList(null, (function() {
			this.spdGraph.addData(this.totalUL, this.totalDL);
			this.showDetails();
			this.updateTitle();
			this.updateToolbar();
			this.updateStatusBar();
			if (typeof(a) === "function") {
				a()
			}
		}).bind(this));
		if (typeof(DialogManager) !== "undefined") {
			if (DialogManager.showing.contains("Settings") && ("dlgSettings-TransferCap" == this.stpanes.active)) {
				this.getTransferHistory()
			}
		}
	},
	loadLabels: function(g) {
		var e = $("mainCatList-labels"),
			d = {};
		g.each(function(l, i) {
			var j = l[0],
				m = "lbl_" + encodeID(j),
				k = l[1],
				h = null;
			if ((h = $(m))) {
				h.getElement(".count").set("text", k)
			} else {
				e.grab(new Element("li#" + m).appendText(j + " (").grab(new Element("span", {
					"class": "count",
					text: k
				})).appendText(")"))
			}
			if (has(this.labels, j)) {
				delete this.labels[j]
			}
			d[j] = k
		}, this);
		var a = false;
		for (var c in this.labels) {
			var f = "lbl_" + encodeID(c);
			if (this.config.activeTorGroups.lbl[f]) {
				a = true
			}
			delete this.config.activeTorGroups.lbl[f];
			$(f).destroy()
		}
		this.labels = d;
		if (a) {
			var b = (Object.getLength(this.config.activeTorGroups.cat) + Object.getLength(this.config.activeTorGroups.lbl));
			if (b <= 0) {
				this.config.activeTorGroups.cat.cat_all = 1
			}
			this.refreshSelectedTorGroups()
		}
	},
	torrentIsVisible: function(d) {
		var c = this.torGroups[d];
		var b = this.config.activeTorGroups.cat;
		var a = this.config.activeTorGroups.lbl;
		var e = true;
		if (e && (b.cat_dls || b.cat_com)) {
			e = e && ((b.cat_dls && c.cat.cat_dls) || (b.cat_com && c.cat.cat_com))
		}
		if (e && (b.cat_act || b.cat_iac)) {
			e = e && ((b.cat_act && c.cat.cat_act) || (b.cat_iac && c.cat.cat_iac))
		}
		if (e && (b.cat_nlb || !isEmpty(a))) {
			e = e && ((b.cat_nlb && c.cat.cat_nlb) || Object.some(a, function(f, g) {
				return c.lbl[g]
			}))
		}
		return !!e
	},
	getTorGroups: function(c) {
		var b = Object.merge({}, this.defTorGroup);
		b.cat.cat_all = 1;
		var a = Array.from(c[CONST.TORRENT_LABEL] || []);
		if (a.length <= 0) {
			b.cat.cat_nlb = 1
		} else {
			a.each(function(d) {
				b.lbl["lbl_" + encodeID(d)] = 1
			})
		}
		if (c[CONST.TORRENT_PROGRESS] < 1000) {
			b.cat.cat_dls = 1
		} else {
			b.cat.cat_com = 1
		}
		if ((c[CONST.TORRENT_DOWNSPEED] > (this.settings["queue.slow_dl_threshold"] || 103)) || (c[CONST.TORRENT_UPSPEED] > (this.settings["queue.slow_ul_threshold"] || 103))) {
			b.cat.cat_act = 1
		} else {
			b.cat.cat_iac = 1
		}(function(d, e) {
			if (!e) {
				Object.each(d.cat, function(g, f) {
					++this.categories[f]
				}, this)
			} else {
				if (d.cat.cat_nlb) {
					if (!e.cat.cat_nlb) {
						++this.categories.cat_nlb
					}
				} else {
					if (e.cat.cat_nlb) {
						--this.categories.cat_nlb
					}
				}
				if (d.cat.cat_dls) {
					if (e.cat.cat_com) {
						--this.categories.cat_com;
						++this.categories.cat_dls
					}
				} else {
					if (e.cat.cat_dls) {
						--this.categories.cat_dls;
						++this.categories.cat_com
					}
				}
				if (d.cat.cat_act) {
					if (e.cat.cat_iac) {
						--this.categories.cat_iac;
						++this.categories.cat_act
					}
				} else {
					if (e.cat.cat_act) {
						--this.categories.cat_act;
						++this.categories.cat_iac
					}
				}
			}
		}).bind(this)(b, this.torGroups[c[CONST.TORRENT_HASH]]);
		return b
	},
	setLabel: function(f) {
		var c = [];
		for (var e = 0, b = this.trtTable.selectedRows.length; e < b; e++) {
			var d = this.trtTable.selectedRows[e];
			if (this.torrents[d][CONST.TORRENT_LABEL] != f) {
				c.push(d)
			}
		}
		if (c.length > 0) {
			var a = "&v=" + encodeURIComponent(f) + "&s=label&hash=";
			this.request("action=setprops&s=label&hash=" + c.join(a) + "&v=" + encodeURIComponent(f))
		}
	},
	newLabel: function() {
		var a = "";
		if (this.trtTable.selectedRows.length == 1) {
			a = this.torrents[this.trtTable.selectedRows[0]][CONST.TORRENT_LABEL]
		}
		DialogManager.popup({
			title: L_("OV_NEWLABEL_CAPTION"),
			icon: "dlgIcon-Label",
			message: L_("OV_NEWLABEL_TEXT"),
			input: a || "",
			buttons: [{
				text: L_("DLG_BTN_OK"),
				submit: true,
				click: this.createLabel.bind(this)
			}, {
				text: L_("DLG_BTN_CANCEL")
			}]
		})
	},
	createLabel: function(a) {
		this.setLabel(a)
	},
	updateLabels: function() {
		["cat_all", "cat_dls", "cat_com", "cat_act", "cat_iac", "cat_nlb"].each(function(a) {
			$(a + "_c").set("text", this.categories[a])
		}, this)
	},
	catListClick: function(f, d) {
		var e = f.target;
		while (e && e.id !== d && e.tagName !== "LI") {
			e = e.getParent()
		}
		if (!e || !e.id || e.tagName !== "LI") {
			return
		}
		var a = e.id;
		if (a === "cat_nlb") {
			d = "mainCatList-categories"
		}
		var b = (Object.getLength(this.config.activeTorGroups.cat) + Object.getLength(this.config.activeTorGroups.lbl));
		var c = b > 1 && Object.some(this.config.activeTorGroups, function(h) {
			return (a in h)
		});
		if ((Browser.Platform.mac && f.meta) || (!Browser.Platform.mac && f.control)) {
			if (f.isRightClick()) {
				c = false
			}
		} else {
			if (!(f.isRightClick() && c)) {
				this.config.activeTorGroups = {};
				Object.each(this.defConfig.activeTorGroups, function(h, i) {
					this.config.activeTorGroups[i] = {}
				}, this)
			}
			c = false
		}
		var g = (function() {
			this.refreshSelectedTorGroups();
			if (!isGuest && f.isRightClick()) {
				this.trtTable.selectAll(f)
			}
		}).bind(this);
		switch (d) {
			case "mainCatList-categories":
				if (c) {
					delete this.config.activeTorGroups.cat[a]
				} else {
					this.config.activeTorGroups.cat[a] = 1
				}
				g();
				break;
			case "mainCatList-labels":
				if (c) {
					delete this.config.activeTorGroups.lbl[a]
				} else {
					this.config.activeTorGroups.lbl[a] = 1
				}
				g();
				break
		}
	},
	refreshSelectedTorGroups: function() {
		var c;
		var b = this.__refreshSelectedTorGroups_activeTorGroups__;
		if (b) {
			var j = this.config.activeTorGroups;
			var e = 0;
			c = {};
			for (var h in b) {
				c[h] = {}
			}
			for (var h in j) {
				c[h] = {}
			}
			for (var h in b) {
				for (var i in b[h]) {
					if (!(i in j[h])) {
						c[h][i] = -1;
						++e
					}
				}
			}
			for (var h in j) {
				for (var i in j[h]) {
					if (!(i in b[h])) {
						c[h][i] = 1;
						++e
					}
				}
			}
			if (!e) {
				return
			}
		}
		this.__refreshSelectedTorGroups_activeTorGroups__ = Object.merge({}, this.config.activeTorGroups);
		if (!b) {
			c = this.config.activeTorGroups
		}
		var d, k;
		for (var h in c) {
			for (var i in c[h]) {
				k = $(i);
				if (!k) {
					continue
				}
				d = c[h][i];
				if (d > 0) {
					k.addClass("sel")
				} else {
					if (d < 0) {
						k.removeClass("sel")
					}
				}
			}
		}
		if (this.torrentID != "") {
			this.torrentID = "";
			this.clearDetails()
		}
		var a = false;
		for (var g in this.torrents) {
			var f = (!!this.trtTable.rowData[g].hidden === !!this.torrentIsVisible(g));
			if (f) {
				a = true;
				if (this.trtTable.rowData[g].hidden) {
					this.trtTable.unhideRow(g)
				} else {
					this.trtTable.hideRow(g)
				}
			}
		}
		this.trtTable.clearSelection(a);
		this.trtTable.curPage = 0;
		if (a) {
			this.trtTable.requiresRefresh = true;
			this.trtTable.calcSize();
			this.trtTable.restoreScroll();
			this.trtTable.resizePads()
		}
	},
	feedListClick: function(f) {
		ContextMenu.hide();
		var e = ["LI", "DIV"];
		var d = f.target;
		while (d && !e.contains(d.tagName)) {
			d = d.getParent()
		}
		if (!d) {
			return
		}
		switch (d.tagName) {
			case "DIV":
				d = (f.withinScroll(d) ? undefined : $(this.config.activeRssFeeds));
				break
		}
		if (d) {
			var h = Object.getLength(this.config.activeRssFeeds);
			var b = h > 1 && d.id in this.config.activeRssFeeds;
			if ((Browser.Platform.mac && f.meta) || (!Browser.Platform.mac && f.control)) {
				if (f.isRightClick()) {
					b = false
				}
			} else {
				if (!(f.isRightClick() && b)) {
					this.config.activeRssFeeds = {}
				}
				b = false
			}
		}
		if (d) {
			if (b) {
				delete this.config.activeRssFeeds[d.id]
			} else {
				this.config.activeRssFeeds[d.id] = 1
			}
		}
		this.refreshSelectedRSSFeeds();
		if (!isGuest && f.isRightClick()) {
			var c = [
				[L_("DLG_RSSDOWNLOADER_18"), this.showAddEditRSSFeed.bind(this, -1)]
			];
			if (d) {
				var a = ("rssfeed_all" in this.config.activeRssFeeds ? Object.keys(this.rssfeeds) : Object.keys(this.config.activeRssFeeds).map(function(i) {
					return i.replace(/^rssfeed_/, "")
				}));
				var g = (function(i) {
					var j = CONST.RSSFEED_ENABLED;
					return i.every(function(k) {
						return !!this.rssfeeds[k][j]
					}, this)
				}).bind(this)(a);
				if (a.length > 0) {
					c.push([CMENU_SEP]);
					if (a.length === 1) {
						c.push([L_("DLG_RSSDOWNLOADER_19"), this.showAddEditRSSFeed.bind(this, a[0])])
					}
					c = c.concat([
						[L_(g ? "DLG_RSSDOWNLOADER_20" : "DLG_RSSDOWNLOADER_21"), this.rssUpdate.bind(this, {
							id: a,
							enabled: !g
						}, null)],
						[L_("DLG_RSSDOWNLOADER_22"), this.rssUpdate.bind(this, {
							id: a,
							update: 1
						}, null)],
						[L_("DLG_RSSDOWNLOADER_23"), (function(i) {
							DialogManager.popup({
								title: L_("DLG_RSSDOWNLOADER_34"),
								icon: "dlgIcon-Delete",
								message: (i.length > 1 ? L_("DLG_RSSDOWNLOADER_35").replace(/%d/, i.length) : L_("DLG_RSSDOWNLOADER_36").replace(/%s/, this.rssfeeds[i][CONST.RSSFEED_URL].split("|")[0])),
								buttons: [{
									text: L_("DLG_BTN_YES"),
									focus: true,
									click: this.rssRemove.bind(this, i)
								}, {
									text: L_("DLG_BTN_NO")
								}]
							})
						}).bind(this, a)]
					])
				}
			}
			ContextMenu.clear();
			ContextMenu.add.apply(ContextMenu, c);
			ContextMenu.show(f.page)
		}
	},
	refreshSelectedRSSFeeds: function() {
		var b;
		var f = this.__refreshSelectedRSSFeeds_activeRssFeeds__;
		if (f) {
			var a = this.config.activeRssFeeds;
			var c = 0;
			b = {};
			for (var e in f) {
				if (!(e in a)) {
					b[e] = -1
				}
			}
			for (var e in a) {
				b[e] = 1;
				if ($(e)) {
					++c
				}
			}
			if (!c) {
				b = this.config.activeRssFeeds = Object.merge({}, this.defConfig.activeRssFeeds)
			}
		}
		this.__refreshSelectedRSSFeeds_activeRssFeeds__ = Object.merge({}, this.config.activeRssFeeds);
		if (!f) {
			b = this.config.activeRssFeeds
		}
		var g, d;
		for (var e in b) {
			d = $(e);
			if (!d) {
				continue
			}
			g = b[e];
			if (g > 0) {
				d.addClass("sel")
			} else {
				if (g < 0) {
					d.removeClass("sel")
				}
			}
		}
		this.rssfdTable.keepScroll((function() {
			this.rssfdTable.clearRows(true);
			var i = CONST.RSSITEM_TIMESTAMP;
			var j = CONST.RSSITEM_IN_HISTORY;
			var h = Date.now();
			var k = this.config.activeRssFeeds;
			Object.each(this.rssfeeds, function(l, m) {
				if (!k.rssfeed_all && !(("rssfeed_" + m) in k)) {
					return
				}
				l[CONST.RSSFEED_ITEMS].each(function(q, n) {
					var o = m + "_" + n;
					var p = "RSS_Old";
					if (q[j]) {
						p = "RSS_Added"
					} else {
						if (h - 86400000 < q[i]) {
							p = "RSS_New"
						}
					}
					this.rssfdTable.addRow(this.fdDataToRow(q), o, p)
				}, this)
			}, this)
		}).bind(this));
		this.rssfdTable.calcSize();
		this.rssfdTable.resizePads();
		this.rssfdTable.refresh()
	},
	feedAddEditOK: function() {
		var c = parseInt($("aerssfd-id").get("value"), 10);
		var g = this.rssfeeds[c];
		var b = {
			id: (g ? c : -1)
		};
		var d = $("aerssfd-url").get("value");
		var f = $("aerssfd-cookie").get("value");
		var e = $("aerssfd-custom_alias").get("value");
		var h = !!$("aerssfd-use_custom_alias").checked;
		if (f) {
			d += ":COOKIE:" + f
		}
		if (g) {
			var a = g[CONST.RSSFEED_URL].splitLimit("|", 1);
			if (d !== [a[1], a[0]].pick()) {
				b.url = d
			}
			if (!h && !g[CONST.RSSFEED_USE_FEED_TITLE]) {
				e = ""
			}
			if (e !== a[0]) {
				b.name = e
			}
		} else {
			b.url = d;
			if (h) {
				b.name = e
			}
			b.subscribe = !!$("aerssfd-subscribe_1").checked;
			b.smart_ep = !!("aerssfd-smart_ep").checked
		}
		this.rssUpdate(b)
	},
	rssfilterListClick: function(e) {
		ContextMenu.hide();
		var d = ["INPUT", "LI", "DIV"];
		var c = e.target;
		while (c && !d.contains(c.tagName)) {
			c = c.getParent()
		}
		if (!c) {
			return
		}
		switch (c.tagName) {
			case "INPUT":
				return;
				break;
			case "DIV":
				c = (e.withinScroll(c) ? undefined : $(this.rssfilterId));
				break
		}
		if (!c || c.id !== this.rssfilterId) {
			this.switchRSSFilter(c)
		}
		if (!isGuest && e.isRightClick()) {
			var b = [
				[L_("DLG_RSSDOWNLOADER_27"), this.rssfilterUpdate.bind(this, null, (function(f) {
					this.rssfilterId = "rssfilter_" + f.filter_ident
				}).bind(this))]
			];
			if (c) {
				var a = c.id.replace(/^rssfilter_/, "");
				b.push([L_("DLG_RSSDOWNLOADER_28"), (function(f) {
					DialogManager.popup({
						title: "Remove RSS Filter(s)",
						icon: "dlgIcon-Delete",
						message: L_("OV_CONFIRM_DELETE_RSSFILTER").replace(/%s/, this.rssfilters[f][CONST.RSSFILTER_NAME]),
						buttons: [{
							text: L_("DLG_BTN_YES"),
							focus: true,
							click: this.rssfilterRemove.bind(this, f)
						}, {
							text: L_("DLG_BTN_NO")
						}]
					})
				}).bind(this, a)])
			}
			ContextMenu.clear();
			ContextMenu.add.apply(ContextMenu, b);
			ContextMenu.show(e.page)
		}
	},
	rssfilterCheckboxClick: function(c) {
		var b = c.target;
		if (b.tagName !== "INPUT") {
			return
		}
		var a = c.target.id.replace(/^rssfilter_toggle_/, "").toInt()
	},
	rssfilterEdited: function(c) {
		var b = this.rssfilters.EDIT;
		if (!b) {
			$("rssfilter_edit_control").show();
			this.rssfilters.EDIT = b = Array.clone(this.rssfilters[this.rssfilterId.replace(/^rssfilter_/, "")] || [])
		}
		if (c) {
			var a = -1;
			var d = c.target.get("value");
			switch (c.target.id) {
				case "rssfilter_name":
					a = CONST.RSSFILTER_NAME;
					break;
				case "rssfilter_filter":
					a = CONST.RSSFILTER_FILTER;
					break;
				case "rssfilter_not":
					a = CONST.RSSFILTER_NOT_FILTER;
					break;
				case "rssfilter_save_in":
					a = CONST.RSSFILTER_DIRECTORY;
					break;
				case "rssfilter_label":
					a = CONST.RSSFILTER_LABEL;
					break;
				case "rssfilter_feed":
					a = CONST.RSSFILTER_FEED;
					break;
				case "rssfilter_min_interval":
					a = CONST.RSSFILTER_POSTPONE_MODE;
					break;
				case "rssfilter_episode":
					a = CONST.RSSFILTER_EPISODE_FILTER_STR;
					break;
				case "rssfilter_episode_enable":
					a = CONST.RSSFILTER_EPISODE_FILTER;
					d = !!c.target.checked;
					break;
				case "rssfilter_orig_name":
					a = CONST.RSSFILTER_FLAGS;
					d = b[a];
					if (!!c.target.checked) {
						d |= CONST.RSSFILTERFLAG_ORIG_NAME
					} else {
						d &= ~CONST.RSSFILTERFLAG_ORIG_NAME
					}
					break;
				case "rssfilter_add_stopped":
					a = CONST.RSSFILTER_FLAGS;
					d = b[a];
					if (!!c.target.checked) {
						d |= CONST.RSSFILTERFLAG_ADD_STOPPED
					} else {
						d &= ~CONST.RSSFILTERFLAG_ADD_STOPPED
					}
					break;
				case "rssfilter_smart_ep":
					a = CONST.RSSFILTER_FLAGS;
					d = b[a];
					if (!!c.target.checked) {
						d |= CONST.RSSFILTERFLAG_SMART_EP_FILTER
					} else {
						d &= ~CONST.RSSFILTERFLAG_SMART_EP_FILTER
					}
					break;
				case "rssfilter_prio":
					a = CONST.RSSFILTER_FLAGS;
					d = b[a];
					if (!!c.target.checked) {
						d |= CONST.RSSFILTERFLAG_HIGH_PRIORITY
					} else {
						d &= ~CONST.RSSFILTERFLAG_HIGH_PRIORITY
					}
					break
			}
			if (a >= 0) {
				b[a] = d
			}
		}
	},
	rssfilterEditApply: function() {
		var b = this.rssfilters[this.rssfilterId.replace(/^rssfilter_/, "")];
		if (!b) {
			return
		}
		var a = {
			id: b[CONST.RSSFILTER_ID]
		};
		var c = this.rssfilters.EDIT;
		c.each(function(f, d) {
			var e = b[d];
			if (f !== e) {
				switch (d) {
					case CONST.RSSFILTER_NAME:
						a.name = f;
						break;
					case CONST.RSSFILTER_FILTER:
						a.filter = f;
						break;
					case CONST.RSSFILTER_NOT_FILTER:
						a.not = f;
						break;
					case CONST.RSSFILTER_DIRECTORY:
						a.savein = f;
						break;
					case CONST.RSSFILTER_FEED:
						a.feed = f;
						break;
					case CONST.RSSFILTER_QUALITY:
						a.quality = f;
						break;
					case CONST.RSSFILTER_LABEL:
						a.label = f;
						break;
					case CONST.RSSFILTER_POSTPONE_MODE:
						a.postpone_mode = f;
						break;
					case CONST.RSSFILTER_EPISODE_FILTER_STR:
						a.episode = f;
						break;
					case CONST.RSSFILTER_EPISODE_FILTER:
						a.episode_enable = !!f;
						break;
					case CONST.RSSFILTER_FLAGS:
						Object.each({
							orig_name: CONST.RSSFILTERFLAG_ORIG_NAME,
							prio: CONST.RSSFILTERFLAG_HIGH_PRIORITY,
							smart_ep: CONST.RSSFILTERFLAG_SMART_EP_FILTER,
							add_stopped: CONST.RSSFILTERFLAG_ADD_STOPPED
						}, function(i, g) {
							var h = f & i;
							if (h !== (e & i)) {
								a[g] = !!h
							}
						}, this);
						break
				}
			}
		}, this);
		c = null;
		this.rssfilterUpdate(a);
		delete this.rssfilters.EDIT;
		$("rssfilter_edit_control").hide()
	},
	rssfilterEditCancel: function() {
		this.loadRSSFilter(this.rssfilterId.replace(/^rssfilter_/, ""));
		delete this.rssfilters.EDIT;
		$("rssfilter_edit_control").hide()
	},
	rssfilterQualityText: function(a) {
		var b = [L_("DLG_RSSDOWNLOADER_29")];
		if (a !== undefined && a !== CONST.RSSITEMQUALITY_ALL) {
			b = [];
			g_feedItemQlty.each(function(c) {
				if (a & c[1]) {
					b.push(c[0])
				}
			})
		}
		return b.join(",")
	},
	rssfilterToggleQuality: function(b) {
		var a = $("rssfilter_quality");
		a.fireEvent("change");
		var c = this.rssfilters.EDIT[CONST.RSSFILTER_QUALITY];
		if (c === CONST.RSSITEMQUALITY_ALL) {
			c = CONST.RSSITEMQUALITY_NONE
		}
		b |= c;
		this.rssfilters.EDIT[CONST.RSSFILTER_QUALITY] = b;
		a.set("value", this.rssfilterQualityText(b))
	},
	rssfilterQualityClick: function(f) {
		var d = (function(h) {
			return this.rssfilterToggleQuality.bind(this, h)
		}).bind(this);
		var c = [
			[CMENU_CHECK, L_("DLG_RSSDOWNLOADER_29"), d(CONST.RSSITEMQUALITY_ALL)],
			[CMENU_SEP]
		];
		for (var b = 1, a = g_feedItemQlty.length; b < a; ++b) {
			c.push([g_feedItemQlty[b][0], d(g_feedItemQlty[b][1])])
		}
		var e = this.rssfilters.EDIT || this.rssfilters[this.rssfilterId.replace(/^rssfilter_/, "")];
		if (e) {
			var g = e[CONST.RSSFILTER_QUALITY];
			if (g !== CONST.RSSITEMQUALITY_ALL) {
				c[0].shift();
				for (var b = 2, a = c.length; b < a; ++b) {
					if (g & g_feedItemQlty[b - 1][1]) {
						c[b].unshift(CMENU_CHECK)
					}
				}
			}
		}
		ContextMenu.clear();
		ContextMenu.add.apply(ContextMenu, c);
		ContextMenu.show(f.page)
	},
	switchRSSFilter: function(a) {
		var b = this.rssfilterId;
		if ($(b)) {
			$(b).removeClass("sel")
		}
		if (a) {
			a.addClass("sel");
			b = a.id
		} else {
			b = ""
		}
		if (this.rssfilterId !== b) {
			delete this.rssfilters.EDIT;
			$("rssfilter_edit_control").hide()
		}
		this.rssfilterId = b;
		if (!this.rssfilters.EDIT) {
			this.rssfilters.EDIT = 1;
			this.loadRSSFilter(b.replace(/^rssfilter_/, ""));
			delete this.rssfilters.EDIT
		}
	},
	getDirectoryList: function(a) {
		if (undefined === this.settings["webui.uconnect_enable"]) {
			return
		}
		var b = Date.now();
		if (a || !this.dirlist._TIME_ || (b - this.dirlist._TIME_) > (this.limits.minDirListCache * 1000)) {
			this.request("action=list-dirs", (function(c) {
				this.dirlist.empty();
				this.dirlist = c["download-dirs"];
				this.dirlist._TIME_ = b;
				this.loadDirectoryList()
			}).bind(this))
		} else {
			this.loadDirectoryList()
		}
	},
	loadDirectoryList: function() {
		var b = this.dirlist;
		b[0].path = "Default download directory";
		var a = b.map(function(c) {
			return "[" + parseInt(c.available, 10).toFileSize(2, 2) + " free] " + c.path
		});
		_loadComboboxStrings("dlgAdd-basePath", a, $("dlgAdd-basePath").value);
		_loadComboboxStrings("dlgAddURL-basePath", a, $("dlgAddURL-basePath").value)
	},
	getTransferHistory: function(a) {
		if (undefined === this.settings["webui.uconnect_enable"]) {
			return
		}
		var b = Date.now();
		if (a || !this.xferhist._TIME_ || (b - this.xferhist._TIME_) > (this.limits.minXferHistCache * 1000)) {
			this.request("action=getxferhist", (function(c) {
				this.xferhist = c.transfer_history;
				this.xferhist._TIME_ = b;
				this.loadTransferHistory()
			}).bind(this))
		} else {
			this.loadTransferHistory()
		}
	},
	loadTransferHistory: function() {
		var f = this.xferhist;
		var b = L_("ST_CBO_TCAP_PERIODS").split("||");
		var d = ($("multi_day_transfer_limit_span").get("value").toInt() || 0).max(0).min(b.length - 2);
		var g = b[d].toInt();
		var e = this.getAdvSetting("net.limit_excludeslocal");
		var c = 0,
			h = 0;
		for (var a = 0; a < g; a++) {
			c += f.daily_upload[a];
			h += f.daily_download[a];
			if (e) {
				c -= f.daily_local_upload[a];
				c -= f.daily_local_download[a]
			}
		}
		$("total_uploaded_history").set("text", c.toFileSize());
		$("total_downloaded_history").set("text", h.toFileSize());
		$("total_updown_history").set("text", (c + h).toFileSize());
		$("history_period").set("text", L_("DLG_SETTINGS_7_TRANSFERCAP_11").replace(/%d/, g))
	},
	resetTransferHistory: function() {
		if (undefined === this.settings["webui.uconnect_enable"]) {
			return
		}
		this.request("action=resetxferhist")
	},
	getSettings: function(b) {
		var a = (function(c) {
			this.addSettings(c, b)
		}).bind(this);
		if (isGuest) {
			a()
		} else {
			this.request("action=getsettings", a)
		}
	},
	addSettings: function(o, m) {
		var g = (function(q) {
			function j(s, u) {
				for (var r in u) {
					var v = typeOf(s[r]);
					var t = typeOf(u[r]);
					if (v === t) {
						if (v === "object") {
							j(s[r], u[r])
						} else {
							s[r] = u[r]
						}
					} else {
						if (!has(s, r)) {
							s[r] = u[r]
						}
					}
				}
			}
			var i = this.config;
			q = q || {};
			j(i, q);
			i.activeRssFeeds = q.activeRssFeeds || this.defConfig.activeRssFeeds || {};
			i.activeTorGroups = q.activeTorGroups || this.defConfig.activeTorGroups || {};
			if (i.activeSettingsPane) {
				this.stpanes.show(i.activeSettingsPane.replace(/^tab_/, ""))
			}
			this.trtTable.setConfig({
				colSort: [i.torrentTable.sIndex, i.torrentTable.reverse],
				colMask: i.torrentTable.colMask,
				colOrder: i.torrentTable.colOrder,
				colWidth: this.config.torrentTable.colWidth
			});
			this.prsTable.setConfig({
				colSort: [i.peerTable.sIndex, i.peerTable.reverse],
				colMask: i.peerTable.colMask,
				colOrder: i.peerTable.colOrder,
				colWidth: i.peerTable.colWidth
			});
			this.flsTable.setConfig({
				colSort: [i.fileTable.sIndex, i.fileTable.reverse],
				colMask: i.fileTable.colMask,
				colOrder: i.fileTable.colOrder,
				colWidth: i.fileTable.colWidth
			});
			if (!isGuest) {
				this.rssfdTable.setConfig({
					colSort: [i.feedTable.sIndex, i.feedTable.reverse],
					colMask: i.feedTable.colMask,
					colOrder: i.feedTable.colOrder,
					colWidth: i.feedTable.colWidth
				})
			}
			this.tableSetMaxRows(i.maxRows);
			resizeUI()
		}).bind(this);
		if (isGuest) {
			g()
		} else {
			var k = 0;
			for (var h = 0, f = o.settings.length; h < f; h++) {
				var n = o.settings[h][CONST.SETTING_NAME],
					d = o.settings[h][CONST.SETTING_TYPE],
					c = o.settings[h][CONST.SETTING_VALUE],
					l = o.settings[h][CONST.SETTING_PARAMS] || {};
				if (n === "webui.cookie") {
					g(JSON.decode(c, true));
					continue
				}
				switch (d) {
					case CONST.SETTINGTYPE_INTEGER:
						c = c.toInt();
						break;
					case CONST.SETTINGTYPE_BOOLEAN:
						c = ("true" === c);
						break
				}
				switch (n) {
					case "multi_day_transfer_mode_ul":
						if (c) {
							k = 0
						}
						break;
					case "multi_day_transfer_mode_dl":
						if (c) {
							k = 1
						}
						break;
					case "multi_day_transfer_mode_uldl":
						if (c) {
							k = 2
						}
						break;
					case "gui.alternate_color":
						this.tableUseAltColor(c);
						break;
					case "gui.graph_legend":
						this.spdGraph.showLegend(c);
						break;
					case "gui.graphic_progress":
						this.tableUseProgressBar(c);
						break;
					case "gui.log_date":
						Logger.setLogDate(c);
						break;
					case "bt.transp_disposition":
						$("enable_bw_management").checked = !!(c & CONST.TRANSDISP_UTP);
						break
				}
				if (CONST.SETTINGPARAM_ACCESS_RO === l.access) {
					var p = $(n);
					if (p) {
						p.addClass("disabled")
					}
				}
				this.settings[n] = c;
				_unhideSetting(n)
			}
			this.settings.multi_day_transfer_mode = k;
			this.settings.sched_table = [this.settings.sched_table, "033000330020000000000000300303003222000000000000000303003020000000000000033003003111010010100101000303003101011010100111300303003101010110100001033020330111010010110111"].pick();
			this.settings.search_list_sel = [this.settings.search_list_sel, 0].pick();
			this.settings.search_list = [this.settings.search_list, "BitTorrent|http://www.bittorrent.com/search?client=%v&search=\r\nGoogle|http://google.com/search?q=filetype%3Atorrent+\r\nMininova|http://www.mininova.org/search/?cat=0&search=\r\nVuze|http://search.vuze.com/xsearch/?q="].pick();
			delete o.settings
		}
		if (!(this.config.lang in LANG_LIST)) {
			var a = "";
			for (var b in LANG_LIST) {
				a += "|" + b
			}
			var e = (navigator.language ? navigator.language : navigator.userLanguage || "").replace("-", "");
			if ((e = e.match(new RegExp(a.substr(1), "i")))) {
				e = e[0]
			}
			if (e && (e in LANG_LIST)) {
				this.config.lang = e
			} else {
				this.config.lang = (this.defConfig.lang || "en")
			}
		}
		loadLangStrings({
			lang: this.config.lang,
			onload: (function() {
				if (!isGuest) {
					this.loadSettings()
				}
				if (m) {
					m()
				}
			}).bind(this)
		})
	},
	getAdvSetting: function(a) {
		if (a in this.advOptTable.rowData) {
			return this.advOptTable.rowData[a].data[1]
		}
	},
	setAdvSetting: function(a, b) {
		if (undefined != b && (a in this.advOptTable.rowData)) {
			this.advOptTable.rowData[a].data[1] = b;
			this.advOptTable.updateCell(a, 1)
		}
	},
	getCookieItem: function(a) {
		if (a in this.ckMgrTable.rowData) {
			return this.ckMgrTable.rowData[a].data[1]
		}
	},
	setCookieItem: function(b, a) {
		if (undefined != a) {
			if (b in this.ckMgrTable.rowData) {
				this.ckMgrTable.rowData[b].data[1] = a;
				this.ckMgrTable.updateCell(b, 1)
			} else {
				this.ckMgrTable.addRow([b, a], b)
			}
		}
	},
	loadSettings: function() {
		this.props.multi = {
			trackers: 0,
			ulrate: 0,
			dlrate: 0,
			superseed: 0,
			dht: 0,
			pex: 0,
			seed_override: 0,
			seed_ratio: 0,
			seed_time: 0,
			ulslots: 0
		};
		this.advOptTable.clearSelection();
		this.advOptSelect();
		$each(this.advSettings, function(e, d) {
			if (undefined != this.settings[d]) {
				if (undefined != this.getAdvSetting(d)) {
					this.setAdvSetting(d, this.settings[d])
				} else {
					this.advOptTable.addRow([d, this.settings[d]], d)
				}
			}
		}, this);
		this.ckMgrTable.clearRows();
		this.ckMgrSelect();
		$each(this.config.urlCookies, function(d) {
			if (d) {
				this.setCookieItem(d.domain, d.data)
			}
		}, this);
		for (var b in this.settings) {
			var c = $(b);
			if (!c) {
				continue
			}
			var a = this.settings[b];
			if (c.type == "checkbox") {
				c.checked = !!a
			} else {
				switch (b) {
					case "seed_ratio":
						a /= 10;
						break;
					case "seed_time":
						a /= 60;
						break
				}
				c.set("value", a)
			}
			c.fireEvent("change");
			if (Browser.ie) {
				c.fireEvent("click")
			}
		}["useSysFont", "showDetails", "showCategories", "showToolbar", "showStatusBar", "updateInterval", "lang"].each(function(e) {
			var f;
			if (!(f = $("webui." + e))) {
				return
			}
			var d = this.config[e];
			if (f.type == "checkbox") {
				f.checked = ((d == 1) || (d == true))
			} else {
				f.set("value", d)
			}
		}, this);
		if (this.config.maxRows < this.limits.minTableRows) {
			value = (this.config.maxRows <= 0 ? 0 : this.limits.minTableRows)
		}
		$("webui.maxRows").set("value", this.config.maxRows);
		this.toggleSystemFont(this.config.useSysFont);
		if (!this.config.showToolbar && !isGuest) {
			$("mainToolbar").hide()
		}
		if (!this.config.showCategories) {
			$("mainCatList").hide()
		}
		if (!this.config.showDetails) {
			$("mainInfoPane").hide()
		}
		if (!this.config.showDetailsIcons) {
			$("mainInfoPane-tabs").removeClass("icon")
		}
		if (!this.config.showStatusBar) {
			$("mainStatusBar").hide()
		}
		this.toggleSearchBar()
	},
	setSettings: function() {
		var k = null,
			a = false,
			b = false;
		Logger.setLogDate(this.getAdvSetting("gui.log_date"));
		k = ($("webui.updateInterval").get("value").toInt() || 0);
		if (k < this.limits.minUpdateInterval) {
			k = this.limits.minUpdateInterval;
			$("webui.updateInterval").set("value", k)
		}
		if (this.config.updateInterval != k) {
			this.beginPeriodicUpdate(k);
			b = true
		}
		k = $("webui.showToolbar").checked;
		if (this.config.showToolbar != k) {
			this.toggleToolbar(k);
			b = true
		}
		k = $("webui.showCategories").checked;
		if (this.config.showCategories != k) {
			this.toggleCatPanel(k);
			b = true
		}
		k = $("webui.showDetails").checked;
		if (this.config.showDetails != k) {
			this.toggleDetPanel(k);
			b = true
		}
		k = $("webui.showStatusBar").checked;
		if (this.config.showStatusBar != k) {
			this.toggleStatusBar(k);
			b = true
		}
		k = $("webui.lang").get("value");
		if (this.config.lang != k) {
			this.config.lang = k;
			loadLangStrings({
				lang: k
			});
			b = true
		}
		k = ($("webui.maxRows").get("value").toInt() || 0);
		if (k < this.limits.minTableRows) {
			k = (k <= 0 ? 0 : this.limits.minTableRows);
			$("webui.maxRows").set("value", k)
		}
		if (this.config.maxRows != k) {
			this.tableSetMaxRows(k);
			b = true
		}
		k = $("webui.useSysFont").checked;
		if (this.config.useSysFont != k) {
			this.toggleSystemFont(k);
			b = true
		}
		var n = [];
		for (var d in this.ckMgrTable.rowData) {
			n.push({
				domain: d,
				data: (this.getCookieItem(d) || "")
			})
		}
		var q = false;
		var o = this.config.urlCookies;
		if (n.length === o.length) {
			function r(s, i) {
				if (s.domain < i.domain) {
					return -1
				}
				if (s.domain > i.domain) {
					return 1
				}
				return 0
			}
			o.sort(r);
			n.sort(r);
			for (var e = 0, j = o.length; e < j; ++e) {
				if (!o[e] || o[e].domain !== n[e].domain || o[e].data !== n[e].data) {
					q = true;
					break
				}
			}
		} else {
			q = true
		}
		if (q) {
			this.config.urlCookies = n;
			b = true
		}
		var h = "";
		if (b && Browser.opera) {
			h = "&s=webui.cookie&v=" + JSON.encode(this.config)
		}
		k = $("gui.speed_in_title").checked;
		if (!k && !!this.settings["gui.speed_in_title"] != k) {
			document.title = g_winTitle
		}
		k = $("gui.alternate_color").checked;
		if (!!this.settings["gui.alternate_color"] != k) {
			this.tableUseAltColor(k)
		}
		k = this.getAdvSetting("gui.graph_legend");
		if (undefined != k && !!this.settings["gui.graph_legend"] != k) {
			this.spdGraph.showLegend(k)
		}
		k = this.getAdvSetting("gui.graphic_progress");
		if (undefined != k && !!this.settings["gui.graphic_progress"] != k) {
			this.tableUseProgressBar(k)
		}
		k = this.getAdvSetting("gui.tall_category_list");
		for (var m in this.settings) {
			var p = $(m);
			if (!p) {
				continue
			}
			var l = this.settings[m],
				g;
			if (p.type == "checkbox") {
				g = p.checked ? 1 : 0
			} else {
				g = p.get("value")
			}
			switch (m) {
				case "seed_ratio":
					g *= 10;
					break;
				case "seed_time":
					g *= 60;
					break;
				case "search_list":
					g = g.split("\n").map(function(i) {
						return i.replace(/[\r\n]+/g, "")
					}).join("\r\n");
					break
			}
			if (l != g) {
				this.settings[m] = g;
				if (m == "multi_day_transfer_mode") {
					h += "&s=multi_day_transfer_mode_ul&v=" + (g == 0 ? 1 : 0) + "&s=multi_day_transfer_mode_dl&v=" + (g == 1 ? 1 : 0) + "&s=multi_day_transfer_mode_uldl&v=" + (g == 2 ? 1 : 0);
					continue
				}
				h += "&s=" + m + "&v=" + encodeURIComponent(g)
			}
		}
		for (var m in this.advSettings) {
			var g = this.getAdvSetting(m);
			if (g === undefined) {
				continue
			}
			var l = this.settings[m];
			if (l != g) {
				this.settings[m] = g;
				if (typeOf(g) == "boolean") {
					g = g ? 1 : 0
				}
				h += "&s=" + m + "&v=" + encodeURIComponent(g)
			}
		}
		if (h != "") {
			this.request("action=setsetting" + h, Function.from(), !a)
		}
		if (this.settings["webui.enable"] == 0) {
			Overlay.msg("WebUI was disabled. Goodbye.");
			return
		}
		var c = Number(window.location.port ? window.location.port : (window.location.protocol == "http:" ? 80 : 443));
		var f = Number(((this.settings["webui.enable_listen"] === undefined || this.settings["webui.enable_listen"]) && this.settings["webui.port"]) || this.settings.bind_port);
		if (f && (c !== f)) {
			this.endPeriodicUpdate();
			Overlay.msg('<p>&micro;Torrent has been configured to use a listening port for WebUI different from the port on which it is currently being viewed.</p><p>How do you wish to proceed?</p><ul><li><a href="' + changePort(f) + '">Reload</a> on the new port</li><li><a href="#" onclick="utWebUI.beginPeriodicUpdate(); Overlay.hide(); return false;">Ignore</a> the port change</li></ul>')
		} else {
			if (a) {
				window.location.reload(true)
			}
		}
		this.toggleSearchBar();
		resizeUI()
	},
	showAbout: function() {
		DialogManager.show("About")
	},
	showAddEditRSSFeed: function(a) {
		var e = this.rssfeeds[a] || [];
		var d = (e[CONST.RSSFEED_URL] || "").splitLimit("|", 1);
		var f = ![e[CONST.RSSFEED_USE_FEED_TITLE], true].pick();
		var b = [d[1], d[0]].pick().splitLimit(":COOKIE:", 1);
		var c = d[0];
		$("aerssfd-id").set("value", a);
		$("aerssfd-url").set("value", b[0]);
		$("aerssfd-cookie").set("value", (b[1] || ""));
		$("aerssfd-custom_alias").set("value", c);
		$("aerssfd-use_custom_alias").set("checked", f).fireEvent("change");
		if (e.length <= 0) {
			$("dlgAddEditRSSFeed-head").set("text", L_("DLG_RSSDOWNLOADER_32"));
			$("dlgAddEditRSSFeed-subscription").show();
			$("aerssfd-subscribe_0").set("checked", true).fireEvent("click");
			$("aerssfd-subscribe_1").set("checked", false);
			$("aerssfd-smart_ep").set("checked", false)
		} else {
			$("dlgAddEditRSSFeed-head").set("text", L_("DLG_RSSDOWNLOADER_33"));
			$("dlgAddEditRSSFeed-subscription").hide()
		}
		DialogManager.show("AddEditRSSFeed");
		$("aerssfd-url").select();
		$("aerssfd-url").focus()
	},
	showAddTorrent: function() {
		DialogManager.show("Add")
	},
	showAddURL: function() {
		DialogManager.show("AddURL")
	},
	showResetUI: function(a) {
		DialogManager.show("ResetUI");
		$("RESET_UI_OK").focus()
	},
	showRSSDownloader: function() {
		DialogManager.show("RSSDownloader")
	},
	showSettings: function() {
		DialogManager.show("Settings")
	},
	resetUI: function() {
		var a;
		if (!$("dlgResetUI-everything").checked) {
			a = [];
			$$(".reset-subopt").each(function(b) {
				if (!!b.checked) {
					a.push(String(b.get("id")).replace(/dlgResetUI-/, ""))
				}
			})
		}
		utWebUI.performResetUI(a)
	},
	performResetUI: function(b) {
		if (b) {
			if (!b.length) {
				return
			}
			var a = this.config;
			b.each(function(d) {
				var c = this.resetConfigMap[d];
				if (c) {
					c.each(function(e) {
						delete a[e]
					})
				}
			}, this)
		} else {
			this.config = {}
		}
		Overlay.msg("Reloading WebUI...");
		window.removeEvents("unload");
		this.saveConfig(false, function() {
			window.location.reload(false)
		})
	},
	searchExecute: function() {
		var c = encodeURIComponent($("query").get("value"));
		var b = (this.settings.search_list_sel || 0);
		var a = (this.settings.search_list || "").split("\r\n");
		a = a.map(function(d) {
			if (d && (d = d.splitLimit("|", 1)[1])) {
				if (!d.test(/%s/)) {
					d += "%s"
				}
				return d.replace(/%v/, "utWebUI").replace(/%s/, c)
			}
		}).filter($chk);
		if (a[b]) {
			openURL(a[b])
		}
	},
	searchMenuSet: function(a) {
		this.request("action=setsetting&s=search_list_sel&v=" + a);
		this.settings.search_list_sel = a;
		$("query").focus()
	},
	searchMenuShow: function(e) {
		var d = (this.settings.search_list_sel || 0);
		var c = (this.settings.search_list || "").split("\r\n");
		c = c.map(function(g) {
			if (g) {
				return (g.split("|")[0] || "").replace(/ /g, "&nbsp;")
			} else {
				return ""
			}
		});
		ContextMenu.clear();
		var a = 0;
		Array.each(c, function(g) {
			if (!g) {
				ContextMenu.add([CMENU_SEP])
			} else {
				if (a == d) {
					ContextMenu.add([CMENU_SEL, g])
				} else {
					ContextMenu.add([g, this.searchMenuSet.bind(this, a)])
				}++a
			}
		}, this);
		var f = e.getPosition(),
			b = e.getSize();
		f.x += b.x / 2;
		f.y += b.y / 2;
		ContextMenu.show(f)
	},
	generateSpeedList: function(k, b) {
		var e = Math.log(3);
		k = parseInt(k, 10) || 0;
		b = parseInt(b || 15, 10) || 0;
		if (b < 5) {
			b = 5
		}
		var d = (k <= 0 ? 3 : (Math.log(k) / e));
		var c = (d / b);
		var j = (k > 0 ? [k] : []);
		var h = 0;
		for (var g = 1, a = (d - 2).max(0); g <= b; ++g, a += c) {
			var f = g * Math.round(Math.pow(2, a));
			if (f < k) {
				j.unshift(k - f);
				++h
			}
			j.push(k + f)
		}
		for (var g = (b / 2) - 1; h > 0 && j[h] > 0 && g > 0; --g) {
			--h
		}
		return [0, -1].concat(j.slice(h, h + b))
	},
	statusMenuShow: function(b) {
		var a = [
			[CMENU_CHILD, L_("MM_FILE"), [
				[L_("MM_FILE_ADD_TORRENT"), this.showAddTorrent.bind(this)],
				[L_("MM_FILE_ADD_URL"), this.showAddURL.bind(this)]
			]],
			[CMENU_CHILD, L_("MM_OPTIONS"), [
				[L_("MM_OPTIONS_PREFERENCES"), this.showSettings.bind(this)],
				[L_("OV_TB_RSSDOWNLDR"), this.showRSSDownloader.bind(this)],
				[CMENU_SEP],
				[L_("MM_OPTIONS_SHOW_TOOLBAR"), this.toggleToolbar.bind(this, undefined)],
				[L_("MM_OPTIONS_SHOW_DETAIL"), this.toggleDetPanel.bind(this, undefined)],
				[L_("MM_OPTIONS_SHOW_STATUS"), this.toggleStatusBar.bind(this, undefined)],
				[L_("MM_OPTIONS_SHOW_CATEGORY"), this.toggleCatPanel.bind(this, undefined)],
				[CMENU_SEP],
				[L_("MM_OPTIONS_TAB_ICONS"), this.toggleDetPanelIcons.bind(this, undefined)]
			]],
			[CMENU_CHILD, L_("MM_HELP"), [
				[L_("MM_HELP_UT_WEBPAGE"), openURL.pass(["http://www.utorrent.com/", null])],
				[L_("MM_HELP_UT_FORUMS"), openURL.pass(["http://forum.utorrent.com/", null])],
				[CMENU_SEP],
				[L_("MM_HELP_WEBUI_FEEDBACK"), openURL.pass(["http://forum.utorrent.com/viewtopic.php?id=58156", null])],
				[CMENU_SEP],
				[L_("MM_HELP_ABOUT_WEBUI"), this.showAbout.bind(this)]
			]],
			[CMENU_SEP],
			[CMENU_CHILD, L_("STM_TORRENTS"), [
				[L_("STM_TORRENTS_PAUSEALL"), this.pauseAll.bind(this)],
				[L_("STM_TORRENTS_RESUMEALL"), this.unpauseAll.bind(this)]
			]]
		];
		if (this.config.showToolbar) {
			a[1][2][3].unshift(CMENU_CHECK)
		}
		if (this.config.showDetails) {
			a[1][2][4].unshift(CMENU_CHECK)
		}
		if (this.config.showStatusBar) {
			a[1][2][5].unshift(CMENU_CHECK)
		}
		if (this.config.showCategories) {
			a[1][2][6].unshift(CMENU_CHECK)
		}
		if (this.config.showDetailsIcons) {
			a[1][2][8].unshift(CMENU_CHECK)
		}
		ContextMenu.clear();
		ContextMenu.add.apply(ContextMenu, a);
		ContextMenu.show(b.page)
	},
	statusSpeedMenuShow: function(b, a) {
		if (!a.isRightClick()) {
			return true
		}
		b.set = b.set || Function.from();
		b.cur = parseInt(b.cur, 10) || 0;
		switch (typeOf(b.list)) {
			case "string":
				b.list = b.list.split(",");
			case "array":
				b.list = b.list.map(function(c) {
					return String.from(c).trim()
				});
				break;
			default:
				b.list = this.generateSpeedList(b.cur)
		}
		ContextMenu.clear();
		b.list.each(function(d) {
			d = parseInt(d, 10);
			if (isNaN(d)) {
				return
			}
			var c;
			switch (d) {
				case -1:
					c = [CMENU_SEP];
					break;
				case 0:
					c = [L_("MENU_UNLIMITED")];
					break;
				default:
					if (d < 0) {
						d *= -1
					}
					c = [d + " " + L_("SIZE_KB") + g_perSec]
			}
			if (d === b.cur) {
				c.unshift(CMENU_SEL)
			} else {
				c.push(b.set.pass(d))
			}
			ContextMenu.add(c)
		});
		ContextMenu.show(a.page)
	},
	setSpeedDownload: function(a) {
		this.request("action=setsetting&s=max_dl_rate&v=" + a, (function() {
			this.settings.max_dl_rate = a;
			$("max_dl_rate").set("value", a);
			this.updateStatusBar()
		}).bind(this))
	},
	setSpeedUpload: function(a) {
		this.request("action=setsetting&s=max_ul_rate&v=" + a, (function() {
			this.settings.max_ul_rate = a;
			$("max_ul_rate").set("value", a);
			this.updateStatusBar()
		}).bind(this))
	},
	statusDownloadMenuShow: function(a) {
		return this.statusSpeedMenuShow({
			set: this.setSpeedDownload.bind(this),
			cur: this.settings.max_dl_rate,
			list: !!this.settings["gui.manual_ratemenu"] && this.settings["gui.dlrate_menu"]
		}, a)
	},
	statusUploadMenuShow: function(a) {
		return this.statusSpeedMenuShow({
			set: this.setSpeedUpload.bind(this),
			cur: this.settings.max_ul_rate,
			list: !!this.settings["gui.manual_ratemenu"] && this.settings["gui.ulrate_menu"]
		}, a)
	},
	toolbarChevronShow: function(d) {
		var b = [];
		var a = $("mainToolbar");
		a.getElements(".inchev").each(function(f) {
			if (f.getPosition(a).y >= a.getHeight()) {
				if (f.hasClass("separator")) {
					b.push([CMENU_SEP])
				} else {
					var g = [f.get("title")];
					if (!f.hasClass("disabled")) {
						g[1] = function(h) {
							h.target = f;
							f.fireEvent("click", h)
						}
					}
					b.push(g)
				}
			}
		});
		while (b.length > 0 && b[0][0] === CMENU_SEP) {
			b.shift()
		}
		ContextMenu.clear();
		if (b.length > 0) {
			ContextMenu.add.apply(ContextMenu, b);
			var e = d.getPosition(),
				c = d.getSize();
			e.y += c.y - 2;
			ContextMenu.show(e)
		}
	},
	trtDataToRow: function(a) {
		return this.trtColDefs.map(function(b) {
			switch (b.id) {
				case "added":
					return a[CONST.TORRENT_DATE_ADDED] * 1000;
				case "availability":
					return a[CONST.TORRENT_AVAILABILITY];
				case "completed":
					return a[CONST.TORRENT_DATE_COMPLETED] * 1000;
				case "done":
					return a[CONST.TORRENT_PROGRESS];
				case "downloaded":
					return a[CONST.TORRENT_DOWNLOADED];
				case "downspeed":
					return a[CONST.TORRENT_DOWNSPEED];
				case "eta":
					return a[CONST.TORRENT_ETA];
				case "label":
					return a[CONST.TORRENT_LABEL];
				case "name":
					return a[CONST.TORRENT_NAME];
				case "order":
					return a[CONST.TORRENT_QUEUE_POSITION];
				case "peers":
					return a[CONST.TORRENT_PEERS_CONNECTED] + " (" + a[CONST.TORRENT_PEERS_SWARM] + ")";
				case "ratio":
					return a[CONST.TORRENT_RATIO];
				case "remaining":
					return a[CONST.TORRENT_REMAINING];
				case "seeds":
					return a[CONST.TORRENT_SEEDS_CONNECTED] + " (" + a[CONST.TORRENT_SEEDS_SWARM] + ")";
				case "seeds_peers":
					return (a[CONST.TORRENT_PEERS_SWARM]) ? (a[CONST.TORRENT_SEEDS_SWARM] / a[CONST.TORRENT_PEERS_SWARM]) : Number.MAX_VALUE;
				case "size":
					return a[CONST.TORRENT_SIZE];
				case "status":
					return [a[CONST.TORRENT_STATUS], a[CONST.TORRENT_STATUS_MESSAGE]];
				case "uploaded":
					return a[CONST.TORRENT_UPLOADED];
				case "upspeed":
					return a[CONST.TORRENT_UPSPEED];
				case "url":
					return a[CONST.TORRENT_DOWNLOAD_URL] || ""
			}
		}, this)
	},
	trtFormatRow: function(c, d) {
		var f = $chk(d);
		var a = (f ? (d + 1) : c.length);
		var g = this.trtColDoneIdx,
			b = this.trtColStatusIdx;
		if (!f || d == b) {
			var h = this.getStatusInfo(c[b][0], c[g]);
			c[b] = (h[0] === "Status_Error" ? c[b][1] || h[1] : h[1])
		}
		for (var e = (d || 0); e < a; e++) {
			switch (this.trtColDefs[e].id) {
				case "added":
				case "completed":
				case "label":
				case "name":
				case "peers":
				case "seeds":
				case "status":
				case "url":
					break;
				case "availability":
					c[e] = (c[e] / 65536).toFixedNR(3);
					break;
				case "done":
					c[e] = (c[e] / 10).toFixedNR(1) + "%";
					break;
				case "downloaded":
				case "uploaded":
					c[e] = c[e].toFileSize();
					break;
				case "downspeed":
				case "upspeed":
					c[e] = (c[e] >= 103) ? (c[e].toFileSize() + g_perSec) : "";
					break;
				case "eta":
					c[e] = (c[e] == 0) ? "" : (c[e] == -1) ? "\u221E" : c[e].toTimeDelta();
					break;
				case "ratio":
					c[e] = (c[e] == -1) ? "\u221E" : (c[e] / 1000).toFixedNR(3);
					break;
				case "order":
					c[e] = (c[e] <= -1) ? "*" : c[e];
					break;
				case "remaining":
					c[e] = (c[e] >= 103) ? c[e].toFileSize(2) : "";
					break;
				case "seeds_peers":
					c[e] = ($chk(c[e]) && (c[e] != Number.MAX_VALUE)) ? c[e].toFixedNR(3) : "\u221E";
					break;
				case "size":
					c[e] = c[e].toFileSize(2);
					break
			}
		}
		if (f) {
			return c[d]
		} else {
			return c
		}
	},
	trtSortCustom: function(b, d, c) {
		var a = 0;
		switch (this.trtColDefs[b].id) {
			case "status":
				var f = d[b][0],
					e = c[b][0];
				a = ((e & CONST.STATE_ERROR) - (f & CONST.STATE_ERROR));
				if (!a) {
					a = ((e & CONST.STATE_CHECKING) - (f & CONST.STATE_CHECKING));
					if (!a) {
						a = ((e & CONST.STATE_STARTED) - (f & CONST.STATE_STARTED));
						if (!a) {
							a = ((e & CONST.STATE_PAUSED) - (f & CONST.STATE_PAUSED));
							if (!a) {
								a = ((e & CONST.STATE_QUEUED) - (f & CONST.STATE_QUEUED));
								if (!a) {
									a = ((d[this.trtColDoneIdx] === 1000) - (c[this.trtColDoneIdx] === 1000))
								}
							}
						}
					}
				}
				break
		}
		return a
	},
	trtSelect: function(a, c) {
		this.updateToolbar();
		var b = this.trtTable.selectedRows;
		if (b.length === 0) {
			this.torrentID = "";
			this.clearDetails();
			return
		}
		this.torrentID = c;
		if (this.config.showDetails) {
			this.showDetails(c)
		}
		if (!isGuest && a.isRightClick()) {
			this.showTrtMenu.delay(0, this, [a, c])
		}
	},
	trtDblClk: function(c) {
		if (!isGuest && this.trtTable.selectedRows.length == 1) {
			var a = this.torrents[c];
			var b = parseInt((a[CONST.TORRENT_PROGRESS] == 1000 ? this.settings["gui.dblclick_seed"] : this.settings["gui.dblclick_dl"]), 10) || CONST.TOR_DBLCLK_SHOW_PROPS;
			switch (b) {
				case CONST.TOR_DBLCLK_SHOW_PROPS:
					this.showProperties();
					break;
				default:
					this.perform((a[CONST.TORRENT_STATUS] & (CONST.STATE_STARTED | CONST.STATE_QUEUED)) ? "stop" : "start")
			}
		}
	},
	showTrtMenu: function(d, g) {
		if (!d.isRightClick()) {
			return
		}
		var b = [];
		var e = CONST.TORRENT_LABEL;
		var f = [
			[L_("OV_NEW_LABEL"), this.newLabel.bind(this)]
		];
		if (!this.trtTable.selectedRows.every(function(h) {
				return (this.torrents[h][e] == "")
			}, this)) {
			f.push([L_("OV_REMOVE_LABEL"), this.setLabel.bind(this, "")])
		}
		if (Object.getLength(this.labels) > 0) {
			f.push([CMENU_SEP]);
			$each(this.labels, function(i, h) {
				if (this.trtTable.selectedRows.every(function(j) {
						return (this.torrents[j][e] == h)
					}, this)) {
					f.push([CMENU_SEL, h])
				} else {
					f.push([h, this.setLabel.bind(this, h)])
				}
			}, this)
		}
		var a = {
			forcestart: [L_("ML_FORCE_START"), this.forcestart.bind(this)],
			start: [L_("ML_START"), this.start.bind(this)],
			pause: [L_("ML_PAUSE"), this.pause.bind(this)],
			stop: [L_("ML_STOP"), this.stop.bind(this)],
			queueup: [L_("ML_QUEUEUP"), (function(h) {
				this.queueup(h.shift)
			}).bind(this)],
			queuedown: [L_("ML_QUEUEDOWN"), (function(h) {
				this.queuedown(h.shift)
			}).bind(this)],
			label: [CMENU_CHILD, L_("ML_LABEL"), f],
			remove: [L_("ML_REMOVE"), this.remove.bind(this, CONST.TOR_REMOVE)],
			removeand: [CMENU_CHILD, L_("ML_REMOVE_AND"), [
				[L_("ML_DELETE_TORRENT"), this.remove.bind(this, CONST.TOR_REMOVE_TORRENT)],
				[L_("ML_DELETE_DATATORRENT"), this.remove.bind(this, CONST.TOR_REMOVE_DATATORRENT)],
				[L_("ML_DELETE_DATA"), this.remove.bind(this, CONST.TOR_REMOVE_DATA)]
			]],
			recheck: [L_("ML_FORCE_RECHECK"), this.recheck.bind(this)],
			copymagnet: [L_("ML_COPY_MAGNETURI"), this.torShowMagnetCopy.bind(this)],
			copy: [L_("MENU_COPY"), this.torShowCopy.bind(this)],
			properties: [L_("ML_PROPERTIES"), this.showProperties.bind(this)]
		};
		var c = this.getDisabledActions();
		Object.each(c, function(i, h) {
			var j = a[h];
			if (!j) {
				return
			}
			if (i) {
				delete j[1]
			}
		});
		b = b.concat([a.forcestart, a.start, a.pause, a.stop, [CMENU_SEP], a.queueup, a.queuedown, a.label, [CMENU_SEP], a.remove, a.removeand, [CMENU_SEP], a.recheck, [CMENU_SEP], a.copymagnet, a.copy, [CMENU_SEP], a.properties]);
		ContextMenu.clear();
		ContextMenu.add.apply(ContextMenu, b);
		ContextMenu.show(d.page)
	},
	torShowCopy: function() {
		this.showCopy(L_("MENU_COPY"), this.trtTable.copySelection())
	},
	torShowMagnetCopy: function() {
		var a = [];
		this.trtTable.getSortedSelection().each(function(b) {
			a.push("magnet:?xt=urn:btih:" + b + "&dn=" + encodeURIComponent(this.torrents[b][CONST.TORRENT_NAME]))
		}, this);
		this.showCopy(L_("ML_COPY_MAGNETURI"), a.join("\r\n"))
	},
	showCopy: function(b, a) {
		DialogManager.popup({
			title: b,
			icon: "dlgIcon-Copy",
			width: "35em",
			input: a,
			buttons: [{
				text: L_("DLG_BTN_CLOSE")
			}]
		})
	},
	showProperties: function(a) {
		var b = this.trtTable.selectedRows.length;
		if (b <= 0) {
			return
		}
		this.propID = (b > 1) ? "multi" : this.trtTable.selectedRows[0];
		if (this.propID != "multi") {
			this.request("action=getprops&hash=" + this.propID, this.loadProperties)
		} else {
			this.updateMultiProperties()
		}
	},
	loadProperties: function(b) {
		var c = b.props[0],
			d = this.propID;
		if (!has(this.props, d)) {
			this.props[d] = {}
		}
		for (var a in c) {
			this.props[d][a] = c[a]
		}
		this.updateProperties()
	},
	updateMultiProperties: function() {
		$("prop-trackers").value = "";
		$("prop-ulrate").value = "";
		$("prop-dlrate").value = "";
		$("prop-ulslots").value = "";
		$("prop-seed_ratio").value = "";
		$("prop-seed_time").value = "";
		$("prop-superseed").checked = "";
		var b = $("prop-seed_override");
		b.checked = false;
		b.disabled = true;
		b.fireEvent(Browser.ie ? "click" : "change");
		$("DLG_TORRENTPROP_1_GEN_11").addStopEvent("click", function(c) {
			b.disabled = !b.disabled
		});
		var a = {
			superseed: 17,
			dht: 18,
			pex: 19
		};
		Object.each(a, function(d, c) {
			var f = $("prop-" + c);
			f.disabled = true;
			f.checked = false;
			$("DLG_TORRENTPROP_1_GEN_" + d).removeClass("disabled").addStopEvent("click", function(e) {
				f.disabled = !f.disabled
			})
		});
		$("dlgProps-head").set("text", "|[" + this.trtTable.selectedRows.length + " Torrents]| - " + L_("DLG_TORRENTPROP_00"));
		DialogManager.show("Props")
	},
	updateProperties: function() {
		var d = this.props[this.propID];
		$("prop-trackers").value = d.trackers;
		$("prop-ulrate").value = (d.ulrate / 1024).toInt();
		$("prop-dlrate").value = (d.dlrate / 1024).toInt();
		$("prop-ulslots").value = d.ulslots;
		var e = $("prop-seed_override");
		e.disabled = false;
		e.checked = !!d.seed_override;
		e.fireEvent(Browser.ie ? "click" : "change");
		$("prop-seed_ratio").value = d.seed_ratio / 10;
		$("prop-seed_time").value = d.seed_time / 60;
		$("prop-superseed").checked = d.superseed;
		var c = {
			superseed: 17,
			dht: 18,
			pex: 19
		};
		for (var b in c) {
			var a = (d[b] == -1);
			if (b == "dht") {
				a = !this.settings.dht_per_torrent
			}
			e = $("prop-" + b);
			e.disabled = a;
			e.checked = (d[b] == 1);
			$("DLG_TORRENTPROP_1_GEN_" + c[b])[a ? "addClass" : "removeClass"]("disabled")
		}
		$("dlgProps-head").set("text", this.torrents[this.propID][CONST.TORRENT_NAME] + " - " + L_("DLG_TORRENTPROP_00"));
		DialogManager.show("Props")
	},
	setProperties: function() {
		var g = ("multi" === this.propID);
		var d = this.props[this.propID];
		var f = "";
		for (var c in d) {
			var e = $("prop-" + c);
			if (!e) {
				continue
			}
			var b = d[c],
				a;
			if (!g && (b == -1) && ((c == "dht") || (c == "pex"))) {
				continue
			}
			if (e.type == "checkbox") {
				if (g && e.disabled) {
					continue
				}
				a = e.checked ? 1 : 0
			} else {
				a = e.get("value");
				if (g && (a == "")) {
					continue
				}
			}
			switch (c) {
				case "seed_ratio":
					a *= 10;
					break;
				case "seed_time":
					a *= 60;
					break;
				case "dlrate":
				case "ulrate":
					a *= 1024;
					break;
				case "trackers":
					a = a.split("\n").map(function(h) {
						return h.replace(/[\r\n]+/g, "")
					}).join("\r\n");
					break
			}
			if (g || b != a) {
				f += "&s=" + c + "&v=" + encodeURIComponent(a);
				if (!g) {
					d[c] = a
				}
			}
		}
		if (g) {
			[11, 17, 18, 19].each(function(h) {
				$("DLG_TORRENTPROP_1_GEN_" + h).removeEvents("click")
			})
		}
		this.propID = "";
		if (f != "") {
			this.request("action=setprops&hash=" + this.trtTable.selectedRows.join(f + "&hash=") + f)
		}
	},
	showDetails: function(b) {
		var a = (b !== undefined);
		if (a) {
			this.torrentID = b
		} else {
			b = this.torrentID
		}
		if (!(this.config || {}).showDetails) {
			return
		}
		switch (this.mainTabs.active) {
			case "mainInfoPane-generalTab":
				this.updateDetails(b);
				break;
			case "mainInfoPane-peersTab":
				this.getPeers(b, a);
				break;
			case "mainInfoPane-filesTab":
				this.getFiles(b, a);
				break
		}
	},
	clearDetails: function() {
		["rm", "dl", "ul", "ra", "us", "ds", "se", "pe", "sa", "hs"].each(function(a) {
			$(a).set("html", "")
		});
		this.prsTable.clearRows();
		this.flsTable.clearRows()
	},
	updateDetails: function(b) {
		if (!b) {
			return
		}
		var a = this.torrents[b];
		$("dl").set("html", a[CONST.TORRENT_DOWNLOADED].toFileSize());
		$("ul").set("html", a[CONST.TORRENT_UPLOADED].toFileSize());
		$("ra").set("html", (a[CONST.TORRENT_RATIO] == -1) ? "\u221E" : (a[CONST.TORRENT_RATIO] / 1000).toFixedNR(3));
		$("us").set("html", a[CONST.TORRENT_UPSPEED].toFileSize() + g_perSec);
		$("ds").set("html", a[CONST.TORRENT_DOWNSPEED].toFileSize() + g_perSec);
		$("rm").set("html", (a[CONST.TORRENT_ETA] == 0) ? "" : (a[CONST.TORRENT_ETA] <= -1) ? "\u221E" : a[CONST.TORRENT_ETA].toTimeDelta());
		$("se").set("html", L_("GN_XCONN").replace(/%d/, a[CONST.TORRENT_SEEDS_CONNECTED]).replace(/%d/, a[CONST.TORRENT_SEEDS_SWARM]).replace(/%d/, "\u00BF?"));
		$("pe").set("html", L_("GN_XCONN").replace(/%d/, a[CONST.TORRENT_PEERS_CONNECTED]).replace(/%d/, a[CONST.TORRENT_PEERS_SWARM]).replace(/%d/, "\u00BF?"));
		$("sa").set("html", a[CONST.TORRENT_SAVE_PATH] || "");
		$("hs").set("html", b)
	},
	addFile: function(g, c) {
		var e = Array.from(g.file);
		if (e.length <= 0) {
			return
		}
		var d = 0;
		var b = (function() {
			if (++d === e.length) {
				c()
			}
		});
		var a = "action=add-file";
		var f;
		if ((f = (parseInt(g.dir, 10) || 0))) {
			a += "&download_dir=" + f
		}
		if ((f = (g.sub || ""))) {
			a += "&path=" + encodeURIComponent(f)
		}
		Array.each(e, function(h) {}, this)
	},
	addRSSFeedItem: function(a, c) {
		var b = this.getRSSFeedItem(a, c);
		if (b) {
			this.addURL({
				url: b[CONST.RSSITEM_URL]
			})
		}
	},
	addURL: function(h, d) {
		var f = Array.from(h.url).map(function(i) {
			return (i && typeof(i) === "string" ? i.trim() : undefined)
		}, this).clean();
		if (f.length <= 0) {
			return
		}
		var e = 0;
		var c = d ? (function() {
			if (++e === f.length) {
				d()
			}
		}) : undefined;
		var g, b, a = "";
		if ((g = (h.cookie || "").trim())) {
			b = g
		}
		if ((g = (parseInt(h.dir, 10) || 0))) {
			a += "&download_dir=" + g
		}
		if ((g = (h.sub || ""))) {
			a += "&path=" + encodeURIComponent(g)
		}
		Array.each(f, function(j) {
			if (!j) {
				return
			}
			var i;
			if (!((b === null) || (typeof(b) === "string"))) {
				i = this.retrieveURLCookie(j)
			}
			j = encodeURIComponent(j + (b || i ? ":COOKIE:" + (b || i) : ""));
			this.request("action=add-url&s=" + j + a, c)
		}, this)
	},
	retrieveURLCookie: function(b) {
		if (!b || (b.indexOf(":COOKIE:") >= 0)) {
			return ""
		}
		var f = (this.config.urlCookies || []);
		var e = {
			domain: ""
		};
		for (var d = 0, a = f.length; d < a; ++d) {
			var c = f[d];
			if (c && c.data && (c.domain.length > e.domain.length)) {
				if ((new RegExp("^[A-Za-z]+://([^/]*\\.|)" + c.domain + "(/|$)")).test(b)) {
					e = c
				}
			}
		}
		return (e.data || "")
	},
	loadPeers: function() {
		this.prsTable.keepScroll((function() {
			this.prsTable.clearRows(true);
			var a = this.torrentID;
			if (a === this.peerlist._ID_) {
				this.peerlist.each(function(d, c) {
					var b = a + "_" + d[CONST.PEER_IP].replace(/[\.:]/g, "_") + "_" + d[CONST.PEER_PORT];
					this.prsTable.addRow(this.prsDataToRow(d), b, "country country_" + d[CONST.PEER_COUNTRY])
				}, this)
			}
		}).bind(this));
		this.prsTable.calcSize();
		this.prsTable.resizePads();
		this.prsTable.refresh()
	},
	getPeers: function(c, a) {
		if (undefined === this.settings["webui.uconnect_enable"]) {
			return
		}
		if (c === undefined) {
			c = this.torrentID
		}
		if (!c) {
			return
		}
		var b = Date.now();
		if (a || this.peerlist._ID_ !== c || !this.peerlist._TIME_ || (b - this.peerlist._TIME_) > (this.limits.minPeerListCache * 1000)) {
			this.request("action=getpeers&hash=" + c, (function(f) {
				this.peerlist.empty();
				var d = f.peers;
				if (d) {
					for (var e = 0; e < d.length; e += 2) {
						if (d[e] === c) {
							this.peerlist = d[e + 1];
							break
						}
					}
				}
				this.peerlist._TIME_ = b;
				this.peerlist._ID_ = c;
				this.loadPeers()
			}).bind(this))
		} else {}
	},
	loadFiles: function() {
		this.flsTable.keepScroll((function() {
			this.flsTable.clearRows(true);
			var a = this.torrentID;
			if (a === this.filelist._ID_) {
				this.filelist.each(function(c, b) {
					this.flsTable.addRow(this.flsDataToRow(c), a + "_" + b)
				}, this)
			}
		}).bind(this));
		this.flsTable.calcSize();
		this.flsTable.resizePads();
		this.flsTable.refresh()
	},
	getFiles: function(c, a) {
		if (c === undefined) {
			c = this.torrentID
		}
		if (!c) {
			return
		}
		var b = Date.now();
		if (a || this.filelist._ID_ !== c || !this.filelist._TIME_ || (b - this.filelist._TIME_) > (this.limits.minFileListCache * 1000)) {
			this.request("action=getfiles&hash=" + c, (function(e) {
				this.filelist.empty();
				var f = e.files;
				if (f) {
					for (var d = 0; d < f.length; d += 2) {
						if (f[d] === c) {
							this.filelist = f[d + 1];
							break
						}
					}
				}
				this.filelist._TIME_ = b;
				this.filelist._ID_ = c;
				this.loadFiles()
			}).bind(this))
		} else {}
	},
	flsDataToRow: function(a) {
		return this.flsColDefs.map(function(b) {
			switch (b.id) {
				case "done":
					return a[CONST.FILE_DOWNLOADED];
				case "firstpc":
					return a[CONST.FILE_FIRST_PIECE];
				case "name":
					return a[CONST.FILE_NAME];
				case "numpcs":
					return a[CONST.FILE_NUM_PIECES];
				case "pcnt":
					return a[CONST.FILE_DOWNLOADED] / a[CONST.FILE_SIZE] * 1000;
				case "prio":
					return a[CONST.FILE_PRIORITY];
				case "size":
					return a[CONST.FILE_SIZE]
			}
		}, this)
	},
	flsFormatRow: function(b, c) {
		var e = $chk(c);
		var a = (e ? (c + 1) : b.length);
		for (var d = (c || 0); d < a; d++) {
			switch (this.flsColDefs[d].id) {
				case "name":
					break;
				case "done":
				case "size":
					b[d] = b[d].toFileSize(2);
					break;
				case "firstpc":
				case "numpcs":
					b[d] = [b[d], ""].pick();
					break;
				case "pcnt":
					b[d] = (b[d] / 10).toFixedNR(1) + "%";
					break;
				case "prio":
					b[d] = L_("FI_PRI" + b[d]);
					break
			}
		}
		if (e) {
			return b[c]
		} else {
			return b
		}
	},
	flsSelect: function(a, b) {
		if (a.isRightClick() && this.flsTable.selectedRows.length > 0) {
			this.showFileMenu.delay(0, this, a)
		}
	},
	showFileMenu: function(k) {
		if (isGuest || !k.isRightClick()) {
			return
		}
		var b = this.torrentID;
		var n = this.getSelFileIds();
		if (n.length <= 0) {
			return
		}
		var a = [];
		var g = [
			[L_("MF_DONT"), this.setPriority.pass([b, CONST.FILEPRIORITY_SKIP], this)],
			[CMENU_SEP],
			[L_("MF_LOW"), this.setPriority.pass([b, CONST.FILEPRIORITY_LOW], this)],
			[L_("MF_NORMAL"), this.setPriority.pass([b, CONST.FILEPRIORITY_NORMAL], this)],
			[L_("MF_HIGH"), this.setPriority.pass([b, CONST.FILEPRIORITY_HIGH], this)]
		];
		var c = this.filelist[n[0]][CONST.FILE_PRIORITY];
		for (var f = 1, d = n.length; f < d; ++f) {
			if (c != this.filelist[n[f]][CONST.FILE_PRIORITY]) {
				c = -1;
				break
			}
		}
		if (c >= 0) {
			if (c > 0) {
				++c
			}
			delete g[c][1]
		}
		a = a.concat(g.reverse());
		var m = [
			[CMENU_SEP],
			[L_("MF_GETFILE"), this.downloadFiles.bind(this, b)]
		];
		var j = false;
		for (var f = 0, d = n.length; f < d; ++f) {
			var e = this.filelist[n[f]];
			if (e[CONST.FILE_DOWNLOADED] == e[CONST.FILE_SIZE]) {
				j = true;
				break
			}
		}
		if (!j) {
			delete m[1][1]
		}
		var h = this.filelist[n[0]];
		if (n.length > 1 || h[CONST.FILE_DOWNLOADED] != h[CONST.FILE_SIZE]) {}
		a = a.concat(m);
		a = a.concat([
			[CMENU_SEP],
			[L_("MENU_COPY"), this.flsShowCopy.bind(this)]
		]);
		ContextMenu.clear();
		ContextMenu.add.apply(ContextMenu, a);
		ContextMenu.show(k.page)
	},
	flsShowCopy: function() {
		this.showCopy(L_("MENU_COPY"), this.flsTable.copySelection())
	},
	getSelFileIds: function() {
		var c = [];
		var a = this.flsTable.selectedRows.length;
		while (a--) {
			var d = this.flsTable.selectedRows[a];
			var b = d.match(/.*_([0-9]+)$/)[1].toInt();
			c.push(b)
		}
		return c
	},
	downloadFiles: function(c) {
		var b = this.getSelFileIds();
		var a = [];
		$each(b, function(e) {
			var d = this.filelist[e];
			if (d[CONST.FILE_DOWNLOADED] == d[CONST.FILE_SIZE]) {
				a.push(e)
			}
		}, this);
		if (a.length <= 0) {
			return
		}
		this.proxyFiles(this.torrents[c][CONST.TORRENT_STREAM_ID], a, false)
	},
	setPriority: function(c, b) {
		var a = this.getSelFileIds().filter(function(d) {
			return (this.filelist[d][CONST.FILE_PRIORITY] != b)
		}, this);
		if (a.length <= 0) {
			return
		}
		this.request("action=setprio&hash=" + c + "&p=" + b + "&f=" + a.join("&f="), (function() {
			$each(a, function(d) {
				var e = c + "_" + d;
				this.filelist[d][CONST.FILE_PRIORITY] = b;
				this.flsTable.rowData[e].data[this.flsColPrioIdx] = b;
				this.flsTable.updateCell(e, this.flsColPrioIdx)
			}, this)
		}).bind(this))
	},
	trtColReset: function() {
		var a = {
			colMask: 0,
			colOrder: this.trtColDefs.map(function(c, b) {
				return b
			}),
			colWidth: this.trtColDefs.map(function(c, b) {
				return c.width
			})
		};
		this.trtColDefs.each(function(c, b) {
			if (!!c.hidden) {
				a.colMask |= (1 << b)
			}
		});
		this.trtTable.setConfig(a);
		Object.append(this.config.torrentTable, a);
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	trtSort: function(b, a) {
		this.config.torrentTable.sIndex = b;
		this.config.torrentTable.reverse = a;
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	trtColMove: function() {
		this.config.torrentTable.colOrder = this.trtTable.colOrder;
		this.config.torrentTable.sIndex = this.trtTable.sIndex;
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	trtColResize: function() {
		this.config.torrentTable.colWidth = this.trtTable.getColumnWidths();
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	trtColToggle: function(d, c, b) {
		var a = 1 << d;
		if (c) {
			this.config.torrentTable.colMask |= a
		} else {
			this.config.torrentTable.colMask &= ~a
		}
		if (!b && Browser.opera) {
			this.saveConfig(true)
		}
	},
	showGeneralMenu: function(b) {
		if (isGuest || !b.isRightClick()) {
			return
		}
		var a = [
			[L_("MENU_COPY"), this.showCopy.bind(this, L_("MENU_COPY"), b.target.get("text"))]
		];
		ContextMenu.clear();
		ContextMenu.add.apply(ContextMenu, a);
		ContextMenu.show(b.page);
		b.stopPropagation()
	},
	prsColMove: function() {
		this.config.peerTable.colOrder = this.prsTable.colOrder;
		this.config.peerTable.sIndex = this.prsTable.sIndex;
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	prsColReset: function() {
		var a = {
			colMask: 0,
			colOrder: this.prsColDefs.map(function(c, b) {
				return b
			}),
			colWidth: this.prsColDefs.map(function(c, b) {
				return c.width
			})
		};
		this.prsColDefs.each(function(c, b) {
			if (!!c.hidden) {
				a.colMask |= (1 << b)
			}
		});
		this.prsTable.setConfig(a);
		Object.append(this.config.peerTable, a);
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	prsColResize: function() {
		this.config.peerTable.colWidth = this.prsTable.getColumnWidths();
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	prsColToggle: function(d, c, b) {
		var a = 1 << d;
		if (c) {
			this.config.peerTable.colMask |= a
		} else {
			this.config.peerTable.colMask &= ~a
		}
		if (!b && Browser.opera) {
			this.saveConfig(true)
		}
	},
	prsDataToRow: function(a) {
		return this.prsColDefs.map(function(b) {
			switch (b.id) {
				case "ip":
					return (((this.settings.resolve_peerips && a[CONST.PEER_REVDNS]) || a[CONST.PEER_IP]) + (a[CONST.PEER_UTP] ? " [uTP]" : ""));
				case "port":
					return a[CONST.PEER_PORT];
				case "client":
					return a[CONST.PEER_CLIENT];
				case "flags":
					return a[CONST.PEER_FLAGS];
				case "pcnt":
					return a[CONST.PEER_PROGRESS];
				case "relevance":
					return a[CONST.PEER_RELEVANCE];
				case "downspeed":
					return a[CONST.PEER_DOWNSPEED];
				case "upspeed":
					return a[CONST.PEER_UPSPEED];
				case "reqs":
					return a[CONST.PEER_REQS_OUT] + "|" + a[CONST.PEER_REQS_IN];
				case "waited":
					return a[CONST.PEER_WAITED];
				case "uploaded":
					return a[CONST.PEER_UPLOADED];
				case "downloaded":
					return a[CONST.PEER_DOWNLOADED];
				case "hasherr":
					return a[CONST.PEER_HASHERR];
				case "peerdl":
					return a[CONST.PEER_PEERDL];
				case "maxup":
					return a[CONST.PEER_MAXUP];
				case "maxdown":
					return a[CONST.PEER_MAXDOWN];
				case "queued":
					return a[CONST.PEER_QUEUED];
				case "inactive":
					return a[CONST.PEER_INACTIVE]
			}
		}, this)
	},
	prsFormatRow: function(b, c) {
		var e = $chk(c);
		var a = (e ? (c + 1) : b.length);
		for (var d = (c || 0); d < a; d++) {
			switch (this.prsColDefs[d].id) {
				case "ip":
				case "port":
				case "client":
				case "flags":
				case "reqs":
					break;
				case "pcnt":
				case "relevance":
					b[d] = (b[d] / 10).toFixedNR(1) + "%";
					break;
				case "uploaded":
				case "downloaded":
				case "hasherr":
				case "queued":
					b[d] = (b[d] > 103) ? b[d].toFileSize() : "";
					break;
				case "downspeed":
				case "upspeed":
				case "peerdl":
				case "maxup":
				case "maxdown":
					b[d] = (b[d] > 103) ? (b[d].toFileSize() + g_perSec) : "";
					break;
				case "waited":
				case "inactive":
					b[d] = (b[d] == 0) ? "" : (b[d] == -1) ? "\u221E" : b[d].toTimeDelta();
					break
			}
		}
		if (e) {
			return b[c]
		} else {
			return b
		}
	},
	toggleResolveIP: function() {
		this.settings.resolve_peerips = !this.settings.resolve_peerips;
		this.request("action=setsetting&s=resolve_peerips&v=" + (this.settings.resolve_peerips ? 1 : 0), (function() {
			if (this.torrentID != "") {
				this.getPeers(this.torrentID, true)
			}
		}).bind(this))
	},
	prsSelect: function(a, b) {
		if (a.isRightClick()) {
			this.showPeerMenu.delay(0, this, a)
		}
	},
	showPeerMenu: function(b) {
		if (isGuest || !b.isRightClick()) {
			return
		}
		var a = [
			[L_("MP_RESOLVE_IPS"), this.toggleResolveIP.bind(this)],
			[CMENU_SEP],
			[L_("MENU_COPY"), this.prsShowCopy.bind(this)]
		];
		if (this.settings.resolve_peerips) {
			a[0].unshift(CMENU_CHECK)
		}
		ContextMenu.clear();
		ContextMenu.add.apply(ContextMenu, a);
		ContextMenu.show(b.page)
	},
	prsShowCopy: function() {
		this.showCopy(L_("MENU_COPY"), this.prsTable.copySelection())
	},
	prsSort: function(b, a) {
		this.config.peerTable.sIndex = b;
		this.config.peerTable.reverse = a;
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	flsColReset: function() {
		var a = {
			colMask: 0,
			colOrder: this.flsColDefs.map(function(c, b) {
				return b
			}),
			colWidth: this.flsColDefs.map(function(c, b) {
				return c.width
			})
		};
		this.flsColDefs.each(function(c, b) {
			if (!!c.hidden) {
				a.colMask |= (1 << b)
			}
		});
		this.flsTable.setConfig(a);
		Object.append(this.config.fileTable, a);
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	flsSort: function(b, a) {
		this.config.fileTable.sIndex = b;
		this.config.fileTable.reverse = a;
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	flsColMove: function() {
		this.config.fileTable.colOrder = this.flsTable.colOrder;
		this.config.fileTable.sIndex = this.flsTable.sIndex;
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	flsColResize: function() {
		this.config.fileTable.colWidth = this.flsTable.getColumnWidths();
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	flsColToggle: function(d, c, b) {
		var a = 1 << d;
		if (c) {
			this.config.fileTable.colMask |= a
		} else {
			this.config.fileTable.colMask &= ~a
		}
		if (!b && Browser.opera) {
			this.saveConfig(true)
		}
	},
	flsDblClk: function(c) {
		if (isGuest) {
			return
		}
		if (this.flsTable.selectedRows.length != 1) {
			return
		}
		var a = c.match(/^(.*?)_.*$/)[1];
		var b = c.replace(a + "_", "").toInt() || 0;
		this.setPriority(a, (this.filelist[b][CONST.FILE_PRIORITY] + 1) % 4)
	},
	advOptDataToRow: function(a) {
		return this.advOptColDefs.map(function(b) {
			switch (b.id) {
				case "name":
					return a[0];
				case "value":
					return a[2]
			}
		}, this)
	},
	advOptFormatRow: function(b, c) {
		var d = $chk(c);
		var a = (d ? (c + 1) : b.length);
		if (d) {
			return b[c]
		} else {
			return b
		}
	},
	advOptColReset: function() {
		var a = {
			colMask: 0,
			colOrder: this.advOptColDefs.map(function(c, b) {
				return b
			}),
			colWidth: this.advOptColDefs.map(function(c, b) {
				return c.width
			})
		};
		this.advOptColDefs.each(function(c, b) {
			if (!!c.hidden) {
				a.colMask |= (1 << b)
			}
		});
		this.advOptTable.setConfig(a)
	},
	advOptSelect: function(c, e) {
		var d = this.getAdvSetting(e);
		var b = $("dlgSettings-advBool-cont");
		var a = $("dlgSettings-advText-cont");
		if (undefined != d) {
			if (typeOf(d) == "boolean") {
				b.setStyle("display", "inline");
				a.setStyle("display", "none");
				$("dlgSettings-adv" + (d ? "True" : "False")).checked = true
			} else {
				b.setStyle("display", "none");
				a.setStyle("display", "inline");
				$("dlgSettings-advText").value = d
			}
		} else {
			b.setStyle("display", "none");
			a.setStyle("display", "none")
		}
	},
	advOptDblClk: function(b) {
		var a = this.getAdvSetting(b);
		if (undefined != a) {
			if (typeOf(a) == "boolean") {
				$("dlgSettings-adv" + (a ? "False" : "True")).checked = true;
				this.advOptChanged()
			}
		}
	},
	advOptChanged: function() {
		var a = this.advOptTable.selectedRows;
		if (a.length > 0) {
			var b = a[0];
			switch (typeOf(this.getAdvSetting(b))) {
				case "boolean":
					this.setAdvSetting(b, $("dlgSettings-advTrue").checked);
					break;
				case "number":
					this.setAdvSetting(b, $("dlgSettings-advText").value.toInt() || 0);
					break;
				case "string":
					this.setAdvSetting(b, $("dlgSettings-advText").value);
					break
			}
			if (b == "bt.transp_disposition") {
				$("enable_bw_management").checked = !!(this.getAdvSetting("bt.transp_disposition") & CONST.TRANSDISP_UTP)
			}
		}
	},
	ckMgrFormatRow: function(b, c) {
		var d = $chk(c);
		var a = (d ? (c + 1) : b.length);
		if (d) {
			return b[c]
		} else {
			return b
		}
	},
	ckMgrColReset: function() {
		var a = {
			colMask: 0,
			colOrder: this.ckMgrColDefs.map(function(c, b) {
				return b
			}),
			colWidth: this.ckMgrColDefs.map(function(c, b) {
				return c.width
			})
		};
		this.ckMgrColDefs.each(function(c, b) {
			if (!!c.hidden) {
				a.colMask |= (1 << b)
			}
		});
		this.ckMgrTable.setConfig(a)
	},
	ckMgrSelect: function(a, c) {
		var b = this.getCookieItem(c);
		if (undefined != b) {
			$("dlgSettings-cookieDomain").value = c;
			$("dlgSettings-cookieData").value = b
		} else {
			$("dlgSettings-cookieDomain").value = "";
			$("dlgSettings-cookieData").value = ""
		}
		if (a && a.isRightClick() && this.ckMgrTable.selectedRows.length > 0) {
			this.showCookieMenu.delay(0, this, a)
		}
	},
	showCookieMenu: function(d) {
		if (isGuest || !d.isRightClick()) {
			return
		}
		var a = this.ckMgrTable.selectedRows;
		if (a.length <= 0) {
			return
		}
		var c = [];
		var b = [
			["Delete", this.deleteCookies.bind(this)]
		];
		c = c.concat(b);
		c = c.concat([
			[CMENU_SEP],
			[L_("MENU_COPY"), this.ckMgrShowCopy.bind(this)]
		]);
		ContextMenu.clear();
		ContextMenu.add.apply(ContextMenu, c);
		ContextMenu.show(d.page)
	},
	ckMgrShowCopy: function() {
		this.showCopy(L_("MENU_COPY"), this.ckMgrTable.copySelection())
	},
	deleteCookies: function() {
		this.ckMgrTable.selectedRows.each(function(a) {
			this.ckMgrTable.removeRow(a)
		}, this);
		this.ckMgrTable.refreshRows();
		this.ckMgrSelect()
	},
	ckMgrChanged: function() {
		var b = $("dlgSettings-cookieDomain").get("value");
		var a = $("dlgSettings-cookieData").get("value");
		this.setCookieItem(b, a);
		this.ckMgrTable.refreshRows();
		this.ckMgrTable.scrollTo(b);
		this.ckMgrTable.selectRow(DOMEvent, {
			id: b
		})
	},
	saveConfig: function(a, b) {
		if (isGuest) {
			return
		}
		this.request("action=setsetting&s=webui.cookie&v=" + JSON.encode(this.config), b || null, a || false)
	},
	updateStatusBar: function() {
		var d, a, c, b;
		d = "";
		a = L_("SB_DOWNLOAD").replace(/%z/, this.totalDL.toFileSize());
		c = "";
		b = this.settings.max_dl_rate || 0;
		if (this.settings["gui.limits_in_statusbar"] && b > 0) {
			c = "[" + b + " " + L_("SIZE_KB") + g_perSec + "] "
		}
		a = a.replace(/%s/, c);
		d += a;
		$("mainStatusBar-download").set("text", d);
		d = "";
		a = L_("SB_UPLOAD").replace(/%z/, this.totalUL.toFileSize());
		c = "";
		b = this.settings.max_ul_rate || 0;
		if (this.settings["gui.limits_in_statusbar"] && b > 0) {
			c = "[" + b + " " + L_("SIZE_KB") + g_perSec + "] "
		}
		a = a.replace(/%s/, c);
		d += a;
		$("mainStatusBar-upload").set("text", d)
	},
	updateTitle: function() {
		var a = L_("MAIN_TITLEBAR_SPEED").replace(/%s/, this.totalDL.toFileSize() + g_perSec).replace(/%s/, this.totalUL.toFileSize() + g_perSec);
		window.status = window.defaultStatus = a.replace(/%s/, "");
		if (this.settings["gui.speed_in_title"]) {
			document.title = a.replace(/%s/, g_winTitle)
		}
	},
	getDisabledActions: function() {
		var c = {
			forcestart: 1,
			pause: 1,
			queuedown: 1,
			queueup: 1,
			remove: 1,
			start: 1,
			stop: 1
		};
		var e = this.trtTable.selectedRows;
		if (e.length > 0) {
			var b = 0,
				d = Number.MAX_VALUE,
				a = -Number.MAX_VALUE;
			e.each(function(l) {
				var j = this.torrents[l];
				var f = j[CONST.TORRENT_QUEUE_POSITION],
					k = j[CONST.TORRENT_STATUS];
				var g = !!(k & CONST.STATE_STARTED),
					i = !!(k & CONST.STATE_CHECKING),
					h = !!(k & CONST.STATE_PAUSED),
					m = !!(k & CONST.STATE_QUEUED);
				if (f > 0) {
					++b;
					if (f < d) {
						d = f
					}
					if (a < f) {
						a = f
					}
				}
				if ((!g || m || h) && !i) {
					c.forcestart = 0
				}
				if (!(m || i) || h) {
					c.start = 0
				}
				if (!h && (i || g || m)) {
					c.pause = 0
				}
				if (i || g || m) {
					c.stop = 0
				}
			}, this);
			if (b < a) {
				c.queueup = 0
			}
			if (d <= this.torQueueMax - b) {
				c.queuedown = 0
			}
			c.remove = 0
		}
		return c
	},
	updateToolbar: function() {
		if (isGuest) {
			return
		}
		var a = this.getDisabledActions();
		Object.each(a, function(c, b) {
			var d = $(b);
			if (!d) {
				return
			}
			if (c) {
				d.addClass("disabled")
			} else {
				d.removeClass("disabled")
			}
		})
	},
	toggleCatPanel: function(a) {
		a = (a === undefined ? !this.config.showCategories : !!a);
		$("mainCatList")[a ? "show" : "hide"]();
		$("webui.showCategories").checked = a;
		this.config.showCategories = a;
		resizeUI();
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	toggleDetPanel: function(a) {
		a = (a === undefined ? !this.config.showDetails : !!a);
		$("mainInfoPane")[a ? "show" : "hide"]();
		$("webui.showDetails").checked = a;
		this.config.showDetails = a;
		this.detPanelTabChange();
		resizeUI();
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	toggleDetPanelIcons: function(a) {
		a = (a === undefined ? !this.config.showDetailsIcons : !!a);
		$("mainInfoPane-tabs")[a ? "addClass" : "removeClass"]("icon");
		this.config.showDetailsIcons = a;
		resizeUI();
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	toggleSearchBar: function(a) {
		a = (a === undefined ? !!(this.settings.search_list || "").trim() : !!a);
		$("mainToolbar-searchbar")[a ? "show" : "hide"]()
	},
	toggleStatusBar: function(a) {
		a = (a === undefined ? !this.config.showStatusBar : !!a);
		$("mainStatusBar")[a ? "show" : "hide"]();
		$("webui.showStatusBar").checked = a;
		this.config.showStatusBar = a;
		resizeUI();
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	toggleToolbar: function(a) {
		a = (a === undefined ? !this.config.showToolbar : !!a);
		$("mainToolbar")[a ? "show" : "hide"]();
		$("webui.showToolbar").checked = a;
		this.config.showToolbar = a;
		resizeUI();
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	toggleSystemFont: function(a) {
		a = (a === undefined ? !this.config.useSysFont : !!a);
		document.body[a ? "removeClass" : "addClass"]("nosysfont");
		this.config.useSysFont = a;
		resizeUI();
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	tableSetMaxRows: function(a) {
		var b = this.limits.maxVirtTableRows;
		var c = MODE_PAGE;
		a = a || 0;
		if (a <= 0) {
			c = MODE_VIRTUAL;
			a = 0
		} else {
			if (a < this.limits.minTableRows) {
				a = this.limits.minTableRows
			}
		}
		this.config.maxRows = a;
		this.trtTable.setConfig({
			rowMaxCount: a || b,
			rowMode: c
		});
		this.prsTable.setConfig({
			rowMaxCount: a || b,
			rowMode: c
		});
		this.flsTable.setConfig({
			rowMaxCount: a || b,
			rowMode: c
		});
		if (!isGuest) {
			this.rssfdTable.setConfig({
				rowMaxCount: a || b,
				rowMode: c
			});
			this.advOptTable.setConfig({
				rowMaxCount: a || b,
				rowMode: c
			});
			this.ckMgrTable.setConfig({
				rowMaxCount: a || b,
				rowMode: c
			})
		}
	},
	tableUseAltColor: function(a) {
		this.trtTable.setConfig({
			rowAlternate: a
		});
		this.prsTable.setConfig({
			rowAlternate: a
		});
		this.flsTable.setConfig({
			rowAlternate: a
		});
		if (!isGuest) {
			this.rssfdTable.setConfig({
				rowAlternate: a
			});
			this.advOptTable.setConfig({
				rowAlternate: a
			});
			this.ckMgrTable.setConfig({
				rowAlternate: a
			})
		}
	},
	tableUseProgressBar: function(c) {
		var b = Function.from(c ? TYPE_NUM_PROGRESS : TYPE_NUMBER);
		var e = this.trtColDefs.filter(function(f) {
			return f.type == TYPE_NUM_PROGRESS
		}).map(function(f) {
			return f.id
		});
		var d = this.prsColDefs.filter(function(f) {
			return f.type == TYPE_NUM_PROGRESS
		}).map(function(f) {
			return f.id
		});
		var a = this.flsColDefs.filter(function(f) {
			return f.type == TYPE_NUM_PROGRESS
		}).map(function(f) {
			return f.id
		});
		this.trtTable.setConfig({
			colType: e.map(b).associate(e)
		});
		this.prsTable.setConfig({
			colType: e.map(b).associate(d)
		});
		this.flsTable.setConfig({
			colType: a.map(b).associate(a)
		})
	},
	detPanelTabChange: function(a) {
		if (!(this.config || {}).showDetails) {
			return
		}
		if (a === undefined) {
			a = this.mainTabs.active
		}
		switch (a) {
			case "mainInfoPane-peersTab":
				this.prsTable.calcSize();
				this.prsTable.restoreScroll();
				if (this.torrentID == "") {
					return
				}
				break;
			case "mainInfoPane-filesTab":
				this.flsTable.calcSize();
				this.flsTable.restoreScroll();
				if (this.torrentID == "") {
					return
				}
				break;
			case "mainInfoPane-speedTab":
				this.spdGraph.draw();
				break;
			case "mainInfoPane-loggerTab":
				Logger.scrollBottom();
				break
		}
		this.showDetails(this.torrentID)
	},
	rssDownloaderShow: function(a) {
		this.loadRSSFeedList();
		this.loadRSSFilterList();
		if (a) {
			this.rssDownloaderTabs.onChange()
		}
	},
	rssDownloaderTabChange: function(a) {
		switch (a) {
			case "dlgRSSDownloader-feedsTab":
				this.rssfdTable.calcSize();
				this.rssfdTable.restoreScroll();
				this.rssfdTable.resizePads();
				break;
			case "dlgRSSDownloader-filtersTab":
				break
		}
	},
	settingsPaneChange: function(a) {
		switch (a) {
			case "dlgSettings-TransferCap":
				this.getTransferHistory();
				break;
			case "dlgSettings-Advanced":
				this.advOptTable.calcSize();
				this.advOptTable.restoreScroll();
				this.advOptTable.resizePads();
				break;
			case "dlgSettings-CookieManager":
				this.ckMgrTable.calcSize();
				this.ckMgrTable.restoreScroll();
				this.ckMgrTable.resizePads();
				break
		}
		if (this.config) {
			this.config.activeSettingsPane = a
		}
	},
	fdFormatRow: function(h, d) {
		var b = $chk(d);
		var e = (b ? (d + 1) : h.length);
		for (var c = (d || 0); c < e; c++) {
			switch (this.fdColDefs[c].id) {
				case "date":
				case "fullname":
				case "name":
				case "url":
					break;
				case "codec":
					h[c] = CONST.RSSITEMCODECMAP[h[c]] || ("UNKNOWN CODEC: " + h[c]);
					break;
				case "episode":
					var f = Math.floor(h[c] / 100000000);
					var a = h[c] % 10000;
					var j = Math.floor((h[c] % 100000000) / 10000);
					h[c] = ((f > 0 ? f + "x" : "") + (a > 0 ? a.pad(2) + (j > a ? "-" + j.pad(2) : "") : ""));
					break;
				case "feed":
					var g = this.rssfeeds[h[c]];
					h[c] = g ? g[CONST.RSSFEED_URL].split("|")[0] : "";
					break;
				case "format":
					h[c] = CONST.RSSITEMQUALITYMAP[h[c]] || ("UNKNOWN QUALITY: " + h[c]);
					break
			}
		}
		if (b) {
			return h[d]
		} else {
			return h
		}
	},
	fdDataToRow: function(a) {
		return this.fdColDefs.map(function(b) {
			switch (b.id) {
				case "fullname":
					return a[CONST.RSSITEM_NAME_FULL];
				case "name":
					return a[CONST.RSSITEM_NAME];
				case "episode":
					return ((a[CONST.RSSITEM_SEASON] || 0) * 100000000 + (a[CONST.RSSITEM_EPISODE_TO] || 0) * 10000 + (a[CONST.RSSITEM_EPISODE] || 0));
				case "format":
					return a[CONST.RSSITEM_QUALITY];
				case "codec":
					return a[CONST.RSSITEM_CODEC];
				case "date":
					return a[CONST.RSSITEM_TIMESTAMP] * 1000;
				case "feed":
					return a[CONST.RSSITEM_FEED_ID];
				case "url":
					return a[CONST.RSSITEM_URL]
			}
		}, this)
	},
	fdColReset: function() {
		var a = {
			colMask: 0,
			colOrder: this.fdColDefs.map(function(c, b) {
				return b
			}),
			colWidth: this.fdColDefs.map(function(c, b) {
				return c.width
			})
		};
		this.fdColDefs.each(function(c, b) {
			if (!!c.hidden) {
				a.colMask |= (1 << b)
			}
		});
		this.rssfdTable.setConfig(a);
		Object.append(this.config.feedTable, a);
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	fdColResize: function() {
		this.config.feedTable.colWidth = this.rssfdTable.getColumnWidths();
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	fdColMove: function() {
		this.config.feedTable.colOrder = this.rssfdTable.colOrder;
		this.config.feedTable.sIndex = this.rssfdTable.sIndex;
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	fdColToggle: function(d, c, b) {
		var a = 1 << d;
		if (c) {
			this.config.feedTable.colMask |= a
		} else {
			this.config.feedTable.colMask &= ~a
		}
		if (!b && Browser.opera) {
			this.saveConfig(true)
		}
	},
	fdSort: function(b, a) {
		this.config.feedTable.sIndex = b;
		this.config.feedTable.reverse = a;
		if (Browser.opera) {
			this.saveConfig(true)
		}
	},
	fdSelect: function(a, b) {
		if (a.isRightClick() && this.rssfdTable.selectedRows.length > 0) {
			this.showFeedMenu.delay(0, this, a)
		}
	},
	showFeedMenu: function(c) {
		if (isGuest || !c.isRightClick()) {
			return
		}
		var b = this.getSelFeedItemIds();
		if (b.length <= 0) {
			return
		}
		var a = [
			[L_("DLG_RSSDOWNLOADER_24"), (function(d) {
				d.each(function(e) {
					this.addRSSFeedItem(e[0], e[1])
				}, this)
			}).bind(this, b)],
			[L_("DLG_RSSDOWNLOADER_25"), (function(d) {
				d.each(function(f) {
					var e = this.getRSSFeedItem(f[0], f[1]);
					if (e) {
						openURL(e[CONST.RSSITEM_URL])
					}
				}, this)
			}).bind(this, b)],
			[CMENU_SEP],
			[L_("DLG_RSSDOWNLOADER_26"), (function(d) {
				d.each(function(f) {
					var e = this.getRSSFeedItem(f[0], f[1]);
					if (e) {
						this.rssfilterUpdate({
							id: -1,
							name: e[CONST.RSSITEM_NAME],
							filter: e[CONST.RSSITEM_NAME],
							feed: e[CONST.RSSITEM_FEED_ID]
						})
					}
				}, this)
			}).bind(this, b)],
			[CMENU_SEP],
			[L_("MENU_COPY"), this.fdShowCopy.bind(this)]
		];
		ContextMenu.clear();
		ContextMenu.add.apply(ContextMenu, a);
		ContextMenu.show(c.page)
	},
	fdShowCopy: function() {
		this.showCopy(L_("MENU_COPY"), this.rssfdTable.copySelection())
	},
	getRSSFeedItem: function(a, b) {
		return ((this.rssfeeds[a] || {})[CONST.RSSFEED_ITEMS] || [])[b]
	},
	getSelFeedItemIds: function() {
		var c = [];
		var a = this.rssfdTable.selectedRows.length;
		while (a--) {
			var d = this.rssfdTable.selectedRows[a];
			var b = d.match(/.*?([0-9]+)_([0-9]+)$/).slice(1);
			c.push(b)
		}
		return c
	},
	fdDblClk: function(b) {
		if (this.rssfdTable.selectedRows.length != 1) {
			return
		}
		var a = b.split("_");
		this.addRSSFeedItem(a[0], a[1])
	}
};
