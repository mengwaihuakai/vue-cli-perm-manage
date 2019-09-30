import Vue from 'vue'
import Router from 'vue-router'
import Store from '../store'
import Login from '@/pages/Login' // 写法一
import Main from '@/pages/Main'
import PermError from '@/pages/contentPages/perm/PermError'
import PermUser from '@/pages/contentPages/perm/user/PermUser'
import PermRole from '@/pages/contentPages/perm/role/PermRole'
import AddRole from '@/pages/contentPages/perm/role/AddRole'
import AddUser from '@/pages/contentPages/perm/user/AddUser'
import EditUser from '@/pages/contentPages/perm/user/EditUser'
import EditRole from '@/pages/contentPages/perm/role/EditRole'

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
      component: Main,
      children: [
        {
          path: 'index',
          name: 'Index',
          component: resolve => { return require(['../pages/contentPages/Index.vue'], resolve) } // 写法二
        },
        {
          path: 'permError',
          name: 'PermError',
          component: PermError
        },
        {
          path: 'perm/user/permUser',
          name: 'permUser',
          component: PermUser,
          meta: {
            perms: ['perm_user'],
            breadcrumb: [
              {
                name: 'permUser'
              }
            ]
          }
        },
        {
          path: 'perm/user/toAddUser',
          component: AddUser,
          meta: {
            perms: ['perm_user'],
            breadcrumb: [
              {
                name: 'permUser',
                url: '/perm/user/permUser'
              },
              {
                name: 'addUser'
              }
            ]
          }
        },
        {
          path: 'perm/user/toEditUser',
          component: EditUser,
          meta: {
            perms: ['perm_user'],
            breadcrumb: [
              {
                name: 'permUser',
                url: '/perm/user/permUser'
              },
              {
                name: 'editUser'
              }
            ]
          }
        },
        {
          path: 'perm/role/permRole',
          component: PermRole,
          meta: {
            perms: ['perm_role'],
            breadcrumb: [
              {
                name: 'permRole'
              }
            ]
          }
        },
        {
          path: 'perm/role/toAddRole',
          component: AddRole,
          meta: {
            perms: ['perm_role'],
            breadcrumb: [
              {
                name: 'permRole',
                url: '/perm/role/permRole'
              },
              {
                name: 'addRole'
              }
            ]
          }
        },
        {
          path: 'perm/role/toEditRole',
          component: EditRole,
          meta: {
            perms: ['perm_role'],
            breadcrumb: [
              {
                name: 'permRole',
                url: '/perm/role/permRole'
              },
              {
                name: 'editRole'
              }
            ]
          }
        }]
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
      if (Store.state && Store.state.perms && Store.state.perms.length > 0) {
        perms = Store.state.perms
      } else {
        if (window.localStorage.getItem('store')) {
          let state = JSON.parse(window.localStorage.getItem('store'))
          perms = state.perms
          Store.commit('addPerms', perms)
          Store.commit('setAccount', state.account)
        }
      }
    }
    if (!perms || perms.length === 0) {
      next('/login')
    } else {
      // 通过indexOf判断 perms中是否包含meta 从而确定是否跳转
      let contains = true
      let metaPerms = to.meta.perms
      if (metaPerms) {
        contains = metaPerms.some(item => {
          return perms.includes(item)
        })
      }
      if (contains) {
        next()
      } else {
        next('/permError')
      }
    }
  }
})

export default route
