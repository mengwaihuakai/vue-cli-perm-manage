// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import _ from 'lodash'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/sass/common.scss' // 全局样式

Vue.use(ElementUI)
Vue.config.productionTip = false
axios.create({
  timeout: 180000
})
axios.defaults.baseURL = '/'
axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.api = axios
Vue.prototype.$qs = qs // 即可直接使用  this.$qs
Vue.prototype._ = _
Vue.prototype.$store = store

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
