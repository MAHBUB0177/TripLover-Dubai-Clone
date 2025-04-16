import React, { useState } from "react";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import { ToastContainer } from "react-toastify";
import Footer from "../SharePages/Footer/Footer";
import HighCancellation from "../../component/high-cancellation/HighCancellation";
import DuplicateBookings from "../../component/duplicateBookings/DuplicateBookings";
import ChurnBookingView from "../../component/churnBooking/ChurnBookingView";

const HighCancellationBooking = () => {
    const [idxD, setIdxD] = useState(2);

    const onStatusChange = (statusId) => {
        setIdxD(statusId);
    };

    return (
        <>
            <div>
                <Navbar></Navbar>
                <SideNavBar></SideNavBar>
                <div className="content-wrapper search-panel-bg px-4 pb-5">
                    <section className="content-header"></section>
                    <section className="content">
                        <ToastContainer position="bottom-right" autoClose={1500} />
                        <form className="mx-lg-5 mx-md-5 mx-sm-1 mt-3 shadow-sm bg-white">
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
                                            pointerEvents: "auto",
                                        }}
                                    >
                                        <div
                                            className={
                                                idxD === 2
                                                    ? "custom-selected-tab px-3 rounded-top py-3 fs-6 fw-bold"
                                                    : "fs-6 px-3 py-3 fw-bold text-black"
                                            }
                                            onClick={() => onStatusChange(2)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <span className={idxD === 2 ? "custom-border-selected-tab pb-3" : ""}>
                                                High Cancellation
                                            </span>
                                        </div>
                                        <div
                                            className={
                                                idxD === 0
                                                    ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                                                    : "fs-6 px-3 py-3 fw-bold text-black"
                                            }
                                            style={{ cursor: "pointer" }}
                                            onClick={() => onStatusChange(0)}
                                        >
                                            <span className={idxD === 0 ? "custom-border-selected-tab pb-3" : ""}>
                                                Duplicate Bookings
                                            </span>
                                        </div>
                                        <div
                                            className={
                                                idxD === 1
                                                    ? "custom-selected-tab px-3 rounded-top py-3 fs-6 fw-bold"
                                                    : "fs-6 px-3 py-3 fw-bold text-black"
                                            }
                                            style={{ cursor: "pointer" }}
                                            onClick={() => onStatusChange(1)}
                                        >
                                            <span className={idxD === 1 ? "custom-border-selected-tab pb-3" : ""}>
                                                Churn Bookings
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {idxD === 0 ? (
                                    <DuplicateBookings />
                                ) : idxD === 1 ? (
                                    <ChurnBookingView />
                                ) : idxD === 2 ? (
                                    <HighCancellation />
                                ) : null}
                            </div>
                        </form>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default HighCancellationBooking;
