import { TextField } from "@mui/material";
import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import LoadFileAndGetUrl from "../LoadAndGetUrl/LoadFileAndGetUrl";

interface VideoFieldProps extends Omit<React.ComponentProps<typeof TextField>, 'name'> {
    registerName: string;
}

export const VideoField =  React.memo(({ registerName, ...textFieldProps  }: VideoFieldProps) => {
    const { register } = useFormContext();
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <>    
        <TextField
        InputLabelProps={{ shrink: true }}
            inputRef={inputRef}
            required
            {...register(registerName)}
            label="Ссылка на видео"
            variant="outlined"
            fullWidth
            margin="normal"
            {...textFieldProps}
            />
        <LoadFileAndGetUrl name={registerName} inputRef={inputRef} />    
        <hr className='horizontal-divider' />
        </>

    );
});