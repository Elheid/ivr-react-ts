import gesturalIndexPNG from '../img/gesturalIndex.png'
class GesturalLanguage {
   static _indexImg = gesturalIndexPNG;

   get indexImg(): string {
      return GesturalLanguage._indexImg;
   }
}

export default GesturalLanguage;