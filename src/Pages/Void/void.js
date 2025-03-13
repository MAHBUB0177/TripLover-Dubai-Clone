import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import VoidRequstList from "./voidRequstList";
import VoidQuotationList from "./quotationList";
import VoidExpired from "./voidExpired";
import VoidRejected from "./rejected";
import VoidQuotationHistory from "./voidHistory";
import VoidConfirmByAgent from "./confirmAgent";
import { useLocation } from "react-router-dom";

const Voided = () => {
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
                      Void Requested
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
                      Void quoted
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
                      Void Expired
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
                      idxD === "Voided"
                        ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    onClick={() => onStatusChange("Voided")}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={
                        idxD === "Voided" && "custom-border-selected-tab pb-3"
                      }
                    >
                      Void Status
                    </span>
                  </div>
                </div>
              </div>

              <div className="row">
                {idxD === "Requested" ? (
                  <VoidRequstList />
                ) : idxD === "Quoted" ? (
                  <VoidQuotationList />
                ) : idxD === "Expired" ? (
                  <VoidExpired />
                ) : idxD === "Admin_Rejected" ? (
                  <VoidRejected />
                ) : idxD === "Voided" ? (
                  <VoidQuotationHistory />
                ) : idxD === "Agent_Accepted" ? (
                  <VoidConfirmByAgent />
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

export default Voided;
