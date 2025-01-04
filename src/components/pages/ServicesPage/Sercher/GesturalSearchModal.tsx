import { Box, Chip, IconButton, Modal } from "@mui/material";
import ModalStyle from "../../../../styles/modalStyle";
import LinkButtonComponent from "../../../ReturnButton";
import SearchPopupButtonComponent from "./SearchPopupButton";
import GesturalWebcamSearch from "../../../../api/GesturalWebcamSearch";
import { useSearchInput } from "../../../../contextProviders/SearchInputProvider";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import cameraOff from "../../../../assets/img/cameraOff.svg"
import cameraOn from "../../../../assets/img/cameraOn.svg"

import playSimple from "../../../../assets/img/playSimple.svg"
import pauseSimple from "../../../../assets/img/pauseSimple.svg"
import searchSVG from "../../../../assets/img/search.svg";

interface GesturalSearchModalProps {
    open:boolean, 
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleSearch: (query: string, navigate: NavigateFunction) => Promise<void>
}

const GesturalSearchModal = ({open, setOpen, handleSearch}: GesturalSearchModalProps)=>{
    const { inputValue, setInputValue } = useSearchInput();
    const navigate = useNavigate();

    const [record, setRecord] = useState(false);

    const [keyWords, setKeyWords] = useState<string[]>([]);


    const handleDeleteChip = (indexToDelete: number) => {
        setKeyWords((prevKeyWords) =>
            prevKeyWords.filter((_, index) => index !== indexToDelete)
        );
    };


    const handleClose = () => {
        document.querySelectorAll('video').forEach(video => {
            const stream = video.srcObject as MediaStream;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                video.srcObject = null;
            }
        });
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            stream.getVideoTracks().forEach(track => track.stop());
            stream.getTracks().forEach(track => stream.removeTrack(track));
        });
        setOpen(false);
        setRecord(false);
    }

    useEffect(()=>{
        setInputValue(keyWords.join(" "));
    }, [keyWords])

    return(
        <Modal
        open={open}
        onClose={() => {
            handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box
            className={"search-modal popup"}
            sx={ModalStyle}
        >
            <div className="search-popup-header">
                {/*<Typography className="popup-title title" variant="h4" gutterBottom>/Typography>*/}
                <div className="popup-icon-container">
                    {!record ? <img src={cameraOff}></img>
                        : <img src={cameraOn}></img>}
                </div>
                <IconButton className="close-info" id="closePopup" onClick={handleClose}>
                    &#x2716;
                </IconButton>
            </div>
            <div className="search-popup-main">
                {open &&
                <GesturalWebcamSearch
                record={record}
                setKeyWords={setKeyWords}
                onStartRecording={() => console.log('Recording started')}
                onStopRecording={() => console.log('Recording stopped')}
                open={open}
                />
                }
                {keyWords.length > 0 && 
                <div className="tag-list">
                    {keyWords.map((keyWord, index) => (
                        <Chip
                            className="tag"
                            key={index}
                            label={keyWord}
                            color="success"
                            onClick={() => console.log("Keyword clicked:", keyWord)}
                            onDelete={() => handleDeleteChip(index)}
                        />
                    ))}
                </div>}

            </div>
            <div className="search-popup-footer">
                <LinkButtonComponent onClick={handleClose} />
                {!record ?
                    <LinkButtonComponent classes="play-button" description="Начать запись" img={playSimple} onClick={() => setRecord(true)} />
                    :
                    <LinkButtonComponent classes="play-button" description="Остановить запись" img={pauseSimple} onClick={() => setRecord(false)} />
                }
                <SearchPopupButtonComponent img={searchSVG} description="Поиск" classes={"search-popup-button"} onClick={() => {
                    handleSearch(inputValue, navigate);
                    handleClose();
                    setKeyWords([]);
                    }} />
            </div>

        </Box>
    </Modal>
    );
}

export default GesturalSearchModal;