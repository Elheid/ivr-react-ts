import { NavigateFunction } from "react-router-dom";
import { loadCategoriesTitles } from "./api/backendApi";
import { Category, InfoCard, Service } from "./interfaces/CardsInterfaces";
import { CardType } from "./contextProviders/formTypeProvider";
import { FormValues } from "./interfaces/FormValuesInterface";

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


export type TitlesMap = { [key: number]: { title: string; isSubCategory: boolean } };

const saveCategoriesTitles = (content: Service[] | Category[]) => {
    const obj: TitlesMap = {}; // Объект с числовыми ключами и объектами со строковыми значениями и необязательным флагом

    content.forEach((el: Category | Service) => {
        obj[el.id] = {
            title: el.title,
            isSubCategory: 'parentCategoryId' in el ? el.parentCategoryId !== 0 || el.childrenCategoryIds.length !== 0 : false,
        }; // Используем id как ключ, добавляем флаг isSubCategory
    });

    localStorage.setItem('titles', JSON.stringify(obj));
};

const getCategoriesTitles = (): TitlesMap => {
    const titles = localStorage.getItem('titles');
    if (!titles) loadCategoriesTitles();
    const res: TitlesMap = titles ? JSON.parse(titles) : {};
    return res;
};

const getCategoryTitleById = (id: number): string => {
    const titles = getCategoriesTitles();
    const res = titles[id];
    return res?.title || ""; // Возвращает заголовок по id или пустую строку, если id нет в объекте
};



const getLastParam = () => {
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 1]; // Получаем последний элемент
}



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

const isAdmin = () => {
    return localStorage.getItem("token");
}

const getCellNameById = () => {
    return null;
}

const getParamFromURL = () => {
    return null;
}


const compareObj = (
    dataToSend: Category | Service | InfoCard,
    prevData: Category | Service | InfoCard
) => {
    const diffFields: string[] = [];

    if (dataToSend.title !== prevData.title) diffFields.push("title");
    if (dataToSend.mainIconLink !== prevData.mainIconLink) diffFields.push("mainIconLink");
    if (dataToSend.gifPreview !== prevData.gifPreview) diffFields.push("gifPreview");

    // Проверка для объектов Service или InfoCard
    if ("gifLink" in prevData && "gifLink" in dataToSend) {
        if (dataToSend.gifLink !== prevData.gifLink) diffFields.push("gifLink");
    }

    if ("description" in prevData && "description" in dataToSend) {
        if (dataToSend.description !== prevData.description) diffFields.push("description");
    }

    if ("iconLinks" in prevData && "iconLinks" in dataToSend) {
        if (dataToSend.iconLinks !== prevData.iconLinks) {
            diffFields.push("iconLinks");
        }
    }

    return diffFields;
};


const assembleDescription = (textParts: string[]): string => {
    let description = '';
    //const pattern = /<img.*?alt="([^"]+)".*?>/g;

    textParts.forEach((text) => {
        // Проверяем, есть ли тег <img> в тексте
        //if (pattern.test(text)) {
        if (text.indexOf("\n\\icon") > 0) {
            // Если тег <img> есть, заменяем его
            const updatedText = text//.replace(pattern, (_, alt) => `\n\\icon${alt}`);
            if (text.startsWith("\n- ")) {
                description += updatedText;
            } else if (text.startsWith("- ")) {
                description += "\n" + updatedText;
            } else {
                description += "\n- " + updatedText;
            }
        } else {
            // Если тега <img> нет, добавляем текст без изменений
            description += text + '\n';
        }
    });

    return description;
};


const getDescriptionAndIcons = (parts: string[], iconLinks: string[]) => {
    const newDesc: string[] = [];
    let count = 0;
    parts.forEach((part, id) => {
        let icon: string;
        //const s = iconLinks[id] !== "" ? part.includes(iconLinks[id]) : false;
        if (iconLinks && iconLinks[id] !== "") {
            const parting = part.split("<img")
            if (parting.length > 1) {
                part = parting[0]
            }
            icon = `\n\\icon${count}`//`<img src=${iconLinks[id]} alt="${count}">`;
            count++;
        }
        else icon = '';
        newDesc[id] = (part + icon);
    })
    const description = assembleDescription(newDesc || []);
    const icons = iconLinks ? iconLinks.filter(str => str !== "") : [];
    return { description, icons };
}

const changeDataInCardData = (cardInFormType: CardType, data: FormValues, parentId: number) => {
    const caregoryData: Category = {
        id: data.id,
        gifPreview: data.gifPreview,
        mainIconLink: data.mainIconLink,
        title: data.title,
        itemsInCategoryIds: [],
        childrenCategoryIds: [],
        parentCategoryId: 0,
    }
    const subCaregoryData: Category = {
        id: data.id,
        gifPreview: data.gifPreview,
        mainIconLink: data.mainIconLink,
        title: data.title,
        itemsInCategoryIds: [],
        childrenCategoryIds: [],
        parentCategoryId: parentId
    }
    const { description, icons } = getDescriptionAndIcons(data.descriptionParts || [], data.iconLinks || [])
    const serviceData: Service = {
        id: data.id,
        gifPreview: data.gifPreview,
        mainIconLink: data.mainIconLink,
        title: data.title,
        categoryId: parentId,
        additionIds: [],
        description: description,
        gifLink: data.resVideo || "",
        iconLinks: icons,
    }
    const infoData: InfoCard = {
        id: data.id,
        gifPreview: data.gifPreview,
        mainIconLink: data.mainIconLink,
        title: data.title,
        itemId: parentId,
        description: description,
        gifLink: data.resVideo || "",
        iconLinks: icons,
    }
    if (cardInFormType === CardType.CATEGORY)
        return caregoryData
    if (cardInFormType === CardType.SUB_CATEGORY)
        return subCaregoryData
    if (cardInFormType === CardType.SERVICE)
        return serviceData
    if (cardInFormType === CardType.ADDITIONAL_INFO)
        return infoData;
}

const replaceWordsWithSpan = (input: string): string => {
    // Определяем слова, которые нужно найти
    const wordsToReplace = ['Примечание', 'удалить'];

    // Создаем регулярное выражение для поиска этих слов
    const regex = new RegExp(`(${wordsToReplace.join('|')})`, 'gi');

    // Заменяем найденные слова на <span class="red-text">слово</span> или <span class="note-text">слово</span>
    return input.replace(regex, (matched) => {
        const className = matched.toLowerCase() === 'удалить' ? 'red-text' : 'note-text';
        return `<span class="${className}">${matched}</span>`;
    });
};

export default replaceWordsWithSpan;


export {
    checkUndefined, getCellNameById, getParamFromURL, isAdmin, tryJsonParse, getCurState, idCreator, navigateHandleClick,
    saveCategoriesTitles, getCategoriesTitles, getCategoryTitleById, myFunctionWithDelay, getLastParam, addSubHeaderForQuery,
    compareObj, changeDataInCardData, getDescriptionAndIcons
}