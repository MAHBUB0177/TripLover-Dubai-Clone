import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import tllLogo from "../../../src/images/logo/logo-combined.png";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { getSalesInvoice, getUserAllInfo } from "../../common/allApi";
import ReactToPrint from "react-to-print";

const InvoiceView = () => {
  let [invoice, setInvoice] = useState([]);
  const componentRef = useRef();

  const location = useLocation();
  let sendObj = location.search.split("=")[1];
  const handleGetInvoiceList = () => {
    const getInvoiceList = async () => {
      const response = await getSalesInvoice(sendObj);
      setInvoice(response.data);
    };
    getInvoiceList();
  };
  let [agentInfo, setAgentInfo] = useState([]);
  const getAgentInfo = async () => {
    const response = await getUserAllInfo();
    setAgentInfo(response.data);
  };
  useEffect(() => {
    getAgentInfo();
    handleGetInvoiceList();
  }, []);
  useEffect(() => {
    handleGetInvoiceList();
  }, [sendObj]);

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <ToastContainer position="bottom-right" autoClose={1500} />
        <section className="content">
          <div className="container mt-3 pb-5 py-2">
            <div id="ui-view" data-select2-id="ui-view">
              <div className="card box-shadow">
                <div className="card-header">
                  <ul id="menu-standard">
                    <li id="menu-item">
                      <ReactToPrint
                        trigger={() => (
                          <button className="btn button-color border-radius text-white float-right mr-1 d-print-none">
                            <span className="me-1">
                              <i className="fa fa-print"></i>
                            </span>
                            Print
                          </button>
                        )}
                        content={() => componentRef.current}
                      />
                    </li>
                  </ul>
                </div>
                <div className="card-body" ref={componentRef}>
                  <div className="row text-center">
                    <h4>INVOICE</h4>
                  </div>

                  <div className="text-start my-2">
                    <>
                      <img
                        alt="img01"
                        className="p-2"
                        src={tllLogo}
                        style={{ width: "150px" }}
                      ></img>
                    </>
                  </div>

                  <table class="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td className="text-start bg-white">
                          <address>
                            <span className="fw-bold fs-6">
                              {agentInfo.name}
                            </span>
                            <br />
                            <div
                              className="mt-2"
                              style={{ fontSize: "10px", lineHeight: "12px" }}
                            >
                              {agentInfo.address}
                              <br />
                              Phone: {agentInfo.mobileNo}
                              <br></br>
                              Email: {agentInfo.email}
                            </div>
                          </address>
                        </td>
                        <td className="text-end bg-white">
                          <address>
                            <span className="fw-bold fs-6">
                              Triplover Ltd.
                            </span>
                            <br />
                            <div
                              className="mt-2"
                              style={{ fontSize: "10px", lineHeight: "12px" }}
                            >
                              39 Sharif Plaza, Kemal Ataturk
                              <br />
                              Avenue, Banani, Dhaka 1213<br></br>
                              Phone: 01322819380<br></br>
                              Email: info@Triplover.com
                            </div>
                          </address>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table
                    class="table table-borderless table-sm"
                    style={{ fontSize: "10px", lineHeight: "8px" }}
                  >
                    <tbody>
                      <tr className="d-flex">
                        <td className="bg-white" style={{ width: "70%" }}>
                          <tr></tr>
                          <tr></tr>
                        </td>
                        <td className="bg-white" style={{ width: "30%" }}>
                          <tr>
                            <td className="text-end fw-bold">
                              Invoice Number<span className="mx-2">:</span>
                            </td>
                            <td className="text-end" style={{ width: "7%" }}>
                              {invoice?.invoiceNo}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-end fw-bold">
                              Invoice Date<span className="mx-2">:</span>
                            </td>
                            <td className="text-end" style={{ width: "7%" }}>
                              {moment(invoice?.invoiceDate).format(
                                "DD-MMM-yyyy"
                              )}
                            </td>
                          </tr>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table
                    className="table table-bordered table-sm"
                    style={{ fontSize: "10px" }}
                  >
                    <thead className="fw-bold text-dark">
                      <th>Details</th>
                      <th className="text-end">Price</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{invoice?.purpose}</td>
                        <td className="text-end">
                          {invoice?.amount?.toLocaleString("en-US")}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="fw-bold"
                          colSpan={2}
                          style={{ textAlign: "right" }}
                        >
                          Total: AED {invoice?.amount?.toLocaleString("en-US")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container pb-5 mt-2">
                    <div class="row text-start ms-1">
                      <b className="p-0" style={{ fontSize: "15px" }}>
                        Terms & Conditions :
                      </b>
                      <ul style={{ fontSize: "10px" }}>
                        <li>
                          This is a computer generated statement, hence does not
                          require any signature
                        </li>
                        <li>
                          {" "}
                          Refunds & Cancellations are subject to Airline's
                          approval.
                        </li>
                        <li>
                          Kindly check all details carefully to avoid
                          unnecessary complications.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default InvoiceView;
