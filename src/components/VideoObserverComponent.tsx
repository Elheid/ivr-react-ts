import React, { useEffect, useRef } from 'react';

const VideoObserverComponent: React.FC<React.VideoHTMLAttributes<HTMLVideoElement>> = (props) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        if (!videoElement) return;

        const observerOptions: IntersectionObserverInit = {
            root: null,
            rootMargin: '10%',
            threshold: 0.99,
        };

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target as HTMLVideoElement;

                if (entry.isIntersecting) {
                    console.log("Play video " + video)
                    video.currentTime = 0;
                    video.play();
                } else {
                    console.log("Pause video " + video)
                    video.pause();
                }
            });
        }, observerOptions);

        videoObserver.observe(videoElement);

        return () => {
            videoObserver.unobserve(videoElement);
        };
    },  [props.src, props.poster]);

    return <video ref={videoRef} {...props} />;
};

export default VideoObserverComponent;
