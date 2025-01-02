import { CardType } from "../../../contextProviders/formTypeProvider";
import { Category, InfoCard, Service } from "../../../interfaces/CardsInterfaces";
import { FormValues } from "../../../interfaces/FormValuesInterface";
import { getTextBlocks } from "../../pages/ServiceResultPage/blockInsertion";

export const FillFormWithData = (type: CardType, data: Category | Service | InfoCard) => {
    let descriptions = [];
    switch (type) {
        case CardType.CATEGORY:
            return {
                switchToTransfer: -1,
                id: data.id,
                title: data.title,
                mainIconLink: data.mainIconLink,
                gifPreview: data.gifPreview,
            };

        case CardType.SERVICE:
            data = data as Service;
            descriptions = getTextBlocks(data.description, data.iconLinks);
            if (descriptions.length === 0)
                descriptions = [""]
            //console.log(descriptions);
            return {
                switchToTransfer: -1,
                id: data.id,
                title: data.title,
                mainIconLink: data.mainIconLink,
                gifPreview: data.gifPreview,
                parentId: 0,
                resVideo: data.gifLink,
                descriptionParts: descriptions,
            };
        case CardType.SUB_CATEGORY:
            return {
                switchToTransfer: -1,
                id: data.id,
                title: data.title,
                mainIconLink: data.mainIconLink,
                gifPreview: data.gifPreview,
                parentId: 0,
            };
        case CardType.ADDITIONAL_INFO:
            data = data as InfoCard;
            descriptions = getTextBlocks(data.description, data.iconLinks);
            return {
                switchToTransfer: -1,
                id: data.id,
                title: data.title,
                mainIconLink: data.mainIconLink,
                gifPreview: data.gifPreview,
                parentId: 0,
                resVideo: data.gifLink,
                descriptionParts: descriptions,
            };
        default:
            return {
                switchToTransfer: -1,
                id: -1,
                title: "",
                mainIconLink: "",
                gifPreview: "",
            }
    }
}


export const getDefaultValues = (type: CardType): FormValues => {
    switch (type) {
        case CardType.CATEGORY:
            return {
                switchToTransfer: -1,
                id: -1,
                title: "",
                mainIconLink: "",
                gifPreview: "",
            };

        case CardType.SERVICE:
            return {
                switchToTransfer: -1,
                id: -1,
                title: "",
                mainIconLink: "",
                gifPreview: "",
                parentId: 0,
                resVideo: "",
                descriptionParts: [""],
                iconLinks: [""],
            };
        case CardType.SUB_CATEGORY:
            return {
                switchToTransfer: -1,
                id: -1,
                title: "",
                mainIconLink: "",
                gifPreview: "",
                parentId: 0,
            };
        case CardType.ADDITIONAL_INFO:
            return {
                switchToTransfer: -1,
                id: -1,
                title: "",
                mainIconLink: "",
                gifPreview: "",
                parentId: 0,
                resVideo: "",
                descriptionParts: [""],
                iconLinks: [""]
            };
        default:
            return {
                switchToTransfer: -1,
                id: -1,
                title: "",
                mainIconLink: "",
                gifPreview: "",
            };
    }
};
