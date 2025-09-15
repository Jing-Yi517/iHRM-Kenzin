import { getToken, setToken, removeToken } from '@/utils/auth'
import { userLogin, userGetProfile } from '@/api/user'
const state = {
  token: getToken() ?? '',
  userProfile: {}
}
const mutations = {
  setTokenMutation(state, newToken) {
    state.token = newToken
  },
  removeTokenMutation(state) {
    state.token = ''
    removeToken()
  },
  setUserProfileMutation(state, newProfile) {
    state.userProfile = newProfile
  },
  removeUserProfileMutation(state) {
    state.userProfile = {}
  }
}
const actions = {
  async userLoginAction(context, { account, password }) {
    // 调用接口
    const res = await userLogin(account, password)
    // 如果成功，进行数据持久化和数据共享
    context.commit('setTokenMutation', res)
    // 数据持久化，存入cookies
    setToken(res)
  },

  async userGetProfileAction(context) {
    const res = await userGetProfile()
    context.commit('setUserProfileMutation', res)
  },

  userLogout(context) {
    context.commit('removeTokenMutation')
    context.commit('removeUserProfileMutation')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
