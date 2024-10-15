/*import { styled } from "@mui/material/styles";
import Switch, { switchClasses } from "@mui/material/Switch";

const pxToRem = (px: number, oneRemPx = 17) => `${px / oneRemPx}rem`;*/

import { useRef } from "react";
import edit from "../../assets/img/edit.svg"
import eyeSVG from "../../assets/img/view.svg"
import { useShowAdminButtons } from "../../contextProviders/ShowAdminButtonsProvider"

const AdminButtonsSwitch = () => {
    const {setShowAdminButtons} = useShowAdminButtons();
    const checkboxRef = useRef<HTMLInputElement>(null);


    const labelHandleClick = () => {
        if ((checkboxRef.current && checkboxRef.current.checked)) {
            setShowAdminButtons(false);
            console.log("Admin buttons hidden");
        } else {
            setShowAdminButtons(true);
            console.log("Admin buttons shown");
        }
    };
    return (
        <>
            <input 
            type="checkbox" 
            id="toggle" 
            className="toggleCheckbox admin-button" 
            wfd-id="id3"
            ref={checkboxRef}
            />
            <label onClick={labelHandleClick} htmlFor="toggle" className="toggleContainer">
                <div >
                <img src={eyeSVG} /></div>
                <div >
                    <img src={edit} />
                </div>
            </label>
        </>
    )
}

/*
export const AdminButtonsSwitch = styled(Switch)(({ theme }) => {
    const borderWidth = 2;
    const width = pxToRem(52 + 20);
    const height = pxToRem(40);
    const size = pxToRem(32);
    const gap = (40 - 32) / 2;
    const primaryColor = "#60A29B";
    return {
        width,
        height,
        padding: 0,
        margin: theme.spacing(1),
        overflow: "unset",
        [`& .${switchClasses.switchBase}`]: {
            padding: pxToRem(gap),
            [`&.${switchClasses.checked}`]: {
                color: "#fff",
                transform: `translateX(calc(${width} - ${size} - ${pxToRem(2 * gap)}))`,
                [`& + .${switchClasses.track}`]: {
                    backgroundColor: "unset",
                    opacity: 1,
                },
                [`& .${switchClasses.thumb}`]: {
                    backgroundColor: "#fff",
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path fill="${encodeURIComponent(
                        primaryColor
                    )}" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>')`,
                },
            },
        },
        [`& .${switchClasses.disabled}`]: {
            [`& .${switchClasses.thumb}`]: {
                color: "#bdbdbd",
            },
            [`& + .${switchClasses.track}`]: {
                backgroundColor: "#000",
            },
        },
        [`& .${switchClasses.track}`]: {
            borderRadius: 40,
            backgroundColor: "unset",
            border: "solid #fff",
            borderWidth,
            opacity: 0.48,
        },
        [`& .${switchClasses.thumb}`]: {
            width: size,
            height: size,
            boxShadow: "none",
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="${encodeURIComponent(
                primaryColor
            )}" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
        },
    };
});*/
/*
const AdminButtonsSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
          color: '#fff',
          transform: 'translateX(22px)',
          '& .MuiSwitch-thumb:before': {
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                  '#fff',
              )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
          },
          '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: '#aab4be',
              ...theme.applyStyles('dark', {
                  backgroundColor: '#8796A5',
              }),
          },
      },
  },
  '& .MuiSwitch-thumb': {
      backgroundColor: '#001e3c',
      '&::before': {
          content: "''",
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
              '#fff',
          )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      ...theme.applyStyles('dark', {
          backgroundColor: '#003892',
      }),
  },
  '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: '#aab4be',
      borderRadius: 20 / 2,
      ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
      }),
  },
}));*/
export default AdminButtonsSwitch;