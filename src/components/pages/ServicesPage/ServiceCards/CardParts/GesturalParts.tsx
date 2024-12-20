//import { useEffect, useRef, useState } from "react";
import arrowLargeSVG from "../../../../../assets/img/arrowLarge.svg"
import VideoObserverComponent from "../../../../VideoObserverComponent";
///Gestural card components 

import styles from '../gesturalCard.module.css'
import { addSubHeaderForQuery, tryJsonParse } from "../../../../../utill";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { useLoadContext } from "../../../../../contextProviders/LoadMediaProvider";

interface GesturalVideoComponentProps {
    gifSrc: string;
    id:number;
}


const GesturalVideoComponent = React.memo(({ gifSrc, id }: GesturalVideoComponentProps) => {
    gifSrc = tryJsonParse(gifSrc, "video");
    const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
    const { registerVideo, setVideoLoaded } = useLoadContext(); // Состояние загрузки

    const handleVideoCanPlay = () => {
        //console.log("Видео готово к воспроизведению (onCanPlay)"); // Логируем событие onCanPlay
        setIsLoading(false);
        setVideoLoaded(id.toString());
    };
    useEffect(()=>{
        registerVideo(id.toString());
    },[id, registerVideo])

    const isHidden = isLoading ? "hidden" : ""; // Состояние видимости элемента
    const skeletonIsHidden = !isLoading ? "hidden" : "";
    return (
        <div className={styles["video-overlay"]}>
                <Skeleton
                className={`${skeletonIsHidden}`}
                animation="wave"
                variant="rectangular"
                width="auto"
                height="38vh"/>
                <VideoObserverComponent
                    className={`${styles["gif"]} ${isHidden}`}
                    src={gifSrc}
                    playsInline
                    loop
                    autoPlay
                    muted
                    preload="auto"
                    onCanPlay={handleVideoCanPlay} // Когда видео готово для воспроизведения
                />
        </div>
    );
});




interface GesturalCardSubstrateComponentProps {
    title: string;
}

const GesturalCardSubstrateComponent = ({ title, isFromQuery }: GesturalCardSubstrateComponentProps & {isFromQuery:boolean}) => {
    const [subTitle, setSubTitle] = useState<string>("");
    useEffect(() => {
        addSubHeaderForQuery(title, isFromQuery, setSubTitle);
    }, [title]);

    const displayTitle = isFromQuery ? <><span className='query-sub-header'>{subTitle}</span>{title} </> : title;
    return (
        <div className={styles["substrate"]}>
            <h3 className={`${styles["card-title"]} card-description `}>
                {displayTitle}
            </h3>
            <img src={arrowLargeSVG} />
        </div>
    );
}

export {GesturalCardSubstrateComponent, GesturalVideoComponent}