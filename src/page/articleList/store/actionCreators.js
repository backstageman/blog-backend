import { fromJS } from 'immutable'
import { message } from 'antd'
import { getArticle } from '../../../api/article'
import * as constants from './constants'

export const saveQueryParams = (queryParams) => ({
  type: constants.CHANGE_QUERYPARAMS,
  data: fromJS(queryParams)
})

const changeArticleList = (data) => ({
  type: constants.CHANGE_ARTICLELIST,
  data: fromJS(data)
})

export const getArticleList = (queryObj) => {
  return (dispatch) => {
    getArticle(queryObj).then(res => {
      // console.log(res.data);
      const { list, current, pageSize, total } = res.data
      const temp = {
        articleList: list,
        current: current,
        pageSize: pageSize,
        total: total,
      }
      dispatch(changeArticleList(temp))
    }).catch(err => {
      message.error(err)
    })
  }
}

