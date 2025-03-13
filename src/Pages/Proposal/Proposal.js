import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import html2canvas from "html2canvas";
import $ from "jquery";
import jsPDF from "jspdf";
import moment from "moment";

import React, { useEffect, useRef, useState } from "react";
import { MdAirlineSeatReclineExtra, MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ModalForm from "../../common/modalForm";
import useAuth from "../../hooks/useAuth";
import airports from "../../JSON/airports.json";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import dayCount from "../SharePages/Utility/dayCount";
import { environment } from "../SharePages/Utility/environment";
import "./Proposal.css";
import {
  addDurations,
  findLayoverAirTime,
  getPassengerTypeWithCode,
  passengerType,
  timeDuration,
  totalFlightDuration,
} from "../../common/functions";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoAirplane } from "react-icons/io5";
import layOver from "../SharePages/Utility/layOver";
import ImageComponent from "../../common/ImageComponent";
import { sendEmailProposal } from "../../common/allApi";
import Footer from "../SharePages/Footer/Footer";

const Proposal = () => {
  const { setCount } = useAuth();
  setCount(0);
  const navigate = useNavigate();
  let defaultPriceList = [];
  let flightList = JSON.parse(sessionStorage.getItem("checkList"));
  const searchData = JSON.parse(sessionStorage.getItem("Database"));
  const currency = JSON.parse(sessionStorage.getItem("currency"));
  const one = JSON.parse(sessionStorage.getItem("one"));
  const two = JSON.parse(sessionStorage.getItem("two"));
  const three = JSON.parse(sessionStorage.getItem("three"));
  const four = JSON.parse(sessionStorage.getItem("four"));
  const five = JSON.parse(sessionStorage.getItem("five"));
  const six = JSON.parse(sessionStorage.getItem("six"));
  const donwloadRef = useRef();
  flightList?.map((item, index) => {
    // console.log(item,'=======================>');

    defaultPriceList.push(item.bookingComponents[0].totalPrice);
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messageData, setMessageData] = useState({});
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
    donwloadRef.current.style.width = "1024px";
    const element = donwloadRef.current;
    html2canvas(element, {
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
      donwloadRef.current.style.width = "auto";
      sendEmailProposal({
        ...messageData,
        html: file,
        attactment: "",
        fileName: "Proposal",
      })
        .then((response) => {
          if (response.status === 200 && response.data) {
            toast.success("Email send successfully.");
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

  let adultPrice = [];
  let childBigPrice = [];
  let childPrice = [];
  let infantPrice = [];

  const serviceCharge = {
    adt: [],
    chd: [],
    cnn: [],
    inf: [],
  };

  flightList?.map((item, index) => {
    if (item.brandedFareIdx === null) {
      if (item.passengerFares.adt !== null) {
        adultPrice.push(0);
        serviceCharge.adt.push(0);
      }
      if (item.passengerFares.chd !== null) {
        childPrice.push(0);
        childBigPrice.push(0);
        serviceCharge.chd.push(0);
        serviceCharge.cnn.push(0);
      }
      if (item.passengerFares.cnn !== null) {
        childPrice.push(0);
        childBigPrice.push(0);
        serviceCharge.chd.push(0);
        serviceCharge.cnn.push(0);
      }
      if (item.passengerFares.inf !== null) {
        infantPrice.push(0);
        serviceCharge.inf.push(0);
      }
      if (
        item.passengerFares.chd !== null &&
        item.passengerFares.cnn !== null &&
        item.passengerFares.inf !== null
      ) {
        childPrice.push(0);
        childBigPrice.push(0);
        infantPrice.push(0);
        serviceCharge.chd.push(0);
        serviceCharge.cnn.push(0);
        serviceCharge.inf.push(0);
      }
    } else {
      if (
        item.brandedFares[item.brandedFareIdx].paxFareBreakDown.adt !== null
      ) {
        adultPrice.push(0);
        serviceCharge.adt.push(0);
      }
      if (
        item.brandedFares[item.brandedFareIdx].paxFareBreakDown.chd !== null
      ) {
        childPrice.push(0);
        childBigPrice.push(0);
        serviceCharge.chd.push(0);
        serviceCharge.cnn.push(0);
      }
      if (
        item.brandedFares[item.brandedFareIdx].paxFareBreakDown.cnn !== null
      ) {
        childPrice.push(0);
        childBigPrice.push(0);
        serviceCharge.chd.push(0);
        serviceCharge.cnn.push(0);
      }
      if (
        item.brandedFares[item.brandedFareIdx].paxFareBreakDown.inf !== null
      ) {
        infantPrice.push(0);
        serviceCharge.inf.push(0);
      }
      if (
        item.brandedFares[item.brandedFareIdx].paxFareBreakDown.chd !== null &&
        item.brandedFares[item.brandedFareIdx].paxFareBreakDown.cnn !== null &&
        item.brandedFares[item.brandedFareIdx].paxFareBreakDown.inf !== null
      ) {
        childPrice.push(0);
        childBigPrice.push(0);
        infantPrice.push(0);
        serviceCharge.chd.push(0);
        serviceCharge.cnn.push(0);
        serviceCharge.inf.push(0);
      }
    }
  });
  useEffect(() => {
    flightList?.map((item, index) => {
      $(document).ready(function () {
        $("#flightId" + index).attr("style", "background:#ed5c2b");
        $("#baggageId" + index).attr("style", "background:#02046a");
        $("#changeId" + index).attr("style", "background:#02046a");
        $("#fareId" + index).attr("style", "background:#02046a");
      });

      $("#flightId" + index).click(function () {
        $("#flightId" + index).attr("style", "background:#ed5c2b");
        $("#baggageId" + index).attr("style", "background:#02046a");
        $("#changeId" + index).attr("style", "background:#02046a");
        $("#fareId" + index).attr("style", "background:#02046a");
      });

      $("#baggageId" + index).click(function () {
        $("#flightId" + index).attr("style", "background:#02046a");
        $("#baggageId" + index).attr("style", "background:#ed5c2b");
        $("#changeId" + index).attr("style", "background:#02046a");
        $("#fareId" + index).attr("style", "background:#02046a");
      });

      $("#changeId" + index).click(function () {
        $("#flightId" + index).attr("style", "background:#02046a");
        $("#baggageId" + index).attr("style", "background:#02046a");
        $("#changeId" + index).attr("style", "background:#ed5c2b");
        $("#fareId" + index).attr("style", "background:#02046a");
      });

      $("#fareId" + index).click(function () {
        $("#flightId" + index).attr("style", "background:#02046a");
        $("#baggageId" + index).attr("style", "background:#02046a");
        $("#changeId" + index).attr("style", "background:#02046a");
        $("#fareId" + index).attr("style", "background:#ed5c2b");
      });

      $("#flight" + index).show();
      $("#baggage" + index).hide();
      $("#cancel" + index).hide();
      $("#fare" + index).hide();

      $("#flightId" + index).click(function () {
        $("#flight" + index).show();
        $("#baggage" + index).hide();
        $("#cancel" + index).hide();
        $("#fare" + index).hide();
      });
      $("#baggageId" + index).click(function () {
        $("#flight" + index).hide();
        $("#baggage" + index).show();
        $("#cancel" + index).hide();
        $("#fare" + index).hide();
      });
      $("#changeId" + index).click(function () {
        $("#flight" + index).hide();
        $("#baggage" + index).hide();
        $("#cancel" + index).show();
        $("#fare" + index).hide();
      });
      $("#fareId" + index).click(function () {
        $("#flight" + index).hide();
        $("#baggage" + index).hide();
        $("#cancel" + index).hide();
        $("#fare" + index).show();
      });

      $("#passengerBrackdown" + index).hide();
      $("#priceDown" + index).click(function () {
        $("#passengerBrackdown" + index).toggle("slow");
      });

      $("#balanceInput" + index).hide();
      $("#right" + index).hide();
      $("#edit" + index).click(function () {
        $("#balanceInput" + index).show();
        $("#right" + index).show();
        $("#balance" + index).hide();
        $("#edit" + index).hide();
      });
      $("#right" + index).click(function () {
        $("#balanceInput" + index).hide();
        $("#right" + index).hide();
        $("#balance" + index).show();
        $("#edit" + index).show();
      });
    });
  }, []);

  const [singleValue, setSingleValue] = useState(defaultPriceList);
  const [value, setValue] = useState();
  const [adultPriceValue, setAdultPriceValue] = useState(adultPrice);
  const [childBigPriceValue, setChildBigPriceValue] = useState(childBigPrice);
  const [childPriceValue, setChildPriceValue] = useState(childPrice);
  const [infantPriceValue, setInfantPriceValue] = useState(infantPrice);

  const [inputDecreaseValue, setInputDecreaseValue] = useState();
  const [addBalance, setAddBalance] = useState(0);
  const [decBalance, setDecBalance] = useState(0);
  const [selectedType, setSelectedType] = useState("Increase");
  const [emailSection, setEmailSection] = useState(false);

  const handleOnBlur = (e) => {
    const html = document.getElementById("proposalPrint").innerHTML;
    const attachment = "";
    const field = e.target.name;
    const value = e.target.value;
    const newMessageData = { ...messageData, attachment, html };
    newMessageData[field] = value;
    setMessageData(newMessageData);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    if (selectedType === "Increase") {
      setAddBalance(parseInt(addBalance) + parseInt(value));
      setValue("");
    } else {
      setAddBalance(parseInt(addBalance) - parseInt(value));
      setValue("");
    }
  };

  const handleValue = (value, index, type) => {
    if (type === "adt") {
      if (value === "") {
        setAdultPriceValue(adultPrice);
      } else {
        const singleValueList = [...adultPriceValue];
        singleValueList[index] = value;
        setAdultPriceValue(singleValueList);
      }
    }
    if (type === "chd") {
      if (value === "") {
        setChildBigPriceValue(childBigPrice);
      } else {
        const singleValueList = [...childBigPriceValue];
        singleValueList[index] = value;
        setChildBigPriceValue(singleValueList);
      }
    }
    if (type === "cnn") {
      if (value === "") {
        setChildPriceValue(childPrice);
      } else {
        const singleValueList = [...childPriceValue];
        singleValueList[index] = value;
        setChildPriceValue(singleValueList);
      }
    }
    if (type === "inf") {
      if (value === "") {
        setInfantPriceValue(infantPrice);
      } else {
        const singleValueList = [...infantPriceValue];
        singleValueList[index] = value;
        setInfantPriceValue(singleValueList);
      }
    }
  };

  const [sCharge, setSCharge] = useState(serviceCharge);

  const handleValueForService = (value, index, type) => {
    if (type === "adt") {
      if (value === "") {
        setSCharge({ ...sCharge, adt: serviceCharge.adt });
      } else {
        const singleValueList = sCharge.adt;
        singleValueList[index] = parseInt(value);
        setSCharge({ ...sCharge, adt: singleValueList });
      }
    }
    if (type === "chd") {
      if (value === "") {
        setSCharge({ ...sCharge, chd: serviceCharge.chd });
      } else {
        const singleValueList = sCharge.chd;
        singleValueList[index] = parseInt(value);
        setSCharge({ ...sCharge, chd: singleValueList });
      }
    }
    if (type === "cnn") {
      if (value === "") {
        setSCharge({ ...sCharge, cnn: serviceCharge.cnn });
      } else {
        const singleValueList = sCharge.cnn;
        singleValueList[index] = parseInt(value);
        setSCharge({ ...sCharge, cnn: singleValueList });
      }
    }
    if (type === "inf") {
      if (value === "") {
        setSCharge({ ...sCharge, inf: serviceCharge.inf });
      } else {
        const singleValueList = sCharge.inf;
        singleValueList[index] = parseInt(value);
        setSCharge({ ...sCharge, inf: singleValueList });
      }
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    donwloadRef.current.style.width = "1024px";
    const element = donwloadRef.current;
    const canvas = await html2canvas(element, {
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
      onrendered: function (canvas) {
        document.body.appendChild(canvas);
      },
      logging: true,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", [297, 650]);
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
    pdf.save("proposal_Triplover.pdf");
    donwloadRef.current.style.width = "auto";
    setIsDownloading(false);
  };

  const [showFare, setShowFare] = useState(true);

  const toggoleButton = () => {
    setShowFare((pre) => !pre);
  };

  const [grossFare, setGrossFare] = useState(true);

  const toggoleButtonForFare = () => {
    setGrossFare((pre) => !pre);
  };

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <ToastContainer position="bottom-right" autoClose={1500} />
      <div className="content-wrapper search-panel-bg pb-5">
        <section className="content-header"></section>
        <section className="content">
          <Box
            className="d-flex justify-content-end container flex-wrap"
            style={{ maxWidth: "950px" }}
          >
            <Button
              className="button-color px-2 me-2 border-radius"
              colorScheme="teal"
              variant=""
              onClick={() => toggoleButtonForFare()}
            >
              <Text className="text-white" style={{ fontSize: "12px" }}>
                {grossFare ? "Gross Fare" : "Net Fare"}
              </Text>
            </Button>
            <Button
              className="button-color px-2 border-radius"
              colorScheme="teal"
              variant=""
              onClick={() => {
                onOpen();
              }}
            >
              <Text className="text-white" style={{ fontSize: "12px" }}>
                Send Mail{" "}
              </Text>
            </Button>
            <Button
              className="button-color px-2 mx-2 border-radius"
              colorScheme="teal"
              variant=""
              onClick={handleDownloadPdf}
              disabled={isDownloading ? true : false}
            >
              <Text className="text-white" style={{ fontSize: "12px" }}>
                Download{" "}
              </Text>
            </Button>
            <Button
              className="button-color px-2 border-radius"
              colorScheme="teal"
              variant=""
              onClick={() => toggoleButton()}
            >
              <Text className="text-white" style={{ fontSize: "12px" }}>
                {showFare ? "Hide Fare" : "Show Fare"}
              </Text>
            </Button>
          </Box>
          {flightList?.length > 0 ? (
            <>
              <div className="container my-3" style={{ maxWidth: "950px" }}>
                <div className="row">
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
                        // variant="solid"
                        mt={"2"}
                        bg={"#7c04c0"}
                        color={"white"}
                        _hover={{ bg: "#7c04c0" }}
                        disabled={btnDisabled === true ? true : false}
                        onClick={handleMessageUser}
                      >
                        Send
                      </Button>
                    </Box>
                  </ModalForm>

                  <div className="col-lg-12">
                    {flightList?.length > 0 ? (
                      flightList?.map((item, index) => {
                        return (
                          <>
                            <div className="row my-3 py-2 rounded box-shadow bg-white">
                              <div className="col-lg-10 my-auto border-end">
                                <div className="row p-2 text-color">
                                  <div className="col-lg-1 my-auto">
                                    <img
                                      src={
                                        environment.s3ArliensImage +
                                        `${
                                          item.directions[0][
                                            index === 0
                                              ? one[0]
                                              : index === 1
                                              ? one[1]
                                              : one[2]
                                          ].platingCarrierCode
                                        }.png`
                                      }
                                      alt=""
                                      width="40px"
                                      height="40px"
                                    />
                                  </div>
                                  <div
                                    className="col-lg-3 my-auto text-center"
                                    style={{ fontSize: "14px" }}
                                  >
                                    <p className="my-auto">
                                      {
                                        item.directions[0][
                                          index === 0
                                            ? one[0]
                                            : index === 1
                                            ? one[1]
                                            : one[2]
                                        ].platingCarrierName
                                      }
                                    </p>
                                    <p className="my-auto">
                                      {
                                        item.directions[0][
                                          index === 0
                                            ? one[0]
                                            : index === 1
                                            ? one[1]
                                            : one[2]
                                        ].segments[0].details[0].equipment
                                      }
                                    </p>
                                    <p>
                                      {
                                        item.directions[0][
                                          index === 0
                                            ? one[0]
                                            : index === 1
                                            ? one[1]
                                            : one[2]
                                        ]?.platingCarrierCode
                                      }{" "}
                                      -{" "}
                                      {
                                        item.directions[0][
                                          index === 0
                                            ? one[0]
                                            : index === 1
                                            ? one[1]
                                            : one[2]
                                        ].segments[0].flightNumber
                                      }
                                    </p>
                                  </div>
                                  <div className="col-lg-2 my-auto">
                                    <h6 className="fw-bold">
                                      <span className="fs-5">
                                        {
                                          item.directions[0][
                                            index === 0
                                              ? one[0]
                                              : index === 1
                                              ? one[1]
                                              : one[2]
                                          ].from
                                        }
                                      </span>
                                      <span className="ms-1 fs-5">
                                        {item.directions[0][
                                          index === 0
                                            ? one[0]
                                            : index === 1
                                            ? one[1]
                                            : one[2]
                                        ].segments[0].departure.substr(11, 5)}
                                      </span>
                                    </h6>
                                    <h6 className="flighttime">
                                      {moment(
                                        item.directions[0][
                                          index === 0
                                            ? one[0]
                                            : index === 1
                                            ? one[1]
                                            : one[2]
                                        ].segments[0].departure
                                      ).format("DD MMM,yyyy, ddd")}
                                    </h6>
                                    <h6 className="flighttime">
                                      {airports
                                        .filter(
                                          (f) =>
                                            f.iata ===
                                            item.directions[0][
                                              index === 0
                                                ? one[0]
                                                : index === 1
                                                ? one[1]
                                                : one[2]
                                            ].from
                                        )
                                        .map((item) => item.city)}
                                    </h6>
                                  </div>
                                  <div className="col-lg-4 my-auto">
                                    <div className="row lh-1">
                                      <div className="col-lg-12 text-center">
                                        <span className="text-color font-size">
                                          {item.directions[0][
                                            index === 0
                                              ? one[0]
                                              : index === 1
                                              ? one[1]
                                              : one[2]
                                          ].stops === 0
                                            ? "Direct"
                                            : item.directions[0][
                                                index === 0
                                                  ? one[0]
                                                  : index === 1
                                                  ? one[1]
                                                  : one[2]
                                              ].stops + " Stop"}
                                        </span>
                                      </div>
                                      <div className="col-lg-12 text-center">
                                        <span className="text-color">
                                          <i class="fas fa-circle fa-xs"></i>
                                          ----------------------
                                          <i className="fas fa-plane fa-sm"></i>
                                        </span>
                                      </div>
                                      <div className="col-lg-12 text-center">
                                        <span className="text-color">
                                          <i className="fas fa-clock fa-sm"></i>
                                          <span className="ms-1 font-size">
                                            {
                                              item.directions[0][
                                                index === 0
                                                  ? one[0]
                                                  : index === 1
                                                  ? one[1]
                                                  : one[2]
                                              ].segments[0].duration[0]
                                            }
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 my-auto">
                                    <h6 className="fw-bold">
                                      <span className="fs-5">
                                        {
                                          item.directions[0][
                                            index === 0
                                              ? one[0]
                                              : index === 1
                                              ? one[1]
                                              : one[2]
                                          ].to
                                        }
                                      </span>
                                      <span className="ms-1 fs-5">
                                        {item.directions[0][
                                          index === 0
                                            ? one[0]
                                            : index === 1
                                            ? one[1]
                                            : one[2]
                                        ].segments[
                                          item.directions[0][
                                            index === 0
                                              ? one[0]
                                              : index === 1
                                              ? one[1]
                                              : one[2]
                                          ].segments.length - 1
                                        ].arrival.substr(11, 5)}
                                      </span>

                                      <sup>
                                        &nbsp;
                                        {dayCount(
                                          item.directions[0][
                                            index === 0
                                              ? one[0]
                                              : index === 1
                                              ? one[1]
                                              : one[2]
                                          ].segments[
                                            item.directions[0][
                                              index === 0
                                                ? one[0]
                                                : index === 1
                                                ? one[1]
                                                : one[2]
                                            ].segments.length - 1
                                          ].arrival,
                                          item.directions[0][
                                            index === 0
                                              ? one[0]
                                              : index === 1
                                              ? one[1]
                                              : one[2]
                                          ].segments[0]?.departure
                                        ) !== 0 ? (
                                          <span
                                            className="text-danger"
                                            style={{ fontSize: "8px" }}
                                          >
                                            +
                                            {dayCount(
                                              item.directions[0][
                                                index === 0
                                                  ? one[0]
                                                  : index === 1
                                                  ? one[1]
                                                  : one[2]
                                              ].segments[
                                                item.directions[0][
                                                  index === 0
                                                    ? one[0]
                                                    : index === 1
                                                    ? one[1]
                                                    : one[2]
                                                ].segments.length - 1
                                              ].arrival,
                                              item.directions[0][
                                                index === 0
                                                  ? one[0]
                                                  : index === 1
                                                  ? one[1]
                                                  : one[2]
                                              ].segments[0]?.departure
                                            )}
                                          </span>
                                        ) : (
                                          ""
                                        )}{" "}
                                      </sup>
                                    </h6>
                                    <h6 className="flighttime">
                                      {moment(
                                        item.directions[0][
                                          index === 0
                                            ? one[0]
                                            : index === 1
                                            ? one[1]
                                            : one[2]
                                        ].segments[
                                          item.directions[0][
                                            index === 0
                                              ? one[0]
                                              : index === 1
                                              ? one[1]
                                              : one[2]
                                          ].segments.length - 1
                                        ].arrival
                                      ).format("DD MMM,yyyy, ddd")}
                                    </h6>
                                    <h6 className="flighttime">
                                      {airports
                                        .filter(
                                          (f) =>
                                            f.iata ===
                                            item.directions[0][
                                              index === 0
                                                ? one[0]
                                                : index === 1
                                                ? one[1]
                                                : one[2]
                                            ].to
                                        )
                                        .map((item) => item.city)}
                                    </h6>
                                  </div>
                                </div>

                                {item.directions[1] !== undefined ? (
                                  <>
                                    <div className="row p-2 text-color border-top">
                                      <div className="col-lg-1 my-auto">
                                        <img
                                          src={
                                            environment.s3ArliensImage +
                                            `${
                                              item.directions[1][
                                                index === 0
                                                  ? two[0]
                                                  : index === 1
                                                  ? two[1]
                                                  : two[2]
                                              ].platingCarrierCode
                                            }.png`
                                          }
                                          alt=""
                                          width="40px"
                                          height="40px"
                                        />
                                      </div>
                                      <div
                                        className="col-lg-3 my-auto text-center"
                                        style={{ fontSize: "14px" }}
                                      >
                                        <p className="my-auto">
                                          {
                                            item.directions[1][
                                              index === 0
                                                ? two[0]
                                                : index === 1
                                                ? two[1]
                                                : two[2]
                                            ].platingCarrierName
                                          }
                                        </p>
                                        <p className="my-auto">
                                          {
                                            item.directions[1][
                                              index === 0
                                                ? two[0]
                                                : index === 1
                                                ? two[1]
                                                : two[2]
                                            ].segments[0].details[0].equipment
                                          }
                                        </p>
                                        <p>
                                          {
                                            item.directions[1][
                                              index === 0
                                                ? two[0]
                                                : index === 1
                                                ? two[1]
                                                : two[2]
                                            ].platingCarrierCode
                                          }{" "}
                                          -{" "}
                                          {
                                            item.directions[1][
                                              index === 0
                                                ? two[0]
                                                : index === 1
                                                ? two[1]
                                                : two[2]
                                            ].segments[0].flightNumber
                                          }
                                        </p>
                                      </div>
                                      <div className="col-lg-2 my-auto">
                                        <h6 className="fw-bold">
                                          <span className="fs-5">
                                            {
                                              item.directions[1][
                                                index === 0
                                                  ? two[0]
                                                  : index === 1
                                                  ? two[1]
                                                  : two[2]
                                              ].from
                                            }
                                          </span>
                                          <span className="ms-1 fs-5">
                                            {item.directions[1][
                                              index === 0
                                                ? two[0]
                                                : index === 1
                                                ? two[1]
                                                : two[2]
                                            ].segments[0].departure.substr(
                                              11,
                                              5
                                            )}
                                          </span>
                                        </h6>
                                        <h6 className="flighttime">
                                          {moment(
                                            item.directions[1][
                                              index === 0
                                                ? two[0]
                                                : index === 1
                                                ? two[1]
                                                : two[2]
                                            ].segments[0].departure
                                          ).format("DD MMM,yyyy, ddd")}
                                        </h6>
                                        <h6 className="flighttime">
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                item.directions[1][
                                                  index === 0
                                                    ? two[0]
                                                    : index === 1
                                                    ? two[1]
                                                    : two[2]
                                                ].from
                                            )
                                            .map((item) => item.city)}
                                        </h6>
                                      </div>
                                      <div className="col-lg-4 my-auto">
                                        <div className="row lh-1">
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color font-size">
                                              {item.directions[1][
                                                index === 0
                                                  ? two[0]
                                                  : index === 1
                                                  ? two[1]
                                                  : two[2]
                                              ].stops === 0
                                                ? "Direct"
                                                : item.directions[1][
                                                    index === 0
                                                      ? two[0]
                                                      : index === 1
                                                      ? two[1]
                                                      : two[2]
                                                  ].stops + " Stop"}
                                            </span>
                                          </div>
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color">
                                              <i class="fas fa-circle fa-xs"></i>
                                              ----------------------
                                              <i className="fas fa-plane fa-sm"></i>
                                            </span>
                                          </div>
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color">
                                              <i className="fas fa-clock fa-sm"></i>
                                              <span className="ms-1 font-size">
                                                {
                                                  item.directions[1][
                                                    index === 0
                                                      ? two[0]
                                                      : index === 1
                                                      ? two[1]
                                                      : two[2]
                                                  ].segments[0].duration[0]
                                                }
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-2 my-auto">
                                        <h6 className="fw-bold">
                                          <span className="fs-5">
                                            {
                                              item.directions[1][
                                                index === 0
                                                  ? two[0]
                                                  : index === 1
                                                  ? two[1]
                                                  : two[2]
                                              ].to
                                            }
                                          </span>
                                          <span className="ms-1 fs-5">
                                            {item.directions[1][
                                              index === 0
                                                ? two[0]
                                                : index === 1
                                                ? two[1]
                                                : two[2]
                                            ].segments[
                                              item.directions[1][
                                                index === 0
                                                  ? two[0]
                                                  : index === 1
                                                  ? two[1]
                                                  : two[2]
                                              ].segments.length - 1
                                            ].arrival.substr(11, 5)}
                                          </span>

                                          <sup>
                                            &nbsp;
                                            {dayCount(
                                              item.directions[1][
                                                index === 0
                                                  ? two[0]
                                                  : index === 1
                                                  ? two[1]
                                                  : two[2]
                                              ].segments[
                                                item.directions[1][
                                                  index === 0
                                                    ? two[0]
                                                    : index === 1
                                                    ? two[1]
                                                    : two[2]
                                                ].segments.length - 1
                                              ].arrival,
                                              item.directions[1][
                                                index === 0
                                                  ? two[0]
                                                  : index === 1
                                                  ? two[1]
                                                  : two[2]
                                              ].segments[0]?.departure
                                            ) !== 0 ? (
                                              <span
                                                className="text-danger"
                                                style={{ fontSize: "8px" }}
                                              >
                                                +
                                                {dayCount(
                                                  item.directions[1][
                                                    index === 0
                                                      ? two[0]
                                                      : index === 1
                                                      ? two[1]
                                                      : two[2]
                                                  ].segments[
                                                    item.directions[1][
                                                      index === 0
                                                        ? two[0]
                                                        : index === 1
                                                        ? two[1]
                                                        : two[2]
                                                    ].segments.length - 1
                                                  ].arrival,
                                                  item.directions[1][
                                                    index === 0
                                                      ? two[0]
                                                      : index === 1
                                                      ? two[1]
                                                      : two[2]
                                                  ].segments[0]?.departure
                                                )}
                                              </span>
                                            ) : (
                                              ""
                                            )}{" "}
                                          </sup>
                                        </h6>
                                        <h6 className="flighttime">
                                          {moment(
                                            item.directions[1][
                                              index === 0
                                                ? two[0]
                                                : index === 1
                                                ? two[1]
                                                : two[2]
                                            ].segments[
                                              item.directions[1][
                                                index === 0
                                                  ? two[0]
                                                  : index === 1
                                                  ? two[1]
                                                  : two[2]
                                              ].segments.length - 1
                                            ].arrival
                                          ).format("DD MMM,yyyy, ddd")}
                                        </h6>
                                        <h6 className="flighttime">
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                item.directions[1][
                                                  index === 0
                                                    ? two[0]
                                                    : index === 1
                                                    ? two[1]
                                                    : two[2]
                                                ].to
                                            )
                                            .map((item) => item.city)}
                                        </h6>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {item.directions[2] !== undefined ? (
                                  <>
                                    <div className="row p-2 text-color border-top">
                                      <div className="col-lg-1 my-auto">
                                        <img
                                          src={
                                            environment.s3ArliensImage +
                                            `${
                                              item.directions[2][
                                                index === 0
                                                  ? three[0]
                                                  : index === 1
                                                  ? three[1]
                                                  : three[2]
                                              ].platingCarrierCode
                                            }.png`
                                          }
                                          alt=""
                                          width="40px"
                                          height="40px"
                                        />
                                      </div>
                                      <div
                                        className="col-lg-3 my-auto text-center"
                                        style={{ fontSize: "14px" }}
                                      >
                                        <p className="my-auto">
                                          {
                                            item.directions[2][
                                              index === 0
                                                ? three[0]
                                                : index === 1
                                                ? three[1]
                                                : three[2]
                                            ].platingCarrierName
                                          }
                                        </p>
                                        <p className="my-auto">
                                          {
                                            item.directions[2][
                                              index === 0
                                                ? three[0]
                                                : index === 1
                                                ? three[1]
                                                : three[2]
                                            ].segments[0].details[0].equipment
                                          }
                                        </p>
                                        <p>
                                          {
                                            item.directions[2][
                                              index === 0
                                                ? three[0]
                                                : index === 1
                                                ? three[1]
                                                : three[2]
                                            ].platingCarrierCode
                                          }{" "}
                                          -{" "}
                                          {
                                            item.directions[2][
                                              index === 0
                                                ? three[0]
                                                : index === 1
                                                ? three[1]
                                                : three[2]
                                            ].segments[0].flightNumber
                                          }
                                        </p>
                                      </div>
                                      <div className="col-lg-2 my-auto">
                                        <h6 className="fw-bold">
                                          <span className="fs-5">
                                            {
                                              item.directions[2][
                                                index === 0
                                                  ? three[0]
                                                  : index === 1
                                                  ? three[1]
                                                  : three[2]
                                              ].from
                                            }
                                          </span>
                                          <span className="ms-1 fs-5">
                                            {item.directions[2][
                                              index === 0
                                                ? three[0]
                                                : index === 1
                                                ? three[1]
                                                : three[2]
                                            ].segments[0].departure.substr(
                                              11,
                                              5
                                            )}
                                          </span>
                                        </h6>
                                        <h6 className="flighttime">
                                          {moment(
                                            item.directions[2][
                                              index === 0
                                                ? three[0]
                                                : index === 1
                                                ? three[1]
                                                : three[2]
                                            ].segments[0].departure
                                          ).format("DD MMM,yyyy, ddd")}
                                        </h6>
                                        <h6 className="flighttime">
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                item.directions[2][
                                                  index === 0
                                                    ? three[0]
                                                    : index === 1
                                                    ? three[1]
                                                    : three[2]
                                                ].from
                                            )
                                            .map((item) => item.city)}
                                        </h6>
                                      </div>
                                      <div className="col-lg-4 my-auto">
                                        <div className="row lh-1">
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color font-size">
                                              {item.directions[2][
                                                index === 0
                                                  ? three[0]
                                                  : index === 1
                                                  ? three[1]
                                                  : three[2]
                                              ].stops === 0
                                                ? "Direct"
                                                : item.directions[2][
                                                    index === 0
                                                      ? three[0]
                                                      : index === 1
                                                      ? three[1]
                                                      : three[2]
                                                  ].stops + " Stop"}
                                            </span>
                                          </div>
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color">
                                              <i class="fas fa-circle fa-xs"></i>
                                              ----------------------
                                              <i className="fas fa-plane fa-sm"></i>
                                            </span>
                                          </div>
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color">
                                              <i className="fas fa-clock fa-sm"></i>
                                              <span className="ms-1 font-size">
                                                {
                                                  item.directions[2][
                                                    index === 0
                                                      ? three[0]
                                                      : index === 1
                                                      ? three[1]
                                                      : three[2]
                                                  ].segments[0].duration[0]
                                                }
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-2 my-auto">
                                        <h6 className="fw-bold">
                                          <span className="fs-5">
                                            {
                                              item.directions[2][
                                                index === 0
                                                  ? three[0]
                                                  : index === 1
                                                  ? three[1]
                                                  : three[2]
                                              ].to
                                            }
                                          </span>
                                          <span className="ms-1 fs-5">
                                            {item.directions[2][
                                              index === 0
                                                ? three[0]
                                                : index === 1
                                                ? three[1]
                                                : three[2]
                                            ].segments[
                                              item.directions[2][
                                                index === 0
                                                  ? three[0]
                                                  : index === 1
                                                  ? three[1]
                                                  : three[2]
                                              ].segments.length - 1
                                            ].arrival.substr(11, 5)}
                                          </span>

                                          <sup>
                                            &nbsp;
                                            {dayCount(
                                              item.directions[2][
                                                index === 0
                                                  ? three[0]
                                                  : index === 1
                                                  ? three[1]
                                                  : three[2]
                                              ].segments[
                                                item.directions[2][
                                                  index === 0
                                                    ? three[0]
                                                    : index === 1
                                                    ? three[1]
                                                    : three[2]
                                                ].segments.length - 1
                                              ].arrival,
                                              item.directions[2][
                                                index === 0
                                                  ? three[0]
                                                  : index === 1
                                                  ? three[1]
                                                  : three[2]
                                              ].segments[0]?.departure
                                            ) !== 0 ? (
                                              <span
                                                className="text-danger"
                                                style={{ fontSize: "8px" }}
                                              >
                                                +
                                                {dayCount(
                                                  item.directions[2][
                                                    index === 0
                                                      ? three[0]
                                                      : index === 1
                                                      ? three[1]
                                                      : three[2]
                                                  ].segments[
                                                    item.directions[2][
                                                      index === 0
                                                        ? three[0]
                                                        : index === 1
                                                        ? three[1]
                                                        : three[2]
                                                    ].segments.length - 1
                                                  ].arrival,
                                                  item.directions[2][
                                                    index === 0
                                                      ? three[0]
                                                      : index === 1
                                                      ? three[1]
                                                      : three[2]
                                                  ].segments[0]?.departure
                                                )}
                                              </span>
                                            ) : (
                                              ""
                                            )}{" "}
                                          </sup>
                                        </h6>
                                        <h6 className="flighttime">
                                          {moment(
                                            item.directions[2][
                                              index === 0
                                                ? three[0]
                                                : index === 1
                                                ? three[1]
                                                : three[2]
                                            ].segments[
                                              item.directions[2][
                                                index === 0
                                                  ? three[0]
                                                  : index === 1
                                                  ? three[1]
                                                  : three[2]
                                              ].segments.length - 1
                                            ].arrival
                                          ).format("DD MMM,yyyy, ddd")}
                                        </h6>
                                        <h6 className="flighttime">
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                item.directions[2][
                                                  index === 0
                                                    ? three[0]
                                                    : index === 1
                                                    ? three[1]
                                                    : three[2]
                                                ].to
                                            )
                                            .map((item) => item.city)}
                                        </h6>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {item.directions[3] !== undefined ? (
                                  <>
                                    <div className="row p-2 text-color border-top">
                                      <div className="col-lg-1 my-auto">
                                        <img
                                          src={
                                            environment.s3ArliensImage +
                                            `${
                                              item.directions[3][
                                                index === 0
                                                  ? four[0]
                                                  : index === 1
                                                  ? four[1]
                                                  : four[2]
                                              ].platingCarrierCode
                                            }.png`
                                          }
                                          alt=""
                                          width="40px"
                                          height="40px"
                                        />
                                      </div>
                                      <div
                                        className="col-lg-3 my-auto text-center"
                                        style={{ fontSize: "14px" }}
                                      >
                                        <p className="my-auto">
                                          {
                                            item.directions[3][
                                              index === 0
                                                ? four[0]
                                                : index === 1
                                                ? four[1]
                                                : four[2]
                                            ].platingCarrierName
                                          }
                                        </p>
                                        <p className="my-auto">
                                          {
                                            item.directions[3][
                                              index === 0
                                                ? four[0]
                                                : index === 1
                                                ? four[1]
                                                : four[2]
                                            ].segments[0].details[0].equipment
                                          }
                                        </p>
                                        <p>
                                          {
                                            item.directions[3][
                                              index === 0
                                                ? four[0]
                                                : index === 1
                                                ? four[1]
                                                : four[2]
                                            ].platingCarrierCode
                                          }{" "}
                                          -{" "}
                                          {
                                            item.directions[3][
                                              index === 0
                                                ? four[0]
                                                : index === 1
                                                ? four[1]
                                                : four[2]
                                            ].segments[0].flightNumber
                                          }
                                        </p>
                                      </div>
                                      <div className="col-lg-2 my-auto">
                                        <h6 className="fw-bold">
                                          <span className="fs-5">
                                            {
                                              item.directions[3][
                                                index === 0
                                                  ? four[0]
                                                  : index === 1
                                                  ? four[1]
                                                  : four[2]
                                              ].from
                                            }
                                          </span>
                                          <span className="ms-1 fs-5">
                                            {item.directions[3][
                                              index === 0
                                                ? four[0]
                                                : index === 1
                                                ? four[1]
                                                : four[2]
                                            ].segments[0].departure.substr(
                                              11,
                                              5
                                            )}
                                          </span>
                                        </h6>
                                        <h6 className="flighttime">
                                          {moment(
                                            item.directions[3][
                                              index === 0
                                                ? four[0]
                                                : index === 1
                                                ? four[1]
                                                : four[2]
                                            ].segments[0].departure
                                          ).format("DD MMM,yyyy, ddd")}
                                        </h6>
                                        <h6 className="flighttime">
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                item.directions[3][
                                                  index === 0
                                                    ? four[0]
                                                    : index === 1
                                                    ? four[1]
                                                    : four[2]
                                                ].from
                                            )
                                            .map((item) => item.city)}
                                        </h6>
                                      </div>
                                      <div className="col-lg-4 my-auto">
                                        <div className="row lh-1">
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color font-size">
                                              {item.directions[3][
                                                index === 0
                                                  ? four[0]
                                                  : index === 1
                                                  ? four[1]
                                                  : four[2]
                                              ].stops === 0
                                                ? "Direct"
                                                : item.directions[3][
                                                    index === 0
                                                      ? four[0]
                                                      : index === 1
                                                      ? four[1]
                                                      : four[2]
                                                  ].stops + " Stop"}
                                            </span>
                                          </div>
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color">
                                              <i class="fas fa-circle fa-xs"></i>
                                              ----------------------
                                              <i className="fas fa-plane fa-sm"></i>
                                            </span>
                                          </div>
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color">
                                              <i className="fas fa-clock fa-sm"></i>
                                              <span className="ms-1 font-size">
                                                {
                                                  item.directions[3][
                                                    index === 0
                                                      ? four[0]
                                                      : index === 1
                                                      ? four[1]
                                                      : four[2]
                                                  ].segments[0].duration[0]
                                                }
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-2 my-auto">
                                        <h6 className="fw-bold">
                                          <span className="fs-5">
                                            {
                                              item.directions[3][
                                                index === 0
                                                  ? four[0]
                                                  : index === 1
                                                  ? four[1]
                                                  : four[2]
                                              ].to
                                            }
                                          </span>
                                          <span className="ms-1 fs-5">
                                            {item.directions[3][
                                              index === 0
                                                ? four[0]
                                                : index === 1
                                                ? four[1]
                                                : four[2]
                                            ].segments[
                                              item.directions[3][
                                                index === 0
                                                  ? four[0]
                                                  : index === 1
                                                  ? four[1]
                                                  : four[2]
                                              ].segments.length - 1
                                            ].arrival.substr(11, 5)}
                                          </span>

                                          <sup>
                                            &nbsp;
                                            {dayCount(
                                              item.directions[3][
                                                index === 0
                                                  ? four[0]
                                                  : index === 1
                                                  ? four[1]
                                                  : four[2]
                                              ].segments[
                                                item.directions[3][
                                                  index === 0
                                                    ? four[0]
                                                    : index === 1
                                                    ? four[1]
                                                    : four[2]
                                                ].segments.length - 1
                                              ].arrival,
                                              item.directions[3][
                                                index === 0
                                                  ? four[0]
                                                  : index === 1
                                                  ? four[1]
                                                  : four[2]
                                              ].segments[0]?.departure
                                            ) !== 0 ? (
                                              <span
                                                className="text-danger"
                                                style={{ fontSize: "8px" }}
                                              >
                                                +
                                                {dayCount(
                                                  item.directions[3][
                                                    index === 0
                                                      ? four[0]
                                                      : index === 1
                                                      ? four[1]
                                                      : four[2]
                                                  ].segments[
                                                    item.directions[3][
                                                      index === 0
                                                        ? four[0]
                                                        : index === 1
                                                        ? four[1]
                                                        : four[2]
                                                    ].segments.length - 1
                                                  ].arrival,
                                                  item.directions[3][
                                                    index === 0
                                                      ? four[0]
                                                      : index === 1
                                                      ? four[1]
                                                      : four[2]
                                                  ].segments[0]?.departure
                                                )}
                                              </span>
                                            ) : (
                                              ""
                                            )}{" "}
                                          </sup>
                                        </h6>
                                        <h6 className="flighttime">
                                          {moment(
                                            item.directions[3][
                                              index === 0
                                                ? four[0]
                                                : index === 1
                                                ? four[1]
                                                : four[2]
                                            ].segments[
                                              item.directions[3][
                                                index === 0
                                                  ? four[0]
                                                  : index === 1
                                                  ? four[1]
                                                  : four[2]
                                              ].segments.length - 1
                                            ].arrival
                                          ).format("DD MMM,yyyy, ddd")}
                                        </h6>
                                        <h6 className="flighttime">
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                item.directions[3][
                                                  index === 0
                                                    ? four[0]
                                                    : index === 1
                                                    ? four[1]
                                                    : four[2]
                                                ].to
                                            )
                                            .map((item) => item.city)}
                                        </h6>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {item.directions[4] !== undefined ? (
                                  <>
                                    <div className="row p-2 text-color border-top">
                                      <div className="col-lg-1 my-auto">
                                        <img
                                          src={
                                            environment.s3ArliensImage +
                                            `${
                                              item.directions[4][
                                                index === 0
                                                  ? five[0]
                                                  : index === 1
                                                  ? five[1]
                                                  : five[2]
                                              ].platingCarrierCode
                                            }.png`
                                          }
                                          alt=""
                                          width="40px"
                                          height="40px"
                                        />
                                      </div>
                                      <div
                                        className="col-lg-3 my-auto text-center"
                                        style={{ fontSize: "14px" }}
                                      >
                                        <p className="my-auto">
                                          {
                                            item.directions[4][
                                              index === 0
                                                ? five[0]
                                                : index === 1
                                                ? five[1]
                                                : five[2]
                                            ].platingCarrierName
                                          }
                                        </p>
                                        <p className="my-auto">
                                          {
                                            item.directions[4][
                                              index === 0
                                                ? five[0]
                                                : index === 1
                                                ? five[1]
                                                : five[2]
                                            ].segments[0].details[0].equipment
                                          }
                                        </p>
                                        <p>
                                          {
                                            item.directions[4][
                                              index === 0
                                                ? five[0]
                                                : index === 1
                                                ? five[1]
                                                : five[2]
                                            ].platingCarrierCode
                                          }{" "}
                                          -{" "}
                                          {
                                            item.directions[4][
                                              index === 0
                                                ? five[0]
                                                : index === 1
                                                ? five[1]
                                                : five[2]
                                            ].segments[0].flightNumber
                                          }
                                        </p>
                                      </div>
                                      <div className="col-lg-2 my-auto">
                                        <h6 className="fw-bold">
                                          <span className="fs-5">
                                            {
                                              item.directions[4][
                                                index === 0
                                                  ? five[0]
                                                  : index === 1
                                                  ? five[1]
                                                  : five[2]
                                              ].from
                                            }
                                          </span>
                                          <span className="ms-1 fs-5">
                                            {item.directions[4][
                                              index === 0
                                                ? five[0]
                                                : index === 1
                                                ? five[1]
                                                : five[2]
                                            ].segments[0].departure.substr(
                                              11,
                                              5
                                            )}
                                          </span>
                                          {/* {directions[0][index===0?one[0]:index===1?one[1]:one[2]].segments[0].departure.substr(11, 5)} */}
                                        </h6>
                                        <h6 className="flighttime">
                                          {moment(
                                            item.directions[4][
                                              index === 0
                                                ? five[0]
                                                : index === 1
                                                ? five[1]
                                                : five[2]
                                            ].segments[0].departure
                                          ).format("DD MMM,yyyy, ddd")}
                                        </h6>
                                        <h6 className="flighttime">
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                item.directions[4][
                                                  index === 0
                                                    ? five[0]
                                                    : index === 1
                                                    ? five[1]
                                                    : five[2]
                                                ].from
                                            )
                                            .map((item) => item.city)}
                                        </h6>
                                        {/* <p className="my-auto">{directions[0][index===0?one[0]:index===1?one[1]:one[2]].from}</p> */}
                                      </div>
                                      <div className="col-lg-4 my-auto">
                                        <div className="row lh-1">
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color font-size">
                                              {item.directions[4][
                                                index === 0
                                                  ? five[0]
                                                  : index === 1
                                                  ? five[1]
                                                  : five[2]
                                              ].stops === 0
                                                ? "Direct"
                                                : item.directions[4][
                                                    index === 0
                                                      ? five[0]
                                                      : index === 1
                                                      ? five[1]
                                                      : five[2]
                                                  ].stops + " Stop"}
                                            </span>
                                          </div>
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color">
                                              <i class="fas fa-circle fa-xs"></i>
                                              ----------------------
                                              <i className="fas fa-plane fa-sm"></i>
                                            </span>
                                          </div>
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color">
                                              <i className="fas fa-clock fa-sm"></i>
                                              <span className="ms-1 font-size">
                                                {
                                                  item.directions[4][
                                                    index === 0
                                                      ? five[0]
                                                      : index === 1
                                                      ? five[1]
                                                      : five[2]
                                                  ].segments[0].duration[0]
                                                }
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-2 my-auto">
                                        <h6 className="fw-bold">
                                          <span className="fs-5">
                                            {
                                              item.directions[4][
                                                index === 0
                                                  ? five[0]
                                                  : index === 1
                                                  ? five[1]
                                                  : five[2]
                                              ].to
                                            }
                                          </span>
                                          <span className="ms-1 fs-5">
                                            {item.directions[4][
                                              index === 0
                                                ? five[0]
                                                : index === 1
                                                ? five[1]
                                                : five[2]
                                            ].segments[
                                              item.directions[4][
                                                index === 0
                                                  ? five[0]
                                                  : index === 1
                                                  ? five[1]
                                                  : five[2]
                                              ].segments.length - 1
                                            ].arrival.substr(11, 5)}
                                          </span>

                                          <sup>
                                            &nbsp;
                                            {dayCount(
                                              item.directions[4][
                                                index === 0
                                                  ? five[0]
                                                  : index === 1
                                                  ? five[1]
                                                  : five[2]
                                              ].segments[
                                                item.directions[4][
                                                  index === 0
                                                    ? five[0]
                                                    : index === 1
                                                    ? five[1]
                                                    : five[2]
                                                ].segments.length - 1
                                              ].arrival,
                                              item.directions[4][
                                                index === 0
                                                  ? five[0]
                                                  : index === 1
                                                  ? five[1]
                                                  : five[2]
                                              ].segments[0]?.departure
                                            ) !== 0 ? (
                                              <span
                                                className="text-danger"
                                                style={{ fontSize: "8px" }}
                                              >
                                                +
                                                {dayCount(
                                                  item.directions[4][
                                                    index === 0
                                                      ? five[0]
                                                      : index === 1
                                                      ? five[1]
                                                      : five[2]
                                                  ].segments[
                                                    item.directions[4][
                                                      index === 0
                                                        ? five[0]
                                                        : index === 1
                                                        ? five[1]
                                                        : five[2]
                                                    ].segments.length - 1
                                                  ].arrival,
                                                  item.directions[4][
                                                    index === 0
                                                      ? five[0]
                                                      : index === 1
                                                      ? five[1]
                                                      : five[2]
                                                  ].segments[0]?.departure
                                                )}
                                              </span>
                                            ) : (
                                              ""
                                            )}{" "}
                                          </sup>
                                        </h6>
                                        <h6 className="flighttime">
                                          {moment(
                                            item.directions[4][
                                              index === 0
                                                ? five[0]
                                                : index === 1
                                                ? five[1]
                                                : five[2]
                                            ].segments[
                                              item.directions[4][
                                                index === 0
                                                  ? five[0]
                                                  : index === 1
                                                  ? five[1]
                                                  : five[2]
                                              ].segments.length - 1
                                            ].arrival
                                          ).format("DD MMM,yyyy, ddd")}
                                        </h6>
                                        <h6 className="flighttime">
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                item.directions[4][
                                                  index === 0
                                                    ? five[0]
                                                    : index === 1
                                                    ? five[1]
                                                    : five[2]
                                                ].to
                                            )
                                            .map((item) => item.city)}
                                        </h6>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {item.directions[5] !== undefined ? (
                                  <>
                                    <div className="row p-2 text-color border-top">
                                      <div className="col-lg-1 my-auto">
                                        <img
                                          src={
                                            environment.s3ArliensImage +
                                            `${
                                              item.directions[5][
                                                index === 0
                                                  ? six[0]
                                                  : index === 1
                                                  ? six[1]
                                                  : six[2]
                                              ].platingCarrierCode
                                            }.png`
                                          }
                                          alt=""
                                          width="40px"
                                          height="40px"
                                        />
                                      </div>
                                      <div
                                        className="col-lg-3 my-auto text-center"
                                        style={{ fontSize: "14px" }}
                                      >
                                        <p className="my-auto">
                                          {
                                            item.directions[5][
                                              index === 0
                                                ? six[0]
                                                : index === 1
                                                ? six[1]
                                                : six[2]
                                            ].platingCarrierName
                                          }
                                        </p>
                                        <p className="my-auto">
                                          {
                                            item.directions[5][
                                              index === 0
                                                ? six[0]
                                                : index === 1
                                                ? six[1]
                                                : six[2]
                                            ].segments[0].details[0].equipment
                                          }
                                        </p>
                                        <p>
                                          {
                                            item.directions[5][
                                              index === 0
                                                ? six[0]
                                                : index === 1
                                                ? six[1]
                                                : six[2]
                                            ].platingCarrierCode
                                          }{" "}
                                          -{" "}
                                          {
                                            item.directions[5][
                                              index === 0
                                                ? six[0]
                                                : index === 1
                                                ? six[1]
                                                : six[2]
                                            ].segments[0].flightNumber
                                          }
                                        </p>
                                      </div>
                                      <div className="col-lg-2 my-auto">
                                        <h6 className="fw-bold">
                                          <span className="fs-5">
                                            {
                                              item.directions[5][
                                                index === 0
                                                  ? six[0]
                                                  : index === 1
                                                  ? six[1]
                                                  : six[2]
                                              ].from
                                            }
                                          </span>
                                          <span className="ms-1 fs-5">
                                            {item.directions[5][
                                              index === 0
                                                ? six[0]
                                                : index === 1
                                                ? six[1]
                                                : six[2]
                                            ].segments[0].departure.substr(
                                              11,
                                              5
                                            )}
                                          </span>
                                          {/* {directions[0][index===0?one[0]:index===1?one[1]:one[2]].segments[0].departure.substr(11, 5)} */}
                                        </h6>
                                        <h6 className="flighttime">
                                          {moment(
                                            item.directions[5][
                                              index === 0
                                                ? six[0]
                                                : index === 1
                                                ? six[1]
                                                : six[2]
                                            ].segments[0].departure
                                          ).format("DD MMM,yyyy, ddd")}
                                        </h6>
                                        <h6 className="flighttime">
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                item.directions[5][
                                                  index === 0
                                                    ? six[0]
                                                    : index === 1
                                                    ? six[1]
                                                    : six[2]
                                                ].from
                                            )
                                            .map((item) => item.city)}
                                        </h6>
                                        {/* <p className="my-auto">{directions[0][index===0?one[0]:index===1?one[1]:one[2]].from}</p> */}
                                      </div>
                                      <div className="col-lg-4 my-auto">
                                        <div className="row lh-1">
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color font-size">
                                              {item.directions[5][
                                                index === 0
                                                  ? six[0]
                                                  : index === 1
                                                  ? six[1]
                                                  : six[2]
                                              ].stops === 0
                                                ? "Direct"
                                                : item.directions[5][
                                                    index === 0
                                                      ? six[0]
                                                      : index === 1
                                                      ? six[1]
                                                      : six[2]
                                                  ].stops + " Stop"}
                                            </span>
                                          </div>
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color">
                                              <i class="fas fa-circle fa-xs"></i>
                                              ----------------------
                                              <i className="fas fa-plane fa-sm"></i>
                                            </span>
                                          </div>
                                          <div className="col-lg-12 text-center">
                                            <span className="text-color">
                                              <i className="fas fa-clock fa-sm"></i>
                                              <span className="ms-1 font-size">
                                                {
                                                  item.directions[5][
                                                    index === 0
                                                      ? six[0]
                                                      : index === 1
                                                      ? six[1]
                                                      : six[2]
                                                  ].segments[0].duration[0]
                                                }
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-2 my-auto">
                                        <h6 className="fw-bold">
                                          <span className="fs-5">
                                            {
                                              item.directions[5][
                                                index === 0
                                                  ? six[0]
                                                  : index === 1
                                                  ? six[1]
                                                  : six[2]
                                              ].to
                                            }
                                          </span>
                                          <span className="ms-1 fs-5">
                                            {item.directions[5][
                                              index === 0
                                                ? six[0]
                                                : index === 1
                                                ? six[1]
                                                : six[2]
                                            ].segments[
                                              item.directions[5][
                                                index === 0
                                                  ? six[0]
                                                  : index === 1
                                                  ? six[1]
                                                  : six[2]
                                              ].segments.length - 1
                                            ].arrival.substr(11, 5)}
                                          </span>

                                          <sup>
                                            &nbsp;
                                            {dayCount(
                                              item.directions[5][
                                                index === 0
                                                  ? six[0]
                                                  : index === 1
                                                  ? six[1]
                                                  : six[2]
                                              ].segments[
                                                item.directions[5][
                                                  index === 0
                                                    ? six[0]
                                                    : index === 1
                                                    ? six[1]
                                                    : six[2]
                                                ].segments.length - 1
                                              ].arrival,
                                              item.directions[5][
                                                index === 0
                                                  ? six[0]
                                                  : index === 1
                                                  ? six[1]
                                                  : six[2]
                                              ].segments[0]?.departure
                                            ) !== 0 ? (
                                              <span
                                                className="text-danger"
                                                style={{ fontSize: "8px" }}
                                              >
                                                +
                                                {dayCount(
                                                  item.directions[5][
                                                    index === 0
                                                      ? six[0]
                                                      : index === 1
                                                      ? six[1]
                                                      : six[2]
                                                  ].segments[
                                                    item.directions[5][
                                                      index === 0
                                                        ? six[0]
                                                        : index === 1
                                                        ? six[1]
                                                        : six[2]
                                                    ].segments.length - 1
                                                  ].arrival,
                                                  item.directions[5][
                                                    index === 0
                                                      ? six[0]
                                                      : index === 1
                                                      ? six[1]
                                                      : six[2]
                                                  ].segments[0]?.departure
                                                )}
                                              </span>
                                            ) : (
                                              ""
                                            )}{" "}
                                          </sup>
                                        </h6>
                                        <h6 className="flighttime">
                                          {moment(
                                            item.directions[5][
                                              index === 0
                                                ? six[0]
                                                : index === 1
                                                ? six[1]
                                                : six[2]
                                            ].segments[
                                              item.directions[5][
                                                index === 0
                                                  ? six[0]
                                                  : index === 1
                                                  ? six[1]
                                                  : six[2]
                                              ].segments.length - 1
                                            ].arrival
                                          ).format("DD MMM,yyyy, ddd")}
                                        </h6>
                                        <h6 className="flighttime">
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                item.directions[5][
                                                  index === 0
                                                    ? six[0]
                                                    : index === 1
                                                    ? six[1]
                                                    : six[2]
                                                ].to
                                            )
                                            .map((item) => item.city)}
                                        </h6>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}

                                <div className="border-top py-2">
                                  {item.directions[0][
                                    index === 0
                                      ? one[0]
                                      : index === 1
                                      ? one[1]
                                      : one[2]
                                  ].segments[0].bookingCount ? (
                                    <>
                                      <span className="px-3 text-color font-size">
                                        <i class="fas fa-couch me-1"></i>
                                        <span className="me-1">Seats</span>
                                        {
                                          item.directions[0][
                                            index === 0
                                              ? one[0]
                                              : index === 1
                                              ? one[1]
                                              : one[2]
                                          ].segments[0].bookingCount
                                        }{" "}
                                      </span>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {item.directions[0][
                                    index === 0
                                      ? one[0]
                                      : index === 1
                                      ? one[1]
                                      : one[2]
                                  ].segments[0].bookingClass ? (
                                    <>
                                      <span className="px-3 text-color font-size">
                                        <i class="fas fa-couch me-1"></i>
                                        <span className="me-1">
                                          Booking Class
                                        </span>
                                        (
                                        {
                                          item.directions[0][
                                            index === 0
                                              ? one[0]
                                              : index === 1
                                              ? one[1]
                                              : one[2]
                                          ].segments[0].bookingClass
                                        }
                                        ){" "}
                                      </span>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  {item.directions[0][
                                    index === 0
                                      ? one[0]
                                      : index === 1
                                      ? one[1]
                                      : one[2]
                                  ].segments ? (
                                    <>
                                      <Popover>
                                        <PopoverTrigger>
                                          <span
                                            className="pe-3 text-color font-size"
                                            style={{ cursor: "pointer" }}
                                          >
                                            <i className="fas fa-book me-1"></i>
                                            <span className="me-1">
                                              Checked CabinClass
                                            </span>
                                          </span>
                                        </PopoverTrigger>
                                        <Portal>
                                          <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverHeader>
                                              Class Information
                                            </PopoverHeader>
                                            <PopoverCloseButton />
                                            <PopoverBody>
                                              <div>
                                                <table
                                                  className="table table-bordered table-sm"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  <thead className="text-center thead text-white fw-bold">
                                                    <tr>
                                                      <th>Route</th>
                                                      <th>Cabin Class</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody className="text-center ">
                                                    {item.brandedFareIdx ===
                                                    null ? (
                                                      <>
                                                        {item.directions[0][
                                                          index === 0
                                                            ? one[0]
                                                            : index === 1
                                                            ? one[1]
                                                            : one[2]
                                                        ].segments?.map(
                                                          (item, idx) => {
                                                            return (
                                                              <tr key={idx}>
                                                                <td className="left align-middle">
                                                                  {item.from}-
                                                                  {item.to}
                                                                </td>
                                                                <td>
                                                                  <span className="left">
                                                                    <span className="ms-1 font-size">
                                                                      {item?.cabinClass
                                                                        ? item?.cabinClass
                                                                        : item.serviceClass}
                                                                    </span>
                                                                  </span>
                                                                </td>
                                                              </tr>
                                                            );
                                                          }
                                                        )}

                                                        {item.directions[1] !==
                                                        undefined ? (
                                                          <>
                                                            {item.directions[1][
                                                              index === 0
                                                                ? two[0]
                                                                : index === 1
                                                                ? two[1]
                                                                : two[2]
                                                            ].segments?.map(
                                                              (item, idx) => {
                                                                return (
                                                                  <tr key={idx}>
                                                                    <td className="left align-middle">
                                                                      {
                                                                        item.from
                                                                      }
                                                                      -{item.to}
                                                                    </td>
                                                                    <td>
                                                                      <span className="left">
                                                                        <span className="ms-1 font-size">
                                                                          {item?.cabinClass
                                                                            ? item?.cabinClass
                                                                            : item.serviceClass}
                                                                        </span>
                                                                      </span>
                                                                    </td>
                                                                  </tr>
                                                                );
                                                              }
                                                            )}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}

                                                        {item.directions[2] !==
                                                        undefined ? (
                                                          <>
                                                            {item.directions[2][
                                                              index === 0
                                                                ? three[0]
                                                                : index === 1
                                                                ? three[1]
                                                                : three[2]
                                                            ].segments?.map(
                                                              (item, idx) => {
                                                                return (
                                                                  <tr key={idx}>
                                                                    <td className="left align-middle">
                                                                      {
                                                                        item.from
                                                                      }
                                                                      -{item.to}
                                                                    </td>
                                                                    <td>
                                                                      <span className="left">
                                                                        <span className="ms-1 font-size">
                                                                          {item?.cabinClass
                                                                            ? item?.cabinClass
                                                                            : item.serviceClass}
                                                                        </span>
                                                                      </span>
                                                                    </td>
                                                                  </tr>
                                                                );
                                                              }
                                                            )}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                        {item.directions[3] !==
                                                        undefined ? (
                                                          <>
                                                            {item.directions[3][
                                                              index === 0
                                                                ? four[0]
                                                                : index === 1
                                                                ? four[1]
                                                                : four[2]
                                                            ].segments?.map(
                                                              (item, idx) => {
                                                                return (
                                                                  <tr key={idx}>
                                                                    <td className="left align-middle">
                                                                      {
                                                                        item.from
                                                                      }
                                                                      -{item.to}
                                                                    </td>
                                                                    <td>
                                                                      <span className="left">
                                                                        <span className="ms-1 font-size">
                                                                          {item?.cabinClass
                                                                            ? item?.cabinClass
                                                                            : item.serviceClass}
                                                                        </span>
                                                                      </span>
                                                                    </td>
                                                                  </tr>
                                                                );
                                                              }
                                                            )}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}

                                                        {item.directions[4] !==
                                                        undefined ? (
                                                          <>
                                                            {item.directions[4][
                                                              index === 0
                                                                ? five[0]
                                                                : index === 1
                                                                ? five[1]
                                                                : five[2]
                                                            ].segments?.map(
                                                              (item, idx) => {
                                                                return (
                                                                  <tr key={idx}>
                                                                    <td className="left align-middle">
                                                                      {
                                                                        item.from
                                                                      }
                                                                      -{item.to}
                                                                    </td>
                                                                    <td>
                                                                      <span className="left">
                                                                        <span className="ms-1 font-size">
                                                                          {item?.cabinClass
                                                                            ? item?.cabinClass
                                                                            : item.serviceClass}
                                                                        </span>
                                                                      </span>
                                                                    </td>
                                                                  </tr>
                                                                );
                                                              }
                                                            )}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}

                                                        {item.directions[5] !==
                                                        undefined ? (
                                                          <>
                                                            {item.directions[5][
                                                              index === 0
                                                                ? six[0]
                                                                : index === 1
                                                                ? six[1]
                                                                : six[2]
                                                            ].segments?.map(
                                                              (item, idx) => {
                                                                return (
                                                                  <tr key={idx}>
                                                                    <td className="left align-middle">
                                                                      {
                                                                        item.from
                                                                      }
                                                                      -{item.to}
                                                                    </td>
                                                                    <td>
                                                                      <span className="left">
                                                                        <span className="ms-1 font-size">
                                                                          {item?.cabinClass
                                                                            ? item?.cabinClass
                                                                            : item.serviceClass}
                                                                        </span>
                                                                      </span>
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
                                                    ) : (
                                                      <>
                                                        {item.brandedFares[
                                                          item.brandedFareIdx
                                                        ].cabinClasses &&
                                                          Object.keys(
                                                            item.brandedFares[
                                                              item
                                                                .brandedFareIdx
                                                            ].cabinClasses
                                                          )?.map(
                                                            (innerKey, idx) => (
                                                              <tr key={idx}>
                                                                <td className="left align-middle">
                                                                  {innerKey}
                                                                </td>
                                                                <td>
                                                                  {item
                                                                    .brandedFares[
                                                                    item
                                                                      .brandedFareIdx
                                                                  ]
                                                                    .cabinClasses[
                                                                    innerKey
                                                                  ] === ""
                                                                    ? searchData?.travelClass
                                                                    : item
                                                                        .brandedFares[
                                                                        item
                                                                          .brandedFareIdx
                                                                      ]
                                                                        .cabinClasses[
                                                                        innerKey
                                                                      ]}
                                                                </td>
                                                              </tr>
                                                            )
                                                          )}
                                                      </>
                                                    )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </PopoverBody>
                                          </PopoverContent>
                                        </Portal>
                                      </Popover>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {item.bookable === false && (
                                    <span className="pe-3 text-color font-size">
                                      <span className="text-danger">
                                        <i
                                          class="fa fa-star"
                                          aria-hidden="true"
                                        ></i>
                                      </span>{" "}
                                      Instant Purchase Only
                                    </span>
                                  )}
                                  <span className="text-color float-end">
                                    {item.refundable === true ? (
                                      <>
                                        <span className="font-size">
                                          <span className="text-success">
                                            <i class="fas fa-circle fa-sm me-1"></i>
                                          </span>
                                          Refundable
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="font-size">
                                          <span className="text-danger">
                                            <i class="fas fa-circle fa-sm me-1"></i>
                                          </span>
                                          Non-Refundable
                                        </span>
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="col-lg-2 my-auto text-center">
                                <h5 className="text-color d-flex justify-content-center align-items-center">
                                  {currency !== undefined ? currency : "AED"}
                                  &nbsp;
                                  {grossFare ? (
                                    <>
                                      {item.brandedFareIdx === null ? (
                                        <span id={"balance" + index}>
                                          {item.passengerFares.adt !== null &&
                                          item.passengerFares.chd === null &&
                                          item.passengerFares.cnn === null &&
                                          item.passengerFares.inf === null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice -
                                                  item.passengerFares.adt
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd !==
                                                null &&
                                              item.passengerFares.cnn ===
                                                null &&
                                              item.passengerFares.inf === null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice -
                                                  item.passengerFares.adt
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.chd
                                                  .totalPrice -
                                                  item.passengerFares.chd
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd !==
                                                null &&
                                              item.passengerFares.cnn ===
                                                null &&
                                              item.passengerFares.inf !== null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice -
                                                  item.passengerFares.adt
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.chd
                                                  .totalPrice -
                                                  item.passengerFares.chd
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                (item.passengerFares.inf
                                                  .totalPrice -
                                                  item.passengerFares.inf
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd !==
                                                null &&
                                              item.passengerFares.cnn !==
                                                null &&
                                              item.passengerFares.inf === null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice -
                                                  item.passengerFares.adt
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.chd
                                                  .totalPrice -
                                                  item.passengerFares.chd
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                (item.passengerFares.cnn
                                                  .totalPrice -
                                                  item.passengerFares.cnn
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd !==
                                                null &&
                                              item.passengerFares.cnn !==
                                                null &&
                                              item.passengerFares.inf !== null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice -
                                                  item.passengerFares.adt
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.chd
                                                  .totalPrice -
                                                  item.passengerFares.chd
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                (item.passengerFares.cnn
                                                  .totalPrice -
                                                  item.passengerFares.cnn
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                (item.passengerFares.inf
                                                  .totalPrice -
                                                  item.passengerFares.inf
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd ===
                                                null &&
                                              item.passengerFares.cnn !==
                                                null &&
                                              item.passengerFares.inf === null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice -
                                                  item.passengerFares.adt
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.cnn
                                                  .totalPrice -
                                                  item.passengerFares.cnn
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd ===
                                                null &&
                                              item.passengerFares.cnn !==
                                                null &&
                                              item.passengerFares.inf !== null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice -
                                                  item.passengerFares.adt
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.cnn
                                                  .totalPrice -
                                                  item.passengerFares.cnn
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                (item.passengerFares.inf
                                                  .totalPrice -
                                                  item.passengerFares.inf
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd ===
                                                null &&
                                              item.passengerFares.cnn == null &&
                                              item.passengerFares.inf !== null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice -
                                                  item.passengerFares.adt
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.inf
                                                  .totalPrice -
                                                  item.passengerFares.inf
                                                    .discountPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : 0}
                                        </span>
                                      ) : (
                                        <>
                                          {" "}
                                          <span id={"balance" + index}>
                                            {item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.adt !== null &&
                                            item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.chd === null &&
                                            item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.cnn === null &&
                                            item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.chd +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn ==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.inf
                                                      .discount +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : 0}
                                          </span>{" "}
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {item.brandedFareIdx === null ? (
                                        <span id={"balance" + index}>
                                          {item.passengerFares.adt !== null &&
                                          item.passengerFares.chd === null &&
                                          item.passengerFares.cnn === null &&
                                          item.passengerFares.inf === null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd !==
                                                null &&
                                              item.passengerFares.cnn ===
                                                null &&
                                              item.passengerFares.inf === null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.chd
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd !==
                                                null &&
                                              item.passengerFares.cnn ===
                                                null &&
                                              item.passengerFares.inf !== null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.chd
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                (item.passengerFares.inf
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd !==
                                                null &&
                                              item.passengerFares.cnn !==
                                                null &&
                                              item.passengerFares.inf === null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.chd
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                (item.passengerFares.cnn
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd !==
                                                null &&
                                              item.passengerFares.cnn !==
                                                null &&
                                              item.passengerFares.inf !== null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.chd
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                (item.passengerFares.cnn
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                (item.passengerFares.inf
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd ===
                                                null &&
                                              item.passengerFares.cnn !==
                                                null &&
                                              item.passengerFares.inf === null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.cnn
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd ===
                                                null &&
                                              item.passengerFares.cnn !==
                                                null &&
                                              item.passengerFares.inf !== null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.cnn
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                (item.passengerFares.inf
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : item.passengerFares.adt !==
                                                null &&
                                              item.passengerFares.chd ===
                                                null &&
                                              item.passengerFares.cnn == null &&
                                              item.passengerFares.inf !== null
                                            ? (
                                                (item.passengerFares.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.passengerFares.inf
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : 0}
                                        </span>
                                      ) : (
                                        <span id={"balance" + index}>
                                          {item.brandedFares[
                                            item.brandedFareIdx
                                          ].paxFareBreakDown.adt !== null &&
                                          item.brandedFares[item.brandedFareIdx]
                                            .paxFareBreakDown.chd === null &&
                                          item.brandedFares[item.brandedFareIdx]
                                            .paxFareBreakDown.cnn === null &&
                                          item.brandedFares[item.brandedFareIdx]
                                            .paxFareBreakDown.inf === null
                                            ? (
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt
                                              ).toFixed(2)
                                            : item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.adt !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.chd !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.cnn === null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.inf === null
                                            ? (
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd
                                              ).toFixed(2)
                                            : item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.adt !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.chd !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.cnn === null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.inf !== null
                                            ? (
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.adt !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.chd !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.cnn !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.inf === null
                                            ? (
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn
                                              ).toFixed(2)
                                            : item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.adt !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.chd !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.cnn !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.inf !== null
                                            ? (
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.chd +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.chd[index] *
                                                  item.passengerCounts.chd +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.adt !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.chd === null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.cnn !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.inf === null
                                            ? (
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn
                                              ).toFixed(2)
                                            : item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.adt !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.chd === null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.cnn !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.inf !== null
                                            ? (
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn
                                                  .totalFare +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.cnn +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf
                                                  .totalFare +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.cnn[index] *
                                                  item.passengerCounts.cnn +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.adt !== null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.chd === null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.cnn == null &&
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.inf !== null
                                            ? (
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt
                                                  .totalPrice +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.adt +
                                                (item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf
                                                  .totalFare +
                                                  addBalance -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )) *
                                                  item.passengerCounts.inf +
                                                sCharge.adt[index] *
                                                  item.passengerCounts.adt +
                                                sCharge.inf[index] *
                                                  item.passengerCounts.inf
                                              ).toFixed(2)
                                            : 0}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </h5>
                                {/* <h6
                                  className="text-end fw-bold text-color text-center"
                                  id={"priceDown" + index}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "12px",
                                  }}
                                >
                                  Price Breakdown
                                </h6> */}
                              </div>

                              <div
                                className="table-responsive-sm mt-1"
                                // id={"passengerBrackdown" + index}
                              >
                                <hr></hr>
                                <table
                                  className="table table-bordered px-3 table-sm"
                                  style={{ fontSize: "12px" }}
                                >
                                  <thead className="text-end button-color text-white fw-bold">
                                    <tr>
                                      <th className="text-center">Type</th>
                                      <th>Base</th>
                                      <th>Tax</th>
                                      {!grossFare && <th>Commission</th>}

                                      <th>AIT </th>
                                      <th>Pax</th>
                                      <th>Total Pax Fare</th>
                                      <th className="text-center">
                                        Edit Price
                                      </th>
                                      <th className="text-center">S/C</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-end">
                                    {item?.brandedFareIdx === null ? (
                                      <>
                                        {item.passengerFares.adt !== null ? (
                                          <>
                                            <tr>
                                              <td className="text-center">
                                                Adult
                                              </td>
                                              <td className="left">
                                                {(
                                                  item.passengerFares.adt
                                                    .basePrice +
                                                  parseInt(addBalance) -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )
                                                )?.toLocaleString("en-US")}
                                              </td>
                                              <td className="center">
                                                {item.passengerFares.adt.taxes}
                                              </td>
                                              {!grossFare && (
                                                <td className="right">
                                                  {
                                                    item.passengerFares.adt
                                                      .discountPrice
                                                  }
                                                </td>
                                              )}

                                              <td className="right">
                                                {item.passengerFares.adt.ait}
                                              </td>
                                              <td className="right">
                                                {item.passengerCounts.adt}
                                              </td>
                                              <td className="right fw-bold">
                                                {currency !== undefined
                                                  ? currency
                                                  : "AED"}{" "}
                                                {grossFare ? (
                                                  <>
                                                    {(
                                                      (item.passengerFares.adt
                                                        .totalPrice -
                                                        item.passengerFares.adt
                                                          .discountPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          adultPriceValue[index]
                                                        )) *
                                                        item.passengerCounts
                                                          .adt +
                                                      sCharge.adt[index] *
                                                        item.passengerCounts.adt
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                ) : (
                                                  <>
                                                    {(
                                                      (item.passengerFares.adt
                                                        .totalPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          adultPriceValue[index]
                                                        )) *
                                                        item.passengerCounts
                                                          .adt +
                                                      sCharge.adt[index] *
                                                        item.passengerCounts.adt
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                )}{" "}
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValue(
                                                      e.target.value,
                                                      index,
                                                      "adt"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValueForService(
                                                      e.target.value,
                                                      index,
                                                      "adt"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          </>
                                        ) : (
                                          <></>
                                        )}

                                        {item.passengerFares.chd !== null ? (
                                          <>
                                            <tr>
                                              <td className="text-center">
                                                Child &gt; 5
                                              </td>
                                              <td className="left">
                                                {(
                                                  item.passengerFares.chd
                                                    .basePrice +
                                                  parseInt(addBalance) -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )
                                                )?.toLocaleString("en-US")}
                                              </td>
                                              <td className="center">
                                                {item.passengerFares.chd.taxes}
                                              </td>
                                              {grossFare || (
                                                <td className="right">
                                                  {
                                                    item.passengerFares.chd
                                                      .discountPrice
                                                  }
                                                </td>
                                              )}

                                              <td className="right">
                                                {item.passengerFares.chd.ait}
                                              </td>
                                              <td className="right">
                                                {item.passengerCounts.chd}
                                              </td>
                                              <td className="right fw-bold">
                                                {currency !== undefined
                                                  ? currency
                                                  : "AED"}{" "}
                                                {grossFare ? (
                                                  <>
                                                    {(
                                                      (item.passengerFares.chd
                                                        .totalPrice -
                                                        item.passengerFares.chd
                                                          .discountPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          childBigPriceValue[
                                                            index
                                                          ]
                                                        )) *
                                                        item.passengerCounts
                                                          .chd +
                                                      sCharge.chd[index] *
                                                        item.passengerCounts.chd
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                ) : (
                                                  <>
                                                    {(
                                                      (item.passengerFares.chd
                                                        .totalPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          childBigPriceValue[
                                                            index
                                                          ]
                                                        )) *
                                                        item.passengerCounts
                                                          .chd +
                                                      sCharge.chd[index] *
                                                        item.passengerCounts.chd
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                )}{" "}
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValue(
                                                      e.target.value,
                                                      index,
                                                      "chd"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValueForService(
                                                      e.target.value,
                                                      index,
                                                      "chd"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          </>
                                        ) : (
                                          <></>
                                        )}

                                        {item.passengerFares.cnn !== null ? (
                                          <>
                                            <tr>
                                              <td className="text-center">
                                                Child{" "}
                                                {item.passengerFares.chd ===
                                                null ? (
                                                  <></>
                                                ) : (
                                                  <> &#60; 5</>
                                                )}
                                              </td>
                                              <td className="left">
                                                {item.passengerFares.cnn
                                                  .basePrice +
                                                  parseInt(addBalance) -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )}
                                              </td>
                                              <td className="center">
                                                {item.passengerFares.cnn.taxes}
                                              </td>
                                              {grossFare || (
                                                <td className="right">
                                                  {
                                                    item.passengerFares.cnn
                                                      .discountPrice
                                                  }
                                                </td>
                                              )}

                                              <td className="right">
                                                {item.passengerFares.cnn.ait}
                                              </td>
                                              <td className="right">
                                                {item.passengerCounts.cnn}
                                              </td>
                                              <td className="right fw-bold">
                                                {currency !== undefined
                                                  ? currency
                                                  : "AED"}{" "}
                                                {grossFare ? (
                                                  <>
                                                    {(
                                                      (item.passengerFares.cnn
                                                        .totalPrice -
                                                        item.passengerFares.cnn
                                                          .discountPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          childPriceValue[index]
                                                        )) *
                                                        item.passengerCounts
                                                          .cnn +
                                                      sCharge.cnn[index] *
                                                        item.passengerCounts.cnn
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                ) : (
                                                  <>
                                                    {(
                                                      (item.passengerFares.cnn
                                                        .totalPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          childPriceValue[index]
                                                        )) *
                                                        item.passengerCounts
                                                          .cnn +
                                                      sCharge.cnn[index] *
                                                        item.passengerCounts.cnn
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                )}{" "}
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValue(
                                                      e.target.value,
                                                      index,
                                                      "cnn"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValueForService(
                                                      e.target.value,
                                                      index,
                                                      "cnn"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          </>
                                        ) : (
                                          <></>
                                        )}

                                        {item.passengerFares.inf !== null ? (
                                          <>
                                            <tr>
                                              <td className="text-center">
                                                Infant
                                              </td>
                                              <td className="left">
                                                {(
                                                  item.passengerFares.inf
                                                    .basePrice +
                                                  parseInt(addBalance) -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )
                                                )?.toLocaleString("en-US")}
                                              </td>
                                              <td className="center">
                                                {item.passengerFares.inf.taxes}
                                              </td>
                                              {grossFare || (
                                                <td className="right">
                                                  {
                                                    item.passengerFares.inf
                                                      .discountPrice
                                                  }
                                                </td>
                                              )}

                                              <td className="right">
                                                {item.passengerFares.inf.ait}
                                              </td>
                                              <td className="right">
                                                {item.passengerCounts.inf}
                                              </td>
                                              <td className="right fw-bold">
                                                {currency !== undefined
                                                  ? currency
                                                  : "AED"}{" "}
                                                {grossFare ? (
                                                  <>
                                                    {(
                                                      (item.passengerFares.inf
                                                        .totalPrice -
                                                        item.passengerFares.inf
                                                          .discountPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          infantPriceValue[
                                                            index
                                                          ]
                                                        )) *
                                                        item.passengerCounts
                                                          .inf +
                                                      sCharge.inf[index] *
                                                        item.passengerCounts.inf
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                ) : (
                                                  <>
                                                    {(
                                                      (item.passengerFares.inf
                                                        .totalPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          infantPriceValue[
                                                            index
                                                          ]
                                                        )) *
                                                        item.passengerCounts
                                                          .inf +
                                                      sCharge.inf[index] *
                                                        item.passengerCounts.inf
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                )}{" "}
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValue(
                                                      e.target.value,
                                                      index,
                                                      "inf"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValueForService(
                                                      e.target.value,
                                                      index,
                                                      "inf"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        {item.brandedFares[item.brandedFareIdx]
                                          .paxFareBreakDown.adt !== null ? (
                                          <>
                                            <tr>
                                              <td className="text-center">
                                                Adult
                                              </td>
                                              <td className="left">
                                                {(
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .basePrice +
                                                  parseInt(addBalance) -
                                                  decBalance +
                                                  parseFloat(
                                                    adultPriceValue[index]
                                                  )
                                                )?.toLocaleString("en-US")}
                                              </td>
                                              <td className="center">
                                                {
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt.taxes
                                                }
                                              </td>
                                              {!grossFare && (
                                                <td className="right">
                                                  {
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice
                                                  }
                                                </td>
                                              )}

                                              <td className="right">
                                                {
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt.ait
                                                }
                                              </td>
                                              <td className="right">
                                                {item.passengerCounts.adt}
                                              </td>
                                              <td className="right fw-bold">
                                                {currency !== undefined
                                                  ? currency
                                                  : "AED"}{" "}
                                                {grossFare ? (
                                                  <>
                                                    {(
                                                      (item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].paxFareBreakDown.adt
                                                        .totalPrice -
                                                        item.brandedFares[
                                                          item.brandedFareIdx
                                                        ].paxFareBreakDown.adt
                                                          .discountPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          adultPriceValue[index]
                                                        )) *
                                                        item.passengerCounts
                                                          .adt +
                                                      sCharge.adt[index] *
                                                        item.passengerCounts.adt
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                ) : (
                                                  <>
                                                    {(
                                                      (item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].paxFareBreakDown.adt
                                                        .totalPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          adultPriceValue[index]
                                                        )) *
                                                        item.passengerCounts
                                                          .adt +
                                                      sCharge.adt[index] *
                                                        item.passengerCounts.adt
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                )}{" "}
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValue(
                                                      e.target.value,
                                                      index,
                                                      "adt"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValueForService(
                                                      e.target.value,
                                                      index,
                                                      "adt"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          </>
                                        ) : (
                                          <></>
                                        )}

                                        {item.brandedFares[item.brandedFareIdx]
                                          .paxFareBreakDown.chd !== null ? (
                                          <>
                                            <tr>
                                              <td className="text-center">
                                                Child &gt; 5
                                              </td>
                                              <td className="left">
                                                {(
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .basePrice +
                                                  parseInt(addBalance) -
                                                  decBalance +
                                                  parseFloat(
                                                    childBigPriceValue[index]
                                                  )
                                                )?.toLocaleString("en-US")}
                                              </td>
                                              <td className="center">
                                                {
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd.taxes
                                                }
                                              </td>
                                              {grossFare || (
                                                <td className="right">
                                                  {
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.chd
                                                      .discountPrice
                                                  }
                                                </td>
                                              )}

                                              <td className="right">
                                                {
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd.ait
                                                }
                                              </td>
                                              <td className="right">
                                                {item.passengerCounts.chd}
                                              </td>
                                              <td className="right fw-bold">
                                                {currency !== undefined
                                                  ? currency
                                                  : "AED"}{" "}
                                                {grossFare ? (
                                                  <>
                                                    {(
                                                      (item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].paxFareBreakDown.chd
                                                        .totalPrice -
                                                        item.brandedFares[
                                                          item.brandedFareIdx
                                                        ].paxFareBreakDown.chd
                                                          .discountPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          childBigPriceValue[
                                                            index
                                                          ]
                                                        )) *
                                                        item.passengerCounts
                                                          .chd +
                                                      sCharge.chd[index] *
                                                        item.passengerCounts.chd
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                ) : (
                                                  <>
                                                    {(
                                                      (item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].paxFareBreakDown.chd
                                                        .totalPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          childBigPriceValue[
                                                            index
                                                          ]
                                                        )) *
                                                        item.passengerCounts
                                                          .chd +
                                                      sCharge.chd[index] *
                                                        item.passengerCounts.chd
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                )}{" "}
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValue(
                                                      e.target.value,
                                                      index,
                                                      "chd"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValueForService(
                                                      e.target.value,
                                                      index,
                                                      "chd"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          </>
                                        ) : (
                                          <></>
                                        )}

                                        {item.brandedFares[item.brandedFareIdx]
                                          .paxFareBreakDown.cnn !== null ? (
                                          <>
                                            <tr>
                                              <td className="text-center">
                                                Child{" "}
                                                {item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd ===
                                                null ? (
                                                  <></>
                                                ) : (
                                                  <> &#60; 5</>
                                                )}
                                              </td>
                                              <td className="left">
                                                {item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn
                                                  .basePrice +
                                                  parseInt(addBalance) -
                                                  decBalance +
                                                  parseFloat(
                                                    childPriceValue[index]
                                                  )}
                                              </td>
                                              <td className="center">
                                                {
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn.taxes
                                                }
                                              </td>
                                              {grossFare || (
                                                <td className="right">
                                                  {
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.cnn
                                                      .discountPrice
                                                  }
                                                </td>
                                              )}

                                              <td className="right">
                                                {
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn.ait
                                                }
                                              </td>
                                              <td className="right">
                                                {item.passengerCounts.cnn}
                                              </td>
                                              <td className="right fw-bold">
                                                {currency !== undefined
                                                  ? currency
                                                  : "AED"}{" "}
                                                {grossFare ? (
                                                  <>
                                                    {(
                                                      (item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].paxFareBreakDown.cnn
                                                        .totalPrice -
                                                        item.brandedFares[
                                                          item.brandedFareIdx
                                                        ].paxFareBreakDown.cnn
                                                          .discountPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          childPriceValue[index]
                                                        )) *
                                                        item.passengerCounts
                                                          .cnn +
                                                      sCharge.cnn[index] *
                                                        item.passengerCounts.cnn
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                ) : (
                                                  <>
                                                    {(
                                                      (item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].paxFareBreakDown.cnn
                                                        .totalPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          childPriceValue[index]
                                                        )) *
                                                        item.passengerCounts
                                                          .cnn +
                                                      sCharge.cnn[index] *
                                                        item.passengerCounts.cnn
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                )}{" "}
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValue(
                                                      e.target.value,
                                                      index,
                                                      "cnn"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValueForService(
                                                      e.target.value,
                                                      index,
                                                      "cnn"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          </>
                                        ) : (
                                          <></>
                                        )}

                                        {item.brandedFares[item.brandedFareIdx]
                                          .paxFareBreakDown.inf !== null ? (
                                          <>
                                            <tr>
                                              <td className="text-center">
                                                Infant
                                              </td>
                                              <td className="left">
                                                {(
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .basePrice +
                                                  parseInt(addBalance) -
                                                  decBalance +
                                                  parseFloat(
                                                    infantPriceValue[index]
                                                  )
                                                )?.toLocaleString("en-US")}
                                              </td>
                                              <td className="center">
                                                {
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf.taxes
                                                }
                                              </td>
                                              {grossFare || (
                                                <td className="right">
                                                  {
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.inf
                                                      .discountPrice
                                                  }
                                                </td>
                                              )}

                                              <td className="right">
                                                {
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf.ait
                                                }
                                              </td>
                                              <td className="right">
                                                {item.passengerCounts.inf}
                                              </td>
                                              <td className="right fw-bold">
                                                {currency !== undefined
                                                  ? currency
                                                  : "AED"}{" "}
                                                {grossFare ? (
                                                  <>
                                                    {(
                                                      (item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].paxFareBreakDown.inf
                                                        .totalPrice -
                                                        item.brandedFares[
                                                          item.brandedFareIdx
                                                        ].paxFareBreakDown.inf
                                                          .discountPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          infantPriceValue[
                                                            index
                                                          ]
                                                        )) *
                                                        item.passengerCounts
                                                          .inf +
                                                      sCharge.inf[index] *
                                                        item.passengerCounts.inf
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                ) : (
                                                  <>
                                                    {(
                                                      (item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].paxFareBreakDown.inf
                                                        .totalPrice +
                                                        addBalance -
                                                        decBalance +
                                                        parseFloat(
                                                          infantPriceValue[
                                                            index
                                                          ]
                                                        )) *
                                                        item.passengerCounts
                                                          .inf +
                                                      sCharge.inf[index] *
                                                        item.passengerCounts.inf
                                                    )?.toLocaleString("en-US")}
                                                  </>
                                                )}{" "}
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValue(
                                                      e.target.value,
                                                      index,
                                                      "inf"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center">
                                                {" "}
                                                <input
                                                  type="number"
                                                  className="form-control me-2 shadow border-radius"
                                                  style={{
                                                    height: "20px",
                                                    width: "90px",
                                                  }}
                                                  name="value"
                                                  onChange={(e) =>
                                                    handleValueForService(
                                                      e.target.value,
                                                      index,
                                                      "inf"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.target.value.length >=
                                                        7 &&
                                                      e.key !== "Backspace" &&
                                                      e.key !== "Delete"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          <div
            className="container mt-3"
            ref={donwloadRef}
            style={{ maxWidth: "950px" }}
            id={"proposalPrint"}
          >
            {flightList?.length > 0 ? (
              <>
                {flightList?.map((item, index) => (
                  <>
                    <div className="row" style={{ fontSize: "15px" }}>
                      <div className="card box-shadow">
                        <Box
                          className="d-flex justify-content-between flex-wrap mt-3 pb-2 px-4"
                          // p={0}
                        >
                          <VStack mt={"5px"}>
                            <Text className="fw-bold">Flight Information </Text>
                            <HStack padding={0}>
                              <HiOutlineUserGroup
                                style={{
                                  color: "#7c04c0",
                                  height: "30px",
                                  width: "30px",
                                }}
                              />
                              <VStack padding={0}>
                                <Text lineHeight={1}>Travellers</Text>
                                <Text lineHeight={1} className="fw-bold">
                                  {item?.passengerCounts?.adt +
                                    item?.passengerCounts?.chd +
                                    item?.passengerCounts?.cnn +
                                    item?.passengerCounts?.inf +
                                    item?.passengerCounts?.ins}{" "}
                                  Person
                                </Text>
                              </VStack>
                            </HStack>
                          </VStack>

                          {/* <VStack mt={"35px"}>
                            <HStack padding={0}>
                              <MdAirlineSeatReclineExtra
                                style={{
                                  color: "#7c04c0",
                                  height: "30px",
                                  width: "30px",
                                }}
                              />
                              <VStack padding={0}>
                                <Text lineHeight={1}>Class</Text>
                                <Text lineHeight={1} className="fw-bold">
                                  Economy
                                </Text>
                              </VStack>
                            </HStack>
                          </VStack> */}

                          <VStack mt={"35px"}>
                            <HStack padding={0}>
                              <IoAirplane
                                style={{
                                  color: "#7c04c0",
                                  height: "30px",
                                  width: "30px",
                                }}
                              />
                              <VStack padding={0}>
                                <Text lineHeight={1}>Trip Type</Text>
                                <Text lineHeight={1} className="fw-bold">
                                  {" "}
                                  {item.directions.length === 1
                                    ? "Oneway"
                                    : item.directions.length === 2 &&
                                      item.directions[0][
                                        index === 0
                                          ? one[0]
                                          : index === 1
                                          ? one[1]
                                          : one[2]
                                      ].from ===
                                        item.directions[1][
                                          index === 0
                                            ? two[0]
                                            : index === 1
                                            ? two[1]
                                            : two[2]
                                        ].to
                                    ? "Round-Trip"
                                    : "Multi City"}
                                </Text>
                              </VStack>
                            </HStack>
                          </VStack>
                        </Box>

                        <div className="card-body">
                          <Box
                            style={{
                              background: "#7c04c0",
                              height: "30px",
                              width: "150px",
                              padding: "2px",
                              marginBottom: "8px",
                              borderRadius: "8px",
                            }}
                          >
                            <HStack className="d-flex justify-content-center ">
                              <IoAirplane
                                style={{
                                  color: "white",
                                  height: "24px",
                                  width: "25",
                                }}
                              />
                              <Text className="fw-bold text-white">
                                {
                                  item.directions[0][
                                    index === 0
                                      ? one[0]
                                      : index === 1
                                      ? one[1]
                                      : one[2]
                                  ]?.from
                                }{" "}
                                -{" "}
                                {
                                  item.directions[0][
                                    index === 0
                                      ? one[0]
                                      : index === 1
                                      ? one[1]
                                      : one[2]
                                  ]?.to
                                }
                              </Text>
                            </HStack>
                          </Box>

                          <div className="border mb-3 selected-bg-color rounded">
                            {item.directions[0][
                              index === 0
                                ? one[0]
                                : index === 1
                                ? one[1]
                                : one[2]
                            ]?.segments.map((seg, indx) => {
                              return (
                                <>
                                  {seg.details.length > 1 ? (
                                    seg.details.map((item, idx) => {
                                      return (
                                        <>
                                          {indx === seg.details.length - 1 ? (
                                            <></>
                                          ) : seg.details.length > 1 ? (
                                            <>
                                              {idx === 0 ? (
                                                <></>
                                              ) : (
                                                <>
                                                  <div
                                                    className="text-center fw-bold p-0"
                                                    style={{ fontSize: "12px" }}
                                                  >
                                                    {" "}
                                                    Layover : &nbsp;
                                                    {layOver(
                                                      seg.details[indx + 1]
                                                        ?.departure,
                                                      seg.details[indx]?.arrival
                                                    )}
                                                  </div>
                                                </>
                                              )}
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                          {indx === 0 ? (
                                            <></>
                                          ) : (
                                            <div
                                              className="text-center fw-bold p-0"
                                              style={{ fontSize: "12px" }}
                                            >
                                              {" "}
                                              Layover : &nbsp;
                                              {layOver(
                                                seg.details[indx]?.departure,
                                                seg.details[indx - 1]?.arrival
                                              )}
                                            </div>
                                          )}
                                          <div
                                            className="row py-2 px-3 mb-2"
                                            style={{ fontSize: "12px" }}
                                          >
                                            <div className="col-lg-1">
                                              {/* <img
                                                    src={
                                                      environment.s3ArliensImage +
                                                      `${seg.airlineCode}.png`
                                                    }
                                                    alt="img01"
                                                    width="40px"
                                                    height="40px"
                                                    crossOrigin="true"
                                                  /> */}
                                              <ImageComponent seg={seg} />
                                            </div>
                                            <div className="col-lg-3 d-block">
                                              <p className="my-auto text-start">
                                                {seg.airline}
                                              </p>
                                              <p className="my-auto text-start">
                                                {item.equipment}
                                              </p>
                                              <p className="my-auto text-start">
                                                Class {seg.bookingClass}
                                              </p>
                                            </div>
                                            <div className="col-lg-4">
                                              <span className="float-start fw-bold">
                                                {item.origin}
                                                <strong className="ms-1">
                                                  {item.departure.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br></br>
                                              <span className="float-start">
                                                {moment(item.departure).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {item.originName}
                                              </h6>
                                            </div>
                                            <div className="col-lg-4">
                                              <span className="float-start fw-bold">
                                                {item.destination}
                                                <strong className="ms-1">
                                                  {item.arrival.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br />
                                              <span className="float-start">
                                                {moment(item.arrival).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {item.destinationName}
                                              </h6>
                                            </div>
                                          </div>
                                        </>
                                      );
                                    })
                                  ) : (
                                    <>
                                      {indx !== 0 ? (
                                        <div
                                          className="text-center fw-bold p-0"
                                          style={{ fontSize: "12px" }}
                                        >
                                          {" "}
                                          Layover :&nbsp;
                                          {layOver(
                                            item.directions[0][
                                              index === 0
                                                ? one[0]
                                                : index === 1
                                                ? one[1]
                                                : one[2]
                                            ]?.segments[indx]?.departure,
                                            item.directions[0][
                                              index === 0
                                                ? one[0]
                                                : index === 1
                                                ? one[1]
                                                : one[2]
                                            ]?.segments[indx - 1]?.arrival
                                          )}
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                      <div
                                        className="row py-2 px-3"
                                        key={indx}
                                        style={{
                                          margin: "1px",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <div className="col-lg-1">
                                          {/* <img
                                              src={
                                                environment.s3ArliensImage +
                                                `${seg.airlineCode}.png`
                                              }
                                              alt=""
                                              width="40px"
                                              height="40px"
                                              crossOrigin="true"
                                            /> */}
                                          <ImageComponent seg={seg} />
                                        </div>
                                        <div className="col-lg-3 d-block">
                                          <p className="my-auto text-start">
                                            {seg.airline}
                                          </p>
                                          <p className="my-auto text-start">
                                            {seg.airlineCode}-{seg.flightNumber}{" "}
                                            <span
                                              style={{ fontSize: "13px" }}
                                              className="fw-bold"
                                            >
                                              Class(
                                              {item.brandedFareIdx !== null ? (
                                                <>
                                                  {Object.keys(
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].bookingClasses
                                                  ).map((innerKey) => {
                                                    return (
                                                      <>
                                                        {innerKey ===
                                                          seg.from +
                                                            "-" +
                                                            seg.to && (
                                                          <span>
                                                            {
                                                              item.brandedFares[
                                                                item
                                                                  .brandedFareIdx
                                                              ].bookingClasses[
                                                                innerKey
                                                              ]
                                                            }
                                                          </span>
                                                        )}
                                                      </>
                                                    );
                                                  })}
                                                </>
                                              ) : (
                                                seg.bookingClass
                                              )}
                                              ) Seats(
                                              {seg.bookingCount})
                                            </span>
                                          </p>
                                          <p className="my-auto text-start">
                                            {seg.details[0].equipment}
                                          </p>
                                          <p className="my-auto text-start">
                                            {/* {seg.cabinClass && seg.cabinClass} */}
                                            {item.brandedFareIdx !== null ? (
                                              <>
                                                {Object.keys(
                                                  item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].cabinClasses
                                                ).map((innerKey) => {
                                                  return (
                                                    <>
                                                      {innerKey ===
                                                        seg.from +
                                                          "-" +
                                                          seg.to && (
                                                        <span>
                                                          {item.brandedFares[
                                                            item.brandedFareIdx
                                                          ].cabinClasses[
                                                            innerKey
                                                          ] === ""
                                                            ? searchData?.travelClass
                                                            : item.brandedFares[
                                                                item
                                                                  .brandedFareIdx
                                                              ].cabinClasses[
                                                                innerKey
                                                              ]}
                                                        </span>
                                                      )}
                                                    </>
                                                  );
                                                })}
                                              </>
                                            ) : seg.cabinClass !== null ? (
                                              seg.cabinClass
                                            ) : (
                                              searchData.travelClass
                                            )}
                                          </p>
                                        </div>
                                        <div className="col-lg-3">
                                          <span className="float-start fw-bold">
                                            {seg.from}
                                            <strong className="ms-1">
                                              {seg.departure.substr(11, 5)}
                                            </strong>
                                          </span>
                                          <br></br>
                                          <span className="float-start">
                                            {moment(seg.departure).format(
                                              "DD MMMM,yyyy, dddd"
                                            )}
                                          </span>
                                          <br></br>
                                          <h6 className="text-start">
                                            {seg.fromAirport}
                                          </h6>
                                        </div>
                                        <div className="col-lg-3">
                                          <span className="float-start fw-bold">
                                            {seg.to}
                                            <strong className="ms-1">
                                              {seg.arrival.substr(11, 5)}
                                            </strong>
                                          </span>
                                          <br />
                                          <span className="float-start">
                                            {moment(seg.arrival).format(
                                              "DD MMMM,yyyy, dddd"
                                            )}
                                          </span>
                                          <br></br>
                                          <h6 className="text-start">
                                            {seg.toAirport}
                                          </h6>
                                        </div>
                                        <div className="col-lg-2">
                                          <p className="fw-bold">Baggage</p>
                                          {item?.brandedFareIdx === null ? (
                                            <>
                                              {seg?.baggage.map((item, idx) => (
                                                <div key={idx}>
                                                  <p>
                                                    {getPassengerTypeWithCode(
                                                      item.passengerTypeCode
                                                    )}{" "}
                                                    : {item.amount} {item.units}
                                                  </p>
                                                </div>
                                              ))}
                                            </>
                                          ) : (
                                            <>
                                              {Object.keys(
                                                item?.brandedFares[
                                                  item?.brandedFareIdx
                                                ]?.brandFeatures?.CheckedBaggage
                                              ).map((itemKey) => {
                                                const itm =
                                                  item?.brandedFares[
                                                    item?.brandedFareIdx
                                                  ]?.brandFeatures
                                                    ?.CheckedBaggage[itemKey];
                                                return (
                                                  <div
                                                    key={itemKey}
                                                    className="d-flex justify-content-start align-items-center gap-1"
                                                  >
                                                    {Object.keys(itm[0])
                                                      .reverse()
                                                      .map((innerKey, i) => (
                                                        <div
                                                          key={innerKey}
                                                          className="d-flex align-items-center justify-content-start"
                                                        >
                                                          <div className="d-flex justify-content-start align-items-center gap-1">
                                                            {i === 0 && (
                                                              <div>
                                                                {passengerType(
                                                                  itemKey
                                                                )}{" "}
                                                                :
                                                              </div>
                                                            )}

                                                            {innerKey ===
                                                              "weights" && (
                                                              <div className="fw-bold">
                                                                {
                                                                  itm[0][
                                                                    innerKey
                                                                  ]
                                                                }
                                                              </div>
                                                            )}
                                                          </div>
                                                        </div>
                                                      ))}
                                                  </div>
                                                );
                                              })}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </>
                              );
                            })}
                          </div>

                          {item.directions[1] !== undefined ? (
                            <>
                              <Box
                                style={{
                                  background: "#7c04c0",
                                  height: "30px",
                                  width: "150px",
                                  padding: "2px",
                                  marginBottom: "8px",
                                  borderRadius: "8px",
                                }}
                              >
                                <HStack className="d-flex justify-content-center ">
                                  <IoAirplane
                                    style={{
                                      color: "white",
                                      height: "24px",
                                      width: "25",
                                    }}
                                  />
                                  <Text className="fw-bold text-white">
                                    {
                                      item.directions[1][
                                        index === 0
                                          ? two[0]
                                          : index === 1
                                          ? two[1]
                                          : two[2]
                                      ]?.from
                                    }{" "}
                                    -{" "}
                                    {
                                      item.directions[1][
                                        index === 0
                                          ? two[0]
                                          : index === 1
                                          ? two[1]
                                          : two[2]
                                      ]?.to
                                    }
                                  </Text>
                                </HStack>
                              </Box>
                              <div className="border mb-3 selected-bg-color rounded">
                                {item.directions[1][
                                  index === 0
                                    ? two[0]
                                    : index === 1
                                    ? two[1]
                                    : two[2]
                                ]?.segments.map((seg, indx) => {
                                  return (
                                    <>
                                      {seg.details.length > 1 ? (
                                        seg.details.map((item, idx) => {
                                          return (
                                            <>
                                              {indx ===
                                              seg.details.length - 1 ? (
                                                <></>
                                              ) : seg.details.length > 1 ? (
                                                <>
                                                  {idx === 0 ? (
                                                    <></>
                                                  ) : (
                                                    <>
                                                      <div
                                                        className="text-center fw-bold p-0"
                                                        style={{
                                                          fontSize: "12px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Layover : &nbsp;
                                                        {layOver(
                                                          seg.details[indx + 1]
                                                            ?.departure,
                                                          seg.details[indx]
                                                            ?.arrival
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                              {indx === 0 ? (
                                                <></>
                                              ) : (
                                                <div
                                                  className="text-center fw-bold p-0"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  {" "}
                                                  Layover : &nbsp;
                                                  {layOver(
                                                    seg.details[indx]
                                                      ?.departure,
                                                    seg.details[indx - 1]
                                                      ?.arrival
                                                  )}
                                                </div>
                                              )}
                                              <div
                                                className="row py-2 px-3 mb-2"
                                                style={{ fontSize: "12px" }}
                                              >
                                                <div className="col-lg-1">
                                                  {/* <img
                                                        src={
                                                          environment.s3ArliensImage +
                                                          `${seg.airlineCode}.png`
                                                        }
                                                        alt=""
                                                        width="40px"
                                                        height="40px"
                                                        crossOrigin="true"
                                                      /> */}
                                                  <ImageComponent seg={seg} />
                                                </div>
                                                <div className="col-lg-3 d-block">
                                                  <p className="my-auto text-start">
                                                    {seg.airline}
                                                  </p>
                                                  <p className="my-auto text-start">
                                                    {item.equipment}
                                                  </p>
                                                  <p className="my-auto text-start">
                                                    Class {seg.bookingClass}
                                                  </p>
                                                </div>
                                                <div className="col-lg-4">
                                                  <span className="float-start fw-bold">
                                                    {item.origin}
                                                    <strong className="ms-1">
                                                      {item.departure.substr(
                                                        11,
                                                        5
                                                      )}
                                                    </strong>
                                                  </span>
                                                  <br></br>
                                                  <span className="float-start">
                                                    {moment(
                                                      item.departure
                                                    ).format(
                                                      "DD MMMM,yyyy, dddd"
                                                    )}
                                                  </span>
                                                  <br></br>
                                                  <h6 className="text-start">
                                                    {item.originName}
                                                  </h6>
                                                </div>
                                                <div className="col-lg-4">
                                                  <span className="float-start fw-bold">
                                                    {item.destination}
                                                    <strong className="ms-1">
                                                      {item.arrival.substr(
                                                        11,
                                                        5
                                                      )}
                                                    </strong>
                                                  </span>
                                                  <br />
                                                  <span className="float-start">
                                                    {moment(
                                                      item.arrival
                                                    ).format(
                                                      "DD MMMM,yyyy, dddd"
                                                    )}
                                                  </span>
                                                  <br></br>
                                                  <h6 className="text-start">
                                                    {item.destinationName}
                                                  </h6>
                                                </div>
                                              </div>
                                            </>
                                          );
                                        })
                                      ) : (
                                        <>
                                          {indx !== 0 ? (
                                            <div
                                              className="text-center fw-bold p-0"
                                              style={{ fontSize: "12px" }}
                                            >
                                              {" "}
                                              Layover :&nbsp;
                                              {layOver(
                                                item.directions[1][
                                                  index === 0
                                                    ? two[0]
                                                    : index === 1
                                                    ? two[1]
                                                    : two[2]
                                                ]?.segments[indx]?.departure,
                                                item.directions[1][
                                                  index === 0
                                                    ? two[0]
                                                    : index === 1
                                                    ? two[1]
                                                    : two[2]
                                                ]?.segments[indx - 1]?.arrival
                                              )}
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                          <div
                                            className="row py-2 px-3"
                                            key={indx}
                                            style={{
                                              margin: "1px",
                                              fontSize: "12px",
                                            }}
                                          >
                                            <div className="col-lg-1">
                                              {/* <img
                                                  src={
                                                    environment.s3ArliensImage +
                                                    `${seg.airlineCode}.png`
                                                  }
                                                  alt=""
                                                  width="40px"
                                                  height="40px"
                                                  crossOrigin="true"
                                                /> */}
                                              <ImageComponent seg={seg} />
                                            </div>
                                            <div className="col-lg-3 d-block">
                                              <p className="my-auto text-start">
                                                {seg.airline}
                                              </p>
                                              <p className="my-auto text-start">
                                                {seg.airlineCode}-
                                                {seg.flightNumber}{" "}
                                                <span
                                                  style={{ fontSize: "13px" }}
                                                  className="fw-bold"
                                                >
                                                  Class(
                                                  {item.brandedFareIdx !==
                                                  null ? (
                                                    <>
                                                      {Object.keys(
                                                        item.brandedFares[
                                                          item.brandedFareIdx
                                                        ].bookingClasses
                                                      ).map((innerKey) => {
                                                        return (
                                                          <>
                                                            {innerKey ===
                                                              seg.from +
                                                                "-" +
                                                                seg.to && (
                                                              <span>
                                                                {
                                                                  item
                                                                    .brandedFares[
                                                                    item
                                                                      .brandedFareIdx
                                                                  ]
                                                                    .bookingClasses[
                                                                    innerKey
                                                                  ]
                                                                }
                                                              </span>
                                                            )}
                                                          </>
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    seg.bookingClass
                                                  )}
                                                  ) Seats({seg.bookingCount})
                                                </span>
                                              </p>
                                              <p className="my-auto text-start">
                                                {seg.details[0].equipment}
                                              </p>
                                              <p className="my-auto text-start">
                                                {item.brandedFareIdx !==
                                                null ? (
                                                  <>
                                                    {Object.keys(
                                                      item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].cabinClasses
                                                    ).map((innerKey) => {
                                                      return (
                                                        <>
                                                          {innerKey ===
                                                            seg.from +
                                                              "-" +
                                                              seg.to && (
                                                            <span>
                                                              {item
                                                                .brandedFares[
                                                                item
                                                                  .brandedFareIdx
                                                              ].cabinClasses[
                                                                innerKey
                                                              ] === ""
                                                                ? searchData?.travelClass
                                                                : item
                                                                    .brandedFares[
                                                                    item
                                                                      .brandedFareIdx
                                                                  ]
                                                                    .cabinClasses[
                                                                    innerKey
                                                                  ]}
                                                            </span>
                                                          )}
                                                        </>
                                                      );
                                                    })}
                                                  </>
                                                ) : seg.cabinClass !== null ? (
                                                  seg.cabinClass
                                                ) : (
                                                  searchData.travelClass
                                                )}
                                              </p>
                                            </div>
                                            <div className="col-lg-3">
                                              <span className="float-start fw-bold">
                                                {seg.from}
                                                <strong className="ms-1">
                                                  {seg.departure.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br></br>
                                              <span className="float-start">
                                                {moment(seg.departure).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {seg.fromAirport}
                                              </h6>
                                            </div>
                                            <div className="col-lg-3">
                                              <span className="float-start fw-bold">
                                                {seg.to}
                                                <strong className="ms-1">
                                                  {seg.arrival.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br />
                                              <span className="float-start">
                                                {moment(seg.arrival).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {seg.toAirport}
                                              </h6>
                                            </div>
                                            <div className="col-lg-2">
                                              <p className="fw-bold">Baggage</p>
                                              {item?.brandedFareIdx === null ? (
                                                <>
                                                  {seg?.baggage.map(
                                                    (item, idx) => (
                                                      <div key={idx}>
                                                        <p>
                                                          {getPassengerTypeWithCode(
                                                            item.passengerTypeCode
                                                          )}{" "}
                                                          : {item.amount}{" "}
                                                          {item.units}
                                                        </p>
                                                      </div>
                                                    )
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {Object.keys(
                                                    item?.brandedFares[
                                                      item?.brandedFareIdx
                                                    ]?.brandFeatures
                                                      ?.CheckedBaggage
                                                  ).map((itemKey) => {
                                                    const itm =
                                                      item?.brandedFares[
                                                        item?.brandedFareIdx
                                                      ]?.brandFeatures
                                                        ?.CheckedBaggage[
                                                        itemKey
                                                      ];
                                                    return (
                                                      <div
                                                        key={itemKey}
                                                        className="d-flex justify-content-start align-items-center gap-1"
                                                      >
                                                        {Object.keys(itm[1])
                                                          .reverse()
                                                          .map(
                                                            (innerKey, i) => (
                                                              <div
                                                                key={innerKey}
                                                                className="d-flex align-items-center justify-content-start"
                                                              >
                                                                <div className="d-flex justify-content-start align-items-center gap-1">
                                                                  {i === 0 && (
                                                                    <div>
                                                                      {passengerType(
                                                                        itemKey
                                                                      )}{" "}
                                                                      :
                                                                    </div>
                                                                  )}

                                                                  {innerKey ===
                                                                    "weights" && (
                                                                    <div className="fw-bold">
                                                                      {
                                                                        itm[1][
                                                                          innerKey
                                                                        ]
                                                                      }
                                                                    </div>
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )
                                                          )}
                                                      </div>
                                                    );
                                                  })}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          {item.directions[2] !== undefined ? (
                            <>
                              <Box
                                style={{
                                  background: "#7c04c0",
                                  height: "30px",
                                  width: "150px",
                                  padding: "2px",
                                  marginBottom: "8px",
                                  borderRadius: "8px",
                                }}
                              >
                                <HStack className="d-flex justify-content-center ">
                                  <IoAirplane
                                    style={{
                                      color: "white",
                                      height: "24px",
                                      width: "25",
                                    }}
                                  />
                                  <Text className="fw-bold text-white">
                                    {
                                      item.directions[2][
                                        index === 0
                                          ? three[0]
                                          : index === 1
                                          ? three[1]
                                          : three[2]
                                      ]?.from
                                    }{" "}
                                    -{" "}
                                    {
                                      item.directions[2][
                                        index === 0
                                          ? three[0]
                                          : index === 1
                                          ? three[1]
                                          : three[2]
                                      ]?.to
                                    }
                                  </Text>
                                </HStack>
                              </Box>
                              <div className="border mb-3 selected-bg-color rounded">
                                {item.directions[2][
                                  index === 0
                                    ? three[0]
                                    : index === 1
                                    ? three[1]
                                    : three[2]
                                ]?.segments.map((seg, indx) => {
                                  return (
                                    <>
                                      {seg.details.length > 1 ? (
                                        seg.details.map((item, idx) => {
                                          return (
                                            <>
                                              {indx ===
                                              seg.details.length - 1 ? (
                                                <></>
                                              ) : seg.details.length > 1 ? (
                                                <>
                                                  {idx === 0 ? (
                                                    <></>
                                                  ) : (
                                                    <>
                                                      <div
                                                        className="text-center fw-bold p-0"
                                                        style={{
                                                          fontSize: "12px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Layover : &nbsp;
                                                        {layOver(
                                                          seg.details[indx + 1]
                                                            ?.departure,
                                                          seg.details[indx]
                                                            ?.arrival
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                              {indx === 0 ? (
                                                <></>
                                              ) : (
                                                <div
                                                  className="text-center fw-bold p-0"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  {" "}
                                                  Layover : &nbsp;
                                                  {layOver(
                                                    seg.details[indx]
                                                      ?.departure,
                                                    seg.details[indx - 1]
                                                      ?.arrival
                                                  )}
                                                </div>
                                              )}
                                              <div
                                                className="row py-2 px-3 mb-2"
                                                style={{ fontSize: "12px" }}
                                              >
                                                <div className="col-lg-1">
                                                  {/* <img
                                                        src={
                                                          environment.s3ArliensImage +
                                                          `${seg.airlineCode}.png`
                                                        }
                                                        alt=""
                                                        width="40px"
                                                        height="40px"
                                                        crossOrigin="true"
                                                      /> */}
                                                  <ImageComponent seg={seg} />
                                                </div>
                                                <div className="col-lg-3 d-block">
                                                  <p className="my-auto text-start">
                                                    {seg.airline}
                                                  </p>
                                                  <p className="my-auto text-start">
                                                    {item.equipment}
                                                  </p>
                                                  <p className="my-auto text-start">
                                                    Class {seg.bookingClass}
                                                  </p>
                                                </div>
                                                <div className="col-lg-4">
                                                  <span className="float-start fw-bold">
                                                    {item.origin}
                                                    <strong className="ms-1">
                                                      {item.departure.substr(
                                                        11,
                                                        5
                                                      )}
                                                    </strong>
                                                  </span>
                                                  <br></br>
                                                  <span className="float-start">
                                                    {moment(
                                                      item.departure
                                                    ).format(
                                                      "DD MMMM,yyyy, dddd"
                                                    )}
                                                  </span>
                                                  <br></br>
                                                  <h6 className="text-start">
                                                    {item.originName}
                                                  </h6>
                                                </div>
                                                <div className="col-lg-4">
                                                  <span className="float-start fw-bold">
                                                    {item.destination}
                                                    <strong className="ms-1">
                                                      {item.arrival.substr(
                                                        11,
                                                        5
                                                      )}
                                                    </strong>
                                                  </span>
                                                  <br />
                                                  <span className="float-start">
                                                    {moment(
                                                      item.arrival
                                                    ).format(
                                                      "DD MMMM,yyyy, dddd"
                                                    )}
                                                  </span>
                                                  <br></br>
                                                  <h6 className="text-start">
                                                    {item.destinationName}
                                                  </h6>
                                                </div>
                                              </div>
                                            </>
                                          );
                                        })
                                      ) : (
                                        <>
                                          {indx !== 0 ? (
                                            <div
                                              className="text-center fw-bold p-0"
                                              style={{ fontSize: "12px" }}
                                            >
                                              {" "}
                                              Layover :&nbsp;
                                              {layOver(
                                                item.directions[2][
                                                  index === 0
                                                    ? three[0]
                                                    : index === 1
                                                    ? three[1]
                                                    : three[2]
                                                ]?.segments[indx]?.departure,
                                                item.directions[2][
                                                  index === 0
                                                    ? three[0]
                                                    : index === 1
                                                    ? three[1]
                                                    : three[2]
                                                ]?.segments[indx - 1]?.arrival
                                              )}
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                          <div
                                            className="row py-2 px-3"
                                            key={indx}
                                            style={{
                                              margin: "1px",
                                              fontSize: "12px",
                                            }}
                                          >
                                            <div className="col-lg-1">
                                              {/* <img
                                                  src={
                                                    environment.s3ArliensImage +
                                                    `${seg.airlineCode}.png`
                                                  }
                                                  alt=""
                                                  width="40px"
                                                  height="40px"
                                                  crossOrigin="true"
                                                /> */}
                                              <ImageComponent seg={seg} />
                                            </div>
                                            <div className="col-lg-3 d-block">
                                              <p className="my-auto text-start">
                                                {seg.airline}
                                              </p>
                                              <p className="my-auto text-start">
                                                {seg.airlineCode}-
                                                {seg.flightNumber}{" "}
                                                <span
                                                  style={{ fontSize: "13px" }}
                                                  className="fw-bold"
                                                >
                                                  Class(
                                                  {item.brandedFareIdx !==
                                                  null ? (
                                                    <>
                                                      {Object.keys(
                                                        item.brandedFares[
                                                          item.brandedFareIdx
                                                        ].bookingClasses
                                                      ).map((innerKey) => {
                                                        return (
                                                          <>
                                                            {innerKey ===
                                                              seg.from +
                                                                "-" +
                                                                seg.to && (
                                                              <span>
                                                                {
                                                                  item
                                                                    .brandedFares[
                                                                    item
                                                                      .brandedFareIdx
                                                                  ]
                                                                    .bookingClasses[
                                                                    innerKey
                                                                  ]
                                                                }
                                                              </span>
                                                            )}
                                                          </>
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    seg.bookingClass
                                                  )}
                                                  ) Seats({seg.bookingCount})
                                                </span>
                                              </p>
                                              <p className="my-auto text-start">
                                                {seg.details[0].equipment}
                                              </p>
                                              <p className="my-auto text-start">
                                                {item.brandedFareIdx !==
                                                null ? (
                                                  <>
                                                    {Object.keys(
                                                      item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].cabinClasses
                                                    ).map((innerKey) => {
                                                      return (
                                                        <>
                                                          {innerKey ===
                                                            seg.from +
                                                              "-" +
                                                              seg.to && (
                                                            <span>
                                                              {item
                                                                .brandedFares[
                                                                item
                                                                  .brandedFareIdx
                                                              ].cabinClasses[
                                                                innerKey
                                                              ] === ""
                                                                ? searchData?.travelClass
                                                                : item
                                                                    .brandedFares[
                                                                    item
                                                                      .brandedFareIdx
                                                                  ]
                                                                    .cabinClasses[
                                                                    innerKey
                                                                  ]}
                                                            </span>
                                                          )}
                                                        </>
                                                      );
                                                    })}
                                                  </>
                                                ) : seg.cabinClass !== null ? (
                                                  seg.cabinClass
                                                ) : (
                                                  searchData.travelClass
                                                )}
                                              </p>
                                            </div>
                                            <div className="col-lg-3">
                                              <span className="float-start fw-bold">
                                                {seg.from}
                                                <strong className="ms-1">
                                                  {seg.departure.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br></br>
                                              <span className="float-start">
                                                {moment(seg.departure).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {seg.fromAirport}
                                              </h6>
                                            </div>
                                            <div className="col-lg-3">
                                              <span className="float-start fw-bold">
                                                {seg.to}
                                                <strong className="ms-1">
                                                  {seg.arrival.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br />
                                              <span className="float-start">
                                                {moment(seg.arrival).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {seg.toAirport}
                                              </h6>
                                            </div>
                                            <div className="col-lg-2">
                                              <p className="fw-bold">Baggage</p>
                                              {item?.brandedFareIdx === null ? (
                                                <>
                                                  {seg?.baggage.map(
                                                    (item, idx) => (
                                                      <div key={idx}>
                                                        <p>
                                                          {getPassengerTypeWithCode(
                                                            item.passengerTypeCode
                                                          )}{" "}
                                                          : {item.amount}{" "}
                                                          {item.units}
                                                        </p>
                                                      </div>
                                                    )
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {Object.keys(
                                                    item?.brandedFares[
                                                      item?.brandedFareIdx
                                                    ]?.brandFeatures
                                                      ?.CheckedBaggage
                                                  ).map((itemKey) => {
                                                    const itm =
                                                      item?.brandedFares[
                                                        item?.brandedFareIdx
                                                      ]?.brandFeatures
                                                        ?.CheckedBaggage[
                                                        itemKey
                                                      ];
                                                    return (
                                                      <div
                                                        key={itemKey}
                                                        className="d-flex justify-content-start align-items-center gap-1"
                                                      >
                                                        {Object.keys(itm[2])
                                                          .reverse()
                                                          .map(
                                                            (innerKey, i) => (
                                                              <div
                                                                key={innerKey}
                                                                className="d-flex align-items-center justify-content-start"
                                                              >
                                                                <div className="d-flex justify-content-start align-items-center gap-1">
                                                                  {i === 0 && (
                                                                    <div>
                                                                      {passengerType(
                                                                        itemKey
                                                                      )}{" "}
                                                                      :
                                                                    </div>
                                                                  )}

                                                                  {innerKey ===
                                                                    "weights" && (
                                                                    <div className="fw-bold">
                                                                      {
                                                                        itm[2][
                                                                          innerKey
                                                                        ]
                                                                      }
                                                                    </div>
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )
                                                          )}
                                                      </div>
                                                    );
                                                  })}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          {item.directions[3] !== undefined ? (
                            <>
                              <Box
                                style={{
                                  background: "#7c04c0",
                                  height: "30px",
                                  width: "150px",
                                  padding: "2px",
                                  marginBottom: "8px",
                                  borderRadius: "8px",
                                }}
                              >
                                <HStack className="d-flex justify-content-center ">
                                  <IoAirplane
                                    style={{
                                      color: "white",
                                      height: "24px",
                                      width: "25",
                                    }}
                                  />
                                  <Text className="fw-bold text-white">
                                    {
                                      item.directions[3][
                                        index === 0
                                          ? four[0]
                                          : index === 1
                                          ? four[1]
                                          : four[2]
                                      ]?.from
                                    }{" "}
                                    -{" "}
                                    {
                                      item.directions[3][
                                        index === 0
                                          ? four[0]
                                          : index === 1
                                          ? four[1]
                                          : four[2]
                                      ]?.to
                                    }
                                  </Text>
                                </HStack>
                              </Box>
                              <div className="border mb-3 selected-bg-color rounded">
                                {item.directions[3][
                                  index === 0
                                    ? four[0]
                                    : index === 1
                                    ? four[1]
                                    : four[2]
                                ]?.segments.map((seg, indx) => {
                                  return (
                                    <>
                                      {seg.details.length > 1 ? (
                                        seg.details.map((item, idx) => {
                                          return (
                                            <>
                                              {indx ===
                                              seg.details.length - 1 ? (
                                                <></>
                                              ) : seg.details.length > 1 ? (
                                                <>
                                                  {idx === 0 ? (
                                                    <></>
                                                  ) : (
                                                    <>
                                                      <div
                                                        className="text-center fw-bold p-0"
                                                        style={{
                                                          fontSize: "12px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Layover : &nbsp;
                                                        {layOver(
                                                          seg.details[indx + 1]
                                                            ?.departure,
                                                          seg.details[indx]
                                                            ?.arrival
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                              {indx === 0 ? (
                                                <></>
                                              ) : (
                                                <div
                                                  className="text-center fw-bold p-0"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  {" "}
                                                  Layover : &nbsp;
                                                  {layOver(
                                                    seg.details[indx]
                                                      ?.departure,
                                                    seg.details[indx - 1]
                                                      ?.arrival
                                                  )}
                                                </div>
                                              )}
                                              <div
                                                className="row py-2 px-3 mb-2"
                                                style={{ fontSize: "12px" }}
                                              >
                                                <div className="col-lg-1">
                                                  {/* <img
                                                        src={
                                                          environment.s3ArliensImage +
                                                          `${seg.airlineCode}.png`
                                                        }
                                                        alt=""
                                                        width="40px"
                                                        height="40px"
                                                        crossOrigin="true"
                                                      /> */}
                                                  <ImageComponent seg={seg} />
                                                </div>
                                                <div className="col-lg-3 d-block">
                                                  <p className="my-auto text-start">
                                                    {seg.airline}
                                                  </p>
                                                  <p className="my-auto text-start">
                                                    {item.equipment}
                                                  </p>
                                                  <p className="my-auto text-start">
                                                    Class {seg.bookingClass}
                                                  </p>
                                                </div>
                                                <div className="col-lg-4">
                                                  <span className="float-start fw-bold">
                                                    {item.origin}
                                                    <strong className="ms-1">
                                                      {item.departure.substr(
                                                        11,
                                                        5
                                                      )}
                                                    </strong>
                                                  </span>
                                                  <br></br>
                                                  <span className="float-start">
                                                    {moment(
                                                      item.departure
                                                    ).format(
                                                      "DD MMMM,yyyy, dddd"
                                                    )}
                                                  </span>
                                                  <br></br>
                                                  <h6 className="text-start">
                                                    {item.originName}
                                                  </h6>
                                                </div>
                                                <div className="col-lg-4">
                                                  <span className="float-start fw-bold">
                                                    {item.destination}
                                                    <strong className="ms-1">
                                                      {item.arrival.substr(
                                                        11,
                                                        5
                                                      )}
                                                    </strong>
                                                  </span>
                                                  <br />
                                                  <span className="float-start">
                                                    {moment(
                                                      item.arrival
                                                    ).format(
                                                      "DD MMMM,yyyy, dddd"
                                                    )}
                                                  </span>
                                                  <br></br>
                                                  <h6 className="text-start">
                                                    {item.destinationName}
                                                  </h6>
                                                </div>
                                              </div>
                                            </>
                                          );
                                        })
                                      ) : (
                                        <>
                                          {indx !== 0 ? (
                                            <div
                                              className="text-center fw-bold p-0"
                                              style={{ fontSize: "12px" }}
                                            >
                                              {" "}
                                              Layover :&nbsp;
                                              {layOver(
                                                item.directions[3][
                                                  index === 0
                                                    ? four[0]
                                                    : index === 1
                                                    ? four[1]
                                                    : four[2]
                                                ]?.segments[indx]?.departure,
                                                item.directions[3][
                                                  index === 0
                                                    ? four[0]
                                                    : index === 1
                                                    ? four[1]
                                                    : four[2]
                                                ]?.segments[indx - 1]?.arrival
                                              )}
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                          <div
                                            className="row py-2 px-3"
                                            key={indx}
                                            style={{
                                              margin: "1px",
                                              fontSize: "12px",
                                            }}
                                          >
                                            <div className="col-lg-1">
                                              {/* <img
                                                  src={
                                                    environment.s3ArliensImage +
                                                    `${seg.airlineCode}.png`
                                                  }
                                                  alt=""
                                                  width="40px"
                                                  height="40px"
                                                  crossOrigin="true"
                                                /> */}
                                              <ImageComponent seg={seg} />
                                            </div>
                                            <div className="col-lg-3 d-block">
                                              <p className="my-auto text-start">
                                                {seg.airline}
                                              </p>
                                              <p className="my-auto text-start">
                                                {seg.airlineCode}-
                                                {seg.flightNumber}{" "}
                                                <span
                                                  style={{ fontSize: "13px" }}
                                                  className="fw-bold"
                                                >
                                                  Class(
                                                  {item.brandedFareIdx !==
                                                  null ? (
                                                    <>
                                                      {Object.keys(
                                                        item.brandedFares[
                                                          item.brandedFareIdx
                                                        ].bookingClasses
                                                      ).map((innerKey) => {
                                                        return (
                                                          <>
                                                            {innerKey ===
                                                              seg.from +
                                                                "-" +
                                                                seg.to && (
                                                              <span>
                                                                {
                                                                  item
                                                                    .brandedFares[
                                                                    item
                                                                      .brandedFareIdx
                                                                  ]
                                                                    .bookingClasses[
                                                                    innerKey
                                                                  ]
                                                                }
                                                              </span>
                                                            )}
                                                          </>
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    seg.bookingClass
                                                  )}
                                                  ) Seats({seg.bookingCount})
                                                </span>
                                              </p>
                                              <p className="my-auto text-start">
                                                {seg.details[0].equipment}
                                              </p>
                                              <p className="my-auto text-start">
                                                {item.brandedFareIdx !==
                                                null ? (
                                                  <>
                                                    {Object.keys(
                                                      item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].cabinClasses
                                                    ).map((innerKey) => {
                                                      return (
                                                        <>
                                                          {innerKey ===
                                                            seg.from +
                                                              "-" +
                                                              seg.to && (
                                                            <span>
                                                              {item
                                                                .brandedFares[
                                                                item
                                                                  .brandedFareIdx
                                                              ].cabinClasses[
                                                                innerKey
                                                              ] === ""
                                                                ? searchData?.travelClass
                                                                : item
                                                                    .brandedFares[
                                                                    item
                                                                      .brandedFareIdx
                                                                  ]
                                                                    .cabinClasses[
                                                                    innerKey
                                                                  ]}
                                                            </span>
                                                          )}
                                                        </>
                                                      );
                                                    })}
                                                  </>
                                                ) : seg.cabinClass !== null ? (
                                                  seg.cabinClass
                                                ) : (
                                                  searchData.travelClass
                                                )}
                                              </p>
                                            </div>
                                            <div className="col-lg-3">
                                              <span className="float-start fw-bold">
                                                {seg.from}
                                                <strong className="ms-1">
                                                  {seg.departure.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br></br>
                                              <span className="float-start">
                                                {moment(seg.departure).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {seg.fromAirport}
                                              </h6>
                                            </div>
                                            <div className="col-lg-3">
                                              <span className="float-start fw-bold">
                                                {seg.to}
                                                <strong className="ms-1">
                                                  {seg.arrival.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br />
                                              <span className="float-start">
                                                {moment(seg.arrival).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {seg.toAirport}
                                              </h6>
                                            </div>
                                            <div className="col-lg-2">
                                              <p className="fw-bold">Baggage</p>
                                              {item?.brandedFareIdx === null ? (
                                                <>
                                                  {seg?.baggage.map(
                                                    (item, idx) => (
                                                      <div key={idx}>
                                                        <p>
                                                          {getPassengerTypeWithCode(
                                                            item.passengerTypeCode
                                                          )}{" "}
                                                          : {item.amount}{" "}
                                                          {item.units}
                                                        </p>
                                                      </div>
                                                    )
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {Object.keys(
                                                    item?.brandedFares[
                                                      item?.brandedFareIdx
                                                    ]?.brandFeatures
                                                      ?.CheckedBaggage
                                                  ).map((itemKey) => {
                                                    const itm =
                                                      item?.brandedFares[
                                                        item?.brandedFareIdx
                                                      ]?.brandFeatures
                                                        ?.CheckedBaggage[
                                                        itemKey
                                                      ];
                                                    return (
                                                      <div
                                                        key={itemKey}
                                                        className="d-flex justify-content-start align-items-center gap-1"
                                                      >
                                                        {Object.keys(itm[3])
                                                          .reverse()
                                                          .map(
                                                            (innerKey, i) => (
                                                              <div
                                                                key={innerKey}
                                                                className="d-flex align-items-center justify-content-start"
                                                              >
                                                                <div className="d-flex justify-content-start align-items-center gap-1">
                                                                  {i === 0 && (
                                                                    <div>
                                                                      {passengerType(
                                                                        itemKey
                                                                      )}{" "}
                                                                      :
                                                                    </div>
                                                                  )}

                                                                  {innerKey ===
                                                                    "weights" && (
                                                                    <div className="fw-bold">
                                                                      {
                                                                        itm[3][
                                                                          innerKey
                                                                        ]
                                                                      }
                                                                    </div>
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )
                                                          )}
                                                      </div>
                                                    );
                                                  })}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          {item.directions[4] !== undefined ? (
                            <>
                              <Box
                                style={{
                                  background: "#7c04c0",
                                  height: "30px",
                                  width: "150px",
                                  padding: "2px",
                                  marginBottom: "8px",
                                  borderRadius: "8px",
                                }}
                              >
                                <HStack className="d-flex justify-content-center ">
                                  <IoAirplane
                                    style={{
                                      color: "white",
                                      height: "24px",
                                      width: "25",
                                    }}
                                  />
                                  <Text className="fw-bold text-white">
                                    {
                                      item.directions[4][
                                        index === 0
                                          ? five[0]
                                          : index === 1
                                          ? five[1]
                                          : five[2]
                                      ]?.from
                                    }{" "}
                                    -{" "}
                                    {
                                      item.directions[4][
                                        index === 0
                                          ? five[0]
                                          : index === 1
                                          ? five[1]
                                          : five[2]
                                      ]?.to
                                    }
                                  </Text>
                                </HStack>
                              </Box>
                              <div className="border mb-3 selected-bg-color rounded">
                                {item.directions[4][
                                  index === 0
                                    ? five[0]
                                    : index === 1
                                    ? five[1]
                                    : five[2]
                                ]?.segments.map((seg, indx) => {
                                  return (
                                    <>
                                      {seg.details.length > 1 ? (
                                        seg.details.map((item, idx) => {
                                          return (
                                            <>
                                              {indx ===
                                              seg.details.length - 1 ? (
                                                <></>
                                              ) : seg.details.length > 1 ? (
                                                <>
                                                  {idx === 0 ? (
                                                    <></>
                                                  ) : (
                                                    <>
                                                      <div
                                                        className="text-center fw-bold p-0"
                                                        style={{
                                                          fontSize: "12px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Layover : &nbsp;
                                                        {layOver(
                                                          seg.details[indx + 1]
                                                            ?.departure,
                                                          seg.details[indx]
                                                            ?.arrival
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                              {indx === 0 ? (
                                                <></>
                                              ) : (
                                                <div
                                                  className="text-center fw-bold p-0"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  {" "}
                                                  Layover : &nbsp;
                                                  {layOver(
                                                    seg.details[indx]
                                                      ?.departure,
                                                    seg.details[indx - 1]
                                                      ?.arrival
                                                  )}
                                                </div>
                                              )}
                                              <div
                                                className="row py-2 px-3 mb-2"
                                                style={{ fontSize: "12px" }}
                                              >
                                                <div className="col-lg-1">
                                                  {/* <img
                                                        src={
                                                          environment.s3ArliensImage +
                                                          `${seg.airlineCode}.png`
                                                        }
                                                        alt=""
                                                        width="40px"
                                                        height="40px"
                                                        crossOrigin="true"
                                                      /> */}
                                                  <ImageComponent seg={seg} />
                                                </div>
                                                <div className="col-lg-3 d-block">
                                                  <p className="my-auto text-start">
                                                    {seg.airline}
                                                  </p>
                                                  <p className="my-auto text-start">
                                                    {item.equipment}
                                                  </p>
                                                  <p className="my-auto text-start">
                                                    Class {seg.bookingClass}
                                                  </p>
                                                </div>
                                                <div className="col-lg-4">
                                                  <span className="float-start fw-bold">
                                                    {item.origin}
                                                    <strong className="ms-1">
                                                      {item.departure.substr(
                                                        11,
                                                        5
                                                      )}
                                                    </strong>
                                                  </span>
                                                  <br></br>
                                                  <span className="float-start">
                                                    {moment(
                                                      item.departure
                                                    ).format(
                                                      "DD MMMM,yyyy, dddd"
                                                    )}
                                                  </span>
                                                  <br></br>
                                                  <h6 className="text-start">
                                                    {item.originName}
                                                  </h6>
                                                </div>
                                                <div className="col-lg-4">
                                                  <span className="float-start fw-bold">
                                                    {item.destination}
                                                    <strong className="ms-1">
                                                      {item.arrival.substr(
                                                        11,
                                                        5
                                                      )}
                                                    </strong>
                                                  </span>
                                                  <br />
                                                  <span className="float-start">
                                                    {moment(
                                                      item.arrival
                                                    ).format(
                                                      "DD MMMM,yyyy, dddd"
                                                    )}
                                                  </span>
                                                  <br></br>
                                                  <h6 className="text-start">
                                                    {item.destinationName}
                                                  </h6>
                                                </div>
                                              </div>
                                            </>
                                          );
                                        })
                                      ) : (
                                        <>
                                          {indx !== 0 ? (
                                            <div
                                              className="text-center fw-bold p-0"
                                              style={{ fontSize: "12px" }}
                                            >
                                              {" "}
                                              Layover :&nbsp;
                                              {layOver(
                                                item.directions[4][
                                                  index === 0
                                                    ? five[0]
                                                    : index === 1
                                                    ? five[1]
                                                    : five[2]
                                                ]?.segments[indx]?.departure,
                                                item.directions[4][
                                                  index === 0
                                                    ? five[0]
                                                    : index === 1
                                                    ? five[1]
                                                    : five[2]
                                                ]?.segments[indx - 1]?.arrival
                                              )}
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                          <div
                                            className="row py-2 px-3"
                                            key={indx}
                                            style={{
                                              margin: "1px",
                                              fontSize: "12px",
                                            }}
                                          >
                                            <div className="col-lg-1">
                                              {/* <img
                                                  src={
                                                    environment.s3ArliensImage +
                                                    `${seg.airlineCode}.png`
                                                  }
                                                  alt=""
                                                  width="40px"
                                                  height="40px"
                                                  crossOrigin="true"
                                                /> */}
                                              <ImageComponent seg={seg} />
                                            </div>
                                            <div className="col-lg-3 d-block">
                                              <p className="my-auto text-start">
                                                {seg.airline}
                                              </p>
                                              <p className="my-auto text-start">
                                                {seg.airlineCode}-
                                                {seg.flightNumber}{" "}
                                                <span
                                                  style={{ fontSize: "13px" }}
                                                  className="fw-bold"
                                                >
                                                  Class(
                                                  {item.brandedFareIdx !==
                                                  null ? (
                                                    <>
                                                      {Object.keys(
                                                        item.brandedFares[
                                                          item.brandedFareIdx
                                                        ].bookingClasses
                                                      ).map((innerKey) => {
                                                        return (
                                                          <>
                                                            {innerKey ===
                                                              seg.from +
                                                                "-" +
                                                                seg.to && (
                                                              <span>
                                                                {
                                                                  item
                                                                    .brandedFares[
                                                                    item
                                                                      .brandedFareIdx
                                                                  ]
                                                                    .bookingClasses[
                                                                    innerKey
                                                                  ]
                                                                }
                                                              </span>
                                                            )}
                                                          </>
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    seg.bookingClass
                                                  )}
                                                  ) Seats({seg.bookingCount})
                                                </span>
                                              </p>
                                              <p className="my-auto text-start">
                                                {seg.details[0].equipment}
                                              </p>
                                              <p className="my-auto text-start">
                                                {item.brandedFareIdx !==
                                                null ? (
                                                  <>
                                                    {Object.keys(
                                                      item.brandedFares[
                                                        item.brandedFareIdx
                                                      ].cabinClasses
                                                    ).map((innerKey) => {
                                                      return (
                                                        <>
                                                          {innerKey ===
                                                            seg.from +
                                                              "-" +
                                                              seg.to && (
                                                            <span>
                                                              {item
                                                                .brandedFares[
                                                                item
                                                                  .brandedFareIdx
                                                              ].cabinClasses[
                                                                innerKey
                                                              ] === ""
                                                                ? searchData?.travelClass
                                                                : item
                                                                    .brandedFares[
                                                                    item
                                                                      .brandedFareIdx
                                                                  ]
                                                                    .cabinClasses[
                                                                    innerKey
                                                                  ]}
                                                            </span>
                                                          )}
                                                        </>
                                                      );
                                                    })}
                                                  </>
                                                ) : seg.cabinClass !== null ? (
                                                  seg.cabinClass
                                                ) : (
                                                  searchData.travelClass
                                                )}
                                              </p>
                                            </div>
                                            <div className="col-lg-3">
                                              <span className="float-start fw-bold">
                                                {seg.from}
                                                <strong className="ms-1">
                                                  {seg.departure.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br></br>
                                              <span className="float-start">
                                                {moment(seg.departure).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {seg.fromAirport}
                                              </h6>
                                            </div>
                                            <div className="col-lg-3">
                                              <span className="float-start fw-bold">
                                                {seg.to}
                                                <strong className="ms-1">
                                                  {seg.arrival.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br />
                                              <span className="float-start">
                                                {moment(seg.arrival).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {seg.toAirport}
                                              </h6>
                                            </div>
                                            <div className="col-lg-2">
                                              <p className="fw-bold">Baggage</p>
                                              {item?.brandedFareIdx === null ? (
                                                <>
                                                  {seg?.baggage.map(
                                                    (item, idx) => (
                                                      <div key={idx}>
                                                        <p>
                                                          {getPassengerTypeWithCode(
                                                            item.passengerTypeCode
                                                          )}{" "}
                                                          : {item.amount}{" "}
                                                          {item.units}
                                                        </p>
                                                      </div>
                                                    )
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {Object.keys(
                                                    item?.brandedFares[
                                                      item?.brandedFareIdx
                                                    ]?.brandFeatures
                                                      ?.CheckedBaggage
                                                  ).map((itemKey) => {
                                                    const itm =
                                                      item?.brandedFares[
                                                        item?.brandedFareIdx
                                                      ]?.brandFeatures
                                                        ?.CheckedBaggage[
                                                        itemKey
                                                      ];
                                                    return (
                                                      <div
                                                        key={itemKey}
                                                        className="d-flex justify-content-start align-items-center gap-1"
                                                      >
                                                        {Object.keys(itm[4])
                                                          .reverse()
                                                          .map(
                                                            (innerKey, i) => (
                                                              <div
                                                                key={innerKey}
                                                                className="d-flex align-items-center justify-content-start"
                                                              >
                                                                <div className="d-flex justify-content-start align-items-center gap-1">
                                                                  {i === 0 && (
                                                                    <div>
                                                                      {passengerType(
                                                                        itemKey
                                                                      )}{" "}
                                                                      :
                                                                    </div>
                                                                  )}

                                                                  {innerKey ===
                                                                    "weights" && (
                                                                    <div className="fw-bold">
                                                                      {
                                                                        itm[4][
                                                                          innerKey
                                                                        ]
                                                                      }
                                                                    </div>
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )
                                                          )}
                                                      </div>
                                                    );
                                                  })}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          {item.directions[5] !== undefined ? (
                            <>
                              <Box
                                style={{
                                  background: "#7c04c0",
                                  height: "30px",
                                  width: "150px",
                                  padding: "2px",
                                  marginBottom: "8px",
                                  borderRadius: "8px",
                                }}
                              >
                                <HStack className="d-flex justify-content-center ">
                                  <IoAirplane
                                    style={{
                                      color: "white",
                                      height: "24px",
                                      width: "25",
                                    }}
                                  />
                                  <Text className="fw-bold text-white">
                                    {
                                      item.directions[5][
                                        index === 0
                                          ? six[0]
                                          : index === 1
                                          ? six[1]
                                          : six[2]
                                      ]?.from
                                    }{" "}
                                    -{" "}
                                    {
                                      item.directions[5][
                                        index === 0
                                          ? six[0]
                                          : index === 1
                                          ? six[1]
                                          : six[2]
                                      ]?.to
                                    }
                                  </Text>
                                </HStack>
                              </Box>
                              <div className="border mb-3 selected-bg-color rounded">
                                {item.directions[5][
                                  index === 0
                                    ? six[0]
                                    : index === 1
                                    ? six[1]
                                    : six[2]
                                ]?.segments.map((seg, indx) => {
                                  return (
                                    <>
                                      {seg.details.length > 1 ? (
                                        seg.details.map((item, idx) => {
                                          return (
                                            <>
                                              {indx ===
                                              seg.details.length - 1 ? (
                                                <></>
                                              ) : seg.details.length > 1 ? (
                                                <>
                                                  {idx === 0 ? (
                                                    <></>
                                                  ) : (
                                                    <>
                                                      <div
                                                        className="text-center fw-bold p-0"
                                                        style={{
                                                          fontSize: "12px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Layover : &nbsp;
                                                        {layOver(
                                                          seg.details[indx + 1]
                                                            ?.departure,
                                                          seg.details[indx]
                                                            ?.arrival
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                              {indx === 0 ? (
                                                <></>
                                              ) : (
                                                <div
                                                  className="text-center fw-bold p-0"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  {" "}
                                                  Layover : &nbsp;
                                                  {layOver(
                                                    seg.details[indx]
                                                      ?.departure,
                                                    seg.details[indx - 1]
                                                      ?.arrival
                                                  )}
                                                </div>
                                              )}
                                              <div
                                                className="row py-2 px-3 mb-2"
                                                style={{ fontSize: "12px" }}
                                              >
                                                <div className="col-lg-1">
                                                  {/* <img
                                                        src={
                                                          environment.s3ArliensImage +
                                                          `${seg.airlineCode}.png`
                                                        }
                                                        alt=""
                                                        width="40px"
                                                        height="40px"
                                                        crossOrigin="true"
                                                      /> */}
                                                  <ImageComponent seg={seg} />
                                                </div>
                                                <div className="col-lg-3 d-block">
                                                  <p className="my-auto text-start">
                                                    {seg.airline}
                                                  </p>
                                                  <p className="my-auto text-start">
                                                    {item.equipment}
                                                  </p>
                                                  <p className="my-auto text-start">
                                                    Class {seg.bookingClass}
                                                  </p>
                                                </div>
                                                <div className="col-lg-4">
                                                  <span className="float-start fw-bold">
                                                    {item.origin}
                                                    <strong className="ms-1">
                                                      {item.departure.substr(
                                                        11,
                                                        5
                                                      )}
                                                    </strong>
                                                  </span>
                                                  <br></br>
                                                  <span className="float-start">
                                                    {moment(
                                                      item.departure
                                                    ).format(
                                                      "DD MMMM,yyyy, dddd"
                                                    )}
                                                  </span>
                                                  <br></br>
                                                  <h6 className="text-start">
                                                    {item.originName}
                                                  </h6>
                                                </div>
                                                <div className="col-lg-4">
                                                  <span className="float-start fw-bold">
                                                    {item.destination}
                                                    <strong className="ms-1">
                                                      {item.arrival.substr(
                                                        11,
                                                        5
                                                      )}
                                                    </strong>
                                                  </span>
                                                  <br />
                                                  <span className="float-start">
                                                    {moment(
                                                      item.arrival
                                                    ).format(
                                                      "DD MMMM,yyyy, dddd"
                                                    )}
                                                  </span>
                                                  <br></br>
                                                  <h6 className="text-start">
                                                    {item.destinationName}
                                                  </h6>
                                                </div>
                                              </div>
                                            </>
                                          );
                                        })
                                      ) : (
                                        <>
                                          {indx !== 0 ? (
                                            <div
                                              className="text-center fw-bold p-0"
                                              style={{ fontSize: "12px" }}
                                            >
                                              {" "}
                                              Layover :&nbsp;
                                              {layOver(
                                                item.directions[5][
                                                  index === 0
                                                    ? six[0]
                                                    : index === 1
                                                    ? six[1]
                                                    : six[2]
                                                ]?.segments[indx]?.departure,
                                                item.directions[5][
                                                  index === 0
                                                    ? six[0]
                                                    : index === 1
                                                    ? six[1]
                                                    : six[2]
                                                ]?.segments[indx - 1]?.arrival
                                              )}
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                          <div
                                            className="row py-2 px-3"
                                            key={indx}
                                            style={{
                                              margin: "1px",
                                              fontSize: "12px",
                                            }}
                                          >
                                            <div className="col-lg-1">
                                              {/* <img
                                                  src={
                                                    environment.s3ArliensImage +
                                                    `${seg.airlineCode}.png`
                                                  }
                                                  alt=""
                                                  width="40px"
                                                  height="40px"
                                                  crossOrigin="true"
                                                /> */}
                                              <ImageComponent seg={seg} />
                                            </div>
                                            <div className="col-lg-3 d-block">
                                              <p className="my-auto text-start">
                                                {seg.airline}
                                              </p>
                                              <p className="my-auto text-start">
                                                {seg.airlineCode}-
                                                {seg.flightNumber}{" "}
                                                <span
                                                  style={{ fontSize: "13px" }}
                                                  className="fw-bold"
                                                >
                                                  Class(
                                                  {item.brandedFareIdx !==
                                                  null ? (
                                                    <>
                                                      {Object.keys(
                                                        item.brandedFares[
                                                          item.brandedFareIdx
                                                        ].bookingClasses
                                                      ).map((innerKey) => {
                                                        return (
                                                          <>
                                                            {innerKey ===
                                                              seg.from +
                                                                "-" +
                                                                seg.to && (
                                                              <span>
                                                                {
                                                                  item
                                                                    .brandedFares[
                                                                    item
                                                                      .brandedFareIdx
                                                                  ]
                                                                    .bookingClasses[
                                                                    innerKey
                                                                  ]
                                                                }
                                                              </span>
                                                            )}
                                                          </>
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    seg.bookingClass
                                                  )}
                                                  ) Seats({seg.bookingCount})
                                                </span>
                                              </p>
                                              <p className="my-auto text-start">
                                                {seg.details[0].equipment}
                                              </p>
                                              <p className="my-auto text-start">
                                                {seg.cabinClass &&
                                                  seg.cabinClass}
                                              </p>
                                            </div>
                                            <div className="col-lg-3">
                                              <span className="float-start fw-bold">
                                                {seg.from}
                                                <strong className="ms-1">
                                                  {seg.departure.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br></br>
                                              <span className="float-start">
                                                {moment(seg.departure).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {seg.fromAirport}
                                              </h6>
                                            </div>
                                            <div className="col-lg-3">
                                              <span className="float-start fw-bold">
                                                {seg.to}
                                                <strong className="ms-1">
                                                  {seg.arrival.substr(11, 5)}
                                                </strong>
                                              </span>
                                              <br />
                                              <span className="float-start">
                                                {moment(seg.arrival).format(
                                                  "DD MMMM,yyyy, dddd"
                                                )}
                                              </span>
                                              <br></br>
                                              <h6 className="text-start">
                                                {seg.toAirport}
                                              </h6>
                                            </div>
                                            <div className="col-lg-2">
                                              <p className="fw-bold">Baggage</p>
                                              {item?.brandedFareIdx === null ? (
                                                <>
                                                  {seg?.baggage.map(
                                                    (item, idx) => (
                                                      <div key={idx}>
                                                        <p>
                                                          {getPassengerTypeWithCode(
                                                            item.passengerTypeCode
                                                          )}{" "}
                                                          : {item.amount}{" "}
                                                          {item.units}
                                                        </p>
                                                      </div>
                                                    )
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {Object.keys(
                                                    item?.brandedFares[
                                                      item?.brandedFareIdx
                                                    ]?.brandFeatures
                                                      ?.CheckedBaggage
                                                  ).map((itemKey) => {
                                                    const itm =
                                                      item?.brandedFares[
                                                        item?.brandedFareIdx
                                                      ]?.brandFeatures
                                                        ?.CheckedBaggage[
                                                        itemKey
                                                      ];
                                                    return (
                                                      <div
                                                        key={itemKey}
                                                        className="d-flex justify-content-start align-items-center gap-1"
                                                      >
                                                        {Object.keys(itm[5])
                                                          .reverse()
                                                          .map(
                                                            (innerKey, i) => (
                                                              <div
                                                                key={innerKey}
                                                                className="d-flex align-items-center justify-content-start"
                                                              >
                                                                <div className="d-flex justify-content-start align-items-center gap-1">
                                                                  {i === 0 && (
                                                                    <div>
                                                                      {passengerType(
                                                                        itemKey
                                                                      )}{" "}
                                                                      :
                                                                    </div>
                                                                  )}

                                                                  {innerKey ===
                                                                    "weights" && (
                                                                    <div className="fw-bold">
                                                                      {
                                                                        itm[5][
                                                                          innerKey
                                                                        ]
                                                                      }
                                                                    </div>
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )
                                                          )}
                                                      </div>
                                                    );
                                                  })}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          {showFare && (
                            <table
                              className="table table-bordered  table-sm table-responsive-sm"
                              style={{ fontSize: "12px" }}
                            >
                              <thead className="text-end button-color text-white fw-bold">
                                <tr>
                                  <th className="text-center">Type</th>
                                  <th>Base</th>
                                  <th>Tax</th>
                                  {grossFare || <th>Commission</th>}

                                  <th>S/C</th>
                                  <th>AIT</th>
                                  <th>Pax</th>
                                  <th>Total Pax Fare</th>
                                </tr>
                              </thead>
                              <tbody className="text-end">
                                {item.brandedFareIdx === null ? (
                                  <>
                                    {item?.passengerFares.adt !== null ? (
                                      <>
                                        <tr>
                                          <td className="text-center">Adult</td>
                                          <td className="left">
                                            {item.passengerFares.adt.basePrice +
                                              parseInt(addBalance) -
                                              decBalance +
                                              parseFloat(
                                                adultPriceValue[index]
                                              )}
                                          </td>
                                          <td className="center">
                                            {item.passengerFares.adt.taxes}
                                          </td>
                                          {grossFare || (
                                            <td className="right">
                                              {
                                                item.passengerFares.adt
                                                  .discountPrice
                                              }
                                            </td>
                                          )}

                                          <td className="right">
                                            {sCharge.adt[index]}
                                          </td>
                                          <td className="right">
                                            {item.passengerFares.adt.ait}
                                          </td>
                                          <td className="right">
                                            {" "}
                                            {item.passengerCounts.adt}
                                          </td>
                                          <td>
                                            {" "}
                                            {currency !== undefined
                                              ? currency
                                              : "AED"}{" "}
                                            {grossFare ? (
                                              <>
                                                {(
                                                  (item.passengerFares.adt
                                                    .totalPrice -
                                                    item.passengerFares.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt
                                                )?.toLocaleString("en-US")}
                                              </>
                                            ) : (
                                              <>
                                                {(
                                                  (item.passengerFares.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt
                                                )?.toLocaleString("en-US")}
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    {item?.passengerFares.chd !== null ? (
                                      <>
                                        <tr>
                                          <td className="text-center">
                                            Child &gt; 5
                                          </td>
                                          <td className="left">
                                            {item.passengerFares.chd.basePrice +
                                              parseInt(addBalance) -
                                              decBalance +
                                              parseFloat(
                                                childBigPriceValue[index]
                                              )}
                                          </td>
                                          <td className="center">
                                            {item.passengerFares.chd.taxes}
                                          </td>
                                          {grossFare || (
                                            <td className="right">
                                              {
                                                item.passengerFares.chd
                                                  .discountPrice
                                              }
                                            </td>
                                          )}

                                          <td className="right">
                                            {sCharge.chd[index]}
                                          </td>
                                          <td className="right">
                                            {item.passengerFares.chd.ait}
                                          </td>
                                          <td className="right">
                                            {" "}
                                            {item.passengerCounts.chd}
                                          </td>
                                          <td>
                                            {currency !== undefined
                                              ? currency
                                              : "AED"}{" "}
                                            {grossFare ? (
                                              <>
                                                {(
                                                  (item.passengerFares.chd
                                                    .totalPrice -
                                                    item.passengerFares.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd
                                                )?.toLocaleString("en-US")}
                                              </>
                                            ) : (
                                              <>
                                                {(
                                                  (item.passengerFares.chd
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd
                                                )?.toLocaleString("en-US")}
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    {item?.passengerFares.cnn !== null ? (
                                      <>
                                        <tr>
                                          <td className="text-center">
                                            Child{" "}
                                            {item.passengerFares.chd ===
                                            null ? (
                                              <></>
                                            ) : (
                                              <> &#60; 5</>
                                            )}
                                          </td>
                                          <td className="left">
                                            {item.passengerFares.cnn.basePrice +
                                              parseInt(addBalance) -
                                              decBalance +
                                              parseFloat(
                                                childPriceValue[index]
                                              )}
                                          </td>
                                          <td className="center">
                                            {item.passengerFares.cnn.taxes}
                                          </td>
                                          {grossFare || (
                                            <td className="right">
                                              {
                                                item.passengerFares.cnn
                                                  .discountPrice
                                              }
                                            </td>
                                          )}

                                          <td className="right">
                                            {sCharge.cnn[index]}
                                          </td>
                                          <td className="right">
                                            {item.passengerFares.cnn.ait +
                                              childPriceValue[index] * 0.003}
                                          </td>
                                          <td className="right">
                                            {" "}
                                            {item.passengerCounts.cnn}
                                          </td>
                                          <td>
                                            {currency !== undefined
                                              ? currency
                                              : "AED"}{" "}
                                            {grossFare ? (
                                              <>
                                                {(
                                                  (item.passengerFares.cnn
                                                    .totalPrice -
                                                    item.passengerFares.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                )?.toLocaleString("en-US")}
                                              </>
                                            ) : (
                                              <>
                                                {(
                                                  (item.passengerFares.cnn
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                )?.toLocaleString("en-US")}
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    {item?.passengerFares.inf !== null ? (
                                      <>
                                        <tr>
                                          <td className="text-center">
                                            Infant
                                          </td>
                                          <td className="left">
                                            {(
                                              item.passengerFares.inf
                                                .basePrice +
                                              parseInt(addBalance) -
                                              decBalance +
                                              parseFloat(
                                                infantPriceValue[index]
                                              )
                                            )?.toLocaleString("en-US")}
                                          </td>
                                          <td className="center">
                                            {item.passengerFares.inf.taxes}
                                          </td>
                                          {grossFare || (
                                            <td className="right">
                                              {
                                                item.passengerFares.inf
                                                  .discountPrice
                                              }
                                            </td>
                                          )}

                                          <td className="right">
                                            {sCharge.inf[index]}
                                          </td>
                                          <td className="right">
                                            {item.passengerFares.inf.ait}
                                          </td>
                                          <td className="right">
                                            {" "}
                                            {item.passengerCounts.inf}
                                          </td>
                                          <td>
                                            {currency !== undefined
                                              ? currency
                                              : "AED"}{" "}
                                            {grossFare ? (
                                              <>
                                                {(
                                                  (item.passengerFares.inf
                                                    .totalPrice -
                                                    item.passengerFares.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                )?.toLocaleString("en-US")}
                                              </>
                                            ) : (
                                              <>
                                                {(
                                                  (item.passengerFares.inf
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                )?.toLocaleString("en-US")}
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    <tr className="fw-bold">
                                      <td
                                        colSpan={grossFare ? 5 : 6}
                                        className="border-none"
                                      ></td>
                                      <td>Grand Total</td>
                                      <td>
                                        {grossFare ? (
                                          <span id={"balance" + index}>
                                            AED{" "}
                                            {item.passengerFares.adt !== null &&
                                            item.passengerFares.chd === null &&
                                            item.passengerFares.cnn === null &&
                                            item.passengerFares.inf === null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice -
                                                    item.passengerFares.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd !==
                                                  null &&
                                                item.passengerFares.cnn ===
                                                  null &&
                                                item.passengerFares.inf === null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice -
                                                    item.passengerFares.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.chd
                                                    .totalPrice -
                                                    item.passengerFares.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd !==
                                                  null &&
                                                item.passengerFares.cnn ===
                                                  null &&
                                                item.passengerFares.inf !== null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice -
                                                    item.passengerFares.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.chd
                                                    .totalPrice -
                                                    item.passengerFares.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.passengerFares.inf
                                                    .totalPrice -
                                                    item.passengerFares.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd !==
                                                  null &&
                                                item.passengerFares.cnn !==
                                                  null &&
                                                item.passengerFares.inf === null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice -
                                                    item.passengerFares.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.chd
                                                    .totalPrice -
                                                    item.passengerFares.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.passengerFares.cnn
                                                    .totalPrice -
                                                    item.passengerFares.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd !==
                                                  null &&
                                                item.passengerFares.cnn !==
                                                  null &&
                                                item.passengerFares.inf !== null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice -
                                                    item.passengerFares.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.chd
                                                    .totalPrice -
                                                    item.passengerFares.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.passengerFares.cnn
                                                    .totalPrice -
                                                    item.passengerFares.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  (item.passengerFares.inf
                                                    .totalPrice -
                                                    item.passengerFares.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd ===
                                                  null &&
                                                item.passengerFares.cnn !==
                                                  null &&
                                                item.passengerFares.inf === null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice -
                                                    item.passengerFares.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.cnn
                                                    .totalPrice -
                                                    item.passengerFares.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd ===
                                                  null &&
                                                item.passengerFares.cnn !==
                                                  null &&
                                                item.passengerFares.inf !== null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice -
                                                    item.passengerFares.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.cnn
                                                    .totalPrice -
                                                    item.passengerFares.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  (item.passengerFares.inf
                                                    .totalPrice -
                                                    item.passengerFares.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd ===
                                                  null &&
                                                item.passengerFares.cnn ==
                                                  null &&
                                                item.passengerFares.inf !== null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice -
                                                    item.passengerFares.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.inf
                                                    .totalPrice -
                                                    item.passengerFares.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : 0}
                                          </span>
                                        ) : (
                                          <span id={"balance" + index}>
                                            AED{" "}
                                            {item.passengerFares.adt !== null &&
                                            item.passengerFares.chd === null &&
                                            item.passengerFares.cnn === null &&
                                            item.passengerFares.inf === null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd !==
                                                  null &&
                                                item.passengerFares.cnn ===
                                                  null &&
                                                item.passengerFares.inf === null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.chd
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd !==
                                                  null &&
                                                item.passengerFares.cnn ===
                                                  null &&
                                                item.passengerFares.inf !== null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.chd
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.passengerFares.inf
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd !==
                                                  null &&
                                                item.passengerFares.cnn !==
                                                  null &&
                                                item.passengerFares.inf === null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.chd
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.passengerFares.cnn
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd !==
                                                  null &&
                                                item.passengerFares.cnn !==
                                                  null &&
                                                item.passengerFares.inf !== null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.chd
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.passengerFares.cnn
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  (item.passengerFares.inf
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd ===
                                                  null &&
                                                item.passengerFares.cnn !==
                                                  null &&
                                                item.passengerFares.inf === null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.cnn
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd ===
                                                  null &&
                                                item.passengerFares.cnn !==
                                                  null &&
                                                item.passengerFares.inf !== null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.cnn
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  (item.passengerFares.inf
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.passengerFares.adt !==
                                                  null &&
                                                item.passengerFares.chd ===
                                                  null &&
                                                item.passengerFares.cnn ==
                                                  null &&
                                                item.passengerFares.inf !== null
                                              ? (
                                                  (item.passengerFares.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.passengerFares.inf
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : 0}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <>
                                    {item.brandedFares[item.brandedFareIdx]
                                      .paxFareBreakDown.adt !== null ? (
                                      <>
                                        <tr>
                                          <td className="text-center">Adult</td>
                                          <td className="left">
                                            {item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.adt.basePrice +
                                              parseInt(addBalance) -
                                              decBalance +
                                              parseFloat(
                                                adultPriceValue[index]
                                              )}
                                          </td>
                                          <td className="center">
                                            {
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.adt.taxes
                                            }
                                          </td>
                                          {grossFare || (
                                            <td className="right">
                                              {
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt
                                                  .discountPrice
                                              }
                                            </td>
                                          )}

                                          <td className="right">
                                            {sCharge.adt[index]}
                                          </td>
                                          <td className="right">
                                            {
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.adt.ait
                                            }
                                          </td>
                                          <td className="right">
                                            {" "}
                                            {item.passengerCounts.adt}
                                          </td>
                                          <td>
                                            {" "}
                                            {currency !== undefined
                                              ? currency
                                              : "AED"}{" "}
                                            {grossFare ? (
                                              <>
                                                {(
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt
                                                )?.toLocaleString("en-US")}
                                              </>
                                            ) : (
                                              <>
                                                {(
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt
                                                )?.toLocaleString("en-US")}
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    {item?.brandedFares[item.brandedFareIdx]
                                      .paxFareBreakDown.chd !== null ? (
                                      <>
                                        <tr>
                                          <td className="text-center">
                                            Child &gt; 5
                                          </td>
                                          <td className="left">
                                            {item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.chd.basePrice +
                                              parseInt(addBalance) -
                                              decBalance +
                                              parseFloat(
                                                childBigPriceValue[index]
                                              )}
                                          </td>
                                          <td className="center">
                                            {
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.chd.taxes
                                            }
                                          </td>
                                          {grossFare || (
                                            <td className="right">
                                              {
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd
                                                  .discountPrice
                                              }
                                            </td>
                                          )}

                                          <td className="right">
                                            {sCharge.chd[index]}
                                          </td>
                                          <td className="right">
                                            {
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.chd.ait
                                            }
                                          </td>
                                          <td className="right">
                                            {" "}
                                            {item.passengerCounts.chd}
                                          </td>
                                          <td>
                                            {currency !== undefined
                                              ? currency
                                              : "AED"}{" "}
                                            {grossFare ? (
                                              <>
                                                {(
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd
                                                )?.toLocaleString("en-US")}
                                              </>
                                            ) : (
                                              <>
                                                {(
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd
                                                )?.toLocaleString("en-US")}
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    {item.brandedFares[item.brandedFareIdx]
                                      .paxFareBreakDown.cnn !== null ? (
                                      <>
                                        <tr>
                                          <td className="text-center">
                                            Child{" "}
                                            {item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.chd === null ? (
                                              <></>
                                            ) : (
                                              <> &#60; 5</>
                                            )}
                                          </td>
                                          <td className="left">
                                            {item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.cnn.basePrice +
                                              parseInt(addBalance) -
                                              decBalance +
                                              parseFloat(
                                                childPriceValue[index]
                                              )}
                                          </td>
                                          <td className="center">
                                            {
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.cnn.taxes
                                            }
                                          </td>
                                          {grossFare || (
                                            <td className="right">
                                              {
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn
                                                  .discountPrice
                                              }
                                            </td>
                                          )}

                                          <td className="right">
                                            {sCharge.cnn[index]}
                                          </td>
                                          <td className="right">
                                            {item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.cnn.ait +
                                              childPriceValue[index] * 0.003}
                                          </td>
                                          <td className="right">
                                            {" "}
                                            {item.passengerCounts.cnn}
                                          </td>
                                          <td>
                                            {currency !== undefined
                                              ? currency
                                              : "AED"}{" "}
                                            {grossFare ? (
                                              <>
                                                {(
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                )?.toLocaleString("en-US")}
                                              </>
                                            ) : (
                                              <>
                                                {(
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                )?.toLocaleString("en-US")}
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    {item.brandedFares[item.brandedFareIdx]
                                      .paxFareBreakDown.inf !== null ? (
                                      <>
                                        <tr>
                                          <td className="text-center">
                                            Infant
                                          </td>
                                          <td className="left">
                                            {(
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.inf.basePrice +
                                              parseInt(addBalance) -
                                              decBalance +
                                              parseFloat(
                                                infantPriceValue[index]
                                              )
                                            )?.toLocaleString("en-US")}
                                          </td>
                                          <td className="center">
                                            {
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.inf.taxes
                                            }
                                          </td>
                                          {grossFare || (
                                            <td className="right">
                                              {
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf
                                                  .discountPrice
                                              }
                                            </td>
                                          )}

                                          <td className="right">
                                            {sCharge.inf[index]}
                                          </td>
                                          <td className="right">
                                            {
                                              item.brandedFares[
                                                item.brandedFareIdx
                                              ].paxFareBreakDown.inf.ait
                                            }
                                          </td>
                                          <td className="right">
                                            {" "}
                                            {item.passengerCounts.inf}
                                          </td>
                                          <td>
                                            {currency !== undefined
                                              ? currency
                                              : "AED"}{" "}
                                            {grossFare ? (
                                              <>
                                                {(
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                )?.toLocaleString("en-US")}
                                              </>
                                            ) : (
                                              <>
                                                {(
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                )?.toLocaleString("en-US")}
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    <tr className="fw-bold">
                                      <td
                                        colSpan={grossFare ? 5 : 6}
                                        className="border-none"
                                      ></td>
                                      <td>Grand Total</td>
                                      <td>
                                        {grossFare ? (
                                          <span id={"balance" + index}>
                                            AED{" "}
                                            {item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.adt !== null &&
                                            item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.chd === null &&
                                            item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.cnn === null &&
                                            item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.chd
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.cnn
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn ==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.adt
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice -
                                                    item.brandedFares[
                                                      item.brandedFareIdx
                                                    ].paxFareBreakDown.inf
                                                      .discountPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : 0}
                                          </span>
                                        ) : (
                                          <span id={"balance" + index}>
                                            AED{" "}
                                            {item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.adt !== null &&
                                            item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.chd === null &&
                                            item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.cnn === null &&
                                            item.brandedFares[
                                              item.brandedFareIdx
                                            ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.chd
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childBigPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.chd +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.chd[index] *
                                                    item.passengerCounts.chd +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf === null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.cnn
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      childPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.cnn +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.cnn[index] *
                                                    item.passengerCounts.cnn +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.adt !==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.chd ===
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.cnn ==
                                                  null &&
                                                item.brandedFares[
                                                  item.brandedFareIdx
                                                ].paxFareBreakDown.inf !== null
                                              ? (
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.adt
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      adultPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.adt +
                                                  (item.brandedFares[
                                                    item.brandedFareIdx
                                                  ].paxFareBreakDown.inf
                                                    .totalPrice +
                                                    addBalance -
                                                    decBalance +
                                                    parseFloat(
                                                      infantPriceValue[index]
                                                    )) *
                                                    item.passengerCounts.inf +
                                                  sCharge.adt[index] *
                                                    item.passengerCounts.adt +
                                                  sCharge.inf[index] *
                                                    item.passengerCounts.inf
                                                ).toFixed(2)
                                              : 0}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                    <br></br>
                  </>
                ))}
              </>
            ) : (
              <>
                <p className="text-center">No proposal found</p>
              </>
            )}
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Proposal;
