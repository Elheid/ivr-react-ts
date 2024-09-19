import { CircularProgress, Container } from "@mui/material";
//import { GesturalVideoComponent } from "../ServicesPage/ServiceCards/CardParts/GesturalParts";
import { LoadMediaProvider } from "../../contextProviders/LoadMediaProvider";


import ManualStrpComponent from "./ManualStripComponent";
import ServiceResultHeader from "./ServiceResultHeader";
import { useParams } from "react-router-dom";
import { getService } from "../../api/backendApi";
import { checkUndefined } from "../../utill";
import { useEffect, useState } from "react";



const Loader = () => {
    return (
        <div id="loader" className="loader-wrapper hidden">
            <div className="loader"></div>
        </div>
    );
};



interface ServiceData {
    title: string;
    gifLink: string;
    iconLinks: string[];
    description: string;
}

const ServiceResultComponent = () => {
    const { serviceId } = useParams<{ serviceId?: string }>();
    const [serviceData, setServiceData] = useState<ServiceData>({
        title: 'Error',
        gifLink: 'Error',
        iconLinks: [],
        description: 'Error',
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress size={80} className="brown-loader"/>
                </div>
            )}

            {!isLoading && ( // Show content if isLoading is false
            <div>
            <ServiceResultHeader title={serviceData.title} />
                <section>
                    <main className="main-content main-result">
                        <section className="view-choose">
                            <Container>
                                <ManualStrpComponent gifLink={serviceData.gifLink} description={serviceData.description} />
                                {/* <Loader />*/}
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