import { Link } from "react-router-dom";
import imgArrowSVG from "../../img/arrow-left-white.svg";

import recordSVG from "../../img/record.svg";
import playSimpleSVG from "../../img/playSimple.svg";

import styles from './instructionPage.module.css'

interface InstructionButtonComponentProps {
    class: string;
    destination: string;
}


const InstructionButtonComponent = (props: InstructionButtonComponentProps) => {
    const prevImg = imgArrowSVG;//`${process.env.PUBLIC_URL}img/arrow-left-white.svg`;
    const classes = `${props.class} ${styles["go-button"]}`
    const imgClass = (props.class === styles["next-button"]) ? styles["next-button-img"] : "prev-button-img";
    return (
        <Link to={props.destination} className={classes}>
            <img className={imgClass} src={prevImg} alt={props.class} />
        </Link>
    );
}

const InstructionComponent = () => {
    return (
        <section className={styles["instruct"]}>
            <div className={styles["go-buttons"]}>
                <InstructionButtonComponent class={`${styles["prev-button"]}`} destination="/" />
                <InstructionButtonComponent class={`${styles["next-button"]}`} destination="/services" />
            </div>
            <div className={`${styles["instruct-content"]}`}>
                <h3 className={styles["instruction-title"]}>
                    Ввод запросов с использованием жестового языка
                </h3>
                <div className={styles["text-container"]}>
                    <pre className={styles["instruction"]}>
                        <span>Для ввода запросов с использованием жестового языка вам нужно:</span>

                        <span>1. Перейти дальше, на страницу выбор категорий, нажав кнопку далее <button className={`${styles["go-button"]} ${styles["next-button"]} ${styles["instruct-sample"]}`}><img className={styles["next-button-img"]}src={imgArrowSVG}/></button></span>
                        <span>2. Выбрать кнопку со знаком камеры <button id="showPopup" className={styles["showPopup"]} type="button"><span className={styles["button-title"]}>Поиск по РЖЯ</span><img src={recordSVG} alt="Кнопка поиска жестами"/></button></span>
                        <span className={styles["play-span"]}>3. Затем нажать кнопку запись видео <button className={styles["start-record"]}><img src={playSimpleSVG} width="32px" height="30px"/><span className={`${styles["button-title"]} ${styles["back-title"]}`} >Начать запись</span></button></span>

                        {/*<p>     Для ввода запросов с использованием жестового языка вам нужно:</p>
                        <p>1. Перейти дальше, на страницу выбор категорий</p>
                        <p>2. Выбрать кнопку со знаком камеры (📸)</p>
                        <p>3. Затем нажать кнопку запись видео (▶)</p>*/}
                    </pre>
                </div>
            </div>
        </section>);
}

export default InstructionComponent;