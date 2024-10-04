import { Button } from "@mui/material"
import React, { forwardRef } from "react";


// Компонент ServiceResultButtonsComponent с поддержкой универсального рефа
const ServiceResultButtonsComponent = forwardRef(<T,>(_: unknown, ref: React.ForwardedRef<T>) => {
    // Проверка на наличие свойства `current`
    const handleClick = () => {
        if (ref && typeof ref === "object" && ref !== null && "current" in ref) {
            const element = ref.current;

            if (element instanceof HTMLElement) {
                // Для текстовых элементов (заголовки, абзацы, div и т.д.)
                if (element instanceof HTMLHeadingElement ||
                        element instanceof HTMLParagraphElement || 
                        element instanceof HTMLDivElement ||
                        element instanceof HTMLPreElement) {
                    alert(`Редактировать элемент: ${element.innerHTML}`);
                }
                // Для видео-элементов
                else if (element instanceof HTMLVideoElement) {
                    alert(`Редактировать элемент: видео, src = ${element.src}`);
                }
                // Для изображений
                else if (element instanceof HTMLImageElement) {
                    alert(`Редактировать элемент: изображение, src = ${element.src}`);
                }
                // Для других типов HTML-элементов (можно расширить при необходимости)
                else {
                    alert(`Редактировать элемент: ${element.tagName}, id = ${element.id}`);
                }
            } else {
                alert("Реф пустой или не поддерживает текущие проверки");
            }
        } else {
            alert("Реф не поддерживает объектное свойство `current`");
        }
    };


    return (
        <Button
            variant="contained"
            style={{ maxWidth: "10vw", margin: "10px" }}
            className="extended-button"
            onClick={handleClick}
        >
            Редактировать
        </Button>
    );
});

ServiceResultButtonsComponent.displayName = "ServiceResultButtonsComponent";

export default ServiceResultButtonsComponent;
