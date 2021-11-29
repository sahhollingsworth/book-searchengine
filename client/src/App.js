import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Establish GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Middleware will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // Retrieve authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // Return headers to the context for use by httpLink
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Use authLink middleware prior to making the request to GraphQL API
const client = new ApolloClient ({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
