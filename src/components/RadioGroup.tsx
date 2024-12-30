import { Radio } from "@mui/material";
import React from "react";

export default function RadioButtons({values, labels, onChange}:{values:string[], labels?:string[], onChange?:()=> void}) {
    const [selectedValue, setSelectedValue] = React.useState(values[0]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
        onChange?.()
    };

    return (
        <div>
            {labels && <label htmlFor="first-radio">{labels[0]}</label>}
            <Radio
                checked={selectedValue === values[0]}
                onChange={handleChange}
                value={values[0]}
                name="first-radio"
                inputProps={{ 'aria-label': `${values[0]}` }}
            />
            {labels && <label htmlFor="second-radio">{labels[1]}</label>}
            <Radio
                checked={selectedValue === values[1]}
                onChange={handleChange}
                value={values[1]}
                name="second-radio"
                inputProps={{ 'aria-label': `${values[1]}` }}
            />
        </div>
    );
}