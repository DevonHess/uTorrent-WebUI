var SpeedGraph = new Class({
	element: null,
	plot: null,
	maxDataInterval: 600 * 1000,
	maxShowInterval: -1,
	create: function(a) {
		this.element = $(a);
		this.plot = new Flotr.Plot(this.element, [{
			data: []
		}, {
			data: []
		}], {
			colors: ["#EE0000", "#00AA00"],
			legend: {
				position: "nw"
			},
			lines: {
				show: true,
				lineWidth: 1
			},
			xaxis: {
				tickSize: 60,
				tickFormatter: function(b) {
					return (new Date(Number(b))).format("%H:%M:%S")
				}
			},
			yaxis: {
				min: 0,
				minMaxTickSize: 512,
				tickFormatter: function(b) {
					return (parseInt(b).toFileSize() + g_perSec)
				}
			},
			grid: {
				color: "#868686"
			},
			shadowSize: 0
		})
	},
	draw: function() {
		if (!(utWebUI.config || {}).showDetails || utWebUI.mainTabs.active != "mainInfoPane-speedTab") {
			return
		}
		this.plot.repaint()
	},
	resizeTo: function(a, c) {
		var b = {};
		if (typeof(a) === "number" && a > 0) {
			b.width = a
		}
		if (typeof(c) === "number" && c > 0) {
			b.height = c
		}
		this.element.setStyles(b);
		this.draw()
	},
	showLegend: function(a) {
		this.plot.options.legend.show = !!a;
		this.draw()
	},
	setLabels: function(b, a) {
		if (typeof(b) !== "undefined") {
			this.plot.series[0].label = b
		}
		if (typeof(a) !== "undefined") {
			this.plot.series[1].label = a
		}
	},
	addData: function(a, e) {
		var c = Date.now();
		var b = this.plot.series[0].data;
		var d = this.plot.series[1].data;
		b.push([c, a]);
		d.push([c, e]);
		while ((c - b[0][0]) > this.maxDataInterval) {
			b.shift();
			d.shift()
		}
		this.plot.options.xaxis.min = c - (0 < this.maxShowInterval && this.maxShowInterval < this.maxDataInterval ? this.maxShowInterval : this.maxDataInterval);
		this.draw()
	}
});
