import { fromJS } from 'immutable'
import * as constants from './constants'

const defaultState = fromJS({
  // 所有的文章数据
  articleList: [],
  // 当前页
  current: '',
  // 每页显示多少条记录
  pageSize: '',
  // 总记录数
  total: '',
  // 查询条件
  queryObj: {}

})

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.CHANGE_ARTICLELIST:
      return state.merge(action.data)
    case constants.CHANGE_QUERYPARAMS:
      return state.set('queryObj', action.data)
    default:
      return state
  }
}