
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPageComponent from './components/pages/MainPage/MainPageComponent.tsx'
import InstructionComponent from './components/pages/InstructionPage/Instruction.tsx';
import ServicesComponent from './components/pages/ServicesPage/Services.tsx';
import { useState } from 'react';
import ServiceResultComponent from './components/pages/ServiceResultPage/ServiceResultComponent.tsx';
import HomeReturnerComponent from './components/HomeReturnerComponent.tsx';
import { DEFAULT_GO_HOME_TIMER } from './assets/data/constants.ts';
import LogInPage from './components/pages/LogInAndSignIn/LogInPage.tsx';
import ExitPage from './components/pages/LogInAndSignIn/ExitPage.tsx';
import RegistrationPage from './components/pages/LogInAndSignIn/RegistrationPage.tsx';
import AdmonModalPanel from './components/AdminUtils/AdminModal.tsx/AdminModalPanel.tsx';
import { CardAndFormTypeProvider, CardType, FormType } from './contextProviders/formTypeProvider.tsx';

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'clear-language'); 
  return (
    <CardAndFormTypeProvider>
    <BrowserRouter>
    <HomeReturnerComponent timer={DEFAULT_GO_HOME_TIMER} />
      <div className={"App " +  language}>
        <Routes>
        <Route path="/modal" element={<AdmonModalPanel cardInFormType={CardType.SERVICE} formType={FormType.CREATE}/>} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/exit" element={<ExitPage />} />
          <Route path="/" element={<MainPageComponent language={language} setLanguage={setLanguage}  />} />
          <Route path="/instruction" element={<InstructionComponent />} />
          <Route path="/result" element={<ServiceResultComponent />} />
          <Route path="/result/:serviceId" element={<ServiceResultComponent />} />
          <Route path="/services/:categoryId" element={<ServicesComponent />}/>
          <Route path="/subCategories/:subCategoryId" element={<ServicesComponent />} >
            <Route path=":categoryId" element={<ServicesComponent />} />
          </Route>
          <Route path="/services" element={<ServicesComponent />} /> 
          {/*<Route path="/result?categotyId=:id" element={<ServicesComponent />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
    </CardAndFormTypeProvider>
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

