import React from "react";
import Footer from "../../../SharePages/Footer/Footer";
import Navbar from "../../../SharePages/Navbar/Navbar";
import SideNavBar from "../../../SharePages/SideNavBar/SideNavBar";
import FailedBookingPanel from "../FailedBookingPanel/FailedBookingPanel";

const FailedBookingPage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <FailedBookingPanel></FailedBookingPanel>
      <Footer></Footer>
    </div>
  );
};

export default FailedBookingPage;
