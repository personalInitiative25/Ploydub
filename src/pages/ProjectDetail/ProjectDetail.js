import React, { useEffect, useState } from 'react';
import styles from './ProjectDetail.scss';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePromiseTracker, trackPromise} from 'react-promise-tracker';
import Loader from 'react-promise-loader';
import classNames from 'classnames';
import { getProjectDetail } from '../../actions/projectDetail';
import { Sidebar } from 'primereact/sidebar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { deleteProject } from '../../api';

const ProjectDetail = (props) => {
  const currentURL = window.location.href;
  const urlParts = currentURL.split('/');
  const project_id = urlParts[urlParts.length - 1];
  const [project, setProject] = useState({});
  const [title, setTitle] = useState('');
  const [currentVideoLink, setCurrentVideoLink] = useState('#');
  const [selectedFileName, setSelectedFileName] = useState('Original.mp4');
  const [selectedLanguage, setSelectedLanguage] = useState('Original Language');
  const [visibleRight, setVisibleRight] = useState(false);
  const [previousProjectId, setPreviousProjectId] = useState(null);
  const [nextProjectId, setNextProjectId] = useState(null);
  const [selectedButton, setSelectedButton] = useState('Original');
  let history = useHistory();
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  useEffect(() => {
    getProjectDetail(project_id);
  },[]);
  const get_project = useSelector((state) => state.projectDetailReducer);
  
  useEffect(() => {
    setProject(get_project);
    if (get_project && get_project.originalVideoLink) {
      setTitle(get_project.retrievedProject.projectTitle);
      if (get_project.retrievedProject.requestType != 2) {
        if (get_project.retrievedProject.requestType != 1) {
          setCurrentVideoLink(get_project.translatedVideosLinks[get_project.retrievedProject.translatedLanguages[0]].signedUrl);
          setSelectedFileName(`${title}-${get_project.retrievedProject.translatedLanguages[0].toLowerCase()}.${get_project.retrievedProject.originalFileName.split('.').pop()}`);
          setSelectedButton(get_project.retrievedProject.translatedLanguages[0]);
          setSelectedLanguage(get_project.retrievedProject.translatedLanguages[0]);
        }
        else {
          setCurrentVideoLink(get_project.originalVideoLink.signedUrl);
          setSelectedFileName(get_project.retrievedProject.originalFileName.toLowerCase());
          setSelectedLanguage("Original Language");
        }
      } else {
        setCurrentVideoLink(get_project.podcastVideoLink.signedUrl);
      }
      setSelectedFileName(get_project.retrievedProject.originalFileName);
    }
    setPreviousProjectId(get_project.previousProjectId);
    setNextProjectId(get_project.nextProjectId);
  },[get_project]);

  const handleLanguageChange = (language) => {
    if(language == 'Original'){
      setCurrentVideoLink(project.originalVideoLink.signedUrl);
      setSelectedFileName(project.retrievedProject.originalFileName);
      if(project.retrievedProject.originalLanguage == "Autodetect")
        setSelectedLanguage("Original Language");
      if(project.retrievedProject.originalLanguage != "Autodetect")
        setSelectedLanguage(project.retrievedProject.originalLanguage);
    }else {
      setCurrentVideoLink(project.translatedVideosLinks[language].signedUrl);
      setSelectedFileName(`${title}-${language.toLowerCase()}.${project.retrievedProject.originalFileName.split('.').pop()}`);
      setSelectedLanguage(language);
    }
  }

  const dateHandler = (date) => {
    const new_date = new Date(date);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = new_date.toLocaleDateString('en-US', options);
    return formattedDate;
  }

  const durationHandler = (length) => {
    const min = parseInt(length/60);
    const sec = parseInt(length - 60 * min);
    return `${min} : ${sec}`;
  }

  const fileNameFromLink = (link) => {
    const fileName = link.substring(link.lastIndexOf('/') + 1, link.indexOf('?'));
    return fileName;
  }

  const handleDownload = async (type, videoUrl) => {
    if(type == 'One'){
      const xhr1 = new XMLHttpRequest();
      let downloadUrl = videoUrl;
      let fileName = selectedFileName;
      if(project.retrievedProject.requestType == 1) {
        downloadUrl = project.subtitlesDocumentLink.signedUrl;
        fileName = `${project.retrievedProject.projectTitle}_subtitles.vtt`;
      }
      if(project.retrievedProject.requestType == 2){
        fileName = `${project.retrievedProject.projectTitle}_video.mp4`;
        downloadUrl = project.podcastVideoLink.signedUrl;
      }
      xhr1.open('GET', downloadUrl, true);
      xhr1.responseType = 'blob';
      xhr1.onload = function() {
        if (xhr1.status === 200) {
          const blob = xhr1.response;
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(url);
        }
      };
      xhr1.send();
    }
    if (type === 'ALL') {
      const xhr = new XMLHttpRequest();
      const languages = project.retrievedProject.translatedLanguages;
      let i = 0;

      const downloadNext = () => {
        if (i >= languages.length) {
          return;
        }

        const language = languages[i];
        xhr.open('GET', project.translatedVideosLinks[language].signedUrl, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
          if (xhr.status === 200) {
            const blob = xhr.response;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title}-${language.toLowerCase()}.${project.retrievedProject.originalFileName.split('.').pop()}`;
            link.click();
            window.URL.revokeObjectURL(url);
          }
    
          // Download the next language
          i++;
          downloadNext();
        };
        xhr.send();
      }
    
      // Start downloading the first language
      downloadNext();
    }
  }

  // Modal for Deleting Confirmation
  const accept = async () => {
    await deleteProject(project.retrievedProject._id);
    history.push('/');
  }

  const reject = () => {
  }

  const confirm = () => {
    confirmDialog({
        message: 'Do you want to delete this project?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept,
        reject
    });
  };

  const prevProject = () => {
    if(previousProjectId != null && previousProjectId != 'null' && previousProjectId != ''){
      window.location.href = `/project/${previousProjectId}`;
      // history.push(`/project/${previousProjectId}`);
    }
  }

  const nextProject = () => {
    if(nextProjectId != null && nextProjectId != 'null' && nextProjectId != ""){
      window.location.href = `/project/${nextProjectId}`;
    }
  }

  return (
    <>
      {project.retrievedProject &&
        <div className={styles.newProject}>
          <div className={styles.subHeader}>
            <p className={styles.title}>{title}</p>
            <div style={{display:'flex'}}>
              <p className={styles.icons} onClick={() => setVisibleRight(true)}><i className='fa fa-info-circle'></i></p>
              <p className={`${styles.icons} ${!project.previousProjectId ? styles.unActive_arrow : ''}`} onClick={prevProject}><i className='fa fa-angle-left'></i></p>
              <p className={`${styles.icons} ${!project.nextProjectId ? styles.unActive_arrow : ''}`} onClick={nextProject}><i className='fa fa-angle-right'></i></p>
              <p className={classNames(styles.icons, styles.icon_trash)} onClick={confirm}><i className='fa fa-trash-alt'></i></p>
              <Link className={styles.close} to='/'><i className='fa fa-close'></i></Link>
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.main}>
            <div className={styles.content}>
              <video className={styles.video} src={currentVideoLink} autoPlay controls crossOrigin="anonymous" >
                <track label="Subtitles" kind="subtitles" src={project.subtitlesDocumentLink.signedUrl} default srcLang="en"/>
              </video>
              <div style={{display:'flex'}}>
                <p style={{marginRight:'20px'}} onClick={()=>handleDownload('One',currentVideoLink)} className={classNames(styles.button)}>
                  {project.retrievedProject.requestType == 0 && `Download selected version`}
                  {project.retrievedProject.requestType == 1 && `Download subtitles`}
                  {project.retrievedProject.requestType == 2 && `Download Podcast`}
                </p>
                {(project.retrievedProject.requestType == 0 && project.retrievedProject.translatedLanguages.length != 1) && <p onClick={()=>handleDownload('ALL',project.originalVideoLink.signedUrl)} className={styles.language_button}>Download all versions</p>}
              </div>
            </div>
            {project.retrievedProject.requestType != 2 &&
              <div className={styles.content}>
              <p className={styles.subTitle}><span style={{color:'#6f7073'}}>Watching in</span> {selectedLanguage}</p>
              <p className={styles.subSubTitle}>Original</p>
              <div style={{display:'flex', marginBottom:'20px'}}>
                <p onClick={()=> {handleLanguageChange('Original'), setSelectedButton('Original')}} style={{marginRight:'20px'}} className={selectedButton === 'Original' ? styles.selected_button : styles.language_button}>{project.retrievedProject.originalLanguage}</p>
              </div>
              {project.retrievedProject.requestType == 0 &&
              <>
                <p className={styles.subSubTitle}>Translated</p>
                <div style={{display:'flex', flexFlow:'wrap'}}>
                  {project.retrievedProject.translatedLanguages && project.retrievedProject.translatedLanguages.map((language, index) => (
                  <p key={index} className={selectedButton === language ? styles.selected_button : styles.language_button} onClick={()=>{handleLanguageChange(language),setSelectedButton(language)}}>{language}</p>
                ))}
                </div>
              </>}
            </div>}
          </div>
          <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
            <h5 style={{marginTop:'10px',marginBottom:'40px'}}>Project Details</h5>
            <div className={styles.sidebar_subsection}>
              <h6 className={styles.sidebar_subtitle}>Upload Date</h6>
              <h6>{dateHandler(project.retrievedProject.created_at)}</h6>
            </div>
            {project.retrievedProject.requestType != 2 &&
              <div className={styles.sidebar_subsection}>
              <h6 className={styles.sidebar_subtitle}>Duration</h6>
              <h6>{durationHandler(project.retrievedProject.length.$numberDecimal)}</h6>
            </div>}
            <div className={styles.sidebar_subsection}>
              <h6 className={styles.sidebar_subtitle}>Original Language</h6>
              <h6>{project.retrievedProject.originalLanguage}</h6>
            </div>
            {project.retrievedProject.requestType != 2 && 
              <div className={styles.sidebar_subsection}>
                <h6 className={styles.sidebar_subtitle}>Translated Language(s)</h6>
                <h6>
                  {project.retrievedProject.translatedLanguages.map((language, index)=>(
                    <span key={index}>{language}&nbsp; &nbsp;</span>
                  ))}
                </h6>
              </div>}
            {project.retrievedProject.requestType == 1 &&
              <div className={styles.sidebar_subsection}>
                <h6 className={styles.sidebar_subtitle}>Subtitles</h6>
                <h6>Yes</h6>
              </div>}
            <div className={styles.sidebar_subsection}>
              <h6 className={styles.sidebar_subtitle}>Uploaded Files</h6>
              <h6>{project.retrievedProject.originalFileName}</h6>
              {project.retrievedProject.transcriptionFileNames && project.retrievedProject.transcriptionFileNames.map((fileName, index)=>(
                <h6 className={styles.sidebar_subtitle} key={index}>{fileName}</h6>
              )
              )}
            </div>
          </Sidebar>
          <ConfirmDialog />
          <Loader promiseTracker={usePromiseTracker} color={'#3F88C5'}/>
        </div>
      }
    </>
  );
};

export default ProjectDetail;