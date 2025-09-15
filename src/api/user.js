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

export const userGetProfile = () => {
  return request({
    url: '/sys/profile',
    method: 'get'
  })
}

export const userChangePassword = (oldPassword, newPassword) => {
  return request({
    url: 'sys/user/updatePass',
    method: 'put',
    data: {
      oldPassword,
      newPassword
    }
  })
}
