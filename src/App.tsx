import React from 'react';
import { LoggedOutRouter } from './routers/logged-out-router';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { LoggedInRouter } from './routers/logged-in-router';
import { isLoggedInVar } from './apollo';

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar)
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />
}

export default App;
