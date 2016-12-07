;(function(){
	var canvas = document.getElementById('number');
	// 不支持的浏览器直接不显示
	if (!canvas || !canvas.getContext) {
		alert("您的浏览器太旧了,升级您的浏览器");
		return false;
	}
	var	context = canvas.getContext('2d'),
	// 画布的宽高
		cw = 1024,
		ch = 768,
	// 元素距离上边距的距离
		leftDistance = 0,
	// 元素距离左边距的距离
		topDistance = 0,
	// 设置目标时间
		endTime = new Date('2016/12/7, 17:30:00'),
	// 当前时间显示的秒数
		curShowSeconds = 0,
	// 小球的半径
		ballR = 8;
	// 注意此时设置的是Canvas的元素的宽高
	canvas.width = cw;
	canvas.height = ch;
	// 把当前时间与目标时间计算，得到剩余的秒数
	function getShowSeconds() {
		var nowTime = new Date();
		// 时间差,把毫秒数转为秒数
		var ret = Math.round((endTime.getTime() - nowTime.getTime())/1000);
		// 判断这个时间差
		return ret >= 0 ? ret : 0;
	}

	function render() {
		// 分别取出时间差的中的小时,分钟,秒数
		curShowSeconds = getShowSeconds();

		// 定义时间
		var hours = parseInt(curShowSeconds/3600),
		// 小时是用差值的秒数除以3600秒，取整得到
			minutes = parseInt((curShowSeconds - hours*3600)/60),
		// 分钟是用差值减去小时所占的秒数，除以60秒，取整得到
			seconds = curShowSeconds%60;
		// 秒钟，直接处于60秒取余数就是秒数


		// 绘制数字,是一个数字的分开的进行拼接起来的
		// 画小时数字的第一个数字
		renderDigital(leftDistance, topDistance, parseInt(hours/10));
		// 画小时数字的第二个数字,每一个数组是7小球的距离，半径为ballR+1,所以下一个
		// 距离左边的距离是：7*(ballR+1)*2(直径)。乘以15是让每一个数字增加一些距离
		renderDigital(leftDistance + 15*(ballR+1), topDistance, parseInt(hours%10));
		// 绘制冒号,在数组的位置是10。
		renderDigital(leftDistance + 30*(ballR+1), topDistance, 10);
		// 绘制分钟第一位数字。注意冒号4个小球
		renderDigital(leftDistance + 39*(ballR+1), topDistance, parseInt(minutes/10));
		// 绘制分钟第二位数字
		renderDigital(leftDistance + 54*(ballR+1), topDistance, parseInt(minutes%10));
		// 绘制冒号
		renderDigital(leftDistance + 69*(ballR+1), topDistance, 10);
		// 绘制秒钟第一位数字
		renderDigital(leftDistance + 78*(ballR+1), topDistance, parseInt(seconds/10));
		// 绘制秒钟第二位数字
		renderDigital(leftDistance + 93*(ballR+1), topDistance, parseInt(seconds%10));
	}

	// 绘制数字，x和y代表数字的起点坐标
	function renderDigital(x, y, number) {
		// 字的圆形实体的颜色
		context.fillStyle = 'rgb(0, 102, 153)';
		var digitalLen = digital[number].length;
		// 对digital
		for (var i = 0; i < digitalLen; i++) {
			for (var j = 0, numberLen = digital[number][i].length; j < numberLen ; j++) {
				// 如果是1的话，就画实心圆
				if (digital[number][i][j] === 1) {
					context.beginPath();
					// 画圆
					context.arc(x + j*2*(ballR+1) + (ballR+1), y + i*2*(ballR+1) + (ballR+1), ballR, 0, Math.PI*2, true);
					context.closePath();
					context.fill();
				}	
			}
		}
	}

	// 绘制画布
	render();
})()