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
    let perms = null
    if (!document.cookie) { // 关闭浏览器窗口的时候cookie会消失，清空浏览器缓存在localStorage的数据
      window.localStorage.removeItem('store')
    } else {
      // 获取store中数据perms  如果页面刷新了则到sessionStorage中取
      perms = (Store.state && Store.state.perms && Store.state.perms.length > 0) ? Store.state.perms : (window.localStorage.getItem('store') ? JSON.parse(window.localStorage.getItem('store')).perms : null)
    }
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
