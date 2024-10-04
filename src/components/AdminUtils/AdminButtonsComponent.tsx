import trash from "../../assets/img/trash.svg"
import edit from "../../assets/img/edit.svg"
import { Button, Container } from "@mui/material";
import React, { forwardRef } from "react";


const AdminButton = ({img, classes, handleClick} : {img:string, classes?:string, handleClick: (e: React.MouseEvent) => void})=>{
    return (
        <Button 
        className={`extended-button ${classes}`}
        onClick={(e)=>handleClick(e)}
        >
            <img src={img} />
        </Button>
    )
}

const AdminButtonsComponent = forwardRef<HTMLDivElement, unknown>((_, ref) => {
    const isClearLang = localStorage.getItem("language") === "clear-language";
    const position = isClearLang ? {position:"relative;"}: {position:"absolute;"};
            const onEditClick =(e: React.MouseEvent)=>{
                e.stopPropagation();
                if (ref && typeof ref === "object" && ref !== null && "current" in ref) {
                    const element = ref.current;
                    alert("Редактировать: " + element?.getAttribute("data-title"))
                }
            }
            const onDeleteClick =(e: React.MouseEvent)=>{
                e.stopPropagation();
                if (ref && typeof ref === "object" && ref !== null && "current" in ref) {
                    const element = ref.current;
                    alert("Удалить: " + element?.getAttribute("data-title"))
                }
            }  

    return (
        <Container 
        sx={position}
        className="extended-container" 
        >
            <AdminButton img={trash} classes={"delete-button"} handleClick={onDeleteClick}/>
            <AdminButton img={edit} classes={"edit-button"} handleClick={onEditClick}/>
        </Container>
    )
})

export default AdminButtonsComponent;