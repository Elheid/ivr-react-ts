
import { Button, Card, Grid2 } from '@mui/material';
import { ClearCardHeader, ClearCardIconComponent } from "./CardParts/ClearCardParts";
import { GesturalCardSubstrateComponent, GesturalVideoComponent } from './CardParts/GesturalParts';


////

interface CatalogCardComponentProps {
    catalogId: string;
    childrenCount: number;
    gifSrc: string;
    iconSrc: string;
    title: string;
    size: number;
}



const CatalogCardComponent: React.FC<CatalogCardComponentProps> = ({ catalogId, childrenCount, gifSrc, title, iconSrc, size = 6 }) => {
    const cardType = localStorage.getItem("language") === "clear-language" ? "clear-card" : "";
    return (
        <Grid2 size={size} className={`${cardType}`} sx={{ borderRadius: "20px" }}>
            <Card className={`catalog-card`} catalog-id={catalogId} children-count={childrenCount.toString()} sx={{ borderRadius: "20px" }}>
                <div className={`card-content ${cardType}`}>
                    <Button 
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: "400",
                            fontSize: "0.875rem",
                            lineHeight: "normal",
                            display:"inline-block"
                        }}
                        data-gifsrc={gifSrc}
                        data-iconsrc={iconSrc}
                        className='card'
                    >
                        {localStorage.getItem("language") === "clear-language"
                            ? (<ClearCardIconComponent iconSrc={iconSrc} />)
                            : (<GesturalVideoComponent gifSrc={gifSrc} />)}

                        {localStorage.getItem("language") === "clear-language"
                            ? (<ClearCardHeader title={title} childrenCount={childrenCount} />)
                            : (<GesturalCardSubstrateComponent title={title} />)}
                    </Button>
                </div>
            </Card>
        </Grid2>
    );
};

export default CatalogCardComponent;



