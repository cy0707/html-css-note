var dropbox =document.getElementById('dropbox');
var fileEle = document.getElementById('file');
dropbox.addEventListener('click',function(e){
  if (fileEle) {
    // 点击文件上传
    fileEle.click();
  }
},false);

//获取上传文件的信息
fileEle.addEventListener('change', function(e){
  // 获取文件信息
  handleFiles(this.files);
},false);

//ID 为 dropbox 的元素所在的区域是我们的拖放目的区域。
//我们需要在该元素上绑定 dragenter，dragover，和drop 事件。
dropbox = document.getElementById("dropbox");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

//我们必须阻止dragenter和dragover事件的默认行为，这样才能触发 drop 事件：
function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}
//下面是 drop 函数：
function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  //获取拖拽的信息
  var dt = e.dataTransfer;
  var files = dt.files;
  handleFiles(files);
}
// 显示图片的缩略图
function handleFiles(files) {
  // 遍历拖拽的个数
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var imageType = /^image\//;
    
    if (!imageType.test(file.type) ) {
      // 当前这个文件不符合这个图片格式跳出本次循环
      continue;
    }
    var img = document.createElement("img");
    // 给所有的img添加class为obj
    img.classList.add("add-img");
    // 添加file属性
    img.file = file;
    // 假设 "preview" 是将要展示图片的 div
    dropbox.appendChild(img);
    var reader = new FileReader();
    reader.onload = (function(aImg) { 
      return function(e) { 
        aImg.src = e.target.result; 
      }; 
    })(img);
    // result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.
    reader.readAsDataURL(file);
  }
}

// 异步上传到服务器
function sendFiles() {
//寻找所有的缩略图
  var imgs = document.querySelectorAll(".add-img");
 //遍历所有的缩略图
  for (var i = 0; i < imgs.length; i++) {
    // 上传文件的构造函数
    new FileUpload(imgs[i], imgs[i].file);
  }
}

function FileUpload(img, file) {
  var reader = new FileReader();  
//活动指示器（throbber），其是用于显示相关的进度信息
  this.ctrl = createThrobber(img);
  var xhr = new XMLHttpRequest();
  this.xhr = xhr;
  
  var self = this;
  // progress事件其target是XHR对象，lengthComputable表示进度是否可用
  // 上传过程和下载过程触发的是不同对象的onprogress事件：
// 上传触发的是xhr.upload对象的 onprogress事件
  // 下载触发的是xhr对象的onprogress事件
  this.xhr.upload.addEventListener("progress", function(e) {
        if (e.lengthComputable) {
          // 百分比
          var percentage = Math.round((e.loaded * 100) / e.total);
          // 更新指示器
          self.ctrl.update(percentage);
        }
      }, false);
  
  xhr.upload.addEventListener("load", function(e){
    // 上传完成后
          self.ctrl.update(100);
          var canvas = self.ctrl.ctx.canvas;
          canvas.parentNode.removeChild(canvas);
      }, false);
  // post进行提交到服务器
  xhr.open("POST", 
    "http：//demos.hacks.mozilla.org/paul/demos/resources/webservices/devnull.php");
  // 重写XHR响应的MIME类型。必须在send方法之前
  xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
  reader.onload = function(evt) {
    // XMLHttpRequest 的 sendAsBinary() 函数去上传 file 的内容。
    xhr.sendAsBinary(evt.target.result);
  };
  //result属性中将包含所读取文件的原始二进制数据.
  reader.readAsBinaryString(file);
}