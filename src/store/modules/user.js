import { getToken, setToken, removeToken } from '@/utils/auth'
const state = {
  token: getToken() ?? ''
}
const mutations = {
  setTokenMutation(state, newToken) {
    state.token = newToken
  },
  removeTokenMutation(state) {
    state.token = ''
    removeToken()
  }
}
const actions = {
  async userLoginAction(context, userLoginInfo) {
    console.log(userLoginInfo)
    // 调用接口
    // 如果成功，进行数据持久化和数据共享
    context.commit('setTokenMutation')
    setToken() // 暂未传入参数
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
