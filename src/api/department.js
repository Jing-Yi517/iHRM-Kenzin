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
