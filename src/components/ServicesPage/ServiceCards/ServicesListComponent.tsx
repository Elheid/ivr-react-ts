import { Container, Grid2 } from '@mui/material';
import {CatalogCardComponent, ServiceCardComponent} from './ServiceCardComponent'; // Импорт компонента
import { getCategories } from '../../../api/backendApi';
import { useEffect, useState } from 'react';
import { useCardSize } from '../../../contextProviders/CardSizeProvider';
import Category from '../../../interfaces/CardsInterfaces';
import { checkUndefined } from '../../../utill';
import { useCards } from '../../../contextProviders/CardsProvider';


const ListComponent = () => {
    //const normalSize = 6;
    //const bigSize = 12;
    //const size = normalSize;

    //const [categories, setCategories] = useState<Category[]>([]);

    const { categories, setCategories, services } = useCards();
    const { size } = useCardSize();

    useEffect(() => {
        getCategories().then((data) => {
            const content = data.content;
            setCategories(content);
        });
    }, []);

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