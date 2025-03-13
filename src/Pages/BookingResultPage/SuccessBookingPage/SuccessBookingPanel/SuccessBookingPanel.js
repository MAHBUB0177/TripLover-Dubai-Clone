import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { environment } from "../../../SharePages/Utility/environment";
import { Link } from "react-router-dom";
import logo from "../../../../images/logo/logo-combined.png";
import useAuth from "../../../../hooks/useAuth";
import moment from "moment";
import Loading from "../../../Loading/Loading";
import airports from "../../../../JSON/airports.json";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { getDefaultNormalizer } from "@testing-library/react";
import $ from "jquery";
import {
  getCountryCode,
  getCountryFomAirport,
  getPassengerType,
  sortPassangerType,
} from "../../../../common/functions";
import { useEffect } from "react";
import { useState } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Box,
  Button,
  Icon,
  Input,
  Stack,
  Textarea,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { MdEmail } from "react-icons/md";
import ModalForm from "../../../../common/modalForm";
import { toast, ToastContainer } from "react-toastify";
import { GiCancel } from "react-icons/gi";
import { cancelBooking, getGetCurrentUser, getPartialPaymentInfo, getUserAllInfo, sendEmailProposal, sendEmailSuccessTicket, ticketIssue } from "../../../../common/allApi";

const SuccessBookingPanel = () => {
  const userRole =
    localStorage.getItem("userRole") &&
    atob(atob(atob(localStorage.getItem("userRole"))));
  const { setTicketData, setLoading, loading } = useAuth();
  let [agentInfo, setAgentInfo] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [title, setTitle] = useState("ticketing");
  const[partialData,setPartialData]=useState(false)
  // console.log(partialData,"abc")
  const getAgentData = async () => {
    // axios
    //   .get(environment.agentInfo, environment.headerToken)
    await getUserAllInfo()
      .then((agentRes) => {
        setAgentInfo(agentRes.data);
        sessionStorage.setItem("agentInfoData", JSON.stringify(agentRes?.data));
      })
      .catch((err) => {
        //alert('Invalid login')
      });
  };

  // useEffect(() => {
  //   getAgentData();
  // }, []);

  const bookData = JSON.parse(sessionStorage.getItem("bookData"));
  // const handleEmail = () => {
  //   const html = document.getElementById("sendEmailDiv").innerHTML;
  //   const obj = {
  //     to: bookData.data?.item1.passengerInfoes[0].contactInfo.email,
  //     templateCode: "T0017",
  //     html: html
  //   }
  //   axios.post(environment.sendEmailBooking, obj)
  //     .then(response => (response.status === 200 ? alert("Success") : alert("Failed")));
  // };
  const navigate = useNavigate();
  const componentRef = useRef();
  const donwloadRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messageData, setMessageData] = useState({});
  const [btnDisabled, setbtnDisabled] = useState(false);

  const [isDomestic, setIsDomestic] = useState(true);

  const filterParam = JSON.parse(sessionStorage.getItem("Database"));
  const flightType = filterParam.flightType;
  const direction0 = JSON.parse(sessionStorage.getItem("direction0"));
  const direction1 = JSON.parse(sessionStorage.getItem("direction1"));
  const direction2 = JSON.parse(sessionStorage.getItem("direction2"));
  const direction3 = JSON.parse(sessionStorage.getItem("direction3"));
  const direction4 = JSON.parse(sessionStorage.getItem("direction4"));
  const direction5 = JSON.parse(sessionStorage.getItem("direction5"));
  const ImageUrlD = `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${direction0.platingCarrierCode}.png`;
  const ImageUrlR =
    Object.keys(direction1)?.length > 0
      ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${direction1.platingCarrierCode}.png`
      : ``;

  // useEffect(() => {
  //   localStorage.setItem('ismail', JSON.stringify(false));
  // }, []);

  const [payment, setPayment] = useState({
    partialPayment: false,
    fullPayment: true,
  });

  //agent data get
  

  const handleGenarateTicket = () => {
    setLoading(true);
    const sendObjTicket = {
      pnr: bookData.data.item1.pnr,
      bookingRefNumber: bookData.data.item1.bookingRefNumber,
      priceCodeRef: bookData.data.item1.priceCodeRef,
      uniqueTransID: bookData.data.item1.uniqueTransID,
      itemCodeRef: bookData.data.item1.itemCodeRef,
      bookingCodeRef: bookData.data.item1.bookingCodeRef,
      isPartialPayment: payment?.partialPayment === true ? true : false,
      commission: 0,
    };

    async function fetchOptions() {
      // await axios
      //   .post(
      //     environment.ticketingFlight,
      //     sendObjTicket,
      //     environment.headerToken
      //   )

        await ticketIssue(sendObjTicket)
        .then((response) => {
          if (response.data.item2?.isSuccess === true) {
            getAgentData()
            setTicketData(response.data);
            sessionStorage.setItem("ticketData", JSON.stringify(response.data));
            setLoading(false);
            localStorage.setItem("ismail", JSON.stringify(true));
            // navigate("/successticket");
            navigate("/ticket?utid=" + response.data.item2?.uniqueTransID + "&sts=Confirm");
          } else if (
            response.data.item2?.message ===
            "You'r account is on Hault. please contact with support."
          ) {
            setLoading(false);
            $(".modal-backdrop").remove();
            $("body").removeClass("modal-open");
            $("body").removeAttr("style");
            toast.error(response.data.item2?.message);
          } else {
            setLoading(false);
            setTicketData(response.data);
            navigate("/processticket");
          }
        });
    }
    fetchOptions();
  };

  sortPassangerType(bookData.data?.item1.passengerInfoes);

  const _successTicketMail = async () => {
    const element = donwloadRef.current;
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

    const pdf = new jsPDF("p", "pt", "a4", true);
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
    var file = pdf.output("datauristring").split(",")[1];
    // pdf.save("ticketSuccess.pdf");

    // var file = pdf.output('datauri');
    // BUTTON SPINNER OFF
    // setIsDownloading(false);
    // sendEmailSuccessTicket({ base64String: file ?? "" })

    // await axios
    //   .post(
    //     environment.issueMail,
    //     { base64String: file ?? "" },
    //     environment.headerToken
    //   )

      await sendEmailSuccessTicket({ base64String: file ?? "" })
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
  };
  const [isAgent, setIsAgent] = useState(true);
  const getData = async () => {
    // const response = await axios.get(
    //   environment.currentUserInfo,
    //   environment.headerToken
    // );

    const response =  getGetCurrentUser()
    setIsAgent(response.data.isAgent);
  };

  useEffect(() => {
    getAgentData();
    getData();
    if (JSON.parse(localStorage.getItem("ismailbook"))) {
      // _successTicketMail();
      localStorage.setItem("ismailbook", JSON.stringify(false));
      // setIsMailSentFromIssueTicket(false);
    }
  }, []);

  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownloadPdf = async () => {
    setPartialData(true)
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
    pdf.save("booking_Triplover.pdf");
    setIsDownloading(false);
    setPartialData(false)
  };

  const handlePrintDone = () => {
    setPartialData(true);
    setTimeout(() => {
      handlePrint()
    }, 1000);
    
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
    setPartialData(true)
    setbtnDisabled(true);
    setIsSending(true);
    setTimeout(() => { }, 1000);
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
      //     fileName: "Book",
      //   })

        sendEmailProposal( {
          ...messageData,
          html: file,
          attactment: "",
          fileName: "Book",
        })
        .then((response) => {
          if (response.status === 200 && response.data) {
            toast.success("Email send successfully.");
            setIsSending(false);
            setPartialData(false)
            onClose();
          } else {
            toast.error("Please try again.");
            setPartialData(false)
          }
        })
        .finally(() => {
          setbtnDisabled(false);
          setPartialData(false)
          setTimeout(() => onClose(), 2000);
        });
    });
  };


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

    // onBeforeGetContent: () => {
    //   setPartialData(true)
    // },
    onAfterPrint: () => {
     
      setPartialData(false);
    }
  }
  
  );

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();

  const handleCancelBook = () => {
    onClose1();
    setTitle("cancel booking");
    const sendObj = {
      pnr: bookData.data.item1.pnr,
      bookingRefNumber: bookData.data.item1.bookingRefNumber,
      priceCodeRef: bookData.data.item1.priceCodeRef,
      uniqueTransID: bookData.data.item1.uniqueTransID,
      itemCodeRef: bookData.data.item1.itemCodeRef,
      bookingCodeRef: bookData.data.item1.bookingCodeRef,
      commission: 0,
    };
    setLoading(true);
    async function fetchOptions() {
      // await axios
      //   .post(environment.cancelBooking, sendObj, environment.headerToken)
        await  cancelBooking(sendObj)
        .then((response) => {
          if (
            response.data.item1 !== null &&
            response.data.item2?.isSuccess === true &&
            response.data.item1?.isCancel === true
          ) {
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
            onClose1();
          }
        });
    }
    fetchOptions();
  };

  const uniqueTransID = JSON.parse(sessionStorage.getItem("uniqueTransID"));

  const [partialPaymentData, setPartialPaymentData] = useState({});
  const [loader, setLoader] = useState(false);

  const getPartialPaymentInformation = async () => {
    setLoader(true);
    // await axios
    //   .get(
    //     environment.getPartialPaymentInformation +
    //     "?UniqueTransId=" +
    //     uniqueTransID,
    //     environment.headerToken
    //   )

      await  getPartialPaymentInfo(uniqueTransID)
      .then((res) => {
        setPartialPaymentData(res?.data);
        setLoader(false);
      })
      .catch((err) => {
        toast.error("Please try again!");
        setLoader(false);
      });
  };

  useEffect(() => {
    getPartialPaymentInformation();
  }, []);

  return (
    <div>
      <Loading loading={loading}></Loading>
      <AlertDialog isOpen={isOpen1} onClose={onClose1}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {/* Delete Customer */}
              <GiCancel color="red" style={{ height: "50px", width: "50px" }} />
            </AlertDialogHeader>

            <AlertDialogBody
              fontWeight="bold"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              Are you sure? You Want To Cancel Your Booking.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose1} colorScheme="red">
                Cancel
              </Button>
              <Button onClick={handleCancelBook} ml={3} colorScheme="teal">
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content">
          <div className="container mt-3">
            <div className="row">
              <div className="col-lg-12">
                <h4 className="fw-bold text-center bg-white text-dark p-2">
                  Thank you for your booking
                </h4>
              </div>
            </div>
          </div>

          <div className="container mt-3 py-2 pb-5">
            <div id="ui-view" data-select2-id="ui-view">
              <div>
                <div className="card box-shadow">
                  <div className="card-header">
                    {/* <span>
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
                        </span> */}

                    <ul id="menu-standard">
                      <li id="menu-item" >
                        {/* <ReactToPrint
                          trigger={() => (
                            <button className="btn btn-sm btn-secondary float-right mr-1 d-print-none rounded"  onClick={handlePrint}>
                              <span className="me-1">
                                <i className="fa fa-print"></i>
                              </span>
                              Print
                            </button>
                          )}
                          content={() => componentRef.current}
                          onAfterPrint={handleAfterPrint} 
                        /> */}

<button className="btn btn-sm btn-secondary float-right mr-1 d-print-none rounded"  onClick={handlePrintDone}>
                              <span className="me-1">
                                <i className="fa fa-print"></i>
                              </span>
                              Print
                            </button>
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

                  <div
                    className="card-body"
                    ref={componentRef}
                    id="sendEmailDiv"
                  >
                    <div ref={donwloadRef} className="mx-5 px-5 pt-3">
                      <h4 className="text-center pb-2">E-Book</h4>
                      <table class="table table-borderless table-sm">
                        <tbody>
                          <tr>
                            {/* FIXED COMPANY LOGO */}
                            {/* CHANGE THIS LATER */}
                            <td className="text-start">
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
                            <th colspan="4" className="fw-bold py-2 bg-light">
                              BOOKING CONFIRMED
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="fw-bold">Booking ID:</td>
                            <td>{bookData.data?.item1.uniqueTransID}</td>
                            <td className="fw-bold">PNR</td>
                            <td>{bookData.data?.item1.pnr}</td>
                          </tr>
                          <tr>
                            <th>Booking Status:</th>
                            <td>
                              {bookData.data?.item1.bookingStatus === "Created"
                                ? "Booked"
                                : bookData.data?.item1.bookingStatus}
                            </td>
                            <td className="fw-bold">Booked By:</td>
                            <td>{sessionStorage.getItem("agentName")}</td>
                          </tr>
                          <tr>
                            {bookData.data?.item1?.ticketingTimeLimit !== "" ? (
                              <>
                                <th>Issue Before:</th>
                                <td style={{ color: "red" }}>
                                  {/* {bookData.data?.item1.ticketingTimeLimit} */}
                                  {bookData.data?.item1?.ticketingTimeLimit}
                                </td>
                              </>
                            ) : (
                              <></>
                            )}
                            {bookData.data?.item1.airlinesPNR?.length > 0 ? (
                              <>
                                <td className="fw-bold">Airline PNR</td>
                                <td>
                                  {bookData.data?.item1.airlinesPNR?.map(
                                    (item) => {
                                      return <span>{item}</span>;
                                    }
                                  )}
                                </td>
                              </>
                            ) : (
                              <></>
                            )}
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
                              <th colspan="5" className="fw-bold py-2 bg-light">
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
                            {bookData.data?.item1.passengerInfoes.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td>
                                    {item.nameElement.title}{" "}
                                    {item.nameElement.firstName}{" "}
                                    {item.nameElement.lastName}
                                  </td>
                                  <td>
                                    {/* {getPassengerType(item.passengerType)} */}
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
                                    {
                                      item.dateOfBirth === null
                                        ? "N/A"
                                        : moment(item.dateOfBirth).format(
                                          "DD-MMMM-yyyy"
                                        )
                                      // :
                                      // format(new Date(item.dateOfBirth), "dd-MM-yyyy")
                                    }
                                  </td>
                                  <td>
                                    {bookData.data?.item1.flightInfo?.directions[0][0].segments.map(
                                      (itm, index) => {
                                        return (
                                          <>
                                            {index === 0 ? (
                                              <>
                                                {getCountryCode(itm.from) ===
                                                  "Bangladesh" &&
                                                  getCountryCode(itm.to) ===
                                                  "Bangladesh" ? (
                                                  <>N/A</>
                                                ) : (
                                                  <>
                                                    {item.documentInfo
                                                      ?.documentNumber === ""
                                                      ? "N/A"
                                                      : item.documentInfo
                                                        ?.documentNumber}
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
                                  </td>
                                </tr>
                              )
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
                              <th colspan="8" className="fw-bold py-2 bg-light">
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
                            {bookData.data?.item1.flightInfo?.directions[0][0].segments.map(
                              (item, index) => {
                                // (getCountryFomAirport(item.from) !==
                                // "Bangladesh" ||
                                // getCountryFomAirport(item.to) !==
                                //   "Bangladesh") &&
                                // setIsDomestic(false);
                                return (
                                  <tr key={index}>
                                    <td>
                                      {item.airline}
                                      <br></br>
                                      <span style={{ fontSize: "12px" }}>
                                        {item.plane[0]}
                                      </span>
                                    </td>
                                    <td>
                                      {item.airlineCode}-{item.flightNumber}
                                    </td>
                                    <td>
                                      {item.from}
                                      <br></br>
                                      <span style={{ fontSize: "12px" }}>
                                        {airports
                                          .filter((f) => f.iata === item.from)
                                          .map((item) => item.city)}
                                        {item.details[0].originTerminal !==
                                          null &&
                                          item.details[0].originTerminal !==
                                          "" ? (
                                          <>
                                            {" "}
                                            (Terminal-
                                            {item.details[0].originTerminal})
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </span>
                                    </td>
                                    <td>
                                      {moment(item.departure).format(
                                        "DD-MM-YYYY"
                                      )}
                                      <br></br>
                                      {moment(item.departure).format(
                                        "HH:mm:ss"
                                      )}

                                      {/* moment(item.issueDate).format(
                                    "DD-MM-YYYY HH:mm:ss"
                                    ) */}
                                    </td>
                                    <td>
                                      {item.to}
                                      <br></br>
                                      <span style={{ fontSize: "12px" }}>
                                        {airports
                                          .filter((f) => f.iata === item.to)
                                          .map((item) => item.city)}
                                        {item.details[0].destinationTerminal !==
                                          null &&
                                          item.details[0].destinationTerminal !==
                                          "" ? (
                                          <>
                                            {" "}
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
                                      {moment(item.arrival).format(
                                        "DD-MM-YYYY"
                                      )}
                                      <br></br>
                                      {moment(item.arrival).format("HH:mm:ss")}
                                    </td>
                                    <td>{item.fareBasisCode}</td>
                                    <td>
                                      {" "}
                                      {item.serviceClass === "Y"
                                        ? "ECONOMY" +
                                        " (" +
                                        item.bookingClass +
                                        ")"
                                        : item.serviceClass === "C"
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

                            {bookData.data?.item1.flightInfo.directions[1] !==
                              undefined ? (
                              <>
                                {bookData.data?.item1.flightInfo.directions[1][0].segments.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td>
                                        {item.airline}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {item.plane[0]}
                                        </span>
                                      </td>
                                      <td>
                                        {item.airlineCode}-{item.flightNumber}
                                      </td>
                                      <td>
                                        {item.from}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {airports
                                            .filter((f) => f.iata === item.from)
                                            .map((item) => item.city)}
                                          {item.details[0].originTerminal !==
                                            null &&
                                            item.details[0].originTerminal !==
                                            "" ? (
                                            <>
                                              {" "}
                                              (Terminal-
                                              {item.details[0].originTerminal})
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </span>
                                      </td>
                                      <td>
                                        {moment(item.departure).format(
                                          "DD-MM-YYYY"
                                        )}
                                        <br></br>
                                        {moment(item.departure).format(
                                          "HH:mm:ss"
                                        )}

                                        {/* moment(item.issueDate).format(
                                    "DD-MM-YYYY HH:mm:ss"
                                    ) */}
                                      </td>
                                      <td>
                                        {item.to}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {airports
                                            .filter((f) => f.iata === item.to)
                                            .map((item) => item.city)}
                                          {item.details[0]
                                            .destinationTerminal !== null &&
                                            item.details[0]
                                              .destinationTerminal !== "" ? (
                                            <>
                                              {" "}
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
                                        {moment(item.arrival).format(
                                          "DD-MM-YYYY"
                                        )}
                                        <br></br>
                                        {moment(item.arrival).format(
                                          "HH:mm:ss"
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
                                          : item.serviceClass === "C"
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
                                  )
                                )}
                              </>
                            ) : (
                              <></>
                            )}

                            {bookData.data?.item1.flightInfo.directions[2] !==
                              undefined ? (
                              <>
                                {bookData.data?.item1.flightInfo.directions[2][0].segments.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td>
                                        {item.airline}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {item.plane[0]}
                                        </span>
                                      </td>
                                      <td>
                                        {item.airlineCode}-{item.flightNumber}
                                      </td>
                                      <td>
                                        {item.from}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {airports
                                            .filter((f) => f.iata === item.from)
                                            .map((item) => item.city)}
                                          {item.details[0].originTerminal !==
                                            null &&
                                            item.details[0].originTerminal !==
                                            "" ? (
                                            <>
                                              {" "}
                                              (Terminal-
                                              {item.details[0].originTerminal})
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </span>
                                      </td>
                                      <td>
                                        {moment(item.departure).format(
                                          "DD-MM-YYYY"
                                        )}
                                        <br></br>
                                        {moment(item.departure).format(
                                          "HH:mm:ss"
                                        )}

                                        {/* moment(item.issueDate).format(
                                    "DD-MM-YYYY HH:mm:ss"
                                    ) */}
                                      </td>
                                      <td>
                                        {item.to}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {airports
                                            .filter((f) => f.iata === item.to)
                                            .map((item) => item.city)}
                                          {item.details[0]
                                            .destinationTerminal !== null &&
                                            item.details[0]
                                              .destinationTerminal !== "" ? (
                                            <>
                                              {" "}
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
                                        {moment(item.arrival).format(
                                          "DD-MM-YYYY"
                                        )}
                                        <br></br>
                                        {moment(item.arrival).format(
                                          "HH:mm:ss"
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
                                          : item.serviceClass === "C"
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
                                  )
                                )}
                              </>
                            ) : (
                              <></>
                            )}

                            {bookData.data?.item1.flightInfo.directions[3] !==
                              undefined ? (
                              <>
                                {bookData.data?.item1.flightInfo.directions[3][0].segments.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td>
                                        {item.airline}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {item.plane[0]}
                                        </span>
                                      </td>
                                      <td>
                                        {item.airlineCode}-{item.flightNumber}
                                      </td>
                                      <td>
                                        {item.from}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {airports
                                            .filter((f) => f.iata === item.from)
                                            .map((item) => item.city)}
                                          {item.details[0].originTerminal !==
                                            null &&
                                            item.details[0].originTerminal !==
                                            "" ? (
                                            <>
                                              {" "}
                                              (Terminal-
                                              {item.details[0].originTerminal})
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </span>
                                      </td>
                                      <td>
                                        {moment(item.departure).format(
                                          "DD-MM-YYYY"
                                        )}
                                        <br></br>
                                        {moment(item.departure).format(
                                          "HH:mm:ss"
                                        )}

                                        {/* moment(item.issueDate).format(
                                    "DD-MM-YYYY HH:mm:ss"
                                    ) */}
                                      </td>
                                      <td>
                                        {item.to}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {airports
                                            .filter((f) => f.iata === item.to)
                                            .map((item) => item.city)}
                                          {item.details[0]
                                            .destinationTerminal !== null &&
                                            item.details[0]
                                              .destinationTerminal !== "" ? (
                                            <>
                                              {" "}
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
                                        {moment(item.arrival).format(
                                          "DD-MM-YYYY"
                                        )}
                                        <br></br>
                                        {moment(item.arrival).format(
                                          "HH:mm:ss"
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
                                          : item.serviceClass === "C"
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
                                  )
                                )}
                              </>
                            ) : (
                              <></>
                            )}

                            {bookData.data?.item1.flightInfo.directions[4] !==
                              undefined ? (
                              <>
                                {bookData.data?.item1.flightInfo.directions[4][0].segments.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td>
                                        {item.airline}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {item.plane[0]}
                                        </span>
                                      </td>
                                      <td>
                                        {item.airlineCode}-{item.flightNumber}
                                      </td>
                                      <td>
                                        {item.from}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {airports
                                            .filter((f) => f.iata === item.from)
                                            .map((item) => item.city)}
                                          {item.details[0].originTerminal !==
                                            null &&
                                            item.details[0].originTerminal !==
                                            "" ? (
                                            <>
                                              {" "}
                                              (Terminal-
                                              {item.details[0].originTerminal})
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </span>
                                      </td>
                                      <td>
                                        {moment(item.departure).format(
                                          "DD-MM-YYYY"
                                        )}
                                        <br></br>
                                        {moment(item.departure).format(
                                          "HH:mm:ss"
                                        )}

                                        {/* moment(item.issueDate).format(
                                    "DD-MM-YYYY HH:mm:ss"
                                    ) */}
                                      </td>
                                      <td>
                                        {item.to}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {airports
                                            .filter((f) => f.iata === item.to)
                                            .map((item) => item.city)}
                                          {item.details[0]
                                            .destinationTerminal !== null &&
                                            item.details[0]
                                              .destinationTerminal !== "" ? (
                                            <>
                                              {" "}
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
                                        {moment(item.arrival).format(
                                          "DD-MM-YYYY"
                                        )}
                                        <br></br>
                                        {moment(item.arrival).format(
                                          "HH:mm:ss"
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
                                          : item.serviceClass === "C"
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
                                  )
                                )}
                              </>
                            ) : (
                              <></>
                            )}

                            {bookData.data?.item1.flightInfo.directions[5] !==
                              undefined ? (
                              <>
                                {bookData.data?.item1.flightInfo.directions[5][0].segments.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td>
                                        {item.airline}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {item.plane[0]}
                                        </span>
                                      </td>
                                      <td>
                                        {item.airlineCode}-{item.flightNumber}
                                      </td>
                                      <td>
                                        {item.from}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {airports
                                            .filter((f) => f.iata === item.from)
                                            .map((item) => item.city)}
                                          {item.details[0].originTerminal !==
                                            null &&
                                            item.details[0].originTerminal !==
                                            "" ? (
                                            <>
                                              {" "}
                                              (Terminal-
                                              {item.details[0].originTerminal})
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </span>
                                      </td>
                                      <td>
                                        {moment(item.departure).format(
                                          "DD-MM-YYYY"
                                        )}
                                        <br></br>
                                        {moment(item.departure).format(
                                          "HH:mm:ss"
                                        )}

                                        {/* moment(item.issueDate).format(
                                    "DD-MM-YYYY HH:mm:ss"
                                    ) */}
                                      </td>
                                      <td>
                                        {item.to}
                                        <br></br>
                                        <span style={{ fontSize: "12px" }}>
                                          {airports
                                            .filter((f) => f.iata === item.to)
                                            .map((item) => item.city)}
                                          {item.details[0]
                                            .destinationTerminal !== null &&
                                            item.details[0]
                                              .destinationTerminal !== "" ? (
                                            <>
                                              {" "}
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
                                        {moment(item.arrival).format(
                                          "DD-MM-YYYY"
                                        )}
                                        <br></br>
                                        {moment(item.arrival).format(
                                          "HH:mm:ss"
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
                                          : item.serviceClass === "C"
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
                                  )
                                )}
                              </>
                            ) : (
                              <></>
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
                              <th colspan="7" className="fw-bold py-2 bg-light">
                                FARE DETAILS
                              </th>
                            </tr>
                            <tr className="text-end">
                              <th className="text-center">Type</th>
                              <th>Base</th>
                              <th>Tax</th>
                              <th>Commission</th>
                              <th>AIT</th>
                              <th>Pax</th>
                              <th>Total Pax Fare</th>
                            </tr>
                          </thead>
                          <tbody className="text-end">
                            {bookData.data?.item1.flightInfo?.passengerFares
                              .adt !== null ? (
                              <>
                                <tr>
                                  <td className="text-center">Adult</td>
                                  <td className="left">
                                    {bookData.data?.item1.flightInfo?.passengerFares.adt.basePrice.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="center">
                                    {bookData.data?.item1.flightInfo?.passengerFares.adt.taxes.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {bookData.data?.item1.flightInfo?.passengerFares.adt.discountPrice.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {bookData.data?.item1.flightInfo?.passengerFares.adt.ait.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {
                                      bookData.data?.item1.flightInfo
                                        ?.passengerCounts.adt
                                    }
                                  </td>
                                  <td className="right fw-bold">
                                    AED{" "}
                                    {(
                                      bookData.data?.item1.flightInfo
                                        ?.passengerFares.adt.totalPrice *
                                      bookData.data?.item1.flightInfo
                                        ?.passengerCounts.adt
                                    ).toLocaleString("en-US")}
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <></>
                            )}

                            {bookData.data?.item1.flightInfo?.passengerFares
                              .chd !== null ? (
                              <>
                                <tr>
                                  <td className="text-center">Child &gt; 5</td>
                                  <td className="left">
                                    {bookData.data?.item1.flightInfo?.passengerFares.chd.basePrice.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="center">
                                    {bookData.data?.item1.flightInfo?.passengerFares.chd.taxes.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {bookData.data?.item1.flightInfo?.passengerFares.chd.discountPrice.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {bookData.data?.item1.flightInfo?.passengerFares.chd.ait.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {
                                      bookData.data?.item1.flightInfo
                                        ?.passengerCounts.chd
                                    }
                                  </td>
                                  <td className="right fw-bold">
                                    AED{" "}
                                    {(
                                      bookData.data?.item1.flightInfo
                                        ?.passengerFares.chd.totalPrice *
                                      bookData.data?.item1.flightInfo
                                        ?.passengerCounts.chd
                                    ).toLocaleString("en-US")}
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <></>
                            )}

                            {bookData.data?.item1.flightInfo?.passengerFares
                              .cnn !== null ? (
                              <>
                                <tr>
                                  <td className="text-center">
                                    {bookData.data?.item1.flightInfo
                                      ?.passengerFares.chd === null ? (
                                      <>Child</>
                                    ) : (
                                      <> Child &#60; 5</>
                                    )}
                                  </td>
                                  <td className="left">
                                    {bookData.data?.item1.flightInfo?.passengerFares.cnn.basePrice.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="center">
                                    {bookData.data?.item1.flightInfo?.passengerFares.cnn.taxes.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {bookData.data?.item1.flightInfo?.passengerFares.cnn.discountPrice.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {bookData.data?.item1.flightInfo?.passengerFares.cnn.ait.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {
                                      bookData.data?.item1.flightInfo
                                        ?.passengerCounts.cnn
                                    }
                                  </td>
                                  <td className="right fw-bold">
                                    AED{" "}
                                    {(
                                      bookData.data?.item1.flightInfo
                                        ?.passengerFares.cnn.totalPrice *
                                      bookData.data?.item1.flightInfo
                                        ?.passengerCounts.cnn
                                    ).toLocaleString("en-US")}
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <></>
                            )}

                            {bookData.data?.item1.flightInfo?.passengerFares
                              .inf !== null ? (
                              <>
                                <tr>
                                  <td className="text-center">Infant</td>
                                  <td className="left">
                                    {bookData.data?.item1.flightInfo?.passengerFares.inf.basePrice.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="center">
                                    {bookData.data?.item1.flightInfo?.passengerFares.inf.taxes.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {bookData.data?.item1.flightInfo?.passengerFares.inf.discountPrice.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {bookData.data?.item1.flightInfo?.passengerFares.inf.ait.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                  <td className="right">
                                    {
                                      bookData.data?.item1.flightInfo
                                        ?.passengerCounts.inf
                                    }
                                  </td>
                                  <td className="right fw-bold">
                                    AED{" "}
                                    {(
                                      bookData.data?.item1.flightInfo
                                        ?.passengerFares.inf.totalPrice *
                                      bookData.data?.item1.flightInfo
                                        ?.passengerCounts.inf
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
                                {(bookData.data?.item1.flightInfo?.bookingComponents[0].totalPrice).toLocaleString(
                                  "en-US"
                                )}
                              </td>
                            </tr>
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
                              <th colspan="3" className="fw-bold py-2 bg-light">
                                CONTACT DETAILS
                              </th>
                            </tr>
                            <tr className="text-center">
                              <th>DEPARTS</th>
                              <th>Phone Number</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {bookData.data?.item1.passengerInfoes.map(
                              (item, index) => (
                                <>
                                  {index === 0 ? (
                                    <>
                                      <tr key={index}>
                                        <td>
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                bookData.data?.item1.flightInfo
                                                  ?.directions[0][0].from
                                            )
                                            .map((item) => item.city)}{" "}
                                          {/* {bookData.data?.item1.flightInfo.dirrections[0][0].from} */}
                                        </td>
                                        <td>
                                          {item.contactInfo.phoneCountryCode +
                                            item.contactInfo.phone}{" "}
                                        </td>
                                      </tr>
                                      {/* <tr key={index}>
                                      <td>
                                        {airports
                                          .filter(
                                            (f) =>
                                              f.iata ===
                                              bookData.data?.item1.flightInfo
                                                ?.directions[0][0].to
                                          )
                                          .map((item) => item.city)}{" "}
                                        (Optional)
                                      </td>
                                      <td>
                                        {item.contactInfo.phoneCountryCode +
                                          item.contactInfo.phone}{" "}
                                      </td>
                                    </tr> */}
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                      {/* //partial payment */}

                      {loader ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          
                          {partialData === false ? 
                            partialPaymentData?.isEligible && (
                            <Box>
                              <fieldset
                                className="border rounded"
                                style={{
                                  marginBottom: "2%",
                                  paddingLeft: "2%",
                                }}
                              >
                                <legend
                                  className="float-none w-auto fw-bold "
                                  style={{ fontSize: "14px" }}
                                >
                                  {" Payments Options"}
                                </legend>
                                <Box className="d-flex justify-content-start gap-4">

                                  <Box gap={2} fontSize={"14px"} onClick={() =>
                                    setPayment({
                                      partialPayment: true,
                                      fullPayment: false,
                                    })}>
                                    <input
                                      type="radio"
                                      checked={payment.partialPayment}
                                      value={payment.partialPayment}
                                      name="flexRadioDefault"
                                      id="flexRadioDefault1"
                                    />
                                    <label className="pl-2">
                                      Partial Payment{" "}
                                      <span style={{ fontSize: "12px" }} className="text-danger">
                                        (InstantPay - {partialPaymentData?.instantPayAmount?.toLocaleString("en-US")})
                                      </span>

                                    </label>
                                    {
                                      payment?.partialPayment ? <>
                                        <p className="text-end fw-bold text-danger pb-2" style={{ fontSize: "12px" }}><span >Settlement Days : </span> {moment(partialPaymentData?.lastSettlementDate).format("DD MMM,yyyy, ddd")}({partialPaymentData?.eligibleSettlementDays} days)</p></> : <></>
                                    }


                                  </Box>

                                  <Box gap={4} fontSize={"14px"} onClick={() =>
                                    setPayment({
                                      partialPayment: false,
                                      fullPayment: true,
                                    })}>
                                    <input
                                      type="radio"
                                      value={payment.fullPayment}
                                      checked={payment.fullPayment && true}
                                      name="flexRadioDefault"
                                      id="flexRadioDefault2"
                                    />
                                    <label className="pl-2">
                                      Full Payment{" "}
                                      <span
                                        style={{ fontSize: "12px" }}
                                        className="text-danger"
                                      >
                                        (Totalpay -{" "}
                                        {partialPaymentData?.totalTicketFare?.toLocaleString("en-US")})
                                      </span>
                                    </label>
                                  </Box>
                                </Box>
                              </fieldset>
                            </Box>
                          )

                          :""}
                        </>
                      )}
                    </div>
                  </div>

                  {
                    partialPaymentData?.isEligible ? <>
                      {
                        payment.partialPayment ? <>

                          {agentInfo?.activeCredit + agentInfo?.currentBalance <
                            partialPaymentData?.instantPayAmount ? (
                            <>
                              <div className="row mb-5 mt-2">
                                <div className="col-lg-12 text-center text-danger">
                                  <p>
                                    You don't have available balance to generate Ticket!
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : agentInfo?.balanceLimit <
                            partialPaymentData?.instantPayAmount && !isAgent ? (
                            <>
                              <div className="row mb-5 mt-2">
                                <div className="col-lg-12 text-center text-danger">
                                  <p>
                                    You don't have permission for generating Ticket over
                                    transection limit {agentInfo?.balanceLimit}!
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="row mb-1 mt-2">
                              <div className="col-lg-12 text-center">
                                <button
                                  className="btn button-color text-white fw-bold w-25 mt-2 rounded btn-sm"
                                  onClick={handleGenarateTicket}
                                  disabled={
                                    (userRole > 2 || userRole === "null") && !loading
                                      ? false
                                      : true
                                  }
                                >
                                  Issue Ticket
                                </button>
                                {userRole > 2 || userRole === "null" ? (
                                  <></>
                                ) : (
                                  <div className="text-red">
                                    N.B: Your permission to Ticket is denied.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </> : <>
                          {agentInfo?.activeCredit + agentInfo?.currentBalance <
                            bookData?.data?.item1.flightInfo?.bookingComponents[0]
                              .totalPrice ? (
                            <>
                              <div className="row mb-5 mt-2">
                                <div className="col-lg-12 text-center text-danger">
                                  <p>
                                    You don't have available balance to generate Ticket!
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : agentInfo?.balanceLimit <
                            bookData.data?.item1.flightInfo?.bookingComponents[0]
                              .totalPrice && !isAgent ? (
                            <>
                              <div className="row mb-5 mt-2">
                                <div className="col-lg-12 text-center text-danger">
                                  <p>
                                    You don't have permission for generating Ticket over
                                    transection limit {agentInfo?.balanceLimit}!
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="row mb-1 mt-2">
                              <div className="col-lg-12 text-center">
                                <button
                                  className="btn button-color text-white fw-bold w-25 mt-2 rounded btn-sm"
                                  onClick={handleGenarateTicket}
                                  disabled={
                                    (userRole > 2 || userRole === "null") && !loading
                                      ? false
                                      : true
                                  }
                                >
                                  Issue Ticket
                                </button>
                                {userRole > 2 || userRole === "null" ? (
                                  <></>
                                ) : (
                                  <div className="text-red">
                                    N.B: Your permission to Ticket is denied.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      }

                    </> : <>
                      {agentInfo?.activeCredit + agentInfo?.currentBalance <
                        bookData?.data?.item1.flightInfo?.bookingComponents[0]
                          .totalPrice ? (
                        <>
                          <div className="row mb-5 mt-2">
                            <div className="col-lg-12 text-center text-danger">
                              <p>
                                You don't have available balance to generate Ticket!
                              </p>
                            </div>
                          </div>
                        </>
                      ) : agentInfo?.balanceLimit <
                        bookData.data?.item1.flightInfo?.bookingComponents[0]
                          .totalPrice && !isAgent ? (
                        <>
                          <div className="row mb-5 mt-2">
                            <div className="col-lg-12 text-center text-danger">
                              <p>
                                You don't have permission for generating Ticket over
                                transection limit {agentInfo?.balanceLimit}!
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="row mb-1 mt-2">
                          <div className="col-lg-12 text-center">
                            <button
                              className="btn button-color text-white fw-bold w-25 mt-2 rounded btn-sm"
                              onClick={handleGenarateTicket}
                              disabled={
                                (userRole > 2 || userRole === "null") && !loading
                                  ? false
                                  : true
                              }
                            >
                              Issue Ticket
                            </button>
                            {userRole > 2 || userRole === "null" ? (
                              <></>
                            ) : (
                              <div className="text-red">
                                N.B: Your permission to Ticket is denied.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  }


                  <div className="row mb-5">
                    <div className="col-lg-12 text-center">
                      <button
                        className="btn button-color text-white fw-bold w-25 mt-2 rounded btn-sm"
                        onClick={onOpen1}
                        disabled={loading ? true : false}
                      >
                        Cancel Booking
                      </button>
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

export default SuccessBookingPanel;
