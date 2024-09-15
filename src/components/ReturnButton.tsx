import { Link, useLocation } from "react-router-dom";

import arrowLeftSVG from "../assets/img/arrow-left-white.svg";
import { Button } from "@mui/material";


interface ReturnButtonComponentProps {
    destination: string;
}

const ReturnButtonComponent = ({destination}:ReturnButtonComponentProps)=>{
    const arrowImg = arrowLeftSVG;
    return(
        <Link to={destination}>
        <img src={arrowImg} alt="Кнопка назад" />
        <span className="button-title back-title">Назад</span>
        </Link>
    );
}



const LinkReturnButtonComponent = ()=>{
    let destination = "/";
    const location = useLocation();
    if (location.pathname === '/services'){
        if (localStorage.getItem("language") === "gestural-language") destination = "/instruction"
    }
    return (
        <Button 
        variant="contained" 
        className="return-button"
        sx={{ 
            textTransform: 'none',
            mr:"1.5vw;",
            fontWeight: "500",
        }}
        >
            <ReturnButtonComponent destination={destination}/>    
        </Button>
    );
}

export default LinkReturnButtonComponent;