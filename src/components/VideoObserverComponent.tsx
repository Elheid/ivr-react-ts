import React, { useEffect, useRef, useState } from 'react';

const VideoObserverComponent: React.FC<React.VideoHTMLAttributes<HTMLVideoElement>> = (props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoErrCountRef = useRef<number>(0); // Счетчик количества ошибок загрузки
    const [isLoaded, setIsLoaded] = useState(false); // Флаг для отслеживания загрузки видео

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        // Функция для обработки события полной загрузки видео
        const handleLoadedData = () => {
            //console.log("Video loaded successfully.");
            setIsLoaded(true); // Устанавливаем флаг загрузки в true
            videoErrCountRef.current = 0; // Сброс счетчика при успешной загрузке
        };

        // Функция для обработки ошибки загрузки видео
        const handleError = () => {
            //console.log("Failed to load video. Trying to reload...");
            videoErrCountRef.current += 1; // Увеличиваем счетчик ошибок

            if (videoErrCountRef.current < 10) {
                videoElement.load(); // Перезагрузка видео
            } else {
                //console.error("Max retries reached. Video could not be loaded.");
                setIsLoaded(false); // Устанавливаем флаг загрузки в false
            }
        };

        // Обработчики событий загрузки и ошибки
        videoElement.addEventListener('loadeddata', handleLoadedData);
        videoElement.addEventListener('error', handleError);

        const observerOptions: IntersectionObserverInit = {
            root: null,
            rootMargin: '10%',
            threshold: 0.99,
        };

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target as HTMLVideoElement;

                if (entry.isIntersecting && isLoaded) { // Убедитесь, что видео загружено и элемент виден
                    //console.log("Play video " + video);
                    video.currentTime = 0;
                    video.play().catch((error) => {
                        console.error("Failed to play video:", error);
                    });
                } else {
                    //console.log("Pause video " + video);
                    video.pause();
                }
            });
        }, observerOptions);

        videoObserver.observe(videoElement);

        return () => {
            videoElement.removeEventListener('loadeddata', handleLoadedData);
            videoElement.removeEventListener('error', handleError);
            videoObserver.unobserve(videoElement);
        };
    }, [props.src, props.poster, isLoaded]);

    return <video ref={videoRef} {...props} />;
};

export default VideoObserverComponent;