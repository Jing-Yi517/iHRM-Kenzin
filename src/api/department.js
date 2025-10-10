import request from '@/utils/request'

/**
 * ? 获取部门列表
 * @returns
 */
export const getDepartmentInfo = () => {
  return request({
    url: '/company/department',
    method: 'get'
  })
}

/**
 * ? 获取部门管理人列表
 * @returns
 */
export const getDepartmentManagersList = () => {
  return request({
    url: '/sys/user/simple',
    method: 'get'
  })
}

/**
 * ? 添加部门逻辑
 * @param {*} data 表单数据
 * @returns
 */
export const addDepartment = (data) => {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

/**
 * ? 获取部门详情
 *
 * @param {*} id 部门id
 * @returns {*}
 */
export const getDepartmentDetail = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}

/**
 * ? 更新部门详情
 * @param {*} formData 表单数据
 * @returns
 */
export const updateDepartmentDetail = (formData) => {
  return request({
    url: `/company/department/${formData.id}`,
    method: 'put',
    data: {
      ...formData
    }
  })
}

/**
 * ? 删除部门逻辑
 * @param {*} id 部门id
 * @returns
 */
export const deleteDepartment = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
