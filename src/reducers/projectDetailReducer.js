import {GET_Project_Detail_SUCCESS, GET_Project_Language_Update_SUCCESS} from 'actions/types';

const initialState = {};

const projectDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_Project_Detail_SUCCESS:
        console.log('Here is project detail Reducer', action.payload);
        return {
            ...state,
            ...action.payload
        };
    case GET_Project_Language_Update_SUCCESS:
        return {
            ...state,
            ...action.payload
        };
    default:
      return state;
  }
};

export default projectDetailReducer;