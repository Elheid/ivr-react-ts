
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
import AdminFormPanel from './components/AdminUtils/AdminModal.tsx/AdminFormPanel.tsx';
import { CardAndFormTypeProvider, CardType, FormType } from './contextProviders/formTypeProvider.tsx';
import { ShowAdminButtonsProvider } from './contextProviders/ShowAdminButtonsProvider.tsx';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Alert } from '@mui/material';

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'clear-language'); 

  const [error, setError] = useState<string | null>(null);

    const queryCache = new QueryCache({
        onError: (error, query) => {
          if (error?.message === '["infoCards"] data is undefined' 
            || error?.message === `Cannot use 'in' operator to search for 'title' in `
          ) return;
          setError("Problem with " + query.queryKey + " " +error?.message);
        }
    });

  const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        retry:false
      }
    },
    queryCache: queryCache,
  });

  return (
    <QueryClientProvider client={queryClient}>
    <ShowAdminButtonsProvider>
    <CardAndFormTypeProvider>
    <BrowserRouter>
    <HomeReturnerComponent timer={DEFAULT_GO_HOME_TIMER} />
      <div className={"App " +  language}>
      <div>
            {/* Отображаем сообщение об ошибке, если оно есть */}
            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {/* Остальная часть приложения */}
        </div>
        <Routes>
        <Route path="/modal" element={<AdminFormPanel cardInFormType={CardType.ADDITIONAL_INFO} formType={FormType.CREATE} openModal={true} modalClose={()=>alert("closed")} handleSubmitModal={()=> alert("submit")}/> } />
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
    </ShowAdminButtonsProvider>
    </QueryClientProvider>
  );
}

export default App;