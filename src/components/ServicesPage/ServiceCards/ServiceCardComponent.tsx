import React, { useEffect, useState } from 'react';

import arrowSVG from "../../../img/arrow.svg";
import arrowLargeSVG from "../../../img/arrowLarge.svg";
import { Card, Grid2 } from '@mui/material';

/// Clear card components
interface ClearCardIconComponentProps {
    iconSrc: string;
}
const loadSVG = async(svgUrl:string) =>{
    try {
        const response = await fetch(svgUrl);
        const svgText = await response.text();

        // Parse the SVG using svgo
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    

        const fillElements = svgDoc.querySelectorAll('[fill]');
        fillElements.forEach((el) => {
            el.setAttribute('fill', '#ffffff');
        });

        svgDoc.documentElement.style.fill = 'white';

        // Create a new URL for the modified SVG
        const res = URL.createObjectURL(new Blob([svgDoc.documentElement.outerHTML], { type: 'image/svg+xml' }));;
        return res;

    } catch (error) {
        console.error('Error loading or modifying SVG:', error);
    }
}

const ClearCardIconComponent = ({ iconSrc }: ClearCardIconComponentProps) => {
    //const getBlobIconUrl = loadSVG(iconSrc);
    const [icon, setIcon] = useState(iconSrc);

    useEffect(() => {
    const fetchIcon = async () => {
    const iconUrl = await loadSVG(iconSrc);
        if (iconUrl) {
            setIcon(iconUrl); 
        }
    }
    fetchIcon();
    }, [])
    return (
        <div className="icon-container">
            <img src={icon} alt="Icon" />
        </div>
    );
}

interface ClearCardHeaderProps {
    childrenCount: number;
    title: string;
}


const ClearCardHeader = ({ title, childrenCount }: ClearCardHeaderProps) => {
    return (
        <div className="card-header">
            <h3 className="card-title card-description">{title}</h3>
            <div className="card-footer">
                <p className="count-services">услуг: {childrenCount}</p>
                <img className="arrow-img" src={arrowSVG} alt="Arrow" />
            </div>
        </div>
    );
}
///

///Gestural card components 
interface GesturalVideoComponentProps {
    gifSrc: string;
}

const GesturalVideoComponent = ({ gifSrc }: GesturalVideoComponentProps) => {
    return (
        <div className="video-overlay">
            <video className="gif"
                src={gifSrc}
                playsInline={true}
                loop={true}
                autoPlay={true}
                muted={true}>
            </video>
        </div>
    );
}

interface GesturalCardSubstrateComponentProps {
    title: string;
}

const GesturalCardSubstrateComponent = ({ title }: GesturalCardSubstrateComponentProps) => {
    return (
        <div className="substrate">
            <h3 className="card-title card-description">{title}</h3>
            <img src={arrowLargeSVG} />
        </div>
    );
}
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
                    <button
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
                    </button>
                </div>
            </Card>
        </Grid2>
    );
};

export default CatalogCardComponent;



