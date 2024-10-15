import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, IconButton } from '@mui/material';
import InstructionSection from './InstructionSection';
import FormHeader from './FormHeader';
import ParentChooseSection from './ParentChooseSection';
import ResultParts from './ResultParts';
import BasePart from './BasePart';
import { CardType, FormType, useCardAndFormType } from '../../../contextProviders/formTypeProvider';
import { useEffect, useState } from 'react';



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

const AdminFormPanel = ({cardInFormType, formType, modalClose, handleSubmitModal, openModal}:
  {
    cardInFormType:CardType, 
    formType:FormType, 
    modalClose: (event:React.MouseEvent<HTMLButtonElement>) => void,
    handleSubmitModal: (event: React.MouseEvent<HTMLButtonElement>) => void,
    openModal: boolean,
  }) => {
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

const methods = useForm({
    defaultValues: getDefaultValues(cardInFormType),
});

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  useEffect(()=>{
    setCardType(cardInFormType);
    if (formType === FormType.EDIT) {
        methods.reset({
        switchToTransfer: false,
        parentId: 6,
        previewTitle:"title 1 test",
        imagePreview:"main icon 1 test",
        videoPreview: "video 1 test",
        resVideo:"resVid test",
        descriptionParts:["description test 2.1", "description test 2.2", "description test 2.3"],
        iconLinks:["test1", "test2"]
      });
    }
  }, [cardInFormType, formType, openModal, methods]);

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
