import trash from "../../assets/img/trash.svg"
import edit from "../../assets/img/edit.svg"
import { Button, Container } from "@mui/material";
import React, { forwardRef, useState } from "react";
import { useShowAdminButtons } from "../../contextProviders/ShowAdminButtonsProvider";
import AdminModal from "./AdminModal.tsx/AdminModal";
import { CardType, FormType } from "../../contextProviders/formTypeProvider";


const AdminButton = ({ img, classes, handleClick }: { img: string, classes?: string, handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) => {
    return (
        <Button
            className={`extended-button ${classes}`}
            onClick={(e) => handleClick(e)}
        >
            <img src={img} />
        </Button>
    )
}

const AdminButtonsComponent = forwardRef<HTMLDivElement, unknown>((_, ref) => {
    const { showAdminButtons } = useShowAdminButtons();
    const [openModal, setOpenModal] = useState(false);


    const [cardInFormType, setCardInFormType] = useState<CardType>(CardType.CATEGORY); // Состояние для типа карточки
    const [formType, setFormType] = useState<FormType>(FormType.CREATE); // Состояние для типа формы

    const [cardId, setCardId] = useState<number>(-1);
    const [parentCardId, setParentCardId] = useState<number>(-1);


    const isClearLang = localStorage.getItem("language") === "clear-language";
    const position = isClearLang ? { position: "relative;" } : { position: "absolute;" };

    const determineCardAndFormType = (element: HTMLDivElement) => {
        const parentElement = element.parentNode as HTMLElement;

        // Определение cardInFormType в зависимости от классов
        if (parentElement.classList.contains("catalog-card")) {
            const id = element.dataset.id;
            setCardId(Number(id) || -1);
            setParentCardId(-1);
            setCardInFormType(CardType.CATEGORY);
        } else if (parentElement.classList.contains("service-card")) {
            const id = element.dataset.id;
            const parentId = parentElement.getAttribute("parent-catalog-id");
            setParentCardId(Number(parentId) || -1);
            setCardId(Number(id) || -1);
            setCardInFormType(CardType.SERVICE);
        } else if (parentElement.classList.contains("sub-catalog-card")) {
            //const parentOfParent = parentElement.parentNode as HTMLElement
            const parentId = parentElement.getAttribute("parent-id");
            setParentCardId(Number(parentId) || -1);
            const id = element.dataset.id;
            setCardId(Number(id) || -1);
            setCardInFormType(CardType.SUB_CATEGORY);
        } else if (parentElement.classList.contains("info-card")) {
            const id = element.getAttribute("info-id");
            const parentId = element.getAttribute("item-id");
            setCardId(Number(id) || -1);
            setParentCardId(Number(parentId) || -1);
            setCardInFormType(CardType.ADDITIONAL_INFO);
        }

        // Определение formType
        if (parentElement.classList.contains("card-to-add")) {
            setFormType(FormType.CREATE);
        } else {
            setFormType(FormType.EDIT);
        }
    };

    const onEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setOpenModal(true);
        
        if (ref && typeof ref === "object" && ref !== null && "current" in ref) {
            const element = ref.current ? ref.current : new HTMLDivElement;
            determineCardAndFormType(element);
            //alert("Редактировать: " + element?.getAttribute("data-title"))
        }
    }
    const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (ref && typeof ref === "object" && ref !== null && "current" in ref) {
            const element = ref.current;
            alert("Удалить: " + element?.getAttribute("data-title"))
        }
    }
    const handleCloseModal = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenModal(false); // Закрываем модалку
    };

    const handleSubmitModal = (event:React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenModal(false); // Закрываем модалку
        
    };




    if (showAdminButtons) {
        return (
            <>
                <Container
                    sx={position}
                    className="extended-container"
                >
                    <AdminButton img={edit} classes={"edit-button"} handleClick={onEditClick} />
                    <AdminButton img={trash} classes={"delete-button"} handleClick={onDeleteClick} />
                </Container>

                {openModal && <AdminModal
                    parentId={parentCardId}
                    id={cardId}
                    cardInFormType={cardInFormType}
                    formType={formType}
                    open={openModal}
                    handleClose={(e: React.MouseEvent)=>handleCloseModal(e)}
                    handleSubmitModal={(e)=>handleSubmitModal(e)}
                />}
            </>
        )
    }
    else return false;
})

export default AdminButtonsComponent;