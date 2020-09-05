import axios from '../utils/ajax'

export function getArticleTypesList() {
  return axios({
    url: '/article-type',
    method: 'get'
  })
}

