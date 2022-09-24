// 实现对axios的二次封装
import axios from 'axios'
// 通过axios创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址 api /dev-api
  timeout: 5000 // 超时时间
})
export default service
