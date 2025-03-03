import { Box, IconButton } from "@mui/material"
import { PropsWithChildren } from "react"
import InstructionSection from "./InstructionSection"
import LoadingComponent from "../../LoadingComponent"
import ModalStyle from "../../../styles/modalStyle"
import { Category, InfoCard, Service } from "../../../interfaces/CardsInterfaces"
import { CardType, FormType } from "../../../contextProviders/formTypeProvider"
import Scrollbar from "../../ScrollBar/ScrollBar"

interface MandatoryFormProps extends PropsWithChildren {
    neededData: Category[] | Service | InfoCard[] | undefined,
    modalClose: (event: Event) => void,
    showInstruction: boolean,
    setShowInstruction: (value: React.SetStateAction<boolean>) => void,
    formType: FormType,
    cardInFormType: CardType;
}

export const MandatoryForm = ({ children, neededData, modalClose, showInstruction, setShowInstruction, formType, cardInFormType }: MandatoryFormProps) => {
    return (
        <Box id="card-form-container" sx={{ padding: 3, paddingRight:"5px", maxWidth: 800, margin: '0 auto', borderRadius: "40px", ...ModalStyle }}>
                <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => modalClose(e as unknown as Event)}>
                        X
                    </IconButton>
                </Box>
                <Scrollbar  alginRight={true} height="60vh" addArrowsButtons={false}>
                <InstructionSection cardInFormType={cardInFormType} showInstruction={showInstruction} onBackClick={() => setShowInstruction(false)} />
                {
                    (neededData || formType === FormType.CREATE) && !showInstruction ?
                        <>
                            {children}

                        </>
                        :
                        !showInstruction && <LoadingComponent />
                }
                </Scrollbar>

        </Box>

    )
}