import React from 'react';
import Footer from '../../SharePages/Footer/Footer';
import Navbar from '../../SharePages/Navbar/Navbar';
import SideNavBar from '../../SharePages/SideNavBar/SideNavBar';
import FlightHistoryPanel from '../FlightHistoryPanel/FlightHistoryPanel';

const FlightHistoryPage = () => {
    return (
        <div>
            <Navbar></Navbar>
            <SideNavBar></SideNavBar>
            <FlightHistoryPanel></FlightHistoryPanel>
            <Footer></Footer>
        </div>
    );
};

export default FlightHistoryPage;