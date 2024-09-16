
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPageComponent from './components/MainPage/MainPageComponent.tsx'
import InstructionComponent from './components/InstructionPage/Instruction.tsx';
import ServicesComponent from './components/ServicesPage/Services.tsx';
import { useState } from 'react';
import ServiceResultComponent from './components/ServiceResultPage/ServiceResultComponent.tsx';
import HomeReturnerComponent from './components/HomeReturnerComponent.tsx';
import { DEFAULT_GO_HOME_TIMER } from './assets/data/constants.ts';

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'clear-language'); 
  return (
    <BrowserRouter>
    <HomeReturnerComponent timer={DEFAULT_GO_HOME_TIMER} />
      <div className={"App " +  language}>
        <Routes>
          <Route path="/" element={<MainPageComponent language={language} setLanguage={setLanguage}  />} />
          <Route path="/instruction" element={<InstructionComponent />} />
          <Route path="/result" element={<ServiceResultComponent />} />
          <Route path="/services/:categoryId" element={<ServicesComponent />} />
          <Route path="/services" element={<ServicesComponent />} /> 
          {/*<Route path="/result?categotyId=:id" element={<ServicesComponent />} /> */}
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

