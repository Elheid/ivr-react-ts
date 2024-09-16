import { Container, debounce, Grid2 } from '@mui/material';
import { CatalogCardComponent, ServiceCardComponent } from './ServiceCardComponent'; // Импорт компонента
import { getCategories, getServiceById, getServiceByTitle } from '../../../api/backendApi';
import { useCallback, useEffect, useState } from 'react';
import { useCardSize } from '../../../contextProviders/CardSizeProvider';
import { useCards } from '../../../contextProviders/CardsProvider';
import { Location, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { checkUndefined, myFunctionWithDelay, saveCategoriesTitles } from '../../../utill';
import { LoadMediaProvider } from '../../../contextProviders/LoadMediaProvider';


const ListComponent = () => {
    const { categories, setCategories, services, setServices } = useCards();
    const { size } = useCardSize();

    //const [loadingCategories, setLoadingCategories] = useState(false);
    //const [loadingServices, setLoadingServices] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingServices, setLoadingServices] = useState(false);

    const location = useLocation();


    const [searchParams] = useSearchParams();
    //const id = searchParams.get('categoryId'); 

    const { categoryId } = useParams<{ categoryId?: string }>();


    //const queryParams = new URLSearchParams(location.search);
    const categoryIdFromUrl = categoryId//searchParams.get('categoryId'); 
    const subCaregoryFromUrl = undefined//= categoryId//searchParams.get('sub-categoryId');
    const quetyFromUrl = searchParams.get('query');

    const idNumberCategory = checkUndefined(categoryIdFromUrl) || categoryIdFromUrl === null ? -1 : Number(categoryIdFromUrl);
    const idNumberSubCategory = checkUndefined(subCaregoryFromUrl) || subCaregoryFromUrl === null ? -1 : Number(subCaregoryFromUrl);
    const query = checkUndefined(quetyFromUrl) || quetyFromUrl === null ? '' : quetyFromUrl;


    const [debouncedLocation, setDebouncedLocation] = useState<Location>(location);

    // Дебаунсированная функция для обновления состояния
    const debouncedUpdate = useCallback(debounce((loc: Location) => {
        setDebouncedLocation(loc);
    }, 300), []); // Указываем пустой массив зависимостей

    useEffect(() => {
        debouncedUpdate(location);
    }, [location, debouncedUpdate]);

    useEffect(() => {
        const skeletonsHideDelay = 1;
        setLoadingServices(false);
        setLoadingCategories(false);
        try {
            if (idNumberCategory !== -1) {
                setCategories([]);
                getServiceById(idNumberCategory).then((data) => {
                    const content = data.content;
                    setServices(content);

                    myFunctionWithDelay(()=>setLoadingServices(true), skeletonsHideDelay);
                });
            }
            if (idNumberSubCategory !== -1) console.log("Not yet");
            if (query) {
                setCategories([]);
                getServiceByTitle(query)
                    .then((data) => {
                        setServices(data.content);

                        myFunctionWithDelay(()=>setLoadingServices(true), skeletonsHideDelay);
                    })
            }
            if (idNumberCategory === -1 && idNumberSubCategory === -1 && query === "") {
                // Если все param отсутствует, загружаем категории и очищаем сервисы
                setCategories([]);
                setServices([]);
                getCategories().then((data) => {
                    saveCategoriesTitles(data.content);
                    const content = data.content;
                    setCategories(content);

                    myFunctionWithDelay(()=>setLoadingCategories(true), skeletonsHideDelay);
                });
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    }, [debouncedLocation])

    return (
        <LoadMediaProvider>
        <Grid2 container rowSpacing={6} columnSpacing={{ xs: 9, sm: 9, md: 9 }}>
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