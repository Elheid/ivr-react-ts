import BreadCrumpsComponent from "../BreadCrumps";
import SearcherComponent from "./Sercher/SearcherComponent";

const HeaderComponent = () => {
    return (
        <header className="main-header">
            <BreadCrumpsComponent />
            <SearcherComponent/>
        </header>

    );
}

export default HeaderComponent;
