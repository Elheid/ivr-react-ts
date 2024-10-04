import { forwardRef, VideoHTMLAttributes } from "react";

interface VideoProps {
    class?: string;
    gifSrc: string;
}

const VideoComponent = forwardRef<HTMLVideoElement, VideoHTMLAttributes<HTMLVideoElement> & VideoProps>(
    (props, ref) => {
        return (
            <div className={props.class}>
                <video
                    ref={ref} // Назначаем ref на video
                    className="gif"
                    src={props.gifSrc}
                    playsInline={true}
                    loop={true}
                    autoPlay={true}
                    muted={true}
                ></video>
            </div>
        );
    }
);

export default VideoComponent;