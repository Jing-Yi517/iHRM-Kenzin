import { getToken, setToken, removeToken } from '@/utils/auth'
import { userLogin } from '@/api/user'
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
  async userLoginAction(context, { account, password }) {
    // 调用接口
    const res = await userLogin(account, password)
    console.log(res)
    // 如果成功，进行数据持久化和数据共享
    context.commit('setTokenMutation', res)
    // 数据持久化，存入cookies
    setToken(res)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
