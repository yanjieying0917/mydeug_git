(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if(!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			},
			timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};
	if(!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}());

var CanvasParticle = (function() {
	/*canvasAnimate && cancelAnimationFrame(canvasAnimate);*/
	function getElementByTag(name) {
		return document.getElementsByTagName(name);
	}

	function canvasInit(canvasConfig) {
		canvasConfig = canvasConfig || {};
		var body = getElementByTag("body")[0]
		var canvasObj = document.getElementById("canvas");
		var canvas = {
			element: canvasObj,
			points: [],
			config: {
				vx: canvasConfig.vx || 4,
				vy: canvasConfig.vy || 4,
				height: canvasConfig.height || 2,
				width: canvasConfig.width || 2,
				count: canvasConfig.count || 100,
				color: canvasConfig.color || "121, 162, 185",
				stroke: canvasConfig.stroke || "130,255,255",
				dist: canvasConfig.dist || 6000,
				e_dist: canvasConfig.e_dist || 20000,
				max_conn: 10
			}
		};
		if(canvas.element.getContext("2d")) {
			canvas.context = canvas.element.getContext("2d");
		} else {
			return null;
		}
		canvasSize(canvas.element);
		window.onresize = function() {
			canvasSize(canvas.element);
		}
		body.onmousemove = function(e) {
			var event = e || window.event;
			canvas.mouse = {
				x: event.clientX,
				y: event.clientY
			};
		}
		document.onmouseleave = function() {
			canvas.mouse = undefined;
		}
		drawPoint(canvas);
	}

	function canvasSize(canvas) {
		var width = window.innerWidth;
		var height = window.innerHeight;
		canvas.width = width || window.innerWeight || document.documentElement.clientWidth || document.body.clientWidth;
		canvas.height = height || window.innerWeight || document.documentElement.clientHeight || document.body.clientHeight;
	}

	function drawPoint(canvas) {
		var context = canvas.context,
			point, dist;
		context.clearRect(0, 0, canvas.element.width, canvas.element.height);
		context.beginPath();
		context.fillStyle = "rgb(" + canvas.config.color + ")";
		for(var i = 0, len = canvas.config.count; i < len; i++) {
			if(canvas.points.length != canvas.config.count) {
				point = {
					x: Math.floor(Math.random() * canvas.element.width),
					y: Math.floor(Math.random() * canvas.element.height),
					vx: canvas.config.vx / 2 - Math.random() * canvas.config.vx,
					vy: canvas.config.vy / 2 - Math.random() * canvas.config.vy
				}
			} else {
				point = borderPoint(canvas.points[i], canvas);
			}
			context.fillRect(point.x - canvas.config.width / 2, point.y - canvas.config.height / 2, canvas.config.width, canvas.config.height);
			canvas.points[i] = point;
		}
		drawLine(context, canvas, canvas.mouse);
		context.closePath();

		window.canvasAnimate = requestAnimationFrame(function() {
			drawPoint(canvas)
		})
	}

	function borderPoint(point, canvas) {
		var p = point;
		if(point.x <= 0 || point.x >= canvas.element.width) {
			p.vx = -p.vx;
			p.x += p.vx;
		} else if(point.y <= 0 || point.y >= canvas.element.height) {
			p.vy = -p.vy;
			p.y += p.vy;
		} else {
			p = {
				x: p.x + p.vx,
				y: p.y + p.vy,
				vx: p.vx,
				vy: p.vy
			}
		}
		return p;
	}

	function drawLine(context, canvas, mouse) {
		context = context || canvas.context;
		for(var i = 0, len = canvas.config.count; i < len; i++) {
			canvas.points[i].max_conn = 0;
			for(var j = 0; j < len; j++) {
				if(i != j) {
					dist = Math.round(canvas.points[i].x - canvas.points[j].x) * Math.round(canvas.points[i].x - canvas.points[j].x) + Math.round(canvas.points[i].y - canvas.points[j].y) * Math.round(canvas.points[i].y - canvas.points[j].y);
					if(dist <= canvas.config.dist && canvas.points[i].max_conn < canvas.config.max_conn) {
						canvas.points[i].max_conn++;
						context.lineWidth = 0.5 - dist / canvas.config.dist;
						context.strokeStyle = "rgba(" + canvas.config.stroke + "," + (1 - dist / canvas.config.dist) + ")"
						context.beginPath();
						context.moveTo(canvas.points[i].x, canvas.points[i].y);
						context.lineTo(canvas.points[j].x, canvas.points[j].y);
						context.stroke();
					}
				}
			}
			if(mouse) {
				dist = Math.round(canvas.points[i].x - mouse.x) * Math.round(canvas.points[i].x - mouse.x) + Math.round(canvas.points[i].y - mouse.y) * Math.round(canvas.points[i].y - mouse.y);
				if(dist > canvas.config.dist && dist <= canvas.config.e_dist) {
					canvas.points[i].x = canvas.points[i].x + (mouse.x - canvas.points[i].x) / 20;
					canvas.points[i].y = canvas.points[i].y + (mouse.y - canvas.points[i].y) / 20;
				}
				if(dist <= canvas.config.e_dist) {
					context.lineWidth = 1;
					context.strokeStyle = "rgba(" + canvas.config.stroke + "," + (1 - dist / canvas.config.e_dist) + ")";
					context.beginPath();
					context.moveTo(canvas.points[i].x, canvas.points[i].y);
					context.lineTo(mouse.x, mouse.y);
					context.stroke();
				}
			}
		}
	}
	return canvasInit;
})();

//配置
var config = {
	vx: 4, //小球x轴速度,正为右，负为左
	vy: 4, //小球y轴速度
	height: 2, //小球高宽，其实为正方形，所以不宜太大
	width: 2,
	count: 300, //点个数
	color: "121, 162, 185", //点颜色
	stroke: "130,255,255", //线条颜色
	dist: 6000, //点吸附距离
	e_dist: 20000, //鼠标吸附加速距离
	max_conn: 10 //点到点最大连接数
}

//调用
CanvasParticle(config);