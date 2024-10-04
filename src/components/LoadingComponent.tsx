import { CircularProgress } from "@mui/material"

const LoadingCompanent = ()=>{
    return (
        <div style={{     
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            margin: "0 auto ",
            }}>
            <CircularProgress size={80} className="brown-loader"/>
        </div>)
}
export default LoadingCompanent;