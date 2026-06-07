import React, { useEffect } from 'react';

const PrivateRoute = ({ children, token, setView }) => {
  // Check both the component state token and localStorage token
  const hasToken = token || localStorage.getItem('token');

  useEffect(() => {
    if (!hasToken) {
      // Force navigation back to the login view if no token is found
      setView('login');
    }
  }, [hasToken, setView]);

  // If there is no token, prevent rendering children
  if (!hasToken) {
    return null;
  }

  // If verified, render children components (e.g., TodoList)
  return children;
};

export default PrivateRoute;
