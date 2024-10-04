import BreadCrumpsComponent from "../../BreadCrumps";
import LinkButtonComponent from "../../ReturnButton";
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
            <LinkButtonComponent />
            <h3 className="res-title title card-title">{title}</h3>
            <LinkButtonComponent img={homeButton} description={"Меню"} />
        </Container>
    </header>
    );
}

export default ServiceResultHeader;