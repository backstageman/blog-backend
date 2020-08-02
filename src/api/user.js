import axios from '../utils/ajax'

export function login(data) {
  return axios({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return axios({
    url: '/user/logout',
    method: 'post'
  })
}