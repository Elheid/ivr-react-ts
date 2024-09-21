import { Box, Container, Grid2, IconButton, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import infoButton from "../../../assets/img/info.svg"
import ImageButton from "../../ImageButtonComponent"//"../../../ImageButtonComponent";
import InfoCardComponent from "./InfoCardComponent";
import { InfoCard } from "../../../interfaces/CardsInterfaces"//"../../../../interfaces/CardsInterfaces";
import LinkReturnButtonComponent from "../../ReturnButton"//"../../../ReturnButton";
import Scrollbar from "../../ScrollBar/ScrollBar"//"../../../ScrollBar/ScrollBar";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const infoCard: InfoCard = {
    description: "\n- Нет госпошлины.\n\\icon0\n- Срок выполнения государственной услуги начинается после принятия местным отделением МВД необходимых документов и составляет:\n*при предоставлении правоустанавливающего документа - 1 рабочий день\n*при непредъявлении правоустанавливающего документа - 6 рабочих дней\n\\icon1",
    gifLink: "https://storage.yandexcloud.net/akhidov-ivr/19.mp4",/*resVideo:  */
    gifPreview: "https://storage.yandexcloud.net/akhidov-ivr/18.mp4",/*video:  */
    iconLinks: [],
    id: 2,
    itemId: 14,
    mainIconLink: "https://storage.yandexcloud.net/akhidov-ivr/icon18.svg",/*image:  */
    title: "Дополнительная информация"
};

const infoCardsSample = [infoCard, infoCard, infoCard]


const PopupContainer = ({additionIds}:{additionIds:number[]}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [isHidden, setHidden] = React.useState(false);
    const handleHide = () => setHidden(true);
    const handleShow = () => setHidden(false);


    const [infoCards, setInfoCards] = useState<InfoCard[]>([]);

    console.log("addition info ids = ", additionIds)

    useEffect(() => {
        if (open) setInfoCards(infoCardsSample);
    }, [open]);

    return (
        <div className="modal-container">
            <ImageButton
                className="modal additional-info"
                id="showPopup"
                type="button"
                onClick={handleOpen}
            >
                <span className="infoButton-title">Дополнительная информация</span>
                <img title="Дополнительная информация" className="info-button hover" src={infoButton} />
            </ImageButton>
            <Modal
                open={open}
                onClose={() => {
                    handleClose();
                    handleShow();
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={"info-modal popup"}>
                    <div className="popup-header">
                        <Typography className="popup-title title" variant="h4" gutterBottom>Дополнительная информация</Typography>
                        <IconButton className="close-info" id="closePopup" onClick={handleClose}>
                            &#x2716;
                        </IconButton>
                    </div>
                    <Scrollbar height="47vh" addArrowsButtons={false}>
                    <div className="popup-content">
                        <Grid2   className={`info-cards list-of-cards ${isHidden && open ? "hidden" : ""}`} container rowSpacing={6} columnSpacing={{ xs: 6, sm: 6, md: 6 }}>
                            {infoCards.map((infoCard: InfoCard, index: number) => (
                                <InfoCardComponent
                                    key={index} // Ensure unique key for each card
                                    itemId={infoCard.itemId}
                                    id={infoCard.id} // Assuming 'catalogId' exists in your data
                                    gifPreview={infoCard.gifPreview} // Assuming 'gifSrc' exists
                                    mainIconLink={infoCard.mainIconLink} // Assuming 'iconSrc' exists
                                    title={infoCard.title} // Assuming 'title' exists
                                    hideOnClick={(handleHide)}
                                />
                            ))}
                        </Grid2>
                        <div className={`additional-info-res ${!isHidden && open ? "hidden" : ""}`}>
                            <Container>
                            <LinkReturnButtonComponent onClick={handleShow} />

                            </Container>
                        </div>
                    </div> 
                   </Scrollbar>
                </Box>

            </Modal>
        </div>
    );
}
export default PopupContainer;
//export default PopupContainer;