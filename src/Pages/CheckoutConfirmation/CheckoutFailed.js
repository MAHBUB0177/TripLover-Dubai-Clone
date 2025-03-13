import React from 'react';
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
const CheckoutFailed = () => {
    return (
        <div>
            
                    <Navbar></Navbar>
                    <SideNavBar></SideNavBar>
                    <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content text-center">
        Checkout Failed! Please try again<br/>
        <a className='btn btn-warning' href='/balance' >Back to balance</a>
        </section>
                
        </div>
        </div>
    );
};

export default CheckoutFailed;