import request from '@/utils/request'

export const getSocialSecurityList = (data) => {
  return request({
    url: '/social_securitys/list',
    method: 'post',
    data
  })
}

export const getCityList = () => {
  return request({
    url: '/sys/city',
    method: 'get'
  })
}

export const getSocialSecurityDetail = (id) => {
  return request({
    url: `/social_securitys/${id}`,
    method: 'get'
  })
}

export const updateSocialSecurityDetail = (id, data) => {
  return request({
    url: `/social_securitys/${id}`,
    method: 'put',
    data
  })
}

export const getSocialSecuritySettings = () => {
  return request({
    url: '/social_securitys/settings',
    method: 'get'
  })
}

export const getSocialSecurityReport = (yearMonth) => {
  return request({
    url: `/social_securitys/historys/${yearMonth}?opType=1`,
    method: 'get'
  })
}

export const exportSocialSecurityReportExcel = (yearMonth) => {
  return request({
    url: `/social_securitys/historys/${yearMonth}/export`,
    method: 'get',
    responseType: 'blob'
  })
}

export const archiveSocialSecurityReport = (yearMonth) => {
  return request({
    url: `/social_securitys/historys/${yearMonth}/archive`,
    method: 'post'
  })
}

export const createSocialSecurityReport = (yearMonth) => {
  return request({
    url: `/social_securitys/historys/${yearMonth}/newReport`,
    method: 'put'
  })
}

export const archiveSocialSecurityReportHistory = (year) => {
  return request({
    url: `/social_securitys/historys/${year}/list`,
    method: 'get'
  })
}
