import {  CircularProgress, Container, Grid2 } from '@mui/material';
import { CatalogCardComponent, ServiceCardComponent } from './ServiceCards/ServiceCardComponent'; // Импорт компонента
import { getCategories, getServiceById, getServiceByTitle } from '../../api/backendApi';
import {  useEffect, useRef, useState } from 'react';
import { useCardSize } from '../../contextProviders/CardSizeProvider';
import { useCards } from '../../contextProviders/CardsProvider';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { getLastParam, saveCategoriesTitles } from '../../utill';
import { LoadMediaProvider } from '../../contextProviders/LoadMediaProvider';
import { Category } from '../../interfaces/CardsInterfaces';

interface GroupsOfCategories{
        rootWithNotSub: Category[],
        rootWithSub: Category[],
        subWithChild:  Category[],
        subWithNotChild: Category[],
}

const categorizeCategories = (categories: Category[]): GroupsOfCategories  => {
    const categoryGroups = {
        rootWithNotSub: [] as Category[],
        rootWithSub: [] as Category[],
        subWithChild: [] as Category[],
        subWithNotChild: [] as Category[],
    };

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


    return categoryGroups;
};

const ListComponent = () => {
    const { categories, setCategories, services, setServices } = useCards();
    const { size } = useCardSize();

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingServices, setLoadingServices] = useState(false);
    const [isSearching, setSearching] = useState(false);

    const gruopsOfCategoties = useRef<GroupsOfCategories>();
    const location = useLocation();


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

    useEffect(() => {
        //const skeletonsHideDelay = 50;
        setLoadingServices(false);
        setLoadingCategories(false);

        const lastParam = Number(getLastParam());
        try {
            if (idNumberCategory !== -1 && idNumberCategory === lastParam) {
                getServiceById(idNumberCategory).then((data) => {
                    const content = data.content;
                    setServices(content);
                    //myFunctionWithDelay(() => setLoadingServices(true), skeletonsHideDelay);
                });
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
                    getCategories().then((data) => {
                        setServices([])
                    setCategories([]);

                    saveCategoriesTitles(data.content);
                    const content = data.content;
                    gruopsOfCategoties.current = categorizeCategories(content);
                    const allSubCategories = [...gruopsOfCategoties.current.subWithNotChild, 
                        ...gruopsOfCategoties.current.subWithChild];
                    const subCategoriesToShow = allSubCategories.filter((el)=> el.parentCategoryId === idNumberSubCategory)
                    setCategories(subCategoriesToShow);
                    });
                }
            } 
            if (query !== '') {
                setServices([]);
                setCategories([]);
                setSearching(true);
                getServiceByTitle(query)
                    .then((data) => {
                        setServices(data.content);
                        setSearching(false);
                        //myFunctionWithDelay(() => setLoadingServices(true), skeletonsHideDelay);
                    })
            }
            if (idNumberCategory === -1 && idNumberSubCategory === -1 && query === "") {
                getCategories().then((data) => {
                    setServices([])
                    setCategories([]);

                    saveCategoriesTitles(data.content);
                    const content = data.content;
                    gruopsOfCategoties.current = categorizeCategories(content);

                    setCategories([...gruopsOfCategoties.current.rootWithNotSub, 
                        ...gruopsOfCategoties.current.rootWithSub]);
                    //myFunctionWithDelay(() => setLoadingCategories(true), skeletonsHideDelay);
                });
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
        finally{
            setLoadingServices(true);
            setLoadingCategories(true)
        }
        return()=>{
            setServices([])
            setCategories([]);
            //console.log('unmount')
        }
    }, [location])

    return (
        <LoadMediaProvider>
            <Grid2 container rowSpacing={6} columnSpacing={{ xs: 9, sm: 9, md: 9 }}>
                {isSearching && (
                <div style={{     
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60vh",
                    margin: "0 auto ",
                    }}>
                    <CircularProgress size={80} className="brown-loader"/>
                </div>)}
                {categories.map((category, index) => (
                    <CatalogCardComponent
                        key={index} // Ensure unique key for each card
                        id={category.id} // Assuming 'catalogId' exists in your data
                        itemsInCategoryIds={category.itemsInCategoryIds} // Assuming 'childrenCount' exists
                        gifPreview={category.gifPreview} // Assuming 'gifSrc' exists
                        mainIconLink={category.mainIconLink} // Assuming 'iconSrc' exists
                        title={category.title} // Assuming 'title' exists
                        size={size} // You can use 'normalSize' or 'bigSize' as needed
                        isLoading={loadingCategories}
                        parentCategoryId={category.parentCategoryId}
                        childrenCategoryIds={category.childrenCategoryIds}
                    />
                ))}
                {services.map((service, index) => (
                    <ServiceCardComponent
                        key={index} // Ensure unique key for each card
                        id={service.id} // Assuming 'catalogId' exists in your data
                        categoryId={service.categoryId} // Assuming 'childrenCount' exists
                        gifPreview={service.gifPreview} // Assuming 'gifSrc' exists
                        mainIconLink={service.mainIconLink} // Assuming 'iconSrc' exists
                        title={service.title} // Assuming 'title' exists
                        size={size} // You can use 'normalSize' or 'bigSize' as needed
                        isLoading={loadingServices}
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