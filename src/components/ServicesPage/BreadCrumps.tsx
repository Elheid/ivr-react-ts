import breadMiniSVG from "../../img/breadMini.svg";

interface BreadCrumpComponentProps {
    class: string;
    destination: string;
    content?: string;
}

const BreadCrumpComponent = (props : BreadCrumpComponentProps) => {
    let additionClass = '';
    if (props.class === "current-page") additionClass = "hidden";
    const classes = `breadcrumb-item ${props.class}`;
    const arrowClasses = `arrow ${additionClass}`;
    const arrowImg = breadMiniSVG;
    return (
        <li className={classes}>
            <a href={props.destination}>{props.content}</a>
            <img className={arrowClasses} src={arrowImg} alt="arrow-svg"/>
        </li>
    );
}

const BreadCrumpsComponent = () => {
    return (
        <ul className="header-list">
            <BreadCrumpComponent  destination={"/"} class={"prev-page"} content={"Главное меню"}/>
            <BreadCrumpComponent destination={"/services"} class={"current-page"} content={"Выбор категорий"}/>
        </ul>
    );
}

export default BreadCrumpsComponent;