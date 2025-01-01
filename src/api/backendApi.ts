import axios, { AxiosError } from "axios";
import { API_BACK_URL } from "../assets/data/constants";
import { Category, InfoCard, Service } from "../interfaces/CardsInterfaces";
import { changeDataInCardData, myFunctionWithDelay, saveCategoriesTitles } from "../utill";
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


const createCard = async (type:string, data: FormValues, parentId:number) => {
  const category:string = CardType.CATEGORY;
  const subCategory:string = CardType.SUB_CATEGORY;
  const service:string = CardType.SERVICE;
  const info:string = CardType.ADDITIONAL_INFO;
  const actions = {
      [category]: async () => {
          /*const caregoryData:Category = {
            id: data.id, 
            gifPreview: data.gifPreview,
            mainIconLink: data.mainIconLink,
            title: data.title,
            itemsInCategoryIds: [],
            childrenCategoryIds: [],
            parentCategoryId: 0,
          }*/
          const caregoryData =  changeDataInCardData(type as CardType, data, parentId) as Category;
          await createCategory(caregoryData);
      },
      [subCategory]: async () => {
        /*const subCaregoryData:Category = {
          id: data.id, 
          gifPreview: data.gifPreview,
          mainIconLink: data.mainIconLink,
          title: data.title,
          itemsInCategoryIds: [],
          childrenCategoryIds: [],
          parentCategoryId: parentId
        }*/
        const subCaregoryData =  changeDataInCardData(type as CardType, data, parentId) as Category;
        const dataOfAdded = await createCategory(subCaregoryData);
        await setCategoryParent(dataOfAdded.data.id, parentId)

      },
      [service]: async () => {
        //const newDesc:string[] = [];
        /*const {description, icons} = getDescriptionAndIcons(data.descriptionParts || [],data.iconLinks || [])
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
        }*/
          const serviceData =  changeDataInCardData(type as CardType, data, parentId) as Service;
          const dataOfAdded = await createService(serviceData);
          await addServiceCategory(dataOfAdded.data.id, parentId);
          await setIdAndAddIcons(service as CardType, dataOfAdded.data.id, serviceData.iconLinks);

          console.log("done")

      },
      [info]: async () => {

          /*const {description, icons} = getDescriptionAndIcons(data.descriptionParts || [],data.iconLinks || [])

          const infoData:InfoCard = {
          id: data.id, 
          gifPreview: data.gifPreview,
          mainIconLink: data.mainIconLink,
          title: data.title,
          itemId: parentId,
          description:description,
          gifLink:data.resVideo || "",
          iconLinks:icons,
        }*/
        const infoData =  changeDataInCardData(type as CardType, data, parentId) as InfoCard;
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


const sendChangedFields = (fieldsNames:string[], cardInFormType:CardType,  dataToSend:FormValues)=>{
  const serviceOrInfoCard = (cardInFormType === CardType.ADDITIONAL_INFO || cardInFormType === CardType.SERVICE);
  for(const name of fieldsNames){
    if (name === "title" && cardInFormType === CardType.ADDITIONAL_INFO){
      console.log("заглушка для запроса смены title")
    }
    if (name === "mainIconLink"){
      console.log("заглушка для запроса смены mainIconLink")
    }
    if (name === "gifPreview"){
      console.log("заглушка для запроса смены gifPreview")
    }
    if (name === "resVideo" && serviceOrInfoCard){
      console.log("заглушка для запроса смены resVideo || gifLink")
    }
    if (((name === "descriptionParts" || name === "description") || name === "iconLinks")  && serviceOrInfoCard){
      console.log("заглушка для запроса смены description и iconLinks")
    }
    if (name === "switchToTransfer" && cardInFormType !== CardType.CATEGORY){
      console.log("заглушка для запроса переноса в другую категорию с id ", dataToSend.parentId)
    }
  }
}

const editCard = (cardInFormType:CardType, dataToSend:FormValues,  
  dirtyFields:string[], parentId:number)=>{
    dataToSend.parentId = parentId
    //console.log(parentId)
    sendChangedFields(dirtyFields, cardInFormType, dataToSend);
    /*let caregoryData:Category;


    let subCategory:Category;


    let service: Service;


    let infoCard:InfoCard;

    let diffFields = dirtyFields;
    switch(cardInFormType){
      case "category":

        sendChangedFields(diffFields, cardInFormType, dataToSend);

        console.log(diffFields)
        break;
      case "subCategory":
        subCategory =  changeDataInCardData(cardInFormType, dataToSend, parentId) as Category;
        sendChangedFields(diffFields, cardInFormType, dataToSend);

        console.log(diffFields)
        break;
      case "service":
        service =  changeDataInCardData(cardInFormType, dataToSend, parentId) as Service;
        sendChangedFields(diffFields, cardInFormType, dataToSend);

        console.log(diffFields)
        break;
      case "additional-info":
        infoCard =  changeDataInCardData(cardInFormType, dataToSend, parentId) as InfoCard;
        sendChangedFields(diffFields, cardInFormType, dataToSend);
        console.log(diffFields)
        break;
    }*/

}



export {getCategories, getService, getServiceById, 
getInfoById, getServiceByTitle, getCategoryNameById, 
loadCategoriesTitles, getInfoCardsByServiceId, logIn, fetchAndRefreshToken,

createCategory, setCategoryParent, deleteCard, createCard, editCard
}