import { decode as base64_decode } from "base-64";
import $ from "jquery";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import {
  totalFlightDuration,
  addDurations,
  timeDuration,
  sumTaxesDiscount,
  checkCabinClass,
  responsive,
  isNestedObject,
  passengerType,
} from "../../../common/functions";
import { IoMdCheckmark, IoMdWarning } from "react-icons/io";
import useAuth from "../../../hooks/useAuth";
import airports from "../../../JSON/airports.json";
import dayCount from "../../SharePages/Utility/dayCount";
import { environment } from "../../SharePages/Utility/environment";
import ShowModal from "../ShowModal/ShowModal";
import "./ShowFlight.css";
import { airlinesCodeName } from "../../../common/filterFunctions";
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,

  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import ModalForm from "../../../common/modalForm";
import { RiFlightTakeoffFill } from "react-icons/ri";
// import barndedfare from "../../../JSON/brandedfare.json";
import { MdOutlineClose } from "react-icons/md";
import Carousel from "react-multi-carousel";
import { brandedFareTitleList } from "../../../common/customArr";
import { FaChevronCircleDown } from "react-icons/fa";
import { FaChevronCircleUp } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";
import { GiWaterRecycling } from "react-icons/gi";
import { bookingcodes, validateCheck } from "../../../common/allApi";
import ShowFlightDataRbd from "../../ShowAllFlightPageForProgressiveSearch/ShowFlight/ShowFlightDataRbd";

const ShowFlight = (props) => {
  const [grandTotal, setGrandTotal] = useState();
  const searchData = JSON.parse(sessionStorage.getItem("Database"));
  const { setCount, handleFareRules, loading, fareRules, setFareRules } =
    useAuth();
  const navigate = useNavigate();
  const {
    passengerFares,
    refundable,
    directions,
    bookingComponents,
    uniqueTransID,
    itemCodeRef,
    passengerCounts,
    totalPrice,
    avlSrc,
    bookable,
    hasExtraService,
    extraBaggageAllowedPTC,
    fareTag,
    brandedFares,
    notes,
  } = props.data;
  const flightType = props.flightType;
  const amountChange = props.amountChange;
  let currency = props.currency;
  let checkList = props.checkList;
  const clearAll = props.clearAll;
  const setClearAll = props.setClearAll;
  const currentPage = props.currentPage;
  const getFareRules = (uId, dir, itemCode, brandedFareRef) => {
    handleFareRules(uId, dir, itemCode, brandedFareRef);
  };

  const [idxD, setIdxD] = useState(0);
  const [idxA, setIdxA] = useState(0);
  const [idxD1, setIdxD1] = useState(0);
  const [idxD2, setIdxD2] = useState(0);
  const [idxD3, setIdxD3] = useState(0);
  const [idxD4, setIdxD4] = useState(0);
  const [idxD5, setIdxD5] = useState(0);
  const [idxD6, setIdxD6] = useState(0);
  const [direction0, setdirection0] = useState(directions[0][0]);
  const [direction1, setdirection1] = useState(
    directions.length > 1 ? directions[1][0] : []
  );
  const [direction2, setdirection2] = useState(
    directions.length > 2 ? directions[2][0] : []
  );
  const [direction3, setdirection3] = useState(
    directions.length > 3 ? directions[3][0] : []
  );
  const [direction4, setdirection4] = useState(
    directions.length > 4 ? directions[4][0] : []
  );
  const [direction5, setdirection5] = useState(
    directions.length > 5 ? directions[5][0] : []
  );

  useEffect(() => {
    setdirection0(directions[0][0]);
    setdirection1(directions.length > 1 ? directions[1][0] : []);
    setdirection2(directions.length > 2 ? directions[2][0] : []);
    setdirection3(directions.length > 3 ? directions[3][0] : []);
    setdirection4(directions.length > 4 ? directions[4][0] : []);
    setdirection5(directions.length > 5 ? directions[5][0] : []);
    setIdxD(0);
    setIdxA(0);
    setIdxD1(0);
    setIdxD2(0);
    setIdxD3(0);
    setIdxD4(0);
    setIdxD5(0);
    setIdxD6(0);
    if (directions.length === 1) {
      document.getElementById(props.index + "oneway0").checked = true;
    }
    if (directions.length === 2) {
      document.getElementById(props.index + "oneway0").checked = true;
      document.getElementById(props.index + "twoway0").checked = true;
    }
    if (directions.length === 3) {
      document.getElementById(props.index + "oneway0").checked = true;
      document.getElementById(props.index + "twoway0").checked = true;
      document.getElementById(props.index + "threeway0").checked = true;
    }
    if (directions.length === 4) {
      document.getElementById(props.index + "oneway0").checked = true;
      document.getElementById(props.index + "twoway0").checked = true;
      document.getElementById(props.index + "threeway0").checked = true;
      document.getElementById(props.index + "fourway0").checked = true;
    }
    if (directions.length === 5) {
      document.getElementById(props.index + "oneway0").checked = true;
      document.getElementById(props.index + "twoway0").checked = true;
      document.getElementById(props.index + "threeway0").checked = true;
      document.getElementById(props.index + "fourway0").checked = true;
      document.getElementById(props.index + "fiveway0").checked = true;
    }
    if (directions.length === 6) {
      document.getElementById(props.index + "oneway0").checked = true;
      document.getElementById(props.index + "twoway0").checked = true;
      document.getElementById(props.index + "threeway0").checked = true;
      document.getElementById(props.index + "fourway0").checked = true;
      document.getElementById(props.index + "fiveway0").checked = true;
      document.getElementById(props.index + "sixway0").checked = true;
    }
  }, [directions, props.index]);

  const selectDirectionOption0 = (id) => {
    checkList.map((item, index) => {
      if (item.itemCodeRef === props.data.itemCodeRef) {
        indexNumber = index;
        return index;
      }
    });
    if (indexNumber === 0 && checkList.length === 3) {
      const one = JSON.parse(sessionStorage.getItem("one"));
      sessionStorage.setItem("one", JSON.stringify([id, one[1], one[2]]));
    } else if (indexNumber === 1 && checkList.length === 3) {
      const one = JSON.parse(sessionStorage.getItem("one"));
      sessionStorage.setItem("one", JSON.stringify([one[0], id, one[2]]));
    } else if (indexNumber === 2 && checkList.length === 3) {
      const one = JSON.parse(sessionStorage.getItem("one"));
      sessionStorage.setItem("one", JSON.stringify([one[0], one[1], id]));
    } else if (indexNumber === 0 && checkList.length === 2) {
      const one = JSON.parse(sessionStorage.getItem("one"));
      sessionStorage.setItem("one", JSON.stringify([id, one[1]]));
    } else if (indexNumber === 1 && checkList.length === 2) {
      const one = JSON.parse(sessionStorage.getItem("one"));
      sessionStorage.setItem("one", JSON.stringify([one[0], id]));
    } else if (indexNumber === 0 && checkList.length === 1) {
      const one = JSON.parse(sessionStorage.getItem("one"));
      sessionStorage.setItem("one", JSON.stringify([id]));
    }
    setdirection0(directions[0][id]);
    setIdxD(id);
    setIdxD1(id);
  };
  const selectDirectionOption1 = (id) => {
    checkList.map((item, index) => {
      if (item.itemCodeRef === props.data.itemCodeRef) {
        indexNumber = index;
        return index;
      }
    });
    if (indexNumber === 0 && checkList.length === 3) {
      const two = JSON.parse(sessionStorage.getItem("two"));
      sessionStorage.setItem("two", JSON.stringify([id, two[1], two[2]]));
    } else if (indexNumber === 1 && checkList.length === 3) {
      const two = JSON.parse(sessionStorage.getItem("two"));
      sessionStorage.setItem("two", JSON.stringify([two[0], id, two[2]]));
    } else if (indexNumber === 2 && checkList.length === 3) {
      const two = JSON.parse(sessionStorage.getItem("two"));
      sessionStorage.setItem("two", JSON.stringify([two[0], two[1], id]));
    } else if (indexNumber === 0 && checkList.length === 2) {
      const two = JSON.parse(sessionStorage.getItem("two"));
      sessionStorage.setItem("two", JSON.stringify([id, two[1]]));
    } else if (indexNumber === 1 && checkList.length === 2) {
      const two = JSON.parse(sessionStorage.getItem("two"));
      sessionStorage.setItem("two", JSON.stringify([two[0], id]));
    } else if (indexNumber === 0 && checkList.length === 1) {
      const two = JSON.parse(sessionStorage.getItem("two"));
      sessionStorage.setItem("two", JSON.stringify([id]));
    }
    setdirection1(directions[1][id]);
    setIdxA(id);
    setIdxD2(id);
  };
  const selectDirectionOption2 = (id) => {
    checkList.map((item, index) => {
      if (item.itemCodeRef === props.data.itemCodeRef) {
        indexNumber = index;
        return index;
      }
    });
    if (indexNumber === 0 && checkList.length === 3) {
      const three = JSON.parse(sessionStorage.getItem("three"));
      sessionStorage.setItem("three", JSON.stringify([id, three[1], three[2]]));
    } else if (indexNumber === 1 && checkList.length === 3) {
      const three = JSON.parse(sessionStorage.getItem("three"));
      sessionStorage.setItem("three", JSON.stringify([three[0], id, three[2]]));
    } else if (indexNumber === 2 && checkList.length === 3) {
      const three = JSON.parse(sessionStorage.getItem("three"));
      sessionStorage.setItem("three", JSON.stringify([three[0], three[1], id]));
    } else if (indexNumber === 0 && checkList.length === 2) {
      const three = JSON.parse(sessionStorage.getItem("three"));
      sessionStorage.setItem("three", JSON.stringify([id, three[1]]));
    } else if (indexNumber === 1 && checkList.length === 2) {
      const three = JSON.parse(sessionStorage.getItem("three"));
      sessionStorage.setItem("three", JSON.stringify([three[0], id]));
    } else if (indexNumber === 0 && checkList.length === 1) {
      const three = JSON.parse(sessionStorage.getItem("three"));
      sessionStorage.setItem("three", JSON.stringify([id]));
    }
    setdirection2(directions[2][id]);
    setIdxD3(id);
  };
  const selectDirectionOption3 = (id) => {
    checkList.map((item, index) => {
      if (item.itemCodeRef === props.data.itemCodeRef) {
        indexNumber = index;
        return index;
      }
    });
    if (indexNumber === 0 && checkList.length === 3) {
      const four = JSON.parse(sessionStorage.getItem("four"));
      sessionStorage.setItem("four", JSON.stringify([id, four[1], four[2]]));
    } else if (indexNumber === 1 && checkList.length === 3) {
      const four = JSON.parse(sessionStorage.getItem("four"));
      sessionStorage.setItem("four", JSON.stringify([four[0], id, four[2]]));
    } else if (indexNumber === 2 && checkList.length === 3) {
      const four = JSON.parse(sessionStorage.getItem("four"));
      sessionStorage.setItem("four", JSON.stringify([four[0], four[1], id]));
    } else if (indexNumber === 0 && checkList.length === 2) {
      const four = JSON.parse(sessionStorage.getItem("four"));
      sessionStorage.setItem("four", JSON.stringify([id, four[1]]));
    } else if (indexNumber === 1 && checkList.length === 2) {
      const four = JSON.parse(sessionStorage.getItem("four"));
      sessionStorage.setItem("four", JSON.stringify([four[0], id]));
    } else if (indexNumber === 0 && checkList.length === 1) {
      const four = JSON.parse(sessionStorage.getItem("four"));
      sessionStorage.setItem("four", JSON.stringify([id]));
    }
    setdirection3(directions[3][id]);
    setIdxD4(id);
  };
  const selectDirectionOption4 = (id) => {
    checkList.map((item, index) => {
      if (item.itemCodeRef === props.data.itemCodeRef) {
        indexNumber = index;
        return index;
      }
    });
    if (indexNumber === 0 && checkList.length === 3) {
      const five = JSON.parse(sessionStorage.getItem("five"));
      sessionStorage.setItem("five", JSON.stringify([id, five[1], five[2]]));
    } else if (indexNumber === 1 && checkList.length === 3) {
      const five = JSON.parse(sessionStorage.getItem("five"));
      sessionStorage.setItem("five", JSON.stringify([five[0], id, five[2]]));
    } else if (indexNumber === 2 && checkList.length === 3) {
      const five = JSON.parse(sessionStorage.getItem("five"));
      sessionStorage.setItem("five", JSON.stringify([five[0], five[1], id]));
    } else if (indexNumber === 0 && checkList.length === 2) {
      const five = JSON.parse(sessionStorage.getItem("five"));
      sessionStorage.setItem("five", JSON.stringify([id, five[1]]));
    } else if (indexNumber === 1 && checkList.length === 2) {
      const five = JSON.parse(sessionStorage.getItem("five"));
      sessionStorage.setItem("five", JSON.stringify([five[0], id]));
    } else if (indexNumber === 0 && checkList.length === 1) {
      const five = JSON.parse(sessionStorage.getItem("five"));
      sessionStorage.setItem("five", JSON.stringify([id]));
    }
    setdirection4(directions[4][id]);
    setIdxD5(id);
  };
  const selectDirectionOption5 = (id) => {
    checkList.map((item, index) => {
      if (item.itemCodeRef === props.data.itemCodeRef) {
        indexNumber = index;
        return index;
      }
    });
    if (indexNumber === 0 && checkList.length === 3) {
      const six = JSON.parse(sessionStorage.getItem("six"));
      sessionStorage.setItem("six", JSON.stringify([id, six[1], six[2]]));
    } else if (indexNumber === 1 && checkList.length === 3) {
      const six = JSON.parse(sessionStorage.getItem("six"));
      sessionStorage.setItem("six", JSON.stringify([six[0], id, six[2]]));
    } else if (indexNumber === 2 && checkList.length === 3) {
      const six = JSON.parse(sessionStorage.getItem("six"));
      sessionStorage.setItem("six", JSON.stringify([six[0], six[1], id]));
    } else if (indexNumber === 0 && checkList.length === 2) {
      const six = JSON.parse(sessionStorage.getItem("six"));
      sessionStorage.setItem("six", JSON.stringify([id, six[1]]));
    } else if (indexNumber === 1 && checkList.length === 2) {
      const six = JSON.parse(sessionStorage.getItem("six"));
      sessionStorage.setItem("six", JSON.stringify([six[0], id]));
    } else if (indexNumber === 0 && checkList.length === 1) {
      const six = JSON.parse(sessionStorage.getItem("six"));
      sessionStorage.setItem("six", JSON.stringify([id]));
    }
    setdirection5(directions[5][id]);
    setIdxD6(id);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();

  const handleSelectFlight = () => {
    // !moment(direction1.segments[0].departure)
    // .subtract(1, 'hour')
    // .isAfter(moment(direction0.segments[0].arrival))
    if (
      directions?.length === 2 &&
      moment(direction0.segments[0].departure).format("DD-MMM-YYYY") ===
        moment(direction1.segments[0].departure).format("DD-MMM-YYYY") &&
      moment(direction1.segments[0].departure).diff(
        moment(direction0.segments[direction0.segments.length - 1].arrival),
        "minute"
      ) < 60
    ) {
      onOpen();
      return;
    }
    sessionStorage.setItem("fullObj", JSON.stringify(props?.data));
    sessionStorage.setItem("hasExtraService", JSON.stringify(hasExtraService));
    sessionStorage.setItem(
      "extraBaggageAllowedPTC",
      JSON.stringify(extraBaggageAllowedPTC)
    );
    sessionStorage.setItem(
      "brandedFareSelectedIdx",
      JSON.stringify(
        brandedFares !== undefined &&
          brandedFares !== null &&
          brandedFares.length > 0
          ? selectedBrandedFareIdx
          : null
      )
    );
    sessionStorage.setItem(
      "brandedFareList",
      JSON.stringify(
        brandedFares !== undefined &&
          brandedFares !== null &&
          brandedFares.length > 0
          ? brandedFares
          : null
      )
    );
    sessionStorage.setItem("uniqueTransID", JSON.stringify(uniqueTransID));
    sessionStorage.setItem("bookable", JSON.stringify(bookable));
    sessionStorage.setItem("itemCodeRef", JSON.stringify(itemCodeRef));
    sessionStorage.setItem("direction0", JSON.stringify(direction0));
    sessionStorage.setItem("direction1", JSON.stringify(direction1));
    sessionStorage.setItem("direction2", JSON.stringify(direction2));
    sessionStorage.setItem("direction3", JSON.stringify(direction3));
    sessionStorage.setItem("direction4", JSON.stringify(direction4));
    sessionStorage.setItem("direction5", JSON.stringify(direction5));
    sessionStorage.setItem(
      "totalPrice",
      JSON.stringify(
        brandedFares !== null &&
          brandedFares !== undefined &&
          brandedFares?.length > 0
          ? brandedFares[selectedBrandedFareIdx]?.totalFare
          : totalPrice
      )
    );
    sessionStorage.setItem("passengerFares", JSON.stringify(passengerFares));
    sessionStorage.setItem("passengerCounts", JSON.stringify(passengerCounts));
    sessionStorage.setItem(
      "bookingComponents",
      JSON.stringify(bookingComponents)
    );
    sessionStorage.setItem("refundable", JSON.stringify(refundable));
    if (
      directions?.length === 2 &&
      moment(direction0.segments[0].departure).format("DD-MMM-YYYY") ===
        moment(direction1.segments[0].departure).format("DD-MMM-YYYY") &&
      moment(direction1.segments[0].departure).diff(
        moment(direction0.segments[direction0.segments.length - 1].arrival),
        "hour"
      ) < 2
    ) {
      onOpen1();
      return;
    }

    function processDirection(direction) {
      if (direction) {
        let shouldExit = false;
        direction?.segments?.forEach((item) => {
          if (!checkCabinClass(item?.cabinClass, searchData.travelClass)) {
            onOpen2();
            shouldExit = true;
          }
        });
        if (shouldExit) {
          return true;
        }
      }
      return false;
    }

    if (
      processDirection(direction0) ||
      processDirection(direction1) ||
      processDirection(direction2) ||
      processDirection(direction3) ||
      processDirection(direction4) ||
      processDirection(direction5)
    ) {
      return;
    }

    function processBrandedCabinClass() {
      if (brandedFares[selectedBrandedFareIdx]?.cabinClasses) {
        let shouldExit = false;
        Object.keys(brandedFares[selectedBrandedFareIdx]?.cabinClasses).map(
          (obj) => {
            if (
              !checkCabinClass(
                brandedFares[selectedBrandedFareIdx]?.cabinClasses[obj],
                searchData.travelClass
              )
            ) {
              onOpen2();
              shouldExit = true;
            }
          }
        );
        if (shouldExit) {
          return true;
        }
      }
      return false;
    }
    if (
      brandedFares !== null &&
      brandedFares !== undefined &&
      brandedFares?.length > 0
    ) {
      if (processBrandedCabinClass()) {
        return;
      }
    }

    navigate("/travellcart");
  };

  useEffect(() => {
    $("#select-flight-click" + props.index).click(function () {
      sessionStorage.setItem("uniqueTransID", JSON.stringify(uniqueTransID));
      sessionStorage.setItem("itemCodeRef", JSON.stringify(itemCodeRef));
      sessionStorage.setItem("direction0", JSON.stringify(direction0));
      sessionStorage.setItem("direction1", JSON.stringify(direction1));
      sessionStorage.setItem("direction2", JSON.stringify(direction2));
      sessionStorage.setItem("direction3", JSON.stringify(direction3));
      sessionStorage.setItem("direction4", JSON.stringify(direction4));
      sessionStorage.setItem("direction5", JSON.stringify(direction5));
      sessionStorage.setItem("totalPrice", JSON.stringify(totalPrice));
      sessionStorage.setItem("passengerFares", JSON.stringify(passengerFares));
      sessionStorage.setItem(
        "passengerCounts",
        JSON.stringify(passengerCounts)
      );
      sessionStorage.setItem(
        "bookingComponents",
        JSON.stringify(bookingComponents)
      );
      sessionStorage.setItem("refundable", JSON.stringify(refundable));
    });

    $("#select-flight-t-click" + props.index).click(function () {});

    $("#passengerBrackdown" + props.index).hide();
    $("#priceDown" + props.index).click(function () {
      $("#passengerBrackdown" + props.index).toggle("slow");
    });

    $("#check-price-click" + props.index).click(function () {
      $("#rotate-click" + props.index).toggleClass("down");
      $("#check-price" + props.index).toggle();
    });
    $("#rotate-click" + props.index).click(function () {
      $(this).toggleClass("down");
      $("#check-price" + props.index).toggle();
    });

    $("#check-price-t-click" + props.index).click(function () {
      $("#rotate-t-click" + props.index).toggleClass("down");
      $("#check-t-price" + props.index).toggle();
    });

    $("#rotate-t-click" + props.index).click(function () {
      $(this).toggleClass("down");
      $("#check-t-price" + props.index).toggle();
    });

    $("#flight" + props.index).show();
    $("#baggage" + props.index).hide();
    $("#cancel" + props.index).hide();
    $("#fare" + props.index).hide();

    $("#flightId" + props.index).click(function () {
      $("#flight" + props.index).show();
      $("#baggage" + props.index).hide();
      $("#cancel" + props.index).hide();
      $("#fare" + props.index).hide();
    });
    $("#baggageId" + props.index).click(function () {
      $("#flight" + props.index).hide();
      $("#baggage" + props.index).show();
      $("#cancel" + props.index).hide();
      $("#fare" + props.index).hide();
    });
    $("#changeId" + props.index).click(function () {
      $("#flight" + props.index).hide();
      $("#baggage" + props.index).hide();
      $("#cancel" + props.index).show();
      $("#fare" + props.index).hide();
    });
    $("#fareId" + props.index).click(function () {
      $("#flight" + props.index).hide();
      $("#baggage" + props.index).hide();
      $("#cancel" + props.index).hide();
      $("#fare" + props.index).show();
    });
  }, [props.index]);

  const refCheck = useRef();
  let indexNumber;
  const handleCheckBox = (e) => {
    if (checkList.length === 0) {
      sessionStorage.setItem("one", JSON.stringify([idxD1]));
      sessionStorage.setItem("two", JSON.stringify([idxD2]));
      sessionStorage.setItem("three", JSON.stringify([idxD3]));
      sessionStorage.setItem("four", JSON.stringify([idxD4]));
      sessionStorage.setItem("five", JSON.stringify([idxD5]));
      sessionStorage.setItem("six", JSON.stringify([idxD6]));
    } else if (checkList.length === 1) {
      const one = JSON.parse(sessionStorage.getItem("one"));
      const two = JSON.parse(sessionStorage.getItem("two"));
      const three = JSON.parse(sessionStorage.getItem("three"));
      const four = JSON.parse(sessionStorage.getItem("four"));
      const five = JSON.parse(sessionStorage.getItem("five"));
      const six = JSON.parse(sessionStorage.getItem("six"));
      sessionStorage.setItem("one", JSON.stringify([one[0], idxD1]));
      sessionStorage.setItem("two", JSON.stringify([two[0], idxD2]));
      sessionStorage.setItem("three", JSON.stringify([three[0], idxD3]));
      sessionStorage.setItem("four", JSON.stringify([four[0], idxD4]));
      sessionStorage.setItem("five", JSON.stringify([five[0], idxD5]));
      sessionStorage.setItem("six", JSON.stringify([six[0], idxD6]));
    } else if (checkList.length === 2) {
      const one = JSON.parse(sessionStorage.getItem("one"));
      const two = JSON.parse(sessionStorage.getItem("two"));
      const three = JSON.parse(sessionStorage.getItem("three"));
      const four = JSON.parse(sessionStorage.getItem("four"));
      const five = JSON.parse(sessionStorage.getItem("five"));
      const six = JSON.parse(sessionStorage.getItem("six"));
      sessionStorage.setItem("one", JSON.stringify([one[0], one[1], idxD1]));
      sessionStorage.setItem("two", JSON.stringify([two[0], two[1], idxD2]));
      sessionStorage.setItem(
        "three",
        JSON.stringify([three[0], three[1], idxD3])
      );
      sessionStorage.setItem("four", JSON.stringify([four[0], four[1], idxD4]));
      sessionStorage.setItem("five", JSON.stringify([five[0], five[1], idxD5]));
      sessionStorage.setItem("six", JSON.stringify([six[0], six[1], idxD6]));
    }
    setClearAll(false);
    const checked = e.target.checked;
    if (checked) {
      if (checkList.length >= 3) {
        toast.error("Sorry! You can't select more then three.");
        refCheck.current.checked = false;
        return;
      }
      checkList.push({
        ...props.data,
        brandedFareIdx:
          brandedFares !== null &&
          brandedFares !== undefined &&
          brandedFares?.length > 0
            ? selectedBrandedFareIdx
            : null,
      });
      setCount(checkList.length);
      sessionStorage.setItem("checkList", JSON.stringify(checkList));
    } else {
      checkList.map((item, index) => {
        if (item.itemCodeRef === props.data.itemCodeRef) {
          indexNumber = index;
          return index;
        }
      });
      const flightListString = sessionStorage.getItem("checkList");
      let flightList = flightListString ? JSON.parse(flightListString) : [];
      const checkListPOP = flightList?.filter(
        (item) => item.itemCodeRef !== props.data.itemCodeRef
      );
      if (indexNumber === 0 && checkListPOP.length === 2) {
        const one = JSON.parse(sessionStorage.getItem("one"));
        const two = JSON.parse(sessionStorage.getItem("two"));
        const three = JSON.parse(sessionStorage.getItem("three"));
        const four = JSON.parse(sessionStorage.getItem("four"));
        const five = JSON.parse(sessionStorage.getItem("five"));
        const six = JSON.parse(sessionStorage.getItem("six"));
        sessionStorage.setItem("one", JSON.stringify([one[1], one[2]]));
        sessionStorage.setItem("two", JSON.stringify([two[1], two[2]]));
        sessionStorage.setItem("three", JSON.stringify([three[1], three[2]]));
        sessionStorage.setItem("four", JSON.stringify([four[1], four[2]]));
        sessionStorage.setItem("five", JSON.stringify([five[1], five[2]]));
        sessionStorage.setItem("six", JSON.stringify([six[1], six[2]]));
      } else if (indexNumber === 1 && checkListPOP.length === 2) {
        const one = JSON.parse(sessionStorage.getItem("one"));
        const two = JSON.parse(sessionStorage.getItem("two"));
        const three = JSON.parse(sessionStorage.getItem("three"));
        const four = JSON.parse(sessionStorage.getItem("four"));
        const five = JSON.parse(sessionStorage.getItem("five"));
        const six = JSON.parse(sessionStorage.getItem("six"));
        sessionStorage.setItem("one", JSON.stringify([one[0], one[2]]));
        sessionStorage.setItem("two", JSON.stringify([two[0], two[2]]));
        sessionStorage.setItem("three", JSON.stringify([three[0], three[2]]));
        sessionStorage.setItem("four", JSON.stringify([four[0], four[2]]));
        sessionStorage.setItem("five", JSON.stringify([five[0], five[2]]));
        sessionStorage.setItem("six", JSON.stringify([six[0], six[2]]));
      } else if (indexNumber === 2 && checkListPOP.length === 2) {
        const one = JSON.parse(sessionStorage.getItem("one"));
        const two = JSON.parse(sessionStorage.getItem("two"));
        const three = JSON.parse(sessionStorage.getItem("three"));
        const four = JSON.parse(sessionStorage.getItem("four"));
        const five = JSON.parse(sessionStorage.getItem("five"));
        const six = JSON.parse(sessionStorage.getItem("six"));
        sessionStorage.setItem("one", JSON.stringify([one[0], one[1]]));
        sessionStorage.setItem("two", JSON.stringify([two[0], two[1]]));
        sessionStorage.setItem("three", JSON.stringify([three[0], three[1]]));
        sessionStorage.setItem("four", JSON.stringify([four[0], four[1]]));
        sessionStorage.setItem("five", JSON.stringify([five[0], five[1]]));
        sessionStorage.setItem("six", JSON.stringify([six[0], six[1]]));
      } else if (indexNumber === 0 && checkListPOP.length === 1) {
        const one = JSON.parse(sessionStorage.getItem("one"));
        const two = JSON.parse(sessionStorage.getItem("two"));
        const three = JSON.parse(sessionStorage.getItem("three"));
        const four = JSON.parse(sessionStorage.getItem("four"));
        const five = JSON.parse(sessionStorage.getItem("five"));
        const six = JSON.parse(sessionStorage.getItem("six"));
        sessionStorage.setItem("one", JSON.stringify([one[1]]));
        sessionStorage.setItem("two", JSON.stringify([two[1]]));
        sessionStorage.setItem("three", JSON.stringify([three[1]]));
        sessionStorage.setItem("four", JSON.stringify([four[1]]));
        sessionStorage.setItem("five", JSON.stringify([five[1]]));
        sessionStorage.setItem("six", JSON.stringify([six[1]]));
      } else if (indexNumber === 1 && checkListPOP.length === 1) {
        const one = JSON.parse(sessionStorage.getItem("one"));
        const two = JSON.parse(sessionStorage.getItem("two"));
        const three = JSON.parse(sessionStorage.getItem("three"));
        const four = JSON.parse(sessionStorage.getItem("four"));
        const five = JSON.parse(sessionStorage.getItem("five"));
        const six = JSON.parse(sessionStorage.getItem("six"));
        sessionStorage.setItem("one", JSON.stringify([one[0]]));
        sessionStorage.setItem("two", JSON.stringify([two[0]]));
        sessionStorage.setItem("three", JSON.stringify([three[0]]));
        sessionStorage.setItem("four", JSON.stringify([four[0]]));
        sessionStorage.setItem("five", JSON.stringify([five[0]]));
        sessionStorage.setItem("six", JSON.stringify([six[0]]));
      } else if (checkListPOP.length === 0) {
        sessionStorage.setItem("one", JSON.stringify([]));
        sessionStorage.setItem("two", JSON.stringify([]));
        sessionStorage.setItem("three", JSON.stringify([]));
        sessionStorage.setItem("four", JSON.stringify([]));
        sessionStorage.setItem("five", JSON.stringify([]));
        sessionStorage.setItem("six", JSON.stringify([]));
      }
      checkList.splice(0, checkList.length, ...checkListPOP);
      setCount(checkListPOP.length);
      sessionStorage.setItem("checkList", JSON.stringify(checkList));
    }
  };

  const isTempInspector = sessionStorage.getItem("isTempInspector");
  //BAGGAGE RESPONSE
  if (clearAll === true && refCheck.current?.checked) {
    refCheck.current.checked = false;
  }

  const [brandedFareToggle, setBrandedFareToggle] = useState(false);
  const [selectedBrandedFareIdx, setSelectedBrandedFareIdx] = useState(0);

  useEffect(() => {
    setBrandedFareToggle(false);
    setSelectedBrandedFareIdx(0);
  }, [currentPage]);

  useEffect(() => {
    const flightListString = sessionStorage.getItem("checkList");
    let flightList = flightListString ? JSON.parse(flightListString) : [];
    const updatedList = flightList.map((item) => ({
      ...item,
      brandedFareIdx:
        item.itemCodeRef === props.data.itemCodeRef
          ? selectedBrandedFareIdx
          : item?.brandedFareIdx,
    }));
    checkList.forEach((item) => {
      if (item.itemCodeRef === props.data.itemCodeRef) {
        item.brandedFareIdx = selectedBrandedFareIdx;
      } else {
        item.brandedFareIdx = item.brandedFareIdx;
      }
    });
    sessionStorage.setItem("checkList", JSON.stringify(updatedList));
  }, [selectedBrandedFareIdx]);

  //rbd change new fetures
  const {
    isOpen: isOpen4,
    onOpen: onOpen4,
    onClose: onClose4,
  } = useDisclosure();
  const [bookingClasses, setBookingClasses] = useState({});
  const btnRef = React.useRef();

  const handleChangeBookingClass = async () => {
    let bookingClassNames = [];
    try {
      let payload = {
        itemCodeRef: itemCodeRef,
        uniqueTransId: uniqueTransID,
        itemCodeDetail: null,
        tripRequests: [],
      };
      if (Object.keys(direction0).length > 0) {
        let segmentRefs = [];
        let bookingClass = [];
        direction0.segments.map((i) => segmentRefs.push(i.segmentCodeRef));
        direction0.segments.map((i) =>
          bookingClass.push({
            rbd: i.bookingClass,
            segmentRef: i.segmentCodeRef,
          })
        );
        bookingClassNames.push(bookingClass);
        payload.tripRequests.push({
          segmentRefs: segmentRefs,
        });
      }
      if (Object.keys(direction1).length > 0) {
        let segmentRefs = [];
        let bookingClass = [];
        direction1.segments.map((i) => segmentRefs.push(i.segmentCodeRef));
        direction1.segments.map((i) =>
          bookingClass.push({
            rbd: i.bookingClass,
            segmentRef: i.segmentCodeRef,
          })
        );
        bookingClassNames.push(bookingClass);
        payload.tripRequests.push({
          segmentRefs: segmentRefs,
        });
      }
      if (Object.keys(direction2).length > 0) {
        let segmentRefs = [];
        let bookingClass = [];
        direction2.segments.map((i) => segmentRefs.push(i.segmentCodeRef));
        direction2.segments.map((i) =>
          bookingClass.push({
            rbd: i.bookingClass,
            segmentRef: i.segmentCodeRef,
          })
        );
        bookingClassNames.push(bookingClass);
        payload.tripRequests.push({
          segmentRefs: segmentRefs,
        });
      }
      if (Object.keys(direction3).length > 0) {
        let segmentRefs = [];
        let bookingClass = [];
        direction3.segments.map((i) => segmentRefs.push(i.segmentCodeRef));
        direction3.segments.map((i) =>
          bookingClass.push({
            rbd: i.bookingClass,
            segmentRef: i.segmentCodeRef,
          })
        );
        bookingClassNames.push(bookingClass);
        payload.tripRequests.push({
          segmentRefs: segmentRefs,
        });
      }
      if (Object.keys(direction4).length > 0) {
        let segmentRefs = [];
        let bookingClass = [];
        direction4.segments.map((i) => segmentRefs.push(i.segmentCodeRef));
        direction4.segments.map((i) =>
          bookingClass.push({
            rbd: i.bookingClass,
            segmentRef: i.segmentCodeRef,
          })
        );
        bookingClassNames.push(bookingClass);
        payload.tripRequests.push({
          segmentRefs: segmentRefs,
        });
      }
      if (Object.keys(direction5).length > 0) {
        let segmentRefs = [];
        let bookingClass = [];
        direction5.segments.map((i) => segmentRefs.push(i.segmentCodeRef));
        direction5.segments.map((i) =>
          bookingClassNames.push({
            rbd: i.bookingClass,
            segmentRef: i.segmentCodeRef,
          })
        );
        bookingClassNames.push(bookingClass);
        payload.tripRequests.push({
          segmentRefs: segmentRefs,
        });
      }
      if (Object.keys(direction0).length > 0) {
      }
      setSelectedNames(bookingClassNames);
      const response = await bookingcodes(payload);
      if (response.data) {
        setBookingClasses(response.data);
        onOpen4();
      }
    } catch (e) {
      toast.error("Please try again.");
    }
  };

  const [selectedNames, setSelectedNames] = useState([]);

  const handleSelect = (rbd, index, segIndex) => {
    const updatedNames = [...selectedNames];
    if (updatedNames[index]?.[segIndex]?.rbd === rbd) {
      updatedNames[index][segIndex] = null;
    } else {
      updatedNames[index][segIndex] = {
        ...updatedNames[index][segIndex],
        rbd: rbd,
      };
    }
    setSelectedNames(updatedNames);
  };

  const [newBookingClassRes, setNewBookingClassRes] = useState({});
  const handleGetFare = async () => {
    try {
      let payload = {
        uniqueTransID: uniqueTransID,
        itemCodeRef: itemCodeRef,
        segmentList: selectedNames,
      };
      const response = await validateCheck(payload);
      setNewBookingClassRes(response?.data);
    } catch (e) {
      toast.error("Please try again.");
    }
  };

  const handleNewBookingClassBookBtn = () => {
    sessionStorage.setItem("fullObj", JSON.stringify(newBookingClassRes));
    sessionStorage.setItem(
      "uniqueTransID",
      JSON.stringify(newBookingClassRes?.uniqueTransID)
    );
    sessionStorage.setItem(
      "bookable",
      JSON.stringify(newBookingClassRes?.bookable)
    );
    sessionStorage.setItem(
      "itemCodeRef",
      JSON.stringify(newBookingClassRes?.itemCodeRef)
    );
    sessionStorage.setItem(
      "direction0",
      JSON.stringify(newBookingClassRes?.directions[0][0])
    );
    sessionStorage.setItem(
      "direction1",
      JSON.stringify(
        newBookingClassRes?.directions?.length > 1
          ? newBookingClassRes?.directions[1][0]
          : []
      )
    );
    sessionStorage.setItem(
      "direction2",
      JSON.stringify(
        newBookingClassRes?.directions?.length > 2
          ? newBookingClassRes?.directions[2][0]
          : []
      )
    );
    sessionStorage.setItem(
      "direction3",
      JSON.stringify(
        newBookingClassRes?.directions?.length > 3
          ? newBookingClassRes?.directions[3][0]
          : []
      )
    );
    sessionStorage.setItem(
      "direction4",
      JSON.stringify(
        newBookingClassRes?.directions?.length > 4
          ? newBookingClassRes?.directions[4][0]
          : []
      )
    );
    sessionStorage.setItem(
      "direction5",
      JSON.stringify(
        newBookingClassRes?.directions?.length > 5
          ? newBookingClassRes?.directions[5][0]
          : []
      )
    );
    sessionStorage.setItem(
      "totalPrice",
      JSON.stringify(
        newBookingClassRes?.brandedFares !== null &&
          newBookingClassRes?.brandedFares !== undefined &&
          newBookingClassRes?.brandedFares?.length > 0
          ? newBookingClassRes?.brandedFares[selectedBrandedFareIdx]?.totalFare
          : newBookingClassRes?.totalPrice
      )
    );
    sessionStorage.setItem(
      "passengerFares",
      JSON.stringify(newBookingClassRes?.passengerFares)
    );
    sessionStorage.setItem(
      "passengerCounts",
      JSON.stringify(newBookingClassRes?.passengerCounts)
    );
    sessionStorage.setItem(
      "bookingComponents",
      JSON.stringify(newBookingClassRes?.bookingComponents)
    );
    sessionStorage.setItem(
      "refundable",
      JSON.stringify(newBookingClassRes?.refundable)
    );
    navigate("/travellcart");
  };

  return (
    <>
      <>
        {/* Modal option */}
        <ShowModal
          key={props.index}
          flag={0}
          index={props.index}
          flightType={flightType}
          direction0={direction0}
          direction1={direction1}
          direction2={direction2}
          direction3={direction3}
          direction4={direction4}
          direction5={direction5}
          totalPrice={totalPrice}
          bookingComponents={bookingComponents}
          refundable={refundable}
          uniqueTransID={uniqueTransID}
          itemCodeRef={itemCodeRef}
          passengerCounts={passengerCounts}
          passengerFares={passengerFares}
          currency={currency}
          brandedFares={brandedFares}
          selectedBrandedFareIdx={selectedBrandedFareIdx}
          notes={notes}
        ></ShowModal>

        {/* show more section  */}

        {/* end of show more section */}

        {/* toggle option for hide */}
        <div
          className="row mb-5 mx-3 py-2 rounded box-shadow bg-white"
          id={"toggle-option" + props.index}
        >
          <div className="col-lg-10">
            <span className="text-start d-flex align-items-center gap-2 pb-2">
              <input
                ref={refCheck}
                type="checkbox"
                className="show-flight-checkbox"
                onClick={(e) => handleCheckBox(e)}
              />
              <span className="pt-2 fw-bold" style={{ fontSize: "14px" }}>
                Create Proposal
              </span>
            </span>

            {flightType === "Multi City" ? (
              <></>
            ) : (
              <>
                <div className="row">
                  <div className="col-lg-3 m-1">
                    <span className="text-white button-color py-1 px-3 text-center border-radius">
                      <span className="me-1">
                        <i className="fas fa-plane fa-sm"></i>
                      </span>
                      Departure
                    </span>
                  </div>
                </div>
              </>
            )}

            {flightType === "Multi City" ? (
              <>
                {directions[0].map((item, index) => (
                  <div key={index}>
                    {index === 0 ? (
                      <p className="text-white button-color py-1 m-1 fw-bold text-center border-radius">
                        <span className="me-1">
                          <i className="fas fa-plane fa-sm"></i>
                        </span>
                        Departure : {item.from} - {item.to}
                      </p>
                    ) : (
                      <></>
                    )}
                    <div
                      className={
                        index === idxD1
                          ? "border text-color m-1 selected-bg-color"
                          : "border text-color m-1"
                      }
                    >
                      <div className="row p-2">
                        <div className="col-lg-1 my-auto">
                          {airlinesCodeName(item)?.map((item, index) => (
                            <>
                              <img
                                src={
                                  environment.s3ArliensImage +
                                  `${item?.airlineCode}.png`
                                }
                                alt=""
                                width={index === 0 ? "40px" : "20px"}
                                height={index === 0 ? "40px" : "20px"}
                                className={
                                  index === 0
                                    ? "mb-1 rounded-2"
                                    : "mb-1 rounded-2 float-end"
                                }
                              />
                            </>
                          ))}
                        </div>
                        <div className="col-lg-2 my-auto">
                          {airlinesCodeName(item)?.map((itm, idx) =>
                            airlinesCodeName(item)?.length === 1 ? (
                              <>
                                <h6 className="my-auto flighttime">
                                  {item?.segments[0]?.airline}
                                </h6>
                                <h6 className="my-auto flighttime">
                                  {item?.segments[0]?.details[0]?.equipment}
                                </h6>
                                <h6 className="flighttime">
                                  {item?.segments[0]?.airlineCode} -{" "}
                                  {item?.segments[0]?.flightNumber}
                                </h6>
                              </>
                            ) : (
                              <div className="my-1">
                                <h6
                                  className={
                                    idx === 0
                                      ? "my-auto flighttime"
                                      : "my-auto flight"
                                  }
                                >
                                  {itm?.airline}
                                </h6>

                                <h6
                                  className={
                                    idx === 0
                                      ? "my-auto flighttime"
                                      : "my-auto flight"
                                  }
                                >
                                  {itm?.equipment}
                                </h6>
                                <h6
                                  className={
                                    idx === 0
                                      ? "my-auto flighttime"
                                      : "my-auto flight"
                                  }
                                >
                                  {itm?.airlineCode} - {itm?.flightNumber}
                                </h6>
                              </div>
                            )
                          )}
                        </div>
                        <div className="col-lg-2 my-auto">
                          <h6 className="fw-bold">
                            <span className="">{item.from}</span>
                            <span className="ms-1 ">
                              {item.segments[0].departure.substr(11, 5)}
                            </span>
                          </h6>
                          <h6 className="flighttime">
                            {moment(item.segments[0].departure).format(
                              "DD MMM,yyyy, ddd"
                            )}
                          </h6>
                          <h6 className="flighttime">
                            {airports
                              .filter((f) => f.iata === item.from)
                              .map((item) => item.city)}
                          </h6>
                        </div>
                        <div className="col-lg-4 my-auto">
                          <div className="row lh-1">
                            <div className="col-lg-12 text-center">
                              <span className="text-color font-size">
                                {/* {directions[0][0].segments.length === 1
                                  ? "Direct"
                                  : directions[0][0].segments.length -
                                  1 +
                                  " Stop"} */}

                                {directions[0][0].stops === 0 ? (
                                  "Direct"
                                ) : (
                                  <>{directions[0][0].stops + " Stop"}</>
                                )}
                              </span>
                            </div>
                            <div className="col-lg-12 text-center">
                              <span className="text-color">
                                <i className="fas fa-circle fa-xs"></i>
                                -----------------------
                                <i className="fas fa-plane fa-sm"></i>
                              </span>
                            </div>
                            <div className="col-lg-12 text-center">
                              <span
                                className={
                                  item?.segments[0]?.baggage[0] !== undefined
                                    ? "text-color me-5"
                                    : "text-color"
                                }
                              >
                                <i className="fas fa-clock fa-sm"></i>
                                <span className="ms-1 font-size">
                                  {/* {totalFlightDuration(item.segments)} */}
                                  {item.segments.length === 1
                                    ? totalFlightDuration(item.segments)
                                    : item.segments.length === 2
                                    ? addDurations([
                                        totalFlightDuration(item.segments),
                                        timeDuration(
                                          item.segments[0].arrival,
                                          item.segments[1].departure
                                        ),
                                      ])
                                    : item.segments.length === 3
                                    ? addDurations([
                                        totalFlightDuration(item.segments),
                                        timeDuration(
                                          item.segments[0].arrival,
                                          item.segments[1].departure
                                        ),
                                        timeDuration(
                                          item.segments[1].arrival,
                                          item.segments[2].departure
                                        ),
                                      ])
                                    : ""}
                                </span>
                              </span>
                              {item?.segments[0]?.baggage[0] !== undefined && (
                                <span className="text-color">
                                  <i className="fas fa-briefcase fa-sm"></i>
                                  <span className="ms-1 font-size">
                                    {item.segments[0].baggage[0]?.amount +
                                      " " +
                                      item.segments[0].baggage[0]?.units}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-2 my-auto">
                          <h6 className="fw-bold">
                            <span className="">{item.to}</span>
                            <span className="ms-1 ">
                              {item.segments[
                                item.segments.length - 1
                              ].arrival.substr(11, 5)}
                            </span>
                            <sup>
                              &nbsp;
                              {dayCount(
                                item.segments[item.segments.length - 1].arrival,
                                item.segments[0]?.departure
                              ) !== 0 ? (
                                <span
                                  className="text-danger"
                                  style={{ fontSize: "8px" }}
                                >
                                  +
                                  {dayCount(
                                    item.segments[item.segments.length - 1]
                                      .arrival,
                                    item.segments[0]?.departure
                                  )}
                                </span>
                              ) : (
                                ""
                              )}{" "}
                            </sup>
                          </h6>
                          <h6 className="flighttime">
                            {moment(
                              item.segments[item.segments.length - 1].arrival
                            ).format("DD MMM,yyyy, ddd")}
                          </h6>
                          <h6 className="flighttime">
                            {airports
                              .filter((f) => f.iata === item.to)
                              .map((item) => item.city)}
                          </h6>
                        </div>
                        <div className="col-lg-1 mx-auto my-auto">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              value={index}
                              name={"chooseoption0" + props.index}
                              onChange={() => selectDirectionOption0(index)}
                              defaultChecked={index === 0 ? true : false}
                              id={props.index + "oneway" + index}
                              // onChange={handleChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault2"
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {directions.length > 1 ? (
                  <>
                    {directions[1].map((item, index) => (
                      <>
                        {index === 0 ? (
                          <p className="text-white button-color py-1 m-1 fw-bold text-center border-radius">
                            <span className="me-1">
                              <i className="fas fa-plane fa-sm"></i>
                            </span>
                            Departure : {item.from} - {item.to}
                          </p>
                        ) : (
                          <></>
                        )}
                        <div
                          className={
                            index === idxD2
                              ? "border text-color m-1 selected-bg-color"
                              : "border text-color m-1"
                          }
                        >
                          <div className="row p-2">
                            <div className="col-lg-1 my-auto">
                              {airlinesCodeName(item)?.map((item, index) => (
                                <>
                                  <img
                                    src={
                                      environment.s3ArliensImage +
                                      `${item?.airlineCode}.png`
                                    }
                                    alt=""
                                    width={index === 0 ? "40px" : "20px"}
                                    height={index === 0 ? "40px" : "20px"}
                                    className={
                                      index === 0
                                        ? "mb-1 rounded-2"
                                        : "mb-1 rounded-2 float-end"
                                    }
                                  />
                                </>
                              ))}
                            </div>
                            <div className="col-lg-2 my-auto">
                              {airlinesCodeName(item)?.map((itm, idx) =>
                                airlinesCodeName(item)?.length === 1 ? (
                                  <>
                                    <h6 className="my-auto flighttime">
                                      {item?.segments[0]?.airline}
                                    </h6>
                                    <h6 className="my-auto flighttime">
                                      {item?.segments[0]?.details[0]?.equipment}
                                    </h6>
                                    <h6 className="flighttime">
                                      {item?.segments[0]?.airlineCode} -{" "}
                                      {item?.segments[0]?.flightNumber}
                                    </h6>
                                  </>
                                ) : (
                                  <div className="my-1">
                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.airline}
                                    </h6>

                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.equipment}
                                    </h6>
                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.airlineCode} - {itm?.flightNumber}
                                    </h6>
                                  </div>
                                )
                              )}
                            </div>
                            <div className="col-lg-2 my-auto">
                              <h6 className="fw-bold">
                                <span className="">{item.from}</span>
                                <span className="ms-1 ">
                                  {item.segments[0].departure.substr(11, 5)}
                                </span>
                              </h6>
                              <h6 className="flighttime">
                                {moment(item.segments[0].departure).format(
                                  "DD MMM,yyyy, ddd"
                                )}
                              </h6>
                              <h6 className="flighttime">
                                {airports
                                  .filter((f) => f.iata === item.from)
                                  .map((item) => item.city)}
                              </h6>
                            </div>
                            <div className="col-lg-4 my-auto">
                              <div className="row lh-1">
                                <div className="col-lg-12 text-center">
                                  <span className="text-color font-size">
                                    {/* {directions[0][0].segments.length === 1
                                      ? "Direct"
                                      : directions[0][0].segments.length -
                                      1 +
                                      " Stop"} */}
                                    {directions[1][0].stops === 0 ? (
                                      "Direct"
                                    ) : (
                                      <>{directions[1][0].stops + " Stop"}</>
                                    )}
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center">
                                  <span className="text-color">
                                    <i className="fas fa-circle fa-xs"></i>
                                    -----------------------
                                    <i className="fas fa-plane fa-sm"></i>
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center">
                                  <span
                                    className={
                                      item?.segments[0]?.baggage[0] !==
                                      undefined
                                        ? "text-color me-5"
                                        : "text-color"
                                    }
                                  >
                                    <i className="fas fa-clock fa-sm"></i>
                                    <span className="ms-1 font-size">
                                      {/* {totalFlightDuration(item.segments)} */}
                                      {item.segments.length === 1
                                        ? totalFlightDuration(item.segments)
                                        : item.segments.length === 2
                                        ? addDurations([
                                            totalFlightDuration(item.segments),
                                            timeDuration(
                                              item.segments[0].arrival,
                                              item.segments[1].departure
                                            ),
                                          ])
                                        : item.segments.length === 3
                                        ? addDurations([
                                            totalFlightDuration(item.segments),
                                            timeDuration(
                                              item.segments[0].arrival,
                                              item.segments[1].departure
                                            ),
                                            timeDuration(
                                              item.segments[1].arrival,
                                              item.segments[2].departure
                                            ),
                                          ])
                                        : ""}
                                    </span>
                                  </span>
                                  {item?.segments[0]?.baggage[0] !==
                                    undefined && (
                                    <span className="text-color">
                                      <i className="fas fa-briefcase fa-sm"></i>
                                      <span className="ms-1 font-size">
                                        {item.segments[0].baggage[0]?.amount +
                                          " " +
                                          item.segments[0].baggage[0]?.units}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2 my-auto">
                              <h6 className="fw-bold">
                                <span className="">{item.to}</span>
                                <span className="ms-1 ">
                                  {item.segments[
                                    item.segments.length - 1
                                  ].arrival.substr(11, 5)}
                                </span>
                                <sup>
                                  &nbsp;
                                  {dayCount(
                                    item.segments[item.segments.length - 1]
                                      .arrival,
                                    item.segments[0]?.departure
                                  ) !== 0 ? (
                                    <span
                                      className="text-danger"
                                      style={{ fontSize: "8px" }}
                                    >
                                      +
                                      {dayCount(
                                        item.segments[item.segments.length - 1]
                                          .arrival,
                                        item.segments[0]?.departure
                                      )}
                                    </span>
                                  ) : (
                                    ""
                                  )}{" "}
                                </sup>
                              </h6>
                              <h6 className="flighttime">
                                {moment(
                                  item.segments[item.segments.length - 1]
                                    .arrival
                                ).format("DD MMM,yyyy, ddd")}
                              </h6>
                              <h6 className="flighttime">
                                {airports
                                  .filter((f) => f.iata === item.to)
                                  .map((item) => item.city)}
                              </h6>
                            </div>
                            <div className="col-lg-1 mx-auto my-auto">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={index}
                                  name={"chooseoption1" + props.index}
                                  onChange={() => selectDirectionOption1(index)}
                                  defaultChecked={index === 0 ? true : false}
                                  id={props.index + "twoway" + index}
                                  // onChange={handleChange}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexRadioDefault2"
                                ></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </>
                ) : (
                  <></>
                )}
                {directions.length > 2 ? (
                  <>
                    {directions[2].map((item, index) => (
                      <>
                        {index === 0 ? (
                          <p className="text-white button-color py-1 m-1 fw-bold text-center border-radius">
                            <span className="me-1">
                              <i className="fas fa-plane fa-sm"></i>
                            </span>
                            Departure : {item.from} - {item.to}
                          </p>
                        ) : (
                          <></>
                        )}
                        <div
                          className={
                            index === idxD3
                              ? "border text-color m-1 selected-bg-color"
                              : "border text-color m-1"
                          }
                        >
                          <div className="row p-2">
                            <div className="col-lg-1 my-auto">
                              {airlinesCodeName(item)?.map((item, index) => (
                                <>
                                  <img
                                    src={
                                      environment.s3ArliensImage +
                                      `${item?.airlineCode}.png`
                                    }
                                    alt=""
                                    width={index === 0 ? "40px" : "20px"}
                                    height={index === 0 ? "40px" : "20px"}
                                    className={
                                      index === 0
                                        ? "mb-1 rounded-2"
                                        : "mb-1 rounded-2 float-end"
                                    }
                                  />
                                </>
                              ))}
                            </div>
                            <div className="col-lg-2 my-auto">
                              {airlinesCodeName(item)?.map((itm, idx) =>
                                airlinesCodeName(item)?.length === 1 ? (
                                  <>
                                    <h6 className="my-auto flighttime">
                                      {item?.segments[0]?.airline}
                                    </h6>
                                    <h6 className="my-auto flighttime">
                                      {item?.segments[0]?.details[0]?.equipment}
                                    </h6>
                                    <h6 className="flighttime">
                                      {item?.segments[0]?.airlineCode} -{" "}
                                      {item?.segments[0]?.flightNumber}
                                    </h6>
                                  </>
                                ) : (
                                  <div className="my-1">
                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.airline}
                                    </h6>

                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.equipment}
                                    </h6>
                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.airlineCode} - {itm?.flightNumber}
                                    </h6>
                                  </div>
                                )
                              )}
                            </div>
                            <div className="col-lg-2 my-auto">
                              <h6 className="fw-bold">
                                <span className="">{item.from}</span>
                                <span className="ms-1 ">
                                  {item.segments[0].departure.substr(11, 5)}
                                </span>
                              </h6>
                              <h6 className="flighttime">
                                {moment(item.segments[0].departure).format(
                                  "DD MMM,yyyy, ddd"
                                )}
                              </h6>
                              <h6 className="flighttime">
                                {airports
                                  .filter((f) => f.iata === item.from)
                                  .map((item) => item.city)}
                              </h6>
                            </div>
                            <div className="col-lg-4 my-auto">
                              <div className="row lh-1">
                                <div className="col-lg-12 text-center">
                                  <span className="text-color font-size">
                                    {/* {directions[0][0].segments.length === 1
                                      ? "Direct"
                                      : directions[0][0].segments.length -
                                      1 +
                                      " Stop"} */}
                                    {directions[2][0].stops === 0 ? (
                                      "Direct"
                                    ) : (
                                      <>{directions[2][0].stops + " Stop"}</>
                                    )}
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center">
                                  <span className="text-color">
                                    <i className="fas fa-circle fa-xs"></i>
                                    -----------------------
                                    <i className="fas fa-plane fa-sm"></i>
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center">
                                  <span
                                    className={
                                      item?.segments[0]?.baggage[0] !==
                                      undefined
                                        ? "text-color me-5"
                                        : "text-color"
                                    }
                                  >
                                    <i className="fas fa-clock fa-sm"></i>
                                    <span className="ms-1 font-size">
                                      {item.segments.length === 1
                                        ? totalFlightDuration(item.segments)
                                        : item.segments.length === 2
                                        ? addDurations([
                                            totalFlightDuration(item.segments),
                                            timeDuration(
                                              item.segments[0].arrival,
                                              item.segments[1].departure
                                            ),
                                          ])
                                        : item.segments.length === 3
                                        ? addDurations([
                                            totalFlightDuration(item.segments),
                                            timeDuration(
                                              item.segments[0].arrival,
                                              item.segments[1].departure
                                            ),
                                            timeDuration(
                                              item.segments[1].arrival,
                                              item.segments[2].departure
                                            ),
                                          ])
                                        : ""}
                                    </span>
                                  </span>
                                  {item?.segments[0]?.baggage[0] !==
                                    undefined && (
                                    <span className="text-color">
                                      <i className="fas fa-briefcase fa-sm"></i>
                                      <span className="ms-1 font-size">
                                        {item.segments[0].baggage[0]?.amount +
                                          " " +
                                          item.segments[0].baggage[0]?.units}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2 my-auto">
                              <h6 className="fw-bold">
                                <span className="">{item.to}</span>
                                <span className="ms-1 ">
                                  {item.segments[
                                    item.segments.length - 1
                                  ].arrival.substr(11, 5)}
                                </span>
                                <sup>
                                  &nbsp;
                                  {dayCount(
                                    item.segments[item.segments.length - 1]
                                      .arrival,
                                    item.segments[0]?.departure
                                  ) !== 0 ? (
                                    <span
                                      className="text-danger"
                                      style={{ fontSize: "8px" }}
                                    >
                                      +
                                      {dayCount(
                                        item.segments[item.segments.length - 1]
                                          .arrival,
                                        item.segments[0]?.departure
                                      )}
                                    </span>
                                  ) : (
                                    ""
                                  )}{" "}
                                </sup>
                              </h6>
                              <h6 className="flighttime">
                                {moment(
                                  item.segments[item.segments.length - 1]
                                    .arrival
                                ).format("DD MMM,yyyy, ddd")}
                              </h6>
                              <h6 className="flighttime">
                                {airports
                                  .filter((f) => f.iata === item.to)
                                  .map((item) => item.city)}
                              </h6>
                            </div>
                            <div className="col-lg-1 mx-auto my-auto">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={index}
                                  name={"chooseoption2" + props.index}
                                  onChange={() => selectDirectionOption2(index)}
                                  defaultChecked={index === 0 ? true : false}
                                  id={props.index + "threeway" + index}
                                  // onChange={handleChange}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexRadioDefault2"
                                ></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </>
                ) : (
                  <></>
                )}

                {directions.length > 3 ? (
                  <>
                    {directions[3].map((item, index) => (
                      <div key={index}>
                        {index === 0 ? (
                          <p className="text-white button-color py-1 m-1 fw-bold text-center border-radius">
                            <span className="me-1">
                              <i className="fas fa-plane fa-sm"></i>
                            </span>
                            Departure : {item.from} - {item.to}
                          </p>
                        ) : (
                          <></>
                        )}
                        <div
                          className={
                            index === idxD4
                              ? "border text-color m-1 selected-bg-color"
                              : "border text-color m-1"
                          }
                        >
                          <div className="row p-2">
                            <div className="col-lg-1 my-auto">
                              {airlinesCodeName(item)?.map((item, index) => (
                                <>
                                  <img
                                    src={
                                      environment.s3ArliensImage +
                                      `${item?.airlineCode}.png`
                                    }
                                    alt=""
                                    width={index === 0 ? "40px" : "20px"}
                                    height={index === 0 ? "40px" : "20px"}
                                    className={
                                      index === 0
                                        ? "mb-1 rounded-2"
                                        : "mb-1 rounded-2 float-end"
                                    }
                                  />
                                </>
                              ))}
                            </div>
                            <div className="col-lg-2 my-auto">
                              {airlinesCodeName(item)?.map((itm, idx) =>
                                airlinesCodeName(item)?.length === 1 ? (
                                  <>
                                    <h6 className="my-auto flighttime">
                                      {item?.segments[0]?.airline}
                                    </h6>
                                    <h6 className="my-auto flighttime">
                                      {item?.segments[0]?.details[0]?.equipment}
                                    </h6>
                                    <h6 className="flighttime">
                                      {item?.segments[0]?.airlineCode} -{" "}
                                      {item?.segments[0]?.flightNumber}
                                    </h6>
                                  </>
                                ) : (
                                  <div className="my-1">
                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.airline}
                                    </h6>

                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.equipment}
                                    </h6>
                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.airlineCode} - {itm?.flightNumber}
                                    </h6>
                                  </div>
                                )
                              )}
                            </div>
                            <div className="col-lg-2 my-auto">
                              <h6 className="fw-bold">
                                <span className="">{item.from}</span>
                                <span className="ms-1 ">
                                  {item.segments[0].departure.substr(11, 5)}
                                </span>
                              </h6>
                              <h6 className="flighttime">
                                {moment(item.segments[0].departure).format(
                                  "DD MMM,yyyy, ddd"
                                )}
                              </h6>
                              <h6 className="flighttime">
                                {airports
                                  .filter((f) => f.iata === item.from)
                                  .map((item) => item.city)}
                              </h6>
                            </div>
                            <div className="col-lg-4 my-auto">
                              <div className="row lh-1">
                                <div className="col-lg-12 text-center">
                                  <span className="text-color font-size">
                                    {/* {directions[0][0].segments.length === 1
                                      ? "Direct"
                                      : directions[0][0].segments.length -
                                      1 +
                                      " Stop"} */}
                                    {directions[3][0].stops === 0 ? (
                                      "Direct"
                                    ) : (
                                      <>{directions[3][0].stops + " Stop"}</>
                                    )}
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center">
                                  <span className="text-color">
                                    <i className="fas fa-circle fa-xs"></i>
                                    -----------------------
                                    <i className="fas fa-plane fa-sm"></i>
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center">
                                  <span className="text-color me-5">
                                    <i className="fas fa-clock fa-sm"></i>
                                    <span className="ms-1 font-size">
                                      {item.segments.length === 1
                                        ? totalFlightDuration(item.segments)
                                        : item.segments.length === 2
                                        ? addDurations([
                                            totalFlightDuration(item.segments),
                                            timeDuration(
                                              item.segments[0].arrival,
                                              item.segments[1].departure
                                            ),
                                          ])
                                        : item.segments.length === 3
                                        ? addDurations([
                                            totalFlightDuration(item.segments),
                                            timeDuration(
                                              item.segments[0].arrival,
                                              item.segments[1].departure
                                            ),
                                            timeDuration(
                                              item.segments[1].arrival,
                                              item.segments[2].departure
                                            ),
                                          ])
                                        : ""}
                                    </span>
                                  </span>
                                  <span className="text-color">
                                    <i className="fas fa-briefcase fa-sm"></i>
                                    <span className="ms-1 font-size">
                                      {item.segments[0].baggage[0]?.amount +
                                        " " +
                                        item.segments[0].baggage[0]?.units}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2 my-auto">
                              <h6 className="fw-bold">
                                <span className="">{item.to}</span>
                                <span className="ms-1 ">
                                  {item.segments[
                                    item.segments.length - 1
                                  ].arrival.substr(11, 5)}
                                </span>
                                <sup>
                                  &nbsp;
                                  {dayCount(
                                    item.segments[item.segments.length - 1]
                                      .arrival,
                                    item.segments[0]?.departure
                                  ) !== 0 ? (
                                    <span
                                      className="text-danger"
                                      style={{ fontSize: "8px" }}
                                    >
                                      +
                                      {dayCount(
                                        item.segments[item.segments.length - 1]
                                          .arrival,
                                        item.segments[0]?.departure
                                      )}
                                    </span>
                                  ) : (
                                    ""
                                  )}{" "}
                                </sup>
                              </h6>
                              <h6 className="flighttime">
                                {moment(
                                  item.segments[item.segments.length - 1]
                                    .arrival
                                ).format("DD MMM,yyyy, ddd")}
                              </h6>
                              <h6 className="flighttime">
                                {airports
                                  .filter((f) => f.iata === item.to)
                                  .map((item) => item.city)}
                              </h6>
                            </div>
                            <div className="col-lg-1 mx-auto my-auto">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={index}
                                  name={"chooseoption3" + props.index}
                                  onChange={() => selectDirectionOption3(index)}
                                  defaultChecked={index === 0 ? true : false}
                                  id={props.index + "fourway" + index}
                                  // onChange={handleChange}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexRadioDefault2"
                                ></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <></>
                )}
                {directions.length > 4 ? (
                  <>
                    {directions[4].map((item, index) => (
                      <div key={index}>
                        {index === 0 ? (
                          <p className="text-white button-color py-1 m-1 fw-bold text-center border-radius">
                            <span className="me-1">
                              <i className="fas fa-plane fa-sm"></i>
                            </span>
                            Departure : {item.from} - {item.to}
                          </p>
                        ) : (
                          <></>
                        )}
                        <div
                          className={
                            index === idxD5
                              ? "border text-color m-1 selected-bg-color"
                              : "border text-color m-1"
                          }
                        >
                          <div className="row p-2">
                            <div className="col-lg-1 my-auto">
                              {airlinesCodeName(item)?.map((item, index) => (
                                <>
                                  <img
                                    src={
                                      environment.s3ArliensImage +
                                      `${item?.airlineCode}.png`
                                    }
                                    alt=""
                                    width={index === 0 ? "40px" : "20px"}
                                    height={index === 0 ? "40px" : "20px"}
                                    className={
                                      index === 0
                                        ? "mb-1 rounded-2"
                                        : "mb-1 rounded-2 float-end"
                                    }
                                  />
                                </>
                              ))}
                            </div>
                            <div className="col-lg-2 my-auto">
                              {airlinesCodeName(item)?.map((itm, idx) =>
                                airlinesCodeName(item)?.length === 1 ? (
                                  <>
                                    <h6 className="my-auto flighttime">
                                      {item?.segments[0]?.airline}
                                    </h6>
                                    <h6 className="my-auto flighttime">
                                      {item?.segments[0]?.details[0]?.equipment}
                                    </h6>
                                    <h6 className="flighttime">
                                      {item?.segments[0]?.airlineCode} -{" "}
                                      {item?.segments[0]?.flightNumber}
                                    </h6>
                                  </>
                                ) : (
                                  <div className="my-1">
                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.airline}
                                    </h6>

                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.equipment}
                                    </h6>
                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.airlineCode} - {itm?.flightNumber}
                                    </h6>
                                  </div>
                                )
                              )}
                            </div>
                            <div className="col-lg-2 my-auto">
                              <h6 className="fw-bold">
                                <span className="">{item.from}</span>
                                <span className="ms-1 ">
                                  {item.segments[0].departure.substr(11, 5)}
                                </span>
                              </h6>
                              <h6 className="flighttime">
                                {moment(item.segments[0].departure).format(
                                  "DD MMM,yyyy, ddd"
                                )}
                              </h6>
                              <h6 className="flighttime">
                                {airports
                                  .filter((f) => f.iata === item.from)
                                  .map((item) => item.city)}
                              </h6>
                            </div>
                            <div className="col-lg-4 my-auto">
                              <div className="row lh-1">
                                <div className="col-lg-12 text-center">
                                  <span className="text-color font-size">
                                    {/* {directions[0][0].segments.length === 1
                                      ? "Direct"
                                      : directions[0][0].segments.length -
                                      1 +
                                      " Stop"} */}

                                    {directions[4][0].stops === 0 ? (
                                      "Direct"
                                    ) : (
                                      <>{directions[4][0].stops + " Stop"}</>
                                    )}
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center">
                                  <span className="text-color">
                                    <i className="fas fa-circle fa-xs"></i>
                                    -----------------------
                                    <i className="fas fa-plane fa-sm"></i>
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center">
                                  <span className="text-color me-5">
                                    <i className="fas fa-clock fa-sm"></i>
                                    <span className="ms-1 font-size">
                                      {item.segments.length === 1
                                        ? totalFlightDuration(item.segments)
                                        : item.segments.length === 2
                                        ? addDurations([
                                            totalFlightDuration(item.segments),
                                            timeDuration(
                                              item.segments[0].arrival,
                                              item.segments[1].departure
                                            ),
                                          ])
                                        : item.segments.length === 3
                                        ? addDurations([
                                            totalFlightDuration(item.segments),
                                            timeDuration(
                                              item.segments[0].arrival,
                                              item.segments[1].departure
                                            ),
                                            timeDuration(
                                              item.segments[1].arrival,
                                              item.segments[2].departure
                                            ),
                                          ])
                                        : ""}
                                    </span>
                                  </span>
                                  <span className="text-color">
                                    <i className="fas fa-briefcase fa-sm"></i>
                                    <span className="ms-1 font-size">
                                      {item.segments[0].baggage[0]?.amount +
                                        " " +
                                        item.segments[0].baggage[0]?.units}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2 my-auto">
                              <h6 className="fw-bold">
                                <span className="">{item.to}</span>
                                <span className="ms-1 ">
                                  {item.segments[
                                    item.segments.length - 1
                                  ].arrival.substr(11, 5)}
                                </span>
                                <sup>
                                  &nbsp;
                                  {dayCount(
                                    item.segments[item.segments.length - 1]
                                      .arrival,
                                    item.segments[0]?.departure
                                  ) !== 0 ? (
                                    <span
                                      className="text-danger"
                                      style={{ fontSize: "8px" }}
                                    >
                                      +
                                      {dayCount(
                                        item.segments[item.segments.length - 1]
                                          .arrival,
                                        item.segments[0]?.departure
                                      )}
                                    </span>
                                  ) : (
                                    ""
                                  )}{" "}
                                </sup>
                              </h6>
                              <h6 className="flighttime">
                                {moment(
                                  item.segments[item.segments.length - 1]
                                    .arrival
                                ).format("DD MMM,yyyy, ddd")}
                              </h6>
                              <h6 className="flighttime">
                                {airports
                                  .filter((f) => f.iata === item.to)
                                  .map((item) => item.city)}
                              </h6>
                            </div>
                            <div className="col-lg-1 mx-auto my-auto">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={index}
                                  name={"chooseoption4" + props.index}
                                  onChange={() => selectDirectionOption4(index)}
                                  defaultChecked={index === 0 ? true : false}
                                  // onChange={handleChange}
                                  id={props.index + "fiveway" + index}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexRadioDefault2"
                                ></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <></>
                )}

                {directions.length > 5 ? (
                  <>
                    {directions[5].map((item, index) => (
                      <div key={index}>
                        {index === 0 ? (
                          <p className="text-white button-color py-1 m-1 fw-bold text-center border-radius">
                            <span className="me-1">
                              <i className="fas fa-plane fa-sm"></i>
                            </span>
                            Departure : {item.from} - {item.to}
                          </p>
                        ) : (
                          <></>
                        )}
                        <div
                          className={
                            index === idxD6
                              ? "border text-color m-1 selected-bg-color"
                              : "border text-color m-1"
                          }
                        >
                          <div className="row p-2">
                            <div className="col-lg-1 my-auto">
                              {airlinesCodeName(item)?.map((item, index) => (
                                <>
                                  <img
                                    src={
                                      environment.s3ArliensImage +
                                      `${item?.airlineCode}.png`
                                    }
                                    alt=""
                                    width={index === 0 ? "40px" : "20px"}
                                    height={index === 0 ? "40px" : "20px"}
                                    className={
                                      index === 0
                                        ? "mb-1 rounded-2"
                                        : "mb-1 rounded-2 float-end"
                                    }
                                  />
                                </>
                              ))}
                            </div>
                            <div className="col-lg-2 my-auto">
                              {airlinesCodeName(item)?.map((itm, idx) =>
                                airlinesCodeName(item)?.length === 1 ? (
                                  <>
                                    <h6 className="my-auto flighttime">
                                      {item?.segments[0]?.airline}
                                    </h6>
                                    <h6 className="my-auto flighttime">
                                      {item?.segments[0]?.details[0]?.equipment}
                                    </h6>
                                    <h6 className="flighttime">
                                      {item?.segments[0]?.airlineCode} -{" "}
                                      {item?.segments[0]?.flightNumber}
                                    </h6>
                                  </>
                                ) : (
                                  <div className="my-1">
                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.airline}
                                    </h6>

                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.equipment}
                                    </h6>
                                    <h6
                                      className={
                                        idx === 0
                                          ? "my-auto flighttime"
                                          : "my-auto flight"
                                      }
                                    >
                                      {itm?.airlineCode} - {itm?.flightNumber}
                                    </h6>
                                  </div>
                                )
                              )}
                            </div>
                            <div className="col-lg-2 my-auto">
                              <h6 className="fw-bold">
                                <span className="">{item.from}</span>
                                <span className="ms-1 ">
                                  {item.segments[0].departure.substr(11, 5)}
                                </span>
                              </h6>
                              <h6 className="flighttime">
                                {moment(item.segments[0].departure).format(
                                  "DD MMM,yyyy, ddd"
                                )}
                              </h6>
                              <h6 className="flighttime">
                                {airports
                                  .filter((f) => f.iata === item.from)
                                  .map((item) => item.city)}
                              </h6>
                            </div>
                            <div className="col-lg-4 my-auto">
                              <div className="row lh-1">
                                <div className="col-lg-12 text-center">
                                  <span className="text-color font-size">
                                    {/* {directions[0][0].segments.length === 1
                                      ? "Direct"
                                      : directions[0][0].segments.length -
                                      1 +
                                      " Stop"} */}
                                    {directions[5][0].stops === 0 ? (
                                      "Direct"
                                    ) : (
                                      <>{directions[5][0].stops + " Stop"}</>
                                    )}
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center">
                                  <span className="text-color">
                                    <i className="fas fa-circle fa-xs"></i>
                                    -----------------------
                                    <i className="fas fa-plane fa-sm"></i>
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center">
                                  <span className="text-color me-5">
                                    <i className="fas fa-clock fa-sm"></i>
                                    <span className="ms-1 font-size">
                                      {item.segments.length === 1
                                        ? totalFlightDuration(item.segments)
                                        : item.segments.length === 2
                                        ? addDurations([
                                            totalFlightDuration(item.segments),
                                            timeDuration(
                                              item.segments[0].arrival,
                                              item.segments[1].departure
                                            ),
                                          ])
                                        : item.segments.length === 3
                                        ? addDurations([
                                            totalFlightDuration(item.segments),
                                            timeDuration(
                                              item.segments[0].arrival,
                                              item.segments[1].departure
                                            ),
                                            timeDuration(
                                              item.segments[1].arrival,
                                              item.segments[2].departure
                                            ),
                                          ])
                                        : ""}
                                    </span>
                                  </span>
                                  <span className="text-color">
                                    <i className="fas fa-briefcase fa-sm"></i>
                                    <span className="ms-1 font-size">
                                      {item.segments[0].baggage[0]?.amount +
                                        " " +
                                        item.segments[0].baggage[0]?.units}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2 my-auto">
                              <h6 className="fw-bold">
                                <span className="">{item.to}</span>
                                <span className="ms-1 ">
                                  {item.segments[
                                    item.segments.length - 1
                                  ].arrival.substr(11, 5)}
                                </span>
                                <sup>
                                  &nbsp;
                                  {dayCount(
                                    item.segments[item.segments.length - 1]
                                      .arrival,
                                    item.segments[0]?.departure
                                  ) !== 0 ? (
                                    <span
                                      className="text-danger"
                                      style={{ fontSize: "8px" }}
                                    >
                                      +
                                      {dayCount(
                                        item.segments[item.segments.length - 1]
                                          .arrival,
                                        item.segments[0]?.departure
                                      )}
                                    </span>
                                  ) : (
                                    ""
                                  )}{" "}
                                </sup>
                              </h6>
                              <h6 className="flighttime">
                                {moment(
                                  item.segments[item.segments.length - 1]
                                    .arrival
                                ).format("DD MMM,yyyy, ddd")}
                              </h6>
                              <h6 className="flighttime">
                                {airports
                                  .filter((f) => f.iata === item.to)
                                  .map((item) => item.city)}
                              </h6>
                            </div>
                            <div className="col-lg-1 mx-auto my-auto">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={index}
                                  name={"chooseoption5" + props.index}
                                  onChange={() => selectDirectionOption5(index)}
                                  defaultChecked={index === 0 ? true : false}
                                  // onChange={handleChange}
                                  id={props.index + "sixway" + index}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexRadioDefault2"
                                ></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                {directions[0].map((item, index) => (
                  <div
                    key={index}
                    className={
                      index === idxD
                        ? "border text-color m-1 selected-bg-color"
                        : "border text-color m-1"
                    }
                  >
                    <div className="row p-2 ">
                      <div className="col-lg-1 my-auto">
                        {airlinesCodeName(item)?.map((item, index) => (
                          <>
                            <img
                              src={
                                environment.s3ArliensImage +
                                `${item?.airlineCode}.png`
                              }
                              alt=""
                              width={index === 0 ? "40px" : "20px"}
                              height={index === 0 ? "40px" : "20px"}
                              className={
                                index === 0
                                  ? "mb-1 rounded-2"
                                  : "mb-1 rounded-2 float-end"
                              }
                            />
                          </>
                        ))}
                      </div>
                      <div className="col-lg-2 my-auto">
                        {airlinesCodeName(item)?.map((itm, idx) =>
                          airlinesCodeName(item)?.length === 1 ? (
                            <>
                              <h6 className="my-auto flighttime">
                                {item?.segments[0]?.airline}
                              </h6>
                              <h6 className="my-auto flighttime">
                                {item?.segments[0]?.details[0]?.equipment}
                              </h6>
                              <h6 className="flighttime">
                                {item?.segments[0]?.airlineCode} -{" "}
                                {item?.segments[0]?.flightNumber}
                              </h6>
                            </>
                          ) : (
                            <div className="my-1">
                              <h6
                                className={
                                  idx === 0
                                    ? "my-auto flighttime"
                                    : "my-auto flight"
                                }
                              >
                                {itm?.airline}
                              </h6>

                              <h6
                                className={
                                  idx === 0
                                    ? "my-auto flighttime"
                                    : "my-auto flight"
                                }
                              >
                                {itm?.equipment}
                              </h6>
                              <h6
                                className={
                                  idx === 0
                                    ? "my-auto flighttime"
                                    : "my-auto flight"
                                }
                              >
                                {itm?.airlineCode} - {itm?.flightNumber}
                              </h6>
                            </div>
                          )
                        )}
                      </div>
                      <div className="col-lg-2 my-auto">
                        {/* <span className="fw-bold">
                        {item.segments[0].departure.substr(11, 5)}
                      </span>
                      <p className="my-auto">{item.from}</p> */}
                        <h6 className="fw-bold">
                          <span className="">{item.from}</span>
                          <span className="ms-1 ">
                            {item.segments[0].departure.substr(11, 5)}
                          </span>
                          {/* {directions[0][0].segments[0].departure.substr(11, 5)} */}
                        </h6>
                        <h6 className="flighttime">
                          {moment(item.segments[0].departure).format(
                            "DD MMM,yyyy, ddd"
                          )}
                        </h6>
                        <h6 className="flighttime">
                          {airports
                            .filter((f) => f.iata === item.from)
                            .map((item) => item.city)}
                        </h6>
                      </div>
                      <div className="col-lg-4 my-auto">
                        <div className="row lh-1">
                          <div className="col-lg-12 text-center">
                            <span className="text-color font-size">
                              {directions[0][0].stops === 0
                                ? "Direct"
                                : directions[0][0].stops + " Stop"}
                            </span>
                          </div>
                          <div className="col-lg-12 text-center">
                            <span className="text-color">
                              <i className="fas fa-circle fa-xs"></i>
                              -----------------------
                              <i className="fas fa-plane fa-sm"></i>
                            </span>
                          </div>
                          <div className="col-lg-12 text-center">
                            <span
                              className={
                                item?.segments[0]?.baggage[0] !== undefined
                                  ? "text-color me-5"
                                  : "text-color"
                              }
                            >
                              <i className="fas fa-clock fa-sm"></i>
                              <span className="ms-1 font-size">
                                {item.segments.length === 1
                                  ? totalFlightDuration(item.segments)
                                  : item.segments.length === 2
                                  ? addDurations([
                                      totalFlightDuration(item.segments),
                                      timeDuration(
                                        item.segments[0].arrival,
                                        item.segments[1].departure
                                      ),
                                    ])
                                  : item.segments.length === 3
                                  ? addDurations([
                                      totalFlightDuration(item.segments),
                                      timeDuration(
                                        item.segments[0].arrival,
                                        item.segments[1].departure
                                      ),
                                      timeDuration(
                                        item.segments[1].arrival,
                                        item.segments[2].departure
                                      ),
                                    ])
                                  : ""}
                              </span>
                            </span>
                            {item?.segments[0]?.baggage[0] !== undefined && (
                              <span className="text-color">
                                <i className="fas fa-briefcase fa-sm"></i>
                                <span className="ms-1 font-size">
                                  {item.segments[0].baggage[0]?.amount +
                                    " " +
                                    item.segments[0].baggage[0]?.units}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 my-auto">
                        <h6 className="fw-bold">
                          <span className="">{item.to}</span>
                          <span className="ms-1 ">
                            {item.segments[
                              item.segments.length - 1
                            ].arrival.substr(11, 5)}
                          </span>
                          <sup>
                            &nbsp;
                            {dayCount(
                              item.segments[item.segments.length - 1].arrival,
                              item.segments[0]?.departure
                            ) !== 0 ? (
                              <span
                                className="text-danger"
                                style={{ fontSize: "8px" }}
                              >
                                +
                                {dayCount(
                                  item.segments[item.segments.length - 1]
                                    .arrival,
                                  item.segments[0]?.departure
                                )}
                              </span>
                            ) : (
                              ""
                            )}{" "}
                          </sup>
                        </h6>
                        <h6 className="flighttime">
                          {moment(
                            item.segments[item.segments.length - 1].arrival
                          ).format("DD MMM,yyyy, ddd")}
                        </h6>
                        <h6 className="flighttime">
                          {airports
                            .filter((f) => f.iata === item.to)
                            .map((item) => item.city)}
                        </h6>
                      </div>
                      <div className="col-lg-1 mx-auto my-auto">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            value={index}
                            name={"chooseDeparture" + props.index}
                            id={props.index + "oneway" + index}
                            onChange={() => selectDirectionOption0(index)}
                            defaultChecked={index === 0 ? true : false}
                            // onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault2"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {flightType === "Multi City" ? (
              <></>
            ) : (
              <>
                {directions[1] !== undefined ? (
                  <>
                    {" "}
                    <div className="row">
                      <div className="col-lg-12 m-1">
                        <span className="text-white button-color py-1 px-3 text-center border-radius">
                          <span className="me-1">
                            <i className="fas fa-plane fa-sm"></i>
                          </span>
                          Return
                        </span>
                      </div>
                    </div>
                    {directions[1].map((item, index) => (
                      <div
                        key={index}
                        className={
                          index === idxA
                            ? "border text-color m-1 selected-bg-color"
                            : "border text-color m-1"
                        }
                      >
                        <div className="row p-2">
                          <div className="col-lg-1 my-auto">
                            {airlinesCodeName(item)?.map((item, index) => (
                              <>
                                <img
                                  src={
                                    environment.s3ArliensImage +
                                    `${item?.airlineCode}.png`
                                  }
                                  alt=""
                                  width={index === 0 ? "40px" : "20px"}
                                  height={index === 0 ? "40px" : "20px"}
                                  className={
                                    index === 0
                                      ? "mb-1 rounded-2"
                                      : "mb-1 rounded-2 float-end"
                                  }
                                />
                              </>
                            ))}
                          </div>
                          <div className="col-lg-2 my-auto">
                            {airlinesCodeName(item)?.map((itm, idx) =>
                              airlinesCodeName(item)?.length === 1 ? (
                                <>
                                  <h6 className="my-auto flighttime">
                                    {item?.segments[0]?.airline}
                                  </h6>
                                  <h6 className="my-auto flighttime">
                                    {item?.segments[0]?.details[0]?.equipment}
                                  </h6>
                                  <h6 className="flighttime">
                                    {item?.segments[0]?.airlineCode} -{" "}
                                    {item?.segments[0]?.flightNumber}
                                  </h6>
                                </>
                              ) : (
                                <div className="my-1">
                                  <h6
                                    className={
                                      idx === 0
                                        ? "my-auto flighttime"
                                        : "my-auto flight"
                                    }
                                  >
                                    {itm?.airline}
                                  </h6>

                                  <h6
                                    className={
                                      idx === 0
                                        ? "my-auto flighttime"
                                        : "my-auto flight"
                                    }
                                  >
                                    {itm?.equipment}
                                  </h6>
                                  <h6
                                    className={
                                      idx === 0
                                        ? "my-auto flighttime"
                                        : "my-auto flight"
                                    }
                                  >
                                    {itm?.airlineCode} - {itm?.flightNumber}
                                  </h6>
                                </div>
                              )
                            )}
                          </div>
                          <div className="col-lg-2 my-auto">
                            <h6 className="fw-bold">
                              <span className="">{item.from}</span>
                              <span className="ms-1 ">
                                {item.segments[0].departure.substr(11, 5)}
                              </span>
                            </h6>
                            <h6 className="flighttime">
                              {moment(item.segments[0].departure).format(
                                "DD MMM,yyyy, ddd"
                              )}
                            </h6>
                            <h6 className="flighttime">
                              {airports
                                .filter((f) => f.iata === item.from)
                                .map((item) => item.city)}
                            </h6>
                          </div>
                          <div className="col-lg-4 my-auto">
                            <div className="row lh-1">
                              <div className="col-lg-12 text-center">
                                <span className="text-color font-size">
                                  {directions[1][0].stops === 0
                                    ? "Direct"
                                    : directions[1][0].stops + " Stop"}
                                </span>
                              </div>
                              <div className="col-lg-12 text-center">
                                <span className="text-color">
                                  <i className="fas fa-circle fa-xs"></i>
                                  -----------------------
                                  <i className="fas fa-plane fa-sm"></i>
                                </span>
                              </div>
                              <div className="col-lg-12 text-center">
                                <span
                                  className={
                                    item?.segments[0]?.baggage[0] !== undefined
                                      ? "text-color me-5"
                                      : "text-color"
                                  }
                                >
                                  <i className="fas fa-clock fa-sm"></i>
                                  <span className="ms-1 font-size">
                                    {item.segments.length === 1
                                      ? totalFlightDuration(item.segments)
                                      : item.segments.length === 2
                                      ? addDurations([
                                          totalFlightDuration(item.segments),
                                          timeDuration(
                                            item.segments[0].arrival,
                                            item.segments[1].departure
                                          ),
                                        ])
                                      : item.segments.length === 3
                                      ? addDurations([
                                          totalFlightDuration(item.segments),
                                          timeDuration(
                                            item.segments[0].arrival,
                                            item.segments[1].departure
                                          ),
                                          timeDuration(
                                            item.segments[1].arrival,
                                            item.segments[2].departure
                                          ),
                                        ])
                                      : ""}
                                  </span>
                                </span>

                                {item?.segments[0]?.baggage[0] !==
                                  undefined && (
                                  <span className="text-color">
                                    <i className="fas fa-briefcase fa-sm"></i>
                                    <span className="ms-1 font-size">
                                      {item.segments[0].baggage[0]?.amount +
                                        " " +
                                        item.segments[0].baggage[0]?.units}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2 my-auto">
                            <h6 className="fw-bold">
                              <span className="">{item.to}</span>
                              <span className="ms-1 ">
                                {item.segments[
                                  item.segments.length - 1
                                ].arrival.substr(11, 5)}
                              </span>
                              <sup>
                                &nbsp;
                                {dayCount(
                                  item.segments[item.segments.length - 1]
                                    .arrival,
                                  item.segments[0]?.departure
                                ) !== 0 ? (
                                  <span
                                    className="text-danger"
                                    style={{ fontSize: "8px" }}
                                  >
                                    +
                                    {dayCount(
                                      item.segments[item.segments.length - 1]
                                        .arrival,
                                      item.segments[0]?.departure
                                    )}
                                  </span>
                                ) : (
                                  ""
                                )}{" "}
                              </sup>
                            </h6>
                            <h6 className="flighttime">
                              {moment(
                                item.segments[item.segments.length - 1].arrival
                              ).format("DD MMM,yyyy, ddd")}
                            </h6>
                            <h6 className="flighttime">
                              {airports
                                .filter((f) => f.iata === item.to)
                                .map((item) => item.city)}
                            </h6>
                          </div>
                          <div className="col-lg-1 mx-auto my-auto">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                value={index}
                                name={"chooseReturn" + props.index}
                                onChange={() => selectDirectionOption1(index)}
                                defaultChecked={index === 0 ? true : false}
                                id={props.index + "twoway" + index}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault2"
                              ></label>
                            </div>
                          </div>
                        </div>
                        {/* <input type="hidden" value={index1++}></input> */}
                      </div>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
            <div className="border-top py-2">
              {directions[0][0].segments[0].bookingCount ? (
                <>
                  {directions[0][0].segments[0].bookingCount > 0 && (
                    <Tooltip
                      bg="#ed7f22"
                      p={"5px"}
                      label={
                        <div
                          style={{
                            overflowY: "auto",
                            fontSize: "12px",
                          }}
                        >
                          <table
                            className="table-bordered"
                            style={{
                              width: "auto",
                              fontSize: "12px",
                            }}
                          >
                            <thead className="text-center thead text-white fw-bold">
                              <tr>
                                <th className="py-1">Route</th>
                                <th className="py-1">Seats</th>
                              </tr>
                            </thead>
                            <tbody className="text-center text-dark">
                              {direction0.segments?.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td className="left align-middle">
                                      {item.from}-{item.to}
                                    </td>
                                    <td>
                                      <span className="left">
                                        <span className="ms-1 font-size">
                                          {item?.bookingCount}
                                        </span>
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}

                              {directions[1] !== undefined ? (
                                <>
                                  {direction1.segments?.map((item, idx) => {
                                    return (
                                      <tr key={idx}>
                                        <td className="left align-middle">
                                          {item.from}-{item.to}
                                        </td>
                                        <td>
                                          <span className="left">
                                            <span className="ms-1 font-size">
                                              {item?.bookingCount}
                                            </span>
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </>
                              ) : (
                                <></>
                              )}

                              {directions[2] !== undefined ? (
                                <>
                                  {direction2.segments?.map((item, idx) => {
                                    return (
                                      <tr key={idx}>
                                        <td className="left align-middle">
                                          {item.from}-{item.to}
                                        </td>
                                        <td>
                                          <span className="left">
                                            <span className="ms-1 font-size">
                                              {item?.bookingCount}
                                            </span>
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </>
                              ) : (
                                <></>
                              )}
                              {directions[3] !== undefined ? (
                                <>
                                  {direction3.segments?.map((item, idx) => {
                                    return (
                                      <tr key={idx}>
                                        <td className="left align-middle">
                                          {item.from}-{item.to}
                                        </td>
                                        <td>
                                          <span className="left">
                                            <span className="ms-1 font-size">
                                              {item?.bookingCount}
                                            </span>
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </>
                              ) : (
                                <></>
                              )}

                              {directions[4] !== undefined ? (
                                <>
                                  {direction4.segments?.map((item, idx) => {
                                    return (
                                      <tr key={idx}>
                                        <td className="left align-middle">
                                          {item.from}-{item.to}
                                        </td>
                                        <td>
                                          <span className="left">
                                            <span className="ms-1 font-size">
                                              {item?.bookingCount}
                                            </span>
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </>
                              ) : (
                                <></>
                              )}

                              {directions[5] !== undefined ? (
                                <>
                                  {direction5.segments?.map((item, idx) => {
                                    return (
                                      <tr key={idx}>
                                        <td className="left align-middle">
                                          {item.from}-{item.to}
                                        </td>
                                        <td>
                                          <span className="left">
                                            <span className="ms-1 font-size">
                                              {item?.bookingCount}
                                            </span>
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </>
                              ) : (
                                <></>
                              )}
                            </tbody>
                          </table>
                        </div>
                      }
                      aria-label="Baggage Details"
                      hasArrow
                      placement="bottom"
                      openDelay={500} // optional, to show the tooltip after delay
                    >
                      <span
                        className="pe-3 text-color font-size ms-2"
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <i className="fas fa-couch me-1"></i>
                        Seats
                      </span>
                    </Tooltip>
                  )}
                </>
              ) : (
                <></>
              )}

              {directions[0][0].segments[0].bookingClass && (
                <Tooltip
                  bg="#ed7f22"
                  p={"5px"}
                  label={
                    <div
                      style={{
                        overflowY: "auto",
                        fontSize: "12px",
                      }}
                    >
                      <table
                        className="table-bordered"
                        style={{
                          width: "auto",
                          fontSize: "12px",
                        }}
                      >
                        <thead className="text-center thead text-white fw-bold">
                          <tr>
                            <th className="py-1">Route</th>
                            <th className="py-1">Booking Class</th>
                          </tr>
                        </thead>
                        <tbody className="text-center text-dark">
                          {direction0.segments?.map((item, idx) => {
                            return (
                              <tr key={idx}>
                                <td className="left align-middle">
                                  {item.from}-{item.to}
                                </td>
                                <td>
                                  <span className="left">
                                    <span className="ms-1 font-size">
                                      {item?.bookingClass}
                                    </span>
                                  </span>
                                </td>
                              </tr>
                            );
                          })}

                          {directions[1] !== undefined ? (
                            <>
                              {direction1.segments?.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td className="left align-middle">
                                      {item.from}-{item.to}
                                    </td>
                                    <td>
                                      <span className="left">
                                        <span className="ms-1 font-size">
                                          {item?.bookingClass}
                                        </span>
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </>
                          ) : (
                            <></>
                          )}

                          {directions[2] !== undefined ? (
                            <>
                              {direction2.segments?.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td className="left align-middle">
                                      {item.from}-{item.to}
                                    </td>
                                    <td>
                                      <span className="left">
                                        <span className="ms-1 font-size">
                                          {item?.bookingClass}
                                        </span>
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </>
                          ) : (
                            <></>
                          )}
                          {directions[3] !== undefined ? (
                            <>
                              {direction3.segments?.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td className="left align-middle">
                                      {item.from}-{item.to}
                                    </td>
                                    <td>
                                      <span className="left">
                                        <span className="ms-1 font-size">
                                          {item?.bookingClass}
                                        </span>
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </>
                          ) : (
                            <></>
                          )}

                          {directions[4] !== undefined ? (
                            <>
                              {direction4.segments?.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td className="left align-middle">
                                      {item.from}-{item.to}
                                    </td>
                                    <td>
                                      <span className="left">
                                        <span className="ms-1 font-size">
                                          {item?.bookingClass}
                                        </span>
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </>
                          ) : (
                            <></>
                          )}

                          {directions[5] !== undefined ? (
                            <>
                              {direction5.segments?.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td className="left align-middle">
                                      {item.from}-{item.to}
                                    </td>
                                    <td>
                                      <span className="left">
                                        <span className="ms-1 font-size">
                                          {item?.bookingClass}
                                        </span>
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </>
                          ) : (
                            <></>
                          )}
                        </tbody>
                      </table>
                    </div>
                  }
                  aria-label="Baggage Details"
                  hasArrow
                  placement="bottom"
                  openDelay={500} // optional, to show the tooltip after delay
                >
                  <span
                    className="pe-3 text-color font-size"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-book me-1"></i>
                    Booking Class
                  </span>
                </Tooltip>
              )}

              {directions[0][0]?.segments[0]?.bookingClass ? (
                <Tooltip
                  bg="#ed7f22"
                  p={"5px"}
                  label={
                    <div
                      style={{
                        overflowY: "auto",
                        fontSize: "12px",
                      }}
                    >
                      <table
                        className="table-bordered"
                        style={{
                          width: "auto",
                          fontSize: "12px",
                        }}
                      >
                        <thead className="text-center thead text-white fw-bold">
                          <tr>
                            <th className="py-1">Route</th>
                            <th className="py-1">Cabin Class</th>
                          </tr>
                        </thead>
                        <tbody className="text-center text-dark ">
                          {direction0.segments?.map((item, idx) => {
                            return (
                              <tr key={idx}>
                                <td className="left align-middle">
                                  {item.from}-{item.to}
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
                          })}

                          {directions[1] !== undefined ? (
                            <>
                              {direction1.segments?.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td className="left align-middle">
                                      {item.from}-{item.to}
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
                              })}
                            </>
                          ) : (
                            <></>
                          )}

                          {directions[2] !== undefined ? (
                            <>
                              {direction2.segments?.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td className="left align-middle">
                                      {item.from}-{item.to}
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
                              })}
                            </>
                          ) : (
                            <></>
                          )}
                          {directions[3] !== undefined ? (
                            <>
                              {direction3.segments?.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td className="left align-middle">
                                      {item.from}-{item.to}
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
                              })}
                            </>
                          ) : (
                            <></>
                          )}

                          {directions[4] !== undefined ? (
                            <>
                              {direction4.segments?.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td className="left align-middle">
                                      {item.from}-{item.to}
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
                              })}
                            </>
                          ) : (
                            <></>
                          )}

                          {directions[5] !== undefined ? (
                            <>
                              {direction5.segments?.map((item, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td className="left align-middle">
                                      {item.from}-{item.to}
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
                              })}
                            </>
                          ) : (
                            <></>
                          )}
                        </tbody>
                      </table>
                    </div>
                  }
                  aria-label="Baggage Details"
                  hasArrow
                  placement="bottom"
                  openDelay={500} // optional, to show the tooltip after delay
                >
                  <span
                    className="pe-3 text-color font-size"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-book me-1"></i>
                    Checked CabinClass
                  </span>
                </Tooltip>
              ) : (
                <></>
              )}

              {directions[0][0]?.segments[0]?.baggage.length > 0 && (
                <Tooltip
                  bg="#ed7f22"
                  p={"5px"}
                  label={
                    <div
                      style={{
                        overflowY: "auto",
                        fontSize: "12px",
                      }}
                    >
                      <table
                        className="table-bordered"
                        style={{
                          width: "auto",
                          fontSize: "12px",
                        }}
                      >
                        <thead className="text-center thead text-white fw-bold">
                          <tr>
                            <th className="py-1">Route</th>
                            <th className="py-1">Baggage</th>
                          </tr>
                        </thead>
                        <tbody className="text-center text-dark">
                          {directions.map(
                            (direction, index) =>
                              direction &&
                              direction[0] &&
                              direction[0].segments.length > 0 && (
                                <>
                                  {direction[0].segments?.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        <td className="left align-middle">
                                          {item.from}-{item.to}
                                        </td>
                                        <td>
                                          {item.baggage.length > 0 ? (
                                            item.baggage.map((itm, idx) => (
                                              <div key={idx}>
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
                                                <br />
                                              </div>
                                            ))
                                          ) : (
                                            <span className="left">
                                              N/A :{" "}
                                              <span className="ms-1 font-size">
                                                N/A
                                              </span>
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </>
                              )
                          )}
                        </tbody>
                      </table>
                    </div>
                  }
                  aria-label="Baggage Details"
                  hasArrow
                  placement="bottom"
                  openDelay={500} // optional, to show the tooltip after delay
                >
                  <span
                    className="pe-3 text-color font-size"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-briefcase fa-sm me-1"></i>
                    Baggage
                  </span>
                </Tooltip>
              )}

              <span className="pe-3 text-color font-size">
                <i className="fas fa-pen-nib me-1"></i>{" "}
                <Link
                  to=""
                  style={{ textDecoration: "none" }}
                  className="text-color font-size"
                  data-bs-toggle="modal"
                  data-bs-target={"#farerulesModal"}
                  onClick={() => {
                    if (
                      brandedFares === null ||
                      brandedFares === undefined ||
                      brandedFares?.length === 0
                    ) {
                      getFareRules(uniqueTransID, directions, itemCodeRef, "");
                    } else {
                      getFareRules(
                        uniqueTransID,
                        directions,
                        itemCodeRef,
                        brandedFares[selectedBrandedFareIdx]?.ref
                      );
                    }
                  }}
                >
                  Fare Rules
                </Link>
              </span>

              {bookable === false && (
                <span className="pe-3 text-color font-size">
                  <span className="text-danger">
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </span>{" "}
                  Instant Purchase Only
                </span>
              )}
              {fareTag && (
                <span className="pe-3 text-danger fw-bold font-size">
                  {fareTag}
                </span>
              )}
              <span className="text-color float-end">
                {refundable === true ? (
                  <>
                    <span className="font-size">
                      <span style={{ color: avlSrc }}>
                        <i className="fas fa-circle fa-sm me-1"></i>
                      </span>
                      {(brandedFares === null ||
                        brandedFares === undefined ||
                        brandedFares?.length === 0) && (
                        <>
                          <span className="text-success">
                            <i className="fas fa-circle fa-sm me-1"></i>
                          </span>
                          Refundable
                        </>
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-size">
                      <span style={{ color: avlSrc }}>
                        <i className="fas fa-circle fa-sm me-1"></i>
                      </span>
                      {(brandedFares === null ||
                        brandedFares === undefined ||
                        brandedFares?.length === 0) && (
                        <>
                          <span className="text-danger">
                            <i className="fas fa-circle fa-sm me-1"></i>
                          </span>
                          Non-Refundable
                        </>
                      )}
                    </span>
                  </>
                )}
              </span>
            </div>
            {/* end of return flight section for hide*/}
          </div>
          <div className="col-lg-2 my-auto text-end">
            {passengerCounts?.adt > 1 && (
              <Box
                background="#ed7f22"
                width="fit-content"
                py={1}
                ml="auto"
                color="white"
                borderBottomLeftRadius="8px"
                borderTopRightRadius="8px"
                fontSize="8px"
                px={2}
                my={1}
                textAlign="end" // Center the text
                className="fw-bold"
              >
                Price Per Adult{" "}
                <span style={{ fontSize: "11px" }} className="fw-bold">
                  AED{" "}
                  {brandedFares === null ||
                  brandedFares === undefined ||
                  brandedFares?.length === 0 ? (
                    <>
                      {passengerFares?.adt &&
                        (
                          passengerFares?.adt?.totalPrice -
                          passengerFares?.adt?.discountPrice
                        )?.toLocaleString("en-US")}
                    </>
                  ) : (
                    <>
                      {(
                        brandedFares[selectedBrandedFareIdx]?.paxFareBreakDown
                          ?.adt?.totalPrice -
                        brandedFares[selectedBrandedFareIdx]?.paxFareBreakDown
                          ?.adt?.discountPrice
                      )?.toLocaleString("en-US")}
                    </>
                  )}
                </span>
              </Box>
            )}
            {(brandedFares === null ||
              brandedFares === undefined ||
              brandedFares?.length === 0) && (
              <h5 className="text-end text-color text-end fw-bold">
                {amountChange === "Invoice Amount" ? (
                  <>
                    <div>
                      <div
                        className="text-secondary"
                        style={{ fontSize: "20px" }}
                      >
                        {currency !== undefined ? currency : "AED"}{" "}
                        {totalPrice + bookingComponents[0].agentAdditionalPrice}
                      </div>
                      <del>
                        {currency !== undefined ? currency : "AED"}{" "}
                        {parseFloat(
                          totalPrice -
                            bookingComponents[0].discountPrice +
                            (bookingComponents[0].agentAdditionalPrice < 0
                              ? 0
                              : bookingComponents[0].agentAdditionalPrice)
                        ).toLocaleString("en-US")}
                      </del>
                    </div>
                  </>
                ) : (
                  <div>
                    {currency !== undefined ? currency : "AED"}{" "}
                    {parseFloat(
                      totalPrice -
                        bookingComponents[0].discountPrice +
                        (bookingComponents[0].agentAdditionalPrice < 0
                          ? 0
                          : bookingComponents[0].agentAdditionalPrice)
                    ).toLocaleString("en-US")}
                  </div>
                )}
              </h5>
            )}

            {brandedFares !== null &&
            brandedFares !== undefined &&
            brandedFares?.length > 0 ? (
              <>
                <h5 className="text-end text-color text-end fw-bold">
                  {amountChange === "Invoice Amount" ? (
                    <>
                      <div>
                        <div
                          className="text-secondary"
                          style={{ fontSize: "20px" }}
                        >
                          {currency !== undefined ? currency : "AED"}{" "}
                          {brandedFares[
                            selectedBrandedFareIdx
                          ]?.totalFare.toLocaleString("en-US")}
                        </div>
                        <del>
                          {currency !== undefined ? currency : "AED"}{" "}
                          {parseFloat(
                            brandedFares[selectedBrandedFareIdx]?.totalFare -
                              brandedFares[selectedBrandedFareIdx]?.discount
                          ).toLocaleString("en-US")}
                        </del>
                      </div>
                    </>
                  ) : (
                    <div>
                      {currency !== undefined ? currency : "AED"}{" "}
                      {parseFloat(
                        brandedFares[selectedBrandedFareIdx]?.totalFare -
                          brandedFares[selectedBrandedFareIdx]?.discount
                      ).toLocaleString("en-US")}
                    </div>
                  )}
                </h5>

                <button
                  type="submit"
                  className="btn button-color text-white fw-bold w-100 mb-1 border-radius d-flex justify-content-center align-items-center gap-2"
                  onClick={() => setBrandedFareToggle((pre) => !pre)}
                >
                  {" "}
                  View Price{" "}
                  {brandedFareToggle ? (
                    <FaChevronCircleUp />
                  ) : (
                    <FaChevronCircleDown />
                  )}
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="btn button-color text-white mb-1 fw-bold w-100 border-radius"
                onClick={handleSelectFlight}
              >
                {" "}
                Select Flight
              </button>
            )}

            <Link
              to=""
              style={{ textDecoration: "none" }}
              className="btn btn-sm w-100 fw-bold text-white border-radius button-color px-2 mb-1 font-size mx-auto"
              data-bs-toggle="modal"
              data-bs-target={"#exampleModal" + props.index}
            >
              Flight Details
            </Link>
            {/* <h6
              className="text-color text-center font-size"
              id={"priceDown" + props.index}
              style={{ cursor: "pointer" }}
            >
              Price Breakdown{" "}
              <span>
                <i className="fas fa-angle-down"></i>
              </span>
            </h6> */}
            <span
              className="btn btn-sm w-100 fw-bold border-radius button-color px-2 text-white font-size mb-1"
              style={{ cursor: "pointer" }}
              onClick={() => onOpen3()}
            >
              Price Breakdown
            </span>

            <span
              className="btn btn-sm w-100 fw-bold border-radius button-color px-2 text-white font-size"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleChangeBookingClass();
                setNewBookingClassRes({});
              }}
              ref={btnRef}
              colorScheme="teal"
            >
              Change Booking Class
            </span>

            {/* <p className="text-color text-center font-size">
              {refundable === true ? "Refundable" : "Non-Refundable"}
            </p> */}
          </div>
          {/* <div
            className="table-responsive-sm mt-1"
            id={"passengerBrackdown" + props.index}
          >
            <hr></hr>
            <table
              className="table table-bordered px-3 table-sm"
              style={{ fontSize: "12px" }}
            >
              <thead className="text-center button-color text-white fw-bold">
                <tr>
                  <th>Type</th>
                  <th>Base</th>
                  <th>Tax</th>
                  <th>Commission</th>
                  <th>AIT</th>
                  <th>Pax</th>
                  <th>Total Pax Fare</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {passengerFares.adt !== null ? (
                  <>
                    <tr>
                      <td className="left">Adult</td>
                      <td className="left">
                        {(
                          passengerFares.adt.basePrice +
                          bookingComponents[0].agentAdditionalPrice /
                            (passengerCounts.adt +
                              (passengerCounts.cnn !== null
                                ? passengerCounts.cnn
                                : 0) +
                              (passengerCounts.inf !== null
                                ? passengerCounts.inf
                                : 0))
                        ).toLocaleString("en-US")}
                      </td>
                      <td className="center">
                        {passengerFares.adt.taxes.toLocaleString("en-US")}
                      </td>
                      <td className="right">
                        {(
                          passengerFares.adt.discountPrice +
                          sumTaxesDiscount(
                            passengerFares.adt.taxCommissionBreakdowns
                          )
                        ).toLocaleString("en-US")}
                      </td>
                      <td className="right">
                        {passengerFares.adt.ait.toLocaleString("en-US")}
                      </td>
                      <td className="right">{passengerCounts.adt}</td>
                      {isTempInspector !== null && isTempInspector == "true" ? (
                        <>
                          <td
                            className="right fw-bold"
                            title={
                              bookingComponents[0]?.fareReference !== ""
                                ? JSON.parse(
                                    base64_decode(
                                      bookingComponents[0]?.fareReference
                                    )
                                  ).map((item) => {
                                    return (
                                      item.Id +
                                      "(" +
                                      (item.IsDefault == true &&
                                      item.IsAgent == false
                                        ? "Default"
                                        : item.IsDefault == false &&
                                          item.IsAgent == false
                                        ? "Dynamic"
                                        : item.IsDefault == false &&
                                          item.IsAgent == true
                                        ? "Agent"
                                        : "") +
                                      ") " +
                                      (item.DiscountType == 1
                                        ? "Markup"
                                        : "Discount") +
                                      " " +
                                      item.Value +
                                      (item.Type == 1 ? "%" : "") +
                                      "\n"
                                    );
                                  })
                                : ""
                            }
                          >
                            {currency !== undefined ? currency : "AED"}{" "}
                            {(
                              passengerFares.adt.totalPrice *
                                passengerCounts.adt +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.cnn !== null
                                    ? passengerCounts.cnn
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="right fw-bold">
                            {currency !== undefined ? currency : "AED"}{" "}
                            {(
                              passengerFares.adt.totalPrice *
                                passengerCounts.adt +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.cnn !== null
                                    ? passengerCounts.cnn
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                        </>
                      )}
                    </tr>
                  </>
                ) : (
                  <></>
                )}

                {passengerFares.chd !== null ? (
                  <>
                    <tr>
                      <td className="left">Child &gt; 5</td>
                      <td className="left">
                        {(
                          passengerFares.chd.basePrice +
                          bookingComponents[0].agentAdditionalPrice /
                            (passengerCounts.adt +
                              (passengerCounts.chd !== null
                                ? passengerCounts.chd
                                : 0) +
                              (passengerCounts.inf !== null
                                ? passengerCounts.inf
                                : 0))
                        ).toLocaleString("en-US")}
                      </td>
                      <td className="center">
                        {passengerFares.chd.taxes.toLocaleString("en-US")}
                      </td>
                      <td className="right">
                        {(
                          passengerFares.chd.discountPrice +
                          sumTaxesDiscount(
                            passengerFares.chd.taxCommissionBreakdowns
                          )
                        ).toLocaleString("en-US")}
                      </td>
                      <td className="right">
                        {passengerFares.chd.ait.toLocaleString("en-US")}
                      </td>
                      <td className="right">{passengerCounts.chd}</td>
                      {isTempInspector !== null && isTempInspector == "true" ? (
                        <>
                          {" "}
                          <td
                            className="right fw-bold"
                            title={
                              bookingComponents[0]?.fareReference !== ""
                                ? JSON.parse(
                                    base64_decode(
                                      bookingComponents[0]?.fareReference
                                    )
                                  ).map((item) => {
                                    return (
                                      item.Id +
                                      "(" +
                                      (item.IsDefault == true &&
                                      item.IsAgent == false
                                        ? "Default"
                                        : item.IsDefault == false &&
                                          item.IsAgent == false
                                        ? "Dynamic"
                                        : item.IsDefault == false &&
                                          item.IsAgent == true
                                        ? "Agent"
                                        : "") +
                                      ") " +
                                      (item.DiscountType == 1
                                        ? "Markup"
                                        : "Discount") +
                                      " " +
                                      item.Value +
                                      (item.Type == 1 ? "%" : "") +
                                      "\n"
                                    );
                                  })
                                : ""
                            }
                          >
                            {currency !== undefined ? currency : "AED"}{" "}
                            {(
                              passengerFares.chd.totalPrice *
                                passengerCounts.chd +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.chd !== null
                                    ? passengerCounts.chd
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                        </>
                      ) : (
                        <>
                          {" "}
                          <td className="right fw-bold">
                            {currency !== undefined ? currency : "AED"}{" "}
                            {(
                              passengerFares.chd.totalPrice *
                                passengerCounts.chd +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.chd !== null
                                    ? passengerCounts.chd
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                        </>
                      )}
                    </tr>
                  </>
                ) : (
                  <></>
                )}

                {passengerFares.cnn !== null ? (
                  <>
                    <tr>
                      <td className="left">
                        Child{" "}
                        {passengerFares.chd === null ? <></> : <> &#60; 5</>}
                      </td>
                      <td className="left">
                        {(
                          passengerFares.cnn.basePrice +
                          bookingComponents[0].agentAdditionalPrice /
                            (passengerCounts.adt +
                              (passengerCounts.cnn !== null
                                ? passengerCounts.cnn
                                : 0) +
                              (passengerCounts.inf !== null
                                ? passengerCounts.inf
                                : 0))
                        ).toLocaleString("en-US")}
                      </td>
                      <td className="center">
                        {passengerFares.cnn.taxes.toLocaleString("en-US")}
                      </td>
                      <td className="right">
                        {(
                          passengerFares.cnn.discountPrice +
                          sumTaxesDiscount(
                            passengerFares.cnn.taxCommissionBreakdowns
                          )
                        ).toLocaleString("en-US")}
                      </td>
                      <td className="right">
                        {passengerFares.cnn.ait.toLocaleString("en-US")}
                      </td>
                      <td className="right">{passengerCounts.cnn}</td>
                      {isTempInspector !== null && isTempInspector == "true" ? (
                        <>
                          {" "}
                          <td
                            className="right fw-bold"
                            title={
                              bookingComponents[0]?.fareReference !== ""
                                ? JSON.parse(
                                    base64_decode(
                                      bookingComponents[0]?.fareReference
                                    )
                                  ).map((item) => {
                                    return (
                                      item.Id +
                                      "(" +
                                      (item.IsDefault == true &&
                                      item.IsAgent == false
                                        ? "Default"
                                        : item.IsDefault == false &&
                                          item.IsAgent == false
                                        ? "Dynamic"
                                        : item.IsDefault == false &&
                                          item.IsAgent == true
                                        ? "Agent"
                                        : "") +
                                      ") " +
                                      (item.DiscountType == 1
                                        ? "Markup"
                                        : "Discount") +
                                      " " +
                                      item.Value +
                                      (item.Type == 1 ? "%" : "") +
                                      "\n"
                                    );
                                  })
                                : ""
                            }
                          >
                            {currency !== undefined ? currency : "AED"}{" "}
                            {(
                              passengerFares.cnn.totalPrice *
                                passengerCounts.cnn +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.cnn !== null
                                    ? passengerCounts.cnn
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                        </>
                      ) : (
                        <>
                          {" "}
                          <td className="right fw-bold">
                            {currency !== undefined ? currency : "AED"}{" "}
                            {(
                              passengerFares.cnn.totalPrice *
                                passengerCounts.cnn +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.cnn !== null
                                    ? passengerCounts.cnn
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                        </>
                      )}
                    </tr>
                  </>
                ) : (
                  <></>
                )}

                {passengerFares.inf !== null ? (
                  <>
                    <tr>
                      <td className="left">Infant</td>
                      <td className="left">
                        {(
                          passengerFares.inf.basePrice +
                          bookingComponents[0].agentAdditionalPrice /
                            (passengerCounts.adt +
                              (passengerCounts.cnn !== null
                                ? passengerCounts.cnn
                                : 0) +
                              (passengerCounts.inf !== null
                                ? passengerCounts.inf
                                : 0))
                        ).toLocaleString("en-US")}
                      </td>
                      <td className="center">
                        {passengerFares.inf.taxes.toLocaleString("en-US")}
                      </td>
                      <td className="right">
                        {(
                          passengerFares.inf.discountPrice +
                          sumTaxesDiscount(
                            passengerFares.inf.taxCommissionBreakdowns
                          )
                        ).toLocaleString("en-US")}
                      </td>
                      <td className="right">
                        {passengerFares.inf.ait.toLocaleString("en-US")}
                      </td>
                      <td className="right">{passengerCounts.inf}</td>
                      {isTempInspector !== null && isTempInspector == "true" ? (
                        <>
                          {" "}
                          <td
                            className="right fw-bold"
                            title={
                              bookingComponents[0]?.fareReference !== ""
                                ? JSON.parse(
                                    base64_decode(
                                      bookingComponents[0]?.fareReference
                                    )
                                  ).map((item) => {
                                    return (
                                      item.Id +
                                      "(" +
                                      (item.IsDefault == true &&
                                      item.IsAgent == false
                                        ? "Default"
                                        : item.IsDefault == false &&
                                          item.IsAgent == false
                                        ? "Dynamic"
                                        : item.IsDefault == false &&
                                          item.IsAgent == true
                                        ? "Agent"
                                        : "") +
                                      ") " +
                                      (item.DiscountType == 1
                                        ? "Markup"
                                        : "Discount") +
                                      " " +
                                      item.Value +
                                      (item.Type == 1 ? "%" : "") +
                                      "\n"
                                    );
                                  })
                                : " "
                            }
                          >
                            {currency !== undefined ? currency : "AED"}{" "}
                            {(
                              passengerFares.inf.totalPrice *
                                passengerCounts.inf +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.cnn !== null
                                    ? passengerCounts.cnn
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                        </>
                      ) : (
                        <>
                          {" "}
                          <td className="right fw-bold">
                            {currency !== undefined ? currency : "AED"}{" "}
                            {(
                              passengerFares.inf.totalPrice *
                                passengerCounts.inf +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.cnn !== null
                                    ? passengerCounts.cnn
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                        </>
                      )}
                    </tr>
                  </>
                ) : (
                  <></>
                )}
                <tr className="fw-bold">
                  <td colSpan={5} className="border-none"></td>
                  <td>Grand Total</td>
                  <td>
                    {currency !== undefined ? currency : "AED"}{" "}
                    {bookingComponents[0].totalPrice.toLocaleString("en-US")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}
          {brandedFareToggle && (
            <section className="bg-light p-2">
              <div className="container">
                <div className="row">
                  <div className="col-lg-2">
                    <div
                      className="py-2"
                      style={{ width: "full", cursor: "pointer" }}
                    >
                      <div
                        className={
                          "card border-0 border-bottom border-primary shadow-sm  rounded"
                        }
                      >
                        <div className="button-secondary-color px-3 py-2 rounded-top">
                          <Text
                            fontSize={"10px"}
                            className="text-white text-center"
                          >
                            Fare Type
                          </Text>
                        </div>
                        <div
                          className="card-body px-3 py-1 p-xxl-5"
                          style={{ height: "300px" }}
                        >
                          <ul className="list-group list-group-flush mb-4">
                            {brandedFareTitleList?.map((item) => (
                              <div
                                className="d-flex gap-2 justify-content-start align-items-center border-bottom py-2 fw-bold"
                                style={{
                                  fontSize: "10px",
                                  height: "40px",
                                }}
                              >
                                {item?.icon}
                                {item?.name}
                              </div>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                  <div className="col-lg-10">
                    <Carousel responsive={responsive}>
                      {brandedFares !== null &&
                        brandedFares !== undefined &&
                        brandedFares.length > 0 &&
                        brandedFares?.map((item, i) => (
                          <div
                            className="p-2"
                            style={{ width: "full", cursor: "pointer" }}
                          >
                            <div
                              className={
                                i === selectedBrandedFareIdx
                                  ? "card border-0 border-bottom border-primary shadow-sm  rounded selected-bg-color"
                                  : "card border-0 border-bottom border-primary shadow-sm  rounded"
                              }
                              onClick={() => setSelectedBrandedFareIdx(i)}
                            >
                              <div className="button-secondary-color px-3 py-2 rounded-top">
                                <Text
                                  fontSize={"10px"}
                                  className="text-white text-center"
                                >
                                  {item?.name}
                                </Text>
                              </div>
                              <div
                                className="card-body px-3 py-1 p-xxl-5"
                                style={{ height: "300px" }}
                              >
                                <ul className="list-group list-group-flush mb-2">
                                  {(() => {
                                    const brandFeatures = {
                                      HandBaggage: "7Kg",
                                      CheckedBaggage:
                                        item?.brandFeatures?.CheckedBaggage !==
                                        undefined
                                          ? item.brandFeatures.CheckedBaggage
                                          : null,
                                      // Meal:
                                      //   item?.brandFeatures?.CheckedBaggage !==
                                      //   undefined
                                      //     ? item.brandFeatures.Meal
                                      //     : null,
                                      // SeatSelection:
                                      //   item?.brandFeatures?.CheckedBaggage !==
                                      //   undefined
                                      //     ? item.brandFeatures.SeatSelection
                                      //     : null,
                                      Changeable:
                                        item?.brandFeatures?.Changeable !==
                                        undefined
                                          ? item.brandFeatures.Changeable
                                          : null,
                                      Refundable:
                                        item?.brandFeatures?.Refundable !==
                                        undefined
                                          ? item.brandFeatures.Refundable
                                          : null,
                                      // Miles:
                                      //   item?.brandFeatures?.Miles !==
                                      //   undefined
                                      //     ? item.brandFeatures.Miles
                                      //     : null,
                                      BookingClass:
                                        item?.bookingClasses !== undefined
                                          ? item.bookingClasses
                                          : null,
                                    };

                                    return Object.keys(brandFeatures).map(
                                      (key) => {
                                        const value = brandFeatures[key];

                                        if (
                                          value === null ||
                                          value === undefined
                                        ) {
                                          return (
                                            <div
                                              className="border-bottom py-2 d-flex justify-content-center align-items-center"
                                              style={{
                                                fontSize: "10px",
                                                height: "40px",
                                              }}
                                              key={key}
                                            >
                                              <MdOutlineClose
                                                className="text-danger rounded-circle shadow"
                                                style={{
                                                  backgroundColor: "white",
                                                  width: "15px",
                                                  height: "15px",
                                                  fontSize: "12px",
                                                  padding: "2px",
                                                }}
                                              />
                                            </div>
                                          );
                                        }

                                        if (Array.isArray(value)) {
                                          const allObjects = value.every(
                                            (item) =>
                                              typeof item === "object" &&
                                              item !== null
                                          );

                                          if (allObjects) {
                                            return (
                                              <div
                                                key={key}
                                                className="d-flex justify-content-center align-items-center border-bottom py-2 fw-bold"
                                                style={{
                                                  fontSize: "10px",
                                                  height: "40px",
                                                }}
                                              >
                                                <Tooltip
                                                  bg="#ed7f22"
                                                  p={"5px"}
                                                  label={
                                                    <div
                                                      style={{
                                                        overflowY: "auto",
                                                        fontSize: "12px",
                                                      }}
                                                    >
                                                      <table
                                                        className="table-bordered"
                                                        style={{
                                                          width: "100%",
                                                        }}
                                                      >
                                                        <thead className="text-center thead text-white fw-bold">
                                                          <tr>
                                                            <th className="py-1">
                                                              Direction
                                                            </th>
                                                            <th className="py-1">
                                                              Charges Applicable
                                                            </th>
                                                            <th className="py-1">
                                                              Status
                                                            </th>
                                                          </tr>
                                                        </thead>
                                                        <tbody className="text-center">
                                                          {value.map(
                                                            (obj, index) => (
                                                              <tr
                                                                key={index}
                                                                className="text-dark fw-bold"
                                                                style={{
                                                                  fontSize:
                                                                    "10px",
                                                                }}
                                                              >
                                                                {Object.keys(
                                                                  obj
                                                                )
                                                                  .reverse()
                                                                  .map(
                                                                    (
                                                                      objKey,
                                                                      idx
                                                                    ) => (
                                                                      <React.Fragment
                                                                        key={
                                                                          idx
                                                                        }
                                                                      >
                                                                        {objKey ===
                                                                          "direction" && (
                                                                          <td className="py-1">
                                                                            {
                                                                              obj[
                                                                                objKey
                                                                              ]
                                                                            }
                                                                          </td>
                                                                        )}
                                                                        {objKey ===
                                                                          "chargesApplicable" && (
                                                                          <td className="py-1">
                                                                            {obj[
                                                                              objKey
                                                                            ] ===
                                                                            true
                                                                              ? "Yes"
                                                                              : "No"}
                                                                          </td>
                                                                        )}
                                                                        {objKey ===
                                                                          "desc" && (
                                                                          <td className="py-1">
                                                                            <span
                                                                              style={{
                                                                                fontSize:
                                                                                  "10px",
                                                                              }}
                                                                            >
                                                                              {
                                                                                obj[
                                                                                  objKey
                                                                                ]
                                                                              }
                                                                            </span>
                                                                          </td>
                                                                        )}
                                                                      </React.Fragment>
                                                                    )
                                                                  )}
                                                              </tr>
                                                            )
                                                          )}
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                  }
                                                  aria-label="Changeable Details"
                                                  hasArrow
                                                  placement="bottom"
                                                  openDelay={500} // optional, delay before showing tooltip
                                                >
                                                  <span
                                                    className="button-color rounded-pill px-3 py-1 text-white d-flex align-items-center"
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    Changeable
                                                    <i
                                                      className="fa fa-calendar mx-1"
                                                      aria-hidden="true"
                                                    ></i>{" "}
                                                    Details
                                                  </span>
                                                </Tooltip>
                                              </div>
                                            );
                                          }
                                        } else if (isNestedObject(value)) {
                                          return (
                                            <div
                                              key={key}
                                              className="d-flex justify-content-center align-items-center border-bottom py-2 fw-bold"
                                              style={{
                                                fontSize: "10px",
                                                height: "40px",
                                              }}
                                            >
                                              <Tooltip
                                                bg="#ed7f22"
                                                p={"5px"}
                                                label={
                                                  <div
                                                    style={{
                                                      overflowY: "auto",
                                                      fontSize: "12px",
                                                    }}
                                                  >
                                                    <table
                                                      className="table-bordered"
                                                      style={{
                                                        width: "auto",
                                                        fontSize: "12px",
                                                      }}
                                                    >
                                                      <thead className="text-center thead text-white fw-bold">
                                                        <tr>
                                                          <th className="py-1">
                                                            Type
                                                          </th>
                                                          <th className="py-1">
                                                            Baggage
                                                          </th>
                                                          <th className="py-1">
                                                            Direction
                                                          </th>
                                                        </tr>
                                                      </thead>
                                                      <tbody className="text-center">
                                                        {Object.keys(value).map(
                                                          (itemKey) => {
                                                            const item =
                                                              value[itemKey];
                                                            return item.map(
                                                              (obj, index) => (
                                                                <tr
                                                                  key={index}
                                                                  className="text-dark fw-bold"
                                                                  style={{
                                                                    fontSize:
                                                                      "10px",
                                                                  }}
                                                                >
                                                                  {index ===
                                                                    0 && (
                                                                    <td
                                                                      rowSpan={
                                                                        item?.length
                                                                      }
                                                                      className="align-middle py-1"
                                                                    >
                                                                      {passengerType(
                                                                        itemKey
                                                                      )}
                                                                    </td>
                                                                  )}
                                                                  {Object.keys(
                                                                    obj
                                                                  ).map(
                                                                    (
                                                                      objKey,
                                                                      idx
                                                                    ) => (
                                                                      <React.Fragment
                                                                        key={
                                                                          idx
                                                                        }
                                                                      >
                                                                        {objKey ===
                                                                          "direction" && (
                                                                          <td className="py-1">
                                                                            {
                                                                              obj[
                                                                                objKey
                                                                              ]
                                                                            }
                                                                          </td>
                                                                        )}
                                                                        {objKey ===
                                                                          "weights" && (
                                                                          <td className="py-1">
                                                                            {
                                                                              obj[
                                                                                objKey
                                                                              ]
                                                                            }
                                                                          </td>
                                                                        )}
                                                                      </React.Fragment>
                                                                    )
                                                                  )}
                                                                </tr>
                                                              )
                                                            );
                                                          }
                                                        )}
                                                      </tbody>
                                                    </table>
                                                  </div>
                                                }
                                                aria-label="Baggage Details"
                                                hasArrow
                                                placement="bottom"
                                                openDelay={500} // optional, to show the tooltip after delay
                                              >
                                                <span
                                                  className="button-color rounded-pill px-3 py-1 text-white"
                                                  style={{
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  View{" "}
                                                  <i className="fas fa-luggage-cart mx-1"></i>{" "}
                                                  Details
                                                </span>
                                              </Tooltip>
                                            </div>
                                          );
                                        } else if (typeof value === "object") {
                                          return (
                                            <div
                                              key={key}
                                              className="d-flex justify-content-center align-items-center border-bottom py-2 fw-bold"
                                              style={{
                                                fontSize: "10px",
                                                height: "40px",
                                              }}
                                            >
                                              <Tooltip
                                                bg="#ed7f22"
                                                p={"5px"}
                                                label={
                                                  <div
                                                    style={{
                                                      overflowY: "auto",
                                                      fontSize: "12px",
                                                    }}
                                                  >
                                                    <table
                                                      style={{ width: "100%" }}
                                                      className="table-bordered"
                                                    >
                                                      <thead className="text-center thead text-white fw-bold">
                                                        {key ===
                                                        "Refundable" ? (
                                                          <tr>
                                                            <th className="py-1">
                                                              Status
                                                            </th>
                                                            <th className="py-1">
                                                              Charges Applicable
                                                            </th>
                                                          </tr>
                                                        ) : key ===
                                                          "BookingClass" ? (
                                                          <tr>
                                                            <th className="py-1">
                                                              Direction
                                                            </th>
                                                            <th className="py-1">
                                                              Booking Class
                                                            </th>
                                                            {item.cabinClasses && (
                                                              <th className="py-1">
                                                                Cabin Class
                                                              </th>
                                                            )}
                                                          </tr>
                                                        ) : null}
                                                      </thead>
                                                      <tbody className="text-center">
                                                        {key ===
                                                          "BookingClass" && (
                                                          <>
                                                            {Object.keys(
                                                              value
                                                            ).map(
                                                              (innerKey) => (
                                                                <tr
                                                                  key={innerKey}
                                                                  className="text-dark fw-bold"
                                                                  style={{
                                                                    fontSize:
                                                                      "10px",
                                                                  }}
                                                                >
                                                                  <td className="py-1">
                                                                    <span
                                                                      style={{
                                                                        fontSize:
                                                                          "10px",
                                                                      }}
                                                                    >
                                                                      {innerKey}
                                                                    </span>
                                                                  </td>
                                                                  <td className="py-1">
                                                                    <span
                                                                      style={{
                                                                        fontSize:
                                                                          "10px",
                                                                      }}
                                                                    >{` ${value[innerKey]}`}</span>
                                                                  </td>
                                                                  <td className="py-1">
                                                                    <span
                                                                      style={{
                                                                        fontSize:
                                                                          "10px",
                                                                      }}
                                                                    >
                                                                      {item.cabinClasses &&
                                                                      item
                                                                        .cabinClasses[
                                                                        innerKey
                                                                      ] !==
                                                                        undefined &&
                                                                      item
                                                                        .cabinClasses[
                                                                        innerKey
                                                                      ] !== ""
                                                                        ? item
                                                                            .cabinClasses[
                                                                            innerKey
                                                                          ]
                                                                        : searchData?.travelClass}
                                                                    </span>
                                                                  </td>
                                                                </tr>
                                                              )
                                                            )}
                                                          </>
                                                        )}

                                                        {key ===
                                                          "Refundable" && (
                                                          <tr
                                                            className="text-dark fw-bold"
                                                            style={{
                                                              fontSize: "10px",
                                                            }}
                                                          >
                                                            {Object.keys(
                                                              value
                                                            ).map(
                                                              (innerKey) => (
                                                                <React.Fragment
                                                                  key={innerKey}
                                                                >
                                                                  {innerKey ===
                                                                    "desc" && (
                                                                    <td className="py-1">
                                                                      <span
                                                                        style={{
                                                                          fontSize:
                                                                            "10px",
                                                                        }}
                                                                      >
                                                                        {
                                                                          value[
                                                                            innerKey
                                                                          ]
                                                                        }
                                                                      </span>
                                                                    </td>
                                                                  )}
                                                                  {innerKey ===
                                                                    "chargesApplicable" && (
                                                                    <td className="py-1">
                                                                      <span
                                                                        style={{
                                                                          fontSize:
                                                                            "10px",
                                                                        }}
                                                                      >
                                                                        {value[
                                                                          innerKey
                                                                        ] ===
                                                                        true
                                                                          ? "Yes"
                                                                          : "No"}
                                                                      </span>
                                                                    </td>
                                                                  )}
                                                                </React.Fragment>
                                                              )
                                                            )}
                                                          </tr>
                                                        )}
                                                      </tbody>
                                                    </table>
                                                  </div>
                                                }
                                                aria-label="Changeable Details"
                                                hasArrow
                                                placement="bottom"
                                                openDelay={500} // Optional delay before the tooltip opens
                                              >
                                                <span
                                                  className="button-color rounded-pill px-3 py-1 text-white d-flex align-items-center"
                                                  style={{
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  {key === "Refundable"
                                                    ? "Cancellation"
                                                    : key === "BookingClass" &&
                                                      "Booking Class"}
                                                  {key === "Refundable" ? (
                                                    <GiWaterRecycling className="mx-1" />
                                                  ) : (
                                                    <TbBrandBooking className="mx-1" />
                                                  )}
                                                  Details
                                                </span>
                                              </Tooltip>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div
                                              className="border-bottom py-2 d-flex align-items-center justify-content-center fw-bold"
                                              style={{
                                                fontSize: "10px",
                                                height: "40px",
                                              }}
                                              key={key}
                                            >
                                              {value}
                                            </div>
                                          );
                                        }
                                      }
                                    );
                                  })()}
                                  {amountChange === "Invoice Amount" ? (
                                    <>
                                      <div
                                        className="text-center  pt-1"
                                        style={{ fontSize: "12px" }}
                                      >
                                        Agent Fare:{" "}
                                        <span className="fw-bold">
                                          {item?.totalFare.toLocaleString(
                                            "en-US"
                                          )}
                                        </span>
                                      </div>

                                      <div
                                        className="text-center pt-1"
                                        style={{ fontSize: "12px" }}
                                      >
                                        Gross Fare:{" "}
                                        <del className="fw-bold">
                                          {(
                                            item?.totalFare - item?.discount
                                          ).toLocaleString("en-US")}
                                        </del>
                                      </div>
                                    </>
                                  ) : (
                                    <div
                                      className="text-center pt-1"
                                      style={{ fontSize: "12px" }}
                                    >
                                      Gross Fare:{" "}
                                      <span className="fw-bold">
                                        {(
                                          item?.totalFare - item?.discount
                                        ).toLocaleString("en-US")}
                                      </span>
                                    </div>
                                  )}
                                </ul>
                                <button
                                  className="btn button-color border-radius w-100 text-white"
                                  onClick={handleSelectFlight}
                                  disabled={
                                    i !== selectedBrandedFareIdx && true
                                  }
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                            {/* </div> */}
                          </div>
                        ))}
                    </Carousel>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
        {/* end of toggle option for hide */}
        {/* hide more section  */}
        {/* <div className="position-relative" id={"hide-option" + props.index}>
          <div className="position-absolute top-100 start-50 translate-middle">
            <p className="show-hide">Hide more options</p>
          </div>
        </div> */}
      </>
      <div
        className="modal fade"
        id={"farerulesModal"}
        tabIndex="-1"
        aria-labelledby="farerulesModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{ backgroundColor: "#7c04c0" }}
            >
              <h2
                style={{
                  color: "#FFF",
                  fontSize: "22px",
                  fontWeight: "bolder",
                }}
              >
                Fare Rules
              </h2>

              <button
                type="button"
                className="btn-close text-dark bg-white border-0"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setFareRules()}
              ></button>
            </div>
            <div className="modal-body" style={{ fontSize: "10px" }}>
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {fareRules !== undefined &&
                  fareRules.item2 != undefined &&
                  fareRules !== "" &&
                  fareRules.item1 != null ? (
                    fareRules.item2.isSuccess == true ? (
                      <Tabs>
                        <TabList
                          style={{
                            overflowY: "scroll",
                            backgroundColor: "#FFF",
                            width: "35%",
                          }}
                        >
                          {fareRules.item1.fareRuleDetails.map(
                            (item, index) => {
                              return (
                                <>
                                  <Tab>
                                    <p style={{ fontSize: "12px" }}>
                                      {item.type}
                                    </p>
                                  </Tab>
                                </>
                              );
                            }
                          )}
                        </TabList>
                        {fareRules.item1.fareRuleDetails.map((item, index) => {
                          return (
                            <>
                              <TabPanel>
                                <div className="panel-content">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: item.fareRuleDetail.replace(
                                        /(?:\r\n|\r|\n)/g,
                                        "<br />"
                                      ),
                                    }}
                                  ></div>
                                </div>
                              </TabPanel>
                            </>
                          );
                        })}
                      </Tabs>
                    ) : (
                      <></>
                    )
                  ) : (
                    <>
                      <div className="">
                        <p>
                          * Refund Amount= Received amount from customer -
                          Refund Charge (As per Airline Policy + Triplover
                          Convenience Fee)
                        </p>
                        <p>
                          * Date Change Amount= Date change fee as per Airline +
                          Difference of fare if any + Triplover Convenience
                          Fee.
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ModalForm isOpen={isOpen} onClose={onClose} size={"sm"}>
        <Center>
          <div className="row">
            <div className="col-lg-12 text-center m-2 p-3">
              <div className="d-flex justify-content-center">
                <IoMdWarning
                  style={{
                    color: "white",
                    height: "60px",
                    width: "60px",
                    fontWeight: "bold",
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                    backgroundColor: "red",
                    padding: "15px",
                    borderRadius: "25px",
                  }}
                />
              </div>

              {directions?.length === 2 && (
                <h5
                  className="p-2 rounded text-danger my-1 fw-bold"
                  style={{ fontSize: "15px" }}
                >
                  Invalid time combination <br></br>
                  Please select different flight.
                </h5>
              )}

              <div className="mt-1">
                <button
                  type="button"
                  className="btn button-color rounded text-white w-100"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Center>
      </ModalForm>

      <ModalForm isOpen={isOpen1} onClose={onClose1} size={"sm"}>
        <Center>
          <div className="p-3">
            {directions?.length === 2 && (
              <h5
                className="p-2 rounded text-danger my-1 fw-bold text-center"
                style={{ fontSize: "13px" }}
              >
                Time difference between two flight is: <br></br>
                <span className="fw-bold fs-4">
                  {moment
                    .utc(
                      moment
                        .duration(
                          moment(direction1.segments[0].departure).diff(
                            moment(
                              direction0.segments[
                                direction0.segments.length - 1
                              ].arrival
                            ),
                            "minute"
                          ),
                          "minutes"
                        )
                        .asMilliseconds()
                    )
                    .format("H[h] m[m]")}
                </span>
                <br></br>
                Please select confirm button for continue.
              </h5>
            )}

            <div className="mt-1 d-flex gap-2 justify-content-center">
              <button
                type="button"
                className="btn button-color text-white border-radius"
                onClick={() => {
                  onClose1();
                  navigate("/travellcart");
                }}
              >
                Confirm
              </button>
              <button
                type="button"
                className="btn bg-danger text-white border-radius"
                onClick={() => {
                  onClose1();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Center>
      </ModalForm>

      <ModalForm isOpen={isOpen2} onClose={onClose2} size={"sm"}>
        <Center>
          <div className="p-3">
            <h5
              className="p-2 rounded my-1 fw-bold text-center text-danger"
              style={{ fontSize: "15px" }}
            >
              Flight have different fare than {searchData?.travelClass}
            </h5>

            <div className="d-flex justify-content-center gap-1 flex-wrap my-1">
              {brandedFares !== null &&
              brandedFares !== undefined &&
              brandedFares?.length > 0 ? (
                <>
                  {renderBrandedFare(
                    brandedFares[selectedBrandedFareIdx]?.cabinClasses,
                    searchData
                  )}
                </>
              ) : (
                <>
                  {renderSegments(direction0.segments)}
                  {renderSegments(direction1.segments)}
                  {renderSegments(direction2.segments)}
                  {renderSegments(direction3.segments)}
                  {renderSegments(direction4.segments)}
                  {renderSegments(direction5.segments)}
                </>
              )}
            </div>

            <h5
              className="p-2 rounded text-danger my-1 fw-bold text-center"
              style={{ fontSize: "15px" }}
            >
              Are you sure to continue?
            </h5>

            <div className="d-flex gap-2 justify-content-center">
              <button
                type="button"
                className="btn button-color text-white border-radius"
                onClick={() => {
                  onClose2();
                  navigate("/travellcart");
                }}
              >
                Confirm
              </button>
              <button
                type="button"
                className="btn bg-danger text-white border-radius"
                onClick={() => {
                  onClose2();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Center>
      </ModalForm>
      <Modal
        isCentered
        isOpen={isOpen3}
        onClose={onClose3}
        trapFocus={false}
        closeOnOverlayClick={false}
        size={"4xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <Box borderBottom="2px solid #bbc5d3">
            <ModalHeader>Price Breakdown</ModalHeader>
            <ModalCloseButton onClick={() => onClose3()} />
          </Box>
          <ModalBody>
            <Box pb="20px">
              <table
                className="table table-bordered p-3 table-sm"
                style={{ fontSize: "12px" }}
              >
                <thead className="text-end button-color text-white fw-bold">
                  <tr>
                    <th className="text-center">Type</th>
                    <th>Base</th>
                    <th>Tax</th>
                    <th>Commission</th>
                    <th>AIT</th>
                    <th>Pax</th>
                    <th>Total Pax Fare</th>
                  </tr>
                </thead>
                {brandedFares !== null &&
                brandedFares !== undefined &&
                brandedFares?.length > 0 ? (
                  <tbody className="text-end">
                    {brandedFares[selectedBrandedFareIdx]?.paxFareBreakDown
                      .adt !== null ? (
                      <>
                        <tr>
                          <td className="text-center">Adult</td>
                          <td>
                            {(brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.adt.basePrice).toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td>
                            {brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.adt.taxes.toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td>
                            {(brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.adt.discountPrice).toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td>
                            {brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.adt.ait.toLocaleString("en-US")}
                          </td>
                          <td>{passengerCounts.adt}</td>
                          {isTempInspector !== null &&
                          isTempInspector == "true" ? (
                            <>
                              <td
                                className="fw-bold"
                                title={
                                  bookingComponents[0]?.fareReference !== "" &&
                                  bookingComponents[0]?.fareReference !== null
                                    ? JSON.parse(
                                        base64_decode(
                                          bookingComponents[0]?.fareReference
                                        )
                                      ).map((item) => {
                                        return (
                                          item.Id +
                                          "(" +
                                          (item.IsDefault == true &&
                                          item.IsAgent == false
                                            ? "Default"
                                            : item.IsDefault == false &&
                                              item.IsAgent == false
                                            ? "Dynamic"
                                            : item.IsDefault == false &&
                                              item.IsAgent == true
                                            ? "Agent"
                                            : "") +
                                          ") " +
                                          (item.DiscountType == 1
                                            ? "Markup"
                                            : "Discount") +
                                          " " +
                                          item.Value +
                                          (item.Type == 1 ? "%" : "") +
                                          "\n"
                                        );
                                      })
                                    : ""
                                }
                              >
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  brandedFares[selectedBrandedFareIdx]
                                    ?.paxFareBreakDown.adt.totalPrice *
                                  passengerCounts.adt
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="fw-bold">
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  brandedFares[selectedBrandedFareIdx]
                                    ?.paxFareBreakDown.adt.totalPrice *
                                  passengerCounts.adt
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}

                    {brandedFares[selectedBrandedFareIdx]?.paxFareBreakDown
                      .chd !== null ? (
                      <>
                        <tr>
                          <td className="text-center">Child &gt; 5</td>
                          <td className="left">
                            {(brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.chd.basePrice).toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="center">
                            {brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.chd.taxes.toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="right">
                            {(brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.chd.discountPrice).toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="right">
                            {brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.chd.ait.toLocaleString("en-US")}
                          </td>
                          <td className="right">{passengerCounts.chd}</td>
                          {isTempInspector !== null &&
                          isTempInspector == "true" ? (
                            <>
                              {" "}
                              <td
                                className="right fw-bold"
                                title={
                                  bookingComponents[0]?.fareReference !== "" &&
                                  bookingComponents[0]?.fareReference !== null
                                    ? JSON.parse(
                                        base64_decode(
                                          bookingComponents[0]?.fareReference
                                        )
                                      ).map((item) => {
                                        return (
                                          item.Id +
                                          "(" +
                                          (item.IsDefault == true &&
                                          item.IsAgent == false
                                            ? "Default"
                                            : item.IsDefault == false &&
                                              item.IsAgent == false
                                            ? "Dynamic"
                                            : item.IsDefault == false &&
                                              item.IsAgent == true
                                            ? "Agent"
                                            : "") +
                                          ") " +
                                          (item.DiscountType == 1
                                            ? "Markup"
                                            : "Discount") +
                                          " " +
                                          item.Value +
                                          (item.Type == 1 ? "%" : "") +
                                          "\n"
                                        );
                                      })
                                    : ""
                                }
                              >
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  brandedFares[selectedBrandedFareIdx]
                                    ?.paxFareBreakDown.chd.totalPrice *
                                  passengerCounts.chd
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          ) : (
                            <>
                              {" "}
                              <td className="right fw-bold">
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  brandedFares[selectedBrandedFareIdx]
                                    ?.paxFareBreakDown.chd.totalPrice *
                                  passengerCounts.chd
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}

                    {brandedFares[selectedBrandedFareIdx]?.paxFareBreakDown
                      .cnn !== null ? (
                      <>
                        <tr>
                          <td className="text-center">
                            Child{" "}
                            {brandedFares[selectedBrandedFareIdx]
                              ?.paxFareBreakDown.chd === null ? (
                              <></>
                            ) : (
                              <> &#60; 5</>
                            )}
                          </td>
                          <td className="left">
                            {(brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.cnn.basePrice).toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="center">
                            {brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.cnn.taxes.toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="right">
                            {(brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.cnn.discountPrice).toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="right">
                            {brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.cnn.ait.toLocaleString("en-US")}
                          </td>
                          <td className="right">{passengerCounts.cnn}</td>
                          {isTempInspector !== null &&
                          isTempInspector == "true" ? (
                            <>
                              {" "}
                              <td
                                className="right fw-bold"
                                title={
                                  bookingComponents[0]?.fareReference !== "" &&
                                  bookingComponents[0]?.fareReference !== null
                                    ? JSON.parse(
                                        base64_decode(
                                          bookingComponents[0]?.fareReference
                                        )
                                      ).map((item) => {
                                        return (
                                          item.Id +
                                          "(" +
                                          (item.IsDefault == true &&
                                          item.IsAgent == false
                                            ? "Default"
                                            : item.IsDefault == false &&
                                              item.IsAgent == false
                                            ? "Dynamic"
                                            : item.IsDefault == false &&
                                              item.IsAgent == true
                                            ? "Agent"
                                            : "") +
                                          ") " +
                                          (item.DiscountType == 1
                                            ? "Markup"
                                            : "Discount") +
                                          " " +
                                          item.Value +
                                          (item.Type == 1 ? "%" : "") +
                                          "\n"
                                        );
                                      })
                                    : ""
                                }
                              >
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  brandedFares[selectedBrandedFareIdx]
                                    ?.paxFareBreakDown.cnn.totalPrice *
                                  passengerCounts.cnn
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          ) : (
                            <>
                              {" "}
                              <td className="right fw-bold">
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  brandedFares[selectedBrandedFareIdx]
                                    ?.paxFareBreakDown.cnn.totalPrice *
                                  passengerCounts.cnn
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}

                    {brandedFares[selectedBrandedFareIdx]?.paxFareBreakDown
                      .inf !== null ? (
                      <>
                        <tr>
                          <td className="text-center">Infant</td>
                          <td className="left">
                            {(brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.inf.basePrice).toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="center">
                            {brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.inf.taxes.toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="right">
                            {(brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.inf.discountPrice).toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="right">
                            {brandedFares[
                              selectedBrandedFareIdx
                            ]?.paxFareBreakDown.inf.ait.toLocaleString("en-US")}
                          </td>
                          <td className="right">{passengerCounts.inf}</td>
                          {isTempInspector !== null &&
                          isTempInspector == "true" ? (
                            <>
                              {" "}
                              <td
                                className="right fw-bold"
                                title={
                                  bookingComponents[0]?.fareReference !== "" &&
                                  bookingComponents[0]?.fareReference !== null
                                    ? JSON.parse(
                                        base64_decode(
                                          bookingComponents[0]?.fareReference
                                        )
                                      ).map((item) => {
                                        return (
                                          item.Id +
                                          "(" +
                                          (item.IsDefault == true &&
                                          item.IsAgent == false
                                            ? "Default"
                                            : item.IsDefault == false &&
                                              item.IsAgent == false
                                            ? "Dynamic"
                                            : item.IsDefault == false &&
                                              item.IsAgent == true
                                            ? "Agent"
                                            : "") +
                                          ") " +
                                          (item.DiscountType == 1
                                            ? "Markup"
                                            : "Discount") +
                                          " " +
                                          item.Value +
                                          (item.Type == 1 ? "%" : "") +
                                          "\n"
                                        );
                                      })
                                    : " "
                                }
                              >
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  brandedFares[selectedBrandedFareIdx]
                                    ?.paxFareBreakDown.inf.totalPrice *
                                  passengerCounts.inf
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          ) : (
                            <>
                              {" "}
                              <td className="right fw-bold">
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  brandedFares[selectedBrandedFareIdx]
                                    ?.paxFareBreakDown.inf.totalPrice *
                                  passengerCounts.inf
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}
                    <tr className="fw-bold">
                      <td colSpan={5} className="border-none"></td>
                      <td>Grand Total</td>
                      <td>
                        {currency !== undefined ? currency : "AED"}{" "}
                        {brandedFares[selectedBrandedFareIdx]?.paxFareBreakDown
                          .adt !== null &&
                          (
                            brandedFares[selectedBrandedFareIdx]
                              ?.paxFareBreakDown.adt.totalPrice *
                              passengerCounts.adt +
                            (brandedFares[selectedBrandedFareIdx]
                              ?.paxFareBreakDown.chd !== null &&
                              brandedFares[selectedBrandedFareIdx]
                                ?.paxFareBreakDown.chd.totalPrice *
                                passengerCounts.chd) +
                            (brandedFares[selectedBrandedFareIdx]
                              ?.paxFareBreakDown.cnn !== null &&
                              brandedFares[selectedBrandedFareIdx]
                                ?.paxFareBreakDown.cnn.totalPrice *
                                passengerCounts.cnn) +
                            (brandedFares[selectedBrandedFareIdx]
                              ?.paxFareBreakDown.inf !== null &&
                              brandedFares[selectedBrandedFareIdx]
                                ?.paxFareBreakDown.inf.totalPrice *
                                passengerCounts.inf)
                          ).toLocaleString("en-US")}
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="text-end">
                    {passengerFares.adt !== null ? (
                      <>
                        <tr>
                          <td className="text-center">Adult</td>
                          <td className="left">
                            {(
                              passengerFares.adt.basePrice +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.cnn !== null
                                    ? passengerCounts.cnn
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                          <td className="center">
                            {passengerFares.adt.taxes.toLocaleString("en-US")}
                          </td>
                          <td className="right">
                            {passengerFares.adt.discountPrice.toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="right">
                            {passengerFares.adt.ait.toLocaleString("en-US")}
                          </td>
                          <td className="right">{passengerCounts.adt}</td>
                          {isTempInspector !== null &&
                          isTempInspector == "true" ? (
                            <>
                              <td
                                className="right fw-bold"
                                title={
                                  bookingComponents[0]?.fareReference !== ""
                                    ? JSON.parse(
                                        base64_decode(
                                          bookingComponents[0]?.fareReference
                                        )
                                      ).map((item) => {
                                        return (
                                          item.Id +
                                          "(" +
                                          (item.IsDefault == true &&
                                          item.IsAgent == false
                                            ? "Default"
                                            : item.IsDefault == false &&
                                              item.IsAgent == false
                                            ? "Dynamic"
                                            : item.IsDefault == false &&
                                              item.IsAgent == true
                                            ? "Agent"
                                            : "") +
                                          ") " +
                                          (item.DiscountType == 1
                                            ? "Markup"
                                            : "Discount") +
                                          " " +
                                          item.Value +
                                          (item.Type == 1 ? "%" : "") +
                                          "\n"
                                        );
                                      })
                                    : ""
                                }
                              >
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  passengerFares.adt.totalPrice *
                                    passengerCounts.adt +
                                  bookingComponents[0].agentAdditionalPrice /
                                    (passengerCounts.adt +
                                      (passengerCounts.cnn !== null
                                        ? passengerCounts.cnn
                                        : 0) +
                                      (passengerCounts.inf !== null
                                        ? passengerCounts.inf
                                        : 0))
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="right fw-bold">
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  passengerFares.adt.totalPrice *
                                    passengerCounts.adt +
                                  bookingComponents[0].agentAdditionalPrice /
                                    (passengerCounts.adt +
                                      (passengerCounts.cnn !== null
                                        ? passengerCounts.cnn
                                        : 0) +
                                      (passengerCounts.inf !== null
                                        ? passengerCounts.inf
                                        : 0))
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}

                    {passengerFares.chd !== null ? (
                      <>
                        <tr>
                          <td className="text-center">Child &gt; 5</td>
                          <td className="left">
                            {(
                              passengerFares.chd.basePrice +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.chd !== null
                                    ? passengerCounts.chd
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                          <td className="center">
                            {passengerFares.chd.taxes.toLocaleString("en-US")}
                          </td>
                          <td className="right">
                            {passengerFares.chd.discountPrice.toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="right">
                            {passengerFares.chd.ait.toLocaleString("en-US")}
                          </td>
                          <td className="right">{passengerCounts.chd}</td>
                          {isTempInspector !== null &&
                          isTempInspector == "true" ? (
                            <>
                              {" "}
                              <td
                                className="right fw-bold"
                                title={
                                  bookingComponents[0]?.fareReference !== ""
                                    ? JSON.parse(
                                        base64_decode(
                                          bookingComponents[0]?.fareReference
                                        )
                                      ).map((item) => {
                                        return (
                                          item.Id +
                                          "(" +
                                          (item.IsDefault == true &&
                                          item.IsAgent == false
                                            ? "Default"
                                            : item.IsDefault == false &&
                                              item.IsAgent == false
                                            ? "Dynamic"
                                            : item.IsDefault == false &&
                                              item.IsAgent == true
                                            ? "Agent"
                                            : "") +
                                          ") " +
                                          (item.DiscountType == 1
                                            ? "Markup"
                                            : "Discount") +
                                          " " +
                                          item.Value +
                                          (item.Type == 1 ? "%" : "") +
                                          "\n"
                                        );
                                      })
                                    : ""
                                }
                              >
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  passengerFares.chd.totalPrice *
                                    passengerCounts.chd +
                                  bookingComponents[0].agentAdditionalPrice /
                                    (passengerCounts.adt +
                                      (passengerCounts.chd !== null
                                        ? passengerCounts.chd
                                        : 0) +
                                      (passengerCounts.inf !== null
                                        ? passengerCounts.inf
                                        : 0))
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          ) : (
                            <>
                              {" "}
                              <td className="right fw-bold">
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  passengerFares.chd.totalPrice *
                                    passengerCounts.chd +
                                  bookingComponents[0].agentAdditionalPrice /
                                    (passengerCounts.adt +
                                      (passengerCounts.chd !== null
                                        ? passengerCounts.chd
                                        : 0) +
                                      (passengerCounts.inf !== null
                                        ? passengerCounts.inf
                                        : 0))
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}

                    {passengerFares.cnn !== null ? (
                      <>
                        <tr>
                          <td className="text-center">
                            Child{" "}
                            {passengerFares.chd === null ? (
                              <></>
                            ) : (
                              <> &#60; 5</>
                            )}
                          </td>
                          <td className="left">
                            {(
                              passengerFares.cnn.basePrice +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.cnn !== null
                                    ? passengerCounts.cnn
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                          <td className="center">
                            {passengerFares.cnn.taxes.toLocaleString("en-US")}
                          </td>
                          <td className="right">
                            {passengerFares.cnn.discountPrice.toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="right">
                            {passengerFares.cnn.ait.toLocaleString("en-US")}
                          </td>
                          <td className="right">{passengerCounts.cnn}</td>
                          {isTempInspector !== null &&
                          isTempInspector == "true" ? (
                            <>
                              {" "}
                              <td
                                className="right fw-bold"
                                title={
                                  bookingComponents[0]?.fareReference !== ""
                                    ? JSON.parse(
                                        base64_decode(
                                          bookingComponents[0]?.fareReference
                                        )
                                      ).map((item) => {
                                        return (
                                          item.Id +
                                          "(" +
                                          (item.IsDefault == true &&
                                          item.IsAgent == false
                                            ? "Default"
                                            : item.IsDefault == false &&
                                              item.IsAgent == false
                                            ? "Dynamic"
                                            : item.IsDefault == false &&
                                              item.IsAgent == true
                                            ? "Agent"
                                            : "") +
                                          ") " +
                                          (item.DiscountType == 1
                                            ? "Markup"
                                            : "Discount") +
                                          " " +
                                          item.Value +
                                          (item.Type == 1 ? "%" : "") +
                                          "\n"
                                        );
                                      })
                                    : ""
                                }
                              >
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  passengerFares.cnn.totalPrice *
                                    passengerCounts.cnn +
                                  bookingComponents[0].agentAdditionalPrice /
                                    (passengerCounts.adt +
                                      (passengerCounts.cnn !== null
                                        ? passengerCounts.cnn
                                        : 0) +
                                      (passengerCounts.inf !== null
                                        ? passengerCounts.inf
                                        : 0))
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          ) : (
                            <>
                              {" "}
                              <td className="right fw-bold">
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  passengerFares.cnn.totalPrice *
                                    passengerCounts.cnn +
                                  bookingComponents[0].agentAdditionalPrice /
                                    (passengerCounts.adt +
                                      (passengerCounts.cnn !== null
                                        ? passengerCounts.cnn
                                        : 0) +
                                      (passengerCounts.inf !== null
                                        ? passengerCounts.inf
                                        : 0))
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}

                    {passengerFares.inf !== null ? (
                      <>
                        <tr>
                          <td className="text-center">Infant</td>
                          <td className="left">
                            {(
                              passengerFares.inf.basePrice +
                              bookingComponents[0].agentAdditionalPrice /
                                (passengerCounts.adt +
                                  (passengerCounts.cnn !== null
                                    ? passengerCounts.cnn
                                    : 0) +
                                  (passengerCounts.inf !== null
                                    ? passengerCounts.inf
                                    : 0))
                            ).toLocaleString("en-US")}
                          </td>
                          <td className="center">
                            {passengerFares.inf.taxes.toLocaleString("en-US")}
                          </td>
                          <td className="right">
                            {passengerFares.inf.discountPrice.toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td className="right">
                            {passengerFares.inf.ait.toLocaleString("en-US")}
                          </td>
                          <td className="right">{passengerCounts.inf}</td>
                          {isTempInspector !== null &&
                          isTempInspector == "true" ? (
                            <>
                              {" "}
                              <td
                                className="right fw-bold"
                                title={
                                  bookingComponents[0]?.fareReference !== ""
                                    ? JSON.parse(
                                        base64_decode(
                                          bookingComponents[0]?.fareReference
                                        )
                                      ).map((item) => {
                                        return (
                                          item.Id +
                                          "(" +
                                          (item.IsDefault == true &&
                                          item.IsAgent == false
                                            ? "Default"
                                            : item.IsDefault == false &&
                                              item.IsAgent == false
                                            ? "Dynamic"
                                            : item.IsDefault == false &&
                                              item.IsAgent == true
                                            ? "Agent"
                                            : "") +
                                          ") " +
                                          (item.DiscountType == 1
                                            ? "Markup"
                                            : "Discount") +
                                          " " +
                                          item.Value +
                                          (item.Type == 1 ? "%" : "") +
                                          "\n"
                                        );
                                      })
                                    : " "
                                }
                              >
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  passengerFares.inf.totalPrice *
                                    passengerCounts.inf +
                                  bookingComponents[0].agentAdditionalPrice /
                                    (passengerCounts.adt +
                                      (passengerCounts.cnn !== null
                                        ? passengerCounts.cnn
                                        : 0) +
                                      (passengerCounts.inf !== null
                                        ? passengerCounts.inf
                                        : 0))
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          ) : (
                            <>
                              {" "}
                              <td className="right fw-bold">
                                {currency !== undefined ? currency : "AED"}{" "}
                                {(
                                  passengerFares.inf.totalPrice *
                                    passengerCounts.inf +
                                  bookingComponents[0].agentAdditionalPrice /
                                    (passengerCounts.adt +
                                      (passengerCounts.cnn !== null
                                        ? passengerCounts.cnn
                                        : 0) +
                                      (passengerCounts.inf !== null
                                        ? passengerCounts.inf
                                        : 0))
                                ).toLocaleString("en-US")}
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}
                    <tr className="fw-bold">
                      <td colSpan={5} className="border-none"></td>
                      <td>Grand Total</td>
                      <td>
                        {currency !== undefined ? currency : "AED"}{" "}
                        {bookingComponents[0].totalPrice.toLocaleString(
                          "en-US"
                        )}
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Drawer
        isOpen={isOpen4}
        placement="right"
        onClose={onClose4}
        finalFocusRef={btnRef}
        size={"xl"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Change Booking Class</DrawerHeader>

          <DrawerBody>
            <div className="px-2">
              {bookingClasses?.journey?.map((item, index) => (
                <div key={index}>
                  {item?.segments?.map((segment, segIndex) => (
                    <React.Fragment key={segIndex}>
                      {/* Rendering airlineCode */}
                      <div className="d-flex justify-content-between align-items-center w-100 my-3">
                        <div className="d-flex gap-3">
                          <img
                            src={
                              environment.s3ArliensImage +
                              `${directions?.[index]?.[0]?.segments?.[segIndex]?.airlineCode}.png`
                            }
                            alt="Airline logo"
                            width="40px"
                            height="40px"
                            className="mb-1 rounded-2"
                          />
                          <div>
                            <p className="fw-bold">
                              {
                                directions?.[index]?.[0]?.segments?.[segIndex]
                                  ?.airline
                              }
                            </p>
                            <p style={{ fontSize: "12px" }}>
                              {
                                directions?.[index]?.[0]?.segments?.[segIndex]
                                  ?.details?.[0]?.equipment
                              }
                            </p>
                          </div>
                        </div>
                        <div className="fs-5 fw-bold">
                          {directions?.[index]?.[0]?.segments?.[
                            segIndex
                          ]?.departure?.substr(11, 5)}
                        </div>
                        <div className="fs-5 fw-bold">
                          {directions?.[index]?.[0]?.segments?.[
                            segIndex
                          ]?.arrival?.substr(11, 5)}
                        </div>
                        <div className="fs-5 fw-bold">
                          {
                            directions?.[index]?.[0]?.segments?.[segIndex]
                              ?.duration?.[0]
                          }
                        </div>
                      </div>

                      {/* Mapping booking classes */}
                      <div
                        className="d-flex py-2 px-3"
                        style={{ backgroundColor: "#d1d8df" }}
                      >
                        {segment?.bookingClasses?.map((name, subIndex) => {
                          const totalItems =
                            item?.segments?.[0]?.bookingClasses?.length;
                          return (
                            <div key={subIndex}>
                              <button
                                className={
                                  selectedNames[index]?.[segIndex]?.rbd ===
                                  name?.bookingClassName
                                    ? "button-secondary-color rounded p-2 m-1 text-white"
                                    : "bg-light rounded p-2 m-1"
                                }
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleSelect(
                                    name?.bookingClassName,
                                    index,
                                    segIndex
                                  )
                                }
                                disabled={
                                  selectedNames[index]?.[segIndex]?.rbd ===
                                  name?.bookingClassName
                                }
                              >
                                {name?.bookingClassName} {name?.seatCount}
                                {subIndex === totalItems - 1 && <br />}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              ))}

              <div className="d-flex justify-content-end my-3">
                <button
                  type="submit"
                  className="btn button-color text-white fw-bold w-auto border-radius"
                  onClick={handleGetFare}
                >
                  {" "}
                  Get Fare
                </button>
              </div>
              {Object.keys(newBookingClassRes).length !== 0 && (
                <div className="d-flex justify-content-end my-3">
                  <button
                    type="submit"
                    className="btn button-color text-white fw-bold w-auto border-radius"
                    onClick={handleNewBookingClassBookBtn}
                  >
                    {" "}
                    Book Now
                  </button>
                </div>
              )}
            </div>

            {Object.keys(newBookingClassRes).length !== 0 && (
              <ShowFlightDataRbd
                flightType={flightType}
                direction0={newBookingClassRes?.directions[0][0]}
                direction1={
                  newBookingClassRes?.directions?.length > 1
                    ? newBookingClassRes?.directions[1][0]
                    : []
                }
                direction2={
                  newBookingClassRes?.directions?.length > 2
                    ? newBookingClassRes?.directions[2][0]
                    : []
                }
                direction3={
                  newBookingClassRes?.directions?.length > 3
                    ? newBookingClassRes?.directions[3][0]
                    : []
                }
                direction4={
                  newBookingClassRes?.directions?.length > 4
                    ? newBookingClassRes?.directions[4][0]
                    : []
                }
                direction5={
                  newBookingClassRes?.directions?.length > 5
                    ? newBookingClassRes?.directions[5][0]
                    : []
                }
                totalPrice={newBookingClassRes.totalPrice}
                bookingComponents={newBookingClassRes.bookingComponents}
                refundable={newBookingClassRes.refundable}
                uniqueTransID={newBookingClassRes.uniqueTransID}
                itemCodeRef={newBookingClassRes.itemCodeRef}
                passengerCounts={newBookingClassRes.passengerCounts}
                passengerFares={newBookingClassRes.passengerFares}
                currency={newBookingClassRes.currency}
                brandedFares={newBookingClassRes.brandedFares}
                selectedBrandedFareIdx={selectedBrandedFareIdx}
              />
            )}
          </DrawerBody>

          {/* <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>

    </>
  );
};

export default ShowFlight;

const renderSegments = (segments) => {
  const searchData = JSON.parse(sessionStorage.getItem("Database"));
  return segments?.map((item, idx) => (
    <div
      className="border rounded py-1 shadow my-1"
      style={{ fontSize: "12px" }}
      key={idx}
    >
      <div className="px-3 mx-1 fw-bold d-flex gap-1">
        <RiFlightTakeoffFill style={{ fontSize: "15px" }} /> {item?.from} -{" "}
        {item?.to}{" "}
        <span
          className={
            searchData?.travelClass === item?.cabinClass
              ? "fw-bold"
              : "text-danger fw-bold"
          }
        >
          ({item?.cabinClass})
        </span>
      </div>
    </div>
  ));
};

const renderBrandedFare = (obj, searchData) => {
  return Object.keys(obj)?.map((item, idx) => (
    <div
      className="border rounded py-1 shadow my-1"
      style={{ fontSize: "12px" }}
      key={idx}
    >
      <div className="px-3 mx-1 fw-bold d-flex gap-1">
        <RiFlightTakeoffFill style={{ fontSize: "15px" }} /> {item}
        <span className={"text-danger fw-bold"}>
          ({obj[item] !== "" ? obj[item] : searchData?.travelClass})
        </span>
      </div>
    </div>
  ));
};
