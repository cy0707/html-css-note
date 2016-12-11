;(function(){
	var canvas = document.getElementById('moon');
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

	fillMoon(context, 2, 400, 400, 300, 0);

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