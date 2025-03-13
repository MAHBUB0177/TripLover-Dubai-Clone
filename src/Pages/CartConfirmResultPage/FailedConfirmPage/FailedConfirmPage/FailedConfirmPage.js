import React from 'react';
import Footer from '../../../SharePages/Footer/Footer';
import Navbar from '../../../SharePages/Navbar/Navbar';
import SideNavBar from '../../../SharePages/SideNavBar/SideNavBar';
import FailedConfirmPanel from '../FailedConfirmPanel/FailedConfirmPanel';

const FailedConfirmPage = () => {
    return (
        <div>
            <Navbar></Navbar>
            <SideNavBar></SideNavBar>
            <FailedConfirmPanel></FailedConfirmPanel>
            <Footer></Footer>
        </div>
    );
};

export default FailedConfirmPage;