import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import store from './store';
import RouterComponent from './router';
// Styles
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'styles/build.scss';
import 'font-awesome/css/font-awesome.min.css';
import 'styles/custom.css';

ReactDOM.render(
    <Provider store={store}>
      <Auth0Provider
        domain={'polydub.us.auth0.com'}
        clientId={'GP9NVjcDHTSAfP13JQ5xJBwFIL7Bvn5j'}
       redirectUri={window.location.origin + '/callback'}
      >
        <RouterComponent />
      </Auth0Provider>
    </Provider>,
    document.getElementById('root'),
);
