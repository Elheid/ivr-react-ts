import { useQuery } from "@tanstack/react-query"
import { getCategories, getInfoCardsByServiceId, getService, getServiceById, getServiceByTitle } from "../api/backendApi"
import { Category, InfoCard, Service } from "../interfaces/CardsInterfaces";



export const useCategoriesQuery = (options = {})=>{

    const query = useQuery({
        queryKey:['categories'],
        queryFn:async ()=>{
            const data = await getCategories();
            const content:Category[] = data.content;
            return content;
        },
        ...options
    })
    return query;
}

export const useServicesQuery = (playload:{categoryId?:number, serviceId?:number ,search?:string}, options = {})=>{


        const isEnabled = 
        playload.categoryId !== -1 
        || playload.categoryId !== undefined 
        || playload.search !== undefined 
        ||playload.search !== ""
        || playload.serviceId !== -1 
        || playload.serviceId !== undefined;
        const query = useQuery({
            queryKey:['services', playload.categoryId, playload.search, playload.serviceId],
            queryFn:async ()=>{
                if (playload.search !== undefined && playload.search !== ''){
                    const data = await getServiceByTitle(playload.search!);
                    const content:Service[] = data.content;
                    return content;
                }
                if (playload.serviceId !== -1 && playload.serviceId !== undefined){
                    const data = await getService(playload.serviceId);
                    const content:Service = data;
                    return content;
                }
                if (playload.categoryId === -1 || playload.categoryId === undefined) {
                    return [];
                }
                const data = await getServiceById(playload.categoryId!);
                    if (data !== ""){
                        const content:Service[] = data.content;
                        return content;
                    }
                    else
                        return [];
            },
            enabled: isEnabled,
            ...options
        })
        return query;
}


export const useInfoCardsQuery = (playload:{serviceId?:number, infoId?:number,}, options = {})=>{

    const query = useQuery({
        queryKey:['infoCards'],
        queryFn:async ()=>{
            /*if (playload.infoId && playload.infoId !== -1){
                const data = await getInfoById(playload.infoId);
                const content:InfoCard = data;
                return content;
            }
            else*/ if (playload.serviceId && playload.serviceId !== -1){
                const data = await getInfoCardsByServiceId(playload.serviceId);
                const content:InfoCard[] = data.content;
                return content;
            }
            else return [];
        },
        ...options
    })
    return query;
}

