;(function(){
	var canvas = document.getElementById('spotlight');
	// 不支持的浏览器直接不显示
	if (!canvas || !canvas.getContext) {
		alert("您的浏览器太旧了,升级您的浏览器");
		return false;
	}
	var	context = canvas.getContext('2d')
		cw = 800,
		ch = 800,
		isIncrease = true;
		canvas.width = cw;
		canvas.height = ch;	

	var lightBall = {
		x: 400,
		y: 400,
		radius: 150,
		vx: Math.random()*5 + 5,
		vy: Math.random()*5 + 5
	};
	function draw() {
		// 清除画布
		context.clearRect(0, 0, cw, ch);

		context.save();
		// 给画布填充颜色
		context.fillStyle = 'black';
		context.fillRect(0, 0, cw, ch);


		// 画聚光灯，即剪裁区域
		context.save();
		context.translate(lightBall.x, lightBall.y);
		context.scale(lightBall.radius, lightBall.radius);
		// 画五角星的
		starPath();
		context.fillStyle = '#fff';
		context.fill();
		context.restore();
		context.clip();

		// 画文字
		context.font = 'bold 120px Arial';
		context.textAlign = 'centet';
		context.textBaseline = 'middle';
		context.fillStyle = '#e58';
		context.fillText('CANVAS', 10, ch/4);
		context.fillText('CANVAS', cw/4, ch/2);
		context.fillText('CANVAS', cw/2, ch*3/4);
		context.restore();
		
	}

	// 画五角星
	function starPath(){
		context.beginPath();
		for (var i = 0; i < 5; i++) {
			// 大圆起点
			context.lineTo(Math.cos((18 + i*72)/180*Math.PI), -Math.sin((18 + i*72)/180*Math.PI));
			// 小圆起点
			context.lineTo(Math.cos((54 + i*72)/180*Math.PI)*0.5, -Math.sin((54 + i*72)/180*Math.PI)*0.5);
		}
		context.closePath();
	}
	function update() {
		// 对于星星的放大和缩小
		if (lightBall.radius > 700) {
			isIncrease = false;
		}else if(lightBall.radius < 150) {
			isIncrease = true;
		}

		if (isIncrease) {
			lightBall.radius += 5;
		}else {
			lightBall.radius -= 5;
		}
	}
	function init() {
		draw();
		update();
		window.requestAnimationFrame(init);
	};

	init();
	
})()