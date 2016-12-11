;(function(){
	var canvas = document.getElementById('circle');
	// 不支持的浏览器直接不显示
	if (!canvas || !canvas.getContext) {
		alert("您的浏览器太旧了,升级您的浏览器");
		return false;
	}
	var	context = canvas.getContext('2d'),
		cw = document.documentElement.clientWidth || document.body.clientWidth,
		ch = document.documentElement.clientHeight || document.body.clientHeight;
		canvas.width = cw;
		canvas.height = ch;
	var circles = [];

		context.globalAlpha = '0.7';
		// 随机圆
		for (var i = 0; i < 100; i++) {
			// 圆的半径20到50之间
			var r = Math.random()*30 + 20; 
			// 小圆所需的属性
			var circle = {
				// 圆的颜色
				color: '#' + (~~(Math.random()*(1<<24))).toString(16),
				radius: r,
				x: Math.random()*cw,
				y: Math.random()*ch,
				vx: Math.random()*10 - 5, //[-5, 5]随机数
				vy: Math.random()*10 - 5
			};
			circles[i] = circle;
		}

		// 画小圆
		function draw() {
			// 清除矩形
			context.clearRect(0, 0, cw, ch);
			var len = circles.length;
			for (var i = 0; i < len; i++) {
				context.fillStyle = circles[i].color;
				context.beginPath();
				context.arc(circles[i].x, circles[i].y, circles[i].radius, 0, Math.PI*2);
				context.closePath();
				context.fill();
			}
		}

		// 更新小圆
		function update() {
			var len = circles.length
			for (var i = 0; i < len; i++) {
				circles[i].x += circles[i].vx; //x轴的距离为开始的距离+小球的速度
				circles[i].y += circles[i].vy; //y轴的距离为开始的距离+小球的速度

				// 对小球的边界区域进行判断，使得小球在区域内来回反弹
				// 对下边界进行判断
				if (circles[i].y + circles[i].radius>= ch ) {
					// 当他超出y轴的边界后，回到最低点
					circles[i].y = ch - circles[i].radius;
					// 其y轴的速度，变成开始速度的方向方向
					circles[i].vy = -circles[i].vy
					// 0.5是摩擦系数，因为小球不是每次都弹到最高点
					// 会慢慢变为0;
				}

				// 上边界的判断
				if (circles[i].y - circles[i].radius<= 0) {
					circles[i].y = circles[i].radius;
					circles[i].vy = -circles[i].vy;
				}

				//左边界的判断
				if (circles[i].x - circles[i].radius<= 0) {
					circles[i].x = circles[i].radius;
					circles[i].vx = -circles[i].vx;
				}

				// 右边界的判断
				if (circles[i].x + circles[i].radius>= cw) {
					circles[i].x = cw-circles[i].radius;
					circles[i].vx = -circles[i].vx;
				}
			}
		}

		function init(){
			draw();
			update();
			window.requestAnimationFrame(init);
		};

		init();


})()