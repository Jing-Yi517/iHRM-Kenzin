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
