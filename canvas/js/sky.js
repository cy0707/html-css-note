;(function(){
	var canvas = document.getElementById('pentagram');
	// 不支持的浏览器直接不显示
	if (!canvas || !canvas.getContext) {
		alert("您的浏览器太旧了,升级您的浏览器");
		return false;
	}
	var	context = canvas.getContext('2d')
		cw = 1200,
		ch = 600;
		canvas.width = cw;
		canvas.height = ch;	
	var skyStyle = context.createRadialGradient(cw/2, ch, 0, cw/2, ch, ch);
		skyStyle.addColorStop(0, 'black');
		skyStyle.addColorStop(1, '#035' );
		context.fillStyle = skyStyle;
		context.fillRect(0, 0, cw, ch);
		fillMoon(context, 2, 1000, 100, 50, 30);


		// 画很多五角星
		for (var i = 0; i < 200; i++) {
			var x = Math.random()*cw,
				y = Math.random()*ch/2;
				rotate = Math.random()*360;
			drawStar(x, y, rotate);
		}

		// 画很多五角星函数
		function drawStar(x, y, rotate) {
			// 保存存档
			context.save();
			// 旋转x,y轴
			context.translate(x, y);
			// 旋转角度
			context.rotate(rotate/180*Math.PI);

			starPath();

			// 样式
			context.fillStyle = '#fb3';
			context.strokeStyle = '#fd7';
			context.lineWidth = 2;
			context.lineJoin = 'round';

			context.fill();
			context.stroke();
			// 取出存档
			context.restore();
		}

	// 封装为一个函数,绘制一个标准的五角星，不要任何偏移和旋转
	// 然后通过偏移和旋转来绘制其他五角星
	function starPath(){
		context.beginPath();
		for (var i = 0; i < 5; i++) {
			// 大圆起点
			context.lineTo(Math.cos((18 + i*72)/180*Math.PI)*10, -Math.sin((18 + i*72)/180*Math.PI)*10);
			// 小圆起点
			context.lineTo(Math.cos((54 + i*72)/180*Math.PI)*0.5*10, -Math.sin((54 + i*72)/180*Math.PI)*0.5*10);
		}
		context.closePath();
	}
	// fillMoon
	function fillMoon(ctx, d, x, y, R, rotate, fillColor) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rotate*Math.PI/180);
		ctx.scale(R, R);
		pathMoon(ctx, d);
		ctx.fillStyle = fillColor || '#fb5';
		ctx.fill();
		ctx.restore();
	}
	// 绘制圆弧的路径
	function pathMoon(ctx, d) {
		ctx.beginPath();
		// 外圆弧
		ctx.arc(0, 0, 1, 0.5*Math.PI, 1.5*Math.PI, true);
		// 内圆弧
		ctx.moveTo(0, -1);
		ctx.arcTo(d, 0, 0, 1, dis(0, -1, d, 0)/d);
		ctx.closePath();
	}

	function dis(x1, y1, x2, y2) {
		return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
	}
	
})()