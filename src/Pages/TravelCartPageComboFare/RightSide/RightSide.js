import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import "./RightSide.css";
import { environment } from "../../SharePages/Utility/environment";
import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import {
  addDurations,
  timeDuration,
  totalBaggageCost,
  totalFlightDuration,
} from "../../../common/functions";

import { Flex, Text, useDisclosure } from "@chakra-ui/react";
import { getFareRules } from "../../../common/allApi";
import FlightDetails from "../../ShowAllFlightPageForProgressiveSearch/DomesticFlightCard/flightDetails";
import { totalComboFare } from "../../../common/comboFare/normalFunction";

const RightSide = ({
  partialPaymentData,
  loader,
  hasExtraService,
  adultValue,
  childValue,
  infantValue,
  extraServicesLoader,
}) => {
  let [fareRules, setFareRules] = useState({});
  const [loading, setLoading] = useState(false);
  const filterParam = JSON.parse(sessionStorage.getItem("Database"));
  const currency = JSON.parse(sessionStorage.getItem("currency"));
  const flightType = filterParam.tripTypeModify;
  const direction0 = JSON.parse(sessionStorage.getItem("direction0"));
  const direction1 = JSON.parse(sessionStorage.getItem("direction1"));
  const direction2 = JSON.parse(sessionStorage.getItem("direction2"));
  const direction3 = JSON.parse(sessionStorage.getItem("direction3"));
  const direction4 = JSON.parse(sessionStorage.getItem("direction4"));
  const direction5 = JSON.parse(sessionStorage.getItem("direction5"));
  const comboFare = JSON.parse(sessionStorage.getItem("comboFare"));
  const extraBaggageAllowedPTC = JSON.parse(
    sessionStorage.getItem("extraBaggageAllowedPTC")
  );
  const bookingComponents = JSON.parse(
    sessionStorage.getItem("bookingComponents")
  );
  const itemCodeRef = JSON.parse(sessionStorage.getItem("itemCodeRef"));
  const uniqueTransID = JSON.parse(sessionStorage.getItem("uniqueTransID"));
  const fullObj = JSON.parse(sessionStorage.getItem("fullObj"));

  const handleFareRules = (uId, dir, itemCode, brandedFareRef) => {
    const fareRulesObj = {
      itemCodeRef: itemCode,
      uniqueTransID: uId,
      segmentCodeRefs: [],
      brandedFareRefs: brandedFareRef,
    };

    dir.segments.map((i) =>
      fareRulesObj.segmentCodeRefs.push(i.segmentCodeRef)
    );

    async function fetchOptions() {
      setLoading(true);
      await getFareRules(fareRulesObj)
        .then((response) => {
          setFareRules(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    fetchOptions();
  };

  useEffect(() => {
    $("#flight" + 0).show();
    $("#baggage" + 0).hide();
    $("#cancel" + 0).hide();
    $("#fare" + 0).hide();

    $("#flightId" + 0).click(function () {
      $("#flight" + 0).show();
      $("#baggage" + 0).hide();
      $("#cancel" + 0).hide();
      $("#fare" + 0).hide();
    });
    $("#baggageId" + 0).click(function () {
      $("#flight" + 0).hide();
      $("#baggage" + 0).show();
      $("#cancel" + 0).hide();
      $("#fare" + 0).hide();
    });
    $("#changeId" + 0).click(function () {
      $("#flight" + 0).hide();
      $("#baggage" + 0).hide();
      $("#cancel" + 0).show();
      $("#fare" + 0).hide();
    });
    $("#fareId" + 0).click(function () {
      $("#flight" + 0).hide();
      $("#baggage" + 0).hide();
      $("#cancel" + 0).hide();
      $("#fare" + 0).show();
    });
  }, []);

  let isAgent = JSON.parse(sessionStorage.getItem("isAgent"));
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();

  return (
    <div className="col-lg-12">
      <div className="container box-shadow  bg-white">
        <div className="row py-3 m-1">
          <div
            className="col-lg-12 text-start border"
            style={{ color: "#4e4e4e" }}
          >
            <span className="card-title fw-bold">Flight summary</span>
          </div>
          <div className="col-lg-12 p-2">
            {flightType === "Multi City" ? (
              <>
                <>
                  <div className="row border text-color p-2">
                    <div className="col-lg-2 my-auto">
                      <img
                        src={
                          environment.s3ArliensImage +
                          `${direction0.platingCarrierCode}.png`
                        }
                        alt=""
                        width="50px"
                        height="50px"
                      />
                    </div>
                    <div className="col-lg-2 my-auto">
                      <h6 className="my-auto fw-bold">{direction0.from}</h6>
                      <span className="fs-6">
                        {direction0.segments[0].departure.substr(11, 5)}
                      </span>
                    </div>
                    <div className="col-lg-6 my-auto text-center lh-1">
                      <div className="row">
                        <div className="col-lg-12 text-center">
                          <span className="text-color fw-bold font-size">
                            {direction0.stops === 0
                              ? "Direct"
                              : direction0.stops + " Stop"}
                          </span>
                        </div>
                        <div className="col-lg-12 text-center">
                          <span className="text-color ">
                            <i class="fas fa-circle fa-xs"></i>
                            --------------
                            <i className="fas fa-plane fa-sm"></i>
                          </span>
                        </div>
                        <div className="col-lg-12 text-center ms-4">
                          <span className="text-color me-5">
                            <i className="fas fa-clock fa-sm"></i>
                            <span className="ms-1 font-size">
                              {/* {direction0.segments[0].duration[0]} */}
                              {direction0.segments.length === 1
                                ? totalFlightDuration(direction0.segments)
                                : direction0.segments.length === 2
                                ? addDurations([
                                    totalFlightDuration(direction0.segments),
                                    timeDuration(
                                      direction0.segments[0].arrival,
                                      direction0.segments[1].departure
                                    ),
                                  ])
                                : direction0.segments.length === 3
                                ? addDurations([
                                    totalFlightDuration(direction0.segments),
                                    timeDuration(
                                      direction0.segments[0].arrival,
                                      direction0.segments[1].departure
                                    ),
                                    timeDuration(
                                      direction0.segments[1].arrival,
                                      direction0.segments[2].departure
                                    ),
                                  ])
                                : ""}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 my-auto">
                      <h6 className="my-auto fw-bold">{direction0.to}</h6>
                      <span className="fs-6">
                        {direction0.segments[
                          direction0.segments.length - 1
                        ].arrival.substr(11, 5)}
                      </span>
                    </div>
                  </div>
                </>
                <>
                  <div className="row border text-color p-2">
                    <div className="col-lg-2 my-auto">
                      <img
                        src={
                          environment.s3ArliensImage +
                          `${direction1.platingCarrierCode}.png`
                        }
                        alt=""
                        width="50px"
                        height="50px"
                      />
                    </div>
                    <div className="col-lg-2 my-auto">
                      <h6 className="my-auto fw-bold">{direction1.from}</h6>
                      <span className="fs-6">
                        {direction1.segments[0].departure.substr(11, 5)}
                      </span>
                    </div>
                    <div className="col-lg-6 my-auto text-center lh-1">
                      <div className="row">
                        <div className="col-lg-12 text-center">
                          <span className="text-color fw-bold font-size">
                            {direction1.stops === 0
                              ? "Direct"
                              : direction1.stops + " Stop"}
                          </span>
                        </div>
                        <div className="col-lg-12 text-center">
                          <span className="text-color ">
                            <i class="fas fa-circle fa-xs"></i>
                            --------------
                            <i className="fas fa-plane fa-sm"></i>
                          </span>
                        </div>
                        <div className="col-lg-12 text-center ms-4">
                          <span className="text-color me-5">
                            <i className="fas fa-clock fa-sm"></i>
                            <span className="ms-1 font-size">
                              {/* {totalFlightDuration(direction1.segments)} */}
                              {direction1.segments.length === 1
                                ? totalFlightDuration(direction1.segments)
                                : direction1.segments.length === 2
                                ? addDurations([
                                    totalFlightDuration(direction1.segments),
                                    timeDuration(
                                      direction1.segments[0].arrival,
                                      direction1.segments[1].departure
                                    ),
                                  ])
                                : direction1.segments.length === 3
                                ? addDurations([
                                    totalFlightDuration(direction1.segments),
                                    timeDuration(
                                      direction1.segments[0].arrival,
                                      direction1.segments[1].departure
                                    ),
                                    timeDuration(
                                      direction1.segments[1].arrival,
                                      direction1.segments[2].departure
                                    ),
                                  ])
                                : ""}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 my-auto">
                      <h6 className="my-auto fw-bold">{direction1.to}</h6>
                      <span className="fs-6">
                        {direction1.segments[
                          direction1.segments.length - 1
                        ].arrival.substr(11, 5)}
                      </span>
                    </div>
                  </div>
                </>
                {direction2.segments !== undefined ? (
                  <>
                    <div className="row border text-color p-2">
                      <div className="col-lg-2 my-auto">
                        <img
                          src={
                            environment.s3ArliensImage +
                            `${direction2.platingCarrierCode}.png`
                          }
                          alt=""
                          width="50px"
                          height="50px"
                        />
                      </div>
                      <div className="col-lg-2 my-auto">
                        <h6 className="my-auto fw-bold">{direction2.from}</h6>
                        <span className="fs-6">
                          {direction2.segments[0].departure.substr(11, 5)}
                        </span>
                      </div>
                      <div className="col-lg-6 my-auto text-center lh-1">
                        <div className="row">
                          <div className="col-lg-12 text-center">
                            <span className="text-color fw-bold font-size">
                              {direction2.stops === 0
                                ? "Direct"
                                : direction2.stops + " Stop"}
                            </span>
                          </div>
                          <div className="col-lg-12 text-center">
                            <span className="text-color ">
                              <i class="fas fa-circle fa-xs"></i>
                              --------------
                              <i className="fas fa-plane fa-sm"></i>
                            </span>
                          </div>
                          <div className="col-lg-12 text-center ms-4">
                            <span className="text-color me-5">
                              <i className="fas fa-clock fa-sm"></i>
                              <span className="ms-1 font-size">
                                {/* {totalFlightDuration(direction2.segments)} */}
                                {direction2.segments.length === 1
                                  ? totalFlightDuration(direction2.segments)
                                  : direction2.segments.length === 2
                                  ? addDurations([
                                      totalFlightDuration(direction2.segments),
                                      timeDuration(
                                        direction2.segments[0].arrival,
                                        direction2.segments[1].departure
                                      ),
                                    ])
                                  : direction2.segments.length === 3
                                  ? addDurations([
                                      totalFlightDuration(direction2.segments),
                                      timeDuration(
                                        direction2.segments[0].arrival,
                                        direction2.segments[1].departure
                                      ),
                                      timeDuration(
                                        direction2.segments[1].arrival,
                                        direction2.segments[2].departure
                                      ),
                                    ])
                                  : ""}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 my-auto">
                        <h6 className="my-auto fw-bold">{direction2.to}</h6>
                        <span className="fs-6">
                          {direction2.segments[
                            direction2.segments.length - 1
                          ].arrival.substr(11, 5)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {direction3.segments !== undefined ? (
                  <>
                    <div className="row border text-color p-2">
                      <div className="col-lg-2 my-auto">
                        <img
                          src={
                            environment.s3ArliensImage +
                            `${direction3.platingCarrierCode}.png`
                          }
                          alt=""
                          width="50px"
                          height="50px"
                        />
                      </div>
                      <div className="col-lg-2 my-auto">
                        <h6 className="my-auto fw-bold">{direction3.from}</h6>
                        <span className="fs-6">
                          {direction3.segments[0].departure.substr(11, 5)}
                        </span>
                      </div>
                      <div className="col-lg-6 my-auto text-center lh-1">
                        <div className="row">
                          <div className="col-lg-12 text-center">
                            <span className="text-color fw-bold font-size">
                              {direction3.stops === 0
                                ? "Direct"
                                : direction3.stops + " Stop"}
                            </span>
                          </div>
                          <div className="col-lg-12 text-center">
                            <span className="text-color ">
                              <i class="fas fa-circle fa-xs"></i>
                              --------------
                              <i className="fas fa-plane fa-sm"></i>
                            </span>
                          </div>
                          <div className="col-lg-12 text-center ms-4">
                            <span className="text-color me-5">
                              <i className="fas fa-clock fa-sm"></i>
                              <span className="ms-1 font-size">
                                {/* {totalFlightDuration(direction3.segments)} */}
                                {direction3.segments.length === 1
                                  ? totalFlightDuration(direction3.segments)
                                  : direction3.segments.length === 2
                                  ? addDurations([
                                      totalFlightDuration(direction3.segments),
                                      timeDuration(
                                        direction3.segments[0].arrival,
                                        direction3.segments[1].departure
                                      ),
                                    ])
                                  : direction3.segments.length === 3
                                  ? addDurations([
                                      totalFlightDuration(direction3.segments),
                                      timeDuration(
                                        direction3.segments[0].arrival,
                                        direction3.segments[1].departure
                                      ),
                                      timeDuration(
                                        direction3.segments[1].arrival,
                                        direction3.segments[2].departure
                                      ),
                                    ])
                                  : ""}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 my-auto">
                        <h6 className="my-auto fw-bold">{direction3.to}</h6>
                        <span className="fs-6">
                          {direction3.segments[
                            direction3.segments.length - 1
                          ].arrival.substr(11, 5)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {direction4.segments !== undefined ? (
                  <>
                    <div className="row border text-color p-2">
                      <div className="col-lg-2 my-auto">
                        <img
                          src={
                            environment.s3ArliensImage +
                            `${direction4.platingCarrierCode}.png`
                          }
                          alt=""
                          width="50px"
                          height="50px"
                        />
                      </div>
                      <div className="col-lg-2 my-auto">
                        <h6 className="my-auto fw-bold">{direction4.from}</h6>
                        <span className="fs-6">
                          {direction4.segments[0].departure.substr(11, 5)}
                        </span>
                      </div>
                      <div className="col-lg-6 my-auto text-center lh-1">
                        <div className="row">
                          <div className="col-lg-12 text-center">
                            <span className="text-color fw-bold font-size">
                              {direction4.stops === 0
                                ? "Direct"
                                : direction4.stops + " Stop"}
                            </span>
                          </div>
                          <div className="col-lg-12 text-center">
                            <span className="text-color ">
                              <i class="fas fa-circle fa-xs"></i>
                              --------------
                              <i className="fas fa-plane fa-sm"></i>
                            </span>
                          </div>
                          <div className="col-lg-12 text-center ms-4">
                            <span className="text-color me-5">
                              <i className="fas fa-clock fa-sm"></i>
                              <span className="ms-1 font-size">
                                {/* {totalFlightDuration(direction4.segments)} */}
                                {direction4.segments.length === 1
                                  ? totalFlightDuration(direction4.segments)
                                  : direction4.segments.length === 2
                                  ? addDurations([
                                      totalFlightDuration(direction4.segments),
                                      timeDuration(
                                        direction4.segments[0].arrival,
                                        direction4.segments[1].departure
                                      ),
                                    ])
                                  : direction4.segments.length === 3
                                  ? addDurations([
                                      totalFlightDuration(direction4.segments),
                                      timeDuration(
                                        direction4.segments[0].arrival,
                                        direction4.segments[1].departure
                                      ),
                                      timeDuration(
                                        direction4.segments[1].arrival,
                                        direction4.segments[2].departure
                                      ),
                                    ])
                                  : ""}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 my-auto">
                        <h6 className="my-auto fw-bold">{direction4.to}</h6>
                        <span className="fs-6">
                          {direction4.segments[
                            direction4.segments.length - 1
                          ].arrival.substr(11, 5)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {direction5.segments !== undefined ? (
                  <>
                    <div className="row border text-color p-2">
                      <div className="col-lg-2 my-auto">
                        <img
                          src={
                            environment.s3ArliensImage +
                            `${direction5.platingCarrierCode}.png`
                          }
                          alt=""
                          width="50px"
                          height="50px"
                        />
                      </div>
                      <div className="col-lg-2 my-auto">
                        <h6 className="my-auto fw-bold">{direction5.from}</h6>
                        <span className="fs-6">
                          {direction5.segments[0].departure.substr(11, 5)}
                        </span>
                      </div>
                      <div className="col-lg-6 my-auto text-center lh-1">
                        <div className="row">
                          <div className="col-lg-12 text-center">
                            <span className="text-color fw-bold font-size">
                              {direction5.stops === 0
                                ? "Direct"
                                : direction5.stops + " Stop"}
                            </span>
                          </div>
                          <div className="col-lg-12 text-center">
                            <span className="text-color ">
                              <i class="fas fa-circle fa-xs"></i>
                              --------------
                              <i className="fas fa-plane fa-sm"></i>
                            </span>
                          </div>
                          <div className="col-lg-12 text-center ms-4">
                            <span className="text-color me-5">
                              <i className="fas fa-clock fa-sm"></i>
                              <span className="ms-1 font-size">
                                {/* {totalFlightDuration(direction5.segments)} */}
                                {direction5.segments.length === 1
                                  ? totalFlightDuration(direction5.segments)
                                  : direction5.segments.length === 2
                                  ? addDurations([
                                      totalFlightDuration(direction5.segments),
                                      timeDuration(
                                        direction5.segments[0].arrival,
                                        direction5.segments[1].departure
                                      ),
                                    ])
                                  : direction5.segments.length === 3
                                  ? addDurations([
                                      totalFlightDuration(direction5.segments),
                                      timeDuration(
                                        direction5.segments[0].arrival,
                                        direction5.segments[1].departure
                                      ),
                                      timeDuration(
                                        direction5.segments[1].arrival,
                                        direction5.segments[2].departure
                                      ),
                                    ])
                                  : ""}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 my-auto">
                        <h6 className="my-auto fw-bold">{direction5.to}</h6>
                        <span className="fs-6">
                          {direction5.segments[
                            direction5.segments.length - 1
                          ].arrival.substr(11, 5)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <div className="row border text-color p-2">
                  <div className="col-lg-2 my-auto">
                    <img
                      src={
                        environment.s3ArliensImage +
                        `${direction0.platingCarrierCode}.png`
                      }
                      alt=""
                      width="50px"
                      height="50px"
                    />
                  </div>
                  <div className="col-lg-2 my-auto">
                    <h6 className="my-auto fw-bold">{direction0.from}</h6>
                    <span className="fs-6">
                      {direction0.segments[0].departure.substr(11, 5)}
                    </span>
                  </div>
                  <div className="col-lg-6 my-auto text-center lh-1">
                    <div className="row">
                      <div className="col-lg-12 text-center">
                        <span className="text-color fw-bold font-size">
                          {direction0.stops === 0
                            ? "Direct"
                            : direction0.stops + " Stop"}
                        </span>
                      </div>
                      <div className="col-lg-12 text-center">
                        <span className="text-color ">
                          <i class="fas fa-circle fa-xs"></i>
                          --------------
                          <i className="fas fa-plane fa-sm"></i>
                        </span>
                      </div>
                      <div className="col-lg-12 text-center ms-4">
                        <span className="text-color me-5">
                          <i className="fas fa-clock fa-sm"></i>
                          <span className="ms-1 font-size">
                            {/* {totalFlightDuration(direction0.segments)} */}

                            {direction0.segments.length === 1
                              ? totalFlightDuration(direction0.segments)
                              : direction0.segments.length === 2
                              ? addDurations([
                                  totalFlightDuration(direction0.segments),
                                  timeDuration(
                                    direction0.segments[0].arrival,
                                    direction0.segments[1].departure
                                  ),
                                ])
                              : direction0.segments.length === 3
                              ? addDurations([
                                  totalFlightDuration(direction0.segments),
                                  timeDuration(
                                    direction0.segments[0].arrival,
                                    direction0.segments[1].departure
                                  ),
                                  timeDuration(
                                    direction0.segments[1].arrival,
                                    direction0.segments[2].departure
                                  ),
                                ])
                              : ""}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 my-auto">
                    <h6 className="my-auto fw-bold">{direction0.to}</h6>
                    <span className="fs-6">
                      {direction0.segments[
                        direction0.segments.length - 1
                      ].arrival.substr(11, 5)}
                    </span>
                  </div>
                </div>
              </>
            )}
            <div></div>
            {Object.keys(direction1).length > 0 ? (
              <>
                <div className="row border text-color p-2">
                  <div className="col-lg-2 my-auto">
                    <img
                      src={
                        environment.s3ArliensImage +
                        `${direction1.platingCarrierCode}.png`
                      }
                      alt=""
                      width="50px"
                      height="50px"
                    />
                  </div>
                  <div className="col-lg-2 my-auto">
                    <h6 className="my-auto fw-bold">{direction1.from}</h6>
                    <span className="fs-6">
                      {direction1.segments[0].departure.substr(11, 5)}
                    </span>
                  </div>
                  <div className="col-lg-6 my-auto text-center lh-1">
                    <div className="row">
                      <div className="col-lg-12 text-center">
                        <span className="text-color fw-bold font-size">
                          {direction1.stops === 0
                            ? "Direct"
                            : direction1.stops + " Stop"}
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <span className="text-color">
                          <i class="fas fa-circle fa-xs"></i>
                          --------------
                          <i className="fas fa-plane fa-sm"></i>
                        </span>
                      </div>
                      <div className="col-lg-12 text-center ms-4">
                        <span className="text-color me-5">
                          <i className="fas fa-clock fa-sm"></i>
                          <span className="ms-1 font-size">
                            {/* {totalFlightDuration(direction1.segments)} */}
                            {direction1.segments.length === 1
                              ? totalFlightDuration(direction1.segments)
                              : direction1.segments.length === 2
                              ? addDurations([
                                  totalFlightDuration(direction1.segments),
                                  timeDuration(
                                    direction1.segments[0].arrival,
                                    direction1.segments[1].departure
                                  ),
                                ])
                              : direction1.segments.length === 3
                              ? addDurations([
                                  totalFlightDuration(direction1.segments),
                                  timeDuration(
                                    direction1.segments[0].arrival,
                                    direction1.segments[1].departure
                                  ),
                                  timeDuration(
                                    direction1.segments[1].arrival,
                                    direction1.segments[2].departure
                                  ),
                                ])
                              : ""}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 my-auto">
                    <h6 className="my-auto fw-bold">{direction1.to}</h6>
                    <span className="fs-6">
                      {direction1.segments[
                        direction1.segments.length - 1
                      ].arrival.substr(11, 5)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="position-relative" id={"show-option"}>
            <div className="position-absolute top-100 start-50 translate-middle">
              <p className="flight-details" onClick={onOpen1}>
                Flight Details
              </p>
            </div>
          </div>
        </div>
        <div className="row py-3 m-1">
          <div
            className="col-lg-12 text-start border mb-1"
            style={{ color: "#4e4e4e" }}
          >
            <span className="card-title fw-bold">Fare details</span>
            <span className="pe-3 text-color float-end">
              <i class="fas fa-pen-nib me-1"></i>{" "}
              <Link
                to=""
                style={{ textDecoration: "none" }}
                className="fw-bold text-color font-size"
                data-bs-toggle="modal"
                data-bs-target={"#farerulesModal"}
                onClick={() => {
                  if (
                    comboFare.item[0] !== null &&
                    comboFare.item[0].length > 0
                  ) {
                    handleFareRules(
                      uniqueTransID,
                      direction0,
                      itemCodeRef,
                      comboFare.item[0].brandedFares[comboFare?.departureInx]
                        ?.ref
                    );
                  } else {
                    handleFareRules(uniqueTransID, direction0, itemCodeRef, "");
                  }
                }}
              >
                Fare Rules
              </Link>
            </span>
          </div>

          {comboFare !== null &&
            comboFare.item.length > 0 &&
            comboFare?.item[0]?.brandedFares === null && (
              <>
                <div className="px-0">
                  <div className="px-0">
                    Departure - {comboFare?.departure[0]?.from} to{" "}
                    {comboFare?.departure[0]?.to}
                  </div>
                  {comboFare.item[0].passengerFares.adt !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Adult Fare</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              Base Fare (
                              {comboFare.item[0]?.passengerCounts.adt} &#215;{" "}
                              {comboFare.item[0].passengerFares.adt.basePrice.toLocaleString(
                                "en-US"
                              )}
                              ){" "}
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.adt *
                                comboFare.item[0].passengerFares.adt.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>

                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              Taxes ({comboFare.item[0]?.passengerCounts.adt}{" "}
                              &#215;{" "}
                              {comboFare.item[0].passengerFares?.adt.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>
                            <Text>
                              {" "}
                              {comboFare.item[0].passengerFares?.adt.taxes.toLocaleString(
                                "en-US"
                              )}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              AIT ({comboFare.item[0]?.passengerCounts.adt}{" "}
                              &#215; {comboFare.item[0].passengerFares?.adt.ait}
                              )
                            </Text>

                            <Text>
                              {(
                                comboFare.item[0]?.passengerCounts.adt *
                                comboFare.item[0].passengerFares.adt.ait
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>Commission</Text>

                            <Text>
                              {(
                                comboFare.item[0]?.passengerCounts.adt *
                                comboFare.item[0].passengerFares.adt
                                  .discountPrice
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[0].passengerFares.chd !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Child Fare &gt; 5</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[0]?.passengerCounts.chd
                              } &#215;{" "}
                              {comboFare.item[0].passengerFares?.chd.basePrice.toLocaleString(
                                "en-US"
                              )}
                              ){" "}
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.chd *
                                comboFare.item[0].passengerFares.chd.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[0]?.passengerCounts.chd
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[0].passengerFares.chd.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.chd *
                                comboFare.item[0].passengerFares.chd.taxes
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[0]?.passengerCounts.chd}{" "}
                              &#215; {comboFare.item[0].passengerFares.chd.ait})
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.chd *
                                comboFare.item[0].passengerFares.chd.ait
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.chd *
                                comboFare.item[0].passengerFares.chd
                                  .discountPrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[0].passengerFares.cnn !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>
                            Child Fare{" "}
                            {comboFare.item[0].passengerFares.chd === null ? (
                              <></>
                            ) : (
                              <> &#60; 5</>
                            )}
                          </u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[0]?.passengerCounts.cnn
                              } &#215;{" "}
                              {comboFare.item[0].passengerFares.cnn.basePrice.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.cnn *
                                comboFare.item[0].passengerFares.cnn.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[0]?.passengerCounts.cnn
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[0].passengerFares?.cnn.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.cnn *
                                comboFare.item[0].passengerFares.cnn.taxes
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[0]?.passengerCounts.cnn}{" "}
                              &#215; {comboFare.item[0].passengerFares.cnn.ait})
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.cnn *
                                comboFare.item[0].passengerFares.cnn.ait
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {(
                                comboFare.item[0]?.passengerCounts.cnn *
                                comboFare.item[0].passengerFares.cnn
                                  .discountPrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[0].passengerFares.inf !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Infant Fare</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[0]?.passengerCounts.inf
                              } &#215;{" "}
                              {comboFare.item[0].passengerFares.inf.basePrice.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.inf *
                                comboFare.item[0].passengerFares.inf.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[0]?.passengerCounts.inf
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[0].passengerFares.inf.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.inf *
                                comboFare.item[0].passengerFares.inf.taxes
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[0]?.passengerCounts.inf}{" "}
                              &#215; {comboFare.item[0].passengerFares.inf.ait})
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.inf *
                                comboFare.item[0].passengerFares.inf.ait
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.inf *
                                comboFare.item[0].passengerFares.inf
                                  .discountPrice
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  className="col-lg-12 border py-1 mb-1 mb-3"
                  style={{ color: "#4e4e4e" }}
                >
                  <div className="row  py-2">
                    <Flex justifyContent={"space-between"}>
                      <Text> Total</Text>
                      <Text>
                        AED{" "}
                        {comboFare.item[0].bookingComponents[0]?.totalPrice?.toLocaleString(
                          "en-US"
                        )}
                      </Text>
                    </Flex>
                  </div>
                </div>
              </>
            )}
          {comboFare !== null &&
            comboFare.item.length > 0 &&
            comboFare?.item[0]?.brandedFares !== null && (
              <>
                <div className="px-0">
                  <div className="px-0">
                    Departure - {comboFare?.departure[0]?.from} to{" "}
                    {comboFare?.departure[0]?.to}
                  </div>
                  {comboFare.item[0].brandedFares[comboFare?.departureInx]
                    .paxFareBreakDown.adt !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Adult Fare</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              Base Fare (
                              {comboFare.item[0]?.passengerCounts.adt} &#215;{" "}
                              {comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ].paxFareBreakDown.adt.basePrice.toLocaleString(
                                "en-US"
                              )}
                              ){" "}
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.adt *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.adt.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>

                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              Taxes ({comboFare.item[0]?.passengerCounts.adt}{" "}
                              &#215;{" "}
                              {comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ].paxFareBreakDown.adt.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>
                            <Text>
                              {" "}
                              {comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ].paxFareBreakDown.adt.taxes.toLocaleString(
                                "en-US"
                              )}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              AIT ({comboFare.item[0]?.passengerCounts.adt}{" "}
                              &#215;{" "}
                              {
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.adt.ait
                              }
                              )
                            </Text>

                            <Text>
                              {(
                                comboFare.item[0]?.passengerCounts.adt *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.adt.ait
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>Commission</Text>

                            <Text>
                              {(
                                comboFare.item[0]?.passengerCounts.adt *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.adt.discountPrice
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[0].brandedFares[comboFare?.departureInx]
                    .paxFareBreakDown.chd !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Child Fare &gt; 5</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[0]?.passengerCounts.chd
                              } &#215;{" "}
                              {comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ].paxFareBreakDown.chd.basePrice.toLocaleString(
                                "en-US"
                              )}
                              ){" "}
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.chd *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.chd.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[0]?.passengerCounts.chd
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ].paxFareBreakDown.chd.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.chd *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.chd.taxes
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[0]?.passengerCounts.chd}{" "}
                              &#215;{" "}
                              {
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.chd.ait
                              }
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.chd *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.chd.ait
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.chd *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.chd.discountPrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[0].brandedFares[comboFare?.departureInx]
                    .paxFareBreakDown.cnn !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>
                            Child Fare{" "}
                            {comboFare.item[0].brandedFares[
                              comboFare?.departureInx
                            ].paxFareBreakDown.chd === null ? (
                              <></>
                            ) : (
                              <> &#60; 5</>
                            )}
                          </u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[0]?.passengerCounts.cnn
                              } &#215;{" "}
                              {comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ].paxFareBreakDown.cnn.basePrice.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.cnn *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.cnn.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[0]?.passengerCounts.cnn
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ].paxFareBreakDown.cnn.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.cnn *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.cnn.taxes
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[0]?.passengerCounts.cnn}{" "}
                              &#215;{" "}
                              {
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.cnn.ait
                              }
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.cnn *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.cnn.ait
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {(
                                comboFare.item[0]?.passengerCounts.cnn *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.cnn.discountPrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[0].brandedFares[comboFare?.departureInx]
                    .paxFareBreakDown.inf !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Infant Fare</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[0]?.passengerCounts.inf
                              } &#215;{" "}
                              {comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ].paxFareBreakDown.inf.basePrice.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.inf *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.inf.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[0]?.passengerCounts.inf
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ].paxFareBreakDown.inf.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.inf *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.inf.taxes
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[0]?.passengerCounts.inf}{" "}
                              &#215;{" "}
                              {
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.inf.ait
                              }
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.inf *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.inf.ait
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[0]?.passengerCounts.inf *
                                comboFare.item[0].brandedFares[
                                  comboFare?.departureInx
                                ].paxFareBreakDown.inf.discountPrice
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  className="col-lg-12 border py-1 mb-1 mb-3"
                  style={{ color: "#4e4e4e" }}
                >
                  <div className="row  py-2">
                    <Flex justifyContent={"space-between"}>
                      <Text> Total</Text>
                      <Text>
                        AED{" "}
                        {comboFare.item[0].brandedFares[comboFare?.departureInx]
                          ?.paxFareBreakDown.adt !== null &&
                          (
                            comboFare.item[0].brandedFares[
                              comboFare?.departureInx
                            ].paxFareBreakDown.adt.totalPrice *
                              comboFare.item[0]?.passengerCounts.adt +
                            (comboFare.item[0].brandedFares[
                              comboFare?.departureInx
                            ]?.paxFareBreakDown.chd !== null &&
                              comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ]?.paxFareBreakDown.chd.totalPrice *
                                comboFare.item[0].passengerCounts.chd) +
                            (comboFare.item[0].brandedFares[
                              comboFare?.departureInx
                            ]?.paxFareBreakDown.cnn !== null &&
                              comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ]?.paxFareBreakDown.cnn.totalPrice *
                                comboFare.item[0]?.passengerCounts.cnn) +
                            (comboFare.item[0].brandedFares[
                              comboFare?.departureInx
                            ]?.paxFareBreakDown.inf !== null &&
                              comboFare.item[0].brandedFares[
                                comboFare?.departureInx
                              ]?.paxFareBreakDown.inf.totalPrice *
                                comboFare.item[0]?.passengerCounts.inf)
                          ).toLocaleString("en-US")}
                      </Text>
                    </Flex>
                  </div>
                </div>
              </>
            )}
          {comboFare !== null &&
            comboFare.item.length > 0 &&
            comboFare?.item[1]?.brandedFares === null && (
              <>
                <div className="px-0">
                  <div className="px-0">
                    Return - {comboFare?.return[0]?.from} to{" "}
                    {comboFare?.return[0]?.to}
                  </div>
                  {comboFare.item[1].passengerFares.adt !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Adult Fare</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              Base Fare (
                              {comboFare.item[1]?.passengerCounts.adt} &#215;{" "}
                              {comboFare.item[1].passengerFares.adt.basePrice.toLocaleString(
                                "en-US"
                              )}
                              ){" "}
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.adt *
                                comboFare.item[1].passengerFares.adt.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>

                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              Taxes ({comboFare.item[1]?.passengerCounts.adt}{" "}
                              &#215;{" "}
                              {comboFare.item[1].passengerFares?.adt.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>
                            <Text>
                              {" "}
                              {comboFare.item[1].passengerFares?.adt.taxes.toLocaleString(
                                "en-US"
                              )}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              AIT ({comboFare.item[1]?.passengerCounts.adt}{" "}
                              &#215; {comboFare.item[1].passengerFares?.adt.ait}
                              )
                            </Text>

                            <Text>
                              {(
                                comboFare.item[1]?.passengerCounts.adt *
                                comboFare.item[1].passengerFares.adt.ait
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>Commission</Text>

                            <Text>
                              {(
                                comboFare.item[1]?.passengerCounts.adt *
                                comboFare.item[1].passengerFares.adt
                                  .discountPrice
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[1].passengerFares.chd !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Child Fare &gt; 5</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[1]?.passengerCounts.chd
                              } &#215;{" "}
                              {comboFare.item[1].passengerFares?.chd.basePrice.toLocaleString(
                                "en-US"
                              )}
                              ){" "}
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.chd *
                                comboFare.item[1].passengerFares.chd.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[1]?.passengerCounts.chd
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[1].passengerFares.chd.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.chd *
                                comboFare.item[1].passengerFares.chd.taxes
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[1]?.passengerCounts.chd}{" "}
                              &#215; {comboFare.item[1].passengerFares.chd.ait})
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.chd *
                                comboFare.item[1].passengerFares.chd.ait
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.chd *
                                comboFare.item[1].passengerFares.chd
                                  .discountPrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[1].passengerFares.cnn !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>
                            Child Fare{" "}
                            {comboFare.item[1].passengerFares.chd === null ? (
                              <></>
                            ) : (
                              <> &#60; 5</>
                            )}
                          </u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[1]?.passengerCounts.cnn
                              } &#215;{" "}
                              {comboFare.item[1].passengerFares.cnn.basePrice.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.cnn *
                                comboFare.item[1].passengerFares.cnn.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[1]?.passengerCounts.cnn
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[1].passengerFares?.cnn.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.cnn *
                                comboFare.item[1].passengerFares.cnn.taxes
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[1]?.passengerCounts.cnn}{" "}
                              &#215; {comboFare.item[1].passengerFares.cnn.ait})
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.cnn *
                                comboFare.item[1].passengerFares.cnn.ait
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {(
                                comboFare.item[1]?.passengerCounts.cnn *
                                comboFare.item[1].passengerFares.cnn
                                  .discountPrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[1].passengerFares.inf !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Infant Fare</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[1]?.passengerCounts.inf
                              } &#215;{" "}
                              {comboFare.item[1].passengerFares.inf.basePrice.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.inf *
                                comboFare.item[1].passengerFares.inf.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[1]?.passengerCounts.inf
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[1].passengerFares.inf.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.inf *
                                comboFare.item[1].passengerFares.inf.taxes
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[1]?.passengerCounts.inf}{" "}
                              &#215; {comboFare.item[1].passengerFares.inf.ait})
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.inf *
                                comboFare.item[1].passengerFares.inf.ait
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.inf *
                                comboFare.item[1].passengerFares.inf
                                  .discountPrice
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  className="col-lg-12 border py-1 mb-1 mb-3"
                  style={{ color: "#4e4e4e" }}
                >
                  <div className="row  py-2">
                    <Flex justifyContent={"space-between"}>
                      <Text> Total</Text>
                      <Text>
                        AED{" "}
                        {comboFare.item[1].bookingComponents[0]?.totalPrice?.toLocaleString(
                          "en-US"
                        )}
                      </Text>
                    </Flex>
                  </div>
                </div>
              </>
            )}

          {comboFare !== null &&
            comboFare.item.length > 0 &&
            comboFare?.item[1]?.brandedFares !== null && (
              <>
                <div className="px-0">
                  <div className="px-0">
                    Return - {comboFare?.return[0]?.from} to{" "}
                    {comboFare?.return[0]?.to}
                  </div>
                  {comboFare.item[1].brandedFares[comboFare?.returnIdx]
                    .paxFareBreakDown.adt !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Adult Fare</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              Base Fare (
                              {comboFare.item[1]?.passengerCounts.adt} &#215;{" "}
                              {comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ].paxFareBreakDown.adt.basePrice.toLocaleString(
                                "en-US"
                              )}
                              ){" "}
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.adt *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.adt.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>

                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              Taxes ({comboFare.item[1]?.passengerCounts.adt}{" "}
                              &#215;{" "}
                              {comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ].paxFareBreakDown.adt.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>
                            <Text>
                              {" "}
                              {comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ].paxFareBreakDown.adt.taxes.toLocaleString(
                                "en-US"
                              )}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              AIT ({comboFare.item[1]?.passengerCounts.adt}{" "}
                              &#215;{" "}
                              {
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.adt.ait
                              }
                              )
                            </Text>

                            <Text>
                              {(
                                comboFare.item[1]?.passengerCounts.adt *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.adt.ait
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>Commission</Text>

                            <Text>
                              {(
                                comboFare.item[1]?.passengerCounts.adt *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.adt.discountPrice
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[1].brandedFares[comboFare?.returnIdx]
                    .paxFareBreakDown.chd !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Child Fare &gt; 5</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[1]?.passengerCounts.chd
                              } &#215;{" "}
                              {comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ].paxFareBreakDown.chd.basePrice.toLocaleString(
                                "en-US"
                              )}
                              ){" "}
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.chd *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.chd.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[1]?.passengerCounts.chd
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ].paxFareBreakDown.chd.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.chd *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.chd.taxes
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[1]?.passengerCounts.chd}{" "}
                              &#215;{" "}
                              {
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.chd.ait
                              }
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.chd *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.chd.ait
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.chd *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.chd.discountPrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[1].brandedFares[comboFare?.returnIdx]
                    .paxFareBreakDown.cnn !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>
                            Child Fare{" "}
                            {comboFare.item[1].brandedFares[
                              comboFare?.returnIdx
                            ].paxFareBreakDown.chd === null ? (
                              <></>
                            ) : (
                              <> &#60; 5</>
                            )}
                          </u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[1]?.passengerCounts.cnn
                              } &#215;{" "}
                              {comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ].paxFareBreakDown.cnn.basePrice.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.cnn *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.cnn.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[1]?.passengerCounts.cnn
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ].paxFareBreakDown.cnn.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.cnn *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.cnn.taxes
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[1]?.passengerCounts.cnn}{" "}
                              &#215;{" "}
                              {
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.cnn.ait
                              }
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.cnn *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.cnn.ait
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {(
                                comboFare.item[1]?.passengerCounts.cnn *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.cnn.discountPrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {comboFare.item[1].brandedFares[comboFare?.returnIdx]
                    .paxFareBreakDown.inf !== null ? (
                    <>
                      <div
                        className="col-lg-12 border py-1 mb-1"
                        style={{ color: "#67696a" }}
                      >
                        <h6
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#4e4e4e" }}
                        >
                          <u>Infant Fare</u>
                        </h6>
                        <div className="row mt-2" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Base Fare (
                              {
                                comboFare.item[1]?.passengerCounts.inf
                              } &#215;{" "}
                              {comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ].paxFareBreakDown.inf.basePrice.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.inf *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.inf.basePrice
                              ).toLocaleString("en-US")}{" "}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              Taxes ({
                                comboFare.item[1]?.passengerCounts.inf
                              }{" "}
                              &#215;{" "}
                              {comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ].paxFareBreakDown.inf.taxes.toLocaleString(
                                "en-US"
                              )}
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.inf *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.inf.taxes
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text>
                              {" "}
                              AIT ({comboFare.item[1]?.passengerCounts.inf}{" "}
                              &#215;{" "}
                              {
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.inf.ait
                              }
                              )
                            </Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.inf *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.inf.ait
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "12px" }}>
                          <Flex justifyContent={"space-between"}>
                            <Text> Commission</Text>

                            <Text>
                              {" "}
                              {(
                                comboFare.item[1]?.passengerCounts.inf *
                                comboFare.item[1].brandedFares[
                                  comboFare?.returnIdx
                                ].paxFareBreakDown.inf.discountPrice
                              ).toLocaleString("en-US")}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  className="col-lg-12 border py-1 mb-1 mb-3"
                  style={{ color: "#4e4e4e" }}
                >
                  <div className="row  py-2">
                    <Flex justifyContent={"space-between"}>
                      <Text> Total</Text>
                      <Text>
                        AED{" "}
                        {comboFare.item[1].brandedFares[comboFare?.returnIdx]
                          ?.paxFareBreakDown.adt !== null &&
                          (
                            comboFare.item[1].brandedFares[comboFare?.returnIdx]
                              .paxFareBreakDown.adt.totalPrice *
                              comboFare.item[1]?.passengerCounts.adt +
                            (comboFare.item[1].brandedFares[
                              comboFare?.returnIdx
                            ]?.paxFareBreakDown.chd !== null &&
                              comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ]?.paxFareBreakDown.chd.totalPrice *
                                comboFare.item[1].passengerCounts.chd) +
                            (comboFare.item[1].brandedFares[
                              comboFare?.returnIdx
                            ]?.paxFareBreakDown.cnn !== null &&
                              comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ]?.paxFareBreakDown.cnn.totalPrice *
                                comboFare.item[1]?.passengerCounts.cnn) +
                            (comboFare.item[1].brandedFares[
                              comboFare?.returnIdx
                            ]?.paxFareBreakDown.inf !== null &&
                              comboFare.item[1].brandedFares[
                                comboFare?.returnIdx
                              ]?.paxFareBreakDown.inf.totalPrice *
                                comboFare.item[1]?.passengerCounts.inf)
                          ).toLocaleString("en-US")}
                      </Text>
                    </Flex>
                  </div>
                </div>
              </>
            )}

          <div
            className="col-lg-12 border py-1 mb-1 mb-3"
            style={{ color: "#4e4e4e" }}
          >
            <div className="row  py-2">
              <Flex justifyContent={"space-between"}>
                <Text> Total payable</Text>
                <Text>
                  AED{" "}
                  {comboFare?.item[0]?.brandedFares !== null &&
                  comboFare?.item[1]?.brandedFares !== null
                    ? (
                        comboFare?.item[0]?.brandedFares?.[
                          comboFare?.departureInx
                        ]?.totalFare +
                        comboFare?.item[1]?.brandedFares?.[comboFare?.returnIdx]
                          ?.totalFare
                      ).toLocaleString("en-US")
                    : comboFare?.item[0]?.brandedFares === null &&
                      comboFare?.item[1]?.brandedFares !== null
                    ? (
                        comboFare?.item[0]?.bookingComponents[0]?.totalPrice +
                        comboFare?.item[1]?.brandedFares?.[comboFare?.returnIdx]
                          ?.totalFare
                      ).toLocaleString("en-US")
                    : comboFare?.item[0]?.brandedFares !== null &&
                      comboFare?.item[1]?.brandedFares === null
                    ? (
                        comboFare?.item[1]?.bookingComponents[0]?.totalPrice +
                        comboFare?.item[0]?.brandedFares?.[
                          comboFare?.departureInx
                        ]?.totalFare
                      ).toLocaleString("en-US")
                    : comboFare?.item[0]?.brandedFares === null &&
                      comboFare?.item[1]?.brandedFares === null &&
                      (
                        comboFare?.item[1]?.bookingComponents[0]?.totalPrice +
                        comboFare?.item[0]?.bookingComponents[0]?.totalPrice
                      ).toLocaleString("en-US")}
                </Text>
              </Flex>
            </div>
          </div>

          {hasExtraService && (
            <div
              className="col-lg-12 border py-1 mb-1"
              style={{ color: "#4e4e4e" }}
            >
              <div className="row  py-2">
                <div className="col-lg-6">
                  <h6 className="text-start fw-bold">Extra Baggage payable</h6>
                </div>
                <div className="col-lg-6">
                  <h6 className="text-end fw-bold">
                    {currency !== undefined ? currency : "AED"}{" "}
                    {totalBaggageCost(adultValue) +
                      totalBaggageCost(childValue) +
                      totalBaggageCost(infantValue)}
                  </h6>
                </div>
              </div>
            </div>
          )}

          {extraServicesLoader ? (
            <div className="col-lg-12 d-flex align-items-center justify-content-center w-100 my-3">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {hasExtraService && (
                <div
                  className="col-lg-12 border py-1 mb-1"
                  style={{ color: "#4e4e4e" }}
                >
                  <div className="row  py-2">
                    <div className="col-lg-6">
                      <h6 className="text-start fw-bold">Grand Total</h6>
                    </div>
                    <div className="col-lg-6">
                      <h6 className="text-end fw-bold">
                        {currency !== undefined ? currency : "AED"}{" "}
                        {(
                          bookingComponents[0].totalPrice +
                          totalBaggageCost(adultValue) +
                          totalBaggageCost(childValue) +
                          totalBaggageCost(infantValue)
                        ).toLocaleString("en-US")}
                      </h6>
                    </div>
                  </div>
                </div>
              )}

              {hasExtraService &&
                extraBaggageAllowedPTC.some((item) => item === "ADT") && (
                  <div className="col-lg-12 border py-1 mb-1">
                    {adultValue?.map((item, idx) =>
                      item?.aCMExtraServices?.map((baggage, idx) =>
                        baggage?.length > 0 ? (
                          <p
                            key={idx}
                            style={{ fontSize: "12px" }}
                            ml="10px"
                            color="black"
                          >
                            <span>Extra baggage </span>
                            {item.firstName && <span>for</span>}
                            <span className={"ml-1 text-primary"}>
                              {" "}
                              {item.firstName} {item.lastName}
                            </span>
                            {baggage?.map((val, index) => {
                              return (
                                <span key={index} className={"ml-2"}>
                                  {val.name}
                                  {fullObj?.directions?.map((dir, dirInx) => {
                                    return (
                                      <>
                                        {dir !== 0 && idx === dirInx && (
                                          <>
                                            {" "}
                                            ({dir[0].from} - {dir[0].to})
                                          </>
                                        )}
                                      </>
                                    );
                                  })}
                                </span>
                              );
                            })}
                          </p>
                        ) : (
                          <>
                            <p
                              style={{ fontSize: "12px" }}
                              ml="10px"
                              color="black"
                            >
                              <span> No Extra baggage</span>
                              {item.firstName && <span> for</span>}
                              <span className={"ml-1 text-primary"}>
                                {" "}
                                {item.firstName} {item.lastName}
                              </span>{" "}
                              <span className={"ml-2"}>
                                {fullObj?.directions?.map((dir, dirInx) => {
                                  return (
                                    <>
                                      {dir !== 0 && idx === dirInx && (
                                        <>
                                          {" "}
                                          ({dir[0].from} - {dir[0].to})
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                              </span>
                            </p>
                          </>
                        )
                      )
                    )}
                  </div>
                )}

              {hasExtraService &&
                extraBaggageAllowedPTC.some((item) => item === "CNN") && (
                  <div>
                    {childValue?.map((item, idx) =>
                      item?.aCMExtraServices?.map((baggage, idx) =>
                        baggage?.length > 0 ? (
                          <p
                            key={idx}
                            style={{ fontSize: "11px" }}
                            ml="10px"
                            color="black"
                          >
                            <span>Extra baggage </span>
                            {item.firstName && <span>for</span>}
                            <span className={"ml-1 text-primary"}>
                              {" "}
                              {item.firstName} {item.lastName}
                            </span>
                            {baggage?.map((val, index) => {
                              return (
                                <span key={index} className={"ml-2"}>
                                  {val.name}
                                  {fullObj?.directions?.map((dir, dirInx) => {
                                    return (
                                      <>
                                        {dir !== 0 && idx === dirInx && (
                                          <>
                                            {" "}
                                            ({dir[0].from} - {dir[0].to})
                                          </>
                                        )}
                                      </>
                                    );
                                  })}
                                </span>
                              );
                            })}
                          </p>
                        ) : (
                          <>
                            <p
                              style={{ fontSize: "11px" }}
                              ml="10px"
                              color="black"
                            >
                              <span> No Extra baggage</span>
                              {item.firstName && <span> for</span>}
                              <span className={"ml-1 text-primary"}>
                                {" "}
                                {item.firstName} {item.lastName}
                              </span>{" "}
                              <span className={"ml-2"}>
                                {fullObj?.directions?.map((dir, dirInx) => {
                                  return (
                                    <>
                                      {dir !== 0 && idx === dirInx && (
                                        <>
                                          {" "}
                                          ({dir[0].from} - {dir[0].to})
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                              </span>
                            </p>
                          </>
                        )
                      )
                    )}
                  </div>
                )}

              {hasExtraService &&
                extraBaggageAllowedPTC.some((item) => item === "INF") && (
                  <div>
                    {infantValue?.map((item, idx) =>
                      item?.aCMExtraServices?.map((baggage, idx) =>
                        baggage?.length > 0 ? (
                          <p
                            key={idx}
                            style={{ fontSize: "11px" }}
                            ml="10px"
                            color="black"
                          >
                            <span>Extra baggage </span>
                            {item.firstName && <span>for</span>}
                            <span className={"ml-1 text-primary"}>
                              {" "}
                              {item.firstName} {item.lastName}
                            </span>
                            {baggage?.map((val, index) => {
                              return (
                                <span key={index} className={"ml-2"}>
                                  {val.name}
                                  {fullObj?.directions?.map((dir, dirInx) => {
                                    return (
                                      <>
                                        {dir !== 0 && idx === dirInx && (
                                          <>
                                            {" "}
                                            ({dir[0].from} - {dir[0].to})
                                          </>
                                        )}
                                      </>
                                    );
                                  })}
                                </span>
                              );
                            })}
                          </p>
                        ) : (
                          <>
                            <p
                              style={{ fontSize: "11px" }}
                              ml="10px"
                              color="black"
                            >
                              <span> No Extra baggage</span>
                              {item.firstName && <span> for</span>}
                              <span className={"ml-1 text-primary"}>
                                {" "}
                                {item.firstName} {item.lastName}
                              </span>{" "}
                              <span className={"ml-2"}>
                                {fullObj?.directions?.map((dir, dirInx) => {
                                  return (
                                    <>
                                      {dir !== 0 && idx === dirInx && (
                                        <>
                                          {" "}
                                          ({dir[0].from} - {dir[0].to})
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                              </span>
                            </p>
                          </>
                        )
                      )
                    )}
                  </div>
                )}
            </>
          )}

          {/* //partial payment part */}

          {/* {loader ? (
            <div className="d-flex align-items-center justify-content-center my-3">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {!isAgent ? (
                <></>
              ) : (
                <>
                  {partialPaymentData?.isEligible ? (
                    <div
                      className="col-lg-12 border py-1 mb-1"
                      style={{ color: "#4e4e4e" }}
                    >
                      <div className="row  py-2">
                        <div className="col-lg-6">
                          <h6 className="text-start fw-bold">
                            Partial Payment
                          </h6>
                        </div>
                        <div className="col-lg-6">
                          <h6 className="text-end fw-bold">
                            {currency !== undefined ? currency : "AED"}{" "}
                            {partialPaymentData?.instantPay.toLocaleString(
                              "en-US"
                            )}
                          </h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <p
                            className="text-start fw-bold text-danger"
                            style={{ fontSize: "12px" }}
                          >
                            Settlement Days
                          </p>
                        </div>
                        <div className="col-lg-6">
                          <p
                            className="text-end fw-bold text-danger"
                            style={{ fontSize: "12px" }}
                          >
                            {moment(new Date())
                              .add(partialPaymentData?.settlementDays, "days")
                              .format("DD MMM,yyyy, ddd")}
                            ({partialPaymentData?.settlementDays}days)
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="col-lg-12 border py-1 mb-1"
                      style={{ color: "#4e4e4e" }}
                    >
                      <div className="row  py-2">
                        <div className="col-lg-12">
                          <h6 className="text-start fw-bold">
                            Partial Payment Not Eligible:
                          </h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <p
                            className="text-start fw-bold text-danger"
                            style={{ fontSize: "12px" }}
                          >
                            {partialPaymentData?.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )} */}
        </div>
      </div>
      {Object.keys(comboFare?.departure).length !== 0 &&
        Object.keys(comboFare?.return).length !== 0 && (
          <FlightDetails
            direction0={comboFare?.departure[comboFare?.groupDepartIndex]}
            direction1={comboFare?.return[comboFare?.groupReturnIndex]}
            isOpen={isOpen1}
            onClose={onClose1}
            brandedFaresDepature={comboFare?.item[0]?.brandedFares}
            brandedFaresReturn={comboFare?.item[1]?.brandedFares}
            selectedBrandedFareDepartureIdx={comboFare?.departureInx}
            selectedBrandedFareReturnIdx={comboFare?.returnIdx}
            passengerCountsDeparture={comboFare?.item[0]?.passengerCounts}
            passengerCountsReturn={comboFare?.item[1]?.passengerCounts}
            passengerFaresDeparture={comboFare?.item[0]?.passengerFares}
            passengerFaresReturn={comboFare?.item[1]?.passengerFares}
            bookingComponentsDeparture={comboFare?.item[0]?.bookingComponents}
            bookingComponentsReturn={comboFare?.item[0]?.bookingComponents}
            comboFare={comboFare}
          />
        )}
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
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
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
                      <div className="d-flex justify-content-center">
                        <p>No fare rules found</p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
