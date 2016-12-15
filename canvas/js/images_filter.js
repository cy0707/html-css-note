;(function(){
	var canvasA = document.getElementById('canvas-a');
	var canvasB = document.getElementById('canvas-b');
	// 不支持的浏览器直接不显示
	if (!canvasA || !canvasA.getContext) {
		alert("您的浏览器太旧了,升级您的浏览器");
		return false;
	}
	var	contextA = canvasA.getContext('2d'),
		contextB = canvasB.getContext('2d'),
		cw = 800,
		ch = 560,
		filter = document.getElementById('filter'),
		greyFilter = document.getElementById('grey-filter'),
		blackWhiteFilter = document.getElementById('black-white-filter'),
		reverseFilter = document.getElementById('reverse-filter'),
		blurFilter = document.getElementById('blur-filter'),
		img = new Image();

	canvasA.width = cw;
	canvasA.height = ch;
	canvasB.width = cw;
	canvasB.height = ch;
	img.src = 'images/autumn.jpg';
	// 图片加载完成
	img.onload = function() {
		// 新增加的canvas的大小填充为图像的宽度和高度
		contextA.drawImage(img, 0, 0, cw, ch);
	}
	filter.addEventListener('click', fliterImg, false);
	greyFilter.addEventListener('click', greyFilterImg, false);
	blackWhiteFilter.addEventListener('click', blackWhiteFilterImg, false);
	reverseFilter.addEventListener('click', reverseFilterImg, false);
	blurFilter.addEventListener('click', blurFilterImg, false);
	// 滤镜事件
	function fliterImg() {
		// 图像信息
		var imageData = contextA.getImageData(0, 0, cw, ch);
		// 像素信息
		var pixelData = imageData.data;
		for (var i = 0; i < canvasB.width*canvasB.height; i++) {
			pixelData[4*i +0] = 0;
			// pixelData[4*i + 1] = 0;
			pixelData[4*i +2] = 0;
		}

		contextB.putImageData(imageData, 0, 0, 0, 0, cw, ch);
	}

	// 灰色事件
	function greyFilterImg() {
		// 图像信息
		var imageData = contextA.getImageData(0, 0, cw, ch);
		// 像素信息
		var pixelData = imageData.data;
		for (var i = 0; i < canvasB.width*canvasB.height; i++) {
			var r = pixelData[4*i + 0] ,
				g = pixelData[4*i + 1] ,
				b = pixelData[4*i + 2];

			var	grey = r*0.3 + g*0.59 + b*0.11;

			pixelData[4*i + 0] = grey;
			pixelData[4*i + 1] = grey;
			pixelData[4*i + 2] = grey;

		}

		contextB.putImageData(imageData, 0, 0, 0, 0, cw, ch);
	}

	// 黑白滤镜
	function blackWhiteFilterImg() {
		// 图像信息
		var imageData = contextA.getImageData(0, 0, cw, ch);
		// 像素信息
		var pixelData = imageData.data;
		for (var i = 0; i < canvasB.width*canvasB.height; i++) {
			var r = pixelData[4*i + 0] ,
				g = pixelData[4*i + 1] ,
				b = pixelData[4*i + 2];

			var	grey = r*0.3 + g*0.59 + b*0.11;
			// 当灰度大于白色色值的一半，就把色值变为白色
			if (grey > 255/2) {
				v = 255;
			}else{
				// 不然全部变成黑色
				v = 0;
			}

			pixelData[4*i + 0] = v;
			pixelData[4*i + 1] = v;
			pixelData[4*i + 2] = v;

		}

		contextB.putImageData(imageData, 0, 0, 0, 0, cw, ch);
	}
	// 反显滤镜
	function reverseFilterImg() {
		// 图像信息
		var imageData = contextA.getImageData(0, 0, cw, ch);
		// 像素信息
		var pixelData = imageData.data;
		for (var i = 0; i < canvasB.width*canvasB.height; i++) {
			var r = pixelData[4*i + 0] ,
				g = pixelData[4*i + 1] ,
				b = pixelData[4*i + 2];

			pixelData[4*i + 0] = 255 - r;
			pixelData[4*i + 1] = 255 - g;
			pixelData[4*i + 2] = 255 - b;

		}

		contextB.putImageData(imageData, 0, 0, 0, 0, cw, ch);
	}
	
	// 模糊滤镜
	function blurFilterImg() {
		// 临时图像信息
		var tmpImageData = contextA.getImageData(0, 0, cw, ch);
		var tmpPixelData = tmpImageData.data;
		// 图像信息
		var imageData = contextA.getImageData(0, 0, cw, ch);
		// 像素信息
		var pixelData = imageData.data;
		// 模糊半径
		var blurR = 3;
		var totalNumber = (2*blurR+1)*(2*blurR+1);
		for (var i = 1; i < canvasB.width-1; i++) {
			for (var j = 1; i < canvasB.height-1; j++) {
				// 周围的颜色的总和
				var totalr = 0,
					totalg = 0,
					totalb = 0;
				for (var dx = -blurR; dx <= blurR; dx++) {
					for (var dy = -blurR; dy <= blurR; dy++) {
						var x = i + dx;
						var y = j + dy;
						var p = x*canvasB.width + y;
						totalr += tmpPixelData[p*4 + 0];
						totalg += tmpPixelData[p*4 + 1];
						totalb += tmpPixelData[p*4 + 2];
					}
					var p = i*canvasB.width + j;
					tmpPixelData[p*4 + 0] = totalr/9;
					tmpPixelData[p*4 + 1] = totalg/9;
					tmpPixelData[p*4 + 2] = totalb/9;
				}
			}
		}

		contextB.putImageData(imageData, 0, 0, 0, 0, cw, ch);
	}
})()