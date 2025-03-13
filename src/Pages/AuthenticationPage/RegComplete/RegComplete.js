import React from 'react';
import { ToastContainer } from "react-toastify";
import Footer from '../../SharePages/Footer/Footer';
import { VStack } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import Navbar from '../../Optional/Navbar/Navbar';

const RegComplete = () => {
    return (
        <div>
            <Navbar />
            <ToastContainer position="bottom-right" autoClose={1500} />
            <div style={{ height: "500px" }} className="d-flex align-items-center justify-content-center m-3">
                <div className="rounded">
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-3'></div>
                            <div className='col-lg-6 bg-white shadow p-3 rounded'>
                                <p className="p-3">Thank you for registering with Triplover.
                                    We really appreciate you choosing Triplover for your travel plans.
                                    Your account activation is waiting for approval.
                                </p>
                                <div className="text-center pb-3">
                                    <Link to="/" className="btn button-color text-white fw-bold border-radius">Sign In</Link>
                                </div>
                            </div>
                            <div className='col-lg-3'></div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default RegComplete;