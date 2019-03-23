if (!document.createElement("canvas").getContext) {
	(function() {
		var v = Math;
		var w = v.round;
		var s = v.sin;
		var E = v.cos;
		var n = v.abs;
		var D = v.sqrt;
		var a = 10;
		var o = a / 2;

		function h() {
			return this.context_ || (this.context_ = new q(this))
		}
		var u = Array.prototype.slice;

		function F(j, m, G) {
			var i = u.call(arguments, 2);
			return function() {
				return j.apply(m, i.concat(u.call(arguments)))
			}
		}
		var k = {
			init: function(i) {
				if (/MSIE/.test(navigator.userAgent) && !window.opera) {
					var j = i || document;
					j.createElement("canvas");
					j.attachEvent("onreadystatechange", F(this.init_, this, j))
				}
			},
			init_: function(H) {
				if (!H.namespaces.g_vml_) {
					H.namespaces.add("g_vml_", "urn:schemas-microsoft-com:vml", "#default#VML")
				}
				if (!H.namespaces.g_o_) {
					H.namespaces.add("g_o_", "urn:schemas-microsoft-com:office:office", "#default#VML")
				}
				if (!H.styleSheets.ex_canvas_) {
					var G = H.createStyleSheet();
					G.owningElement.id = "ex_canvas_";
					G.cssText = "canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}g_o_\\:*{behavior:url(#default#VML)}"
				}
				var m = H.getElementsByTagName("canvas");
				for (var j = 0; j < m.length; j++) {
					this.initElement(m[j])
				}
			},
			initElement: function(j) {
				if (!j.getContext) {
					j.getContext = h;
					j.innerHTML = "";
					j.attachEvent("onpropertychange", C);
					j.attachEvent("onresize", b);
					var i = j.attributes;
					if (i.width && i.width.specified) {
						j.style.width = i.width.nodeValue + "px"
					} else {
						j.width = j.clientWidth
					}
					if (i.height && i.height.specified) {
						j.style.height = i.height.nodeValue + "px"
					} else {
						j.height = j.clientHeight
					}
				}
				return j
			}
		};

		function C(j) {
			var i = j.srcElement;
			switch (j.propertyName) {
				case "width":
					i.style.width = i.attributes.width.nodeValue + "px";
					i.getContext().clearRect();
					break;
				case "height":
					i.style.height = i.attributes.height.nodeValue + "px";
					i.getContext().clearRect();
					break
			}
		}

		function b(j) {
			var i = j.srcElement;
			if (i.firstChild) {
				i.firstChild.style.width = i.clientWidth + "px";
				i.firstChild.style.height = i.clientHeight + "px"
			}
		}
		k.init();
		var e = [];
		for (var z = 0; z < 16; z++) {
			for (var y = 0; y < 16; y++) {
				e[z * 16 + y] = z.toString(16) + y.toString(16)
			}
		}

		function r() {
			return [
				[1, 0, 0],
				[0, 1, 0],
				[0, 0, 1]
			]
		}

		function d(G, m) {
			var j = r();
			for (var i = 0; i < 3; i++) {
				for (var J = 0; J < 3; J++) {
					var H = 0;
					for (var I = 0; I < 3; I++) {
						H += G[i][I] * m[I][J]
					}
					j[i][J] = H
				}
			}
			return j
		}

		function x(j, i) {
			i.fillStyle = j.fillStyle;
			i.lineCap = j.lineCap;
			i.lineJoin = j.lineJoin;
			i.lineWidth = j.lineWidth;
			i.miterLimit = j.miterLimit;
			i.shadowBlur = j.shadowBlur;
			i.shadowColor = j.shadowColor;
			i.shadowOffsetX = j.shadowOffsetX;
			i.shadowOffsetY = j.shadowOffsetY;
			i.strokeStyle = j.strokeStyle;
			i.globalAlpha = j.globalAlpha;
			i.arcScaleX_ = j.arcScaleX_;
			i.arcScaleY_ = j.arcScaleY_;
			i.lineScale_ = j.lineScale_
		}

		function c(m) {
			var I, H = 1;
			m = String(m);
			if (m.substring(0, 3) == "rgb") {
				var K = m.indexOf("(", 3);
				var j = m.indexOf(")", K + 1);
				var J = m.substring(K + 1, j).split(",");
				I = "#";
				for (var G = 0; G < 3; G++) {
					I += e[Number(J[G])]
				}
				if (J.length == 4 && m.substr(3, 1) == "a") {
					H = J[3]
				}
			} else {
				I = m
			}
			return {
				color: I,
				alpha: H
			}
		}

		function t(i) {
			switch (i) {
				case "butt":
					return "flat";
				case "round":
					return "round";
				case "square":
				default:
					return "square"
			}
		}

		function q(j) {
			this.m_ = r();
			this.mStack_ = [];
			this.aStack_ = [];
			this.currentPath_ = [];
			this.strokeStyle = "#000";
			this.fillStyle = "#000";
			this.lineWidth = 1;
			this.lineJoin = "miter";
			this.lineCap = "butt";
			this.miterLimit = a * 1;
			this.globalAlpha = 1;
			this.canvas = j;
			var i = j.ownerDocument.createElement("div");
			i.style.width = j.clientWidth + "px";
			i.style.height = j.clientHeight + "px";
			i.style.overflow = "hidden";
			i.style.position = "absolute";
			j.appendChild(i);
			this.element_ = i;
			this.arcScaleX_ = 1;
			this.arcScaleY_ = 1;
			this.lineScale_ = 1
		}
		var l = q.prototype;
		l.clearRect = function() {
			this.element_.innerHTML = ""
		};
		l.beginPath = function() {
			this.currentPath_ = []
		};
		l.moveTo = function(j, i) {
			var m = this.getCoords_(j, i);
			this.currentPath_.push({
				type: "moveTo",
				x: m.x,
				y: m.y
			});
			this.currentX_ = m.x;
			this.currentY_ = m.y
		};
		l.lineTo = function(j, i) {
			var m = this.getCoords_(j, i);
			this.currentPath_.push({
				type: "lineTo",
				x: m.x,
				y: m.y
			});
			this.currentX_ = m.x;
			this.currentY_ = m.y
		};
		l.bezierCurveTo = function(m, j, L, K, J, H) {
			var i = this.getCoords_(J, H);
			var I = this.getCoords_(m, j);
			var G = this.getCoords_(L, K);
			p(this, I, G, i)
		};

		function p(i, G, m, j) {
			i.currentPath_.push({
				type: "bezierCurveTo",
				cp1x: G.x,
				cp1y: G.y,
				cp2x: m.x,
				cp2y: m.y,
				x: j.x,
				y: j.y
			});
			i.currentX_ = j.x;
			i.currentY_ = j.y
		}
		l.quadraticCurveTo = function(J, m, j, i) {
			var I = this.getCoords_(J, m);
			var H = this.getCoords_(j, i);
			var K = {
				x: this.currentX_ + 2 / 3 * (I.x - this.currentX_),
				y: this.currentY_ + 2 / 3 * (I.y - this.currentY_)
			};
			var G = {
				x: K.x + (H.x - this.currentX_) / 3,
				y: K.y + (H.y - this.currentY_) / 3
			};
			p(this, K, G, H)
		};
		l.arc = function(M, K, L, H, j, m) {
			L *= a;
			var Q = m ? "at" : "wa";
			var N = M + E(H) * L - o;
			var P = K + s(H) * L - o;
			var i = M + E(j) * L - o;
			var O = K + s(j) * L - o;
			if (N == i && !m) {
				N += 0.125
			}
			var G = this.getCoords_(M, K);
			var J = this.getCoords_(N, P);
			var I = this.getCoords_(i, O);
			this.currentPath_.push({
				type: Q,
				x: G.x,
				y: G.y,
				radius: L,
				xStart: J.x,
				yStart: J.y,
				xEnd: I.x,
				yEnd: I.y
			})
		};
		l.rect = function(m, j, i, G) {
			this.moveTo(m, j);
			this.lineTo(m + i, j);
			this.lineTo(m + i, j + G);
			this.lineTo(m, j + G);
			this.closePath()
		};
		l.strokeRect = function(m, j, i, G) {
			var H = this.currentPath_;
			this.beginPath();
			this.moveTo(m, j);
			this.lineTo(m + i, j);
			this.lineTo(m + i, j + G);
			this.lineTo(m, j + G);
			this.closePath();
			this.stroke();
			this.currentPath_ = H
		};
		l.fillRect = function(m, j, i, G) {
			var H = this.currentPath_;
			this.beginPath();
			this.moveTo(m, j);
			this.lineTo(m + i, j);
			this.lineTo(m + i, j + G);
			this.lineTo(m, j + G);
			this.closePath();
			this.fill();
			this.currentPath_ = H
		};
		l.createLinearGradient = function(j, G, i, m) {
			var H = new A("gradient");
			H.x0_ = j;
			H.y0_ = G;
			H.x1_ = i;
			H.y1_ = m;
			return H
		};
		l.createRadialGradient = function(G, I, m, j, H, i) {
			var J = new A("gradientradial");
			J.x0_ = G;
			J.y0_ = I;
			J.r0_ = m;
			J.x1_ = j;
			J.y1_ = H;
			J.r1_ = i;
			return J
		};
		l.drawImage = function(T, m) {
			var M, K, O, ab, R, P, V, ad;
			var N = T.runtimeStyle.width;
			var S = T.runtimeStyle.height;
			T.runtimeStyle.width = "auto";
			T.runtimeStyle.height = "auto";
			var L = T.width;
			var Z = T.height;
			T.runtimeStyle.width = N;
			T.runtimeStyle.height = S;
			if (arguments.length == 3) {
				M = arguments[1];
				K = arguments[2];
				R = P = 0;
				V = O = L;
				ad = ab = Z
			} else {
				if (arguments.length == 5) {
					M = arguments[1];
					K = arguments[2];
					O = arguments[3];
					ab = arguments[4];
					R = P = 0;
					V = L;
					ad = Z
				} else {
					if (arguments.length == 9) {
						R = arguments[1];
						P = arguments[2];
						V = arguments[3];
						ad = arguments[4];
						M = arguments[5];
						K = arguments[6];
						O = arguments[7];
						ab = arguments[8]
					} else {
						throw Error("Invalid number of arguments")
					}
				}
			}
			var ac = this.getCoords_(M, K);
			var G = V / 2;
			var j = ad / 2;
			var aa = [];
			var i = 10;
			var J = 10;
			aa.push(" <g_vml_:group", ' coordsize="', a * i, ",", a * J, '"', ' coordorigin="0,0"', ' style="width:', i, "px;height:", J, "px;position:absolute;");
			if (this.m_[0][0] != 1 || this.m_[0][1]) {
				var I = [];
				I.push("M11=", this.m_[0][0], ",", "M12=", this.m_[1][0], ",", "M21=", this.m_[0][1], ",", "M22=", this.m_[1][1], ",", "Dx=", w(ac.x / a), ",", "Dy=", w(ac.y / a), "");
				var Y = ac;
				var X = this.getCoords_(M + O, K);
				var U = this.getCoords_(M, K + ab);
				var Q = this.getCoords_(M + O, K + ab);
				Y.x = v.max(Y.x, X.x, U.x, Q.x);
				Y.y = v.max(Y.y, X.y, U.y, Q.y);
				aa.push("padding:0 ", w(Y.x / a), "px ", w(Y.y / a), "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(", I.join(""), ", sizingmethod='clip');")
			} else {
				aa.push("top:", w(ac.y / a), "px;left:", w(ac.x / a), "px;")
			}
			aa.push(' ">', '<g_vml_:image src="', T.src, '"', ' style="width:', a * O, "px;", " height:", a * ab, 'px;"', ' cropleft="', R / L, '"', ' croptop="', P / Z, '"', ' cropright="', (L - R - V) / L, '"', ' cropbottom="', (Z - P - ad) / Z, '"', " />", "</g_vml_:group>");
			this.element_.insertAdjacentHTML("BeforeEnd", aa.join(""))
		};
		l.stroke = function(ag) {
			var L = [];
			var M = false;
			var ar = c(ag ? this.fillStyle : this.strokeStyle);
			var ac = ar.color;
			var am = ar.alpha * this.globalAlpha;
			var I = 10;
			var O = 10;
			L.push("<g_vml_:shape", ' filled="', !!ag, '"', ' style="position:absolute;width:', I, "px;height:", O, 'px;"', ' coordorigin="0 0" coordsize="', a * I, " ", a * O, '"', ' stroked="', !ag, '"', ' path="');
			var N = false;
			var aq = {
				x: null,
				y: null
			};
			var Y = {
				x: null,
				y: null
			};
			for (var al = 0; al < this.currentPath_.length; al++) {
				var ak = this.currentPath_[al];
				var ap;
				switch (ak.type) {
					case "moveTo":
						ap = ak;
						L.push(" m ", w(ak.x), ",", w(ak.y));
						break;
					case "lineTo":
						L.push(" l ", w(ak.x), ",", w(ak.y));
						break;
					case "close":
						L.push(" x ");
						ak = null;
						break;
					case "bezierCurveTo":
						L.push(" c ", w(ak.cp1x), ",", w(ak.cp1y), ",", w(ak.cp2x), ",", w(ak.cp2y), ",", w(ak.x), ",", w(ak.y));
						break;
					case "at":
					case "wa":
						L.push(" ", ak.type, " ", w(ak.x - this.arcScaleX_ * ak.radius), ",", w(ak.y - this.arcScaleY_ * ak.radius), " ", w(ak.x + this.arcScaleX_ * ak.radius), ",", w(ak.y + this.arcScaleY_ * ak.radius), " ", w(ak.xStart), ",", w(ak.yStart), " ", w(ak.xEnd), ",", w(ak.yEnd));
						break
				}
				if (ak) {
					if (aq.x == null || ak.x < aq.x) {
						aq.x = ak.x
					}
					if (Y.x == null || ak.x > Y.x) {
						Y.x = ak.x
					}
					if (aq.y == null || ak.y < aq.y) {
						aq.y = ak.y
					}
					if (Y.y == null || ak.y > Y.y) {
						Y.y = ak.y
					}
				}
			}
			L.push(' ">');
			if (!ag) {
				var X = this.lineScale_ * this.lineWidth;
				if (X < 1) {
					am *= X
				}
				L.push("<g_vml_:stroke", ' opacity="', am, '"', ' joinstyle="', this.lineJoin, '"', ' miterlimit="', this.miterLimit, '"', ' endcap="', t(this.lineCap), '"', ' weight="', X, 'px"', ' color="', ac, '" />')
			} else {
				if (typeof this.fillStyle == "object") {
					var P = this.fillStyle;
					var U = 0;
					var aj = {
						x: 0,
						y: 0
					};
					var ad = 0;
					var S = 1;
					if (P.type_ == "gradient") {
						var R = P.x0_ / this.arcScaleX_;
						var m = P.y0_ / this.arcScaleY_;
						var Q = P.x1_ / this.arcScaleX_;
						var at = P.y1_ / this.arcScaleY_;
						var ao = this.getCoords_(R, m);
						var an = this.getCoords_(Q, at);
						var K = an.x - ao.x;
						var J = an.y - ao.y;
						U = Math.atan2(K, J) * 180 / Math.PI;
						if (U < 0) {
							U += 360
						}
						if (U < 0.000001) {
							U = 0
						}
					} else {
						var ao = this.getCoords_(P.x0_, P.y0_);
						var j = Y.x - aq.x;
						var G = Y.y - aq.y;
						aj = {
							x: (ao.x - aq.x) / j,
							y: (ao.y - aq.y) / G
						};
						j /= this.arcScaleX_ * a;
						G /= this.arcScaleY_ * a;
						var ai = v.max(j, G);
						ad = 2 * P.r0_ / ai;
						S = 2 * P.r1_ / ai - ad
					}
					var ab = P.colors_;
					ab.sort(function(H, i) {
						return H.offset - i.offset
					});
					var V = ab.length;
					var aa = ab[0].color;
					var Z = ab[V - 1].color;
					var af = ab[0].alpha * this.globalAlpha;
					var ae = ab[V - 1].alpha * this.globalAlpha;
					var ah = [];
					for (var al = 0; al < V; al++) {
						var T = ab[al];
						ah.push(T.offset * S + ad + " " + T.color)
					}
					L.push('<g_vml_:fill type="', P.type_, '"', ' method="none" focus="100%"', ' color="', aa, '"', ' color2="', Z, '"', ' colors="', ah.join(","), '"', ' opacity="', ae, '"', ' g_o_:opacity2="', af, '"', ' angle="', U, '"', ' focusposition="', aj.x, ",", aj.y, '" />')
				} else {
					L.push('<g_vml_:fill color="', ac, '" opacity="', am, '" />')
				}
			}
			L.push("</g_vml_:shape>");
			this.element_.insertAdjacentHTML("beforeEnd", L.join(""))
		};
		l.fill = function() {
			this.stroke(true)
		};
		l.closePath = function() {
			this.currentPath_.push({
				type: "close"
			})
		};
		l.getCoords_ = function(G, j) {
			var i = this.m_;
			return {
				x: a * (G * i[0][0] + j * i[1][0] + i[2][0]) - o,
				y: a * (G * i[0][1] + j * i[1][1] + i[2][1]) - o
			}
		};
		l.save = function() {
			var i = {};
			x(this, i);
			this.aStack_.push(i);
			this.mStack_.push(this.m_);
			this.m_ = d(r(), this.m_)
		};
		l.restore = function() {
			x(this.aStack_.pop(), this);
			this.m_ = this.mStack_.pop()
		};

		function g(i) {
			for (var H = 0; H < 3; H++) {
				for (var G = 0; G < 2; G++) {
					if (!isFinite(i[H][G]) || isNaN(i[H][G])) {
						return false
					}
				}
			}
			return true
		}

		function B(j, i, G) {
			if (!g(i)) {
				return
			}
			j.m_ = i;
			if (G) {
				var H = i[0][0] * i[1][1] - i[0][1] * i[1][0];
				j.lineScale_ = D(n(H))
			}
		}
		l.translate = function(m, j) {
			var i = [
				[1, 0, 0],
				[0, 1, 0],
				[m, j, 1]
			];
			B(this, d(i, this.m_), false)
		};
		l.rotate = function(j) {
			var G = E(j);
			var m = s(j);
			var i = [
				[G, m, 0],
				[-m, G, 0],
				[0, 0, 1]
			];
			B(this, d(i, this.m_), false)
		};
		l.scale = function(m, j) {
			this.arcScaleX_ *= m;
			this.arcScaleY_ *= j;
			var i = [
				[m, 0, 0],
				[0, j, 0],
				[0, 0, 1]
			];
			B(this, d(i, this.m_), true)
		};
		l.transform = function(H, G, J, I, j, i) {
			var m = [
				[H, G, 0],
				[J, I, 0],
				[j, i, 1]
			];
			B(this, d(m, this.m_), true)
		};
		l.setTransform = function(I, H, K, J, G, j) {
			var i = [
				[I, H, 0],
				[K, J, 0],
				[G, j, 1]
			];
			B(this, i, true)
		};
		l.clip = function() {};
		l.arcTo = function() {};
		l.createPattern = function() {
			return new f
		};

		function A(i) {
			this.type_ = i;
			this.x0_ = 0;
			this.y0_ = 0;
			this.r0_ = 0;
			this.x1_ = 0;
			this.y1_ = 0;
			this.r1_ = 0;
			this.colors_ = []
		}
		A.prototype.addColorStop = function(j, i) {
			i = c(i);
			this.colors_.push({
				offset: j,
				color: i.color,
				alpha: i.alpha
			})
		};

		function f() {}
		G_vmlCanvasManager = k;
		CanvasRenderingContext2D = q;
		CanvasGradient = A;
		CanvasPattern = f
	})()
};
