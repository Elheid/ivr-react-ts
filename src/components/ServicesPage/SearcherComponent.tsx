import LinkReturnButtonComponent from "../ReturnButton";
import twoInRowSVG from "../../img/twoInRow.svg";
import oneInRowSVG from "../../img/oneInRow.svg";

import recordSVG from "../../img/record.svg";
import searchSVG from "../../img/search.svg";

import styles from './searcher.module.css'

const TypeViewButtons = () => {
    const oneInRowImg = oneInRowSVG//`${process.env.PUBLIC_URL}img/twoInRow.svg`;
    const twoInRowImg = twoInRowSVG//`${process.env.PUBLIC_URL}img/oneInRow.svg`;
    return (
        <div className={styles["view-buttons"]}>
            <button className="two-in-row" type="button">
                <img src={twoInRowImg} alt="Кнопка 2 в ряд" />
            </button>
            <button className={styles["one-in-row"]} type="button">
                <img src={oneInRowImg} alt="Кнопка 1 в ряд" />
            </button>
        </div>
    );
}

const GesturalSearchComponent = () => {
    const recordImg = recordSVG//`${process.env.PUBLIC_URL}img/record.svg`;
    return (
        <button id="showPopup" className={`${styles["showPopup"]} hidden`} type="button" >
            <span className={"button-title"}>Поиск по РЖЯ</span>
            <img src={recordImg} alt="Кнопка поиска жестами" />
        </button>
    );
}

const SearhComponent = ()=>{
    const searchImg = searchSVG//`${process.env.PUBLIC_URL}img/search.svg`;
    return(
        <div className={styles["searcher"]}>
        <input className={styles["search-input"]} type="search" name="query" placeholder="Поиск" wfd-id="id0" />
        <button className={styles["search-button"]} type="submit">
            <img src={searchImg} alt="Кнопка поиска" />
        </button>
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