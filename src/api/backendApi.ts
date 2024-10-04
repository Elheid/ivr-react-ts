import { API_BACK_URL } from "../assets/data/constants";
import { Category, Service } from "../interfaces/CardsInterfaces";
import { saveCategoriesTitles } from "../utill";
const BASE_URL = API_BACK_URL;

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

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте изменить запрос',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
  DELETE_DATA: 'Не удалось удалить данные. Попробуйте ещё раз',
  UPDATE_DATA: 'Не удалось обновить данные. Попробуйте ещё раз'
};


const load = (route : string, errorText : string, method = Method.GET, body = null, ) =>
  fetch(`${BASE_URL}${route}`, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error();  
      }
      return response.json();
    })
    .catch(() => {
      throw new Error(errorText);
});

const loadByValue = (route : string, value : number | string, errorText :string, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}${route}${value}`, { 
    method, 
    body: body ? JSON.stringify(body) : null,
    //headers: body ? { 'Content-Type': 'application/json','accept': '*/*' } : {} 
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*',
      //'Authorization': localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token") }` : undefined, // Добавляем Authorization, если есть токен
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      //return response.json();
      const text = response.text();
      return text.then(text => {
        try {
          return JSON.parse(text);
        } catch (e) {
          console.log('Error parsing JSON:', e, text);
          throw new Error('Failed to parse JSON response');
        }
      });
    })
    .catch(() => {
      throw new Error(errorText);
});



const refreshToken = (methodName = "POST") => 
  fetch(`${BASE_URL}auth/refresh-token`, {
      method: methodName,
      body: JSON.stringify({token: localStorage.getItem("token"), refreshToken:localStorage.getItem("refresh-token")}),
      headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'Authorization': localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined, // Добавляем Authorization, если есть токен
      },
  })
      .then((response) => {
          if (!response.ok) {
              return response.text().then((text) => {
                  throw new Error(text);
              });
          }
          return response.json();
      })
      .catch((error) => {
          //console.error('Error details:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh-token');
          alert("Время истекло, перезайдите в аккаунт " + err);

          throw new Error(error);
      });

const login = (username :string, password :string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  return fetch(`${BASE_URL}auth/sign-in`, {
      method: 'POST',
      headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username: username,
          password: password,
      }),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error(response.statusText);
          }
          console.log(response)
          return response.json()
      })
      .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh-token', data.refreshToken);
        //checkAdmin();
      })
      .catch((error) => {
          alert('Login failed ' + error);
          throw new Error(error);
      });
};



const getCategories= () => load(Route.CATEGORIES, ErrorText.GET_DATA);
const getService= (id : number) => loadByValue(Route.SERVICES, id, ErrorText.GET_DATA);
const getServiceById= (id : number) => loadByValue(Route.GET_SERVICES, id, ErrorText.GET_DATA);
const getInfoById= (id : number) => loadByValue(Route.ADDITIONS, id, ErrorText.GET_DATA);
const getInfoCardsByServiceId= (id : number) => loadByValue("additions/search/item/", id, ErrorText.GET_DATA);

const logIn = (username:string, password:string)=> login(username, password);
const fetchAndRefreshToken = ()=> refreshToken();

const getCategoryNameById= (id:number) => load(Route.CATEGORIES, ErrorText.GET_DATA).then(data => {
  const res = data.content.filter((el : Category | Service)=> Number(el.id) === id);
  const title = res[0].title;
  return title;
});

const loadCategoriesTitles = () => {
  getCategories().then((data) => {
    saveCategoriesTitles(data.content);
  });
};
const getServiceByTitle= (title : string) => loadByValue(Route.SEARCH_SERVICE_BY_TITTLE, title, ErrorText.GET_DATA);


export {getCategories, getService, getServiceById, 
getInfoById, getServiceByTitle, getCategoryNameById, 
loadCategoriesTitles, getInfoCardsByServiceId, logIn, fetchAndRefreshToken,

}