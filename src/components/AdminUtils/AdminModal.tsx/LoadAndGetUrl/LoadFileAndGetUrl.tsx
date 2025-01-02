import React, { useRef, useState } from "react";
import { uploadToS3 } from "../../../../api/backendApi";
import { useFormContext } from "react-hook-form";
import styles from "./loadFileAndGetUrl.module.css"
import { CircularProgress } from "@mui/material";

interface LoadFileAndGetUrlProps {
    inputRef: React.RefObject<HTMLInputElement>;
    name: string;
}

const LoadFileAndGetUrl: React.FC<LoadFileAndGetUrlProps> = ({ inputRef, name }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setValue } = useFormContext();
    const [isUploading, setIsUploading] = useState(false); // Состояние загрузки
    const [isUploaded, setIsUploaded] = useState(false);  // Состояние завершенной загрузки

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const targetInput = inputRef.current;

        if (!targetInput) {
            console.error("Target input not found.");
            return;
        }

        const file = fileInput.files?.[0];
        if (!file) {
            console.error("No file selected.");
            return;
        }

        let folderType = "smth";
        if (file.type.includes("video")) {
            folderType = "videos";
        } else if (file.type.includes("image")) {
            folderType = "icons";
        }

        const formData = new FormData();
        formData.append("folder", folderType);
        formData.append("file", file);

        setIsUploading(true); // Начинаем загрузку
        setIsUploaded(false); // Сбрасываем состояние завершенной загрузки

        try {
            const response = await uploadToS3(formData);
            setValue(name, response.data.link);
            const inputEvent = new Event("input", { bubbles: true });
            inputRef.current.dispatchEvent(inputEvent);

            setIsUploaded(true); // Успешно загружено
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsUploading(false); // Завершаем загрузку
        }
    };

    return (
        <div className={styles["upload-container"]}>
            <button
                type="button"
                className={`${styles["upload-button"]} ${isUploaded ? styles["uploaded"] : ""}`}
                onClick={() => fileInputRef.current?.click()}
            >
                Загрузить
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            <div className={styles["upload-status"]}>
                {isUploading && <CircularProgress size={20}/>}
                {isUploaded && !isUploading && <div className={styles["checkmark"]}>✔</div>}
            </div>
        </div>
    );
};

export default LoadFileAndGetUrl;
