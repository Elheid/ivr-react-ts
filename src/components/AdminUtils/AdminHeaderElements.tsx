import { useEffect, useState } from "react";
import { isAdmin } from "../../utill";
import AdminButtonsSwitch from "./AdminButtonsSwitch";
import { fetchAndRefreshToken } from "../../api/backendApi";
import { Container } from "@mui/material";

const AdminHeaderElements = ()=>{
    const [isRefreshable, setRefreshable] = useState(false);
    useEffect(()=>{
        try{
            fetchAndRefreshToken();
            setRefreshable(true);
        }
        catch{
            alert("Ошибка, не вошли в аккаунт")
        }
    },[])

    return (
        <Container sx={{
            display: "flex;",
            flexDirection: "column;",
            alignItems: "center;",
        }}>
        {isAdmin() && isRefreshable &&  <AdminButtonsSwitch />}
        {isAdmin() && isRefreshable && <span style={{color:"green"}}>Авторизованы</span>}
        </Container>
    );
}

export default AdminHeaderElements;