import React, { useEffect, useRef, useState } from "react";
import {
  _applyForPartialPayment,
  _getPartialPaymentStatus,
  getGetCurrentUser,
  getPartialinfo,
  PartialPaymenteligiblestatus,
  uploadB2BLogo,
} from "../../common/allApi";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import Footer from "../SharePages/Footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import { environment } from "../SharePages/Utility/environment";
import { Box, Text } from "@chakra-ui/react";

const PaymentRequest = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  let [logoName, setLogoName] = useState();
  let [currentUser, setCurrentUser] = useState({});
  let [userId, setUserId] = useState();
  const fileInputRef = useRef(null);

  const handleGetUser = () => {
    const getData = async () => {
      // const response = await axios.get(
      //   environment.currentUserInfo,
      //   environment.headerToken
      // );
      const response = await getGetCurrentUser();
      setCurrentUser(response.data);
      setUserId(response?.data.id);
    };
    getData();
  };

  const [getPartialData, setGetPartialData] = useState({});
  const getPartialPaymentStatus = async () => {
    await _getPartialPaymentStatus()
      .then((res) => {
        if (res?.data) {
          setGetPartialData(res?.data);
        }
      })
      .catch((err) => {
        toast.error("Please try again!");
      });
  };

  const requestPartialPayments = async () => {
    await _applyForPartialPayment()
      .then((res) => {
        if (res?.data?.isSuccess) {
          getPartialPaymentStatus();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error("Please try again!");
      });
  };

  const [getPartialDatainfo, setgetPartialDatainfo] = useState({});
  const [partialStatus, setpartialStatus] = useState({});
  const [loader, setLoader] = useState(false);

  const getPartialPaymentinfo = async () => {
    setLoader(true);
    await getPartialinfo()
      .then((res) => {
        if (res?.data) {
          setLoader(false);
          setgetPartialDatainfo(res?.data?.data);
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const getPartialPaymenteligiblestatus = async () => {
    await PartialPaymenteligiblestatus()
      .then((res) => {
        if (res?.data) {
          setpartialStatus(res?.data?.data);
        }
      })
      .catch((err) => {
        // toast.error("Please try again!");
      });
  };

  useEffect(() => {
    handleGetUser();
    getPartialPaymentStatus();

    getPartialPaymentinfo();
    getPartialPaymenteligiblestatus();
  }, []);
  return (
    <div>
      {/* <Navbar></Navbar>
      <SideNavBar></SideNavBar> */}

      {/* <div className="content-wrapper search-panel-bg pt-3">
        <ToastContainer position="bottom-right" autoClose={1500} />
        <section className="content">
          <div className="container-fluid" style={{ minHeight: "500px" }}>
            <div className="row"> */}
      <div className="col-md-12 col-12 pb-5">
        {/* <div
                  className="card"
                  style={{
                    borderRadius: "5px",
                    paddingTop: "10px",
                    paddingBottom: "40px",
                  }}
                > */}
        {/* <div className="card-header p-2">
                    <ul className="nav nav-pills">
                      <li className="nav-item">
                        <span className="text-color fs-5 fw-bold">
                          Partial Payments
                        </span>
                      </li>
                    </ul>
                  </div> */}
        {/* <div className="card-body">
                    <div className="tab-content"> */}
        <div className="active tab-pane pt-4" id="activity">
          {partialStatus?.status === "Approved" && (
            <Box
              display={"flex"}
              justifyContent={"start"}
              // className="mx-5"
              flexWrap={"wrap"}
            >
              <div className="col-lg-6 col-12">
                <div
                  className="small-box pb-3"
                  style={{ background: "#cf5d11" }}
                >
                  <div className="inner">
                    <h3 className="text-white">
                      {partialStatus?.agentLimit}/{partialStatus?.unpaid}
                    </h3>
                    <p className="text-white">Agent Limit</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-12">
                <div
                  className="small-box pb-3"
                  style={{ background: "#cf5d11" }}
                >
                  <div className="inner">
                    <h3 className="text-white">
                      {partialStatus?.agentLimit - partialStatus?.unpaid}
                    </h3>
                    <p className="text-white">Available Limit</p>
                  </div>
                </div>
              </div>
            </Box>
          )}
          {getPartialData?.data?.status === "Not Requested" ? (
            <Box>
              <Text
                color={"red"}
                display={"flex"}
                justifyContent={"center"}
                justifyItems={"center"}
                textAlign={"center"}
              >
                N/B : Please send your Trade License and NID to
                pd@Triplover.com to avail Partial Payments. Kindly include
                "Partial Payment Request.
              </Text>
            </Box>
          ) : (
            <></>
          )}

          <div>
            <h4 className="text-center border p-1 rounded">Partial Payments</h4>
            {getPartialData?.data?.status === "Not Requested" ? (
              <div className="d-flex border p-3 align-items-center">
                <p className="me-2">
                  Partial Payments Status:{" "}
                  <span className="text-success">Not Requested Yet</span>
                </p>
                <button
                  type="button"
                  className="btn button-color text-white fw-bold btn-block rounded w-auto btn-sm mt-0"
                  onClick={() => requestPartialPayments()}
                >
                  Request Partial Payments
                </button>
              </div>
            ) : (
              <div className="border p-3">
                <p className="me-2">
                  Partial Payment Status:{" "}
                  <span className="text-success">
                    {getPartialData?.data?.status}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequest;
