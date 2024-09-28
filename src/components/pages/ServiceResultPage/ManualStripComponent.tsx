
import { useEffect, useRef } from "react";
import { tryJsonParse } from "../../../utill";
import VideoComponent from "../../VideoComponent";

import PopupContainer from "./InfoCards/PopupContainer";
import insertBlocks from "./blockInsertion";

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
    const cardType = localStorage.getItem("language") === "clear-language" ;
    useEffect(() => {
        insertBlocks(textRef, description, iconLinks);
    }, [description, iconLinks]);

    //console.log("iconLinks  ", iconLinks);
    //console.log("Id additional info cards ", additionIds);
    return (
        <div className="manual-strp true-manual">
            {!cardType && <VideoComponent class={"instruct-video"} gifSrc={gifLink}></VideoComponent>}
            <div className="manual">
                <PopupContainer additionIds={additionIds} />
                <pre ref={textRef} className="manual-text result-text">
                </pre>
            </div>
        </div>
    );
};

export default ManualStrpComponent;