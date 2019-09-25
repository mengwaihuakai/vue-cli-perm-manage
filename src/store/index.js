import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    perms: [],
    account: null
  },
  getters: { // 类似vue的computer
    getPerms: state => state.perms,
    getAccount: state => state.account
  },
  mutations: {
    addPerms (state, perms) { // state指上面定义的state对象
      state.perms = perms
    },
    setAccount (state, account) {
      state.account = account
    },
    truncatState (state) {
      for (let key in state) {
        delete state[key]
      }
    }
  },
  actions: {
    addPerms ({commit}, perms) { // 获取一个与store 实例具有相同方法的属性的context对象 context 解构为 {commit, state}
      commit('addPerms', perms)
    },
    setAccount ({commit}, account) { // 获取一个与store 实例具有相同方法的属性的context对象 context 解构为 {commit, state}
      commit('setAccount', account)
    },
    truncatState ({commit}) {
      commit('truncatState')
    }
  }
})

export default store
