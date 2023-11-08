import { SET_TAB_VALUE_SUCCESS } from 'actions/types';

const initialState = '1';

const setTabValueReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TAB_VALUE_SUCCESS:
        console.log('Here is set TabValue Reducer', action.payload);
        return action.payload;
    default:
      return state;
  }
};

export default setTabValueReducer;