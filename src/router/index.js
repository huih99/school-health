import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)

import index from '@/components/index/index.vue'

const parent = resolve => {
  require(['../components/parent/parent.vue'], resolve)
};
const teacher = resolve => {
  require(['../components/teacher/teacher.vue'], resolve)
};
const leaveMain = resolve => {
  require(['../components/leaveMain/leaveMain.vue'], resolve)
};
const leaveDetail = resolve => {
  require(['../components/leaveDetail/leaveDetail.vue'], resolve)
};
const login = resolve => {
  require(['../components/login/login.vue'], resolve)
};
const register = resolve => {
  require(['../components/register/register.vue'], resolve)
};
const articlePage = resolve => {
  require(['../components/articlePage/articlePage.vue'], resolve)
};
const test = resolve => {
  require(['../components/test/test.vue'], resolve)
};
const newsList = resolve => {
  require(['../components/newsList/newsList.vue'], resolve)
};
const leaveApproval = resolve => {
  require(['../components/leaveApproval/leaveApproval.vue'], resolve)
};
const approvalDetail = resolve => {
  require(['../components/approvalDetail/approvalDetail.vue'], resolve)
};
const symptomReport = resolve => {
  require(['../components/symptomReport/symptomReport.vue'], resolve)
};
const symptomReportDetail = resolve => {
  require(['../components/symptomReportDetail/symptomReportDetail.vue'], resolve)
};
const symptomReportDetailAdd = resolve => {
  require(['../components/symptomReportDetailAdd/symptomReportDetailAdd.vue'], resolve)
};
const symptomStudentReport = resolve => {
  require(['../components/symptomStudentReport/symptomStudentReport.vue'], resolve)
};
const analysis = resolve => {
  require(['../components/analysis/analysis.vue'], resolve)
};
const changePassword = resolve => {
  require(['../components/changePassword/changePassword.vue'], resolve)
};
const forgetPassword = resolve => {
  require(['../components/forgetPassword/forgetPassword.vue'], resolve)
};
// auto add components

export const CommonRoutes = [{
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      name: 'index',
      component: index,
    },
    {
      name: 'login',
      path: '/login',
      component: login
    },
    {
      name: 'register',
      path: '/register',
      component: register
    },
    {
      name: 'newsList',
      path: '/newsList',
      component: newsList
    },
    {
      name:'articlePage',
      path:'/articlePage',
      component: articlePage
    },
    {
      name:'test',
      path:'/test',
      component:test
    },
    {
      name: '404',
      path: '/404',
      component: login
    }]

export const AsyncRoutes = [{
    name: 'parent',
    path: '/parent',
    component: parent,
    meta:{role:['parent']}
  },
  {
    name: 'teacher',
    path: '/teacher',
    component: teacher,
    meta:{role:['teacher']}
  },
  {
    name: 'leaveMain',
    path: '/leaveMain',
    component: leaveMain,
    meta:{role:['parent']}
  },
  {
    name: 'leaveDetail',
    path: '/leaveDetail',
    component: leaveDetail,
    meta:{role:['parent','teacher']}
  },
  {
    name: 'leaveApproval',
    path: '/leaveApproval',
    component: leaveApproval,
  },
  {
      name: 'approvalDetail',
      path: '/approvalDetail',
      component: approvalDetail,
      meta:{role:['teacher']}
  },
    {
      name: 'symptomReport',
      path: '/symptomReport',
      component: symptomReport,
      meta:{role:['teacher']}
    },
    {
      name: 'symptomReportDetail',
      path: '/index/symptomReportDetail',
      component: symptomReportDetail 
    },
    {
      name: 'symptomReportDetailAdd',
      path: '/index/symptomReportDetailAdd',
      component: symptomReportDetailAdd 
    },
    {
      name: 'symptomStudentReport',
      path: '/index/symptomStudentReport',
      component: symptomStudentReport  
    },
    {
      name: 'analysis',
      path: '/index/analysis',
      component: analysis
    },
    {
      name: 'changePassword',
      path: '/index/changePassword',
      component: changePassword
    },
    {
      name: 'forgetPassword',
      path: '/index/forgetPassword',
      component: forgetPassword
    },// auto add routePath
    { path: '*', redirect: '/index' }
]



const router = new Router({
  // mode: 'history',
  routes: CommonRoutes
})
router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0;
  if (to.path === '/index') {
    next();
  } else {
    if (store.getters.roles.length === 0) { 
      store.dispatch('getRoles').then(res => { 
        const roles = res.data.role;
        store.dispatch('GenerateRoutes', { roles }).then(() => { 
          router.addRoutes(store.getters.addRoutes) 
          next({ ...to, replace: true })
        })
      }).catch(err => {
        console.log(err);
      });
    } else {
      next() 
    }
  }
  
});
export default router;
