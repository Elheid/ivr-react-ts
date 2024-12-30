import { useState, useRef, useCallback } from "react";
import { CardType, FormType } from "../contextProviders/formTypeProvider";
import { usePageStateContext } from "../contextProviders/pageState";
import { deleteCard } from "../api/backendApi";
import { useParams } from "react-router-dom";

export const useCardFormModal = (type: "edit"|"add", ref?: React.ForwardedRef<HTMLDivElement> ) => {
    const [openModal, setOpenModal] = useState(false);
    const [cardInFormType, setCardInFormType] = useState<CardType>(CardType.CATEGORY);
    const [formType, setFormType] = useState<FormType>(FormType.CREATE);
    const [cardId, setCardId] = useState<number>(-1);
    const [parentCardId, setParentCardId] = useState<number>(-1);

    const { categoryId } = useParams<{ categoryId?: string }>();
    const { subCategoryId } = useParams<{ subCategoryId?: string }>();

    const { serviceId } = useParams<{ serviceId?: string }>();



    const parentId = Number(categoryId) || Number(subCategoryId) || Number(serviceId) || -1;

    const cardType = useRef<string>("");

    const showCardTypeChange = useRef<boolean>(false);


    const {state } = usePageStateContext();
    const curState = useRef(state)

    let determineCardAndFormType: (element: HTMLDivElement) => void;
    if (type == "add"){
        determineCardAndFormType = (element: HTMLDivElement) => {

            if (curState.current === "categories"){
    
                //setCardId(Number(id) || -1);
                setParentCardId(parentId);
                
                console.log("is this categories state& - ", state)
                setCardInFormType(CardType.CATEGORY);
                cardType.current = CardType.CATEGORY;
            }
            if (curState.current === "sub-categories"){
    
                /*const parentId = parentElement.getAttribute("parent-id");
                setParentCardId(Number(parentId) || -1);
                const id = element.dataset.id;
                setCardId(Number(id) || -1);*/

    
                setParentCardId(parentId);

                setCardInFormType(CardType.SUB_CATEGORY);
                cardType.current = CardType.SUB_CATEGORY;
            }
            if(curState.current === "services"){
    
                /*setParentCardId(Number(parentId) || -1);
                setCardId(Number(id) || -1);*/
                const listOfCards = document.querySelector(".card-list")
                const children = listOfCards?.children
                if (children && children.length === 1 && children[0].classList.contains("add-card-like-button") ){
                    console.log("это пустая категория");

                    showCardTypeChange.current = (true)
                }
    
                setParentCardId(parentId);

                setCardInFormType(CardType.SERVICE);
                cardType.current = CardType.SERVICE;
            }
            if(curState.current === "info"){
                /*setCardId(Number(id) || -1);
                setParentCardId(Number(parentId) || -1);*/
    
                setParentCardId(parentId);
                setCardInFormType(CardType.ADDITIONAL_INFO);
                cardType.current = CardType.ADDITIONAL_INFO;
            }
    
    
            if (element.classList.contains("card-to-add")) {
                setFormType(FormType.CREATE);
            } else {
                setFormType(FormType.EDIT);
            }
        };
    }
    else{
        const classificateFormByEl = (parentElement: HTMLElement, element: HTMLDivElement)=>{
            if (parentElement.classList.contains("catalog-card")) {
                const id = element.dataset.id;
                setCardId(Number(id) || -1);
                setParentCardId(-1);
                setCardInFormType(CardType.CATEGORY);
                cardType.current = CardType.CATEGORY;
            } else if (parentElement.classList.contains("service-card")) {
                const id = element.dataset.id;
                const parentId = parentElement.getAttribute("parent-catalog-id");
                setParentCardId(Number(parentId) || -1);
                setCardId(Number(id) || -1);
                setCardInFormType(CardType.SERVICE);
                cardType.current = CardType.SERVICE;
            } else if (parentElement.classList.contains("sub-catalog-card")) {
                //const parentOfParent = parentElement.parentNode as HTMLElement
                const parentId = parentElement.getAttribute("parent-id");
                setParentCardId(Number(parentId) || -1);
                const id = element.dataset.id;
                setCardId(Number(id) || -1);
                setCardInFormType(CardType.SUB_CATEGORY);
                cardType.current = CardType.SUB_CATEGORY;
            } else if (parentElement.classList.contains("info-card")) {
                const id = element.getAttribute("info-id");
                const parentId = element.getAttribute("item-id");
                setCardId(Number(id) || -1);
                setParentCardId(Number(parentId) || -1);
                setCardInFormType(CardType.ADDITIONAL_INFO);
                cardType.current = CardType.ADDITIONAL_INFO;
            }
        }
    
        determineCardAndFormType = (element: HTMLDivElement) => {
            //const parentElement = element.parentNode as HTMLElement;
    
            // Определение cardInFormType в зависимости от классов
            //classificateFormByEl(parentElement, element)
    
    
            // Определение formType
            if (ref && typeof ref === "object" && ref !== null && "current" in ref){
                const parentRefEl = ref.current ? ref.current.parentNode as HTMLElement : new HTMLDivElement;
                classificateFormByEl(parentRefEl, element)
            }
            if (element.classList.contains("card-to-add")) {
                setFormType(FormType.CREATE);
            } else {
                setFormType(FormType.EDIT);
            }
        };
    }

    const onEditClick = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            setOpenModal(true);

            let element:HTMLDivElement;
            const target = e.currentTarget;
            if (target instanceof HTMLDivElement && target.tagName.toLowerCase() === "div" && target.classList.contains("card-to-add")) {
                determineCardAndFormType(target);
            }else if (ref && typeof ref === "object" && ref !== null && "current" in ref) {
                element = ref.current ? ref.current : new HTMLDivElement;
                determineCardAndFormType(element);
                //alert("Редактировать: " + element?.getAttribute("data-title"))
            }
        },
        []
    );

    const onDeleteClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (ref && typeof ref === "object" && ref !== null && "current" in ref) {
            const element = ref.current ? ref.current : new HTMLDivElement;
            determineCardAndFormType(element);
            const title = element?.getAttribute("data-title");
            const id = element?.getAttribute("data-id") || element?.getAttribute("info-id");
            if (confirm(`Вы действительно хотите удалить ${cardType.current} ${title}?`)) {
                // Запрашиваем ввод текста для подтверждения
                const input = prompt('Для подтверждения удаления введите название удаляемого объекта:');
                if (input === title) {
                    const type = cardType.current as CardType;
                    deleteCard(type,Number(id))
                    console.log("Элемент " + title + " удалён");
                } else {
                    alert("Неверное слово. Удаление отменено.");
                    console.log("Удаление отменено");
                }
            }else {
                // Если пользователь отменил, ничего не делаем
                console.log("Удаление отменено");
            }
        }
    }

    const handleCloseModal = useCallback((event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenModal(false);
    }, []);

    return {
        openModal,
        setOpenModal,
        cardInFormType,
        setCardInFormType,
        formType,
        setFormType,
        cardId,
        setCardId,
        parentCardId,
        setParentCardId,
        cardType,
        onEditClick,
        handleCloseModal,
        curState,
        onDeleteClick,
        showCardTypeChange
    };
};
