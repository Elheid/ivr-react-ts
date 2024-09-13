const checkUndefined = <T>(value: T): boolean => {
    return typeof value === 'undefined';
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
        console.log(e);
        res = value;
    }
    const undefindCheck = typeof res !== 'undefined';
    return undefindCheck ? res : value;
}

const getCurState = (): string => {
    const urlParams = window.location.search;
    return (urlParams.match('serviceId')) ? 'info-cards' : (urlParams.match('catalog')) ? 'services-list' : 'catalogs-list';
}



const getCellNameById = () => {
    return null;
}

const getParamFromURL = () => {
    return null;
}

const isAdmin = () => {
    return null;
}

export { checkUndefined, getCellNameById, getParamFromURL, isAdmin, tryJsonParse, getCurState, idCreator }