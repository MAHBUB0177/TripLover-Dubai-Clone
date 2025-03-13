import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import ShowModal from "../../ShowAllFlightPage/ShowModal/ShowModal";
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
import { toast } from "react-toastify";
import moment from "moment";
import { Flex, Text } from "@chakra-ui/react";
import { FaareRulesinfo, getFareRules } from "../../../common/allApi";

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
  const navigation = useNavigate();
  // const data = localStorage.getItem('Database');
  const filterParam = JSON.parse(sessionStorage.getItem("Database"));
  const brandedFareSelectedIdx = JSON.parse(
    sessionStorage.getItem("brandedFareSelectedIdx")
  );
  const brandedFareList = JSON.parse(sessionStorage.getItem("brandedFareList"));
  const currency = JSON.parse(sessionStorage.getItem("currency"));
  const flightType = filterParam.tripTypeModify;
  const direction0 = JSON.parse(sessionStorage.getItem("direction0"));
  const direction1 = JSON.parse(sessionStorage.getItem("direction1"));
  const direction2 = JSON.parse(sessionStorage.getItem("direction2"));
  const direction3 = JSON.parse(sessionStorage.getItem("direction3"));
  const direction4 = JSON.parse(sessionStorage.getItem("direction4"));
  const direction5 = JSON.parse(sessionStorage.getItem("direction5"));
  const totalPrice = JSON.parse(sessionStorage.getItem("totalPrice"));
  const passengerFares = JSON.parse(sessionStorage.getItem("passengerFares"));
  const passengerCounts = JSON.parse(sessionStorage.getItem("passengerCounts"));
  const extraBaggageAllowedPTC = JSON.parse(
    sessionStorage.getItem("extraBaggageAllowedPTC")
  );
  const bookingComponents = JSON.parse(
    sessionStorage.getItem("bookingComponents")
  );
  const itemCodeRef = JSON.parse(sessionStorage.getItem("itemCodeRef"));
  const uniqueTransID = JSON.parse(sessionStorage.getItem("uniqueTransID"));
  const refundable = JSON.parse(sessionStorage.getItem("refundable"));
  const fullObj = JSON.parse(sessionStorage.getItem("fullObj"));
  const contact = localStorage.getItem("contact");
  const ImageUrlD = `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${direction0.platingCarrierCode}.png`;
  const ImageUrlR =
    Object.keys(direction1).length > 0
      ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${direction1.platingCarrierCode}.png`
      : ``;

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
            {flightType === "Multi City" ? (
              <></>
            ) : (
              <>
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
              </>
            )}
          </div>
          <div className="position-relative" id={"show-option"}>
            <div className="position-absolute top-100 start-50 translate-middle">
              <p className="flight-details">
                <Link
                  to=""
                  className="my-auto text-color fw-bold text-center ms-4 pe-3"
                  data-bs-toggle="modal"
                  data-bs-target={"#exampleModal" + 0}
                >
                  Flight Details
                </Link>
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
                  if (brandedFareList !== null && brandedFareList.length > 0) {
                    handleFareRules(
                      uniqueTransID,
                      direction0,
                      itemCodeRef,
                      brandedFareList[brandedFareSelectedIdx]?.ref
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
          {brandedFareList !== null && brandedFareList.length > 0 ? (
            <>
              {brandedFareList[brandedFareSelectedIdx].paxFareBreakDown.adt !==
              null ? (
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
                          Base Fare ({passengerCounts.adt} &#215;{" "}
                          {brandedFareList[
                            brandedFareSelectedIdx
                          ].paxFareBreakDown.adt.basePrice.toLocaleString(
                            "en-US"
                          )}
                          ){" "}
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.adt *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.adt.basePrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>

                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          Taxes ({passengerCounts.adt} &#215;{" "}
                          {brandedFareList[
                            brandedFareSelectedIdx
                          ].paxFareBreakDown.adt.taxes.toLocaleString("en-US")}
                          )
                        </Text>
                        <Text>
                          {" "}
                          {(
                            passengerCounts.adt *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.adt.taxes
                          ).toLocaleString("en-US")}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          AIT ({passengerCounts.adt} &#215;{" "}
                          {
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.adt.ait
                          }
                          )
                        </Text>

                        <Text>
                          {(
                            passengerCounts.adt *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.adt.ait
                          ).toLocaleString("en-US")}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>Commission</Text>

                        <Text>
                          {(
                            passengerCounts.adt *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.adt.discountPrice
                          ).toLocaleString("en-US")}
                        </Text>
                      </Flex>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {brandedFareList[brandedFareSelectedIdx].paxFareBreakDown.chd !==
              null ? (
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
                          Base Fare ({passengerCounts.chd} &#215;{" "}
                          {brandedFareList[
                            brandedFareSelectedIdx
                          ].paxFareBreakDown.chd.basePrice.toLocaleString(
                            "en-US"
                          )}
                          ){" "}
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.chd *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.chd.basePrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          Taxes ({passengerCounts.chd} &#215;{" "}
                          {brandedFareList[
                            brandedFareSelectedIdx
                          ].paxFareBreakDown.chd.taxes.toLocaleString("en-US")}
                          )
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.chd *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.chd.taxes
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          AIT ({passengerCounts.chd} &#215;{" "}
                          {
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.chd.ait
                          }
                          )
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.chd *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.chd.ait
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
                            passengerCounts.chd *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.chd.discountPrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {brandedFareList[brandedFareSelectedIdx].paxFareBreakDown.cnn !==
              null ? (
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
                        {brandedFareList[brandedFareSelectedIdx]
                          .paxFareBreakDown.chd === null ? (
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
                          Base Fare ({passengerCounts.cnn} &#215;{" "}
                          {brandedFareList[
                            brandedFareSelectedIdx
                          ].paxFareBreakDown.cnn.basePrice.toLocaleString(
                            "en-US"
                          )}
                          )
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.cnn *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.cnn.basePrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          Taxes ({passengerCounts.cnn} &#215;{" "}
                          {brandedFareList[
                            brandedFareSelectedIdx
                          ].paxFareBreakDown.cnn.taxes.toLocaleString("en-US")}
                          )
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.cnn *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.cnn.taxes
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          AIT ({passengerCounts.cnn} &#215;{" "}
                          {
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.cnn.ait
                          }
                          )
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.cnn *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.cnn.ait
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text> Commission</Text>

                        <Text>
                          {(
                            passengerCounts.cnn *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.cnn.discountPrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {brandedFareList[brandedFareSelectedIdx].paxFareBreakDown.inf !==
              null ? (
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
                          Base Fare ({passengerCounts.inf} &#215;{" "}
                          {brandedFareList[
                            brandedFareSelectedIdx
                          ].paxFareBreakDown.inf.basePrice.toLocaleString(
                            "en-US"
                          )}
                          )
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.inf *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.inf.basePrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          Taxes ({passengerCounts.inf} &#215;{" "}
                          {brandedFareList[
                            brandedFareSelectedIdx
                          ].paxFareBreakDown.inf.taxes.toLocaleString("en-US")}
                          )
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.inf *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.inf.taxes
                          ).toLocaleString("en-US")}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          AIT ({passengerCounts.inf} &#215;{" "}
                          {
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.inf.ait
                          }
                          )
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.inf *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.inf.ait
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
                            passengerCounts.inf *
                            brandedFareList[brandedFareSelectedIdx]
                              .paxFareBreakDown.inf.discountPrice
                          ).toLocaleString("en-US")}
                        </Text>
                      </Flex>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              {passengerFares.adt !== null ? (
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
                          Base Fare ({passengerCounts.adt} &#215;{" "}
                          {passengerFares.adt.basePrice.toLocaleString("en-US")}
                          ){" "}
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.adt * passengerFares.adt.basePrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>

                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          Taxes ({passengerCounts.adt} &#215;{" "}
                          {passengerFares.adt.taxes.toLocaleString("en-US")})
                        </Text>
                        <Text>
                          {" "}
                          {(
                            passengerCounts.adt * passengerFares.adt.taxes
                          ).toLocaleString("en-US")}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          AIT ({passengerCounts.adt} &#215;{" "}
                          {passengerFares.adt.ait})
                        </Text>

                        <Text>
                          {(
                            passengerCounts.adt * passengerFares.adt.ait
                          ).toLocaleString("en-US")}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>Commission</Text>

                        <Text>
                          {(
                            passengerCounts.adt *
                            passengerFares.adt.discountPrice
                          ).toLocaleString("en-US")}
                        </Text>
                      </Flex>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {passengerFares.chd !== null ? (
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
                          Base Fare ({passengerCounts.chd} &#215;{" "}
                          {passengerFares.chd.basePrice.toLocaleString("en-US")}
                          ){" "}
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.chd * passengerFares.chd.basePrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          Taxes ({passengerCounts.chd} &#215;{" "}
                          {passengerFares.chd.taxes.toLocaleString("en-US")})
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.chd * passengerFares.chd.taxes
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          AIT ({passengerCounts.chd} &#215;{" "}
                          {passengerFares.chd.ait})
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.chd * passengerFares.chd.ait
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
                            passengerCounts.chd *
                            passengerFares.chd.discountPrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {passengerFares.cnn !== null ? (
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
                        {passengerFares.chd === null ? <></> : <> &#60; 5</>}
                      </u>
                    </h6>
                    <div className="row mt-2" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          Base Fare ({passengerCounts.cnn} &#215;{" "}
                          {passengerFares.cnn.basePrice.toLocaleString("en-US")}
                          )
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.cnn * passengerFares.cnn.basePrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          Taxes ({passengerCounts.cnn} &#215;{" "}
                          {passengerFares.cnn.taxes.toLocaleString("en-US")})
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.cnn * passengerFares.cnn.taxes
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          AIT ({passengerCounts.cnn} &#215;{" "}
                          {passengerFares.cnn.ait})
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.cnn * passengerFares.cnn.ait
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text> Commission</Text>

                        <Text>
                          {(
                            passengerCounts.cnn *
                            passengerFares.cnn.discountPrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {passengerFares.inf !== null ? (
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
                          Base Fare ({passengerCounts.inf} &#215;{" "}
                          {passengerFares.inf.basePrice.toLocaleString("en-US")}
                          )
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.inf * passengerFares.inf.basePrice
                          ).toLocaleString("en-US")}{" "}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          Taxes ({passengerCounts.inf} &#215;{" "}
                          {passengerFares.inf.taxes.toLocaleString("en-US")})
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.inf * passengerFares.inf.taxes
                          ).toLocaleString("en-US")}
                        </Text>
                      </Flex>
                    </div>
                    <div className="row" style={{ fontSize: "12px" }}>
                      <Flex justifyContent={"space-between"}>
                        <Text>
                          {" "}
                          AIT ({passengerCounts.inf} &#215;{" "}
                          {passengerFares.inf.ait})
                        </Text>

                        <Text>
                          {" "}
                          {(
                            passengerCounts.inf * passengerFares.inf.ait
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
                            passengerCounts.inf *
                            passengerFares.inf.discountPrice
                          ).toLocaleString("en-US")}
                        </Text>
                      </Flex>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}

          <div
            className="col-lg-12 border py-1 mb-1"
            style={{ color: "#4e4e4e" }}
          >
            <div className="row  py-2">
              <Flex justifyContent={"space-between"}>
                <Text> Total payable</Text>
                <Text>
                  {" "}
                  {currency !== undefined ? currency : "AED"}{" "}
                  {brandedFareList !== null && brandedFareList.length > 0 ? (
                    <>
                      {brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown
                        .adt !== null &&
                        (
                          brandedFareList[brandedFareSelectedIdx]
                            ?.paxFareBreakDown.adt.totalPrice *
                            passengerCounts.adt +
                          (brandedFareList[brandedFareSelectedIdx]
                            ?.paxFareBreakDown.chd !== null &&
                            brandedFareList[brandedFareSelectedIdx]
                              ?.paxFareBreakDown.chd.totalPrice *
                              passengerCounts.chd) +
                          (brandedFareList[brandedFareSelectedIdx]
                            ?.paxFareBreakDown.cnn !== null &&
                            brandedFareList[brandedFareSelectedIdx]
                              ?.paxFareBreakDown.cnn.totalPrice *
                              passengerCounts.cnn) +
                          (brandedFareList[brandedFareSelectedIdx]
                            ?.paxFareBreakDown.inf !== null &&
                            brandedFareList[brandedFareSelectedIdx]
                              ?.paxFareBreakDown.inf.totalPrice *
                              passengerCounts.inf)
                        ).toLocaleString("en-US")}
                    </>
                  ) : (
                    <>
                      {bookingComponents[0].totalPrice.toLocaleString("en-US")}
                    </>
                  )}
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

          {loader ? (
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
          )}
        </div>
      </div>
      <ShowModal
        key={0}
        flag={1}
        index={0}
        flightType={flightType}
        direction0={direction0}
        direction1={direction1}
        direction2={direction2}
        direction3={direction3}
        direction4={direction4}
        direction5={direction5}
        bookingComponents={bookingComponents}
        refundable={refundable}
        totalPrice={totalPrice}
        passengerFares={passengerFares}
        passengerCounts={passengerCounts}
        currency={currency}
        uniqueTransID={uniqueTransID}
        itemCodeRef={itemCodeRef}
        brandedFares={brandedFareList}
        selectedBrandedFareIdx={brandedFareSelectedIdx}
      ></ShowModal>
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
