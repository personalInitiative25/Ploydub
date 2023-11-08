import { SET_TAB_VALUE_SUCCESS } from './types.js'
import store from '../store.js';

export const setTabValueInHome = async (num) => {
    try {
        store.dispatch({ type: SET_TAB_VALUE_SUCCESS, payload: num });
    } catch (error) {
        console.log(error);
    }
}