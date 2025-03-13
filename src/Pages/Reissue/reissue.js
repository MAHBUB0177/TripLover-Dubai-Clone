import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ReissueRequstList from "./reissueRequestList";
import ReissueQuotationList from "./quotationList";
import ReissueExpired from "./reissueExpired";
import ConfirmByAgent from "./confirmAgent";
import ReissueRejected from "./rejected";
import ReissueQuotationHistory from "./reissueHistory";
import { useLocation } from "react-router-dom";
import ReissueCancelationList from "./reissueCancelationList";

const Reissued = () => {
  const [idxD, setIdxD] = useState("Requested");
  const [status, setStatus] = useState("Requested");
  let onStatusChange = (statusId) => {
    setIdxD(statusId);
    setStatus(statusId);
  };
  const { state } = useLocation();
  useEffect(() => {
    if (state?.status) {
      setIdxD(state?.status);
    } else {
      setIdxD("Requested");
    }
  }, [state]);
  return (
    <div>
      <ToastContainer position="bottom-right" autoClose={1500} />
      <div className=" search-panel-bg">
        <section className=""></section>
        <section className="content pb-5">
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
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                    msOverflowStyle: "none",
                  }}
                >
                  <div
                    className={
                      idxD === "Requested"
                        ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onStatusChange("Requested")}
                  >
                    <span
                      className={
                        idxD === "Requested" &&
                        "custom-border-selected-tab pb-3"
                      }
                    >
                      Reissue Requested
                    </span>
                  </div>
                  <div
                    className={
                      idxD === "Cancelled"
                        ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onStatusChange("Cancelled")}
                  >
                    <span
                      className={
                        idxD === "Cancelled" &&
                        "custom-border-selected-tab pb-3"
                      }
                    >
                      Reissue Cancelled
                    </span>
                  </div>
                  <div
                    className={
                      idxD === "Quoted"
                        ? "custom-selected-tab px-3 rounded-top py-3 fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onStatusChange("Quoted")}
                  >
                    <span
                      className={
                        idxD === "Quoted" && "custom-border-selected-tab pb-3"
                      }
                    >
                      Reissue Quoted
                    </span>
                  </div>

                  <div
                    className={
                      idxD === "Expired"
                        ? "custom-selected-tab px-3 rounded-top py-3 fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    onClick={() => onStatusChange("Expired")}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={
                        idxD === "Expired" && "custom-border-selected-tab pb-3"
                      }
                    >
                      Quotation Expired
                    </span>
                  </div>
                  <div
                    className={
                      idxD === "Agent_Accepted"
                        ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    onClick={() => onStatusChange("Agent_Accepted")}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={
                        idxD === "Agent_Accepted" &&
                        "custom-border-selected-tab pb-3"
                      }
                    >
                      Confirm by Agent
                    </span>
                  </div>
                  <div
                    className={
                      idxD === "Admin_Rejected"
                        ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    onClick={() => onStatusChange("Admin_Rejected")}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={
                        idxD === "Admin_Rejected" &&
                        "custom-border-selected-tab pb-3"
                      }
                    >
                      Rejected
                    </span>
                  </div>

                  <div
                    className={
                      idxD === "Reissued"
                        ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    onClick={() => onStatusChange("Reissued")}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={
                        idxD === "Reissued" && "custom-border-selected-tab pb-3"
                      }
                    >
                      Reissued
                    </span>
                  </div>
                </div>
              </div>

              <div className="row">
                {idxD === "Requested" ? (
                  <ReissueRequstList />
                ) : idxD === "Cancelled" ? (
                  <ReissueCancelationList />
                ) : idxD === "Quoted" ? (
                  <ReissueQuotationList />
                ) : idxD === "Expired" ? (
                  <ReissueExpired />
                ) : idxD === "Admin_Rejected" ? (
                  <ReissueRejected />
                ) : idxD === "Reissued" ? (
                  <ReissueQuotationHistory />
                ) : idxD === "Agent_Accepted" ? (
                  <ConfirmByAgent />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </form>
        </section>
      </div>
      {/* <Footer></Footer> */}
    </div>
  );
};

export default Reissued;
