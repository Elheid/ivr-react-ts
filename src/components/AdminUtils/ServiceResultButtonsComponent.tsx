import { Button } from "@mui/material"
import { forwardRef, useState } from "react";
import { useShowAdminButtons } from "../../contextProviders/ShowAdminButtonsProvider";
import { CardType, FormType } from "../../contextProviders/formTypeProvider";
import AdminModal from "./AdminModal.tsx/AdminModal";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";


// Компонент ServiceResultButtonsComponent с поддержкой универсального рефа
interface ServiceResultButtonsComponentProps {
    extendedClass?:string;
}

const ServiceResultButtonsComponent = forwardRef<HTMLElement, ServiceResultButtonsComponentProps>(
    ({extendedClass}, ref) => {
    const {showAdminButtons} = useShowAdminButtons();

    const [cardInFormType, setCardInFormType] = useState<CardType>(CardType.SERVICE); // Состояние для типа карточки
    const [formType, setFormType] = useState<FormType>(FormType.EDIT); // Состояние для типа формы

    const [openModal, setOpenModal] = useState(false);

    const [id, setId] = useState(-1);

    const { serviceId } = useParams<{ serviceId?: string }>();

    /*const handleInfoCardOpen = (event: Event) => {
        const customEvent = event as CustomEvent<{ id: number }>;
        //console.log("Card ID received: ", customEvent.detail.id);
        setId(customEvent.detail.id);
    };
    useEffect(()=>{
        window.addEventListener('infoCardOpen', handleInfoCardOpen);
        return () => {
            window.removeEventListener('infoCardOpen', handleInfoCardOpen);
        };
    })*/


    const handleClick = () => {
        setOpenModal(true);
        if (ref && typeof ref === "object" && ref !== null && "current" in ref) {
            const element = ref.current;
            setId(Number(serviceId))
            if (extendedClass){
                setCardInFormType(CardType.ADDITIONAL_INFO);
            }

            if (element instanceof HTMLElement) {

                if (element instanceof HTMLHeadingElement) {
                    setFormType(FormType.TITLE);
                }
                else if ( element instanceof HTMLPreElement){
                    //alert(`Редактировать PRE элемент: ${element.innerHTML}`);
                    setFormType(FormType.TEXT);
                }
                // Для видео-элементов
                else if (element instanceof HTMLVideoElement) {
                    //alert(`Редактировать элемент: видео, src = ${element.src}`);
                    setFormType(FormType.VIDEO);
                }

                //alert(`Редактировать ${formType} элемент в ${cardInFormType}`);
            }
        }
    };


    const handleCloseModal = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenModal(false); // Закрываем модалку
    };

    /*const handleSubmitModal = (event: React.FormEvent<HTMLFormElement>) => {
        //event.preventDefault();
        event.stopPropagation();
        setOpenModal(false); // Закрываем модалку
        //console.log(event.currentTarget)
    };*/

    if (showAdminButtons){
        return (
            <>
                        <Button
                variant="contained"
                style={{ maxWidth: "10vw", margin: "10px" }}
                className={`extended-button ${extendedClass}`}
                onClick={handleClick}
            >
                Редактировать
            </Button>

        {createPortal(<AdminModal
            parentId={-1}
            id={id}
            cardInFormType={cardInFormType}
            formType={formType}
            open={openModal}
            handleClose={(e: Event) => handleCloseModal(e)}
            //handleSubmitModal={handleSubmitModal}
        />, document.body)}

            </>
        );
    }
    else return false;
});

ServiceResultButtonsComponent.displayName = "ServiceResultButtonsComponent";

export default ServiceResultButtonsComponent;
