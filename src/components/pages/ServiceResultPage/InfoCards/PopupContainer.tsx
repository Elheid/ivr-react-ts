import { Box, Container, Grid2, IconButton, Modal, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import infoButton from "../../../../assets/img/info.svg"
import ImageButton from "../../../ImageButtonComponent";
import InfoCardComponent from "./InfoCardComponent";
import { InfoCard } from "../../../../interfaces/CardsInterfaces";
import LinkButtonComponent from "../../../ReturnButton";
import Scrollbar from "../../../ScrollBar/ScrollBar";
import InfoCardResultComponent from "./InfoCardResultComponent";
import ModalStyle from "../../../../styles/modalStyle";
import { useParams } from "react-router-dom";
import { useInfoCardsQuery } from "../../../../hooks/useCardsQuery";
import LoadingCompanent from "../../../LoadingComponent";
import { isAdmin } from "../../../../utill";
import ServiceResultButtonsComponent from "../../../AdminUtils/ServiceResultButtonsComponent";
import AddCardComponent from "../../../AdminUtils/AddCardComponent";
import { usePageStateContext } from "../../../../contextProviders/pageState";
import { useShowAdminButtons } from "../../../../contextProviders/ShowAdminButtonsProvider";

/*
const infoCard: InfoCard = {
    description: "\n- Нет госпошлины.\n\\icon0\n- Срок выполнения государственной услуги начинается после принятия местным отделением МВД необходимых документов и составляет:\n*при предоставлении правоустанавливающего документа - 1 рабочий день\n*при непредъявлении правоустанавливающего документа - 6 рабочих дней\n\\icon1",
    gifLink: "https://storage.yandexcloud.net/akhidov-ivr/19.mp4",
    gifPreview: "https://storage.yandexcloud.net/akhidov-ivr/18.mp4",
    iconLinks: ["https://storage.yandexcloud.net/akhidov-ivr/icon18.svg", "https://storage.yandexcloud.net/akhidov-ivr/icon18.svg"],
    id: 2,
    itemId: 14,
    mainIconLink: "https://storage.yandexcloud.net/akhidov-ivr/icon18.svg",
    title: "Дополнительная информация"
};*/

//const infoCardsSample = [infoCard, infoCard, infoCard]


const PopupContainer = React.memo(({ additionIds }: { additionIds: number[] }) => {
    const { showAdminButtons} = useShowAdminButtons();


    const [open, setOpen] = useState(false);
    const [infoCards, setInfoCards] = useState<InfoCard[]>([]);
    const [isHidden, setHidden] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<number>();
    const defaultTitle = "Дополнительная информация";
    const [title, setTitle] = useState(defaultTitle);

    const titleRef = useRef<HTMLSpanElement>(null);

    const { serviceId } = useParams<{ serviceId?: string }>();
    const serviceUrlId = serviceId ? Number(serviceId) : -1;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleHide = () => setHidden(true);
    const handleShow = () => setHidden(false);

    const {data: infoCardInfo, isLoading: isInfoLoading } = useInfoCardsQuery({serviceId:serviceUrlId});

    const {setState } = usePageStateContext();

    useEffect(() => {
        setState("info")
        if (open) {
            const fillInfoArray = async()=>{
                setInfoCards(infoCardInfo || []);
            }
            fillInfoArray();
            //console.log(additionIds)
        }
    }, [open]);

    useEffect(() => {
        if (!isHidden) {
            setTitle(defaultTitle)
        }
    }, [isHidden]);

    useEffect(() => {
        const handleInfoCardOpen = (event: Event) => {
            const customEvent = event as CustomEvent<{ id: number }>;
            //console.log("Card ID received: ", customEvent.detail.id);
            setSelectedCardId(customEvent.detail.id);
        };

        window.addEventListener('infoCardOpen', handleInfoCardOpen);

        return () => {
            window.removeEventListener('infoCardOpen', handleInfoCardOpen);
        };
    }, []);

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
                <Box sx={ModalStyle} className={"info-modal popup"}>
                    <div className="popup-header">
                        <Typography className="popup-title title" variant="h4" gutterBottom ref={titleRef}>{title}</Typography>
                        {isAdmin() && isHidden && <ServiceResultButtonsComponent extendedClass={"to-info-card"} ref={titleRef} />}
                        <IconButton className="close-info" id="closePopup" onClick={handleClose}>
                            &#x2716;
                        </IconButton>
                    </div>
                    <Scrollbar height="67vh" addArrowsButtons={false}>
                        {additionIds || showAdminButtons ?
                            <div className="popup-content">
                                <Grid2 className={`info-cards card-list list-of-cards ${isHidden && open ? "hidden" : ""}`} container rowSpacing={6} columnSpacing={{ xs: 6, sm: 6, md: 6 }}>
                                    <AddCardComponent buttonColorClass="add-card-info" addColor="black" size={6}></AddCardComponent>
                                    {isInfoLoading ? <LoadingCompanent /> : infoCards.map((infoCard: InfoCard, index: number) => (
                                        <InfoCardComponent
                                            key={index} // Ensure unique key for each card
                                            itemId={infoCard.itemId}
                                            id={infoCard.id} // Assuming 'catalogId' exists in your data
                                            gifPreview={infoCard.gifPreview} // Assuming 'gifSrc' exists
                                            mainIconLink={infoCard.mainIconLink} // Assuming 'iconSrc' exists
                                            title={infoCard.title} // Assuming 'title' exists
                                            hideOnClick={() => {
                                                (handleHide());
                                            }}
                                        />
                                    ))}
                                </Grid2>
                                <div className={`additional-info-res ${!isHidden && open ? "hidden" : ""}`}>
                                    <Container>
                                        <InfoCardResultComponent setTitle={setTitle} id={selectedCardId} />
                                        
                                    </Container>
                                </div>
                                <LinkButtonComponent classes={`return-button bottom-button ${!isHidden && open ? "hidden" : ""}`} onClick={handleShow} />
                            </div>
                            
                        :
                        <Typography variant="h4" gutterBottom>Дополнительной информации нет</Typography>
                        }
                    </Scrollbar>
                </Box>

            </Modal>
        </div>
    );
})
export default PopupContainer;
//export default PopupContainer;