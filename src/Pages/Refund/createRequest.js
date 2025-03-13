import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Icon, Text, Textarea } from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import { toast, ToastContainer } from "react-toastify";
import {
  getBasicInfoFroRefundRequest,
  requestRefund,
} from "../../common/allApi";
import { FaChevronCircleDown, FaRegAddressCard } from "react-icons/fa";
import { FaChevronCircleUp } from "react-icons/fa";

const GetRefund = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let [refundTicketingList, setRefundTicketingList] = useState([]);
  let [segmentList, setSegmentList] = useState([]);

  let [basicInfo, setBasicInfo] = useState();
  const [loader, setLoader] = useState(false);
  const [refund, setRefund] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [toggleSegment, setToggleSegment] = useState(true);
  const passengerSelectRefs = useRef([]);
  const segmentSelectRefs = useRef([]);
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllSegment, setSelectAllSegment] = useState(false);

  const getRefundTicketingList = async () => {
    setLoader(true);
    try {
      const response = await getBasicInfoFroRefundRequest(
        searchParams.get("uniqueTransId")
      );
      if (response?.data?.isSuccess) {
        setRefundTicketingList(response?.data?.data?.refundRequestBasicData);
        setSegmentList(response?.data?.data?.legInfo);
        setBasicInfo(response?.data?.data?.basicInfo);
        setLoader(false);
      }
      setLoader(false);
    } catch (error) {
      toast.error("Please try again.");
      setLoader(false);
    }
  };

  useEffect(() => {
    getRefundTicketingList();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (basicInfo?.selectAllPax) {
      setSelectAll(true);
      const newSelectedPassengers = refundTicketingList.filter(
        (item) => item.canRequest
      );
      setSelectedPassengers(newSelectedPassengers);
      passengerSelectRefs.current.forEach((ref, index) => {
        if (ref.current) {
          ref.current.checked = refundTicketingList[index]?.canRequest;
        }
      });
    }
  }, [basicInfo?.selectAllPax, refundTicketingList]);

  const handleCheckboxChange = (item, index) => {
    const isSelected = selectedPassengers.includes(item);
    const newSelectedPassengers = isSelected
      ? selectedPassengers.filter((passenger) => passenger !== item)
      : [...selectedPassengers, item];

    setSelectedPassengers(newSelectedPassengers);
    if (newSelectedPassengers.length === refundTicketingList.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    if (passengerSelectRefs.current[index]?.current) {
      passengerSelectRefs.current[index].current.checked = !isSelected;
    }
  };

  const handleCheckboxChangeForSegment = (item, index) => {
    const isSelected = selectedSegments.includes(item);
    const newSelectedSegments = isSelected
      ? selectedSegments.filter((passenger) => passenger !== item)
      : [...selectedSegments, item];

    setSelectedSegments(newSelectedSegments);
    if (newSelectedSegments.length === segmentList.length) {
      setSelectAllSegment(true);
    } else {
      setSelectAllSegment(false);
    }
  };

  useEffect(() => {
    passengerSelectRefs.current = refundTicketingList.map(
      (_, index) => passengerSelectRefs.current[index] || React.createRef()
    );
  }, [refundTicketingList]);

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    const newSelectedPassengers = e.target.checked
      ? refundTicketingList.filter((item) => item.canRequest)
      : [];
    setSelectedPassengers(newSelectedPassengers);
    passengerSelectRefs.current.forEach((ref, index) => {
      if (ref.current) {
        ref.current.checked =
          e.target.checked && refundTicketingList[index]?.canRequest;
      }
    });
  };

  const handleSelectAllSegemnt = (e) => {
    const isChecked = e.target.checked;
    setSelectAllSegment(isChecked);
    setSelectedSegments(isChecked ? segmentList : []);
  };

  const [btnLoader, setBtnLoader] = useState(false);
  let [value, setValue] = React.useState("");
  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };

  const handelnavigate = async () => {
    setBtnLoader(true);
    let payload = {
      refundTicketIds: [],
      legwiseGroupName: [],
      agentRemarks: value,
    };

    if (selectedPassengers?.length === 0) {
      setBtnLoader(false);
      return toast.error("Please select passenger");
    } else if (selectedSegments?.length === 0) {
      setBtnLoader(false);
      return toast.error("Please select at least one segment");
    } else {
      selectedPassengers?.map((item) =>
        payload.refundTicketIds.push(item?.ticketId)
      );

      selectedSegments?.map((item) =>
        payload.legwiseGroupName.push(item?.groupName)
      );
      await requestRefund(payload)
        .then((res) => {
          if (res?.data?.isSuccess) {
            setBtnLoader(false);
            sessionStorage.setItem("refundData", JSON.stringify(res?.data));
            navigate(
              "/refund-request?groupId=" +
                res?.data?.data?.groupId +
                "&editCount=" +
                res?.data?.data?.editCount +
                "&failedAuto=" +
                res?.data?.data?.failedAuto,
              "_blank"
            );
          } else {
            setBtnLoader(false);
            toast.error(res?.data?.message);
          }
        })
        .catch((r) => {
          setBtnLoader(false);
          toast.error("Please try again.");
        });
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <ToastContainer position="bottom-right" autoClose={1500} />
      <div className="content-wrapper search-panel-bg pb-5 pt-5 px-5">
        <div className="container-fluid">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-white shadow rounded">
                <span className="fw-bold">Refund Ticket</span>
              </div>
            </div>
          </div>

          <div className="mb-3 card card-body rounded ">
            <div className="table-responsive">
              <table
                className="table table-bordered my-2 mb-3 table-sm"
                style={{ fontSize: "11px" }}
              >
                <thead>
                  <tr>
                    <th
                      colspan="4"
                      className="fw-bold py-2 bg-light"
                      style={{ fontSize: "15px" }}
                    >
                      BOOKING INFO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="py-2" style={{ fontSize: "15px" }}>
                      Booking ID
                    </th>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.uniqueTransId}
                    </td>
                    <td className="py-2 fw-bold" style={{ fontSize: "15px" }}>
                      PNR
                    </td>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.pnr}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 fw-bold" style={{ fontSize: "15px" }}>
                      Fly Date
                    </th>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.flyDate}
                    </td>
                    <td className="py-2 fw-bold" style={{ fontSize: "15px" }}>
                      Airline Code
                    </td>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.airlineCode}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 fw-bold" style={{ fontSize: "15px" }}>
                      Route
                    </th>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.route}
                    </td>
                    <td className="py-2 fw-bold" style={{ fontSize: "15px" }}>
                      Number Of PAX
                    </td>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.numberOfPax}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 rounded">
              {loader ? (
                <div className="d-flex align-items-center justify-content-center my-3">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="px-2  bg-white rounded border my-2">
                    <div className="d-flex justify-content-between align-items-center pt-3 px-2">
                      <div className="fw-bold">Select Passenger</div>
                      <div>
                        <Box
                          display={"flex"}
                          justifyContent={"start"}
                          alignItems={"center"}
                          gap={2}
                          px={1}
                        >
                          {refundTicketingList.some(
                            (item) => item.canRequest
                          ) && (
                            <>
                              <input
                                type="checkbox"
                                checked={
                                  selectAll ||
                                  selectedPassengers?.length ===
                                    refundTicketingList?.length
                                }
                                onChange={(e) => handleSelectAll(e)}
                              />
                              <Text fontWeight={700} fontSize={"14px"}>
                                Select All
                              </Text>
                            </>
                          )}

                          {toggle ? (
                            <FaChevronCircleUp
                              onClick={() => setToggle((pre) => !pre)}
                            />
                          ) : (
                            <FaChevronCircleDown
                              onClick={() => setToggle((pre) => !pre)}
                            />
                          )}
                        </Box>
                      </div>
                    </div>
                    <div className="p-2 table-responsive px-2 bg-white">
                      {toggle && (
                        <table
                          className="table table-bordered table-lg"
                          style={{ width: "100%", fontSize: "13px" }}
                        >
                          <thead className="text-start fw-bold bg-secondary">
                            <tr>
                              <th>Select</th>
                              <th>Reason</th>
                              <th>Name</th>
                              <th>Ticket Number</th>
                              <th>Type</th>
                            </tr>
                          </thead>

                          <tbody>
                            {refundTicketingList?.length > 0 &&
                              refundTicketingList?.map((item, index) => (
                                <tr key={index} className="border-none">
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <input
                                        type="checkbox"
                                        ref={passengerSelectRefs.current[index]}
                                        disabled={!item?.canRequest && true}
                                        checked={selectedPassengers.includes(
                                          item
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(item, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    {!item?.canRequest && (
                                      <span className="text-danger ms-1 fw-bold">
                                        {item?.reason}
                                      </span>
                                    )}
                                  </td>
                                  <td>{item.passengerName}</td>
                                  <td>{item.ticketNumber}</td>
                                  <td>{item.passengerType}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  <div className="px-2  bg-white rounded border my-2">
                    <div className="d-flex justify-content-between align-items-center pt-3 px-2">
                      <div className="fw-bold">Select Segemnt</div>
                      <div>
                        <Box
                          display={"flex"}
                          justifyContent={"start"}
                          alignItems={"center"}
                          gap={2}
                          px={1}
                        >
                          <>
                            <input
                              type="checkbox"
                              checked={selectAllSegment}
                              onChange={(e) => handleSelectAllSegemnt(e)}
                            />
                            <Text fontWeight={700} fontSize={"14px"}>
                              Select All
                            </Text>
                          </>

                          {toggleSegment ? (
                            <FaChevronCircleUp
                              onClick={() => setToggleSegment((pre) => !pre)}
                            />
                          ) : (
                            <FaChevronCircleDown
                              onClick={() => setToggleSegment((pre) => !pre)}
                            />
                          )}
                        </Box>
                      </div>
                    </div>
                    <div className="p-2 table-responsive px-2 bg-white">
                      {toggleSegment && (
                        <table
                          className="table table-bordered table-lg"
                          style={{ width: "100%", fontSize: "13px" }}
                        >
                          <thead className="text-start fw-bold bg-secondary">
                            <tr>
                              <th>Select</th>
                              <th>Date</th>
                              <th>LegWise Route</th>
                              <th>Destination</th>
                              <th>Origin</th>
                            </tr>
                          </thead>

                          <tbody>
                            {segmentList?.length > 0 &&
                              segmentList?.map((item, index) => (
                                <tr key={index} className="border-none">
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <input
                                        type="checkbox"
                                        checked={selectedSegments.includes(
                                          item
                                        )}
                                        onChange={() =>
                                          handleCheckboxChangeForSegment(
                                            item,
                                            index
                                          )
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <span className="ms-1 fw-bold">
                                      {item?.departure}
                                    </span>
                                  </td>
                                  <td>{item.legWiseRoute}</td>
                                  <td>{item.destination}</td>
                                  <td>{item.origin}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                  <div className="card card-body rounded mt-4">
                    <Box pb={4}>
                      <Text mb="8px" fontWeight={700}>
                        Remarks
                      </Text>
                      <Textarea
                        value={value}
                        onChange={handleInputChange}
                        placeholder="Remarks"
                        size="sm"
                      />
                    </Box>
                    <Box display={"flex"} justifyContent={"flex-start"} gap={3}>
                      {" "}
                      <input
                        type="checkbox"
                        onChange={(e) => setRefund(e.target.checked)}
                      />
                      <Text fontWeight={700}>
                        I acknowledge the{" "}
                        <Link to={"/termandcondition"} target="_blank">
                          <u style={{ color: "#7c04c0" }} className="fw-bold">
                            Terms & Conditions
                          </u>
                        </Link>
                      </Text>
                    </Box>
                    <Box
                      pointerEvents={refund ? "auto" : "none"}
                      opacity={refund ? 1 : 0.5}
                    >
                      <Button
                        onClick={handelnavigate}
                        bg={"#7c04c0"}
                        color={"white"}
                        _hover={"none"}
                        mt={3}
                        disabled={
                          btnLoader
                            ? true
                            : refundTicketingList.every(
                                (item) => item.canRequest === false
                              )
                        }
                      >
                        Go Quotation
                      </Button>
                    </Box>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GetRefund;
