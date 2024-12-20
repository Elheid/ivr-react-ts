import { useEffect, useLayoutEffect, useRef, useState } from "react";
import VideoComponent from "../../../VideoComponent";
import {insertBlocks} from "../blockInsertion";
import { useInfoCardsQuery } from "../../../../hooks/useCardsQuery";
import { useParams } from "react-router-dom";
import ServiceResultButtonsComponent from "../../../AdminUtils/ServiceResultButtonsComponent";
import { isAdmin } from "../../../../utill";

interface InfoStrpComponentProps {
    id?:number;
    gifLink: string;
    description: string;
    iconLinks: string[];
}



const InfoCardResultComponent = ({ setTitle, id }: {setTitle:React.Dispatch<React.SetStateAction<string>>;id?:number}) => {
    const textRef = useRef<HTMLPreElement>(null);

    const vidRef = useRef<HTMLVideoElement>(null);
    const [cardDetails, setCardDetails] = useState<InfoStrpComponentProps | null>(null);

    const cardId = id ? id : -1;

    const cardType = localStorage.getItem("language") === "clear-language";
    const { serviceId } = useParams<{ serviceId?: string }>();
    const serviceUrlId = serviceId ? Number(serviceId) : -1;
    const {data: infoCardInfo, isLoading: isInfoLoading } = useInfoCardsQuery({serviceId:serviceUrlId});
    //description = cardDetails.description ? tryJsonParse(cardDetails.description, "description") : description;
    useEffect(() => {
        if (cardDetails)
            insertBlocks(textRef, cardDetails.description, cardDetails.iconLinks);
    }, [cardDetails]);

    useLayoutEffect(() => {
        const infoCard = infoCardInfo?.filter((card)=>card.id === cardId)[0]
        if (infoCard?.title)
            //console.log(infoCard?.title)
            setTitle(infoCard?.title)
        setCardDetails(infoCard as InfoStrpComponentProps)
    }, [cardId, infoCardInfo, setTitle]);

    if (!cardId) return null;

    return (
        <>
        {!isInfoLoading &&
        (<div className="manual-strp info-manual">
            {!cardType && 
            <>
            {isAdmin() &&<ServiceResultButtonsComponent extendedClass={"to-info-card"} ref={vidRef} />}
            <VideoComponent ref={vidRef} class={"instruct-video"} gifSrc={cardDetails?.gifLink || ""}></VideoComponent>
            </>
            }
            <div className="manual">
                {isAdmin() &&<ServiceResultButtonsComponent extendedClass={"to-info-card"} ref={textRef} />}
                <pre ref={textRef} className="manual-text result-text">
                </pre>
            </div>
        </div>)}
        </>
    );
}

export default InfoCardResultComponent