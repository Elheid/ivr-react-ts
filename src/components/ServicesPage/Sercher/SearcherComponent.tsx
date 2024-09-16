import LinkReturnButtonComponent from "../../ReturnButton";
import styles from './searcher.module.css'
import searchSVG from "../../../assets/img/search.svg";
import TypeViewButtons from "./TypeViewButtonsComponent";
import GesturalSearchComponent from "./GesturalSearchComponent";
import ImageButton from "../../ImageButtonComponent";

import { useState } from "react";
import { useCards } from "../../../contextProviders/CardsProvider";
import { getServiceByTitle } from "../../../api/backendApi";
import { navigateHandleClick } from "../../../utill";
import { useNavigate } from "react-router-dom";


const SearhComponent = ()=>{
    const [inputValue, setInputValue] = useState('');
    const { setCategories ,setServices } = useCards();
    const navigate = useNavigate();
    const searchImg = searchSVG//`${process.env.PUBLIC_URL}img/search.svg`;

    const searchAndShowResults = (query: string)=>{
        if (query === "") {
            return;
        }
        try {
            navigateHandleClick(`query=${query}`, navigate);
            /*getServiceByTitle(query)
            .then((data) => {
                navigateHandleClick(`query=${query}`, navigate);
                setCategories([]);
                console.log("Категории очищены")
                console.log("Servieces", data.content)
                setServices(data.content);
                console.log("Услуги пришли и вставлены: ", data.content)
            })
            .catch((err) => {
                throw new Error(err);
            });*/
        } catch (error) {
            console.log(error);
            alert("Проблема с работой поиска :(")
        }
    }
    const handleSearch = async ( query: string) => {
        await searchAndShowResults(query);
    };

    return(
        <div className={styles["searcher"]}>
        <input 
        className={styles["search-input"]} 
        type="search" name="query" 
        placeholder="Поиск" 
        wfd-id="id0"  
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        />
        <ImageButton className={styles["search-button"]} type="submit" onClick={()=> handleSearch(inputValue)}>
            <img src={searchImg} alt="Кнопка поиска" />
        </ImageButton>
    </div>
    );
}

const SearcherComponent = () => {
    return (
        <section className={styles["search-and-buttons"]}>
            <div className={styles["buttons-area"]}>
            <LinkReturnButtonComponent />
                <SearhComponent />
                {(localStorage.getItem("language") === "gestural-language") && <GesturalSearchComponent />}
            </div>
            {(localStorage.getItem("language") === "gestural-language") && <TypeViewButtons />}
        </section>
    );
}

export default SearcherComponent;