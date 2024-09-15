import { Link, useLocation } from "react-router-dom";
import breadMiniSVG from "../../assets/img/breadMini.svg"
import { Breadcrumbs } from "@mui/material";
import { useEffect, useState } from "react";
import { getCategoryNameById } from "../../api/backendApi";


interface BreadCrumpComponentProps {
    destination: string;
    content?: string;
}

const BreadCrumpComponent = (props : BreadCrumpComponentProps) => {
    //const classes = `breadcrumb-item ${props.class}`;
    return (
        <div className={"breadcrumb-item page"}>
            <Link  aria-current="page" to={props.destination}>{props.content}</Link>
        </div>
    );
}

const BreadCrumpsComponent = () => {
    const arrowClasses = `arrow`;
    const arrowImg = breadMiniSVG;

        const [breadcrumbs, setBreadcrumbs] = useState<BreadCrumpComponentProps[]>([]);
        const location = useLocation();
        
        useEffect(() => {
        const updateBreadcrumbs = async () => {
            const paths = location.pathname.split('/').filter(x => x); // Разделение пути по "/"
            const searchParams = new URLSearchParams(location.search);
            const newBreadcrumbs: BreadCrumpComponentProps[] = [];

            // Добавляем главный элемент
            newBreadcrumbs.push({ destination: '/', content: 'Главное меню' });

            // Добавляем элементы для каждого сегмента пути
            let accumulatedPath = '';
            paths.forEach((path) => {
                accumulatedPath += `/${path}`;
                const destination = accumulatedPath;

                // Добавляем хлебные крошки для каждого сегмента
                newBreadcrumbs.push({
                    destination,
                    content: decodeURIComponent(path) === "services" ?'Выбор категорий': decodeURIComponent(path)
                });
            });

            // Обработка параметров запроса
            const categoryId = searchParams.get("categoryId");
            const subCategoryId = searchParams.get("sub-categoryId");

            if (categoryId || subCategoryId) {
                let content: string = 'Ошибка';

                if (categoryId) {
                    // Получаем название категории асинхронно
                    content = await getCategoryNameById(Number(categoryId));
                } else if (subCategoryId) {
                    content = `Подкатегория ${subCategoryId}`;
                }

                newBreadcrumbs.push({
                    destination: `${location.pathname}?${searchParams.toString()}`,
                    content,
                });
            }

            setBreadcrumbs(newBreadcrumbs);
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
    }, [location]);

    return (
        <Breadcrumbs 
        className="header-list" 
        aria-label="breadcrumb" 
        sx={{width:'100%'}}
        separator={<img className={arrowClasses} src={arrowImg} alt="arrow-svg"/>}
        >
            {/*<BreadCrumpComponent  destination={"/"} class={"prev-page"} content={"Главное меню"}/>
            <BreadCrumpComponent  destination={"/services"} class={"current-page"} content={"Выбор категорий"}/>*/}
            {breadcrumbs.map((breadcrumb, index) => (
                <BreadCrumpComponent
                    key={index} // Ensure unique key for each card
                    destination={breadcrumb.destination} 
                    content={breadcrumb.content}
                    />
            ))}

        </Breadcrumbs>
    );
}


export default BreadCrumpsComponent;