import React from 'react';
import { Link } from 'react-router-dom';
import { projectName } from 'config';
const logo = 'assets/logo.png';
// Components
import NavBar from 'components/NavBar/NavBar';
// Styles
import styles from './Header.scss';

const Header = () => (
  <header className={styles.header}>
    <Link className={styles.logoBlock} to="/">
      <img className={styles.logo} src={logo}/>
    </Link>
    <NavBar/>
  </header>);

export default Header;
