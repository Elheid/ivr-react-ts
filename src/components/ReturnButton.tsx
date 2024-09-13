import { Link, useLocation } from "react-router-dom";

import arrowLeftSVG from "../img/arrow-left-white.svg";


const ReturnButtonComponent = ()=>{
    const arrowImg = arrowLeftSVG;
    return(
        <button className="return-button">
        <img src={arrowImg} alt="Кнопка назад" />
        <span className="button-title back-title">Назад</span>
        </button>
    );
}

const LinkReturnButtonComponent = ()=>{
    let destination = "/";
    const location = useLocation();
    if (location.pathname === '/services'){
        if (localStorage.getItem("language") === "gestural-language") destination = "/instruction"
    }
    return (
        <Link to={destination}>
            <ReturnButtonComponent/>    
        </Link>
    );
}

export default LinkReturnButtonComponent;