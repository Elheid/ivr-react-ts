import BreadCrumpsComponent from "../../BreadCrumps";
import LinkButtonComponent from "../../ReturnButton";
import homeButton from "../../../assets/img/home.svg"
import { Container } from "@mui/material";
import ServiceResultButtonsComponent from "../../AdminUtils/ServiceResultButtonsComponent";
import { isAdmin } from "../../../utill";
import { useRef } from "react";

interface ServiceResultHeaderProps{
    title:string;
}
const ServiceResultHeader = ({title}:ServiceResultHeaderProps)=>{
    const titleRef = useRef(null);
    return(
        <header className="main-header">
        <BreadCrumpsComponent />
        <Container maxWidth={false} sx={{ display: "flex", justifyContent: "space-between", mt: "20px", mb: "20px", padding: "0" }} >
            <LinkButtonComponent />
            <>
                        <h3 
            className="res-title title card-title"
            ref={titleRef}
            >
                {title}
            </h3>
            {isAdmin() && <ServiceResultButtonsComponent ref={titleRef} /> }
            </>

            <LinkButtonComponent img={homeButton} description={"Меню"} />
        </Container>
    </header>
    );
}

export default ServiceResultHeader;