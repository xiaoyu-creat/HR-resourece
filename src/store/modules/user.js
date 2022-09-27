import { login, getUserInfo, getUserDetailById } from '@/api'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {},
    hrsaasTime: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    REMOVE_USER_INFO(state) {
      state.userInfo = {}
    },
    REMOVE_TOKEN(state) {
      state.token = null
    },
    SET_HRSAAS_TIME(state, hrsaasTime) {
      state.hrsaasTime = hrsaasTime
    }
  },
  // 发送异步请求
  actions: {
    // context 小store 里面有commit getters dispatch store
    // 接口
    async loginAction({ commit }, loginData) {
      // 请求
      const data = await login(loginData)
      // console.log(data)
      commit('SET_TOKEN', data)
      commit('SET_HRSAAS_TIME', new Date().getTime()) // 时间1  登录成功接口调用的时间
    },
    async getUserInfo({ commit }) {
      // 接口请求
      const res = await getUserInfo()
      const res1 = await getUserDetailById(res.userId)
      const result = { ...res, ...res1 }
      commit('SET_USER_INFO', result)
      return JSON.parse(JSON.stringify(result))
    },
    logout({ commit }) {
      // 清空用户数据 userInfo
      commit('REMOVE_USER_INFO')
      // 清空token 会同步到持久化，自动清除本地存储
      commit('REMOVE_TOKEN')
    }
  }
}
