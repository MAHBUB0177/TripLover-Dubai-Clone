import React from 'react';
import Footer from '../../../SharePages/Footer/Footer';
import Navbar from '../../../SharePages/Navbar/Navbar';
import SideNavBar from '../../../SharePages/SideNavBar/SideNavBar';
import SuccessConfirmPanel from '../SussessConfirmPanel/SuccessConfirmPanel';

const SuccessConfirmPage = () => {
    return (
        <div>
            <Navbar></Navbar>
            <SideNavBar></SideNavBar>
            <SuccessConfirmPanel></SuccessConfirmPanel>
            <Footer></Footer>
        </div>
    );
};

export default SuccessConfirmPage;