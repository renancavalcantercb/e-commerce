import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Grid from './components/Grid';


function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<Grid />} />
        <Route path="/produtos" element={<Grid />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
