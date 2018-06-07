import Vue from 'vue'
import store from '@/store'

import axios from 'axios';
Vue.prototype.axios = axios;

import router from './router'

import api from '@/fetch/api.js';
Vue.prototype.api = api;

import App from './App'

import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(MintUI);

// import FastClick from 'fastclick'
// FastClick.attach(document.body);

import Icon from 'vue-svg-icon/Icon.vue';
Vue.component('icon', Icon);

// import 'babel-polyfill';

axios.get('static/config/config.json?random=' + +new Date(), {}).then(res => {
  // 初始化配置
  api.initConfig(res.data);
  init();
}).catch(err =>  {
  alert('数据初始化出错!');
});

Vue.config.devtools = true;
 /**
   * 格式化时间 返回格式YYYY-MM-DD
   * @param {Date} data 
   */
Vue.prototype.getLocalTime = (data) => {
    data = data || new Date();
    data = new Date(data);
    let year = data.getFullYear();
    let month = data.getMonth() + 1 < 10 ? "0" + (data.getMonth() + 1)   : data.getMonth() + 1;
    let day = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
    let dateStr = year + "-" + month + "-" + day;
    return dateStr;
}
//删除数组指定元素
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
Vue.prototype.completeHeadImgSrc = function (src) {
  let addStr = axios.defaults.imgUrl;
  if (!!src) {
    var a = src.indexOf('/rest/downLoadFileById?fileId=');
    if (a == 0) { } else if (a == -1) {
      addStr = addStr + '/rest/downLoadFileById?fileId=';
    }
  }
  if (!src) {
    src = '';
    return src;
  } else {
    if (src.indexOf('http') < 0) {
      let tempStr = addStr + src;
      return tempStr;
    } else {
      return src;
    }
  }
}
Vue.prototype.completeImgSrc = function (content, addStr) {
  let imgReg = /<img.*?(?:>|\/>)/gi;
  let srcReg = /src=[\'"]?([^\'"]*)[\'"]?/i;
  let tarr = content.match(imgReg);
  let curStr = addStr;
  if (!tarr) {
    tarr = [];
  }
  for (var i = 0; i < tarr.length; i++) {
    let src = tarr[i].match(srcReg);
    console.log(src[1])
    if (src[1].indexOf('http') < 0) {
      if (src[1].indexOf('/rest/downLoadFileById?fileId=') != 0) {
        curStr = addStr + '/rest/downLoadFileById?fileId=';
      }
      let tempStr = curStr + src[1];
      let newStr = `src="${tempStr}"`;
      content = content.replace(src[0], newStr);
    }
  }
  return content;
}
function init() {
  let vm = new Vue({
    el: '#app',
    router,
    store,
    components: {
      App
    },
    template: '<App/>',
  })
}
