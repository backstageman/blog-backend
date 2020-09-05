import axios from '../utils/ajax'

export function createArticle(article) {
    return axios({
        url: '/article',
        method: 'post',
        data: article
    })
}

export function getArticle(queryObj) {
    return axios({
        url: '/article',
        method: 'get',
        params: queryObj
    })
}

export function delArticle(id) {
    return axios({
        url: '/article/' + id,
        method: 'delete'
    })
}

export function updateArticle(aritcleid, article) {
    return axios({
        url: '/article',
        method: 'put',
        params: { id: aritcleid },
        data: article
    })
}
