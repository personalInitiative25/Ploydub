import React, { useState } from "react";
import shortid from 'shortid';
// import './MyDropzone.css'

const MyDropzone = ({ setTitle, selectedFile, SetSelectedFile, showError }) => {

  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const InputChange = (e) => {
    // --For Multiple File Input
    let contents = [];
    let isRepeated = 0;
    for (let i = 0; i < e.target.files.length; i++) {
      contents.push(e.target.files[i]);
      let reader = new FileReader();
      let file = e.target.files[i];
      const gigabyteInBytes = 1024 * 1024 * 1024; // 2^30
      const regex = new RegExp('^[A-Za-z0-9 _-]+\.(mp4|mov|docx|doc|txt|pdf)$');

      if(file.name.endsWith('mov') || file.name.endsWith('mp4')) isRepeated++;
      if(isRepeated > 1){
        showError('You can upload only one video file');
        return;
      }

      if (!file.name.endsWith('mov') && !file.name.endsWith('mp4') && !file.name.endsWith('docx') && !file.name.endsWith('doc') && !file.name.endsWith('txt') && !file.name.endsWith('pdf'))  {
        showError('The file upload failed because the file had Incorrect extension. Please upload a file with .mov, .mp4, .docx, .doc, .txt, or .pdf extension.')
        // alert('The file upload failed because the file had Incorrect extension. Please upload a file with .mov, .mp4, .docx, .doc, .txt, or .pdf extension.');
        return;
      }
      if (file.size > gigabyteInBytes)  {
        showError('The file upload failed because the file size exceeds 1GB. Please upload a file with size less than 1GB.')
        // alert('The file upload failed because the file size exceeds 1GB. Please upload a file with size less than 1GB.');
        return;
      }
      if (!regex.test(file.name))  {
        console.log('fail!');
        showError('The file upload failed because the file name contains invalid characters. Please upload a file with numbers, letters, space, -, ., and _ characters only.');
        // alert('The file upload failed because the file name contains invalid characters. Please upload a file with numbers, letters, -, ., and _ characters only.');
        return;
      }
      console.log(file.name);
      const lastModified = file.lastModified || Date.now(); // Fallback to current timestamp
      const lastModifiedDate = new Date(lastModified);
      selectedFile.forEach(file => {
        if(file.filetype.split('/')[0] == 'video') isRepeated++;
      });
      if(isRepeated > 1){
        showError('You can upload only one video file');
        return;
      }
      reader.onloadend = () => {
        SetSelectedFile((preValue) => {
          return [
            ...preValue,
            {
              file_id: shortid.generate(),
              file: e.target.files[i],
              filename: e.target.files[i].name,
              filetype: e.target.files[i].type,
              filecontent: reader.result,
              datetime: lastModifiedDate.toLocaleString(
                "en-IN"
              ),
              filesize: filesizes(e.target.files[i].size)
            }
          ];
        });
      };
      let title_flag = 0;
      for(let i = 0; i < selectedFile.length; i++) {
        setTitle(selectedFile[i].filename.split('.')[0]);
        if(selectedFile[i].filetype.split('/')[0] === 'video') {
          title_flag = 1;
          break;
        }
      }
      if(title_flag == 0){
        for(let i = 0; i < e.target.files.length; i++) {
          setTitle(e.target.files[i].name.split('.')[0]);
          if(e.target.files[i].type.split('/')[0] === 'video') {
            break;
          }
        }
      }
      if (e.target.files[i]) {
        reader.readAsDataURL(file);
      }
    }
  };

  const DeleteSelectFile = (file_id) => {
    const result = selectedFile.filter((data) => data.file_id !== file_id);
    SetSelectedFile(result);
  };

  return (
    <div className="fileupload-view">
      <div className="card">
        <div className="kb-data-box">
          <form>
            <div className="kb-file-upload">
              <div className="file-upload-box">
                <input
                  type="file"
                  id="fileupload"
                  className="file-upload-input"
                  onChange={InputChange}
                  multiple
                />
                <p><i style={{fontSize:'20px'}} className="fa fa-arrow-circle-up"></i></p>
                <p style={{fontSize:'20px', lineHeight:'23px'}}>
                  <span className="file-link">Click to upload</span>
                  &nbsp;or drop your file(s) here
                </p>
                <div style={{fontSize:'13px'}}>
                  <p style={{marginBottom:'3px'}}>Maximum file size 1GB</p>
                  <p style={{marginBottom:'3px'}}>Upload 1 video file and any supporting documents (transcript, translation, etc).</p>
                  <p style={{marginBottom:'3px'}}>*Podcasts only - do not upload a video file, only word docs</p>
                </div>
              </div>
            </div>
            <div className="kb-attach-box mb-3">
              {selectedFile.map((data, index) => {
                const {
                  file_id,
                  filename,
                  filetype,
                  filecontent,
                  datetime,
                  filesize
                } = data;
                return (
                  <div className="file-atc-box" key={index}>
                    <div className="file-detail">
                      <div>
                        <p>{filename}</p>
                        <p style={{fontSize:'13px',color:'#475f7b'}}>{filesize}</p>
                      </div>
                      <p onClick={()=>DeleteSelectFile(file_id)} className="deleteFile">×</p>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyDropzone;