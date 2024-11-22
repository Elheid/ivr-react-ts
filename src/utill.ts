import { NavigateFunction } from "react-router-dom";
import { loadCategoriesTitles } from "./api/backendApi";
import { Category, Service } from "./interfaces/CardsInterfaces";

const checkUndefined = <T>(value: T): boolean => {
    return typeof value === 'undefined';
}

const navigateHandleClick = (withBaseUrl: boolean, paramState: string, navigate: NavigateFunction, fromStart?: boolean) => {
    // Перенаправляем пользователя на страницу с использованием categoryId
    const basePath = fromStart ? location.pathname : "" //+ '?';
    //const baseSearchPath = location.pathname + location.search;
    const currentPath = withBaseUrl ? basePath : "";
    const newPath = `${currentPath}${paramState}`;
    navigate(newPath);
    // Здесь можно добавить дополнительную логику, если требуется
};
export type TitlesMap = { [key: number]: string };

const saveCategoriesTitles = (content: Service[] | Category[]) => {
    const obj: TitlesMap = {}; // Объект с числовыми ключами и строковыми значениями

    content.forEach((el: Category | Service) => {
        obj[el.id] = el.title; // Используем id как ключ
    });

    localStorage.setItem('titles', JSON.stringify(obj));
}

const getLastParam = () => {
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 1]; // Получаем последний элемент
}


const getCategoriesTitles = ():TitlesMap => {
    const titles = localStorage.getItem('titles');
    if (!titles) loadCategoriesTitles()
    const res = titles ? JSON.parse(titles) : {};
    return res;
}

const getCategoryTitleById = (id: number) :string | null=> {
    const titles = getCategoriesTitles();
    const res = titles[id];
    return res || null; // Возвращает заголовок по id или null, если id нет в объекте
};


const myFunctionWithDelay = (callback: () => void, delay: number) => {
    setTimeout(() => {
        callback(); // Выполняем callback после задержки
    }, delay);
}


const idCreator = (): (() => number) => {
    let lastGeneratedId = 0;

    return () => {
        lastGeneratedId += 1;
        return lastGeneratedId;
    };
};


const tryJsonParse = (value: string, name: string) => {
    let res = '';
    try {
        res = JSON.parse(value)[name];  // Попробуем распарсить как JSON
    } catch (e) {
        //console.log(e);
        res = value;
    }
    const undefindCheck = typeof res !== 'undefined';
    return undefindCheck ? res : value;
}

const getCurState = (): string => {
    const urlParams = window.location.search;
    return (urlParams.match('serviceId')) ? 'info-cards' : (urlParams.match('catalog')) ? 'services-list' : 'catalogs-list';
}

const addSubHeaderForQuery = (title: string, isFromQuery: boolean, setSubTitle: React.Dispatch<React.SetStateAction<string>>) => {
    // Эффект для поиска элементов DOM и установки подзаголовка
    if (isFromQuery) {
        const titles = document.querySelectorAll(".card-description");
        titles.forEach((titleNode) => {
            const text = titleNode.textContent ? titleNode.textContent : "";
            if (text.indexOf(title) >= 0) {
                const parentCatalog = titleNode.closest("[parent-catalog-id]");
                if (parentCatalog) {
                    const parentCatalogId = Number(parentCatalog.getAttribute("parent-catalog-id") || "-1");
                    setSubTitle(getCategoryTitleById(parentCatalogId));
                }
            }
        });
    }
}

const isAdmin = ()=>{
    return localStorage.getItem("token");
}

const getCellNameById = () => {
    return null;
}

const getParamFromURL = () => {
    return null;
}


export {
    checkUndefined, getCellNameById, getParamFromURL, isAdmin, tryJsonParse, getCurState, idCreator, navigateHandleClick,
    saveCategoriesTitles, getCategoriesTitles, getCategoryTitleById, myFunctionWithDelay, getLastParam, addSubHeaderForQuery
}