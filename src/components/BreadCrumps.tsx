import { Link, useLocation, useParams } from "react-router-dom";
import breadMiniSVG from "../assets/img/breadMini.svg"
import { Breadcrumbs } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getCategoryTitleById, myFunctionWithDelay } from "../utill";


interface BreadCrumpComponentProps {
    destination: string;
    content?: string;
    fontSize?: number;
}


//Разобраться как это работает
const BreadCrumpsComponent = () => {
    const BASE_FONT_SIZE = 1.2;
    const MIN_FONT_SIZE = BASE_FONT_SIZE - 0.7;
    const arrowClasses = `arrow`;
    const arrowImg = breadMiniSVG;

    const [breadcrumbs, setBreadcrumbs] = useState<BreadCrumpComponentProps[]>([]);
    const location = useLocation();
    const { categoryId } = useParams<{ categoryId?: string }>();
    const { subCategoryId } = useParams<{ subCategoryId?: string }>();

    const categoryIdFromUrl = categoryId;
    const subCategoryIdFromUrl = subCategoryId;



    const [fontSize, setFontSize] = useState(BASE_FONT_SIZE); // Начальный размер шрифта
    const breadcrumbContainerRef = useRef<HTMLDivElement>(null);
    const prevFontSizes = useRef<number[]>([]);
    const prevBreadcrumbsLength = useRef<number>(breadcrumbs.length);

    useEffect(() => {
        const updateFontSize = () => {
            const container = breadcrumbContainerRef.current;
            if (container) {
                const containerWidth = container.offsetWidth; // Ширина контейнера

                let totalBreadcrumbWidth = 0;
                const breadcrumbElements = container.querySelectorAll('.breadcrumb-item');
                breadcrumbElements.forEach((breadcrumb: Element) => {
                    const breadcrumbWidth = (breadcrumb as HTMLElement).offsetWidth;
                    totalBreadcrumbWidth += breadcrumbWidth;
                });

                if (totalBreadcrumbWidth + 50 < containerWidth && prevBreadcrumbsLength.current > breadcrumbs.length) {
                    const previousFontSize = prevFontSizes.current.pop();
                    setFontSize(previousFontSize || BASE_FONT_SIZE);
                }
                if (totalBreadcrumbWidth === containerWidth) return;

                // Если ширина хлебных крошек больше ширины контейнера
                if (totalBreadcrumbWidth - 100 > containerWidth && fontSize > MIN_FONT_SIZE) {
                    setFontSize(prevFontSize => {
                        prevFontSizes.current.push(prevFontSize);
                        return Math.max(prevFontSize - 0.2, MIN_FONT_SIZE);
                    });
                }

            }
        };

        const handleResize = () => {
            setFontSize(BASE_FONT_SIZE); // Сброс шрифта при изменении окна
            updateFontSize();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener("DOMContentLoaded", handleResize);
        window.addEventListener("breadcrumps-update", handleResize)

        updateFontSize(); // Вызов функции при монтировании компонента

        prevBreadcrumbsLength.current = breadcrumbs.length;
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener("DOMContentLoaded", handleResize);
            window.removeEventListener("breadcrumps-update", handleResize)
        };
    }, [breadcrumbs, fontSize, MIN_FONT_SIZE]);


    useEffect(() => {
        const eventBreadUpdate = new CustomEvent("breadcrumps-update")
        const updateBreadcrumbs = async () => {
            window.dispatchEvent(eventBreadUpdate);
            const paths = location.pathname.split('/').filter(x => x); // Разделение пути по "/"
            const searchParams = new URLSearchParams(location.search);
            const newBreadcrumbs: BreadCrumpComponentProps[] = [];
            const storageOfBreadCrumbs = localStorage.getItem("breadcrumbs");
            if (paths.includes("result")){
                setBreadcrumbs(
                JSON.parse(
                    storageOfBreadCrumbs !== null
                        ? storageOfBreadCrumbs
                        : "Error"))
                        
                const title = document.querySelector(".res-title")?.textContent || "Error";
                const newBreadCrumbElement:BreadCrumpComponentProps = ({
                    destination: location.pathname,
                    content: title,
                });
                setBreadcrumbs((prevBreadcrumbs) => [...prevBreadcrumbs, newBreadCrumbElement]);
                myFunctionWithDelay(()=>window.dispatchEvent(eventBreadUpdate), 100);
            } 
            else {
                newBreadcrumbs.push({ destination: '/', content: 'Главное меню' });

                let accumulatedPath = '';

                for (const path of paths) {
                    accumulatedPath += `/${path}`;
                    const destination = accumulatedPath;

                    let title: string = "Error";
                    const categoryId = categoryIdFromUrl//searchParams.get("categoryId") || categoryIdFromUrl;
                    const subCategoryId = subCategoryIdFromUrl//searchParams.get("subCategoryId");
                    if (categoryId || subCategoryId) {
                        if (categoryId) title = getCategoryTitleById(Number(categoryId));//await getCategoryNameById(Number(categoryId));
                        if (subCategoryId) title = getCategoryTitleById(Number(subCategoryId))//`Подкатегория ${subCategoryId}`;
                    }

                    // Добавляем хлебные крошки для каждого сегмента
                    newBreadcrumbs.push({
                        destination: decodeURIComponent(path) === "subCategories" ? "/services" : destination,
                        content: decodeURIComponent(path) === "services" || decodeURIComponent(path) === "subCategories" ? 'Выбор категорий' : title
                    });
                };

                // Обработка параметров запроса
                const query = searchParams.get("query");

                if (query) {
                    let content: string = 'Ошибка';

                    if (query) content = `Результаты поиска`;


                    newBreadcrumbs.push({
                        destination: searchParams.size > 0 ? `${location.pathname}?${searchParams.toString()}` : `${location.pathname}`,
                        content,
                    });
                }
                setBreadcrumbs(newBreadcrumbs);
                window.dispatchEvent(eventBreadUpdate);
                localStorage.setItem("breadcrumbs", JSON.stringify(newBreadcrumbs))
            }
        };

        updateBreadcrumbs();

        // Слушатель изменений в истории
        const handlePopState = () => {
            updateBreadcrumbs();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [location, categoryIdFromUrl, subCategoryIdFromUrl]);

    return (
        <div ref={breadcrumbContainerRef}>
            <Breadcrumbs
                className="header-list"
                aria-label="breadcrumb"
                sx={{
                    width: '100%',
                    flexWrap: "nowrap",
                    whiteSpace: 'nowrap', // Хлебные крошки не будут переноситься
                    overflow: 'hidden',   // Скрываем излишки
                }}
                separator={<img className={arrowClasses} src={arrowImg} alt="arrow-svg" />}
            >
                {/*<BreadCrumpComponent  destination={"/"} class={"prev-page"} content={"Главное меню"}/>
            <BreadCrumpComponent  destination={"/services"} class={"current-page"} content={"Выбор категорий"}/>*/}
                {breadcrumbs.map((breadcrumb, index) => (
                    <div key={index} className={"breadcrumb-item page"}>
                        <Link aria-current="page" to={breadcrumb.destination}>
                            <span style={{ fontSize: `${fontSize}vw` }}>{breadcrumb.content}</span>
                        </Link>
                    </div>

                ))}

            </Breadcrumbs>
        </div>

    );
}


export default BreadCrumpsComponent;