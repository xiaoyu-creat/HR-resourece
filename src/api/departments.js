import request from '@/utils/request.js'

/**
 * 获取组织架构数据
 **/
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

