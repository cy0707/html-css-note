;(function(){
	var canvas = document.getElementById('canavs');
	// 不支持的浏览器直接不显示
	if (!canvas || !canvas.getContext) {
		alert("您的浏览器太旧了,升级您的浏览器");
		return false;
	}
	var	ctx = canvas.getContext('2d')
		cw = 800,
		ch = 800,
		// 画的集合
		list = [];
		// 是否为当前点击的那个圆
	var showTimer = 0;
	// 当圆重合是，默认点击最下面的圆
	var	currentC = null;
		canvas.width = cw;
		canvas.height = ch;	

	// canvas中的事件
	canvas.addEventListener('mousedown', dragColorChange, false);


	// canvas中的改变颜色
	function dragColorChange(event) {
		// 点击一次，就是重新渲染页面
		// 如果存在当前元素，那么将其选择状态重新恢复为false
		if (currentC) {
			currentC.isCurrent = false;
		}
		// 当前元素重新恢复为null
		currentC = null;
		reDraw(event);
		canvas.addEventListener('mousemove', dragColorhold, false);
		document.addEventListener('mouseup', dragColor, false);
	}
	// 恢复原来的颜色
	function dragColor(event) {
		if(currentC) {
		  currentC.isCurrent = false;
		}
		currentC = null;
		window.cancelAnimationFrame(showTimer);
		canvas.removeEventListener('momousemove', dragColorhold, false);
	}
	// 持续改变颜色
	function dragColorhold(event) {
		// 获取鼠标相对于canvas区域的左边和上边的距离
		var x = event.clientX - canvas.getBoundingClientRect().left;
		var y = event.clientY - canvas.getBoundingClientRect().top;
		// 更改位置
		if (currentC) {
			currentC.x = parseInt(x + (x - currentC.x)/5);
			currentC.y = parseInt(y + (y - currentC.y)/5);
		}
	} 


	// 把圆渲染在画布中
	function draw() {
		for (var i = 0; i < 10; i++) {
			// 实例化画圆
			var c = new Circle(20*i, 20*i, 5*i);
			// 初始胡c的中方法
			c.drawC();
			// 存入圆数组中
			list.push(c);

		}
	}
	// 更新圆
	function reDraw(event) {
		// 清楚上一次所画的内容
		ctx.clearRect(0, 0, cw, ch);
		// 获取鼠标相对于canvas区域的左边和上边的距离
		var x = event.clientX - canvas.getBoundingClientRect().left;
		var y = event.clientY - canvas.getBoundingClientRect().top;
		for (var i = 0; i < list.length; i++) {
			var c = list[i];
			c.drawC(x, y);
		}
		showTimer = window.requestAnimationFrame(reDraw);
		
	}

	// 画圆的构造函数
	// x,y代表坐标位置，r代表半径
	function Circle(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		// 是否为当前元素
		this.isCurrent = false;
	}
	Circle.prototype = {
		drawC: function(x, y) {
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(this.x, this.y-this.r);
			ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
			if((x && y && ctx.isPointInPath(x, y) && !currentC ) || this.isCurrent) {
			   ctx.fillStyle = '#f00';
			   currentC = this;
			   this.isCurrent = true;
			} else {
			   ctx.fillStyle = '#999';
			}
			ctx.closePath();
			ctx.fill();
			ctx.restore();			
		}
	}
	draw();
})()