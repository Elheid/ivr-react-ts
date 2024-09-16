
import { Button, Card, Grid2 } from '@mui/material';
import { ClearCardHeader, ClearCardIconComponent } from "./CardParts/ClearCardParts";
import { GesturalCardSubstrateComponent, GesturalVideoComponent } from './CardParts/GesturalParts';
import { CardTemplate, Category, Service } from '../../../interfaces/CardsInterfaces';

import { useNavigate  } from 'react-router-dom';
import { navigateHandleClick } from '../../../utill';

interface CardButtonTitleProps {
    title: string;
    itemsInCategoryIds? : number[];
}


const CardButtonTitle = ({title, itemsInCategoryIds}:CardButtonTitleProps)=>{
    const hasItems = itemsInCategoryIds && itemsInCategoryIds.length > 0;
    let header: React.ReactNode;
    if (hasItems) header = <ClearCardHeader title={title} childrenCount={itemsInCategoryIds.length} />;
    else header = <ClearCardHeader title={title} />;

    return (
        localStorage.getItem("language") === "clear-language"
            ? (header)
            : (<GesturalCardSubstrateComponent title={title} />)
    );
}

interface CardButtonMediaProps {
    gifPreview: string;
    mainIconLink : string;
}

const CardButtonMedia = ({gifPreview, mainIconLink}:CardButtonMediaProps)=>{
    return (
        localStorage.getItem("language") === "clear-language"
            ? (<ClearCardIconComponent iconSrc={mainIconLink} />)
            : (<GesturalVideoComponent gifSrc={gifPreview} />)
    );
}


interface CardButtonProps extends CardTemplate {
    itemsInCategoryIds?: number[];
}

const CardButtonComponent = ({id, gifPreview, mainIconLink, title, itemsInCategoryIds} : CardButtonProps)=>{
    const cardType = localStorage.getItem("language") === "clear-language" ? "clear-card" : "";
    const navigate = useNavigate(); // Используем useNavigate для программной навигации
    //const location = useLocation(); // Получаем текущий путь


    return (
        <div className={`card-content ${cardType}`}>
        <Button
        sx={{
            textTransform: 'none',
            fontWeight: "400",
            fontSize: "0.875rem",
            lineHeight: "normal",
            display: "inline-block"
        }}
        data-gifsrc={gifPreview}
        data-iconsrc={mainIconLink}
        className='card'
        onClick={()=> navigateHandleClick(`categoryId=${id}`, navigate)}
    >
        <CardButtonMedia mainIconLink={mainIconLink}  gifPreview={gifPreview}/>
        <CardButtonTitle title={title} itemsInCategoryIds={itemsInCategoryIds}/>
    </Button>
    </div>
    )
}

const gridCardStyle = {
    display: 'flex',
    flexDirection: 'column',

    borderRadius: "20px",
    gridAutoRows: '1fr',
    height: "inherit"
};


const cardStyle = {
    borderRadius: "20px", 
    backgroundColor: "unset",
    height:"100%"
};



type ServiceCard = Omit<Service, "additionIds"|"description"|"gifLink"|"iconLinks">

const ServiceCardComponent: React.FC<ServiceCard> = ({ id, categoryId, gifPreview, title, mainIconLink, size = 6 }) => {
    const cardType = localStorage.getItem("language") === "clear-language" ? "clear-card" : "";
    return (
        <Grid2 size={size} className={`${cardType}`} sx={gridCardStyle}>
            <Card className={`catalog-card`} service-id={id} parent-catalog-id={categoryId} sx={cardStyle}>
                    <CardButtonComponent id={id} gifPreview={gifPreview} mainIconLink={mainIconLink} title={title}>
                    </CardButtonComponent>
            </Card>
        </Grid2>
    );
};


type CategoryCard = Omit<Category, "childrenCategoryIds"|"parentCategoryId">

const CatalogCardComponent: React.FC<CategoryCard> = ({ id, itemsInCategoryIds, gifPreview, title, mainIconLink, size = 6 }) => {
    const cardType = localStorage.getItem("language") === "clear-language" ? "clear-card" : "";
    return (
        <Grid2 size={size} className={`${cardType}`} sx={gridCardStyle}>
            <Card className={`catalog-card`} catalog-id={id} children-count={itemsInCategoryIds.length.toString()} sx={cardStyle}>
                    <CardButtonComponent id={id} gifPreview={gifPreview} mainIconLink={mainIconLink} title={title} itemsInCategoryIds={itemsInCategoryIds}>
                    </CardButtonComponent>
            </Card>
        </Grid2>
    );
};

export { CatalogCardComponent, ServiceCardComponent };



