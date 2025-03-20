import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import Footer from "../SharePages/Footer/Footer";
import SalesReport from "./SalesReport/SalesReport";
import Ledger from "../Ledger/Ledger";
import CreditNotes from "../CreditNotes/CreditNotes";
import { useLocation } from "react-router-dom";

const AllReport = () => {
    const location = useLocation();
  const [idxD, setIdxD] = useState("SalesReport");
  let onStatusChange = (statusId) => {
    setIdxD(statusId);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

    useEffect(() => {
      if (location?.state?.navigate === "ledger") {
        setIdxD("AccountLedger");
      }
    }, [location?.state]);
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <ToastContainer position="bottom-right" autoClose={1500} />

      <div className="content-wrapper search-panel-bg px-4 pb-5">
        <section className="content-header"></section>
        <section className="content">
          <form
            className="mx-lg-5 mx-md-5 mx-sm-1 mt-3"
            encType="multipart/form-data"
            style={{ minHeight: "500px" }}
          >
            <div className="container-fluid bg-white">
              <div className="row">
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
                      idxD === "SalesReport"
                        ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onStatusChange("SalesReport")}
                  >
                    <span
                      className={
                        idxD === "SalesReport" &&
                        "custom-border-selected-tab pb-3"
                      }
                    >
                      Sales Report
                    </span>
                  </div>
                  <div
                    className={
                      idxD === "AccountLedger"
                        ? "custom-selected-tab p-2 rounded-top px-3 py-3 fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onStatusChange("AccountLedger")}
                  >
                    <span
                      className={
                        idxD === "AccountLedger" &&
                        "custom-border-selected-tab pb-3"
                      }
                    >
                      Account Ledger
                    </span>
                  </div>

                  <div
                    className={
                      idxD === "Refund"
                        ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onStatusChange("Refund")}
                  >
                    <span
                      className={
                        idxD === "Refund" && "custom-border-selected-tab pb-3"
                      }
                    >
                      Refund
                    </span>
                  </div>
                </div>
              </div>

              <div className="row py-3">
                {idxD === "SalesReport" ? (
                  <SalesReport />
                ) : idxD === "AccountLedger" ? (
                  <Ledger />
                ) : idxD === "Refund" ? (
                  <CreditNotes />
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

export default AllReport;
