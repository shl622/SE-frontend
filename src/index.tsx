import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app';
import reportWebVitals from './reportWebVitals';
import "./styles/styles.css"
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import { CartProvider } from './context/cart-context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CartProvider>
        <div className='min-h-screen font-urbanist'>
          <App />
        </div>
      </CartProvider>
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
