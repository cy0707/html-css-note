;(function(){
	var canvas = document.getElementById('canavs');
	var magnifierCanvas = document.createElement('canvas');
	// 不支持的浏览器直接不显示
	if (!canvas || !canvas.getContext) {
		alert("您的浏览器太旧了,升级您的浏览器");
		return false;
	}
	var	context = canvas.getContext('2d'),
		magnifierContext = magnifierCanvas.getContext('2d'),
		cw = 1152,
		ch = 768,
		scale = 0,
		// 鼠标是否在canvas的画布中
		isMouseDown = false,
		img = new Image();

		canvas.width = cw;
		canvas.height = ch;	

	img.src = 'images/img-lg.jpg';
	// 图片加载完成
	img.onload = function() {
		// 新增加的canvas的大小填充为图像的宽度和高度
		magnifierCanvas.width = img.width;
		magnifierCanvas.height = img.height;
		// 缩放的比例
		scale = img.width/cw;
		context.drawImage(img, 0, 0, cw, ch);
		// 把新增的图像画画布中
		magnifierContext.drawImage(img, 0, 0);
	}
	

	// 把事件的坐标点变成为canvas坐标
	function windowToCanvas(x, y) {	
		var canvasBox = canvas.getBoundingClientRect();
		return {
			x: x - canvasBox.left,
			y: y - canvasBox.top
		};
	}
	// 鼠标按下事件
	canvas.addEventListener('mousedown', canvasDown, false);
	// 鼠标移动
	canvas.addEventListener('mousemove', canvasMove, false);
	// 松开鼠标
	canvas.addEventListener('mouseup', canvasUp, false);
	// 鼠标移除canvas画布
	canvas.addEventListener('mouseout', canvasOut, false);

	function canvasDown(e) {
		e.preventDefault();
		var point = windowToCanvas(e.clientX, e.clientY);
		isMouseDown = true;
		// 是否制作放大镜
		isDrawMagnifier(true, point);
	}
	function canvasMove(e) {
		e.preventDefault();
		if (isMouseDown) {
			var point = windowToCanvas(e.clientX, e.clientY);
			isDrawMagnifier(true, point);
		}
	}
	function canvasUp(e) {
		e.preventDefault();
		isMouseDown = false;
		isDrawMagnifier(false);
	}
	function canvasOut(e) {
		e.preventDefault();
		isMouseDown = false;
		isDrawMagnifier(false);
	}

	// 是否显示放大镜 isShowMagnifier
	// 作用放大镜的点 point
	function isDrawMagnifier(isShowMagnifier, point) {
		// 先清除画布
		context.clearRect(0, 0, cw, ch);
		// 然后绘制画布
		context.drawImage(img, 0, 0, cw, ch);
		if (isShowMagnifier) {
			drawMagnifier(point);
		}
	}

	//绘制放大镜
	function drawMagnifier(point) {
		var magnifierX = point.x*scale,
			magnifierY = point.y*scale,
			//放大镜的半径 
			magnifierR = 200,
			sx = magnifierX - magnifierR,
			sy = magnifierY - magnifierR,
			dx = point.x - magnifierR,
			dy = point.y - magnifierR;
		// 制作圆形的放大镜
		context.save();
		context.lineWidth = 5;
		context.strokeStyle = '#069';
		context.beginPath();
		context.arc(point.x, point.y, magnifierR, 0, Math.PI*2);
		context.stroke();
		context.clip();
		context.closePath();
		context.drawImage(magnifierCanvas, sx, sy, 2*magnifierR, 2*magnifierR, dx, dy, 2*magnifierR, 2*magnifierR);
		context.restore();
	}
})()