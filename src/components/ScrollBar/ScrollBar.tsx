import React, { useState, useEffect, useRef, useCallback } from 'react';

import style from './scrollbar.module.css'

///Не мой код, просто скопировал, и чуть подправил под себя

const Scrollbar = ({
    children,
    height,
    addArrowsButtons,
    alginRight,
    ...props
}: React.ComponentPropsWithoutRef<'div'> & {height?:string, addArrowsButtons?:boolean, alginRight:boolean}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollTrackRef = useRef<HTMLDivElement>(null);
    const scrollThumbRef = useRef<HTMLDivElement>(null);
    const observer = useRef<ResizeObserver | null>(null);
    const [thumbHeight, setThumbHeight] = useState(20);
    const [scrollStartPosition, setScrollStartPosition] = useState<number | null>(
        null
    );
    const [initialScrollTop, setInitialScrollTop] = useState<number>(0);
    const [isDragging, setIsDragging] = useState(false);

    function handleResize(ref: HTMLDivElement, trackSize: number) {
        const { clientHeight, scrollHeight } = ref;
        const calculatedHeight = (clientHeight / scrollHeight) * trackSize;
        setThumbHeight(Math.max(calculatedHeight, 20));
    }

    function handleScrollButton(direction: 'up' | 'down') {
        const { current } = contentRef;
        if (current) {
            const scrollAmount = direction === 'down' ? 200 : -200;
            current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
        }
    }

    const handleTrackClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();
            const { current: trackCurrent } = scrollTrackRef;
            const { current: contentCurrent } = contentRef;
            if (trackCurrent && contentCurrent) {
                const { clientY } = e;
                const rect = trackCurrent.getBoundingClientRect(); // Содержимое самого трека
                const trackTop = rect.top;
                const thumbOffset = -(thumbHeight / 2);
                const clickRatio = (clientY - trackTop + thumbOffset) / trackCurrent.clientHeight;
                const scrollAmount = Math.floor(clickRatio * contentCurrent.scrollHeight);
                contentCurrent.scrollTo({
                    top: scrollAmount,
                    behavior: 'smooth',
                });
            }
        },
        [thumbHeight]
    );

    const handleThumbPosition = useCallback(() => {
        if (
            !contentRef.current ||
            !scrollTrackRef.current ||
            !scrollThumbRef.current
        ) {
            return;
        }
        const { scrollTop: contentTop, scrollHeight: contentHeight } =
            contentRef.current;
        const { clientHeight: trackHeight } = scrollTrackRef.current;
        let newTop = (+contentTop / +contentHeight) * trackHeight;
        newTop = Math.min(newTop, trackHeight - thumbHeight);
        const thumb = scrollThumbRef.current;
        thumb.style.top = `${newTop}px`;
    }, [thumbHeight]);

    const handleThumbMousedown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        setScrollStartPosition(e.clientY);
        if (contentRef.current) setInitialScrollTop(contentRef.current.scrollTop);
        setIsDragging(true);
    }, []);
    
    const handleThumbMouseup = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isDragging) {
            setIsDragging(false);
        }
    }, [isDragging]);
    
    const handleThumbMousemove = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isDragging && contentRef.current) {
            const { scrollHeight: contentScrollHeight, offsetHeight: contentOffsetHeight } = contentRef.current;
    
            const deltaY = (e.clientY - (scrollStartPosition || 0)) * (contentOffsetHeight / thumbHeight);
            const newScrollTop = Math.min(initialScrollTop + deltaY, contentScrollHeight - contentOffsetHeight);
    
            contentRef.current.scrollTop = newScrollTop;
        }
    }, [isDragging, scrollStartPosition, thumbHeight, initialScrollTop]);

    // If the content and the scrollbar track exist, use a ResizeObserver to adjust height of thumb and listen for scroll event to move the thumb
    const regullateThumb = ()=>{
        const ref = contentRef.current;
        const trackRef = scrollTrackRef.current;
    
        if (ref && trackRef) {
            const handleResizeObserver = () => handleResize(ref, trackRef.clientHeight);
    
            observer.current = new ResizeObserver(handleResizeObserver);
            observer.current.observe(ref);
    
            // Рассчитываем размер на этапе монтирования с небольшой задержкой
            setTimeout(() => {
                handleResize(ref, trackRef.clientHeight);
            }, 0);  // Задержка на 0 мс, чтобы дать время для полной инициализации DOM
    
            ref.addEventListener('scroll', handleThumbPosition);
    
            return () => {
                observer.current?.disconnect();
                ref.removeEventListener('scroll', handleThumbPosition);
            };
        }
    }
    useEffect(() => {
        regullateThumb();
    }, [handleThumbPosition]);
    window.addEventListener('infoCardOpen', regullateThumb);
    // Listen for mouse events to handle scrolling by dragging the thumb
    useEffect(() => {
        document.addEventListener('mousemove', handleThumbMousemove);
        document.addEventListener('mouseup', handleThumbMouseup);
        document.addEventListener('mouseleave', handleThumbMouseup);
        return () => {
            document.removeEventListener('mousemove', handleThumbMousemove);
            document.removeEventListener('mouseup', handleThumbMouseup);
            document.removeEventListener('mouseleave', handleThumbMouseup);
        };
    }, [handleThumbMousemove, handleThumbMouseup]);

    return (
        <div className={!alginRight ? style["custom-scrollbars__container"] : style["custom-scrollbars__container_in_end"]}>
            <div style={{height: `${height}`}} className={style["custom-scrollbars__content"]} ref={contentRef} {...props}>
                {children}
            </div>
            <div className={addArrowsButtons ? style["custom-scrollbars__scrollbar"] : style["custom-scrollbars__scrollbar_without-buttons"]}>
                {addArrowsButtons && <button
                    className={style["custom-scrollbars__button"]}
                    onClick={() => handleScrollButton('up')}
                >
                    ⇑
                </button>}
                <div className={style["custom-scrollbars__track-and-thumb"]}>
                    <div
                        className={style["custom-scrollbars__track"]}
                        ref={scrollTrackRef}
                        onClick={handleTrackClick}
                        style={{ cursor: isDragging ? 'grabbing' : undefined }}
                    ></div>
                    <div
                        className={style["custom-scrollbars__thumb"]}
                        ref={scrollThumbRef}
                        onMouseDown={handleThumbMousedown}
                        style={{
                            height: `${thumbHeight}px`,
                            cursor: isDragging ? 'grabbing' : 'grab',
                        }}
                    ></div>
                </div>
                {addArrowsButtons && <button
                    className={style["custom-scrollbars__button"]}
                    onClick={() => handleScrollButton('down')}
                >
                    ⇓
                </button>}
            </div>
        </div>
    );
};

export default Scrollbar;
