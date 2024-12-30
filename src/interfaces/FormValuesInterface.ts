export interface FormValues {
    switchToTransfer: boolean;
    id:number,
    title: string;
    mainIconLink: string;
    gifPreview: string;
    parentId?: number; // если это поле может отсутствовать
    resVideo?: string; // если это поле может отсутствовать
    descriptionParts?: string[]; // если это поле может отсутствовать
    iconLinks?: string[]; // если это поле может отсутствовать
}