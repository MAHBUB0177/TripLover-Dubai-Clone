import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { GiCancel } from "react-icons/gi";
import html2canvas from "html2canvas";
import $ from "jquery";
import jsPDF from "jspdf";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdEmail ,MdContentCopy} from "react-icons/md";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { toast, ToastContainer } from "react-toastify";
import tllLogo from "../../../src/images/logo/logo-combined.png";
import {
  getCountryCode,
  getPassengerType,
  preventNegativeValues,
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
import {
  cancelBooking,
  cancelBookingCombo,
  getGetCurrentUser,
  getLimit,
  getPartialPaymentInfo,
  getSegments,
  getTicketData,
  getTicketUnlockOtp,
  getUserInfo,
  importPnr,
  passengerListByIds,
  requestComboTicket,
  sendEmailProposal,
  ticketIssue,
  verifyIfUnlockedForTicket,
  verifyTicketUnlockOtp,
} from "../../common/allApi";
import ImageComponentForAgent from "../../common/ImageComponentForAgent";
import { useClipboard } from "@chakra-ui/react";

import { IoCheckmarkDone } from "react-icons/io5";

const BookedView = () => {
  const userRole =
    localStorage.getItem("userRole") &&
    atob(atob(atob(localStorage.getItem("userRole"))));
  const [searchParams] = useSearchParams();
  const { setLoading, setTicketData, loading } = useAuth();
  const navigate = useNavigate();
  const componentRef = useRef();
  const componentRefCombo = useRef();
  let [ticketingList, setTicketingList] = useState([]);
  let [ticketingListReturn, setTicketingListReturn] = useState({});
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
  let [lastTicketTime, setLastTicketTime] = useState("");
  let [fareValidationTime, setFareValidationTime] = useState("");
  let [lastTicketTimeReturn, setLastTicketTimeReturn] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  let [isFareChange, setIsFareChange] = useState(false);
  let [isRBDChange, setIsRBDChange] = useState(false);
  const [isAgentInfo, setIsAgentInfo] = useState(false);
  const [contactInfo, setContactInfo] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [load, setLoad] = useState(false);
  const [ticketResponse, setTicketResponse] = useState();

  const [journeyType, setJourneyType] = useState("");

  const [checkStatus, setCheckStatus] = useState("");

  const bookData = JSON.parse(sessionStorage.getItem("bookData"));

  const [partialData, setPartialData] = useState(false);

  const donwloadRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();
  const {
    isOpen: isOpen4,
    onOpen: onOpen4,
    onClose: onClose4,
  } = useDisclosure();

  const [messageData, setMessageData] = useState({});
  const [btnDisabled, setbtnDisabled] = useState(false);

  const [payment, setPayment] = useState({
    partialPayment: false,
    fullPayment: true,
  });

  const [paymentForReprice, setPaymentForReprice] = useState({
    partialPayment: false,
    fullPayment: true,
  });

  const handleMessageUser = async (e) => {
    e.preventDefault();
    if (
      messageData.toEmail === "" ||
      messageData.toEmail === null ||
      messageData.toEmail === undefined
    ) {
      return toast.error("Enter Email then try again.");
    }
    setPartialData(true);
    setbtnDisabled(true);
    setIsSending(true);
    componentRef.current.style.width = "989px";
    const element = componentRef.current;
    html2canvas(element, {
      logging: true,
      allowTaint: false,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      quality: 4,
      scale: 4,
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
        fileName: "Book",
      })
        .then((response) => {
          if (response.status === 200 && response.data) {
            toast.success("Email send successfully.");
            setIsSending(false);
            setPartialData(false);
            onClose();
          } else {
            toast.error("Please try again.");
            setPartialData(false);
          }
        })
        .finally(() => {
          setbtnDisabled(false);
          setTimeout(() => onClose(), 2000);
          setPartialData(false);
        });
    });
  };

  const handlePrint = useReactToPrint({
    content: () =>
      ticketingList?.comboSegmentInfo?.length > 0
        ? componentRefCombo.current
        : componentRef.current,
    onAfterPrint: () => {
      setPartialData(false);
    },
  });

  const handlePrintDone = () => {
    setPartialData(true);
    setTimeout(() => {
      handlePrint();
    }, 500);
  };

  let [agentInfo, setAgentInfo] = useState(0);
  const getAgentData = async () => {
    getUserInfo()
      .then((agentRes) => {
        setAgentInfo(agentRes.data);
        sessionStorage.setItem("agentInfoData", JSON.stringify(agentRes?.data));
      })
      .catch((err) => {
        //alert('Invalid login')
      });
  };
  const [isAgent, setIsAgent] = useState(true);
  const getData = async () => {
    const response = await getGetCurrentUser();
    setIsAgent(response.data.isAgent);
  };
  useEffect(() => {
    getAgentData();
    getData();
  }, []);

  const location = useLocation();
  const handleGetList = (utid, sts) => {
    setLoad(true);
    const getTicketingList = async () => {
      // let sendObj = { uniqueTransID: location.search.split("=")[1] };
      let sendObj = location.search.split("=")[1];
      const response = await getTicketData(utid, sts);
      setLoad(false);
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
          setTicketingList(response.data);
          handleGetListReturn(
            response.data?.comboSegmentInfo[1]?.uniqueTransID,
            searchParams.get("sts")
          );
        } else {
          setTicketingListReturn(response.data);
          handleGetListReturn(
            response.data?.comboSegmentInfo[0]?.uniqueTransID,
            searchParams.get("sts")
          );
        }
      } else {
        setJourneyType("ONWARD");
        setTicketingList(response.data);
      }
      setLastTicketTime(response?.data?.ticketInfo?.lastTicketingTime);
      setFareValidationTime(response?.data?.ticketInfo?.fareValidationTime)
      // alert(ticketingList[0].uniqueTransID)
      handleGetPassengerList(
        response.data.data[0].passengerIds,
        response.data.data[0].uniqueTransID
      );
      handleGetSegmentList(response.data.data[0].uniqueTransID);
      sessionStorage.setItem(
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

  const handleGetListReturn = (utid, sts) => {
    setLoad(true);

    const getTicketingList = async () => {
      const response = await getTicketData(utid, sts);

      setLoad(false);

      if (
        response.data?.comboSegmentInfo?.findIndex(
          (item) => item.uniqueTransID === searchParams.get("utid")
        ) === 0
      ) {
        setTicketingListReturn(response.data);
      } else {
        setTicketingList(response.data);
      }

      setLastTicketTimeReturn(response?.data?.ticketInfo?.lastTicketingTime);
    };

    getTicketingList();
  };

  const handleGetSegmentList = (trid) => {
    const getSegmentList = async () => {
      const response = await getSegments(trid);
      setSegmentList(response.data);
    };
    getSegmentList();
  };

  const handleGetPassengerList = (ids, trid) => {
    const getPassengerList = async () => {
      const response = await passengerListByIds(ids, trid);
      passengerList = response.data;
      setPassengerList(response.data);
      let totalPriceTemp = 0;
      response.data.map((item, index) => {
        totalPriceTemp +=
          item.totalPriceEdited > 0 ? item.totalPriceEdited : item.totalPrice;
      });
      setTotalPrice(totalPriceTemp);
      setPassengerListEdited(response.data);
    };
    getPassengerList();
  };
  useEffect(() => {
    handleGetList(searchParams.get("utid"), searchParams.get("sts"));
  }, [searchParams]);

  const print = () => {
    window.print();
  };

  const refLog =
    ticketingList.ticketInfo?.referenceLog !== undefined
      ? ticketingList.ticketInfo?.referenceLog
      : "{}";
  const Obj = JSON.parse(refLog);

  //automatic mail send:
  useEffect(() => {
    localStorage.setItem("ismail", JSON.stringify(false));
  }, []);

  const [title, setTitle] = useState("ticketing");

  const handleGenerateTicket = () => {
    setTitle("ticketing");
    onClose4();
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

    async function fetchOptions() {
      let payload = {
        ...Obj,
        IsPartialPayment: payment?.partialPayment === true ? true : false,
        TicketWithNewFare:
          ticketResponse !== undefined && ticketResponse !== null
            ? ticketResponse?.item1?.isPriceChanged
            : false,
      };
      await ticketIssue(payload).then((response) => {
        if (response.data.item1?.isPriceChanged) {
          onOpen3();
          setTicketResponse(response.data);
          setLoading(false);
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
        } else if (response.data.item2?.isSuccess === true) {
          getAgentData();
          setTicketData(response.data);
          sessionStorage.setItem("ticketData", JSON.stringify(response.data));
          setLoading(false);
          localStorage.setItem("ismail", JSON.stringify(true));
          // navigate("/successticket");
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
          navigate(
            "/ticket?utid=" +
              response.data.item2?.uniqueTransID +
              "&sts=Confirm"
          );
        } else if (
          response.data.item2?.isSuccess === false &&
          response.data.item2?.isMessageShow
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

    if (ticketingList?.ticketInfo?.bookingType === "Import") {
      // handelImportTicket();
    } else {
      fetchOptions();
    }
  };

  const handleGenerateTicketForCombo = () => {
    setTitle("ticketing");
    onClose4();
    setLoading(true);
    const sendObjTicket = {
      pnr: "044NEV",
      bookingRefNumber: "044NEV",
      priceCodeRef:"VExMMjEyNTE5MTQxMC02Mzc4ODk4NTIzMDUwOTg5ODR8MS0wLTB8VVNCYW5nbGE=",
      uniqueTransID: "TLL2125191410",
      itemCodeRef:"VExMMjEyNTE5MTQxMC02Mzc4ODk4NTA3OTM5MjQ0NzB8WERPTXxVU0JhbmdsYQ==",
      bookingCodeRef:"VExMMjEyNTE5MTQxMC02Mzc4ODk4NTI2ODQ3NDA1MjF8MDQ0TkVWfFVTQmFuZ2xh",
      commission: 0,
    };

    async function fetchOptions() {
      let payload = {
        ComboTicketRequests: [
          JSON.parse(ticketingList?.comboSegmentInfo[0]?.referenceLog),
          JSON.parse(ticketingList?.comboSegmentInfo[1]?.referenceLog),
        ],

        IsPartialPayment: payment?.partialPayment === true ? true : false,

        TicketWithNewFare:
          ticketResponse !== undefined && ticketResponse !== null
            ? ticketResponse?.item1?.isPriceChanged
            : false,
      };

      await requestComboTicket(payload).then((response) => {
        if (response.data[0].item1?.isPriceChanged) {
          onOpen3();
          setTicketResponse(response.data);
          setLoading(false);
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
        } else if (response.data[0]?.item2?.isSuccess === true) {
          getAgentData();
          setTicketData(response.data);
          sessionStorage.setItem("ticketData", JSON.stringify(response.data));
          setLoading(false);
          localStorage.setItem("ismail", JSON.stringify(true));
          // navigate("/successticket");
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
          navigate(
            "/ticket?utid=" +
              response.data[0]?.item2?.uniqueTransID +
              "&sts=Confirm"
          );
        } else if (
          response.data[0]?.item2?.isSuccess === false &&
          response.data[0]?.item2?.isMessageShow
        ) {
          setLoading(false);
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
          toast.error(response.data[0]?.item2?.message);
        } else {
          setLoading(false);
          setTicketData(response.data);
          navigate("/processticket");
        }
      });
    }

    if (ticketingList?.ticketInfo?.bookingType === "Import") {
      // handelImportTicket();
    } else {
      fetchOptions();
    }
  };

  const handleGenerateTicketForReprice = () => {
    setTitle("ticketing");
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

    async function fetchOptions() {
      let payload = {
        ...Obj,
        IsPartialPayment:
          paymentForReprice?.partialPayment === true ? true : false,
        TicketWithNewFare:
          ticketResponse !== undefined && ticketResponse !== null
            ? ticketResponse?.item1?.isPriceChanged
            : false,
      };
      await ticketIssue(payload).then((response) => {
        if (response.data.item1?.isPriceChanged) {
          onOpen3();
          setTicketResponse(response.data);
          setLoading(false);
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
        } else if (response.data.item2?.isSuccess === true) {
          getAgentData();
          setTicketData(response.data);
          sessionStorage.setItem("ticketData", JSON.stringify(response.data));
          setLoading(false);
          localStorage.setItem("ismail", JSON.stringify(true));
          // navigate("/successticket");
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
          navigate(
            "/ticket?utid=" +
              response.data.item2?.uniqueTransID +
              "&sts=Confirm"
          );
        } else if (
          response.data.item2?.isSuccess === false &&
          response.data.item2?.isMessageShow
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

    if (ticketingList?.ticketInfo?.bookingType === "Import") {
      // handelImportTicket();
    } else {
      fetchOptions();
    }
  };

  const handleGenerateImportTicket = () => {
    setLoading(true);
    const ticketPayload = {
      importPNRRefCode: "",
      pnr: ticketingList?.ticketInfo?.pnr,
      uniqueTransID: ticketingList?.ticketInfo?.uniqueTransID,
      bookingRefNumber: "",
      apiCode: ticketingList?.ticketInfo?.apiCode,
      apiSubCode: "",
      totalPrice: ticketingList?.ticketInfo?.ticketingPrice,
      isPriceDeductionEnable: true,
      apiRefId: "",
      passengerName: {
        title: ticketingList?.passengerInfo[0]?.nameElement?.title,
        firstName: ticketingList?.passengerInfo[0]?.nameElement?.firstName,
        lastName: ticketingList?.passengerInfo[0]?.nameElement?.lastName,
        middleName: ticketingList?.passengerInfo[0]?.nameElement?.middleName,
      },
      fromB2B: true,
      IsPartialPayment: payment?.partialPayment === true ? true : false,
    };

    async function fetchOptions() {
      await importPnr(ticketPayload)
        .then((res) => {
          if (res?.data?.item2?.isSuccess) {
            setLoading(false);
            $(".modal-backdrop").remove();
            $("body").removeClass("modal-open");
            $("body").removeAttr("style");
            localStorage.setItem("ismail", JSON.stringify(true));
            navigate(
              "/ticket?utid=" +
                res?.data?.item2?.uniqueTransID +
                "&sts=Confirmed"
            );
          } else {
            setLoading(false);
            $(".modal-backdrop").remove();
            $("body").removeClass("modal-open");
            $("body").removeAttr("style");
            navigate("/processticket");
          }
        })
        .catch((error) => {
          toast.error("Please try again!");
          setLoading(false);

          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
        });
    }

    fetchOptions();
  };

  const handleGetTime = (referenceLog) => {
    setIsLoading(true);
    // alert(referenceLog);
    const getTimeReq = async () => {
      await getLimit(JSON.parse(referenceLog))
        .then((res) => {
          if (
            res.data.item1 !== undefined &&
            res.data.item1 !== null &&
            res.data.item1?.lastTicketTime !== null &&
            res.data.item1?.lastTicketTime !== ""
          ) {
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

  const [isLoadingReturn, setIsLoadingReturn] = useState(false);

  const handleGetTimeReturn = (referenceLog) => {
    setIsLoadingReturn(true);

    // alert(referenceLog);

    const getTimeReq = async () => {
      await getLimit(JSON.parse(referenceLog))
        .then((res) => {
          if (
            res.data.item1 !== undefined &&
            res.data.item1 !== null &&
            res.data.item1?.lastTicketTime !== null &&
            res.data.item1?.lastTicketTime !== ""
          ) {
            setLastTicketTimeReturn(res.data.item1?.lastTicketTime);
          } else if (
            res.data.item1 !== undefined &&
            res.data.item1 !== null &&
            res.data.item1?.remarks !== null &&
            res.data.item1?.remarks !== ""
          ) {
            setLastTicketTimeReturn(res.data.item1?.remarks);
          } else {
            toast.error("Please try again after five minutes.");

            setIsLoadingReturn(false);
          }
        })

        .catch((res) => {
          toast.error("Please try again after five minutes.");

          setIsLoadingReturn(false);
        });
    };

    getTimeReq();
  };

  sortPassangerType(ticketingList.passengerInfo);
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();

  const handleCancelBook = () => {
    onClose1();
    setTitle("cancel booking");
    setLoading(true);
    async function fetchOptions() {
      await cancelBooking(Obj).then((response) => {
        if (
          response.data.item1 !== null &&
          response.data.item2?.isSuccess === true &&
          response.data.item1?.isCancel === true
        ) {
          setLoading(false);
          onClose1();
          navigate("/cancelbooking");
        } else {
          setLoading(false);
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


  const handleCancelBookCombo = () => {
    let payload = {
      airCancelRequests: [
        JSON.parse(ticketingList?.comboSegmentInfo[0]?.referenceLog),
        JSON.parse(ticketingList?.comboSegmentInfo[1]?.referenceLog),
      ],
    };
    onClose1();
    setTitle("cancel booking");
    setLoading(true);
    async function fetchOptions() {
      await cancelBookingCombo(payload).then((response) => {
        if (
          response.data[0].item1 !== null &&
          response.data[0].item2?.isSuccess === true &&
          response.data[0].item1?.isCancel === true &&
          response.data[1].item1 !== null &&
          response.data[1].item2?.isSuccess === true &&
          response.data[1].item1?.isCancel === true
        ) {
          setLoading(false);
          onClose1();
          navigate("/cancelbooking");
        } else {
          setLoading(false);
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


  // let uniqueChars = [...new Set(ticketingList.segments.a)];

  let newArr = [];
  ticketingList?.segments?.forEach((item) => {
    if (!newArr.includes(item.airlinePNRs)) {
      newArr.push(item.airlinePNRs);
    }
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownloadPdf = async () => {
    setPartialData(true);
    setIsDownloading(true);
    donwloadRef.current.style.width = "989px";
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
    donwloadRef.current.style.width = "auto";
    setIsDownloading(false);
    setPartialData(false);
  };

  const [partialPaymentData, setPartialPaymentData] = useState({});
  const [loader, setLoader] = useState(false);

  const getPartialPaymentInformation = async () => {
    setLoader(true);
    await getPartialPaymentInfo(searchParams.get("utid"))
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

  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const [desableotp, setdesableotp] = useState("");
  const [verifyIfUnlockedForTicketState, setVerifyIfUnlockedForTicketState] =
    useState(false);

  const handleVerifyTicketUnlockOtp = async () => {
    try {
      const response = await verifyTicketUnlockOtp(
        desableotp,
        searchParams.get("utid")
      );
      if (response.data.isSuccess) {
        handleVerifyIfUnlockedForTicket();
        onClose2();
        toast.success(response.data.message);
      } else if (!response.data.isSuccess) {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error("Please try again");
    }
  };
  const [message, setMessage] = useState("");
  const handlegetTicketUnlockOtp = async () => {
    try {
      const response = await getTicketUnlockOtp(searchParams.get("utid"));
      if (response.data.isSuccess) {
        setMessage(response.data.message);
        onOpen2();
      } else if (!response.data.isSuccess) {
        setMessage(response.data.message);
        toast.error(response.data.message);
        onOpen2();
      }
    } catch (e) {
      toast.error("Please try again");
    }
  };

  const handleVerifyIfUnlockedForTicket = async () => {
    try {
      const response = await verifyIfUnlockedForTicket(
        searchParams.get("utid")
      );
      if (!response?.data?.data) {
        setVerifyIfUnlockedForTicketState(response?.data?.data);
      } else if (response?.data?.data) {
        setVerifyIfUnlockedForTicketState(response?.data?.data);
      }
    } catch (e) {
      toast.error("Please try again");
    }
  };

  useEffect(() => {
    handleVerifyIfUnlockedForTicket();
  }, []);


  // Function to return plain text (for copying)

  const getTextValue = () => {
    const ticketInfoText = `PNR: ${ticketingList.ticketInfo?.pnr}\nTicket Amount: ${ticketingList.ticketInfo?.ticketingPrice} AED\n`;
    const messageText = `\nPlease Bring valid photo ID\nHave a nice Trip!`;

    const passengersText = ticketingList.segments
      ?.map(
        (item) =>
          `${item.operationCarrier}-${item.flightNumber} On ${moment(
            item.departure
          ).format("DD-MMMM-yyyy")} at ${moment(item.departure).format(
            "hh:mm A"
          )}`
      )
      .join("\n");

    return ticketInfoText + passengersText + messageText; // Combine ticket info and passenger details
  };

  const [value, setValue] = useState("");
  const { onCopy, hasCopied } = useClipboard(value);

  const handleCopy = () => {
    const newValue = getTextValue();
    setValue(newValue); // Update state
  };

  // Use `useEffect` to trigger copy **after** state updates
  useEffect(() => {
    if (value) {
      onCopy(value);
      setTimeout(() => {
        setValue("")
      }, 100);

    }
  }, [value]);

  const [position, setPosition] = useState({
    x: window.innerWidth - 55,
    y: window.innerHeight - 60,
  });
  const isDragging = useRef(false); // Track dragging state
  const offset = useRef({ x: 0, y: 0 }); // Track the offset during dragging

  // Get the window's width and height
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const handleMouseDown = (e) => {
    // Start dragging
    isDragging.current = true;

    // Set the initial offset from mouse to the element's top-left corner
    offset.current.x = e.clientX - position.x;
    offset.current.y = e.clientY - position.y;

    // Disable text selection while dragging
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      // Calculate the new position
      let newX = e.clientX - offset.current.x;
      let newY = e.clientY - offset.current.y;

      // Ensure the new position doesn't overflow the screen width (and height if needed)
      newX = Math.max(0, Math.min(newX, screenWidth - 100)); // 100 is the div's width
      newY = Math.max(0, Math.min(newY, screenHeight - 100)); // Optional: to prevent vertical overflow

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    // End dragging
    isDragging.current = false;

    // Re-enable text selection
    document.body.style.userSelect = "auto";
  };

  // Attach mouse event listeners to the document to handle drag even when the mouse moves outside the element
  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <ToastContainer position="bottom-right" autoClose={1500} />
      <AlertDialog isOpen={isOpen1} onClose={onClose1} isCentered>
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
              <Button
                onClick={
                  ticketingList?.comboSegmentInfo?.length === 0
                    ? handleCancelBook
                    : handleCancelBookCombo
                }
                ml={3}
                colorScheme="teal"
              >

                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog isOpen={isOpen4} onClose={onClose4} isCentered>
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
              {/* <GiCancel color="red" style={{ height: "50px", width: "50px" }} /> */}
            </AlertDialogHeader>

            <AlertDialogBody
              fontWeight="bold"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              Are you sure? You Want To Issue this ticket.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose4} colorScheme="red">
                Cancel
              </Button>
              <Button
                onClick={
                  ticketingList?.comboSegmentInfo?.length > 0
                    ? handleGenerateTicketForCombo
                    : handleGenerateTicket
                }
                ml={3}
                colorScheme="teal"
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {loading && <Loading flag={2} title={title} loading={loading}></Loading>}
      <div className="content-wrapper search-panel-bg">
        <section className="content-header pb-5"></section>
        <section className="content pb-5">
          {load ? (
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
            <div>
              <div
                onMouseDown={handleMouseDown}
                style={{
                  position: "fixed",
                  bottom: `${screenHeight - position.y - 50}px`, // Distance from the bottom
                  right: `${screenWidth - position.x - 50}px`, // Distance from the right
                  width: "50px",
                  height: "50px",
                  cursor: "move",
                  zIndex: 10000,
                  overflow: "hidden",
                }}
              >
                <Tooltip hasArrow label="Copy text">
                  <Button colorScheme="orange" onClick={handleCopy}>
                    {hasCopied ? <IoCheckmarkDone /> : <MdContentCopy />}
                  </Button>
                </Tooltip>
              </div>
              {ticketingList?.ticketInfo?.status == "Booked" ||
              ticketingList?.ticketInfo?.status == "Expired" ||
              (ticketingList?.ticketInfo?.statusFor === "Ticket" &&
                ticketingList?.ticketInfo?.status == "Ordered") ||
              (ticketingList?.ticketInfo?.statusFor === "Booking" &&
                ticketingList?.ticketInfo?.status == "Cancelled") ||
              (ticketingList?.ticketInfo?.statusFor === "Booking" &&
                ticketingList?.ticketInfo?.status == "Failed") ? (
                <>
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
                                  // width: "320px",
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
                              <button
                                className="btn button-color float-right mr-1 d-print-none text-white border-radius"
                                onClick={handlePrintDone}
                              >
                                <span className="me-1">
                                  <i className="fa fa-print"></i>
                                </span>
                                Print
                              </button>
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

                              {/* <button
                                href="javascript:void(0)"
                                className="btn button-color text-white float-right mr-1 d-print-none border-radius"
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
                                  </>
                                ) : (
                                  <>Download</>
                                )}
                              </button> */}
                            </div>
                          </div>

                          <div className="card-header d-flex flex-wrap justify-content-start">
                            <div className="d-flex gap-1 align-items-center">
                              <input
                                className="ms-3"
                                type={"checkbox"}
                                onChange={(e) => {
                                  setIsFareHide(e.target.checked);
                                }}
                              />{" "}
                              Hide Fare
                            </div>
                            <div className="d-flex gap-1 align-items-center">
                              <input
                                className="ms-3"
                                type={"checkbox"}
                                onChange={(e) => {
                                  setIsFareChange(e.target.checked);
                                }}
                              />{" "}
                              Invoice Fare
                            </div>

                            <div className="d-flex gap-1 align-items-center">
                              <input
                                className="ms-3"
                                type={"checkbox"}
                                onChange={(e) => {
                                  setIsRBDChange(e.target.checked);
                                }}
                              />{" "}
                              Hide RBD
                            </div>
                            <div className="d-flex gap-1 align-items-center">
                              <input
                                className="ms-3"
                                type={"checkbox"}
                                onChange={(e) => {
                                  setIsAgentInfo(e.target.checked);
                                }}
                              />{" "}
                              Hide Agent Info
                            </div>
                            <div className="d-flex gap-1 align-items-center">
                              <input
                                className="ms-3"
                                type={"checkbox"}
                                onChange={(e) => {
                                  setContactInfo(e.target.checked);
                                }}
                              />{" "}
                              Hide Contact Info
                            </div>
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
                                className="border-radius"
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
                                className="border-radius"
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
                                disabled={btnDisabled}
                                onClick={handleMessageUser}
                                className="border-radius"
                              >
                                Send
                              </Button>
                            </Box>
                          </ModalForm>

                          {journeyType === "ONWARD" ? (
                            <>
                              <div className="card-body" ref={componentRef}>
                                <div
                                  className="mx-lg-5 mx-md-5 mx-sm-1 px-lg-5 px-md-5 px-sm-1"
                                  ref={donwloadRef}
                                >
                                  <h4 className="text-center pb-2 pt-3">
                                    E-Book
                                  </h4>

                                  {!isAgentInfo && (
                                    <div className="table-responsive">
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
                                                style={{ width: "160px" }}
                                                crossOrigin="true"
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

                                  <div className="table-responsive">
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
                                            {ticketingList.ticketInfo
                                              ?.status === "Booking Cancelled"
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
                                              ticketingList.ticketInfo
                                                ?.bookingDate
                                            ).format("DD-MMMM-yyyy")}
                                          </td>
                                          <td className="fw-bold">
                                            Booking ID:
                                          </td>
                                          <td>
                                            {
                                              ticketingList.ticketInfo
                                                ?.uniqueTransID
                                            }
                                          </td>
                                        </tr>

                                        <tr>
                                          <th>
                                            {ticketingList.ticketInfo
                                              ?.status === "Ticket Ordered"
                                              ? ""
                                              : "Booking"}{" "}
                                            Status:
                                          </th>
                                          <td>
                                            {ticketingList.ticketInfo
                                              ?.status === "Ticket Ordered"
                                              ? "Ticket Processing "
                                              : ticketingList.ticketInfo
                                                  ?.status}
                                          </td>
                                          <td className="fw-bold">
                                            Booked By:
                                          </td>
                                          <td>
                                            {
                                              ticketingList.ticketInfo
                                                ?.agentName
                                            }
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
                                                  <>
                                                   <p>Ticketing Time: {lastTicketTime}</p>
                                                   {/* {
                                                    fareValidationTime !== "" &&
                                                    fareValidationTime !== null &&
                                                    fareValidationTime !== undefined ?
                                                    <p>Fare Validity: {fareValidationTime}</p> : ''
                                                   } */}
                                                   
                                                  </>
                                                
                                                ) : (
                                                  <>
                                                    <a
                                                      href="javascript:void(0)"
                                                      title="Last Ticketing Time"
                                                      onClick={() =>
                                                        handleGetTime(
                                                          ticketingList
                                                            .ticketInfo
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
                                          <td>
                                            {ticketingList.ticketInfo?.pnr}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="fw-bold">
                                            Airline PNR
                                          </td>
                                          <td colSpan={3}>
                                            {newArr?.map((item) => {
                                              return <span>{item}</span>;
                                            })}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="table-responsive">
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
                                                <td>{item.gender}</td>
                                                <td>
                                                  {item.dateOfBirth === null
                                                    ? "N/A"
                                                    : moment(
                                                        item.dateOfBirth
                                                      ).format("DD-MMMM-yyyy")}
                                                </td>
                                                <td>
                                                  {ticketingList?.segments?.map(
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
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="table-responsive">
                                    <table
                                      className="table table-bordered table-sm"
                                      style={{ fontSize: "11px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th
                                            colspan="9"
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
                                          <th>Baggage</th>
                                          <th>Cabin</th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-center">
                                        {ticketingList?.directions ===
                                        undefined ? (
                                          <>
                                            {ticketingList.segments?.map(
                                              (item, index) => {
                                                let baggage = JSON.parse(
                                                  item.baggageInfo
                                                );
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
                                                              (item) =>
                                                                item.city
                                                            )}
                                                          <br></br>
                                                          (Terminal-
                                                          {item?.originTerminal}
                                                          )
                                                        </span>
                                                      </td>
                                                      <td>
                                                        {moment(
                                                          item.departure
                                                        ).format(
                                                          "DD-MMMM-yyyy"
                                                        )}
                                                        <br></br>
                                                        {moment(
                                                          item.departure
                                                        ).format("HH:mm")}
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
                                                              (item) =>
                                                                item.city
                                                            )}
                                                          <br></br>
                                                          (Terminal-
                                                          {
                                                            item?.destinationTerminal
                                                          }
                                                          )
                                                        </span>
                                                      </td>
                                                      <td>
                                                        {moment(
                                                          item.arrival
                                                        ).format(
                                                          "DD-MMMM-yyyy"
                                                        )}
                                                        <br></br>
                                                        {moment(
                                                          item.arrival
                                                        ).format("HH:mm")}
                                                      </td>
                                                      <td>
                                                        {item.fareBasisCode}
                                                      </td>
                                                      <td>
                                                        {baggage?.map(
                                                          (im, idx) => {
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
                                                      <td>
                                                        {item.cabinClass}{" "}
                                                        {isRBDChange ===
                                                        false ? (
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
                                          <></>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  {isFareHide === false && (
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
                                        <th className="text-center">Type</th>
                                        <th>Base</th>
                                        <th>Tax</th>
                                        {isFareChange === true && (
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

                                                {isFareChange === true && (
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
                                                <td>{item.passengerCount}</td>
                                                <td>
                                                  {item.currencyName}{" "}
                                                  {isFareChange === true
                                                    ? (
                                                        item.totalPrice *
                                                        item.passengerCount
                                                      ).toLocaleString("en-US")
                                                    : (
                                                        (item.totalPrice -
                                                          item.discount) *
                                                        item.passengerCount
                                                      ).toLocaleString("en-US")}
                                                </td>
                                              </tr>
                                            </>
                                          );
                                        }
                                      )}
                                      <tr className="fw-bold">
                                        <td
                                          colSpan={
                                            isFareChange === true ? 5 : 4
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
                                          {isFareChange === true
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
                                          colspan="4"
                                          className="fw-bold py-2 bg-light"
                                        >
                                          CONTACT DETAILS
                                        </th>
                                      </tr>
                                      <tr className="text-center">
                                        <th>DEPARTS</th>
                                        <th>Email</th>
                                        <th>Phone Number</th>
                                        <th>Additional Phone Number</th>
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
                                                    <td>
                                                      {item.phone2
                                                        ? item.phoneCountryCode +
                                                          item.phone2
                                                        : "N/A"}{" "}
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


                                  {/* //partial payment */}

                                  {ticketingList.ticketInfo?.status ===
                                    "Booked" && (
                                    <>
                                      {loader ? (
                                        <div className="d-flex align-items-center justify-content-center">
                                          <div
                                            class="spinner-border"
                                            role="status"
                                          >
                                            <span class="visually-hidden">
                                              Loading...
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          {partialData === false
                                            ? partialPaymentData?.isEligible && (
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
                                                      style={{
                                                        fontSize: "14px",
                                                      }}
                                                    >
                                                      {" Payments Options"}
                                                    </legend>
                                                    <Box className="d-flex justify-content-start gap-4">
                                                      <Box
                                                        gap={2}
                                                        fontSize={"14px"}
                                                        onClick={() =>
                                                          setPayment({
                                                            partialPayment: true,
                                                            fullPayment: false,
                                                          })
                                                        }
                                                      >
                                                        <div className="d-flex align-items-center gap-1">
                                                          <input
                                                            type="radio"
                                                            checked={
                                                              payment.partialPayment
                                                            }
                                                            value={
                                                              payment.partialPayment
                                                            }
                                                            name="flexRadioDefault"
                                                            id="flexRadioDefault1"
                                                          />
                                                          <label className="pt-2">
                                                            Partial Payment{" "}
                                                            <span
                                                              style={{
                                                                fontSize:
                                                                  "12px",
                                                              }}
                                                              className="text-danger"
                                                            >
                                                              (InstantPay -{" "}
                                                              {partialPaymentData?.instantPayAmount?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                              )
                                                            </span>
                                                          </label>
                                                        </div>
                                                        {payment?.partialPayment ? (
                                                          <>
                                                            <p
                                                              className="text-end fw-bold text-danger pb-2"
                                                              style={{
                                                                fontSize:
                                                                  "12px",
                                                              }}
                                                            >
                                                              <span>
                                                                Settlement Days
                                                                :{" "}
                                                              </span>{" "}
                                                              {moment(
                                                                partialPaymentData?.lastSettlementDate
                                                              ).format(
                                                                "DD MMM,yyyy, ddd"
                                                              )}
                                                              (
                                                              {
                                                                partialPaymentData?.eligibleSettlementDays
                                                              }{" "}
                                                              days)
                                                            </p>
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </Box>

                                                      <Box
                                                        gap={4}
                                                        fontSize={"14px"}
                                                        onClick={() =>
                                                          setPayment({
                                                            partialPayment: false,
                                                            fullPayment: true,
                                                          })
                                                        }
                                                      >
                                                        <div className="d-flex align-items-center gap-1">
                                                          <input
                                                            type="radio"
                                                            value={
                                                              payment.fullPayment
                                                            }
                                                            checked={
                                                              payment.fullPayment &&
                                                              true
                                                            }
                                                            name="flexRadioDefault"
                                                            id="flexRadioDefault2"
                                                          />
                                                          <label className="pt-2">
                                                            Full Payment{" "}
                                                            <span
                                                              style={{
                                                                fontSize:
                                                                  "12px",
                                                              }}
                                                              className="text-danger"
                                                            >
                                                              (Totalpay -{" "}
                                                              {partialPaymentData?.totalTicketFare?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                              )
                                                            </span>
                                                          </label>
                                                        </div>
                                                      </Box>
                                                    </Box>
                                                  </fieldset>
                                                </Box>
                                              )
                                            : ""}
                                        </>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-12 text-center text-danger">
                                  <p>
                                    Ticketing price is:{" "}
                                    <span className="fw-bold">
                                      {
                                        ticketingList?.ticketInfo
                                          ?.ticketingPrice
                                      }
                                    </span>{" "}
                                    and current balance is:{" "}
                                    <span className="fw-bold">
                                      {!isAgent
                                        ? agentInfo?.balanceLimit
                                        : agentInfo?.currentBalance}
                                      {!isAgent &&
                                        agentInfo?.balanceLimit >
                                          agentInfo?.currentBalance && (
                                          <span>Please contact your agent</span>
                                        )}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {ticketingList?.ticketInfo?.status ===
                                "Booking Cancelled" ||
                              ticketingList?.ticketInfo?.status ===
                                "Ticket Cancelled" ? (
                                <></>
                              ) : (
                                ticketingList.length !== 0 && (
                                  <>
                                    {partialPaymentData?.isEligible ? (
                                      <>
                                        {payment.partialPayment ? (
                                          <>
                                            {agentInfo?.activeCredit +
                                              agentInfo?.currentBalance <
                                            partialPaymentData?.instantPayAmount ? (
                                              <>
                                                <div className="row mb-5 mt-2">
                                                  <div className="col-lg-12 text-center text-danger">
                                                    <p>
                                                      You don't have available
                                                      balance to generate
                                                      Ticket!
                                                    </p>
                                                  </div>
                                                </div>
                                              </>
                                            ) : agentInfo?.balanceLimit <
                                                partialPaymentData?.instantPayAmount &&
                                              !isAgent ? (
                                              <>
                                                <div className="row mb-5 mt-2">
                                                  <div className="col-lg-12 text-center text-danger">
                                                    <p>
                                                      You don't have permission
                                                      for generating Ticket over
                                                      transection limit{" "}
                                                      {agentInfo?.balanceLimit}!
                                                    </p>
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              <div className="container mt-3">
                                                <div className="row">
                                                  <div className="col-lg-4"></div>
                                                  <div className="col-lg-4 text-center">
                                                    {ticketingList.ticketInfo
                                                      ?.status === "Booked" &&
                                                    ticketingList.ticketInfo
                                                      ?.bookingType ===
                                                      "Online" ? (
                                                      <>
                                                        {verifyIfUnlockedForTicketState ? (
                                                          <button
                                                            className="btn button-color text-white w-50 fw-bold border-radius"
                                                            onClick={onOpen4}
                                                            disabled={
                                                              userRole > 2 ||
                                                              userRole ===
                                                                "null"
                                                                ? false
                                                                : true
                                                            }
                                                          >
                                                            Issue Ticket
                                                          </button>
                                                        ) : (
                                                          <button
                                                            className="btn button-color text-white w-50 fw-bold border-radius"
                                                            onClick={
                                                              handlegetTicketUnlockOtp
                                                            }
                                                            disabled={
                                                              userRole > 2 ||
                                                              userRole ===
                                                                "null"
                                                                ? false
                                                                : true
                                                            }
                                                          >
                                                            Get OTP
                                                          </button>
                                                        )}
                                                      </>
                                                    ) : ticketingList.ticketInfo
                                                        ?.status === "Booked" &&
                                                      ticketingList.ticketInfo
                                                        ?.bookingType ===
                                                        "Import" ? (
                                                      <button
                                                        className="btn button-color text-white w-50 fw-bold border-radius"
                                                        onClick={
                                                          handleGenerateImportTicket
                                                        }
                                                        disabled={
                                                          userRole > 2 ||
                                                          userRole === "null"
                                                            ? false
                                                            : true
                                                        }
                                                      >
                                                        Issue Ticket
                                                      </button>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </div>
                                                  <div className="col-lg-4"></div>
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {agentInfo?.activeCredit +
                                              agentInfo?.currentBalance <
                                            ticketingList?.ticketInfo
                                              ?.ticketingPrice ? (
                                              <>
                                                <div className="row mb-5 mt-2">
                                                  <div className="col-lg-12 text-center text-danger">
                                                    <p>
                                                      You don't have available
                                                      balance to generate
                                                      Ticket!
                                                    </p>
                                                  </div>
                                                </div>
                                              </>
                                            ) : agentInfo?.balanceLimit <
                                                ticketingList?.ticketInfo
                                                  ?.ticketingPrice &&
                                              !isAgent ? (
                                              <>
                                                <div className="row mb-5 mt-2">
                                                  <div className="col-lg-12 text-center text-danger">
                                                    <p>
                                                      You don't have permission
                                                      for generating Ticket over
                                                      transection limit{" "}
                                                      {agentInfo?.balanceLimit}!
                                                    </p>
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              <div className="container mt-3">
                                                <div className="row">
                                                  <div className="col-lg-4"></div>
                                                  <div className="col-lg-4 text-center">
                                                    {ticketingList.ticketInfo
                                                      ?.status === "Booked" &&
                                                    ticketingList.ticketInfo
                                                      ?.bookingType ===
                                                      "Online" ? (
                                                      <>
                                                        {verifyIfUnlockedForTicketState ? (
                                                          <button
                                                            className="btn button-color text-white w-50 fw-bold border-radius"
                                                            onClick={onOpen4}
                                                            disabled={
                                                              userRole > 2 ||
                                                              userRole ===
                                                                "null"
                                                                ? false
                                                                : true
                                                            }
                                                          >
                                                            Issue Ticket
                                                          </button>
                                                        ) : (
                                                          <button
                                                            className="btn button-color text-white w-50 fw-bold border-radius"
                                                            onClick={
                                                              handlegetTicketUnlockOtp
                                                            }
                                                            disabled={
                                                              userRole > 2 ||
                                                              userRole ===
                                                                "null"
                                                                ? false
                                                                : true
                                                            }
                                                          >
                                                            Get OTP
                                                          </button>
                                                        )}
                                                      </>
                                                    ) : ticketingList.ticketInfo
                                                        ?.status === "Booked" &&
                                                      ticketingList.ticketInfo
                                                        ?.bookingType ===
                                                        "Import" ? (
                                                      <button
                                                        className="btn button-color text-white w-50 fw-bold border-radius"
                                                        onClick={
                                                          handleGenerateImportTicket
                                                        }
                                                        disabled={
                                                          userRole > 2 ||
                                                          userRole === "null"
                                                            ? false
                                                            : true
                                                        }
                                                      >
                                                        Issue Ticket
                                                      </button>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </div>
                                                  <div className="col-lg-4"></div>
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        {agentInfo?.activeCredit +
                                          agentInfo?.currentBalance <
                                        ticketingList?.ticketInfo
                                          ?.ticketingPrice ? (
                                          <>
                                            <div className="row mb-5 mt-2">
                                              <div className="col-lg-12 text-center text-danger">
                                                <p>
                                                  You don't have available
                                                  balance to generate Ticket!
                                                </p>
                                              </div>
                                            </div>
                                          </>
                                        ) : agentInfo?.balanceLimit <
                                            ticketingList?.ticketInfo
                                              ?.ticketingPrice && !isAgent ? (
                                          <>
                                            <div className="row mb-5 mt-2">
                                              <div className="col-lg-12 text-center text-danger">
                                                <p>
                                                  You don't have permission for
                                                  generating Ticket over
                                                  transection limit{" "}
                                                  {agentInfo?.balanceLimit}!
                                                </p>
                                              </div>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="container mt-3">
                                            <div className="row">
                                              <div className="col-lg-4"></div>
                                              <div className="col-lg-4 text-center">
                                                {ticketingList.ticketInfo
                                                  ?.status === "Booked" &&
                                                ticketingList.ticketInfo
                                                  ?.bookingType === "Online" ? (
                                                  <>
                                                    {verifyIfUnlockedForTicketState ? (
                                                      <button
                                                        className="btn button-color text-white w-50 fw-bold border-radius"
                                                        onClick={onOpen4}
                                                        disabled={
                                                          userRole > 2 ||
                                                          userRole === "null"
                                                            ? false
                                                            : true
                                                        }
                                                      >
                                                        Issue Ticket
                                                      </button>
                                                    ) : (
                                                      <button
                                                        className="btn button-color text-white w-50 fw-bold border-radius"
                                                        onClick={
                                                          handlegetTicketUnlockOtp
                                                        }
                                                        disabled={
                                                          userRole > 2 ||
                                                          userRole === "null"
                                                            ? false
                                                            : true
                                                        }
                                                      >
                                                        Get OTP
                                                      </button>
                                                    )}
                                                  </>
                                                ) : ticketingList.ticketInfo
                                                    ?.status === "Booked" &&
                                                  ticketingList.ticketInfo
                                                    ?.bookingType ===
                                                    "Import" ? (
                                                  <button
                                                    className="btn button-color text-white w-50 fw-bold border-radius"
                                                    onClick={
                                                      handleGenerateImportTicket
                                                    }
                                                    disabled={
                                                      userRole > 2 ||
                                                      userRole === "null"
                                                        ? false
                                                        : true
                                                    }
                                                  >
                                                    Issue Ticket
                                                  </button>
                                                ) : (
                                                  <></>
                                                )}
                                              </div>
                                              <div className="col-lg-4"></div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </>
                                )
                              )}

                              {ticketingList.ticketInfo?.status === "Booked" &&
                              ticketingList.ticketInfo?.bookingType ===
                                "Online" ? (
                                <>
                                  <div className="container mt-1 mb-5">
                                    <div className="row">
                                      <div className="col-lg-4"></div>
                                      <div className="col-lg-4 text-center">
                                        {ticketingList.ticketInfo?.status ===
                                          "Booked" && (
                                          <button
                                            className="btn button-color text-white w-50 fw-bold border-radius"
                                            onClick={onOpen1}
                                            disabled={
                                              userRole > 1 ||
                                              userRole === "null"
                                                ? false
                                                : true
                                            }
                                          >
                                            Cancel Booking
                                          </button>
                                        )}
                                      </div>
                                      <div className="col-lg-4"></div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}

                              <div className="container mt-1 mb-5">
                                <div className="row">
                                  <div className="col-lg-12 text-center">
                                    {userRole > 2 || userRole === "null" ? (
                                      <></>
                                    ) : (
                                      <div className="text-red">
                                        N.B: Your permission to Ticket is
                                        denied.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="pb-5"></div>
                            </>
                          ) : (
                            <>
                              <div className="card-body" ref={componentRef}>
                                <div
                                  className="mx-lg-5 mx-md-5 mx-sm-1 px-lg-5 px-md-5 px-sm-1"
                                  ref={donwloadRef}
                                >
                                  <h4 className="text-center pb-2 pt-3">
                                    E-Book
                                  </h4>

                                  {!isAgentInfo && (
                                    <div className="table-responsive">
                                      <table class="table table-borderless table-sm">
                                        <tbody>
                                          <tr>
                                            {/* FIXED COMPANY LOGO */}
                                            {/* CHANGE THIS LATER */}
                                            <td className="text-start">
                                              {ticketingListReturn.ticketInfo
                                                ?.agentLogo !== null ? (
                                                <>
                                                  {/* <img
                                                alt="img01"
                                                src={
                                                  environment.s3URL +
                                                  `${ticketingList.ticketInfo?.agentLogo}`
                                                }
                                                style={{ width: "160px" }}
                                                crossOrigin="true"
                                              ></img> */}
                                                  <ImageComponentForAgent
                                                    logo={
                                                      ticketingListReturn
                                                        .ticketInfo?.agentLogo
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

                                  <div className="table-responsive">
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
                                            {ticketingListReturn.ticketInfo
                                              ?.status === "Booking Cancelled"
                                              ? ticketingListReturn.ticketInfo
                                                  ?.status
                                              : "BOOKING CONFIRMED"}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <th>Booking Date:</th>
                                          <td>
                                            {moment(
                                              ticketingListReturn.ticketInfo
                                                ?.bookingDate
                                            ).format("DD-MMMM-yyyy")}
                                          </td>
                                          <td className="fw-bold">
                                            Booking ID:
                                          </td>
                                          <td>
                                            {
                                              ticketingListReturn.ticketInfo
                                                ?.uniqueTransID
                                            }
                                          </td>
                                        </tr>

                                        <tr>
                                          <th>
                                            {ticketingListReturn.ticketInfo
                                              ?.status === "Ticket Ordered"
                                              ? ""
                                              : "Booking"}{" "}
                                            Status:
                                          </th>
                                          <td>
                                            {ticketingListReturn.ticketInfo
                                              ?.status === "Ticket Ordered"
                                              ? "Ticket Processing "
                                              : ticketingListReturn.ticketInfo
                                                  ?.status}
                                          </td>
                                          <td className="fw-bold">
                                            Booked By:
                                          </td>
                                          <td>
                                            {
                                              ticketingListReturn.ticketInfo
                                                ?.agentName
                                            }
                                          </td>
                                        </tr>
                                        <tr>
                                          {ticketingListReturn.ticketInfo
                                            ?.status === "Ticket Ordered" ? (
                                            ""
                                          ) : (
                                            <>
                                              <th>Issue Before:</th>
                                              <td style={{ color: "red" }}>
                                                {lastTicketTimeReturn !== "" &&
                                                lastTicketTimeReturn !== null &&
                                                lastTicketTimeReturn !==
                                                  undefined ? (
                                                  lastTicketTimeReturn
                                                ) : (
                                                  <>
                                                    <a
                                                      href="javascript:void(0)"
                                                      title="Last Ticketing Time"
                                                      onClick={() =>
                                                        handleGetTimeReturn(
                                                          ticketingListReturn
                                                            .ticketInfo
                                                            ?.referenceLog
                                                        )
                                                      }
                                                    >
                                                      <Button
                                                        isLoading={
                                                          isLoadingReturn
                                                        }
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
                                          <td>
                                            {
                                              ticketingListReturn.ticketInfo
                                                ?.pnr
                                            }
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="fw-bold">
                                            Airline PNR
                                          </td>
                                          <td colSpan={3}>
                                            {newArr?.map((item) => {
                                              return <span>{item}</span>;
                                            })}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="table-responsive">
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
                                        {ticketingListReturn.passengerInfo?.map(
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
                                                <td>{item.gender}</td>
                                                <td>
                                                  {item.dateOfBirth === null
                                                    ? "N/A"
                                                    : moment(
                                                        item.dateOfBirth
                                                      ).format("DD-MMMM-yyyy")}
                                                </td>
                                                <td>
                                                  {ticketingListReturn?.segments?.map(
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
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="table-responsive">
                                    <table
                                      className="table table-bordered table-sm"
                                      style={{ fontSize: "11px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th
                                            colspan="9"
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
                                          <th>Baggage</th>
                                          <th>Cabin</th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-center">
                                        {ticketingListReturn?.directions ===
                                        undefined ? (
                                          <>
                                            {ticketingListReturn.segments?.map(
                                              (item, index) => {
                                                let baggage = JSON.parse(
                                                  item.baggageInfo
                                                );
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
                                                              (item) =>
                                                                item.city
                                                            )}
                                                          <br></br>
                                                          (Terminal-
                                                          {item?.originTerminal}
                                                          )
                                                        </span>
                                                      </td>
                                                      <td>
                                                        {moment(
                                                          item.departure
                                                        ).format(
                                                          "DD-MMMM-yyyy"
                                                        )}
                                                        <br></br>
                                                        {moment(
                                                          item.departure
                                                        ).format("HH:mm")}
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
                                                              (item) =>
                                                                item.city
                                                            )}
                                                          <br></br>
                                                          (Terminal-
                                                          {
                                                            item?.destinationTerminal
                                                          }
                                                          )
                                                        </span>
                                                      </td>
                                                      <td>
                                                        {moment(
                                                          item.arrival
                                                        ).format(
                                                          "DD-MMMM-yyyy"
                                                        )}
                                                        <br></br>
                                                        {moment(
                                                          item.arrival
                                                        ).format("HH:mm")}
                                                      </td>
                                                      <td>
                                                        {item.fareBasisCode}
                                                      </td>
                                                      <td>
                                                        {baggage?.map(
                                                          (im, idx) => {
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
                                                      <td>
                                                        {item.cabinClass}{" "}
                                                        {isRBDChange ===
                                                        false ? (
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
                                          <></>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  {isFareHide === false ? (
                                    <>
                                      <div className="table-responsive">
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
                                            {ticketingListReturn.fareBreakdown?.map(
                                              (item, index) => {
                                                return (
                                                  <>
                                                    <tr>
                                                      <td className="text-center">
                                                        {getPassengerType(
                                                          item.passengerType,
                                                          ticketingListReturn.fareBreakdown
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

                                                      {isFareChange ===
                                                        false && (
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
                                                {/* {ticketingList.passengerInfo[0]?.currencyName}{" "} */}
                                                {/* {ticketingList.ticketInfo?.ticketingPrice.toLocaleString(
                                  "en-US"
                                )} */}
                                                {/* {
                                  sumRating(ticketingList.fareBreakdown).toLocaleString("en-US")
                                } */}
                                                {isFareChange === false
                                                  ? sumRating(
                                                      ticketingListReturn.fareBreakdown
                                                    )?.toLocaleString("en-US")
                                                  : sumRatingGross(
                                                      ticketingListReturn.fareBreakdown
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
                                          {ticketingListReturn.passengerInfo?.map(
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
                                                                ticketingListReturn
                                                                  .segments[0]
                                                                  ?.origin
                                                            )
                                                            .map(
                                                              (item) =>
                                                                item.city
                                                            )}
                                                          {/* {bookData.data?.item1.flightInfo.dirrections[0][0].from} */}
                                                        </td>
                                                        <td>
                                                          {
                                                            ticketingListReturn
                                                              ?.ticketInfo
                                                              ?.leadPaxEmail
                                                          }
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
                                  )}

                                  {/* //partial payment */}

                                  {ticketingListReturn.ticketInfo?.status ===
                                    "Booked" && (
                                    <>
                                      {loader ? (
                                        <div className="d-flex align-items-center justify-content-center">
                                          <div
                                            class="spinner-border"
                                            role="status"
                                          >
                                            <span class="visually-hidden">
                                              Loading...
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          {partialData === false
                                            ? partialPaymentData?.isEligible && (
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
                                                      style={{
                                                        fontSize: "14px",
                                                      }}
                                                    >
                                                      {" Payments Options"}
                                                    </legend>
                                                    <Box className="d-flex justify-content-start gap-4">
                                                      <Box
                                                        gap={2}
                                                        fontSize={"14px"}
                                                        onClick={() =>
                                                          setPayment({
                                                            partialPayment: true,
                                                            fullPayment: false,
                                                          })
                                                        }
                                                      >
                                                        <div className="d-flex align-items-center gap-1">
                                                          <input
                                                            type="radio"
                                                            checked={
                                                              payment.partialPayment
                                                            }
                                                            value={
                                                              payment.partialPayment
                                                            }
                                                            name="flexRadioDefault"
                                                            id="flexRadioDefault1"
                                                          />
                                                          <label className="pt-2">
                                                            Partial Payment{" "}
                                                            <span
                                                              style={{
                                                                fontSize:
                                                                  "12px",
                                                              }}
                                                              className="text-danger"
                                                            >
                                                              (InstantPay -{" "}
                                                              {partialPaymentData?.instantPayAmount?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                              )
                                                            </span>
                                                          </label>
                                                        </div>
                                                        {payment?.partialPayment ? (
                                                          <>
                                                            <p
                                                              className="text-end fw-bold text-danger pb-2"
                                                              style={{
                                                                fontSize:
                                                                  "12px",
                                                              }}
                                                            >
                                                              <span>
                                                                Settlement Days
                                                                :{" "}
                                                              </span>{" "}
                                                              {moment(
                                                                partialPaymentData?.lastSettlementDate
                                                              ).format(
                                                                "DD MMM,yyyy, ddd"
                                                              )}
                                                              (
                                                              {
                                                                partialPaymentData?.eligibleSettlementDays
                                                              }{" "}
                                                              days)
                                                            </p>
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </Box>

                                                      <Box
                                                        gap={4}
                                                        fontSize={"14px"}
                                                        onClick={() =>
                                                          setPayment({
                                                            partialPayment: false,
                                                            fullPayment: true,
                                                          })
                                                        }
                                                      >
                                                        <div className="d-flex align-items-center gap-1">
                                                          <input
                                                            type="radio"
                                                            value={
                                                              payment.fullPayment
                                                            }
                                                            checked={
                                                              payment.fullPayment &&
                                                              true
                                                            }
                                                            name="flexRadioDefault"
                                                            id="flexRadioDefault2"
                                                          />
                                                          <label className="pt-2">
                                                            Full Payment{" "}
                                                            <span
                                                              style={{
                                                                fontSize:
                                                                  "12px",
                                                              }}
                                                              className="text-danger"
                                                            >
                                                              (Totalpay -{" "}
                                                              {partialPaymentData?.totalTicketFare?.toLocaleString(
                                                                "en-US"
                                                              )}
                                                              )
                                                            </span>
                                                          </label>
                                                        </div>
                                                      </Box>
                                                    </Box>
                                                  </fieldset>
                                                </Box>
                                              )
                                            : ""}
                                        </>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-12 text-center text-danger">
                                  <p>
                                    Ticketing price is:{" "}
                                    <span className="fw-bold">
                                      {
                                        ticketingListReturn?.ticketInfo
                                          ?.ticketingPrice
                                      }
                                    </span>{" "}
                                    and current balance is:{" "}
                                    <span className="fw-bold">
                                      {!isAgent
                                        ? agentInfo?.balanceLimit
                                        : agentInfo?.currentBalance}
                                      {!isAgent &&
                                        agentInfo?.balanceLimit >
                                          agentInfo?.currentBalance && (
                                          <span>Please contact your agent</span>
                                        )}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {ticketingListReturn?.ticketInfo?.status ===
                                "Booking Cancelled" ||
                              ticketingListReturn?.ticketInfo?.status ===
                                "Ticket Cancelled" ? (
                                <></>
                              ) : (
                                ticketingListReturn.length !== 0 && (
                                  <>
                                    {partialPaymentData?.isEligible ? (
                                      <>
                                        {payment.partialPayment ? (
                                          <>
                                            {agentInfo?.activeCredit +
                                              agentInfo?.currentBalance <
                                            partialPaymentData?.instantPayAmount ? (
                                              <>
                                                <div className="row mb-5 mt-2">
                                                  <div className="col-lg-12 text-center text-danger">
                                                    <p>
                                                      You don't have available
                                                      balance to generate
                                                      Ticket!
                                                    </p>
                                                  </div>
                                                </div>
                                              </>
                                            ) : agentInfo?.balanceLimit <
                                                partialPaymentData?.instantPayAmount &&
                                              !isAgent ? (
                                              <>
                                                <div className="row mb-5 mt-2">
                                                  <div className="col-lg-12 text-center text-danger">
                                                    <p>
                                                      You don't have permission
                                                      for generating Ticket over
                                                      transection limit{" "}
                                                      {agentInfo?.balanceLimit}!
                                                    </p>
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              <div className="container mt-3">
                                                <div className="row">
                                                  <div className="col-lg-4"></div>
                                                  <div className="col-lg-4 text-center">
                                                    {ticketingListReturn
                                                      .ticketInfo?.status ===
                                                      "Booked" &&
                                                    ticketingListReturn
                                                      .ticketInfo
                                                      ?.bookingType ===
                                                      "Online" ? (
                                                      <>
                                                        {verifyIfUnlockedForTicketState ? (
                                                          <button
                                                            className="btn button-color text-white w-50 fw-bold border-radius"
                                                            onClick={onOpen4}
                                                            disabled={
                                                              userRole > 2 ||
                                                              userRole ===
                                                                "null"
                                                                ? false
                                                                : true
                                                            }
                                                          >
                                                            Issue Ticket
                                                          </button>
                                                        ) : (
                                                          <button
                                                            className="btn button-color text-white w-50 fw-bold border-radius"
                                                            onClick={
                                                              handlegetTicketUnlockOtp
                                                            }
                                                            disabled={
                                                              userRole > 2 ||
                                                              userRole ===
                                                                "null"
                                                                ? false
                                                                : true
                                                            }
                                                          >
                                                            Get OTP
                                                          </button>
                                                        )}
                                                      </>
                                                    ) : ticketingListReturn
                                                        .ticketInfo?.status ===
                                                        "Booked" &&
                                                      ticketingListReturn
                                                        .ticketInfo
                                                        ?.bookingType ===
                                                        "Import" ? (
                                                      <button
                                                        className="btn button-color text-white w-50 fw-bold border-radius"
                                                        onClick={
                                                          handleGenerateImportTicket
                                                        }
                                                        disabled={
                                                          userRole > 2 ||
                                                          userRole === "null"
                                                            ? false
                                                            : true
                                                        }
                                                      >
                                                        Issue Ticket
                                                      </button>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </div>
                                                  <div className="col-lg-4"></div>
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {agentInfo?.activeCredit +
                                              agentInfo?.currentBalance <
                                            ticketingListReturn?.ticketInfo
                                              ?.ticketingPrice ? (
                                              <>
                                                <div className="row mb-5 mt-2">
                                                  <div className="col-lg-12 text-center text-danger">
                                                    <p>
                                                      You don't have available
                                                      balance to generate
                                                      Ticket!
                                                    </p>
                                                  </div>
                                                </div>
                                              </>
                                            ) : agentInfo?.balanceLimit <
                                                ticketingListReturn?.ticketInfo
                                                  ?.ticketingPrice &&
                                              !isAgent ? (
                                              <>
                                                <div className="row mb-5 mt-2">
                                                  <div className="col-lg-12 text-center text-danger">
                                                    <p>
                                                      You don't have permission
                                                      for generating Ticket over
                                                      transection limit{" "}
                                                      {agentInfo?.balanceLimit}!
                                                    </p>
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              <div className="container mt-3">
                                                <div className="row">
                                                  <div className="col-lg-4"></div>
                                                  <div className="col-lg-4 text-center">
                                                    {ticketingListReturn
                                                      .ticketInfo?.status ===
                                                      "Booked" &&
                                                    ticketingListReturn
                                                      .ticketInfo
                                                      ?.bookingType ===
                                                      "Online" ? (
                                                      <>
                                                        {verifyIfUnlockedForTicketState ? (
                                                          <button
                                                            className="btn button-color text-white w-50 fw-bold border-radius"
                                                            onClick={onOpen4}
                                                            disabled={
                                                              userRole > 2 ||
                                                              userRole ===
                                                                "null"
                                                                ? false
                                                                : true
                                                            }
                                                          >
                                                            Issue Ticket
                                                          </button>
                                                        ) : (
                                                          <button
                                                            className="btn button-color text-white w-50 fw-bold border-radius"
                                                            onClick={
                                                              handlegetTicketUnlockOtp
                                                            }
                                                            disabled={
                                                              userRole > 2 ||
                                                              userRole ===
                                                                "null"
                                                                ? false
                                                                : true
                                                            }
                                                          >
                                                            Get OTP
                                                          </button>
                                                        )}
                                                      </>
                                                    ) : ticketingListReturn
                                                        .ticketInfo?.status ===
                                                        "Booked" &&
                                                      ticketingListReturn
                                                        .ticketInfo
                                                        ?.bookingType ===
                                                        "Import" ? (
                                                      <button
                                                        className="btn button-color text-white w-50 fw-bold border-radius"
                                                        onClick={
                                                          handleGenerateImportTicket
                                                        }
                                                        disabled={
                                                          userRole > 2 ||
                                                          userRole === "null"
                                                            ? false
                                                            : true
                                                        }
                                                      >
                                                        Issue Ticket
                                                      </button>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </div>
                                                  <div className="col-lg-4"></div>
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        {agentInfo?.activeCredit +
                                          agentInfo?.currentBalance <
                                        ticketingListReturn?.ticketInfo
                                          ?.ticketingPrice ? (
                                          <>
                                            <div className="row mb-5 mt-2">
                                              <div className="col-lg-12 text-center text-danger">
                                                <p>
                                                  You don't have available
                                                  balance to generate Ticket!
                                                </p>
                                              </div>
                                            </div>
                                          </>
                                        ) : agentInfo?.balanceLimit <
                                            ticketingListReturn?.ticketInfo
                                              ?.ticketingPrice && !isAgent ? (
                                          <>
                                            <div className="row mb-5 mt-2">
                                              <div className="col-lg-12 text-center text-danger">
                                                <p>
                                                  You don't have permission for
                                                  generating Ticket over
                                                  transection limit{" "}
                                                  {agentInfo?.balanceLimit}!
                                                </p>
                                              </div>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="container mt-3">
                                            <div className="row">
                                              <div className="col-lg-4"></div>
                                              <div className="col-lg-4 text-center">
                                                {ticketingListReturn.ticketInfo
                                                  ?.status === "Booked" &&
                                                ticketingListReturn.ticketInfo
                                                  ?.bookingType === "Online" ? (
                                                  <>
                                                    {verifyIfUnlockedForTicketState ? (
                                                      <button
                                                        className="btn button-color text-white w-50 fw-bold border-radius"
                                                        onClick={onOpen4}
                                                        disabled={
                                                          userRole > 2 ||
                                                          userRole === "null"
                                                            ? false
                                                            : true
                                                        }
                                                      >
                                                        Issue Ticket
                                                      </button>
                                                    ) : (
                                                      <button
                                                        className="btn button-color text-white w-50 fw-bold border-radius"
                                                        onClick={
                                                          handlegetTicketUnlockOtp
                                                        }
                                                        disabled={
                                                          userRole > 2 ||
                                                          userRole === "null"
                                                            ? false
                                                            : true
                                                        }
                                                      >
                                                        Get OTP
                                                      </button>
                                                    )}
                                                  </>
                                                ) : ticketingListReturn
                                                    .ticketInfo?.status ===
                                                    "Booked" &&
                                                  ticketingListReturn.ticketInfo
                                                    ?.bookingType ===
                                                    "Import" ? (
                                                  <button
                                                    className="btn button-color text-white w-50 fw-bold border-radius"
                                                    onClick={
                                                      handleGenerateImportTicket
                                                    }
                                                    disabled={
                                                      userRole > 2 ||
                                                      userRole === "null"
                                                        ? false
                                                        : true
                                                    }
                                                  >
                                                    Issue Ticket
                                                  </button>
                                                ) : (
                                                  <></>
                                                )}
                                              </div>
                                              <div className="col-lg-4"></div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </>
                                )
                              )}

                              {ticketingListReturn.ticketInfo?.status ===
                                "Booked" &&
                              ticketingListReturn.ticketInfo?.bookingType ===
                                "Online" ? (
                                <>
                                  <div className="container mt-1 mb-5">
                                    <div className="row">
                                      <div className="col-lg-4"></div>
                                      <div className="col-lg-4 text-center">
                                        {ticketingListReturn.ticketInfo
                                          ?.status === "Booked" && (
                                          <button
                                            className="btn button-color text-white w-50 fw-bold border-radius"
                                            onClick={onOpen1}
                                            disabled={
                                              userRole > 1 ||
                                              userRole === "null"
                                                ? false
                                                : true
                                            }
                                          >
                                            Cancel Booking
                                          </button>
                                        )}
                                      </div>
                                      <div className="col-lg-4"></div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}

                              <div className="container mt-1 mb-5">
                                <div className="row">
                                  <div className="col-lg-12 text-center">
                                    {userRole > 2 || userRole === "null" ? (
                                      <></>
                                    ) : (
                                      <div className="text-red">
                                        N.B: Your permission to Ticket is
                                        denied.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="pb-5"></div>
                            </>
                          )}

                          {ticketingList?.comboSegmentInfo?.length > 0 && (
                            <div style={{ display: "none" }}>
                              <div ref={componentRefCombo}>
                                <div className="card-body">
                                  <div
                                    className="mx-lg-5 mx-md-5 mx-sm-1 px-lg-5 px-md-5 px-sm-1"
                                    ref={donwloadRef}
                                  >
                                    <h4 className="text-center pb-2 pt-3">
                                      E-Book
                                    </h4>

                                    {!isAgentInfo && (
                                      <div className="table-responsive">
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
                  style={{ width: "160px" }}
                  crossOrigin="true"
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
                                                      style={{
                                                        fontSize: "8px",
                                                      }}
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

                                    <div className="table-responsive">
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
                                              {ticketingList.ticketInfo
                                                ?.status === "Booking Cancelled"
                                                ? ticketingList.ticketInfo
                                                    ?.status
                                                : "BOOKING CONFIRMED"}
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <th>Booking Date:</th>
                                            <td>
                                              {moment(
                                                ticketingList.ticketInfo
                                                  ?.bookingDate
                                              ).format("DD-MMMM-yyyy")}
                                            </td>
                                            <td className="fw-bold">
                                              Booking ID:
                                            </td>
                                            <td>
                                              {
                                                ticketingList.ticketInfo
                                                  ?.uniqueTransID
                                              }
                                            </td>
                                          </tr>

                                          <tr>
                                            <th>
                                              {ticketingList.ticketInfo
                                                ?.status === "Ticket Ordered"
                                                ? ""
                                                : "Booking"}{" "}
                                              Status:
                                            </th>
                                            <td>
                                              {ticketingList.ticketInfo
                                                ?.status === "Ticket Ordered"
                                                ? "Ticket Processing "
                                                : ticketingList.ticketInfo
                                                    ?.status}
                                            </td>
                                            <td className="fw-bold">
                                              Booked By:
                                            </td>
                                            <td>
                                              {
                                                ticketingList.ticketInfo
                                                  ?.agentName
                                              }
                                            </td>
                                          </tr>
                                          <tr>
                                            {ticketingList.ticketInfo
                                              ?.status === "Ticket Ordered" ? (
                                              ""
                                            ) : (
                                              <>
                                                <th>Issue Before:</th>
                                                <td style={{ color: "red" }}>
                                                  {lastTicketTime !== "" &&
                                                  lastTicketTime !== null &&
                                                  lastTicketTime !==
                                                    undefined ? (
                                                    lastTicketTime
                                                  ) : (
                                                    <>
                                                      <a
                                                        href="javascript:void(0)"
                                                        title="Last Ticketing Time"
                                                        onClick={() =>
                                                          handleGetTime(
                                                            ticketingList
                                                              .ticketInfo
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
                                            <td>
                                              {ticketingList.ticketInfo?.pnr}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="fw-bold">
                                              Airline PNR
                                            </td>
                                            <td colSpan={3}>
                                              {newArr?.map((item) => {
                                                return <span>{item}</span>;
                                              })}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="table-responsive">
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
                                                  <td>{item.gender}</td>
                                                  <td>
                                                    {item.dateOfBirth === null
                                                      ? "N/A"
                                                      : moment(
                                                          item.dateOfBirth
                                                        ).format(
                                                          "DD-MMMM-yyyy"
                                                        )}
                                                  </td>
                                                  <td>
                                                    {ticketingList?.segments?.map(
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
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="table-responsive">
                                      <table
                                        className="table table-bordered table-sm"
                                        style={{ fontSize: "11px" }}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              colspan="9"
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
                                            <th>Baggage</th>
                                            <th>Cabin</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-center">
                                          {ticketingList?.directions ===
                                          undefined ? (
                                            <>
                                              {ticketingList.segments?.map(
                                                (item, index) => {
                                                  let baggage = JSON.parse(
                                                    item.baggageInfo
                                                  );
                                                  return (
                                                    <>
                                                      <tr>
                                                        <td>
                                                          {
                                                            item.operationCarrierName
                                                          }
                                                        </td>
                                                        <td>
                                                          {
                                                            item.operationCarrier
                                                          }
                                                          -{item.flightNumber}
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
                                                                (item) =>
                                                                  item.city
                                                              )}
                                                            <br></br>
                                                            (Terminal-
                                                            {
                                                              item?.originTerminal
                                                            }
                                                            )
                                                          </span>
                                                        </td>
                                                        <td>
                                                          {moment(
                                                            item.departure
                                                          ).format(
                                                            "DD-MMMM-yyyy"
                                                          )}
                                                          <br></br>
                                                          {moment(
                                                            item.departure
                                                          ).format("HH:mm")}
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
                                                                (item) =>
                                                                  item.city
                                                              )}
                                                            <br></br>
                                                            (Terminal-
                                                            {
                                                              item?.destinationTerminal
                                                            }
                                                            )
                                                          </span>
                                                        </td>
                                                        <td>
                                                          {moment(
                                                            item.arrival
                                                          ).format(
                                                            "DD-MMMM-yyyy"
                                                          )}
                                                          <br></br>
                                                          {moment(
                                                            item.arrival
                                                          ).format("HH:mm")}
                                                        </td>
                                                        <td>
                                                          {item.fareBasisCode}
                                                        </td>
                                                        <td>
                                                          {baggage?.map(
                                                            (im, idx) => {
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
                                                        <td>
                                                          {item.cabinClass}{" "}
                                                          {isRBDChange ===
                                                          false ? (
                                                            <>
                                                              (
                                                              {item.bookingCode}
                                                              )
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
                                            <></>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>

                                    {isFareHide === false ? (
                                      <>
                                        <div className="table-responsive">
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

                                                        {isFareChange ===
                                                          false && (
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
                                                          {isFareChange ===
                                                          false
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
                                                    isFareChange === false
                                                      ? 5
                                                      : 4
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
                                                      )?.toLocaleString(
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
                                                                (item) =>
                                                                  item.city
                                                              )}
                                                            {/* {bookData.data?.item1.flightInfo.dirrections[0][0].from} */}
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
                                    )}

                                    {/* //partial payment */}

                                    {ticketingList.ticketInfo?.status ===
                                      "Booked" && (
                                      <>
                                        {loader ? (
                                          <div className="d-flex align-items-center justify-content-center">
                                            <div
                                              class="spinner-border"
                                              role="status"
                                            >
                                              <span class="visually-hidden">
                                                Loading...
                                              </span>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            {partialData === false
                                              ? partialPaymentData?.isEligible && (
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
                                                        style={{
                                                          fontSize: "14px",
                                                        }}
                                                      >
                                                        {" Payments Options"}
                                                      </legend>
                                                      <Box className="d-flex justify-content-start gap-4">
                                                        <Box
                                                          gap={2}
                                                          fontSize={"14px"}
                                                          onClick={() =>
                                                            setPayment({
                                                              partialPayment: true,
                                                              fullPayment: false,
                                                            })
                                                          }
                                                        >
                                                          <div className="d-flex align-items-center gap-1">
                                                            <input
                                                              type="radio"
                                                              checked={
                                                                payment.partialPayment
                                                              }
                                                              value={
                                                                payment.partialPayment
                                                              }
                                                              name="flexRadioDefault"
                                                              id="flexRadioDefault1"
                                                            />
                                                            <label className="pt-2">
                                                              Partial Payment{" "}
                                                              <span
                                                                style={{
                                                                  fontSize:
                                                                    "12px",
                                                                }}
                                                                className="text-danger"
                                                              >
                                                                (InstantPay -{" "}
                                                                {partialPaymentData?.instantPayAmount?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                                )
                                                              </span>
                                                            </label>
                                                          </div>
                                                          {payment?.partialPayment ? (
                                                            <>
                                                              <p
                                                                className="text-end fw-bold text-danger pb-2"
                                                                style={{
                                                                  fontSize:
                                                                    "12px",
                                                                }}
                                                              >
                                                                <span>
                                                                  Settlement
                                                                  Days :{" "}
                                                                </span>{" "}
                                                                {moment(
                                                                  partialPaymentData?.lastSettlementDate
                                                                ).format(
                                                                  "DD MMM,yyyy, ddd"
                                                                )}
                                                                (
                                                                {
                                                                  partialPaymentData?.eligibleSettlementDays
                                                                }{" "}
                                                                days)
                                                              </p>
                                                            </>
                                                          ) : (
                                                            <></>
                                                          )}
                                                        </Box>

                                                        <Box
                                                          gap={4}
                                                          fontSize={"14px"}
                                                          onClick={() =>
                                                            setPayment({
                                                              partialPayment: false,
                                                              fullPayment: true,
                                                            })
                                                          }
                                                        >
                                                          <div className="d-flex align-items-center gap-1">
                                                            <input
                                                              type="radio"
                                                              value={
                                                                payment.fullPayment
                                                              }
                                                              checked={
                                                                payment.fullPayment &&
                                                                true
                                                              }
                                                              name="flexRadioDefault"
                                                              id="flexRadioDefault2"
                                                            />
                                                            <label className="pt-2">
                                                              Full Payment{" "}
                                                              <span
                                                                style={{
                                                                  fontSize:
                                                                    "12px",
                                                                }}
                                                                className="text-danger"
                                                              >
                                                                (Totalpay -{" "}
                                                                {partialPaymentData?.totalTicketFare?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                                )
                                                              </span>
                                                            </label>
                                                          </div>
                                                        </Box>
                                                      </Box>
                                                    </fieldset>
                                                  </Box>
                                                )
                                              : ""}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div style={{ pageBreakAfter: "always" }}></div>

                                <div className="card-body">
                                  <div
                                    className="mx-lg-5 mx-md-5 mx-sm-1 px-lg-5 px-md-5 px-sm-1"
                                    ref={donwloadRef}
                                  >
                                    <h4 className="text-center pb-2 pt-3">
                                      E-Book
                                    </h4>

                                    {!isAgentInfo && (
                                      <div className="table-responsive">
                                        <table class="table table-borderless table-sm">
                                          <tbody>
                                            <tr>
                                              {/* FIXED COMPANY LOGO */}
                                              {/* CHANGE THIS LATER */}
                                              <td className="text-start">
                                                {ticketingListReturn.ticketInfo
                                                  ?.agentLogo !== null ? (
                                                  <>
                                                    {/* <img
                  alt="img01"
                  src={
                    environment.s3URL +
                    `${ticketingList.ticketInfo?.agentLogo}`
                  }
                  style={{ width: "160px" }}
                  crossOrigin="true"
                ></img> */}
                                                    <ImageComponentForAgent
                                                      logo={
                                                        ticketingListReturn
                                                          .ticketInfo?.agentLogo
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
                                                      style={{
                                                        fontSize: "8px",
                                                      }}
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

                                    <div className="table-responsive">
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
                                              {ticketingListReturn.ticketInfo
                                                ?.status === "Booking Cancelled"
                                                ? ticketingListReturn.ticketInfo
                                                    ?.status
                                                : "BOOKING CONFIRMED"}
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <th>Booking Date:</th>
                                            <td>
                                              {moment(
                                                ticketingListReturn.ticketInfo
                                                  ?.bookingDate
                                              ).format("DD-MMMM-yyyy")}
                                            </td>
                                            <td className="fw-bold">
                                              Booking ID:
                                            </td>
                                            <td>
                                              {
                                                ticketingListReturn.ticketInfo
                                                  ?.uniqueTransID
                                              }
                                            </td>
                                          </tr>

                                          <tr>
                                            <th>
                                              {ticketingListReturn.ticketInfo
                                                ?.status === "Ticket Ordered"
                                                ? ""
                                                : "Booking"}{" "}
                                              Status:
                                            </th>
                                            <td>
                                              {ticketingListReturn.ticketInfo
                                                ?.status === "Ticket Ordered"
                                                ? "Ticket Processing "
                                                : ticketingListReturn.ticketInfo
                                                    ?.status}
                                            </td>
                                            <td className="fw-bold">
                                              Booked By:
                                            </td>
                                            <td>
                                              {
                                                ticketingListReturn.ticketInfo
                                                  ?.agentName
                                              }
                                            </td>
                                          </tr>
                                          <tr>
                                            {ticketingListReturn.ticketInfo
                                              ?.status === "Ticket Ordered" ? (
                                              ""
                                            ) : (
                                              <>
                                                <th>Issue Before:</th>
                                                <td style={{ color: "red" }}>
                                                  {lastTicketTimeReturn !==
                                                    "" &&
                                                  lastTicketTimeReturn !==
                                                    null &&
                                                  lastTicketTimeReturn !==
                                                    undefined ? (
                                                    lastTicketTimeReturn
                                                  ) : (
                                                    <>
                                                      <a
                                                        href="javascript:void(0)"
                                                        title="Last Ticketing Time"
                                                        onClick={() =>
                                                          handleGetTimeReturn(
                                                            ticketingListReturn
                                                              .ticketInfo
                                                              ?.referenceLog
                                                          )
                                                        }
                                                      >
                                                        <Button
                                                          isLoading={
                                                            isLoadingReturn
                                                          }
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
                                            <td>
                                              {
                                                ticketingListReturn.ticketInfo
                                                  ?.pnr
                                              }
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="fw-bold">
                                              Airline PNR
                                            </td>
                                            <td colSpan={3}>
                                              {newArr?.map((item) => {
                                                return <span>{item}</span>;
                                              })}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="table-responsive">
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
                                          {ticketingListReturn.passengerInfo?.map(
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
                                                  <td>{item.gender}</td>
                                                  <td>
                                                    {item.dateOfBirth === null
                                                      ? "N/A"
                                                      : moment(
                                                          item.dateOfBirth
                                                        ).format(
                                                          "DD-MMMM-yyyy"
                                                        )}
                                                  </td>
                                                  <td>
                                                    {ticketingListReturn?.segments?.map(
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
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="table-responsive">
                                      <table
                                        className="table table-bordered table-sm"
                                        style={{ fontSize: "11px" }}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              colspan="9"
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
                                            <th>Baggage</th>
                                            <th>Cabin</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-center">
                                          {ticketingListReturn?.directions ===
                                          undefined ? (
                                            <>
                                              {ticketingListReturn.segments?.map(
                                                (item, index) => {
                                                  let baggage = JSON.parse(
                                                    item.baggageInfo
                                                  );
                                                  return (
                                                    <>
                                                      <tr>
                                                        <td>
                                                          {
                                                            item.operationCarrierName
                                                          }
                                                        </td>
                                                        <td>
                                                          {
                                                            item.operationCarrier
                                                          }
                                                          -{item.flightNumber}
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
                                                                (item) =>
                                                                  item.city
                                                              )}
                                                            <br></br>
                                                            (Terminal-
                                                            {
                                                              item?.originTerminal
                                                            }
                                                            )
                                                          </span>
                                                        </td>
                                                        <td>
                                                          {moment(
                                                            item.departure
                                                          ).format(
                                                            "DD-MMMM-yyyy"
                                                          )}
                                                          <br></br>
                                                          {moment(
                                                            item.departure
                                                          ).format("HH:mm")}
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
                                                                (item) =>
                                                                  item.city
                                                              )}
                                                            <br></br>
                                                            (Terminal-
                                                            {
                                                              item?.destinationTerminal
                                                            }
                                                            )
                                                          </span>
                                                        </td>
                                                        <td>
                                                          {moment(
                                                            item.arrival
                                                          ).format(
                                                            "DD-MMMM-yyyy"
                                                          )}
                                                          <br></br>
                                                          {moment(
                                                            item.arrival
                                                          ).format("HH:mm")}
                                                        </td>
                                                        <td>
                                                          {item.fareBasisCode}
                                                        </td>
                                                        <td>
                                                          {baggage?.map(
                                                            (im, idx) => {
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
                                                        <td>
                                                          {item.cabinClass}{" "}
                                                          {isRBDChange ===
                                                          false ? (
                                                            <>
                                                              (
                                                              {item.bookingCode}
                                                              )
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
                                            <></>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>

                                    {isFareHide === false ? (
                                      <>
                                        <div className="table-responsive">
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
                                              {ticketingListReturn.fareBreakdown?.map(
                                                (item, index) => {
                                                  return (
                                                    <>
                                                      <tr>
                                                        <td className="text-center">
                                                          {getPassengerType(
                                                            item.passengerType,
                                                            ticketingListReturn.fareBreakdown
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

                                                        {isFareChange ===
                                                          false && (
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
                                                          {isFareChange ===
                                                          false
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
                                                    isFareChange === false
                                                      ? 5
                                                      : 4
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
                                                  {/* {ticketingList.passengerInfo[0]?.currencyName}{" "} */}
                                                  {/* {ticketingList.ticketInfo?.ticketingPrice.toLocaleString(
    "en-US"
  )} */}
                                                  {/* {
    sumRating(ticketingList.fareBreakdown).toLocaleString("en-US")
  } */}
                                                  {isFareChange === false
                                                    ? sumRating(
                                                        ticketingListReturn.fareBreakdown
                                                      )?.toLocaleString("en-US")
                                                    : sumRatingGross(
                                                        ticketingListReturn.fareBreakdown
                                                      )?.toLocaleString(
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
                                            {ticketingListReturn.passengerInfo?.map(
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
                                                                  ticketingListReturn
                                                                    .segments[0]
                                                                    ?.origin
                                                              )
                                                              .map(
                                                                (item) =>
                                                                  item.city
                                                              )}
                                                            {/* {bookData.data?.item1.flightInfo.dirrections[0][0].from} */}
                                                          </td>
                                                          <td>
                                                            {
                                                              ticketingListReturn
                                                                ?.ticketInfo
                                                                ?.leadPaxEmail
                                                            }
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
                                    )}

                                    {/* //partial payment */}

                                    {ticketingListReturn.ticketInfo?.status ===
                                      "Booked" && (
                                      <>
                                        {loader ? (
                                          <div className="d-flex align-items-center justify-content-center">
                                            <div
                                              class="spinner-border"
                                              role="status"
                                            >
                                              <span class="visually-hidden">
                                                Loading...
                                              </span>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            {partialData === false
                                              ? partialPaymentData?.isEligible && (
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
                                                        style={{
                                                          fontSize: "14px",
                                                        }}
                                                      >
                                                        {" Payments Options"}
                                                      </legend>
                                                      <Box className="d-flex justify-content-start gap-4">
                                                        <Box
                                                          gap={2}
                                                          fontSize={"14px"}
                                                          onClick={() =>
                                                            setPayment({
                                                              partialPayment: true,
                                                              fullPayment: false,
                                                            })
                                                          }
                                                        >
                                                          <div className="d-flex align-items-center gap-1">
                                                            <input
                                                              type="radio"
                                                              checked={
                                                                payment.partialPayment
                                                              }
                                                              value={
                                                                payment.partialPayment
                                                              }
                                                              name="flexRadioDefault"
                                                              id="flexRadioDefault1"
                                                            />
                                                            <label className="pt-2">
                                                              Partial Payment{" "}
                                                              <span
                                                                style={{
                                                                  fontSize:
                                                                    "12px",
                                                                }}
                                                                className="text-danger"
                                                              >
                                                                (InstantPay -{" "}
                                                                {partialPaymentData?.instantPayAmount?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                                )
                                                              </span>
                                                            </label>
                                                          </div>
                                                          {payment?.partialPayment ? (
                                                            <>
                                                              <p
                                                                className="text-end fw-bold text-danger pb-2"
                                                                style={{
                                                                  fontSize:
                                                                    "12px",
                                                                }}
                                                              >
                                                                <span>
                                                                  Settlement
                                                                  Days :{" "}
                                                                </span>{" "}
                                                                {moment(
                                                                  partialPaymentData?.lastSettlementDate
                                                                ).format(
                                                                  "DD MMM,yyyy, ddd"
                                                                )}
                                                                (
                                                                {
                                                                  partialPaymentData?.eligibleSettlementDays
                                                                }{" "}
                                                                days)
                                                              </p>
                                                            </>
                                                          ) : (
                                                            <></>
                                                          )}
                                                        </Box>

                                                        <Box
                                                          gap={4}
                                                          fontSize={"14px"}
                                                          onClick={() =>
                                                            setPayment({
                                                              partialPayment: false,
                                                              fullPayment: true,
                                                            })
                                                          }
                                                        >
                                                          <div className="d-flex align-items-center gap-1">
                                                            <input
                                                              type="radio"
                                                              value={
                                                                payment.fullPayment
                                                              }
                                                              checked={
                                                                payment.fullPayment &&
                                                                true
                                                              }
                                                              name="flexRadioDefault"
                                                              id="flexRadioDefault2"
                                                            />
                                                            <label className="pt-2">
                                                              Full Payment{" "}
                                                              <span
                                                                style={{
                                                                  fontSize:
                                                                    "12px",
                                                                }}
                                                                className="text-danger"
                                                              >
                                                                (Totalpay -{" "}
                                                                {partialPaymentData?.totalTicketFare?.toLocaleString(
                                                                  "en-US"
                                                                )}
                                                                )
                                                              </span>
                                                            </label>
                                                          </div>
                                                        </Box>
                                                      </Box>
                                                    </fieldset>
                                                  </Box>
                                                )
                                              : ""}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="pb-5"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="content-wrapper search-panel-bg">
                    <section className="content-header"></section>
                    <section className="content content-panel">
                      <div className="container bg-white w-25">
                        <div className="row">
                          <div className="col-lg-12 text-center mb-5">
                            {/* <h5 className="pt-4 fw-bold">Please try again</h5> */}
                            <div className="my-3">
                              <span className="text-danger fs-3">
                                <i
                                  class="fa fa-exclamation-triangle"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </div>
                            <p className="mb-2">
                              Something is wrong please try again!
                            </p>
                            <hr></hr>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </div>
      <Modal
        isCentered
        isOpen={isOpen2}
        onClose={onOpen2}
        trapFocus={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <Box borderBottom="2px solid #bbc5d3">
            <ModalHeader>OTP</ModalHeader>
            {/* <ModalCloseButton /> */}
          </Box>
          <ModalBody>
            <Box pb="20px">
              <Text
                htmlFor="otpInput"
                display={"flex"}
                justifyContent={"center"}
                textAlign={"center"}
                fontSize={"15px"}
                color={"red"}
                p={1}
              >
                {message}
              </Text>
              <Text
                htmlFor="otpInput"
                display={"flex"}
                justifyContent={"center"}
                textAlign={"center"}
                fontSize={"15px"}
                color={"red"}
                p={1}
              >
                Please provide the 6 digits OTP
              </Text>
              <Input
                id="otpInput"
                type="number"
                value={desableotp}
                pattern="^(\d{0}|\d{6})$"
                onChange={(e) => {
                  if (e.target.value.length < 7) {
                    setdesableotp(e.target.value);
                  } else {
                    e.preventDefault();
                  }
                }}
                onKeyDown={preventNegativeValues}
                placeholder="Enter OTP"
              />

              <Box display="flex" justifyContent="flex-end" mt="10px" gap="2">
                <button
                  className="btn btn-secondary border-radius"
                  onClick={() => {
                    setdesableotp("");
                    onClose2();
                  }}
                >
                  Close
                </button>
                <button
                  className="btn button-color border-radius text-white"
                  disabled={desableotp.length < 6 && true}
                  onClick={() => handleVerifyTicketUnlockOtp()}
                >
                  Submit
                </button>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModalForm isOpen={isOpen3} onClose={onClose3} size={"xl"}>
        <Center>
          <div className="row">
            <div className="col-lg-12 text-center m-2 p-3">
              <h5 class="button-color p-2 text-white my-1 border-radius">
                Your selected price has been changed!
              </h5>
              <p className="py-2">
                Reference number : {ticketingList?.ticketInfo?.uniqueTransID}
              </p>
              <h5 className="text-success pb-1">
                New Price is AED {ticketResponse?.item1?.totalPrice}
              </h5>
              <h5 className="text-success pb-3">
                Old Price is AED {ticketingList?.ticketInfo?.ticketingPrice}
              </h5>

              {ticketResponse?.item1?.newPartialPaymentAmount !== null &&
                ticketResponse?.item1?.newPartialPaymentAmount !== undefined &&
                ticketResponse?.item1?.newPartialPaymentAmount !== "" &&
                ticketResponse?.item1?.newPartialPaymentAmount > 0 && (
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
                        <Box
                          gap={2}
                          fontSize={"14px"}
                          onClick={() =>
                            setPaymentForReprice({
                              partialPayment: true,
                              fullPayment: false,
                            })
                          }
                        >
                          <div className="d-flex align-items-center gap-1">
                            <input
                              type="radio"
                              checked={paymentForReprice.partialPayment}
                              value={paymentForReprice.partialPayment}
                              name="flexRadioDefault10"
                              id="flexRadioDefault10"
                            />
                            <label className="pt-2">
                              Partial Payment{" "}
                              <span
                                style={{
                                  fontSize: "12px",
                                }}
                                className="text-danger"
                              >
                                (InstantPay -{" "}
                                {ticketResponse?.item1?.newPartialPaymentAmount?.toLocaleString(
                                  "en-US"
                                )}
                                )
                              </span>
                            </label>
                          </div>
                          {paymentForReprice?.partialPayment ? (
                            <>
                              <p
                                className="text-end fw-bold text-danger pb-2"
                                style={{
                                  fontSize: "12px",
                                }}
                              >
                                <span>Settlement Days : </span>{" "}
                                {moment(
                                  partialPaymentData?.lastSettlementDate
                                ).format("DD MMM,yyyy, ddd")}
                                ({partialPaymentData?.eligibleSettlementDays}{" "}
                                days)
                              </p>
                            </>
                          ) : (
                            <></>
                          )}
                        </Box>

                        <Box
                          gap={4}
                          fontSize={"14px"}
                          onClick={() =>
                            setPaymentForReprice({
                              partialPayment: false,
                              fullPayment: true,
                            })
                          }
                        >
                          <div className="d-flex align-items-center gap-1">
                            <input
                              type="radio"
                              value={paymentForReprice.fullPayment}
                              checked={paymentForReprice.fullPayment && true}
                              name="flexRadioDefault20"
                              id="flexRadioDefault20"
                            />
                            <label className="pt-2">
                              Full Payment{" "}
                              <span
                                style={{
                                  fontSize: "12px",
                                }}
                                className="text-danger"
                              >
                                (Totalpay -{" "}
                                {ticketResponse?.item1?.totalPrice?.toLocaleString(
                                  "en-US"
                                )}
                                )
                              </span>
                            </label>
                          </div>
                        </Box>
                      </Box>
                    </fieldset>
                  </Box>
                )}
              <hr></hr>
              <div className="mt-4">
                <button
                  type="button"
                  class="btn button-color text-white me-2 border-radius"
                  data-bs-dismiss="modal"
                  onClick={() => navigate("/")}
                >
                  Search Again
                </button>
                <button
                  type="button"
                  class="btn button-color text-white border-radius"
                  onClick={() => {
                    handleGenerateTicketForReprice();
                    onClose3();
                  }}
                >
                  Issue Ticket
                </button>
              </div>
            </div>
          </div>
        </Center>
      </ModalForm>
      <Footer></Footer>
    </div>
  );
};

export default BookedView;