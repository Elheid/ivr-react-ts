import trash from "../../assets/img/trash.svg"
import edit from "../../assets/img/edit.svg"
import { Button, Container } from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import { useShowAdminButtons } from "../../contextProviders/ShowAdminButtonsProvider";
import AdminModal from "./AdminModal.tsx/AdminModal";
import { CardType, FormType } from "../../contextProviders/formTypeProvider";


const AdminButton = ({ img, classes, handleClick }: { img: string, classes?: string, handleClick: (e: MouseEvent) => void }) => {
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

    const classificateFormByEl = (parentElement: HTMLElement, element: HTMLDivElement)=>{
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
    }

    const determineCardAndFormType = (element: HTMLDivElement) => {
        //const parentElement = element.parentNode as HTMLElement;

        // Определение cardInFormType в зависимости от классов
        //classificateFormByEl(parentElement, element)


        // Определение formType
        if (ref && typeof ref === "object" && ref !== null && "current" in ref){
            const parentRefEl = ref.current ? ref.current.parentNode as HTMLElement : new HTMLDivElement;
            classificateFormByEl(parentRefEl, element)
        }
        if (element.classList.contains("card-to-add")) {
            setFormType(FormType.CREATE);
        } else {
            setFormType(FormType.EDIT);
        }
    };

    const onEditClick = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setOpenModal(true);

        let element:HTMLDivElement;
        const target = e.currentTarget;
        if (target instanceof HTMLDivElement && target.tagName.toLowerCase() === 'div' && target.classList.contains('card-to-add')){
            element = target;
            determineCardAndFormType(element);
        }
        else if (ref && typeof ref === "object" && ref !== null && "current" in ref) {
            element = ref.current ? ref.current : new HTMLDivElement;
            determineCardAndFormType(element);
            //alert("Редактировать: " + element?.getAttribute("data-title"))
        }
    }
    const onDeleteClick = (e: MouseEvent) => {
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

    const handleSubmitModal = (event: React.FormEvent<HTMLFormElement>) => {
        //event.preventDefault();
        event.stopPropagation();
        setOpenModal(false); // Закрываем модалку
        //console.log(event.currentTarget)
    };

    useEffect(() => {
        if (showAdminButtons) {
            const cardAdd = document.querySelector(".card-to-add");


            if (cardAdd) {
                // Убедимся, что не добавляем несколько обработчиков
                (cardAdd as HTMLButtonElement).onclick = null;
                (cardAdd as HTMLButtonElement).onclick = onEditClick;  // Убираем предыдущие обработчики
                //cardAdd.addEventListener("click", onEditClick);    // Добавляем новый обработчик
            }

            // Очистка обработчика при размонтировании компонента или изменении showAdminButtons
            return () => {
                if (cardAdd) {
                    (cardAdd as HTMLButtonElement).onclick = null;
                    //cardAdd.removeEventListener("click", onEditClick);
                }
            };
        }
    }, [showAdminButtons, onEditClick, ref, setOpenModal]);

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
                    handleClose={(e: React.MouseEvent) => handleCloseModal(e)}
                    handleSubmitModal={(e) => handleSubmitModal(e)}
                />}
            </>

        )
    }
    else return false;
})

export default AdminButtonsComponent;