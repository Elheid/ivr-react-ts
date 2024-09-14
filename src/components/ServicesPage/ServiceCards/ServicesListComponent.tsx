import { Container, Grid2 } from '@mui/material';
import CatalogCard from './ServiceCardComponent'; // Импорт компонента


const ListComponent = () => {
    const normalSize = 6;
    const bigSize = 12;
    const size = normalSize;
    return (
        <Grid2 container rowSpacing={6} columnSpacing={{ xs: 9, sm: 9, md: 9 }}>
            <CatalogCard
                catalogId="2"
                childrenCount={6}
                gifSrc="https://storage.yandexcloud.net/akhidov-ivr/2.mp4"
                iconSrc="https://storage.yandexcloud.net/akhidov-ivr/icon2.svg"
                title="Консультация по регистрационному учету"
                size={size}
            />

            <CatalogCard
                catalogId="2"
                childrenCount={6}
                gifSrc="https://storage.yandexcloud.net/akhidov-ivr/2.mp4"
                iconSrc="https://storage.yandexcloud.net/akhidov-ivr/icon2.svg"
                title="Консультация по регистрационному учету"
                size={size}
            />

            <CatalogCard
                catalogId="2"
                childrenCount={6}
                gifSrc="https://storage.yandexcloud.net/akhidov-ivr/2.mp4"
                iconSrc="https://storage.yandexcloud.net/akhidov-ivr/icon2.svg"
                title="Консультация по регистрационному учету"
                size={size}
            />

            <CatalogCard
                catalogId="2"
                childrenCount={6}
                gifSrc="https://storage.yandexcloud.net/akhidov-ivr/2.mp4"
                iconSrc="https://storage.yandexcloud.net/akhidov-ivr/icon2.svg"
                title="Консультация по регистрационному учету"
                size={size}
            />

        </Grid2>
    );
}

const ServicesListComponent = () => {
    return (
        <Container
            sx={{ 
                mt: "30px" ,
                pb:"5vh"
            }}
        >
            <ListComponent />
        </Container>
    );
};

export default ServicesListComponent;