import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters' // 派生
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters,
  // 持久化插件 npm install --save vuex-persistedstate@3.2.1
  plugins: [createPersistedState({
    paths: ['user.token'] // 可以缓存模块的特殊字段
    // reducer(state) {
    //   return {
    //     user: state.user.token
    //   }
    // }
  })]
})

export default store
