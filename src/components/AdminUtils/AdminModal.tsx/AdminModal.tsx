
import { useRef } from "react";
import { CardType, FormType } from "../../../contextProviders/formTypeProvider";
import AdminFormPanel from "./AdminFormPanel";
import { Box, Container, Modal } from "@mui/material";


const AdminModal = ({
    cardInFormType,
    formType,
    open,
    handleClose,
    handleSubmitModal,
}: {
    cardInFormType: CardType;
    formType: FormType;
    open: boolean;
    handleClose: (event: React.MouseEvent) => void;
    handleSubmitModal: (event:React.MouseEvent<HTMLButtonElement>) => void
}) => {
    const modalRef = useRef<HTMLDivElement>(null)

    const handleContainerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Проверяем, был ли клик вне модального окна
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            handleClose(e); // Закрываем модалку, если клик вне
        }
    };

    return (
        <Container 
        className="container-of-modal"
        onClick={handleContainerClick}>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box 
                sx={{
                    width: "fit-content;",
                    margin: "0 auto;",
                }}
                ref={modalRef}
                > 
                    <AdminFormPanel 
                        openModal={open}
                        cardInFormType={cardInFormType} 
                        formType={formType} 
                        modalClose={handleClose} 
                        handleSubmitModal={handleSubmitModal} 
                    />
                </Box>
            </Modal>
        </Container>
    );
};

export default AdminModal;