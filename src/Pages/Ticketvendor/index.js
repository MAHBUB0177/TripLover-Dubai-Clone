import {
  Box,
  Button,
  Icon,
  Input,
  Select,
  Stack,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import html2canvas from "html2canvas";
import $ from "jquery";
import jsPDF from "jspdf";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdEmail } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { toast, ToastContainer } from "react-toastify";
import tllLogo from "../../../src/images/logo/logo-combined.png";
import {
  getCountryCode,
  getPassengerType,
  sortPassangerType,
  sumRating,
  sumRatingGross,
} from "../../common/functions";
import ModalForm from "../../common/modalForm";
import useAuth from "../../hooks/useAuth";
import airports from "../../JSON/airports.json";
import Loading from "../Loading/Loading";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import { environment } from "../SharePages/Utility/environment";

const TicketingVendor = () => {
  const [supplierList, setSuplierList] = useState([]);
  console.log(supplierList, "supplierList0000000000");
  const navigate = useNavigate();
  const [fetchData, setFetchData] = useState({
    pnr: "",
    apiId: 0,
    passengerName: {
      title: "",
      firstName: "",
      lastName: "",
      middleName: "",
    },
    ledPaxFullName: "",
    IsFromB2B: true,
  });

  const getSupplierList = async () => {
    const response = await axios.get(
      environment.suppliers,
      environment.headerToken
    );
    console.log(response.data);
    setSuplierList(response.data);
  };

  const _handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      environment.fetchTicketingVendor,
      fetchData,
      environment.headerToken
    );
    if (response) {
      // sessionStorage.setItem("bookData", JSON.stringify(response));
      // console.log(response?.data?.ticketInfo?.uniqueTransID, '@@')
      // window.open(
      //     "/bookedview?utid=" +
      //     response?.data?.ticketInfo?.uniqueTransID + '&sts=Confirmed',
      //     "_blank"
      // );
    }
    console.log(response.data, "@@ response pnr");
    // setSuplierList(response.data)
  };
  console.log(fetchData);
  useEffect(() => {
    getSupplierList();
  }, []);

  const { setLoading, setTicketData, loading } = useAuth();
  const componentRef = useRef();
  let [ticketingList, setTicketingList] = useState([]);
  console.log(ticketingList, "ticketingList0000");
  let [passengerList, setPassengerList] = useState([]);
  let [segmentList, setSegmentList] = useState([]);
  let [basePrice, setBasePrice] = useState(0);
  let [tax, setTax] = useState(0);
  let [ait, setAIT] = useState(0);
  let [discount, setDiscount] = useState(0);
  let [additionalPrice, setAdditionalPrice] = useState(0);
  let [totalPrice, setTotalPrice] = useState(0);
  let [passengerListEdited, setPassengerListEdited] = useState([]);
  let [totalPriceEdited, setTotalPriceEdited] = useState(0);
  let [isFareHide, setIsFareHide] = useState(false);
  const [isRbdHide, setRbdHide] = useState(false);
  console.log(isRbdHide, "checkeditem");
  let [lastTicketTime, setLastTicketTime] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  let [isFareChange, setIsFareChange] = useState(false);
  let [isRBDChange, setIsRBDChange] = useState(false);
  const donwloadRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messageData, setMessageData] = useState({});
  console.log(messageData, "messageData");
  const [btnDisabled, setbtnDisabled] = useState(false);
  const handleMessageUser = async (e) => {
    e.preventDefault();
    if (
      messageData.toEmail === "" ||
      messageData.toEmail === null ||
      messageData.toEmail === undefined
    ) {
      return toast.error("Enter Email then try again.");
    }
    setbtnDisabled(true);
    setIsSending(true);
    setTimeout(() => {}, 1000);
    const element = componentRef.current;
    html2canvas(element, {
      logging: true,
      allowTaint: false,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      quality: 3,
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      var doc = new jsPDF("p", "mm");
      const imgProperties = doc.getImageProperties(imgData);
      var pageHeight = 298;
      var imgWidth = doc.internal.pageSize.getWidth();
      var imgHeight = (imgProperties.height * imgWidth) / imgProperties.width;
      var heightLeft = imgHeight;
      var position = 0;
      doc.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        "",
        "FAST"
      );
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          "",
          "FAST"
        );
        heightLeft -= pageHeight;
      }
      var file = doc.output("datauristring").split(",")[1];
      axios
        .post(environment.sendEmailProposal, {
          ...messageData,
          html: file,
          attactment: "",
          fileName: "Book",
        })
        .then((response) => {
          if (response.status === 200 && response.data) {
            toast.success("Email send successfully.");
            setIsSending(false);
            onClose();
          } else {
            toast.error("Please try again.");
          }
        })
        .finally(() => {
          setbtnDisabled(false);
          setTimeout(() => onClose(), 2000);
        });
    });
  };
  let [agentInfo, setAgentInfo] = useState([]);
  const getAgentData = async () => {
    axios
      .get(environment.agentInfo, environment.headerToken)
      .then((agentRes) => {
        setAgentInfo(agentRes.data);
      })
      .catch((err) => {
        //alert('Invalid login')
      });
  };

  useEffect(() => {
    getAgentData();
  }, []);

  const location = useLocation();
  console.log(ticketingList, "Opened");
  const handleGetList = (e) => {
    e.preventDefault();
    const getTicketingList = async () => {
      // let sendObj = { uniqueTransID: location.search.split("=")[1] };
      const response = await axios.post(
        environment.fetchTicketingVendor,
        fetchData,
        environment.headerToken
      );
      // console.log(response);
      setTicketingList(response.data);
      setLastTicketTime(response.data.ticketInfo?.lastTicketTimeNote);
      console.log(response.data.data);
      // alert(ticketingList[0].uniqueTransID)
      handleGetPassengerList(
        response.data.data[0].passengerIds,
        response.data.data[0].uniqueTransID
      );
      handleGetSegmentList(response.data.data[0].uniqueTransID);
      localStorage.setItem(
        "uniqueTransID",
        JSON.stringify(response.data.data[0].uniqueTransID)
      );
      setBasePrice(response.data.data[0].basePrice);
      setTax(response.data.data[0].tax);
      setAIT(Number(response.data.data[0].basePrice) * 0.003);
      setTotalPrice(response.data.data[0].ticketingPrice);
      setDiscount(response.data.data[0].discount);
      setAdditionalPrice(response.data.data[0].agentAdditionalPrice);
    };
    getTicketingList();
  };

  const handleGetSegmentList = (trid) => {
    const getSegmentList = async () => {
      const response = await axios.get(
        environment.segmentList + "/" + trid,
        environment.headerToken
      );
      setSegmentList(response.data);
      console.log(response.data);
    };
    getSegmentList();
  };

  console.log(segmentList);

  const handleGetPassengerList = (ids, trid) => {
    const getPassengerList = async () => {
      const response = await axios.get(
        environment.passengerListByIds + "/" + ids + "/" + trid,
        environment.headerToken
      );
      passengerList = response.data;
      setPassengerList(response.data);
      let totalPriceTemp = 0;
      response.data.map((item, index) => {
        totalPriceTemp +=
          item.totalPriceEdited > 0 ? item.totalPriceEdited : item.totalPrice;
      });
      setTotalPrice(totalPriceTemp);
      setPassengerListEdited(response.data);
      console.log(response.data);
    };
    getPassengerList();
  };

  const print = () => {
    window.print();
  };

  const refLog =
    ticketingList.ticketInfo?.referenceLog !== undefined
      ? ticketingList.ticketInfo?.referenceLog
      : "{}";
  const Obj = JSON.parse(refLog);
  console.log(Obj, "===========");

  // const [isMailSend, setIsMailSend] = useState(false)
  // console.log(isMailSend, 'isMailSend==========')
  useEffect(() => {
    localStorage.setItem("ismail", JSON.stringify(false));
  }, []);

  const handleGenerateTicket = () => {
    setLoading(true);
    const sendObjTicket = {
      pnr: "044NEV",
      bookingRefNumber: "044NEV",
      priceCodeRef:
        "VExMMjEyNTE5MTQxMC02Mzc4ODk4NTIzMDUwOTg5ODR8MS0wLTB8VVNCYW5nbGE=",
      uniqueTransID: "TLL2125191410",
      itemCodeRef:
        "VExMMjEyNTE5MTQxMC02Mzc4ODk4NTA3OTM5MjQ0NzB8WERPTXxVU0JhbmdsYQ==",
      bookingCodeRef:
        "VExMMjEyNTE5MTQxMC02Mzc4ODk4NTI2ODQ3NDA1MjF8MDQ0TkVWfFVTQmFuZ2xh",
      commission: 0,
    };

    const handelimportTicket = async () => {
      console.log("imortdata");
      let payload = {
        pnr: ticketingList?.ticketInfo?.pnr,
        uniqueTransID: ticketingList?.ticketInfo?.uniqueTransID,
        bookingRefNumber: Obj?.BookingRefNumber,
        apiId: ticketingList?.ticketInfo?.apiId,
        totalPrice: ticketingList?.ticketInfo?.ticketingPrice,
        isPriceDeductionEnable: true,
        passengerName: {
          title: ticketingList?.passengerInfo[0]?.title,
          firstName: ticketingList?.passengerInfo[0]?.first,
          lastName: ticketingList?.passengerInfo[0]?.last,
          middleName: ticketingList?.passengerInfo[0]?.middle,
        },
      };
      await axios
        .post(environment.importPnr, payload, environment.headerToken)
        .then((res) => {
          console.log(res, "importpnr data");
        });
    };
    async function fetchOptions() {
      await axios
        .post(environment.ticketingFlight, Obj, environment.headerToken)
        .then((response) => {
          if (response.data.item2?.isSuccess === true) {
            console.log(response);
            setTicketData(response.data);
            sessionStorage.setItem("ticketData", JSON.stringify(response.data));
            setLoading(false);
            // setIsMailSend(true)
            localStorage.setItem("ismail", JSON.stringify(true));
            navigate("/successticket");
          } else {
            setLoading(false);
            setTicketData(response.data);
            navigate("/processticket");
          }
        });
    }

    if (ticketingList?.ticketInfo?.bookingType === "Import") {
      handelimportTicket();
    } else {
      fetchOptions();
    }
  };

  const handleGetTime = (referenceLog) => {
    setIsLoading(true);
    // alert(referenceLog);
    console.log(referenceLog, "+++++response for referenceLog");
    const getTimeReq = async () => {
      await axios
        .post(
          environment.getLastTicketTime,
          JSON.parse(referenceLog),
          environment.headerToken
        )
        .then((res) => {
          console.log(res.data.item1);
          // console.log(res.data.item1?.remarks)
          if (
            res.data.item1 !== undefined &&
            res.data.item1 !== null &&
            res.data.item1?.lastTicketTime !== null &&
            res.data.item1?.lastTicketTime !== ""
          ) {
            // console.log('SET Ticketing Time');
            setLastTicketTime(res.data.item1?.lastTicketTime);
          } else if (
            res.data.item1 !== undefined &&
            res.data.item1 !== null &&
            res.data.item1?.remarks !== null &&
            res.data.item1?.remarks !== ""
          ) {
            setLastTicketTime(res.data.item1?.remarks);
          } else {
            toast.error("Please try again after five minutes.");
            setIsLoading(false);
          }
        })
        .catch((res) => {
          toast.error("Please try again after five minutes.");
          setIsLoading(false);
        });
    };
    getTimeReq();
  };

  console.log(ticketingList, "+++++");
  sortPassangerType(ticketingList.passengerInfo);
  console.log(sortPassangerType(ticketingList.passengerInfo));

  const handleCancelBook = () => {
    // console.log(Obj);
    setLoading(true);
    async function fetchOptions() {
      await axios
        .post(environment.cancelBooking, Obj, environment.headerToken)
        .then((response) => {
          console.log(response, "++++++");
          if (
            response.data.item1 !== null &&
            response.data.item2?.isSuccess === true &&
            response.data.item1?.isCancel === true
          ) {
            console.log(response, "++++++");
            // setTicketData(response.data);
            // sessionStorage.setItem("ticketData", JSON.stringify(response.data));
            setLoading(false);
            navigate("/cancelbooking");
          } else {
            setLoading(false);
            // setTicketData(response.data);
            // navigate("/processticket");
            $(".modal-backdrop").remove();
            $("body").removeClass("modal-open");
            $("body").removeAttr("style");
            toast.error("Please try again!");
          }
          // console.log(response);
        });
    }
    fetchOptions();
  };

  let newArr = [];
  ticketingList?.segments?.forEach((item) => {
    if (!newArr.includes(item.airlinePNRs)) {
      newArr.push(item.airlinePNRs);
    }
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const element = donwloadRef.current;
    const canvas = await html2canvas(element, {
      logging: true,
      allowTaint: false,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      quality: 4,
      scale: 4,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4", true);
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
    pdf.save("booking_FirstTrip.pdf");
    setIsDownloading(false);
  };

  return (
    <Box>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <ToastContainer position="bottom-right" autoClose={1500} />

      <div className="content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="fw-bold bg-white p-2 my-3 text-center rounded-3 card card-body">
                Ticketing Vendor
              </div>
              <div className="bg-white my-3 p-3 rounded-3 card card-body">
                <form onSubmit={handleGetList}>
                  <div className="row gap-2 mx-3 ">
                    <div className="col-3">
                      <label>Enter Vendor *</label>
                      <Select
                        required
                        placeholder="Select Vendor"
                        onChange={(e) =>
                          setFetchData((old) => ({
                            ...old,
                            apiId: e.target.value,
                          }))
                        }
                      >
                        {supplierList?.map((item) => (
                          <option value={item?.id}>{item.name}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="col-2">
                      <label>Enter PNR *</label>
                      <Input
                        required
                        placeholder="Enter PNR"
                        onChange={(e) =>
                          setFetchData((old) => ({
                            ...old,
                            pnr: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-3">
                      <label>Enter Lead Pax Full Name</label>
                      <Input
                        placeholder="Lead Pax Name"
                        onChange={(e) =>
                          setFetchData((old) => ({
                            ...old,
                            ledPaxFullName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-3">
                      <label></label>
                      <Button
                        type="submit"
                        colorScheme="teal"
                        style={{ marginTop: "30px" }}
                      >
                        Find Booked Ticket
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Booked View */}
          <div className="row">
            {ticketingList?.length === 0 ? (
              <></>
            ) : ticketingList.ticketInfo?.status === "Booked" ? (
              <>
                <div className="content-wrapper search-panel-bg">
                  <section className="content-header"></section>
                  <section className="content">
                    <div className="container mt-3">
                      <div className="row">
                        <div className="col-lg-12">
                          <h4 className="fw-bold text-center bg-white text-dark p-2">
                            Booking Details
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="container mt-3 pb-4 py-2">
                      <div id="ui-view" data-select2-id="ui-view">
                        <div>
                          <div className="card box-shadow">
                            <div className="card-header">
                              <span>
                                <input
                                  className="ms-3"
                                  type={"checkbox"}
                                  onChange={(e) => {
                                    setIsFareHide(e.target.checked);
                                  }}
                                />{" "}
                                Hide Fare
                              </span>
                              <span>
                                <input
                                  className="ms-3"
                                  type={"checkbox"}
                                  onChange={(e) => {
                                    setIsFareChange(e.target.checked);
                                  }}
                                />{" "}
                                Gross Fare
                              </span>

                              <span>
                                <input
                                  className="ms-3"
                                  type={"checkbox"}
                                  onChange={(e) => {
                                    setIsRBDChange(e.target.checked);
                                  }}
                                />{" "}
                                Hide RBD
                              </span>

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
                                <li id="menu-item">
                                  <button
                                    className="btn btn-sm btn-secondary float-right mr-1 d-print-none rounded"
                                    onClick={() => {
                                      onOpen();
                                    }}
                                  >
                                    <span className="me-1">
                                      <Icon
                                        as={MdEmail}
                                        pb="4px"
                                        height={"20px"}
                                      />
                                    </span>
                                    Send Mail
                                  </button>
                                </li>
                                <li id="menu-item">
                                  <button
                                    href="javascript:void(0)"
                                    className="btn btn-sm btn-secondary float-right mr-1 d-print-none rounded"
                                    onClick={handleDownloadPdf}
                                    disabled={isDownloading ? true : false}
                                  >
                                    {isDownloading ? (
                                      <>
                                        <span
                                          class="spinner-border spinner-border-sm"
                                          role="status"
                                          aria-hidden="true"
                                        ></span>{" "}
                                        Downloading
                                      </>
                                    ) : (
                                      <>Download</>
                                    )}
                                  </button>
                                </li>
                              </ul>
                            </div>

                            <ModalForm
                              isOpen={isOpen}
                              onClose={onClose}
                              title={"Compose New Message"}
                            >
                              <Stack spacing={3}>
                                <Input
                                  variant="outline"
                                  onChange={(e) => {
                                    setMessageData({
                                      ...messageData,
                                      [e.target.name]: e.target.value,
                                    });
                                  }}
                                  required
                                  name="toEmail"
                                  placeholder="To"
                                />
                                <Input
                                  variant="outline"
                                  onChange={(e) => {
                                    setMessageData({
                                      ...messageData,
                                      [e.target.name]: e.target.value,
                                    });
                                  }}
                                  placeholder="Subject"
                                  name="subject"
                                  required
                                />
                                <Textarea
                                  placeholder="Message"
                                  required
                                  name="body"
                                  onChange={(e) => {
                                    setMessageData({
                                      ...messageData,
                                      [e.target.name]: e.target.value,
                                    });
                                  }}
                                ></Textarea>
                              </Stack>
                              <Box
                                display="flex"
                                alignItems="end"
                                justifyContent={"end"}
                              >
                                <Button
                                  loadingText="Sending..."
                                  variant="solid"
                                  mt={"2"}
                                  bg={"#703E97"}
                                  color={"white"}
                                  disabled={btnDisabled}
                                  onClick={handleMessageUser}
                                >
                                  Send
                                </Button>
                              </Box>
                            </ModalForm>

                            <div className="card-body" ref={componentRef}>
                              <div className="mx-5 px-5" ref={donwloadRef}>
                                <h4 className="text-center pb-2">E-Book</h4>
                                <table class="table table-borderless table-sm">
                                  <tbody>
                                    <tr>
                                      {/* FIXED COMPANY LOGO */}
                                      {/* CHANGE THIS LATER */}
                                      <td className="text-start">
                                        {ticketingList.ticketInfo?.agentLogo !==
                                        null ? (
                                          <>
                                            <img
                                              alt="img01"
                                              src={
                                                environment.s3URL +
                                                `${ticketingList.ticketInfo?.agentLogo}`
                                              }
                                              style={{ width: "160px" }}
                                              crossOrigin="true"
                                            ></img>
                                          </>
                                        ) : (
                                          <>
                                            <img
                                              alt="img01"
                                              className="p-2"
                                              src={tllLogo}
                                              style={{ width: "160px" }}
                                            ></img>
                                          </>
                                        )}
                                      </td>
                                      <td className="text-end bg-white">
                                        <address>
                                          <span className="fw-bold fs-6">
                                            {agentInfo.name}
                                          </span>
                                          <br />
                                          <div
                                            className="mt-2"
                                            style={{
                                              fontSize: "12px",
                                              lineHeight: "12px",
                                            }}
                                          >
                                            {agentInfo.address}
                                            <br />
                                            <span style={{ fontSize: "8px" }}>
                                              <i class="fas fa-phone fa-rotate-90"></i>
                                            </span>{" "}
                                            Phone: {agentInfo.mobileNo}
                                            <br></br>
                                            <span className="me-1">
                                              <i
                                                class="fa fa-envelope"
                                                aria-hidden="true"
                                              ></i>
                                            </span>{" "}
                                            Email: {agentInfo.email}
                                          </div>
                                        </address>
                                        {/* <address>
          <span className="fw-bold fs-6">
            {agentInfo.name}
          </span>
          <br />
          <div
            className="mt-2"
            style={{
              fontSize: "12px",
              lineHeight: "14px",
            }}
          >
            179 Baizid Road Nasirabad <br />
            Dhaka-1216, Bangladesh<br></br>
            <span style={{ fontSize: "8px" }}>
              <i class="fas fa-phone fa-rotate-90"></i>
            </span>{" "}
            Phone: +8801625987452<br></br>
            <span className="me-1">
              <i
                class="fa fa-envelope"
                aria-hidden="true"
              ></i>
            </span>{" "}
            Email: {agentInfo.email}
          </div>
        </address> */}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table
                                  class="table table-bordered my-2 mb-3 table-sm"
                                  style={{ fontSize: "11px" }}
                                >
                                  <thead>
                                    <tr>
                                      <th
                                        colspan="4"
                                        className="fw-bold py-2 bg-light"
                                      >
                                        {ticketingList.ticketInfo?.status ===
                                        "Booking Cancelled"
                                          ? ticketingList.ticketInfo?.status
                                          : "BOOKING CONFIRMED"}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <th>Booking Date:</th>
                                      <td>
                                        {moment(
                                          ticketingList.ticketInfo?.bookingDate
                                        ).format("DD-MMMM-yyyy")}
                                      </td>
                                      <td className="fw-bold">Booking ID:</td>
                                      <td>
                                        {
                                          ticketingList.ticketInfo
                                            ?.uniqueTransID
                                        }
                                      </td>
                                    </tr>

                                    <tr>
                                      <th>
                                        {ticketingList.ticketInfo?.status ===
                                        "Ticket Ordered"
                                          ? ""
                                          : "Booking"}{" "}
                                        Status:
                                      </th>
                                      <td>
                                        {ticketingList.ticketInfo?.status ===
                                        "Ticket Ordered"
                                          ? "Ticket Processing "
                                          : ticketingList.ticketInfo?.status}
                                      </td>
                                      <td className="fw-bold">Booked By:</td>
                                      <td>
                                        {ticketingList.ticketInfo?.agentName}
                                      </td>
                                    </tr>
                                    <tr>
                                      {ticketingList.ticketInfo?.status ===
                                      "Ticket Ordered" ? (
                                        ""
                                      ) : (
                                        <>
                                          <th>Issue Before:</th>
                                          <td style={{ color: "red" }}>
                                            {lastTicketTime !== "" &&
                                            lastTicketTime !== null &&
                                            lastTicketTime !== undefined ? (
                                              lastTicketTime
                                            ) : (
                                              <>
                                                <a
                                                  href="javascript:void(0)"
                                                  title="Last Ticketing Time"
                                                  onClick={() =>
                                                    handleGetTime(
                                                      ticketingList.ticketInfo
                                                        ?.referenceLog
                                                    )
                                                  }
                                                >
                                                  <Button
                                                    isLoading={isLoading}
                                                    border="2px solid"
                                                    colorScheme="blue"
                                                    variant="outline"
                                                    size="xsm"
                                                    borderRadius="16px"
                                                    p="1"
                                                    m="1"
                                                    // disabled = {click}
                                                  >
                                                    <span
                                                      style={{
                                                        fontSize: "10px",
                                                      }}
                                                    >
                                                      Get Limit
                                                    </span>
                                                  </Button>
                                                </a>
                                              </>
                                            )}
                                          </td>
                                        </>
                                      )}

                                      <td className="fw-bold">PNR</td>
                                      <td>{ticketingList.ticketInfo?.pnr}</td>
                                    </tr>
                                    <tr>
                                      <td className="fw-bold">Airline PNR</td>
                                      <td>
                                        {newArr?.map((item) => {
                                          return <span>{item}</span>;
                                        })}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="table-responsive-sm">
                                  <table
                                    className="table table-bordered table-sm"
                                    style={{ fontSize: "11px" }}
                                  >
                                    <thead>
                                      <tr>
                                        <th
                                          colspan="5"
                                          className="fw-bold py-2 bg-light"
                                        >
                                          PASSENGER DETAILS
                                        </th>
                                      </tr>
                                      <tr className="text-center">
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Gender</th>
                                        <th>DOB</th>
                                        <th>Passport No</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-center">
                                      {ticketingList.passengerInfo?.map(
                                        (item, index) => {
                                          return (
                                            <tr key={index}>
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
                                                {item.passengerType === "ADT"
                                                  ? "Adult"
                                                  : item.passengerType === "CNN"
                                                  ? "Child"
                                                  : item.passengerType === "CHD"
                                                  ? "Child"
                                                  : item.passengerType === "INF"
                                                  ? "Infant"
                                                  : ""}
                                              </td>
                                              <td>{item.gender}</td>
                                              <td>
                                                {item.dateOfBirth === null
                                                  ? "N/A"
                                                  : moment(
                                                      item.dateOfBirth
                                                    ).format("DD-MMMM-yyyy")}
                                              </td>
                                              <td>
                                                {ticketingList?.directions !==
                                                undefined ? (
                                                  <>
                                                    {ticketingList?.directions[0][0]?.segments.map(
                                                      (itm, index) => {
                                                        return (
                                                          <>
                                                            {index === 0 ? (
                                                              <>
                                                                {getCountryCode(
                                                                  itm.from
                                                                ) ===
                                                                  "Bangladesh" &&
                                                                getCountryCode(
                                                                  itm.to
                                                                ) ===
                                                                  "Bangladesh" ? (
                                                                  <>N/A</>
                                                                ) : (
                                                                  <>
                                                                    {item?.documentNumber ===
                                                                    ""
                                                                      ? "N/A"
                                                                      : item?.documentNumber}
                                                                  </>
                                                                )}
                                                              </>
                                                            ) : (
                                                              <></>
                                                            )}
                                                          </>
                                                        );
                                                      }
                                                    )}
                                                  </>
                                                ) : (
                                                  <>
                                                    {ticketingList?.segmentInfo?.map(
                                                      (itm, index) => {
                                                        return (
                                                          <>
                                                            {index === 0 ? (
                                                              <>
                                                                {getCountryCode(
                                                                  itm.origin
                                                                ) ===
                                                                  "Bangladesh" &&
                                                                getCountryCode(
                                                                  itm.destination
                                                                ) ===
                                                                  "Bangladesh" ? (
                                                                  <>N/A</>
                                                                ) : (
                                                                  <>
                                                                    {item?.documentNumber ===
                                                                    ""
                                                                      ? "N/A"
                                                                      : item?.documentNumber}
                                                                  </>
                                                                )}
                                                              </>
                                                            ) : (
                                                              <></>
                                                            )}
                                                          </>
                                                        );
                                                      }
                                                    )}
                                                  </>
                                                )}

                                                {/* {item.documentNumber === ""
                                          ? "N/A"
                                          : item.documentNumber} */}
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="table-responsive-sm">
                                  <table
                                    className="table table-bordered table-sm"
                                    style={{ fontSize: "11px" }}
                                  >
                                    <thead>
                                      <tr>
                                        <th
                                          colspan="8"
                                          className="fw-bold py-2 bg-light"
                                        >
                                          TRAVEL SEGMENTS
                                        </th>
                                      </tr>
                                      <tr className="text-center">
                                        <th>Airline</th>
                                        <th>Flight</th>
                                        <th>Departs</th>
                                        <th>Date/Time</th>
                                        <th>Arrives</th>
                                        <th>Date/Time</th>
                                        <th>Fare Basis</th>
                                        <th>Cabin</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-center">
                                      {ticketingList?.directions ===
                                      undefined ? (
                                        <>
                                          {ticketingList.segments?.map(
                                            (item, index) => {
                                              return (
                                                <>
                                                  <tr>
                                                    <td>
                                                      {
                                                        item.operationCarrierName
                                                      }
                                                    </td>
                                                    <td>
                                                      {item.operationCarrier}-
                                                      {item.flightNumber}
                                                    </td>
                                                    <td>
                                                      {item.origin}
                                                      <br></br>
                                                      <span
                                                        style={{
                                                          fontSize: "12px",
                                                        }}
                                                      >
                                                        {airports
                                                          .filter(
                                                            (f) =>
                                                              f.iata ===
                                                              item.origin
                                                          )
                                                          .map(
                                                            (item) => item.city
                                                          )}
                                                      </span>
                                                    </td>
                                                    <td>
                                                      {moment(
                                                        item.departure
                                                      ).format(
                                                        "DD-MMMM-yyyy HH:mm:ss"
                                                      )}
                                                    </td>
                                                    <td>
                                                      {item.destination}
                                                      <br></br>
                                                      <span
                                                        style={{
                                                          fontSize: "12px",
                                                        }}
                                                      >
                                                        {airports
                                                          .filter(
                                                            (f) =>
                                                              f.iata ===
                                                              item.destination
                                                          )
                                                          .map(
                                                            (item) => item.city
                                                          )}
                                                      </span>
                                                    </td>
                                                    <td>
                                                      {moment(
                                                        item.arrival
                                                      ).format(
                                                        "DD-MMMM-yyyy HH:mm:ss"
                                                      )}
                                                    </td>
                                                    <td>
                                                      {item.fareBasisCode}
                                                    </td>
                                                    <td>
                                                      {item.cabinClass}{" "}
                                                      {isRBDChange === false ? (
                                                        <>
                                                          ({item.bookingCode})
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                </>
                                              );
                                            }
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {ticketingList?.directions[0][0].segments.map(
                                            (item, index) => {
                                              //         (getCountryFomAirport(item.from) !==
                                              // "Bangladesh" ||
                                              // getCountryFomAirport(item.to) !==
                                              //   "Bangladesh") &&
                                              // setIsDomestic(false);
                                              return (
                                                <tr key={index}>
                                                  <td>
                                                    {item.airline}
                                                    <br></br>
                                                    <span
                                                      style={{
                                                        fontSize: "12px",
                                                      }}
                                                    >
                                                      {item.plane[0]}
                                                    </span>
                                                  </td>
                                                  <td>
                                                    {item.airlineCode}-
                                                    {item.flightNumber}
                                                  </td>
                                                  <td>
                                                    {item.from}
                                                    <br></br>
                                                    <span
                                                      style={{
                                                        fontSize: "12px",
                                                      }}
                                                    >
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.from
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}
                                                      <br></br>
                                                      {item.details[0]
                                                        .originTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .originTerminal !==
                                                        "" ? (
                                                        <>
                                                          (Terminal-
                                                          {
                                                            item.details[0]
                                                              .originTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </span>
                                                  </td>
                                                  <td>
                                                    {moment(
                                                      item.departure
                                                    ).format(
                                                      "DD-MMMM-yyyy HH:mm:ss"
                                                    )}
                                                  </td>
                                                  <td>
                                                    {item.to}
                                                    <br></br>
                                                    <span
                                                      style={{
                                                        fontSize: "12px",
                                                      }}
                                                    >
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.to
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}
                                                      <br></br>
                                                      {item.details[0]
                                                        .destinationTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .destinationTerminal !==
                                                        "" ? (
                                                        <>
                                                          (Terminal-
                                                          {
                                                            item.details[0]
                                                              .destinationTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </span>
                                                  </td>
                                                  <td>
                                                    {moment(
                                                      item.arrival
                                                    ).format(
                                                      "DD-MMMM-yyyy HH:mm:ss"
                                                    )}
                                                  </td>
                                                  <td>{item.fareBasisCode}</td>
                                                  <td>
                                                    {" "}
                                                    {item.serviceClass === "Y"
                                                      ? "ECONOMY" +
                                                        " (" +
                                                        item.bookingClass +
                                                        ")"
                                                      : item.serviceClass ===
                                                        "C"
                                                      ? "BUSINESS CLASS" +
                                                        " (" +
                                                        item.bookingClass +
                                                        ")"
                                                      : item.serviceClass +
                                                        " (" +
                                                        item.bookingClass +
                                                        ")"}
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                          {ticketingList?.directions[1] !==
                                            undefined &&
                                          ticketingList?.directions !==
                                            undefined ? (
                                            <>
                                              {ticketingList?.directions[1][0].segments.map(
                                                (item, index) => {
                                                  return (
                                                    <tr key={index}>
                                                      <td>
                                                        {item.airline}
                                                        <br></br>
                                                        <span
                                                          style={{
                                                            fontSize: "12px",
                                                          }}
                                                        >
                                                          {item.plane[0]}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        {item.airlineCode}-
                                                        {item.flightNumber}
                                                      </td>
                                                      <td>
                                                        {item.from}
                                                        <br></br>
                                                        <span
                                                          style={{
                                                            fontSize: "12px",
                                                          }}
                                                        >
                                                          {airports
                                                            .filter(
                                                              (f) =>
                                                                f.iata ===
                                                                item.from
                                                            )
                                                            .map(
                                                              (item) =>
                                                                item.city
                                                            )}
                                                          {item.details[0]
                                                            .originTerminal !==
                                                            null &&
                                                          item.details[0]
                                                            .originTerminal !==
                                                            "" ? (
                                                            <>
                                                              (Terminal-
                                                              {
                                                                item.details[0]
                                                                  .originTerminal
                                                              }
                                                              )
                                                            </>
                                                          ) : (
                                                            <></>
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        {moment(
                                                          item.departure
                                                        ).format(
                                                          "DD-MMMM-yyyy HH:mm:ss"
                                                        )}
                                                      </td>
                                                      <td>
                                                        {item.to}
                                                        <span
                                                          style={{
                                                            fontSize: "12px",
                                                          }}
                                                        >
                                                          {airports
                                                            .filter(
                                                              (f) =>
                                                                f.iata ===
                                                                item.to
                                                            )
                                                            .map(
                                                              (item) =>
                                                                item.city
                                                            )}
                                                          <br></br>
                                                          {item.details[0]
                                                            .destinationTerminal !==
                                                            null &&
                                                          item.details[0]
                                                            .destinationTerminal !==
                                                            "" ? (
                                                            <>
                                                              (Terminal-
                                                              {
                                                                item.details[0]
                                                                  .destinationTerminal
                                                              }
                                                              )
                                                            </>
                                                          ) : (
                                                            <></>
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        {moment(
                                                          item.arrival
                                                        ).format(
                                                          "DD-MMMM-yyyy HH:mm:ss"
                                                        )}
                                                      </td>
                                                      <td>
                                                        {item.fareBasisCode}
                                                      </td>
                                                      <td>
                                                        {" "}
                                                        {item.serviceClass ===
                                                        "Y"
                                                          ? "ECONOMY" +
                                                            " (" +
                                                            item.bookingClass +
                                                            ")"
                                                          : item.serviceClass ===
                                                            "C"
                                                          ? "BUSINESS CLASS" +
                                                            " (" +
                                                            item.bookingClass +
                                                            ")"
                                                          : item.serviceClass +
                                                            " (" +
                                                            item.bookingClass +
                                                            ")"}
                                                      </td>
                                                    </tr>
                                                  );
                                                }
                                              )}
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </>
                                      )}
                                    </tbody>
                                  </table>
                                </div>

                                {isFareHide === false ? (
                                  <>
                                    <div className="table-responsive-sm">
                                      <table
                                        className="table table-bordered table-sm"
                                        style={{ fontSize: "11px" }}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              colspan="7"
                                              className="fw-bold py-2 bg-light"
                                            >
                                              FARE DETAILS
                                            </th>
                                          </tr>
                                          <tr className="text-end">
                                            <th className="text-center">
                                              Type
                                            </th>
                                            <th>Base</th>
                                            <th>Tax</th>
                                            {isFareChange === false && (
                                              <th>Commission</th>
                                            )}
                                            <th>AIT</th>
                                            <th>Pax</th>
                                            <th>Total Pax Fare</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-end">
                                          {ticketingList.fareBreakdown?.map(
                                            (item, index) => {
                                              return (
                                                <>
                                                  <tr>
                                                    <td className="text-center">
                                                      {getPassengerType(
                                                        item.passengerType,
                                                        ticketingList.fareBreakdown
                                                      )}
                                                    </td>
                                                    <td>
                                                      {item.basePrice.toLocaleString(
                                                        "en-US"
                                                      )}
                                                    </td>
                                                    <td>
                                                      {item.tax.toLocaleString(
                                                        "en-US"
                                                      )}
                                                    </td>
                                                    {/* <td>{item.discount.toLocaleString("en-US")}</td> */}

                                                    {isFareChange === false && (
                                                      <td>
                                                        {item.discount.toLocaleString(
                                                          "en-US"
                                                        )}
                                                      </td>
                                                    )}
                                                    <td>
                                                      {item.ait.toLocaleString(
                                                        "en-US"
                                                      )}
                                                    </td>
                                                    <td>
                                                      {item.passengerCount}
                                                    </td>
                                                    <td>
                                                      {item.currencyName}{" "}
                                                      {isFareChange === false
                                                        ? (
                                                            item.totalPrice *
                                                            item.passengerCount
                                                          ).toLocaleString(
                                                            "en-US"
                                                          )
                                                        : (
                                                            (item.totalPrice -
                                                              item.discount) *
                                                            item.passengerCount
                                                          ).toLocaleString(
                                                            "en-US"
                                                          )}
                                                    </td>
                                                  </tr>
                                                </>
                                              );
                                            }
                                          )}
                                          <tr className="fw-bold">
                                            <td
                                              colSpan={
                                                isFareChange === false ? 5 : 4
                                              }
                                              className="border-none"
                                            ></td>
                                            <td>Grand Total</td>
                                            <td>
                                              {ticketingList.passengerInfo !==
                                              undefined
                                                ? ticketingList.passengerInfo[0]
                                                    ?.currencyName
                                                : ""}{" "}
                                              {/* {ticketingList.passengerInfo[0]?.currencyName}{" "} */}
                                              {/* {ticketingList.ticketInfo?.ticketingPrice.toLocaleString(
                                    "en-US"
                                  )} */}
                                              {/* {
                                    sumRating(ticketingList.fareBreakdown).toLocaleString("en-US")
                                  } */}
                                              {isFareChange === false
                                                ? sumRating(
                                                    ticketingList.fareBreakdown
                                                  )?.toLocaleString("en-US")
                                                : sumRatingGross(
                                                    ticketingList.fareBreakdown
                                                  )?.toLocaleString("en-US")}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}

                                <div className="table-responsive-sm">
                                  <table
                                    className="table table-bordered table-sm"
                                    style={{ fontSize: "11px" }}
                                  >
                                    <thead>
                                      <tr>
                                        <th
                                          colspan="3"
                                          className="fw-bold py-2 bg-light"
                                        >
                                          CONTACT DETAILS
                                        </th>
                                      </tr>
                                      <tr className="text-center">
                                        <th>DEPARTS</th>
                                        <th>Phone Number</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-center">
                                      {ticketingList.passengerInfo?.map(
                                        (item, index) => {
                                          return (
                                            <>
                                              {index === 0 ? (
                                                <>
                                                  <tr key={index}>
                                                    <td>
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata ===
                                                            ticketingList
                                                              .segments[0]
                                                              ?.origin
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}
                                                      {/* {bookData.data?.item1.flightInfo.dirrections[0][0].from} */}
                                                    </td>
                                                    <td>
                                                      {item.phoneCountryCode +
                                                        item.phone}{" "}
                                                    </td>
                                                  </tr>
                                                  {/* <tr key={index}>
                                          <td>
                                            {item.cityName} (Optional)
                                          </td>

                                          <td>
                                            {item.phoneCountryCode + item.phone}{" "}
                                          </td>
                                        </tr> */}
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                            </>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>

                            {ticketingList.ticketInfo?.status ===
                              "Booking Cancelled" ||
                            ticketingList.ticketInfo?.status ===
                              "Ticket Cancelled" ? (
                              <></>
                            ) : (
                              <>
                                <div className="container mt-3">
                                  <div className="row">
                                    <div className="col-lg-12 text-center">
                                      {ticketingList.ticketInfo?.status ===
                                        "Booked" && (
                                        <button
                                          className="btn button-color text-white w-25 fw-bold btn-sm rounded"
                                          onClick={handleGenerateTicket}
                                        >
                                          Generate Ticket
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="pb-5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </>
            ) : (
              <div> Error</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </Box>
  );
};

export default TicketingVendor;
