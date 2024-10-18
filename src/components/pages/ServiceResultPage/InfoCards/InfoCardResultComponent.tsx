import { useEffect, useLayoutEffect, useRef, useState } from "react";
import VideoComponent from "../../../VideoComponent";
import insertBlocks from "../blockInsertion";
import { useInfoCardsQuery } from "../../../../hooks/useCategoriesQuery";
import { useParams } from "react-router-dom";

interface InfoStrpComponentProps {
    id?:number;
    gifLink: string;
    description: string;
    iconLinks: string[];
}



const InfoCardResultComponent = ({ id }: {id?:number}) => {
    const textRef = useRef<HTMLPreElement>(null);
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
        setCardDetails(infoCard as InfoStrpComponentProps)
    }, [cardId, infoCardInfo]);

    if (!cardId) return null;

    return (
        <>
        {!isInfoLoading &&
        (<div className="manual-strp info-manual">
            {!cardType && <VideoComponent class={"instruct-video"} gifSrc={cardDetails?.gifLink || ""}></VideoComponent>}
            <div className="manual">
                <pre ref={textRef} className="manual-text result-text">
                </pre>
            </div>
        </div>)}
        </>
    );
}

export default InfoCardResultComponent