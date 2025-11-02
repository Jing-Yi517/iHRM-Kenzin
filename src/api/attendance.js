import request from '@/utils/request'

export const getAttendanceList = (params) => {
  return request({
    url: '/attendances',
    method: 'get',
    params
  })
}
