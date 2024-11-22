import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid2, TextField } from '@mui/material';

interface ImageFieldProps extends Omit<React.ComponentProps<typeof TextField>, 'name'> {
    registerName: string;
    img?: string | null;
}

const ImageField = React.memo(({ registerName, img, ...textFieldProps  }: ImageFieldProps) => {
    const { register, watch } = useFormContext();
    const [imageSrc, setImageSrc] = useState<string>(''); // состояние для хранения ссылки на изображение


    const currentValue = watch(registerName);

    useEffect(() => {
        if (currentValue) {
            setImageSrc(currentValue); // обновляем ссылку на изображение при рендере и изменении
        }
        if (currentValue !== img && img) {
            setImageSrc(img); // обновляем ссылку на изображение при рендере и изменении
        }
    }, [currentValue]);

    return (
        <Grid2 sx={{alignItems: "center;"}} container rowSpacing={6} columnSpacing={{ xs: 9, sm: 9, md: 9 }}>
            <Grid2 sx={{height:" fit-content;"}}>
                <TextField
                    {...register(registerName)}
                    defaultValue={img || ""}
                    label="Ссылка на изображение"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    {...textFieldProps}
                />
            </Grid2>

            {(
                <Grid2>
                <img
                    src={imageSrc}
                    alt="Предпросмотр"
                    style={{ marginTop: '16px', maxWidth: '100%', height: 'auto' }}
                    onError={() => setImageSrc('')} 
                />
                </Grid2>
            )}
        </Grid2>
    );
});

export default ImageField;