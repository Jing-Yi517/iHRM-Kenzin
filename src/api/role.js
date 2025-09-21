import request from '@/utils/request'

export const getRoleList = (params) => {
  return request({
    url: '/sys/role',
    method: 'get',
    params
  })
}

export const addRole = (data) => {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
