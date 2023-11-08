import { combineReducers } from 'redux';
// Reducers
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';
import projectsListReducer from './projectsListReducer';
import projectDetailReducer from './projectDetailReducer';
import setTabValueReducer from './setTabValueReducer';

export default combineReducers({
  errors: errorReducer,
  loadingReducer: loadingReducer,
  projectsListReducer: projectsListReducer,
  projectDetailReducer: projectDetailReducer,
  setTabValueReducer: setTabValueReducer
});
