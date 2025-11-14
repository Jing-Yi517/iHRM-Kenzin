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

export const getLeaveSetting = (departmentId) => {
  return request({
    url: `/cfg/leave/list`,
    method: 'get',
    params: {
      departmentId
    }
  })
}

export const getAttendanceSetting = (departmentId) => {
  return request({
    url: `/cfg/atte/item`,
    method: 'get',
    params: {
      departmentId
    }
  })
}

export const getOvertimeSetting = (departmentId) => {
  return request({
    url: `/cfg/extDuty/item`,
    method: 'get',
    params: {
      departmentId
    }
  })
}

export const getPunishSetting = (departmentId) => {
  return request({
    url: `/cfg/ded/list`,
    method: 'get',
    params: {
      departmentId
    }
  })
}

export const updateAttendanceSetting = (data) => {
  return request({
    url: `/cfg/atte`,
    method: 'put',
    data
  })
}

export const updateLeaveSetting = (data) => {
  return request({
    url: `/cfg/leave`,
    method: 'post',
    data
  })
}

export const updateOvertimeSetting = (data) => {
  return request({
    url: `/cfg/extDuty`,
    method: 'put',
    data
  })
}

export const updatePunishSetting = (data) => {
  return request({
    url: `/cfg/deduction`,
    method: 'post',
    data
  })
}

export const archiveReport = (yearMonth) => {
  return request({
    url: '/attendances/archives',
    method: 'get',
    params: {
      atteDate: yearMonth
    }
  })
}
