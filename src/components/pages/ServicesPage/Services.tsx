import HeaderComponent from "./Header";
import ServicesListComponent from "./ServicesListComponent";
import { CardSizeProvider } from "../../../contextProviders/CardSizeProvider";
import { CardProvider } from "../../../contextProviders/CardsProvider";
import { SearchInputProvider } from "../../../contextProviders/SearchInputProvider";
import { isAdmin } from "../../../utill";
import { fetchAndRefreshToken } from "../../../api/backendApi";
import { useEffect, useState } from "react";

const ServicesComponent = () => {
    //const language = localStorage.getItem("language");
    const [isRefreshable, setRefreshable] = useState(false);
    useEffect(()=>{
        try{
            fetchAndRefreshToken();
            setRefreshable(true);
        }
        catch{
            alert("Ошибка, не вошли в аккаунт")
        }
    },[])
    const classes = " main"
    return (
        <SearchInputProvider>
        <CardSizeProvider>
        <CardProvider>
        <section className={classes}>
            <HeaderComponent/>
            {isAdmin() && isRefreshable && <span style={{color:"green"}}>Авторизованы</span>}
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