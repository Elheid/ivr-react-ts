import trash from "../../assets/img/trash.svg"
import edit from "../../assets/img/edit.svg"
import { Button, Container } from "@mui/material";
import { forwardRef } from "react";
import { useShowAdminButtons } from "../../contextProviders/ShowAdminButtonsProvider";
import AdminModal from "./AdminModal.tsx/AdminModal";
import { useCardFormModal } from "../../hooks/useAdminModalParams";
import { createPortal } from "react-dom";


const AdminButton = ({ img, classes, handleClick }: { img: string, classes?: string, handleClick: (e:MouseEvent) => void }) => {
    return (
        <Button
            className={`extended-button ${classes}`}
            onClick={(e) => handleClick(e as unknown as MouseEvent)}
        >
            <img src={img} />
        </Button>
    )
}



const AdminButtonsComponent = forwardRef<HTMLDivElement, unknown>((_, ref) => {
    const { showAdminButtons } = useShowAdminButtons();

    const {
        openModal,
        cardInFormType,
        formType,
        onEditClick,
        handleCloseModal,
        parentCardId,
        cardId,
        onDeleteClick
    } = useCardFormModal("edit", ref);

    const isClearLang = localStorage.getItem("language") === "clear-language";
    const position = isClearLang ? { position: "relative;" } : { position: "absolute;" };

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

                {createPortal (<AdminModal
                    parentId={parentCardId}
                    id={cardId}
                    cardInFormType={cardInFormType}
                    formType={formType}
                    open={openModal}
                    handleClose={(e) => handleCloseModal(e)}
                    showCardTypeChange={false}
                    //handleSubmitModal={handleSubmitModal}
                />, document.body)}
            </>

        )
    }
    else return false;
})

export default AdminButtonsComponent;