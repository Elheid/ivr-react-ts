
import { Button, Card, Grid2, Skeleton } from '@mui/material';
import { ClearCardHeader, ClearCardIconComponent } from "./CardParts/ClearCardParts";
import { GesturalCardSubstrateComponent, GesturalVideoComponent } from './CardParts/GesturalParts';
import { CardTemplate, Category, Service } from '../../../interfaces/CardsInterfaces';

import { useNavigate } from 'react-router-dom';
import { navigateHandleClick } from '../../../utill';

import clearStyles from "./clearCard.module.css"
import gesturalStyles from './gesturalCard.module.css'
import { useLoadContext } from '../../../contextProviders/LoadMediaProvider';


interface CardButtonTitleProps {
    title: string;
    itemsInCategoryIds?: number[];
}


const CardButtonTitle = ({ title, itemsInCategoryIds,  isLoading}: CardButtonTitleProps  & { isLoading?: boolean }) => {
    const hasItems = itemsInCategoryIds && itemsInCategoryIds.length > 0;
    let header: React.ReactNode;
    if (hasItems) header = <ClearCardHeader title={title} childrenCount={itemsInCategoryIds.length} />;
    else header = <ClearCardHeader title={title} />;

    return (
        localStorage.getItem("language") === "clear-language"
            ? (isLoading ? (header) : <Skeleton variant="text">{header}</Skeleton>)
            : (isLoading ? (<GesturalCardSubstrateComponent title={title} />) : <Skeleton variant='text'><GesturalCardSubstrateComponent title={title}/></Skeleton>)
)}   

interface CardButtonMediaProps {
    gifPreview: string;
    mainIconLink: string;
}

const CardButtonMedia = ({ gifPreview, mainIconLink, isLoading}: CardButtonMediaProps & { isLoading?: boolean }) => {
    const { iconLoaded, videoLoaded} = useLoadContext();

    return (
        localStorage.getItem("language") === "clear-language"
            ? ((isLoading && iconLoaded ? (<ClearCardIconComponent iconSrc={mainIconLink} />) : <Skeleton animation="wave" variant="rounded"><ClearCardIconComponent iconSrc={mainIconLink} /></Skeleton>))
            : (isLoading && videoLoaded ? <GesturalVideoComponent gifSrc={gifPreview} /> : <Skeleton animation="wave" variant="rounded"><GesturalVideoComponent gifSrc={gifPreview} /></Skeleton>)
    );
}


interface CardButtonProps extends CardTemplate {
    itemsInCategoryIds?: number[];
}

const CardButtonComponent = ({ gifPreview, mainIconLink, title, itemsInCategoryIds, isLoading}: CardButtonProps & { isLoading?: boolean }) => {
    const cardType = localStorage.getItem("language") === "clear-language" ? clearStyles["clear-card"] : gesturalStyles["gestural-card"];
    const cardButtonClass = localStorage.getItem("language") === "clear-language" ? clearStyles["clear-button-card"] : gesturalStyles["gestural-button-card"];
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
                className={cardButtonClass}
            >
                <CardButtonMedia mainIconLink={mainIconLink} gifPreview={gifPreview} isLoading={isLoading}/>
                <CardButtonTitle title={title} itemsInCategoryIds={itemsInCategoryIds} isLoading={isLoading}/>
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
    height: "100%"
};


type ServiceCard = Omit<Service, "additionIds" | "description" | "gifLink" | "iconLinks">;

const ServiceCardComponent: React.FC<ServiceCard & { isLoading?: boolean }> = ({
    id,
    categoryId,
    gifPreview,
    title,
    mainIconLink,
    size = 6,
    isLoading
}) => {
    const navigate = useNavigate();
    const cardType = localStorage.getItem("language") === "clear-language" ? clearStyles["clear-card"] : "";

    const destination = `/result/${id}`;
    return (
        <Grid2 size={size} className={cardType} sx={gridCardStyle}>
            <Card
                className={"catalog-card"}
                service-id={id}
                parent-catalog-id={categoryId}
                sx={cardStyle}
                onClick={() => navigateHandleClick(false, destination, navigate)}
            >
                <CardButtonComponent id={id} gifPreview={gifPreview} mainIconLink={mainIconLink} title={title} isLoading={isLoading}/>
            </Card>
        </Grid2>
    );
};

//type CategoryCard = Omit<Category, "childrenCategoryIds" | "parentCategoryId">;

const CatalogCardComponent: React.FC<Category & { isLoading?: boolean }> = ({
    id,
    itemsInCategoryIds,
    gifPreview,
    title,
    mainIconLink,
    childrenCategoryIds,
    parentCategoryId,
    size = 6,
    isLoading
}) => {
    const navigate = useNavigate();
    const cardType = localStorage.getItem("language") === "clear-language" ? clearStyles["clear-card"] : "";

    let childrens = itemsInCategoryIds.length;
    if (parentCategoryId !== 0){
        console.log()
    }
    if (childrenCategoryIds.length > 0){
        childrens = childrenCategoryIds.length;
    }

    return (
        <Grid2 
        size={size} 
        className={cardType} 
        sx={gridCardStyle} 
        onClick={() => navigateHandleClick(true, `/${id}`, navigate)}>
            <Card className={"catalog-card"} catalog-id={id} children-count={childrens.toString()} sx={cardStyle}>
                <CardButtonComponent id={id} gifPreview={gifPreview} mainIconLink={mainIconLink} title={title} itemsInCategoryIds={itemsInCategoryIds} isLoading={isLoading}/>
            </Card>
        </Grid2>
    );
};


export { CatalogCardComponent, ServiceCardComponent };



