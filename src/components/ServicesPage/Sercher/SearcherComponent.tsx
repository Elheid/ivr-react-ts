import LinkReturnButtonComponent from "../../ReturnButton";
import styles from './searcher.module.css'
import searchSVG from "../../../assets/img/search.svg";
import TypeViewButtons from "./TypeViewButtonsComponent";
import GesturalSearchComponent from "./GesturalSearchComponent";
import ImageButton from "../../ImageButtonComponent";

import { useState } from "react";
import { useCards } from "../../../contextProviders/CardsProvider";
import { getServiceByTitle } from "../../../api/backendApi";


const SearhComponent = ()=>{
    const [inputValue, setInputValue] = useState('');
    const { setCategories ,setServices } = useCards();
    const searchImg = searchSVG//`${process.env.PUBLIC_URL}img/search.svg`;

    const handleSearch = async ( query: string) => {
        if (query === "") {
            return;
        }
        try {
            await getServiceByTitle(query)
            .then((data) => {
                setServices(data.content);
                setCategories([]);
            })
            .catch((err) => {
                throw new Error(err);
            });
        } catch (error) {
            console.log(error);
            alert("Проблема с работой поиска :(")
        }
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