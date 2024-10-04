import { Button } from "@mui/material";

interface SearchPopupComponentProps {
    img: string;
    description?:string;
    classes?:string;
    onClick: () => void;
}

const SearchButtonComponent = ({img, description}: SearchPopupComponentProps) => {
    return (
        <div className="search-popup-button">
            <img src={img} alt="Кнопка поиска" />
            <span className="button-title back-title">{description}</span>
        </div>
    );
}



const SearchPopupButtonComponent = ({img, description, classes = "return-button", onClick} : SearchPopupComponentProps) => {

    return (
        <Button
            variant="contained"
            className={classes}
            sx={{
                textTransform: 'none',
                mr: "1.5vw;",
                fontWeight: "500",
            }}
            onClick={()=>{
                onClick();
            }}
        >
            <SearchButtonComponent img={img} description={description} onClick={onClick}/>
        </Button>
    );
}

export default SearchPopupButtonComponent;