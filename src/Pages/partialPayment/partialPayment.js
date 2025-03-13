import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import PartialPaymentDue from "../Queues/PartialDue";
import PartialPaid from "../Queues/PartialPaid";
import Footer from "../SharePages/Footer/Footer";
import PaymentRequest from "./paymentRequest";

const PartialPayment = () => {
  const [idxD, setIdxD] = useState("PartialDue");
  let onStatusChange = (statusId) => {
    setIdxD(statusId);
  };
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>

      <div className="content-wrapper  search-panel-bg px-4 pb-5">
        <section className="content-header"></section>
        <section className="content">
          <ToastContainer position="bottom-right" autoClose={1500} />

          <form className="mx-lg-5 mx-md-5 mx-sm-1 mt-3">
            <div className="container-fluid bg-white">
              <div className="row  ">
                <div
                  className="col-lg-12 border-bottom d-flex justify-content-start p-0 ms-2 ms-lg-0"
                  style={{
                    whiteSpace: "nowrap",
                    overflowX: "auto",
                    scrollbarWidth: "none", // For Firefox
                    WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                    msOverflowStyle: "none", // For IE and Edge
                  }}
                >
                  <div
                    className={
                      idxD === "PartialDue"
                        ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onStatusChange("PartialDue")}
                  >
                    <span
                      className={
                        idxD === "PartialDue" &&
                        "custom-border-selected-tab pb-3"
                      }
                    >
                      Partial Due
                    </span>
                  </div>
                  <div
                    className={
                      idxD === "PartialPaid"
                        ? "custom-selected-tab px-3 rounded-top py-3 fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onStatusChange("PartialPaid")}
                  >
                    <span
                      className={
                        idxD === "PartialPaid" &&
                        "custom-border-selected-tab pb-3"
                      }
                    >
                      Partial Paid
                    </span>
                  </div>

                  <div
                    className={
                      idxD === "PartialRequest"
                        ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onStatusChange("PartialRequest")}
                  >
                    <span
                      className={
                        idxD === "PartialRequest" &&
                        "custom-border-selected-tab pb-3"
                      }
                    >
                      Partial Request
                    </span>
                  </div>
                </div>
              </div>

              <div className="row">
                {idxD === "PartialDue" ? (
                  <PartialPaymentDue />
                ) : idxD === "PartialPaid" ? (
                  <PartialPaid />
                ) : idxD === "PartialRequest" ? (
                  <PaymentRequest />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </form>
        </section>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default PartialPayment;
