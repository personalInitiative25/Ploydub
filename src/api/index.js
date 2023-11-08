import axios from 'axios';

const API = axios.create({ baseURL: 'https://polydub-backend-7707d66a10f4.herokuapp.com/api', headers:{
    'X-Requested-With': 'XMLHttpRequest'
}
});

// AUTH APIs
// export const logIn = (formData) => API.post('/user/login', formData);
// export const createAdmin = (formData) => API.post('/user/addAdmin', formData);

// GET APIS
export const getProjects = (user_id) => API.get(`/users/${user_id}/projects`);
export const getProjectDetail = (project_id) => API.get(`/projects/${project_id}`);
export const getChangeLanguage = (user_id, project_id, language) => API.get(`/users/${user_id}/projects.${project_id}/video/${language}/stream`);

// POST APIs
export const createProject = (project) => API.post(`/projects`, project);
export const updateProject = (user_id, project) => API.put(`/users/${user_id}/projects`, project);

// PUT APIs
// export const uploadFile = (uploadLink, file) => API.put(uploadLink, file);
// export const updateProject = (project_id) => API.put(`/projects/`, {projectId:project_id});

// DELETE APIs
export const deleteProject = (project_id) => API.delete(`/projects/${project_id}`);