import { Box, IconButton } from "@mui/material"
import { PropsWithChildren } from "react"
import InstructionSection from "./InstructionSection"
import LoadingCompanent from "../../LoadingComponent"
import ModalStyle from "../../../styles/modalStyle"
import { Category, InfoCard, Service } from "../../../interfaces/CardsInterfaces"
import { FormType } from "../../../contextProviders/formTypeProvider"

interface MandatoryFormProps extends PropsWithChildren {
  neededData: Category[] | Service | InfoCard[] | undefined,
  modalClose: (event: Event) => void,
  showInstruction: boolean,
  setShowInstruction: (value: React.SetStateAction<boolean>) => void,
  formType: FormType,
}

export const MandatoryForm = ({ children, neededData, modalClose, showInstruction, setShowInstruction, formType }: MandatoryFormProps) => {
  return (
    <Box id="card-form-container" sx={{ padding: 3, maxWidth: 800, margin: '0 auto', ...ModalStyle }}>
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => modalClose(e as unknown as Event)}>
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