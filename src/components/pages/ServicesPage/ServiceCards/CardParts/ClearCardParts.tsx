import { useEffect, useRef, useState } from 'react';

import arrowSVG from "../../../../../assets/img/arrow.svg";

import styles from "../clearCard.module.css"
import { useLoadContext } from '../../../../../contextProviders/LoadMediaProvider';
import { addSubHeaderForQuery, getCategoryTitleById, tryJsonParse } from '../../../../../utill';

/// Clear card components
interface ClearCardIconComponentProps {
    iconSrc: string;
    title: string;
    isService?: boolean;
    id?: number;
}
const loadSVG = async (svgUrl: string, noColorize = false) => {
    try {
        const response = await fetch(svgUrl);
        const svgText = await response.text();

        // Parse the SVG using svgo
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

        if (!noColorize) {
            const fillElements = svgDoc.querySelectorAll('[fill]');
            fillElements.forEach((el) => {
                el.setAttribute('fill', '#ffffff');
            });

            svgDoc.documentElement.style.fill = 'white';
        }

        // Create a new URL for the modified SVG
        const res = URL.createObjectURL(new Blob([svgDoc.documentElement.outerHTML], { type: 'image/svg+xml' }));;
        return res;

    } catch (error) {
        console.error('Error loading or modifying SVG:', error);
    }
}

const ClearCardIconComponent = ({ iconSrc, title, isService, id }: ClearCardIconComponentProps) => {
    //const getBlobIconUrl = loadSVG(iconSrc);
    iconSrc = tryJsonParse(iconSrc, "image")
    const [icon, setIcon] = useState<string>();
    const { setIconLoaded } = useLoadContext();

    let noColorize = false;
    if (title === "Консультация по СНИЛС") {
        noColorize = true;
    }
    if (title === "Непригодность паспорта") {
        noColorize = true;
    }
    if (title === "Невозможность проставления отметок, а также невозможность изменения сведений о детях, не достигших 14-летнего возраста,отметки о которых ранее были внесены в паспорта родителей") {
        noColorize = true;
    }
    const serviceCard = !isService ? false : true;
    const idServicesExceptions = [92, 91, 93, 89, 95, 121, 90]
    if (serviceCard) {
        const serviceId = id ? id : -1;
        const isException = idServicesExceptions.includes(serviceId);
        if (isException) {
            noColorize = true;
        }
    }


    useEffect(() => {
        const fetchIcon = async () => {
            const iconUrl = await loadSVG(iconSrc, noColorize);
            if (iconUrl) {
                await setIcon(iconUrl);
                setIconLoaded(true)
            }
        }
        fetchIcon();
    }, [iconSrc, setIconLoaded])
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


const ClearCardHeader = ({ title, itemsCount, subCategoriesCount, isFromQuery }: ClearCardHeaderProps & { isFromQuery: boolean }) => {
    const [subTitle, setSubTitle] = useState<string>("");

    useEffect(() => {
        addSubHeaderForQuery(title, isFromQuery, setSubTitle);
    }, [title]);

    const displayTitle = isFromQuery ? <><span className='query-sub-header'>{subTitle}</span>{title} </> : title;

    return (
        <div className={styles["card-header"]}>
            <h3 className={`${styles["card-title"]} card-description`}>
                {displayTitle}
            </h3>
            <div className={styles["card-footer"]}>
                {itemsCount && <p className={styles["count-services"]}>услуг: {itemsCount}</p>}
                {subCategoriesCount && <p className={styles["count-services"]}>подкатегорий: {subCategoriesCount}</p>}
                <img className="arrow-img" src={arrowSVG} alt="Arrow" />
            </div>
        </div>
    );
};
export { ClearCardHeader, ClearCardIconComponent }