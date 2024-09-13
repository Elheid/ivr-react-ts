
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPageComponent from './components/MainPage/Main.tsx'
import InstructionComponent from './components/InstructionPage/Instruction.tsx';
import ServicesComponent from './components/ServicesPage/Services.tsx';
import { useState } from 'react';

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'clear-language'); 

  return (
    <BrowserRouter>
      <div className={"App " +  language}>
        <Routes>
          <Route path="/" element={<MainPageComponent language={language} setLanguage={setLanguage}  />} />
          <Route path="/instruction" element={<InstructionComponent />} />
          <Route path="/services" element={<ServicesComponent />} /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

/*
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          {count}
        </button>
      </div>
    </>
  )
}*/

