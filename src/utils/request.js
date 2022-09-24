// 实现对axios的二次封装
import axios from 'axios'
// 通过axios创建axios实例
const service = axios.create({
  baseURL: '/dev', // 基准地址
  timeout: 5000 // 超时时间
})
export default service
