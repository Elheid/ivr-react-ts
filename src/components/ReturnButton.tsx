import {  useNavigate } from "react-router-dom";

import arrowLeftSVG from "../assets/img/arrow-left-white.svg";
import { Button } from "@mui/material";
import { myFunctionWithDelay } from "../utill";


interface ReturnButtonComponentProps {
    img?: string;
    description?:string;
    onClick?: () => void;
}

const ReturnButtonComponent = ({img, description}: ReturnButtonComponentProps) => {
    //const arrowImg = arrowLeftSVG;
    return (
        <div>
            <img src={img} alt="Кнопка назад" />
            <span className="button-title back-title">{description}</span>
        </div>
    );
}



const LinkReturnButtonComponent = ({img = arrowLeftSVG, description = "Назад", onClick} : ReturnButtonComponentProps) => {
    const navigate = useNavigate(); // Используем useNavigate для программной навигации
    //const location = useLocation(); // Получаем текущий путь
/*
    let destination = "/";
    const location = useLocation();
    if (location.pathname === '/services') {
        if (localStorage.getItem("language") === "gestural-language") destination = "/instruction"
    }*/
    const backClick = () => {
        //if (window.location.href.indexOf("services")>0 && window.location.search === '') navigate(destination)
        //else 
        myFunctionWithDelay(()=>navigate(-1), 260);
    }
    return (
        <Button
            variant="contained"
            className="return-button"
            sx={{
                textTransform: 'none',
                mr: "1.5vw;",
                fontWeight: "500",
            }}
            onClick={()=>{
                if (!onClick) backClick();
                else onClick();
            }}
        >
            <ReturnButtonComponent img={img} description={description} />
        </Button>
    );
}

export default LinkReturnButtonComponent;