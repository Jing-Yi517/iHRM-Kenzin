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

export const getSalarySetting = () => {
  return request({
    url: `/salarys/settings`,
    method: 'get'
  })
}

export const updateSalarySetting = (data) => {
  return request({
    url: `/salarys/settings`,
    method: 'post',
    data
  })
}

export const getSalaryReport = (yearMonth) => {
  return request({
    url: `/salarys/reports/${yearMonth}`,
    method: 'get',
    params: {
      yearMonth,
      opType: '1'
    }

  })
}

export const exportSalaryReport = (yearMonth) => {
  return request({
    url: `/salarys/historys/${yearMonth}/export`,
    method: 'get',
    responseType: 'blob'
  })
}

export const archiveSalaryReport = (yearMonth) => {
  return request({
    url: `/salarys/historys/${yearMonth}/archive`,
    method: 'post'
  })
}

export const createNewSalaryReport = (yearMonth) => {
  return request({
    url: `/salarys/reports/${yearMonth}/newReport`,
    method: 'put'
  })
}
