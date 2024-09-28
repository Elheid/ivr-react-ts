import { useEffect, useLayoutEffect, useRef, useState } from "react";
import VideoComponent from "../../../VideoComponent";
import insertBlocks from "../blockInsertion";
import { getInfoById } from "../../../../api/backendApi";
import { tryJsonParse } from "../../../../utill";

interface InfoStrpComponentProps {
    id?:number;
    gifLink: string;
    description: string;
    iconLinks: string[];
}



const InfoCardResultComponent = ({ gifLink, description, iconLinks, id }: InfoStrpComponentProps) => {
    const textRef = useRef<HTMLPreElement>(null);
    const [cardDetails, setCardDetails] = useState<InfoStrpComponentProps>({gifLink:"", description:"", iconLinks:[""]});

    const cardId = id ? id : -1;

    const cardType = localStorage.getItem("language") === "clear-language";
    description = cardDetails.description ? tryJsonParse(cardDetails.description, "description") : description;
    useEffect(() => {
        insertBlocks(textRef, description, iconLinks);
    }, [description, iconLinks]);

    useLayoutEffect(() => {
        if (cardId !== -1) {
        // Заглушка для имитации запроса на сервер
        setTimeout(() => {
            getInfoById(cardId)
            .then((data) => {
                const card : InfoStrpComponentProps = data;
                setCardDetails(card);
            })
            .catch((err)=> console.log(err)
            );

            /*setCardDetails({
            id: cardId,
            gifLink: `Карточка ${cardId}`,
            description: `Это описание для карточки с ID ${cardId}`,
            iconLinks:[""]
            });*/
        }, 500);
        }
    }, [cardId]);

    if (!cardId) return null;


    return (
        <div className="manual-strp info-manual">
            {!cardType && <VideoComponent class={"instruct-video"} gifSrc={gifLink}></VideoComponent>}
            <div className="manual">
                <pre ref={textRef} className="manual-text result-text">
                </pre>
            </div>
        </div>
    );
}

export default InfoCardResultComponent