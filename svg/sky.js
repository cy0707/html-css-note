;(function(){
// 命名空间
var svgNS = 'http://www.w3.org/2000/svg',
    xlinkNS = 'http://www.w3.org/1999/xlink',
    sky = document.querySelector('svg'),
    oneStar = document.querySelector('#star'),
    starGroup = document.querySelector('#star-group'),
    starCount = 500; //星星的总数

// 随机数
function randomNumber(min, max) {
	return min + (max - min)*Math.random();
}
// 随机生成星星
function renderStar() {
	while(starCount--){
		// 创建use元素，复用星光
		var useStar = document.createElementNS(svgNS, 'use');
		useStar.setAttributeNS(xlinkNS, 'xlink:href','#'+oneStar.id);
		useStar.setAttribute('fill', 'rgba(255, 255, 255, '+ randomNumber(0.4, 0.8)+')');
		useStar.setAttribute('transform', 'translate(' + randomNumber(-400, 400) + ',' + randomNumber(-300, 50) + ')' + ' scale(' + randomNumber(0.1, 0.6) + ')');
		starGroup.appendChild(useStar);
	}
}

renderStar();
})()