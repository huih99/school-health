import Vuex from 'vuex'
import Vue from 'vue'
import api from '../fetch/api.js'
import { getLocal, setLocal } from '../util/util.js'
import { CommonRoutes, AsyncRoutes } from '@/router';

Vue.use(Vuex)

function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

const store = new Vuex.Store({
    state: {
      loading: false,
      userInfo: {}, // 用户登录信息
      roles:[], // 角色权限
      rybz:'',  // 首次进入选择是家长还是教务人员，然后生成对应的路由表
      addRouters: [],
    },
    mutations: {
        setRoutes: (state, routers) => {
            state.addRouters = routers;
            // state.routers = CommonRoutes.concat(routers);
        },
        setLoading(state, value=false) {
            state.loading = value
        },
        setPageTitle(state, value='校园症状监测系统') {
            document.title = value;
            var i = document.createElement('iframe');
            i.src = '//m.baidu.com/favicon.ico';
            i.style.display = 'none';
            i.onload = function() {
                setTimeout(function(){
                i.remove();
                }, 19)
            }
            document.body.appendChild(i);
        },
        set_userInfo(state, value) {
          state.userInfo = value;
        },
        set_roles(state, value = []) {
          state.roles = value;
        },
        set_rybz(state, value = 'parent') {
          state.rybz = value;
          setLocal('rybz', value)
        },
    },
    getters: {
        loading(state) {
            return state.loading;
        },
        roles(state) {
          return state.roles;
        },
        addRoutes(state) {
          return state.addRouters;
        },
        userInfo(state) {
          return state.userInfo;
        }
    },
    actions: {
        LoginByUsername({ commit ,state }, userInfo) {
          console.log(userInfo)
            let param = {
              yhm:userInfo.username,
              mm: userInfo.md5Passwrod
            }
            return new Promise((resolve, reject) => {
              if (state.roles && state.roles[0] == 'teacher') {
                api.loginByTeacher(param).then(res => {
                  if (res.code == 1) {
                    console.log(res.data)
                    commit('set_userInfo', res.data)
                    setLocal('teacher_flag',res.data);
                    resolve();
                  } else {
                    reject(res.msg)
                  }
                }).catch(error => {
                  reject(error)
                });
              } else if (state.roles && state.roles[0] == 'parent') {
                api.loginByParent(param).then(res => {
                  if (res.code == 1) {
                    commit('set_userInfo', res.data);
                    setLocal('parent_flag',res.data);
                    resolve();
                  } else {
                    reject(res.msg)
                  }
                }).catch(error => {
                  reject(error)
                });
              }
            });
        },
        getRoles({ commit ,state},param) {
            return new Promise((resolve,reject) => {
              let bz = state.rybz;
              if (!bz) {
                bz = getLocal('rybz')
              }
              let data = {
                data: {
                  role: [bz]
                }
              }
              commit('set_roles', data.data.role);
              resolve(data);
            });
        },
        GenerateRoutes({ commit }, data) {
          return new Promise(resolve => {
            const { roles } = data;
            const accessedRouters = AsyncRoutes.filter(v => {
              if (hasPermission(roles, v)) {
                return true;
              }
              return false;
            });
            commit('setRoutes', accessedRouters);
            resolve();
          })
        }
    }
});

export default store;
