import React from "react";
import Navbar from "../../SharePages/Navbar/Navbar";
import SideNavBar from "../../SharePages/SideNavBar/SideNavBar";
import Footer from "../../SharePages/Footer/Footer";

const SuccessGroupFare = () => {
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content content-panel">
          <div className="container bg-white w-25">
            <div className="row py-2">
              <div className="col-lg-12 text-center">
                <div className="my-1">
                  <span className="text-success fs-3">
                    <i className="far fa-check-circle"></i>
                  </span>
                </div>
                <h4 className="pb-2 fw-bold text-success">
                  Booking Successful!
                </h4>
                <p style={{ fontSize: "14px" }}>
                  Your group fare booking is successful.
                </p>
                <p className="pb-3" style={{ fontSize: "14px" }}>
                  We will process your booking soon. Thank you!
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default SuccessGroupFare;
