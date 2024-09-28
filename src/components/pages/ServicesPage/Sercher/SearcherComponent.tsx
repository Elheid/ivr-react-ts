import LinkReturnButtonComponent from "../../../ReturnButton";
import styles from './searcher.module.css'
import searchSVG from "../../../../assets/img/search.svg";
import TypeViewButtons from "./TypeViewButtonsComponent";
import GesturalSearchComponent from "./GesturalSearchComponent";
import ImageButton from "../../../ImageButtonComponent";

import { useState } from "react";
//import { useCards } from "../../../contextProviders/CardsProvider";
//import { getServiceByTitle } from "../../../api/backendApi";
import { navigateHandleClick } from "../../../../utill";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import ModalStyle from "../../../../styles/modalStyle";


const SearhComponent = () => {
    const [inputValue, setInputValue] = useState('');
    // const { setCategories ,setServices } = useCards();
    const navigate = useNavigate();
    const searchImg = searchSVG//`${process.env.PUBLIC_URL}img/search.svg`;

    const searchAndShowResults = (query: string) => {
        if (query === "") {
            return;
        }
        try {
            navigateHandleClick(true, `?query=${query}`, navigate);
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
    const handleSearch = async (query: string) => {
        await searchAndShowResults(query);
    };

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
            <ImageButton className={styles["search-button"]} type="submit" onClick={() => handleSearch(inputValue)}>
                <img src={searchImg} alt="Кнопка поиска" />
            </ImageButton>
        </div>
    );
}

const SearcherComponent = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <section className={styles["search-and-buttons"]}>
                <div className={styles["buttons-area"]}>
                    <LinkReturnButtonComponent />
                    <SearhComponent />
                    {(localStorage.getItem("language") === "gestural-language") && <GesturalSearchComponent onClick={handleOpen} />}
                </div>
                {(localStorage.getItem("language") === "gestural-language") && <TypeViewButtons />}
            </section>
            <Modal
                open={open}
                onClose={() => {
                    handleClose();
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box 
                className={"search-modal popup"}
                sx={ModalStyle}
                >
                <div className="popup-header">
                        {/*<Typography className="popup-title title" variant="h4" gutterBottom>/Typography>*/}
                        <IconButton className="close-info" id="closePopup" onClick={handleClose}>
                            &#x2716;
                        </IconButton>
                </div>

                </Box>
            </Modal>

        </>
    );
}

export default SearcherComponent;