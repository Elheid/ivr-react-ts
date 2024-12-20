import { Button, Card, Grid2, Typography } from "@mui/material";
import { InfoCard } from "../../../../interfaces/CardsInterfaces";
import VideoComponent from "../../../VideoComponent";
import { isAdmin, tryJsonParse } from "../../../../utill";
import AdminButtonsComponent from "../../../AdminUtils/AdminButtonsComponent";
import { useRef } from "react";
import styled from "@emotion/styled";
//import { useLoadContext } from "../../../contextProviders/LoadMediaProvider";


type InfoCardProps = Omit<InfoCard, "additionIds" | "description" | "gifLink" | "iconLinks">;

type InfoCardMediaProps = Omit<InfoCardProps, "additionIds" | "description" | "gifLink" | "iconLinks" | "itemId" | "id" | "title">;

const InfoCardButtonMedia = ({ gifPreview, mainIconLink }: InfoCardMediaProps) => {
    return (
        localStorage.getItem("language") === "clear-language"
            ? <img className={"info-icon"}src={mainIconLink} title="infoCardIcon" />
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

interface InfoCardPropsNew extends InfoCardProps {
    hideOnClick: () => void;
}

const CardWithRef = styled(Card)``;

const InfoCardComponent = (props: InfoCardPropsNew) => {
    const cardType = localStorage.getItem("language") === "clear-language" ? "clear-card" : "";
    const handleCardClick = () => {
        const infoCardOpenEvent = new CustomEvent('infoCardOpen', {
            detail: { id: props.id }
        });

        window.dispatchEvent(infoCardOpenEvent); // Диспетчеризация события
    };

    const infoCardRef = useRef(null);

    const title = tryJsonParse(props.title,"title")
    const icon = tryJsonParse(props.mainIconLink,"image")
    const video = tryJsonParse(props.gifPreview,"video")

    return (
        <Grid2 size={6} className={cardType + " info-card"} sx={gridCardStyle}>
            <CardWithRef className={"info-card"}
                info-id={props.id}
                item-id={props.itemId}
                data-title={title}
                data-gifsrc={video}
                data-iconsrc={icon}
                onClick={handleCardClick}
                ref={infoCardRef}
            >
                {isAdmin() && <AdminButtonsComponent ref={infoCardRef}/>}
                <Button
                    sx={{
                        textTransform: 'none',
                        fontWeight: "400",
                        fontSize: "0.875rem",
                        lineHeight: "normal",
                        display: "inline-block",
                        width: "inherit",
                        height: "inherit"
                    }}
                    onClick={props.hideOnClick}
                >
                    <InfoCardButtonMedia mainIconLink={icon} gifPreview={video} />
                    <div className="info-title-container">
                        <Typography className="card-title card-description" variant="h5" gutterBottom>{title}</Typography>
                    </div>
                </Button>
            </CardWithRef>
        </Grid2>
    );
}

export default InfoCardComponent;