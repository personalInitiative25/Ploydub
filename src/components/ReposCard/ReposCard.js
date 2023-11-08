import React from 'react';
import { getProjectDetail } from '../../actions/projectDetail';
import Card from '@mui/material/Card';
import VideoStatus from '../VideoStatus/VideoStatus';
import { useHistory } from 'react-router-dom';
import styles from './ReposCard.scss';

const ReposCard = (props) => {
  const project = props.project;
  const history = useHistory();
  const cardClickHandler = () => {
    if(project.retrievedProject.status == 0){
      getProjectDetail(project.projectId);
      history.push(`/project/${project.projectId}`);
    }
    if(project.retrievedProject.status == 2){
      getProjectDetail(project.projectId);
      history.push(`/failed_project/${project.projectId}`);
    }
  }

  return (
    <div className={styles.repo}>
      <Card onClick={cardClickHandler} className={styles.card} style={{backgroundImage: `url(${project.thumbnailUrl.signedUrl})`}}>
        { (project.retrievedProject.status == 0 && project.retrievedProject.viewed_at == null) &&
          <VideoStatus status = {project.retrievedProject.status} />
        }
        {project.retrievedProject.requestType != 2 &&
          <div className={styles.video}><i className="fa fa-play" aria-hidden="true"></i>&nbsp; {parseInt(project.retrievedProject.length.$numberDecimal/60)}:{parseInt(project.retrievedProject.length.$numberDecimal-60*parseInt(project.retrievedProject.length.$numberDecimal/60))}
        </div>}
      </Card>
      <div className={styles.title}><p>{project.retrievedProject.projectTitle}</p></div>
    </div>
  );
};

export default ReposCard;
