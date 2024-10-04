
import { useEffect, useRef } from "react";
import { isAdmin, tryJsonParse } from "../../../utill";
import VideoComponent from "../../VideoComponent";

import PopupContainer from "./InfoCards/PopupContainer";
import insertBlocks from "./blockInsertion";
import ServiceResultButtonsComponent from "../../AdminUtils/ServiceResultButtonsComponent";

interface ManualStrpComponentProps {
    gifLink: string;
    description: string;
    iconLinks: string[];
    additionIds: number[];
}


const ManualStrpComponent = ({ gifLink, description, iconLinks, additionIds }: ManualStrpComponentProps) => {
    gifLink = tryJsonParse(gifLink, "resVideo")
    description = tryJsonParse(description, "description")

    const textRef = useRef<HTMLPreElement>(null);
    const videoRef = useRef(null);


    const cardType = localStorage.getItem("language") === "clear-language" ;
    useEffect(() => {
        insertBlocks(textRef, description, iconLinks);
    }, [description, iconLinks]);

    return (
        <div className="manual-strp true-manual">
            {!cardType && isAdmin() && <ServiceResultButtonsComponent ref={videoRef} /> }
            {!cardType &&
                <VideoComponent ref={videoRef} class={"instruct-video"} gifSrc={gifLink}></VideoComponent>
            }
            <div className="manual">
                <PopupContainer additionIds={additionIds} />
                {isAdmin() && <ServiceResultButtonsComponent ref={textRef}/> }
                <pre ref={textRef} className="manual-text result-text">
                </pre>
            </div>
        </div>
    );
};

export default ManualStrpComponent;