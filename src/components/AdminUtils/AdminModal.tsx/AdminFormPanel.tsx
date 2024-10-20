import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, IconButton } from '@mui/material';
import InstructionSection from './InstructionSection';
import FormHeader from './FormHeader';
import ParentChooseSection from './ParentChooseSection';
import ResultParts from './ResultParts';
import BasePart from './BasePart';
import { CardType, FormType, useCardAndFormType } from '../../../contextProviders/formTypeProvider';
import { useEffect, useState } from 'react';
import { useCategoriesQuery, useInfoCardsQuery, useServicesQuery } from '../../../hooks/useCategoriesQuery';
import { Category, InfoCard, Service } from '../../../interfaces/CardsInterfaces';
import { getTextBlocks } from '../../pages/ServiceResultPage/blockInsertion';


const FillFormWithData = (type : CardType, data : Category | Service | InfoCard)=>{
  let descriptions = [];
  switch (type) {
    case CardType.CATEGORY:
      return {
        switchToTransfer: false,
        previewTitle:data.title,
        imagePreview:data.mainIconLink,
        videoPreview:data.gifPreview,
      };

    case CardType.SERVICE:
      data = data as Service;
      descriptions = getTextBlocks(data.description, data.iconLinks);
      console.log(descriptions);
      return {
        switchToTransfer: false,
        previewTitle:data.title,
        imagePreview:data.mainIconLink,
        videoPreview:data.gifPreview,
        parentId: 0,       
        resVideo:data.gifLink,
        descriptionParts:descriptions,
      };
    case CardType.SUB_CATEGORY:
      return {
        switchToTransfer: false,
        previewTitle:data.title,
        imagePreview:data.mainIconLink,
        videoPreview:data.gifPreview,
        parentId: 0,
      };
    case CardType.ADDITIONAL_INFO:
      data = data as InfoCard;
      descriptions = getTextBlocks(data.description, data.iconLinks);
      return {
        switchToTransfer: false,
        previewTitle:data.title,
        imagePreview:data.mainIconLink,
        videoPreview:data.gifPreview,
        parentId: 0,       
        resVideo:data.gifLink,
        descriptionParts:descriptions,
      };
    default:
      return {
        switchToTransfer: false,
        previewTitle:"",
        imagePreview:"",
        videoPreview:"",
      }
  }
}


const getDefaultValues = (type: CardType): FormValues => {
  switch (type) {
    case CardType.CATEGORY:
      return {
        switchToTransfer: false,
        previewTitle:"",
        imagePreview:"",
        videoPreview:"",
      };

    case CardType.SERVICE:
      return {
        switchToTransfer: false,
        previewTitle:"",
        imagePreview:"",
        videoPreview:"",
        parentId: 0,       
        resVideo:"",
        descriptionParts:[],
        iconLinks:[""],
      };
    case CardType.SUB_CATEGORY:
      return {
        switchToTransfer: false,
        previewTitle:"",
        imagePreview:"",
        videoPreview:"",
        parentId: 0,
      };
    case CardType.ADDITIONAL_INFO:
      return {
        switchToTransfer: false,
        previewTitle:"",
        imagePreview:"",
        videoPreview:"",
        parentId: 0,       
        resVideo:"",
        descriptionParts:[],
        iconLinks:[""] 
      };
    default:
      return {
        switchToTransfer: false,
        previewTitle:"",
        imagePreview:"",
        videoPreview:"",
      };
  }
};


interface FormValues {
  switchToTransfer: boolean;
  previewTitle: string;
  imagePreview: string;
  videoPreview: string;
  parentId?: number; // если это поле может отсутствовать
  resVideo?: string; // если это поле может отсутствовать
  descriptionParts?: string[]; // если это поле может отсутствовать
  iconLinks?: string[]; // если это поле может отсутствовать
}

const AdminFormPanel = ({id, parentId, cardInFormType, formType, modalClose, handleSubmitModal, openModal}:
  {
    cardInFormType:CardType, 
    formType:FormType, 
    modalClose: (event:React.MouseEvent<HTMLButtonElement>) => void,
    handleSubmitModal: (event: React.MouseEvent<HTMLButtonElement>) => void,
    openModal: boolean,
    id:number,
    parentId?:number,
  }) => {
  const [showInstruction, setShowInstruction] = useState(false);
  const {cardType, setCardType} = useCardAndFormType();
  const [hideParts, setHideParts] = useState(false); // Состояние для скрытия ResultParts и BasePart


    const { data: categoriesInfo } = useCategoriesQuery({
      enabled: cardInFormType === CardType.CATEGORY || cardInFormType === CardType.SUB_CATEGORY && id !== -1
  });

  const { data: serviceInfo } = useServicesQuery(
      { serviceId: id },
      { enabled: cardInFormType === CardType.SERVICE && id !== -1}
  );

  const { data: infoCardInfo } = useInfoCardsQuery(
      { serviceId: parentId},
      { enabled: cardInFormType === CardType.ADDITIONAL_INFO && id !== -1 }
  );

    
  const buttonSubmitName = formType === FormType.EDIT ? 'Редактировать' : 'Создать' + " карточку";

  const handleTransferChange = (value: string) => {
    // Если "Да", скрываем части
    setHideParts(value === 'true');
};

const methods = useForm({
    defaultValues: getDefaultValues(cardInFormType),
});

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  console.log(parentId)
  useEffect(()=>{
      // Логика выбора данных в зависимости от типа карточки
    let data: Category | Service | InfoCard | undefined;

    if (cardInFormType === CardType.CATEGORY || cardInFormType === CardType.SUB_CATEGORY) {
        data = categoriesInfo?.find((category) => id === category.id);
    } else if (cardInFormType === CardType.SERVICE) {
        data = serviceInfo as Service;
    } else if (cardInFormType === CardType.ADDITIONAL_INFO) {
        if (Array.isArray(infoCardInfo)) {
          // Если это массив, ищем объект по id
          data = infoCardInfo.find((info) => id === info.id);
        }
    }
    
    setCardType(cardInFormType);
    if (formType === FormType.EDIT) {
      if (data){
        methods.reset(FillFormWithData(cardInFormType, data));
      }
    }
  }, [cardInFormType, formType, openModal, methods, id, categoriesInfo, infoCardInfo, serviceInfo, setCardType]);

  return (
    <Box id="card-form-container" sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={(e: React.MouseEvent<HTMLButtonElement>)=>modalClose(e)}>
          X
        </IconButton>
      </Box>
      <InstructionSection showInstruction={showInstruction} onBackClick={() => setShowInstruction(false)} />

      {
        !showInstruction &&
        <FormProvider {...methods}>
          <form id="card-form" onSubmit={methods.handleSubmit(onSubmit)}>
            <FormHeader cardInFormType={cardInFormType} formType={formType} onInstructionClick={() => setShowInstruction(true)} />

            {/* Секция выбора типа карточки */}
            {(cardType == CardType.SERVICE || cardType == CardType.SUB_CATEGORY) &&            
            <Box display="flex" gap={2} flexWrap="wrap">
              <ParentChooseSection formType={formType} onChange={handleTransferChange} />
            </Box>
            }



            {/* Рендеринг секции BasePart для всех типов, кроме additional-info */}
            {!hideParts && <BasePart formType={formType} />}

            {/* Рендеринг секции ResultParts только для additional-info и service */}
            {!hideParts && (cardType == CardType.ADDITIONAL_INFO || cardType == CardType.SERVICE) && 
            <ResultParts 
            descriptionParts={methods.getValues("descriptionParts")} 
            iconLinks={methods.getValues("iconLinks")}
            />}

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmitModal}>
              {buttonSubmitName}
            </Button>
          </form>
        </FormProvider>
      }
    </Box>
  );
};

export default AdminFormPanel;
