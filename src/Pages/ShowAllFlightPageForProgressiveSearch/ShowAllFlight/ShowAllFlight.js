import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Image,
  Progress,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Spinner,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import $ from "jquery";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../Loading/Loading";
import NoDataFoundPage from "../../NoDataFoundPage/NoDataFoundPage/NoDataFoundPage";
import { environment } from "../../SharePages/Utility/environment";
import ShowFlight from "../ShowFlight/ShowFlight";
import "./ShowAllFlight.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Carousel from "react-multi-carousel";
import ModalForm from "../../../common/modalForm";
import Countdown from "react-countdown";
import { BsCheckLg, BsClockHistory } from "react-icons/bs";
import {
  aircraftFilter,
  baggageFilter,
  fareTypeFilter,
  findAircraft,
  findBaggageList,
  layOverAirportFilter,
  layOverAirportName,
  layoverFilter,
  refunbableFilter,
  scheduleFilter,
  stopsFilter,
} from "../../../common/filterFunctions";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import Morning from "../../../images/Morning.svg";
import AfterNoon from "../../../images/AfterNoon.svg";
import Evening from "../../../images/Evening.svg";
import Night from "../../../images/LateNight.svg";

const CountdownWrapper = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // COUNT DOWN TIMER
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (!completed) {
      // Render a completed state
      return (
        <Box
          bg={"#7c04c0"}
          h={"100px"}
          w={"100%"}
          borderRadius={5}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={2}
        >
          <HStack>
            <VStack color={"white"}>
              <Text fontWeight={700} fontSize={"25px"}>
                {minutes}
              </Text>
              <Text>Min</Text>
            </VStack>
            <Text fontWeight={700} fontSize={"25px"} pb={8} color={"white"}>
              :
            </Text>
            <VStack color={"white"}>
              <Text fontWeight={700} fontSize={"25px"}>
                {seconds}{" "}
              </Text>
              <Text>Sec</Text>
            </VStack>
          </HStack>
        </Box>
      );
    } else {
      return onOpen();
    }
  };

  const rendererClose = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <Box
          bg={"#7c04c0"}
          h={"100px"}
          w={"100%"}
          borderRadius={5}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={2}
        >
          <HStack>
            <VStack color={"white"}>
              <Text fontWeight={700} fontSize={"25px"}>
                0
              </Text>
              <Text>Min</Text>
            </VStack>
            <Text fontWeight={700} fontSize={"25px"} pb={8} color={"white"}>
              :
            </Text>
            <VStack color={"white"}>
              <Text fontWeight={700} fontSize={"25px"}>
                0{" "}
              </Text>
              <Text>Sec</Text>
            </VStack>
          </HStack>
        </Box>
      );
    }
  };
  return (
    <>
      {isOpen ? (
        <Countdown date={Date.now()} renderer={rendererClose} />
      ) : (
        <Countdown date={Date.now() + 1799999} renderer={renderer} />
      )}

      <ModalForm isOpen={isOpen} onClose={onClose} size={"lg"}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          h={"300px"}
        >
          <VStack>
            <BsClockHistory
              style={{
                color: "#044954",
                height: "30px",
                width: "30px",
                fontWeight: "bold",
              }}
            />
            <Text fontSize={"25px"} fontWeight={500} textAlign={"center"}>
              Your current Session is over due to inactivity.
            </Text>
            <Link to="/search">
              <Button
                color={"white"}
                bg={"#7c04c0"}
                _hover={"#7c04c0"}
                className="border-radius"
              >
                Search Again
              </Button>
            </Link>
          </VStack>
        </Box>
      </ModalForm>
    </>
  );
};
const MemoCountdown = React.memo(CountdownWrapper);

const ShowAllFlight = ({
  fetchFlighData,
  originCode,
  destinationCode,
  fecthMulti,
  loading,
  airlineFilters,
  tripType,
  checkList,
  progressTime,
  fareType,
}) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 864 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 864, min: 0 },
      items: 2,
    },
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sliderRef = useRef(null);
  const { count, setCount } = useAuth();
  const [amountChange, setAmountChange] = useState("Gross Amount");
  const [currentPage, setCurrentPage] = useState(1);
  const searchData = JSON.parse(sessionStorage.getItem("Database"));

  const [clearAll, setClearAll] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { tripTypeModify } = state;
  const footerProposalList = null;
  // let [footerProposalList,setFooterProposalList] = useState([]);
  var flightsData = [];
  let mainJson;
  let jsonData;

  //skeletton loder
  let timeoutId;
  const showMessageAfterDelay = () => {
    timeoutId = setTimeout(() => {
      setShowMessage(true);
    }, 1000);
  };

  // this is the sort code
  // if(environment.usBanglaAstrfa){
  //   fetchFlighData?.airSearchResponses?.sort((a, b) => {
  //     const priority = ["2A", "BS"];
  //     if (priority.includes(a.platingCarrier) && !priority.includes(b.platingCarrier)) {
  //         return -1;
  //     }
  // });
  // }
  // if (environment.usBanglaAstrfa) {
  //   fetchFlighData?.airSearchResponses?.sort((a, b) => {
  //     const priority = ["2A", "BS"];
  //     const aIndex = priority.indexOf(a.platingCarrier);
  //     const bIndex = priority.indexOf(b.platingCarrier);
  //     if (aIndex !== -1 && bIndex !== -1) {
  //       return aIndex - bIndex;
  //     }
  //     if (aIndex !== -1) {
  //       return -1;
  //     }
  //     if (bIndex !== -1) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  // }

  if (String(tripType) === String("One Way")) {
    if (fetchFlighData !== null) {
      mainJson = fetchFlighData;
      jsonData = fetchFlighData.airSearchResponses;
    } else {
    }
  } else if (String(tripType) === String("Round Trip")) {
    if (fetchFlighData !== null) {
      mainJson = fetchFlighData;
      jsonData = fetchFlighData.airSearchResponses;
    } else {
    }
  } else if (String(tripType) === String("Multi City")) {
    if (fetchFlighData !== null) {
      mainJson = fetchFlighData;
      jsonData = fetchFlighData?.airSearchResponses;
    } else {
    }
  }
  let flightName = [];

  mainJson?.airlineFilters?.map((item) => {
    const obj = {
      name: item.airlineName,
      code: item.airlineCode,
      totalFlights: item.totalFlights,
      minPrice: item.minPrice,
    };
    flightName.push(obj);
  });

  const [price, setPrice] = useState(
    mainJson?.minMaxPrice?.maxPrice === undefined
      ? 1000000
      : mainJson?.minMaxPrice?.maxPrice
  );
  // setPrice(mainJson.minMaxPrice?.maxPrice);
  //price=mainJson.minMaxPrice?.maxPrice;
  const [name, setName] = useState([]);
  useEffect(() => {
    if (flightName && Array.isArray(flightName)) {
      const newNames = flightName.map((item) => item.code);

      // Check if the new names are different from the current names before updating state
      if (JSON.stringify(newNames) !== JSON.stringify(name)) {
        setName(newNames);
      }
    }
  }, [mainJson]);

  const [radioname, setRadioName] = useState(0);
  const [check, setCheck] = useState(false);
  const handleInput = (e) => {
    setPrice(e.target.value);
  };
  let dataPrice = [];

  const [filterPrice, setFilterPrice] = useState([0, 0]);

  useEffect(() => {
    if (mainJson?.minMaxPrice?.minPrice && mainJson?.minMaxPrice?.maxPrice) {
      setFilterPrice([
        parseInt(mainJson.minMaxPrice.minPrice) || 0,
        parseInt(mainJson.minMaxPrice.maxPrice) || 1000,
      ]);
    }
  }, [mainJson]);
  // find unique aircraft name
  const aircraftArr = findAircraft(jsonData);
  // find layOverAirport name
  const layOverAirportArr = layOverAirportName(jsonData);
  if (parseInt(radioname) === 0 && name.length === 0 && check === true) {
    dataPrice = jsonData?.filter(
      // (item) => parseInt(item.totalPrice) <= parseInt(price, 10)
      (item) =>
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) >= filterPrice[0] &&
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) <= filterPrice[1] &&
        name.some((category) => [item.platingCarrier].flat().includes(category))
    );
  } else if (parseInt(radioname) === 1 && name.length === 0 && check === true) {
    dataPrice = jsonData?.filter(
      (item) =>
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) >= filterPrice[0] &&
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) <= filterPrice[1] &&
        item.directions[0][0].stops === 0
    );
  } else if (parseInt(radioname) === 2 && name.length === 0 && check === true) {
    dataPrice = jsonData?.filter(
      (item) =>
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) >= filterPrice[0] &&
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) <= filterPrice[1] &&
        item.directions[0][0].stops === 1
    );
  } else if (parseInt(radioname) === 3 && name.length === 0 && check === true) {
    dataPrice = jsonData?.filter(
      (item) =>
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) >= filterPrice[0] &&
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) <= filterPrice[1] &&
        item.directions[0][0].stops > 1
    );
  } else if (parseInt(radioname) === 0 && name.length > 0) {
    dataPrice = jsonData?.filter(
      (item) =>
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) >= filterPrice[0] &&
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) <= filterPrice[1] &&
        name.some((category) => [item.platingCarrier].flat().includes(category))
    );
  } else if (parseInt(radioname) === 1 && name.length > 0) {
    dataPrice = jsonData?.filter(
      (item) =>
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) >= filterPrice[0] &&
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) <= filterPrice[1] &&
        name.some((category) =>
          [item.platingCarrier].flat().includes(category)
        ) &&
        item.directions[0][0].stops === 0
    );
  } else if (parseInt(radioname) === 2 && name.length > 0) {
    dataPrice = jsonData?.filter(
      (item) =>
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) >= filterPrice[0] &&
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) <= filterPrice[1] &&
        name.some((category) =>
          [item.platingCarrier].flat().includes(category)
        ) &&
        item.directions[0][0].stops === 1
    );
  } else {
    dataPrice = jsonData?.filter(
      (item) =>
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) >= filterPrice[0] &&
        parseInt(
          item.bookingComponents[0].totalPrice -
            item.bookingComponents[0].discountPrice
        ) <= filterPrice[1] &&
        name.some((category) =>
          [item.platingCarrier].flat().includes(category)
        ) &&
        item.directions[0][0].stops > 1
    );
  }

  const [airLinesCode, setAirLinesCode] = useState([]);

  const handleChange = (e, index) => {
    setCurrentPage(1);
    if (e.target.checked) {
      document.getElementById("checkDefault" + index).checked = true;
      document.getElementById("checkColor" + index).style.backgroundColor =
        "#e7ebf191";
      if (flightName.length - name.length === 1) {
        setCheck(true);
      } else {
        setCheck(false);
      }
      setAirLinesCode([...airLinesCode, e.target.value]);
      setAirLinesCode((state) => {
        setName(state); // "React is awesome!"
        return state;
      });
    } else {
      document.getElementById("checkDefault" + index).checked = false;
      document.getElementById("checkColor" + index).style.backgroundColor = "";
      setCheck(false);
      setAirLinesCode(airLinesCode.filter((id) => id !== e.target.value));
      setAirLinesCode((state) => {
        if (state.length === 0) {
          setName(flightName.map((item) => item.code));
        } else {
          setName(state);
        }
        return state;
      });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // for radio button filter
  const radioflightName = [
    { name: "All Flights" },
    { name: "Direct" },
    { name: "1 stop" },
    { name: "2 stops or more" },
  ];

  const radiohandleChange = (e) => {
    setRadioName(e.target.value);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const fareTypeList = [
    {
      name: "Regular Fare",
      value: 1,
      isClicked: false,
    },
    {
      name: "Student Fare",
      value: 2,
      isClicked: false,
    },
    {
      name: "Brandded Fare",
      value: null,
      isClicked: false,
    },
  ];

  const [fareTypeState, setFareTypeState] = useState(fareTypeList);

  const fareTypeFilterArr = fareTypeFilter(dataPrice, fareTypeState);

  const handleFareTypeChange = (e, index) => {
    setCurrentPage(1);
    if (e.target.checked) {
      setFareTypeState((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = true;
        return updatedItems;
      });
    } else {
      setFareTypeState((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = false;
        return updatedItems;
      });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // bookable filter option
  const refunbableStatus = {
    refunbable: false,
    nonRefundable: false,
  };
  const [refund, setRefund] = useState(refunbableStatus);
  const refunbableFilterArr = refunbableFilter(fareTypeFilterArr, refund);

  //Schedule filter option Depart
  const defaultDepartTime = [
    {
      min: 0,
      max: 6,
      text: "00:00 - 05:59",
      icon: Morning,
      isClicked: false,
      label: "MORNING",
    },
    {
      min: 6,
      max: 12,
      text: "06:00 - 11:59",
      icon: AfterNoon,
      isClicked: false,
      label: "AFTER NOON",
    },
    {
      min: 12,
      max: 18,
      text: "12:00 - 17:59",
      icon: Evening,
      isClicked: false,
      label: "EVENING",
    },
    {
      min: 18,
      max: 24,
      text: "18:00 - 23:59",
      icon: Night,
      isClicked: false,
      label: "LATE NIGHT",
    },
  ];
  const [departTime, setDepartTime] = useState(defaultDepartTime);
  const departTimeFilterArr = scheduleFilter(
    refunbableFilterArr,
    departTime,
    0
  );
  const handleChangeForDepart = (e, index) => {
    setCurrentPage(1);
    if (e.target.checked) {
      setDepartTime((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = true;
        return updatedItems;
      });
    } else {
      setDepartTime((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = false;
        return updatedItems;
      });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  //Schedule filter option arrival
  const defaultArrivalTime = [
    {
      min: 0,
      max: 6,
      text: "00:00 - 05:59",
      icon: Morning,
      isClicked: false,
      label: "MORNING",
    },
    {
      min: 6,
      max: 12,
      text: "06:00 - 11:59",
      icon: AfterNoon,
      isClicked: false,
      label: "AFTER NOON",
    },
    {
      min: 12,
      max: 18,
      text: "12:00 - 17:59",
      icon: Evening,
      isClicked: false,
      label: "EVENING",
    },
    {
      min: 18,
      max: 24,
      text: "18:00 - 23:59",
      icon: Night,
      isClicked: false,
      label: "LATE NIGHT",
    },
  ];
  const [arrivalTime, setArrivalTime] = useState(defaultArrivalTime);
  const arrivalTimeFilterArr = scheduleFilter(
    departTimeFilterArr,
    arrivalTime,
    1
  );

  const handleChangeForArrival = (e, index) => {
    setCurrentPage(1);
    if (e.target.checked) {
      setArrivalTime((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = true;
        return updatedItems;
      });
    } else {
      setArrivalTime((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = false;
        return updatedItems;
      });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // layover Airport filter option
  const [layOverAirport, setLayOverAirport] = useState(layOverAirportArr);
  const layOverAirportFilterArr = layOverAirportFilter(
    arrivalTimeFilterArr,
    layOverAirport
  );
  const handleChangeForlayOverAirport = (e, index) => {
    if (e.target.checked) {
      setLayOverAirport((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = true;
        return updatedItems;
      });
    } else {
      setLayOverAirport((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = false;
        return updatedItems;
      });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // Aircraft number filter
  const [aircraft, setAircraft] = useState(aircraftArr);
  const aircraftFilterArr = aircraftFilter(layOverAirportFilterArr, aircraft);
  const handleChangeForAircraft = (e, index) => {
    if (e.target.checked) {
      setAircraft((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = true;
        return updatedItems;
      });
    } else {
      setAircraft((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = false;
        return updatedItems;
      });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const [change, setChange] = useState("Select");

  // const [change, setChange] = useState('Cheapest')

  //quickest search
  const Quickestsort = (jsonData) => {
    if (change === "Select") {
      return jsonData;
    } else if (change === "Cheapest") {
      let priceFilter = jsonData.sort(
        (a, b) =>
          parseInt(
            a.bookingComponents[0].totalPrice -
              a.bookingComponents[0].discountPrice
          ) -
          parseInt(
            b.bookingComponents[0].totalPrice -
              b.bookingComponents[0].discountPrice
          )
      );
      return priceFilter;
    } else if (change === "Quickest") {
      let data = jsonData?.filter(
        (flight) => flight?.directions[0][0]?.stops === 0
      );
      return data;
    } else if (change === "Earliest") {
      const getDepartureMoment = (flight) =>
        moment(flight.directions[0][0].segments[0].departure);
      return jsonData?.sort(
        (a, b) => getDepartureMoment(a) - getDepartureMoment(b)
      );
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  //layover filter option
  const defaultLayoverTime = [
    { min: 0, max: 5, text: "00 - 05", icon: "", isClicked: false },
    {
      min: 5,
      max: 10,
      text: "05 - 10",
      icon: "",
      isClicked: false,
    },
    {
      min: 10,
      max: 15,
      text: "10 - 15+",
      icon: "",
      isClicked: false,
    },
  ];
  const [layoverTime, setLayoverTime] = useState(defaultLayoverTime);
  const layoverTimeFilterArr = layoverFilter(aircraftFilterArr, layoverTime);
  const quickFilter = Quickestsort(layoverTimeFilterArr);

   //stops modify filter
   const stopsFilterArr = stopsFilter(quickFilter, radioname);
   //baggage filter functionality
   const [baggageArr, setBaggageArr] = useState(findBaggageList(stopsFilterArr));

   useEffect(()=>{
     setBaggageArr(findBaggageList(stopsFilterArr));
   },[progressTime])
   const baggageFilterArr = baggageFilter(stopsFilterArr, baggageArr);
 
   const handleChangeForDepartBaggage = (e, index) => {
     setCurrentPage(1);
     if (e.target.checked) {
       setBaggageArr((prevItems) => {
         const updatedItems = [...prevItems];
         updatedItems[index].isClicked = true;
         return updatedItems;
       });
     } else {
       setBaggageArr((prevItems) => {
         const updatedItems = [...prevItems];
         updatedItems[index].isClicked = false;
         return updatedItems;
       });
     }
     window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
   };
  const handleChangeForLayover = (e, index) => {
    if (e.target.checked) {
      setLayoverTime((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = true;
        return updatedItems;
      });
    } else {
      setLayoverTime((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].isClicked = false;
        return updatedItems;
      });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const [showMessage, setShowMessage] = useState(false);
  // Variable to hold the timeout ID

  useEffect(() => {
    showMessageAfterDelay();
    return () => {
      // Clean up the timeout when the component is unmounted
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    showMessageAfterDelay();
    return () => {
      // Clean up the timeout when the component is unmounted
      clearTimeout(timeoutId);
    };
  }, []);

  // if (String(tripType) === String("One Way")) {
  //   flightsData = quickFilter;
  // } else if (String(tripType) === String("Round Trip")) {
  //   flightsData = quickFilter;
  // } else if (String(tripType) === String("Multi City")) {
  //   flightsData = quickFilter;
  // }

  //baggage filter
  if (String(tripType) === String("One Way")) {
    flightsData = baggageFilterArr;
  } else if (String(tripType) === String("Round Trip")) {
    flightsData = baggageFilterArr;
  } else if (String(tripType) === String("Multi City")) {
    flightsData = baggageFilterArr;
  }

  let currency = mainJson?.currency;
  sessionStorage.setItem("currency", JSON.stringify(currency));
  useEffect(() => {
    // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    $(".rotate").click(function () {
      $(this).toggleClass("down");
    });
    // stop section toggle option
    $(document).ready(function () {
      $("#stopclicksection").click(function () {
        $("#stopsection").toggle();
      });
    });

    // airlines section toggle option
    $(document).ready(function () {
      $("#airclicksection").click(function () {
        $("#airlinessection").toggle();
      });
    });

    // airlines section toggle option
    $(document).ready(function () {
      $("#baggclicksection").click(function () {
        $("#baggagesection").toggle();
      });
    });
    // airlines section toggle option
    $(document).ready(function () {
      $("#refclicksection").click(function () {
        $("#refsection").toggle();
      });
    });

    // airlines section toggle option
    $(document).ready(function () {
      $("#scheduleclicksection").click(function () {
        $("#schedulesection").toggle();
      });
    });
    // airlines section toggle option
    $(document).ready(function () {
      $("#layoverairportclicksection").click(function () {
        $("#layoverairportsection").toggle();
      });
    });
    // airlines section toggle option
    $(document).ready(function () {
      $("#aircraftclicksection").click(function () {
        $("#aircraftsection").toggle();
      });
    });
    // airlines section toggle option
    $(document).ready(function () {
      $("#layovertimeclicksection").click(function () {
        $("#layovertimesection").toggle();
      });
    });
    // airlines section toggle option
    $(document).ready(function () {
      $("#priceclicksection").click(function () {
        $("#pricesection").toggle();
      });
    });
  }, [filterPrice]);

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

  const handleProposal = () => {
    navigate("/proposal");
  };

  const clearProposal = () => {
    setCount(0);
    checkList.splice(0, checkList.length);
    setClearAll(true);
    sessionStorage.removeItem("checkList");
  };

  const [hoverPercent, setHoverPercent] = useState(0);

  const handleMouseHover = (event) => {
    const container = event.target;
    const containerWidth = container.clientWidth;
    const hoverPositionX =
      event.clientX - container.getBoundingClientRect().left;

    // Calculate the hover position in percentage
    const percentage = (hoverPositionX / containerWidth) * 100;
    setHoverPercent(percentage);
  };
  const handleMouseOut = () => {
    setHoverPercent(0);
  };

  const value = parseInt(
    filterPrice[0] +
      (parseInt(hoverPercent) / 100) * (filterPrice[1] - filterPrice[0])
  );

  const loaderArr = [0, 1, 2, 3, 4, 5, 6, 7];

  const resetFilterData = () => {
    setShowMessage(false);
    setRefund(refunbableStatus);
    showMessageAfterDelay();
    setFilterPrice([
      Math.floor(mainJson?.minMaxPrice?.minPrice),
      Math.ceil(mainJson?.minMaxPrice?.maxPrice),
    ]);
    setArrivalTime(defaultArrivalTime);
    setDepartTime(defaultDepartTime);
    setFareTypeState(fareTypeList);
    setRadioName(0);
    setName(flightName.map((item) => item.code));
    flightName.map((item, index) => {
      document.getElementById("checkDefault" + index).checked = false;
      document.getElementById("checkColor" + index).style.backgroundColor = "";
    });
    fareTypeList.map((item, index) => {
      document.getElementById("farecheckDefault" + index).checked = false;
    });
    departTime.map((item, index) => {
      document.getElementById("depart" + index).checked = false;
    });
    arrivalTime.map((item, index) => {
      document.getElementById("arrival" + index).checked = false;
    });
    radioflightName.map((item, index) => {
      document.getElementById("flexRadioDefault0").click();
    });

    document.getElementById("refDefault1").checked = false;
    document.getElementById("refDefault2").checked = false;
    // setChange("Cheapest");
    setChange("Select");
    setCurrentPage(1);
  };

  const pageSize = 20;
  const totalPages = Math.ceil(flightsData?.length / pageSize);

  const handlePageChange = (page) => {
    let currentPage = page.selected + 1;
    setCurrentPage(currentPage);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  if (environment.usBanglaAstrfa) {
    if (searchData?.fareType === "Regular" && change === "Select") {
      flightsData?.sort(
        (a, b) =>
          a.bookingComponents[0]?.totalPrice -
          a.bookingComponents[0]?.discountPrice -
          (b.bookingComponents[0]?.totalPrice -
            b.bookingComponents[0]?.discountPrice)
      );
      flightsData?.sort((a, b) => {
        const priority = ["2A", "BS"];
        const aIndex = priority.indexOf(a.platingCarrier);
        const bIndex = priority.indexOf(b.platingCarrier);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        if (aIndex !== -1) {
          return -1;
        }
        if (bIndex !== -1) {
          return 1;
        }
        return 0;
      });
    } else {
      flightsData.sort((a, b) => {
        if (a?.passengerFares === null && b?.passengerFares === null) return 0;
        if (a?.passengerFares === null) return 1;
        if (b?.passengerFares === null) return -1;
        return (
          b?.passengerFares?.adt.fareType - a?.passengerFares?.adt.fareType
        );
      });
    }
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = flightsData?.slice(startIndex, endIndex);
  let studentFareList = currentData?.filter(
    (item) => item?.passengerFares?.adt?.fareType === 2
  );

  return (
    <div>
      <ToastContainer position="bottom-right" autoClose={1500} />

      <Loading loading={loading}></Loading>
      <div className="container my-3 content-width">
        <div className="row py-4">
          <div className="col-lg-3 box-shadow bg-white custom-scrollbar pb-5 w-100 airlines-filter-position border-radius">
            {/* <MemoCountdown /> */}
            <div className="col-lg-12 text-end py-2">
              <button
                className="btn btn-sm fw-bold button-color text-white border-radius"
                onClick={() => resetFilterData()}
                style={{ fontSize: "12px" }}
              >
                <span className="pe-1">
                  <i class="fas fa-window-restore"></i>
                </span>
                Reset all filters
              </button>
            </div>
            <div className="container">
              <div className="row px-2">
                <div className="col-lg-6 mt-3">
                  <h6 className="float-start text-color fw-bold">Price</h6>
                </div>
                <div className="col-lg-6 mt-3">
                  <div className="text-end">
                    <span id="priceclicksection">
                      <i
                        className="fa fa-chevron-up rotate"
                        aria-hidden="true"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row pb-3">
                <div className="col-lg-12 mt-2" id="pricesection">
                  <div className="mt-2">
                    <Tooltip
                      hasArrow
                      label={`${parseInt(value)}`}
                      isDisabled={hoverPercent > 0 ? true : false}
                      bg="teal.500"
                      color="white"
                      placement="top"
                    >
                      <RangeSlider
                        value={[filterPrice[0], filterPrice[1]]}
                        min={parseInt(mainJson?.minMaxPrice?.minPrice)}
                        max={Math.ceil(mainJson?.minMaxPrice?.maxPrice)}
                        step={100}
                        minStepsBetweenThumbs={1}
                        onChange={(val) => {
                          setCurrentPage(1);
                          setFilterPrice(val);
                          setShowMessage(false);
                          showMessageAfterDelay();
                        }}
                      >
                        <RangeSliderTrack bg="#e5d4b1">
                          <RangeSliderFilledTrack
                            bg="#BF953F"
                            onMouseMove={handleMouseHover}
                            onMouseOut={handleMouseOut}
                          />
                        </RangeSliderTrack>
                        <RangeSliderThumb
                          bg="black"
                          boxSize={4}
                          index={0}
                          onMouseOver={() => setHoverPercent(0)}
                        />
                        <RangeSliderThumb
                          bg="black"
                          boxSize={4}
                          index={1}
                          onMouseOver={() => setHoverPercent(100)}
                        />
                      </RangeSlider>
                    </Tooltip>
                  </div>
                  <div>
                    <span
                      className="float-start fw-bold"
                      style={{ fontSize: "13px" }}
                    >
                      MIN {currency !== undefined ? currency : "AED"}{" "}
                      {filterPrice[0].toLocaleString("en-US")}
                    </span>
                    <span
                      className="float-end fw-bold"
                      style={{ fontSize: "13px" }}
                    >
                      MAX {currency !== undefined ? currency : "AED"}{" "}
                      {filterPrice[1].toLocaleString("en-US")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
            {/* Stop section  */}
            <div className="container">
              <div className="row px-2">
                <div className="col-lg-6 mt-3">
                  <h6 className="float-start text-color fw-bold">Stops</h6>
                </div>
                <div className="col-lg-6 mt-3">
                  <div className="text-end">
                    <span id="stopclicksection">
                      <i
                        className="fa fa-chevron-up rotate"
                        aria-hidden="true"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row pb-3 px-2">
                <div className="col-lg-12 mt-2" id="stopsection">
                  <div className="form-check mt-2">
                    {radioflightName.map((item, index) => (
                      <div
                        key={index}
                        style={{ fontSize: "13px" }}
                        className="fw-bold"
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="name"
                          value={index}
                          id={"flexRadioDefault" + index}
                          onChange={(e) => {
                            setCurrentPage(1);
                            radiohandleChange(e);
                            setShowMessage(false);
                            showMessageAfterDelay();
                          }}
                          defaultChecked={index === 0}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={"flexRadioDefault" + index}
                        >
                          {item.name}
                        </label>
                        <br></br>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
            {/* End of stop section  */}

            {searchData?.fareType === "Student" && (
              <>
                <div className="container">
                  <div className="row px-2">
                    <div className="col-lg-6 mt-3">
                      <h6 className="float-start text-color fw-bold">
                        Fare Type
                      </h6>
                    </div>
                    <div className="col-lg-6 mt-3">
                      <div className="text-end">
                        <span id="fareclicksection">
                          <i
                            className="fa fa-chevron-up rotate"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="row pb-3 px-2">
                    <div className="col-lg-12 mt-2" id="faresection">
                      <div className="form-check mt-2">
                        {fareTypeList?.map((item, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center justify-content-between"
                          >
                            <input
                              name="fareType"
                              className="form-check-input"
                              type="checkbox"
                              value={item.value}
                              id={"farecheckDefault" + index}
                              onChange={(e) => {
                                handleFareTypeChange(e, index);
                                setShowMessage(false);
                                showMessageAfterDelay();
                              }}
                            />
                            <label
                              className="form-check-label fw-bold px-2"
                              htmlFor={"farecheckDefault" + index}
                              title={item.name}
                              style={{ fontSize: "13px" }}
                            >
                              {item.name}
                            </label>{" "}
                            <br></br>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <hr></hr>
              </>
            )}

            {/* Airlines Section  */}
            <div className="container">
              <div className="row px-2">
                <div className="col-lg-6 mt-3">
                  <h6 className="float-start text-color fw-bold">Airlines</h6>
                </div>
                <div className="col-lg-6 mt-3">
                  <div className="text-end">
                    <span id="airclicksection">
                      <i
                        className="fa fa-chevron-up rotate"
                        aria-hidden="true"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row pb-3 px-2">
                <div className="col-lg-12 mt-2" id="airlinessection">
                  {/* <div className="form-check mt-2 ">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexCheckDefault100"
                      name="test"
                      checked={check}
                      onChange={handleClick}
                    />
                    <label
                      className="form-check-label text-start fw-bold"
                      htmlFor="flexCheckDefault"
                    >
                      All Airline
                    </label>
                  </div> */}
                  <div className="form-check mt-2">
                    {flightName.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center justify-content-between"
                      >
                        <input
                          // name="airlines"
                          className="form-check-input"
                          type="checkbox"
                          value={item.code}
                          id={"checkDefault" + index}
                          onChange={(e) => {
                            handleChange(e, index);
                            setShowMessage(false);
                            showMessageAfterDelay();
                          }}
                          // defaultChecked={itemCkeck}
                        />
                        <img
                          src={environment.s3ArliensImage + `${item.code}.png`}
                          alt="airlineCode"
                          width="35px"
                          height="30px"
                        />
                        <label
                          className="form-check-label fw-bold px-2"
                          htmlFor="flexCheckDefault"
                          title={item.name}
                          style={{ fontSize: "13px" }}
                        >
                          {item.code} ({item.totalFlights})
                        </label>{" "}
                        <span
                          className="fw-bold float-end"
                          style={{ fontSize: "13px" }}
                        >
                          {currency !== undefined ? currency : "AED"}{" "}
                          {item.minPrice.toLocaleString("en-US")}
                        </span>
                        <br></br>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>

             {/* //baggage section start */}
                         <div className="container pb-5">
                                                  <div className="row px-2">
                                                    <div className="col-lg-6 mt-3">
                                                      <h6 className="float-start text-color fw-bold">Baggage</h6>
                                                    </div>
                                                    <div className="col-lg-6 mt-3">
                                                      <div className="text-end">
                                                        <span id="baggclicksection">
                                                          <i
                                                            className="fa fa-chevron-up rotate"
                                                            aria-hidden="true"
                                                          ></i>
                                                        </span>
                                                      </div>
                                                    </div>
                        
                                                    {
                                                      progressTime ? 
                                                       <Center w="100%" py="10px">
                                                      <Spinner
                                                        thickness="4px"
                                                        speed="0.65s"
                                                        emptyColor="gray.200"
                                                        color="red.500"
                                                        size="xl"
                                                      />
                                                    </Center> :
                                                    
                                    
                                                    <div className="row pb-2 px-2 mt-2">
                                                      <div className="col-lg-12 mt-1" id="baggagesection">
                                                        <div className="row">
                                                          {baggageArr?.map((item, index) => (
                                                            <div
                                                              key={index}
                                                              className="col-6 d-flex justify-content-center"
                                                            >
                                                              <label
                                                                htmlFor={"departBaggage" + index}
                                                                className="card shadow-sm p-1 bg-white rounded border-radius border-2 border-primary position-relative" // Added 'position-relative' to position the checkmark
                                                                style={{
                                                                  width: "100%",
                                                                  height: "60px",
                                                                  display: "flex",
                                                                  flexDirection: "column",
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                                  cursor: "pointer",
                                                                  border: "1px solid #ddd",
                                                                  borderRadius: "8px",
                                                                }}
                                                              >
                                                                <input
                                                                  name="departBaggage"
                                                                  className="form-check-input d-none"
                                                                  type="checkbox"
                                                                  id={"departBaggage" + index}
                                                                  onChange={(e) => {
                                                                    handleChangeForDepartBaggage(e, index);
                                                                    setShowMessage(false);
                                                                    showMessageAfterDelay();
                                                                  }}
                                                                  checked={item.isClicked || false} // Ensure checkbox reflects the state
                                                                />
                                                                {/* Check if the item is clicked and show the checkmark icon */}
                                                                {item.isClicked && (
                                                                  <span className="position-absolute top-0 start-0">
                                                                    <BsCheckLg className="text-primary" />
                                                                  </span>
                                                                )}
                                                                <div className="text-center fw-bold">
                                                                  {item.amount} {item.units}
                                                                </div>
                                                              </label>
                                                            </div>
                                                          ))}
                                                        </div>
                                                      </div>
                                                    </div>
}
                                                  </div>
                                                </div>
                                                <hr></hr>
                                                {/* //baggage section end */}

            {/* Schedule filter section  */}
            <div className="container pb-3">
              <div className="row px-2">
                <div className="col-lg-6 mt-3">
                  <h6 className="float-start text-color fw-bold">Schedule</h6>
                </div>
                <div className="col-lg-6 mt-3">
                  <div className="text-end">
                    <span id="scheduleclicksection">
                      <i
                        className="fa fa-chevron-up rotate"
                        aria-hidden="true"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
              <span id="schedulesection">
                <div className="row pb-3 px-2">
                  <div className="col-lg-12 mt-2">
                    <p className="border p-1 fw-bold rounded">Departing Time</p>
                    {/* <div className="form-check mt-2">
                      {departTime.map((item, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center justify-content-between"
                        >
                          <input
                            name="depart"
                            className="form-check-input"
                            type="checkbox"
                            id={"depart" + index}
                            onChange={(e) => {
                              handleChangeForDepart(e, index);
                              setShowMessage(false);
                              showMessageAfterDelay();
                            }}
                          />
                          <label
                            className="form-check-label fw-bold px-5 my-1 py-1 border-radius"
                            htmlFor={"depart" + index}
                            style={{
                              fontSize: "15px",
                              border: "1px solid black",
                            }}
                          >
                            {item.text}
                          </label>{" "}
                          <br></br>
                        </div>
                      ))}
                    </div> */}
                    <div className="mt-2">
                      <div className="row">
                        {departTime.map((item, index) => (
                          <div
                            className="col-6"
                            style={{
                              overflow: "hidden",
                            }}
                          >
                            <div className="dome-shape relative">
                              <input
                                name="depart"
                                className="form-check-input round-checkbox"
                                type="checkbox"
                                id={"depart" + index}
                                style={
                                  index % 2 === 0
                                    ? {
                                        position: "absolute",
                                        top: "30%",
                                        left: "17%",
                                      }
                                    : {
                                        position: "absolute",
                                        top: "30%",
                                        left: "95%",
                                      }
                                }
                                onChange={(e) => {
                                  handleChangeForDepart(e, index);
                                  setShowMessage(false);
                                  showMessageAfterDelay();
                                }}
                              />
                              <div
                                key={index}
                                className="d-flex flex-column align-items-center justify-content-between"
                              >
                                <img
                                  src={item?.icon}
                                  width="50px"
                                  height="50px"
                                  alt={item?.label}
                                />
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {item?.label}
                                </span>
                                <label
                                  className="fw-bold my-1 py-1 border-radius"
                                  htmlFor={"depart" + index}
                                  style={{
                                    fontSize: "10px",
                                    color: "gray",
                                  }}
                                >
                                  {item.text}
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <hr></hr>
                <div className="row pb-3 px-2">
                  <div className="col-lg-12 mt-2">
                    <p className="border p-1 fw-bold rounded">Arrival Time</p>
                    <div className=" mt-2">
                      <div className="row">
                        {arrivalTime.map((item, index) => (
                          <div
                            className="col-6"
                            style={{
                              overflow: "hidden",
                            }}
                          >
                            <div className="dome-shape relative">
                              <input
                                name="depart"
                                className="form-check-input round-checkbox"
                                type="checkbox"
                                id={"arrival" + index}
                                style={
                                  index % 2 === 0
                                    ? {
                                        position: "absolute",
                                        top: "30%",
                                        left: "17%",
                                      }
                                    : {
                                        position: "absolute",
                                        top: "30%",
                                        left: "95%",
                                      }
                                }
                                onChange={(e) => {
                                  handleChangeForArrival(e, index);
                                  setShowMessage(false);
                                  showMessageAfterDelay();
                                }}
                              />
                              {/* <img
                          src={environment.s3ArliensImage + `${item.code}.png`}
                          alt="airlineCode"
                          width="35px"
                          height="30px"
                        /> */}
                              <div
                                key={index}
                                className="d-flex flex-column align-items-center justify-content-between"
                              >
                                <img
                                  src={item?.icon}
                                  width="50px"
                                  height="50px"
                                  alt={item?.label}
                                />
                                <span
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {item?.label}
                                </span>

                                <label
                                  className="fw-bold my-1 py-1 border-radius"
                                  htmlFor={"arrival" + index}
                                  style={{
                                    fontSize: "10px",
                                    color: "gray",
                                  }}
                                >
                                  {item.text}
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </span>
            </div>
            <hr></hr>
            {/* Refundable filter section  */}
            <div className="container pb-5">
              <div className="row px-2">
                <div className="col-lg-6 mt-3">
                  <h6 className="float-start text-color fw-bold">Refundable</h6>
                </div>
                <div className="col-lg-6 mt-3">
                  <div className="text-end">
                    <span id="refclicksection">
                      <i
                        className="fa fa-chevron-up rotate"
                        aria-hidden="true"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row pb-3 px-2">
                <div className="col-lg-12 mt-2" id="refsection">
                  <div className="form-check mt-2">
                    <input
                      name="refDefault1"
                      className="form-check-input"
                      type="checkbox"
                      id={"refDefault1"}
                      onChange={(e) => {
                        setCurrentPage(1);
                        setRefund({
                          ...refund,
                          refunbable: e.target.checked,
                        });
                        setShowMessage(false);
                        showMessageAfterDelay();
                      }}
                    />
                    <label
                      className="form-check-label fw-bold px-2"
                      htmlFor="refDefault1"
                      style={{ fontSize: "13px" }}
                    >
                      Refundable
                    </label>{" "}
                  </div>
                  <div className="form-check mt-2">
                    <input
                      name="refDefault2"
                      className="form-check-input"
                      type="checkbox"
                      id={"refDefault2"}
                      onChange={(e) => {
                        setCurrentPage(1);
                        setRefund({
                          ...refund,
                          nonRefundable: e.target.checked,
                        });
                        setShowMessage(false);
                        showMessageAfterDelay();
                      }}
                    />
                    <label
                      className="form-check-label fw-bold px-2"
                      htmlFor="refDefault2"
                      style={{ fontSize: "13px" }}
                    >
                      Non - Refundable
                    </label>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-9 bg-white">
            <div className="row my-2 mx-lg-3 mx-md-3 rounded box-shadow bg-white">
              <div className="col-lg-4 py-3 bg-white">
                <h5 className="pt-1">
                  We found {fetchFlighData?.airSearchResponses?.length} flights,{" "}
                  {fetchFlighData?.airlineFilters?.length} Unique Airlines{" "}
                </h5>
              </div>

              <div className="col-lg-8 d-flex  justify-content-end align-items-center">
                {/* <a
                  href="https://www.iatatravelcentre.com/passport-visa-health-travel-document-requirements.htm"
                  target="_blank"
                  className="fw-bold text-color  button-color text-white p-2 border-radius"
                  style={{ fontSize: "11px", width: "auto" }}
                >
                  Check Visa Requirements
                </a> */}

                <div className="bg-white py-1 mx-lg-4">
                  <div class="dropdown float-end">
                    <button
                      class="fw-bold text-color dropdown-toggle button-color text-white p-2 border-radius"
                      style={{ fontSize: "11px" }}
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="me-1">
                        <i class="fas fa-money-bill-wave"></i>
                      </span>
                      {amountChange}
                    </button>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li
                        class="dropdown-item"
                        style={{ cursor: "pointer", borderRadius: "8px" }}
                        onClick={() => setAmountChange("Gross Amount")}
                      >
                        Gross Amount
                      </li>
                      <li
                        class="dropdown-item"
                        style={{ cursor: "pointer", borderRadius: "8px" }}
                        onClick={() => setAmountChange("Invoice Amount")}
                      >
                        Invoice Amount
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white py-1">
                  <div class="dropdown float-end">
                    <button
                      class="fw-bold text-color dropdown-toggle button-color text-white p-2 border-radius"
                      style={{ fontSize: "11px", width: "120px" }}
                      type="button"
                      id="dropdownMenuButton2"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="me-1">
                        <i class="fas fa-clock"></i>
                      </span>
                      {change}
                    </button>

                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {environment?.usBanglaAstrfa && (
                        <li
                          class="dropdown-item"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setChange("Select");
                            setShowMessage(false);
                            showMessageAfterDelay();
                            setCurrentPage(1);
                          }}
                        >
                          Select
                        </li>
                      )}
                      <li
                        class="dropdown-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setChange("Cheapest");
                          setShowMessage(false);
                          showMessageAfterDelay();
                          setCurrentPage(1);
                        }}
                      >
                        Cheapest
                      </li>
                      <li
                        class="dropdown-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setChange("Quickest");
                          setShowMessage(false);
                          showMessageAfterDelay();
                          setCurrentPage(1);
                        }}
                      >
                        Quickest
                      </li>
                      <li
                        class="dropdown-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setChange("Earliest");
                          setShowMessage(false);
                          showMessageAfterDelay();
                          setCurrentPage(1);
                        }}
                      >
                        Earliest
                      </li>
                      <li
                        class="dropdown-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setChange("Earliest");
                          setShowMessage(false);
                          showMessageAfterDelay();
                          setCurrentPage(1);
                        }}
                      >
                        Time Sort
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <Box
                w="100%"
                h="4px"
                position="relative"
                overflow="hidden"
                bg="gray.200"
              >
                {progressTime && (
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    w="100%"
                    h="100%"
                    bg="orange.400"
                    animation="move 2s linear infinite"
                  />
                )}
                <style jsx>{`
                  @keyframes move {
                    0% {
                      transform: translateX(-100%);
                    }
                    100% {
                      transform: translateX(100%);
                    }
                  }
                `}</style>
              </Box>
            </div>

            <Box className="mx-3 py-2 mb-3 d-lg-block w-100">
              <div className="containar">
                <div className="row">
                  <div className="col-lg-10">
                    <Carousel
                      responsive={responsive}
                      ref={sliderRef}
                      arrows={false}
                    >
                      {flightName?.map((item, index) => {
                        return (
                          <>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={item.code}
                              id={"checkDefault" + index}
                              onChange={(e) => handleChange(e, index)}
                              style={{ display: "none" }}
                            />
                            <label for={"checkDefault" + index}>
                              <HStack
                                id={"checkColor" + index}
                                cursor="pointer"
                                key={index}
                                borderRadius="6px"
                                py="4px"
                                pl="8px"
                                mr="8px"
                              >
                                <Center
                                  w="90px"
                                  h="55px"
                                  borderRadius="5px"
                                  border="1px solid #EEEEEE"
                                  boxShadow="0px 5px 15px rgba(204, 204, 204, 0.3)"
                                  bg="white"
                                >
                                  <Image
                                    alt="Airlines"
                                    src={
                                      environment.s3ArliensImage +
                                      `${item.code}.png`
                                    }
                                    height="36px"
                                    width="36px"
                                  />
                                </Center>

                                <Box fontSize="xs" w="80px">
                                  <Text fontWeight={700}>
                                    {item?.airlineCode}
                                  </Text>
                                  <Text fontWeight={400}>
                                    <span className="fw-bold">{item.code}</span>
                                    <br></br>
                                    {item?.totalFlights} Flights <br></br> AED{" "}
                                    {parseInt(item?.minPrice)}
                                  </Text>
                                </Box>
                              </HStack>
                            </label>
                          </>
                        );
                      })}
                    </Carousel>
                  </div>
                  <div className="col-lg-2">
                    {flightName?.length > 4 && (
                      <Box display="flex" mt={2} zIndex={2}>
                        <Text
                          _hover={{ color: "#0083FC" }}
                          onClick={(e) => {
                            sliderRef.current.previous();
                          }}
                          ml="10px"
                          cursor="pointer"
                          w="40px"
                          fontSize={"20px"}
                        >
                          <Icon mr={1} as={FaChevronLeft} />
                        </Text>

                        <Text
                          onClick={() => {
                            sliderRef.current.next();
                          }}
                          w="40px"
                          marginRight={"-10px"}
                          _hover={{ color: "#0083FC" }}
                          cursor="pointer"
                          fontSize={"20px"}
                        >
                          <Icon mr={1} as={FaChevronRight} />
                        </Text>
                      </Box>
                    )}
                  </div>
                </div>
              </div>
            </Box>

            {!showMessage ? (
              <>
                <div className=" mb-5 mx-4 py-2 rounded">
                  {loaderArr.map((item) => {
                    return (
                      <>
                        {/* <div className="mb-4 py-2">
                          <Skeleton count={4} />
                        </div> */}
                        <div className="row mb-4 py-2">
                          <div className="col-lg-1 my-auto">
                            <Skeleton count={4} height={"15px"} />
                          </div>
                          <div className="col-lg-2 my-auto">
                            <Skeleton count={4} height={"15px"} />
                          </div>
                          <div className="col-lg-2 my-auto">
                            <Skeleton count={4} height={"15px"} />
                          </div>
                          <div className="col-lg-4 my-auto">
                            <Skeleton count={4} height={"15px"} />
                          </div>
                          <div className="col-lg-2 my-auto">
                            <Skeleton count={4} height={"15px"} />
                          </div>
                          <div className="col-lg-1 mx-auto my-auto">
                            <Skeleton count={4} height={"15px"} />
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </>
            ) : currentData?.length === 0 &&
              currentData !== null &&
              currentData !== undefined &&
              !progressTime ? (
              <>
                <NoDataFoundPage />
              </>
            ) : (
              <>
                {currentData?.map((data, index) => (
                  <div className="mb-5">
                    {searchData?.fareType === "Student" &&
                      studentFareList?.length === 0 &&
                      index === 0 &&
                      !fareTypeState[0]?.isClicked &&
                      !fareTypeState[2]?.isClicked && (
                        <div className="col-lg-12 my-4">
                          <div className="d-flex justify-content-center">
                            <i
                              className="fas fa-exclamation-triangle text-danger"
                              style={{ fontSize: "35px" }}
                            ></i>
                          </div>
                          <div className="text-center">
                            <p className="fs-4 fw-bold">
                              Sorry, there are no Student Fare options available
                              right now.
                            </p>
                            <p>
                              Here are some regular flight options you may wish
                              to explore
                            </p>
                          </div>
                        </div>
                      )}
                    <ShowFlight
                      key={index}
                      flightType={tripType}
                      index={index}
                      data={data}
                      amountChange={amountChange}
                      currency={currency}
                      checkList={checkList}
                      clearAll={clearAll}
                      setClearAll={setClearAll}
                      currentPage={currentPage}
                    ></ShowFlight>
                    {studentFareList?.length > 0 &&
                      studentFareList?.length - 1 === index &&
                      studentFareList[index]?.passengerFares?.adt?.fareType ===
                        2 && (
                        <div className="col-lg-12 my-4">
                          <div className="d-flex justify-content-center">
                            <i
                              className="fas fa-graduation-cap"
                              style={{ fontSize: "35px", color: "#7c04c0" }}
                            ></i>
                          </div>
                          <div className="text-center">
                            <p className="fs-4 fw-bold">
                              Thats all for Student Fares options!
                            </p>
                            <p>
                              Here are some regular flight options you may wish
                              to explore
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                ))}

                {!progressTime && (
                  <div className="py-3">
                    <ReactPaginate
                      previousLabel={
                        <MdOutlineSkipPrevious
                          style={{ fontSize: "18px" }}
                          color="#ed8226"
                        />
                      }
                      nextLabel={
                        <MdOutlineSkipNext
                          style={{ fontSize: "18px" }}
                          color="#ed8226"
                        />
                      }
                      breakLabel={"..."}
                      pageCount={totalPages}
                      forcePage={currentPage - 1}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={3}
                      onPageChange={handlePageChange}
                      containerClassName={
                        "pagination justify-content-center py-2"
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
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {count > 0 ? (
        <footer className="main-footer fixed-bottom">
          <div className="d-flex flex-wrap gap-1 justify-content-center align-items-center">
            {/* <b>Version</b> 3.1.0 */}
            <strong className="fs-6">{count} Option Selected</strong>
            <button
              className="btn button-color fw-bold text-white ms-3 border-radius"
              onClick={handleProposal}
            >
              Create Proposal
            </button>
            <button
              className="btn btn-danger fw-bold text-white ms-3 border-radius"
              onClick={clearProposal}
            >
              Clear All
            </button>
          </div>
        </footer>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ShowAllFlight;
