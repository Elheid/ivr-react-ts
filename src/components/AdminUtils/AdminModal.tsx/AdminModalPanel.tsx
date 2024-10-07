import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, IconButton } from '@mui/material';
import InstructionSection from './InstructionSection';
import FormHeader from './FormHeader';
import ParentChooseSection from './ParentChooseSection';
import ResultParts from './ResultParts';
import BasePart from './BasePart';
import { CardType, FormType, useCardAndFormType } from '../../../contextProviders/formTypeProvider';



interface FormValues {
  switchToTransfer: boolean;
  previewTitle: string;
  imagePreview: string;
  videoPreview: string;
  parentId?: number; // если это поле может отсутствовать
  resVideo?: string; // если это поле может отсутствовать
  description?: string; // если это поле может отсутствовать
  iconLinks?: string[]; // если это поле может отсутствовать
}

const AdmonModalPanel = ({cardInFormType, formType}:{cardInFormType:CardType, formType:FormType}) => {
  const [showInstruction, setShowInstruction] = useState(false);
  const {cardType, setCardType} = useCardAndFormType();
  const [hideParts, setHideParts] = useState(false); // Состояние для скрытия ResultParts и BasePart


  const buttonSubmitName = formType === FormType.EDIT ? 'Редактировать' : 'Создать' + " карточку";

  const handleTransferChange = (value: string) => {
    // Если "Да", скрываем части
    setHideParts(value === 'true');
};


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
        description:"",
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
        video:"",
        parentId: 0,       
        resVideo:"",
        description:"",
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

const methods = useForm({
    defaultValues: getDefaultValues(cardInFormType),
});

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  useEffect(()=>{
    setCardType(cardInFormType);
    if (formType !== FormType.EDIT) {
      methods.reset({
        switchToTransfer: false,
        parentId: 6,
        previewTitle:"title 1 test",
        imagePreview:"main icon 1 test",
        videoPreview: "video 1 test",
        resVideo:"resVid test",
        description:"description test 2",
        iconLinks:["test1", "test2"]
        // Установите остальные поля из cardInFormType, если они существуют
      });
    }
  }, [cardInFormType, formType]);

  return (
    <Box id="card-form-container" sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
      <Box display="flex" justifyContent="flex-end">
        <IconButton>
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
            {!hideParts && <BasePart />}

            {/* Рендеринг секции ResultParts только для additional-info и service */}
            {!hideParts && (cardType == CardType.ADDITIONAL_INFO || cardType == CardType.SERVICE) && <ResultParts />}

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              {buttonSubmitName}
            </Button>
          </form>
        </FormProvider>
      }
    </Box>
  );
};

export default AdmonModalPanel;
