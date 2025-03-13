import React, { useEffect, useState } from "react";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import Footer from "../SharePages/Footer/Footer";
import Queues from "./Queues";
import Refund from "../Refund/refund";
import Voided from "../Void/void";
import Reissued from "../Reissue/reissue";
import { useLocation, useNavigate } from "react-router-dom";

const BookingWraper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [idxD, setIdxD] = useState("Ticket");
  let onStatusChange = (statusId) => {
    setIdxD(statusId);
    navigate(location.pathname, { state: {} });
  };

  useEffect(() => {
    if (location?.state?.navigate === "void") {
      setIdxD("Void");
    } else if (location?.state?.navigate === "refund") {
      setIdxD("Refund");
    } else if (location?.state?.navigate === "reissue") {
      setIdxD("Reissue");
    }
  }, [location?.state]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg pb-5 shadow-sm ">
        <section className="">
          <div>
            <div className="container-fluid bg-white p-1 ">
              <div class="d-flex flex-column flex-lg-row py-3">
                <div className="d-flex align-items-center ms-5  justify-content-center pt-lg-0 pt-3">
                  <h4 className="m-0 fw-bold" style={{ fontSize: "23px" }}>
                    My Bookings
                  </h4>
                </div>

                <div className="ms-2 ms-lg-5">
                  <div className="">
                    <div
                      className="col-lg-12 d-flex justify-content-start align-items-center gap-2 py-1"
                      style={{
                        whiteSpace: "nowrap",
                        overflowX: "auto",
                        scrollbarWidth: "none", // For Firefox
                        WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                        msOverflowStyle: "none", // For IE and Edge
                      }}
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => onStatusChange("Ticket")}
                      >
                        <span
                          className={
                            idxD === "Ticket"
                              ? "custom-selected-tab px-3 py-2 rounded fs-6 fw-bold"
                              : "fs-6 px-3 py-2 fw-bold text-black"
                          }
                        >
                          Ticket
                        </span>
                      </div>

                      <div
                        onClick={() => onStatusChange("Void")}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className={
                            idxD === "Void"
                              ? "custom-selected-tab rounded px-3 py-2 fs-6 fw-bold"
                              : "fs-6 px-3 py-2 fw-bold text-black"
                          }
                        >
                          Void
                        </span>
                      </div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => onStatusChange("Refund")}
                      >
                        <span
                          className={
                            idxD === "Refund"
                              ? "custom-selected-tab rounded px-3 py-2 fs-6 fw-bold"
                              : "fs-6 px-3 py-2 fw-bold text-black"
                          }
                        >
                          Refund
                        </span>
                      </div>

                      {/* <div
                        onClick={() => onStatusChange("Reissue")}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className={
                            idxD === "Reissue"
                              ? "custom-selected-tab px-3 py-2 rounded fs-6 fw-bold"
                              : "fs-6 px-3 py-2 fw-bold text-black"
                          }
                        >
                          Reissue
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 ">
              {idxD === "Ticket" ? (
                <Queues />
              ) : idxD === "Void" ? (
                <Voided />
              ) : idxD === "Refund" ? (
                <Refund />
              ) : (
                <Reissued />
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default BookingWraper;
