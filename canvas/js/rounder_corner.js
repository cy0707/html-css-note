;(function(){
	var canvas = document.getElementById('rounder');
	// 不支持的浏览器直接不显示
	if (!canvas || !canvas.getContext) {
		alert("您的浏览器太旧了,升级您的浏览器");
		return false;
	}
	var	context = canvas.getContext('2d'),
		cw = 800,
		ch = 800;
		canvas.width = cw;
		canvas.height = ch;

		fillRoundRect(context, 150, 150, 500, 500, 20, '#bbada0');
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				fillRoundRect(context, 170 + i*120, 170 + j*120, 100, 100, 6, '#ccc0b3');
			}
		}
		
	// 圆角矩形的填充
	function fillRoundRect(ctx, x, y, width, height, radius, fillColor) {

		// 对圆的的半径进行判断，不能超过宽和高
		if (2*radius > width || 2*radius > height) {
			alert('您传入的半径太大了，请重新传入');
			return;
		}
		ctx.save();
		ctx.translate(x, y);
		pathRoundRect(ctx, width, height, radius);
		ctx.fillStyle = fillColor || 'black';
		ctx.fill();
		ctx.restore();
	}

	// 圆角矩形的边框
	function strokeRoundRect(ctx, x, y, width, height, radius, lineWidth, strokeColor) {

		// 对圆的的半径进行判断，不能超过宽和高
		if (2*radius > width || 2*radius > height) {
			alert('您传入的半径太大了，请重新传入');
			return;
		}
		ctx.save();
		ctx.translate(x, y);
		pathRoundRect(ctx, width, height, radius);
		ctx.lineWidth = lineWidth || 1;
		ctx.strokeStyle = strokeColor || 'black';
		ctx.stroke();
		ctx.restore();
	}


	// 圆角矩形的路径
	function pathRoundRect(ctx, width, height, radius) {
		ctx.beginPath();
		// 默认的沿着顺时针方向进行绘制圆形，为false
		// 逆时针方向是true
		ctx.arc(width - radius, height - radius, radius, 0, Math.PI/2);
		ctx.arc(radius, height - radius, radius, Math.PI/2, Math.PI);
		ctx.arc(radius, radius, radius, Math.PI, Math.PI*3/2);
		ctx.arc(width - radius, radius, radius,  Math.PI*3/2, Math.PI*2);
		ctx.closePath();
	}
})()