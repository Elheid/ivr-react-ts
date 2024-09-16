import { Link, useLocation, useNavigate } from "react-router-dom";

import arrowLeftSVG from "../assets/img/arrow-left-white.svg";
import { Button } from "@mui/material";
import { myFunctionWithDelay } from "../utill";


interface ReturnButtonComponentProps {
    destination: string;
}

const ReturnButtonComponent = (/*{destination}:ReturnButtonComponentProps*/) => {
    const arrowImg = arrowLeftSVG;
    return (
        <div>
            <img src={arrowImg} alt="Кнопка назад" />
            <span className="button-title back-title">Назад</span>
        </div>
    );
}



const LinkReturnButtonComponent = () => {
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
            onClick={backClick}
        >
            <ReturnButtonComponent /*destination={destination}*/ />
        </Button>
    );
}

export default LinkReturnButtonComponent;