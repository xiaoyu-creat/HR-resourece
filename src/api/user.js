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

// resetful 接口
// 同一模块，同一地址，接口不同
// /sys/user/${id}
// 传统接口
// /delete/sys/user/123
// /add/sys/user/123
/**
 * 获取员工详细信息
 * @param {*} id 用户id
 * @returns Promise
 */
export const getUserDetailById = (id) => request({
  url: `/sys/user/${id}`,
  method: 'GET'
})

/**
 * 保存用户信息
 * @param {Object} data {}
 * @returns Promise
 */
export const saveUserDetailById = (data) => request({
  url: `/sys/user/${data.id}`,
  method: 'put',
  data
})
