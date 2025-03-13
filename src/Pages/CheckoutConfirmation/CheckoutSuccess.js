import React from 'react';
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
const CheckoutSuccess = () => {

    return (
        <div>
            
                    <Navbar></Navbar>
                    <SideNavBar></SideNavBar>
                    <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content text-center">
        Checkout Success<br/>
        <a className='btn btn-warning' href='/balance' >Back to balance</a>
        </section>
                
        </div>
        </div>
    );
};

export default CheckoutSuccess;