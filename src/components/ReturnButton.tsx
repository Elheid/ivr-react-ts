import {  useNavigate } from "react-router-dom";

import arrowLeftSVG from "../assets/img/arrow-left-white.svg";
import { Button } from "@mui/material";
import { myFunctionWithDelay } from "../utill";


interface ReturnButtonComponentProps {
    img?: string;
    description?:string;
    classes?:string;
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



const LinkButtonComponent = ({img = arrowLeftSVG, description = "Назад", classes = "return-button", onClick} : ReturnButtonComponentProps) => {
    const navigate = useNavigate();
    const destination = "/";
    //const location = useLocation(); // Получаем текущий путь
/*
    let destination = "/";
    const location = useLocation();
    if (location.pathname === '/services') {
        if (localStorage.getItem("language") === "gestural-language") destination = "/instruction"
    }*/
    const backClick = () => {
        const baseUrl = 'http://localhost:5173/services';
        if (window.location.href === baseUrl && window.location.search === '') navigate(destination)
        else myFunctionWithDelay(()=>navigate(-1), 1);
    }
    return (
        <Button
            variant="contained"
            className={classes}
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

export default LinkButtonComponent;