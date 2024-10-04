import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { UseFormRegister } from 'react-hook-form';
import LoginFormInputs from '../../../interfaces/LogInInterface';

interface RememberMeCheckboxProps {
  register: UseFormRegister<LoginFormInputs>;
}

const RememberMeCheckbox = ({ register }:RememberMeCheckboxProps) => (
  <FormControlLabel
    control={<Checkbox {...register('rememberMe')} color="primary" />}
    label="Запомнить меня"
    sx={{ mt: 1, textAlign: 'left' }}
  />
);

export default RememberMeCheckbox;
