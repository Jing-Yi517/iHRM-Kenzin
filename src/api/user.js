import request from '@/utils/request'

/**
 * ? 登录逻辑
 * @param {*} mobile 账户
 * @param {*} password 密码
 * @returns
 */
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

/**
 * ? 获取用户数据
 * @returns
 */
export const userGetProfile = () => {
  return request({
    url: '/sys/profile',
    method: 'get'
  })
}

/**
 * ? 修改密码逻辑
 * @param {*} oldPassword 旧密码
 * @param {*} newPassword 新密码
 * @returns
 */
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
