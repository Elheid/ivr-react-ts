import axios, { AxiosError } from "axios";
import { API_BACK_URL } from "../assets/data/constants";
import { Category, InfoCard, Service } from "../interfaces/CardsInterfaces";
import { myFunctionWithDelay, saveCategoriesTitles } from "../utill";
import { CardType } from "../contextProviders/formTypeProvider";
import { FormValues } from "../interfaces/FormValuesInterface";

const BASE_URL = API_BACK_URL;

axios.defaults.baseURL = "" + BASE_URL;
axios.defaults.headers.common['Authorization'] = localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token") }` : undefined;


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
    alert("Время истекло, перезайдите в аккаунт" + error.message);
    
    myFunctionWithDelay(()=> window.location.reload(), 200)

    //throw new Error(error.message);
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

const uploadData = async <T>(route: string, data: T) => {
  const res = await axios.post(route, data);
  return res;
};
const uploadSetId = async (route: string) => {
  const res = await axios.put(route);
  return res;
};
const uploadDataSetId = async <T>(route: string, data: T) => {
  const res = await axios.post(route, data);
  return res;
};
const uploadDataPutId = async <T>(route: string, data: T) => {
  const res = await axios.put(route, data);
  return res;
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

//Admin

const createCategory = (data: Category)=> uploadData('categories', data)
const setCategoryParent = (id:number, parentId:number)=> uploadSetId(`categories/${id}/parent/set/${parentId}` )


const createService = (data: Service)=> uploadData('items', data)
const addServiceCategory = (id:number, parentId:number)=> uploadSetId(`/items/${id}/category/add/${parentId}`)
const addServiceIcon = (id:number, data:object) => uploadDataPutId(`/items/${id}/icon/add`, data)


const createAddition = (data: InfoCard)=> uploadData('additions', data)
const addAdditionIcon = (id:number, data:object) => uploadDataPutId(`/additions/${id}/icon/add`, data) 

const deleteCard = async(type: CardType, id:number)=>{
  if (type === CardType.CATEGORY || type === CardType.SUB_CATEGORY)
    await axios.delete(`categories/${id}`)
  if (type === CardType.SERVICE)
    await axios.delete(`items/${id}`)
  if (type === CardType.ADDITIONAL_INFO)
    await axios.delete(`additions/${id}`)
  window.location.reload();
}


const assembleDescription = (textParts: string[]): string => {
  let description = '';
  const pattern = /<img.*?alt="([^"]+)".*?>/g;

  textParts.forEach((text) => {
    // Проверяем, есть ли тег <img> в тексте
    if (pattern.test(text)) {
      // Если тег <img> есть, заменяем его
      const updatedText = text.replace(pattern, (_, alt) => `\n\\icon${alt}`);
      if (text.startsWith("\n- ")) {
        description += updatedText;
      } else if (text.startsWith("- ")) {
        description += "\n" + updatedText;
      } else {
        description += "\n- " + updatedText;
      }
    } else {
      // Если тега <img> нет, добавляем текст без изменений
      description += text + '\n';
    }
  });

  return description;
};


const setIdAndAddIcons = async (type:CardType, id:number, iconLinks:string[]) => {
  for (const link of iconLinks) {
      const data = { link };
      if (type === CardType.SERVICE) {
          await addServiceIcon(id, data);
      }
      if (type === CardType.ADDITIONAL_INFO) {
          await addAdditionIcon(id, data);
      }
  }
}

const getDescriptionAndIcons = (parts:string[], iconLinks:string[])=>{
  const newDesc:string[] = [];
  let count = 0;
  parts.forEach((part, id)=>{
    let icon:string;
    if (iconLinks && iconLinks[id] !== "") {
      icon = `<img src=${iconLinks[id]} alt="${count}">`;
      count++;
    }
    else icon = '';
    newDesc[id] = (part + icon);
  })
  const description = assembleDescription(newDesc || []);
  const icons = iconLinks ? iconLinks.filter(str => str !== "") : [];
  return {description, icons};
}

const createCard = async (type:string, data: FormValues, parentId:number) => {
  const category:string = CardType.CATEGORY;
  const subCategory:string = CardType.SUB_CATEGORY;
  const service:string = CardType.SERVICE;
  const info:string = CardType.ADDITIONAL_INFO;
  const actions = {
      [category]: async () => {
          const caregoryData:Category = {
            id: data.id, 
            gifPreview: data.gifPreview,
            mainIconLink: data.mainIconLink,
            title: data.title,
            itemsInCategoryIds: [],
            childrenCategoryIds: [],
            parentCategoryId: 0,
          }
          await createCategory(caregoryData);
      },
      [subCategory]: async () => {
        const subCaregoryData:Category = {
          id: data.id, 
          gifPreview: data.gifPreview,
          mainIconLink: data.mainIconLink,
          title: data.title,
          itemsInCategoryIds: [],
          childrenCategoryIds: [],
          parentCategoryId: parentId
        }
        const dataOfAdded = await createCategory(subCaregoryData);
        await setCategoryParent(dataOfAdded.data.id, parentId)

      },
      [service]: async () => {
        //const newDesc:string[] = [];
        const {description, icons} = getDescriptionAndIcons(data.descriptionParts || [],data.iconLinks || [])
        //const icons = data.iconLinks ? data.iconLinks.filter(str => str !== "") : [];
        const serviceData:Service = {
          id: data.id, 
          gifPreview: data.gifPreview,
          mainIconLink: data.mainIconLink,
          title: data.title,
          categoryId: parentId,
          additionIds: [],
          description:description,
          gifLink:data.resVideo || "",
          iconLinks:icons,
        }
          const dataOfAdded = await createService(serviceData);
          await addServiceCategory(dataOfAdded.data.id, parentId);
          await setIdAndAddIcons(service as CardType, dataOfAdded.data.id, serviceData.iconLinks);

          console.log("done")

      },
      [info]: async () => {

          const {description, icons} = getDescriptionAndIcons(data.descriptionParts || [],data.iconLinks || [])

          const infoData:InfoCard = {
          id: data.id, 
          gifPreview: data.gifPreview,
          mainIconLink: data.mainIconLink,
          title: data.title,
          itemId: parentId,
          description:description,
          gifLink:data.resVideo || "",
          iconLinks:icons,
        }
        const dataOfAdded = await createAddition(infoData);
          await setIdAndAddIcons(info as CardType, dataOfAdded.data.id, infoData.iconLinks);
      }
  };
  if (actions[type]) {
      await actions[type]();
      //window.location.reload();
  } else {
      console.log("Ошибка с созданием запроса добавления");
  }
};




export {getCategories, getService, getServiceById, 
getInfoById, getServiceByTitle, getCategoryNameById, 
loadCategoriesTitles, getInfoCardsByServiceId, logIn, fetchAndRefreshToken,

createCategory, setCategoryParent, deleteCard, createCard
}