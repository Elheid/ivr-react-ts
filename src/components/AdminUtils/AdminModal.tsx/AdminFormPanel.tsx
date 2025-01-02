import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import FormHeader from './FormHeader';
import ParentChooseSection from './ParentChooseSection';
import ResultParts from './ResultParts';
import BasePart from './BasePart';
import { CardType, FormType, useCardAndFormType } from '../../../contextProviders/formTypeProvider';
import { useEffect, useState } from 'react';
import { useCategoriesQuery, useInfoCardsQuery, useServicesQuery } from '../../../hooks/useCardsQuery';
import { Category, InfoCard, Service } from '../../../interfaces/CardsInterfaces';
import { MandatoryForm } from './MandatoryForm';
import { FormValues } from '../../../interfaces/FormValuesInterface';
import { createCard, editCard } from '../../../api/backendApi';
import RadioButtons from '../../RadioGroup';
import { FillFormWithData, getDefaultValues } from './FillForm';
import { useLoader } from '../../../contextProviders/LoaderProvider';

const AdminFormPanel = ({ id, parentId, cardInFormType, formType, modalClose, /*handleSubmitModal,*/
    handleChangeCardType, openModal, showCardTypeChange }:
    {
        cardInFormType: CardType,
        formType: FormType,
        modalClose: (event: Event) => void,
        //handleSubmitModal: (event: Parameters <SubmitHandler<FormValues>> [1]) => void,
        handleChangeCardType: () => void,
        openModal: boolean,
        showCardTypeChange: boolean,
        id: number,
        parentId?: number,
    }) => {
    const [showInstruction, setShowInstruction] = useState(false);
    const { cardType, setCardType } = useCardAndFormType();
    const [hideParts, setHideParts] = useState(false); // Состояние для скрытия ResultParts и BasePart


    const { data: categoriesInfo, refetch: categoryRefetch } = useCategoriesQuery({
        enabled: cardInFormType === CardType.CATEGORY || cardInFormType === CardType.SUB_CATEGORY && id !== -1
    });

    const { data: serviceInfo, refetch: serviceRefetch  } = useServicesQuery(
        { serviceId: id },
        { enabled: cardInFormType === CardType.SERVICE && id !== -1 }
    );

    const { data: infoCardInfo, refetch: infoRefetch } = useInfoCardsQuery(
        { serviceId: id },
        { enabled: cardInFormType === CardType.ADDITIONAL_INFO && id !== -1 }
    );


    const { setLoader } = useLoader();

    const clippedFormType = formType === FormType.TEXT || formType === FormType.VIDEO || formType === FormType.TITLE;
    const buttonSubmitName = formType === FormType.EDIT || clippedFormType ? 'Редактировать' : 'Создать' + " карточку";


    const handleTransferChange = (value: string) => {
        // Если "Да", скрываем части
        setHideParts(value === 'true');
    };

    const methods = useForm({
        defaultValues: getDefaultValues(cardInFormType),
    });

    const onSubmit: SubmitHandler<FormValues> = (formData, e) => {
        if (e)
            modalClose(e as unknown as Event);
        //handleSubmitModal(e);


        console.log("Form Data:", formData);

        const dataToSend: FormValues = formData;


        let callBack: ()=> void = ()=> categoryRefetch();

        //let callBack: (() => void) | undefined;
        if (cardInFormType === CardType.CATEGORY || cardInFormType === CardType.SUB_CATEGORY) callBack = ()=> categoryRefetch();
        if (cardInFormType === CardType.SERVICE) callBack = ()=> serviceRefetch();
        if (cardInFormType === CardType.ADDITIONAL_INFO) callBack =  ()=> infoRefetch();

        if (formType === FormType.EDIT || formType === FormType.VIDEO || formType === FormType.TEXT || formType === FormType.TITLE) {
            const isBooleanAndHasTrueArray = (value: boolean[] | boolean): boolean => {
                return Array.isArray(value) && value.every(item => typeof item === 'boolean') && value.some(item => item === true);

            }
            const dataStats = (methods.formState.touchedFields);
            const dirtyFields = Object.keys(dataStats).filter(
                key => {
                    const value = dataStats[key as keyof typeof dataStats];
                    if (value && Array.isArray(value))
                        return isBooleanAndHasTrueArray(value)
                    return value === true
                }
            );
            editCard(cardInFormType, dataToSend, dirtyFields, parentId || -1, setLoader, callBack);
        }
        if (formType === FormType.CREATE) {
            createCard(cardInFormType, dataToSend, parentId || -1, setLoader, callBack);
        }


    };

    let neededData: Category[] | Service | InfoCard[] | undefined;
    if (formType === FormType.EDIT || clippedFormType) {
        if (cardInFormType === CardType.CATEGORY || cardInFormType === CardType.SUB_CATEGORY) {
            neededData = categoriesInfo;
        } else if (cardInFormType === CardType.SERVICE) {
            neededData = serviceInfo as Service;
        } else if (cardInFormType === CardType.ADDITIONAL_INFO) {
            neededData = infoCardInfo;
        }
    }

    useEffect(() => {
        setCardType(cardInFormType);
        // Логика выбора данных в зависимости от типа карточки
        if (formType === FormType.EDIT || clippedFormType) {
            console.log(cardInFormType)
            let data: Category | Service | InfoCard | undefined;
            if (cardInFormType === CardType.CATEGORY || cardInFormType === CardType.SUB_CATEGORY) {
                data = categoriesInfo?.find((category) => id === category.id);
            } else if (cardInFormType === CardType.SERVICE) {
                data = serviceInfo as Service;
            } else if (cardInFormType === CardType.ADDITIONAL_INFO) {
                if (Array.isArray(infoCardInfo)) {
                    // Если это массив, ищем объект по id
                    if (infoCardInfo.length === 0) infoRefetch();
                    data = infoCardInfo.find((info) => id === info.id);
                    if (!data) {
                        data = infoCardInfo.find((info) => id === info.itemId);
                    }
                }
            }

            if (formType === FormType.EDIT || clippedFormType) {
                if (data) {
                    methods.reset(FillFormWithData(cardInFormType, data));
                }
            }
        }

    }, [cardInFormType, formType, openModal, methods, id, categoriesInfo, infoCardInfo, serviceInfo, setCardType, clippedFormType]);

    return (
        <MandatoryForm
            neededData={neededData}
            modalClose={modalClose}
            showInstruction={showInstruction}
            setShowInstruction={setShowInstruction}
            formType={formType}
        >
            <FormProvider {...methods}>
                <FormHeader cardInFormType={cardInFormType} formType={formType} onInstructionClick={() => setShowInstruction(true)} />
                <form
                    id="card-form"
                    onSubmit={methods.handleSubmit((data, e) => onSubmit(data, e))}>

                    {/* Секция выбора типа карточки */}
                    {(cardType == CardType.SERVICE || cardType == CardType.SUB_CATEGORY) && !clippedFormType &&
                        <Box display="flex" gap={2} flexWrap="wrap" flexDirection={"column"}>
                            <ParentChooseSection parentId={parentId || -1} formType={formType} myOnChange={handleTransferChange} />
                            <hr className='horizontal-divider' />
                        </Box>
                        
                    }

                    <section
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap:"20 px",
                            marginBottom:"20px",

                        }}
                    >
                        <div className="left-part">

                            {showCardTypeChange && <RadioButtons
                                onChange={handleChangeCardType}
                                labels={["Услуга", "Подкатегория"]}
                                values={["services", "sub-category"]} />}

                            {/* Рендеринг секции BasePart для всех типов, кроме additional-info */}
                            {!hideParts && <BasePart cardType={(cardType)} formType={formType} />}


                        </div>
                        {!hideParts &&
                                (cardType == CardType.ADDITIONAL_INFO || cardType == CardType.SERVICE) &&
                                (formType !== FormType.TITLE && formType !== FormType.VIDEO) && 
                                <hr className='vertical-divider' />}
                        <div className="right-part">
                            {/* Рендеринг секции ResultParts только для additional-info и service */}
                            {!hideParts &&
                                (cardType == CardType.ADDITIONAL_INFO || cardType == CardType.SERVICE) &&
                                (formType !== FormType.TITLE && formType !== FormType.VIDEO) &&
                                <ResultParts
                                    descriptionParts={methods.getValues("descriptionParts")}
                                    iconLinks={methods.getValues("iconLinks")}
                                />
                            }
                        </div>
                    </section>
                    <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    className={"brown-button"} 
                    sx={{ mt: 2, marginTop: "auto", position:"absolute", bottom:"0", width:"90%", zIndex:100 }}>
                        {buttonSubmitName}
                    </Button>
                </form>
            </FormProvider>

        </MandatoryForm>
    );
};

export default AdminFormPanel;
