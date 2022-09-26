import { loginAPI } from '@/api'

export default ({
  namespaced: true,
  state: {
    token: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    }
  },
  actions: {
    async loginAction({ commit }, logindata) {
      const { data: { token }} = await loginAPI(logindata)
      // 发请求
      commit('SET_TOKEN', token)
    }
  }
})
