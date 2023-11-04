import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar';
import Grid from './components/Grid';
import Cart from './components/Cart';
import { store } from './utils/store';
import RegistrationForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';
import ProtectedElement from './components/ProtectedElement';
import NotFound from './components/NotFound';
import Footer from './components/Footer';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
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
            <Route path="/cart" element={<ProtectedElement><Cart /></ProtectedElement>} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<LoginForm />} />
            <Route path="/profile" element={<ProtectedElement><Profile /></ProtectedElement>} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}


export default App;
