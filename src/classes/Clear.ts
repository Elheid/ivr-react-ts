import clearIndexPNG from '../img/clearIndex.png'
class ClearLanguage {
    static _indexImg = clearIndexPNG;
    get indexImg(): string {
    return ClearLanguage._indexImg;
    }
}

export default ClearLanguage;