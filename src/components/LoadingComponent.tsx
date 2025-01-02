import { CircularProgress } from "@mui/material"

const LoadingCompanent = ({className, styles}:{className?:string, styles?:object})=>{
    return (
        <div
        className={className}
        style={{     
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            margin: "0 auto ",
            zIndex:999,
            ...styles
            }}>
            <CircularProgress size={80} className="brown-loader"/>
        </div>)
}
export default LoadingCompanent;