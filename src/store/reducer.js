import { combineReducers } from 'redux-immutable';
import { reducer as articleReducer } from "../page/article/store"
import { reducer as articleListReducer } from '../page/articleList/store'

const reducer = combineReducers({
  article: articleReducer,
  articleList: articleListReducer
})

export default reducer