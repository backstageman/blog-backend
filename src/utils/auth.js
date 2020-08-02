import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get('Admin-Token')
}

export function setToken(token) {
  return Cookies.set('Admin-Token', token)
}

export function removeToken() {
  return Cookies.remove('Admin-Token')
}

// 目标：想要将文件上传的token封装在这里
// export function uploadHeader() {
//   return {  'Authorization': 'Bearer ' + getToken()  }
// }