 const checkBrowser = () => {
   let browser = {
     versions: function () {
       let u = navigator.userAgent,
         app = navigator.appVersion;
       return {
         trident: u.indexOf('Trident') > -1, //IE内核
         presto: u.indexOf('Presto') > -1, //opera内核
         webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
         gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
         mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
         ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
         android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //   android终端或uc浏览器
         iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
         iPad: u.indexOf('iPad') > -1, //是否iPad
         webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
       };
     }(),
     language: (navigator.browserLanguage || navigator.language).toLowerCase()
   };
   if (browser.versions.mobile) {
     let ua = navigator.userAgent.toLowerCase();
     if (ua.match(/MicroMessenger/i) == "micromessenger") {
       //在微信中打开
       return '1';
     } else if (browser.versions.ios) {
       //是否在IOS浏览器打开
       return '2';
     } else if (browser.versions.android) {
       //是否在安卓浏览器打开
       return '3';
     }
   }
 };
 const checkBrowserBackStr = () => {
   let browser = {
     versions: function () {
       let u = navigator.userAgent,
         app = navigator.appVersion;
       return {
         trident: u.indexOf('Trident') > -1, //IE内核
         presto: u.indexOf('Presto') > -1, //opera内核
         webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
         gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
         mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
         ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
         android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //   android终端或uc浏览器
         iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
         iPad: u.indexOf('iPad') > -1, //是否iPad
         webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
       };
     }(),
     language: (navigator.browserLanguage || navigator.language).toLowerCase()
   };
   if (browser.versions.mobile) {
     let ua = navigator.userAgent.toLowerCase();
     if (ua.match(/MicroMessenger/i) == "micromessenger") {
       //在微信中打开
       return 'weixin';
     } else if (browser.versions.ios) {
       //是否在IOS浏览器打开
       return 'ios';
     } else if (browser.versions.android) {
       //是否在安卓浏览器打开
       return 'android';
     }
   }
 };
 const getUrlParams = (str) => {
   let url = decodeURI(str);
   let params = {};
   let datas = url.split("&");
   for (let i = 0; i < datas.length; i++) {
     let tempData = datas[i].split("=");
     params[tempData[0]] = tempData[1];
   }
   return params;
 };
 const setLocal = (key,  value = {}) => {
   let str = JSON.stringify(value);
   window.localStorage.setItem(key, str)
 };
 const getLocal = (key) => {
   let o = window.localStorage.getItem(key);
   o = JSON.parse(o);
   return o;
 };
 const clearLocal = (key) => {
   window.localStorage.removeItem(key)
 }
 export {
   checkBrowserBackStr,
   checkBrowser,
   getUrlParams,
   setLocal,
   getLocal,
   clearLocal
 };
