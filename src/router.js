import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import HomeContainer from './pages/Home/Home';
import NewProjectContainer from './pages/NewProject/NewProject';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ProjectDetailContainer from './pages/ProjectDetail/ProjectDetail';
import ProjectEditContainer from './pages/FailedProject/FailedProject';
import CallbackComponent from './components/CallbackComponent/CallbackComponent';
import LoginPage from './pages/LoginPage/LoginPage';
import styles from 'styles/container.scss';
import classNames from 'classnames';

// Only protect routes in production environment
const isProduction = process.env.NODE_ENV === 'production';

// Conditionally apply withAuthenticationRequired based on the environment
// eslint-disable-next-line max-len
const protectedComponent = (Component) => (withAuthenticationRequired(Component));

const RouterComponent = () => (
  <Router>
    <div className={classNames(styles.container, 'app')}>
      <Switch>
        <Route exact path='/' component={protectedComponent(HomeContainer)}/>
        <Route exact path='/home' component={protectedComponent(HomeContainer)}/>
        <Route exact path='/create_project' component={protectedComponent(NewProjectContainer)}/>
        <Route exact path='/project/:project_id' component={protectedComponent(ProjectDetailContainer)}/>
        <Route exact path='/failed_project/:project_id' component={protectedComponent(ProjectEditContainer)}/>
        <Route exact path='/callback' component={CallbackComponent}/>
        <Route exact path='/login' component={LoginPage}/>
        <Route exact path='/settings' component={(protectedComponent(SettingsPage))}/>
      </Switch>
    </div>
  </Router>
);

export default RouterComponent;
