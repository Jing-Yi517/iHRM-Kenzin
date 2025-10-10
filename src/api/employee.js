import request from '@/utils/request'

/**
 * ? 获取员工列表
 * @param {*} params 表单数据 + 分页数据
 * @returns
 */
export const getEmployeeList = (params) => {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

/**
 * ? 导出Excel逻辑
 * @returns {*}
 * * 返回值为blob二进制流
 */
export const exportEmployeeExcel = () => {
  return request({
    url: '/sys/user/export',
    method: 'get',
    responseType: 'blob' // 使用blob接收二进制文件流
  })
}

/**
 * ? 获取Excel模板逻辑
 * @returns
 * * 返回值为blob二进制流
 */
export const getImportExcelTemplate = () => {
  return request({
    url: '/sys/user/import/template',
    method: 'get',
    responseType: 'blob' // 二进制文件流
  })
}

/**
 * ? 导入Excel逻辑
 *
 * @param {*} formData formData对象，其中为文件数据
 * @returns {*}
 */
export const uploadImportExcelTemplate = (formData) => {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * ? 删除员工逻辑
 * @param {*} id 员工id
 * @returns
 */
export const deleteEmployee = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/**
 * ? 添加员工逻辑
 * @param {*} data 表单数据
 * @returns
 */
export const addEmployee = (data) => {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

/**
 * ? 获取员工详情
 * @param {*} id 员工id
 * @returns
 */
export const getEmployeeDetail = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}

/**
 * ? 更新员工详情
 * @param {*} data 员工表单数据
 * @returns
 */
export const updateEmployee = (data) => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
