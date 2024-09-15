import HeaderComponent from "./Header";
import ServicesListComponent from "./ServiceCards/ServicesListComponent";
import { CardSizeProvider } from "../../contextProviders/CardSizeProvider";
import { CardProvider } from "../../contextProviders/CardsProvider";

const ServicesComponent = () => {
    //const language = localStorage.getItem("language");
    
    const classes = " main"
    return (
        <CardSizeProvider>
        <CardProvider>
        <section className={classes}>
            <HeaderComponent/>
            <section className="view-choose">
                <ServicesListComponent />
            </section>
        </section>
        </CardProvider>
        </CardSizeProvider>
    );
}

export default ServicesComponent;