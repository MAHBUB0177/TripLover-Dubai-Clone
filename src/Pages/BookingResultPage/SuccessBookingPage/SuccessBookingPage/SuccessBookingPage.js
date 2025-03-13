import React from "react";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../Loading/Loading";
import Footer from "../../../SharePages/Footer/Footer";
import Navbar from "../../../SharePages/Navbar/Navbar";
import SideNavBar from "../../../SharePages/SideNavBar/SideNavBar";
import SuccessBookingPanel from "../SuccessBookingPanel/SuccessBookingPanel";
import { ToastContainer } from "react-toastify";

const SuccessBookingPage = () => {
  const { loading } = useAuth();
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <ToastContainer position="bottom-right" autoClose={1500} />
      {loading && (
        <Loading flag={2} title={"ticketing"} loading={loading}></Loading>
      )}
      <SuccessBookingPanel></SuccessBookingPanel>
      <Footer></Footer>
    </div>
  );
};

export default SuccessBookingPage;
