import { useState } from 'react'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import  Register from './components/signup';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/signup" element={<Register/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
