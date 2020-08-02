import axios from 'axios'
import { message } from 'antd';
import SERVERADDRESS from './constant.js'
import { getToken, setToken } from './auth.js'
/*
  目前不完善的地方：
  1. 状态码写死了
  2. 未完成重定向
*/

const ajax = axios.create({
  baseURL: SERVERADDRESS.BASE_API,
  timeout: 5000
})

// 请求拦截配置
ajax.interceptors.request.use(
  config => {
    // console.log(SERVERADDRESS.BASE_API)
    // 如果token不存在，就设置token为空
    if (!getToken()) {
      setToken('')
    }
    // 获得token
    config.headers['Authorization'] = `Bearer ${getToken()}`
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截配置
ajax.interceptors.response.use(
  response => {
    // console.log('response', response)
    const res = response.data
    // console.log(typeof res.code);
    if (res.code !== 0) {
      if (res.code === -2) {
        message.warning('Token 已失效，请重新登录', () => {
          // 重定向到登录页面
          window.location.href = "/login"
        })
      }
      const errMsg = res.msg || '请求失败'
      message.error('msg', errMsg )
      return Promise.reject(new Error(errMsg))
    } else {
      return res
    }
  },
  err => {
    const { msg } = err.response.data || '请求失败'
    message.error(msg)
    return Promise.reject(err)
  }
)

export default ajax