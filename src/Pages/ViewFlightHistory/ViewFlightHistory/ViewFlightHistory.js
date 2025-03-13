import React from 'react';
import Footer from '../../SharePages/Footer/Footer';
import Navbar from '../../SharePages/Navbar/Navbar';
import SideNavBar from '../../SharePages/SideNavBar/SideNavBar';
import ViewFlightHistoryPanel from '../ViewFlightHistoryPanel/ViewFlightHistoryPanel';

const ViewFlightHistory = () => {
    return (
        <div>
            <Navbar></Navbar>
            <SideNavBar></SideNavBar>
            <ViewFlightHistoryPanel></ViewFlightHistoryPanel>
            {/* <Footer></Footer> */}
        </div>
    );
};

export default ViewFlightHistory;