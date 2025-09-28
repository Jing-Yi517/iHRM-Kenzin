import axios from 'axios'
import store from '@/store/index'
import router from '@/router/index'
import { Message } from 'element-ui'
// 环境区分

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 20 * 1000

})

// 添加请求拦截器
service.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
  if (response.data instanceof Blob) return response.data // 返回了Blob对象
  const { data, message, success } = response.data // 默认json格式
  if (success) {
    return data
  } else {
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async(error) => {
  // error.message
  if (error.response.status === 401) {
    Message({ type: 'error', message: '登陆状态过期，请重新登陆' })
    await store.dispatch('user/userLogout')
    router.push('/login')
    return Promise.reject(error)
  }

  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})
export default service
