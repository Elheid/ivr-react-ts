import { Button, Card, Grid2 } from "@mui/material";
import { cardStyle, gridCardStyle } from "../styles/cards";
import { useShowAdminButtons } from "../contextProviders/ShowAdminButtonsProvider";

import clearStyles from "../components/pages/ServicesPage/ServiceCards/clearCard.module.css"

const AddCardComponent = ({size}:{size:number})=>{
    const { showAdminButtons }  = useShowAdminButtons();
    const cardType = localStorage.getItem("language") === "clear-language" ? clearStyles["clear-card"] : "";

    return (
        showAdminButtons &&
        <Grid2
            size={size}
            container
            className={`${cardType} add-card`}
            sx={{...gridCardStyle, ...cardStyle, height:"inherit"}}
            >
            <Card sx={{width:"100%", height:"100%", borderRadius:"20px !important"}}  className={`${cardType} card-to-add`}>
                <Button  sx={{width:"100%", height:"100%", color:"white", fontSize:"8vh"}}>
                    +
                </Button>
            </Card> 
        </Grid2>
    );
}

export default AddCardComponent;