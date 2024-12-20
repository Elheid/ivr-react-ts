import axios, { AxiosError } from "axios";
import { API_BACK_URL } from "../assets/data/constants";
import { Category, Service } from "../interfaces/CardsInterfaces";
import { saveCategoriesTitles, tryJsonParse } from "../utill";
const BASE_URL = API_BACK_URL;

axios.defaults.baseURL = "" + BASE_URL;
axios.defaults.headers.common['Authorization'] = localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token") }` : undefined;

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
  const res = response.data;
  const fieldsToParse = [
    { key: 'title', name: 'title' },
    { key: 'description', name: 'description' },
    { key: 'gifLink', name: 'resVideo' },
    { key: 'gifPreview', name: 'video' },
    { key: 'mainIconLink', name: 'image' },
    { key: 'iconLinks', isArray: true , name:"icon"} // Обрабатываем массив
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
  return response; 
});

const Route = {
  GET_SERVICES: 'items/search/byCategory?categoryId=',
  SEARCH_SERVICE_BY_TITTLE:"items/search?title=",
  SEARCH_SIMILAR_SERVICE:"items/search/similar?title=",
  SEND_DATA: '/',

  CATEGORIES: 'categories',

  REMOVE_CATEGORY_CHILD: 'categories/children/remove/',

  SERVICES: 'items/',

  ADDITIONS: 'additions/',

  S3_UPLOAD: 's3/upload'
};

const load = async(route : string) =>{
  const response = await axios.get(route)
  return response.data;
}

const loadByValue = async(route : string, value:string|number) =>{
  const response = await axios.get(`${route}${value}`)
  return response.data;
}

const refreshToken = async() => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refresh-token");

  try{
    const response = await axios.post('auth/refresh-token',{
      token: token,
      refreshToken:refreshToken
    })
    return response.data;
  }
  catch(err){
    const error = err as AxiosError
    localStorage.removeItem('token');
    localStorage.removeItem('refresh-token');
    alert("Время истекло, перезайдите в аккаунт " + error.message);

    throw new Error(error.message);
  }
};

const login = async(username: string, password: string) => {
  try{
    const response = await axios.post(`auth/sign-in`, {
      username: username,
      password: password,
    })
        console.log(response);
        const { token, refreshToken } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refresh-token', refreshToken);
        //checkAdmin();
        return response.data;
  }
  catch(err){
    const error = err as AxiosError
    alert('Login failed: ' + error.message);
  }
};



const getCategories= () => load(Route.CATEGORIES);
const getService= (id : number) => loadByValue(Route.SERVICES, id);
const getServiceById= (id : number) => loadByValue(Route.GET_SERVICES, id);
const getInfoById= (id : number) => loadByValue(Route.ADDITIONS, id);
const getInfoCardsByServiceId= (id : number) => loadByValue("additions/search/item/", id);

const getServiceByTitle= (title : string) => loadByValue(Route.SEARCH_SERVICE_BY_TITTLE, title);

const logIn = (username:string, password:string)=> login(username, password);
const fetchAndRefreshToken = ()=> refreshToken();

const getCategoryNameById= async(id:number) => {
  const data = await load(Route.CATEGORIES)
  const res = data.content.filter((el : Category | Service)=> Number(el.id) === id);
  const title = res[0].title;
  return title;
};

const loadCategoriesTitles = async() => {
  const data = await getCategories();
  saveCategoriesTitles(data.content);
};



export {getCategories, getService, getServiceById, 
getInfoById, getServiceByTitle, getCategoryNameById, 
loadCategoriesTitles, getInfoCardsByServiceId, logIn, fetchAndRefreshToken,

}