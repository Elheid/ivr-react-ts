
import { Button, Card, Grid2, Skeleton } from '@mui/material';
import { ClearCardHeader, ClearCardIconComponent } from "./CardParts/ClearCardParts";
import { GesturalCardSubstrateComponent, GesturalVideoComponent } from './CardParts/GesturalParts';
import { CardTemplate, Category, Service } from '../../../../interfaces/CardsInterfaces';

import { useNavigate } from 'react-router-dom';
import { isAdmin, navigateHandleClick } from '../../../../utill';

import clearStyles from "./clearCard.module.css"
import gesturalStyles from './gesturalCard.module.css'
import AdminButtonsComponent from '../../../AdminUtils/AdminButtonsComponent';
import React, { useRef } from 'react';
import { cardStyle, gridCardStyle } from '../../../../styles/cards';


interface CardButtonTitleProps {
    title: string;
    itemsInCategoryIds?: number[];
    childrenCategoryIds?: number[];
}


const CardButtonTitle = ({ title, itemsInCategoryIds, childrenCategoryIds, isLoading, isFromQuery}: CardButtonTitleProps & { isLoading?: boolean, isFromQuery:boolean }) => {
    const hasItems = itemsInCategoryIds && itemsInCategoryIds.length > 0;
    const hasSubCategories = childrenCategoryIds && childrenCategoryIds.length > 0;
    let header: React.ReactNode;
    if (hasItems) header = <ClearCardHeader title={title} itemsCount={itemsInCategoryIds?.length} isFromQuery={isFromQuery}/>;
    else if (hasSubCategories) header = <ClearCardHeader title={title} subCategoriesCount={childrenCategoryIds?.length} isFromQuery={isFromQuery}  />;
    else header = <ClearCardHeader title={title} isFromQuery={isFromQuery} />;

    return (
        localStorage.getItem("language") === "clear-language"
            ? (isLoading ? (header) : <Skeleton variant="text">{header}</Skeleton>)
            : (isLoading ? (<GesturalCardSubstrateComponent title={title} isFromQuery={isFromQuery}  />) : <Skeleton variant='text'><GesturalCardSubstrateComponent title={title} isFromQuery={isFromQuery}/></Skeleton>)
    )
}

interface CardButtonMediaProps {
    gifPreview: string;
    mainIconLink: string;
}

const CardButtonMedia = React.memo(({ gifPreview, mainIconLink, title, isService = false, id }: CardButtonMediaProps
    & {
        title: string,
        isService?: boolean
        id?: number
    }) => {
    //const { iconLoaded, videoLoaded } = useLoadContext();
    if(!id)
        id = -1;
    return (
        localStorage.getItem("language") === "clear-language"
            ? (((<ClearCardIconComponent iconSrc={mainIconLink} title={title} isService={isService} id={id} />) ))
            : ( <GesturalVideoComponent gifSrc={gifPreview} id={id}/> )
    );
});


interface CardButtonProps extends CardTemplate {
    itemsInCategoryIds?: number[];
    childrenCategoryIds?: number[];
}

const CardButtonComponent = React.memo(({ gifPreview, mainIconLink, title, itemsInCategoryIds, childrenCategoryIds, isLoading, isService, id, isFromQuery=false }: CardButtonProps & { isLoading?: boolean, isService?: boolean, id?: number, isFromQuery?:boolean }) => {
    
    const cardType = localStorage.getItem("language") === "clear-language" ? clearStyles["clear-card"] : gesturalStyles["gestural-card"];
    const cardButtonClass = localStorage.getItem("language") === "clear-language" ? clearStyles["clear-button-card"] : gesturalStyles["gestural-button-card"];
    const cardRef = useRef(null);
    
    return (
        <div data-id={id}
        className={`card-content ${cardType}`}
        data-title={title}
        data-gifsrc={gifPreview}
        data-iconsrc={mainIconLink}
        ref={cardRef}
        >
            {isAdmin() && <AdminButtonsComponent ref={cardRef} />}
            <Button
                sx={{
                    textTransform: 'none',
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    lineHeight: "normal",
                    display: "inline-block"
                }}
                className={cardButtonClass}
            >
                <CardButtonMedia mainIconLink={mainIconLink} gifPreview={gifPreview} title={title} id={id} isService={isService} />
                <CardButtonTitle title={title} itemsInCategoryIds={itemsInCategoryIds} childrenCategoryIds={childrenCategoryIds} isFromQuery={isFromQuery} isLoading={isLoading} />
            </Button>
        </div>
    )
});


type ServiceCard = Omit<Service, "additionIds" | "description" | "gifLink" | "iconLinks">;

const ServiceCardComponent: React.FC<ServiceCard & { isLoading?: boolean, isFromQuery: boolean }> = React.memo(({
    id,
    categoryId,
    gifPreview,
    title,
    mainIconLink,
    size = 6,
    isLoading,
    isFromQuery
}) => {
    const navigate = useNavigate();
    const cardType = localStorage.getItem("language") === "clear-language" ? clearStyles["clear-card"] : "";

    const destination = `/result/${id}`;
    return (
        <Grid2 size={size} className={cardType} sx={gridCardStyle}>
            <Card
                className={"service-card"}
                service-id={id}
                parent-catalog-id={categoryId}
                sx={cardStyle}
                onClick={() => navigateHandleClick(false, destination, navigate, false)}
            >
                <CardButtonComponent
                    id={id} isService={true}
                    gifPreview={gifPreview}
                    mainIconLink={mainIconLink}
                    title={title}
                    isLoading={isLoading}
                    isFromQuery={isFromQuery}
                />
            </Card>
        </Grid2>
    );
});

//type CategoryCard = Omit<Category, "childrenCategoryIds" | "parentCategoryId">;

const CatalogCardComponent: React.FC<Category & { isLoading?: boolean }> = React.memo(({
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
    let destinationParams = { withBaseUrl: true, paramState: `/${id}`, navigate, fromStart: true };
    if (parentCategoryId !== 0) {
        console.log()
    }
    if (childrenCategoryIds.length > 0 && parentCategoryId === 0) {
        childrens = childrenCategoryIds.length;
        destinationParams = { withBaseUrl: false, paramState: `/subCategories/${id}`, navigate, fromStart: false };
    }

    return (
        <Grid2
            size={size}
            className={cardType}
            sx={gridCardStyle}
            onClick={() => navigateHandleClick(destinationParams.withBaseUrl, destinationParams.paramState, destinationParams.navigate, destinationParams.fromStart)}>
            <Card 
            className={ parentCategoryId !== 0 ? "sub-catalog-card" : "catalog-card"}
            catalog-id={id} 
            children-count={childrens.toString()} 
            parent-id={parentCategoryId}
            sx={cardStyle}>
                <CardButtonComponent id={id} gifPreview={gifPreview} mainIconLink={mainIconLink} title={title} itemsInCategoryIds={itemsInCategoryIds} childrenCategoryIds={childrenCategoryIds} isLoading={isLoading} />
            </Card>
        </Grid2>
    )});


export { CatalogCardComponent, ServiceCardComponent };



