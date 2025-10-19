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
