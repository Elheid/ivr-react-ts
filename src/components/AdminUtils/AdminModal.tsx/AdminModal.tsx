
import { useEffect, useRef, useState } from "react";
import { CardType, FormType } from "../../../contextProviders/formTypeProvider";
import AdminFormPanel from "./AdminFormPanel";
import { Box, Container, Modal } from "@mui/material";



const AdminModal = ({
    cardInFormType,
    formType,
    open,
    handleClose,
    //handleSubmitModal,
    id,
    parentId,
    showCardTypeChange
}: {
    cardInFormType: CardType;
    formType: FormType;
    open: boolean;
    handleClose: (event: Event) => void;
    //handleSubmitModal: (event: Parameters <SubmitHandler<FormValues>> [1], data?:FormValues)=>void, //(event:React.FormEvent<HTMLFormElement>) => void,
    showCardTypeChange:boolean,
    id:number,
    parentId?:number,
}) => {
    const modalRef = useRef<HTMLDivElement>(null)

    const handleContainerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        return;
    };

    const [cardType, setCardType] = useState<CardType>(cardInFormType);

    useEffect(()=>{
        setCardType(cardInFormType)
    },[cardInFormType])

    const handleChangeCardType = ()=>{
        if (cardType === CardType.SERVICE)
            setCardType(CardType.SUB_CATEGORY);
        else if (cardType === CardType.SUB_CATEGORY) setCardType(CardType.SERVICE);
    }


    return (
        <Container 
        onClick={handleContainerClick}
        className="container-of-modal"
        onMouseDown={(e)=>{
            if (modalRef.current && !modalRef.current.contains(e.target as Node) ) {
                if (
                    e.target instanceof HTMLElement &&
                    (e.target.className.includes('MuiModal-backdrop') || e.target.className.includes('MuiMenuItem-root'))
                ) {
                    return;
                }
                handleClose(e as unknown as Event); // Закрываем модалку, если клик вне
            }
        }}>
            <Modal
                ref={modalRef}
                onClick={handleContainerClick}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box 
                onClick={handleContainerClick}
                sx={{
                    width: "fit-content;",
                    margin: "0 auto;",
                }}
                
                > 
                    <AdminFormPanel 
                        parentId={parentId}
                        id={id}
                        openModal={open}
                        cardInFormType={cardType} 
                        formType={formType} 
                        modalClose={handleClose} 
                        handleChangeCardType={handleChangeCardType}
                        showCardTypeChange={showCardTypeChange}
                        //handleSubmitModal={handleSubmitModal} 
                    />
                </Box>
            </Modal>
        </Container>
    );
};

export default AdminModal;