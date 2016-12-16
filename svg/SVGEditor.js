;(function(){
	//获取元素
	var showShape = document.querySelector('.action-show'), //展示元素
		createShape = document.querySelector('.create-shape'), //创建形状
		create = document.querySelector('.create'), //创建按钮
		face = document.querySelector('.face'), //填充和边框
		transform  = document.querySelector('.transform')
		selected = null, //当前作用的图形元素
		fillValue = 0,
		strokeValue = 0,
		strokeWidth = 0,
		translateX = document.getElementById('translate-x'),
		translateY =  document.getElementById('translate-y'),
		scale =  document.getElementById('scale'),
		rotate =  document.getElementById('rotate'),


	// 创建默认的svg图形和元素,ns===namespace命名空间
	   svgNS = 'http://www.w3.org/2000/svg',
	   defaultShape = {
	   	  rect: 'x:10,y:10,width:200,height:200,rx:0,ry:0',
	   	  circle: 'cx:200,cy:200,r:50',
	   	  ellipse: 'cx:200,cy:200,rx:80,ry:30',
	   	  line: 'x1:10,y1:10,x2:100,y2:100'
	   },
	// 默认图形的公共属性
		defaultAttrs = {
			fill: '#fff',
			stroke: '#007fff'
		};

	// 创建svg元素
	function createSVG() {
		// 创建svg元素需要命名空间
		var svg = document.createElementNS(svgNS, 'svg');
		svg.setAttribute('width', '100%');
		svg.setAttribute('height', '100%');
		// 插入到展示页面中
		showShape.appendChild(svg);
		svg.addEventListener('click', function(e){
			// 如果点击的形状在默认的图形的属性中
			// for in循环的属性
			if (e.target.tagName.toLowerCase() in defaultShape) {
				// 创建多个图形，点击后选择当前图形
				selectShape(e.target);
			}
		}, false);

		// 返回这个svg标签
		return svg;
	}
	var svg = createSVG();

	// 创建图形的按钮事件
	create.addEventListener('click',createShapeF, false);

	// 图形的按钮事件
	function createShapeF(e) {
		if (e.target.tagName.toLowerCase() === 'button') {
			// 创建图形
			var shape = document.createElementNS(svgNS, e.target.id);
			//在svg标签中插入所创建的图形
			svg.appendChild(shape);
			// 创建选择的图形
			selectShape(shape);
		}
	}

	// 创建图形和默认属性
	function selectShape(shape) {
		// 绘制默认图形的所以属性用逗号分开为一个数组
		var attrs = defaultShape[shape.tagName].split(',');
		// 绘制图形后，根据所绘制的图形的参数，生成控制参数
		// 的操作按钮
		createShape.innerHTML = '';

		var attr, //获取每一个图形的属性
			name,  //设置每一个图形的属性
			value; //每一个图形的属性值

		// 遍历图形的属性
		// shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
		while(attrs.length){
			// 此时是改变数组的长度，进行循环,并且将每一个属性分开成一个数组
			attr = attrs.shift().split(':');
			name = attr[0]; //属性名字
			// 属性值为在元素中设置 或者 默认的
			value = shape.getAttribute(name) || attr[1]; 
			// 创建图形处理按钮
			createHandler(shape, name, value);
			// 修改默认图形
			shape.setAttribute(name, value);
		}

		// 创建属性
		for (name in defaultAttrs) {
			// 没有设置的话，就用默认属性，不然就覆盖默认属性
			value = shape.getAttribute(name) || defaultAttrs[name];
			shape.setAttribute(name, value);
		}
		// 指向当前作用的元素
		selected = shape;
		// 更新创建图形的属性
		updateLookHandler();
	}

	// 创建图形对于的操作手柄
	function createHandler(shape, name, value) {
		var label = document.createElement('label');
		label.innerHTML = name + '<input type="range" min="0" max="800" value="'+value+'" name="'+name+'" />';
		createShape.appendChild(label);
	}

	// 更新创建图形的属性

	function updateLookHandler() {
		//初始化的transform属性,如果开始设置的时候，存在transfor属性的话
		var t = decodeTransform(selected.getAttribute('transform'));
		// 使得点击图形是对应的转换手柄恢复到点击的那个图形的值
		translateX.value = t ? t.tx : 0;
		translateY.value = t ? t.ty : 0;
		rotate.value = t ? t.rotate : 0;
		scale.value = t ? t.scale : 1;
	}
	// 图形的操作手柄的事件
	// html5新增的输入框改变的事件，对于onchange事件来说，不用等到用户释放鼠标
	// 再改变值
	createShape.addEventListener('input', function(e){
		if (e.target.tagName.toLowerCase() === 'input') {
			selected.setAttribute(e.target.name, e.target.value);
		}
	}, false);

	// 外观事件
	face.addEventListener('input', function(e){
		// 如果当前没有选中任何元素的话，弹出提示框
		if (!selected) {
			alert('请先创建图形');
			// selected为null,非null则为true
			return;
		}
		if (e.target.tagName.toLowerCase() === 'input') {
			selected.setAttribute(e.target.id, e.target.value);
		}
	}, false);

	// 外观事件
	transform.addEventListener('input', function(e){
		// 如果当前没有选中任何元素的话，弹出提示框
		if (!selected) {
			alert('请先创建图形');
			// selected为null,非null则为true
			return;
		}
		if (e.target.tagName.toLowerCase() === 'input') {
			selected.setAttribute('transform', encodeTransform({
				tx: translateX.value,
				ty: translateY.value,
				scale: scale.value,
				rotate: rotate.value
			}));
		}
	}, false);

	// 变形的参数匹配,下面是参考格式,2d的格式
	// transform="translate(30, 30) rotate(45) "
	function decodeTransform(transString) {
		// 匹配正则
		var reg = /translate\((\d+),(\d+)\)\srotate\((\d+)\)\sscale\((\d+|\d?\.\d)\)/;
		var match = reg.exec(transString);
		// match代表传入的数字是否匹配的结果，
		return match ? {
			tx: +match[1],
			ty: +match[2],
			rotate: +match[3],
			scale: +match[4]
		} : null;
		// 匹配的话返回一个对象，不然返回一个空对象
	}

	function encodeTransform(transObject) {
		// 返回一个对象
		return 'translate(' + transObject.tx + ',' + transObject.ty + ')' + ' ' + 'rotate('+ transObject.rotate +')' + ' ' + 'scale('+ transObject.scale +')';
	}
})()