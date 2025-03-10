import React, { useEffect, useRef, useState } from 'react';
import { API_GESTURAL_URL } from '../assets/data/constants';
import { io } from 'socket.io-client';

const interval = 1000 / 30;
const socketURL = API_GESTURAL_URL;
const socket = io(socketURL, {
    path: '/rsl-filter/socket.io/',
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
    extraHeaders: {
        "ngrok-skip-browser-warning": "true"
    }
});

interface GesturalWebcamSearchProps {
    record: boolean;
    setKeyWords:React.Dispatch<React.SetStateAction<string[]>>
    onStartRecording: () => void;
    onStopRecording: () => void;
    open:boolean;
}



const GesturalWebcamSearch: React.FC<GesturalWebcamSearchProps> = ({ record, setKeyWords, onStartRecording, onStopRecording, open }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);




    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false); // Управляет отображением overlay

    const framesArr: string[] = [];
    const framesPac = 4;
    const [prevWords, setPrevWords]= useState<string[]>([]);
    const prevResults= useRef<string[]>([]);

    const startWebcam = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.classList.add("stream");
                }
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (context) {
                    canvas.width = 224;
                    canvas.height = 224;
                    canvasRef.current = canvas;
                    contextRef.current = context;
                }
            })
            .catch(err => {
                console.error('Error accessing webcam:', err);
            });
    };

    const stopAllActiveStreams = () => {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
                if (videoDevices.length > 0) {
                    videoDevices.forEach(() => {
                        navigator.mediaDevices.getUserMedia({ video: true })
                            .then(stream => {
                                stream.getTracks().forEach(track => {
                                    track.stop(); // Останавливаем каждый трек
                                });
                            })
                            .catch(err => console.error('Error stopping streams:', err));
                    });
                }
            })
            .catch(err => console.error('Error enumerating devices:', err));
    };
    
    const stopAllMediaTracks = () => {
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
    };
    

    const stopWebcam = () => {
        canvasRef.current = null;
        stopAllActiveStreams();
        stopAllMediaTracks()
       /* if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null); // Удаляем поток из состояния
        }
        else if (videoRef.current) {
            const stream = videoRef.current.srcObject as MediaStream;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            videoRef.current.pause();
            videoRef.current.srcObject = null;
            videoRef.current.classList.remove("stream");
        }
        else{
            stopAllActiveStreams();
            stopAllMediaTracks()
        }*/
    };

    const processMessage = (text: string) => {
        try {
            const results: string[] = Object.values(JSON.parse(text));
            console.log("Распознано ", results);
            
            /*const uniqueResults = new Set(prevResults.current);
            results.forEach(result => uniqueResults.add(result));
            prevResults.current = Array.from(uniqueResults);*/
           // const newKeyWords = results.filter(result => !prevWords.includes(result));

            /*const isResultsAlreadyAdded = results.some(result =>
                prevResults.current.includes(result)
            );
    
            if (!isResultsAlreadyAdded) {
                // Если results ещё не добавлены, добавляем их
                prevResults.current.push(...results);
    
                const newKeyWords = results.filter(result => !prevWords.includes(result));*/
    
            //const newKeyword = results.find(result => !prevResults.current.includes(result));
            const newKeyword = results[0];
            if (newKeyword) {
            // Добавляем найденное слово в prevResults.current
                prevResults.current.push(newKeyword);
                const newKeyWords = [newKeyword]
                if (newKeyWords.length > 0) {
                    newKeyWords.forEach(keyword => {
                        if (keyword !== 'нет жеста') {
                            setKeyWords(prev => [...prev, keyword]);
                            setPrevWords(prev => [...prev, keyword]);
                            console.log("Выведено ", keyword);
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Ошибка при обработке сообщения: ", error);
        }
    };

/*
    const processMessage = (text: string) => {
        const results: string[] = Object.values(JSON.parse(text));
        console.log("Распознано ", results);
        if (!prevResults.current.includes(text)) {
            prevResults.current.push(text);
            const newKeyWords = results.filter(result => !prevWords.includes(result))[0];
            if (newKeyWords && newKeyWords !== 'нет жеста') {
                setKeyWords(prev => [...prev, newKeyWords]);
                setPrevWords(prev => [...prev, newKeyWords]);
                console.log("Выведено ", newKeyWords);
            }
        }
    };*/

    const onReceiveText = (text: string) => {
        console.log(text);
        processMessage(text);
    };

    const addFrameSender = () => {
        if (canvasRef.current && contextRef.current && videoRef.current) {
            contextRef.current.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const data = canvasRef.current.toDataURL('image/jpeg', 0.5);
            framesArr.push(data);

            if (framesArr.length === framesPac) {
                socket.emit('data', framesArr);
                framesArr.length = 0; // Clear the array
            }

            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    const startSendingData = () => {
        if (intervalId) clearInterval(intervalId);

        const id = setInterval(() => {
            if (socket.connected) {
                addFrameSender();
            }
        }, interval);

        setIntervalId(id);
        setIsRecording(true);
        onStartRecording();
    };

    const stopSendingData = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        setIsRecording(false);
        onStopRecording();
    };

    const connectToSocket = () => {
        socket.on("send_not_normalize_text", onReceiveText);
        socket.on("message", onReceiveText);
        socket.on("connect", () => console.log("Connected to socket"));
        socket.on("disconnect", () => console.log("Disconnected from socket"));
        socket.connect();
    };

    const disconnectFromSocket = () => {
        socket.disconnect();
        socket.off("connect");
        socket.off("disconnect");
        socket.off("message", onReceiveText);
        prevWords.length = 0;
        prevResults.current.length = 0;
        stopSendingData();
    };

    useEffect(() => {
        if (open){
            startWebcam();
            connectToSocket();
        }

        return () => {
            stopWebcam();
            disconnectFromSocket();
        };
    }, [open]); 

    useEffect(() => {
        if (record) {
            startSendingData();
        } else {
            stopSendingData();
        }
    }, [record]);

    return (
        <div style={{ position: 'relative', marginTop:"20px"}}>
            <video 
            ref={videoRef} 
            id="videoInst" autoPlay 
            style={{
                position: 'relative',
                top: '0%',
                left: '50%',
                transform: 'translate(-50%, 0)',
                borderRadius:"30px"
            }}
            />
            {!isRecording && (
                <div
                    style={{
                        position: 'absolute',
                        top: '0%',
                        left: '50%',
                        transform: 'translate(-50%, 0)',
                        width: '100%',
                        height: '100%',
                        minHeight:"50vh",
                        minWidth:"25vw",
                        borderRadius:"30px",
                        
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1,
                    }}
                >
                    <h2>Распознование жестов не начато,
                        <br/> пожалуйста для начала распознавания 
                        <br/>нажмите кнопку "Начать запись" ниже
                    </h2>
                </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default GesturalWebcamSearch;
