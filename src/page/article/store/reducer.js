import { fromJS } from 'immutable';
import * as constants from './constants';

const defaultState = fromJS({
  // 所有的文章类型数据
  articleTypes: [],
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.CHANGE_ARTICLETYPESLIST:
      return state.set('articleTypes', action.list);
    default:
      return state
  }
}
