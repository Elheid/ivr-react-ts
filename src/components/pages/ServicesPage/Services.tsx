import HeaderComponent from "./Header";
import ServicesListComponent from "./ServicesListComponent";
import { CardSizeProvider } from "../../../contextProviders/CardSizeProvider";
import { CardProvider } from "../../../contextProviders/CardsProvider";
import { SearchInputProvider } from "../../../contextProviders/SearchInputProvider";
import AdminHeaderElements from "../../AdminUtils/AdminHeaderElements";


const ServicesComponent = () => {
    //const language = localStorage.getItem("language");
    const classes = " main"
    return (
        <SearchInputProvider>
        <CardSizeProvider>
        <CardProvider>
        <section className={classes}>
            <HeaderComponent/>
            <AdminHeaderElements />
            <section className="view-choose">
                <ServicesListComponent />
            </section>
        </section>
        </CardProvider>
        </CardSizeProvider>
        </SearchInputProvider>
    );
}

export default ServicesComponent;