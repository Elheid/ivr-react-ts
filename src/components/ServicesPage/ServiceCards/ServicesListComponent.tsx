import { Container, Grid2 } from '@mui/material';
import {CatalogCardComponent, ServiceCardComponent} from './ServiceCardComponent'; // Импорт компонента
import { getCategories, getServiceById, getServiceByTitle } from '../../../api/backendApi';
import { useEffect } from 'react';
import { useCardSize } from '../../../contextProviders/CardSizeProvider';
import { useCards } from '../../../contextProviders/CardsProvider';
import { useParams } from 'react-router-dom';
import { checkUndefined } from '../../../utill';


const ListComponent = () => {
    //const normalSize = 6;
    //const bigSize = 12;
    //const size = normalSize;

    //const [categories, setCategories] = useState<Category[]>([]);

    const { categories, setCategories, services, setServices } = useCards();
    const { size } = useCardSize();

    const { categoryId } = useParams<{ categoryId?: string }>();///Поч без этого не работает???

    const queryParams = new URLSearchParams(location.search);
    const categoryIdFromUrl = queryParams.get('categoryId');
    const subCaregoryFromUrl = queryParams.get('sub-categoryId');
    const quetyFromUrl = queryParams.get('query');

    const idNumberCategory = checkUndefined(categoryIdFromUrl) || categoryIdFromUrl === null? -1 : Number(categoryIdFromUrl);
    const idNumberSubCategory = checkUndefined(subCaregoryFromUrl) || subCaregoryFromUrl === null? -1 : Number(subCaregoryFromUrl);
    const query = checkUndefined(quetyFromUrl) || quetyFromUrl === null? '' : quetyFromUrl;


    useEffect(() => {
        if (idNumberCategory !== -1){
            getServiceById(idNumberCategory).then((data) => {
                const content = data.content;
                setServices(content);
                setCategories([]);
            });
        }
        if (idNumberSubCategory) console.log("Not yet");
        if (query) {
            getServiceByTitle(query)
            .then((data) => {
                setCategories([]);
                setServices(data.content);
            })
        }
        if(idNumberCategory === -1 && idNumberSubCategory === -1 && query === ""){
            // Если все param отсутствует, загружаем категории и очищаем сервисы
            setCategories([]);
            setServices([]);
            getCategories().then((data) => {
                const content = data.content;
                setCategories(content);
            });
        }

    },  [ location.search])

    return (
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
                />
            ))}

        </Grid2>
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