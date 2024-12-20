import React, { useEffect, useMemo, useState } from 'react';

import arrowSVG from "../../../../../assets/img/arrow.svg";

import styles from "../clearCard.module.css"
import { addSubHeaderForQuery, tryJsonParse } from '../../../../../utill';
import { Skeleton } from '@mui/material';
import { useLoadContext } from '../../../../../contextProviders/LoadMediaProvider';
import { useIconsQuery } from '../../../../../hooks/useIconsQuery';

/// Clear card components
interface ClearCardIconComponentProps {
    iconSrc: string;
    title: string;
    isService?: boolean;
    id?: number;
}

/*
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
}*/

const loadSVG = async (svgText: string, noColorize = false) => {
    
    /*const cacheKey = `${svgUrl}_${noColorize}`;
    const cacheName = 'svg-cache';

    // Открываем или создаем кэш
    const cache = await caches.open(cacheName);

    // Проверяем, есть ли ресурс в кеше
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
        return cachedResponse.url; // Возвращаем URL из кеша
    }*/

    try {
        //const response = await fetch(svgUrl);
        //const svgText = await response.text();

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

        if (!noColorize) {
            const fillElements = svgDoc.querySelectorAll('[fill]');
            fillElements.forEach((el) => {
                el.setAttribute('fill', '#ffffff');
            });
            svgDoc.documentElement.style.fill = 'white';
        }

        const blob = new Blob([svgDoc.documentElement.outerHTML], { type: 'image/svg+xml' });
        const blobUrl = URL.createObjectURL(blob);

        // Сохраняем ресурс в кэш
        //const responseToCache = new Response(blob, { headers: { 'Content-Type': 'image/svg+xml' } });
        //cache.put(cacheKey, responseToCache);

        return blobUrl;
    } catch (error) {
        console.error('Error loading or modifying SVG:', error);
    }
};


const ClearCardIconComponent = React.memo(({ iconSrc, title, isService, id }: ClearCardIconComponentProps) => {
    iconSrc = tryJsonParse(iconSrc, "image");
    const [icon, setIcon] = useState<string>(iconSrc);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Отслеживаем состояние загрузки

    const { registerIcon, setIconLoaded } = useLoadContext(); // Состояние загрузки

    let noColorize = false;
    if (title === "Консультация по СНИЛС" || title === "Непригодность паспорта" ||
        title === "Невозможность проставления отметок, а также невозможность изменения сведений о детях, не достигших 14-летнего возраста,отметки о которых ранее были внесены в паспорта родителей") {
        noColorize = true;
    }

    const serviceCard = !isService ? false : true;
    const idServicesExceptions = [92, 91, 93, 89, 95, 121, 90];
    if (serviceCard) {
        const serviceId = id ? id : -1;
        const isException = idServicesExceptions.includes(serviceId);
        if (isException) {
            noColorize = true;
        }
    }
    const {data: svgInfo } = useIconsQuery({svgUrl:iconSrc});
    const loadImage = useMemo(()=>loadSVG(svgInfo || "", noColorize),[svgInfo, noColorize])
    useEffect(() => {
        const strId = (id || -1).toString();
        registerIcon(strId)
        const fetchIcon = async () => {
            const iconUrl = await loadImage;
            if (iconUrl && svgInfo) {
                setIcon(iconUrl);
                setIsLoading(false); 
                setIconLoaded(strId);
            }
        }
        fetchIcon();
    }, [iconSrc, noColorize, registerIcon, setIconLoaded, id, loadImage, svgInfo]);

    const isHidden = isLoading ? "hidden" : ""; // Состояние видимости элемента
    const skeletonIsHidden = !isLoading ? "hidden" : "";



    return (
        <div className={styles["icon-container"]}>
            {<Skeleton  className={skeletonIsHidden} animation="wave" variant="rounded" height={"5vw"} />}
                <img className={isHidden} src={icon} alt="Icon" />
        </div>
    );
});



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