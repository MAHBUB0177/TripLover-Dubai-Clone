import React, { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import moment from "moment";
import tllLogo from "../../../src/images/logo/logo-combined.png";
import { ToastContainer, toast } from "react-toastify";
import { getUserAllInfo, invoiceTransactionHistory } from "../../common/allApi";
import { invoiceTotalCost } from "../../common/functions";
import ReactToPrint from "react-to-print";
import { Center, Spinner } from "@chakra-ui/react";
import { environment } from "../SharePages/Utility/environment";

const Invoice = () => {
  let agentLogo = JSON.parse(sessionStorage.getItem("agentInfoData"));
  let [data, setData] = useState([]);
  const [searchParams] = useSearchParams();
  let [agentInfo, setAgentInfo] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectPassenger, setSelectPassenger] = useState([]);
  const getAgentInfo = async () => {
    const response = await getUserAllInfo();
    setAgentInfo(response.data);
  };
  const passengerSelectRefs = useRef([]);
  const componentRef = useRef();
  const componentRefUnSelect = useRef();
  const handleGetList = () => {
    const getInvoiceList = async () => {
      setLoader(true);
      const response = await invoiceTransactionHistory(
        searchParams.get("tnxNumber")
      );
      setData(response.data);
      setSelectPassenger(response.data);
      setLoader(false);
    };
    getInvoiceList();
  };

  useEffect(() => {
    handleGetList();
    getAgentInfo();
  }, []);
  const print = () => {
    window.print();
  };
  const [unSelectPassenger, setUnselectPassenger] = useState([]);
  const handleCheckboxChange = async (item) => {
    const isSelected = selectPassenger.includes(item);
    const newSelectedPassengers = isSelected
      ? selectPassenger.filter(
          (passenger) => passenger.ticketNumbers !== item.ticketNumbers
        )
      : [...selectPassenger, item];
    setSelectPassenger(newSelectedPassengers);
    const isUnSelected = unSelectPassenger.includes(item);
    const newUnSelectedPassengers = isUnSelected
      ? unSelectPassenger.filter(
          (passenger) => passenger.ticketNumbers !== item.ticketNumbers
        )
      : [...unSelectPassenger, item];
    setUnselectPassenger(newUnSelectedPassengers);
  };

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <ToastContainer position="bottom-right" autoClose={1500} />
        <section className="content">
          <div className="container mb-3">
            <div id="ui-view" data-select2-id="ui-view">
              <div>
                <div className="card box-shadow p-3">
                  <div className="px-2  bg-white rounded border my-2">
                    <div className="d-flex justify-content-between align-items-center pt-3 px-2">
                      <div className="fw-bold">Select Passenger</div>
                    </div>
                    <div className="p-2 table-responsive px-2  bg-white">
                      <table
                        className="table text-start table-bordered  table-sm"
                        style={{ width: "100%", fontSize: "13px" }}
                      >
                        <thead className="text-start fw-bold bg-secondary">
                          <tr>
                            <th>Select</th>
                            <th>Passenger Name</th>
                            <th>Ticket Number</th>
                          </tr>
                        </thead>

                        <tbody>
                          {data?.length > 0 &&
                            data?.map((item, index) => (
                              <tr key={index} className="border-none">
                                <td>
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="checkbox"
                                      ref={passengerSelectRefs.current[index]}
                                      checked={selectPassenger.includes(item)}
                                      onChange={() =>
                                        handleCheckboxChange(item)
                                      }
                                    />
                                  </div>
                                </td>

                                <td>{item.passengerName}</td>
                                <td>{item.ticketNumbers}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectPassenger.length > 0 && (
            <div className="container mt-3 pb-5 py-2">
              <div id="ui-view" data-select2-id="ui-view">
                <div>
                  <div className="card box-shadow">
                    <div className="card-header">
                      <ul id="menu-standard">
                        <li id="menu-item">
                          <ReactToPrint
                            trigger={() => (
                              <button className="btn btn-sm btn-secondary float-right mr-1 d-print-none rounded">
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

                    {loader ? (
                      <Center w="100%" py="200px">
                        <Spinner
                          thickness="4px"
                          speed="0.65s"
                          emptyColor="gray.200"
                          color="red.500"
                          size="xl"
                        />
                      </Center>
                    ) : (
                      <div className="card-body pt-5" ref={componentRef}>
                        <div className="row text-center">
                          <h4 className="pb-2">INVOICE</h4>
                        </div>

                        <div className="text-start my-2">
                          {agentInfo?.logoName !== undefined ||
                          agentInfo?.logoName !== null ? (
                            <img
                              alt="img01"
                              src={environment.s3URL + `${agentInfo?.logoName}`}
                              style={{ width: "150px" }}
                            />
                          ) : (
                            <img
                              alt="img01"
                              className="p-2"
                              src={tllLogo}
                              style={{ width: "150px" }}
                            ></img>
                          )}
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
                                    style={{
                                      fontSize: "10px",
                                      lineHeight: "12px",
                                    }}
                                  >
                                    {agentInfo.address}
                                    <br />
                                    Phone: {agentInfo.mobileNo}
                                    <br></br>
                                    Email: {agentInfo.email}
                                    <br></br>
                                  </div>
                                </address>
                              </td>

                              {/* <td className="text-end bg-white">
                              <address>
                                <span className="fw-bold fs-6">
                                  Triplover Ltd.
                                </span>
                                <br />
                                <div
                                  className="mt-2"
                                  style={{
                                    fontSize: "10px",
                                    lineHeight: "12px",
                                  }}
                                >
                                  39 Sharif Plaza, Kemal Ataturk
                                  <br />
                                  Avenue, Banani, Dhaka 1213<br></br>
                                  Phone: 01322819380<br></br>
                                  Email: info@Triplover.com
                                  <br></br>
                                  <br></br>
                                  <br></br>
                                  <br></br>
                                  <span className="fw-bold">
                                    {" "}
                                    Invoice Number:{" "}
                                  </span>
                                  {searchParams.get("tnxNumber")}
                                  <br></br>
                                  <span className="fw-bold">
                                    {" "}
                                    Invoice Date:{" "}
                                  </span>{" "}
                                  {moment(data[0]?.createdDate).format(
                                    "DD-MMM-yyyy"
                                  )}
                                </div>
                              </address>
                            </td> */}
                            </tr>
                          </tbody>
                        </table>

                        <table
                          className="table table-bordered table-sm"
                          style={{ fontSize: "10px" }}
                        >
                          <thead className="fw-bold text-dark">
                            <tr>
                              <th>Booking ID</th>
                              <th>Ticket No</th>
                              <th>Passenger Name</th>
                              <th>Purpose</th>
                              <th>Details</th>
                              <th className="text-end">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectPassenger?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{item.uniqueTransID}</td>
                                  <td>{item.ticketNumbers}</td>
                                  <td>{item.passengerName}</td>
                                  <td>{item.purposeName}</td>
                                  <td>{item.remarks}</td>
                                  <td className="text-end fw-bold">
                                    {item.amount +
                                      item.reissueCharge +
                                      item.extraService +
                                      item.additionalCollection}
                                  </td>
                                </tr>
                              );
                            })}
                            <tr>
                              <td colSpan={4}></td>
                              <td className="fw-bold">Total </td>
                              <td
                                className="fw-bold"
                                style={{ textAlign: "right" }}
                              >
                                AED{" "}
                                {invoiceTotalCost(
                                  selectPassenger
                                )?.toLocaleString("en-US")}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="container pb-5 mt-2">
                          <div class="row text-start">
                            <b className="p-0">Terms & Conditions :</b>
                            <ul style={{ fontSize: "10px" }}>
                              <li>
                                This is a computer generated statement, hence
                                does not require any signature.
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {unSelectPassenger?.length > 0 && (
            <div className="container mt-3 pb-5 py-2">
              <div id="ui-view" data-select2-id="ui-view">
                <div>
                  <div className="card box-shadow">
                    <div className="card-header">
                      <ul id="menu-standard">
                        <li id="menu-item">
                          <ReactToPrint
                            trigger={() => (
                              <button className="btn btn-sm btn-secondary float-right mr-1 d-print-none rounded">
                                <span className="me-1">
                                  <i className="fa fa-print"></i>
                                </span>
                                Print
                              </button>
                            )}
                            content={() => componentRefUnSelect.current}
                          />
                        </li>
                      </ul>
                    </div>

                    {loader ? (
                      <Center w="100%" py="200px">
                        <Spinner
                          thickness="4px"
                          speed="0.65s"
                          emptyColor="gray.200"
                          color="red.500"
                          size="xl"
                        />
                      </Center>
                    ) : (
                      <div
                        className="card-body pt-5"
                        ref={componentRefUnSelect}
                      >
                        <div className="row text-center">
                          <h4 className="pb-2">INVOICE</h4>
                        </div>

                        <div className="text-start my-2">
                          {agentInfo?.logoName !== undefined ||
                          agentInfo?.logoName !== null ? (
                            <img
                              alt="img01"
                              src={environment.s3URL + `${agentInfo?.logoName}`}
                              style={{ width: "150px" }}
                            />
                          ) : (
                            <img
                              alt="img01"
                              className="p-2"
                              src={tllLogo}
                              style={{ width: "150px" }}
                            ></img>
                          )}
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
                                    style={{
                                      fontSize: "10px",
                                      lineHeight: "12px",
                                    }}
                                  >
                                    {agentInfo.address}
                                    <br />
                                    Phone: {agentInfo.mobileNo}
                                    <br></br>
                                    Email: {agentInfo.email}
                                    <br></br>
                                  </div>
                                </address>
                              </td>

                              {/* <td className="text-end bg-white">
                            <address>
                              <span className="fw-bold fs-6">
                                Triplover Ltd.
                              </span>
                              <br />
                              <div
                                className="mt-2"
                                style={{
                                  fontSize: "10px",
                                  lineHeight: "12px",
                                }}
                              >
                                39 Sharif Plaza, Kemal Ataturk
                                <br />
                                Avenue, Banani, Dhaka 1213<br></br>
                                Phone: 01322819380<br></br>
                                Email: info@Triplover.com
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <span className="fw-bold">
                                  {" "}
                                  Invoice Number:{" "}
                                </span>
                                {searchParams.get("tnxNumber")}
                                <br></br>
                                <span className="fw-bold">
                                  {" "}
                                  Invoice Date:{" "}
                                </span>{" "}
                                {moment(data[0]?.createdDate).format(
                                  "DD-MMM-yyyy"
                                )}
                              </div>
                            </address>
                          </td> */}
                            </tr>
                          </tbody>
                        </table>

                        <table
                          className="table table-bordered table-sm"
                          style={{ fontSize: "10px" }}
                        >
                          <thead className="fw-bold text-dark">
                            <tr>
                              <th>Booking ID</th>
                              <th>Ticket No</th>
                              <th>Passenger Name</th>
                              <th>Purpose</th>
                              <th>Details</th>
                              <th className="text-end">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {unSelectPassenger?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{item.uniqueTransID}</td>
                                  <td>{item.ticketNumbers}</td>
                                  <td>{item.passengerName}</td>
                                  <td>{item.purposeName}</td>
                                  <td>{item.remarks}</td>
                                  <td className="text-end fw-bold">
                                    {item.amount +
                                      item.reissueCharge +
                                      item.extraService +
                                      item.additionalCollection}
                                  </td>
                                </tr>
                              );
                            })}
                            <tr>
                              <td colSpan={4}></td>
                              <td className="fw-bold">Total </td>
                              <td
                                className="fw-bold"
                                style={{ textAlign: "right" }}
                              >
                                AED{" "}
                                {invoiceTotalCost(
                                  unSelectPassenger
                                )?.toLocaleString("en-US")}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="container pb-5 mt-2">
                          <div class="row text-start">
                            <b className="p-0">Terms & Conditions :</b>
                            <ul style={{ fontSize: "10px" }}>
                              <li>
                                This is a computer generated statement, hence
                                does not require any signature.
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Invoice;
