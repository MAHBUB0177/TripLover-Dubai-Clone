import {
  Box,
  Button,
  Center,
  Icon,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import html2canvas from "html2canvas";
import produce from "immer";
import jsPDF from "jspdf";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdEmail } from "react-icons/md";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { toast, ToastContainer } from "react-toastify";
import tllLogo from "../../../src/images/logo/logo-combined.png";
import {
  checkOperationCarrier,
  getPassengerType,
  preventNegativeValues,
  sortAndGroup,
  sortAndGroupExtra,
  sumAdditinalPrice,
  sumRatingForPassengerTicket,
  sumRatingForPassengerTicketGross,
} from "../../common/functions";
import ModalForm from "../../common/modalForm";
import airports from "../../JSON/airports.json";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import "./Ticket.css";
import {
  getTicketData,
  getUserAllInfo,
  originalTicket,
  sendEmailProposal,
  sendEmailSuccessTicket,
  updateBookingFareBreakdown,
} from "../../common/allApi";
import ImageComponentTicket from "../../common/ImageComponentTicket";
import ImageComponentForAgent from "../../common/ImageComponentForAgent";
import { FaRecycle } from "react-icons/fa";
import usePdf from "../../hooks/usePdfDownloader";
import OriginalPdfBS from "./view";
import OriginalPdf2A from "./airastraView";
import { environment } from "../SharePages/Utility/environment";
import { SiStarlingbank } from "react-icons/si";

const Ticket = () => {
  let [ticketingList, setTicketingList] = useState([]);
  let [ticketingListReturn, setTicketingListReturn] = useState({});
  let [passengerList, setPassengerList] = useState([]);
  const [selectPassenger, setSelectPassenger] = useState([]);
  const [selectPassengerReturn, setSelectPassengerReturn] = useState([]);
  const [loading, setLoading] = useState(false);
  let [basePrice, setBasePrice] = useState(0);
  let [tax, setTax] = useState(0);
  let [ait, setAIT] = useState(0);
  let [discount, setDiscount] = useState(0);
  let [additionalPrice, setAdditionalPrice] = useState(0);
  let [totalPrice, setTotalPrice] = useState(0);
  let [passengerListEdited, setPassengerListEdited] = useState([]);
  let [totalPriceEdited, setTotalPriceEdited] = useState(0);
  let [agentInfo, setAgentInfo] = useState([]);
  let s3URL = "https://fstuploaddocument.s3.ap-southeast-1.amazonaws.com/";
  let staticURL = "wwwroot/Uploads/Support/";
  const [loader, setLoader] = useState(false);
  // let [totalFare,setTotalFare]=useState(0);
  const [isAgentInfo, setIsAgentInfo] = useState(false);
  const [contactInfo, setContactInfo] = useState(false);

  const [journeyType, setJourneyType] = useState("");
  const [checkStatus, setCheckStatus] = useState("");
  const ticketData = JSON.parse(sessionStorage.getItem("ticketData"));

  const navigate = useNavigate();

  //manual mail send option:
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messageData, setMessageData] = useState({});
  const [btnDisabled, setbtnDisabled] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchParams] = useSearchParams();
  const componentRef = useRef();
  const componentRefCombo = useRef();
  const componentRefForUnselect = useRef();
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
    componentRef.current.style.width = "1085px";
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
      componentRef.current.style.width = "auto";
      sendEmailProposal({
        ...messageData,
        html: file,
        attactment: "",
        fileName: "Ticket",
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

  const totalextraServicePnrData = ticketingList?.serviceCharge?.reduce(
    (total, service) => {
      return total + service.b2BServiceCharge ?? 0;
    },
    0
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const _successTicketMail = async () => {
    {
      donwloadRef.current.style.width = "1085px";
      const element = await donwloadRef.current;
      const canvas = await html2canvas(element, {
        logging: true,
        allowTaint: false,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        quality: 1,
        scale: 4,
      });
      const data = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", [1400, 930], true);
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
      var file = pdf.output("datauristring").split(",")[1];
      setIsDownloading(false);
      await sendEmailSuccessTicket({ base64String: file ?? "" }).then(
        (response) => {}
      );
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const getAgentInfo = async () => {
    const response = await getUserAllInfo();
    setAgentInfo(response.data);
    sessionStorage.setItem("agentBalance", response.data.currentBalance);
  };
  const location = useLocation();
  const handleGetList = (utid, sts) => {
    setLoader(true);
    const getTicketingList = async () => {
      let sendObj = location.search.split("=")[1];
      const response = await getTicketData(utid, sts);
      setIsFareHide(
        response?.data?.segments[0].operationCarrier === "6E" ? true : false
      );
      if (response.data?.comboSegmentInfo?.length > 0) {
        setJourneyType(
          response.data?.comboSegmentInfo?.findIndex(
            (item) => item.uniqueTransID === searchParams.get("utid")
          ) === 0
            ? "ONWARD"
            : "RETURN"
        );
        if (
          response.data?.comboSegmentInfo?.findIndex(
            (item) => item.uniqueTransID === searchParams.get("utid")
          ) === 0
        ) {
          setSelectPassenger(response.data?.passengerInfo);
          setTicketingList(response.data);
          handleGetListReturn(
            response.data?.comboSegmentInfo[1]?.uniqueTransID,
            searchParams.get("sts")
          );
        } else {
          setTicketingListReturn(response.data);
          setSelectPassengerReturn(response.data?.passengerInfo);
          handleGetListReturn(
            response.data?.comboSegmentInfo[0]?.uniqueTransID,
            searchParams.get("sts")
          );
        }
      } else {
        setJourneyType("ONWARD");
        setTicketingList(response.data);
        setSelectPassenger(response.data?.passengerInfo);
        setPassengerListEdited(response.data.fareBreakdown);
      }

      setBasePrice(response?.data[0]?.basePrice);
      setTax(response?.data[0]?.tax);
      setAIT(Number(response?.data[0]?.basePrice) * 0.003);
      setTotalPrice(response?.data[0]?.ticketingPrice);
      setDiscount(response?.data[0]?.discount);
      setAdditionalPrice(response?.data[0]?.agentAdditionalPrice);
      setLoader(false);
      setTimeout(() => {
        if (JSON.parse(localStorage.getItem("ismail"))) {
          _successTicketMail();
          localStorage.setItem("ismail", JSON.stringify(false));
        }
      }, 1000);
    };
    getTicketingList();
  };

  const handleGetListReturn = (utid, sts) => {
    setLoader(true);
    const getTicketingList = async () => {
      let sendObj = location.search.split("=")[1];
      const response = await getTicketData(utid, sts);
      setIsFareHide(
        response?.data?.segments[0].operationCarrier === "6E" ? true : false
      );
      if (
        response.data?.comboSegmentInfo?.findIndex(
          (item) => item.uniqueTransID === searchParams.get("utid")
        ) === 0
      ) {
        // setPassengerListEdited(response.data.fareBreakdown)
        setTicketingListReturn(response.data);
        setSelectPassengerReturn(response.data.passengerInfo);
      } else {
        setTicketingList(response.data);
        setSelectPassenger(response.data.passengerInfo);
      }

      setBasePrice(response?.data[0]?.basePrice);
      setTax(response?.data[0]?.tax);
      setAIT(Number(response?.data[0]?.basePrice) * 0.003);
      setTotalPrice(response?.data[0]?.ticketingPrice);
      setDiscount(response?.data[0]?.discount);
      setAdditionalPrice(response?.data[0]?.agentAdditionalPrice);
      setLoader(false);
      setTimeout(() => {
        if (JSON.parse(localStorage.getItem("ismail"))) {
          _successTicketMail();

          localStorage.setItem("ismail", JSON.stringify(false));
        }
      }, 1000);
    };

    getTicketingList();
  };
  const handleSubmit = () => {
    setLoading(true);
    const postPassengerList = async () => {
      const response = await updateBookingFareBreakdown(passengerListEdited);
      if (response.data > 0) {
        toast.success("Price updated successfully..");
        handleGetList(searchParams.get("utid"), searchParams.get("sts"));
        // setPassengerListEdited([])
        document.getElementById("closeBtn").click();
      } else {
        toast.error("Price not updated..");
      }
      setLoading(false);
    };
    postPassengerList();
  };

  let [isFareHide, setIsFareHide] = useState(false);
  let [isFareChange, setIsFareChange] = useState(true);
  const print = () => {
    window.print();
  };

  // useEffect(() => {
  //   if (
  //     ticketingList?.comboSegmentInfo?.findIndex(
  //       (item) => item.uniqueTransID === searchParams.get("utid")
  //     ) === 0
  //   ) {
  //     setPassengerListEdited(ticketingList?.fareBreakdown);
  //   } else {
  //     setPassengerListEdited(ticketingListReturn?.fareBreakdown);
  //   }
  // }, [ticketingList]);

  useEffect(() => {
    setPassengerListEdited([]);
    if (journeyType === "ONWARD") {
      setPassengerListEdited(ticketingList?.fareBreakdown);
      if (unSelectPassenger?.length > 0) {
        const result = ticketingList?.passengerInfo.filter(
          (item) => !unSelectPassenger.some((item2) => item2.id === item.id)
        );
        setSelectPassenger(result);
      } else {
        setSelectPassenger(ticketingList?.passengerInfo);
      }
    }
    if (journeyType === "RETURN") {
      setPassengerListEdited(ticketingListReturn?.fareBreakdown);
      if (unSelectPassengerReturn?.length > 0) {
        const result = ticketingListReturn?.passengerInfo.filter(
          (item) =>
            !unSelectPassengerReturn.some((item2) => item2.id === item.id)
        );
        setSelectPassengerReturn(result);
      } else {
        setSelectPassengerReturn(ticketingListReturn?.passengerInfo);
      }
    }
  }, [journeyType, ticketingList, ticketingListReturn]);

  const finalSegment = sortAndGroup(ticketingList?.segments);
  const finalSegmentReturn = sortAndGroup(ticketingListReturn?.segments);

  const donwloadRef = useRef();
  const donwloadRefUnSelect = useRef();
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    donwloadRef.current.style.width = "1085px";
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
    pdf.save("ticket_Triplover.pdf");
    donwloadRef.current.style.width = "auto";
    setIsDownloading(false);
  };

  const [isDownloadingUnSelect, setIsDownloadingUnSelect] = useState(false);
  const handleDownloadPdfUnselect = async () => {
    setIsDownloadingUnSelect(true);
    donwloadRefUnSelect.current.style.width = "1085px";
    const element = donwloadRefUnSelect.current;
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
    pdf.save("ticket_Triplover.pdf");
    donwloadRefUnSelect.current.style.width = "auto";
    setIsDownloadingUnSelect(false);
  };

  const extraServices = sortAndGroupExtra(
    ticketingList?.extraServices && ticketingList?.extraServices
  );
  const total =
    ticketingList?.extraServices
      ?.flat()
      ?.reduce((sum, service) => sum + service.price, 0) ?? 0;

  const [originalPDFFareData, setOriginalPDFFareData] = useState(null);
  const [originalPDFFareData1, setOriginalPDFFareData1] = useState(null);
  const [originalPDFFareData2, setOriginalPDFFareData2] = useState(null);

  const orginialPdfData = async () => {
    try {
      const response = await originalTicket(searchParams.get("utid"));
      setOriginalPDFFareData(response?.data?.item1);
    } catch (error) {
      console.log(error);
    }
  };

  const { pdfRef, isPdfGenerating, downloadPdf } = usePdf({
    options: { margin: [20, 20, 20, 20] },
    footerContent:
      ticketingList?.segments?.[0]?.operationCarrier === "BS" &&
      "Us­Bangla Airlines: 77, Sohrawardi Avenue, Baridhara Diplomatic Zone, Dhaka 1212, Bangladesh | E­mail: info@usbair.com | Hotline: 13605 | www.usbair.com",
  });

  useEffect(() => {
    handleGetList(searchParams.get("utid"), searchParams.get("sts"));

    getAgentInfo();
    // orginialPdfData();
  }, [searchParams]);

  const [unSelectPassenger, setUnselectPassenger] = useState([]);
  const [unSelectPassengerReturn, setUnselectPassengerReturn] = useState([]);
  const handleCheckboxChange = async (item) => {
    const isSelected = selectPassenger.includes(item);
    if (isSelected && selectPassenger.length === 1) {
      return toast.error("All passenger can not be unSelected");
    }
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

  const handleCheckboxChangeReturn = async (item) => {
    const isSelected = selectPassengerReturn.includes(item);
    if (isSelected && selectPassengerReturn.length === 1) {
      return toast.error("All passenger can not be unSelected");
    }
    const newSelectedPassengers = isSelected
      ? selectPassengerReturn.filter(
          (passenger) => passenger.ticketNumbers !== item.ticketNumbers
        )
      : [...selectPassengerReturn, item];
    setSelectPassengerReturn(newSelectedPassengers);
    const isUnSelected = unSelectPassengerReturn.includes(item);
    const newUnSelectedPassengers = isUnSelected
      ? unSelectPassengerReturn.filter(
          (passenger) => passenger.ticketNumbers !== item.ticketNumbers
        )
      : [...unSelectPassengerReturn, item];
    setUnselectPassengerReturn(newUnSelectedPassengers);
  };

  useEffect(() => {
    const fetchOriginalPdfData = async () => {
      try {
        if (ticketingList?.comboSegmentInfo?.length > 0) {
          if (
            ticketingList?.comboSegmentInfo.some(
              (item) => item.platingCarrier === "BS"
            )
          ) {
            const response = await originalTicket(
              ticketingList?.comboSegmentInfo.find(
                (item) => item.platingCarrier === "BS"
              ).uniqueTransID
            );
            setOriginalPDFFareData1(response?.data?.item1);
          }
          if (
            ticketingList?.comboSegmentInfo.some(
              (item) => item.platingCarrier === "2A"
            )
          ) {
            const response = await originalTicket(
              ticketingList?.comboSegmentInfo.find(
                (item) => item.platingCarrier === "2A"
              ).uniqueTransID
            );
            setOriginalPDFFareData2(response?.data?.item1);
          }
        } else {
          const response = await originalTicket(searchParams.get("utid"));
          setOriginalPDFFareData(response?.data?.item1);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchOriginalPdfData();
  }, [ticketingList]);

  console.log(originalPDFFareData1, "fsdfdsfsdfd1");
  console.log(originalPDFFareData2, "fsdfdsfsdfd2");
  const isValid =
    ticketingList &&
    ticketingList?.comboSegmentInfo?.every(
      (item) => item.platingCarrier === "BS" || item.platingCarrier === "2A"
    );

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <ToastContainer position="bottom-right" autoClose={1500} />
        <section className="content">
          {loader ? (
            <>
              <Center w="100%" py="200px">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="red.500"
                  size="xl"
                />
              </Center>
            </>
          ) : (
            <>
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
                                <th>Passenger Type</th>
                                <th>Ticket Number</th>
                              </tr>
                            </thead>
                            {journeyType === "ONWARD" ? (
                              <tbody>
                                {ticketingList.passengerInfo?.length > 0 &&
                                  ticketingList.passengerInfo?.map(
                                    (item, index) => (
                                      <tr key={index} className="border-none">
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <input
                                              type="checkbox"
                                              checked={selectPassenger.includes(
                                                item
                                              )}
                                              onChange={() =>
                                                handleCheckboxChange(item)
                                              }
                                            />
                                          </div>
                                        </td>

                                        <td>{item.fullName}</td>
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
                                        <td>{item.ticketNumbers}</td>
                                      </tr>
                                    )
                                  )}
                              </tbody>
                            ) : (
                              <tbody>
                                {ticketingListReturn.passengerInfo?.length >
                                  0 &&
                                  ticketingListReturn.passengerInfo?.map(
                                    (item, index) => (
                                      <tr key={index} className="border-none">
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <input
                                              type="checkbox"
                                              checked={selectPassengerReturn.includes(
                                                item
                                              )}
                                              onChange={() =>
                                                handleCheckboxChangeReturn(item)
                                              }
                                            />
                                          </div>
                                        </td>

                                        <td>{item.fullName}</td>
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
                                        <td>{item.ticketNumbers}</td>
                                      </tr>
                                    )
                                  )}
                              </tbody>
                            )}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container mt-3">
                <div className="row">
                  <div className="col-lg-12">
                    <h4 className="fw-bold text-center bg-white text-dark p-2">
                      Ticket Details
                    </h4>
                    {/* <a className='btn btn-warning' href='/queues'>Back to List</a> */}
                  </div>
                </div>
              </div>

              {ticketingList?.ticketInfo?.status && (
                <div className="container mt-3 py-5 pb-5">
                  <div id="ui-view" data-select2-id="ui-view">
                    <div>
                      <div className="card box-shadow">
                        <div
                          className={
                            ticketingList?.comboSegmentInfo?.length > 0
                              ? "d-flex justify-content-between align-items-center"
                              : "d-flex justify-content-end align-items-center"
                          }
                        >
                          {ticketingList?.comboSegmentInfo?.length > 0 && (
                            <div
                              className="d-flex align-items-center justify-content-start"
                              style={{
                                // height: "60px",
                                // width: "220px",
                                borderEndEndRadius: "13px",
                                backgroundColor: "#068b9f3b",
                              }}
                            >
                              <div className="form-check form-check-inline border-radius mx-2">
                                <input
                                  className="form-check-input"
                                  name="inlineFareRadioOptions"
                                  id="inlineFareRadio1"
                                  type="radio"
                                  style={{
                                    border: "2px solid #ed7f22",
                                    transition: "all 0.3s ease",
                                    cursor: "pointer",
                                    backgroundColor:
                                      journeyType === "ONWARD" && "#ed7f22",
                                    appearance: "none",
                                  }}
                                  value="ONWARD"
                                  onClick={() => setJourneyType("ONWARD")}
                                  checked={journeyType === "ONWARD" && true}
                                />
                                <label
                                  className="form-check-label fw-bold"
                                  for="inlineFareRadio1"
                                  style={{
                                    color:
                                      journeyType === "ONWARD"
                                        ? "#7c04c0"
                                        : "#1a202c",
                                  }}
                                >
                                  <div className="p-2 d-flex justify-content-center align-items-center gap-3">
                                    <img
                                      src={
                                        environment.s3ArliensImage +
                                        `${ticketingList?.comboSegmentInfo[0]?.platingCarrier}.png`
                                      }
                                      alt=""
                                      width="30px"
                                      height="30px"
                                    ></img>
                                    <div>
                                      <p>
                                        {
                                          ticketingList?.comboSegmentInfo[0]
                                            ?.routes
                                        }
                                      </p>
                                      <p style={{ fontSize: "10px" }}>
                                        {moment(
                                          ticketingList?.comboSegmentInfo[0]
                                            ?.flightDate
                                        ).format("ddd, DD MMM,YY")}
                                      </p>
                                      <p>
                                        AED{" "}
                                        {ticketingList?.comboSegmentInfo[0]?.totalPriceSelling?.toLocaleString(
                                          "en-US"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </label>
                              </div>
                              <div className="form-check form-check-inline border-radius">
                                <input
                                  className="form-check-input"
                                  name="inlineFareRadioOptions"
                                  id="inlineFareRadio2"
                                  type="radio"
                                  style={{
                                    border: "2px solid #ed7f22",
                                    color: "#ed7f22",
                                    transition: "all 0.3s ease",
                                    backgroundColor:
                                      journeyType === "RETURN" && "#ed7f22",
                                    cursor: "pointer",
                                  }}
                                  value="RETURN"
                                  onClick={() => {
                                    setJourneyType("RETURN");
                                  }}
                                  checked={journeyType === "RETURN" && true}
                                />
                                <label
                                  className="form-check-label fw-bold"
                                  for="inlineFareRadio2"
                                  style={{
                                    color:
                                      journeyType === "RETURN"
                                        ? "#7c04c0"
                                        : "#1a202c",
                                  }}
                                >
                                  <div className="p-2 d-flex justify-content-center align-items-center gap-3">
                                    <img
                                      src={
                                        environment.s3ArliensImage +
                                        `${ticketingList?.comboSegmentInfo[1]?.platingCarrier}.png`
                                      }
                                      alt=""
                                      width="30px"
                                      height="30px"
                                    ></img>
                                    <div>
                                      <p>
                                        {
                                          ticketingList?.comboSegmentInfo[1]
                                            ?.routes
                                        }
                                      </p>
                                      <p style={{ fontSize: "10px" }}>
                                        {moment(
                                          ticketingList?.comboSegmentInfo[1]
                                            ?.flightDate
                                        ).format("ddd, DD MMM,YY")}
                                      </p>
                                      <p>
                                        AED{" "}
                                        {ticketingList?.comboSegmentInfo[1]?.totalPriceSelling?.toLocaleString(
                                          "en-US"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            </div>
                          )}

                          <div
                            style={{
                              width: "auto",
                              borderEndStartRadius: "13px",
                              // backgroundColor: "#068b9f3b",
                              padding: "10px",
                              // height: "60px",
                            }}
                          >
                            <ReactToPrint
                              trigger={() => (
                                <button className="btn button-color text-white float-right mr-1 d-print-none border-radius">
                                  <span className="me-1">
                                    <i className="fa fa-print"></i>
                                  </span>
                                  Print
                                </button>
                              )}
                              content={() =>
                                ticketingList?.comboSegmentInfo?.length > 0
                                  ? componentRefCombo.current
                                  : componentRef.current
                              }
                            />
                            <a
                              href="javascript:void(0)"
                              className="btn button-color text-white float-right mr-1 d-print-none border-radius"
                              data-bs-toggle="modal"
                              data-bs-target="#priceModal"
                            >
                              Edit Price
                            </a>

                            <button
                              className="btn button-color text-white float-right mr-1 d-print-none border-radius"
                              onClick={() => {
                                onOpen();
                              }}
                            >
                              <span className="me-1">
                                <Icon as={MdEmail} pb="4px" height={"20px"} />
                              </span>
                              Send Mail
                            </button>
                            {ticketingList?.ticketInfo?.bookingType ===
                              "Online" && (
                              <>
                                {checkOperationCarrier(
                                  ticketingList?.segments
                                ) &&
                                  originalPDFFareData && (
                                    <button
                                      href="javascript:void(0)"
                                      className="btn button-color text-white float-right mr-1 d-print-none border-radius"
                                      onClick={() =>
                                        downloadPdf(
                                          `${ticketingList?.ticketInfo?.pnr}`
                                        )
                                      }
                                      disabled={isPdfGenerating ? true : false}
                                    >
                                      {isPdfGenerating ? (
                                        <>
                                          <span
                                            class="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                          ></span>{" "}
                                          Downloading
                                        </>
                                      ) : (
                                        <>Airline PDF</>
                                      )}
                                    </button>
                                  )}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="card-header">
                          <span>
                            <input
                              className="ms-3"
                              type={"checkbox"}
                              checked={isFareHide}
                              onChange={(e) => {
                                setIsFareHide(e.target.checked);
                              }}
                            />{" "}
                            Hide Fare
                          </span>
                          <span>
                            <input
                              className="ms-3"
                              type="checkbox"
                              checked={isFareChange}
                              onChange={(e) => {
                                setIsFareChange(() => !isFareChange);
                              }}
                            />{" "}
                            Gross Fare
                          </span>

                          <span>
                            <input
                              className="ms-3"
                              type="checkbox"
                              onChange={(e) => {
                                setIsAgentInfo(() => e.target.checked);
                              }}
                            />{" "}
                            Hide Agent Info
                          </span>

                          <span>
                            <input
                              className="ms-3"
                              type="checkbox"
                              onChange={(e) => {
                                setContactInfo(() => e.target.checked);
                              }}
                            />{" "}
                            Hide Contact Info
                          </span>
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
                              className="border-radius"
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
                              bg={"#7c04c0"}
                              color={"white"}
                              disabled={btnDisabled === true ? true : false}
                              onClick={handleMessageUser}
                            >
                              Send
                            </Button>
                          </Box>
                        </ModalForm>

                        <div>
                          <div className="card-body" ref={componentRef}>
                            <div
                              className="px-lg-5 px-md-5 px-sm-1 p-3"
                              ref={donwloadRef}
                            >
                              <h4 className="text-center pb-2">E-Ticket</h4>

                              {!isAgentInfo && (
                                <div className="table-responsive mt-2">
                                  <table class="table table-borderless table-sm">
                                    <tbody>
                                      <tr>
                                        {/* FIXED COMPANY LOGO */}
                                        {/* CHANGE THIS LATER */}
                                        <td className="text-start">
                                          {ticketingList.ticketInfo
                                            ?.agentLogo !== null ? (
                                            <>
                                              {/* <img
                                  alt="img01"
                                  src={
                                    environment.s3URL +
                                    `${ticketingList.ticketInfo?.agentLogo}`
                                  }
                                  crossOrigin="true"
                                  style={{ width: "160px" }}
                                ></img> */}
                                              <ImageComponentForAgent
                                                logo={
                                                  ticketingList.ticketInfo
                                                    ?.agentLogo
                                                }
                                              />
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
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {journeyType === "ONWARD" ? (
                                <Box
                                  display={"flex"}
                                  justifyContent={"space-between"}
                                  flexWrap={"wrap"}
                                  style={{ fontSize: "14px" }}
                                >
                                  <div>
                                    <br></br>
                                    <Text>
                                      Booking ID :{" "}
                                      <span className="fw-bold">
                                        {
                                          ticketingList.ticketInfo
                                            ?.uniqueTransID
                                        }
                                      </span>
                                    </Text>
                                  </div>

                                  <div>
                                    <Text>
                                      GDS PNR :{" "}
                                      <span className="fw-bold">
                                        {ticketingList.ticketInfo?.pnr}
                                      </span>
                                    </Text>
                                    <Text>
                                      Airline PNR:{" "}
                                      <span className="fw-bold">
                                        {ticketingList.ticketInfo
                                          ?.airlinePNRs === "" ||
                                        ticketingList.ticketInfo
                                          ?.airlinePNRs === null
                                          ? ticketingList.ticketInfo?.pnr
                                          : ticketingList.ticketInfo
                                              ?.airlinePNRs}
                                      </span>
                                    </Text>
                                  </div>
                                </Box>
                              ) : (
                                <Box
                                  display={"flex"}
                                  justifyContent={"space-between"}
                                  flexWrap={"wrap"}
                                  style={{ fontSize: "14px" }}
                                >
                                  <div>
                                    <br></br>
                                    <Text>
                                      Booking ID :{" "}
                                      <span className="fw-bold">
                                        {
                                          ticketingListReturn.ticketInfo
                                            ?.uniqueTransID
                                        }
                                      </span>
                                    </Text>
                                  </div>

                                  <div>
                                    <Text>
                                      GDS PNR :{" "}
                                      <span className="fw-bold">
                                        {ticketingListReturn.ticketInfo?.pnr}
                                      </span>
                                    </Text>
                                    <Text>
                                      Airline PNR:{" "}
                                      <span className="fw-bold">
                                        {ticketingListReturn.ticketInfo
                                          ?.airlinePNRs === "" ||
                                        ticketingListReturn.ticketInfo
                                          ?.airlinePNRs === null
                                          ? ticketingListReturn.ticketInfo?.pnr
                                          : ticketingListReturn.ticketInfo
                                              ?.airlinePNRs}
                                      </span>
                                    </Text>
                                  </div>
                                </Box>
                              )}

                              <div className="table-responsive mt-2">
                                <table
                                  class="table table-bordered table-sm mt-1"
                                  style={{ fontSize: "14px" }}
                                >
                                  <thead>
                                    <tr>
                                      <th
                                        colspan="5"
                                        className="fw-bold py-2 bg-light"
                                      >
                                        Passenger Information
                                      </th>
                                    </tr>
                                    <tr className="text-center">
                                      <th className="text-start">Name</th>
                                      <th>Type</th>
                                      <th>E-Ticket Number</th>
                                      {/* <th>Booking ID</th> */}
                                      <th>Ticket Issue Date</th>
                                    </tr>
                                  </thead>
                                  {journeyType === "ONWARD" ? (
                                    <tbody>
                                      {ticketingList.passengerInfo?.map(
                                        (item, index) => {
                                          if (selectPassenger.includes(item)) {
                                            return (
                                              <tr
                                                className="text-center"
                                                style={{ lineHeight: "14px" }}
                                              >
                                                <td
                                                  className="text-start"
                                                  style={{ fontSize: "15px" }}
                                                >
                                                  {item.title.toUpperCase()}{" "}
                                                  {item.first.toUpperCase()}{" "}
                                                  {item.last.toUpperCase()}
                                                </td>
                                                <td>
                                                  {item.passengerType === "ADT"
                                                    ? "Adult"
                                                    : item.passengerType ===
                                                      "CNN"
                                                    ? "Child"
                                                    : item.passengerType ===
                                                      "CHD"
                                                    ? "Child"
                                                    : item.passengerType ===
                                                      "INF"
                                                    ? "Infant"
                                                    : ""}
                                                </td>
                                                <td>{item.ticketNumbers}</td>
                                                <td>
                                                  {" "}
                                                  {moment(
                                                    ticketingList.ticketInfo
                                                      ?.issueDate
                                                  ).format("ddd, DD MMM,YY")}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        }
                                      )}
                                    </tbody>
                                  ) : (
                                    <tbody>
                                      {ticketingListReturn.passengerInfo?.map(
                                        (item, index) => {
                                          if (
                                            selectPassengerReturn.includes(item)
                                          ) {
                                            return (
                                              <tr
                                                className="text-center"
                                                style={{ lineHeight: "14px" }}
                                              >
                                                <td
                                                  className="text-start"
                                                  style={{ fontSize: "15px" }}
                                                >
                                                  {item.title.toUpperCase()}{" "}
                                                  {item.first.toUpperCase()}{" "}
                                                  {item.last.toUpperCase()}
                                                </td>
                                                <td>
                                                  {item.passengerType === "ADT"
                                                    ? "Adult"
                                                    : item.passengerType ===
                                                      "CNN"
                                                    ? "Child"
                                                    : item.passengerType ===
                                                      "CHD"
                                                    ? "Child"
                                                    : item.passengerType ===
                                                      "INF"
                                                    ? "Infant"
                                                    : ""}
                                                </td>
                                                <td>{item.ticketNumbers}</td>
                                                <td>
                                                  {" "}
                                                  {moment(
                                                    ticketingList.ticketInfo
                                                      ?.issueDate
                                                  ).format("ddd, DD MMM,YY")}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        }
                                      )}
                                    </tbody>
                                  )}
                                </table>
                              </div>

                              <div className="table-responsive mt-3">
                                <div
                                  className="ps-1 py-2 fw-bold text-start bg-light border"
                                  style={{
                                    fontSize: "14px",
                                  }}
                                >
                                  Flight Details
                                </div>
                                {journeyType === "ONWARD" ? (
                                  <div className="">
                                    <div
                                      className="border p-1"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {ticketingList?.directions ===
                                      undefined ? (
                                        <>
                                          {finalSegment.map((item, index) => {
                                            return (
                                              <div className="border my-1 p-1">
                                                {item.map((itm, idx) => {
                                                  let baggage = JSON.parse(
                                                    itm.baggageInfo
                                                  );
                                                  return (
                                                    <>
                                                      <span className="fw-bold">
                                                        {airports
                                                          .filter(
                                                            (f) =>
                                                              f.iata ===
                                                              itm.origin
                                                          )
                                                          .map(
                                                            (itm) => itm.city
                                                          )}{" "}
                                                        ({itm.origin})
                                                      </span>
                                                      <span className="mx-2 fw-bold">
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>
                                                      <span className="fw-bold">
                                                        {airports
                                                          .filter(
                                                            (f) =>
                                                              f.iata ===
                                                              itm.destination
                                                          )
                                                          .map(
                                                            (itm) => itm.city
                                                          )}{" "}
                                                        ({itm.destination})
                                                      </span>
                                                      <span className="d-flex align-items-center fw-bold">
                                                        {/* <img
                                          src={
                                            environment.s3ArliensImage +
                                            `${itm.operationCarrier}.png`
                                          }
                                          className="me-2"
                                          alt=""
                                          width="30px"
                                          height="30px"
                                          crossOrigin="true"
                                        ></img> */}
                                                        <ImageComponentTicket
                                                          logo={
                                                            itm.operationCarrier
                                                          }
                                                        />
                                                        {
                                                          itm.operationCarrierName
                                                        }{" "}
                                                        ({itm.operationCarrier}-
                                                        {itm.flightNumber})
                                                      </span>

                                                      <div className="table-responsive mt-3">
                                                        <table
                                                          class="table table-borderless table-sm mt-1"
                                                          style={{
                                                            fontSize: "14px",
                                                          }}
                                                        >
                                                          <thead>
                                                            <tr>
                                                              <th className="p-0">
                                                                <p
                                                                  className="py-1 ps-1"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "#ededed",
                                                                  }}
                                                                >
                                                                  Date
                                                                </p>
                                                              </th>
                                                              <th className="p-0">
                                                                <p
                                                                  className="py-1 ps-1"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "#ededed",
                                                                  }}
                                                                >
                                                                  Time
                                                                </p>
                                                              </th>
                                                              <th className="p-0">
                                                                <p
                                                                  className="py-1 ps-1"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "#ededed",
                                                                  }}
                                                                >
                                                                  Flight Info
                                                                </p>
                                                              </th>
                                                              <th className="p-0">
                                                                <p
                                                                  className="py-1 ps-1"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "#ededed",
                                                                  }}
                                                                >
                                                                  Flight Time
                                                                </p>
                                                              </th>
                                                              <th className="p-0">
                                                                <p
                                                                  className="py-1 ps-1"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "#ededed",
                                                                  }}
                                                                >
                                                                  Cabin
                                                                </p>
                                                              </th>
                                                              <th className="p-0">
                                                                <p
                                                                  className="py-1 ps-1"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "#ededed",
                                                                  }}
                                                                >
                                                                  Checked
                                                                  Baggage
                                                                </p>
                                                              </th>
                                                              <th className="p-0">
                                                                <p
                                                                  className="py-1 ps-1"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "#ededed",
                                                                  }}
                                                                >
                                                                  Cabin Baggage
                                                                </p>
                                                              </th>
                                                            </tr>
                                                          </thead>
                                                          <tbody>
                                                            <tr>
                                                              <td>
                                                                {moment(
                                                                  itm.departure
                                                                ).format(
                                                                  "ddd DD MMM,YY "
                                                                )}
                                                                <br></br>
                                                                {moment(
                                                                  itm.arrival
                                                                ).format(
                                                                  "ddd DD MMM,YY "
                                                                )}
                                                              </td>
                                                              <td>
                                                                {moment(
                                                                  itm.departure
                                                                ).format(
                                                                  "HH:mm"
                                                                )}
                                                                <br></br>
                                                                {moment(
                                                                  itm.arrival
                                                                ).format(
                                                                  "HH:mm"
                                                                )}
                                                              </td>
                                                              <td>
                                                                Departs{" "}
                                                                <span className="fw-bold">
                                                                  {airports
                                                                    .filter(
                                                                      (f) =>
                                                                        f.iata ===
                                                                        itm.origin
                                                                    )
                                                                    .map(
                                                                      (itm) =>
                                                                        itm.city
                                                                    )}{" "}
                                                                  ({itm.origin})
                                                                  {itm?.originTerminal && (
                                                                    <>
                                                                      Terminal-(
                                                                      {
                                                                        itm?.originTerminal
                                                                      }
                                                                      )
                                                                    </>
                                                                  )}
                                                                </span>
                                                                <br></br>
                                                                Arrival{" "}
                                                                <span className="fw-bold">
                                                                  {airports
                                                                    .filter(
                                                                      (f) =>
                                                                        f.iata ===
                                                                        itm.destination
                                                                    )
                                                                    .map(
                                                                      (itm) =>
                                                                        itm.city
                                                                    )}{" "}
                                                                  (
                                                                  {
                                                                    itm.destination
                                                                  }
                                                                  )
                                                                  {itm?.destinationTerminal && (
                                                                    <>
                                                                      Terminal-(
                                                                      {
                                                                        itm?.destinationTerminal
                                                                      }
                                                                      )
                                                                    </>
                                                                  )}
                                                                </span>
                                                              </td>
                                                              <td className="align-middle">
                                                                {itm.travelTime}
                                                              </td>
                                                              <td className="align-middle">
                                                                {itm.cabinClass}
                                                                (
                                                                {
                                                                  itm.bookingCode
                                                                }
                                                                )
                                                              </td>
                                                              <td className="align-middle">
                                                                {baggage?.map(
                                                                  (im, idx) => {
                                                                    if (
                                                                      selectPassenger.some(
                                                                        (
                                                                          passenegr
                                                                        ) =>
                                                                          passenegr.passengerType ===
                                                                          im?.PassengerTypeCode
                                                                      )
                                                                    )
                                                                      return (
                                                                        <>
                                                                          {im?.Amount && (
                                                                            <>
                                                                              <span className="left">
                                                                                {im?.PassengerTypeCode ===
                                                                                "ADT"
                                                                                  ? "Adult"
                                                                                  : im?.PassengerTypeCode ===
                                                                                    "CNN"
                                                                                  ? "Child"
                                                                                  : im?.PassengerTypeCode ===
                                                                                    "CHD"
                                                                                  ? "Child"
                                                                                  : im?.PassengerTypeCode ===
                                                                                    "INF"
                                                                                  ? "Infant"
                                                                                  : ""}{" "}
                                                                                :{" "}
                                                                                <span className="ms-1 font-size">
                                                                                  {im?.Amount +
                                                                                    " " +
                                                                                    im?.Units}
                                                                                </span>
                                                                              </span>
                                                                              <br></br>
                                                                            </>
                                                                          )}
                                                                        </>
                                                                      );
                                                                  }
                                                                )}
                                                              </td>
                                                              <td className="align-middle">
                                                                7KG (max 1 Bag)
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </div>
                                                    </>
                                                  );
                                                })}
                                              </div>
                                            );
                                          })}
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="">
                                    <div
                                      className="border p-1"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {ticketingListReturn?.directions ===
                                      undefined ? (
                                        <>
                                          {finalSegmentReturn.map(
                                            (item, index) => {
                                              return (
                                                <div className="border my-1 p-1">
                                                  {item.map((itm, idx) => {
                                                    let baggage = JSON.parse(
                                                      itm.baggageInfo
                                                    );
                                                    return (
                                                      <>
                                                        <span className="fw-bold">
                                                          {airports
                                                            .filter(
                                                              (f) =>
                                                                f.iata ===
                                                                itm.origin
                                                            )
                                                            .map(
                                                              (itm) => itm.city
                                                            )}{" "}
                                                          ({itm.origin})
                                                        </span>
                                                        <span className="mx-2 fw-bold">
                                                          <i class="fas fa-arrow-right"></i>
                                                        </span>
                                                        <span className="fw-bold">
                                                          {airports
                                                            .filter(
                                                              (f) =>
                                                                f.iata ===
                                                                itm.destination
                                                            )
                                                            .map(
                                                              (itm) => itm.city
                                                            )}{" "}
                                                          ({itm.destination})
                                                        </span>
                                                        <span className="d-flex align-items-center fw-bold">
                                                          {/* <img
                                          src={
                                            environment.s3ArliensImage +
                                            `${itm.operationCarrier}.png`
                                          }
                                          className="me-2"
                                          alt=""
                                          width="30px"
                                          height="30px"
                                          crossOrigin="true"
                                        ></img> */}
                                                          <ImageComponentTicket
                                                            logo={
                                                              itm.operationCarrier
                                                            }
                                                          />
                                                          {
                                                            itm.operationCarrierName
                                                          }{" "}
                                                          (
                                                          {itm.operationCarrier}
                                                          -{itm.flightNumber})
                                                        </span>

                                                        <div className="table-responsive mt-3">
                                                          <table
                                                            class="table table-borderless table-sm mt-1"
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                          >
                                                            <thead>
                                                              <tr>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Date
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Time
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Flight Info
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Flight Time
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Cabin
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Checked
                                                                    Baggage
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Cabin
                                                                    Baggage
                                                                  </p>
                                                                </th>
                                                              </tr>
                                                            </thead>
                                                            <tbody>
                                                              <tr>
                                                                <td>
                                                                  {moment(
                                                                    itm.departure
                                                                  ).format(
                                                                    "ddd DD MMM,YY "
                                                                  )}
                                                                  <br></br>
                                                                  {moment(
                                                                    itm.arrival
                                                                  ).format(
                                                                    "ddd DD MMM,YY "
                                                                  )}
                                                                </td>
                                                                <td>
                                                                  {moment(
                                                                    itm.departure
                                                                  ).format(
                                                                    "HH:mm"
                                                                  )}
                                                                  <br></br>
                                                                  {moment(
                                                                    itm.arrival
                                                                  ).format(
                                                                    "HH:mm"
                                                                  )}
                                                                </td>
                                                                <td>
                                                                  Departs{" "}
                                                                  <span className="fw-bold">
                                                                    {airports
                                                                      .filter(
                                                                        (f) =>
                                                                          f.iata ===
                                                                          itm.origin
                                                                      )
                                                                      .map(
                                                                        (itm) =>
                                                                          itm.city
                                                                      )}{" "}
                                                                    (
                                                                    {itm.origin}
                                                                    )
                                                                    {itm?.originTerminal && (
                                                                      <>
                                                                        Terminal-(
                                                                        {
                                                                          itm?.originTerminal
                                                                        }
                                                                        )
                                                                      </>
                                                                    )}
                                                                  </span>
                                                                  <br></br>
                                                                  Arrival{" "}
                                                                  <span className="fw-bold">
                                                                    {airports
                                                                      .filter(
                                                                        (f) =>
                                                                          f.iata ===
                                                                          itm.destination
                                                                      )
                                                                      .map(
                                                                        (itm) =>
                                                                          itm.city
                                                                      )}{" "}
                                                                    (
                                                                    {
                                                                      itm.destination
                                                                    }
                                                                    )
                                                                    {itm?.destinationTerminal && (
                                                                      <>
                                                                        Terminal-(
                                                                        {
                                                                          itm?.destinationTerminal
                                                                        }
                                                                        )
                                                                      </>
                                                                    )}
                                                                  </span>
                                                                </td>
                                                                <td className="align-middle">
                                                                  {
                                                                    itm.travelTime
                                                                  }
                                                                </td>
                                                                <td className="align-middle">
                                                                  {
                                                                    itm.cabinClass
                                                                  }
                                                                  (
                                                                  {
                                                                    itm.bookingCode
                                                                  }
                                                                  )
                                                                </td>
                                                                <td className="align-middle">
                                                                  {baggage?.map(
                                                                    (
                                                                      im,
                                                                      idx
                                                                    ) => {
                                                                      if (
                                                                        selectPassenger.some(
                                                                          (
                                                                            passenegr
                                                                          ) =>
                                                                            passenegr.passengerType ===
                                                                            im?.PassengerTypeCode
                                                                        )
                                                                      )
                                                                        return (
                                                                          <>
                                                                            {im?.Amount && (
                                                                              <>
                                                                                <span className="left">
                                                                                  {im?.PassengerTypeCode ===
                                                                                  "ADT"
                                                                                    ? "Adult"
                                                                                    : im?.PassengerTypeCode ===
                                                                                      "CNN"
                                                                                    ? "Child"
                                                                                    : im?.PassengerTypeCode ===
                                                                                      "CHD"
                                                                                    ? "Child"
                                                                                    : im?.PassengerTypeCode ===
                                                                                      "INF"
                                                                                    ? "Infant"
                                                                                    : ""}{" "}
                                                                                  :{" "}
                                                                                  <span className="ms-1 font-size">
                                                                                    {im?.Amount +
                                                                                      " " +
                                                                                      im?.Units}
                                                                                  </span>
                                                                                </span>
                                                                                <br></br>
                                                                              </>
                                                                            )}
                                                                          </>
                                                                        );
                                                                    }
                                                                  )}
                                                                </td>
                                                                <td className="align-middle">
                                                                  7KG (max 1
                                                                  Bag)
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                      </>
                                                    );
                                                  })}
                                                </div>
                                              );
                                            }
                                          )}
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {journeyType === "ONWARD" ? (
                                <>
                                  {isFareHide === false ? (
                                    <div className="table-responsive mt-3">
                                      <table
                                        class="table table-bordered table-sm text-end mt-1"
                                        style={{ fontSize: "14px" }}
                                      >
                                        <thead className="text-end">
                                          <tr>
                                            <th
                                              colspan={
                                                isFareChange === false
                                                  ? "8"
                                                  : "7"
                                              }
                                              className="fw-bold text-start py-2 bg-light"
                                            >
                                              Fare Details
                                            </th>
                                          </tr>
                                          <tr>
                                            <th className="text-start">Type</th>
                                            <th>Base Fare</th>
                                            <th>Tax</th>
                                            <th>AIT</th>
                                            {isFareChange === false && (
                                              <th>Commission</th>
                                            )}
                                            <th>Additional Collection</th>
                                            <th>Person</th>
                                            <th>Total</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-end">
                                          {ticketingList.fareBreakdown?.map(
                                            (item, index) => {
                                              return (
                                                <>
                                                  {item.passengerType ===
                                                    "ADT" &&
                                                  selectPassenger.some(
                                                    (itm) =>
                                                      itm.passengerType ===
                                                      item.passengerType
                                                  ) ? (
                                                    <>
                                                      <tr>
                                                        <td className="text-start">
                                                          Adult
                                                        </td>
                                                        <td>
                                                          {item.basePrice?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {item.tax?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>

                                                        <td>
                                                          {item.ait?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        {isFareChange ===
                                                          false && (
                                                          <td>
                                                            {item.discount?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                        )}
                                                        <td>
                                                          {item.reissueCharge}
                                                        </td>
                                                        <td>
                                                          {item.passengerCount -
                                                            unSelectPassenger.filter(
                                                              (num) =>
                                                                num.passengerType ===
                                                                "ADT"
                                                            ).length}
                                                        </td>
                                                        <td className="fw-bold">
                                                          {item.currencyName}{" "}
                                                          {isFareChange ===
                                                          false
                                                            ? (
                                                                item.totalPrice *
                                                                (item.passengerCount -
                                                                  unSelectPassenger.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "ADT"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )
                                                            : (
                                                                (item.totalPrice -
                                                                  item.discount) *
                                                                (item.passengerCount -
                                                                  unSelectPassenger.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "ADT"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                        </td>
                                                      </tr>
                                                    </>
                                                  ) : item.passengerType ===
                                                      "CHD" &&
                                                    selectPassenger.some(
                                                      (itm) =>
                                                        itm.passengerType ===
                                                        item.passengerType
                                                    ) ? (
                                                    <>
                                                      <tr>
                                                        <td className="text-start">
                                                          Child &gt; 5
                                                        </td>
                                                        <td>
                                                          {item.basePrice?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {item.tax?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>

                                                        <td>
                                                          {item.ait?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        {isFareChange ===
                                                          false && (
                                                          <td>
                                                            {item.discount?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                        )}
                                                        <td>
                                                          {item.reissueCharge}
                                                        </td>
                                                        <td>
                                                          {item.passengerCount -
                                                            unSelectPassenger.filter(
                                                              (num) =>
                                                                num.passengerType ===
                                                                "CHD"
                                                            ).length}
                                                        </td>
                                                        <td className="fw-bold">
                                                          {item.currencyName}{" "}
                                                          {/* {(
                                item.totalPrice *
                                item.passengerCount
                              )?.toLocaleString("en-US")} */}
                                                          {isFareChange ===
                                                          false
                                                            ? (
                                                                item.totalPrice *
                                                                (item.passengerCount -
                                                                  unSelectPassenger.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "CHD"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )
                                                            : (
                                                                (item.totalPrice -
                                                                  item.discount) *
                                                                (item.passengerCount -
                                                                  unSelectPassenger.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "CHD"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                        </td>
                                                      </tr>
                                                    </>
                                                  ) : item.passengerType ===
                                                      "CNN" &&
                                                    selectPassenger.some(
                                                      (itm) =>
                                                        itm.passengerType ===
                                                        item.passengerType
                                                    ) ? (
                                                    <>
                                                      <tr>
                                                        <td className="text-start">
                                                          {" "}
                                                          {item.passengerType ===
                                                            "CNN" &&
                                                          ticketingList.fareBreakdown?.some(
                                                            (item) =>
                                                              item.passengerType ===
                                                              "CHD"
                                                          )
                                                            ? "Child < 5"
                                                            : "Child"}
                                                        </td>
                                                        <td>
                                                          {item.basePrice?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {item.tax?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>

                                                        <td>
                                                          {item.ait?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        {isFareChange ===
                                                          false && (
                                                          <td>
                                                            {item.discount?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                        )}
                                                        <td>
                                                          {item.reissueCharge}
                                                        </td>
                                                        <td>
                                                          {item.passengerCount -
                                                            unSelectPassenger.filter(
                                                              (num) =>
                                                                num.passengerType ===
                                                                "CNN"
                                                            ).length}
                                                        </td>
                                                        <td className="fw-bold">
                                                          {item.currencyName}{" "}
                                                          {isFareChange ===
                                                          false
                                                            ? (
                                                                item.totalPrice *
                                                                (item.passengerCount -
                                                                  unSelectPassenger.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "CNN"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )
                                                            : (
                                                                (item.totalPrice -
                                                                  item.discount) *
                                                                (item.passengerCount -
                                                                  unSelectPassenger.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "CNN"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                        </td>
                                                      </tr>
                                                    </>
                                                  ) : item.passengerType ===
                                                      "INF" &&
                                                    selectPassenger.some(
                                                      (itm) =>
                                                        itm.passengerType ===
                                                        item.passengerType
                                                    ) ? (
                                                    <>
                                                      <tr>
                                                        <td className="text-start">
                                                          Infant
                                                        </td>
                                                        <td>
                                                          {item.basePrice?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {item.tax?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>

                                                        <td>
                                                          {item.ait?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        {isFareChange ===
                                                          false && (
                                                          <td>
                                                            {item.discount?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                        )}
                                                        <td>
                                                          {item.reissueCharge}
                                                        </td>
                                                        <td>
                                                          {item.passengerCount -
                                                            unSelectPassenger.filter(
                                                              (num) =>
                                                                num.passengerType ===
                                                                "INF"
                                                            ).length}
                                                        </td>
                                                        <td className="fw-bold">
                                                          {item.currencyName}{" "}
                                                          {isFareChange ===
                                                          false
                                                            ? (
                                                                item.totalPrice *
                                                                (item.passengerCount -
                                                                  unSelectPassenger.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "INF"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )
                                                            : (
                                                                (item.totalPrice -
                                                                  item.discount) *
                                                                (item.passengerCount -
                                                                  unSelectPassenger.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "INF"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                        </td>
                                                      </tr>
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </>
                                              );
                                            }
                                          )}
                                          <tr className="fw-bold">
                                            <td
                                              colSpan={
                                                isFareChange === false ? 6 : 5
                                              }
                                              className="border-none"
                                            ></td>
                                            <td>Additional Collection</td>
                                            <td>
                                              {ticketingList?.passengerInfo !==
                                                undefined &&
                                              ticketingList?.passengerInfo !==
                                                " " &&
                                              ticketingList?.passengerInfo !==
                                                null
                                                ? ticketingList.passengerInfo[0]
                                                    ?.currencyName
                                                : ""}{" "}
                                              {/* {
                            ticketingList?.penalty[0]?.reissueCharge.toLocaleString("en-US")
                          } */}
                                              {sumAdditinalPrice(
                                                ticketingList.fareBreakdown
                                              )?.toLocaleString("en-US")}
                                            </td>
                                          </tr>

                                          {totalextraServicePnrData > 0 && (
                                            <tr className="fw-bold">
                                              <td
                                                colSpan={
                                                  isFareChange === false ? 6 : 5
                                                }
                                                className="border-none"
                                              ></td>
                                              <td>
                                                Total Ticket Import Service
                                                Charge
                                              </td>
                                              <td>
                                                {totalextraServicePnrData?.toLocaleString(
                                                  "en-US"
                                                )}
                                              </td>
                                            </tr>
                                          )}

                                          <tr className="fw-bold">
                                            <td
                                              colSpan={
                                                isFareChange === false ? 6 : 5
                                              }
                                              className="border-none"
                                            ></td>
                                            <td>Grand Total</td>
                                            <td>
                                              {ticketingList?.passengerInfo !==
                                                undefined &&
                                              ticketingList?.passengerInfo !==
                                                " " &&
                                              ticketingList?.passengerInfo !==
                                                null
                                                ? ticketingList.passengerInfo[0]
                                                    ?.currencyName
                                                : ""}{" "}
                                              {ticketingList?.penalty?.length >
                                              0 ? (
                                                <>
                                                  {isFareChange === false
                                                    ? (
                                                        sumRatingForPassengerTicket(
                                                          ticketingList.fareBreakdown,
                                                          unSelectPassenger
                                                        ) +
                                                        sumAdditinalPrice(
                                                          ticketingList.fareBreakdown
                                                        ) +
                                                        totalextraServicePnrData
                                                      )?.toLocaleString("en-US")
                                                    : (
                                                        sumRatingForPassengerTicketGross(
                                                          ticketingList.fareBreakdown,
                                                          unSelectPassenger
                                                        ) +
                                                        sumAdditinalPrice(
                                                          ticketingList.fareBreakdown
                                                        ) +
                                                        totalextraServicePnrData
                                                      )?.toLocaleString(
                                                        "en-US"
                                                      )}
                                                </>
                                              ) : (
                                                <>
                                                  {isFareChange === false
                                                    ? (
                                                        sumRatingForPassengerTicket(
                                                          ticketingList.fareBreakdown,
                                                          unSelectPassenger
                                                        ) +
                                                        totalextraServicePnrData
                                                      )?.toLocaleString("en-US")
                                                    : (
                                                        sumRatingForPassengerTicketGross(
                                                          ticketingList.fareBreakdown,
                                                          unSelectPassenger
                                                        ) +
                                                        totalextraServicePnrData
                                                      )?.toLocaleString(
                                                        "en-US"
                                                      )}
                                                </>
                                              )}
                                            </td>
                                          </tr>

                                          {ticketingList?.penalty?.length >
                                          0 ? (
                                            <>
                                              <tr className="fw-bold">
                                                <td
                                                  colSpan={
                                                    isFareChange === false
                                                      ? 6
                                                      : 5
                                                  }
                                                  className="border-none"
                                                ></td>
                                                <td>Exchange Penalty</td>
                                                <td>
                                                  {ticketingList?.passengerInfo !==
                                                    undefined &&
                                                  ticketingList?.passengerInfo !==
                                                    " " &&
                                                  ticketingList?.passengerInfo !==
                                                    null
                                                    ? ticketingList
                                                        .passengerInfo[0]
                                                        ?.currencyName
                                                    : ""}{" "}
                                                  {ticketingList?.penalty[0]?.panalty?.toLocaleString(
                                                    "en-US"
                                                  )}
                                                </td>
                                              </tr>
                                            </>
                                          ) : (
                                            <> </>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              ) : (
                                <>
                                  {isFareHide === false ? (
                                    <div className="table-responsive mt-3">
                                      <table
                                        class="table table-bordered table-sm text-end mt-1"
                                        style={{ fontSize: "14px" }}
                                      >
                                        <thead className="text-end">
                                          <tr>
                                            <th
                                              colspan={
                                                isFareChange === false
                                                  ? "8"
                                                  : "7"
                                              }
                                              className="fw-bold text-start py-2 bg-light"
                                            >
                                              Fare Details
                                            </th>
                                          </tr>
                                          <tr>
                                            <th className="text-start">Type</th>
                                            <th>Base Fare</th>
                                            <th>Tax</th>
                                            <th>AIT</th>
                                            {isFareChange === false && (
                                              <th>Commission</th>
                                            )}
                                            <th>Additional Collection</th>
                                            <th>Person</th>
                                            <th>Total</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-end">
                                          {ticketingListReturn.fareBreakdown?.map(
                                            (item, index) => {
                                              return (
                                                <>
                                                  {item.passengerType ===
                                                    "ADT" &&
                                                  selectPassengerReturn.some(
                                                    (itm) =>
                                                      itm.passengerType ===
                                                      item.passengerType
                                                  ) ? (
                                                    <>
                                                      <tr>
                                                        <td className="text-start">
                                                          Adult
                                                        </td>
                                                        <td>
                                                          {item.basePrice?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {item.tax?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>

                                                        <td>
                                                          {item.ait?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        {isFareChange ===
                                                          false && (
                                                          <td>
                                                            {item.discount?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                        )}
                                                        <td>
                                                          {item.reissueCharge}
                                                        </td>
                                                        <td>
                                                          {item.passengerCount -
                                                            unSelectPassenger.filter(
                                                              (num) =>
                                                                num.passengerType ===
                                                                "ADT"
                                                            ).length}
                                                        </td>
                                                        <td className="fw-bold">
                                                          {item.currencyName}{" "}
                                                          {isFareChange ===
                                                          false
                                                            ? (
                                                                item.totalPrice *
                                                                (item.passengerCount -
                                                                  unSelectPassenger.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "ADT"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )
                                                            : (
                                                                (item.totalPrice -
                                                                  item.discount) *
                                                                (item.passengerCount -
                                                                  unSelectPassengerReturn.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "ADT"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                        </td>
                                                      </tr>
                                                    </>
                                                  ) : item.passengerType ===
                                                      "CHD" &&
                                                    selectPassengerReturn.some(
                                                      (itm) =>
                                                        itm.passengerType ===
                                                        item.passengerType
                                                    ) ? (
                                                    <>
                                                      <tr>
                                                        <td className="text-start">
                                                          Child &gt; 5
                                                        </td>
                                                        <td>
                                                          {item.basePrice?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {item.tax?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>

                                                        <td>
                                                          {item.ait?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        {isFareChange ===
                                                          false && (
                                                          <td>
                                                            {item.discount?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                        )}
                                                        <td>
                                                          {item.reissueCharge}
                                                        </td>
                                                        <td>
                                                          {item.passengerCount -
                                                            unSelectPassengerReturn.filter(
                                                              (num) =>
                                                                num.passengerType ===
                                                                "CHD"
                                                            ).length}
                                                        </td>
                                                        <td className="fw-bold">
                                                          {item.currencyName}{" "}
                                                          {/* {(
                                item.totalPrice *
                                item.passengerCount
                              )?.toLocaleString("en-US")} */}
                                                          {isFareChange ===
                                                          false
                                                            ? (
                                                                item.totalPrice *
                                                                (item.passengerCount -
                                                                  unSelectPassengerReturn.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "CHD"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )
                                                            : (
                                                                (item.totalPrice -
                                                                  item.discount) *
                                                                (item.passengerCount -
                                                                  unSelectPassengerReturn.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "CHD"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                        </td>
                                                      </tr>
                                                    </>
                                                  ) : item.passengerType ===
                                                      "CNN" &&
                                                    selectPassengerReturn.some(
                                                      (itm) =>
                                                        itm.passengerType ===
                                                        item.passengerType
                                                    ) ? (
                                                    <>
                                                      <tr>
                                                        <td className="text-start">
                                                          {" "}
                                                          {item.passengerType ===
                                                            "CNN" &&
                                                          ticketingListReturn.fareBreakdown?.some(
                                                            (item) =>
                                                              item.passengerType ===
                                                              "CHD"
                                                          )
                                                            ? "Child < 5"
                                                            : "Child"}
                                                        </td>
                                                        <td>
                                                          {item.basePrice?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {item.tax?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>

                                                        <td>
                                                          {item.ait?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        {isFareChange ===
                                                          false && (
                                                          <td>
                                                            {item.discount?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                        )}
                                                        <td>
                                                          {item.reissueCharge}
                                                        </td>
                                                        <td>
                                                          {item.passengerCount -
                                                            unSelectPassengerReturn.filter(
                                                              (num) =>
                                                                num.passengerType ===
                                                                "CNN"
                                                            ).length}
                                                        </td>
                                                        <td className="fw-bold">
                                                          {item.currencyName}{" "}
                                                          {isFareChange ===
                                                          false
                                                            ? (
                                                                item.totalPrice *
                                                                (item.passengerCount -
                                                                  unSelectPassengerReturn.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "CNN"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )
                                                            : (
                                                                (item.totalPrice -
                                                                  item.discount) *
                                                                (item.passengerCount -
                                                                  unSelectPassengerReturn.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "CNN"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                        </td>
                                                      </tr>
                                                    </>
                                                  ) : item.passengerType ===
                                                      "INF" &&
                                                    selectPassengerReturn.some(
                                                      (itm) =>
                                                        itm.passengerType ===
                                                        item.passengerType
                                                    ) ? (
                                                    <>
                                                      <tr>
                                                        <td className="text-start">
                                                          Infant
                                                        </td>
                                                        <td>
                                                          {item.basePrice?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {item.tax?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>

                                                        <td>
                                                          {item.ait?.toLocaleString(
                                                            "en-US"
                                                          )}
                                                        </td>
                                                        {isFareChange ===
                                                          false && (
                                                          <td>
                                                            {item.discount?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                        )}
                                                        <td>
                                                          {item.reissueCharge}
                                                        </td>
                                                        <td>
                                                          {item.passengerCount -
                                                            unSelectPassengerReturn.filter(
                                                              (num) =>
                                                                num.passengerType ===
                                                                "INF"
                                                            ).length}
                                                        </td>
                                                        <td className="fw-bold">
                                                          {item.currencyName}{" "}
                                                          {isFareChange ===
                                                          false
                                                            ? (
                                                                item.totalPrice *
                                                                (item.passengerCount -
                                                                  unSelectPassengerReturn.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "INF"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )
                                                            : (
                                                                (item.totalPrice -
                                                                  item.discount) *
                                                                (item.passengerCount -
                                                                  unSelectPassengerReturn.filter(
                                                                    (num) =>
                                                                      num.passengerType ===
                                                                      "INF"
                                                                  ).length)
                                                              )?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                        </td>
                                                      </tr>
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </>
                                              );
                                            }
                                          )}
                                          <tr className="fw-bold">
                                            <td
                                              colSpan={
                                                isFareChange === false ? 6 : 5
                                              }
                                              className="border-none"
                                            ></td>
                                            <td>Additional Collection</td>
                                            <td>
                                              {ticketingListReturn?.passengerInfo !==
                                                undefined &&
                                              ticketingListReturn?.passengerInfo !==
                                                " " &&
                                              ticketingListReturn?.passengerInfo !==
                                                null
                                                ? ticketingListReturn
                                                    .passengerInfo[0]
                                                    ?.currencyName
                                                : ""}{" "}
                                              {/* {
                            ticketingList?.penalty[0]?.reissueCharge.toLocaleString("en-US")
                          } */}
                                              {sumAdditinalPrice(
                                                ticketingListReturn.fareBreakdown
                                              )?.toLocaleString("en-US")}
                                            </td>
                                          </tr>

                                          {totalextraServicePnrData > 0 && (
                                            <tr className="fw-bold">
                                              <td
                                                colSpan={
                                                  isFareChange === false ? 6 : 5
                                                }
                                                className="border-none"
                                              ></td>
                                              <td>
                                                Total Ticket Import Service
                                                Charge
                                              </td>
                                              <td>
                                                {totalextraServicePnrData?.toLocaleString(
                                                  "en-US"
                                                )}
                                              </td>
                                            </tr>
                                          )}

                                          <tr className="fw-bold">
                                            <td
                                              colSpan={
                                                isFareChange === false ? 6 : 5
                                              }
                                              className="border-none"
                                            ></td>
                                            <td>Grand Total</td>
                                            <td>
                                              {ticketingListReturn?.passengerInfo !==
                                                undefined &&
                                              ticketingListReturn?.passengerInfo !==
                                                " " &&
                                              ticketingListReturn?.passengerInfo !==
                                                null
                                                ? ticketingListReturn
                                                    .passengerInfo[0]
                                                    ?.currencyName
                                                : ""}{" "}
                                              {ticketingListReturn?.penalty
                                                ?.length > 0 ? (
                                                <>
                                                  {isFareChange === false
                                                    ? (
                                                        sumRatingForPassengerTicket(
                                                          ticketingListReturn.fareBreakdown,
                                                          unSelectPassengerReturn
                                                        ) +
                                                        sumAdditinalPrice(
                                                          ticketingListReturn.fareBreakdown
                                                        ) +
                                                        totalextraServicePnrData
                                                      )?.toLocaleString("en-US")
                                                    : (
                                                        sumRatingForPassengerTicketGross(
                                                          ticketingListReturn.fareBreakdown,
                                                          unSelectPassengerReturn
                                                        ) +
                                                        sumAdditinalPrice(
                                                          ticketingListReturn.fareBreakdown
                                                        ) +
                                                        totalextraServicePnrData
                                                      )?.toLocaleString(
                                                        "en-US"
                                                      )}
                                                </>
                                              ) : (
                                                <>
                                                  {isFareChange === false
                                                    ? (
                                                        sumRatingForPassengerTicket(
                                                          ticketingListReturn.fareBreakdown,
                                                          unSelectPassengerReturn
                                                        ) +
                                                        totalextraServicePnrData
                                                      )?.toLocaleString("en-US")
                                                    : (
                                                        sumRatingForPassengerTicketGross(
                                                          ticketingListReturn.fareBreakdown,
                                                          unSelectPassengerReturn
                                                        ) +
                                                        totalextraServicePnrData
                                                      )?.toLocaleString(
                                                        "en-US"
                                                      )}
                                                </>
                                              )}
                                            </td>
                                          </tr>

                                          {ticketingListReturn?.penalty
                                            ?.length > 0 ? (
                                            <>
                                              <tr className="fw-bold">
                                                <td
                                                  colSpan={
                                                    isFareChange === false
                                                      ? 6
                                                      : 5
                                                  }
                                                  className="border-none"
                                                ></td>
                                                <td>Exchange Penalty</td>
                                                <td>
                                                  {ticketingListReturn?.passengerInfo !==
                                                    undefined &&
                                                  ticketingListReturn?.passengerInfo !==
                                                    " " &&
                                                  ticketingListReturn?.passengerInfo !==
                                                    null
                                                    ? ticketingListReturn
                                                        .passengerInfo[0]
                                                        ?.currencyName
                                                    : ""}{" "}
                                                  {ticketingListReturn?.penalty[0]?.panalty?.toLocaleString(
                                                    "en-US"
                                                  )}
                                                </td>
                                              </tr>
                                            </>
                                          ) : (
                                            <> </>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              )}

                              {extraServices && extraServices?.length > 0 ? (
                                <div className="table-responsive mt-3">
                                  <div
                                    className="ps-1 py-2 fw-bold text-start"
                                    style={{
                                      fontSize: "14px",
                                      backgroundColor: "#c3c2c2",
                                    }}
                                  >
                                    Extra Services Details
                                  </div>

                                  <table
                                    class="table table-bordered table-sm text-end mt-1"
                                    style={{ fontSize: "14px" }}
                                  >
                                    <thead className="text-end">
                                      <tr>
                                        <th
                                          colspan="4"
                                          className="fw-bold text-start py-2 bg-light"
                                        >
                                          Extra Services Details
                                        </th>
                                      </tr>
                                      <tr>
                                        <th className="text-start">
                                          Passenger Name
                                        </th>
                                        <th>Type Of Services</th>
                                        <th>Segment</th>
                                        <th>Service Name</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-end">
                                      {extraServices?.map((item) =>
                                        item?.map((exService, idx) => {
                                          return (
                                            <tr key={idx}>
                                              <>
                                                <td className="text-start">
                                                  {ticketingList?.passengerInfo?.map(
                                                    (paxId) => {
                                                      return (
                                                        <>
                                                          {paxId.paxId ===
                                                            exService.fK_PaxId &&
                                                            paxId?.title +
                                                              " " +
                                                              paxId?.first +
                                                              " " +
                                                              paxId?.last}
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </td>
                                                <td>
                                                  {exService.typeOfServices}
                                                </td>
                                                <td>{exService.segment}</td>
                                                <td>{exService.name}</td>
                                              </>
                                            </tr>
                                          );
                                        })
                                      )}
                                      <tr className="fw-bold">
                                        <td
                                          colSpan={2}
                                          className="border-none"
                                        ></td>
                                        <td>Grand Total</td>
                                        <td>
                                          {total?.toLocaleString("en-US")}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <></>
                              )}

                              {/* {!contactInfo && (
                                <div className="table-responsive">
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
                                        <th>Email</th>
                                        <th>Phone Number</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-center">
                                      {ticketingList?.passengerInfo?.map(
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
                                                    </td>
                                                    <td>
                                                      {
                                                        ticketingList
                                                          ?.ticketInfo
                                                          ?.leadPaxEmail
                                                      }
                                                    </td>
                                                    <td>
                                                      {item.phoneCountryCode +
                                                        item.phone}{" "}
                                                    </td>
                                                  </tr>
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
                              )} */}

                              <div className="mt-3 pb-2">
                                <div
                                  className="ps-1 py-2 fw-bold text-start border bg-light"
                                  style={{
                                    fontSize: "13px",
                                    marginBottom: "8px",
                                  }}
                                >
                                  Important Notice
                                </div>
                                <table
                                  class="table table-bordered table-sm text-end mt-1 mb-0"
                                  style={{ fontSize: "13px" }}
                                >
                                  <thead>
                                    <tr>
                                      <th className="text-start">
                                        E-Ticket Notice:
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="text-start">
                                      <p className="border-0">
                                        Carriage and other services provided by
                                        the carrier are subject to conditions of
                                        carriage which are hereby incorporated
                                        by reference. These conditions may be
                                        obtained from the issuing carrier.
                                      </p>
                                    </tr>
                                  </tbody>
                                </table>
                                <table
                                  class="table table-bordered table-sm text-end  mb-0"
                                  style={{ fontSize: "13px" }}
                                >
                                  <thead>
                                    <tr>
                                      <th className="text-start">
                                        Passport/Visa/Health:
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="text-start">
                                      <p className="border-0">
                                        Please ensure that you have all the
                                        required travel documents for your
                                        entire journey - i.e. valid passport &
                                        necessary Visas - and that you have had
                                        the recommended
                                        vaccinations/immunizations for your
                                        destination's.
                                      </p>
                                    </tr>
                                  </tbody>
                                </table>
                                <table
                                  class="table table-bordered table-sm text-end mb-0"
                                  style={{ fontSize: "13px" }}
                                >
                                  <thead>
                                    <tr>
                                      <th className="text-start">
                                        Carry-on Baggage Allowance:
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="text-start">
                                      <p className="border-0">
                                        LIMIT: 1 Carry-On bag per passenger /
                                        SIZE LIMIT: 22in x 15in x 8in (L+W+H=45
                                        inches) / WEIGHT LIMIT: Max weight 7 kg
                                        / 15 lb
                                      </p>
                                    </tr>
                                  </tbody>
                                </table>
                                <table
                                  class="table table-bordered table-sm text-end  mb-0"
                                  style={{ fontSize: "13px" }}
                                >
                                  <thead>
                                    <tr>
                                      <th className="text-start">
                                        Reporting Time:
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="text-start">
                                      <p className="border-0">
                                        Flights open for check-in 1 hour before
                                        scheduled departure time on domestic
                                        flights and 3 hours before scheduled
                                        departure time on international flights.
                                        Passengers must check-in 1 hour before
                                        flight departure. Check-in counters
                                        close 30 minutes before flight departure
                                        for domestic, and 90 minutes before the
                                        scheduled departure for international
                                        flights.
                                      </p>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>

                        {ticketingList?.comboSegmentInfo?.length > 0 && (
                          <div style={{ display: "none" }}>
                            <div ref={componentRefCombo}>
                              <div className="card-body">
                                <div
                                  className="px-lg-5 px-md-5 px-sm-1 p-3"
                                  ref={donwloadRef}
                                >
                                  <h4 className="text-center pb-2">E-Ticket</h4>

                                  {!isAgentInfo && (
                                    <div className="table-responsive mt-2">
                                      <table class="table table-borderless table-sm">
                                        <tbody>
                                          <tr>
                                            {/* FIXED COMPANY LOGO */}
                                            {/* CHANGE THIS LATER */}
                                            <td className="text-start">
                                              {ticketingList.ticketInfo
                                                ?.agentLogo !== null ? (
                                                <>
                                                  {/* <img
                                  alt="img01"
                                  src={
                                    environment.s3URL +
                                    `${ticketingList.ticketInfo?.agentLogo}`
                                  }
                                  crossOrigin="true"
                                  style={{ width: "160px" }}
                                ></img> */}
                                                  <ImageComponentForAgent
                                                    logo={
                                                      ticketingList.ticketInfo
                                                        ?.agentLogo
                                                    }
                                                  />
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
                                                  <span
                                                    style={{ fontSize: "8px" }}
                                                  >
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
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  )}

                                  <Box
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                    flexWrap={"wrap"}
                                    style={{ fontSize: "14px" }}
                                  >
                                    <div>
                                      <br></br>
                                      <Text>
                                        Booking ID :{" "}
                                        <span className="fw-bold">
                                          {
                                            ticketingList.ticketInfo
                                              ?.uniqueTransID
                                          }
                                        </span>
                                      </Text>
                                    </div>

                                    <div>
                                      <Text>
                                        GDS PNR :{" "}
                                        <span className="fw-bold">
                                          {ticketingList.ticketInfo?.pnr}
                                        </span>
                                      </Text>
                                      <Text>
                                        Airline PNR:{" "}
                                        <span className="fw-bold">
                                          {ticketingList.ticketInfo
                                            ?.airlinePNRs === "" ||
                                          ticketingList.ticketInfo
                                            ?.airlinePNRs === null
                                            ? ticketingList.ticketInfo?.pnr
                                            : ticketingList.ticketInfo
                                                ?.airlinePNRs}
                                        </span>
                                      </Text>
                                    </div>
                                  </Box>

                                  <div className="table-responsive mt-2">
                                    <table
                                      class="table table-bordered table-sm mt-1"
                                      style={{ fontSize: "14px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th
                                            colspan="5"
                                            className="fw-bold py-2 bg-light"
                                          >
                                            Passenger Information
                                          </th>
                                        </tr>
                                        <tr className="text-center">
                                          <th className="text-start">Name</th>
                                          <th>Type</th>
                                          <th>E-Ticket Number</th>
                                          {/* <th>Booking ID</th> */}
                                          <th>Ticket Issue Date</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {ticketingList.passengerInfo?.map(
                                          (item, index) => {
                                            if (
                                              selectPassenger.includes(item)
                                            ) {
                                              return (
                                                <tr
                                                  className="text-center"
                                                  style={{ lineHeight: "14px" }}
                                                >
                                                  <td
                                                    className="text-start"
                                                    style={{ fontSize: "15px" }}
                                                  >
                                                    {item.title.toUpperCase()}{" "}
                                                    {item.first.toUpperCase()}{" "}
                                                    {item.last.toUpperCase()}
                                                  </td>
                                                  <td>
                                                    {item.passengerType ===
                                                    "ADT"
                                                      ? "Adult"
                                                      : item.passengerType ===
                                                        "CNN"
                                                      ? "Child"
                                                      : item.passengerType ===
                                                        "CHD"
                                                      ? "Child"
                                                      : item.passengerType ===
                                                        "INF"
                                                      ? "Infant"
                                                      : ""}
                                                  </td>
                                                  <td>{item.ticketNumbers}</td>
                                                  <td>
                                                    {" "}
                                                    {moment(
                                                      ticketingList.ticketInfo
                                                        ?.issueDate
                                                    ).format("ddd, DD MMM,YY")}
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="table-responsive mt-3">
                                    <div
                                      className="ps-1 py-2 fw-bold text-start bg-light border"
                                      style={{
                                        fontSize: "14px",
                                      }}
                                    >
                                      Flight Details
                                    </div>
                                    <div className="">
                                      <div
                                        className="border p-1"
                                        style={{ fontSize: "14px" }}
                                      >
                                        {ticketingList?.directions ===
                                        undefined ? (
                                          <>
                                            {finalSegment.map((item, index) => {
                                              return (
                                                <div className="border my-1 p-1">
                                                  {item.map((itm, idx) => {
                                                    let baggage = JSON.parse(
                                                      itm.baggageInfo
                                                    );
                                                    return (
                                                      <>
                                                        <span className="fw-bold">
                                                          {airports
                                                            .filter(
                                                              (f) =>
                                                                f.iata ===
                                                                itm.origin
                                                            )
                                                            .map(
                                                              (itm) => itm.city
                                                            )}{" "}
                                                          ({itm.origin})
                                                        </span>
                                                        <span className="mx-2 fw-bold">
                                                          <i class="fas fa-arrow-right"></i>
                                                        </span>
                                                        <span className="fw-bold">
                                                          {airports
                                                            .filter(
                                                              (f) =>
                                                                f.iata ===
                                                                itm.destination
                                                            )
                                                            .map(
                                                              (itm) => itm.city
                                                            )}{" "}
                                                          ({itm.destination})
                                                        </span>
                                                        <span className="d-flex align-items-center fw-bold">
                                                          {/* <img
                                          src={
                                            environment.s3ArliensImage +
                                            `${itm.operationCarrier}.png`
                                          }
                                          className="me-2"
                                          alt=""
                                          width="30px"
                                          height="30px"
                                          crossOrigin="true"
                                        ></img> */}
                                                          <ImageComponentTicket
                                                            logo={
                                                              itm.operationCarrier
                                                            }
                                                          />
                                                          {
                                                            itm.operationCarrierName
                                                          }{" "}
                                                          (
                                                          {itm.operationCarrier}
                                                          -{itm.flightNumber})
                                                        </span>

                                                        <div className="table-responsive mt-3">
                                                          <table
                                                            class="table table-borderless table-sm mt-1"
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                          >
                                                            <thead>
                                                              <tr>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Date
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Time
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Flight Info
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Flight Time
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Cabin
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Checked
                                                                    Baggage
                                                                  </p>
                                                                </th>
                                                                <th className="p-0">
                                                                  <p
                                                                    className="py-1 ps-1"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#ededed",
                                                                    }}
                                                                  >
                                                                    Cabin
                                                                    Baggage
                                                                  </p>
                                                                </th>
                                                              </tr>
                                                            </thead>
                                                            <tbody>
                                                              <tr>
                                                                <td>
                                                                  {moment(
                                                                    itm.departure
                                                                  ).format(
                                                                    "ddd DD MMM,YY "
                                                                  )}
                                                                  <br></br>
                                                                  {moment(
                                                                    itm.arrival
                                                                  ).format(
                                                                    "ddd DD MMM,YY "
                                                                  )}
                                                                </td>
                                                                <td>
                                                                  {moment(
                                                                    itm.departure
                                                                  ).format(
                                                                    "HH:mm"
                                                                  )}
                                                                  <br></br>
                                                                  {moment(
                                                                    itm.arrival
                                                                  ).format(
                                                                    "HH:mm"
                                                                  )}
                                                                </td>
                                                                <td>
                                                                  Departs{" "}
                                                                  <span className="fw-bold">
                                                                    {airports
                                                                      .filter(
                                                                        (f) =>
                                                                          f.iata ===
                                                                          itm.origin
                                                                      )
                                                                      .map(
                                                                        (itm) =>
                                                                          itm.city
                                                                      )}{" "}
                                                                    (
                                                                    {itm.origin}
                                                                    )
                                                                    {itm?.originTerminal && (
                                                                      <>
                                                                        Terminal-(
                                                                        {
                                                                          itm?.originTerminal
                                                                        }
                                                                        )
                                                                      </>
                                                                    )}
                                                                  </span>
                                                                  <br></br>
                                                                  Arrival{" "}
                                                                  <span className="fw-bold">
                                                                    {airports
                                                                      .filter(
                                                                        (f) =>
                                                                          f.iata ===
                                                                          itm.destination
                                                                      )
                                                                      .map(
                                                                        (itm) =>
                                                                          itm.city
                                                                      )}{" "}
                                                                    (
                                                                    {
                                                                      itm.destination
                                                                    }
                                                                    )
                                                                    {itm?.destinationTerminal && (
                                                                      <>
                                                                        Terminal-(
                                                                        {
                                                                          itm?.destinationTerminal
                                                                        }
                                                                        )
                                                                      </>
                                                                    )}
                                                                  </span>
                                                                </td>
                                                                <td className="align-middle">
                                                                  {
                                                                    itm.travelTime
                                                                  }
                                                                </td>
                                                                <td className="align-middle">
                                                                  {
                                                                    itm.cabinClass
                                                                  }
                                                                  (
                                                                  {
                                                                    itm.bookingCode
                                                                  }
                                                                  )
                                                                </td>
                                                                <td className="align-middle">
                                                                  {baggage?.map(
                                                                    (
                                                                      im,
                                                                      idx
                                                                    ) => {
                                                                      if (
                                                                        selectPassenger.some(
                                                                          (
                                                                            passenegr
                                                                          ) =>
                                                                            passenegr.passengerType ===
                                                                            im?.PassengerTypeCode
                                                                        )
                                                                      )
                                                                        return (
                                                                          <>
                                                                            {im?.Amount && (
                                                                              <>
                                                                                <span className="left">
                                                                                  {im?.PassengerTypeCode ===
                                                                                  "ADT"
                                                                                    ? "Adult"
                                                                                    : im?.PassengerTypeCode ===
                                                                                      "CNN"
                                                                                    ? "Child"
                                                                                    : im?.PassengerTypeCode ===
                                                                                      "CHD"
                                                                                    ? "Child"
                                                                                    : im?.PassengerTypeCode ===
                                                                                      "INF"
                                                                                    ? "Infant"
                                                                                    : ""}{" "}
                                                                                  :{" "}
                                                                                  <span className="ms-1 font-size">
                                                                                    {im?.Amount +
                                                                                      " " +
                                                                                      im?.Units}
                                                                                  </span>
                                                                                </span>
                                                                                <br></br>
                                                                              </>
                                                                            )}
                                                                          </>
                                                                        );
                                                                    }
                                                                  )}
                                                                </td>
                                                                <td className="align-middle">
                                                                  7KG (max 1
                                                                  Bag)
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                      </>
                                                    );
                                                  })}
                                                </div>
                                              );
                                            })}
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <>
                                    {isFareHide === false ? (
                                      <div className="table-responsive mt-3">
                                        <table
                                          class="table table-bordered table-sm text-end mt-1"
                                          style={{ fontSize: "14px" }}
                                        >
                                          <thead className="text-end">
                                            <tr>
                                              <th
                                                colspan={
                                                  isFareChange === false
                                                    ? "8"
                                                    : "7"
                                                }
                                                className="fw-bold text-start py-2 bg-light"
                                              >
                                                Fare Details
                                              </th>
                                            </tr>
                                            <tr>
                                              <th className="text-start">
                                                Type
                                              </th>
                                              <th>Base Fare</th>
                                              <th>Tax</th>
                                              <th>AIT</th>
                                              {isFareChange === false && (
                                                <th>Commission</th>
                                              )}
                                              <th>Additional Collection</th>
                                              <th>Person</th>
                                              <th>Total</th>
                                            </tr>
                                          </thead>
                                          <tbody className="text-end">
                                            {ticketingList.fareBreakdown?.map(
                                              (item, index) => {
                                                return (
                                                  <>
                                                    {item.passengerType ===
                                                      "ADT" &&
                                                    selectPassenger.some(
                                                      (itm) =>
                                                        itm.passengerType ===
                                                        item.passengerType
                                                    ) ? (
                                                      <>
                                                        <tr>
                                                          <td className="text-start">
                                                            Adult
                                                          </td>
                                                          <td>
                                                            {item.basePrice?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          <td>
                                                            {item.tax?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>

                                                          <td>
                                                            {item.ait?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          {isFareChange ===
                                                            false && (
                                                            <td>
                                                              {item.discount?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                            </td>
                                                          )}
                                                          <td>
                                                            {item.reissueCharge}
                                                          </td>
                                                          <td>
                                                            {item.passengerCount -
                                                              unSelectPassenger.filter(
                                                                (num) =>
                                                                  num.passengerType ===
                                                                  "ADT"
                                                              ).length}
                                                          </td>
                                                          <td className="fw-bold">
                                                            {item.currencyName}{" "}
                                                            {isFareChange ===
                                                            false
                                                              ? (
                                                                  item.totalPrice *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "ADT"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )
                                                              : (
                                                                  (item.totalPrice -
                                                                    item.discount) *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "ADT"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    ) : item.passengerType ===
                                                        "CHD" &&
                                                      selectPassenger.some(
                                                        (itm) =>
                                                          itm.passengerType ===
                                                          item.passengerType
                                                      ) ? (
                                                      <>
                                                        <tr>
                                                          <td className="text-start">
                                                            Child &gt; 5
                                                          </td>
                                                          <td>
                                                            {item.basePrice?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          <td>
                                                            {item.tax?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>

                                                          <td>
                                                            {item.ait?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          {isFareChange ===
                                                            false && (
                                                            <td>
                                                              {item.discount?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                            </td>
                                                          )}
                                                          <td>
                                                            {item.reissueCharge}
                                                          </td>
                                                          <td>
                                                            {item.passengerCount -
                                                              unSelectPassenger.filter(
                                                                (num) =>
                                                                  num.passengerType ===
                                                                  "CHD"
                                                              ).length}
                                                          </td>
                                                          <td className="fw-bold">
                                                            {item.currencyName}{" "}
                                                            {/* {(
                                item.totalPrice *
                                item.passengerCount
                              )?.toLocaleString("en-US")} */}
                                                            {isFareChange ===
                                                            false
                                                              ? (
                                                                  item.totalPrice *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "CHD"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )
                                                              : (
                                                                  (item.totalPrice -
                                                                    item.discount) *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "CHD"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    ) : item.passengerType ===
                                                        "CNN" &&
                                                      selectPassenger.some(
                                                        (itm) =>
                                                          itm.passengerType ===
                                                          item.passengerType
                                                      ) ? (
                                                      <>
                                                        <tr>
                                                          <td className="text-start">
                                                            {" "}
                                                            {item.passengerType ===
                                                              "CNN" &&
                                                            ticketingList.fareBreakdown?.some(
                                                              (item) =>
                                                                item.passengerType ===
                                                                "CHD"
                                                            )
                                                              ? "Child < 5"
                                                              : "Child"}
                                                          </td>
                                                          <td>
                                                            {item.basePrice?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          <td>
                                                            {item.tax?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>

                                                          <td>
                                                            {item.ait?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          {isFareChange ===
                                                            false && (
                                                            <td>
                                                              {item.discount?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                            </td>
                                                          )}
                                                          <td>
                                                            {item.reissueCharge}
                                                          </td>
                                                          <td>
                                                            {item.passengerCount -
                                                              unSelectPassenger.filter(
                                                                (num) =>
                                                                  num.passengerType ===
                                                                  "CNN"
                                                              ).length}
                                                          </td>
                                                          <td className="fw-bold">
                                                            {item.currencyName}{" "}
                                                            {isFareChange ===
                                                            false
                                                              ? (
                                                                  item.totalPrice *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "CNN"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )
                                                              : (
                                                                  (item.totalPrice -
                                                                    item.discount) *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "CNN"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    ) : item.passengerType ===
                                                        "INF" &&
                                                      selectPassenger.some(
                                                        (itm) =>
                                                          itm.passengerType ===
                                                          item.passengerType
                                                      ) ? (
                                                      <>
                                                        <tr>
                                                          <td className="text-start">
                                                            Infant
                                                          </td>
                                                          <td>
                                                            {item.basePrice?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          <td>
                                                            {item.tax?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>

                                                          <td>
                                                            {item.ait?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          {isFareChange ===
                                                            false && (
                                                            <td>
                                                              {item.discount?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                            </td>
                                                          )}
                                                          <td>
                                                            {item.reissueCharge}
                                                          </td>
                                                          <td>
                                                            {item.passengerCount -
                                                              unSelectPassenger.filter(
                                                                (num) =>
                                                                  num.passengerType ===
                                                                  "INF"
                                                              ).length}
                                                          </td>
                                                          <td className="fw-bold">
                                                            {item.currencyName}{" "}
                                                            {isFareChange ===
                                                            false
                                                              ? (
                                                                  item.totalPrice *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "INF"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )
                                                              : (
                                                                  (item.totalPrice -
                                                                    item.discount) *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "INF"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </>
                                                );
                                              }
                                            )}
                                            <tr className="fw-bold">
                                              <td
                                                colSpan={
                                                  isFareChange === false ? 6 : 5
                                                }
                                                className="border-none"
                                              ></td>
                                              <td>Additional Collection</td>
                                              <td>
                                                {ticketingList?.passengerInfo !==
                                                  undefined &&
                                                ticketingList?.passengerInfo !==
                                                  " " &&
                                                ticketingList?.passengerInfo !==
                                                  null
                                                  ? ticketingList
                                                      .passengerInfo[0]
                                                      ?.currencyName
                                                  : ""}{" "}
                                                {/* {
                            ticketingList?.penalty[0]?.reissueCharge.toLocaleString("en-US")
                          } */}
                                                {sumAdditinalPrice(
                                                  ticketingList.fareBreakdown
                                                )?.toLocaleString("en-US")}
                                              </td>
                                            </tr>

                                            {totalextraServicePnrData > 0 && (
                                              <tr className="fw-bold">
                                                <td
                                                  colSpan={
                                                    isFareChange === false
                                                      ? 6
                                                      : 5
                                                  }
                                                  className="border-none"
                                                ></td>
                                                <td>
                                                  Total Ticket Import Service
                                                  Charge
                                                </td>
                                                <td>
                                                  {totalextraServicePnrData?.toLocaleString(
                                                    "en-US"
                                                  )}
                                                </td>
                                              </tr>
                                            )}

                                            <tr className="fw-bold">
                                              <td
                                                colSpan={
                                                  isFareChange === false ? 6 : 5
                                                }
                                                className="border-none"
                                              ></td>
                                              <td>Grand Total</td>
                                              <td>
                                                {ticketingList?.passengerInfo !==
                                                  undefined &&
                                                ticketingList?.passengerInfo !==
                                                  " " &&
                                                ticketingList?.passengerInfo !==
                                                  null
                                                  ? ticketingList
                                                      .passengerInfo[0]
                                                      ?.currencyName
                                                  : ""}{" "}
                                                {ticketingList?.penalty
                                                  ?.length > 0 ? (
                                                  <>
                                                    {isFareChange === false
                                                      ? (
                                                          sumRatingForPassengerTicket(
                                                            ticketingList.fareBreakdown,
                                                            unSelectPassenger
                                                          ) +
                                                          sumAdditinalPrice(
                                                            ticketingList.fareBreakdown
                                                          ) +
                                                          totalextraServicePnrData
                                                        )?.toLocaleString(
                                                          "en-US"
                                                        )
                                                      : (
                                                          sumRatingForPassengerTicketGross(
                                                            ticketingList.fareBreakdown,
                                                            unSelectPassenger
                                                          ) +
                                                          sumAdditinalPrice(
                                                            ticketingList.fareBreakdown
                                                          ) +
                                                          totalextraServicePnrData
                                                        )?.toLocaleString(
                                                          "en-US"
                                                        )}
                                                  </>
                                                ) : (
                                                  <>
                                                    {isFareChange === false
                                                      ? (
                                                          sumRatingForPassengerTicket(
                                                            ticketingList.fareBreakdown,
                                                            unSelectPassenger
                                                          ) +
                                                          totalextraServicePnrData
                                                        )?.toLocaleString(
                                                          "en-US"
                                                        )
                                                      : (
                                                          sumRatingForPassengerTicketGross(
                                                            ticketingList.fareBreakdown,
                                                            unSelectPassenger
                                                          ) +
                                                          totalextraServicePnrData
                                                        )?.toLocaleString(
                                                          "en-US"
                                                        )}
                                                  </>
                                                )}
                                              </td>
                                            </tr>

                                            {ticketingList?.penalty?.length >
                                            0 ? (
                                              <>
                                                <tr className="fw-bold">
                                                  <td
                                                    colSpan={
                                                      isFareChange === false
                                                        ? 6
                                                        : 5
                                                    }
                                                    className="border-none"
                                                  ></td>
                                                  <td>Exchange Penalty</td>
                                                  <td>
                                                    {ticketingList?.passengerInfo !==
                                                      undefined &&
                                                    ticketingList?.passengerInfo !==
                                                      " " &&
                                                    ticketingList?.passengerInfo !==
                                                      null
                                                      ? ticketingList
                                                          .passengerInfo[0]
                                                          ?.currencyName
                                                      : ""}{" "}
                                                    {ticketingList?.penalty[0]?.panalty?.toLocaleString(
                                                      "en-US"
                                                    )}
                                                  </td>
                                                </tr>
                                              </>
                                            ) : (
                                              <> </>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                  </>

                                  {extraServices &&
                                  extraServices?.length > 0 ? (
                                    <div className="table-responsive mt-3">
                                      <div
                                        className="ps-1 py-2 fw-bold text-start"
                                        style={{
                                          fontSize: "14px",
                                          backgroundColor: "#c3c2c2",
                                        }}
                                      >
                                        Extra Services Details
                                      </div>

                                      <table
                                        class="table table-bordered table-sm text-end mt-1"
                                        style={{ fontSize: "14px" }}
                                      >
                                        <thead className="text-end">
                                          <tr>
                                            <th
                                              colspan="4"
                                              className="fw-bold text-start py-2 bg-light"
                                            >
                                              Extra Services Details
                                            </th>
                                          </tr>
                                          <tr>
                                            <th className="text-start">
                                              Passenger Name
                                            </th>
                                            <th>Type Of Services</th>
                                            <th>Segment</th>
                                            <th>Service Name</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-end">
                                          {extraServices?.map((item) =>
                                            item?.map((exService, idx) => {
                                              return (
                                                <tr key={idx}>
                                                  <>
                                                    <td className="text-start">
                                                      {ticketingList?.passengerInfo?.map(
                                                        (paxId) => {
                                                          return (
                                                            <>
                                                              {paxId.paxId ===
                                                                exService.fK_PaxId &&
                                                                paxId?.title +
                                                                  " " +
                                                                  paxId?.first +
                                                                  " " +
                                                                  paxId?.last}
                                                            </>
                                                          );
                                                        }
                                                      )}
                                                    </td>
                                                    <td>
                                                      {exService.typeOfServices}
                                                    </td>
                                                    <td>{exService.segment}</td>
                                                    <td>{exService.name}</td>
                                                  </>
                                                </tr>
                                              );
                                            })
                                          )}
                                          <tr className="fw-bold">
                                            <td
                                              colSpan={2}
                                              className="border-none"
                                            ></td>
                                            <td>Grand Total</td>
                                            <td>
                                              {total?.toLocaleString("en-US")}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <></>
                                  )}

                                  {!contactInfo && (
                                    <div className="table-responsive">
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
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-center">
                                          {ticketingList?.passengerInfo?.map(
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
                                                              (item) =>
                                                                item.city
                                                            )}
                                                        </td>
                                                        <td>
                                                          {
                                                            ticketingList
                                                              ?.ticketInfo
                                                              ?.leadPaxEmail
                                                          }
                                                        </td>
                                                        <td>
                                                          {item.phoneCountryCode +
                                                            item.phone}{" "}
                                                        </td>
                                                      </tr>
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
                                  )}

                                  <div className="mt-3 pb-2">
                                    <div
                                      className="ps-1 py-2 fw-bold text-start border bg-light"
                                      style={{
                                        fontSize: "13px",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      Important Notice
                                    </div>
                                    <table
                                      class="table table-bordered table-sm text-end mt-1 mb-0"
                                      style={{ fontSize: "13px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th className="text-start">
                                            E-Ticket Notice:
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="text-start">
                                          <p className="border-0">
                                            Carriage and other services provided
                                            by the carrier are subject to
                                            conditions of carriage which are
                                            hereby incorporated by reference.
                                            These conditions may be obtained
                                            from the issuing carrier.
                                          </p>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      class="table table-bordered table-sm text-end  mb-0"
                                      style={{ fontSize: "13px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th className="text-start">
                                            Passport/Visa/Health:
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="text-start">
                                          <p className="border-0">
                                            Please ensure that you have all the
                                            required travel documents for your
                                            entire journey - i.e. valid passport
                                            & necessary Visas - and that you
                                            have had the recommended
                                            vaccinations/immunizations for your
                                            destination's.
                                          </p>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      class="table table-bordered table-sm text-end mb-0"
                                      style={{ fontSize: "13px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th className="text-start">
                                            Carry-on Baggage Allowance:
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="text-start">
                                          <p className="border-0">
                                            LIMIT: 1 Carry-On bag per passenger
                                            / SIZE LIMIT: 22in x 15in x 8in
                                            (L+W+H=45 inches) / WEIGHT LIMIT:
                                            Max weight 7 kg / 15 lb
                                          </p>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      class="table table-bordered table-sm text-end  mb-0"
                                      style={{ fontSize: "13px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th className="text-start">
                                            Reporting Time:
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="text-start">
                                          <p className="border-0">
                                            Flights open for check-in 1 hour
                                            before scheduled departure time on
                                            domestic flights and 3 hours before
                                            scheduled departure time on
                                            international flights. Passengers
                                            must check-in 1 hour before flight
                                            departure. Check-in counters close
                                            30 minutes before flight departure
                                            for domestic, and 90 minutes before
                                            the scheduled departure for
                                            international flights.
                                          </p>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>

                              <div style={{ pageBreakAfter: "always" }}></div>

                              <div className="card-body" ref={componentRef}>
                                <div
                                  className="px-lg-5 px-md-5 px-sm-1 p-3"
                                  ref={donwloadRef}
                                >
                                  <h4 className="text-center pb-2">E-Ticket</h4>

                                  {!isAgentInfo && (
                                    <div className="table-responsive mt-2">
                                      <table class="table table-borderless table-sm">
                                        <tbody>
                                          <tr>
                                            {/* FIXED COMPANY LOGO */}
                                            {/* CHANGE THIS LATER */}
                                            <td className="text-start">
                                              {ticketingList.ticketInfo
                                                ?.agentLogo !== null ? (
                                                <>
                                                  {/* <img
                                  alt="img01"
                                  src={
                                    environment.s3URL +
                                    `${ticketingList.ticketInfo?.agentLogo}`
                                  }
                                  crossOrigin="true"
                                  style={{ width: "160px" }}
                                ></img> */}
                                                  <ImageComponentForAgent
                                                    logo={
                                                      ticketingList.ticketInfo
                                                        ?.agentLogo
                                                    }
                                                  />
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
                                                  <span
                                                    style={{ fontSize: "8px" }}
                                                  >
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
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  )}

                                  <Box
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                    flexWrap={"wrap"}
                                    style={{ fontSize: "14px" }}
                                  >
                                    <div>
                                      <br></br>
                                      <Text>
                                        Booking ID :{" "}
                                        <span className="fw-bold">
                                          {
                                            ticketingListReturn.ticketInfo
                                              ?.uniqueTransID
                                          }
                                        </span>
                                      </Text>
                                    </div>

                                    <div>
                                      <Text>
                                        GDS PNR :{" "}
                                        <span className="fw-bold">
                                          {ticketingListReturn.ticketInfo?.pnr}
                                        </span>
                                      </Text>
                                      <Text>
                                        Airline PNR:{" "}
                                        <span className="fw-bold">
                                          {ticketingListReturn.ticketInfo
                                            ?.airlinePNRs === "" ||
                                          ticketingListReturn.ticketInfo
                                            ?.airlinePNRs === null
                                            ? ticketingListReturn.ticketInfo
                                                ?.pnr
                                            : ticketingListReturn.ticketInfo
                                                ?.airlinePNRs}
                                        </span>
                                      </Text>
                                    </div>
                                  </Box>

                                  <div className="table-responsive mt-2">
                                    <table
                                      class="table table-bordered table-sm mt-1"
                                      style={{ fontSize: "14px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th
                                            colspan="5"
                                            className="fw-bold py-2 bg-light"
                                          >
                                            Passenger Information
                                          </th>
                                        </tr>
                                        <tr className="text-center">
                                          <th className="text-start">Name</th>
                                          <th>Type</th>
                                          <th>E-Ticket Number</th>
                                          {/* <th>Booking ID</th> */}
                                          <th>Ticket Issue Date</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {ticketingListReturn.passengerInfo?.map(
                                          (item, index) => {
                                            if (
                                              selectPassengerReturn.includes(
                                                item
                                              )
                                            ) {
                                              return (
                                                <tr
                                                  className="text-center"
                                                  style={{ lineHeight: "14px" }}
                                                >
                                                  <td
                                                    className="text-start"
                                                    style={{ fontSize: "15px" }}
                                                  >
                                                    {item.title.toUpperCase()}{" "}
                                                    {item.first.toUpperCase()}{" "}
                                                    {item.last.toUpperCase()}
                                                  </td>
                                                  <td>
                                                    {item.passengerType ===
                                                    "ADT"
                                                      ? "Adult"
                                                      : item.passengerType ===
                                                        "CNN"
                                                      ? "Child"
                                                      : item.passengerType ===
                                                        "CHD"
                                                      ? "Child"
                                                      : item.passengerType ===
                                                        "INF"
                                                      ? "Infant"
                                                      : ""}
                                                  </td>
                                                  <td>{item.ticketNumbers}</td>
                                                  <td>
                                                    {" "}
                                                    {moment(
                                                      ticketingList.ticketInfo
                                                        ?.issueDate
                                                    ).format("ddd, DD MMM,YY")}
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="table-responsive mt-3">
                                    <div
                                      className="ps-1 py-2 fw-bold text-start bg-light border"
                                      style={{
                                        fontSize: "14px",
                                      }}
                                    >
                                      Flight Details
                                    </div>
                                    <div className="">
                                      <div
                                        className="border p-1"
                                        style={{ fontSize: "14px" }}
                                      >
                                        {ticketingListReturn?.directions ===
                                        undefined ? (
                                          <>
                                            {finalSegmentReturn.map(
                                              (item, index) => {
                                                return (
                                                  <div className="border my-1 p-1">
                                                    {item.map((itm, idx) => {
                                                      let baggage = JSON.parse(
                                                        itm.baggageInfo
                                                      );
                                                      return (
                                                        <>
                                                          <span className="fw-bold">
                                                            {airports
                                                              .filter(
                                                                (f) =>
                                                                  f.iata ===
                                                                  itm.origin
                                                              )
                                                              .map(
                                                                (itm) =>
                                                                  itm.city
                                                              )}{" "}
                                                            ({itm.origin})
                                                          </span>
                                                          <span className="mx-2 fw-bold">
                                                            <i class="fas fa-arrow-right"></i>
                                                          </span>
                                                          <span className="fw-bold">
                                                            {airports
                                                              .filter(
                                                                (f) =>
                                                                  f.iata ===
                                                                  itm.destination
                                                              )
                                                              .map(
                                                                (itm) =>
                                                                  itm.city
                                                              )}{" "}
                                                            ({itm.destination})
                                                          </span>
                                                          <span className="d-flex align-items-center fw-bold">
                                                            {/* <img
                                          src={
                                            environment.s3ArliensImage +
                                            `${itm.operationCarrier}.png`
                                          }
                                          className="me-2"
                                          alt=""
                                          width="30px"
                                          height="30px"
                                          crossOrigin="true"
                                        ></img> */}
                                                            <ImageComponentTicket
                                                              logo={
                                                                itm.operationCarrier
                                                              }
                                                            />
                                                            {
                                                              itm.operationCarrierName
                                                            }{" "}
                                                            (
                                                            {
                                                              itm.operationCarrier
                                                            }
                                                            -{itm.flightNumber})
                                                          </span>

                                                          <div className="table-responsive mt-3">
                                                            <table
                                                              class="table table-borderless table-sm mt-1"
                                                              style={{
                                                                fontSize:
                                                                  "14px",
                                                              }}
                                                            >
                                                              <thead>
                                                                <tr>
                                                                  <th className="p-0">
                                                                    <p
                                                                      className="py-1 ps-1"
                                                                      style={{
                                                                        backgroundColor:
                                                                          "#ededed",
                                                                      }}
                                                                    >
                                                                      Date
                                                                    </p>
                                                                  </th>
                                                                  <th className="p-0">
                                                                    <p
                                                                      className="py-1 ps-1"
                                                                      style={{
                                                                        backgroundColor:
                                                                          "#ededed",
                                                                      }}
                                                                    >
                                                                      Time
                                                                    </p>
                                                                  </th>
                                                                  <th className="p-0">
                                                                    <p
                                                                      className="py-1 ps-1"
                                                                      style={{
                                                                        backgroundColor:
                                                                          "#ededed",
                                                                      }}
                                                                    >
                                                                      Flight
                                                                      Info
                                                                    </p>
                                                                  </th>
                                                                  <th className="p-0">
                                                                    <p
                                                                      className="py-1 ps-1"
                                                                      style={{
                                                                        backgroundColor:
                                                                          "#ededed",
                                                                      }}
                                                                    >
                                                                      Flight
                                                                      Time
                                                                    </p>
                                                                  </th>
                                                                  <th className="p-0">
                                                                    <p
                                                                      className="py-1 ps-1"
                                                                      style={{
                                                                        backgroundColor:
                                                                          "#ededed",
                                                                      }}
                                                                    >
                                                                      Cabin
                                                                    </p>
                                                                  </th>
                                                                  <th className="p-0">
                                                                    <p
                                                                      className="py-1 ps-1"
                                                                      style={{
                                                                        backgroundColor:
                                                                          "#ededed",
                                                                      }}
                                                                    >
                                                                      Checked
                                                                      Baggage
                                                                    </p>
                                                                  </th>
                                                                  <th className="p-0">
                                                                    <p
                                                                      className="py-1 ps-1"
                                                                      style={{
                                                                        backgroundColor:
                                                                          "#ededed",
                                                                      }}
                                                                    >
                                                                      Cabin
                                                                      Baggage
                                                                    </p>
                                                                  </th>
                                                                </tr>
                                                              </thead>
                                                              <tbody>
                                                                <tr>
                                                                  <td>
                                                                    {moment(
                                                                      itm.departure
                                                                    ).format(
                                                                      "ddd DD MMM,YY "
                                                                    )}
                                                                    <br></br>
                                                                    {moment(
                                                                      itm.arrival
                                                                    ).format(
                                                                      "ddd DD MMM,YY "
                                                                    )}
                                                                  </td>
                                                                  <td>
                                                                    {moment(
                                                                      itm.departure
                                                                    ).format(
                                                                      "HH:mm"
                                                                    )}
                                                                    <br></br>
                                                                    {moment(
                                                                      itm.arrival
                                                                    ).format(
                                                                      "HH:mm"
                                                                    )}
                                                                  </td>
                                                                  <td>
                                                                    Departs{" "}
                                                                    <span className="fw-bold">
                                                                      {airports
                                                                        .filter(
                                                                          (f) =>
                                                                            f.iata ===
                                                                            itm.origin
                                                                        )
                                                                        .map(
                                                                          (
                                                                            itm
                                                                          ) =>
                                                                            itm.city
                                                                        )}{" "}
                                                                      (
                                                                      {
                                                                        itm.origin
                                                                      }
                                                                      )
                                                                      {itm?.originTerminal && (
                                                                        <>
                                                                          Terminal-(
                                                                          {
                                                                            itm?.originTerminal
                                                                          }
                                                                          )
                                                                        </>
                                                                      )}
                                                                    </span>
                                                                    <br></br>
                                                                    Arrival{" "}
                                                                    <span className="fw-bold">
                                                                      {airports
                                                                        .filter(
                                                                          (f) =>
                                                                            f.iata ===
                                                                            itm.destination
                                                                        )
                                                                        .map(
                                                                          (
                                                                            itm
                                                                          ) =>
                                                                            itm.city
                                                                        )}{" "}
                                                                      (
                                                                      {
                                                                        itm.destination
                                                                      }
                                                                      )
                                                                      {itm?.destinationTerminal && (
                                                                        <>
                                                                          Terminal-(
                                                                          {
                                                                            itm?.destinationTerminal
                                                                          }
                                                                          )
                                                                        </>
                                                                      )}
                                                                    </span>
                                                                  </td>
                                                                  <td className="align-middle">
                                                                    {
                                                                      itm.travelTime
                                                                    }
                                                                  </td>
                                                                  <td className="align-middle">
                                                                    {
                                                                      itm.cabinClass
                                                                    }
                                                                    (
                                                                    {
                                                                      itm.bookingCode
                                                                    }
                                                                    )
                                                                  </td>
                                                                  <td className="align-middle">
                                                                    {baggage?.map(
                                                                      (
                                                                        im,
                                                                        idx
                                                                      ) => {
                                                                        if (
                                                                          selectPassenger.some(
                                                                            (
                                                                              passenegr
                                                                            ) =>
                                                                              passenegr.passengerType ===
                                                                              im?.PassengerTypeCode
                                                                          )
                                                                        )
                                                                          return (
                                                                            <>
                                                                              {im?.Amount && (
                                                                                <>
                                                                                  <span className="left">
                                                                                    {im?.PassengerTypeCode ===
                                                                                    "ADT"
                                                                                      ? "Adult"
                                                                                      : im?.PassengerTypeCode ===
                                                                                        "CNN"
                                                                                      ? "Child"
                                                                                      : im?.PassengerTypeCode ===
                                                                                        "CHD"
                                                                                      ? "Child"
                                                                                      : im?.PassengerTypeCode ===
                                                                                        "INF"
                                                                                      ? "Infant"
                                                                                      : ""}{" "}
                                                                                    :{" "}
                                                                                    <span className="ms-1 font-size">
                                                                                      {im?.Amount +
                                                                                        " " +
                                                                                        im?.Units}
                                                                                    </span>
                                                                                  </span>
                                                                                  <br></br>
                                                                                </>
                                                                              )}
                                                                            </>
                                                                          );
                                                                      }
                                                                    )}
                                                                  </td>
                                                                  <td className="align-middle">
                                                                    7KG (max 1
                                                                    Bag)
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                          </div>
                                                        </>
                                                      );
                                                    })}
                                                  </div>
                                                );
                                              }
                                            )}
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <>
                                    {isFareHide === false ? (
                                      <div className="table-responsive mt-3">
                                        <table
                                          class="table table-bordered table-sm text-end mt-1"
                                          style={{ fontSize: "14px" }}
                                        >
                                          <thead className="text-end">
                                            <tr>
                                              <th
                                                colspan={
                                                  isFareChange === false
                                                    ? "8"
                                                    : "7"
                                                }
                                                className="fw-bold text-start py-2 bg-light"
                                              >
                                                Fare Details
                                              </th>
                                            </tr>
                                            <tr>
                                              <th className="text-start">
                                                Type
                                              </th>
                                              <th>Base Fare</th>
                                              <th>Tax</th>
                                              <th>AIT</th>
                                              {isFareChange === false && (
                                                <th>Commission</th>
                                              )}
                                              <th>Additional Collection</th>
                                              <th>Person</th>
                                              <th>Total</th>
                                            </tr>
                                          </thead>
                                          <tbody className="text-end">
                                            {ticketingListReturn.fareBreakdown?.map(
                                              (item, index) => {
                                                return (
                                                  <>
                                                    {item.passengerType ===
                                                      "ADT" &&
                                                    selectPassenger.some(
                                                      (itm) =>
                                                        itm.passengerType ===
                                                        item.passengerType
                                                    ) ? (
                                                      <>
                                                        <tr>
                                                          <td className="text-start">
                                                            Adult
                                                          </td>
                                                          <td>
                                                            {item.basePrice?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          <td>
                                                            {item.tax?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>

                                                          <td>
                                                            {item.ait?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          {isFareChange ===
                                                            false && (
                                                            <td>
                                                              {item.discount?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                            </td>
                                                          )}
                                                          <td>
                                                            {item.reissueCharge}
                                                          </td>
                                                          <td>
                                                            {item.passengerCount -
                                                              unSelectPassenger.filter(
                                                                (num) =>
                                                                  num.passengerType ===
                                                                  "ADT"
                                                              ).length}
                                                          </td>
                                                          <td className="fw-bold">
                                                            {item.currencyName}{" "}
                                                            {isFareChange ===
                                                            false
                                                              ? (
                                                                  item.totalPrice *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "ADT"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )
                                                              : (
                                                                  (item.totalPrice -
                                                                    item.discount) *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "ADT"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    ) : item.passengerType ===
                                                        "CHD" &&
                                                      selectPassenger.some(
                                                        (itm) =>
                                                          itm.passengerType ===
                                                          item.passengerType
                                                      ) ? (
                                                      <>
                                                        <tr>
                                                          <td className="text-start">
                                                            Child &gt; 5
                                                          </td>
                                                          <td>
                                                            {item.basePrice?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          <td>
                                                            {item.tax?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>

                                                          <td>
                                                            {item.ait?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          {isFareChange ===
                                                            false && (
                                                            <td>
                                                              {item.discount?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                            </td>
                                                          )}
                                                          <td>
                                                            {item.reissueCharge}
                                                          </td>
                                                          <td>
                                                            {item.passengerCount -
                                                              unSelectPassenger.filter(
                                                                (num) =>
                                                                  num.passengerType ===
                                                                  "CHD"
                                                              ).length}
                                                          </td>
                                                          <td className="fw-bold">
                                                            {item.currencyName}{" "}
                                                            {/* {(
                                item.totalPrice *
                                item.passengerCount
                              )?.toLocaleString("en-US")} */}
                                                            {isFareChange ===
                                                            false
                                                              ? (
                                                                  item.totalPrice *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "CHD"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )
                                                              : (
                                                                  (item.totalPrice -
                                                                    item.discount) *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "CHD"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    ) : item.passengerType ===
                                                        "CNN" &&
                                                      selectPassenger.some(
                                                        (itm) =>
                                                          itm.passengerType ===
                                                          item.passengerType
                                                      ) ? (
                                                      <>
                                                        <tr>
                                                          <td className="text-start">
                                                            {" "}
                                                            {item.passengerType ===
                                                              "CNN" &&
                                                            ticketingListReturn.fareBreakdown?.some(
                                                              (item) =>
                                                                item.passengerType ===
                                                                "CHD"
                                                            )
                                                              ? "Child < 5"
                                                              : "Child"}
                                                          </td>
                                                          <td>
                                                            {item.basePrice?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          <td>
                                                            {item.tax?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>

                                                          <td>
                                                            {item.ait?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          {isFareChange ===
                                                            false && (
                                                            <td>
                                                              {item.discount?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                            </td>
                                                          )}
                                                          <td>
                                                            {item.reissueCharge}
                                                          </td>
                                                          <td>
                                                            {item.passengerCount -
                                                              unSelectPassenger.filter(
                                                                (num) =>
                                                                  num.passengerType ===
                                                                  "CNN"
                                                              ).length}
                                                          </td>
                                                          <td className="fw-bold">
                                                            {item.currencyName}{" "}
                                                            {isFareChange ===
                                                            false
                                                              ? (
                                                                  item.totalPrice *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "CNN"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )
                                                              : (
                                                                  (item.totalPrice -
                                                                    item.discount) *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "CNN"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    ) : item.passengerType ===
                                                        "INF" &&
                                                      selectPassenger.some(
                                                        (itm) =>
                                                          itm.passengerType ===
                                                          item.passengerType
                                                      ) ? (
                                                      <>
                                                        <tr>
                                                          <td className="text-start">
                                                            Infant
                                                          </td>
                                                          <td>
                                                            {item.basePrice?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          <td>
                                                            {item.tax?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>

                                                          <td>
                                                            {item.ait?.toLocaleString(
                                                              "en-US"
                                                            )}
                                                          </td>
                                                          {isFareChange ===
                                                            false && (
                                                            <td>
                                                              {item.discount?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                            </td>
                                                          )}
                                                          <td>
                                                            {item.reissueCharge}
                                                          </td>
                                                          <td>
                                                            {item.passengerCount -
                                                              unSelectPassenger.filter(
                                                                (num) =>
                                                                  num.passengerType ===
                                                                  "INF"
                                                              ).length}
                                                          </td>
                                                          <td className="fw-bold">
                                                            {item.currencyName}{" "}
                                                            {isFareChange ===
                                                            false
                                                              ? (
                                                                  item.totalPrice *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "INF"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )
                                                              : (
                                                                  (item.totalPrice -
                                                                    item.discount) *
                                                                  (item.passengerCount -
                                                                    unSelectPassenger.filter(
                                                                      (num) =>
                                                                        num.passengerType ===
                                                                        "INF"
                                                                    ).length)
                                                                )?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </>
                                                );
                                              }
                                            )}
                                            <tr className="fw-bold">
                                              <td
                                                colSpan={
                                                  isFareChange === false ? 6 : 5
                                                }
                                                className="border-none"
                                              ></td>
                                              <td>Additional Collection</td>
                                              <td>
                                                {ticketingListReturn?.passengerInfo !==
                                                  undefined &&
                                                ticketingListReturn?.passengerInfo !==
                                                  " " &&
                                                ticketingListReturn?.passengerInfo !==
                                                  null
                                                  ? ticketingListReturn
                                                      .passengerInfo[0]
                                                      ?.currencyName
                                                  : ""}{" "}
                                                {/* {
                            ticketingList?.penalty[0]?.reissueCharge.toLocaleString("en-US")
                          } */}
                                                {sumAdditinalPrice(
                                                  ticketingListReturn.fareBreakdown
                                                )?.toLocaleString("en-US")}
                                              </td>
                                            </tr>

                                            {totalextraServicePnrData > 0 && (
                                              <tr className="fw-bold">
                                                <td
                                                  colSpan={
                                                    isFareChange === false
                                                      ? 6
                                                      : 5
                                                  }
                                                  className="border-none"
                                                ></td>
                                                <td>
                                                  Total Ticket Import Service
                                                  Charge
                                                </td>
                                                <td>
                                                  {totalextraServicePnrData?.toLocaleString(
                                                    "en-US"
                                                  )}
                                                </td>
                                              </tr>
                                            )}

                                            <tr className="fw-bold">
                                              <td
                                                colSpan={
                                                  isFareChange === false ? 6 : 5
                                                }
                                                className="border-none"
                                              ></td>
                                              <td>Grand Total</td>
                                              <td>
                                                {ticketingListReturn?.passengerInfo !==
                                                  undefined &&
                                                ticketingListReturn?.passengerInfo !==
                                                  " " &&
                                                ticketingListReturn?.passengerInfo !==
                                                  null
                                                  ? ticketingListReturn
                                                      .passengerInfo[0]
                                                      ?.currencyName
                                                  : ""}{" "}
                                                {ticketingListReturn?.penalty
                                                  ?.length > 0 ? (
                                                  <>
                                                    {isFareChange === false
                                                      ? (
                                                          sumRatingForPassengerTicket(
                                                            ticketingListReturn.fareBreakdown,
                                                            unSelectPassenger
                                                          ) +
                                                          sumAdditinalPrice(
                                                            ticketingListReturn.fareBreakdown
                                                          ) +
                                                          totalextraServicePnrData
                                                        )?.toLocaleString(
                                                          "en-US"
                                                        )
                                                      : (
                                                          sumRatingForPassengerTicketGross(
                                                            ticketingListReturn.fareBreakdown,
                                                            unSelectPassenger
                                                          ) +
                                                          sumAdditinalPrice(
                                                            ticketingListReturn.fareBreakdown
                                                          ) +
                                                          totalextraServicePnrData
                                                        )?.toLocaleString(
                                                          "en-US"
                                                        )}
                                                  </>
                                                ) : (
                                                  <>
                                                    {isFareChange === false
                                                      ? (
                                                          sumRatingForPassengerTicket(
                                                            ticketingListReturn.fareBreakdown,
                                                            unSelectPassenger
                                                          ) +
                                                          totalextraServicePnrData
                                                        )?.toLocaleString(
                                                          "en-US"
                                                        )
                                                      : (
                                                          sumRatingForPassengerTicketGross(
                                                            ticketingListReturn.fareBreakdown,
                                                            unSelectPassenger
                                                          ) +
                                                          totalextraServicePnrData
                                                        )?.toLocaleString(
                                                          "en-US"
                                                        )}
                                                  </>
                                                )}
                                              </td>
                                            </tr>

                                            {ticketingListReturn?.penalty
                                              ?.length > 0 ? (
                                              <>
                                                <tr className="fw-bold">
                                                  <td
                                                    colSpan={
                                                      isFareChange === false
                                                        ? 6
                                                        : 5
                                                    }
                                                    className="border-none"
                                                  ></td>
                                                  <td>Exchange Penalty</td>
                                                  <td>
                                                    {ticketingListReturn?.passengerInfo !==
                                                      undefined &&
                                                    ticketingListReturn?.passengerInfo !==
                                                      " " &&
                                                    ticketingListReturn?.passengerInfo !==
                                                      null
                                                      ? ticketingListReturn
                                                          .passengerInfo[0]
                                                          ?.currencyName
                                                      : ""}{" "}
                                                    {ticketingListReturn?.penalty[0]?.panalty?.toLocaleString(
                                                      "en-US"
                                                    )}
                                                  </td>
                                                </tr>
                                              </>
                                            ) : (
                                              <> </>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                  </>

                                  {extraServices &&
                                  extraServices?.length > 0 ? (
                                    <div className="table-responsive mt-3">
                                      <div
                                        className="ps-1 py-2 fw-bold text-start"
                                        style={{
                                          fontSize: "14px",
                                          backgroundColor: "#c3c2c2",
                                        }}
                                      >
                                        Extra Services Details
                                      </div>

                                      <table
                                        class="table table-bordered table-sm text-end mt-1"
                                        style={{ fontSize: "14px" }}
                                      >
                                        <thead className="text-end">
                                          <tr>
                                            <th
                                              colspan="4"
                                              className="fw-bold text-start py-2 bg-light"
                                            >
                                              Extra Services Details
                                            </th>
                                          </tr>
                                          <tr>
                                            <th className="text-start">
                                              Passenger Name
                                            </th>
                                            <th>Type Of Services</th>
                                            <th>Segment</th>
                                            <th>Service Name</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-end">
                                          {extraServices?.map((item) =>
                                            item?.map((exService, idx) => {
                                              return (
                                                <tr key={idx}>
                                                  <>
                                                    <td className="text-start">
                                                      {ticketingList?.passengerInfo?.map(
                                                        (paxId) => {
                                                          return (
                                                            <>
                                                              {paxId.paxId ===
                                                                exService.fK_PaxId &&
                                                                paxId?.title +
                                                                  " " +
                                                                  paxId?.first +
                                                                  " " +
                                                                  paxId?.last}
                                                            </>
                                                          );
                                                        }
                                                      )}
                                                    </td>
                                                    <td>
                                                      {exService.typeOfServices}
                                                    </td>
                                                    <td>{exService.segment}</td>
                                                    <td>{exService.name}</td>
                                                  </>
                                                </tr>
                                              );
                                            })
                                          )}
                                          <tr className="fw-bold">
                                            <td
                                              colSpan={2}
                                              className="border-none"
                                            ></td>
                                            <td>Grand Total</td>
                                            <td>
                                              {total?.toLocaleString("en-US")}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <></>
                                  )}

                                  {!contactInfo && (
                                    <div className="table-responsive">
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
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-center">
                                          {ticketingList?.passengerInfo?.map(
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
                                                              (item) =>
                                                                item.city
                                                            )}
                                                        </td>
                                                        <td>
                                                          {
                                                            ticketingList
                                                              ?.ticketInfo
                                                              ?.leadPaxEmail
                                                          }
                                                        </td>
                                                        <td>
                                                          {item.phoneCountryCode +
                                                            item.phone}{" "}
                                                        </td>
                                                      </tr>
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
                                  )}

                                  <div className="mt-3 pb-2">
                                    <div
                                      className="ps-1 py-2 fw-bold text-start border bg-light"
                                      style={{
                                        fontSize: "13px",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      Important Notice
                                    </div>
                                    <table
                                      class="table table-bordered table-sm text-end mt-1 mb-0"
                                      style={{ fontSize: "13px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th className="text-start">
                                            E-Ticket Notice:
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="text-start">
                                          <p className="border-0">
                                            Carriage and other services provided
                                            by the carrier are subject to
                                            conditions of carriage which are
                                            hereby incorporated by reference.
                                            These conditions may be obtained
                                            from the issuing carrier.
                                          </p>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      class="table table-bordered table-sm text-end  mb-0"
                                      style={{ fontSize: "13px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th className="text-start">
                                            Passport/Visa/Health:
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="text-start">
                                          <p className="border-0">
                                            Please ensure that you have all the
                                            required travel documents for your
                                            entire journey - i.e. valid passport
                                            & necessary Visas - and that you
                                            have had the recommended
                                            vaccinations/immunizations for your
                                            destination's.
                                          </p>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      class="table table-bordered table-sm text-end mb-0"
                                      style={{ fontSize: "13px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th className="text-start">
                                            Carry-on Baggage Allowance:
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="text-start">
                                          <p className="border-0">
                                            LIMIT: 1 Carry-On bag per passenger
                                            / SIZE LIMIT: 22in x 15in x 8in
                                            (L+W+H=45 inches) / WEIGHT LIMIT:
                                            Max weight 7 kg / 15 lb
                                          </p>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      class="table table-bordered table-sm text-end  mb-0"
                                      style={{ fontSize: "13px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th className="text-start">
                                            Reporting Time:
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="text-start">
                                          <p className="border-0">
                                            Flights open for check-in 1 hour
                                            before scheduled departure time on
                                            domestic flights and 3 hours before
                                            scheduled departure time on
                                            international flights. Passengers
                                            must check-in 1 hour before flight
                                            departure. Check-in counters close
                                            30 minutes before flight departure
                                            for domestic, and 90 minutes before
                                            the scheduled departure for
                                            international flights.
                                          </p>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {ticketingList?.ticketInfo?.status === "Issued" && (
                          <Box
                            display={"flex"}
                            // flexDir={"column"}
                            flexWrap={'wrap'}
                            justifyContent={"center"}
                            alignItems={"center"}
                            gap={3}
                            className="pb-5"
                          >
                            <button
                              className="btn button-color text-white float-right mr-1 d-print-none border-radius px-5 w-auto"
                              onClick={() => {
                                if (journeyType === "ONWARD") {
                                  window.open(
                                    "/create-refund?uniqueTransId=" +
                                      ticketingList?.ticketInfo?.uniqueTransID
                                  );
                                } else {
                                  window.open(
                                    "/create-refund?uniqueTransId=" +
                                      ticketingListReturn?.ticketInfo
                                        ?.uniqueTransID
                                  );
                                }
                              }}
                            >
                              <span className="me-1">
                                <Icon as={FaRecycle} pb="4px" height={"20px"} />
                              </span>
                              Refund Request
                            </button>

                       
                            <button
                            className="btn button-color text-white float-right mr-1 d-print-none border-radius px-5  mt-0 w-lg-25 w-sm-none"
                            onClick={() => {
                              navigate(
                                "/create-void?uniqueTransId=" +
                                  searchParams.get("utid")
                              );
                            }}
                          >
                            <span className="me-1">
                              <Icon as={FaRecycle} pb="4px" height={"20px"} />
                            </span>
                            Void Request
                          </button>
                            {/* <button
                              className="btn button-color text-white float-right mr-1 d-print-none border-radius px-5 w-auto"
                              onClick={() => {
                                if (journeyType === "ONWARD") {
                                  window.open(
                                    "/create-reissue?uniqueTransId=" +
                                      ticketingList?.ticketInfo?.uniqueTransID
                                  );
                                } else {
                                  window.open(
                                    "/create-reissue?uniqueTransId=" +
                                      ticketingListReturn?.ticketInfo
                                        ?.uniqueTransID
                                  );
                                }
                              }}
                            >
                              <span className="me-1">
                                <Icon
                                  as={SiStarlingbank}
                                  pb="4px"
                                  height={"20px"}
                                />
                              </span>
                              Reissue Request
                            </button> */}
                          </Box>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div
            className="modal fade"
            id="priceModal"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Price</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <table className="table table-bordered table-hover table-responsive ">
                    <thead style={{ background: "#7c04c0", color: "white" }}>
                      <tr>
                        <th style={{ minWidth: "150px" }}>Passenger Type</th>
                        <th style={{ minWidth: "150px" }}>Base Fare</th>
                        <th style={{ minWidth: "150px" }}>Tax</th>
                        <th style={{ minWidth: "150px" }}>AIT</th>
                        <th style={{ minWidth: "150px" }}>Commission</th>
                        <th style={{ minWidth: "150px" }}>Total Fare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passengerListEdited?.map((item, index) => {
                        return (
                          <>
                            <tr>
                              <td style={{ minWidth: "150px" }}>
                                {getPassengerType(
                                  item.passengerType,
                                  passengerListEdited
                                )}
                              </td>
                              <td style={{ minWidth: "150px" }}>
                                <input
                                  onKeyDown={preventNegativeValues}
                                  value={Math.abs(item.basePrice)}
                                  type={"number"}
                                  onChange={(e) =>
                                    setPassengerListEdited((ob) =>
                                      produce(ob, (v) => {
                                        v[index].basePrice = Math.abs(
                                          e.target.value
                                        );
                                      })
                                    )
                                  }
                                  className="form-control"
                                />
                              </td>
                              <td style={{ minWidth: "150px" }}>
                                <input
                                  onKeyDown={preventNegativeValues}
                                  value={Math.abs(item.tax)}
                                  type={"number"}
                                  onChange={(e) =>
                                    setPassengerListEdited((ob) =>
                                      produce(ob, (v) => {
                                        v[index].tax = Math.abs(e.target.value);
                                      })
                                    )
                                  }
                                  className="form-control"
                                />
                              </td>
                              <td style={{ minWidth: "150px" }}>
                                <input
                                  onKeyDown={preventNegativeValues}
                                  value={Math.round(item.ait)}
                                  type={"number"}
                                  onChange={(e) =>
                                    setPassengerListEdited((ob) =>
                                      produce(ob, (v) => {
                                        v[index].ait = Math.round(
                                          e.target.value
                                        );
                                      })
                                    )
                                  }
                                  className="form-control"
                                />
                              </td>
                              <td style={{ minWidth: "150px" }}>
                                <input
                                  value={Math.abs(item.discount)}
                                  id="number"
                                  type="number"
                                  min={0}
                                  onKeyDown={preventNegativeValues}
                                  onChange={(e) =>
                                    setPassengerListEdited((ob) =>
                                      produce(ob, (v) => {
                                        v[index].discount = e.target.value;
                                      })
                                    )
                                  }
                                  className="form-control"
                                  placeholder="0"
                                />
                              </td>
                              <td
                                className="text-end"
                                style={{ minWidth: "150px" }}
                              >
                                {Math.abs(
                                  item.basePrice + item.tax + item.ait
                                ) - Math.abs(item.discount)}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                      <tr>
                        <td colSpan={11} style={{ textAlign: "right" }}>
                          Total:{" "}
                          {passengerListEdited?.map((item, index) => {
                            (totalPriceEdited +=
                              Math.abs(item.basePrice) +
                              Math.abs(item.tax) +
                              Math.abs(item.ait) -
                              Math.abs(item.discount)).toFixed(2);
                            return index === passengerListEdited.length - 1
                              ? totalPriceEdited.toFixed(2)
                              : "";
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary border-radius"
                    data-bs-dismiss="modal"
                    id="closeBtn"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn button-color fw-bold text-white border-radius"
                    disabled={loading ? true : false}
                    onClick={() => handleSubmit()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {checkOperationCarrier(ticketingList?.segments) && (
        <div style={{ display: "none" }}>
          {ticketingList?.comboSegmentInfo?.length > 0 && isValid ? (
            <div ref={pdfRef}>
              {ticketingList?.comboSegmentInfo?.map((item) =>
                item.platingCarrier === "2A" ? (
                  <OriginalPdf2A
                    key={item.uniqueTransID}
                    totalResponse={
                      ticketingList?.comboSegmentInfo[0]?.platingCarrier ===
                      "2A"
                        ? ticketingList
                        : ticketingListReturn
                    }
                    originalPDFFareData={originalPDFFareData1}
                  />
                ) : item.platingCarrier === "BS" ? (
                  <OriginalPdfBS
                    key={item.uniqueTransID}
                    totalResponse={
                      ticketingList?.comboSegmentInfo[0]?.platingCarrier ===
                      "BS"
                        ? ticketingList
                        : ticketingListReturn
                    }
                    originalPDFFareData={originalPDFFareData2}
                  />
                ) : null
              )}
            </div>
          ) : ticketingList?.segments?.[0]?.operationCarrier === "BS" ? (
            <div ref={pdfRef}>
              <OriginalPdfBS
                totalResponse={ticketingList}
                originalPDFFareData={originalPDFFareData}
              />
            </div>
          ) : ticketingList?.segments?.[0]?.operationCarrier === "2A" ? (
            <div ref={pdfRef}>
              <OriginalPdf2A
                totalResponse={ticketingList}
                originalPDFFareData={originalPDFFareData}
              />
            </div>
          ) : null}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Ticket;