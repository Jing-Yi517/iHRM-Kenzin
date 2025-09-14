import axios from 'axios'
import store from '@/store/index'
import { Message } from 'element-ui'
// 环境区分
let baseURL
if (process.env.NODE_ENV === 'development') {
  baseURL = '/api'
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'xxx生产环境xxx'
}

const service = axios.create({
  baseURL,
  timeout: 10 * 1000

})

// 添加请求拦截器
service.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  if (store.getters.token) {
    config.headers.Authorization = `Bearer + ${store.getters.token}`
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
  const { data, message, success } = response.data // 默认json格式
  if (success) {
    return data
  } else {
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async(error) => {
  // error.message
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})
export default service
