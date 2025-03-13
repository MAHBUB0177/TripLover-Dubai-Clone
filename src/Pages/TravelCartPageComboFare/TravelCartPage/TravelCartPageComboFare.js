import React, { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../Loading/Loading";
import Footer from "../../SharePages/Footer/Footer";
import Navbar from "../../SharePages/Navbar/Navbar";
import SideNavBar from "../../SharePages/SideNavBar/SideNavBar";
import TravelCartPanel from "../TravelCartPanel/TravelCartPanel";

const TravelCartPageComboFare = () => {
  window.scrollTo(0, 0);
  sessionStorage.removeItem("checkList");
  const { loading, setCount } = useAuth();
  useEffect(() => {
    setCount(0);
  });
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      {loading && <Loading flag={1} loading={loading}></Loading>}
      <TravelCartPanel></TravelCartPanel>
      <Footer></Footer>
    </div>
  );
};

export default TravelCartPageComboFare;
