;(function(){

	var canvas = document.getElementById('canvas');
	// 不支持的浏览器直接不显示
	if (!canvas || !canvas.getContext) {
		alert("您的浏览器太旧了,升级您的浏览器");
		return false;
	}
	var	context = canvas.getContext('2d');
		cw = 800,
		ch = 800;

		canvas.width = cw;
		canvas.height = ch;

        var imageData = context.createImageData( cw , ch );
        var pixelData = imageData.data;

        for( var i = 0 ; i < ch ; i ++ ){
        	for( var j = 0 ; j < cw ; j ++ ){

        	    var p = i*cw+j;

        	    pixelData[4*p+0] = parseInt(Math.pow(Math.cos(Math.atan2(j-400,i-400)/2),2)*255);
        	    pixelData[4*p+1] = parseInt(Math.pow(Math.cos(Math.atan2(j-400,i-400)/2-2*Math.acos(-1)/3),2)*255);
        	    pixelData[4*p+2] = parseInt(Math.pow(Math.cos(Math.atan2(j-400,i-400)/2+2*Math.acos(-1)/3),2)*255);
        	    pixelData[4*p+3] = 255;
        	}
        }
            
        context.putImageData( imageData , 0 , 0 , 0 , 0 , cw , ch );
})()