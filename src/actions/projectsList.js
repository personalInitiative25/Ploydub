import {END_LOADING, START_LOADING, GET_Projects_List_SUCCESS, Project_Viewed_Success } from './types'
import * as api from '../api/index.js'
import store from '../store.js';
import {trackPromise} from 'react-promise-tracker'

export const getProjectsList = async (user_id) => {
    try {
        store.dispatch({ type: START_LOADING });
        
        // console.log('------------------>response, action',data)
        const data = await trackPromise(api.getProjects(user_id));
        store.dispatch({ type: GET_Projects_List_SUCCESS, payload: data.data });

        store.dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error);
    }
}

// export const updateViewStatus = async (project) => {
//     try {
//         store.dispatch({ type: START_LOADING });
//         console.log('updateViewstatus');
//         let new_project = project;
//         new_project.retrievedProject.viewd_at = 'Date.now()';
//         const data = await api.updateViewStatus(project.projectId);
//         // console.log('updateViewStatus Action',data.data)
//         // store.dispatch({ type: Project_Viewed_Success, payload: data.data });
//         store.dispatch({ type: Project_Viewed_Success, payload: new_project });

//         store.dispatch({ type: END_LOADING });
//     } catch (error) {
//         console.log(error);
//     }
// }