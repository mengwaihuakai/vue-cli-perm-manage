import Vue from 'vue'
import Router from 'vue-router'
import Store from '../store'
import Login from '@/pages/Login' // 写法一
import Main from '@/pages/Main'

Vue.use(Router)

let route = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login // 写法一
    },
    {
      path: '/',
      name: 'Index',
      component: Main,
      children: [
        {
          path: 'index',
          component: resolve => { return require(['../pages/contentPages/Index.vue'], resolve) } // 写法二
        }],
      meta: 'offer'// 权限名称
    }
  ]
})

route.beforeEach((to, from, next) => {
  // 获取用户权限信息，为空即没登录，跳转至登录页
  if (to.path === '/login' || to.path === '/') {
    next()
  } else {
    // 获取store中数据perms  如果页面刷新了则到sessionStorage中取
    let perms = Store.state.perms.length > 0 ? Store.state.perms : JSON.parse(sessionStorage.getItem('store')).perms
    if (!perms || perms.length === 0) {
      next('/login')
    } else {
      // 通过indexOf判断 perms中是否包含meta 从而确定是否跳转
      if (perms.includes(to.matched[0].meta)) {
        next()
      } else {
        next('/login')
      }
    }
  }
})

export default route
