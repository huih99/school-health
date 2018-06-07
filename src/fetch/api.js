import axios from 'axios'
import store from '@/store'
import Vue from 'vue'

//POST传参序列化
axios.interceptors.request.use((config) => {
  store.commit('setLoading', true)
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
  store.commit('setLoading', false)
  return response
}, error => {
  store.commit('setLoading', false)
  if (error.message.indexOf('timeout') >= 0) {
    Vue.$toast('连接超时，请检查网络')
  }
  return Promise.reject(error)
})

export function getHtml(url) {
  url = url + '?ref=' + new Date().getTime() + '' + Math.random();
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}
export function get(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  })
}
export function fetch(url, params) {
  return new Promise((resolve, reject) => {
    axios({
        method: 'post',
        url: url,
        data: {
          data: JSON.stringify(params)
        },
        timeout: 8000,
        transformRequest: [function (data) {
          // Do whatever you want to transform the data
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
      })
      .then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
  })
}

let sysConfig;

export default {
  getHtml,
  initConfig(data) {
    sysConfig = data;
    if (sysConfig.rootUrl) {
      axios.defaults.baseURL = sysConfig.rootUrl;
      axios.defaults.imgUrl = sysConfig.imgUrl;
      axios.defaults.htmlUrl = sysConfig.htmlUrl;
    }
  },
  loginByParent(params) {
    return fetch('/rest/commitData/080902/2', params)
  },
  loginByTeacher(params) {
    return fetch('/rest/commitData/080902/1', params)
  },
  register(params) {
    return fetch('/rest/commitData/080902/3', params)
  },
  getChildByParent(params) {
    return fetch('/rest/queryDataBySql/080902/1', params) 
  },
  saveBjByParent(params) {
    return fetch('/rest/commitData/020201/04', params);
  },
  //教务人员 症状填报的
  saveZZByTeacher(params) {
    return fetch('/rest/commitData/020201/01', params);
  },
  //班主任审核
  approvalByTeacher(params) {
    return fetch('/rest/commitData/020201/05', params);
  },
  //密码修改/重置
  changePassword(params) {
    return fetch('/rest/commitData/080902/4', params);
  },
  

  
  //查询单个学生的请假记录
  getQjjlByParent(params) {
    return fetch('/rest/queryDataBySql/020201/03', params);
  },
  getArticleListByPagination(params) {
    return fetch('/rest/queryDataBySql/020107/01', params)
  },
  getActicleDetail(params) {
    return fetch('/rest/queryDataBySql/020107/02', params)
  },
  getStudentsByClass(params){
    return fetch('/rest/queryDataBySql/020103/01', params)
  },
  getClassByjwry(params){
    return fetch('/rest/queryDataBySql/020106/1',params)
  },
  getQjjlByTeacher(params){
    return fetch('/rest/queryDataBySql/020201/03',params)
  },
  //获取学生单独的症状数据
  getStudentSymptom(params){
    return fetch('/rest/queryDataBySql/020201/01', params)
  },
  //通过ID获取症状
  getSymptomById(params) {
    return fetch('/rest/queryDataBySql/020201/02', params)
  },
  getStudentInfo(params) {
    return fetch('/rest/queryDataBySql/020103/02', params)
  },
  //获取统计图表数据 --在校状况
  getAnalysisData(params) {
    return fetch('/rest/queryDataBySql/020301/01', params)
  },
  //获取统计图表数据 --当日症状
  getAnalysisSymptomsData(params) {
    return fetch('/rest/queryDataBySql/020301/02', params)
  },
  //获取统计图表数据 --三日症状趋势
  getSymptomsThreeDays(params) {
    return fetch('/rest/queryDataBySql/020301/03', params)
  },
}
