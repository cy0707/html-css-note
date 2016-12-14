;(function(){
	var canvas = document.getElementById('canavs');
	// 直接创建一个canvas标签
	var watermark = document.createElement('canvas');
	// 不支持的浏览器直接不显示
	if (!canvas || !canvas.getContext) {
		alert("您的浏览器太旧了,升级您的浏览器");
		return false;
	}
	var	context = canvas.getContext('2d'),
		watermarkContext = watermark.getContext('2d'),
		cw = 1152,
		ch = 768,
		watermarkCw = 400,
		watermarkCh = 100,
		// 缩放值
		slide = document.getElementById('scale-range'),
		scale = slide.value,
		imgWidth = 0,
		imgHeight = 0,
		dx = 0,
		dy = 0,
		img = new Image();

		canvas.width = cw;
		canvas.height = ch;	

	img.src = 'images/img-lg.jpg';
	// 图片加载完成
	img.onload = function() {
		drawImageByScale(scale);
		slide.addEventListener('mousemove', slideMove, false);
	}
	// 画出水印
	watermark.width = watermarkCw;
	watermark.heigh = watermarkCh;

	watermarkContext.font = 'bold 50px Arial';
	watermarkContext.fillStyle = 'rgba(255, 255, 255, 0.5)';
	watermarkContext.textBaseline = 'middle';
	watermarkContext.fillText('==Ann~0707==',20, 50);
	// 画出图像
	function drawImageByScale(scale) {
		imgWidth = 1152*scale;
		imgHeight = 768*scale;
		dx = cw/2 - imgWidth/2;
		dy = cw/2 - imgWidth/2;
		// 每一次进行重新绘制之前，进行清除
		context.clearRect(0, 0, cw, ch);
		context.drawImage(img, dx, dy, imgWidth, imgHeight);
		context.drawImage(watermark, cw/2-watermarkCw/2, ch/2-watermarkCh/2);
	}
	// 滑杆事件
	function slideMove() {
		scale = slide.value;
		drawImageByScale(scale);
	}
})()