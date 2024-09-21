import { Button, Card, Grid2, Typography } from "@mui/material";
import { InfoCard } from "../../../interfaces/CardsInterfaces"//"../../../../../interfaces/CardsInterfaces";
import VideoComponent from "../../VideoComponent"//"../../../VideoComponent";
//import { useLoadContext } from "../../../contextProviders/LoadMediaProvider";


type InfoCardProps = Omit<InfoCard, "additionIds" | "description" | "gifLink" | "iconLinks">;

type InfoCardMediaProps = Omit<InfoCardProps, "additionIds" | "description" | "gifLink" | "iconLinks" | "itemId" | "id" | "title">;

const InfoCardButtonMedia = ({ gifPreview, mainIconLink}: InfoCardMediaProps) => {
    return (
        localStorage.getItem("language") === "clear-language"
        ? <img src={mainIconLink} title="infoCardIcon"/>
        : <VideoComponent gifSrc={gifPreview} />
    );
}

const gridCardStyle = {
    display: 'flex',
    flexDirection: 'column',

    borderRadius: "20px",
    gridAutoRows: '1fr',
    height: "inherit"
};

interface InfoCardPropsNew extends  InfoCardProps{
    hideOnClick: () => void; 
}

const InfoCardComponent = (props : InfoCardPropsNew)=>{
    const cardType = localStorage.getItem("language") === "clear-language" ? "clear-card" : "";
    return (
        <Grid2 size={6} className={cardType} sx={gridCardStyle}>
            <Card className={"info-card"} 
            info-id={props.id}
            item-id={props.itemId}
            >
                <Button
                sx={{
                    textTransform: 'none',
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    lineHeight: "normal",
                    display: "inline-block",
                    width:"inherit"
                }}
                data-gifsrc={props.gifPreview}
                data-iconsrc={props.mainIconLink}
                onClick={props.hideOnClick}
            >
                <InfoCardButtonMedia mainIconLink={props.mainIconLink} gifPreview={props.gifPreview}/>
                <div className="info-title-container">
                    <Typography className="card-title card-description" variant="h5" gutterBottom>{props.title}</Typography>
                </div>
            </Button>
            </Card>
        </Grid2>
    );
}

export default InfoCardComponent;