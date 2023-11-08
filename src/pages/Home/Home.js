import React, { useEffect, useState } from 'react';
import { getProjectsList } from '../../actions/projectsList';
import Header from 'components/Header/Header';
import Title from 'components/Title/Title';
import ReposCard from 'components/ReposCard/ReposCard';
import Loader from 'react-promise-loader';
import { useSelector } from 'react-redux';
import { usePromiseTracker,trackPromise } from 'react-promise-tracker';
import { setTabValueInHome } from '../../actions/setTabValueAction.js';
import styles from './Home.scss';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import classNames from 'classnames';
import Badge from '@mui/material/Badge';
import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
  const {user} = useAuth0();
  const user_id = user.sub;
  // const user_id = 'testUser24';
  const [projects, setProjects] = useState([]);
  const [projects1, setProjects1] = useState([]);
  const [projects2, setProjects2] = useState([]);
  const [projects3, setProjects3] = useState([]);
  const [tabValue, setTabValue] = useState('1');
  const [videoNumber, setVideoNumber] = useState(0);
  const [warningFlag, setWarningFlag] = useState(1);
  useEffect(() => {
    getProjectsList(user_id);
  },[]);
  
  const tabValueFromStore = useSelector((state) => state.setTabValueReducer);
  const get_projects = useSelector((state) => state.projectsListReducer.projects);
  useEffect(() => {
    setProjects(get_projects);
    setProjects1([]);
    setProjects2([]);
    setProjects3([]);
    const projects1_temp = [];
    const projects2_temp = [];
    const projects3_temp = [];
    projects.forEach((project) => {
      switch(project.retrievedProject.status) {
        case 0: 
          projects1_temp.push(project);
          break;
        case 1:
          projects2_temp.push(project);
          break;
        case 2:
          projects3_temp.push(project);
          break;
        default:
      }
    });
    setProjects1(projects1_temp);
    setProjects2(projects2_temp);
    setProjects3(projects3_temp);
    setVideoNumber(projects1_temp.length)
  }, [projects, get_projects]);

  useEffect(() => {
    setTabValue(tabValueFromStore);
    return () => {
      setTabValueInHome('1');
    }
  },[]);

  let needingActionFlag = 0;
  if(projects3.length != 0) needingActionFlag = 1;

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <div style={{ width: '100%', height: '5px' }}></div>
      <Header />
      <div>
        <Title>Projects</Title>
        {(projects.length != 0 && tabValue != 3) && <div className={styles.videoNumber}>{`${videoNumber} videos`}</div>}
        {(tabValue == 3 && warningFlag == 1 && needingActionFlag == 1) && 
          <div className={styles.warning_parent}>
            <div className={styles.warning}>
              <div className={styles.warning_child1}>
                <p><i className="fa fa-warning" aria-hidden="true"></i>&nbsp;&nbsp;Your upload(s) failed</p>
                <i onClick={()=>{setWarningFlag(0)}} className={classNames(styles.closeIcon, 'fa', 'fa-close')} aria-hidden="true"></i>
              </div>
              <div className={styles.warning_child2}>Please open the project, reattach the missing file(s) and submit again.</div>
            </div>
          </div>
        }
        <Box sx={{ width: '100%', typography: 'body1', marginTop: '-17px'}}>
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
                  label="Completed"
                  onClick={() => setVideoNumber(projects1.length)}
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
                    label="In progress" 
                  onClick={() => setVideoNumber(projects2.length)}
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
                    label = {
                      needingActionFlag === 1 ? (
                        <Badge color="error" variant='dot'>
                          Needs action
                        </Badge>
                      ) : (
                        'Needs action'
                      )
                    } 
                  onClick={() => setVideoNumber(projects3.length)}
                    value="3">
                      </Tab> 
              </TabList>
            </Box>
            <TabPanel sx={{padding:'40px 0 0 0'}} value="1">
              <div className={styles.reposList} >
                {projects1.length != 0 && projects1.map((project, index) => (
                  <ReposCard key={`${project.projectId}_${index}1`} project = {project}/>
                ))}
              </div>
            </TabPanel>
            <TabPanel sx={{padding:'40px 0 0 0'}} value="2">
              <div className={styles.reposList} >
                {projects2.length != 0 && projects2.map((project, index) => (
                  <ReposCard key={`${project.videoId}_${index}2`} project = {project}/>
                ))}
              </div>
            </TabPanel>
            <TabPanel sx={{padding:'40px 0 0 0'}} value="3">
              <div className={styles.reposList} >
                {projects3.length != 0 && projects3.map((project, index) => (
                  <ReposCard key={`${project.videoId}_${index}3`} project = {project}/>
                ))}
              </div>
            </TabPanel>
          </TabContext>
        </Box>
        {
          projects.length == 0 &&
          <div style={{textAlign:'center'}}>
            <div className={styles.blank1}>
              <p>Start your first project</p>
            </div>
            <div className={styles.blank2}>
            <p>Click new project above to take your content global</p>
            </div>
          </div>
        }
      </div>
      {useSelector((state) => state.projectsListReducer.projects).length == 0  && <Loader promiseTracker={usePromiseTracker} color={'#3F88C5'}/>}
    </>
  )
}

export default Home;