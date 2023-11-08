import { GET_Projects_List_SUCCESS, Project_Viewed_Success } from 'actions/types';
const image_url = '../assets/test_image.png';

const initialState = {projects:[]};
// {
//   thumbnailUrl: image_url,
//   status:'Ready for review',
//   projectTitle:'Conversation with Anthony'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Ready for review',
//   projectTitle:'Project Title'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Ready for review',
//   projectTitle:'Conversation with Anthony'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Completed',
//   projectTitle:'Project Title'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Uploading',
//   projectTitle:'Conversation with Anthony'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Uploaded',
//   projectTitle:'Conversation with Anthony'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Completed',
//   projectTitle:'Project Title'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Dubbing in progress',
//   projectTitle:'Conversation with Anthony'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Failed',
//   projectTitle:'Project Title'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Dubbing in progress',
//   projectTitle:'Conversation with Anthony'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Completed',
//   projectTitle:'Conversation with Anthony'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Uploaded',
//   projectTitle:'Project Title'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Dubbing in progress',
//   projectTitle:'Conversation with Anthony'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Uploading',
//   projectTitle:'Project Title'
// },
// {
//   thumbnailUrl: image_url,
//   status:'Failed',
//   projectTitle:'Conversation with Anthony'
// }
// Response Data: {
//     videoThumbnail: File (image file),
//     title: String,
//     duration: Integer (seconds),
//     status: String (Value must be "Completed", "Ready for review", "Uploading", "Uploaded", "Dubbing in progress", or "Failed"),
//     videoId: String (id corresponding to video for easier retrieval)
// }

const projectsListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_Projects_List_SUCCESS:
      console.log('Here is projects list Reducer', action.payload);
      return {
        ...state,
        ...action.payload
      };
    case Project_Viewed_Success:
      console.log('Here is projects list  Reducer', action.payload);
      let new_projects = state.projects.map((project) => project.projectId === action.payload.projectId ? action.payload : project);
      return {
        projects: new_projects
      };
    default:
      return state;
  }
};

export default projectsListReducer;