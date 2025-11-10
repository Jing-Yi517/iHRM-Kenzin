import request from '@/utils/request'

export const getAttendanceList = (params) => {
  return request({
    url: '/attendances',
    method: 'get',
    params
  })
}

export const modifyEmployeeAttendanceRecord = (id, data) => {
  return request({
    url: `/attendances/${id}`,
    method: 'put',
    data
  })
}
