//import { getServiceByTitle } from "../api/backendApi";
//import { useCards } from "../contextProviders/CardsProvider";
//import {Category, Service} from "../interfaces/CardsInterfaces";
/*
const handleSearch = async ( query: string) => {
    if (query === "") {
        return;
    }
    try {
        await getServiceByTitle(query)
        .then((data) => {
            const { setServices } = useCards();
            setServices(data);
        })
        .catch((err) => {
            throw new Error(err);
        });
    } catch (error) {
        console.log(error);
        alert("Проблема с работой поиска :(")
    }
};*/
/*
const searchResult = (query: string) =>
    getServiceByTitle(query)
        .then((data) => {
            const { setServices } = useCards();
            setServices(data);
        })
        .catch((err) => {
            throw new Error(err);
        });
*/
/*const showSearchedServices = (data: Category[] | Service[], query: string) => {

    console.log(`По запросу ${query} найдено ${data}`);
}*/

export default handleSearch;