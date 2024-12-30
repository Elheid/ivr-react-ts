import { Link, useLocation, useParams } from "react-router-dom";
import breadMiniSVG from "../assets/img/breadMini.svg"
import { Breadcrumbs, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getCategoryTitleById, myFunctionWithDelay } from "../utill";
import { myButtonStyle } from "../styles/myColoredButton";


const STORAGE_KEY = 'categoriesIds'; // Ключ для localStorage

// Функция для сохранения Set<string> в localStorage
const saveCategoriesToStorage = (categoriesSet: Set<string>) => {
    const categoriesArray = Array.from(categoriesSet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categoriesArray));
};


// Функция для восстановления Set<string> из localStorage
const loadCategoriesFromStorage = (): Set<string> => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        try {
            const categoriesArray = JSON.parse(storedData)
            if (Array.isArray(categoriesArray)) {
                return new Set(categoriesArray)
            } else {
                console.error('Invalid data in localStorage')
                return new Set()
            }
        } catch (error) {
            console.error('Error parsing data from localStorage:', error);
            return new Set()
        }
    }
    return new Set();
};


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

    const categoriesIdsRef = useRef<Set<string>>(new Set<string>());

    useEffect(() => {
        const savedCategories = loadCategoriesFromStorage()
        categoriesIdsRef.current = savedCategories
    }, [])

    useEffect(() => {
        const eventBreadUpdate = new CustomEvent("breadcrumps-update")
        const updateBreadcrumbs = async () => {
            window.dispatchEvent(eventBreadUpdate);
            const paths = location.pathname.split('/').filter(x => x); // Разделение пути по "/"
            const searchParams = new URLSearchParams(location.search);
            const newBreadcrumbs: BreadCrumpComponentProps[] = [];
            const storageOfBreadCrumbs = localStorage.getItem("breadcrumbs");
            if (paths.includes("result")) {
                setBreadcrumbs(
                    JSON.parse(
                        storageOfBreadCrumbs !== null
                            ? storageOfBreadCrumbs
                            : "Error"))

                const title = document.querySelector(".res-title")?.textContent || "Error";
                const newBreadCrumbElement: BreadCrumpComponentProps = ({
                    destination: location.pathname,
                    content: title,
                });
                setBreadcrumbs((prevBreadcrumbs) => [...prevBreadcrumbs, newBreadCrumbElement]);
                myFunctionWithDelay(() => window.dispatchEvent(eventBreadUpdate), 100);
            }
            else {
                newBreadcrumbs.push({ destination: '/', content: 'Главное меню' });

                let accumulatedPath = '';


                for (const path of paths) {
                    accumulatedPath += `/${path}`;
                    const destination = accumulatedPath;

                    const isChooseCatPath = decodeURIComponent(path) === "services" || decodeURIComponent(path) === "subCategories";

                    let title: string = "Error";
                    const categoryId = categoryIdFromUrl//searchParams.get("categoryId") || categoryIdFromUrl;
                    const subCategoryId = subCategoryIdFromUrl//searchParams.get("subCategoryId");
                    if (categoryId) categoriesIdsRef.current.add(categoryId)
                    if (subCategoryId) categoriesIdsRef.current.add(subCategoryId)
                    //const lastParam = Number(getLastParam());
                    if ((categoryId || subCategoryId) && !isChooseCatPath) {
                        /*if (categoryId && subCategoryId) title = getCategoryTitleById(lastParam)
                        else*/ if (categoryId && categoryId === path) title = getCategoryTitleById(Number(categoryId));//await getCategoryNameById(Number(categoryId));
                        else if (subCategoryId && subCategoryId === path) title = getCategoryTitleById(Number(subCategoryId))//`Подкатегория ${subCategoryId}`;
                        else if (categoriesIdsRef.current.has(path)) title = getCategoryTitleById(Number(path))
                    }

                    // Добавляем хлебные крошки для каждого сегмента
                    newBreadcrumbs.push({
                        destination: decodeURIComponent(path) === "subCategories" ? "/services" : destination,
                        content: isChooseCatPath ? 'Выбор категорий' : title
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
                saveCategoriesToStorage(categoriesIdsRef.current)
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



    /*Добавление выпадающего списка*/

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Ограничиваем отображение крошек
    const renderBreadcrumbs = () => {
        if (breadcrumbs.length <= 4) {
            // Если крошек 4 или меньше, отображаем все
            return breadcrumbs.map((breadcrumb, index) => (
                <div key={index} className="breadcrumb-item">
                    <Link to={breadcrumb.destination}>
                        <span style={{ fontSize: `${BASE_FONT_SIZE}vw` }}>{breadcrumb.content}</span>
                    </Link>
                </div>
            ));
        }

        const first = breadcrumbs[0];
        const second = breadcrumbs[1];
        const last = breadcrumbs[breadcrumbs.length - 1];
        const hiddenBreadcrumbs = breadcrumbs.slice(2, -1); // Скрываем всё между второй и последней

        return [
            <div className="breadcrumb-item">
                <Link to={first.destination}>
                    <span style={{ fontSize: `${BASE_FONT_SIZE}vw` }}>{first.content}</span>
                </Link>
            </div>,
            <div className="breadcrumb-item">
                <Link to={second.destination}>
                    <span style={{ fontSize: `${BASE_FONT_SIZE}vw` }}>{second.content}</span>
                </Link>
            </div>,
            <div className="breadcrumb-item">
                <Button sx={{background:"white", ...myButtonStyle}} size="small" onClick={handleClick}>
                    <span style={{ color: "black",  WebkitTextStroke: "0.5px black"}}>...</span>
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="hidden-breadcrumbs-menu"
                >
                    {hiddenBreadcrumbs.map((breadcrumb, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => {
                                handleClose();
                                window.location.href = breadcrumb.destination;
                            }}
                        >
                            {breadcrumb.content}
                        </MenuItem>
                    ))}
                </Menu>
            </div>,

            <div className="breadcrumb-item">
                <Link to={last.destination}>
                    <span style={{ fontSize: `${BASE_FONT_SIZE}vw` }}>{last.content}</span>
                </Link>
            </div>,

        ];
    };

    return (
        <div ref={breadcrumbContainerRef}>
            <Breadcrumbs
                className="header-list"
                aria-label="breadcrumb"
                sx={{
                    width: '100%',
                    flexWrap: "nowrap",
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}
                separator={<img className={arrowClasses} src={arrowImg} alt="arrow-svg" />}
            >
                {renderBreadcrumbs()}
            </Breadcrumbs>
        </div>
    );

    /*Старый список */
    /*
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
    */
};

export default BreadCrumpsComponent;