
import { tryJsonParse } from "../../utill";
import VideoComponent from "../VideoComponent";

import PopupContainer from "./InfoCards/PopupContainer";

interface ManualStrpComponentProps{
    gifLink:string;
    description:string;
}

const ManualStrpComponent = ({gifLink, description}: ManualStrpComponentProps) => {
    gifLink = tryJsonParse(gifLink, "video")
    description = tryJsonParse(description, "description")
    return (
        <div className="manual-strp true-manual">
            <VideoComponent class={"instruct-video"} gifSrc={gifLink}></VideoComponent>
            <div className="manual">
                <PopupContainer />
                <pre className="manual-text result-text">
                    {description}
                </pre>
            </div>
        </div>
    );
};

export default ManualStrpComponent;