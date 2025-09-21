import request from '@/utils/request'

export const getDepartmentInfo = () => {
  return request({
    url: '/company/department',
    method: 'get'
  })
}

export const getDepartmentManagersList = () => {
  return request({
    url: '/sys/user/simple',
    method: 'get'
  })
}

export const addDepartment = (data) => {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

export const getDepartmentDetail = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}

export const updateDepartmentDetail = (formData) => {
  return request({
    url: `/company/department/${formData.id}`,
    method: 'put',
    data: {
      ...formData
    }
  })
}
