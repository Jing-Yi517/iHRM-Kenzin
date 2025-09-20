import request from '@/utils/request'

export const getDepartmentInfo = () => {
  return request({
    url: '/company/department',
    method: 'get'
  })
}
