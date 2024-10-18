import {  Alert, Container, Grid2 } from '@mui/material';
import { CatalogCardComponent, ServiceCardComponent } from './ServiceCards/ServiceCardComponent'; // Импорт компонента
import {  useEffect, useRef, useState } from 'react';
import { useCardSize } from '../../../contextProviders/CardSizeProvider';
import { useCards } from '../../../contextProviders/CardsProvider';
import {  useParams, useSearchParams } from 'react-router-dom';
import { getLastParam, saveCategoriesTitles } from '../../../utill';
import { LoadMediaProvider } from '../../../contextProviders/LoadMediaProvider';
import { Category, Service } from '../../../interfaces/CardsInterfaces';
import LoadingCompanent from '../../LoadingComponent';
import { useCategoriesQuery, useServicesQuery } from '../../../hooks/useCategoriesQuery';

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

    
    const {data: categoriesInfo,  error: categoriesError, isLoading: isCategoriesLoading} = useCategoriesQuery();
    const {data: servicesInfo,  error: servicesError, isLoading: isServicesLoading } = useServicesQuery({categoryId:idNumberCategory, search:query});
    useEffect(() => {
        const lastParam = Number(getLastParam());
        try {
            if (idNumberCategory !== -1 && idNumberCategory === lastParam) {
                setServices(servicesInfo as Service[]);
            }
            if (idNumberSubCategory !== -1 && idNumberSubCategory === lastParam )
            {
                if (gruopsOfCategoties.current) 
                {
                    const allSubCategories = [...gruopsOfCategoties.current.subWithNotChild, 
                        ...gruopsOfCategoties.current.subWithChild];
                    const subCategoriesToShow = allSubCategories.filter((el)=> el.parentCategoryId === idNumberSubCategory)
                    setCategories(subCategoriesToShow);
                }
                else{
                    saveCategoriesTitles(categoriesInfo || []);
                    gruopsOfCategoties.current = categorizeCategories(categoriesInfo);
                    const allSubCategories = [...gruopsOfCategoties.current.subWithNotChild, 
                        ...gruopsOfCategoties.current.subWithChild];
                    const subCategoriesToShow = allSubCategories.filter((el)=> el.parentCategoryId === idNumberSubCategory)
                    setCategories(subCategoriesToShow);
                }
            } 
            if (query !== '') {
                setServices([])
                setCategories([]);
                    setSearching(true);
                    setServices(servicesInfo as Service[]);
                    setSearching(false);
                    
            }
            if (idNumberCategory === -1 && idNumberSubCategory === -1 && query === "") {
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

    const loading = isSearching || (isServicesLoading || isCategoriesLoading);
    if (categoriesError || servicesError){
        return <Alert severity="warning">
            {"Что-то пошло не так"}
        </Alert>
    }
    if (loading){
        return <LoadingCompanent />;
    }
    const smthWrong = <Alert severity="warning">
    {"Что-то пошло не так"}
    </Alert>;
    
    return (
        <LoadMediaProvider>
            <Grid2 container rowSpacing={6} columnSpacing={{ xs: 9, sm: 9, md: 9 }}>
                {/*isSetLoading && <LoadingCompanent />*/}
                {!categories ? smthWrong : !isSearching && categories.map((category, index) => (
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
                {!services ? smthWrong : !isSearching && services.map((service, index) => (
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
        </LoadMediaProvider>
    );
}

const ServicesListComponent = () => {
    return (
        <Container
            sx={{
                mt: "30px",
                pb: "5vh"
            }}
        >
            <ListComponent />
        </Container>
    );
};

export default ServicesListComponent;