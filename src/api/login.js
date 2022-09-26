
import request from '@/utils/request'

/**
 * 获取图片验证码
 * @param {Number} clientToken 请求随机数
 * @returns Promise
 */
export const getCodePic = (clientToken) => {
  return request({
    url: `/user-service/user/imageCode/${clientToken}`
    // responseType: 'blob'
  })
}

/**
 * 用户登录接口
 * @param {Object} data 用户登录信息
 * @returns Promise
 */
export const loginAPI = (data) => {
  return request({
    url: '/user-service/user/login',
    method: 'POST',
    data
  })
}
