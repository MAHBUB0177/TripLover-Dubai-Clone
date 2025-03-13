import React from "react";
import "./Contact.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../../SharePages/Footer/Footer";

const Contact = () => {
  window.scrollTo(0, 0);
  return (
    <>
      <Navbar></Navbar>
      <div
        className="hold-transition login-page search-panel-bg py-3"
        style={{ background: "white ", position: "relative" }}
      >
        <div className="container border-2 border-secondary contact p-3">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="py-2">Keep in touch</h1>
            </div>
            <div className="col-lg-12">
              <p>
                <span className="">Corporate Address:</span>
              </p>
              <p className="mb-0">
                <span className="">
                  <i className="la la-home la-lg"></i>
                </span>{" "}
                Al Muhairi 113-127, Al Dhagaya, Deira, Dubai, United Arab
                Emirates
              </p>
              <p>
                <span className="">
                  <i className="la la-phone la-lg"></i>
                </span>{" "}
                +97143375728
              </p>
              <p>
                <span className="">
                  <i className="la la-envelope la-lg"></i>
                </span>{" "}
                <a
                  href="mailto:info@triplover.com"
                  className="text-dark fw-bold"
                >
                  help.dxb@triplover.ae
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Contact;
