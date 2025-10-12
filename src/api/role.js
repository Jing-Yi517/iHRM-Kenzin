import request from '@/utils/request'

/**
 * ? 获取角色列表
 * @param {*} params 分页数据
 * @returns
 */
export const getRoleList = (params) => {
  return request({
    url: '/sys/role',
    method: 'get',
    params
  })
}

/**
 * ? 添加角色逻辑
 * @param {*} data 角色表单数据
 * @returns
 */
export const addRole = (data) => {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

/**
 * ? 更新角色数据
 * @param {*} data 角色表单数据
 * @returns
 */
export const updateRole = (data) => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * ? 删除角色逻辑
 * @param {*} data 角色id
 * @returns
 */
export const deleteRole = (data) => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'delete',
    data
  })
}

export const getEnabledRoleList = () => {
  return request({
    url: '/sys/role/list/enabled',
    method: 'get'
  })
}

export const assignRole = (id, roleIds) => {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data: {
      id,
      roleIds
    }
  })
}
