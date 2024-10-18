import LinkButtonComponent from "../../../ReturnButton";
import styles from './searcher.module.css'
import searchSVG from "../../../../assets/img/search.svg";
import TypeViewButtons from "./TypeViewButtonsComponent";
import GesturalSearchComponent from "./GesturalSearchComponent";
import ImageButton from "../../../ImageButtonComponent";

import {  useState } from "react";
//import { useCards } from "../../../contextProviders/CardsProvider";
//import { getServiceByTitle } from "../../../api/backendApi";
import { navigateHandleClick } from "../../../../utill";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useSearchInput } from "../../../../contextProviders/SearchInputProvider";
import GesturalSearchModal from "./GesturalSearchModal";

const searchAndShowResults = (query: string, navigate: NavigateFunction) => {
    if (query === "") {
        return;
    }
    try {
        navigateHandleClick(true, `?query=${query}`, navigate);
    } catch (error) {
        console.log(error);
        alert("Проблема с работой поиска :(")
    }
}
const handleSearch = async (query: string, navigate: NavigateFunction) => {
    await searchAndShowResults(query, navigate);
};


const SearchButton = ({ classes = "" }: { classes?: string }) => {
    const { inputValue } = useSearchInput();
    const navigate = useNavigate();
    const searchImg = searchSVG//`${process.env.PUBLIC_URL}img/search.svg`;

    const classNames = `${styles["search-button"]}  ${classes}`


    return (
        <ImageButton className={classNames} type="submit" onClick={() => handleSearch(inputValue, navigate)}>
            <img src={searchImg} alt="Кнопка поиска" />
        </ImageButton>
    );
}

const SearhComponent = () => {
    const { inputValue, setInputValue } = useSearchInput();
    return (
        <div className={styles["searcher"]}>
            <input
                className={styles["search-input"]}
                type="search" name="query"
                placeholder="Поиск"
                wfd-id="id0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <SearchButton />
        </div>
    );
}

const SearcherComponent = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    /*const { inputValue, setInputValue } = useSearchInput();
    
    const [searchParams] = useSearchParams();
    const queryValue = searchParams.get('query');
    const inputFromUrl = ((inputValue === "" && queryValue && queryValue !== "") ? queryValue : inputValue);

    useEffect(()=>{
        console.log("Верни наполнение инпута!! " + inputFromUrl)
        setInputValue(inputFromUrl);
    },[])*/



    return (
        <>
            <section className={styles["search-and-buttons"]}>
                <div className={styles["buttons-area"]}>
                    <LinkButtonComponent />
                    <SearhComponent />
                    {(localStorage.getItem("language") === "gestural-language") && <GesturalSearchComponent onClick={handleOpen} />}
                </div>
                {(localStorage.getItem("language") === "gestural-language") && <TypeViewButtons />}
            </section>
            <GesturalSearchModal open={open} setOpen={setOpen} handleSearch={handleSearch}/>
        </>
    );
}

export default SearcherComponent;