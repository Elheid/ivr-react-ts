import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

    interface ImageFieldProps {
        registerName: string;
        img?:string | null;
    }

const ImageField = React.memo(({ registerName, img }:ImageFieldProps) => {
    const { register, watch  } = useFormContext();
    const [imageSrc, setImageSrc] = useState<string>(''); // состояние для хранения ссылки на изображение
    

    const currentValue = watch(registerName);

    useEffect(() => {
        if (currentValue) {
        setImageSrc(currentValue); // обновляем ссылку на изображение при рендере и изменении
        }
        if (currentValue !== img && img){
            setImageSrc(img); // обновляем ссылку на изображение при рендере и изменении
        }
    }, [currentValue]);

    return (
        <>
            <TextField
                {...register(registerName)}
                defaultValue={img|| ""}
                label="Ссылка на изображение"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            {/* Предварительный просмотр изображения */}
            { (
                <img
                    src={imageSrc}
                    alt="Предпросмотр"
                    style={{ marginTop: '16px', maxWidth: '100%', height: 'auto' }}
                    onError={() => setImageSrc('')} // убираем изображение, если ссылка некорректна
                />
            )}
        </>
    );
});

export default ImageField;