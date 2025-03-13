import React from 'react'
import Navbar from '../SharePages/Navbar/Navbar'
import SideNavBar from '../SharePages/SideNavBar/SideNavBar'
import { IoMdWarning } from "react-icons/io";
import Footer from '../SharePages/Footer/Footer';

const PaymentAlreadyCompleted = () => {
    return (
        <div>
            <Navbar></Navbar>
            <SideNavBar></SideNavBar>
            <div>
                <div className="content-wrapper search-panel-bg">
                    <section className="content-header"></section>
                    <section className="content content-panel">
                        <div className="container bg-white w-25 py-5 position-relative">
                            <div className="row">
                                <div className="col-lg-12 text-center">
                                    <div className="my-3">
                                        <p
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <IoMdWarning
                                                style={{
                                                    color: "white",
                                                    height: "60px",
                                                    width: "60px",
                                                    fontWeight: "bold",
                                                    display: "flex",
                                                    alignContent: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "red",
                                                    padding: "15px",
                                                    borderRadius: "25px"
                                                }}
                                            />
                                        </p>
                                    </div>
                                    <p>YOUR PAYMENT WAS ALREADY PROCCESSED</p>
                                    <hr></hr>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default PaymentAlreadyCompleted