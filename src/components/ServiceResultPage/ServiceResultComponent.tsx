import { Container } from "@mui/material";
import BreadCrumpsComponent from "../BreadCrumps";
import LinkReturnButtonComponent from "../ReturnButton";


const ManualStrp = () => {
    return (
        <div className="manual-strp true-manual">
            <video
                src="https://storage.yandexcloud.net/akhidov-ivr/13full.mp4"
                className="instr result-video"
                autoPlay
                loop
                muted
                typeof="video/mp4"
            ></video>
            <div className="manual">
                <button className="modal additional-info" id="showPopup" type="button">
                    <span className="infoButton-title">Дополнительная информация</span>
                    <img title="Дополнительная информация" className="info-button hover" src="img/info1.svg" />
                </button>
                <pre className="manual-text result-text">
                    {/* Content omitted for brevity */}
                </pre>
            </div>
        </div>
    );
};

const Loader = () => {
    return (
        <div id="loader" className="loader-wrapper hidden">
            <div className="loader"></div>
        </div>
    );
};

const CardFormContainer = () => {
    return (
        <div id="card-form-container" className="hidden">
            <div className="close-form">
                <img src="img/Close.svg" width="32px" height="30px" alt="Close" />
            </div>
            <section className="instruction hidden">
                <div className="form-instruct-header">
                    <h3 className="form-instruct-title">title</h3>
                </div>
                <article className="instruction-text"></article>
                <button className="back-from-instruction-button back-button">Назад</button>
            </section>
            <form id="card-form">
                <div className="form-header">
                    <h3 className="form-title">title</h3>
                    <div className="instruction-button">
                        <img src="img/question.svg" alt="Instruction" />
                    </div>
                </div>
                <div className="form-flex">
                    <article className="main-form">
                        {/* Card form content */}
                    </article>
                </div>
                <button className="submit-form" type="submit">Добавить карточку</button>
            </form>
        </div>
    );
};


const PopupContainer = () => {
    return (
        <div className="popup-container">
            <div className="overlay" id="overlay"></div>
            <div className="popup cases-table-popup" id="popup" addition-info-id="6">
                <div className="popup-header">
                    <h3 className="popup-title title">Дополнительная информация</h3>
                    <button className="close-info" id="closePopup">
                        <img src="img/close.jpg" width="32px" height="30px" alt="Close" />
                    </button>
                </div>
                <div className="popup-content">
                    <ul className="info-cards list-of-cards"></ul>
                    <div className="additional-info-res"></div>
                </div>
            </div>
        </div>
    );
};



const ServiceResultComponent = () => {
    return (
        <section>
            <header className="main-header">
            <BreadCrumpsComponent />
            <Container sx={{display:"flex", justifyContent: "space-between" ,mt:"20px"}} >
            <LinkReturnButtonComponent />
            <h3 className="res-title title card-title">Постоянная регистрация Совершеннолетний</h3>
            <LinkReturnButtonComponent />
            </Container>
            </header>
            <main className="main-content main-result">
                <section className="view-choose">
                    <Container>
                    <ManualStrp />
                    {/* <Loader />*/}
                    <CardFormContainer />
                    {/*<PopupContainer />*/}  
                    </Container>
                </section>
            </main>
        </section>

    );
};

export default ServiceResultComponent;