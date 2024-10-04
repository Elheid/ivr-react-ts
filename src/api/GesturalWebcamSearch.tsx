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
}

const GesturalWebcamSearch: React.FC<GesturalWebcamSearchProps> = ({ record, setKeyWords, onStartRecording, onStopRecording }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false); // Управляет отображением overlay

    const framesArr: string[] = [];
    const framesPac = 4;
    const prevWords: string[] = [];
    const prevResults: string[] = [];

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

    const stopWebcam = () => {
        if (videoRef.current) {
            const stream = videoRef.current.srcObject as MediaStream;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            videoRef.current.pause();
            videoRef.current.srcObject = null;
            videoRef.current.classList.remove("stream");
        }
    };

    const processMessage = (text: string) => {
        const results: string[] = Object.values(JSON.parse(text));
        console.log("Распознано ", results);
        if (!prevResults.includes(text)) {
            prevResults.push(text);
            const newKeyWords = results.filter(result => !prevWords.includes(result))[0];
            if (newKeyWords && newKeyWords !== 'нет жеста') {
                setKeyWords(prev => [...prev, newKeyWords]);
                prevWords.push(newKeyWords);
                console.log("Выведено ", newKeyWords);
            }
        }
    };

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
        prevResults.length = 0;
        stopSendingData();
    };

    useEffect(() => {
        startWebcam();
        connectToSocket();

        return () => {
            disconnectFromSocket();
            stopWebcam();
        };
    }, []);

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
