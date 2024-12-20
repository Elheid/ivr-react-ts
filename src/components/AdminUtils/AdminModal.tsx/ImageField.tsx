import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid2, TextField } from '@mui/material';

const imageContainerStyle = {
    background:" #rgba(255, 255, 255, 0.5)",
    borderBlock: "2px black",
    border:" double",
    marginLeft: "10px",
    marginRight: "5px",
}

interface ImageFieldProps extends Omit<React.ComponentProps<typeof TextField>, 'name'> {
    registerName: string;
    img?: string | null;
}

const ImageField = React.memo(({ registerName, img, ...textFieldProps  }: ImageFieldProps) => {
    const { register, watch } = useFormContext();
    const currentValue = watch(registerName);
    const [imageSrc, setImageSrc] = useState<string>(''); 


    useEffect(() => {
        setImageSrc(currentValue)
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
                <Grid2 sx={imageContainerStyle}>
                {imageSrc ?
                <img
                    src={imageSrc}
                    alt="Предпросмотр"
                    style={{ marginTop: '16px', maxWidth: '100%', height: 'auto',  padding: "5px"}}
                />:
                <div style={{ width: '100%', height: 'auto', minWidth:"3vw", minHeight:"6vh", backgroundColor: 'white'}} />}
                </Grid2>
            )}
        </Grid2>
    );
});

export default ImageField;