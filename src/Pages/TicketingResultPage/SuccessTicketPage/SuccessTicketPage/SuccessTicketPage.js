import React from 'react';
import Footer from '../../../SharePages/Footer/Footer';
import Navbar from '../../../SharePages/Navbar/Navbar';
import SideNavBar from '../../../SharePages/SideNavBar/SideNavBar';
import SuccessTicketPanel from '../SuccessTicketPanel/SuccessTicketPanel';

const SuccessTicketPage = () => {
    return (
        <div>
            <Navbar></Navbar>
            <SideNavBar></SideNavBar>
            <SuccessTicketPanel></SuccessTicketPanel>
            <Footer></Footer>
        </div>
    );
};

export default SuccessTicketPage;