

interface VideoProps {
    class?: string;
    gifSrc: string;
}

const VideoComponent = (props: VideoProps) => {
    return (
        <div className={props.class}>
            <video
                className={`gif`}
                src={props.gifSrc}
                playsInline={true}
                loop={true}
                autoPlay={true}
                muted={true}>
            </video>
        </div>

    );
}

export default VideoComponent;