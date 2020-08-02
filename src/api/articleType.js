import axios from '../utils/ajax'

export function getAllArticleTypes() {
  return axios({
    url: '/article-type',
    method: 'get'
  })
}