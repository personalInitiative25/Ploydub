import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Styles
import styles from './VideoStatus.scss';

// Using "Stateless Functional Components"
const VideoStatus = (props) => {
  const status = props.status;
  const statusStyle = (status) => {
    switch (status) {
      case 0: return { background: '#aee9d1' };
      case 'Uploading': return { background: '#ffea8a' };
      case 'Uploaded': return { background: '#ffd79d' };
      case 'Dubbing in progress': return { background: '#a4e8f2' };
      case 'In Progress': return { background: '#a4e8f2' };
      case 'Failed': return { background: '#fed3d1' };
      default: return {};
    }
  };
  const statusIcon = (status) => {
    switch (status) {
      case 'Ready for review': return { color: '#007f5f' };
      case 'Uploading': return { color: '#8a6116' };
      case 'Uploaded': return { color: '#b98900' };
      case 'Dubbing in progress': return { color: '#00a0ac' };
      case 'In Progress': return { color: '#00a0ac' };
      case 'Failed': return { color: '#d72c0d' };
      default: return {};
    }
  };
  let icon='fa-circle';
  if(status=="Uploading" || status=="Failed") icon = 'fa-circle-o';
  return (
    <div style={statusStyle(status)} className={styles.property}><i style={statusIcon(status)} className={classNames(styles.iconFont, 'fa', icon)} ></i> Ready for Review
    </div>
  );
};

export default VideoStatus;
