import { FETCH_RECIPIENTS } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_RECIPIENTS:
      return action.payload || [];
    default:
      return state;
  }
}