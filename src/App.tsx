
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
import { CardAndFormTypeProvider, } from './contextProviders/formTypeProvider.tsx';
import { ShowAdminButtonsProvider } from './contextProviders/ShowAdminButtonsProvider.tsx';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Alert } from '@mui/material';
import { PageStateProvider } from './contextProviders/PageState.tsx';
import axios from "axios";
import { tryJsonParse } from './utill.ts';

function App() {

  const showErrorAlert = (message: string) => {
    setError(message);
  };

  interface ParsedObject {
    title?: string;
    description?: string;
    gifLink?: string;
    gifPreview?: string;
    mainIconLink?: string;
    iconLinks?: string[]; // Явно указываем, что это массив строк
    [key: string]: unknown; // Позволяет добавлять другие поля с типом unknown
  }


  axios.interceptors.response.use((response) => {

    if (response.config && response.config.method === 'get' && response.status !== 204) {
      const res = response.data;
      const fieldsToParse = [
        { key: 'title', name: 'title' },
        { key: 'description', name: 'description' },
        { key: 'gifLink', name: 'resVideo' },
        { key: 'gifPreview', name: 'video' },
        { key: 'mainIconLink', name: 'image' },
        { key: 'iconLinks', isArray: true, name: "icon" } // Обрабатываем массив
      ];

      // Функция для обработки одного объекта
      const parseObjectFields = (obj: ParsedObject) => {
        fieldsToParse.forEach(({ key, name, isArray }) => {
          if (key in obj) {
            if (isArray) {
              const items = obj[key];
              if (Array.isArray(items)) {
                obj[key] = items.map((item) => tryJsonParse(item, 'link'));
              }
            } else {
              if (typeof obj[key] === 'string') {
                obj[key] = tryJsonParse(obj[key], name);
              }
            }
          }
        });
      };

      // Проверка на наличие поля content
      if (Array.isArray(res.content)) {
        res.content.forEach(parseObjectFields); // Проходим по каждому объекту в массиве content
      } else {
        // Если content нет, обрабатываем сам объект
        parseObjectFields(res);
      }
      response.data = res;
    }
    return response;
  },
    (error) => {
      // Выводим ошибку с помощью вашего алерта
      if (error.response) {
        showErrorAlert(`Ошибка: ${error.response.status} - ${error.message}`);
      } else {
        showErrorAlert("Неизвестная ошибка");
      }
      return Promise.reject(error); // Обрабатываем ошибку в дальнейшем
    });


  const [language, setLanguage] = useState(localStorage.getItem('language') || 'clear-language');

  const [error, setError] = useState<string | null>(null);

  const queryCache = new QueryCache({
    onError: (error, query) => {
      if (error?.message === '["infoCards"] data is undefined'
        || error?.message === `Cannot use 'in' operator to search for 'title' in `
      ) return;
      setError("Problem with " + query.queryKey + " " + error?.message);
    }
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    },
    queryCache: queryCache,
  });



  /*const clearOldCache = async (cacheName: string) => {
    const keys = await caches.keys();
    for (const key of keys) {
        if (key !== cacheName) {
            await caches.delete(key); // Удаляем старые кэши
        }
    }
  };*/
  /*useEffect(() => {
    const currentCacheName = 'svg-cache';
    clearOldCache(currentCacheName);
  }, []);*/


  return (
    <QueryClientProvider client={queryClient}>
      <ShowAdminButtonsProvider>
        <PageStateProvider>
          <CardAndFormTypeProvider>
            <BrowserRouter>
              <HomeReturnerComponent timer={DEFAULT_GO_HOME_TIMER} />
              <div className={"App " + language}>
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
                  <Route path="/registration" element={<RegistrationPage />} />
                  <Route path="/login" element={<LogInPage />} />
                  <Route path="/exit" element={<ExitPage />} />
                  <Route path="/" element={<MainPageComponent language={language} setLanguage={setLanguage} />} />
                  <Route path="/instruction" element={<InstructionComponent />} />
                  <Route path="/result" element={<ServiceResultComponent />} />
                  <Route path="/result/:serviceId" element={<ServiceResultComponent />} />
                  <Route path="/services/:categoryId" element={<ServicesComponent />} />

                  <Route path="/subCategories/:subCategoryId/" element={<ServicesComponent />} >
                    <Route path=":categoryId" element={<ServicesComponent />} />
                    <Route path=":subCategoryId/:categoryId" element={<ServicesComponent />} />
                    <Route path=":subCategoryId/:subCategoryId/:categoryId" element={<ServicesComponent />} />
                  </Route>
                  <Route path="/services" element={<ServicesComponent />} />
                  {/*<Route path="/result?categotyId=:id" element={<ServicesComponent />} /> */}
                </Routes>
              </div>
            </BrowserRouter>
          </CardAndFormTypeProvider>
        </PageStateProvider>
      </ShowAdminButtonsProvider>
    </QueryClientProvider>
  );
}

export default App;