import { Center, HStack, Spinner, Text } from "@chakra-ui/react";
import $ from "jquery";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import { environment } from "../SharePages/Utility/environment";
import "./Support.css";
import {
  getSupportHistoriesByAgentList,
  getSupportInfoesByStatustList,
  getsubjectList,
  getsupporttypeList,
  historyFileUpload,
  passengerListAll,
  passengerListByPnr,
  putSupportInfo,
  supportFileUpload,
  supportHistory,
  supportInfoPost,
} from "../../common/allApi";
import NoDataFound from "../../component/noDataFound";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import TableLoader from "../../component/tableLoader";
import { FaEye } from "react-icons/fa";
import { FaFacebookMessenger } from "react-icons/fa";

const Support = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  const [filterSubjectId, setFilterSubjectId] = useState("0");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (page === 1) {
      setPageNumberH(1);
      handleGetOpened(1);
    } else if (page === 2) {
      setPageNumberH(1);
      handleGetOngoing(1);
    } else if (page === 3) {
      setPageNumberH(1);
      handleGetClosed(1);
    }
  }, [filterSubjectId]);

  let [message, setMessage] = useState("");
  let [fileName, setFileName] = useState("");
  let [status, setStatus] = useState(0);
  let [historyFileName, setHistoryFileName] = useState("");
  let [historyMessage, setHistoryMessage] = useState("");
  let [passengerList, setPassengerList] = useState([]);
  let [uniqueTransID, setUniqueTransID] = useState("");
  let [i, setI] = useState(0);
  let typeid = 2;
  let subjectid = 0;
  let utid = "";
  let pnrs = "";
  let ticketno = "";
  const buttonActive = useRef();
  //let page=1;
  let [page, setPage] = useState(1);

  const [isTicketNumRequired, setIsTicketNumRequired] = useState(true);
  const [loader, setLoader] = useState(false);

  const handleGetPassengerList = (trid) => {
    setLoader(true);
    const getPassengerList = async () => {
      const response = await passengerListAll(trid);
      setPassengerList(response.data);
      setLoader(false);
    };
    getPassengerList();
  };
  const handleGetPassengerListByPNr = (pnr) => {
    setLoader(true);
    const getPassengerList = async () => {
      const response = await passengerListByPnr(pnr);
      setPassengerList(response.data);
      setLoader(false);
    };
    getPassengerList();
  };
  if (location.search !== "") {
    if (i == 0) {
      typeid = Number(location.search.split("=")[1].split("&")[0]);
      subjectid = Number(location.search.split("=")[2].split("&")[0]);
      utid = location.search.split("=")[3].split("&")[0];
      pnrs = location.search.split("=")[4].split("&")[0];
      ticketno = location.search.split("=")[5].split("&")[0];
      setUniqueTransID(utid);
      if (ticketno !== null && typeid === 2) {
        handleGetPassengerList(utid);
      }
      setI(i + 1);
    }
  }

  const handleSetUniqueTransID = (utid) => {
    setPassengerList([]);
    if (utid) {
      setUniqueTransID(utid);
      handleGetPassengerList(utid);
    } else {
      setUniqueTransID("");
      setPassengerList([]);
    }
  };
  const handleSetPNR = (pnr) => {
    setPassengerList([]);
    if (pnr) {
      setPNR(pnr);
      handleGetPassengerListByPNr(pnr);
    } else {
      setPNR("");
      setPassengerList([]);
    }
  };
  let [supportTypeId, setSupportTypeId] = useState(typeid);
  let [subjectId, setSubjectId] = useState(subjectid);
  let [searchSubjectId, setSearchSubjectId] = useState(0);

  let [pnr, setPNR] = useState(pnrs);
  let [defaultTicketNumber, setDefaultTicketno] = useState(ticketno);
  let [ticketNumbers, setTicketno] = useState(
    ticketno != "" ? "," + ticketno : ""
  );

  useEffect(() => {}, [ticketNumbers]);
  const handleSetTicketNo = (isChecked, tNo) => {
    if (isChecked) {
      if (ticketNumbers === tNo) {
        return;
      }
      setTicketno((oldData) => oldData + "," + tNo);
    } else {
      setTicketno("");
    }
  };

  let [supporttypeList, setSupportTypeList] = useState([]);
  let [subjectList, setSubjectList] = useState([]);
  let [supportOpenedList, setSupportOpenedList] = useState([]);
  let [supportOngoingList, setSupportOngoingList] = useState([]);
  let [supportClosedList, setSupportClosedList] = useState([]);
  let [currentItem, setCurrentItem] = useState({});
  let [supportHistoryList, setSupportHistoryList] = useState([]);
  let [fileCurrentName, setCurrentFileName] = useState("");
  let [pageSize, setPageSize] = useState(10);
  let [pageCountOn, setPageCountOn] = useState(0);
  let [pageCountOg, setPageCountOg] = useState(0);
  let [pageCountCl, setPageCountCl] = useState(0);
  let [pageNumber, setPageNumber] = useState(1);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  let [pageSizeH, setPageSizeH] = useState(10);
  let [pageCountH, setPageCountH] = useState(0);
  let [pageNumberH, setPageNumberH] = useState(1);

  const [isBookingIdInputed, setIsBookingIdInputed] = useState(false);
  useEffect(() => {
    uniqueTransID === ""
      ? setIsBookingIdInputed(false)
      : setIsBookingIdInputed(true);
  }, [uniqueTransID]);

  const getSupportHistory = async (item, pageNumberH) => {
    setCurrentItem(item);
    const agentId = sessionStorage.getItem("agentId");
    const response = await getSupportHistoriesByAgentList(
      agentId ?? 0,
      item == null ? 0 : item.id,
      true,
      pageNumberH,
      pageSizeH
    );
    setSupportHistoryList(response.data.data);
    setPageCountH(response.data.totalPages);
  };
  const handlePageClickH = async (data) => {
    let currentPage = data.selected + 1;
    setPageNumberH(currentPage);
    getSupportHistory(currentItem, currentPage);
  };

  const [isOpenLoader, setisOpenLoader] = useState(false);
  const handleGetOpened = (pageNumber) => {
    setSupportOpenedList([]);
    setCurrentItem(null);
    const getSupportType = async () => {
      const response = await getsupporttypeList();
      setSupportTypeList(response.data);
    };
    getSupportType();
    const getSubject = async () => {
      const response = await getsubjectList();
      setSubjectList(response.data);
    };
    getSubject();
    const getSupport = async () => {
      setisOpenLoader(true);
      setPageNumber(pageNumber);
      const agentId = sessionStorage.getItem("agentId") ?? 0;
      const response = await getSupportInfoesByStatustList(
        agentId,
        1,
        searchSubjectId,
        pageNumber,
        pageSize
      );
      setSupportOpenedList(response.data.data);
      setPageCountOn(response.data.totalPages);
      setisOpenLoader(false);
    };
    getSupport();
  };

  const [isOngoingLoader, setisOngoingLoader] = useState(false);
  const handleGetOngoing = (pageNumber) => {
    setSupportOngoingList([]);
    setPageNumber(pageNumber);
    const getSupport = async () => {
      setisOngoingLoader(true);
      const agentId = sessionStorage.getItem("agentId") ?? 0;
      const response = await getSupportInfoesByStatustList(
        agentId,
        2,
        searchSubjectId,
        pageNumber,
        pageSize
      );
      setSupportOngoingList(response.data.data);
      setPageCountOg(response.data.totalPages);
      setisOngoingLoader(false);
    };
    getSupport();
    getSupportHistory(currentItem, 1);
  };

  const [isClosedLoader, setisClosedLoader] = useState(false);
  const handleGetClosed = (pageNumber) => {
    setSupportClosedList([]);
    setPageNumber(pageNumber);
    const getSupport = async () => {
      setisClosedLoader(true);
      const agentId = sessionStorage.getItem("agentId") ?? 0;
      const response = await getSupportInfoesByStatustList(
        agentId,
        3,
        searchSubjectId,
        pageNumber,
        pageSize
      );
      setSupportClosedList(response.data.data);
      setPageCountCl(response.data.totalPages);
      setisClosedLoader(false);
    };
    getSupport();
  };
  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setPageNumber(currentPage);
    handleGetOpened(currentPage);
    handleGetOngoing(currentPage);
    handleGetClosed(currentPage);
  };

  const clearForm = (item) => {
    setCurrentItem(null);
    setSupportTypeId(0);
    setSubjectId(0);
    setMessage("");
    setFileName("");
    setStatus("");
    setUniqueTransID("");
    setPNR("");
    setTicketno("");
    navigate("/support");
  };
  const handleFileUpload = (file) => {
    var formData = new FormData();
    formData.append(`file`, file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        // Authorization: "Bearer " + tokenData?.token,
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setProgress(percentCompleted); // Update progress state
      },
    };
    const postData = async () => {
      const response = await supportFileUpload(formData, config);
      setFileName(response.data.fileName);
    };
    postData();
  };
  const handleHistoryFileUpload = (file) => {
    setCurrentFileName(file.name);
    var formData = new FormData();
    formData.append(`file`, file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + tokenData?.token,
      },
    };
    const postData = async () => {
      const response = await historyFileUpload(formData, config);
      setHistoryFileName(response.data.fileName);
    };
    postData();
  };

  const handleHistorySubmit = () => {
    let historyObj = {
      supportId: currentItem == null ? 0 : currentItem.id,
      agentId: sessionStorage.getItem("agentId") ?? 0,
      message: historyMessage,
      fileName: historyFileName,
      isAgent: true,
    };
    if (fileCurrentName === "" && historyMessage == "") {
      toast.error("Sorry! Message is empty..");
      return;
    }
    const postData = async () => {
      const response = await supportHistory(historyObj);
      if (response.data > 0) {
        handleGetOngoing(1);
        toast.success("Thanks! Message sent successfully..");
        document.getElementById("replyBtn").click();
        setHistoryMessage("");
        setCurrentFileName("");
        setHistoryFileName("");
      } else {
        toast.error("Sorry! Message not sent..");
      }
    };
    postData();
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    let ticketNumbersN = ticketNumbers.substring(1, ticketNumbers.length);
    let supportObj = {
      id: currentItem == null ? 0 : currentItem.id,
      agentId: sessionStorage.getItem("agentId") ?? 0,
      supportTypeId: 2,
      subjectId: subjectId,
      message: message,
      fileName: fileName,
      status: 0,
      uniqueTransID: uniqueTransID,
      pnr: pnr,
      ticketNumber: ticketNumbersN === null ? "" : ticketNumbersN,
    };

    if (supportObj.fileNamesupportTypeId === 0) {
      toast.error("Sorry! Support type not selected..");
      return;
    }
    if (subjectId === 0) {
      toast.error("Sorry! Support type is not selected..");
      return;
    }
    if (message === "") {
      toast.error("Sorry! Message is empty..");
      return;
    }
    if (
      location.search.split("ticketno=")[1] !== "null" &&
      subjectId !== 10 &&
      ticketNumbers === ""
    ) {
      toast.error("Sorry! Ticket number not selected..");
      return;
    }
    e.target.disabled = true;

    if ((currentItem == null ? 0 : currentItem.id) > 0) {
      const putData = async () => {
        const response = await putSupportInfo(supportObj);
        if (response.data > 0) {
          toast.success("Thanks! Support Info updated successfully..");
          navigate("/search");
        } else {
          toast.error("Sorry! Support Info not updated..");
        }
      };
      putData();
    } else {
      const postData = async () => {
        const response = await supportInfoPost(supportObj);
        if (response.data > 0) {
          handleGetOpened(1);
          clearForm();
          toast.success("Thanks! Support Info created successfully..");
          document.getElementById("submitCloseBtn").click();
        } else {
          toast.error("Sorry! Support Info not created..");
        }
      };
      postData();
    }
  };

  useEffect(() => {
    handleGetOpened(pageNumber);
    $(document).ready(function () {
      if (location.search !== "") {
        $("#btnOpenModal").click();
      }
    });
  }, [pageNumber]);

  const clearSupportForm = () => {
    buttonActive.current.disabled = false;
    if (location.search === "") {
      setUniqueTransID("");
      setPassengerList([]);
      setPNR("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setProgress(0);
  };

  const [idxD, setIdxD] = useState("Opened");
  let onStatusChange = (statusId) => {
    setIdxD(statusId);
  };

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content pb-5">
          <ToastContainer position="bottom-right" autoClose={1500} />
          <form
            className="mx-lg-5 mx-md-5 mx-sm-1 mt-3"
            encType="multipart/form-data"
          >
            <div className="container-fluid bg-white">
              <div className="d-flex flex-column flex-lg-row justify-content-between  py-3">
                <div className="col-sm-3">
                  <select
                    className="form-select border-radius"
                    placeholder="Subject"
                    onChange={(e) => {
                      Number(e.target.value)
                        ? setSearchSubjectId(Number(e.target.value))
                        : setSearchSubjectId(0);
                      Number(e.target.value)
                        ? setFilterSubjectId(Number(e.target.value))
                        : setFilterSubjectId("0");
                    }}
                  >
                    <option key={0}>Select Type</option>
                    {subjectList.map((item, index) => {
                      return (
                        <option key={index + 1} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="text-end ">
                  <button
                    type="button"
                    id="btnOpenModal"
                    className="btn button-color text-white my-2 border-radius filter-btn fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#supportModal"
                    onClick={() => clearSupportForm()}
                  >
                    Create New Support
                  </button>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-lg-12 border-bottom d-flex justify-content-start p-0 ms-2 ms-lg-0"
                  style={{
                    whiteSpace: "nowrap",
                    overflowX: "auto",
                    scrollbarWidth: "none", // For Firefox
                    WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                    msOverflowStyle: "none", // For IE and Edge
                  }}
                >
                  <div
                    className={
                      idxD === "Opened"
                        ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleGetOpened(1);
                      setPage(1);
                      onStatusChange("Opened");
                    }}
                  >
                    <span
                      className={
                        idxD === "Opened" && "custom-border-selected-tab pb-3"
                      }
                    >
                      Opened
                    </span>
                  </div>
                  <div
                    className={
                      idxD === "Ongoing"
                        ? "custom-selected-tab px-3 rounded-top py-3 fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleGetOngoing(1);
                      setPage(2);
                      onStatusChange("Ongoing");
                    }}
                  >
                    <span
                      className={
                        idxD === "Ongoing" && "custom-border-selected-tab pb-3"
                      }
                    >
                      Ongoing
                    </span>
                  </div>

                  <div
                    className={
                      idxD === "Closed"
                        ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleGetClosed(1);
                      setPage(3);
                      onStatusChange("Closed");
                    }}
                  >
                    <span
                      className={
                        idxD === "Closed" && "custom-border-selected-tab pb-3"
                      }
                    >
                      Closed
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 py-3">
                {idxD === "Opened" && (
                  <div className="">
                    <div className="table-responsive ">
                      <table
                        className="table  table-lg"
                        style={{ width: "100%", fontSize: "13px" }}
                      >
                        <thead className="text-start fw-bold bg-secondary">
                          <tr>
                            <th>SUPPORT TYPE</th>
                            <th>MESSAGE</th>
                            <th>DATE</th>
                            <th>BOOKING ID</th>
                            <th>PNR</th>
                            <th>TICKET NUMBER</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="tbody">
                          {supportOpenedList.map((item, index) => {
                            return (
                              <tr
                                key={index}
                                className="text-start fw-bold text-secondary"
                              >
                                <td>{item.subjectName}</td>
                                <td
                                  title={item.message}
                                  style={{
                                    background:
                                      item.isAgent === true
                                        ? "white"
                                        : "#F486A1",
                                  }}
                                >
                                  {item.message?.length > 50
                                    ? item.message.substr(0, 50) + "..."
                                    : item.message}{" "}
                                  {item.isAgent}
                                </td>
                                <td>
                                  {moment(item.createdDate).format(
                                    "DD-MM-YYYY HH:mm"
                                  )}
                                </td>
                                <td
                                  style={{
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                >
                                  {item.uniqueTransID}
                                </td>
                                <td
                                  style={{
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                >
                                  {item.pnr === "" || item.pnr === null
                                    ? "N/A"
                                    : item.pnr}
                                </td>
                                <td
                                  style={{
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                >
                                  {item.ticketNumber === "null" ||
                                  item.ticketNumber === null ||
                                  item.ticketNumber === ""
                                    ? "N/A"
                                    : item.ticketNumber}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-start align-items-center gap-1">
                                    <a
                                      href="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#viewModal"
                                      onClick={() => getSupportHistory(item, 1)}
                                      title="View"
                                    >
                                      <FaEye
                                        className="shadow p-1 rounded-3 text-white button-color"
                                        style={{ fontSize: "25px" }}
                                      />
                                    </a>
                                    <a
                                      href="#"
                                      style={{ color: "#02046a" }}
                                      data-bs-toggle="modal"
                                      data-bs-target="#replayModal"
                                      onClick={() => getSupportHistory(item, 1)}
                                      title="Message"
                                    >
                                      {item.isAgent == true ? (
                                        <FaFacebookMessenger
                                          style={{ fontSize: "25px" }}
                                          className="shadow p-1 rounded-3 text-white button-secondary-color"
                                        />
                                      ) : (
                                        <FaFacebookMessenger
                                          style={{ fontSize: "25px" }}
                                          className="shadow p-1 rounded-3 text-white button-secondary-color"
                                        />
                                      )}
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {isOpenLoader && <TableLoader />}
                      {supportOpenedList.length === 0 && !isOpenLoader && (
                        <NoDataFound />
                      )}
                    </div>
                    <div className="d-flex justify-content-end">
                      {supportOpenedList.length > 0 && !isOpenLoader && (
                        <ReactPaginate
                          previousLabel={
                            <div className="d-flex align-items-center gap-1">
                              <MdOutlineSkipPrevious
                                style={{ fontSize: "18px" }}
                                color="#ed8226"
                              />{" "}
                              Prev
                            </div>
                          }
                          nextLabel={
                            <div className="d-flex align-items-center gap-1">
                              <MdOutlineSkipNext
                                style={{ fontSize: "18px" }}
                                color="#ed8226"
                              />
                              Next
                            </div>
                          }
                          breakLabel={"..."}
                          pageCount={pageCountOn}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={3}
                          onPageChange={handlePageClick}
                          containerClassName={
                            "pagination justify-content-center py-2 border rounded"
                          }
                          pageClassName={"page-item"}
                          pageLinkClassName={"page-link"}
                          previousClassName={"page-item"}
                          previousLinkClassName={"page-link"}
                          nextClassName={"page-item"}
                          nextLinkClassName={"page-link"}
                          breakClassName={"page-item"}
                          breakLinkClassName={"page-link"}
                          activeClassName={"active"}
                        />
                      )}
                    </div>
                  </div>
                )}

                {idxD === "Ongoing" && (
                  <div className="" id="">
                    <div className="table-responsive ">
                      <table
                        className="table  table-lg"
                        style={{ width: "100%", fontSize: "13px" }}
                      >
                        <thead className="text-start fw-bold bg-secondary">
                          <tr>
                            <th>SUPPORT TYPE</th>
                            <th>MESSAGE</th>
                            <th>DATE</th>
                            <th>BOOKING ID</th>
                            <th>PNR</th>
                            <th>TICKET NUMBER</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supportOngoingList.map((item, index) => {
                            let bgColor =
                              item.isAgentRead === true ? "white" : "#c1bebe";
                            return (
                              <tr
                                key={index}
                                className="text-start fw-bold text-secondary"
                              >
                                <td>{item.subjectName}</td>
                                <td
                                  title={item.message}
                                  style={{
                                    background:
                                      item.isAgent === true
                                        ? "white"
                                        : "#F486A1",
                                  }}
                                >
                                  {item.message?.length > 50
                                    ? item.message.substr(0, 50) + "..."
                                    : item.message}{" "}
                                  {item.isAgent}
                                </td>
                                <td>
                                  {moment(item.createdDate).format(
                                    "DD-MM-YYYY HH:mm"
                                  )}
                                </td>
                                <td
                                  style={{
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                >
                                  {item.uniqueTransID}
                                </td>
                                <td
                                  style={{
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                >
                                  {item.pnr}
                                </td>
                                <td
                                  style={{
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                >
                                  {item.ticketNumber}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-start align-items-center gap-1">
                                    <a
                                      href="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#viewModal"
                                      onClick={() => getSupportHistory(item, 1)}
                                      title="View"
                                    >
                                      <FaEye
                                        className="shadow p-1 rounded-3 text-white button-color"
                                        style={{ fontSize: "25px" }}
                                      />
                                    </a>
                                    <a
                                      href="#"
                                      style={{ color: "#02046a" }}
                                      data-bs-toggle="modal"
                                      data-bs-target="#replayModal"
                                      onClick={() => getSupportHistory(item, 1)}
                                      title="Message"
                                    >
                                      {item.isAgent == true ? (
                                        <FaFacebookMessenger
                                          style={{ fontSize: "25px" }}
                                          className="shadow p-1 rounded-3 text-white button-secondary-color"
                                        />
                                      ) : (
                                        <FaFacebookMessenger
                                          style={{ fontSize: "25px" }}
                                          className="shadow p-1 rounded-3 text-white button-secondary-color"
                                        />
                                      )}
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {isOngoingLoader && <TableLoader />}
                      {supportOngoingList.length === 0 && !isOngoingLoader && (
                        <NoDataFound />
                      )}
                    </div>

                    <div className="d-flex justify-content-end">
                      {supportOngoingList.length > 0 && !isOngoingLoader && (
                        <ReactPaginate
                          previousLabel={
                            <div className="d-flex align-items-center gap-1">
                              <MdOutlineSkipPrevious
                                style={{ fontSize: "18px" }}
                                color="#ed8226"
                              />{" "}
                              Prev
                            </div>
                          }
                          nextLabel={
                            <div className="d-flex align-items-center gap-1">
                              <MdOutlineSkipNext
                                style={{ fontSize: "18px" }}
                                color="#ed8226"
                              />
                              Next
                            </div>
                          }
                          breakLabel={"..."}
                          pageCount={pageCountOg}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={3}
                          onPageChange={handlePageClick}
                          containerClassName={
                            "pagination justify-content-center py-2 border rounded"
                          }
                          pageClassName={"page-item"}
                          pageLinkClassName={"page-link"}
                          previousClassName={"page-item"}
                          previousLinkClassName={"page-link"}
                          nextClassName={"page-item"}
                          nextLinkClassName={"page-link"}
                          breakClassName={"page-item"}
                          breakLinkClassName={"page-link"}
                          activeClassName={"active"}
                        />
                      )}
                    </div>
                  </div>
                )}

                {idxD === "Closed" && (
                  <div className="" id="">
                    <div className="table-responsive">
                      <table
                        className="table table-boardered table-lg"
                        style={{ width: "100%", fontSize: "13px" }}
                      >
                        <thead className="text-start fw-bold bg-secondary">
                          <tr>
                            <th>SUPPORT TYPE</th>
                            <th>MESSAGE</th>
                            <th>DATE</th>
                            <th>BOOKING ID</th>
                            <th>PNR</th>
                            <th>TICKET NUMBER</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="tbody">
                          {supportClosedList.map((item, index) => {
                            return (
                              <tr
                                key={index}
                                className="text-start fw-bold text-secondary"
                              >
                                <td>{item.subjectName}</td>
                                <td
                                  title={item.message}
                                  style={{
                                    background:
                                      item.isAgent === true
                                        ? "white"
                                        : "#F486A1",
                                  }}
                                >
                                  {item.message?.length > 50
                                    ? item.message.substr(0, 50) + "..."
                                    : item.message}{" "}
                                  {item.isAgent}
                                </td>
                                <td>
                                  {moment(item.createdDate).format(
                                    "DD-MM-YYYY HH:mm"
                                  )}
                                </td>
                                <td
                                  style={{
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                >
                                  {item.uniqueTransID}
                                </td>
                                <td
                                  style={{
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                >
                                  {item.pnr}
                                </td>
                                <td
                                  style={{
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                >
                                  {item.ticketNumber}
                                </td>
                                <td>
                                  <a
                                    href="#"
                                    style={{ color: "#02046a" }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#viewModal"
                                    onClick={() => getSupportHistory(item, 1)}
                                    title="View"
                                  >
                                    <FaEye
                                      className="shadow p-1 rounded-3 text-white button-color"
                                      style={{ fontSize: "25px" }}
                                    />
                                  </a>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {isClosedLoader && <TableLoader />}
                      {supportClosedList.length === 0 && !isClosedLoader && (
                        <NoDataFound />
                      )}
                    </div>
                    <div className="d-flex justify-content-end">
                      {supportClosedList.length > 0 && !isClosedLoader && (
                        <ReactPaginate
                          previousLabel={
                            <div className="d-flex align-items-center gap-1">
                              <MdOutlineSkipPrevious
                                style={{ fontSize: "18px" }}
                                color="#ed8226"
                              />{" "}
                              Prev
                            </div>
                          }
                          nextLabel={
                            <div className="d-flex align-items-center gap-1">
                              <MdOutlineSkipNext
                                style={{ fontSize: "18px" }}
                                color="#ed8226"
                              />
                              Next
                            </div>
                          }
                          breakLabel={"..."}
                          pageCount={pageCountCl}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={3}
                          onPageChange={handlePageClick}
                          containerClassName={
                            "pagination justify-content-center py-2 border rounded"
                          }
                          pageClassName={"page-item"}
                          pageLinkClassName={"page-link"}
                          previousClassName={"page-item"}
                          previousLinkClassName={"page-link"}
                          nextClassName={"page-item"}
                          nextLinkClassName={"page-link"}
                          breakClassName={"page-item"}
                          breakLinkClassName={"page-link"}
                          activeClassName={"active"}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="modal fade"
                id="supportModal"
                tabIndex={-1}
                aria-hidden="true"
                aria-labelledby="staticBackdropLabel"
                data-bs-keyboard="false"
                data-bs-backdrop="static"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="supportModalLabel">
                        {" "}
                        Support
                      </h5>
                      <button
                        id="submitCloseBtn"
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => clearForm()}
                      />
                    </div>
                    <div className="modal-body">
                      <div className="row">
                        <input type={"hidden"}></input>
                        <div className="row my-3">
                          {location.search.split("ticketno=")[1] !== "null" && (
                            <div className="col-sm-4">
                              <label class="form-label">
                                Support Type
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <select
                                className="form-select border-radius"
                                value={subjectId}
                                placeholder="Subject"
                                onChange={(e) =>
                                  setSubjectId(Number(e.target.value))
                                }
                              >
                                <option key={0}>Select Type</option>
                                {subjectList.map((item, index) => {
                                  return (
                                    <option key={index + 1} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          )}

                          <HStack w="400px">
                            <div className="col-sm-8">
                              <label class="form-label">Booking ID</label>
                              <input
                                class="form-control"
                                type={"text"}
                                placeholder={"Booking ID"}
                                value={uniqueTransID}
                                className="form-control border-radius"
                                onChange={(e) =>
                                  setUniqueTransID(e.target.value)
                                }
                                onBlur={(e) =>
                                  handleSetUniqueTransID(e.target.value)
                                }
                                disabled={!isBookingIdInputed && pnr !== ""}
                              ></input>
                            </div>
                            <Text
                              fontWeight={600}
                              fontSize="md"
                              pt="27px"
                              color="gray"
                            >
                              Or
                            </Text>
                            <div className="col-sm-8">
                              <label class="form-label">PNR</label>
                              <input
                                type={"text"}
                                placeholder={"PNR"}
                                value={pnr}
                                className="form-control border-radius"
                                onChange={(e) => setPNR(e.target.value)}
                                onBlur={(e) => handleSetPNR(e.target.value)}
                                disabled={isBookingIdInputed}
                              ></input>
                            </div>
                          </HStack>

                          {location.search.split("ticketno=")[1] !== "null" ? (
                            <>
                              {typeof passengerList == "object" &&
                              passengerList.length > 0 ? (
                                <>
                                  <div className="col-sm-12">
                                    <table
                                      className=" table table-boardered table-sm mt-3"
                                      style={{
                                        width: "100%",
                                        fontSize: "13px",
                                      }}
                                    >
                                      <thead className="text-center fw-bold bg-secondary">
                                        {typeof passengerList == "object" &&
                                        passengerList.length > 0
                                          ? passengerList.map((item, index) => {
                                              return (
                                                <>
                                                  {item.ticketNumbers &&
                                                    item.ticketNumbers !==
                                                      null &&
                                                    index === 0 && (
                                                      <tr>
                                                        <th>Pax Name</th>
                                                        <th>Type</th>
                                                        <th>
                                                          Ticket Number{" "}
                                                          <span
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </th>
                                                      </tr>
                                                    )}
                                                </>
                                              );
                                            })
                                          : ""}
                                      </thead>

                                      <tbody className="lh-1 tbody text-center">
                                        {passengerList.length > 0
                                          ? passengerList.map((item, index) => {
                                              return (
                                                <>
                                                  {item.ticketNumbers &&
                                                    item.ticketNumbers !==
                                                      null && (
                                                      <tr>
                                                        <td>
                                                          {item.title +
                                                            " " +
                                                            item.first +
                                                            " " +
                                                            item.middle +
                                                            " " +
                                                            item.last}
                                                        </td>
                                                        <td>
                                                          {item.passengerType}
                                                        </td>
                                                        <td>
                                                          {
                                                            <>
                                                              <input
                                                                type={
                                                                  "checkbox"
                                                                }
                                                                defaultChecked={
                                                                  item.ticketNumbers ===
                                                                  defaultTicketNumber
                                                                    ? true
                                                                    : false
                                                                }
                                                                onChange={(e) =>
                                                                  handleSetTicketNo(
                                                                    e.target
                                                                      .checked,
                                                                    item.ticketNumbers
                                                                  )
                                                                }
                                                              ></input>
                                                              &nbsp;{" "}
                                                              {
                                                                item.ticketNumbers
                                                              }
                                                            </>
                                                          }
                                                        </td>
                                                      </tr>
                                                    )}
                                                </>
                                              );
                                            })
                                          : ""}
                                      </tbody>
                                    </table>

                                    <br />
                                  </div>
                                </>
                              ) : (
                                subjectId !== 10 && (
                                  <>
                                    {loader ? (
                                      <Center w="100%" pt="30px">
                                        <Spinner
                                          thickness="4px"
                                          speed="0.65s"
                                          emptyColor="gray.200"
                                          color="red.500"
                                          size="lg"
                                        />
                                      </Center>
                                    ) : (
                                      <Text
                                        pt="30px"
                                        fontSize="sm"
                                        textAlign="center"
                                        w="100%"
                                      >
                                        Please make sure to select Ticket Number{" "}
                                        <br />
                                        (You can search for your ticket number
                                        with Booking ID or PNR)
                                      </Text>
                                    )}
                                  </>
                                )
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="row mb-3">
                          <div className="col-sm-12">
                            <label>
                              Message
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <textarea
                              rows={3}
                              type={"text"}
                              value={message}
                              className="form-control border-radius"
                              placeholder="Message"
                              onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-5">
                            <label>File</label>
                            <input
                              type={"file"}
                              className="form-control border-radius"
                              placeholder="File"
                              ref={fileInputRef}
                              onChange={(e) =>
                                handleFileUpload(e.target.files[0])
                              }
                            ></input>
                            {progress > 0 && (
                              <div className="progress-container mt-1">
                                <div
                                  className="progress-bar"
                                  style={{ width: `${progress}%` }}
                                >
                                  {/* <span className="progress-text">{progress}%</span> */}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn button-secondary-color fw-bold border-radius text-white"
                        data-bs-dismiss="modal"
                        onClick={() => clearForm()}
                      >
                        Close
                      </button>
                      <button
                        ref={buttonActive}
                        id="submitBtn"
                        type="button"
                        className="btn button-color fw-bold text-white border-radius"
                        onClick={(e) => handleSupportSubmit(e)}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="modal fade"
                id="viewModal"
                tabIndex={-1}
                aria-labelledby="replayModalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="replayModalLabel">
                        {" "}
                        View
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="row">
                        <div className="container bootstrap snippets bootdey">
                          <div className="row">
                            <div className="col-md-12 bg-white ">
                              <div className="chat-message">
                                <ul className="chat">
                                  {supportHistoryList.map((item, index) => {
                                    return (
                                      <li
                                        className={`text-${
                                          item.isAgent === true
                                            ? "right"
                                            : "left"
                                        } clearfix`}
                                      >
                                        <span className="chat-img">
                                          {/* <img src={require(`../../images/icon/${'user.png'}`)} alt=''/> */}
                                        </span>
                                        <div className="chat-body clearfix">
                                          <div className="header">
                                            <strong className="primary-font">
                                              {item.createdByName}
                                            </strong>
                                            <br />
                                            <small
                                              className={`text-${
                                                item.isAgent === true
                                                  ? "right"
                                                  : "left"
                                              } text-muted`}
                                            >
                                              <i className="fa fa-clock-o"></i>{" "}
                                              {moment(item.createdDate).format(
                                                "DD-MMMM-yyyy HH:mm"
                                              )}
                                            </small>
                                          </div>
                                          <p
                                            className={`text-${
                                              item.isAgent === true
                                                ? "right"
                                                : "left"
                                            } text-muted`}
                                          >
                                            {item.message}
                                          </p>
                                          {/* <a href={require(`../../images/icon/${'user.png'}`)} download>download</a> */}
                                          {item.fileName != null &&
                                          item.fileName != "" ? (
                                            <a
                                              href={
                                                environment.s3URL +
                                                `${item.fileName}`
                                              }
                                              download
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              {item.fileName.length > 50
                                                ? item.fileName.substr(0, 50) +
                                                  "..."
                                                : item.fileName}
                                            </a>
                                          ) : (
                                            <></>
                                          )}
                                          {
                                            <span style={{ color: "green" }}>
                                              {item.isAgent === true &&
                                              item.isAdminRead === true
                                                ? "Seen"
                                                : ""}
                                            </span>
                                          }
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="modal fade"
                id="replayModal"
                tabIndex={-1}
                aria-labelledby="replayModalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="replayModalLabel">
                        {" "}
                        Reply
                      </h5>
                      <button
                        id="replyBtn"
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => setCurrentFileName("")}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="row">
                        <div className="container bootstrap snippets bootdey">
                          <div className="row">
                            <div className="col-md-12 bg-white ">
                              <div className="chat-message">
                                <ul className="chat">
                                  {supportHistoryList.map((item, index) => {
                                    return (
                                      <li
                                        className={`text-${
                                          item.isAgent === true
                                            ? "right"
                                            : "left"
                                        } clearfix`}
                                      >
                                        <span className="chat-img">
                                          {/* <img src={require(`../../images/icon/${'user.png'}`)} alt=''/> */}
                                        </span>
                                        <div className="chat-body clearfix">
                                          <div className="header">
                                            <strong className="primary-font">
                                              {item.createdByName}
                                            </strong>
                                            <br />
                                            <small
                                              className={`text-${
                                                item.isAgent === true
                                                  ? "right"
                                                  : "left"
                                              } text-muted`}
                                            >
                                              <i className="fa fa-clock-o"></i>{" "}
                                              {moment(item.createdDate).format(
                                                "DD-MMMM-yyyy HH:mm"
                                              )}
                                            </small>
                                          </div>
                                          <p
                                            className={`text-${
                                              item.isAgent === true
                                                ? "right"
                                                : "left"
                                            } text-muted`}
                                          >
                                            {item.message}
                                          </p>
                                          {/* <a href={require(`../../images/icon/${'user.png'}`)} download>download</a> */}
                                          {item.fileName != null &&
                                          item.fileName != "" ? (
                                            <a
                                              href={
                                                environment.s3URL +
                                                `${item.fileName}`
                                              }
                                              download
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              {item.fileName.length > 50
                                                ? item.fileName.substr(0, 50) +
                                                  "..."
                                                : item.fileName}
                                            </a>
                                          ) : (
                                            <></>
                                          )}
                                          {
                                            <span style={{ color: "green" }}>
                                              {item.isAgent === true &&
                                              item.isAdminRead === true
                                                ? "Seen"
                                                : ""}
                                            </span>
                                          }
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                              {page !== 3 && (
                                <div className="chat-box bg-white">
                                  <div className="row">{fileCurrentName}</div>
                                  <div className="input-group">
                                    <span className="btn button-secondary-color btn-file text-white mx-1 border-radius">
                                      <i className="fa fa-paperclip"></i>
                                      <input
                                        type="file"
                                        onChange={(e) =>
                                          handleHistoryFileUpload(
                                            e.target.files[0]
                                          )
                                        }
                                      />
                                    </span>
                                    <input
                                      value={historyMessage}
                                      className="form-control border no-shadow no-rounded border-radius"
                                      placeholder="Type your message here"
                                      onChange={(e) =>
                                        setHistoryMessage(e.target.value)
                                      }
                                    />
                                    <span className="input-group-btn">
                                      <button
                                        className="btn button-color fw-bold text-white mx-1 border-radius"
                                        type="button"
                                        onClick={() => handleHistorySubmit()}
                                      >
                                        Send
                                      </button>
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Support;
