import { Container, Skeleton } from "@mui/material";
//import { GesturalVideoComponent } from "../ServicesPage/ServiceCards/CardParts/GesturalParts";
import { LoadMediaProvider } from "../../../contextProviders/LoadMediaProvider";


import ManualStrpComponent from "./ManualStripComponent";
import ServiceResultHeader from "./ServiceResultHeader";
import { useParams } from "react-router-dom";
import { getService } from "../../../api/backendApi";
import { useEffect, useState } from "react";
//import { InfoCard } from "../../interfaces/CardsInterfaces";


const ServiceResultSkeleton = ()=>{
    return (
    <div className="skeleton-container">
    <Skeleton  sx={{br:"30px",margin:"0 auto", padding:"0", transform: "unset;", background:"#a77259;"}} width={"70vw"} height={"7vh"}></Skeleton>
    <Container maxWidth={false} sx={{width:"70vw !important"}} className={"skeleton-title-container"}>
    <Skeleton  sx={{br:"30px", padding:"0", transform: "unset;", background:"#a77259;"}} width={"5vw"} height={"10vh"}></Skeleton>
    <Skeleton  sx={{margin:"0 auto", padding:"0", transform: "unset;", background:"#a77259;"}} width={"50vw"} height={"10vh"}></Skeleton>
    <Skeleton  sx={{padding:"0", transform: "unset;", background:"#a77259;"}} width={"5vw"} height={"10vh"}></Skeleton>
    </Container>
    <Skeleton sx={{margin:"20px auto", padding:"0", transform: "unset;", background:"#ffe6d073;"}}  width={"30vw"} height={"50vh"}></Skeleton>
    <Skeleton sx={{margin:"20px auto", padding:"", transform: "unset;", ml:"auto", mr:"35vw", background:"#b98f7b"}} variant={"rounded"} width={"15vw"} height={"5vh"}></Skeleton>
    <Skeleton sx={{margin:"20px auto", padding:"", transform: "unset;",  background:"#C3936773;"}}  width={"50vw"} height={"30vh"}></Skeleton>
</div>)
}


interface ServiceData {
    title: string;
    gifLink: string;
    iconLinks: string[];
    description: string;
    additionIds:number[];
}

const ServiceResultComponent = () => {
    const { serviceId } = useParams<{ serviceId?: string }>();
    const [serviceData, setServiceData] = useState<ServiceData>({
        title: 'Error',
        gifLink: 'Error',
        iconLinks: [],
        description: 'Error',
        additionIds: [],
    });
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    // Convert serviceId to a number or set it to -1 if invalid
    const idNumberService = serviceId ? Number(serviceId) : -1;

    // Fetch data using useEffect
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set isLoading to true before fetching
            if (idNumberService !== -1) {
                try {
                    const data = await getService(idNumberService);
                    setServiceData(data);
                } catch (error) {
                    console.error('Error fetching service data:', error);
                    // Consider displaying an error message to the user
                } finally {
                    setIsLoading(false); // Set isLoading to false after fetching
                }
            }
        };
        fetchData();
    }, [idNumberService]);

    return (
        <LoadMediaProvider>
            {isLoading && ( // Show loader if isLoading is true
                /*<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress size={80} className="brown-loader"/>
                </div>*/
                <ServiceResultSkeleton />
            )}

            {!isLoading && ( // Show content if isLoading is false
                <div>
                    <ServiceResultHeader title={serviceData.title} />
                    <section>
                        <main className="main-content main-result">
                            <section className="view-choose">
                                <Container>
                                    <ManualStrpComponent 
                                    gifLink={serviceData.gifLink} 
                                    description={serviceData.description} 
                                    iconLinks={serviceData.iconLinks}  
                                    additionIds={serviceData.additionIds}/>
                                </Container>
                            </section>
                        </main>
                    </section>
                </div>
            )}
        </LoadMediaProvider>
    );
};

export default ServiceResultComponent;