import { Container, Skeleton } from "@mui/material";
//import { GesturalVideoComponent } from "../ServicesPage/ServiceCards/CardParts/GesturalParts";
import { LoadMediaProvider } from "../../../contextProviders/LoadMediaProvider";


import ManualStrpComponent from "./ManualStripComponent";
import ServiceResultHeader from "./ServiceResultHeader";
import { useParams } from "react-router-dom";
import { getService } from "../../../api/backendApi";
import { useEffect, useState } from "react";
import AdminHeaderElements from "../../AdminUtils/AdminHeaderElements";
import { useInfoCardsQuery, useServicesQuery } from "../../../hooks/useCategoriesQuery";
//import { InfoCard } from "../../interfaces/CardsInterfaces";


const ServiceResultSkeleton = () => {
    const cardType = localStorage.getItem("language") === "clear-language";
    return (
        <div className="skeleton-container">
            <Skeleton sx={{ br: "30px", margin: "0 auto", padding: "0", transform: "unset;", background: "#a77259;" }} width={"70vw"} height={"7vh"}></Skeleton>
            <Container maxWidth={false} sx={{ width: "70vw !important" }} className={"skeleton-title-container"}>
                <Skeleton sx={{ br: "30px", padding: "0", transform: "unset;", background: "#a77259;" }} width={"5vw"} height={"10vh"}></Skeleton>
                <Skeleton sx={{ margin: "0 auto", padding: "0", transform: "unset;", background: "#a77259;" }} width={"50vw"} height={"10vh"}></Skeleton>
                <Skeleton sx={{ padding: "0", transform: "unset;", background: "#a77259;" }} width={"5vw"} height={"10vh"}></Skeleton>
            </Container>
            {!cardType && <Skeleton sx={{ margin: "20px auto", padding: "0", transform: "unset;", background: "#ffe6d073;" }} width={"30vw"} height={"50vh"}></Skeleton>}
            <Skeleton sx={{ margin: "20px auto", padding: "", transform: "unset;", ml: "auto", mr: "35vw", background: "#b98f7b" }} variant={"rounded"} width={"15vw"} height={"5vh"}></Skeleton>
            <Skeleton sx={{ margin: "20px auto", padding: "", transform: "unset;", background: "#C3936773;" }} width={"50vw"} height={"30vh"}></Skeleton>
        </div>)
}


interface ServiceData {
    title: string;
    gifLink: string;
    iconLinks: string[];
    description: string;
    additionIds: number[];
}

const ServiceResultComponent = () => {
    const { serviceId } = useParams<{ serviceId?: string }>();
    const [serviceData, setServiceData] = useState<ServiceData>();

    // Convert serviceId to a number or set it to -1 if invalid
    const idNumberService = serviceId ? Number(serviceId) : -1;
    const {data: servicesInfo,  error: servicesError, isLoading: isServicesLoading } = useServicesQuery({serviceId:idNumberService});


    const [isLoading, setIsLoading] = useState(true); // Add loading state


    // Fetch data using useEffect
    useEffect(() => {
            setIsLoading(true); // Set isLoading to true before fetching
            const data = servicesInfo as ServiceData;
            setServiceData(data)

    }, [idNumberService, servicesInfo]);

    if (isServicesLoading){
        return <ServiceResultSkeleton />;
    }

    return (
        <LoadMediaProvider>

            {!isServicesLoading && serviceData !== undefined && ( // Show content if isLoading is false
                <div>
                    <ServiceResultHeader title={serviceData.title} />
                    <AdminHeaderElements />
                    <section>
                        <main className="main-content main-result">
                            <section className="view-choose">
                                <Container>
                                    <ManualStrpComponent
                                        gifLink={serviceData.gifLink}
                                        description={serviceData.description}
                                        iconLinks={serviceData.iconLinks}
                                        additionIds={serviceData.additionIds} />
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