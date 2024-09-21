import BreadCrumpsComponent from "../../BreadCrumps";
import LinkReturnButtonComponent from "../../ReturnButton";
import homeButton from "../../../assets/img/home.svg"
import { Container } from "@mui/material";

interface ServiceResultHeaderProps{
    title:string;
}
const ServiceResultHeader = ({title}:ServiceResultHeaderProps)=>{
    return(
        <header className="main-header">
        <BreadCrumpsComponent />
        <Container maxWidth={false} sx={{ display: "flex", justifyContent: "space-between", mt: "20px", mb: "20px", padding: "0" }} >
            <LinkReturnButtonComponent />
            <h3 className="res-title title card-title">{title}</h3>
            <LinkReturnButtonComponent img={homeButton} description={"Меню"} />
        </Container>
    </header>
    );
}

export default ServiceResultHeader;