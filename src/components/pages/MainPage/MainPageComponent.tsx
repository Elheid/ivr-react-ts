
import clearIndexPNG from '../../../assets/img/clearIndex.png'
import gesturalIndexPNG from '../../../assets/img/gesturalIndex.png' 

import ViewCardComponent from "./ViewCard";

import styles from './mainPage.module.css'

interface MainPageComponentProps {
    language?: string;
    setLanguage: (language: string) => void;
}


const MainPageComponent = ({  setLanguage }:MainPageComponentProps) => {
    const clearImg = clearIndexPNG//ClearLanguage._indexImg;
    const gesturalImg = gesturalIndexPNG//GesturalLanguage._indexImg;

    return (
        <section className={`main-menu ${styles["main-content"]}`}>
            <h1 className={styles["index-title"]}>Выберите удобный способ общения</h1>
            <ul className={styles["view-cards"]}>
                <ViewCardComponent  
                destination={"/instruction"} 
                className={styles["gestural-language"]} 
                languageName="gestural-language"
                img={gesturalImg} 
                alt="Жестовый язык"
                setLanguage={setLanguage}/>
                
                <ViewCardComponent 
                destination={"/services"} 
                className={styles["clear-language"]} 
                languageName="clear-language"
                img={clearImg}
                alt="Простой язык"
                setLanguage={setLanguage}/>
            </ul>
        </section>
    );
}

export default MainPageComponent;