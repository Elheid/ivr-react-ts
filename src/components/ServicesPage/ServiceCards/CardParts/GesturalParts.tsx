import arrowLargeSVG from "../../../../assets/img/arrowLarge.svg"
import { useLoadContext } from "../../../../contextProviders/LoadMediaProvider";
import VideoObserverComponent from "../../../VideoObserverComponent";
///Gestural card components 

import styles from '../gesturalCard.module.css'
// Интерфейс для описания ошибки
interface VideoError {
    message: string;
}

// Настраиваемый хук для управления видеоплеером

//Не помагает
/*
const useVideoHandleError = (videoUrl: string)=>{
    const [error, setError] = useState<VideoError | null>(null); // Состояние ошибки
    const videoRef = useRef<HTMLVideoElement>(null); // Ссылка на элемент видео
    let retryCount = 0; // Счетчик попыток
    const maxRetries = 3; // Максимальное количество попыток

    // Эффект для обработки ошибки загрузки видео
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            const error = event.error as VideoError;
            console.log(error)
            if (error.message.includes('net::ERR_CACHE_OPERATION_NOT_SUPPORTED') && retryCount < maxRetries) {
                retryCount++;
                setTimeout(() => {
                    videoRef.current!.src = videoUrl;
                    videoRef.current!.load();
                }, 1000 * retryCount); // Задержка между попытками
            } else {
                setError(error);
            }
        };

        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('error', handleError);
        }

        // Очистка обработчика при размонтировании компонента
        return () => {
            if (videoElement) {
                videoElement.removeEventListener('error', handleError);
            }
        };
    }, [videoUrl]);

    return { error, videoRef };
}*/

interface GesturalVideoComponentProps {
    gifSrc: string;
}

const GesturalVideoComponent = ({ gifSrc }: GesturalVideoComponentProps) => {
    //const { error, videoRef } = useVideoHandleError(gifSrc); // Замените URL на ваш
    const { setVideoLoaded } = useLoadContext();
    return (
        <div className={styles["video-overlay"]}>
            {/*error && <p>Ошибка загрузки видео: {error.message}</p>*/} 
            <VideoObserverComponent
                className={styles["gif"]}
                src={gifSrc}
                playsInline={true}
                loop={true}
                autoPlay={true}
                muted={true}
                onCanPlay={() => setVideoLoaded(true)}
                onCanPlayThrough={() => setVideoLoaded(true)}
                >

            </VideoObserverComponent>
        </div>
    );
}

interface GesturalCardSubstrateComponentProps {
    title: string;
}

const GesturalCardSubstrateComponent = ({ title }: GesturalCardSubstrateComponentProps) => {
    return (
        <div className={styles["substrate"]}>
            <h3 className={`${styles["card-title"]} card-description `}>{title}</h3>
            <img src={arrowLargeSVG} />
        </div>
    );
}

export {GesturalCardSubstrateComponent, GesturalVideoComponent}