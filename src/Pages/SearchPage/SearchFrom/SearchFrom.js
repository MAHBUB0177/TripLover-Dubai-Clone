import { Box, Center, Text } from "@chakra-ui/react";
import { addDays } from "date-fns";
import Fuse from "fuse.js";
import $ from "jquery";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import airports from "../../../JSON/airports.json";
import { dayCount, preAirlinesValidate } from "../../../common/functions";
import "../../../plugins/t-datepicker/t-datepicker.min";
import { environment } from "../../SharePages/Utility/environment";
import "./SearchFrom.css";
import InputOneWayDate from "./inputOneWayDate";
import { searchLogs } from "../../../common/allApi";

const childrenAges = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
let cIndex = 1;
const SearchFrom = () => {
  const formCount = 0;
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("One Way"); //"One Way"
  const [travelClassType, setTravelClassType] = useState("Economy"); //:"Economy"
  const [sameMatchError, setSameMatchError] = useState(true);
  const [journeyDateError, setJourneyDateError] = useState(true);
  const [fareType, setFareType] = useState("Regular");
  const [adultCount, setAdultCount] = useState(1); //1
  const [childCount, setChildCount] = useState(0); //0
  let [infantCount, setInfantCount] = useState(0); //0
  const [comboFareClick, setComboFareClick] = useState(true);
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
  // const preAirlineRef = useRef();

  // let cIndex = 1;
  const handleFlightOptionP = (index) => {
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
  const handleFlightOptionM = (index) => {
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

  const [preAirlines, setPreAirlines] = useState("");

  const handleChange = (e) => {
    let text = e.target.value;
    setPreAirlines(text.toUpperCase());
  };

  useEffect(() => {}, [travelClassType]);

  const searchValue = (idx) => {
    if (searchList !== undefined) {
      if (searchList[idx].journeyType === "One Way") {
        setTripType("One Way");
      } else {
        setTripType("Round Trip");
      }
    }
    setTravelClassType(
      searchList !== undefined
        ? searchList[idx].cabinClass === 1
          ? "Economy"
          : searchList[idx].cabinClass === 3
          ? "Business"
          : " "
        : "Economy"
    );
    setAdultCount(searchList !== undefined ? searchList[idx].adults : 1);
    setChildCount(searchList !== undefined ? searchList[idx].childs : 0);
    setInfantCount(searchList !== undefined ? searchList[idx].infants : 0);
    const origin = airports.filter(
      (item) => item.iata === searchList[idx].routes[0].origin
    );
    $("#txtFrom").val(
      searchList !== undefined
        ? origin[0].city + " - " + origin[0].country + ", " + origin[0].name
        : originRef.current.value
    );

    const destination = airports.filter(
      (item) => item.iata === searchList[idx].routes[0].destination
    );
    $("#txtTo").val(
      searchList !== undefined
        ? destination[0].city +
            " - " +
            destination[0].country +
            ", " +
            destination[0].name
        : destinationRef.current.value
    );

    if (searchList !== undefined) {
      if (searchList[idx].journeyType === "One Way") {
        setTripType("One Way");
      } else {
        setTripType("Round Trip");
      }
    }

    if (searchList !== undefined) {
      if (searchList[idx].journeyType === "One Way") {
        $(document).ready(function () {
          $(".class_0").tDatePicker("update", [
            searchList !== undefined
              ? moment(searchList[idx].routes[0].departureDate).format(
                  "yyyy-MM-DD"
                )
              : new Date(),
          ]);
        });
      } else {
        $(document).ready(function () {
          $(".class_0").tDatePicker("update", [
            searchList !== undefined
              ? moment(searchList[idx].routes[0].departureDate).format(
                  "yyyy-MM-DD"
                )
              : new Date(),
            searchList !== undefined
              ? moment(searchList[idx].routes[1].departureDate).format(
                  "yyyy-MM-DD"
                )
              : new Date(),
          ]);
        });
      }
    }
  };

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

    // var fuse = new Fuse(airports, options)

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

  const [childAge, setChildAge] = useState([]);
  const addNewChild = (child) => {
    setChildCount(child + 1);
    setChildAge([...childAge, { age: "" }]);
    setFareType("Regular");
    // if(childAge.length < 9){
    // }
  };

  const handleChildAge = (e, index) => {
    let age = childAge;
    age[index][e.target.name] =
      e.target.value === "" ? e.target.value : parseInt(e.target.value);
    setChildAge(age);
  };

  const clickOnDelete = (child) => {
    setChildCount(child - 1);
    const lastIndex = childAge.length - 1;
    // this.setState({ items: items.filter((item, index) => index !== lastIndex) });
    setChildAge(childAge.filter((r, index) => index !== lastIndex));
  };
  const [searchList, setSearchList] = useState();
  const searchLogList = async () => {
    const response = await searchLogs();
    setSearchList(await response.data);
  };

  useEffect(() => {
    searchLogList();
  }, []);
  const handleSearchFlight = (e) => {
    e.preventDefault();
    if (preAirlines.endsWith(",") && preAirlines !== "") {
      toast.error(
        "Please remove the last comma or add airline after in prefered airlince"
      );
      return;
    }
    if (String(tripType) === "Multi City") {
      const origin = originRef.current.value;
      if (origin !== "" && origin.split(/,| -/).length !== 3) {
        originRef.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination = destinationRef.current.value;
      if (destination !== "" && destination.split(/,| -/).length !== 3) {
        destinationRef.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const origin1 = originRef1.current.value;
      if (origin1 !== "" && origin1.split(/,| -/).length !== 3) {
        originRef1.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination1 = destinationRef1.current.value;
      if (destination1 !== "" && destination1.split(/,| -/).length !== 3) {
        destinationRef1.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const origin2 = originRef2.current.value;
      if (origin2 !== "" && origin2.split(/,| -/).length !== 3) {
        originRef2.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination2 = destinationRef2.current.value;
      if (destination2 !== "" && destination2.split(/,| -/).length !== 3) {
        destinationRef2.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const origin3 = originRef3.current.value;
      if (origin3 !== "" && origin3.split(/,| -/).length !== 3) {
        originRef3.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination3 = destinationRef3.current.value;
      if (destination3 !== "" && destination3.split(/,| -/).length !== 3) {
        destinationRef3.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const origin4 = originRef4.current.value;
      if (origin4 !== "" && origin4.split(/,| -/).length !== 3) {
        originRef4.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination4 = destinationRef4.current.value;
      if (destination4 !== "" && destination4.split(/,| -/).length !== 3) {
        destinationRef4.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const origin5 = originRef5.current.value;
      if (origin5 !== "" && origin5.split(/,| -/).length !== 3) {
        originRef5.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination5 = destinationRef5.current.value;
      if (destination5 !== "" && destination5.split(/,| -/).length !== 3) {
        destinationRef5.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const journeyDate = $("#departureDate").children("input").val();
      const returnDate = $("#returnDate").children("input").val();
      const inputDateMulti1 = $("#departureDate1").children("input").val();
      const inputDateMulti2 = $("#departureDate2").children("input").val();
      const inputDateMulti3 = $("#departureDate3").children("input").val();
      const inputDateMulti4 = $("#departureDate4").children("input").val();
      const inputDateMulti5 = $("#departureDate5").children("input").val();

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
          setJourneyDateError(true);
        } else {
          const qtyList = {
            Adult: adultCount,
            Children: childCount,
            Infant: infantCount,
          };
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
            journeyDate: range.startDate,
            returnDate: range.endDate,
            inputDateMulti1: range.startDateMultiOne,
            inputDateMulti2: range.startDateMultiTwo,
            inputDateMulti3: range.startDateMultiThree,
            inputDateMulti4: range.startDateMultiFour,
            inputDateMulti5: range.startDateMultiFive,
            tripTypeModify: tripType,
            qtyList: qtyList,
            travelClass: travelClassType,
            childAgeList: childAge,
            preAirlines: preAirlines,
            fareType: fareType,
            comboFareClick: comboFareClick,
          };
          if (
            searchData.childAgeList.filter((e) => e.age === "").length === 0 ||
            childCount === 0
          ) {
            sessionStorage.setItem("Database", JSON.stringify(searchData));
            navigate("/showallflight", {
              state: {
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
                journeyDate: range.startDate,
                returnDate: range.endDate,
                inputDateMulti1: range.startDateMultiOne,
                inputDateMulti2: range.startDateMultiTwo,
                inputDateMulti3: range.startDateMultiThree,
                inputDateMulti4: range.startDateMultiFour,
                inputDateMulti5: range.startDateMultiFive,
                tripTypeModify: tripType,
                qtyList: qtyList,
                travelClass: travelClassType,
                formCount: formCount,
                childAgeList: childAge,
                airlines: preAirlines,
              },
            });
          } else {
            toast.error("Please select all child age");
          }
        }
      }
    } else {
      const origin = originRef.current.value;
      if (origin.split(/,| -/).length !== 3) {
        originRef.current.value = "";
        toast.error("Please select the depart airport from dropdown");
        return;
      }
      const destination = destinationRef.current.value;
      if (destination.split(/,| -/).length !== 3) {
        destinationRef.current.value = "";
        toast.error("Please select the going airport from dropdown");
        return;
      }
      const journeyDate = $("#departureDate").children("input").val();
      const returnDate = $("#returnDate").children("input").val();

      if (origin === destination && (origin !== "") & (destination !== "")) {
        toast.error("Depart From and Going To must be difference");
      } else {
        if (
          (String(tripType) === "One Way" &&
            String(journeyDate) !== String(null)) ||
          (String(journeyDate) !== String(null) &&
            String(returnDate) !== String(null))
        ) {
          const qtyList = {
            Adult: adultCount,
            Children: childCount,
            Infant: infantCount,
          };
          const searchData = {
            origin: origin,
            destination: destination,
            journeyDate: range.startDate,
            returnDate: range.endDate,
            tripTypeModify: tripType,
            qtyList: qtyList,
            travelClass: travelClassType,
            childAgeList: childAge,
            preAirlines: preAirlines,
            fareType: fareType,
            comboFareClick: comboFareClick,
          };
          if (
            searchData.childAgeList.filter((e) => e.age === "").length === 0 ||
            childCount === 0
          ) {
            sessionStorage.setItem("Database", JSON.stringify(searchData));
            navigate("/showallflight", {
              state: {
                origin: origin,
                destination: destination,
                journeyDate: range.startDate,
                returnDate: range.endDate,
                tripTypeModify: tripType,
                qtyList: qtyList,
                travelClass: travelClassType,
                airlines: preAirlines,
                childAgeList: childAge,
              },
            });
          } else {
            toast.error("Please select child age");
          }
        } else {
          toast.error("Please select date");
        }
      }
    }
    e.preventDefault();
  };

  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    startDateMultiOne: addDays(new Date(), 1),
    startDateMultiTwo: addDays(new Date(), 2),
    startDateMultiThree: addDays(new Date(), 3),
    startDateMultiFour: addDays(new Date(), 4),
    startDateMultiFive: addDays(new Date(), 5),
  });

  useEffect(() => {
    let A = moment(range.startDate);
    let B = moment(range.endDate);
    if (dayCount(range.startDate, range.endDate) < 0) {
      setRange({ ...range, endDate: addDays(range.startDate, 1) });
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
  }, [range]);

  const handleSwap = (index) => {
    // alert(index)
    if (index === 0) {
      const temp = originRef.current.value;
      originRef.current.value = destinationRef.current.value;
      destinationRef.current.value = temp;
    }
    if (index === 1) {
      const temp = originRef1.current.value;
      originRef1.current.value = destinationRef1.current.value;
      destinationRef1.current.value = temp;
    }
    if (index === 2) {
      const temp = originRef2.current.value;
      originRef2.current.value = destinationRef2.current.value;
      destinationRef2.current.value = temp;
    }
    if (index === 3) {
      const temp = originRef3.current.value;
      originRef3.current.value = destinationRef3.current.value;
      destinationRef3.current.value = temp;
    }
    if (index === 4) {
      const temp = originRef4.current.value;
      originRef4.current.value = destinationRef4.current.value;
      destinationRef4.current.value = temp;
    }
    if (index === 5) {
      const temp = originRef5.current.value;
      originRef5.current.value = destinationRef5.current.value;
      destinationRef5.current.value = temp;
    }
  };

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

  return (
    <div>
      <ToastContainer position="bottom-right" autoClose={1500} />
      <form onSubmit={handleSearchFlight}>
        <div className="container shadow-sm">
          <div className="row">
            <div className="col-lg-12 col-sm-12 col-md-12 banner-text shadow-for-search">
              <div
                id="form-bg"
                boxShadow="lg"
                borderRadius="8px"
                border="1px solid lightgray"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  // background:
                  //   "linear-gradient(to right, #fef0f5, #f5edfa ,#f2faed)",
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
                          onClick={() => setTripType("One Way")}
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
                          onClick={() => setTripType("Round Trip")}
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
                          onClick={() => setTripType("Multi City")}
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
                                    {adultCount + childCount + infantCount}{" "}
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
                                  <div
                                    className={
                                      fareType === "Regular"
                                        ? "d-flex justify-content-between mb-3"
                                        : "d-flex justify-content-between"
                                    }
                                  >
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
                                        // title="adultminus"
                                        onClick={
                                          infantCount > 0 &&
                                          adultCount === infantCount
                                            ? () => {
                                                setAdultCount(adultCount - 1);
                                                setInfantCount(infantCount - 1);
                                              }
                                            : () =>
                                                setAdultCount(adultCount - 1)
                                        }
                                        disabled={
                                          adultCount === 1 ? true : false
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
                                        // title="adultplus"
                                        onClick={() =>
                                          setAdultCount(adultCount + 1)
                                        }
                                        disabled={
                                          totalPassenger === 9 ? true : false
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
                                          <div style={{ fontSize: "18px" }}>
                                            <i
                                              className="fas fa-child align-self-center d-none"
                                              style={{ color: "#222" }}
                                              aria-hidden="true"
                                            ></i>
                                            Children
                                          </div>
                                          <div className="adult">Aged 2-11</div>
                                        </div>
                                        <div className="number-input text-center">
                                          <button
                                            className="round-btn"
                                            // title="adultminus"
                                            onClick={
                                              () => clickOnDelete(childCount)
                                              // setChildCount(childCount - 1)
                                            }
                                            disabled={
                                              childCount === 0 ? true : false
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
                                              backgroundColor: "#F7FBFC",
                                            }}
                                          />
                                          <button
                                            className="round-btn"
                                            // title="adultplus"
                                            onClick={
                                              () => addNewChild(childCount)
                                              // setChildCount(childCount + 1)
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
                                              <Text fontSize="sm" mt="2px">
                                                Child {index + 1}
                                              </Text>
                                              <select
                                                name="age"
                                                // value={val.agenum}
                                                defaultValue={""}
                                                style={{
                                                  width: "60px",
                                                  backgroundColor: "#F7FBFC",
                                                  borderRadius: "5px",
                                                  height: "36px",
                                                  paddingLeft: "8px",
                                                  border: "1px solid #ced4da",
                                                }}
                                                min={2}
                                                max={11}
                                                onChange={(e) =>
                                                  handleChildAge(e, index)
                                                }
                                              >
                                                <option value={""}>{""}</option>
                                                {childrenAges.map((item) => (
                                                  <option value={item}>
                                                    {item}
                                                  </option>
                                                ))}
                                              </select>
                                              <Text fontSize="xs" mt="2px">
                                                (Age)
                                              </Text>
                                            </span>
                                          );
                                        })}
                                      </div>
                                      <div className="d-flex justify-content-between mb-3">
                                        <div>
                                          <div style={{ fontSize: "18px" }}>
                                            <i
                                              className="fas fa-baby align-self-center d-none"
                                              style={{ color: "#222" }}
                                              aria-hidden="true"
                                            ></i>
                                            Infants
                                          </div>
                                        </div>
                                        <div className="number-input text-center">
                                          <button
                                            className="round-btn"
                                            // title="adultminus"
                                            onClick={() =>
                                              setInfantCount(infantCount - 1)
                                            }
                                            disabled={
                                              infantCount === 0 ? true : false
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
                                              backgroundColor: "#F7FBFC",
                                            }}
                                          />
                                          <button
                                            className="round-btn"
                                            // title="adultplus"
                                            onClick={
                                              infantCount < adultCount
                                                ? () => {
                                                    setInfantCount(
                                                      infantCount + 1
                                                    );
                                                    setFareType("Regular");
                                                  }
                                                : () => {}
                                            }
                                            disabled={
                                              infantCount === 9 ? true : false
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
                              onClick={() => setTravelClassType("Economy")}
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
                              onClick={() => setTravelClassType("Business")}
                              style={{ cursor: "pointer" }}
                            >
                              Business
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={() => setTravelClassType("First")}
                              style={{ cursor: "pointer" }}
                            >
                              First
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end text-right mt-2">
                    <div style={{ width: "200px" }}>
                      <label htmlFor="formGroupExampleInput" className="">
                        Preferred Airline
                      </label>
                      <input
                        type="text"
                        className="form-control border-radius"
                        placeholder="e.g. BS, BG, TK"
                        onChange={handleChange}
                        onKeyDown={preAirlinesValidate}
                        autoComplete="off"
                        style={{
                          background: "#F7FBFC",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row pt-1 position-relative">
                  <div className="col-lg-4 forms">
                    <label htmlFor="formGroupExampleInput" className="">
                      Depart From <span className="fw-bold text-danger">*</span>
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
                    <label htmlFor="formGroupExampleInput" className=" ">
                      Going To <span className="fw-bold text-danger">*</span>
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
                            destinationRef.current.value = returnValue.one;
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
                        <label htmlFor="formGroupExampleInput">
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
                          }}
                        />
                      </div>
                      {tripType === "Round Trip" ? (
                        <>
                          <div className="col-lg-6 ps-0" id="returnLavel">
                            <label htmlFor="formGroupExampleInput">
                              Returning{" "}
                              <span className="fw-bold text-danger">*</span>
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
                    <div className="row pt-1 position-relative" id="multiCity1">
                      <div className="col-lg-4 forms">
                        <label htmlFor="formGroupExampleInput" className="">
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
                                originRef1.current.value = departValue.two;
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
                        <label htmlFor="formGroupExampleInput" className="">
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
                                destinationRef1.current.value = returnValue.two;
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
                          <div className="col-lg-12 ">
                            <label htmlFor="formGroupExampleInput" className="">
                              Departing{" "}
                              <span className="fw-bold text-danger">*</span>
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
                      <div className="col-lg-4 forms">
                        <label htmlFor="formGroupExampleInput" className="">
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
                                originRef2.current.value = departValue.three;
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
                        <label htmlFor="formGroupExampleInput" className="">
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
                            <label htmlFor="formGroupExampleInput" className="">
                              Departing{" "}
                              <span className="fw-bold text-danger">*</span>
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
                        <label htmlFor="formGroupExampleInput" className="">
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
                                originRef3.current.value = departValue.four;
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
                        <label htmlFor="formGroupExampleInput" className="">
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
                            <label htmlFor="formGroupExampleInput" className="">
                              Departing{" "}
                              <span className="fw-bold text-danger">*</span>
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
                      <div className="col-lg-4 forms">
                        <label htmlFor="formGroupExampleInput" className="">
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
                                originRef4.current.value = departValue.five;
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
                        <label htmlFor="formGroupExampleInput" className="">
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
                            <label htmlFor="formGroupExampleInput" className="">
                              Departing{" "}
                              <span className="fw-bold text-danger">*</span>
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
                        <label htmlFor="formGroupExampleInput" className="">
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
                                originRef5.current.value = departValue.six;
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
                        <label htmlFor="formGroupExampleInput" className="">
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
                                destinationRef5.current.value = returnValue.six;
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
                        <div className="row rounded-3">
                          <div className="col-lg-12">
                            <label htmlFor="formGroupExampleInput" className="">
                              Departing{" "}
                              <span className="fw-bold text-danger">*</span>
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
                      <div
                        className="btn rounded-pill text-white"
                        id="btnp-1"
                        onClick={() => handleFlightOptionP(1)}
                        style={{ backgroundColor: "#7C04C0" }}
                      >
                        Add more
                      </div>
                      &nbsp;
                      <div
                        className="btn button-color rounded-pill text-white"
                        id="btnm-1"
                        style={{ display: "none" }}
                        onClick={() => handleFlightOptionM(1)}
                      >
                        Remove
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div className="row mt-3">
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
                          color: fareType === "Regular" ? "#7c04c0" : "#1a202c",
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
                          color: fareType === "Student" ? "#7c04c0" : "#1a202c",
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
                          value={comboFareClick}
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
                        className="btn text-white text-center fw-bold border-radius"
                        style={{
                          backgroundColor: "#7C04C0",
                        }}
                      >
                        Search Flight
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchFrom;