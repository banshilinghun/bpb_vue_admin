import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: 'https://wxapi.benpaobao.com/manager', // api的base_url
  timeout: 5000, // request timeout
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-Token'] = getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    console.log(response)
    const res = response.data
    console.log(res.code)
    if (res.code !== 1000) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
