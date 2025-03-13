import React from "react";
import Navbar from "../../SharePages/Navbar/Navbar";
import SideNavBar from "../../SharePages/SideNavBar/SideNavBar";
import Footer from "../../SharePages/Footer/Footer";
import FlightCard from "./flightCard";

const SearchFlightList = () => {
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content">
          <div className="container mt-3">
            <div className="position-relative">
              <div
                className="row position-absolute top-0 start-50 translate-middle"
                id="travel-type-panel"
              ></div>
            </div>
          </div>
          <FlightCard></FlightCard>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default SearchFlightList;
