import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar';
import Grid from './components/Grid';
import Cart from './components/Cart';
import { store } from './utils/store';
import RegistrationForm from './components/Form';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          pauseOnHover={false}
          closeOnClick
          draggable
        />
        <NavBar />

        <Routes>
          <Route path="/" element={<Grid />} />
          <Route path="/sales" element={<Grid />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
