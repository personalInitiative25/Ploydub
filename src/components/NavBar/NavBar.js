import React, { Component } from 'react';
import classNames from 'classnames';
import { navigationItems } from 'config';
// Styles
import styles from './NavBar.scss';
import {Link} from 'react-router-dom';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openNavMenu: false,
    };
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
  }

  toggleMobileMenu() {
    this.setState({ openNavMenu: !this.state.openNavMenu });
  }

  render() {
    return (
      <div className={styles.navMenu}>
        <Link to="/create_project" className={classNames(styles.navMenuItem, styles.button)}>New Project</Link>
        <Link to="/settings" className={classNames(styles.navMenuItem)}>
          <img src='assets/avatar.jpg' className={styles.avatar} />
        </Link>
      </div>
    );
  }

  closeMenu() {
    this.setState({ openNavMenu: false });
  }
}
