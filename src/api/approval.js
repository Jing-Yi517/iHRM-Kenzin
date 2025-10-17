import request from '@/utils/request'

export const getApprovalList = (page, pageSize) => {
  return request({
    url: `/user/process/instance/${page}/${pageSize}`,
    method: 'get'
  })
}

export const getApprovalDetails = (id) => {
  return request({
    url: `/user/process/instance/${id}`,
    method: 'get'
  })
}

export const getApprovalSteps = (id) => {
  return request({
    url: `/user/process/instance/tasks/detail/${id}`,
    method: 'get'
  })
}
