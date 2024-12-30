import {  Alert, Container, Grid2 } from '@mui/material';
import { CatalogCardComponent, ServiceCardComponent } from './ServiceCards/ServiceCardComponent'; // Импорт компонента
import {  useEffect, useRef, useState } from 'react';
import { useCardSize } from '../../../contextProviders/CardSizeProvider';
import { useCards } from '../../../contextProviders/CardsProvider';
import {  useParams, useSearchParams } from 'react-router-dom';
import { getLastParam, saveCategoriesTitles } from '../../../utill';
import { LoadMediaProvider, useLoadContext } from '../../../contextProviders/LoadMediaProvider';
import { Category, Service } from '../../../interfaces/CardsInterfaces';
import LoadingCompanent from '../../LoadingComponent';
import { useCategoriesQuery, useServicesQuery } from '../../../hooks/useCardsQuery';

import AddCardComponent from '../../AdminUtils/AddCardComponent';
import { usePageStateContext } from '../../../contextProviders/PageState';

interface GroupsOfCategories{
        rootWithNotSub: Category[],
        rootWithSub: Category[],
        subWithChild:  Category[],
        subWithNotChild: Category[],
}

const categorizeCategories = (categories: Category[] | undefined): GroupsOfCategories  => {
    const categoryGroups = {
        rootWithNotSub: [] as Category[],
        rootWithSub: [] as Category[],
        subWithChild: [] as Category[],
        subWithNotChild: [] as Category[],
    };
    if (categories){
        categories.forEach(category => {
            if (category.childrenCategoryIds.length === 0 && category.parentCategoryId === 0) {
                categoryGroups.rootWithNotSub.push(category);
            } else if (category.childrenCategoryIds.length !== 0 && category.parentCategoryId === 0) {
                categoryGroups.rootWithSub.push(category);
            } else if (category.childrenCategoryIds.length !== 0 && category.parentCategoryId !== 0) {
                categoryGroups.subWithChild.push(category);
            } else if (category.childrenCategoryIds.length === 0 && category.parentCategoryId !== 0) {
                categoryGroups.subWithNotChild.push(category);
            }
        });
    }

    return categoryGroups;
};

const ListComponent = () => {

    const {setState } = usePageStateContext();

    const { categories, setCategories, services, setServices } = useCards();
    const { size } = useCardSize();

    const [isSearching, setSearching] = useState(false);

    const gruopsOfCategoties = useRef<GroupsOfCategories>();


    const [searchParams] = useSearchParams();
    //const id = searchParams.get('categoryId'); 

    const { categoryId } = useParams<{ categoryId?: string }>();
    const { subCategoryId } = useParams<{ subCategoryId?: string }>();
    


    //const queryParams = new URLSearchParams(location.search);
    const categoryIdFromUrl = categoryId//searchParams.get('categoryId'); 
    const subCaregoryFromUrl = subCategoryId;//= categoryId//searchParams.get('sub-categoryId');
    const quetyFromUrl = searchParams.get('query');


    const idNumberCategory = categoryIdFromUrl ? Number(categoryIdFromUrl) : -1;
    const idNumberSubCategory = subCaregoryFromUrl ? Number(subCaregoryFromUrl) : -1;
    const query = quetyFromUrl ?? '';

    
    const {data: categoriesInfo,  error: categoriesError, isLoading: isCategoriesLoading, refetch} = useCategoriesQuery();
    const {data: servicesInfo,  error: servicesError, isLoading: isServicesLoading } = useServicesQuery({categoryId:idNumberCategory, search:query});
    
    const { areAllIconsLoaded, areAllVideosLoaded } = useLoadContext();
    const loading =  (isSearching || (isServicesLoading || isCategoriesLoading) || !areAllIconsLoaded && !areAllVideosLoaded);
    /*const [isHidden, setIsHidden] = useState<"hidden" | "">("hidden");
    const [skeletonIsHidden, setSkeletonIsHidden] = useState<"hidden" | "">("");
    const [isFirstTry, setIsFirstTry] = useState<boolean>(true);
    useEffect(()=>{
        const loading =  isFirstTry && (isSearching || (isServicesLoading || isCategoriesLoading) && !areAllIconsLoaded || !areAllVideosLoaded);
        if (loading){
            setIsHidden("hidden")
            setSkeletonIsHidden("")
        }
        else{
            if (isFirstTry){
                setIsHidden("hidden")
                setSkeletonIsHidden("")
                setIsFirstTry(false)
            }
            else{
                setIsHidden("")
                setSkeletonIsHidden("hidden")
            }
        }
    },[areAllIconsLoaded, areAllVideosLoaded, isSearching, isServicesLoading, isCategoriesLoading, isFirstTry])*/
    
    useEffect(() => {
        const lastParam = Number(getLastParam());
        try {
            const lastParent = categoriesInfo?.filter((el)=> el.id === lastParam)
            if (idNumberSubCategory !== -1 && (idNumberSubCategory === lastParam || idNumberCategory === lastParam) && lastParent &&  lastParent?.[0].childrenCategoryIds.length > 0)
            {
                setState("sub-categories")
                console.log("sub-categories")
                if (gruopsOfCategoties.current) 
                {
                    const allSubCategories = [...gruopsOfCategoties.current.subWithNotChild, 
                        ...gruopsOfCategoties.current.subWithChild];
                    const subCategoriesToShow = allSubCategories.filter((el)=> el.parentCategoryId === lastParam)
                    setCategories(subCategoriesToShow);
                }
                else{
                    saveCategoriesTitles(categoriesInfo || []);
                    if(!categoriesInfo)
                        refetch()
                    gruopsOfCategoties.current = categorizeCategories(categoriesInfo);
                    const allSubCategories = [...gruopsOfCategoties.current.subWithNotChild, 
                        ...gruopsOfCategoties.current.subWithChild];
                    const subCategoriesToShow = allSubCategories.filter((el)=> el.parentCategoryId === idNumberSubCategory)
                    setCategories(subCategoriesToShow);
                }
            }
            else if (idNumberCategory !== -1 && idNumberCategory === lastParam) {
                setState("services")
                console.log("services")
                setServices(servicesInfo as Service[]);
            }
            if (query !== '') {
                setServices([])
                setCategories([]);
                    setSearching(true);
                    setServices(servicesInfo as Service[]);
                    setSearching(false);
                    
            }
            if (idNumberCategory === -1 && idNumberSubCategory === -1 && query === "") {
                setState("categories")
                console.log("categories")
                    saveCategoriesTitles(categoriesInfo || []);
                    gruopsOfCategoties.current = categorizeCategories(categoriesInfo);
                    setCategories([...gruopsOfCategoties.current.rootWithNotSub, 
                        ...gruopsOfCategoties.current.rootWithSub]);
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
        return()=>{
            setServices([])
            setCategories([]);
        }
    }, [idNumberCategory, idNumberSubCategory, query, setCategories, setServices, categoriesInfo, servicesInfo])

    //const loading = isSearching || (isServicesLoading || isCategoriesLoading) && !areAllIconsLoaded || !areAllVideosLoaded;
    if (categoriesError || servicesError){
        return <Alert severity="warning">
            {"Что-то пошло не так"}
        </Alert>
    }
    /*const smthWrong = <Alert severity="warning">
    {"Что-то пошло не так"}
    </Alert>;*/


    const isHidden = loading ? "hidden" : ""; // Состояние видимости элемента
    //const skeletonIsHidden = !loading ? "hidden" : "";

    
    if (loading){
        return <LoadingCompanent />
    }


    return (
        <>
            <Grid2 className={`card-list ${isHidden}`} container rowSpacing={6} columnSpacing={{ xs: 9, sm: 9, md: 9 }}>
                {/*isSetLoading && <LoadingCompanent />*/}
                <AddCardComponent size={size} ></AddCardComponent>
                {/*!categories ? smthWrong : */!isSearching && categories &&categories.map((category, index) => (
                    <CatalogCardComponent
                        key={index} // Ensure unique key for each card
                        id={category.id} // Assuming 'catalogId' exists in your data
                        itemsInCategoryIds={category.itemsInCategoryIds} // Assuming 'childrenCount' exists
                        gifPreview={category.gifPreview} // Assuming 'gifSrc' exists
                        mainIconLink={category.mainIconLink} // Assuming 'iconSrc' exists
                        title={category.title} // Assuming 'title' exists
                        size={size} // You can use 'normalSize' or 'bigSize' as needed
                        isLoading={!isCategoriesLoading}
                        parentCategoryId={category.parentCategoryId}
                        childrenCategoryIds={category.childrenCategoryIds}
                        
                    />
                ))
                }   
                {/*!services ? smthWrong :!isSearching &&*/ services && services.map((service, index) => (
                    <ServiceCardComponent
                        key={index} // Ensure unique key for each card
                        id={service.id} // Assuming 'catalogId' exists in your data
                        categoryId={service.categoryId} // Assuming 'childrenCount' exists
                        gifPreview={service.gifPreview} // Assuming 'gifSrc' exists
                        mainIconLink={service.mainIconLink} // Assuming 'iconSrc' exists
                        title={service.title} // Assuming 'title' exists
                        size={size} // You can use 'normalSize' or 'bigSize' as needed
                        isLoading={!isServicesLoading}
                        isFromQuery={query !== ''}
                    />
                ))}
            </Grid2>
        </>
    );
}

const ServicesListComponent = () => {
    return (
        <LoadMediaProvider>
        <Container
            sx={{
                mt: "30px",
                pb: "5vh"
            }}
        >
            <ListComponent />
        </Container>
        </LoadMediaProvider>
    );
};

export default ServicesListComponent;