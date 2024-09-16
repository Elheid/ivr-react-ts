import { useEffect, useRef } from 'react';

interface TimerProps{
    timer: number;
}

const HomeReturnerComponent = (props: TimerProps) => {
    const idleTimerRef = useRef<number | null>(null); // Таймер

    const redirectToHome = () => {
        window.location.href = '/';
    };

    const resetIdleTimer = () => {
        if (idleTimerRef.current !== null) {
            clearTimeout(idleTimerRef.current);
        }
        idleTimerRef.current = window.setTimeout(redirectToHome, props.timer); // Таймер на 5 секунд
    };

    useEffect(() => {
        // Устанавливаем таймер и обработчики событий
        resetIdleTimer();

        const handleUserActivity = () => {
            resetIdleTimer();
        };

        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keypress', handleUserActivity);
        window.addEventListener('touchend', handleUserActivity);

        return () => {
            if (idleTimerRef.current !== null) {
                clearTimeout(idleTimerRef.current);
            }
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keypress', handleUserActivity);
            window.removeEventListener('touchend', handleUserActivity);
        };
    }, []);

    return null; // Компонент не рендерит ничего
};

export default HomeReturnerComponent;
