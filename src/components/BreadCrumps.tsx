import { Link, useLocation, useParams } from "react-router-dom";
import breadMiniSVG from "../assets/img/breadMini.svg"
import { Breadcrumbs } from "@mui/material";
import { useEffect, useState } from "react";
import { getTitleById } from "../utill";


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
//Разобраться как это работает
const BreadCrumpsComponent = () => {
    const arrowClasses = `arrow`;
    const arrowImg = breadMiniSVG;

        const [breadcrumbs, setBreadcrumbs] = useState<BreadCrumpComponentProps[]>([]);
        const location = useLocation();
        const { categoryId } = useParams<{ categoryId?: string }>();
        const categoryIdFromUrl = categoryId;

        
        useEffect(() => {
        const updateBreadcrumbs = async () => {
            const paths = location.pathname.split('/').filter(x => x); // Разделение пути по "/"
            const searchParams = new URLSearchParams(location.search);
            const newBreadcrumbs: BreadCrumpComponentProps[] = [];
            const storageOfBreadCrumbs = localStorage.getItem("breadcrumbs");
            if (paths.includes("result")) setBreadcrumbs(
                JSON.parse(
                    storageOfBreadCrumbs !== null 
                    ? storageOfBreadCrumbs
                    : "Error"))
            else {
            // Добавляем главный элемент
            newBreadcrumbs.push({ destination: '/', content: 'Главное меню' });

            // Добавляем элементы для каждого сегмента пути
            let accumulatedPath = '';
            for (const path of paths) {
                accumulatedPath += `/${path}`;
                const destination = accumulatedPath;

                let title: string = "Error";
                const categoryId = searchParams.get("categoryId") || categoryIdFromUrl;
                const subCategoryId = searchParams.get("sub-categoryId");
                if (categoryId || subCategoryId){
                    //console.log(getCategoriesTitles());
                    if (categoryId) title = getTitleById(Number(categoryId));//await getCategoryNameById(Number(categoryId));
                    if (subCategoryId) title = `Подкатегория ${subCategoryId}`;
                }

                // Добавляем хлебные крошки для каждого сегмента
                newBreadcrumbs.push({
                    destination,
                    content: decodeURIComponent(path) === "services" ?'Выбор категорий': title
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