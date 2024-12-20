import { Button, Card, Grid2 } from "@mui/material";
import { cardStyle, gridCardStyle } from "../styles/cards";
import { useShowAdminButtons } from "../contextProviders/ShowAdminButtonsProvider";

import clearStyles from "../components/pages/ServicesPage/ServiceCards/clearCard.module.css"

const AddCardComponent = ({size, buttonColorClass, addColor}:{size:number, buttonColorClass?:string, addColor?:string})=>{
    const { showAdminButtons }  = useShowAdminButtons();
    const cardType = localStorage.getItem("language") === "clear-language" ? clearStyles["clear-card"] : "";
    if(!buttonColorClass)
        buttonColorClass = "add-card-like-button";
    if(!addColor)
        addColor = "white";
    return (
        showAdminButtons &&
        <Grid2
            size={size}
            container
            className={`${cardType} ${buttonColorClass}`}
            sx={{...gridCardStyle, ...cardStyle, height:"inherit"}}
            >
            <Card sx={{width:"100%", height:"100%", borderRadius:"20px !important"}}  className={`${cardType} ${buttonColorClass} card-to-add`}>
                <Button  sx={{width:"100%", height:"100%", color:addColor, fontSize:"8vh"}}>
                    +
                </Button>
            </Card> 
        </Grid2>
    );
}

export default AddCardComponent;