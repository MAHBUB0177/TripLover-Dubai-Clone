import { Box, Text } from "@chakra-ui/react";
import React from "react";
import Footer from "../../SharePages/Footer/Footer";
import FooterLR from "../FooterLR/FooterLR";
import Navbar from "../Navbar/Navbar";

const AboutUs = () => {
    window.scrollTo(0, 0);
    return (
        <>
            <Navbar></Navbar>
            <div className="hold-transition login-page search-panel-bg " style={{ height: "100%" }} >
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-lg-12 " >
                            <Text fontWeight={700} fontSize='20px' pb={'15px'}>About Us</Text>
                        </div>

                        <Box>
                            <Text pb={'20px'}>
                                Triplover Limited is a sister concern of the US-Bangla Group which has set its sights on outclassing the online travel market in Bangladesh to bring the tours you desire.
                            </Text>

                            <Text pb={'20px'}>
                                Since 2009 US-Bangla Group has been the fastest-growing company in Bangladesh. The group is engaged in creating a more fantastic future for the next generation with US-Bangla Airlines, USB Express, Vibrant, US-Bangla Medical College and Hospital, and many more. As a travel-tech organization, Triplover Limited looks forward to viable courses as it moves interactively into the years ahead. They are setting goals for advancing its network and expanding activities, intending to provide you with everything for a hassle-free tour. Incorporating deals with worldwide hotels and  airlines, Triplover Limited makes it convenient to prepare for your travels, minimize your expenses, and highlights valuable insights.
                            </Text>

                            <Text pb={'20px'}>
                                Triplover Limited will offer services for booking hotels, airplanes, and tour reservations. Through commitments to tailored and top-notch services, Triplover will make every attempt to develop innovative traveling arrangements. Holiday and corporate clients can learn about, connect with, and book a wide range of services specialized to their travel preferences by exploring  Triplover’s website. In all phases of the customers' journeys—before, throughout, and even after, it provides amicable  assistance.
                            </Text>

                            <Text pb={'20px'}>
                                With the ambition of becoming recognized as a portrait of reliability, cutting-edge technology, and dedication to travel management, Triplover Limited approaches the travel industry.
                            </Text>
                        </Box>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
};

export default AboutUs;
