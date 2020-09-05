import { fromJS } from 'immutable';
import { message } from 'antd'
import * as constants from './constants';
import { getArticleTypesList } from '../../../api/articleType'

const changeArticleTypesList = (list) => ({
  type: constants.CHANGE_ARTICLETYPESLIST,
  list: fromJS(list)
})

export const getArticleTypes = () => {
  return (dispatch) => {
    try {
      getArticleTypesList().then((res) => {
        dispatch(changeArticleTypesList(res.data))
      })
    } catch (err) {
      message.error(err)
    }
  }
}