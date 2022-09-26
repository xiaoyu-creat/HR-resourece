import { login } from '@/api'
export default {
  namespaced: true,
  state: {
    token: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    }
  },
  // 发送异步请求
  actions: {
    // context 小store 里面有commit getters dispatch store
    // 接口
    async loginAction({ commit }, loginData) {
      // 请求
      const data = await login(loginData)
      console.log(data)
      commit('SET_TOKEN', data)
    }
  }
}
