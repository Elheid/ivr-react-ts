import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ExitPage = ()=>{
    const navigate = useNavigate();
    useEffect(()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('refresh-token');
        navigate("/");
    },[])
    return (false);
}
export default ExitPage;
