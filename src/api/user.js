import request from '@/utils/request'

/**
 * 获取用户信息
 * @returns Promise
 */
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 获取员工详细信息
 * @param {*} id 用户id
 * @returns Promise
 */
export const getUserDetailById = (id) => request({
  url: `/sys/user/${id}`,
  method: 'GET'
})

