import axios, { AxiosError } from "axios";
import { API_BACK_URL } from "../assets/data/constants";
import { Category, InfoCard, Service } from "../interfaces/CardsInterfaces";
import { changeDataInCardData, getDescriptionAndIcons, myFunctionWithDelay, saveCategoriesTitles } from "../utill";
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

  REMOVE_CATEGORY_CHILD: 'categories/children/remove/',

  CATEGORIES: 'categories',

  SERVICES: 'items',

  ADDITIONS: 'additions',

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
};/*
const uploadDataSetId = async <T>(route: string, data: T) => {
  const res = await axios.post(route, data);
  return res;
};*/
const uploadDataPutId = async <T>(route: string, data: T) => {
  const res = await axios.put(route, data);
  return res;
};

const getCategories= () => load(Route.CATEGORIES);
const getService= (id : number) => loadByValue(`${Route.SERVICES}/`, id);
const getServiceById= (id : number) => loadByValue(Route.GET_SERVICES, id);
const getInfoById= (id : number) => loadByValue(Route.ADDITIONS, id);
const getInfoCardsByServiceId= (id : number) => loadByValue(`${Route.ADDITIONS}/search/item/`, id);

const getServiceByTitle= (title : string) => loadByValue(Route.SEARCH_SERVICE_BY_TITTLE, title);

const logIn = (username:string, password:string)=> login(username, password);
const fetchAndRefreshToken = ()=> refreshToken();

const signIn = async <T>(data:T)=> {
  const response = await axios.post(`auth/sign-in`, data)
  return response;
}


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

const uploadToS3 = <T>(data: T) => uploadData(`${Route.S3_UPLOAD}`, data)


//Admin

const updateGifPreview = <T>(id:number, data:T, route:string) => uploadDataPutId(`/${route}/${id}/gif-preview`, data) 
const updateGif = <T>(id:number, data:T, route:string) => uploadDataPutId(`/${route}/${id}/gif`, data) 
const updateainIcon =  <T>(id:number, data:T, route:string) => uploadDataPutId(`${route}/${id}/main-icon`, data); 

const clearIcons = (id:number, route:string) => uploadSetId(`${route}/${id}/clear-icons`); 

const updateDescription = <T>(id:number, data:T, route:string) => uploadDataPutId(`${route}/${id}/description`, data); 
const addIcon =  <T>(id:number, data:T, route:string) => uploadDataPutId(`/${route}/${id}/icon/add`, data) 


const createCategory = (data: Category)=> uploadData('categories', data)
const setCategoryParent = (id:number, parentId:number)=> uploadSetId(`${Route.CATEGORIES}/${id}/parent/set/${parentId}` )

//const updateCategoryMainIcon = (id:number, data:object) => uploadDataPutId(`${Route.CATEGORIES}/${id}/main-icon`, data);



const createService = (data: Service)=> uploadData('items', data)
const addServiceCategory = (id:number, parentId:number)=> uploadSetId(`/${Route.SERVICES}/${id}/category/add/${parentId}`)
const removeServiceCategory = (id:number) => uploadSetId(`/${Route.SERVICES}/${id}/category/remove`)


//const updateServiceMainIcon =  <T>(id:number, data:T) => uploadDataPutId(`${Route.SERVICES}/${id}/main-icon`, data); 

//const addServiceIcon =  <T>(id:number, data:T) => uploadDataPutId(`/${Route.SERVICES}/${id}/icon/add`, data)


const createAddition = (data: InfoCard)=> uploadData(`${Route.ADDITIONS}`, data)
//const addAdditionIcon =  <T>(id:number, data:T) => uploadDataPutId(`/${Route.ADDITIONS}/${id}/icon/add`, data) 


const updateAdditionTitle = <T>(id:number, data:T)=> uploadDataPutId(`${Route.ADDITIONS}/${id}/title`, data); 
//const updateAdditionMainIcon =  <T>(id:number, data:T) => uploadDataPutId(`${Route.ADDITIONS}/${id}/main-icon`, data); 

const deleteCard = async(type: CardType, id:number, setLoader: React.Dispatch<React.SetStateAction<boolean>>)=>{
  setLoader(true)
  if (type === CardType.CATEGORY || type === CardType.SUB_CATEGORY)
    await axios.delete(`categories/${id}`)
  if (type === CardType.SERVICE)
    await axios.delete(`items/${id}`)
  if (type === CardType.ADDITIONAL_INFO)
    await axios.delete(`additions/${id}`)
  setLoader(false)
  //window.location.reload();
}




const setIdAndAddIcons = async (type:CardType, id:number, iconLinks:string[]) => {
  for (const link of iconLinks) {
      const data = { link };
      if (type === CardType.SERVICE) {
          await addIcon(id, data, Route.SERVICES);
      }
      if (type === CardType.ADDITIONAL_INFO) {
          await addIcon(id, data, Route.ADDITIONS);
      }
  }
}


const createCard = async (type:string, 
  data: FormValues, 
  parentId:number, 
  setLoader: React.Dispatch<React.SetStateAction<boolean>>,
  callback:()=> void) => {
  const category:string = CardType.CATEGORY;
  const subCategory:string = CardType.SUB_CATEGORY;
  const service:string = CardType.SERVICE;
  const info:string = CardType.ADDITIONAL_INFO;
  setLoader(true)
  const actions = {
      [category]: async () => {

          const caregoryData =  changeDataInCardData(type as CardType, data, parentId) as Category;
          await createCategory(caregoryData);
      },
      [subCategory]: async () => {

        const subCaregoryData =  changeDataInCardData(type as CardType, data, parentId) as Category;
        const dataOfAdded = await createCategory(subCaregoryData);
        await setCategoryParent(dataOfAdded.data.id, parentId)

      },
      [service]: async () => {
          const serviceData =  changeDataInCardData(type as CardType, data, parentId) as Service;
          const dataOfAdded = await createService(serviceData);
          await addServiceCategory(dataOfAdded.data.id, parentId);
          await setIdAndAddIcons(service as CardType, dataOfAdded.data.id, serviceData.iconLinks);

          console.log("done")

      },
      [info]: async () => {
        const infoData =  changeDataInCardData(type as CardType, data, parentId) as InfoCard;
        const dataOfAdded = await createAddition(infoData);
        await setIdAndAddIcons(info as CardType, dataOfAdded.data.id, infoData.iconLinks);
      }
  };
  if (actions[type]) {
      await actions[type]();
      setLoader(false)
      callback();
      //window.location.reload();
  } else {
      console.log("Ошибка с созданием запроса добавления");
  }
};



const sendChangedFields = async(fieldsNames:string[], 
  cardInFormType:CardType,  
  dataToSend:FormValues)=>{
  const serviceOrInfoCard = (cardInFormType === CardType.ADDITIONAL_INFO || cardInFormType === CardType.SERVICE);

  let route:string = Route.CATEGORIES;
  if(cardInFormType === CardType.CATEGORY || cardInFormType === CardType.SUB_CATEGORY) route = Route.CATEGORIES;
  else if(cardInFormType === CardType.SERVICE) route = Route.SERVICES;
  else if(cardInFormType === CardType.ADDITIONAL_INFO) route = Route.ADDITIONS;
  else{
    console.log("card type in form is not defined or is not one of the types");
    return;
  }
  for(const name of fieldsNames){
    if (name === "title" && cardInFormType === CardType.ADDITIONAL_INFO){
      //console.log("заглушка для запроса смены title")
      const title = dataToSend.title;
      await updateAdditionTitle(dataToSend.id, {title})
    }
    if (name === "mainIconLink"){
      //console.log("заглушка для запроса смены mainIconLink")
      /*const data = dataToSend.mainIconLink;
      if(cardInFormType === CardType.CATEGORY || cardInFormType === CardType.SUB_CATEGORY) await updateCategoryMainIcon(dataToSend.id, {data})
      if(cardInFormType === CardType.SERVICE) await updateServiceMainIcon(dataToSend.id, {data})
      if(cardInFormType === CardType.ADDITIONAL_INFO) await updateAdditionMainIcon(dataToSend.id, data)*/
      const image = dataToSend.mainIconLink;
      await updateainIcon(dataToSend.id, {image}, route)
    }
    if (name === "gifPreview"){
      //console.log("заглушка для запроса смены gifPreview")
      const video = dataToSend.gifPreview;
      await updateGifPreview(dataToSend.id, {video}, route)

    }
    if (name === "resVideo" && serviceOrInfoCard){
      //console.log("заглушка для запроса смены resVideo || gifLink")
      const resVideo = dataToSend.resVideo;
      await updateGif(dataToSend.id, {resVideo}, route)
    }
    if (((name === "descriptionParts" || name === "description") || name === "iconLinks")  && serviceOrInfoCard){
      //console.log("заглушка для запроса смены description и iconLinks")
      if (dataToSend.descriptionParts && dataToSend.iconLinks){
        const {description, icons} = getDescriptionAndIcons(dataToSend.descriptionParts, dataToSend.iconLinks)
        await clearIcons(dataToSend.id, route)
        await updateDescription(dataToSend.id, {description}, route)
        for (const link of icons){
          await addIcon(dataToSend.id, {link}, route)
        }
      }
      else{
        console.log("smth wrong with description or icons")
        //return;
      }
    }
    if ((name === "switchToTransfer" || name === "parentId") && cardInFormType !== CardType.CATEGORY){
      //console.log("заглушка для запроса переноса в другую категорию с id ", dataToSend.parentId)
      if (dataToSend.switchToTransfer && (dataToSend.switchToTransfer !== -1 && dataToSend.switchToTransfer !== -2)){
        await removeServiceCategory(dataToSend.id)
        await addServiceCategory(dataToSend.id, dataToSend.switchToTransfer)
      }
      else{
        console.log("no parent id")
      }
    }
  }

  console.log("done&")
}

const editCard = async(cardInFormType:CardType, dataToSend:FormValues,  
  dirtyFields:string[], parentId:number, setLoader: React.Dispatch<React.SetStateAction<boolean>>, callback:()=> void)=>{
    dataToSend.parentId = parentId
    //console.log(parentId)
    setLoader(true)
    await sendChangedFields(dirtyFields, cardInFormType, dataToSend);
    setLoader(false)
    callback();
}



export {getCategories, getService, getServiceById, 
getInfoById, getServiceByTitle, getCategoryNameById, 
loadCategoriesTitles, getInfoCardsByServiceId, logIn, fetchAndRefreshToken,

createCategory, setCategoryParent, deleteCard, createCard, editCard, uploadToS3, signIn
}