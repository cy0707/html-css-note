//document.cookie得到的值形式如下：
//_octo=GH1.1.448815698.1473815133; _ga=GA1.2.1463004802.1473815133; tz=Asia%2FShanghai
var CookieUtil = {

//设置cookie
  set: function(name, value, expires, path, domain, secure) {
      var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
      //判断时间
      if (expires instanceof Date) {
        // 转为GTM时间
        cookieText += "; expires=" + expires.toGMTString();
      }
      // 如果设置了路径
      if(path){
          cookieText +="; path=" + path;
      }
      // 如果设置域名
      if(domain){
          cookieText += "; domain=" + domain;
      }
      // 如果设置安全
      if(secure){
          cookieText += "; secure";
      }

      // 写入cookie
      document.cookie = cookieText;
  },

//读取cookie
  get: function(name) {
        // 传入参数name
        var cookieName=encodeURIComponent(name) + "=",
        // 在document.cookie利用indexOf寻找
            cookieStart=document.cookie.indexOf(cookieName),
            cookieValue=null;
        // 如果找到，没有找到话，返回值为-1；
        if(cookieStart>-1){
            // 找到;分号之前的name对应的value的值，开始的起点是cookieStart
            var cookieEnd=document.cookie.indexOf(";",cookieStart);
            // 则最后的cookieEnd就是分号的位置
            // 如果没有找到分号，那么这个就是最后的哪一个cookie
            if(cookieEnd==-1){
                cookieEnd=document.cookie.Length;
            }
            //例如：cookie为tz=Asia%2FShanghai
            // 则取得的cookie的值。
            cookieValue=decodeURIComponent(document.cookie.substring(cookieStart+ cookieName.length, cookieEnd));
        }
        return cookieValue;
  },

//删除cookie
  unset: function(name, path, domain, secure) {
    // new Date(0)则把时间设置为1970年
    this.set(name, "", new Date(0), path, domain, secure);
  }
}