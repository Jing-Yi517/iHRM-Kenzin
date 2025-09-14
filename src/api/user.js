import request from '@/utils/request'

export const userLogin = (mobile, password) => {
  return request({
    url: '/sys/login',
    method: 'post',
    data: {
      mobile,
      password
    }
  })
}
