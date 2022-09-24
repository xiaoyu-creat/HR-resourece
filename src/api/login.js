import request from '@/utils/request.js'

/**
 * 用户登录接口
 * @param {Object} data 手机号和密码
 * @returns Promise
 */
export const login = (data) => {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}
