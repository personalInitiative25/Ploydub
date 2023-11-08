import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { usePromiseTracker, trackPromise} from 'react-promise-tracker';
import Loader from 'react-promise-loader';
import { setTabValueInHome } from '../../actions/setTabValueAction.js';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import MyDropzone from '../../components/MyDropzone/MyDropzone';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import classNames from 'classnames';
import {createProject} from '../../api/index.js';
import styles from './NewProject.scss';
import { useAuth0 } from '@auth0/auth0-react';

const NewProject = (props) => {

  const {user} = useAuth0();
  const user_id = user.sub;
  
  const [selectedFile, SetSelectedFile] = useState([]);
  const [title, setTitle] = useState('');
  const [tabValue, setTabValue] = useState('1');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedOriginal, setSelectedOriginal] = useState({ name: 'Autodetect', code: 'Autodetect' });
  const [speakers, setSpeakers] = useState({ name: 1, code : 1});
  const [isFormValid, setIsFormValid] = useState(false);
  const toast = useRef(null);
  let history = useHistory();
  
  function uploadFileToS3(fileBlob, signedPutUrl) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedPutUrl, true);
      xhr.setRequestHeader('Content-Type', fileBlob.type); // Set this to match the actual file type

      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log('File uploaded successfully');
          resolve(); // Resolve the promise indicating success
        } else {
          console.error('Error uploading file:', xhr.statusText);
          reject(new Error('Error uploading file')); // Reject the promise indicating failure
        }
      };

      xhr.onerror = function () {
        console.error('XHR onerror event');
        reject(new Error('Network error occurred during upload to S3')); // Reject on network errors
      };

      xhr.send(fileBlob); // Send the file blob
    });
  }

  const showError = (content) => {
    toast.current.show({severity:'error', summary: 'Error', detail:content, life: 3000});
  }

  const submitProject = async () => {
    let duration = 0;
    let originalFile = "#";
    let file1 = '';
    let thumbnail = '';
    let transcriptionFileNames = [];
    let thumbnailImage = '';
    let thumbnailBlob = '';

    if(tabValue != 3){
      selectedFile.forEach(file => {
        console.log('Here is File Type',file.filetype)
        if(file.filetype.split('/')[0] == 'video'){
          file1 = file.file;
          console.log('------>file.file.file', file.file);
        }else{
          transcriptionFileNames.push(file.filename);
        }
      });
      duration = await getVideoDuration(file1);
      thumbnailImage = await generateThumbnail(file1);
      thumbnailBlob = await fetch(thumbnailImage).then((response) => response.blob());
      console.log('--------->thumbnailBlob',thumbnailBlob); 
    }else{
      const filePath = 'assets/gray_podcast_image.jpeg';
      const fileType = 'image/jpeg';

      const response = await fetch(filePath);
      const fileBuffer = await response.arrayBuffer();
      thumbnailBlob = new Blob([fileBuffer], { type: fileType });
    }
    originalFile = (tabValue != 3) ? file1 : selectedFile[0].file;

    // Prepare the form data
    const formData = {
      authUserId: user_id,
      projectTitle: title,
      requestType: (tabValue-1),
      status: 1,
      length: duration,
      originalFileName: originalFile.name,
      originalLanguage: selectedOriginal.name,
      transcriptionFileNames: transcriptionFileNames,
      translatedLanguages: selectedLanguages.map(language => language.name),
      speakers: speakers.name,
    };

    // PUT request to your API to create a new project
    try {
      const postResponse = await trackPromise(createProject(formData));

      const originalSignedUrl = postResponse.data.originalVideoLink.signedUrl;
      const podcastSignedUrl = postResponse.data.podcastDocumentLink.signedUrl;
      const signedUrl = tabValue != 3 ? originalSignedUrl : podcastSignedUrl;
      const thumbnailSignedUrl = postResponse.data.thumbnailLink.signedUrl;
      
      const t = await trackPromise(uploadFileToS3(originalFile, signedUrl));
      const s = await trackPromise(uploadFileToS3(thumbnailBlob, thumbnailSignedUrl));
      if(tabValue !=3){
        const transcriptionUrls = postResponse.data.transcriptionFileLinks.map(link => link.signedUrl);
        // const transcriptionFiles = selectedFile.map()
        const transcriptionFiles = selectedFile.filter(file => file.file !== originalFile);
        transcriptionFiles.map((file,index)=>{
          trackPromise(uploadFileToS3(file.file, transcriptionUrls[index]));
        })
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  // Here you define your validation logic
  const validateForm = () => {
    // Replace the following with your actual validation logic
    const isTitleValid = title.trim() !== ''; // Example validation: title must not be empty
    const isLanguageSelectorValid = tabValue !== "1" || selectedLanguages.length > 0;
    const isFileSelected = selectedFile && selectedFile.length;
  
    return isTitleValid && isLanguageSelectorValid && isFileSelected;
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission if using a form
    setIsFormValid(true);

    if (validateForm()) {
      let file1 = '';
      selectedFile.forEach(file => {
        if(file.filetype.split('/')[0] == 'video'){
          file1 = file.file;
        }
      });
      if(tabValue != 3 && file1 == ''){
        showError("You should upload a video file.");
        return;
      }
      if(tabValue == 3 && (file1 != '' || selectedFile.length > 1)){
        showError("You should upload a doc file.");
        return;
      }
      await submitProject();
      setTabValueInHome('2');
      history.push('/');
    } else {
      setIsFormValid(false);
      showError("Please ensure you have completed all required fields and uploaded the relevant files.");
    }
  };

  const generateThumbnail = (videoFile) => {
    return new Promise((resolve, reject) => {
      const videoURL = URL.createObjectURL(videoFile);
      const video = document.createElement('video');
  
      video.addEventListener('loadeddata', () => {
        video.currentTime = 1; // Seek to the desired time for the thumbnail, e.g., 1 second
      });
  
      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob));
        }, 'image/jpeg', 0.95); // Adjust the image format and quality as needed
      });
  
      video.addEventListener('error', (e) => {
        reject(e);
      });
  
      video.src = videoURL;
      // Remove video.play()
    });
  };

  const getVideoDuration = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const media = new Audio(reader.result);
        media.onloadedmetadata = () => resolve(media.duration);
      };
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
    });

  const languages = [
    { name: 'English', code: 'English' },
    { name: 'Spanish', code: 'Spanish' },
    { name: 'French', code: 'French' },
    { name: 'German', code: 'German' },
    { name: 'Chinese', code: 'Chinese' },
    { name: 'Arabic', code: 'Arabic' },
    { name: 'Portuguese', code: 'Portuguese' },
    { name: 'Italian', code: 'Italian' },
    { name: 'Russian', code: 'Russian' },
    { name: 'Korean', code: 'Korean' },
    { name: 'Japanese', code: 'Japanese' },
    { name: 'Vietnamese', code: 'Vietnamese' },
    { name: 'Ukrainian', code: 'Ukrainian' },
    { name: 'Dutch', code: 'Dutch' },
    { name: 'Hindi', code: 'Hindi' }
  ];
  // const languages = ['English','Spanish','Chinese','Japanese','Albanian','Great','English','English']
  const languages1 = [
    { name: 'Autodetect', code: 'Autodetect' },
   ...languages]
  const speakingNumbers = [
    { name: 1, code : 1},
    { name: 2, code : 2},
    { name: 3, code : 3},
    { name: 4, code : 4},
    { name: 5, code : 5},
    { name: 6, code : 6},
    { name: 7, code : 7},
    { name: 8, code : 8},
    { name: 9, code : 9},
    { name: 10, code : 10},
  ];
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <div className={styles.newProject}>
      <div className={styles.subHeader}>
        <p className={styles.title}>New Project</p>
        <Link className={styles.close} to='/'><i className='fa fa-close'></i></Link>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.main}>
        <div className={styles.content}>
          <p className={styles.subTitle}>Upload Files</p>
          <MyDropzone setTitle={setTitle} showError={showError} selectedFile={selectedFile} SetSelectedFile={SetSelectedFile}/>
        </div>
        <div className={styles.content}>
          <p className={styles.subTitle}>Project Details</p>
          <p style={{fontSize:'18px', paddingTop:"15px", marginBottom:'20px'}}>Project name*</p>
          <input className={styles.textInput} onChange={(e)=>setTitle(e.target.value)} value={title} type='text'/>
          <Box sx={{ width: '100%', typography: 'body1', marginTop: '20px'}}>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example"
                  TabIndicatorProps={{
                    style: {backgroundColor: '#1861f2', height: '0px'},
                  }}
                >
                  <Tab 
                    sx={{paddingLeft:'0px', 
                      paddingRight:'0px',
                      color:'#6f7073',
                      fontSize:'20px',
                      fontWeight:'bold',
                      textTransform:'none',
                      paddingBottom:'15px',
                      '&.Mui-selected': {
                        color: 'black',
                        borderBottom: '6px solid #1861f2'
                        },
                    }}
                    label="Translated to"
                    value="1" />
                  <Tab 
                    sx={{paddingLeft:'0px', 
                      paddingRight:'0px', 
                      marginLeft:'25px',
                      color:'#6f7073',
                      fontSize:'20px',
                      fontWeight:'bold',
                      textTransform:'none',
                      paddingBottom:'15px',
                      '&.Mui-selected': {
                        color: 'black',
                        borderBottom: '6px solid #1861f2'
                      },
                      }} 
                      label="Subtitles only" 
                    value="2" />
                  <Tab 
                    sx={{paddingLeft:'0px', 
                      paddingRight:'5px', 
                      marginLeft:'25px',
                      fontSize:'20px',
                      fontWeight:'bold',
                      color:'#6f7073',
                      textTransform:'none',
                      paddingBottom:'15px',
                      '&.Mui-selected': {
                        color: 'black',
                        borderBottom: '6px solid #1861f2'
                      },
                      }} 
                      label = "Podcast"
                      value="3">
                        </Tab> 
                </TabList>
              </Box>
              <TabPanel sx={{padding:'40px 0 0 0'}} value="1">
                <div className={styles.reposList} >
                </div>
              </TabPanel>
              <TabPanel sx={{padding:'40px 0 0 0'}} value="2">
                <div className={styles.reposList} >
                </div>
              </TabPanel>
              <TabPanel sx={{padding:'40px 0 0 0'}} value="3">
                <div className={styles.reposList} >
                </div>
              </TabPanel>
            </TabContext>
          </Box>
          { tabValue == 1 &&
            <div>
            <p style={{fontSize:'18px',marginTop:'0px', marginBottom:'20px'}}>Select all that apply*</p>
            <div className="card flex justify-content-center">
              <MultiSelect value={selectedLanguages} onChange={(e) => setSelectedLanguages(e.value)} options={languages} optionLabel="name" display="chip"
                  placeholder="" maxSelectedLabels={10} className={classNames("w-full", "md:w-20rem")} />
            </div>
          </div>}
          {tabValue == 2 && <p style={{fontSize:"16px"}}>Only provide a subtitled file in the video's original language</p>}
          {tabValue == 3 && <p style={{fontSize:"16px"}}>Only provide a text file with the podcast conversation.</p>}
          <div style={{display:'flex', marginBottom:'30px'}}>
            <div style={{width:'47%'}}>
              <p style={{fontSize:'18px',marginTop:'10px' , marginBottom:'20px'}}>Original language</p>
              <div className="card flex justify-content-center">
                <Dropdown value={selectedOriginal} onChange={(e) => setSelectedOriginal(e.value)} options={languages1} optionLabel="name" 
                placeholder="Autodetect" className="w-full md:w-14rem" />
              </div>
            </div>
            {tabValue != 2 &&
              <div style={{marginLeft:'6%',width:'47%'}}>
              <p style={{fontSize:'18px',marginTop:'10px' , marginBottom:'20px'}}>Number of speakers</p>
              <div className="card flex justify-content-center">
                <Dropdown value={speakers} onChange={(e) => setSpeakers(e.value)} options={speakingNumbers} optionLabel="name" 
                  placeholder="1" className="w-full md:w-14rem" />
              </div>
            </div>}
          </div>
          <div style={{display:'flex',marginTop:'20px' ,marginBottom:'50px'}}>
            <button to='#' style={{marginRight:'20px'}} className={classNames(styles.button)} onClick={handleSubmit}>Submit Project </button>
            <button to="/" className={styles.cancel_button} onClick={() => history.push('/')}>Cancel</button>
          </div>
        </div>
      </div>
      <Toast ref={toast} />
      <Loader promiseTracker={usePromiseTracker} color={'#3F88C5'}/>
    </div>
  );
};

export default NewProject;
