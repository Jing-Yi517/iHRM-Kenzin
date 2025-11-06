import request from '@/utils/request'

export const getCompanySettings = () => {
  return request({
    url: '/salarys/company-settings',
    method: 'get'
  })
}

export const getSalaryList = (params) => {
  return request({
    url: '/salarys/list',
    method: 'get',
    params
  })
}

export const initEmployeeSalary = (userId, data) => {
  return request({
    url: `/salarys/init/${userId}`,
    method: 'post',
    data
  })
}

export const getEmployeeSalary = (userId) => {
  return request({
    url: `/salarys/modify/${userId}`,
    method: 'get'
  })
}

export const modifyEmployeeSalary = (userId, data) => {
  return request({
    url: `/salarys/modify/${userId}`,
    method: 'post',
    data
  })
}
