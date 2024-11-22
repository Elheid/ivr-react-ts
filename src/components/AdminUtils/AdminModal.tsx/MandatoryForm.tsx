import { Box, Button, IconButton } from "@mui/material"
import { PropsWithChildren } from "react"
import InstructionSection from "./InstructionSection"
import { FormProvider } from "react-hook-form"
import FormHeader from "./FormHeader"
import LoadingCompanent from "../../LoadingComponent"
import ModalStyle from "../../../styles/modalStyle"
import { Category, InfoCard, Service } from "../../../interfaces/CardsInterfaces"
import { FormType } from "../../../contextProviders/formTypeProvider"

interface MandatoryFormProps extends PropsWithChildren {
  neededData: Category[] | Service | InfoCard[] | undefined,
  modalClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
  showInstruction: boolean,
  setShowInstruction: (value: React.SetStateAction<boolean>) => void,
  formType: FormType,
  buttonSubmitName:string,
}

export const MandatoryForm = ({ children, neededData, modalClose, showInstruction, setShowInstruction, formType, buttonSubmitName }: MandatoryFormProps) => {
  return (
    <Box id="card-form-container" sx={{ padding: 3, maxWidth: 800, margin: '0 auto', ...ModalStyle }}>
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => modalClose(e)}>
          X
        </IconButton>
      </Box>
      <InstructionSection showInstruction={showInstruction} onBackClick={() => setShowInstruction(false)} />
      {
        (neededData || formType === FormType.CREATE) && !showInstruction ?
          <>
            {children}

          </>
          :
          <LoadingCompanent />
      }
    </Box>

  )
}