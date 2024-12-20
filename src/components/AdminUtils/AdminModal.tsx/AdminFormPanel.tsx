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
import { getTextBlocks } from '../../pages/ServiceResultPage/blockInsertion';
import { MandatoryForm } from './MandatoryForm';
import { FormValues } from '../../../interfaces/FormValuesInterface';


const FillFormWithData = (type: CardType, data: Category | Service | InfoCard) => {
  let descriptions = [];
  switch (type) {
    case CardType.CATEGORY:
      return {
        switchToTransfer: false,
        title: data.title,
        mainIconLink: data.mainIconLink,
        gifPreview: data.gifPreview,
      };

    case CardType.SERVICE:
      data = data as Service;
      descriptions = getTextBlocks(data.description, data.iconLinks);
      //console.log(descriptions);
      return {
        switchToTransfer: false,
        title: data.title,
        mainIconLink: data.mainIconLink,
        gifPreview: data.gifPreview,
        parentId: 0,
        resVideo: data.gifLink,
        descriptionParts: descriptions,
      };
    case CardType.SUB_CATEGORY:
      return {
        switchToTransfer: false,
        title: data.title,
        mainIconLink: data.mainIconLink,
        gifPreview: data.gifPreview,
        parentId: 0,
      };
    case CardType.ADDITIONAL_INFO:
      data = data as InfoCard;
      descriptions = getTextBlocks(data.description, data.iconLinks);
      return {
        switchToTransfer: false,
        title: data.title,
        mainIconLink: data.mainIconLink,
        gifPreview: data.gifPreview,
        parentId: 0,
        resVideo: data.gifLink,
        descriptionParts: descriptions,
      };
    default:
      return {
        switchToTransfer: false,
        title: "",
        mainIconLink: "",
        gifPreview: "",
      }
  }
}


const getDefaultValues = (type: CardType): FormValues => {
  switch (type) {
    case CardType.CATEGORY:
      return {
        switchToTransfer: false,
        title: "",
        mainIconLink: "",
        gifPreview: "",
      };

    case CardType.SERVICE:
      return {
        switchToTransfer: false,
        title: "",
        mainIconLink: "",
        gifPreview: "",
        parentId: 0,
        resVideo: "",
        descriptionParts: [],
        iconLinks: [""],
      };
    case CardType.SUB_CATEGORY:
      return {
        switchToTransfer: false,
        title: "",
        mainIconLink: "",
        gifPreview: "",
        parentId: 0,
      };
    case CardType.ADDITIONAL_INFO:
      return {
        switchToTransfer: false,
        title: "",
        mainIconLink: "",
        gifPreview: "",
        parentId: 0,
        resVideo: "",
        descriptionParts: [],
        iconLinks: [""]
      };
    default:
      return {
        switchToTransfer: false,
        title: "",
        mainIconLink: "",
        gifPreview: "",
      };
  }
};


const AdminFormPanel = ({ id, parentId, cardInFormType, formType, modalClose, /*handleSubmitModal,*/ openModal }:
  { 
    cardInFormType: CardType,
    formType: FormType,
    modalClose: (event: Event) => void,
    //handleSubmitModal: (event: Parameters <SubmitHandler<FormValues>> [1]) => void,
    openModal: boolean,
    id: number,
    parentId?: number,
  }) => {
  const [showInstruction, setShowInstruction] = useState(false);
  const { cardType, setCardType } = useCardAndFormType();
  const [hideParts, setHideParts] = useState(false); // Состояние для скрытия ResultParts и BasePart


  const { data: categoriesInfo } = useCategoriesQuery({
    enabled: cardInFormType === CardType.CATEGORY || cardInFormType === CardType.SUB_CATEGORY && id !== -1
  });

  const { data: serviceInfo } = useServicesQuery(
    { serviceId: id },
    { enabled: cardInFormType === CardType.SERVICE && id !== -1 }
  );

  const { data: infoCardInfo } = useInfoCardsQuery(
    { serviceId: parentId },
    { enabled: cardInFormType === CardType.ADDITIONAL_INFO && id !== -1 }
  );


  const clippedFormType = formType === FormType.TEXT || formType === FormType.VIDEO || formType === FormType.TITLE;
  const buttonSubmitName = formType === FormType.EDIT || clippedFormType ? 'Редактировать' : 'Создать' + " карточку";

  const handleTransferChange = (value: string) => {
    // Если "Да", скрываем части
    setHideParts(value === 'true');
  };

  const methods = useForm({
    defaultValues: getDefaultValues(cardInFormType),
  });

  const onSubmit:SubmitHandler<FormValues> = (data, e) => {
    if (e)
      modalClose(e as unknown as Event);
      //handleSubmitModal(e);
    console.log("Form Data:", data);
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



  //console.log(parentId)
  useEffect(() => {
    // Логика выбора данных в зависимости от типа карточки
    if (formType === FormType.EDIT || clippedFormType) {
      let data: Category | Service | InfoCard | undefined;

      if (cardInFormType === CardType.CATEGORY || cardInFormType === CardType.SUB_CATEGORY) {
        data = categoriesInfo?.find((category) => id === category.id);
      } else if (cardInFormType === CardType.SERVICE) {
        data = serviceInfo as Service;
      } else if (cardInFormType === CardType.ADDITIONAL_INFO) {
        if (Array.isArray(infoCardInfo)) {
          // Если это массив, ищем объект по id
          data = infoCardInfo.find((info) => id === info.id);
          if (!data){
            data = infoCardInfo.find((info) => id === info.itemId);
          }
        }
      }

      setCardType(cardInFormType);
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
        <form id="card-form" onSubmit={methods.handleSubmit((data, e)=> onSubmit(data, e))}>
          <FormHeader cardInFormType={cardInFormType} formType={formType} onInstructionClick={() => setShowInstruction(true)} />

          {/* Секция выбора типа карточки */}
          { (cardType == CardType.SERVICE || cardType == CardType.SUB_CATEGORY) && !clippedFormType &&
            <Box display="flex" gap={2} flexWrap="wrap">
              <ParentChooseSection parentId={parentId || -1} formType={formType} onChange={handleTransferChange} />
            </Box>
          }



          {/* Рендеринг секции BasePart для всех типов, кроме additional-info */}
          {!hideParts && <BasePart cardType={(cardType)} formType={formType} />}
          


          {/* Рендеринг секции ResultParts только для additional-info и service */}
          {!hideParts && (cardType == CardType.ADDITIONAL_INFO || cardType == CardType.SERVICE) && (formType !== FormType.TITLE && formType !== FormType.VIDEO) &&
            <ResultParts
              descriptionParts={methods.getValues("descriptionParts")}
              iconLinks={methods.getValues("iconLinks")}
            />
          }
          <Button type="submit" variant="contained" color="primary" className={"brown-button"}sx={{ mt: 2, marginTop:"auto" }}>
            {buttonSubmitName}
          </Button>
        </form>
      </FormProvider>

    </MandatoryForm>
  );
};

export default AdminFormPanel;
