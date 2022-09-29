import request from '@/utils/request.js'

/**
 * 获取所有角色列表
 * @param {Object} params
 * @returns Promise
 */
export const getRoleList = (params) => {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 新增角色信息
 * @param {Object} data
 * @returns Promise
 */
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

/**
 * 修改角色
 * @param {Object} data 角色信息
 * @returns Promise
 */
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}

/** **
 *  删除角色
 *
 * ****/
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * 获取公司信息
 * **/
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

