import React from 'react';
import Footer from '../../SharePages/Footer/Footer';
import Navbar from '../../SharePages/Navbar/Navbar';
import SideNavBar from '../../SharePages/SideNavBar/SideNavBar';
import CartCofirmPanel from '../CartCofirmPanel/CartCofirmPanel';

const TravelCartConfirmPage = () => {
    return (
        <div>
            <Navbar></Navbar>
            <SideNavBar></SideNavBar>
            <CartCofirmPanel></CartCofirmPanel>
            {/* <Footer></Footer> */}
        </div>
    );
};

export default TravelCartConfirmPage;