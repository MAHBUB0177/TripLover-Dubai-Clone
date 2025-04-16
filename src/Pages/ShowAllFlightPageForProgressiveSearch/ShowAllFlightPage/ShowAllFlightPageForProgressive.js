import { Box, Progress, Text } from "@chakra-ui/react";
import { addDays, set } from "date-fns";
import Fuse from "fuse.js";
import $ from "jquery";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import airports from "../../../JSON/airports.json";
import {
  convertFareType,
  dayCount,
  getCabinClass,
  preAirlinesValidate,
} from "../../../common/functions";
import "../../../plugins/t-datepicker/t-datepicker.min";
import Loading from "../../Loading/Loading";
import NoDataFoundPage from "../../NoDataFoundPage/NoDataFoundPage/NoDataFoundPage";
import InputOneWayDate from "../../SearchPage/SearchFrom/inputOneWayDate";
import Footer from "../../SharePages/Footer/Footer";
import Navbar from "../../SharePages/Navbar/Navbar";
import SideNavBar from "../../SharePages/SideNavBar/SideNavBar";
import ShowAllFlight from "../ShowAllFlight/ShowAllFlight";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

import { environment } from "../../SharePages/Utility/environment";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import ShowAllFlightComboFare from "../ShowAllFlight/ShowAllFlightComboFare";

let cIndex = 1;

const ShowAllFlightPageForProgressive = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  let checkList = [];
  sessionStorage.removeItem("checkList");
  const searchData = JSON.parse(sessionStorage.getItem("Database"));
  const [checkResForCombo, setCheckResForCombo] = useState();
  const [comboFareClick, setComboFareClick] = useState(
    searchData?.comboFareClick
  );

  const { state } = useLocation();
  const {
    origin,
    destination,
    journeyDate,
    returnDate,
    inputDateMulti1,
    inputDateMulti2,
    inputDateMulti3,
    inputDateMulti4,
    inputDateMulti5,
    airlines,
  } = state;
  // let { formCount } = state;
  const [progressTime, setProgressTime] = useState(false);
  const [modifySearch, setModifySearch] = useState(false);
  const [sameMatchError, setSameMatchError] = useState(true);
  const [journeyDateError, setJourneyDateError] = useState(true);
  const [tripType, setTripType] = useState(searchData.tripTypeModify); //"One Way"
  const [fareType, setFareType] = useState(searchData.fareType);
  const [travelClassType, setTravelClassType] = useState(
    searchData.travelClass
  ); //:"Economy"
  const [adultCount, setAdultCount] = useState(searchData.qtyList.Adult); //1
  const [childCount, setChildCount] = useState(searchData.qtyList.Children); //0
  let [infantCount, setInfantCount] = useState(searchData.qtyList.Infant); //0
  const [childAge, setChildAge] = useState(searchData.childAgeList);
  const totalPassenger = adultCount + childCount;
  const originRef = useRef();
  const destinationRef = useRef();
  const originRef1 = useRef();
  const destinationRef1 = useRef();
  const originRef2 = useRef();
  const destinationRef2 = useRef();
  const originRef3 = useRef();
  const destinationRef3 = useRef();
  const originRef4 = useRef();
  const destinationRef4 = useRef();
  const originRef5 = useRef();
  const destinationRef5 = useRef();
  const [originRefValue, setoriginRefValue] = useState(searchData.origin);
  const [destinationRefValue, setdestinationRefValue] = useState(
    searchData.destination
  );
  const [originRefValue1, setoriginRefValue1] = useState(searchData.origin1);
  const [destinationRefValue1, setdestinationRefValue1] = useState(
    searchData.destination1
  );
  const [originRefValue2, setoriginRefValue2] = useState(searchData.origin2);
  const [destinationRefValue2, setdestinationRefValue2] = useState(
    searchData.destination2
  );
  const [originRefValue3, setoriginRefValue3] = useState(searchData.origin3);
  const [destinationRefValue3, setdestinationRefValue3] = useState(
    searchData.destination3
  );
  const [originRefValue4, setoriginRefValue4] = useState(searchData.origin4);
  const [destinationRefValue4, setdestinationRefValue4] = useState(
    searchData.destination4
  );
  const [originRefValue5, setoriginRefValue5] = useState(searchData.origin5);
  const [destinationRefValue5, setdestinationRefValue5] = useState(
    searchData.destination5
  );

  const childrenAges = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const one = [];
  sessionStorage.setItem("one", JSON.stringify(one));
  const two = [];
  sessionStorage.setItem("two", JSON.stringify(two));
  const three = [];
  sessionStorage.setItem("three", JSON.stringify(three));
  const four = [];
  sessionStorage.setItem("four", JSON.stringify(four));
  const five = [];
  sessionStorage.setItem("five", JSON.stringify(five));
  const six = [];
  sessionStorage.setItem("six", JSON.stringify(six));

  useEffect(() => {
    if (originRefValue2 && document.getElementById("multiCity2")) {
      document.getElementById("multiCity2").style.display = "";
      document.getElementById("btnm-1").style.display = "";
      if (cIndex < 2) {
        cIndex = 2;
      }
    }

    if (originRefValue3 && document.getElementById("multiCity3")) {
      document.getElementById("multiCity3").style.display = "";
      document.getElementById("btnm-1").style.display = "";
      if (cIndex < 3) {
        cIndex = 3;
      }
    }
    if (originRefValue4 && document.getElementById("multiCity4")) {
      document.getElementById("multiCity4").style.display = "";
      document.getElementById("btnm-1").style.display = "";
      if (cIndex < 4) {
        cIndex = 4;
      }
    }
    if (originRefValue5 && document.getElementById("multiCity5")) {
      document.getElementById("multiCity5").style.display = "";
      document.getElementById("btnm-1").style.display = "";
      if (cIndex < 5) {
        cIndex = 5;
      }
    }
    window.scrollTo(0, 0);
  }, []);

  const [preAirlines, setPreAirlines] = useState(searchData?.preAirlines);

  const handleChange = (e) => {
    let text = e.target.value;
    setPreAirlines(text.toUpperCase());
  };

  const handleFlightOptionP = () => {
    if (cIndex < 5) {
      cIndex += 1;
      if (cIndex >= 2) {
        document.getElementById("btnm-1").style.display = "";
      }
      document.getElementById("multiCity" + cIndex).style.display = "";
      document
        .getElementById("txtFrom" + cIndex)
        .setAttribute("required", "required");
      document
        .getElementById("txtTo" + cIndex)
        .setAttribute("required", "required");
    }
  };
  const handleFlightOptionM = () => {
    cIndex -= 1;

    if (cIndex < 2) {
      document.getElementById("btnm-1").style.display = "none";
    }
    document.getElementById("multiCity" + (cIndex + 1)).style.display = "none";
    document
      .getElementById("txtFrom" + (cIndex + 1))
      .removeAttribute("required");
    document.getElementById("txtTo" + (cIndex + 1)).removeAttribute("required");
    if (cIndex === 1) {
      originRef2.current.value = "";
      destinationRef2.current.value = "";
      $(".class_2").tDatePicker({
        autoClose: true,
      });
    }
    if (cIndex === 2) {
      originRef3.current.value = "";
      destinationRef3.current.value = "";
      $(".class_3").tDatePicker({
        autoClose: true,
      });
    }
    if (cIndex === 3) {
      originRef4.current.value = "";
      destinationRef4.current.value = "";
      $(".class_4").tDatePicker({
        autoClose: true,
      });
    }
    if (cIndex === 4) {
      originRef5.current.value = "";
      destinationRef5.current.value = "";
      $(".class_5").tDatePicker({
        autoClose: true,
      });
    }
  };

  useEffect(() => {
    $("#txtFrom").val(originRefValue);
    $("#txtTo").val(destinationRefValue);
    $("#txtFrom1").val(originRefValue1);
    $("#txtTo1").val(destinationRefValue1);
    $("#txtFrom1").val(originRefValue1);
    $("#txtTo1").val(destinationRefValue1);
    $("#txtFrom2").val(originRefValue2);
    $("#txtTo2").val(destinationRefValue2);
    $("#txtFrom3").val(originRefValue3);
    $("#txtTo3").val(destinationRefValue3);
    $("#txtFrom4").val(originRefValue4);
    $("#txtTo4").val(destinationRefValue4);
    $("#txtFrom5").val(originRefValue5);
    $("#txtTo5").val(destinationRefValue5);
    $(document).ready(function () {
      $(".class_0").tDatePicker({
        autoClose: true,
        dateCheckIn: journeyDate,
        dateCheckOut: returnDate,
      });
      $(".class_1").tDatePicker({
        autoClose: true,
        dateCheckIn: inputDateMulti1,
      });
      $(".class_2").tDatePicker({
        autoClose: true,
        dateCheckIn: inputDateMulti2,
      });
      $(".class_3").tDatePicker({
        autoClose: true,
        dateCheckIn: inputDateMulti3,
      });
      $(".class_4").tDatePicker({
        autoClose: true,
        dateCheckIn: inputDateMulti4,
      });
      $(".class_5").tDatePicker({
        autoClose: true,
        dateCheckIn: inputDateMulti5,
      });
    });
  }, []);

  const originCode = airports
    .filter(
      (f) => f.city + " - " + f.country + ", " + f.name === searchData.origin
    )
    .map((item) => item.iata);
  const destinationCode = airports
    .filter(
      (f) =>
        f.city + " - " + f.country + ", " + f.name === searchData.destination
    )
    .map((item) => item.iata);
  const originCode1 = airports
    .filter(
      (f) => f.city + " - " + f.country + ", " + f.name === searchData.origin1
    )
    .map((item) => item.iata);
  const destinationCode1 = airports
    .filter(
      (f) =>
        f.city + " - " + f.country + ", " + f.name === searchData.destination1
    )
    .map((item) => item.iata);
  const originCode2 = airports
    .filter(
      (f) => f.city + " - " + f.country + ", " + f.name === searchData.origin2
    )
    .map((item) => item.iata);
  const destinationCode2 = airports
    .filter(
      (f) =>
        f.city + " - " + f.country + ", " + f.name === searchData.destination2
    )
    .map((item) => item.iata);

  const originCode3 = airports
    .filter(
      (f) => f.city + " - " + f.country + ", " + f.name === searchData.origin3
    )
    .map((item) => item.iata);
  const destinationCode3 = airports
    .filter(
      (f) =>
        f.city + " - " + f.country + ", " + f.name === searchData.destination3
    )
    .map((item) => item.iata);
  const originCode4 = airports
    .filter(
      (f) => f.city + " - " + f.country + ", " + f.name === searchData.origin4
    )
    .map((item) => item.iata);
  const destinationCode4 = airports
    .filter(
      (f) =>
        f.city + " - " + f.country + ", " + f.name === searchData.destination4
    )
    .map((item) => item.iata);
  const originCode5 = airports
    .filter(
      (f) => f.city + " - " + f.country + ", " + f.name === searchData.origin5
    )
    .map((item) => item.iata);
  const destinationCode5 = airports
    .filter(
      (f) =>
        f.city + " - " + f.country + ", " + f.name === searchData.destination5
    )
    .map((item) => item.iata);

  let searchParamOnedWay = {
    routes: [
      {
        origin: originCode[0],
        destination: destinationCode[0],
        departureDate: moment(journeyDate).format("yyyy-MM-DD"),
      },
    ],
    fareType: convertFareType(fareType),
    adults: adultCount,
    childs: childCount,
    infants: infantCount,
    cabinClass: getCabinClass(travelClassType),
    preferredCarriers:
      airlines !== undefined && airlines !== "" ? airlines.split(",") : [],
    prohibitedCarriers: [],
    childrenAges: childAge.length > 0 ? childAge.map((item) => item.age) : [],
  };

  let searchParamRoundWay = {
    routes: [
      {
        origin: originCode[0],
        destination: destinationCode[0],
        departureDate: moment(journeyDate).format("yyyy-MM-DD"),
      },
      {
        origin: destinationCode[0],
        destination: originCode[0],
        departureDate: moment(returnDate).format("yyyy-MM-DD"),
      },
    ],
    IsComboFareActive: comboFareClick,
    fareType: convertFareType(fareType),
    adults: adultCount,
    childs: childCount,
    infants: infantCount,
    cabinClass: getCabinClass(travelClassType),
    preferredCarriers:
      airlines !== undefined && airlines !== "" ? airlines.split(",") : [],
    prohibitedCarriers: [],
    childrenAges: childAge.length > 0 ? childAge.map((item) => item.age) : [],
  };

  let searchParamMulti = {
    routes: [
      {
        origin: originCode[0],
        destination: destinationCode[0],
        departureDate: moment(journeyDate).format("yyyy-MM-DD"),
      },
      {
        origin: originCode1[0],
        destination: destinationCode1[0],
        departureDate: moment(inputDateMulti1).format("yyyy-MM-DD"),
      },
    ],
    fareType: convertFareType(fareType),
    adults: adultCount,
    childs: childCount,
    infants: infantCount,
    cabinClass: getCabinClass(travelClassType),
    preferredCarriers:
      airlines !== undefined && airlines !== "" ? airlines.split(",") : [],
    prohibitedCarriers: [],
    taxRedemptions: [],
    childrenAges: childAge.length > 0 ? childAge.map((item) => item.age) : [],
  };
  if (originCode2[0] !== undefined) {
    let mc2 = {
      origin: originCode2[0],
      destination: destinationCode2[0],
      departureDate: moment(inputDateMulti2).format("yyyy-MM-DD"),
    };
    searchParamMulti.routes.push(mc2);
  }
  if (originCode3[0] !== undefined) {
    let mc2 = {
      origin: originCode3[0],
      destination: destinationCode3[0],
      departureDate: moment(inputDateMulti3).format("yyyy-MM-DD"),
    };
    searchParamMulti.routes.push(mc2);
  }
  if (originCode4[0] !== undefined) {
    let mc2 = {
      origin: originCode4[0],
      destination: destinationCode4[0],
      departureDate: moment(inputDateMulti4).format("yyyy-MM-DD"),
    };
    searchParamMulti.routes.push(mc2);
  }
  if (originCode5[0] !== undefined) {
    let mc2 = {
      origin: originCode5[0],
      destination: destinationCode5[0],
      departureDate: moment(inputDateMulti5).format("yyyy-MM-DD"),
    };
    searchParamMulti.routes.push(mc2);
  }

  const [fetchFlighData, setFetchFlighData] = useState({
    airSearchResponses: [],
    airlineFilters: [],
    minMaxPrice: {
      minPrice: 0,
      maxPrice: 0,
    },
    stops: [],
    totalFlights: 0,
    currency: null,
    supplierCount: 0,
  });

  const [fetchFlighDeparture, setFetchFlighDeparture] = useState({
    airSearchResponses: [],
    airlineFilters: [],
    minMaxPrice: {
      minPrice: 0,
      maxPrice: 0,
    },
    stops: [],
    totalFlights: 0,
    currency: null,
    supplierCount: 0,
  });

  const [fetchFlighReturn, setFetchFlighReturn] = useState({
    airSearchResponses: [],
    airlineFilters: [],
    minMaxPrice: {
      minPrice: 0,
      maxPrice: 0,
    },
    stops: [],
    totalFlights: 0,
    currency: null,
    supplierCount: 0,
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (tripType === "One Way") {
      const getData = async () => {
        try {
          setLoading(true);
          setProgressTime(true);
          await fetchEventSource(environment.ProgressiveSearch, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + tokenData?.token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchParamOnedWay),
            openWhenHidden: true,
            async onopen(response) {
              if (
                response.ok &&
                response.headers.get("content-type") === EventStreamContentType
              ) {
                return;
              } else if (
                response.status >= 400 &&
                response.status < 500 &&
                response.status !== 429
              ) {
                setLoading(false);
                toast.error("Please try again later");
              } else {
                setLoading(false);
                toast.error("Please try again later");
              }
            },
            onmessage(msg) {
              try {
                const data = JSON.parse(msg.data);
                const newChunkData = data?.searchResponse || {};

                setFetchFlighData((prevData) => ({
                  ...prevData, // Keep all previous state data intact
                  airSearchResponses: [
                    ...prevData.airSearchResponses, // Preserve previous search results
                    ...newChunkData.airSearchResponses, // Append the new chunk of flight data
                  ],
                  airlineFilters: newChunkData.airlineFilters, // Optionally, you can also update other fields like minMaxPrice or totalFlights
                  // Optionally, you can also update other fields like minMaxPrice or totalFlights
                  minMaxPrice: newChunkData.minMaxPrice, // If you want to update it with the new chunk
                  stops: newChunkData.stops, // If stops are included in the new chunk
                  totalFlights: newChunkData.totalFlights, // If totalFlights is included in the new chunk
                }));

                if (data?.searchResponse?.airSearchResponses.length > 0) {
                  setLoading(false);
                }
              } catch (error) {
                setLoading(false); // Ensure loading state is also turned off on error
              }
            },
            onclose() {
              setProgressTime(false);
            },
            onerror(err) {
              setLoading(false); // Ensure loading state is turned off in case of error
            },
          });
        } catch (error) {
          setLoading(false);
        } finally {
          setLoading(false); // Ensure loading state is turned off when finished
        }
      };

      getData();
    } else if (tripType === "Round Trip") {
      // setLoading(true);
      const getData = async () => {
        try {
          setLoading(true);
          setProgressTime(true);
          await fetchEventSource(environment.ProgressiveSearch, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + tokenData?.token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchParamRoundWay),
            openWhenHidden: true,
            async onopen(response) {
              if (
                response.ok &&
                response.headers.get("content-type") === EventStreamContentType
              ) {
                return;
              } else {
                setProgressTime(false);
                setLoading(false);
                toast.error("Please try again later");
              }
            },
            onmessage(msg) {
              try {
                const data = JSON.parse(msg.data);
                setCheckResForCombo(data?.isComboFare);
                if (data?.isComboFare) {
                  if (
                    data?.routes[0]?.origin ===
                      searchParamRoundWay?.routes[0]?.origin &&
                    data?.routes[0]?.destination ===
                      searchParamRoundWay?.routes[0]?.destination
                  ) {
                    setFetchFlighData({
                      airSearchResponses: [],
                      airlineFilters: [],
                      minMaxPrice: {
                        minPrice: 0,
                        maxPrice: 0,
                      },
                      stops: [],
                      totalFlights: 0,
                      currency: null,
                      supplierCount: 0,
                    });
                    const newChunkData = data?.searchResponse || {};
                    setFetchFlighDeparture((prevData) => ({
                      ...prevData,
                      airSearchResponses: [
                        ...prevData.airSearchResponses,
                        ...newChunkData.airSearchResponses,
                      ],
                      airlineFilters: newChunkData.airlineFilters,
                      minMaxPrice: newChunkData.minMaxPrice,
                      stops: newChunkData.stops,
                      totalFlights: newChunkData.totalFlights,
                      isComboFare: data.isComboFare,
                    }));
                    if (data?.searchResponse?.airSearchResponses.length > 0) {
                      setLoading(false);
                    }
                  } else {
                    const newChunkData = data?.searchResponse || {};
                    setFetchFlighReturn((prevData) => ({
                      ...prevData,
                      airSearchResponses: [
                        ...prevData.airSearchResponses,
                        ...newChunkData.airSearchResponses,
                      ],
                      airlineFilters: newChunkData.airlineFilters,
                      minMaxPrice: newChunkData.minMaxPrice,
                      stops: newChunkData.stops,
                      totalFlights: newChunkData.totalFlights,
                      isComboFare: data.isComboFare,
                    }));
                  }
                } else {
                  const newChunkData = data?.searchResponse || {};
                  setFetchFlighData((prevData) => ({
                    ...prevData,
                    airSearchResponses: [
                      ...prevData.airSearchResponses,
                      ...newChunkData.airSearchResponses,
                    ],
                    airlineFilters: newChunkData.airlineFilters,
                    minMaxPrice: newChunkData.minMaxPrice,
                    stops: newChunkData.stops,
                    totalFlights: newChunkData.totalFlights,
                  }));
                  if (data?.searchResponse?.airSearchResponses.length > 0) {
                    setLoading(false);
                  }
                  setFetchFlighDeparture({
                    airSearchResponses: [],
                    airlineFilters: [],
                    minMaxPrice: {
                      minPrice: 0,
                      maxPrice: 0,
                    },
                    stops: [],
                    totalFlights: 0,
                    currency: null,
                    supplierCount: 0,
                  });
                  setFetchFlighReturn({
                    airSearchResponses: [],
                    airlineFilters: [],
                    minMaxPrice: {
                      minPrice: 0,
                      maxPrice: 0,
                    },
                    stops: [],
                    totalFlights: 0,
                    currency: null,
                    supplierCount: 0,
                  });
                }
              } catch (error) {
                setLoading(false);
              }
            },
            onclose() {
              setProgressTime(false);
            },
            onerror(err) {
              setLoading(false);
            },
          });
        } catch (error) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
      getData();
    } else {
      const getData = async () => {
        try {
          setLoading(true);
          setProgressTime(true);
          await fetchEventSource(environment.ProgressiveSearch, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + tokenData?.token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchParamMulti),
            openWhenHidden: true,
            async onopen(response) {
              if (
                response.ok &&
                response.headers.get("content-type") === EventStreamContentType
              ) {
                return;
              } else if (
                response.status >= 400 &&
                response.status < 500 &&
                response.status !== 429
              ) {
                setLoading(false);
                toast.error("Please try again later");
              } else {
                setLoading(false);
                toast.error("Please try again later");
              }
            },
            onmessage(msg) {
              try {
                const data = JSON.parse(msg.data);
                setCheckResForCombo(data?.isComboFare);
                if (data?.isComboFare) {
                  if (
                    data?.routes[0]?.origin ===
                      searchParamMulti?.routes[0]?.origin &&
                    data?.routes[0]?.destination ===
                      searchParamMulti?.routes[0]?.destination
                  ) {
                    setFetchFlighData({
                      airSearchResponses: [],
                      airlineFilters: [],
                      minMaxPrice: {
                        minPrice: 0,
                        maxPrice: 0,
                      },
                      stops: [],
                      totalFlights: 0,
                      currency: null,
                      supplierCount: 0,
                    });
                    const newChunkData = data?.searchResponse || {};
                    setFetchFlighDeparture((prevData) => ({
                      ...prevData,
                      airSearchResponses: [
                        ...prevData.airSearchResponses,
                        ...newChunkData.airSearchResponses,
                      ],
                      airlineFilters: newChunkData.airlineFilters,
                      minMaxPrice: newChunkData.minMaxPrice,
                      stops: newChunkData.stops,
                      totalFlights: newChunkData.totalFlights,
                      isComboFare: data.isComboFare,
                    }));
                    if (data?.searchResponse?.airSearchResponses.length > 0) {
                      setLoading(false);
                    }
                  } else {
                    const newChunkData = data?.searchResponse || {};
                    setFetchFlighReturn((prevData) => ({
                      ...prevData,
                      airSearchResponses: [
                        ...prevData.airSearchResponses,
                        ...newChunkData.airSearchResponses,
                      ],
                      airlineFilters: newChunkData.airlineFilters,
                      minMaxPrice: newChunkData.minMaxPrice,
                      stops: newChunkData.stops,
                      totalFlights: newChunkData.totalFlights,
                      isComboFare: data.isComboFare,
                    }));
                  }
                } else {
                  const newChunkData = data?.searchResponse || {};
                  setFetchFlighData((prevData) => ({
                    ...prevData,
                    airSearchResponses: [
                      ...prevData.airSearchResponses,
                      ...newChunkData.airSearchResponses,
                    ],
                    airlineFilters: newChunkData.airlineFilters,
                    minMaxPrice: newChunkData.minMaxPrice,
                    stops: newChunkData.stops,
                    totalFlights: newChunkData.totalFlights,
                  }));
                  if (data?.searchResponse?.airSearchResponses.length > 0) {
                    setLoading(false);
                  }
                  setFetchFlighDeparture({
                    airSearchResponses: [],
                    airlineFilters: [],
                    minMaxPrice: {
                      minPrice: 0,
                      maxPrice: 0,
                    },
                    stops: [],
                    totalFlights: 0,
                    currency: null,
                    supplierCount: 0,
                  });
                  setFetchFlighReturn({
                    airSearchResponses: [],
                    airlineFilters: [],
                    minMaxPrice: {
                      minPrice: 0,
                      maxPrice: 0,
                    },
                    stops: [],
                    totalFlights: 0,
                    currency: null,
                    supplierCount: 0,
                  });
                }
              } catch (error) {
                setLoading(false);
              }
            },
            onclose() {
              setProgressTime(false);
            },
            onerror(err) {
              setLoading(false); // Ensure loading state is turned off in case of error
            },
          });
        } catch (error) {
          setLoading(false);
        } finally {
          setLoading(false); // Ensure loading state is turned off when finished
        }
      };
      getData();
    }
  }, []);
  useEffect(() => {
    $(".slide-toggle").hide();
    $(".search-again").click(function () {
      $(".slide-toggle").toggle("slow");
    });
    $("#search-flight").click(function () {
      $(".slide-toggle").hide("slow");
    });
  }, []);

  useEffect(() => {
    $(".class_0").tDatePicker({});
    $(".class_1").tDatePicker({});
    $(".class_2").tDatePicker({});
    $(".class_3").tDatePicker({});
    $(".class_4").tDatePicker({});
    $(".class_5").tDatePicker({});

    $(".t-date-check-in").html(
      "<label class='t-date-info-title'><span class='me-1 text-danger'><i class='fa fa-calendar'></i></span><span>Depart</span></label>"
    );
    $(".t-date-check-out").html(
      "<label class='t-date-info-title'><span class='me-1 text-danger'><i class='fa fa-calendar'></i></span><span>Return</span></label>"
    );

    $("#departureDate").attr("class", "t-check-in");
    $("#returnDate").hide();
    $("#returnLavel").hide();

    // for passenger count
    $("#passengerBlock").on({
      click: function (e) {
        e.preventDefault();
      },
    });
    // date picker check for triptype
    if (String(tripType) === String("One Way")) {
      $("#departureDate").attr("class", "t-check-in t-picker-only");
    } else if (String(tripType) === String("Round Trip")) {
      $("#departureDate").attr("class", "t-check-in");
      $("#returnDate").show();
      $("#returnLavel").show();
    } else {
      $("#departureDate").attr("class", "t-check-in t-picker-only");
    }

    // airport autoComplete
    var options = {
      shouldSort: true,
      threshold: 0.4,
      maxPatternLength: 32,
      keys: [
        {
          name: "iata",
          weight: 0.5,
        },
        {
          name: "city",
          weight: 0.3,
        },
        {
          name: "country",
          weight: 0.3,
        },
        {
          name: "name",
          weight: 0.3,
        },
      ],
    };

    $(".autocomplete").each(function () {
      var ac = $(this);

      ac.on("click", function (e) {
        // e.stopPropagation();
      })
        .on("focus keyup", search)
        .on("keydown", onKeyDown);

      var wrap = $("<div>")
        .addClass("autocomplete-wrapper")
        .insertBefore(ac)
        .append(ac);

      var list = $("<div>")
        .addClass("autocomplete-results")
        .on("click", ".autocomplete-result", function (e) {
          e.preventDefault();
          e.stopPropagation();
          selectIndex($(this).data("index"), ac);
        })
        .appendTo(wrap);
    });

    $(document)
      .on("mouseover", ".autocomplete-result", function (e) {
        var index = parseInt($(this).data("index"), 10);
        if (!isNaN(index)) {
          $(this).attr("data-highlight", index);
        }
      })
      .on("click", clearResults, function (e) {
        // e.preventDefault();
      });

    $(document).on("click", function (e) {
      var target = $(e.target);
      if (target[0].id === "txtFrom") {
        search(e);
        $("#txtTo").next(".autocomplete-results").empty();
        $("#txtFrom1").next(".autocomplete-results").empty();
        $("#txtTo1").next(".autocomplete-results").empty();
        $("#txtFrom2").next(".autocomplete-results").empty();
        $("#txtTo2").next(".autocomplete-results").empty();
        $("#txtFrom3").next(".autocomplete-results").empty();
        $("#txtTo3").next(".autocomplete-results").empty();
        $("#txtFrom4").next(".autocomplete-results").empty();
        $("#txtTo4").next(".autocomplete-results").empty();
        $("#txtFrom5").next(".autocomplete-results").empty();
        $("#txtTo5").next(".autocomplete-results").empty();
      }
      if (target[0].id === "txtTo") {
        search(e);
        $("#txtFrom").next(".autocomplete-results").empty();
        $("#txtFrom1").next(".autocomplete-results").empty();
        $("#txtTo1").next(".autocomplete-results").empty();
        $("#txtFrom2").next(".autocomplete-results").empty();
        $("#txtTo2").next(".autocomplete-results").empty();
        $("#txtFrom3").next(".autocomplete-results").empty();
        $("#txtTo3").next(".autocomplete-results").empty();
        $("#txtFrom4").next(".autocomplete-results").empty();
        $("#txtTo4").next(".autocomplete-results").empty();
        $("#txtFrom5").next(".autocomplete-results").empty();
        $("#txtTo5").next(".autocomplete-results").empty();
      }
      if (target[0].id === "txtFrom1") {
        search(e);
        $("#txtTo").next(".autocomplete-results").empty();
        $("#txtFrom").next(".autocomplete-results").empty();
        $("#txtTo1").next(".autocomplete-results").empty();
        $("#txtFrom2").next(".autocomplete-results").empty();
        $("#txtTo2").next(".autocomplete-results").empty();
        $("#txtFrom3").next(".autocomplete-results").empty();
        $("#txtTo3").next(".autocomplete-results").empty();
        $("#txtFrom4").next(".autocomplete-results").empty();
        $("#txtTo4").next(".autocomplete-results").empty();
        $("#txtFrom5").next(".autocomplete-results").empty();
        $("#txtTo5").next(".autocomplete-results").empty();
      }
      if (target[0].id === "txtTo1") {
        search(e);
        $("#txtTo").next(".autocomplete-results").empty();
        $("#txtFrom").next(".autocomplete-results").empty();
        $("#txtFrom1").next(".autocomplete-results").empty();
        $("#txtFrom2").next(".autocomplete-results").empty();
        $("#txtTo2").next(".autocomplete-results").empty();
        $("#txtFrom3").next(".autocomplete-results").empty();
        $("#txtTo3").next(".autocomplete-results").empty();
        $("#txtFrom4").next(".autocomplete-results").empty();
        $("#txtTo4").next(".autocomplete-results").empty();
        $("#txtFrom5").next(".autocomplete-results").empty();
        $("#txtTo5").next(".autocomplete-results").empty();
      }
      if (target[0].id === "txtFrom2") {
        search(e);
        $("#txtTo").next(".autocomplete-results").empty();
        $("#txtFrom").next(".autocomplete-results").empty();
        $("#txtTo1").next(".autocomplete-results").empty();
        $("#txtFrom1").next(".autocomplete-results").empty();
        $("#txtTo2").next(".autocomplete-results").empty();
        $("#txtFrom3").next(".autocomplete-results").empty();
        $("#txtTo3").next(".autocomplete-results").empty();
        $("#txtFrom4").next(".autocomplete-results").empty();
        $("#txtTo4").next(".autocomplete-results").empty();
        $("#txtFrom5").next(".autocomplete-results").empty();
        $("#txtTo5").next(".autocomplete-results").empty();
      }
      if (target[0].id === "txtTo2") {
        search(e);
        $("#txtTo").next(".autocomplete-results").empty();
        $("#txtFrom").next(".autocomplete-results").empty();
        $("#txtFrom1").next(".autocomplete-results").empty();
        $("#txtFrom2").next(".autocomplete-results").empty();
        $("#txtTo1").next(".autocomplete-results").empty();
        $("#txtFrom3").next(".autocomplete-results").empty();
        $("#txtTo3").next(".autocomplete-results").empty();
        $("#txtFrom4").next(".autocomplete-results").empty();
        $("#txtTo4").next(".autocomplete-results").empty();
        $("#txtFrom5").next(".autocomplete-results").empty();
        $("#txtTo5").next(".autocomplete-results").empty();
      }
      if (target[0].id === "txtFrom3") {
        search(e);
        $("#txtTo").next(".autocomplete-results").empty();
        $("#txtFrom").next(".autocomplete-results").empty();
        $("#txtTo1").next(".autocomplete-results").empty();
        $("#txtFrom1").next(".autocomplete-results").empty();
        $("#txtTo2").next(".autocomplete-results").empty();
        $("#txtFrom2").next(".autocomplete-results").empty();
        $("#txtTo3").next(".autocomplete-results").empty();
        $("#txtFrom4").next(".autocomplete-results").empty();
        $("#txtTo4").next(".autocomplete-results").empty();
        $("#txtFrom5").next(".autocomplete-results").empty();
        $("#txtTo5").next(".autocomplete-results").empty();
      }
      if (target[0].id === "txtTo3") {
        search(e);
        $("#txtTo").next(".autocomplete-results").empty();
        $("#txtFrom").next(".autocomplete-results").empty();
        $("#txtFrom1").next(".autocomplete-results").empty();
        $("#txtFrom2").next(".autocomplete-results").empty();
        $("#txtTo1").next(".autocomplete-results").empty();
        $("#txtFrom3").next(".autocomplete-results").empty();
        $("#txtTo2").next(".autocomplete-results").empty();
        $("#txtFrom4").next(".autocomplete-results").empty();
        $("#txtTo4").next(".autocomplete-results").empty();
        $("#txtFrom5").next(".autocomplete-results").empty();
        $("#txtTo5").next(".autocomplete-results").empty();
      }
      if (target[0].id === "txtFrom4") {
        search(e);
        $("#txtTo").next(".autocomplete-results").empty();
        $("#txtFrom").next(".autocomplete-results").empty();
        $("#txtTo1").next(".autocomplete-results").empty();
        $("#txtFrom1").next(".autocomplete-results").empty();
        $("#txtTo2").next(".autocomplete-results").empty();
        $("#txtFrom2").next(".autocomplete-results").empty();
        $("#txtTo3").next(".autocomplete-results").empty();
        $("#txtFrom3").next(".autocomplete-results").empty();
        $("#txtTo4").next(".autocomplete-results").empty();
        $("#txtFrom5").next(".autocomplete-results").empty();
        $("#txtTo5").next(".autocomplete-results").empty();
      }
      if (target[0].id === "txtTo4") {
        search(e);
        $("#txtTo").next(".autocomplete-results").empty();
        $("#txtFrom").next(".autocomplete-results").empty();
        $("#txtFrom1").next(".autocomplete-results").empty();
        $("#txtFrom2").next(".autocomplete-results").empty();
        $("#txtTo1").next(".autocomplete-results").empty();
        $("#txtFrom3").next(".autocomplete-results").empty();
        $("#txtTo2").next(".autocomplete-results").empty();
        $("#txtFrom4").next(".autocomplete-results").empty();
        $("#txtTo3").next(".autocomplete-results").empty();
        $("#txtFrom5").next(".autocomplete-results").empty();
        $("#txtTo5").next(".autocomplete-results").empty();
      }
      if (target[0].id === "txtFrom5") {
        search(e);
        $("#txtTo").next(".autocomplete-results").empty();
        $("#txtFrom").next(".autocomplete-results").empty();
        $("#txtTo1").next(".autocomplete-results").empty();
        $("#txtFrom1").next(".autocomplete-results").empty();
        $("#txtTo2").next(".autocomplete-results").empty();
        $("#txtFrom2").next(".autocomplete-results").empty();
        $("#txtTo3").next(".autocomplete-results").empty();
        $("#txtFrom3").next(".autocomplete-results").empty();
        $("#txtTo4").next(".autocomplete-results").empty();
        $("#txtFrom4").next(".autocomplete-results").empty();
        $("#txtTo5").next(".autocomplete-results").empty();
      }
      if (target[0].id === "txtTo5") {
        search(e);
        $("#txtTo").next(".autocomplete-results").empty();
        $("#txtFrom").next(".autocomplete-results").empty();
        $("#txtFrom1").next(".autocomplete-results").empty();
        $("#txtFrom2").next(".autocomplete-results").empty();
        $("#txtTo1").next(".autocomplete-results").empty();
        $("#txtFrom3").next(".autocomplete-results").empty();
        $("#txtTo2").next(".autocomplete-results").empty();
        $("#txtFrom4").next(".autocomplete-results").empty();
        $("#txtTo3").next(".autocomplete-results").empty();
        $("#txtFrom5").next(".autocomplete-results").empty();
        $("#txtTo4").next(".autocomplete-results").empty();
      }
      if (!target.closest(".autocomplete").length) {
        clearResults();
      }
    });

    function clearResults() {
      results = [];
      numResults = 0;
      $(".autocomplete-results").empty();
    }

    function selectIndex(index, autoinput) {
      if (results.length >= index + 1) {
        autoinput.val(
          results[index].city +
            " - " +
            results[index].country +
            ", " +
            results[index].name
        );
        clearResults();
      }
    }

    var results = [];
    var numResults = 0;
    var selectedIndex = -1;

    function search(e) {
      if (e.which === 38 || e.which === 13 || e.which === 40) {
        return;
      }
      var ac = $(e.target);
      var list = ac.next();
      if (ac.val().length >= 0) {
        var fuse = new Fuse(airports, options);
        if (ac.val().length === 0) {
          results = fuse
            .search("bangladesh", { limit: 6 })
            .map((result) => result.item);
        } else {
          results = fuse
            .search(ac.val(), { limit: 6 })
            .map((result) => result.item);
          numResults = results.length;
        }

        var divs = results.map(function (r, i) {
          return (
            '<div class="autocomplete-result text-start" data-index="' +
            i +
            '">' +
            '<label style="display:none">' +
            r.iata +
            " - " +
            r.country +
            ", " +
            r.name +
            "</label><div> <b>" +
            r.city +
            "</b> - " +
            r.country +
            ", " +
            r.name +
            '<span class="autocomplete-location ps-2">(' +
            r.iata +
            ")</span>" +
            "</div>" +
            "</div>"
          );
        });

        selectedIndex = -1;
        list.html(divs.join("")).attr("data-highlight", selectedIndex);
      } else {
        numResults = 0;
        list.empty();
      }
    }

    function onKeyDown(e) {
      var ac = $(e.currentTarget);
      var list = ac.next();
      switch (e.which) {
        case 38: // up
          selectedIndex--;
          if (selectedIndex <= -1) {
            selectedIndex = -1;
          }
          list.attr("data-highlight", selectedIndex);
          break;
        case 13: // enter
          selectIndex(selectedIndex, ac);
          break;
        case 9: // enter
          selectIndex(selectedIndex, ac);
          e.stopPropagation();
          return;
        case 40: // down
          selectedIndex++;
          if (selectedIndex >= numResults) {
            selectedIndex = numResults - 1;
          }
          list.attr("data-highlight", selectedIndex);
          break;

        default:
          return; // exit this handler for other keys
      }
      e.stopPropagation();
      e.preventDefault(); // prevent the default action (scroll / move caret)
    }
  }, [tripType]);

  const handleTripType = (name) => {
    setTripType(name);
    if (name === "One Way" || name === "Round Trip") {
      cIndex = 0;
    } else if (name === "Multi City") {
      cIndex = 1;
    }
  };
  const handleSearchFlight = (e) => {
    document.getElementById("search-again").click();
    e.preventDefault();
    setCheckResForCombo();
    setFetchFlighData({
      airSearchResponses: [],
      airlineFilters: [],
      minMaxPrice: {
        minPrice: 0,
        maxPrice: 0,
      },
      stops: [],
      totalFlights: 0,
      currency: null,
      supplierCount: 0,
    });
    setFetchFlighDeparture({
      airSearchResponses: [],
      airlineFilters: [],
      minMaxPrice: {
        minPrice: 0,
        maxPrice: 0,
      },
      stops: [],
      totalFlights: 0,
      currency: null,
      supplierCount: 0,
    });
    setFetchFlighReturn({
      airSearchResponses: [],
      airlineFilters: [],
      minMaxPrice: {
        minPrice: 0,
        maxPrice: 0,
      },
      stops: [],
      totalFlights: 0,
      currency: null,
      supplierCount: 0,
    });

    if (preAirlines && preAirlines.endsWith(",") && preAirlines !== "") {
      toast.error(
        "Please remove the last comma or add airline after in prefered airlince"
      );
      return;
    } else if (String(tripType) === "Multi City") {
      const origin =
        originRef.current.value === undefined
          ? originRefValue
          : originRef.current.value;
      if (origin !== "" && origin.split(/,| -/).length !== 3) {
        originRef.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination =
        destinationRef.current.value === undefined
          ? destinationRefValue
          : destinationRef.current.value;
      if (destination !== "" && destination.split(/,| -/).length !== 3) {
        destinationRef.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const origin1 =
        originRef1.current.value === undefined
          ? originRefValue1
          : originRef1.current.value;
      if (origin1 !== "" && origin1.split(/,| -/).length !== 3) {
        originRef1.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination1 =
        destinationRef1?.current.value === undefined
          ? destinationRefValue1
          : destinationRef1?.current.value;
      if (destination1 !== "" && destination1.split(/,| -/).length !== 3) {
        destinationRef1.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const origin2 =
        originRef2.current.value === undefined
          ? originRefValue2
          : originRef2.current.value;
      if (origin2 !== "" && origin2.split(/,| -/).length !== 3) {
        originRef2.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination2 =
        destinationRef2.current.value === undefined
          ? destinationRefValue2
          : destinationRef2.current.value;
      if (destination2 !== "" && destination2.split(/,| -/).length !== 3) {
        destinationRef2.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const origin3 =
        originRef3.current.value === undefined
          ? originRefValue3
          : originRef3.current.value;
      if (origin3 !== "" && origin3.split(/,| -/).length !== 3) {
        originRef3.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination3 =
        destinationRef3.current.value === undefined
          ? destinationRefValue3
          : destinationRef3.current.value;
      if (destination3 !== "" && destination3.split(/,| -/).length !== 3) {
        destinationRef3.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const origin4 =
        originRef4.current.value === undefined
          ? originRefValue4
          : originRef4.current.value;
      if (origin4 !== "" && origin4.split(/,| -/).length !== 3) {
        originRef4.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination4 =
        destinationRef4.current.value === undefined
          ? destinationRefValue4
          : destinationRef4.current.value;
      if (destination4 !== "" && destination4.split(/,| -/).length !== 3) {
        destinationRef4.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const origin5 =
        originRef5.current.value === undefined
          ? originRefValue5
          : originRef5.current.value;
      if (origin5 !== "" && origin5.split(/,| -/).length !== 3) {
        originRef5.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination5 =
        destinationRef5.current.value === undefined
          ? destinationRefValue5
          : destinationRef5.current.value;
      if (destination5 !== "" && destination5.split(/,| -/).length !== 3) {
        destinationRef5.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      if (origin === "") {
        setoriginRefValue("");
        setdestinationRefValue("");
      }
      if (origin1 === "") {
        setoriginRefValue1("");
        setdestinationRefValue1("");
      }
      if (origin2 === "") {
        setoriginRefValue2("");
        setdestinationRefValue2("");
      }
      if (origin3 === "") {
        setoriginRefValue3("");
        setdestinationRefValue3("");
      }
      if (origin4 === "") {
        setoriginRefValue4("");
        setdestinationRefValue4("");
      }
      if (origin5 === "") {
        setoriginRefValue5("");
        setdestinationRefValue5("");
      }
      const journeyDate = range.startDate;
      const inputDateMulti1 = range.startDateMultiOne;
      const inputDateMulti2 = range.startDateMultiTwo;
      const inputDateMulti3 = range.startDateMultiThree;
      const inputDateMulti4 = range.startDateMultiFour;
      const inputDateMulti5 = range.startDateMultiFive;
      if (origin === destination && origin !== "" && destination !== "") {
        toast.error("Depart From and Going To must be difference No.1");
      } else if (
        origin1 === destination1 &&
        origin1 !== "" &&
        destination1 !== ""
      ) {
        toast.error("Depart From and Going To must be difference No.2");
      } else if (
        origin2 === destination2 &&
        origin2 !== "" &&
        destination2 !== ""
      ) {
        toast.error("Depart From and Going To must be difference No.3");
      } else if (
        origin3 === destination3 &&
        origin3 !== "" &&
        destination3 !== ""
      ) {
        toast.error("Depart From and Going To must be difference No.4");
      } else if (
        origin4 === destination4 &&
        origin4 !== "" &&
        destination4 !== ""
      ) {
        toast.error("Depart From and Going To must be difference No.5");
      } else if (
        origin5 === destination5 &&
        origin5 !== "" &&
        destination5 !== ""
      ) {
        toast.error("Depart From and Going To must be difference No.5");
      } else {
        if (String(journeyDate) === String(null) && origin !== destination) {
          toast.error("Please select all Journey Datedate no.1");
        } else if (
          String(inputDateMulti1) === String(null) &&
          origin1 !== destination1
        ) {
          toast.error("Please select all Journey Datedate no.2");
        } else if (
          String(inputDateMulti2) === String(null) &&
          origin2 !== destination2
        ) {
          toast.error("Please select all Journey Datedate no.3");
        } else if (
          String(inputDateMulti3) === String(null) &&
          origin3 !== destination3
        ) {
          toast.error("Please select all Journey Datedate no.3");
        } else if (
          String(inputDateMulti4) === String(null) &&
          origin4 !== destination4
        ) {
          toast.error("Please select all Journey Datedate no.4");
        } else if (
          String(inputDateMulti5) === String(null) &&
          origin5 !== destination5
        ) {
          toast.error("Please select all Journey Datedate no.5");
        } else {
          const qtyList = {
            Adult: adultCount,
            Children: childCount,
            Infant: infantCount,
          };
          const originCode = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin
            )
            .map((item) => item.iata);
          const destinationCode = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination
            )
            .map((item) => item.iata);
          const originCode1 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin1
            )
            .map((item) => item.iata);
          const destinationCode1 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination1
            )
            .map((item) => item.iata);
          const originCode2 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin2
            )
            .map((item) => item.iata);
          const destinationCode2 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination2
            )
            .map((item) => item.iata);
          const originCode3 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin3
            )
            .map((item) => item.iata);
          const destinationCode3 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination3
            )
            .map((item) => item.iata);
          const originCode4 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin4
            )
            .map((item) => item.iata);
          const destinationCode4 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination4
            )
            .map((item) => item.iata);
          const originCode5 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin5
            )
            .map((item) => item.iata);
          const destinationCode5 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination5
            )
            .map((item) => item.iata);
          let searchParamMulti = {
            routes: [
              {
                origin: originCode[0],
                destination: destinationCode[0],
                departureDate: moment(journeyDate).format("yyyy-MM-DD"),
              },
              {
                origin: originCode1[0],
                destination: destinationCode1[0],
                departureDate: moment(inputDateMulti1).format("yyyy-MM-DD"),
              },
            ],
            fareType: convertFareType(fareType),
            adults: qtyList.Adult,
            childs: qtyList.Children,
            infants: qtyList.Infant,
            cabinClass: getCabinClass(travelClassType),
            preferredCarriers:
              preAirlines !== undefined && preAirlines !== ""
                ? preAirlines.split(",")
                : [],
            prohibitedCarriers: [],
            taxRedemptions: [],
            childrenAges:
              childAge.length > 0 ? childAge.map((item) => item.age) : [],
          };

          if (originCode2[0] !== undefined) {
            let mc2 = {
              origin: originCode2[0],
              destination: destinationCode2[0],
              departureDate: moment(inputDateMulti2).format("yyyy-MM-DD"),
            };
            searchParamMulti.routes.push(mc2);
          }
          if (originCode3[0] !== undefined) {
            let mc2 = {
              origin: originCode3[0],
              destination: destinationCode3[0],
              departureDate: moment(inputDateMulti3).format("yyyy-MM-DD"),
            };
            searchParamMulti.routes.push(mc2);
          }
          if (originCode4[0] !== undefined) {
            let mc2 = {
              origin: originCode4[0],
              destination: destinationCode4[0],
              departureDate: moment(inputDateMulti4).format("yyyy-MM-DD"),
            };
            searchParamMulti.routes.push(mc2);
          }
          if (originCode5[0] !== undefined) {
            let mc2 = {
              origin: originCode5[0],
              destination: destinationCode5[0],
              departureDate: moment(inputDateMulti5).format("yyyy-MM-DD"),
            };
            searchParamMulti.routes.push(mc2);
          }
          const searchData = {
            origin: origin,
            destination: destination,
            origin1: origin1,
            destination1: destination1,
            origin2: origin2,
            destination2: destination2,
            origin3: origin3,
            destination3: destination3,
            origin4: origin4,
            destination4: destination4,
            origin5: origin5,
            destination5: destination5,
            journeyDate: moment(journeyDate).format("yyyy-MM-DD"),
            returnDate: moment(returnDate).format("yyyy-MM-DD"),
            inputDateMulti1: moment(inputDateMulti1).format("yyyy-MM-DD"),
            inputDateMulti2: moment(inputDateMulti2).format("yyyy-MM-DD"),
            inputDateMulti3: moment(inputDateMulti3).format("yyyy-MM-DD"),
            inputDateMulti4: moment(inputDateMulti4).format("yyyy-MM-DD"),
            inputDateMulti5: moment(inputDateMulti5).format("yyyy-MM-DD"),
            tripTypeModify: tripType,
            qtyList: qtyList,
            travelClass: travelClassType,
            childAgeList: childAge,
            fareType: fareType,
            comboFareClick: comboFareClick,
          };

          if (
            searchData.childAgeList.filter(
              (e) => e.age === "" || e.age.toString() === "NaN"
            ).length === 0 ||
            childCount === 0
          ) {
            sessionStorage.setItem("Database", JSON.stringify(searchData));

            // const getData = async () => {
            //   setLoading(true);
            //   const response = await searchFlights(searchParamMulti);
            //   setFetchFlighData(await response.data.item1);
            //   setLoading(false);
            //   document.getElementById("search-again").click();
            // };
            const getData = async () => {
              try {
                setLoading(true);
                setProgressTime(true);
                await fetchEventSource(environment.ProgressiveSearch, {
                  method: "POST",
                  headers: {
                    Authorization: "Bearer " + tokenData?.token,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(searchParamMulti),
                  openWhenHidden: true,
                  async onopen(response) {
                    if (
                      response.ok &&
                      response.headers.get("content-type") ===
                        EventStreamContentType
                    ) {
                      return;
                    } else if (
                      response.status >= 400 &&
                      response.status < 500 &&
                      response.status !== 429
                    ) {
                      setLoading(false);
                      toast.error("Please try again later");
                    } else {
                      setLoading(false);
                      toast.error("Please try again later");
                    }
                  },
                  onmessage(msg) {
                    try {
                      const data = JSON.parse(msg.data);
                      setCheckResForCombo(data?.isComboFare);
                      if (data?.isComboFare) {
                        if (
                          data?.routes[0]?.origin ===
                            searchParamMulti?.routes[0]?.origin &&
                          data?.routes[0]?.destination ===
                            searchParamMulti?.routes[0]?.destination
                        ) {
                          setFetchFlighData({
                            airSearchResponses: [],
                            airlineFilters: [],
                            minMaxPrice: {
                              minPrice: 0,
                              maxPrice: 0,
                            },
                            stops: [],
                            totalFlights: 0,
                            currency: null,
                            supplierCount: 0,
                          });
                          const newChunkData = data?.searchResponse || {};
                          setFetchFlighDeparture((prevData) => ({
                            ...prevData,
                            airSearchResponses: [
                              ...prevData.airSearchResponses,
                              ...newChunkData.airSearchResponses,
                            ],
                            airlineFilters: newChunkData.airlineFilters,
                            minMaxPrice: newChunkData.minMaxPrice,
                            stops: newChunkData.stops,
                            totalFlights: newChunkData.totalFlights,
                            isComboFare: data.isComboFare,
                          }));
                          if (
                            data?.searchResponse?.airSearchResponses.length > 0
                          ) {
                            setLoading(false);
                          }
                        } else {
                          const newChunkData = data?.searchResponse || {};
                          setFetchFlighReturn((prevData) => ({
                            ...prevData,
                            airSearchResponses: [
                              ...prevData.airSearchResponses,
                              ...newChunkData.airSearchResponses,
                            ],
                            airlineFilters: newChunkData.airlineFilters,
                            minMaxPrice: newChunkData.minMaxPrice,
                            stops: newChunkData.stops,
                            totalFlights: newChunkData.totalFlights,
                            isComboFare: data.isComboFare,
                          }));
                        }
                      } else {
                        const newChunkData = data?.searchResponse || {};
                        setFetchFlighData((prevData) => ({
                          ...prevData,
                          airSearchResponses: [
                            ...prevData.airSearchResponses,
                            ...newChunkData.airSearchResponses,
                          ],
                          airlineFilters: newChunkData.airlineFilters,
                          minMaxPrice: newChunkData.minMaxPrice,
                          stops: newChunkData.stops,
                          totalFlights: newChunkData.totalFlights,
                        }));
                        if (
                          data?.searchResponse?.airSearchResponses.length > 0
                        ) {
                          setLoading(false);
                        }
                        setFetchFlighDeparture({
                          airSearchResponses: [],
                          airlineFilters: [],
                          minMaxPrice: {
                            minPrice: 0,
                            maxPrice: 0,
                          },
                          stops: [],
                          totalFlights: 0,
                          currency: null,
                          supplierCount: 0,
                        });
                        setFetchFlighReturn({
                          airSearchResponses: [],
                          airlineFilters: [],
                          minMaxPrice: {
                            minPrice: 0,
                            maxPrice: 0,
                          },
                          stops: [],
                          totalFlights: 0,
                          currency: null,
                          supplierCount: 0,
                        });
                      }
                    } catch (error) {
                      setLoading(false);
                    }
                  },
                  onclose() {
                    setProgressTime(false);
                  },
                  onerror(err) {
                    setLoading(false); // Ensure loading state is turned off in case of error
                  },
                });
              } catch (error) {
                setLoading(false);
              } finally {
                setLoading(false); // Ensure loading state is turned off when finished
              }
            };
            getData();
          } else {
            toast.error("Please select child age");
          }
        }
      }

      if (!sameMatchError) {
        if (!journeyDateError) {
          const qtyList = {
            Adult: adultCount,
            Children: childCount,
            Infant: infantCount,
          };
          const originCode = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin
            )
            .map((item) => item.iata);
          const destinationCode = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination
            )
            .map((item) => item.iata);
          const originCode1 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin1
            )
            .map((item) => item.iata);
          const destinationCode1 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination1
            )
            .map((item) => item.iata);
          const originCode2 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin2
            )
            .map((item) => item.iata);
          const destinationCode2 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination2
            )
            .map((item) => item.iata);
          const originCode3 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin3
            )
            .map((item) => item.iata);
          const destinationCode3 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination3
            )
            .map((item) => item.iata);
          const originCode4 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin4
            )
            .map((item) => item.iata);
          const destinationCode4 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination4
            )
            .map((item) => item.iata);
          const originCode5 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === origin5
            )
            .map((item) => item.iata);
          const destinationCode5 = airports
            .filter(
              (f) => f.city + " - " + f.country + ", " + f.name === destination5
            )
            .map((item) => item.iata);
          let searchParamMulti = {
            routes: [
              {
                origin: originCode[0],
                destination: destinationCode[0],
                departureDate: moment(journeyDate).format("yyyy-MM-DD"),
              },
              {
                origin: originCode1[0],
                destination: destinationCode1[0],
                departureDate: moment(inputDateMulti1).format("yyyy-MM-DD"),
              },
            ],
            fareType: convertFareType(fareType),
            adults: qtyList.Adult,
            childs: qtyList.Children,
            infants: qtyList.Infant,
            cabinClass: getCabinClass(travelClassType),
            preferredCarriers:
              preAirlines !== undefined && preAirlines !== ""
                ? preAirlines.split(",")
                : [],
            prohibitedCarriers: [],
            taxRedemptions: [],
            childrenAges:
              childAge.length > 0 ? childAge.map((item) => item.age) : [],
          };
          if (originCode2[0] !== undefined) {
            let mc2 = {
              origin: originCode2[0],
              destination: destinationCode2[0],
              departureDate: moment(inputDateMulti2).format("yyyy-MM-DD"),
            };
            searchParamMulti.routes.push(mc2);
          }
          if (originCode3[0] !== undefined) {
            let mc2 = {
              origin: originCode3[0],
              destination: destinationCode3[0],
              departureDate: moment(inputDateMulti3).format("yyyy-MM-DD"),
            };
            searchParamMulti.routes.push(mc2);
          }
          if (originCode4[0] !== undefined) {
            let mc2 = {
              origin: originCode4[0],
              destination: destinationCode4[0],
              departureDate: moment(inputDateMulti4).format("yyyy-MM-DD"),
            };
            searchParamMulti.routes.push(mc2);
          }
          if (originCode5[0] !== undefined) {
            let mc2 = {
              origin: originCode5[0],
              destination: destinationCode5[0],
              departureDate: moment(inputDateMulti5).format("yyyy-MM-DD"),
            };
            searchParamMulti.routes.push(mc2);
          }
          const searchData = {
            origin: origin,
            destination: destination,
            origin1: origin1,
            destination1: destination1,
            origin2: origin2,
            destination2: destination2,
            origin3: origin3,
            destination3: destination3,
            origin4: origin4,
            destination4: destination4,
            origin5: origin5,
            destination5: destination5,
            journeyDate: moment(journeyDate).format("yyyy-MM-DD"),
            returnDate: moment(returnDate).format("yyyy-MM-DD"),
            inputDateMulti1: moment(inputDateMulti1).format("yyyy-MM-DD"),
            inputDateMulti2: moment(inputDateMulti2).format("yyyy-MM-DD"),
            inputDateMulti3: moment(inputDateMulti3).format("yyyy-MM-DD"),
            inputDateMulti4: moment(inputDateMulti4).format("yyyy-MM-DD"),
            inputDateMulti5: moment(inputDateMulti5).format("yyyy-MM-DD"),
            tripTypeModify: tripType,
            qtyList: qtyList,
            travelClass: travelClassType,
            childAgeList: childAge,
            fareType: fareType,
            comboFareClick: comboFareClick,
          };

          if (
            searchData.childAgeList.filter(
              (e) => e.age === "" || e.age.toString() === "NaN"
            ).length === 0 ||
            childCount === 0
          ) {
            sessionStorage.setItem("Database", JSON.stringify(searchData));

            // const getData = async () => {
            //   setLoading(true);
            //   const response = await searchFlights(searchParamMulti);
            //   setFetchFlighData(await response.data.item1);
            //   setLoading(false);
            //   document.getElementById("search-again").click();
            // };
            const getData = async () => {
              try {
                setLoading(true);
                setProgressTime(true);
                await fetchEventSource(environment.ProgressiveSearch, {
                  method: "POST",
                  headers: {
                    Authorization: "Bearer " + tokenData?.token,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(searchParamMulti),
                  openWhenHidden: true,
                  async onopen(response) {
                    if (
                      response.ok &&
                      response.headers.get("content-type") ===
                        EventStreamContentType
                    ) {
                      return;
                    } else if (
                      response.status >= 400 &&
                      response.status < 500 &&
                      response.status !== 429
                    ) {
                      setLoading(false);
                      toast.error("Please try again later");
                    } else {
                      setLoading(false);
                      toast.error("Please try again later");
                    }
                  },
                  onmessage(msg) {
                    try {
                      const data = JSON.parse(msg.data);
                      setCheckResForCombo(data?.isComboFare);
                      if (data?.isComboFare) {
                        if (
                          data?.routes[0]?.origin ===
                            searchParamMulti?.routes[0]?.origin &&
                          data?.routes[0]?.destination ===
                            searchParamMulti?.routes[0]?.destination
                        ) {
                          setFetchFlighData({
                            airSearchResponses: [],
                            airlineFilters: [],
                            minMaxPrice: {
                              minPrice: 0,
                              maxPrice: 0,
                            },
                            stops: [],
                            totalFlights: 0,
                            currency: null,
                            supplierCount: 0,
                          });
                          const newChunkData = data?.searchResponse || {};
                          setFetchFlighDeparture((prevData) => ({
                            ...prevData,
                            airSearchResponses: [
                              ...prevData.airSearchResponses,
                              ...newChunkData.airSearchResponses,
                            ],
                            airlineFilters: newChunkData.airlineFilters,
                            minMaxPrice: newChunkData.minMaxPrice,
                            stops: newChunkData.stops,
                            totalFlights: newChunkData.totalFlights,
                            isComboFare: data.isComboFare,
                          }));
                          if (
                            data?.searchResponse?.airSearchResponses.length > 0
                          ) {
                            setLoading(false);
                          }
                        } else {
                          const newChunkData = data?.searchResponse || {};
                          setFetchFlighReturn((prevData) => ({
                            ...prevData,
                            airSearchResponses: [
                              ...prevData.airSearchResponses,
                              ...newChunkData.airSearchResponses,
                            ],
                            airlineFilters: newChunkData.airlineFilters,
                            minMaxPrice: newChunkData.minMaxPrice,
                            stops: newChunkData.stops,
                            totalFlights: newChunkData.totalFlights,
                            isComboFare: data.isComboFare,
                          }));
                        }
                      } else {
                        const newChunkData = data?.searchResponse || {};
                        setFetchFlighData((prevData) => ({
                          ...prevData,
                          airSearchResponses: [
                            ...prevData.airSearchResponses,
                            ...newChunkData.airSearchResponses,
                          ],
                          airlineFilters: newChunkData.airlineFilters,
                          minMaxPrice: newChunkData.minMaxPrice,
                          stops: newChunkData.stops,
                          totalFlights: newChunkData.totalFlights,
                        }));
                        if (
                          data?.searchResponse?.airSearchResponses.length > 0
                        ) {
                          setLoading(false);
                        }
                        setFetchFlighDeparture({
                          airSearchResponses: [],
                          airlineFilters: [],
                          minMaxPrice: {
                            minPrice: 0,
                            maxPrice: 0,
                          },
                          stops: [],
                          totalFlights: 0,
                          currency: null,
                          supplierCount: 0,
                        });
                        setFetchFlighReturn({
                          airSearchResponses: [],
                          airlineFilters: [],
                          minMaxPrice: {
                            minPrice: 0,
                            maxPrice: 0,
                          },
                          stops: [],
                          totalFlights: 0,
                          currency: null,
                          supplierCount: 0,
                        });
                      }
                    } catch (error) {
                      setLoading(false);
                    }
                  },
                  onclose() {
                    setProgressTime(false);
                  },
                  onerror(err) {
                    setLoading(false); // Ensure loading state is turned off in case of error
                  },
                });
              } catch (error) {
                setLoading(false);
              } finally {
                setLoading(false); // Ensure loading state is turned off when finished
              }
            };
            getData();
          } else {
            toast.error("Please select child age");
          }
        }
      }
    } else if (String(tripType) === "Round Trip") {
      const origin =
        originRef.current.value === undefined
          ? originRefValue
          : originRef.current.value;
      if (origin.split(/,| -/).length !== 3) {
        originRef.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination =
        destinationRef.current.value === undefined
          ? destinationRefValue
          : destinationRef.current.value;
      if (destination.split(/,| -/).length !== 3) {
        destinationRef.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const journeyDate = range.startDate;
      const returnDate = range.endDate;
      if (origin === destination && (origin !== "") & (destination !== "")) {
        toast.error("Depart From and Going To must be difference");
      } else if (
        String(journeyDate) !== String(null) &&
        String(journeyDate) !== "" &&
        String(returnDate) !== String(null) &&
        String(returnDate) !== ""
      ) {
        const qtyList = {
          Adult: adultCount,
          Children: childCount,
          Infant: infantCount,
        };
        const originCode = airports
          .filter((f) => f.city + " - " + f.country + ", " + f.name === origin)
          .map((item) => item.iata);
        const destinationCode = airports
          .filter(
            (f) => f.city + " - " + f.country + ", " + f.name === destination
          )
          .map((item) => item.iata);

        const searchData = {
          origin: origin,
          destination: destination,
          journeyDate: moment(journeyDate).format("yyyy-MM-DD"),
          returnDate: moment(returnDate).format("yyyy-MM-DD"),
          tripTypeModify: tripType,
          qtyList: qtyList,
          travelClass: travelClassType,
          childAgeList: childAge,
          fareType: fareType,
          comboFareClick: comboFareClick,
        };

        if (
          searchData.childAgeList.filter(
            (e) => e.age === "" || e.age.toString() === "NaN"
          ).length === 0 ||
          childCount === 0
        ) {
          sessionStorage.setItem("Database", JSON.stringify(searchData));

          let searchParamRoundWay = {
            routes: [
              {
                origin: originCode[0],
                destination: destinationCode[0],
                departureDate: moment(journeyDate).format("yyyy-MM-DD"),
              },
              {
                origin: destinationCode[0],
                destination: originCode[0],
                departureDate: moment(returnDate).format("yyyy-MM-DD"),
              },
            ],
            IsComboFareActive: comboFareClick,
            fareType: convertFareType(fareType),
            adults: qtyList.Adult,
            childs: qtyList.Children,
            infants: qtyList.Infant,
            cabinClass: getCabinClass(travelClassType),
            preferredCarriers:
              preAirlines !== undefined && preAirlines !== ""
                ? preAirlines.split(",")
                : [],
            prohibitedCarriers: [],
            taxRedemptions: [],
            childrenAges:
              childAge.length > 0 ? childAge.map((item) => item.age) : [],
          };

          // const getData = async () => {
          //   setLoading(true);
          //   const response = await searchFlights(searchParamRoundWay);
          //   setFetchFlighData(await response.data.item1);
          //   setLoading(false);
          //   document.getElementById("search-again").click();
          // };
          const getData = async () => {
            try {
              setLoading(true);
              setProgressTime(true);
              await fetchEventSource(environment.ProgressiveSearch, {
                method: "POST",
                headers: {
                  Authorization: "Bearer " + tokenData?.token,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(searchParamRoundWay),
                openWhenHidden: true,
                async onopen(response) {
                  if (
                    response.ok &&
                    response.headers.get("content-type") ===
                      EventStreamContentType
                  ) {
                    return;
                  } else if (
                    response.status >= 400 &&
                    response.status < 500 &&
                    response.status !== 429
                  ) {
                    setLoading(false);
                    toast.error("Please try again later");
                  } else {
                    setLoading(false);
                    toast.error("Please try again later");
                  }
                },
                onmessage(msg) {
                  try {
                    const data = JSON.parse(msg.data);
                    setCheckResForCombo(data?.isComboFare);
                    if (data?.isComboFare) {
                      if (
                        data?.routes[0]?.origin ===
                          searchParamRoundWay?.routes[0]?.origin &&
                        data?.routes[0]?.destination ===
                          searchParamRoundWay?.routes[0]?.destination
                      ) {
                        setFetchFlighData({
                          airSearchResponses: [],
                          airlineFilters: [],
                          minMaxPrice: {
                            minPrice: 0,
                            maxPrice: 0,
                          },
                          stops: [],
                          totalFlights: 0,
                          currency: null,
                          supplierCount: 0,
                        });
                        const newChunkData = data?.searchResponse || {};
                        setFetchFlighDeparture((prevData) => ({
                          ...prevData,
                          airSearchResponses: [
                            ...prevData.airSearchResponses,
                            ...newChunkData.airSearchResponses,
                          ],
                          airlineFilters: newChunkData.airlineFilters,
                          minMaxPrice: newChunkData.minMaxPrice,
                          stops: newChunkData.stops,
                          totalFlights: newChunkData.totalFlights,
                          isComboFare: data.isComboFare,
                        }));
                        if (
                          data?.searchResponse?.airSearchResponses.length > 0
                        ) {
                          setLoading(false);
                        }
                      } else {
                        const newChunkData = data?.searchResponse || {};
                        setFetchFlighReturn((prevData) => ({
                          ...prevData,
                          airSearchResponses: [
                            ...prevData.airSearchResponses,
                            ...newChunkData.airSearchResponses,
                          ],
                          airlineFilters: newChunkData.airlineFilters,
                          minMaxPrice: newChunkData.minMaxPrice,
                          stops: newChunkData.stops,
                          totalFlights: newChunkData.totalFlights,
                          isComboFare: data.isComboFare,
                        }));
                      }
                    } else {
                      const newChunkData = data?.searchResponse || {};
                      setFetchFlighData((prevData) => ({
                        ...prevData,
                        airSearchResponses: [
                          ...prevData.airSearchResponses,
                          ...newChunkData.airSearchResponses,
                        ],
                        airlineFilters: newChunkData.airlineFilters,
                        minMaxPrice: newChunkData.minMaxPrice,
                        stops: newChunkData.stops,
                        totalFlights: newChunkData.totalFlights,
                      }));
                      if (data?.searchResponse?.airSearchResponses.length > 0) {
                        setLoading(false);
                      }
                      setFetchFlighDeparture({
                        airSearchResponses: [],
                        airlineFilters: [],
                        minMaxPrice: {
                          minPrice: 0,
                          maxPrice: 0,
                        },
                        stops: [],
                        totalFlights: 0,
                        currency: null,
                        supplierCount: 0,
                      });
                      setFetchFlighReturn({
                        airSearchResponses: [],
                        airlineFilters: [],
                        minMaxPrice: {
                          minPrice: 0,
                          maxPrice: 0,
                        },
                        stops: [],
                        totalFlights: 0,
                        currency: null,
                        supplierCount: 0,
                      });
                    }
                  } catch (error) {
                    setLoading(false);
                  }
                },
                onclose() {
                  setProgressTime(false);
                },
                onerror(err) {
                  setLoading(false);
                },
              });
            } catch (error) {
              setLoading(false);
            } finally {
              setLoading(false);
            }
          };
          getData();
        } else {
          toast.error("Please select child age");
        }
      } else {
        toast.error("Please select date");
      }
    } else if (String(tripType) === "One Way") {
      const origin =
        originRef.current.value === ""
          ? originRefValue
          : originRef.current.value;
      if (origin.split(/,| -/).length !== 3) {
        originRef.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination =
        destinationRef.current.value === ""
          ? destinationRefValue
          : destinationRef.current.value;
      // const journeyDate = $("#departureDate").children("input").val();
      if (destination.split(/,| -/).length !== 3) {
        destinationRef.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const journeyDate = range.startDate;

      if (origin === destination && (origin !== "") & (destination !== "")) {
        toast.error("Depart From and Going To must be difference");
      } else if (
        String(journeyDate) !== String(null) &&
        String(journeyDate) !== ""
      ) {
        const qtyList = {
          Adult: adultCount,
          Children: childCount,
          Infant: infantCount,
        };
        const originCode = airports
          .filter((f) => f.city + " - " + f.country + ", " + f.name === origin)
          .map((item) => item.iata);
        const destinationCode = airports
          .filter(
            (f) => f.city + " - " + f.country + ", " + f.name === destination
          )
          .map((item) => item.iata);

        const searchData = {
          origin: origin,
          destination: destination,
          journeyDate: moment(journeyDate).format("yyyy-MM-DD"),
          returnDate: moment(journeyDate).format("yyyy-MM-DD"),
          tripTypeModify: tripType,
          qtyList: qtyList,
          travelClass: travelClassType,
          childAgeList: childAge,
          fareType: fareType,
          comboFareClick: comboFareClick,
        };

        if (
          searchData.childAgeList.filter(
            (e) => e.age === "" || e.age.toString() === "NaN"
          ).length === 0 ||
          childCount === 0
        ) {
          sessionStorage.setItem("Database", JSON.stringify(searchData));

          let searchParamOnedWay = {
            routes: [
              {
                origin: originCode[0],
                destination: destinationCode[0],
                departureDate: moment(journeyDate).format("yyyy-MM-DD"),
              },
            ],
            fareType: convertFareType(fareType),
            adults: qtyList.Adult,
            childs: qtyList.Children,
            infants: qtyList.Infant,
            cabinClass: getCabinClass(travelClassType),
            preferredCarriers:
              preAirlines !== undefined && preAirlines !== ""
                ? preAirlines.split(",")
                : [],
            prohibitedCarriers: [],
            taxRedemptions: [],
            childrenAges:
              childAge.length > 0 ? childAge.map((item) => item.age) : [],
          };

          // const getData = async () => {
          //   setLoading(true);
          //   const response = await searchFlights(searchParamOnedWay);
          //   setFetchFlighData(await response.data.item1);
          //   setLoading(false);
          //   document.getElementById("search-again").click();
          // };
          const getData = async () => {
            try {
              setLoading(true);
              setProgressTime(true);
              await fetchEventSource(environment.ProgressiveSearch, {
                method: "POST",
                headers: {
                  Authorization: "Bearer " + tokenData?.token,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(searchParamOnedWay),
                openWhenHidden: true,
                async onopen(response) {
                  if (
                    response.ok &&
                    response.headers.get("content-type") ===
                      EventStreamContentType
                  ) {
                    return;
                  } else if (
                    response.status >= 400 &&
                    response.status < 500 &&
                    response.status !== 429
                  ) {
                    setLoading(false);
                    toast.error("Please try again later");
                  } else {
                    setLoading(false);
                    toast.error("Please try again later");
                  }
                },
                onmessage(msg) {
                  try {
                    const data = JSON.parse(msg.data);
                    const newChunkData = data?.searchResponse || {};
                    setFetchFlighData((prevData) => ({
                      ...prevData, // Keep all previous state data intact
                      airSearchResponses: [
                        ...prevData.airSearchResponses, // Preserve previous search results
                        ...newChunkData.airSearchResponses, // Append the new chunk of flight data
                      ],
                      airlineFilters: newChunkData.airlineFilters, // Optionally, you can also update other fields like minMaxPrice or totalFlights
                      // Optionally, you can also update other fields like minMaxPrice or totalFlights
                      minMaxPrice: newChunkData.minMaxPrice, // If you want to update it with the new chunk
                      stops: newChunkData.stops, // If stops are included in the new chunk
                      totalFlights: newChunkData.totalFlights, // If totalFlights is included in the new chunk
                    }));

                    if (data?.searchResponse?.airSearchResponses.length > 0) {
                      setLoading(false);
                    }
                  } catch (error) {
                    setLoading(false); // Ensure loading state is also turned off on error
                  }
                },
                onclose() {
                  setProgressTime(false);
                },
                onerror(err) {
                  setLoading(false); // Ensure loading state is turned off in case of error
                },
              });
            } catch (error) {
              setLoading(false);
            } finally {
              setLoading(false); // Ensure loading state is turned off when finished
            }
          };
          getData();
        } else {
          toast.error("Please select child age");
        }
      } else {
        toast.error("Please select date");
      }
    }
    e.preventDefault();
  };

  const addNewChild = (child) => {
    setChildCount(child + 1);
    setChildAge([...childAge, { age: "" }]);
  };

  const handleChildAge = (e, index) => {
    let age = childAge;
    age[index][e.target.name] = parseInt(e.target.value);
    setChildAge(age);
  };

  const clickOnDelete = (child) => {
    setChildCount(child - 1);
    const lastIndex = childAge.length - 1;
    // this.setState({ items: items.filter((item, index) => index !== lastIndex) });
    setChildAge(childAge.filter((r, index) => index !== lastIndex));
  };

  const [range, setRange] = useState({
    startDate: journeyDate,
    endDate: returnDate,
    startDateMultiOne:
      inputDateMulti1 !== undefined ? inputDateMulti1 : new Date(),
    startDateMultiTwo:
      inputDateMulti2 !== undefined ? inputDateMulti2 : new Date(),
    startDateMultiThree:
      inputDateMulti3 !== undefined ? inputDateMulti3 : new Date(),
    startDateMultiFour:
      inputDateMulti4 !== undefined ? inputDateMulti4 : new Date(),
    startDateMultiFive:
      inputDateMulti5 !== undefined ? inputDateMulti5 : new Date(),
  });

  useEffect(() => {
    if (dayCount(range.startDate, range.endDate) < 0) {
      setRange({ ...range, endDate: addDays(range.startDate, 1) });
      setCurrentDateReturn(addDays(range.startDate, 1));
    }
    if (dayCount(range.startDate, range.startDateMultiOne) < 0) {
      setRange({ ...range, startDateMultiOne: addDays(range.startDate, 1) });
    }
    if (dayCount(range.startDateMultiOne, range.startDateMultiTwo) < 0) {
      setRange({
        ...range,
        startDateMultiTwo: addDays(range.startDateMultiOne, 1),
      });
    }
    if (dayCount(range.startDateMultiTwo, range.startDateMultiThree) < 0) {
      setRange({
        ...range,
        startDateMultiThree: addDays(range.startDateMultiTwo, 1),
      });
    }
    if (dayCount(range.startDateMultiThree, range.startDateMultiFour) < 0) {
      setRange({
        ...range,
        startDateMultiFour: addDays(range.startDateMultiThree, 1),
      });
    }
    if (dayCount(range.startDateMultiFour, range.startDateMultiFive) < 0) {
      setRange({
        ...range,
        startDateMultiFive: addDays(range.startDateMultiFour, 1),
      });
    }

    let C = moment("2020-01-03");
    let D = moment("2020-01-03");
    let E = moment("2020-01-03");
    let F = moment("2020-01-03");
  }, [range]);

  const handleSwap = (index) => {
    if (index === 0) {
      if (
        originRef.current.value !== undefined &&
        destinationRef.current.value !== undefined
      ) {
        const temp = originRef.current.value;
        originRef.current.value = destinationRef.current.value;
        destinationRef.current.value = temp;
      } else {
        const temp = originRefValue;
        setoriginRefValue(destinationRefValue);
        setdestinationRefValue(temp);
      }
    }
    if (index === 1) {
      if (
        originRef1.current.value !== undefined &&
        destinationRef1.current.value !== undefined
      ) {
        const temp = originRef1.current.value;
        originRef1.current.value = destinationRef1.current.value;
        destinationRef1.current.value = temp;
      } else {
        const temp = originRefValue1;
        setoriginRefValue1(destinationRefValue1);
        setdestinationRefValue1(temp);
      }
    }
    if (index === 2) {
      if (
        originRef2.current.value !== undefined &&
        destinationRef2.current.value !== undefined
      ) {
        const temp = originRef2.current.value;
        originRef2.current.value = destinationRef2.current.value;
        destinationRef2.current.value = temp;
      } else {
        const temp = originRefValue2;
        setoriginRefValue2(destinationRefValue2);
        setdestinationRefValue2(temp);
      }
    }
    if (index === 3) {
      if (
        originRef3.current.value !== undefined &&
        destinationRef3.current.value !== undefined
      ) {
        const temp = originRef3.current.value;
        originRef3.current.value = destinationRef3.current.value;
        destinationRef3.current.value = temp;
      } else {
        const temp = originRefValue3;
        setoriginRefValue3(destinationRefValue3);
        setdestinationRefValue3(temp);
      }
    }
    if (index === 4) {
      if (
        originRef4.current.value !== undefined &&
        destinationRef4.current.value !== undefined
      ) {
        const temp = originRef4.current.value;
        originRef4.current.value = destinationRef4.current.value;
        destinationRef4.current.value = temp;
      } else {
        const temp = originRefValue4;
        setoriginRefValue4(destinationRefValue4);
        setdestinationRefValue4(temp);
      }
    }
    if (index === 5) {
      if (
        originRef5.current.value !== undefined &&
        destinationRef5.current.value !== undefined
      ) {
        const temp = originRef5.current.value;
        originRef5.current.value = destinationRef5.current.value;
        destinationRef5.current.value = temp;
      } else {
        const temp = originRefValue5;
        setoriginRefValue5(destinationRefValue5);
        setdestinationRefValue5(temp);
      }
    }
  };

  const [currentDateDepart, setCurrentDateDepart] = useState(range.startDate);
  const [currentDateReturn, setCurrentDateReturn] = useState(range.endDate);
  const [apiCall, setApiCall] = useState(false);

  const handleDepartNextDay = () => {
    setCurrentDateDepart((prevDate) => addDays(prevDate, 1));
    setApiCall(true);
  };

  const handleReturnNextDay = () => {
    setCurrentDateReturn((prevDate) => addDays(prevDate, 1));
    setApiCall(true);
  };

  const handleDepartPreviousDay = () => {
    setCurrentDateDepart((prevDate) => addDays(prevDate, -1));
    setApiCall(true);
  };

  const handleReturnPreviousDay = () => {
    setCurrentDateReturn((prevDate) => addDays(prevDate, -1));
    setApiCall(true);
  };

  useEffect(() => {
    if (apiCall) {
      setFetchFlighData({
        airSearchResponses: [],
        airlineFilters: [],
        minMaxPrice: {
          minPrice: 0,
          maxPrice: 0,
        },
        stops: [],
        totalFlights: 0,
        currency: null,
        supplierCount: 0,
      });
      setFetchFlighDeparture({
        airSearchResponses: [],
        airlineFilters: [],
        minMaxPrice: {
          minPrice: 0,
          maxPrice: 0,
        },
        stops: [],
        totalFlights: 0,
        currency: null,
        supplierCount: 0,
      });
      setFetchFlighReturn({
        airSearchResponses: [],
        airlineFilters: [],
        minMaxPrice: {
          minPrice: 0,
          maxPrice: 0,
        },
        stops: [],
        totalFlights: 0,
        currency: null,
        supplierCount: 0,
      });
    }
    const qtyList = {
      Adult: adultCount,
      Children: childCount,
      Infant: infantCount,
    };
    if (String(tripType) === "One Way" && apiCall) {
      setRange({ ...range, startDate: currentDateDepart });
      const searchDataModify = JSON.parse(sessionStorage.getItem("Database"));
      const searchData = {
        origin: searchDataModify.origin,
        destination: searchDataModify.destination,
        journeyDate: currentDateDepart,
        returnDate: "null",
        tripTypeModify: tripType,
        qtyList: qtyList,
        travelClass: travelClassType,
        childAgeList: childAge,
        fareType: fareType,
        comboFareClick: comboFareClick,
      };
      sessionStorage.setItem("Database", JSON.stringify(searchData));
      let searchParamOnedWay = {
        routes: [
          {
            origin: originCode[0],
            destination: destinationCode[0],
            departureDate: moment(currentDateDepart).format("yyyy-MM-DD"),
          },
        ],
        fareType: convertFareType(fareType),
        adults: qtyList.Adult,
        childs: qtyList.Children,
        infants: qtyList.Infant,
        cabinClass: getCabinClass(travelClassType),
        preferredCarriers:
          preAirlines !== undefined && preAirlines !== ""
            ? preAirlines.split(",")
            : [],
        prohibitedCarriers: [],
        taxRedemptions: [],
        childrenAges:
          childAge.length > 0 ? childAge.map((item) => item.age) : [],
      };

      const getData = async () => {
        try {
          setApiCall(false);
          setLoading(true);
          setProgressTime(true);
          await fetchEventSource(environment.ProgressiveSearch, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + tokenData?.token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchParamOnedWay),
            openWhenHidden: true,
            async onopen(response) {
              if (
                response.ok &&
                response.headers.get("content-type") === EventStreamContentType
              ) {
                return;
              } else if (
                response.status >= 400 &&
                response.status < 500 &&
                response.status !== 429
              ) {
                setLoading(false);
                toast.error("Please try again later");
              } else {
                setLoading(false);
                toast.error("Please try again later");
              }
            },
            onmessage(msg) {
              try {
                const data = JSON.parse(msg.data);
                const newChunkData = data?.searchResponse || {};
                setFetchFlighData((prevData) => ({
                  ...prevData,
                  airSearchResponses: [
                    ...prevData.airSearchResponses,
                    ...newChunkData.airSearchResponses,
                  ],
                  airlineFilters: newChunkData.airlineFilters,
                  minMaxPrice: newChunkData.minMaxPrice,
                  stops: newChunkData.stops,
                  totalFlights: newChunkData.totalFlights,
                }));

                if (data?.searchResponse?.airSearchResponses.length > 0) {
                  setLoading(false);
                }
              } catch (error) {
                setLoading(false);
              }
            },
            onclose() {
              setProgressTime(false);
            },
            onerror(err) {
              setLoading(false);
            },
          });
        } catch (error) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
      getData();
    } else if (String(tripType) === "Round Trip" && apiCall) {
      setRange({
        ...range,
        startDate: currentDateDepart,
        endDate: currentDateReturn,
      });
      const searchDataModify = JSON.parse(sessionStorage.getItem("Database"));
      const searchData = {
        origin: searchDataModify.origin,
        destination: searchDataModify.destination,
        journeyDate: currentDateDepart,
        returnDate: currentDateReturn,
        tripTypeModify: tripType,
        qtyList: qtyList,
        travelClass: travelClassType,
        childAgeList: childAge,
        fareType: fareType,
        comboFareClick: comboFareClick,
      };
      sessionStorage.setItem("Database", JSON.stringify(searchData));
      let searchParamRoundWay = {
        routes: [
          {
            origin: originCode[0],
            destination: destinationCode[0],
            departureDate: moment(currentDateDepart).format("yyyy-MM-DD"),
          },
          {
            origin: destinationCode[0],
            destination: originCode[0],
            departureDate: moment(currentDateReturn).format("yyyy-MM-DD"),
          },
        ],
        IsComboFareActive: comboFareClick,
        fareType: convertFareType(fareType),
        adults: qtyList.Adult,
        childs: qtyList.Children,
        infants: qtyList.Infant,
        cabinClass: getCabinClass(travelClassType),
        preferredCarriers:
          preAirlines !== undefined && preAirlines !== ""
            ? preAirlines.split(",")
            : [],
        prohibitedCarriers: [],
        taxRedemptions: [],
        childrenAges:
          childAge.length > 0 ? childAge.map((item) => item.age) : [],
      };

      const getData = async () => {
        try {
          setProgressTime(true);
          setLoading(true);
          await fetchEventSource(environment.ProgressiveSearch, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + tokenData?.token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchParamRoundWay),
            openWhenHidden: true,
            async onopen(response) {
              if (
                response.ok &&
                response.headers.get("content-type") === EventStreamContentType
              ) {
                return;
              } else if (
                response.status >= 400 &&
                response.status < 500 &&
                response.status !== 429
              ) {
                setLoading(false);
                toast.error("Please try again later");
              } else {
                setLoading(false);
                toast.error("Please try again later");
              }
            },
            onmessage(msg) {
              try {
                const data = JSON.parse(msg.data);
                setCheckResForCombo(data?.isComboFare);
                if (data?.isComboFare) {
                  if (
                    data?.routes[0]?.origin ===
                      searchParamRoundWay?.routes[0]?.origin &&
                    data?.routes[0]?.destination ===
                      searchParamRoundWay?.routes[0]?.destination
                  ) {
                    const newChunkData = data?.searchResponse || {};
                    setFetchFlighDeparture((prevData) => ({
                      ...prevData,
                      airSearchResponses: [
                        ...prevData.airSearchResponses,
                        ...newChunkData.airSearchResponses,
                      ],
                      airlineFilters: newChunkData.airlineFilters,
                      minMaxPrice: newChunkData.minMaxPrice,
                      stops: newChunkData.stops,
                      totalFlights: newChunkData.totalFlights,
                      isComboFare: data.isComboFare,
                    }));
                    if (data?.searchResponse?.airSearchResponses.length > 0) {
                      setLoading(false);
                    }
                  } else {
                    const newChunkData = data?.searchResponse || {};
                    setFetchFlighReturn((prevData) => ({
                      ...prevData,
                      airSearchResponses: [
                        ...prevData.airSearchResponses,
                        ...newChunkData.airSearchResponses,
                      ],
                      airlineFilters: newChunkData.airlineFilters,
                      minMaxPrice: newChunkData.minMaxPrice,
                      stops: newChunkData.stops,
                      totalFlights: newChunkData.totalFlights,
                      isComboFare: data.isComboFare,
                    }));
                  }
                } else {
                  const newChunkData = data?.searchResponse || {};
                  setFetchFlighData((prevData) => ({
                    ...prevData,
                    airSearchResponses: [
                      ...prevData.airSearchResponses,
                      ...newChunkData.airSearchResponses,
                    ],
                    airlineFilters: newChunkData.airlineFilters,
                    minMaxPrice: newChunkData.minMaxPrice,
                    stops: newChunkData.stops,
                    totalFlights: newChunkData.totalFlights,
                  }));
                }
                if (data?.searchResponse?.airSearchResponses.length > 0) {
                  setLoading(false);
                }
              } catch (error) {
                setLoading(false);
              }
            },
            onclose() {
              setProgressTime(false);
            },
            onerror(err) {
              setLoading(false);
            },
          });
        } catch (error) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
      getData();
    }
  }, [currentDateDepart, currentDateReturn]);

  const [departValue, setDepartValue] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
    five: "",
    six: "",
  });
  const [returnValue, setReturnValue] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
    five: "",
    six: "",
  });

  // useEffect(() => {
  //   if (fetchFlighData.airSearchResponses.length === 0 && loading === false) {
  //     $(".modal-backdrop").remove();
  //     $("body").removeClass("modal-open");
  //     $("body").removeAttr("style");
  //   }
  // }, [loading]);
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <ToastContainer position="bottom-right" autoClose={1500} />
      <div className="content-wrapper">
        <section className="content-header"></section>
        <section className="content">
          <div className="container box-shadow content-width">
            <div className="row border justify-content-center">
              <div className="col-lg-7 py-3 my-auto border-right bg-white">
                <div className="d-flex flex-wrap justify-content-start">
                  <div className="p-2 border">
                    <span className="fw-bold" style={{ fontSize: "10px" }}>
                      <span className="me-2">
                        <i className="fas fa-plane-departure"></i>
                      </span>{" "}
                      <span>
                        {originCode[0]} (
                        {airports
                          .filter((f) => f.iata === originCode[0])
                          .map((item) => item.city)}
                        )
                      </span>
                    </span>
                    <span className="px-1">|</span>
                    <span className="fw-bold" style={{ fontSize: "10px" }}>
                      <span className="me-2">
                        <i className="fas fa-plane-arrival"></i>
                      </span>
                      {searchData.returnDate === "null" ? (
                        <span>
                          {destinationCode[0]} (
                          {airports
                            .filter((f) => f.iata === destinationCode[0])
                            .map((item) => item.city)}
                          )
                        </span>
                      ) : (
                        <span>
                          {destinationCode[0]} (
                          {airports
                            .filter((f) => f.iata === destinationCode[0])
                            .map((item) => item.city)}
                          )
                        </span>
                      )}

                      <ReactTooltip effect="solid" html={true}></ReactTooltip>
                    </span>
                  </div>
                  {searchData.origin1 !== "" &&
                  searchData.origin1 !== undefined ? (
                    <>
                      <div className="p-2 border">
                        <span className="fw-bold" style={{ fontSize: "10px" }}>
                          <span className="me-2">
                            <i className="fas fa-plane-departure"></i>
                          </span>{" "}
                          <span>
                            {originCode1[0]} (
                            {airports
                              .filter((f) => f.iata === originCode1[0])
                              .map((item) => item.city)}
                            )
                          </span>
                        </span>
                        <span className="px-1">|</span>
                        <span className="fw-bold" style={{ fontSize: "10px" }}>
                          <span className="me-2">
                            <i className="fas fa-plane-arrival"></i>
                          </span>

                          <span>
                            {destinationCode1[0]} (
                            {airports
                              .filter((f) => f.iata === destinationCode1[0])
                              .map((item) => item.city)}
                            )
                          </span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {searchData.origin2 !== "" &&
                  searchData.origin2 !== undefined ? (
                    <>
                      <div className="p-2 border">
                        <span className="fw-bold" style={{ fontSize: "10px" }}>
                          <span className="me-2">
                            <i className="fas fa-plane-departure"></i>
                          </span>{" "}
                          <span>
                            {originCode2[0]} (
                            {airports
                              .filter((f) => f.iata === originCode2[0])
                              .map((item) => item.city)}
                            )
                          </span>
                        </span>
                        <span className="px-1">|</span>
                        <span className="fw-bold" style={{ fontSize: "10px" }}>
                          <span className="me-2">
                            <i className="fas fa-plane-arrival"></i>
                          </span>

                          <span>
                            {destinationCode2[0]} (
                            {airports
                              .filter((f) => f.iata === destinationCode2[0])
                              .map((item) => item.city)}
                            )
                          </span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {searchData.origin3 !== "" &&
                  searchData.origin3 !== undefined ? (
                    <>
                      <div className="p-2 border">
                        <span className="fw-bold" style={{ fontSize: "10px" }}>
                          <span className="me-2">
                            <i className="fas fa-plane-departure"></i>
                          </span>{" "}
                          <span>
                            {originCode3[0]} (
                            {airports
                              .filter((f) => f.iata === originCode3[0])
                              .map((item) => item.city)}
                            )
                          </span>
                        </span>
                        <span className="px-1">|</span>
                        <span className="fw-bold" style={{ fontSize: "10px" }}>
                          <span className="me-2">
                            <i className="fas fa-plane-arrival"></i>
                          </span>

                          <span>
                            {destinationCode3[0]} (
                            {airports
                              .filter((f) => f.iata === destinationCode3[0])
                              .map((item) => item.city)}
                            )
                          </span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {searchData.origin4 !== "" &&
                  searchData.origin4 !== undefined ? (
                    <>
                      <div className="p-2 border">
                        <span className="fw-bold" style={{ fontSize: "10px" }}>
                          <span className="me-2">
                            <i className="fas fa-plane-departure"></i>
                          </span>{" "}
                          <span>
                            {originCode4[0]} (
                            {airports
                              .filter((f) => f.iata === originCode4[0])
                              .map((item) => item.city)}
                            )
                          </span>
                        </span>
                        <span className="px-1">|</span>
                        <span className="fw-bold" style={{ fontSize: "10px" }}>
                          <span className="me-2">
                            <i className="fas fa-plane-arrival"></i>
                          </span>

                          <span>
                            {destinationCode4[0]} (
                            {airports
                              .filter((f) => f.iata === destinationCode4[0])
                              .map((item) => item.city)}
                            )
                          </span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {searchData.origin5 !== "" &&
                  searchData.origin5 !== undefined ? (
                    <>
                      <div className="p-2 border">
                        <span className="fw-bold" style={{ fontSize: "10px" }}>
                          <span className="me-2">
                            <i className="fas fa-plane-departure"></i>
                          </span>{" "}
                          <span>
                            {originCode5[0]} (
                            {airports
                              .filter((f) => f.iata === originCode5[0])
                              .map((item) => item.city)}
                            )
                          </span>
                        </span>
                        <span className="px-1">|</span>
                        <span className="fw-bold" style={{ fontSize: "10px" }}>
                          <span className="me-2">
                            <i className="fas fa-plane-arrival"></i>
                          </span>

                          <span>
                            {destinationCode5[0]} (
                            {airports
                              .filter((f) => f.iata === destinationCode5[0])
                              .map((item) => item.city)}
                            )
                          </span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="col-lg-3 py-3 my-auto border-right bg-white">
                <span
                  className="fw-bold mx-1 border p-2"
                  style={{ fontSize: "10px" }}
                >
                  {searchData.travelClass}
                </span>
                <span
                  className="fw-bold border p-2 mx-1"
                  style={{ fontSize: "10px" }}
                >
                  {searchData.qtyList.Adult > 0
                    ? " Adult : " + searchData.qtyList.Adult
                    : " "}{" "}
                  {searchData.qtyList.Children > 0
                    ? "Child : " + searchData.qtyList.Children
                    : " "}{" "}
                  {searchData.qtyList.Infant > 0
                    ? "Infant : " + searchData.qtyList.Infant
                    : " "}
                </span>
              </div>
              <div className="col-lg-2 my-auto d-flex justify-content-center bg-white">
                <button
                  className="btn button-color my-2 text-white float-start fw-bold search-again d-flex align-items-center border-radius"
                  id="search-again"
                  onClick={() => setModifySearch(!modifySearch)}
                >
                  Modify search{" "}
                  {modifySearch ? (
                    <MdOutlineArrowDropUp />
                  ) : (
                    <MdOutlineArrowDropDown />
                  )}
                </button>
              </div>
            </div>
            <div className="slide-toggle mb-3">
              <div className="container">
                <form onSubmit={handleSearchFlight}>
                  <div className="row">
                    <div className="col-lg-12 col-sm-12 col-md-12 banner-text shadow-for-search">
                      <Box
                        id="form-bg"
                        boxShadow="lg"
                        borderRadius="8px"
                        border="1px solid lightgray"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        }}
                      >
                        <div className="row">
                          <div className="d-flex justify-content-between flex-wrap">
                            <div>
                              <div
                                className={`${
                                  tripType === "One Way"
                                    ? "button-color"
                                    : "tripType_bg_color "
                                } form-check form-check-inline p-2 me-1 border-radius`}
                              >
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="inlineRadioOptions"
                                  id="inlineRadio1"
                                  value="One Way"
                                  onClick={() => handleTripType("One Way")}
                                  checked={tripType === "One Way" && true}
                                />
                                <label
                                  className="form-check-label text-white"
                                  for="inlineRadio1"
                                >
                                  One Way
                                </label>
                              </div>
                              <div
                                className={`${
                                  tripType === "Round Trip"
                                    ? "button-color"
                                    : "tripType_bg_color "
                                } form-check form-check-inline p-2 me-1 border-radius`}
                              >
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="inlineRadioOptions"
                                  id="inlineRadio2"
                                  value="Round Trip"
                                  onClick={() => handleTripType("Round Trip")}
                                  checked={tripType === "Round Trip" && true}
                                />
                                <label
                                  className="form-check-label text-white"
                                  for="inlineRadio2"
                                >
                                  Round Trip
                                </label>
                              </div>
                              <div
                                className={`${
                                  tripType === "Multi City"
                                    ? "button-color"
                                    : "tripType_bg_color "
                                } form-check form-check-inline p-2 border-radius`}
                              >
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="inlineRadioOptions"
                                  id="inlineRadio3"
                                  value="Multi City"
                                  onClick={() => handleTripType("Multi City")}
                                  checked={tripType === "Multi City" && true}
                                />
                                <label
                                  className="form-check-label text-white"
                                  for="inlineRadio3"
                                >
                                  Multi City
                                </label>
                              </div>
                            </div>
                            <div>
                              <div className="d-flex gap-2">
                                <div className="d-flex align-self-center passenger">
                                  <div className="d-flex ageselectpadnotx align-items-center inputgroup">
                                    <div style={{ position: "relative" }}>
                                      <button
                                        className="p-2 inputgroup tripType_bg_color text-white border-radius"
                                        type="button"
                                        id="dropdownMenuButtonpassenger"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        data-bs-auto-close="outside"
                                        style={{
                                          height: "auto",
                                        }}
                                      >
                                        <Text
                                          className="d-flex align-items-center"
                                          fontSize={{
                                            base: "12px",
                                            sm: "12px",
                                            md: "15px",
                                            lg: "15px",
                                          }}
                                        >
                                          <Text className="px-1" id="valPerson">
                                            {adultCount +
                                              childCount +
                                              infantCount}{" "}
                                            Traveller{" "}
                                            <i
                                              className="fa fa-angle-down ps-1"
                                              aria-hidden="true"
                                            ></i>
                                          </Text>
                                        </Text>
                                      </button>
                                      <div
                                        id="passengerBlock"
                                        className="dropdown-menu passenger-pack"
                                        aria-labelledby="dropdownMenuButtonpassenger"
                                        style={{
                                          backgroundColor: "#F7FBFC",
                                        }}
                                      >
                                        <div>
                                          <div className="d-flex justify-content-between mb-3">
                                            <div style={{ fontSize: "18px" }}>
                                              <i
                                                className="fas fa-male align-self-center d-none"
                                                style={{ color: "#222" }}
                                                aria-hidden="true"
                                              ></i>
                                              Adult
                                            </div>
                                            <div className="number-input text-center">
                                              <button
                                                className="round-btn"
                                                onClick={
                                                  infantCount > 0 &&
                                                  adultCount === infantCount
                                                    ? () => {
                                                        setAdultCount(
                                                          adultCount - 1
                                                        );
                                                        setInfantCount(
                                                          infantCount - 1
                                                        );
                                                      }
                                                    : () =>
                                                        setAdultCount(
                                                          adultCount - 1
                                                        )
                                                }
                                                disabled={
                                                  adultCount === 1
                                                    ? true
                                                    : false
                                                }
                                              >
                                                <span className="text-white">
                                                  <i className="fas fa-minus"></i>
                                                </span>
                                              </button>
                                              <input
                                                readOnly
                                                value={adultCount}
                                                type="text"
                                                style={{
                                                  width: "30px",
                                                  height: "30px",
                                                  backgroundColor: "#F7FBFC",
                                                }}
                                              />
                                              <button
                                                className="round-btn"
                                                onClick={() =>
                                                  setAdultCount(adultCount + 1)
                                                }
                                                disabled={
                                                  totalPassenger === 9
                                                    ? true
                                                    : false
                                                }
                                              >
                                                <span className="text-white">
                                                  <i className="fas fa-plus"></i>
                                                </span>
                                              </button>
                                            </div>
                                          </div>
                                          {fareType === "Regular" && (
                                            <>
                                              <div className="d-flex justify-content-between mb-3">
                                                <div>
                                                  <div
                                                    style={{
                                                      fontSize: "18px",
                                                    }}
                                                  >
                                                    <i
                                                      className="fas fa-child align-self-center d-none"
                                                      style={{
                                                        color: "#222",
                                                      }}
                                                      aria-hidden="true"
                                                    ></i>
                                                    Children
                                                  </div>
                                                  <div className="adult">
                                                    Aged 2-11
                                                  </div>
                                                </div>
                                                <div className="number-input text-center">
                                                  <button
                                                    className="round-btn"
                                                    onClick={() =>
                                                      clickOnDelete(childCount)
                                                    }
                                                    disabled={
                                                      childCount === 0
                                                        ? true
                                                        : false
                                                    }
                                                  >
                                                    <span className="text-white">
                                                      <i className="fas fa-minus"></i>
                                                    </span>
                                                  </button>
                                                  <input
                                                    readOnly
                                                    value={childCount}
                                                    type="text"
                                                    style={{
                                                      width: "30px",
                                                      height: "30px",
                                                      backgroundColor:
                                                        "#F7FBFC",
                                                    }}
                                                  />
                                                  <button
                                                    className="round-btn"
                                                    onClick={() =>
                                                      addNewChild(childCount)
                                                    }
                                                    disabled={
                                                      totalPassenger === 9
                                                        ? true
                                                        : false
                                                    }
                                                  >
                                                    <span className="text-white">
                                                      <i className="fas fa-plus"></i>
                                                    </span>
                                                  </button>
                                                </div>
                                              </div>
                                              <div className="d-flex flex-wrap">
                                                {childAge.map((val, index) => {
                                                  let agenum = `age-${index}`;
                                                  return (
                                                    <span className="px-1">
                                                      <Text
                                                        fontSize="sm"
                                                        mt="2px"
                                                      >
                                                        Child {index + 1}
                                                      </Text>
                                                      <select
                                                        name="age"
                                                        style={{
                                                          width: "60px",
                                                          backgroundColor:
                                                            "#F7FBFC",
                                                          borderRadius: "5px",
                                                          height: "36px",
                                                          paddingLeft: "8px",
                                                          border:
                                                            "1px solid #ced4da",
                                                        }}
                                                        defaultValue={val.age}
                                                        min={2}
                                                        max={11}
                                                        onChange={(e) =>
                                                          handleChildAge(
                                                            e,
                                                            index
                                                          )
                                                        }
                                                      >
                                                        <option> </option>
                                                        {childrenAges.map(
                                                          (item) => (
                                                            <option
                                                              value={item}
                                                            >
                                                              {item}
                                                            </option>
                                                          )
                                                        )}
                                                      </select>

                                                      <Text
                                                        fontSize="xs"
                                                        mt="2px"
                                                      >
                                                        (Age)
                                                      </Text>
                                                    </span>
                                                  );
                                                })}
                                              </div>
                                              <div className="d-flex justify-content-between mb-3">
                                                <div>
                                                  <div
                                                    style={{
                                                      fontSize: "18px",
                                                    }}
                                                  >
                                                    <i
                                                      className="fas fa-baby align-self-center d-none"
                                                      style={{
                                                        color: "#222",
                                                      }}
                                                      aria-hidden="true"
                                                    ></i>
                                                    Infants
                                                  </div>
                                                </div>
                                                <div className="number-input text-center">
                                                  <button
                                                    className="round-btn"
                                                    onClick={() =>
                                                      setInfantCount(
                                                        infantCount - 1
                                                      )
                                                    }
                                                    disabled={
                                                      infantCount === 0
                                                        ? true
                                                        : false
                                                    }
                                                  >
                                                    <span className="text-white">
                                                      <i className="fas fa-minus"></i>
                                                    </span>
                                                  </button>
                                                  <input
                                                    readOnly
                                                    value={infantCount}
                                                    type="text"
                                                    style={{
                                                      width: "30px",
                                                      height: "30px",
                                                      backgroundColor:
                                                        "#F7FBFC",
                                                    }}
                                                  />
                                                  <button
                                                    className="round-btn"
                                                    onClick={
                                                      infantCount < adultCount
                                                        ? () =>
                                                            setInfantCount(
                                                              infantCount + 1
                                                            )
                                                        : () => {}
                                                    }
                                                    disabled={
                                                      infantCount === 9
                                                        ? true
                                                        : false
                                                    }
                                                  >
                                                    <span className="text-white">
                                                      <i className="fas fa-plus"></i>
                                                    </span>
                                                  </button>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                        <div style={{ textAlign: "end" }}></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <button
                                    className="p-2 inputgroup tripType_bg_color text-white border-radius"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <Text
                                      id="valClass"
                                      fontSize={{
                                        base: "12px",
                                        sm: "12px",
                                        md: "15px",
                                        lg: "15px",
                                      }}
                                    >
                                      {travelClassType}{" "}
                                      <i
                                        className="fa fa-angle-down ps-1"
                                        aria-hidden="true"
                                      ></i>
                                    </Text>
                                  </button>
                                  <ul
                                    id="classList"
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton"
                                    style={{
                                      backgroundColor: "#F7FBFC",
                                    }}
                                  >
                                    <li
                                      className="dropdown-item dropdown-item-selected"
                                      onClick={() =>
                                        setTravelClassType("Economy")
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      Economy
                                    </li>
                                    <li
                                      className="dropdown-item dropdown-item-selected"
                                      onClick={() =>
                                        setTravelClassType("Premium Economy")
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      Premium Economy
                                    </li>
                                    <li
                                      className="dropdown-item"
                                      onClick={() =>
                                        setTravelClassType("Business")
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      Business
                                    </li>
                                    <li
                                      className="dropdown-item"
                                      onClick={() =>
                                        setTravelClassType("First")
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      First
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end text-right">
                            <div style={{ width: "200px" }}>
                              <label
                                htmlFor="formGroupExampleInput"
                                className="form-label"
                              >
                                Preferred Airline
                              </label>
                              <input
                                type="text"
                                className="form-control border-radius"
                                placeholder="e.g. BS, BG, TK"
                                defaultValue={preAirlines}
                                autoComplete="off"
                                style={{
                                  background: "#F7FBFC",
                                }}
                                onChange={handleChange}
                                onKeyDown={preAirlinesValidate}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row pt-1 position-relative">
                          <div className="col-lg-4 forms">
                            <label
                              htmlFor="formGroupExampleInput"
                              className="form-label"
                            >
                              Depart From{" "}
                              <span className="fw-bold text-danger">*</span>
                            </label>
                            <span className="address">
                              <input
                                type="text"
                                className="form-control input-field autocomplete border-radius"
                                ref={originRef}
                                onClick={() => {
                                  setDepartValue({
                                    ...departValue,
                                    one: originRef.current.value
                                      ? originRef.current.value
                                      : departValue.one,
                                  });
                                  originRef.current.value = "";
                                }}
                                onBlur={() => {
                                  if (
                                    departValue.one &&
                                    originRef.current.value === ""
                                  ) {
                                    originRef.current.value = departValue.one;
                                  }
                                }}
                                placeholder="From"
                                required
                                autoComplete="off"
                                id="txtFrom"
                                style={{
                                  background: "#F7FBFC",
                                }}
                              />
                            </span>
                          </div>
                          <div className="swap d-none d-lg-block">
                            <label className="swap">
                              <span
                                className="text-danger fw-bold icon"
                                onClick={() => handleSwap(0)}
                              >
                                <i className="fas fa-exchange-alt fa-1x"></i>
                              </span>
                            </label>
                          </div>
                          <div className="col-lg-4 forms">
                            <label
                              htmlFor="formGroupExampleInput"
                              className="form-label"
                            >
                              Going To{" "}
                              <span className="fw-bold text-danger">*</span>
                            </label>
                            <span className="address">
                              <input
                                type="text"
                                className="form-control input-field autocomplete border-radius"
                                ref={destinationRef}
                                onClick={() => {
                                  setReturnValue({
                                    ...returnValue,
                                    one: destinationRef.current.value
                                      ? destinationRef.current.value
                                      : returnValue.one,
                                  });
                                  destinationRef.current.value = "";
                                }}
                                onBlur={() => {
                                  if (
                                    returnValue.one &&
                                    destinationRef.current.value === ""
                                  ) {
                                    destinationRef.current.value =
                                      returnValue.one;
                                  }
                                }}
                                placeholder="To"
                                required
                                id="txtTo"
                                autoComplete="off"
                                style={{
                                  background: "#F7FBFC",
                                }}
                              />
                            </span>
                          </div>
                          <div className="col-lg-4">
                            <div className="row">
                              <div
                                className={
                                  tripType === "Round Trip"
                                    ? "col-lg-6 pe-0"
                                    : "col-lg-12"
                                }
                              >
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="form-label"
                                >
                                  Departing{" "}
                                  <span className="fw-bold text-danger">*</span>
                                </label>
                                <InputOneWayDate
                                  date={range.startDate}
                                  minDate={new Date()}
                                  setDate={(res) => {
                                    setRange((oldData) => ({
                                      ...oldData,
                                      startDate: res,
                                      endDate: oldData.endDate,
                                    }));
                                    setCurrentDateDepart(res);
                                    setApiCall(false);
                                  }}
                                />
                              </div>
                              {tripType === "Round Trip" ? (
                                <>
                                  <div
                                    className="col-lg-6 ps-0"
                                    id="returnLavel"
                                  >
                                    <label htmlFor="formGroupExampleInput">
                                      Returning{" "}
                                      <span className="fw-bold text-danger">
                                        *
                                      </span>
                                    </label>
                                    <InputOneWayDate
                                      date={range.endDate}
                                      minDate={range.startDate}
                                      setDate={(res) => {
                                        setRange((oldData) => ({
                                          ...oldData,
                                          startDate: oldData.startDate,
                                          endDate: res,
                                        }));
                                        setCurrentDateReturn(res);
                                        setApiCall(false);
                                      }}
                                    />
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </div>
                        {tripType === "Multi City" ? (
                          <>
                            <div
                              className="row pt-1 position-relative"
                              id="multiCity1"
                            >
                              <div className="col-lg-4 forms">
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="form-label"
                                >
                                  Depart From{" "}
                                  <span className="fw-bold text-danger">*</span>
                                </label>
                                <span className="address">
                                  <input
                                    type="text"
                                    className="form-control input-field autocomplete border-radius"
                                    ref={originRef1}
                                    onClick={() => {
                                      setDepartValue({
                                        ...departValue,
                                        two: originRef1.current.value
                                          ? originRef1.current.value
                                          : departValue.two,
                                      });
                                      originRef1.current.value = "";
                                    }}
                                    onBlur={() => {
                                      if (
                                        departValue.two &&
                                        originRef1.current.value === ""
                                      ) {
                                        originRef1.current.value =
                                          departValue.two;
                                      }
                                    }}
                                    placeholder="From"
                                    autoComplete="off"
                                    id="txtFrom1"
                                    required
                                    style={{
                                      background: "#F7FBFC",
                                    }}
                                  />
                                </span>
                              </div>
                              <div className="swap d-none d-lg-block">
                                <label className="swap">
                                  <span
                                    className="text-danger fw-bold icon"
                                    onClick={() => handleSwap(1)}
                                  >
                                    <i className="fas fa-exchange-alt fa-1x"></i>
                                  </span>
                                </label>
                              </div>
                              <div className="col-lg-4 forms">
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="form-label"
                                >
                                  Going To{" "}
                                  <span className="fw-bold text-danger">*</span>
                                </label>
                                <span className="address">
                                  <input
                                    type="text"
                                    className="form-control input-field autocomplete border-radius"
                                    ref={destinationRef1}
                                    onClick={() => {
                                      setReturnValue({
                                        ...returnValue,
                                        two: destinationRef1.current.value
                                          ? destinationRef1.current.value
                                          : returnValue.two,
                                      });
                                      destinationRef1.current.value = "";
                                    }}
                                    onBlur={() => {
                                      if (
                                        returnValue.two &&
                                        destinationRef1.current.value === ""
                                      ) {
                                        destinationRef1.current.value =
                                          returnValue.two;
                                      }
                                    }}
                                    placeholder="To"
                                    id="txtTo1"
                                    autoComplete="off"
                                    required
                                    style={{
                                      background: "#F7FBFC",
                                    }}
                                  />
                                </span>
                              </div>
                              <div className="col-lg-4">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <label
                                      htmlFor="formGroupExampleInput"
                                      className="form-label"
                                    >
                                      Departing{" "}
                                      <span className="fw-bold text-danger">
                                        *
                                      </span>
                                    </label>
                                    <InputOneWayDate
                                      date={range.startDateMultiOne}
                                      minDate={range.startDate}
                                      setDate={(res) => {
                                        setRange((oldData) => ({
                                          ...oldData,
                                          startDateMultiOne: res,
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="row pt-1 position-relative"
                              id="multiCity2"
                              style={{ display: "none" }}
                            >
                              <div className="col-lg-4">
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="form-label"
                                >
                                  Depart From{" "}
                                  <span className="fw-bold text-danger">*</span>
                                </label>
                                <span className="address">
                                  <input
                                    type="text"
                                    className="form-control input-field autocomplete border-radius"
                                    ref={originRef2}
                                    onClick={() => {
                                      setDepartValue({
                                        ...departValue,
                                        three: originRef2.current.value
                                          ? originRef2.current.value
                                          : departValue.three,
                                      });
                                      originRef2.current.value = "";
                                    }}
                                    onBlur={() => {
                                      if (
                                        departValue.three &&
                                        originRef2.current.value === ""
                                      ) {
                                        originRef2.current.value =
                                          departValue.three;
                                      }
                                    }}
                                    placeholder="From"
                                    autoComplete="off"
                                    id="txtFrom2"
                                    style={{
                                      background: "#F7FBFC",
                                    }}
                                  />
                                </span>
                              </div>
                              <div className="swap d-none d-lg-block">
                                <label className="swap">
                                  <span
                                    className="text-danger fw-bold icon"
                                    onClick={() => handleSwap(2)}
                                  >
                                    <i className="fas fa-exchange-alt fa-1x"></i>
                                  </span>
                                </label>
                              </div>
                              <div className="col-lg-4 forms">
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="form-label"
                                >
                                  Going To{" "}
                                  <span className="fw-bold text-danger">*</span>
                                </label>
                                <span className="address">
                                  <input
                                    type="text"
                                    className="form-control input-field autocomplete border-radius"
                                    ref={destinationRef2}
                                    onClick={() => {
                                      setReturnValue({
                                        ...returnValue,
                                        three: destinationRef2.current.value
                                          ? destinationRef2.current.value
                                          : returnValue.three,
                                      });
                                      destinationRef2.current.value = "";
                                    }}
                                    onBlur={() => {
                                      if (
                                        returnValue.three &&
                                        destinationRef2.current.value === ""
                                      ) {
                                        destinationRef2.current.value =
                                          returnValue.three;
                                      }
                                    }}
                                    placeholder="To"
                                    id="txtTo2"
                                    autoComplete="off"
                                    style={{
                                      background: "#F7FBFC",
                                    }}
                                  />
                                </span>
                              </div>
                              <div className="col-lg-4">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <label
                                      htmlFor="formGroupExampleInput"
                                      className="form-label"
                                    >
                                      Departing{" "}
                                      <span className="fw-bold text-danger">
                                        *
                                      </span>
                                    </label>
                                    <InputOneWayDate
                                      date={range.startDateMultiTwo}
                                      minDate={range.startDateMultiOne}
                                      setDate={(res) => {
                                        setRange((oldData) => ({
                                          ...oldData,
                                          startDateMultiTwo: res,
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="row pt-1 position-relative"
                              id="multiCity3"
                              style={{ display: "none" }}
                            >
                              <div className="col-lg-4 forms">
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="form-label"
                                >
                                  Depart From{" "}
                                  <span className="fw-bold text-danger">*</span>
                                </label>
                                <span className="address">
                                  <input
                                    type="text"
                                    className="form-control input-field autocomplete border-radius"
                                    ref={originRef3}
                                    onClick={() => {
                                      setDepartValue({
                                        ...departValue,
                                        four: originRef3.current.value
                                          ? originRef3.current.value
                                          : departValue.four,
                                      });
                                      originRef3.current.value = "";
                                    }}
                                    onBlur={() => {
                                      if (
                                        departValue.four &&
                                        originRef3.current.value === ""
                                      ) {
                                        originRef3.current.value =
                                          departValue.four;
                                      }
                                    }}
                                    placeholder="From"
                                    autoComplete="off"
                                    id="txtFrom3"
                                    style={{
                                      background: "#F7FBFC",
                                    }}
                                  />
                                </span>
                              </div>
                              <div className="swap d-none d-lg-block">
                                <label className="swap">
                                  <span
                                    className="text-danger fw-bold icon"
                                    onClick={() => handleSwap(3)}
                                  >
                                    <i className="fas fa-exchange-alt fa-1x"></i>
                                  </span>
                                </label>
                              </div>
                              <div className="col-lg-4 forms">
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="form-label"
                                >
                                  Going To{" "}
                                  <span className="fw-bold text-danger">*</span>
                                </label>
                                <span className="address">
                                  <input
                                    type="text"
                                    className="form-control input-field autocomplete border-radius"
                                    ref={destinationRef3}
                                    onClick={() => {
                                      setReturnValue({
                                        ...returnValue,
                                        four: destinationRef3.current.value
                                          ? destinationRef3.current.value
                                          : returnValue.four,
                                      });
                                      destinationRef3.current.value = "";
                                    }}
                                    onBlur={() => {
                                      if (
                                        returnValue.four &&
                                        destinationRef3.current.value === ""
                                      ) {
                                        destinationRef3.current.value =
                                          returnValue.four;
                                      }
                                    }}
                                    placeholder="To"
                                    id="txtTo3"
                                    autoComplete="off"
                                    style={{
                                      background: "#F7FBFC",
                                    }}
                                  />
                                </span>
                              </div>
                              <div className="col-lg-4">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <label
                                      htmlFor="formGroupExampleInput"
                                      className="form-label"
                                    >
                                      Departing{" "}
                                      <span className="text-danger fw-bold">
                                        *
                                      </span>
                                    </label>
                                    <InputOneWayDate
                                      date={range.startDateMultiThree}
                                      minDate={range.startDateMultiTwo}
                                      setDate={(res) => {
                                        setRange((oldData) => ({
                                          ...oldData,
                                          startDateMultiThree: res,
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="row pt-1 position-relative"
                              id="multiCity4"
                              style={{ display: "none" }}
                            >
                              <div className="col-lg-4">
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="form-label"
                                >
                                  Depart From{" "}
                                  <span className="fw-bold text-danger">*</span>
                                </label>
                                <span className="address">
                                  <input
                                    type="text"
                                    className="form-control input-field autocomplete border-radius"
                                    ref={originRef4}
                                    onClick={() => {
                                      setDepartValue({
                                        ...departValue,
                                        five: originRef4.current.value
                                          ? originRef4.current.value
                                          : departValue.five,
                                      });
                                      originRef4.current.value = "";
                                    }}
                                    onBlur={() => {
                                      if (
                                        departValue.five &&
                                        originRef4.current.value === ""
                                      ) {
                                        originRef4.current.value =
                                          departValue.five;
                                      }
                                    }}
                                    placeholder="From"
                                    autoComplete="off"
                                    id="txtFrom4"
                                    style={{
                                      background: "#F7FBFC",
                                    }}
                                  />
                                </span>
                              </div>
                              <div className="swap d-none d-lg-block">
                                <label className="swap">
                                  <span
                                    className="text-danger fw-bold icon"
                                    onClick={() => handleSwap(4)}
                                  >
                                    <i className="fas fa-exchange-alt fa-1x"></i>
                                  </span>
                                </label>
                              </div>
                              <div className="col-lg-4 forms">
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="form-label"
                                >
                                  Going To{" "}
                                  <span className="fw-bold text-danger">*</span>
                                </label>
                                <span className="address">
                                  <input
                                    type="text"
                                    className="form-control input-field autocomplete border-radius"
                                    ref={destinationRef4}
                                    onClick={() => {
                                      setReturnValue({
                                        ...returnValue,
                                        five: destinationRef4.current.value
                                          ? destinationRef4.current.value
                                          : returnValue.five,
                                      });
                                      destinationRef4.current.value = "";
                                    }}
                                    onBlur={() => {
                                      if (
                                        returnValue.five &&
                                        destinationRef4.current.value === ""
                                      ) {
                                        destinationRef4.current.value =
                                          returnValue.five;
                                      }
                                    }}
                                    placeholder="To"
                                    id="txtTo4"
                                    autoComplete="off"
                                    style={{
                                      background: "#F7FBFC",
                                    }}
                                  />
                                </span>
                              </div>
                              <div className="col-lg-4">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <label
                                      htmlFor="formGroupExampleInput"
                                      className="form-label"
                                    >
                                      Departing{" "}
                                      <span className="fw-bold text-danger">
                                        *
                                      </span>
                                    </label>
                                    <InputOneWayDate
                                      date={range.startDateMultiFour}
                                      minDate={range.startDateMultiThree}
                                      setDate={(res) => {
                                        setRange((oldData) => ({
                                          ...oldData,
                                          startDateMultiFour: res,
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="row pt-1 position-relative"
                              id="multiCity5"
                              style={{ display: "none" }}
                            >
                              <div className="col-lg-4 forms">
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="form-label"
                                >
                                  Depart From{" "}
                                  <span className="fw-bold text-danger">*</span>
                                </label>
                                <span className="address">
                                  <input
                                    type="text"
                                    className="form-control input-field autocomplete border-radius"
                                    ref={originRef5}
                                    onClick={() => {
                                      setDepartValue({
                                        ...departValue,
                                        six: originRef5.current.value
                                          ? originRef5.current.value
                                          : departValue.six,
                                      });
                                      originRef5.current.value = "";
                                    }}
                                    onBlur={() => {
                                      if (
                                        departValue.six &&
                                        originRef5.current.value === ""
                                      ) {
                                        originRef5.current.value =
                                          departValue.six;
                                      }
                                    }}
                                    placeholder="From"
                                    autoComplete="off"
                                    id="txtFrom5"
                                    style={{
                                      background: "#F7FBFC",
                                    }}
                                  />
                                </span>
                              </div>
                              <div className="swap d-none d-lg-block">
                                <label className="swap">
                                  <span
                                    className="text-danger fw-bold icon"
                                    onClick={() => handleSwap(5)}
                                  >
                                    <i className="fas fa-exchange-alt fa-1x"></i>
                                  </span>
                                </label>
                              </div>
                              <div className="col-lg-4 forms">
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="form-label"
                                >
                                  Going To{" "}
                                  <span className="fw-bold text-danger">*</span>
                                </label>
                                <span className="address">
                                  <input
                                    type="text"
                                    className="form-control input-field autocomplete border-radius"
                                    ref={destinationRef5}
                                    onClick={() => {
                                      setReturnValue({
                                        ...returnValue,
                                        six: destinationRef5.current.value
                                          ? destinationRef5.current.value
                                          : returnValue.six,
                                      });
                                      destinationRef5.current.value = "";
                                    }}
                                    onBlur={() => {
                                      if (
                                        returnValue.six &&
                                        destinationRef5.current.value === ""
                                      ) {
                                        destinationRef5.current.value =
                                          returnValue.six;
                                      }
                                    }}
                                    placeholder="To"
                                    id="txtTo5"
                                    autoComplete="off"
                                    style={{
                                      background: "#F7FBFC",
                                    }}
                                  />
                                </span>
                              </div>
                              <div className="col-lg-4">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <label
                                      htmlFor="formGroupExampleInput"
                                      className="form-label"
                                    >
                                      Departing{" "}
                                      <span className="fw-bold text-danger">
                                        *
                                      </span>
                                    </label>
                                    <InputOneWayDate
                                      date={range.startDateMultiFive}
                                      minDate={range.startDateMultiFour}
                                      setDate={(res) => {
                                        setRange((oldData) => ({
                                          ...oldData,
                                          startDateMultiFive: res,
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="my-2 d-flex justify-content-center">
                              <button
                                type="button"
                                className="btn button-color rounded-pill text-white"
                                id="btnp-1"
                                onClick={() => handleFlightOptionP()}
                                style={{ backgroundColor: "#ed7f22" }}
                              >
                                Add more
                              </button>
                              &nbsp;
                              <button
                                type="button"
                                className="btn button-color rounded-pill text-white"
                                id="btnm-1"
                                style={{ display: "none" }}
                                onClick={() => handleFlightOptionM()}
                              >
                                Remove
                              </button>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}

                        <div className="row">
                          <div className="col-lg-6 d-flex align-items-center justify-content-start">
                            <div className="form-check form-check-inline border-radius">
                              <input
                                className="form-check-input"
                                name="inlineFareRadioOptions"
                                id="inlineFareRadio1"
                                type="radio"
                                style={{
                                  border: "2px solid #068b9f",
                                  transition: "all 0.3s ease",
                                }}
                                value="Regular"
                                onClick={() => setFareType("Regular")}
                                checked={fareType === "Regular" && true}
                              />
                              <label
                                className="form-check-label fw-bold"
                                for="inlineFareRadio1"
                                style={{
                                  color:
                                    fareType === "Regular"
                                      ? "#7c04c0"
                                      : "#1a202c",
                                }}
                              >
                                Regular Fare
                              </label>
                            </div>
                            <div className="form-check form-check-inline border-radius">
                              <input
                                className="form-check-input"
                                name="inlineFareRadioOptions"
                                id="inlineFareRadio2"
                                type="radio"
                                style={{
                                  border: "2px solid #068b9f",
                                  transition: "all 0.3s ease",
                                }}
                                value="Student"
                                onClick={() => {
                                  setFareType("Student");
                                  setChildCount(0);
                                  setChildAge([]);
                                  setInfantCount(0);
                                }}
                                checked={fareType === "Student" && true}
                              />
                              <label
                                className="form-check-label fw-bold"
                                for="inlineFareRadio2"
                                style={{
                                  color:
                                    fareType === "Student"
                                      ? "#7c04c0"
                                      : "#1a202c",
                                }}
                              >
                                Student Fare
                              </label>
                            </div>
                            {tripType === "Round Trip" && (
                              <div className="form-check form-check-inline border-radius">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="combofare"
                                  checked={comboFareClick && true}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setComboFareClick(true);
                                    } else {
                                      setComboFareClick(false);
                                    }
                                  }}
                                />
                                <label
                                  className="form-check-label fw-bold"
                                  for="combofare"
                                >
                                  Combo Fare (Domestic only)
                                </label>
                              </div>
                            )}
                          </div>
                          <div className="col-lg-6">
                            <div className="d-flex justify-content-end">
                              <button
                                className="btn text-white mt-3 text-center fw-bold border-radius"
                                style={{
                                  backgroundColor: "#7c04c0",
                                }}
                                disabled={progressTime ? true : false}
                              >
                                Search Flight
                              </button>
                            </div>
                          </div>
                        </div>
                      </Box>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>{" "}
          {/* <Loading loading={loading}></Loading> */}
          <div style={{ minHeight: "600px" }}>
            {checkResForCombo === true ? (
              <>
                {fetchFlighDeparture.airSearchResponses.length > 0 &&
                fetchFlighReturn.airSearchResponses.length > 0 ? (
                  loading ? (
                    <Loading
                      flag={0}
                      loading={loading}
                      originCode={originCode}
                      destinationCode={destinationCode}
                      originCode1={originCode1}
                      destinationCode1={destinationCode1}
                      originCode2={originCode2}
                      destinationCode2={destinationCode2}
                      originCode3={originCode3}
                      destinationCode3={destinationCode3}
                      originCode4={originCode4}
                      destinationCode4={destinationCode4}
                      originCode5={originCode5}
                      destinationCode5={destinationCode5}
                      tripType={tripType}
                    ></Loading>
                  ) : (
                    <>
                      {searchData?.tripTypeModify !== "Multi City" && (
                        <div className="container box-shadow content-width">
                          <div className="row py-3">
                            {searchData?.tripTypeModify === "One Way" && (
                              <div className="col-lg-6"></div>
                            )}
                            {searchData?.tripTypeModify !== "Multi City" && (
                              <div className="col-lg-6 d-flex flex-wrap gap-2 justify-content-end align-items-center">
                                <p className="fw-bold button-color p-2 text-white border-radius">
                                  Departure :{" "}
                                </p>
                                <button
                                  className="btn button-color text-white d-flex gap-2 align-items-center border-radius"
                                  disabled={
                                    moment(currentDateDepart).format(
                                      "DD-MMMM-YYYY"
                                    ) === moment().format("DD-MMMM-YYYY")
                                      ? true
                                      : progressTime
                                      ? true
                                      : false
                                  }
                                  onClick={() => handleDepartPreviousDay()}
                                >
                                  {" "}
                                  <FaRegArrowAltCircleLeft /> Previous
                                </button>
                                <p className="border px-2 py-1 border-radius">
                                  {moment(currentDateDepart).format(
                                    "DD-MMMM-YYYY"
                                  )}
                                </p>
                                <button
                                  className="btn button-color text-white d-flex gap-2 align-items-center border-radius"
                                  disabled={
                                    tripType === "One Way"
                                      ? progressTime
                                        ? true
                                        : false
                                      : moment(currentDateDepart).format(
                                          "DD-MMMM-YYYY"
                                        ) ===
                                        moment(currentDateReturn).format(
                                          "DD-MMMM-YYYY"
                                        )
                                      ? true
                                      : progressTime
                                      ? true
                                      : false
                                  }
                                  onClick={() => handleDepartNextDay()}
                                >
                                  Next <FaRegArrowAltCircleRight />
                                </button>
                              </div>
                            )}

                            {searchData?.tripTypeModify === "Round Trip" && (
                              <div className="col-lg-6 d-flex flex-wrap gap-2 justify-content-end align-items-center">
                                <p className="fw-bold button-color p-2 text-white border-radius">
                                  Return :{" "}
                                </p>
                                <button
                                  className="btn button-color text-white d-flex gap-2 align-items-center border-radius"
                                  disabled={
                                    moment(currentDateDepart).format(
                                      "DD-MMMM-YYYY"
                                    ) ===
                                    moment(currentDateReturn).format(
                                      "DD-MMMM-YYYY"
                                    )
                                      ? true
                                      : progressTime
                                      ? true
                                      : false
                                  }
                                  onClick={() => handleReturnPreviousDay()}
                                >
                                  {" "}
                                  <FaRegArrowAltCircleLeft /> Previous
                                </button>
                                <p className="border px-2 py-1 border-radius">
                                  {moment(currentDateReturn).format(
                                    "DD-MMMM-YYYY"
                                  )}
                                </p>
                                <button
                                  className="btn button-color text-white d-flex gap-2 align-items-center border-radius"
                                  onClick={() => handleReturnNextDay()}
                                  disabled={progressTime ? true : false}
                                >
                                  Next <FaRegArrowAltCircleRight />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <ShowAllFlightComboFare
                        progressTime={progressTime}
                        fetchFlighData={fetchFlighData}
                        originCode={originCode}
                        loading={loading}
                        destinationCode={destinationCode}
                        tripType={searchData?.tripTypeModify}
                        checkList={checkList}
                        fareType={fareType}
                        fetchFlighDeparture={fetchFlighDeparture}
                        fetchFlighReturn={fetchFlighReturn}
                      ></ShowAllFlightComboFare>
                    </>
                  )
                ) : loading ? (
                  <Loading
                    flag={0}
                    loading={loading}
                    originCode={originCode}
                    destinationCode={destinationCode}
                    originCode1={originCode1}
                    destinationCode1={destinationCode1}
                    originCode2={originCode2}
                    destinationCode2={destinationCode2}
                    originCode3={originCode3}
                    destinationCode3={destinationCode3}
                    originCode4={originCode4}
                    destinationCode4={destinationCode4}
                    originCode5={originCode5}
                    destinationCode5={destinationCode5}
                    tripType={tripType}
                  ></Loading>
                ) : (
                  <>
                    {fetchFlighData.airSearchResponses.length === 0 &&
                      !progressTime && (
                        <NoDataFoundPage loading={loading}></NoDataFoundPage>
                      )}
                  </>
                )}
              </>
            ) : (
              <>
                {fetchFlighData.airSearchResponses.length > 0 ? (
                  loading ? (
                    <Loading
                      flag={0}
                      loading={loading}
                      originCode={originCode}
                      destinationCode={destinationCode}
                      originCode1={originCode1}
                      destinationCode1={destinationCode1}
                      originCode2={originCode2}
                      destinationCode2={destinationCode2}
                      originCode3={originCode3}
                      destinationCode3={destinationCode3}
                      originCode4={originCode4}
                      destinationCode4={destinationCode4}
                      originCode5={originCode5}
                      destinationCode5={destinationCode5}
                      tripType={tripType}
                    ></Loading>
                  ) : (
                    <>
                      {searchData?.tripTypeModify !== "Multi City" && (
                        <div className="container box-shadow content-width">
                          <div className="row py-3">
                            {searchData?.tripTypeModify === "One Way" && (
                              <div className="col-lg-6"></div>
                            )}
                            {searchData?.tripTypeModify !== "Multi City" && (
                              <div className="col-lg-6 d-flex flex-wrap gap-2 justify-content-end align-items-center">
                                <p className="fw-bold button-color p-2 text-white border-radius">
                                  Departure :{" "}
                                </p>
                                <button
                                  className="btn button-color text-white d-flex gap-2 align-items-center border-radius"
                                  disabled={
                                    moment(currentDateDepart).format(
                                      "DD-MMMM-YYYY"
                                    ) === moment().format("DD-MMMM-YYYY")
                                      ? true
                                      : progressTime
                                      ? true
                                      : false
                                  }
                                  onClick={() => handleDepartPreviousDay()}
                                >
                                  {" "}
                                  <FaRegArrowAltCircleLeft /> Previous
                                </button>
                                <p className="border px-2 py-1 border-radius">
                                  {moment(currentDateDepart).format(
                                    "DD-MMMM-YYYY"
                                  )}
                                </p>
                                <button
                                  className="btn button-color text-white d-flex gap-2 align-items-center border-radius"
                                  disabled={
                                    tripType === "One Way"
                                      ? progressTime
                                        ? true
                                        : false
                                      : moment(currentDateDepart).format(
                                          "DD-MMMM-YYYY"
                                        ) ===
                                        moment(currentDateReturn).format(
                                          "DD-MMMM-YYYY"
                                        )
                                      ? true
                                      : progressTime
                                      ? true
                                      : false
                                  }
                                  onClick={() => handleDepartNextDay()}
                                >
                                  Next <FaRegArrowAltCircleRight />
                                </button>
                              </div>
                            )}

                            {searchData?.tripTypeModify === "Round Trip" && (
                              <div className="col-lg-6 d-flex flex-wrap gap-2 justify-content-end align-items-center">
                                <p className="fw-bold button-color p-2 text-white border-radius">
                                  Return :{" "}
                                </p>
                                <button
                                  className="btn button-color text-white d-flex gap-2 align-items-center border-radius"
                                  disabled={
                                    moment(currentDateDepart).format(
                                      "DD-MMMM-YYYY"
                                    ) ===
                                    moment(currentDateReturn).format(
                                      "DD-MMMM-YYYY"
                                    )
                                      ? true
                                      : progressTime
                                      ? true
                                      : false
                                  }
                                  onClick={() => handleReturnPreviousDay()}
                                >
                                  {" "}
                                  <FaRegArrowAltCircleLeft /> Previous
                                </button>
                                <p className="border px-2 py-1 border-radius">
                                  {moment(currentDateReturn).format(
                                    "DD-MMMM-YYYY"
                                  )}
                                </p>
                                <button
                                  className="btn button-color text-white d-flex gap-2 align-items-center border-radius"
                                  onClick={() => handleReturnNextDay()}
                                  disabled={progressTime ? true : false}
                                >
                                  Next <FaRegArrowAltCircleRight />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <ShowAllFlight
                        progressTime={progressTime}
                        fetchFlighData={fetchFlighData}
                        originCode={originCode}
                        loading={loading}
                        destinationCode={destinationCode}
                        tripType={tripType}
                        checkList={checkList}
                        fareType={fareType}
                      ></ShowAllFlight>
                    </>
                  )
                ) : loading ? (
                  <Loading
                    flag={0}
                    loading={loading}
                    originCode={originCode}
                    destinationCode={destinationCode}
                    originCode1={originCode1}
                    destinationCode1={destinationCode1}
                    originCode2={originCode2}
                    destinationCode2={destinationCode2}
                    originCode3={originCode3}
                    destinationCode3={destinationCode3}
                    originCode4={originCode4}
                    destinationCode4={destinationCode4}
                    originCode5={originCode5}
                    destinationCode5={destinationCode5}
                    tripType={tripType}
                  ></Loading>
                ) : (
                  <>
                    {fetchFlighData.airSearchResponses.length === 0 &&
                      !progressTime && (
                        <NoDataFoundPage loading={loading}></NoDataFoundPage>
                      )}
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ShowAllFlightPageForProgressive;