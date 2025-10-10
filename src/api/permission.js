import request from '@/utils/request'

/**
 * ? 获取权限点列表
 * @returns
 */
export const getPermissionList = () => {
  return request({
    url: '/sys/permission',
    method: 'get'
  })
}

/**
 * ? 添加权限点逻辑
 * @param {*} data 表单数据
 * @returns
 */
export const addPermissionNode = (data) => {
  return request({
    url: 'sys/permission',
    method: 'post',
    data
  })
}

/**
 * ? 获取权限点详情
 * @param {*} id 权限点id
 * @returns
 */
export const getPermissionNodeDetail = (id) => {
  return request({
    url: `/sys/permission/${id}`,
    method: 'get'
  })
}

/**
 * ? 删除权限点逻辑
 * @param {*} id 权限点id
 * @returns
 */
export const deletePermissionNode = (id) => {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}

/**
 * ? 更新权限点详情
 * @param {*} data 表单数据
 * @returns
 */
export const updatePermissionNode = (data) => {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}
