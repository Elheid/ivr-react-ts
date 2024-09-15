import React, { useEffect, useState } from 'react';

import arrowSVG from "../../../../assets/img/arrow.svg";

/// Clear card components
interface ClearCardIconComponentProps {
    iconSrc: string;
}
const loadSVG = async (svgUrl: string) => {
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
    childrenCount?: number;
    title: string;
}


const ClearCardHeader = ({ title, childrenCount }: ClearCardHeaderProps) => {
    return (
        <div className="card-header">
            <h3 className="card-title card-description">{title}</h3>
            <div className="card-footer">
                {childrenCount && <p className="count-services">услуг: {childrenCount}</p>}
                <img className="arrow-img" src={arrowSVG} alt="Arrow" />
            </div>
        </div>
    );
}
export {ClearCardHeader, ClearCardIconComponent}