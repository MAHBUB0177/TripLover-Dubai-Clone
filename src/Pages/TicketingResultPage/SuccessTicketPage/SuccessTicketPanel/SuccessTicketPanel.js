import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import logo from "../../../../images/logo/logo-combined.png";
import moment from "moment";
import Loading from "../../../Loading/Loading";
import ReactToPrint from "react-to-print";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import { environment } from "../../../SharePages/Utility/environment";
import "./SuccessTicketPanel.css";
import airports from "../../../../JSON/airports.json";
import { getPassengerType } from "../../../../common/functions";
import {
  Box,
  Button,
  Icon,
  Input,
  Stack,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { MdEmail } from "react-icons/md";
import ModalForm from "../../../../common/modalForm";
import { getUserAllInfo, sendEmailProposal, sendEmailSuccessTicket } from "../../../../common/allApi";
let s3URL = "https://fstuploaddocument.s3.ap-southeast-1.amazonaws.com/";
let staticURL = "wwwroot/Uploads/Support/";

const SuccessTicketPanel = () => {
  const { loading } = useAuth();
  let [isFareHide, setIsFareHide] = useState(false);
  let [agentInfo, setAgentInfo] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messageData, setMessageData] = useState({});
  const [btnDisabled, setbtnDisabled] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const componentRef = useRef();
  const print = () => {
    window.print();
  };
  const ticketData = JSON.parse(sessionStorage.getItem("ticketData"));
  const bookable = JSON.parse(sessionStorage.getItem("bookable"));
  const getAgentInfo = async () => {
    const response =await getUserAllInfo()
    // await axios.get(
    //   environment.agentInfo,
    //   environment.headerToken
    // );
    setAgentInfo(response.data);
  };

  const donwloadRef = useRef();
  const _successTicketMail = async () => {
    {
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
      // pdf.save("ticketSuccess.pdf");

      // var file = pdf.output('datauri');
      // BUTTON SPINNER OFF
      setIsDownloading(false);
      // sendEmailSuccessTicket({ base64String: file ?? "" })
      // await axios
      //   .post(
      //     environment.issueMail,
      //     { base64String: file ?? "" },
      //     environment.headerToken
      //   )
        await sendEmailSuccessTicket({ base64String: file ?? "" },)
        .then((response) => {
          // if (response.isSuccess === true && response.data) {
          //   CustomToast(
          //     "id-success-email-send",
          //     "success",
          //     "Email send successfully."
          //   );
          //   // router.push("/proposal")
          // } else {
          //   CustomToast("id-error-try-again", "error", "Please try again.");
          // }
          //
        });
    }
  };
  // const [reload, setReload] = useState(false);
  //   useEffect(() => {

  //     if (JSON.parse(localStorage.getItem('ismail'))) {
  //       if (agentInfo.logoName !== undefined)
  //       {

  //         _successTicketMail();
  //         localStorage.setItem('ismail', JSON.stringify(false));
  //         setReload(false);
  //       }
  //       else{

  //         setReload(true);
  //       }
  // // setIsMailSentFromIssueTicket(false);
  //     }
  //     // _successTicketMail();
  //   }, [reload,agentInfo?.logoName])

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("ismail")) &&
      agentInfo.logoName !== undefined
    ) {
      _successTicketMail();
      localStorage.setItem("ismail", JSON.stringify(false));

      // setIsMailSentFromIssueTicket(false);
    }
    // _successTicketMail();
  }, [agentInfo?.logoName]);

  useEffect(() => {
    getAgentInfo();
  }, []);
  console.log(ticketData);
  // const currency = JSON.parse(localStorage.getItem("currency"));
  const ImageUrlD = `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${ticketData.item1?.flightInfo?.directions[0][0].platingCarrierCode}.png`;
  const ImageUrlR =
    ticketData.item1?.flightInfo?.directions.length === 2
      ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${ticketData.item1?.flightInfo?.directions[1][0].platingCarrierCode}.png`
      : ``;

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
    pdf.save("ticket_Triplover.pdf");
    setIsDownloading(false);
  };

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
      // axios
      //   .post(environment.sendEmailProposal, {
      //     ...messageData,
      //     html: file,
      //     attactment: "",
      //     fileName: "Ticket",
      //   })

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

  return (
    <div>
      <Loading loading={loading}></Loading>
      <ToastContainer position="bottom-right" autoClose={1500} />
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content">
          <div className="container mt-3">
            <div className="row">
              <div className="col-lg-12">
                <h4 className="fw-bold text-center bg-white text-dark p-2">
                  Ticket Successfully
                </h4>
              </div>
            </div>
          </div>

          <div className="container mt-3 py-2 pb-5">
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
                            <Icon as={MdEmail} pb="4px" height={"20px"} />
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
                    <Box display="flex" alignItems="end" justifyContent={"end"}>
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

                  <div className="card-body py-5 px-5" ref={componentRef}>
                    <div className="px-5" ref={donwloadRef}>
                      <h4 className="text-center pb-2">E-Ticket</h4>

                      {bookable === false && (
                          <ul className="text-danger"
                          style={{ fontSize: "10px",width:"45%" }}>
                            <li>
                             * Passport copy & Visa Copy should be provided at
                             info@Triplover.com{" "}
                            </li>
                            <li>
                             * Ticket will be Refunded if Passport Copy & Visa
                              Copy is not provided within 1 hour of issue.
                            </li>
                            <li>* Name/ DOB/ Passport Info is non-changeable</li>
                          </ul>
                       
                      )}
                      <table class="table table-borderless table-sm">
                        <tbody>
                          <tr>
                            <td className="text-start bg-white">
                              {agentInfo.logoName !== undefined ? (
                                <>
                                  {agentInfo.logoName !== null &&
                                  agentInfo.logoName !== "" ? (
                                    <img
                                      alt="img01"
                                      src={
                                        environment.s3URL +
                                        `${agentInfo?.logoName}`
                                      }
                                      style={{ width: "150px", height: "70px" }}
                                      crossOrigin="true"
                                    ></img>
                                  ) : (
                                    <>
                                      <img
                                        alt="img02"
                                        className="p-2"
                                        src={logo}
                                        style={{
                                          width: "150px",
                                          height: "70px",
                                        }}
                                      ></img>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <img
                                    alt="img02"
                                    className="p-2"
                                    src={logo}
                                    style={{ width: "250px" }}
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
                      <table
                        class="table table-borderless my-3 table-sm"
                        style={{ fontSize: "12px" }}
                      >
                        <tbody>
                          <tr>
                            <td
                              className="text-start bg-white"
                              style={{ width: "10%" }}
                            >
                              Booking Reference :&nbsp;
                              <span className="fw-bold fs-6">
                                {" "}
                                {ticketData.item1?.pnr}
                              </span>
                            </td>
                            {/* <td className="text-end bg-white" style={{ width: "10%" }}>
                            Issue Date :
                            <span className="fw-bold">{moment().format("DD-MMMM-yyyy ddd")}</span>
                          </td> */}
                          </tr>
                        </tbody>
                      </table>
                      <div className="table-responsive-sm mt-2">
                        <p
                          className="ps-1 py-2 fw-bold text-start"
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#ededed",
                          }}
                        >
                          Passenger Information
                        </p>
                        <table
                          class="table table-bordered table-sm mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          <thead>
                            <tr className="text-center">
                              <th className="text-start">Name</th>
                              <th>Type</th>
                              <th>E-Ticket Number</th>
                              <th>Booking ID</th>
                              <th>Ticket Issue Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ticketData.item1?.ticketInfoes?.map(
                              (item, index) => {
                                return (
                                  <tr
                                    className="text-center"
                                    style={{ lineHeight: "14px" }}
                                  >
                                    <td className="text-start">
                                      {item.passengerInfo.nameElement?.title?.toUpperCase()}{" "}
                                      {item.passengerInfo.nameElement?.firstName.toUpperCase()}{" "}
                                      {item.passengerInfo.nameElement?.lastName.toUpperCase()}
                                    </td>
                                    <td>
                                      {/* {getPassengerType(
                                        item.passengerInfo.passengerType
                                      )} */}

                                      {item.passengerInfo.passengerType ===
                                      "ADT"
                                        ? "Adult"
                                        : item.passengerInfo.passengerType ===
                                          "CNN"
                                        ? "Child"
                                        : item.passengerInfo.passengerType ===
                                          "CHD"
                                        ? "Child"
                                        : item.passengerInfo.passengerType ===
                                          "INF"
                                        ? "Infant"
                                        : ""}
                                    </td>
                                    <td>{item?.ticketNumbers}</td>
                                    {index === 0 ? (
                                      <td
                                        className="align-middle"
                                        rowSpan={
                                          ticketData.item1?.ticketInfoes.length
                                        }
                                      >
                                        {ticketData.item1?.uniqueTransID}
                                      </td>
                                    ) : (
                                      <></>
                                    )}
                                    {index === 0 ? (
                                      <td
                                        className="align-middle"
                                        rowSpan={
                                          ticketData.item1?.ticketInfoes.length
                                        }
                                      >
                                        {moment().format("ddd, DD MMM,YY")}
                                      </td>
                                    ) : (
                                      <></>
                                    )}
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="table-responsive-sm mt-3">
                        <p
                          className="ps-1 py-2 fw-bold text-start"
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#ededed",
                          }}
                        >
                          Flight Details
                        </p>
                        <div className="mt-1">
                          <div
                            className="border p-1"
                            style={{ fontSize: "12px" }}
                          >
                            {ticketData.item1?.flightInfo.directions.length >
                            2 ? (
                              <></>
                            ) : (
                              <>
                                {ticketData.item1?.flightInfo.directions[0][0].segments.map(
                                  (item, index) => {
                                    return (
                                      <div className="border p-1 my-1">
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.from)
                                            .map((item) => item.city)}{" "}
                                          ({item.from})
                                        </span>
                                        <span className="mx-2 fw-bold">
                                          <i class="fas fa-arrow-right"></i>
                                        </span>
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.to)
                                            .map((item) => item.city)}{" "}
                                          ({item.to})
                                        </span>
                                        <span className="d-flex align-items-center fw-bold">
                                          <img
                                            src={
                                              environment.s3ArliensImage +
                                              `${item.airlineCode}.png`
                                            }
                                            className="me-2"
                                            alt=""
                                            width="30px"
                                            height="30px"
                                            crossOrigin="true"
                                          ></img>
                                          {item.airline} ({item.airlineCode}-
                                          {item.flightNumber})
                                        </span>
                                        <table
                                          class="table table-borderless table-sm mt-1"
                                          style={{ fontSize: "12px" }}
                                        >
                                          <thead>
                                            <tr>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Date
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Info
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Cabin
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Baggage
                                                </p>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td>
                                                {moment(item.departure).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                              </td>
                                              <td>
                                                {moment(item.departure).format(
                                                  "HH:mm"
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "HH:mm"
                                                )}
                                              </td>
                                              <td>
                                                <table
                                                  className="p-0"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Departs
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.from
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.from}){" "}
                                                      {item.details[0]
                                                        .originTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .originTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .originTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Arrives
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.to
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.to}){" "}
                                                      {item.details[0]
                                                        .destinationTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .destinationTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .destinationTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>

                                              <td className="align-middle">
                                                {item.details[0].flightTime}
                                              </td>
                                              <td className="align-middle">
                                                {item.serviceClass === "Y"
                                                  ? "ECONOMY" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass === "C"
                                                  ? "BUSINESS CLASS" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"}
                                              </td>
                                              <td className="align-middle">
                                                {/* {
                                              ticketData.item1?.ticketInfoes.map((itm, idx) => {
                                                return (
                                                  <>
                                                    <span>{itm.passengerInfo.passengerType === 'ADT' ? 'Adult' : itm.passengerInfo.passengerType === 'CNN' ? 'Child' : itm.passengerInfo.passengerType === 'INF'?'Infant' : 'Adult'} <span style={{ fontSize: "10px" }}><i class="fas fa-arrow-right"></i></span> Check in : {itm.passengerInfo.passengerType === 'INF' ? "10" : item.baggage[0]?.amount}{item.baggage[0]?.units}</span><br></br>
                                                  </>
                                                )
                                              })
                                            }

{
                                            ticketData.item1?.ticketInfoes.map((itm, idx) => {
                                                return (
                                                  <>
                                                    <span>{itm.passengerInfo.passengerType === 'ADT' ? 'Adult' : itm.passengerInfo.passengerType === 'CNN' ? 'Child' : itm.passengerInfo.passengerType === 'INF'?'Infant' : 'Adult'} <span style={{ fontSize: "10px" }}><i class="fas fa-arrow-right"></i></span> Check in : {itm.passengerInfo.passengerType === 'INF' ? "10" : item.baggage[0]?.amount}{item.baggage[0]?.units}</span><br></br>
                                                  </>
                                                )
                                              })
                                            } */}

                                                {/* {ticketData.item1?.flightInfo
                                                  .passengerFares.adt !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Adult{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.cnn !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Child{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.inf !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Infant{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in : 10Kg
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )} */}
                                                {item?.baggage?.map(
                                                  (itm, idx) => {
                                                    return (
                                                      <>
                                                        <span className="left">
                                                          {itm?.passengerTypeCode ===
                                                          "ADT"
                                                            ? "Adult"
                                                            : itm?.passengerTypeCode ===
                                                              "CNN"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "CHD"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "INF"
                                                            ? "Infant"
                                                            : ""}{" "}
                                                          :{" "}
                                                          <span className="ms-1 font-size">
                                                            {itm?.amount +
                                                              " " +
                                                              itm?.units}
                                                          </span>
                                                        </span>
                                                        <br></br>
                                                      </>
                                                    );
                                                  }
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    );
                                  }
                                )}
                              </>
                            )}

                            {ticketData.item1?.flightInfo.directions[1] !==
                            undefined ? (
                              <>
                                {ticketData.item1?.flightInfo.directions[1][0].segments.map(
                                  (item, index) => {
                                    return (
                                      <div className="border p-1 mb-1">
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.from)
                                            .map((item) => item.city)}{" "}
                                          ({item.from})
                                        </span>
                                        <span className="mx-2 fw-bold">
                                          <i class="fas fa-arrow-right"></i>
                                        </span>
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.to)
                                            .map((item) => item.city)}{" "}
                                          ({item.to})
                                        </span>
                                        <span className="d-flex align-items-center fw-bold">
                                          <img
                                            src={
                                              environment.s3ArliensImage +
                                              `${item.airlineCode}.png`
                                            }
                                            className="me-2"
                                            alt=""
                                            width="30px"
                                            height="30px"
                                            crossOrigin="true"
                                          ></img>
                                          {item.airline} ({item.airlineCode}-
                                          {item.flightNumber})
                                        </span>
                                        <table
                                          class="table table-borderless table-sm mt-1"
                                          style={{ fontSize: "12px" }}
                                        >
                                          <thead>
                                            <tr>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Date
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Info
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Cabin
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Baggage
                                                </p>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td>
                                                {moment(item.departure).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                              </td>
                                              <td>
                                                {moment(item.departure).format(
                                                  "HH:mm"
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "HH:mm"
                                                )}
                                              </td>
                                              <td>
                                                <table
                                                  className="p-0"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Departs
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.from
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.from}){" "}
                                                      {item.details[0]
                                                        .originTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .originTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .originTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Arrives
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.to
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.to}){" "}
                                                      {item.details[0]
                                                        .destinationTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .destinationTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .destinationTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>

                                              <td className="align-middle">
                                                {item.details[0].flightTime}
                                              </td>
                                              <td className="align-middle">
                                                {item.serviceClass === "Y"
                                                  ? "ECONOMY" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass === "C"
                                                  ? "BUSINESS CLASS" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"}
                                              </td>
                                              <td className="align-middle">
                                                {/* {
                                          ticketData.item1?.ticketInfoes.map((itm, idx) => {
                                            return (
                                              <>
                                                <span>{itm.passengerInfo.passengerType === 'ADT' ? 'Adult' : itm.passengerInfo.passengerType === 'CNN' ? 'Child' : 'Infant'} <span style={{ fontSize: "10px" }}><i class="fas fa-arrow-right"></i></span> Check in : {itm.passengerInfo.passengerType === 'INF' ? "10" : item.baggage[0]?.amount}{item.baggage[0]?.units}</span><br></br>
                                              </>
                                            )
                                          })
                                        } */}
                                                {/* {ticketData.item1?.flightInfo
                                                  .passengerFares.adt !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Adult{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.cnn !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Child{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.inf !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Infant{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in : 10Kg
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )} */}
                                                {item?.baggage?.map(
                                                  (itm, idx) => {
                                                    return (
                                                      <>
                                                        <span className="left">
                                                          {itm?.passengerTypeCode ===
                                                          "ADT"
                                                            ? "Adult"
                                                            : itm?.passengerTypeCode ===
                                                              "CNN"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "CHD"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "INF"
                                                            ? "Infant"
                                                            : ""}{" "}
                                                          :{" "}
                                                          <span className="ms-1 font-size">
                                                            {itm?.amount +
                                                              " " +
                                                              itm?.units}
                                                          </span>
                                                        </span>
                                                        <br></br>
                                                      </>
                                                    );
                                                  }
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    );
                                  }
                                )}
                              </>
                            ) : (
                              <></>
                            )}

                            {ticketData.item1?.flightInfo.directions[2] !==
                            undefined ? (
                              <>
                                {ticketData.item1?.flightInfo.directions[2][0].segments.map(
                                  (item, index) => {
                                    return (
                                      <div className="border p-1 mb-1">
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.from)
                                            .map((item) => item.city)}{" "}
                                          ({item.from})
                                        </span>
                                        <span className="mx-2 fw-bold">
                                          <i class="fas fa-arrow-right"></i>
                                        </span>
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.to)
                                            .map((item) => item.city)}{" "}
                                          ({item.to})
                                        </span>
                                        <span className="d-flex align-items-center fw-bold">
                                          <img
                                            src={
                                              environment.s3ArliensImage +
                                              `${item.airlineCode}.png`
                                            }
                                            className="me-2"
                                            alt=""
                                            width="30px"
                                            height="30px"
                                            crossOrigin="true"
                                          ></img>
                                          {item.airline} ({item.airlineCode}-
                                          {item.flightNumber})
                                        </span>
                                        <table
                                          class="table table-borderless table-sm mt-1"
                                          style={{ fontSize: "12px" }}
                                        >
                                          <thead>
                                            <tr>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Date
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Info
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Cabin
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Baggage
                                                </p>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td>
                                                {moment(item.departure).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                              </td>
                                              <td>
                                                {moment(item.departure).format(
                                                  "HH:mm"
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "HH:mm"
                                                )}
                                              </td>
                                              <td>
                                                <table
                                                  className="p-0"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Departs
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.from
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.from}){" "}
                                                      {item.details[0]
                                                        .originTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .originTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .originTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Arrives
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.to
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.to}){" "}
                                                      {item.details[0]
                                                        .destinationTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .destinationTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .destinationTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>

                                              <td className="align-middle">
                                                {item.details[0].flightTime}
                                              </td>
                                              <td className="align-middle">
                                                {item.serviceClass === "Y"
                                                  ? "ECONOMY" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass === "C"
                                                  ? "BUSINESS CLASS" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"}
                                              </td>
                                              <td className="align-middle">
                                                {/* {
                                          ticketData.item1?.ticketInfoes.map((itm, idx) => {
                                            return (
                                              <>
                                                <span>{itm.passengerInfo.passengerType === 'ADT' ? 'Adult' : itm.passengerInfo.passengerType === 'CNN' ? 'Child' : itm.passengerInfo.passengerType === 'INF'?'Infant' : 'Adult'} <span style={{ fontSize: "10px" }}><i class="fas fa-arrow-right"></i></span> Check in : {itm.passengerInfo.passengerType === 'INF' ? "10" : item.baggage[0]?.amount}{item.baggage[0]?.units}</span><br></br>
                                              </>
                                            )
                                          })
                                        } */}

                                                {/* {ticketData.item1?.flightInfo
                                                  .passengerFares.adt !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Adult{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.cnn !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Child{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.inf !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Infant{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in : 10Kg
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )} */}
                                                {item?.baggage?.map(
                                                  (itm, idx) => {
                                                    return (
                                                      <>
                                                        <span className="left">
                                                          {itm?.passengerTypeCode ===
                                                          "ADT"
                                                            ? "Adult"
                                                            : itm?.passengerTypeCode ===
                                                              "CNN"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "CHD"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "INF"
                                                            ? "Infant"
                                                            : ""}{" "}
                                                          :{" "}
                                                          <span className="ms-1 font-size">
                                                            {itm?.amount +
                                                              " " +
                                                              itm?.units}
                                                          </span>
                                                        </span>
                                                        <br></br>
                                                      </>
                                                    );
                                                  }
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    );
                                  }
                                )}
                              </>
                            ) : (
                              <></>
                            )}

                            {ticketData.item1?.flightInfo.directions[3] !==
                            undefined ? (
                              <>
                                {ticketData.item1?.flightInfo.directions[3][0].segments.map(
                                  (item, index) => {
                                    return (
                                      <div className="border p-1 mb-1">
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.from)
                                            .map((item) => item.city)}{" "}
                                          ({item.from})
                                        </span>
                                        <span className="mx-2 fw-bold">
                                          <i class="fas fa-arrow-right"></i>
                                        </span>
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.to)
                                            .map((item) => item.city)}{" "}
                                          ({item.to})
                                        </span>
                                        <span className="d-flex align-items-center fw-bold">
                                          <img
                                            src={
                                              environment.s3ArliensImage +
                                              `${item.airlineCode}.png`
                                            }
                                            className="me-2"
                                            alt=""
                                            width="30px"
                                            height="30px"
                                            crossOrigin="true"
                                          ></img>
                                          {item.airline} ({item.airlineCode}-
                                          {item.flightNumber})
                                        </span>
                                        <table
                                          class="table table-borderless table-sm mt-1"
                                          style={{ fontSize: "12px" }}
                                        >
                                          <thead>
                                            <tr>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Date
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Info
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Cabin
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Baggage
                                                </p>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td>
                                                {moment(item.departure).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                              </td>
                                              <td>
                                                {moment(item.departure).format(
                                                  "HH:mm"
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "HH:mm"
                                                )}
                                              </td>
                                              <td>
                                                <table
                                                  className="p-0"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Departs
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.from
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.from}){" "}
                                                      {item.details[0]
                                                        .originTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .originTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .originTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Arrives
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.to
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.to}){" "}
                                                      {item.details[0]
                                                        .destinationTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .destinationTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .destinationTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>

                                              <td className="align-middle">
                                                {item.details[0].flightTime}
                                              </td>
                                              <td className="align-middle">
                                                {item.serviceClass === "Y"
                                                  ? "ECONOMY" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass === "C"
                                                  ? "BUSINESS CLASS" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"}
                                              </td>
                                              <td className="align-middle">
                                                {/* {
                                          ticketData.item1?.ticketInfoes.map((itm, idx) => {
                                            return (
                                              <>
                                                <span>{itm.passengerInfo.passengerType === 'ADT' ? 'Adult' : itm.passengerInfo.passengerType === 'CNN' ? 'Child' : itm.passengerInfo.passengerType === 'INF'?'Infant' : 'Adult'} <span style={{ fontSize: "10px" }}><i class="fas fa-arrow-right"></i></span> Check in : {itm.passengerInfo.passengerType === 'INF' ? "10" : item.baggage[0]?.amount}{item.baggage[0]?.units}</span><br></br>
                                              </>
                                            )
                                          })
                                        } */}
                                                {/* {ticketData.item1?.flightInfo
                                                  .passengerFares.adt !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Adult{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.cnn !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Child{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.inf !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Infant{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in : 10Kg
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )} */}
                                                {item?.baggage?.map(
                                                  (itm, idx) => {
                                                    return (
                                                      <>
                                                        <span className="left">
                                                          {itm?.passengerTypeCode ===
                                                          "ADT"
                                                            ? "Adult"
                                                            : itm?.passengerTypeCode ===
                                                              "CNN"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "CHD"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "INF"
                                                            ? "Infant"
                                                            : ""}{" "}
                                                          :{" "}
                                                          <span className="ms-1 font-size">
                                                            {itm?.amount +
                                                              " " +
                                                              itm?.units}
                                                          </span>
                                                        </span>
                                                        <br></br>
                                                      </>
                                                    );
                                                  }
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    );
                                  }
                                )}
                              </>
                            ) : (
                              <></>
                            )}

                            {ticketData.item1?.flightInfo.directions[4] !==
                            undefined ? (
                              <>
                                {ticketData.item1?.flightInfo.directions[4][0].segments.map(
                                  (item, index) => {
                                    return (
                                      <div className="border p-1 mb-1">
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.from)
                                            .map((item) => item.city)}{" "}
                                          ({item.from})
                                        </span>
                                        <span className="mx-2 fw-bold">
                                          <i class="fas fa-arrow-right"></i>
                                        </span>
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.to)
                                            .map((item) => item.city)}{" "}
                                          ({item.to})
                                        </span>
                                        <span className="d-flex align-items-center fw-bold">
                                          <img
                                            src={
                                              environment.s3ArliensImage +
                                              `${item.airlineCode}.png`
                                            }
                                            className="me-2"
                                            alt=""
                                            width="30px"
                                            height="30px"
                                            crossOrigin="true"
                                          ></img>
                                          {item.airline} ({item.airlineCode}-
                                          {item.flightNumber})
                                        </span>
                                        <table
                                          class="table table-borderless table-sm mt-1"
                                          style={{ fontSize: "12px" }}
                                        >
                                          <thead>
                                            <tr>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Date
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Info
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Cabin
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Baggage
                                                </p>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td>
                                                {moment(item.departure).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                              </td>
                                              <td>
                                                {moment(item.departure).format(
                                                  "HH:mm"
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "HH:mm"
                                                )}
                                              </td>
                                              <td>
                                                <table
                                                  className="p-0"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Departs
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.from
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.from}){" "}
                                                      {item.details[0]
                                                        .originTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .originTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .originTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Arrives
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.to
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.to}){" "}
                                                      {item.details[0]
                                                        .destinationTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .destinationTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .destinationTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>

                                              <td className="align-middle">
                                                {item.details[0].flightTime}
                                              </td>
                                              <td className="align-middle">
                                                {item.serviceClass === "Y"
                                                  ? "ECONOMY" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass === "C"
                                                  ? "BUSINESS CLASS" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"}
                                              </td>
                                              <td className="align-middle">
                                                {/* {
                                          ticketData.item1?.ticketInfoes.map((itm, idx) => {
                                            return (
                                              <>
                                                <span>{itm.passengerInfo.passengerType === 'ADT' ? 'Adult' : itm.passengerInfo.passengerType === 'CNN' ? 'Child' : itm.passengerInfo.passengerType === 'INF'?'Infant' : 'Adult'} <span style={{ fontSize: "10px" }}><i class="fas fa-arrow-right"></i></span> Check in : {itm.passengerInfo.passengerType === 'INF' ? "10" : item.baggage[0]?.amount}{item.baggage[0]?.units}</span><br></br>
                                              </>
                                            )
                                          })
                                        } */}

                                                {/* {ticketData.item1?.flightInfo
                                                  .passengerFares.adt !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Adult{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.cnn !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Child{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.inf !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Infant{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in : 10Kg
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )} */}
                                                {item?.baggage?.map(
                                                  (itm, idx) => {
                                                    return (
                                                      <>
                                                        <span className="left">
                                                          {itm?.passengerTypeCode ===
                                                          "ADT"
                                                            ? "Adult"
                                                            : itm?.passengerTypeCode ===
                                                              "CNN"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "CHD"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "INF"
                                                            ? "Infant"
                                                            : ""}{" "}
                                                          :{" "}
                                                          <span className="ms-1 font-size">
                                                            {itm?.amount +
                                                              " " +
                                                              itm?.units}
                                                          </span>
                                                        </span>
                                                        <br></br>
                                                      </>
                                                    );
                                                  }
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    );
                                  }
                                )}
                              </>
                            ) : (
                              <></>
                            )}

                            {ticketData.item1?.flightInfo.directions[5] !==
                            undefined ? (
                              <>
                                {ticketData.item1?.flightInfo.directions[5][0].segments.map(
                                  (item, index) => {
                                    return (
                                      <div className="border p-1 mb-1">
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.from)
                                            .map((item) => item.city)}{" "}
                                          ({item.from})
                                        </span>
                                        <span className="mx-2 fw-bold">
                                          <i class="fas fa-arrow-right"></i>
                                        </span>
                                        <span className="fw-bold">
                                          {airports
                                            .filter((f) => f.iata === item.to)
                                            .map((item) => item.city)}{" "}
                                          ({item.to})
                                        </span>
                                        <span className="d-flex align-items-center fw-bold">
                                          <img
                                            src={
                                              environment.s3ArliensImage +
                                              `${item.airlineCode}.png`
                                            }
                                            className="me-2"
                                            alt=""
                                            width="30px"
                                            height="30px"
                                            crossOrigin="true"
                                          ></img>
                                          {item.airline} ({item.airlineCode}-
                                          {item.flightNumber})
                                        </span>
                                        <table
                                          class="table table-borderless table-sm mt-1"
                                          style={{ fontSize: "12px" }}
                                        >
                                          <thead>
                                            <tr>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Date
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Info
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Flight Time
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Cabin
                                                </p>
                                              </th>
                                              <th className="p-0">
                                                <p
                                                  className="py-1 ps-1"
                                                  style={{
                                                    backgroundColor: "#ededed",
                                                  }}
                                                >
                                                  Baggage
                                                </p>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td>
                                                {moment(item.departure).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "ddd DD MMM,YY "
                                                )}
                                              </td>
                                              <td>
                                                {moment(item.departure).format(
                                                  "HH:mm"
                                                )}
                                                <br></br>
                                                {moment(item.arrival).format(
                                                  "HH:mm"
                                                )}
                                              </td>
                                              <td>
                                                <table
                                                  className="p-0"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Departs
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.from
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.from}){" "}
                                                      {item.details[0]
                                                        .originTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .originTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .originTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                  <tr className="p-0">
                                                    <td className="p-0">
                                                      Arrives
                                                    </td>
                                                    <td className="py-0 fw-bold">
                                                      {airports
                                                        .filter(
                                                          (f) =>
                                                            f.iata === item.to
                                                        )
                                                        .map(
                                                          (item) => item.city
                                                        )}{" "}
                                                      ({item.to}){" "}
                                                      {item.details[0]
                                                        .destinationTerminal !==
                                                        null &&
                                                      item.details[0]
                                                        .destinationTerminal !==
                                                        "" ? (
                                                        <>
                                                          Terminal-(
                                                          {
                                                            item.details[0]
                                                              .destinationTerminal
                                                          }
                                                          )
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>

                                              <td className="align-middle">
                                                {item.details[0].flightTime}
                                              </td>
                                              <td className="align-middle">
                                                {item.serviceClass === "Y"
                                                  ? "ECONOMY" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass === "C"
                                                  ? "BUSINESS CLASS" +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"
                                                  : item.serviceClass +
                                                    "(" +
                                                    item.bookingClass +
                                                    ")"}
                                              </td>
                                              <td className="align-middle">
                                                {/* {
                                          ticketData.item1?.ticketInfoes.map((itm, idx) => {
                                            return (
                                              <>
                                                <span>{itm.passengerInfo.passengerType === 'ADT' ? 'Adult' : itm.passengerInfo.passengerType === 'CNN' ? 'Child' : itm.passengerInfo.passengerType === 'INF'?'Infant' : 'Adult'} <span style={{ fontSize: "10px" }}><i class="fas fa-arrow-right"></i></span> Check in : {itm.passengerInfo.passengerType === 'INF' ? "10" : item.baggage[0]?.amount}{item.baggage[0]?.units}</span><br></br>
                                              </>
                                            )
                                          })
                                        } */}

                                                {/* {ticketData.item1?.flightInfo
                                                  .passengerFares.adt !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Adult{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.cnn !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Child{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in :{" "}
                                                      {item.baggage[0]?.amount}
                                                      {item.baggage[0]?.units}
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {ticketData.item1?.flightInfo
                                                  .passengerFares.inf !==
                                                null ? (
                                                  <>
                                                    <span>
                                                      Infant{" "}
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        <i class="fas fa-arrow-right"></i>
                                                      </span>{" "}
                                                      Check in : 10Kg
                                                    </span>
                                                    <br></br>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )} */}
                                                {item?.baggage?.map(
                                                  (itm, idx) => {
                                                    return (
                                                      <>
                                                        <span className="left">
                                                          {itm?.passengerTypeCode ===
                                                          "ADT"
                                                            ? "Adult"
                                                            : itm?.passengerTypeCode ===
                                                              "CNN"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "CHD"
                                                            ? "Child"
                                                            : itm?.passengerTypeCode ===
                                                              "INF"
                                                            ? "Infant"
                                                            : ""}{" "}
                                                          :{" "}
                                                          <span className="ms-1 font-size">
                                                            {itm?.amount +
                                                              " " +
                                                              itm?.units}
                                                          </span>
                                                        </span>
                                                        <br></br>
                                                      </>
                                                    );
                                                  }
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
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
                      {isFareHide === false ? (
                        <>
                          <div className="table-responsive-sm mt-3">
                            <p
                              className="ps-1 py-2 fw-bold text-start"
                              style={{
                                fontSize: "12px",
                                backgroundColor: "#ededed",
                              }}
                            >
                              Fare Details
                            </p>

                            <table
                              class="table table-bordered table-sm text-end mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              <thead>
                                <tr className="text-end">
                                  <th className="text-start">Type</th>
                                  <th>Base Price</th>
                                  <th>Tax</th>
                                  <th>AIT</th>
                                  <th>Commission</th>
                                  <th>Pax</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ticketData.item1?.flightInfo.passengerFares
                                  .adt !== null ? (
                                  <>
                                    <tr className="text-end">
                                      <td className="text-start">Adult</td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.adt.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>

                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.adt.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.adt.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.adt.discountPrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {
                                          ticketData.item1?.flightInfo
                                            .passengerCounts.adt
                                        }
                                      </td>
                                      <td className="fw-bold">
                                        AED{" "}
                                        {(
                                          ticketData.item1?.flightInfo
                                            .passengerFares.adt.totalPrice *
                                          ticketData.item1?.flightInfo
                                            .passengerCounts.adt
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {ticketData.item1?.flightInfo.passengerFares
                                  .chd !== null ? (
                                  <>
                                    <tr className="text-end">
                                      <td className="text-start">
                                        Child &gt; 5
                                      </td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.chd.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>

                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.chd.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.chd.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.chd.discountPrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {
                                          ticketData.item1?.flightInfo
                                            .passengerCounts.chd
                                        }
                                      </td>
                                      <td className="fw-bold">
                                        AED{" "}
                                        {(
                                          ticketData.item1?.flightInfo
                                            ?.passengerFares.chd.totalPrice *
                                          ticketData.item1?.flightInfo
                                            .passengerCounts.chd
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {ticketData.item1?.flightInfo.passengerFares
                                  .cnn !== null ? (
                                  <>
                                    <tr className="text-end">
                                      <td className="text-start">
                                        Child{" "}
                                        {ticketData.item1?.flightInfo
                                          .passengerFares.chd === null ? (
                                          <></>
                                        ) : (
                                          <> &#60; 5</>
                                        )}
                                      </td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.cnn.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>

                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.cnn.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.cnn.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.cnn.discountPrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {
                                          ticketData.item1?.flightInfo
                                            .passengerCounts.cnn
                                        }
                                      </td>
                                      <td className="fw-bold">
                                        AED{" "}
                                        {(
                                          ticketData.item1?.flightInfo
                                            .passengerFares.cnn.totalPrice *
                                          ticketData.item1?.flightInfo
                                            .passengerCounts.cnn
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {ticketData.item1?.flightInfo.passengerFares
                                  .inf !== null ? (
                                  <>
                                    <tr className="text-end">
                                      <td className="text-start">Infant</td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.inf.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>

                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.inf.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.inf.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {ticketData.item1?.flightInfo.passengerFares.inf.discountPrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {
                                          ticketData.item1?.flightInfo
                                            .passengerCounts.inf
                                        }
                                      </td>
                                      <td className="fw-bold">
                                        AED{" "}
                                        {(
                                          ticketData.item1?.flightInfo
                                            .passengerFares.inf.totalPrice *
                                          ticketData.item1?.flightInfo
                                            .passengerCounts.inf
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}
                                <tr className="fw-bold">
                                  <td colSpan={5} className="border-none"></td>
                                  <td>Grand Total</td>
                                  <td>
                                    AED{" "}
                                    {(ticketData.item1?.flightInfo.bookingComponents[0].totalPrice).toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      <div className="mt-3 pb-5">
                        <p
                          className="ps-1 py-2 fw-bold text-start"
                          style={{
                            fontSize: "12px",
                            marginBottom: "8px",
                            backgroundColor: "#ededed",
                          }}
                        >
                          Important Notice
                        </p>
                        <table
                          class="table table-bordered table-sm text-end mt-1 mb-0"
                          style={{ fontSize: "12px" }}
                        >
                          <thead>
                            <tr>
                              <th className="text-start">E-Ticket Notice:</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="text-start">
                              <p className="border-0">
                                Carriage and other services provided by the
                                carrier are subject to conditions of carriage
                                which are hereby incorporated by reference.
                                These conditions may be obtained from the
                                issuing carrier.
                              </p>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          class="table table-bordered table-sm text-end  mb-0"
                          style={{ fontSize: "12px" }}
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
                                Please ensure that you have all the required
                                travel documents for your entire journey - i.e.
                                valid passport & necessary Visas - and that you
                                have had the recommended inoculations for your
                                destination(s).
                              </p>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          class="table table-bordered table-sm text-end mb-0"
                          style={{ fontSize: "12px" }}
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
                                LIMIT: 1 Carry-On bag per passenger / SIZE
                                LIMIT: 22in x 15in x 8in (L+W+H=45 inches) /
                                WEIGHT LIMIT: Max weight 7 kg / 15 lb
                              </p>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          class="table table-bordered table-sm text-end  mb-0"
                          style={{ fontSize: "12px" }}
                        >
                          <thead>
                            <tr>
                              <th className="text-start">Reporting Time:</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="text-start">
                              <p className="border-0">
                                Flights open for check-in 1 hour before
                                scheduled departure time on domestic flights and
                                3 hours before scheduled departure time on
                                international flights. Passengers must check-in
                                1 hour before flight departure. Check-in
                                counters close 30 minutes before flight
                                departure for domestic, and 90 minutes before
                                the scheduled departure for international
                                flights.
                              </p>
                            </tr>
                          </tbody>
                        </table>

                        {/* <table
                          class="table table-bordered table-sm text-end mb-0"
                          style={{ fontSize: "12px" }}
                        >
                          <thead>
                            <tr>
                              <th className="text-start">IMPORTANT NOTICE:</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="text-start">
                              <p className="border-0">
                             Baggage discounts may apply based on frequent flyer/status/online checkin/from of payment/military/etc.
                          Carriage and other services provided by the carrier are
                          subject to conditions of carriage, which are hereby
                          incorporated by reference. These conditions may be
                          obtained from the issuing carrier. Passengers on a journey
                          involving an ultimate destination or a stop in a country
                          other than the country of departure are advised that
                          international treaties known as the Montreal Convention,
                          or its predecessor, the Warsaw Convention, including its
                          amendments (the Warsaw Convention System), may apply to
                          the entire journey, including any portion thereof within a
                          country.
                              </p>
                            </tr>
                          </tbody>
                        </table> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SuccessTicketPanel;
