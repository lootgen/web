import './index.css';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';

const SERVER_URL = process.env.REACT_APP_SERVER_URL ?? 'http://localhost:4000';

export const GRAPHQL_API_URL = `${SERVER_URL}/graphql`;
export const REST_API_URL = SERVER_URL;

const APOLLO_CLIENT = new ApolloClient({
  uri: GRAPHQL_API_URL,
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development',
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={APOLLO_CLIENT}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
