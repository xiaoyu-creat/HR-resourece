// 实现对axios的二次封装
import axios from 'axios'
import { Message } from 'element-ui'
// 通过axios创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址 api /dev-api
  timeout: 5000 // 超时时间
})

// 响应拦截器
service.interceptors.response.use(response => {
  // 1.考虑把那些数据抛出去
  // 2.接口成功 并且业务成功
  // 3.没有成功 Promise.reject 抛出错误
  const { message, data, success } = response.data
  if (success) { // 业务逻辑成功
    return data
  }
  // 业务逻辑失败
  Message.error(message)
  return Promise.reject(new Error(message))
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})

export default service
