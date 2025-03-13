import React from 'react';
import Footer from '../../SharePages/Footer/Footer';
import Navbar from '../../SharePages/Navbar/Navbar';
import SideNavBar from '../../SharePages/SideNavBar/SideNavBar';
import DashboardPanel from '../DashboardPanel/DashboardPanel';

const DashboardPage = () => {
    return (
        <div>
            <Navbar></Navbar>
            <SideNavBar></SideNavBar>
            <DashboardPanel></DashboardPanel>
            {/* <Footer></Footer> */}
        </div>
    );
};

export default DashboardPage;