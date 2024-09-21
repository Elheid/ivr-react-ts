import { Link } from "react-router-dom";

import styles from './mainPage.module.css'

interface ViewCardComponentProps {
    className: string;
    destination: string;
    img?: string;
    alt?: string;
    languageName: string;
    setLanguage: (language: string) => void;
}

const ViewCardComponent = ({ className, destination, img, alt, setLanguage, languageName }: ViewCardComponentProps) => {
    const classNamees = `${styles["view-card"]} ${className}`; //"gestural-language" или "clear-language";
    const image = img;
    return (
            <li className={classNamees} onClick={() => {
                //window.location.reload();
                setLanguage(languageName);
                localStorage.setItem("language", languageName)
            }}>
                <Link to={destination}>
                    <button style={{cursor:"pointer"}} className={styles["transition-icon"]}>
                        <img src={image} alt={alt} />
                    </button>
                </Link>
            </li>
    );
}
export default ViewCardComponent;