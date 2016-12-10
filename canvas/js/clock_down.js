;(function(){
	var canvas = document.getElementById('number');
	// 不支持的浏览器直接不显示
	if (!canvas || !canvas.getContext) {
		alert("您的浏览器太旧了,升级您的浏览器");
		return false;
	}
	var	context = canvas.getContext('2d'),
	// 画布的宽高
		cw = document.documentElement.clientWidth,
		ch = document.documentElement.clientHeight,
	// 元素距离左边边距的距离,占整个屏幕的4/5，
		leftDistance = Math.round(cw/10),
	// 元素距离上边距的距离，占整屏幕的1/5
		topDistance = Math.round(ch/5),
	// 当前时间显示的秒数
		curShowSeconds = 0,
	// 随机出现的小球的数组集合
		balls = [ ],
	// 小球的半径,占整个屏幕的4/5，让整个Canvas标签,一共108个小球，小球的半球-1;
		ballR = Math.round(cw*4/5/108) -1,
	// 摩擦系数
		f = 0.8;

	// 注意此时设置的是Canvas的元素的宽高
	canvas.width = cw;
	canvas.height = ch;

	// 获取当前时间
	curShowSeconds = getShowSeconds(); 

	// 生产随机16进制的颜色
	function randomColor() {
		// 因此16进制中的ffffff其实是 parseInt("ffffff", 16) == 16777215，
		// 16777215是2^24 - 1的值
		//因此左位移操作乘以一个随机数 Math.random()*(1<<24) 
		// 可以得到一个0 到 16777216之间的值
		(~~(Math.random()*(1<<24))).toString(16);
	}

	// 把当前时间与目标时间计算，得到剩余的秒数
	function getShowSeconds() {
		var nowTime = new Date();
		// 获取今天已经走过的时间，不能用getTime()这个时间是因为是对于1970年的时间
		var ret = nowTime.getHours()*3600 + nowTime.getMinutes()*60 + nowTime.getSeconds();
		// 判断这个时间差
		return ret;
	}

	//更新时间
	function update() {
		// 下一次的时间,与目标时间差
		var nextShowSeconds = getShowSeconds(),
		    nextHours = parseInt(nextShowSeconds/3600),
			nextMinutes = parseInt((nextShowSeconds - nextHours*3600)/60),
			nextSeconds = nextShowSeconds%60;
		// 现在的时间，与目标时间差
		    curHours = parseInt(curShowSeconds/3600),
			curMinutes = parseInt((curShowSeconds - curHours*3600)/60),
			curSeconds = curShowSeconds%60;
		// 判断这两次的秒数是否相同，相同则不变换，不相同，则变换
		if (nextSeconds != curSeconds) {
			// 生成动画小球，比较时间不懂，那个时间不同就添加小球
			if (parseInt(curHours/10) != parseInt(nextHours/10)) {
				addBalls(leftDistance + 0, topDistance, parseInt(curHours/10));
			}
			if (parseInt(curHours%10) != parseInt(nextHours%10)) {
				addBalls(leftDistance + 15*(ballR+1), topDistance, parseInt(curHours%10));
			}
			if (parseInt(curMinutes/10) != parseInt(curMinutes/10)) {
				addBalls(leftDistance + 39*(ballR+1), topDistance, parseInt(curMinutes/10));
			}
			if (parseInt(curMinutes%10) != parseInt(curMinutes%10)) {
				addBalls(leftDistance + 54*(ballR+1), topDistance, parseInt(curMinutes%10));
			}
			if (parseInt(curSeconds/10) != parseInt(nextSeconds/10)) {
				addBalls(leftDistance + 78*(ballR+1), topDistance, parseInt(curSeconds/10));
			}
			if (parseInt(curSeconds%10) != parseInt(nextSeconds%10)) {

				addBalls(leftDistance + 93*(ballR+1), topDistance, parseInt(curSeconds%10));
			}

			// 把当前的时间设置为下一次的时间
			// 对于当前时间差更新
			curShowSeconds = nextShowSeconds;
		}

		// 使小球弹跳
		updateBalls();
	}


	// 增加弹跳小球
	// x,y分别为小球的坐标位置，number是绘制的数字
	function addBalls(x, y, number) {
		// 对digital
		for (var i = 0; i < digital[number].length; i++) {
			for (var j = 0, numberLen = digital[number][i].length; j < numberLen ; j++) {
				// 如果是1的话，就画实心圆
				if (digital[number][i][j] === 1) {
					var oneBall = {
						sx: x + j*2*(ballR+1) + (ballR+1),
						sy: y + i*2*(ballR+1) + (ballR+1),
						g: 1.5 + Math.random(),
						vx: Math.random()*8 - 4, //获取一个正负4，-4之间的区域
						vy: -5, //获取一个正负5， -5之间的区域
						color: '#' + (~~(Math.random()*(1<<24))).toString(16)
					}
					// 把新的小球放在数组中
					balls.push(oneBall);
				}

			}
		}
	} 

	// 使小球弹跳
	function updateBalls() {
		for (var i = 0; i < balls.length; i++) {
			balls[i].sx += balls[i].vx;
			balls[i].sy += balls[i].vy;
			balls[i].vy += balls[i].g;
			// 边界判断，只对上下边界进行判断
			if (balls[i].sy >= ch - ballR) {
				balls[i].sy = ch - ballR;
				balls[i].vy = -balls[i].vy*f;
			}
		}

		// 对于小球的个数进行判断，性能的优化
		var totalNumber = 0; //对屏幕中出现的小球
		for (var j = 0; j < balls.length; j++) {
			if (balls[j].sx + ballR > 0 && balls[j].sx - ballR < cw) {
				balls[totalNumber++] = balls[j];
			}

		}

		while(balls.length > Math.min(300, totalNumber)){
			console.log(totalNumber);
			balls.pop();
		}
	}

	// 绘制时间
	function render() {
		// 清楚画布
		context.clearRect(0, 0, cw, ch);
		console.log(curShowSeconds);
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

		// 对小球进行绘制
		for (var i = 0; i < balls.length; i++) {
			context.fillStyle = balls[i].color;
			context.beginPath();
			context.arc(balls[i].sx, balls[i].sy, ballR, 0, Math.PI*2, true);
			context.closePath();
			context.fill();
		}

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

	// 根据时间实时的更新画布的数字
	function init() {
		render();
		update();
		window.requestAnimationFrame(init);
	}
	init();
	
})()