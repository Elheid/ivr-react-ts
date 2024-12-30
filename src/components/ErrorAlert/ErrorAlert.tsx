import { Alert } from "@mui/material";

// Функция для отображения ошибки
export const showErrorAlert = (error: string, onClose?: () => void, duration?:number) => {    
    let timeoutId : number | undefined;

    const AlertComponent = () => (
        <Alert
            className="my-error-alert"
            severity="error"
            onClose={handleClose}
        >
            {error}
        </Alert>
    );
    const component = <AlertComponent />;

    const handleClose = () => {
        if (duration) clearTimeout(timeoutId); 
        onClose?.();
        const alert = document.querySelector("my-error-alert");
        if (alert)
            document.body.removeChild(alert); 
    };

    // Компонент алерта
    if (duration){
        timeoutId = setTimeout(() => {
            handleClose();
        }, duration);
    }

    return {component}
};