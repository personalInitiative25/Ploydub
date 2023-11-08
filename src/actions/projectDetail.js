import {END_LOADING, START_LOADING, GET_Project_Detail_SUCCESS, GET_Project_Language_Update_SUCCESS} from './types.js'
import * as api from '../api/index.js'
import {trackPromise} from 'react-promise-tracker'
import store from '../store.js';

export const getProjectDetail = async (project_id) => {
    try {
        store.dispatch({ type: START_LOADING });
        const data = await trackPromise(api.getProjectDetail(project_id));
        console.log('Here is project detail action')
        store.dispatch({ type: GET_Project_Detail_SUCCESS, payload: data.data });

        store.dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error);
    }
}

// export const getChangeLanguage = async (user_id, project_id, language) => {
//     try {
//         store.dispatch({ type: START_LOADING });

//         const data = await api.getChangeLanguage(user_id, project_id, language);
//         store.dispatch({ type: GET_Project_Language_Update_SUCCESS, payload: data });

//         store.dispatch({ type: END_LOADING });
//     } catch (error) {
//         console.log(error);
//     }
// }
