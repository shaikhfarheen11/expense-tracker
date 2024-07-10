import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './Component/AuthContext/AuthContext';
// import { CartProvider } from './Component/Cart/CartContext';
import { Provider } from 'react-redux';
import store from './Component/store/store';
import '@fortawesome/fontawesome-free/css/all.min.css';

import firebaseApp from './Component/firebaseConfig';
const root = createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider firebaseApp={firebaseApp}>
    <Provider store={store}>
      {/* <CartProvider> */}
        <App />
      {/* </CartProvider> */}
    </Provider>
  </AuthContextProvider>
);
