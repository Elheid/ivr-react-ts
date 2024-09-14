import HeaderComponent from "./Header";
import ServicesListComponent from "./ServiceCards/ServicesListComponent";

const ServicesComponent = () => {
    //const language = localStorage.getItem("language");
    
    const classes = " main"
    return (
        <section className={classes}>
            <HeaderComponent/>
            <section className="view-choose">
                <ServicesListComponent />
            </section>
        </section>
    );
}

export default ServicesComponent;