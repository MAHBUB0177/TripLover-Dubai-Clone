import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../Pages/SharePages/Navbar/Navbar';
import SideNavBar from '../../../Pages/SharePages/SideNavBar/SideNavBar';
import Footer from '../../SharePages/Footer/Footer';
const TicketOrderSuccess = () => {
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content content-panel">
          <div className="container bg-white w-25 p-5">
            <div className="row">
              <div className="col-lg-12 text-center">
                <p className='py-2'>
                  Ticket Ordered successfully
                </p>
                <hr></hr>
                <Link className="btn button-color my-3 text-white fw-bold" to="/search">
                  Go Search
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default TicketOrderSuccess;