import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  // useEffect will run the loginWithRedirect function as soon as the component is mounted
  useEffect(() => {
    const fn = async () => {
      await loginWithRedirect();
    };
    fn();
  }, [loginWithRedirect]); // The empty array as a second argument ensures this effect only runs once when the component mounts.

  return (
    <div></div>
  );
};

export default LoginPage;
