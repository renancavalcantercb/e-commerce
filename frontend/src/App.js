import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Grid from './components/Grid';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
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
        <Route path="/cart" />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
