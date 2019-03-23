var Flotr = (function() {
	var c = 0;

	function k(l) {
		return l.map(function(m) {
			return (m.data) ? Object.append(m, {}) : {
				data: m
			}
		})
	}

	function h(p, o, l, m) {
		var s = (l - o) / p;
		var r = g(s);
		var n = s / r;
		var q = 10;
		if (n < 1.5) {
			q = 1
		} else {
			if (n < 2.25) {
				q = 2
			} else {
				if (n < 3) {
					q = ((m == 0) ? 2 : 2.5)
				} else {
					if (n < 7.5) {
						q = 5
					}
				}
			}
		}
		return q * r
	}

	function e(l) {
		return l + ""
	}

	function f(l) {
		return "(" + l.x + ", " + l.y + ")"
	}

	function g(l) {
		return Math.pow(10, Math.floor(Math.log(l) / Math.LN10))
	}

	function j(n) {
		var l;
		if ((l = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(n))) {
			return new b(parseInt(l[1]), parseInt(l[2]), parseInt(l[3]))
		}
		if ((l = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(n))) {
			return new b(parseInt(l[1]), parseInt(l[2]), parseInt(l[3]), parseFloat(l[4]))
		}
		if ((l = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(n))) {
			return new b(parseFloat(l[1]) * 2.55, parseFloat(l[2]) * 2.55, parseFloat(l[3]) * 2.55)
		}
		if ((l = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(n))) {
			return new b(parseFloat(l[1]) * 2.55, parseFloat(l[2]) * 2.55, parseFloat(l[3]) * 2.55, parseFloat(l[4]))
		}
		if ((l = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(n))) {
			return new b(parseInt(l[1], 16), parseInt(l[2], 16), parseInt(l[3], 16))
		}
		if ((l = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(n))) {
			return new b(parseInt(l[1] + l[1], 16), parseInt(l[2] + l[2], 16), parseInt(l[3] + l[3], 16))
		}
		var m = n.trim().toLowerCase();
		if (m == "transparent") {
			return new b(255, 255, 255, 0)
		}
		l = d[m];
		return new b(l[0], l[1], l[2])
	}

	function a(m) {
		var l;
		do {
			l = m.getStyle("background-color").toLowerCase();
			if (!(l == "" || l == "transparent")) {
				break
			}
			m = m.getParent()
		} while (m.nodeName.toLowerCase() != "body");
		return (l == "rgba(0, 0, 0, 0)") ? "transparent" : l
	}

	function b(s, q, m, o) {
		var p = ["r", "g", "b", "a"];
		var l = 4;
		while (-1 < --l) {
			this[p[l]] = arguments[l] || ((l == 3) ? 1 : 0)
		}
		this.toString = function() {
			return (this.a >= 1) ? "rgb(" + [this.r, this.g, this.b].join(",") + ")" : "rgba(" + [this.r, this.g, this.b, this.a].join(",") + ")"
		};
		this.scale = function(u, t, v, r) {
			l = 4;
			while (-1 < --l) {
				if (arguments[l] != null) {
					this[p[l]] *= arguments[l]
				}
			}
			return this.normalize()
		};
		this.adjust = function(u, t, v, r) {
			l = 4;
			while (-1 < --l) {
				if (arguments[l] != null) {
					this[p[l]] += arguments[l]
				}
			}
			return this.normalize()
		};
		this.clone = function() {
			return new b(this.r, this.b, this.g, this.a)
		};
		var n = function(t, r, u) {
			return Math.max(Math.min(t, u), r)
		};
		this.normalize = function() {
			this.r = n(parseInt(this.r), 0, 255);
			this.g = n(parseInt(this.g), 0, 255);
			this.b = n(parseInt(this.b), 0, 255);
			this.a = n(this.a, 0, 1);
			return this
		};
		this.normalize()
	}
	var d = {
		aqua: [0, 255, 255],
		azure: [240, 255, 255],
		beige: [245, 245, 220],
		black: [0, 0, 0],
		blue: [0, 0, 255],
		brown: [165, 42, 42],
		cyan: [0, 255, 255],
		darkblue: [0, 0, 139],
		darkcyan: [0, 139, 139],
		darkgrey: [169, 169, 169],
		darkgreen: [0, 100, 0],
		darkkhaki: [189, 183, 107],
		darkmagenta: [139, 0, 139],
		darkolivegreen: [85, 107, 47],
		darkorange: [255, 140, 0],
		darkorchid: [153, 50, 204],
		darkred: [139, 0, 0],
		darksalmon: [233, 150, 122],
		darkviolet: [148, 0, 211],
		fuchsia: [255, 0, 255],
		gold: [255, 215, 0],
		green: [0, 128, 0],
		indigo: [75, 0, 130],
		khaki: [240, 230, 140],
		lightblue: [173, 216, 230],
		lightcyan: [224, 255, 255],
		lightgreen: [144, 238, 144],
		lightgrey: [211, 211, 211],
		lightpink: [255, 182, 193],
		lightyellow: [255, 255, 224],
		lime: [0, 255, 0],
		magenta: [255, 0, 255],
		maroon: [128, 0, 0],
		navy: [0, 0, 128],
		olive: [128, 128, 0],
		orange: [255, 165, 0],
		pink: [255, 192, 203],
		purple: [128, 0, 128],
		violet: [128, 0, 128],
		red: [255, 0, 0],
		silver: [192, 192, 192],
		white: [255, 255, 255],
		yellow: [255, 255, 0]
	};

	function i(B, S, C) {
		var r, q, N, H, t;
		var R = B;
		this.id = id = "flotr-" + c++;
		this.series = series = k(S);
		this.xaxis = xaxis = {};
		this.yaxis = yaxis = {};
		this.plotOffset = plotOffset = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		};
		var P = 0;
		var s = 0;
		var O = 0;
		var n = 0;
		var v = 0;
		var J = 0;
		var l = 0;
		var K = 0;
		this.options = M(C);
		this.repaint = p;

		function M(W) {
			r = Object.merge({
				colors: ["#00A8F0", "#C0D800", "#cb4b4b", "#4da74d", "#9440ed"],
				legend: {
					show: true,
					noColumns: 1,
					labelFormatter: null,
					labelBoxBorderColor: "#ccc",
					container: null,
					position: "ne",
					margin: 5,
					backgroundColor: null,
					backgroundOpacity: 0.85
				},
				xaxis: {
					ticks: null,
					noTicks: 5,
					tickFormatter: e,
					tickDecimals: null,
					min: null,
					max: null,
					autoscaleMargin: 0
				},
				yaxis: {
					ticks: null,
					noTicks: 5,
					tickFormatter: e,
					tickDecimals: null,
					min: null,
					max: null,
					autoscaleMargin: 0
				},
				points: {
					show: false,
					radius: 3,
					lineWidth: 2,
					fill: true,
					fillColor: "#ffffff",
					fillOpacity: 0.4
				},
				lines: {
					show: false,
					lineWidth: 2,
					fill: false,
					fillColor: null,
					fillOpacity: 0.4
				},
				bars: {
					show: false,
					lineWidth: 2,
					barWidth: 1,
					fill: true,
					fillColor: null,
					fillOpacity: 0.4,
					horizontal: false
				},
				grid: {
					color: "#545454",
					backgroundColor: null,
					tickColor: "#dddddd",
					labelMargin: 3,
					verticalLines: true,
					horizontalLines: true,
					outlineWidth: 2
				},
				selection: {
					mode: null,
					color: "#B6D9FF",
					fps: 10
				},
				mouse: {
					track: null,
					position: "se",
					trackFormatter: f,
					margin: 3,
					lineColor: "#ff3f19",
					trackDecimals: 1,
					sensibility: 2,
					radius: 3
				},
				shadowSize: 4
			}, W);
			var aj = series.length,
				U = [],
				ab = [];
			for (var ae = series.length - 1; ae > -1; --ae) {
				var ai = series[ae].color;
				if (ai != null) {
					--aj;
					if (typeOf(ai) == "number") {
						ab.push(ai)
					} else {
						U.push(j(series[ae].color))
					}
				}
			}
			for (var ad = ab.length - 1; ad > -1; --ad) {
				aj = Math.max(aj, ab[ad] + 1)
			}
			var V = [],
				aa = 0,
				ac = 0;
			while (V.length < aj) {
				var ah = (r.colors.length == ac) ? new b(100, 100, 100) : j(r.colors[ac]);
				var Y = aa % 2 == 1 ? -1 : 1;
				var ag = 1 + Y * Math.ceil(aa / 2) * 0.2;
				ah.scale(ag, ag, ag);
				V.push(ah);
				if (++ac >= r.colors.length) {
					ac = 0;
					++aa
				}
			}
			for (var Z = 0, af = series.length, X = 0, ak; Z < af; ++Z) {
				ak = series[Z];
				if (ak.color == null) {
					ak.color = V[X++].toString()
				} else {
					if (typeOf(ak.color) == "number") {
						ak.color = V[ak.color].toString()
					}
				}
				ak.lines = Object.append(Object.append({}, r.lines), ak.lines || {});
				ak.points = Object.append(Object.append({}, r.points), ak.points || {});
				ak.bars = Object.append(Object.append({}, r.bars), ak.bars || {});
				ak.mouse = Object.append(Object.append({}, r.mouse), ak.mouse || {});
				if (ak.shadowSize == null) {
					ak.shadowSize = r.shadowSize
				}
			}
			return r
		}

		function p() {
			z();
			E();
			Q(xaxis, r.xaxis);
			x();
			Q(yaxis, r.yaxis);
			T();
			w(xaxis, r.xaxis);
			w(yaxis, r.yaxis);
			G();
			A();
			I()
		}

		function z() {
			var U = R.getSize();
			O = U.x;
			n = U.y;
			R.setStyles({
				position: "relative",
				cursor: "default"
			});
			if (O <= 0 || n <= 0) {
				throw "Invalid dimensions for plot, width = " + O + ", height = " + n
			}
			if (q == null) {
				q = $(document.createElement("canvas")).setProperty("id", id);
				R.appendChild(q);
				if (window.G_vmlCanvasManager) {
					q = $(window.G_vmlCanvasManager.initElement(q))
				}
				H = q.getContext("2d")
			}
			q.setProperties({
				width: O,
				height: n
			});
			if (N == null) {
				N = $(document.createElement("canvas")).setStyles({
					position: "absolute",
					left: "0px",
					top: "0px"
				});
				N.inject(q, "after");
				if (window.G_vmlCanvasManager) {
					N = $(window.G_vmlCanvasManager.initElement(N))
				}
				t = N.getContext("2d")
			}
			N.setProperties({
				width: O,
				height: n
			})
		}

		function m() {
			if (r.selection.mode != null) {
				N.addEvent("mousedown", mouseDownHandler)
			}
			N.addEvent("mousemove", mouseMoveHandler);
			N.addEvent("click", clickHandler)
		}

		function E() {
			yaxis.datamin = xaxis.datamin = 0;
			xaxis.datamax = yaxis.datamax = 1;
			if (series.length == 0) {
				return
			}
			var Z = false;
			for (var W = 0; W < series.length; ++W) {
				if (series[W].data.length > 0) {
					xaxis.datamin = xaxis.datamax = series[W].data[0][0];
					yaxis.datamin = yaxis.datamax = series[W].data[0][1];
					Z = true;
					break
				}
			}
			if (!Z) {
				return
			}
			for (var V = series.length - 1; V > -1; --V) {
				var Y = series[V].data;
				for (var X = Y.length - 1; X > -1; --X) {
					var U = Y[X][0];
					var aa = Y[X][1];
					if (U < xaxis.datamin) {
						xaxis.datamin = U
					} else {
						if (U > xaxis.datamax) {
							xaxis.datamax = U
						}
					}
					if (aa < yaxis.datamin) {
						yaxis.datamin = aa
					} else {
						if (aa > yaxis.datamax) {
							yaxis.datamax = aa
						}
					}
				}
			}
		}

		function Q(X, Z) {
			var W = Z.min != null ? Z.min : X.datamin;
			var U = Z.max != null ? Z.max : Math.max(W + (Z.minMaxTickSize || 0), X.datamax);
			if (U - W == 0) {
				var V = (U == 0) ? 1 : 0.01;
				W -= V;
				U += V
			}
			X.tickSize = h(Z.noTicks, W, U, Z.tickDecimals);
			var Y;
			if (Z.min == null) {
				Y = Z.autoscaleMargin;
				if (Y != 0) {
					W -= X.tickSize * Y;
					if (W < 0 && X.datamin >= 0) {
						W = 0
					}
					W = X.tickSize * Math.floor(W / X.tickSize)
				}
			}
			if (Z.max == null) {
				Y = Z.autoscaleMargin;
				if (Y != 0) {
					U += X.tickSize * Y;
					if (U > 0 && X.datamax <= 0) {
						U = 0
					}
					U = X.tickSize * Math.ceil(U / X.tickSize)
				}
			}
			X.min = W;
			X.max = U
		}

		function x() {
			if (r.xaxis.max == null) {
				var V = xaxis.max;
				for (var U = series.length - 1; U > -1; --U) {
					if (series[U].bars.show && !series[U].bars.horizontal && series[U].bars.barWidth + xaxis.datamax > V) {
						V = xaxis.max + series[U].bars.barWidth
					}
				}
				xaxis.max = V
			}
		}

		function T() {
			if (r.yaxis.max == null) {
				var V = yaxis.max;
				for (var U = series.length - 1; U > -1; --U) {
					if (series[U].bars.show && series[U].bars.horizontal && series[U].bars.barWidth + yaxis.datamax > V) {
						V = yaxis.max + series[U].bars.barWidth
					}
				}
				yaxis.max = V
			}
		}

		function w(W, X) {
			W.ticks = [];
			if (X.ticks) {
				var aa = X.ticks;
				if (typeof(aa) == "function") {
					aa = aa({
						min: W.min,
						max: W.max
					})
				}
				for (var Y = 0, ab, Z; Y < aa.length; ++Y) {
					var ac = aa[Y];
					if (typeof(ac) == "object") {
						ab = ac[0];
						Z = (ac.length > 1) ? ac[1] : X.tickFormatter(ab)
					} else {
						ab = ac;
						Z = X.tickFormatter(ab)
					}
					W.ticks[Y] = {
						v: ab,
						label: Z
					}
				}
			} else {
				var U = W.tickSize * Math.ceil(W.min / W.tickSize);
				for (Y = 0; U + Y * W.tickSize <= W.max; ++Y) {
					ab = U + Y * W.tickSize;
					var V = X.tickDecimals;
					if (V == null) {
						V = 1 - Math.floor(Math.log(W.tickSize) / Math.LN10)
					}
					if (V < 0) {
						V = 0
					}
					ab = ab.toFixed(V);
					W.ticks.push({
						v: ab,
						label: X.tickFormatter(ab)
					})
				}
			}
		}

		function G() {
			var Z = "";
			for (var Y = 0; Y < yaxis.ticks.length; ++Y) {
				var V = yaxis.ticks[Y].label.length;
				if (V > Z.length) {
					Z = yaxis.ticks[Y].label
				}
			}
			var U = new Element("div", {
				styles: {
					position: "absolute",
					top: "-10000px"
				},
				html: Z,
				"class": "gridLabel"
			}).inject(R);
			var X = U.getSize();
			P = X.x;
			s = X.y;
			U.destroy();
			var aa = 2;
			if (r.points.show) {
				aa = Math.max(aa, r.points.radius + r.points.lineWidth / 2)
			}
			for (var W = 0; W < series.length; ++W) {
				if (series[W].points.show) {
					aa = Math.max(aa, series[W].points.radius + series[W].points.lineWidth / 2)
				}
			}
			plotOffset.left = plotOffset.right = plotOffset.top = plotOffset.bottom = aa;
			plotOffset.left += P + r.grid.labelMargin;
			plotOffset.bottom += s + r.grid.labelMargin;
			v = O - plotOffset.left - plotOffset.right;
			J = n - plotOffset.bottom - plotOffset.top;
			l = v / (xaxis.max - xaxis.min);
			K = J / (yaxis.max - yaxis.min)
		}

		function A() {
			H.clearRect(0, 0, O, n);
			o();
			L();
			if (series.length) {
				for (var V = 0, U = series.length; V < U; V++) {
					y(series[V])
				}
			}
		}

		function u(U) {
			return (U - xaxis.min) * l
		}

		function D(U) {
			return J - (U - yaxis.min) * K
		}

		function o() {
			H.save();
			H.translate(plotOffset.left, plotOffset.top);
			if (r.grid.backgroundColor != null) {
				H.fillStyle = r.grid.backgroundColor;
				H.fillRect(0, 0, v, J)
			}
			H.lineWidth = 1;
			H.strokeStyle = r.grid.tickColor;
			H.beginPath();
			if (r.grid.verticalLines) {
				for (var W = 0, U = null; W < xaxis.ticks.length; ++W) {
					U = xaxis.ticks[W].v;
					if ((U == xaxis.min || U == xaxis.max) && r.grid.outlineWidth != 0) {
						continue
					}
					H.moveTo(Math.floor(u(U)) + H.lineWidth / 2, 0);
					H.lineTo(Math.floor(u(U)) + H.lineWidth / 2, J)
				}
			}
			if (r.grid.horizontalLines) {
				for (var V = 0, U = null; V < yaxis.ticks.length; ++V) {
					U = yaxis.ticks[V].v;
					if ((U == yaxis.min || U == yaxis.max) && r.grid.outlineWidth != 0) {
						continue
					}
					H.moveTo(0, Math.floor(D(U)) + H.lineWidth / 2);
					H.lineTo(v, Math.floor(D(U)) + H.lineWidth / 2)
				}
			}
			H.stroke();
			if (r.grid.outlineWidth != 0) {
				H.lineWidth = r.grid.outlineWidth;
				H.strokeStyle = r.grid.color;
				H.lineJoin = "round";
				H.strokeRect(0, 0, v, J)
			}
			H.restore()
		}
		var F = null;

		function L() {
			var Z = 0;
			for (var Y = 0; Y < xaxis.ticks.length; ++Y) {
				if (xaxis.ticks[Y].label) {
					++Z
				}
			}
			var V = v / Z;
			F = (F != null) ? F.set("html", "") : new Element("div", {
				styles: {
					"font-size": "smaller",
					color: r.grid.color
				}
			});
			for (var W = 0, X = null; W < xaxis.ticks.length; ++W) {
				X = xaxis.ticks[W];
				if (!X.label) {
					continue
				}
				F.adopt(new Element("div", {
					styles: {
						position: "absolute",
						top: (plotOffset.top + J + r.grid.labelMargin) + "px",
						left: (plotOffset.left + u(X.v) - V / 2) + "px",
						width: V + "px",
						"text-align": "center"
					},
					text: X.label
				}))
			}
			for (var U = 0, X = null; U < yaxis.ticks.length; ++U) {
				X = yaxis.ticks[U];
				if (!X.label || X.label.length == 0) {
					continue
				}
				F.adopt(new Element("div", {
					styles: {
						position: "absolute",
						top: (plotOffset.top + D(X.v) - s / 2) + "px",
						left: 0,
						width: P + "px",
						"text-align": "right"
					},
					"class": "gridLabel",
					text: X.label
				}))
			}
			R.adopt(F)
		}

		function y(W) {
			function V(ad, ac) {
				if (ad.length < 2) {
					return
				}
				var ab = u(ad[0][0]),
					aa = D(ad[0][1]) + ac;
				H.beginPath();
				H.moveTo(ab, aa);
				for (var ae = 0; ae < ad.length - 1; ++ae) {
					var Z = ad[ae][0],
						ag = ad[ae][1],
						Y = ad[ae + 1][0],
						af = ad[ae + 1][1];
					if (ag <= af && ag < yaxis.min) {
						if (af < yaxis.min) {
							continue
						}
						Z = (yaxis.min - ag) / (af - ag) * (Y - Z) + Z;
						ag = yaxis.min
					} else {
						if (af <= ag && af < yaxis.min) {
							if (ag < yaxis.min) {
								continue
							}
							Y = (yaxis.min - ag) / (af - ag) * (Y - Z) + Z;
							af = yaxis.min
						}
					}
					if (ag >= af && ag > yaxis.max) {
						if (af > yaxis.max) {
							continue
						}
						Z = (yaxis.max - ag) / (af - ag) * (Y - Z) + Z;
						ag = yaxis.max
					} else {
						if (af >= ag && af > yaxis.max) {
							if (ag > yaxis.max) {
								continue
							}
							Y = (yaxis.max - ag) / (af - ag) * (Y - Z) + Z;
							af = yaxis.max
						}
					}
					if (Z <= Y && Z < xaxis.min) {
						if (Y < xaxis.min) {
							continue
						}
						ag = (xaxis.min - Z) / (Y - Z) * (af - ag) + ag;
						Z = xaxis.min
					} else {
						if (Y <= Z && Y < xaxis.min) {
							if (Z < xaxis.min) {
								continue
							}
							af = (xaxis.min - Z) / (Y - Z) * (af - ag) + ag;
							Y = xaxis.min
						}
					}
					if (Z >= Y && Z > xaxis.max) {
						if (Y > xaxis.max) {
							continue
						}
						ag = (xaxis.max - Z) / (Y - Z) * (af - ag) + ag;
						Z = xaxis.max
					} else {
						if (Y >= Z && Y > xaxis.max) {
							if (Z > xaxis.max) {
								continue
							}
							af = (xaxis.max - Z) / (Y - Z) * (af - ag) + ag;
							Y = xaxis.max
						}
					}
					if (ab != u(Z) || aa != D(ag) + ac) {
						H.moveTo(u(Z), D(ag) + ac)
					}
					ab = u(Y);
					aa = D(af) + ac;
					H.lineTo(ab, aa)
				}
				H.stroke()
			}
			H.save();
			H.translate(plotOffset.left, plotOffset.top);
			H.lineJoin = "round";
			var X = W.lines.lineWidth;
			var U = W.shadowSize;
			if (U > 0) {
				H.lineWidth = U / 2;
				H.strokeStyle = "rgba(0,0,0,0.1)";
				V(W.data, X / 2 + U / 2 + H.lineWidth / 2);
				H.lineWidth = U / 2;
				H.strokeStyle = "rgba(0,0,0,0.2)";
				V(W.data, X / 2 + H.lineWidth / 2)
			}
			H.lineWidth = X;
			H.strokeStyle = W.color;
			V(W.data, 0);
			H.restore()
		}

		function I() {
			var Z = this.id + "-legend";
			if (!r.legend.show) {
				if (this.__insertLegend_inserted__) {
					this.__insertLegend_inserted__ = false;
					var aa = $(Z),
						ab = $(Z + "-bg");
					if (aa) {
						aa.empty()
					}
					if (ab) {
						ab.destroy()
					}
				}
				return
			}
			this.__insertLegend_inserted__ = true;
			var af = [];
			var ac = false;
			for (var Y = 0; Y < series.length; ++Y) {
				if (!series[Y].label) {
					continue
				}
				if (Y % r.legend.noColumns == 0) {
					af.push((ac) ? "</tr><tr>" : "<tr>");
					ac = true
				}
				var ah = series[Y].label;
				if (r.legend.labelFormatter != null) {
					ah = r.legend.labelFormatter(ah)
				}
				af.push('<td class="flotr-legend-color-box"><div style="border:1px solid ' + r.legend.labelBoxBorderColor + ';padding:1px"><div style="width:14px;height:10px;background-color:' + series[Y].color + '"></div></div></td><td class="flotr-legend-label">' + ah + "</td>")
			}
			if (ac) {
				af.push("</tr>")
			}
			if (af.length > 0) {
				var ai = '<table style="font-size:smaller;color:' + r.grid.color + '">' + af.join("") + "</table>";
				if (r.legend.container != null) {
					r.legend.container.append(ai)
				} else {
					var ag = {};
					var V = r.legend.position,
						W = r.legend.margin;
					if (V.charAt(0) == "n") {
						ag.top = (W + plotOffset.top) + "px"
					} else {
						if (V.charAt(0) == "s") {
							ag.bottom = (W + plotOffset.bottom) + "px"
						}
					}
					if (V.charAt(1) == "e") {
						ag.right = (W + plotOffset.right) + "px"
					} else {
						if (V.charAt(1) == "w") {
							ag.left = (W + plotOffset.left) + "px"
						}
					}
					var U = $(Z);
					if (!U) {
						U = new Element("div.flotr-legend#" + Z, {
							styles: Object.append(ag, {
								position: "absolute",
								"z-index": 2
							})
						});
						R.adopt(U)
					}
					U.setStyles(ag).set("html", ai);
					if (r.legend.backgroundOpacity != 0) {
						var ae = r.legend.backgroundColor;
						if (ae == null) {
							var X = (r.grid.backgroundColor != null) ? r.grid.backgroundColor : a(U);
							ae = j(X).adjust(null, null, null, 1).toString()
						}
						var aj = U.getSize();
						var ad = $(Z + "-bg");
						if (!ad) {
							ad = new Element("div.flotr-legend-bg#" + Z + "-bg").inject(U, "before")
						}
						ad.setStyles(Object.append(ag, {
							position: "absolute",
							width: aj.x,
							height: aj.y,
							"background-color": ae,
							opacity: r.legend.backgroundOpacity
						}))
					}
				}
			}
		}
	}
	return {
		Plot: i
	}
})();
