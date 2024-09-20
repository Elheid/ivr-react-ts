import React, { useEffect, useState } from 'react';

import arrowSVG from "../../../../assets/img/arrow.svg";

import styles from "../clearCard.module.css"
import { useLoadContext } from '../../../../contextProviders/LoadMediaProvider';
import { tryJsonParse } from '../../../../utill';

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
        iconSrc = tryJsonParse(iconSrc, "image")
        const [icon, setIcon] = useState<string>();
        const { setIconLoaded } = useLoadContext();

        useEffect(() => {
            const fetchIcon = async () => {
                const iconUrl = await loadSVG(iconSrc);
                if (iconUrl) {
                    await setIcon(iconUrl);
                    setIconLoaded(true)
                }
            }
            fetchIcon();
        }, [])
        return (
            <div className={styles["icon-container"]}>
                <img src={icon} alt="Icon" />
            </div>
        );
    }

interface ClearCardHeaderProps {
    itemsCount?: number;
    subCategoriesCount?: number;
    title: string;
}


const ClearCardHeader = ({ title, itemsCount, subCategoriesCount }: ClearCardHeaderProps) => {
    return (
        <div className={styles["card-header"]}>
            <h3 className={`${styles["card-title"]} card-description"`}>{title}</h3>
            <div className={styles["card-footer"]}>
                {itemsCount && <p className={styles["count-services"]}>услуг: {itemsCount}</p>}
                {subCategoriesCount && <p className={styles["count-services"]}>подкатегорий: {subCategoriesCount}</p>}
                <img className="arrow-img" src={arrowSVG} alt="Arrow" />
            </div>
        </div>
    );
}
export {ClearCardHeader, ClearCardIconComponent}