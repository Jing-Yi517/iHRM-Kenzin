import request from '@/utils/request'

export const getEmployeeList = (params) => {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

export const exportEmployeeExcel = () => {
  return request({
    url: '/sys/user/export',
    method: 'get',
    responseType: 'blob' // 使用blob接收二进制文件流
  })
}

export const getImportExcelTemplate = () => {
  return request({
    url: '/sys/user/import/template',
    method: 'get',
    responseType: 'blob' // 二进制文件流
  })
}

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

export const deleteEmployee = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

export const addEmployee = (data) => {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

export const getEmployeeDetail = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}

export const updateEmployee = (data) => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
