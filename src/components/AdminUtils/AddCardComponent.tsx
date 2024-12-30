import { Button, Card, Grid2 } from "@mui/material";
import { cardStyle, gridCardStyle } from "../../styles/cards";
import { useShowAdminButtons } from "../../contextProviders/ShowAdminButtonsProvider";

import clearStyles from "../../components/pages/ServicesPage/ServiceCards/clearCard.module.css"
import { useEffect} from "react";

import { createPortal } from "react-dom";
import AdminModal from "./AdminModal.tsx/AdminModal";
import { usePageStateContext } from "../../contextProviders/PageState";
import { useCardFormModal } from "../../hooks/useAdminModalParams";

const AddCardComponent = ({size, buttonColorClass, addColor}:{size:number, buttonColorClass?:string, addColor?:string})=>{
    const { showAdminButtons }  = useShowAdminButtons();
    const cardTypeLang = localStorage.getItem("language") === "clear-language" ? clearStyles["clear-card"] : "";
    if(!buttonColorClass)
        buttonColorClass = "add-card-like-button";
    if(!addColor)
        addColor = "white";
    const {state } = usePageStateContext();

    const {
        openModal,
        cardInFormType,
        formType,
        onEditClick,
        handleCloseModal,
        parentCardId,
        cardId,
        curState,
        showCardTypeChange
    } = useCardFormModal("add");

    useEffect(() => {
        console.log("State changed:", state);
        curState.current = state;
    }, [state]);


    return (
        showAdminButtons &&
        <>
            <Grid2
            size={size}
            container
            className={`${cardTypeLang} ${buttonColorClass}`}
            sx={{...gridCardStyle, ...cardStyle, height:"inherit"}}
            >
            <Card 
            sx={{width:"100%", height:"100%", borderRadius:"20px !important"}}  
            className={`${cardTypeLang} ${buttonColorClass} card-to-add`}
            onClick={(e)=> onEditClick(e as unknown as MouseEvent)}
            >
                <Button sx={{width:"100%", height:"100%", color:addColor, fontSize:"8vh"}}>
                    +
                </Button>
            </Card> 
        </Grid2>
        {createPortal(
                                <AdminModal
                                    parentId={parentCardId}
                                    id={cardId}
                                    cardInFormType={cardInFormType}
                                    formType={formType}
                                    open={openModal}
                                    handleClose={(e) => handleCloseModal(e)}
                                    showCardTypeChange={showCardTypeChange.current}
                                    //handleSubmitModal={handleSubmitModal}
                                />
                                , document.body
            )}
        </>
    );
}

export default AddCardComponent;