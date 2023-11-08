import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';
import Header from 'components/Header/Header';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Title from 'components/Title/Title';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './NavBar.scss';

const SettingsPage = () => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const { logout, user } = useAuth0();

  const handleLogout = () => {
    // This will log the user out and redirect them to the homepage
    logout({ returnTo: 'www.polydub.app' });
  };

  const updatePassword = () => {
    // Assume we have a function to get the user's ID securely
  
    // Call your backend endpoint
    fetch('https://polydub-backend-7707d66a10f4.herokuapp.com/create-password-change-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.sub, email: user.email }),
    })
    .then(response => response.json())
    .then(data => {
      // You could redirect the user to the ticket URL or handle it however you wish
      window.location.href = data.ticket;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="settings-page">
      <Header />
      <Title>Settings</Title>
      <button onClick={updatePassword} className={classNames(styles.button)}>Change Password</button>
      <button onClick={handleLogout} className={classNames(styles.button)}>Log Out</button>
    </div>
  );
};

export default SettingsPage;
