import React, { useEffect, useState } from "react";
import $ from "jquery";
import airports from "../../../JSON/airports.json";
import "./ShowModal.css";
import moment from "moment";
import layOver from "../../SharePages/Utility/layOver";
import { environment } from "../../SharePages/Utility/environment";
import {
  addDurations,
  passengerType,
  sumTaxesDiscount,
  timeDuration,
  totalFlightDuration,
} from "../../../common/functions";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { Text } from "@chakra-ui/react";
const ShowModal = ({
  flag,
  index,
  direction0,
  direction1,
  direction2,
  direction3,
  direction4,
  direction5,
  flightType,
  totalPrice,
  bookingComponents,
  refundable,
  itemCodeRef,
  uniqueTransID,
  passengerCounts,
  passengerFares,
  currency,
  brandedFares,
  selectedBrandedFareIdx,
  notes,
}) => {

  console.log(direction0,'direction0=============')
  const searchData = JSON.parse(sessionStorage.getItem("Database"));
  const ImageUrlD =
    environment.s3ArliensImage + `${direction0.platingCarrierCode}.png`;
  const ImageUrlR =
    Object.keys(direction1).length > 0
      ? environment.s3ArliensImage + `${direction1.platingCarrierCode}.png`
      : ``;
  useEffect(() => {
    $(document).ready(function () {
      $("#flightId" + index).attr("style", "background:#390404c8");
      $("#baggageId" + index).attr("style", "background:#EC1C1E");
      $("#changeId" + index).attr("style", "background:#EC1C1E");
      $("#fareId" + index).attr("style", "background:#EC1C1E");
    });

    $("#flightId" + index).click(function () {
      $("#flightId" + index).attr("style", "background:#390404c8");
      $("#baggageId" + index).attr("style", "background:#EC1C1E");
      $("#changeId" + index).attr("style", "background:#EC1C1E");
      $("#fareId" + index).attr("style", "background:#EC1C1E");
    });

    $("#baggageId" + index).click(function () {
      $("#flightId" + index).attr("style", "background:#EC1C1E");
      $("#baggageId" + index).attr("style", "background:#390404c8");
      $("#changeId" + index).attr("style", "background:#EC1C1E");
      $("#fareId" + index).attr("style", "background:#EC1C1E");
    });

    $("#changeId" + index).click(function () {
      $("#flightId" + index).attr("style", "background:#EC1C1E");
      $("#baggageId" + index).attr("style", "background:#EC1C1E");
      $("#changeId" + index).attr("style", "background:#390404c8");
      $("#fareId" + index).attr("style", "background:#EC1C1E");
    });

    $("#fareId" + index).click(function () {
      $("#flightId" + index).attr("style", "background:#EC1C1E");
      $("#baggageId" + index).attr("style", "background:#EC1C1E");
      $("#changeId" + index).attr("style", "background:#EC1C1E");
      $("#fareId" + index).attr("style", "background:#390404c8");
    });

    $("#select-click" + index).click(function () {
      $(".modal-backdrop").remove();
      $("body").removeClass("modal-open");
      $("body").removeAttr("style");
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
    });
  }, []);

  return (
    <>
      <div
        className="modal fade"
        id={"exampleModal" + index}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-keyboard="false"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target={"#home" + index}
                    type="button"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    Flight details
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target={"#profile" + index}
                    type="button"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    Fare details
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="contact-tab"
                    data-bs-toggle="tab"
                    data-bs-target={"#contact" + index}
                    type="button"
                    role="tab"
                    aria-controls="contact"
                    aria-selected="false"
                  >
                    Baggage info
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="about-tab"
                    data-bs-toggle="tab"
                    data-bs-target={"#about" + index}
                    type="button"
                    role="tab"
                    aria-controls="about"
                    aria-selected="false"
                  >
                    Fare Policy
                  </button>
                </li>
                {notes?.length > 0 && (
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="info-tab"
                      data-bs-toggle="tab"
                      data-bs-target={"#info" + index}
                      type="button"
                      role="tab"
                      aria-controls="info"
                      aria-selected="false"
                    >
                      Information
                    </button>
                  </li>
                )}
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id={"home" + index}
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <>
                    <div className="p-2">
                      <div className="container">
                        {direction0.segments.map((seg, index) => (
                          <React.Fragment key={index}>
                            {!direction0?.segments?.every(
                              (item) =>
                                item.airlineCode ===
                                direction0?.platingCarrierCode
                            ) &&
                              index === 0 && (
                                <div className="my-2 d-flex gap-2 align-items-start">
                                  <i
                                    className="fa fa-info-circle"
                                    aria-hidden="true"
                                  ></i>
                                  <p style={{ fontSize: "13px" }}>
                                    This flight includes a codeshare segment.
                                    Bangladeshi passport holders may need a
                                    transit visa for travel. Please verify visa
                                    requirements based on your nationality
                                    before booking your ticket.
                                  </p>
                                </div>
                              )}
                            {direction0?.stops > 1 && index === 0 && (
                              <div className="my-2 d-flex gap-2 align-items-start">
                                <i
                                  class="fa fa-info-circle"
                                  aria-hidden="true"
                                ></i>
                                <p style={{ fontSize: "13px" }}>
                                  This flight has multiple stopovers. Please
                                  check the visa requirements for each stop
                                  based on your nationality before booking.
                                </p>
                              </div>
                            )}

                            <div>
                              {index === 0 ? (
                                <div
                                  className="row py-2 px-0 border button-color text-white"
                                  // style={{ backgroundColor: "	white" }}
                                >
                                  <div className="col-lg-3 text-start">
                                    <span className="d-inline fs-6 fw-bold ms-1">
                                      Departure,{" "}
                                      {airports
                                        .filter((f) => f.iata === seg.from)
                                        .map((item) => item.city)}
                                    </span>
                                  </div>
                                  <div className="col-lg-3 text-center">
                                    <i className="fas fa-plane fa-sm"></i>
                                  </div>
                                  <div className="col-lg-3">
                                    <span className="d-inline fs-6 fw-bold">
                                      Arrival,{" "}
                                      {airports
                                        .filter(
                                          (f) =>
                                            f.iata ===
                                            direction0.segments[
                                              direction0.segments.length - 1
                                            ].to
                                        )
                                        .map((item) => item.city)}
                                    </span>
                                  </div>
                                  <div className="col-lg-3 fs-6 fw-bold">
                                    <span>
                                      Duration :{" "}
                                      {direction0.segments.length === 1
                                        ? totalFlightDuration(
                                            direction0.segments
                                          )
                                        : direction0.segments.length === 2
                                        ? addDurations([
                                            totalFlightDuration(
                                              direction0.segments
                                            ),
                                            timeDuration(
                                              direction0.segments[index]
                                                .arrival,
                                              direction0.segments[index + 1]
                                                .departure
                                            ),
                                          ])
                                        : direction0.segments.length === 3
                                        ? addDurations([
                                            totalFlightDuration(
                                              direction0.segments
                                            ),
                                            timeDuration(
                                              direction0.segments[index]
                                                .arrival,
                                              direction0.segments[index + 1]
                                                .departure
                                            ),
                                            timeDuration(
                                              direction0.segments[index + 1]
                                                .arrival,
                                              direction0.segments[index + 2]
                                                .departure
                                            ),
                                          ])
                                        : ""}
                                    </span>
                                    {direction0.segments.length > 1 && (
                                      <Text fontSize={"xs"} fontWeight={200}>
                                        (including layover time)
                                      </Text>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <></>
                              )}
                              {seg.details.length > 1 ? (
                                seg.details.map((item, idx) => {
                                  return (
                                    <>
                                      {index === seg.details.length - 1 ? (
                                        <></>
                                      ) : seg.details.length > 1 ? (
                                        <>
                                          {idx === 0 ? (
                                            <></>
                                          ) : (
                                            <>
                                              <div className="row my-2">
                                                <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                                  {" "}
                                                  Layover : &nbsp;
                                                  {layOver(
                                                    seg.details[index + 1]
                                                      ?.departure,
                                                    seg.details[index]?.arrival
                                                  )}
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      {index === 0 ? (
                                        <></>
                                      ) : (
                                        <div className="row my-2">
                                          <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                            {" "}
                                            Layover : &nbsp;
                                            {idx === 0 ? (
                                              <>
                                                {layOver(
                                                  direction0.segments[index]
                                                    ?.departure,
                                                  direction0.segments[index - 1]
                                                    ?.arrival
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                {layOver(
                                                  seg.details[index]?.departure,
                                                  seg.details[index - 1]
                                                    ?.arrival
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      <div className="row py-4 p-2 border mb-2 align-items-center shadow">
                                        <div className="col-lg-1">
                                          <img
                                            src={
                                              environment.s3ArliensImage +
                                              `${seg.airlineCode}.png`
                                            }
                                            alt=""
                                            width="40px"
                                            height="40px"
                                          />
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
                                  {/* <span>Segments</span> */}
                                  {index !== 0 ? (
                                    <div className="row my-2">
                                      <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                        {" "}
                                        Layover :&nbsp;
                                        {layOver(
                                          direction0.segments[index]?.departure,
                                          direction0.segments[index - 1]
                                            ?.arrival
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                  <div className="row py-4 p-2 border align-items-center shadow">
                                    <div className="col-lg-1">
                                      <img
                                        src={
                                          environment.s3ArliensImage +
                                          `${seg.airlineCode}.png`
                                        }
                                        alt=""
                                        width="40px"
                                        height="40px"
                                      />
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
                                          {brandedFares !== null &&
                                          brandedFares !== undefined &&
                                          brandedFares?.length > 0 ? (
                                            <>
                                              {Object.keys(
                                                brandedFares[
                                                  selectedBrandedFareIdx
                                                ].bookingClasses
                                              ).map((innerKey, idex) => {
                                                return (
                                                  <>
                                                    {index === idex && (
                                                      <span>
                                                        {
                                                          brandedFares[
                                                            selectedBrandedFareIdx
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
                                          ){" "}
                                          {seg.bookingCount > 0 && (
                                            <>Seats({seg.bookingCount})</>
                                          )}
                                        </span>
                                      </p>
                                      <p className="my-auto text-start">
                                        {seg.details[0].equipment}
                                      </p>
                                      <p className="my-auto text-start">
                                        <span
                                          style={{ fontSize: "13px" }}
                                          className="fw-bold"
                                        >
                                          {brandedFares !== null &&
                                          brandedFares !== undefined &&
                                          brandedFares?.length > 0 ? (
                                            <>
                                              {Object.keys(
                                                brandedFares[
                                                  selectedBrandedFareIdx
                                                ].cabinClasses
                                              ).map((innerKey, idex) => {
                                                return (
                                                  <>
                                                    {index === idex && (
                                                      <span>
                                                        {brandedFares[
                                                          selectedBrandedFareIdx
                                                        ].cabinClasses[
                                                          innerKey
                                                        ] !== ""
                                                          ? brandedFares[
                                                              selectedBrandedFareIdx
                                                            ].cabinClasses[
                                                              innerKey
                                                            ]
                                                          : searchData?.travelClass}
                                                      </span>
                                                    )}
                                                  </>
                                                );
                                              })}
                                            </>
                                          ) : (
                                            <>
                                              {seg.cabinClass
                                                ? seg.cabinClass
                                                : seg.serviceClass}
                                            </>
                                          )}
                                        </span>
                                      </p>
                                    </div>
                                    <div className="col-lg-4">
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
                                    <div className="col-lg-4">
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
                                  </div>
                                </>
                              )}
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="container my-1">
                        <>
                          {Object.keys(direction1).length > 0 ? (
                            <>
                              {!direction1?.segments?.every(
                                (item) =>
                                  item.airlineCode ===
                                  direction1?.platingCarrierCode
                              ) && (
                                <div className="my-2 d-flex gap-2 align-items-start">
                                  <i
                                    className="fa fa-info-circle"
                                    aria-hidden="true"
                                  ></i>
                                  <p style={{ fontSize: "13px" }}>
                                    This flight includes a codeshare segment.
                                    Bangladeshi passport holders may need a
                                    transit visa for travel. Please verify visa
                                    requirements based on your nationality
                                    before booking your ticket.
                                  </p>
                                </div>
                              )}
                              {direction1?.stops > 1 && (
                                <div className="my-2 d-flex gap-2 align-items-start">
                                  <i
                                    class="fa fa-info-circle"
                                    aria-hidden="true"
                                  ></i>
                                  <p style={{ fontSize: "13px" }}>
                                    This flight has multiple stopovers. Please
                                    check the visa requirements for each stop
                                    based on your nationality before booking.
                                  </p>
                                </div>
                              )}
                              <div className="row border py-2 px-0 button-color text-white">
                                <div className="col-lg-3 text-start">
                                  <span className="d-inline fs-6 fw-bold ms-1">
                                    Departure,{" "}
                                    {airports
                                      .filter(
                                        (f) =>
                                          f.iata === direction1.segments[0].from
                                      )
                                      .map((item) => item.city)}
                                  </span>
                                </div>
                                <div className="col-lg-3 text-center">
                                  <i className="fas fa-plane"></i>
                                </div>
                                <div className="col-lg-3">
                                  <span className="d-inline fs-6 fw-bold">
                                    Arrival,{" "}
                                    {airports
                                      .filter(
                                        (f) =>
                                          f.iata ===
                                          direction1.segments[
                                            direction1.segments.length - 1
                                          ].to
                                      )
                                      .map((item) => item.city)}
                                  </span>
                                </div>
                                <div className="col-lg-3 fs-6 fw-bold">
                                  <span>
                                    Duration :{" "}
                                    {direction1.segments.length === 1
                                      ? totalFlightDuration(direction1.segments)
                                      : direction1.segments.length === 2
                                      ? addDurations([
                                          totalFlightDuration(
                                            direction1.segments
                                          ),
                                          timeDuration(
                                            direction1.segments[0].arrival,
                                            direction1.segments[1].departure
                                          ),
                                        ])
                                      : direction1.segments.length === 3
                                      ? addDurations([
                                          totalFlightDuration(
                                            direction1.segments
                                          ),
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
                                  {direction1.segments.length > 1 && (
                                    <Text fontSize={"xs"} fontWeight={200}>
                                      (including layover time)
                                    </Text>
                                  )}
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          {Object.keys(direction1).length > 0 ? (
                            direction1.segments.map((seg, index) => (
                              <>
                                {seg.details.length > 1 ? (
                                  seg.details.map((item, idx) => {
                                    return (
                                      <>
                                        {index === seg.details.length - 1 ? (
                                          <></>
                                        ) : seg.details.length > 1 ? (
                                          <>
                                            {idx === 0 ? (
                                              <></>
                                            ) : (
                                              <>
                                                <div className="row my-2">
                                                  <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                                    {" "}
                                                    Layover : &nbsp;
                                                    {layOver(
                                                      seg.details[index + 1]
                                                        ?.departure,
                                                      seg.details[index]
                                                        ?.arrival
                                                    )}
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                        {index === 0 ? (
                                          <></>
                                        ) : (
                                          <div className="row my-2">
                                            <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                              {" "}
                                              Layover : &nbsp;
                                              {/* {layOver(
                                              seg.details[index]?.departure,
                                              seg.details[index - 1]?.arrival
                                            )} */}
                                              {idx === 0 ? (
                                                <>
                                                  {layOver(
                                                    direction1.segments[index]
                                                      ?.departure,
                                                    direction1.segments[
                                                      index - 1
                                                    ]?.arrival
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {layOver(
                                                    seg.details[index]
                                                      ?.departure,
                                                    seg.details[index - 1]
                                                      ?.arrival
                                                  )}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                        <div className="row py-4 p-2 border mb-2 align-items-center shadow">
                                          <div className="col-lg-1">
                                            <img
                                              src={
                                                environment.s3ArliensImage +
                                                `${seg.airlineCode}.png`
                                              }
                                              alt=""
                                              width="40px"
                                              height="40px"
                                            />
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
                                    {index !== 0 ? (
                                      <div className="row my-2">
                                        <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                          {" "}
                                          Layover : &nbsp;
                                          {layOver(
                                            direction1.segments[index]
                                              ?.departure,
                                            direction1.segments[index - 1]
                                              ?.arrival
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                    <div className="row py-4 p-2 border align-items-center shadow">
                                      <div className="col-lg-1">
                                        <img
                                          src={
                                            environment.s3ArliensImage +
                                            `${seg.airlineCode}.png`
                                          }
                                          alt=""
                                          width="40px"
                                          height="40px"
                                        />
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
                                            {brandedFares !== null &&
                                            brandedFares !== undefined &&
                                            brandedFares?.length > 0 ? (
                                              <>
                                                {Object.keys(
                                                  brandedFares[
                                                    selectedBrandedFareIdx
                                                  ].bookingClasses
                                                ).map((innerKey, idex) => {
                                                  return (
                                                    <>
                                                      {idex ===
                                                        index +
                                                          direction0.segments
                                                            .length && (
                                                        <span>
                                                          {
                                                            brandedFares[
                                                              selectedBrandedFareIdx
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
                                            ){" "}
                                            {seg.bookingCount > 0 && (
                                              <>Seats({seg.bookingCount})</>
                                            )}
                                          </span>
                                        </p>

                                        <p className="my-auto text-start">
                                          {seg.details[0].equipment}
                                        </p>
                                        <p className="my-auto text-start">
                                          <span
                                            style={{ fontSize: "13px" }}
                                            className="fw-bold"
                                          >
                                            {brandedFares !== null &&
                                            brandedFares !== undefined &&
                                            brandedFares?.length > 0 ? (
                                              <>
                                                {Object.keys(
                                                  brandedFares[
                                                    selectedBrandedFareIdx
                                                  ].cabinClasses
                                                ).map((innerKey, idex) => {
                                                  return (
                                                    <>
                                                      {idex ===
                                                        index +
                                                          direction0.segments
                                                            .length && (
                                                        <span>
                                                          {brandedFares[
                                                            selectedBrandedFareIdx
                                                          ].cabinClasses[
                                                            innerKey
                                                          ] !== ""
                                                            ? brandedFares[
                                                                selectedBrandedFareIdx
                                                              ].cabinClasses[
                                                                innerKey
                                                              ]
                                                            : searchData?.travelClass}
                                                        </span>
                                                      )}
                                                    </>
                                                  );
                                                })}
                                              </>
                                            ) : (
                                              <>
                                                {seg.cabinClass
                                                  ? seg.cabinClass
                                                  : seg.serviceClass}
                                              </>
                                            )}
                                          </span>
                                        </p>
                                      </div>
                                      <div className="col-lg-4">
                                        <span className="float-start fw-bold">
                                          {seg.from}{" "}
                                          <strong>
                                            {seg.departure.substr(11, 5)}
                                          </strong>
                                        </span>
                                        <br></br>
                                        <span className="float-start">
                                          {moment(seg.departure).format(
                                            "DD MMMM,yyyy, ddd"
                                          )}
                                        </span>
                                        <br></br>
                                        <h6 className="text-start">
                                          {seg.fromAirport}
                                        </h6>
                                      </div>
                                      <div className="col-lg-4">
                                        <span className="float-start fw-bold">
                                          {seg.to}{" "}
                                          <strong>
                                            {seg.arrival.substr(11, 5)}
                                          </strong>
                                        </span>
                                        <br />
                                        <span className="float-start">
                                          {moment(seg.arrival).format(
                                            "DD MMMM,yyyy, ddd"
                                          )}
                                        </span>
                                        <br></br>
                                        <h6 className="text-start">
                                          {seg.toAirport}
                                        </h6>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </>
                            ))
                          ) : (
                            <></>
                          )}
                        </>
                      </div>
                      {flightType === "Multi City" ? (
                        <div className="container">
                          {direction2.segments !== undefined ? (
                            <>
                              {direction2.segments.map((seg, index) => (
                                <React.Fragment key={index}>
                                  {!direction2?.segments?.every(
                                    (item) =>
                                      item.airlineCode ===
                                      direction2?.platingCarrierCode
                                  ) &&
                                    index === 0 && (
                                      <div className="my-2 d-flex gap-2 align-items-start">
                                        <i
                                          className="fa fa-info-circle"
                                          aria-hidden="true"
                                        ></i>
                                        <p style={{ fontSize: "13px" }}>
                                          This flight includes a codeshare
                                          segment. Bangladeshi passport holders
                                          may need a transit visa for travel.
                                          Please verify visa requirements based
                                          on your nationality before booking
                                          your ticket.
                                        </p>
                                      </div>
                                    )}
                                  {direction2?.stops > 1 && index === 0 && (
                                    <div className="my-2 d-flex gap-2 align-items-start">
                                      <i
                                        class="fa fa-info-circle"
                                        aria-hidden="true"
                                      ></i>
                                      <p style={{ fontSize: "13px" }}>
                                        This flight has multiple stopovers.
                                        Please check the visa requirements for
                                        each stop based on your nationality
                                        before booking.
                                      </p>
                                    </div>
                                  )}
                                  <div key={index}>
                                    {index === 0 ? (
                                      <div className="row py-2 px-0 border button-color text-white">
                                        <div className="col-lg-3 text-start">
                                          <span className="d-inline fs-6 fw-bold ms-1">
                                            Departure,{" "}
                                            {airports
                                              .filter(
                                                (f) => f.iata === seg.from
                                              )
                                              .map((item) => item.city)}
                                          </span>
                                        </div>
                                        <div className="col-lg-3 text-center">
                                          <i className="fas fa-plane fa-sm"></i>
                                        </div>
                                        <div className="col-lg-3">
                                          <span className="d-inline fs-6 fw-bold">
                                            Arrival,{" "}
                                            {airports
                                              .filter(
                                                (f) =>
                                                  f.iata ===
                                                  direction2.segments[
                                                    direction2.segments.length -
                                                      1
                                                  ].to
                                              )
                                              .map((item) => item.city)}
                                          </span>
                                        </div>
                                        <div className="col-lg-3 fs-6 fw-bold">
                                          <span>
                                            Duration :{" "}
                                            {direction2.segments.length === 1
                                              ? totalFlightDuration(
                                                  direction2.segments
                                                )
                                              : direction2.segments.length === 2
                                              ? addDurations([
                                                  totalFlightDuration(
                                                    direction2.segments
                                                  ),
                                                  timeDuration(
                                                    direction2.segments[index]
                                                      .arrival,
                                                    direction2.segments[
                                                      index + 1
                                                    ].departure
                                                  ),
                                                ])
                                              : direction2.segments.length === 3
                                              ? addDurations([
                                                  totalFlightDuration(
                                                    direction2.segments
                                                  ),
                                                  timeDuration(
                                                    direction2.segments[index]
                                                      .arrival,
                                                    direction2.segments[
                                                      index + 1
                                                    ].departure
                                                  ),
                                                  timeDuration(
                                                    direction2.segments[
                                                      index + 1
                                                    ].arrival,
                                                    direction2.segments[
                                                      index + 2
                                                    ].departure
                                                  ),
                                                ])
                                              : ""}
                                          </span>
                                          {direction2.segments.length > 1 && (
                                            <Text
                                              fontSize={"xs"}
                                              fontWeight={200}
                                            >
                                              (including layover time)
                                            </Text>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                    {seg.details.length > 1 ? (
                                      seg.details.map((item, idx) => {
                                        return (
                                          <>
                                            {index ===
                                            seg.details.length - 1 ? (
                                              <></>
                                            ) : seg.details.length > 1 ? (
                                              <>
                                                {idx === 0 ? (
                                                  <></>
                                                ) : (
                                                  <>
                                                    <div className="row my-2">
                                                      <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                                        {" "}
                                                        Layover : &nbsp;
                                                        {layOver(
                                                          seg.details[index + 1]
                                                            ?.departure,
                                                          seg.details[index]
                                                            ?.arrival
                                                        )}
                                                      </div>
                                                    </div>
                                                  </>
                                                )}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                            {index === 0 ? (
                                              <></>
                                            ) : (
                                              <div className="row my-2">
                                                <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                                  {" "}
                                                  Layover : &nbsp;
                                                  {/* {layOver(
                                                seg.details[index]?.departure,
                                                seg.details[index - 1]?.arrival
                                              )} */}
                                                  {idx === 0 ? (
                                                    <>
                                                      {layOver(
                                                        direction2.segments[
                                                          index
                                                        ]?.departure,
                                                        direction2.segments[
                                                          index - 1
                                                        ]?.arrival
                                                      )}
                                                    </>
                                                  ) : (
                                                    <>
                                                      {layOver(
                                                        seg.details[index]
                                                          ?.departure,
                                                        seg.details[index - 1]
                                                          ?.arrival
                                                      )}
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                            <div className="row py-4 p-2 border mb-2 align-items-center shadow">
                                              <div className="col-lg-1">
                                                <img
                                                  src={
                                                    environment.s3ArliensImage +
                                                    `${seg.airlineCode}.png`
                                                  }
                                                  alt=""
                                                  width="40px"
                                                  height="40px"
                                                />
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
                                        {/* <span>Segments</span> */}
                                        {index !== 0 ? (
                                          <div className="row my-2">
                                            <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                              {" "}
                                              Layover :&nbsp;
                                              {layOver(
                                                direction2.segments[index]
                                                  ?.departure,
                                                direction2.segments[index - 1]
                                                  ?.arrival
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                        <div className="row py-4 p-2 border align-items-center shadow">
                                          <div className="col-lg-1">
                                            <img
                                              src={
                                                environment.s3ArliensImage +
                                                `${seg.airlineCode}.png`
                                              }
                                              alt=""
                                              width="40px"
                                              height="40px"
                                            />
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
                                                {brandedFares !== null &&
                                                brandedFares !== undefined &&
                                                brandedFares?.length > 0 ? (
                                                  <>
                                                    {Object.keys(
                                                      brandedFares[
                                                        selectedBrandedFareIdx
                                                      ].bookingClasses
                                                    ).map((innerKey, idex) => {
                                                      return (
                                                        <>
                                                          {idex ===
                                                            index +
                                                              direction0
                                                                .segments
                                                                .length +
                                                              direction1
                                                                .segments
                                                                .length && (
                                                            <span>
                                                              {
                                                                brandedFares[
                                                                  selectedBrandedFareIdx
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
                                                {seg.bookingCount > 0 && (
                                                  <>Seats({seg.bookingCount})</>
                                                )}
                                              </span>
                                            </p>

                                            <p className="my-auto text-start">
                                              {seg.details[0].equipment}
                                            </p>
                                            <p className="my-auto text-start">
                                              <span
                                                style={{ fontSize: "13px" }}
                                                className="fw-bold"
                                              >
                                                {brandedFares !== null &&
                                                brandedFares !== undefined &&
                                                brandedFares?.length > 0 ? (
                                                  <>
                                                    {Object.keys(
                                                      brandedFares[
                                                        selectedBrandedFareIdx
                                                      ].cabinClasses
                                                    ).map((innerKey, idex) => {
                                                      return (
                                                        <>
                                                          {idex ===
                                                            index +
                                                              direction0
                                                                .segments
                                                                .length +
                                                              direction1
                                                                .segments
                                                                .length && (
                                                            <span>
                                                              {brandedFares[
                                                                selectedBrandedFareIdx
                                                              ].cabinClasses[
                                                                innerKey
                                                              ] !== ""
                                                                ? brandedFares[
                                                                    selectedBrandedFareIdx
                                                                  ]
                                                                    .cabinClasses[
                                                                    innerKey
                                                                  ]
                                                                : searchData?.travelClass}
                                                            </span>
                                                          )}
                                                        </>
                                                      );
                                                    })}
                                                  </>
                                                ) : (
                                                  <>
                                                    {seg.cabinClass
                                                      ? seg.cabinClass
                                                      : seg.serviceClass}
                                                  </>
                                                )}
                                              </span>
                                            </p>
                                          </div>
                                          <div className="col-lg-4">
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
                                          <div className="col-lg-4">
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
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </React.Fragment>
                              ))}
                            </>
                          ) : (
                            <></>
                          )}
                          {direction3.segments !== undefined ? (
                            <>
                              {direction3.segments.map((seg, index) => (
                                <React.Fragment key={index}>
                                  {!direction3?.segments?.every(
                                    (item) =>
                                      item.airlineCode ===
                                      direction3?.platingCarrierCode
                                  ) &&
                                    index === 0 && (
                                      <div className="my-2 d-flex gap-2 align-items-start">
                                        <i
                                          className="fa fa-info-circle"
                                          aria-hidden="true"
                                        ></i>
                                        <p style={{ fontSize: "13px" }}>
                                          This flight includes a codeshare
                                          segment. Bangladeshi passport holders
                                          may need a transit visa for travel.
                                          Please verify visa requirements based
                                          on your nationality before booking
                                          your ticket.
                                        </p>
                                      </div>
                                    )}
                                  {direction3?.stops > 1 && index === 0 && (
                                    <div className="my-2 d-flex gap-2 align-items-start">
                                      <i
                                        class="fa fa-info-circle"
                                        aria-hidden="true"
                                      ></i>
                                      <p style={{ fontSize: "13px" }}>
                                        This flight has multiple stopovers.
                                        Please check the visa requirements for
                                        each stop based on your nationality
                                        before booking.
                                      </p>
                                    </div>
                                  )}
                                  <div key={index}>
                                    {index === 0 ? (
                                      <div
                                        className="row pt-2 p-2 border-bottom"
                                        style={{ backgroundColor: "	white" }}
                                      >
                                        <div className="col-lg-3 text-start">
                                          <span className="d-inline fs-6 fw-bold ms-1">
                                            Departure,{" "}
                                            {airports
                                              .filter(
                                                (f) => f.iata === seg.from
                                              )
                                              .map((item) => item.city)}
                                          </span>
                                        </div>
                                        <div className="col-lg-3">
                                          <i className="fas fa-plane fa-sm"></i>
                                        </div>
                                        <div className="col-lg-3">
                                          <span className="d-inline fs-6 fw-bold">
                                            Arrival,{" "}
                                            {airports
                                              .filter(
                                                (f) =>
                                                  f.iata ===
                                                  direction3.segments[
                                                    direction3.segments.length -
                                                      1
                                                  ].to
                                              )
                                              .map((item) => item.city)}
                                          </span>
                                        </div>
                                        <div className="col-lg-3 fs-6 fw-bold">
                                          {/* <span>Duration: {seg.duration[0]}</span> */}
                                          <span>
                                            Duration :{" "}
                                            {/* {totalFlightDuration(direction3.segments)} */}
                                            {direction3.segments.length === 1
                                              ? totalFlightDuration(
                                                  direction3.segments
                                                )
                                              : direction3.segments.length === 2
                                              ? addDurations([
                                                  totalFlightDuration(
                                                    direction3.segments
                                                  ),
                                                  timeDuration(
                                                    direction3.segments[index]
                                                      .arrival,
                                                    direction3.segments[
                                                      index + 1
                                                    ].departure
                                                  ),
                                                ])
                                              : direction3.segments.length === 3
                                              ? addDurations([
                                                  totalFlightDuration(
                                                    direction3.segments
                                                  ),
                                                  timeDuration(
                                                    direction3.segments[index]
                                                      .arrival,
                                                    direction3.segments[
                                                      index + 1
                                                    ].departure
                                                  ),
                                                  timeDuration(
                                                    direction3.segments[
                                                      index + 1
                                                    ].arrival,
                                                    direction3.segments[
                                                      index + 2
                                                    ].departure
                                                  ),
                                                ])
                                              : ""}
                                            {/* {addDurations([
                                          totalFlightDuration(direction3.segments),
                                          timeDuration(
                                            direction3.segments[index].arrival,
                                            direction3.segments[index + 1].departure
                                          ),
                                        ])} */}
                                          </span>
                                          {direction3.segments.length > 1 && (
                                            <Text
                                              fontSize={"xs"}
                                              fontWeight={200}
                                            >
                                              (including layover time)
                                            </Text>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                    {seg.details.length > 1 ? (
                                      seg.details.map((item, idx) => {
                                        return (
                                          <>
                                            {index ===
                                            seg.details.length - 1 ? (
                                              <></>
                                            ) : seg.details.length > 1 ? (
                                              <>
                                                {idx === 0 ? (
                                                  <></>
                                                ) : (
                                                  <>
                                                    <div className="row my-2">
                                                      <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                                        {" "}
                                                        Layover : &nbsp;
                                                        {layOver(
                                                          seg.details[index + 1]
                                                            ?.departure,
                                                          seg.details[index]
                                                            ?.arrival
                                                        )}
                                                      </div>
                                                    </div>
                                                  </>
                                                )}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                            {index === 0 ? (
                                              <></>
                                            ) : (
                                              <div className="row my-2">
                                                <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                                  {" "}
                                                  Layover : &nbsp;
                                                  {layOver(
                                                    seg.details[index]
                                                      ?.departure,
                                                    seg.details[index - 1]
                                                      ?.arrival
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                            <div className="row py-4 p-2 border mb-2 align-items-center shadow">
                                              <div className="col-lg-1">
                                                <img
                                                  src={
                                                    environment.s3ArliensImage +
                                                    `${seg.airlineCode}.png`
                                                  }
                                                  alt=""
                                                  width="40px"
                                                  height="40px"
                                                />
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
                                        {/* <span>Segments</span> */}
                                        {index !== 0 ? (
                                          <div className="row my-2">
                                            <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                              {" "}
                                              Layover :&nbsp;
                                              {layOver(
                                                direction3.segments[index]
                                                  ?.departure,
                                                direction3.segments[index - 1]
                                                  ?.arrival
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                        <div className="row py-4 p-2 border align-items-center shadow">
                                          <div className="col-lg-1">
                                            <img
                                              src={
                                                environment.s3ArliensImage +
                                                `${seg.airlineCode}.png`
                                              }
                                              alt=""
                                              width="40px"
                                              height="40px"
                                            />
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
                                                {brandedFares !== null &&
                                                brandedFares !== undefined &&
                                                brandedFares?.length > 0 ? (
                                                  <>
                                                    {Object.keys(
                                                      brandedFares[
                                                        selectedBrandedFareIdx
                                                      ].bookingClasses
                                                    ).map((innerKey, idex) => {
                                                      return (
                                                        <>
                                                          {idex ===
                                                            index +
                                                              direction0
                                                                .segments
                                                                .length +
                                                              direction1
                                                                .segments
                                                                .length +
                                                              direction2
                                                                .segments
                                                                .length && (
                                                            <span>
                                                              {
                                                                brandedFares[
                                                                  selectedBrandedFareIdx
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
                                                {seg.bookingCount > 0 && (
                                                  <>Seats({seg.bookingCount})</>
                                                )}
                                              </span>
                                            </p>

                                            <p className="my-auto text-start">
                                              {seg.details[0].equipment}
                                            </p>
                                            <p className="my-auto text-start">
                                              <span
                                                style={{ fontSize: "13px" }}
                                                className="fw-bold"
                                              >
                                                {brandedFares !== null &&
                                                brandedFares !== undefined &&
                                                brandedFares?.length > 0 ? (
                                                  <>
                                                    {Object.keys(
                                                      brandedFares[
                                                        selectedBrandedFareIdx
                                                      ].cabinClasses
                                                    ).map((innerKey, idex) => {
                                                      return (
                                                        <>
                                                          {idex ===
                                                            index +
                                                              direction0
                                                                .segments
                                                                .length +
                                                              direction1
                                                                .segments
                                                                .length +
                                                              direction2
                                                                .segments
                                                                .length && (
                                                            <span>
                                                              {brandedFares[
                                                                selectedBrandedFareIdx
                                                              ].cabinClasses[
                                                                innerKey
                                                              ] !== ""
                                                                ? brandedFares[
                                                                    selectedBrandedFareIdx
                                                                  ]
                                                                    .cabinClasses[
                                                                    innerKey
                                                                  ]
                                                                : searchData?.travelClass}
                                                            </span>
                                                          )}
                                                        </>
                                                      );
                                                    })}
                                                  </>
                                                ) : (
                                                  <>
                                                    {seg.cabinClass
                                                      ? seg.cabinClass
                                                      : seg.serviceClass}
                                                  </>
                                                )}
                                              </span>
                                            </p>
                                          </div>
                                          <div className="col-lg-4">
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
                                          <div className="col-lg-4">
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
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </React.Fragment>
                              ))}
                            </>
                          ) : (
                            <></>
                          )}

                          {direction4.segments !== undefined ? (
                            <>
                              {direction4.segments.map((seg, index) => (
                                <React.Fragment key={index}>
                                  {!direction4?.segments?.every(
                                    (item) =>
                                      item.airlineCode ===
                                      direction4?.platingCarrierCode
                                  ) &&
                                    index === 0 && (
                                      <div className="my-2 d-flex gap-2 align-items-start">
                                        <i
                                          className="fa fa-info-circle"
                                          aria-hidden="true"
                                        ></i>
                                        <p style={{ fontSize: "13px" }}>
                                          This flight includes a codeshare
                                          segment. Bangladeshi passport holders
                                          may need a transit visa for travel.
                                          Please verify visa requirements based
                                          on your nationality before booking
                                          your ticket.
                                        </p>
                                      </div>
                                    )}
                                  {direction4?.stops > 1 && index === 0 && (
                                    <div className="my-2 d-flex gap-2 align-items-start">
                                      <i
                                        class="fa fa-info-circle"
                                        aria-hidden="true"
                                      ></i>
                                      <p style={{ fontSize: "13px" }}>
                                        This flight has multiple stopovers.
                                        Please check the visa requirements for
                                        each stop based on your nationality
                                        before booking.
                                      </p>
                                    </div>
                                  )}
                                  <div key={index}>
                                    {index === 0 ? (
                                      <div
                                        className="row pt-2 p-2 border-bottom"
                                        style={{ backgroundColor: "	white" }}
                                      >
                                        <div className="col-lg-3 text-start">
                                          <span className="d-inline fs-6 fw-bold ms-1">
                                            Departure,{" "}
                                            {airports
                                              .filter(
                                                (f) => f.iata === seg.from
                                              )
                                              .map((item) => item.city)}
                                          </span>
                                        </div>
                                        <div className="col-lg-3">
                                          <i className="fas fa-plane fa-sm"></i>
                                        </div>
                                        <div className="col-lg-3">
                                          <span className="d-inline fs-6 fw-bold">
                                            Arrival,{" "}
                                            {airports
                                              .filter(
                                                (f) =>
                                                  f.iata ===
                                                  direction4.segments[
                                                    direction4.segments.length -
                                                      1
                                                  ].to
                                              )
                                              .map((item) => item.city)}
                                          </span>
                                        </div>
                                        <div className="col-lg-3 fs-6 fw-bold">
                                          {/* <span>Duration: {seg.duration[0]}</span> */}
                                          <span>
                                            Duration :{" "}
                                            {/* {totalFlightDuration(direction4.segments)} */}
                                            {direction4.segments.length === 1
                                              ? totalFlightDuration(
                                                  direction4.segments
                                                )
                                              : direction4.segments.length === 2
                                              ? addDurations([
                                                  totalFlightDuration(
                                                    direction4.segments
                                                  ),
                                                  timeDuration(
                                                    direction4.segments[index]
                                                      .arrival,
                                                    direction4.segments[
                                                      index + 1
                                                    ].departure
                                                  ),
                                                ])
                                              : direction4.segments.length === 3
                                              ? addDurations([
                                                  totalFlightDuration(
                                                    direction4.segments
                                                  ),
                                                  timeDuration(
                                                    direction4.segments[index]
                                                      .arrival,
                                                    direction4.segments[
                                                      index + 1
                                                    ].departure
                                                  ),
                                                  timeDuration(
                                                    direction4.segments[
                                                      index + 1
                                                    ].arrival,
                                                    direction4.segments[
                                                      index + 2
                                                    ].departure
                                                  ),
                                                ])
                                              : ""}
                                            {/* {addDurations([
                                          totalFlightDuration(direction4.segments),
                                          timeDuration(
                                            direction4.segments[index].arrival,
                                            direction4.segments[index + 1].departure
                                          ),
                                        ])} */}
                                          </span>
                                          {direction4.segments.length > 1 && (
                                            <Text
                                              fontSize={"xs"}
                                              fontWeight={200}
                                            >
                                              (including layover time)
                                            </Text>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                    {seg.details.length > 1 ? (
                                      seg.details.map((item, idx) => {
                                        return (
                                          <>
                                            {index ===
                                            seg.details.length - 1 ? (
                                              <></>
                                            ) : seg.details.length > 1 ? (
                                              <>
                                                {idx === 0 ? (
                                                  <></>
                                                ) : (
                                                  <>
                                                    <div className="row my-2">
                                                      <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                                        {" "}
                                                        Layover : &nbsp;
                                                        {layOver(
                                                          seg.details[index + 1]
                                                            ?.departure,
                                                          seg.details[index]
                                                            ?.arrival
                                                        )}
                                                      </div>
                                                    </div>
                                                  </>
                                                )}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                            {index === 0 ? (
                                              <></>
                                            ) : (
                                              <div className="row my-2">
                                                <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                                  {" "}
                                                  Layover : &nbsp;
                                                  {layOver(
                                                    seg.details[index]
                                                      ?.departure,
                                                    seg.details[index - 1]
                                                      ?.arrival
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                            <div className="row py-4 p-2 border mb-2 align-items-center shadow">
                                              <div className="col-lg-1">
                                                <img
                                                  src={
                                                    environment.s3ArliensImage +
                                                    `${seg.airlineCode}.png`
                                                  }
                                                  alt=""
                                                  width="40px"
                                                  height="40px"
                                                />
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
                                        {/* <span>Segments</span> */}
                                        {index !== 0 ? (
                                          <div className="row my-2">
                                            <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                              {" "}
                                              Layover :&nbsp;
                                              {layOver(
                                                direction4.segments[index]
                                                  ?.departure,
                                                direction4.segments[index - 1]
                                                  ?.arrival
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                        <div className="row py-4 p-2 border align-items-center shadow">
                                          <div className="col-lg-1">
                                            <img
                                              src={
                                                environment.s3ArliensImage +
                                                `${seg.airlineCode}.png`
                                              }
                                              alt=""
                                              width="40px"
                                              height="40px"
                                            />
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
                                                {brandedFares !== null &&
                                                brandedFares !== undefined &&
                                                brandedFares?.length > 0 ? (
                                                  <>
                                                    {Object.keys(
                                                      brandedFares[
                                                        selectedBrandedFareIdx
                                                      ].bookingClasses
                                                    ).map((innerKey, index) => {
                                                      return (
                                                        <>
                                                          {index === 4 && (
                                                            <span>
                                                              {
                                                                brandedFares[
                                                                  selectedBrandedFareIdx
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
                                                {seg.bookingCount > 0 && (
                                                  <>Seats({seg.bookingCount})</>
                                                )}
                                              </span>
                                            </p>

                                            <p className="my-auto text-start">
                                              {seg.details[0].equipment}
                                            </p>
                                            <p className="my-auto text-start">
                                              <span
                                                style={{ fontSize: "13px" }}
                                                className="fw-bold"
                                              >
                                                {seg.cabinClass
                                                  ? seg.cabinClass
                                                  : seg.serviceClass}
                                              </span>
                                            </p>
                                          </div>
                                          <div className="col-lg-4">
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
                                          <div className="col-lg-4">
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
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </React.Fragment>
                              ))}
                            </>
                          ) : (
                            <></>
                          )}
                          {direction5.segments !== undefined ? (
                            <>
                              {direction5.segments.map((seg, index) => (
                                <div key={index}>
                                  {index === 0 ? (
                                    <div
                                      className="row pt-2 p-2 border-bottom"
                                      style={{ backgroundColor: "	white" }}
                                    >
                                      <div className="col-lg-3 text-start">
                                        <span className="d-inline fs-6 fw-bold ms-1">
                                          Departure,{" "}
                                          {airports
                                            .filter((f) => f.iata === seg.from)
                                            .map((item) => item.city)}
                                        </span>
                                      </div>
                                      <div className="col-lg-3">
                                        <i className="fas fa-plane fa-sm"></i>
                                      </div>
                                      <div className="col-lg-3">
                                        <span className="d-inline fs-6 fw-bold">
                                          Arrival,{" "}
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                direction5.segments[
                                                  direction5.segments.length - 1
                                                ].to
                                            )
                                            .map((item) => item.city)}
                                        </span>
                                      </div>
                                      <div className="col-lg-3 fs-6 fw-bold">
                                        {/* <span>Duration: {seg.duration[0]}</span> */}
                                        <span>
                                          Duration :{" "}
                                          {/* {totalFlightDuration(direction5.segments)} */}
                                          {direction5.segments.length === 1
                                            ? totalFlightDuration(
                                                direction5.segments
                                              )
                                            : direction5.segments.length === 2
                                            ? addDurations([
                                                totalFlightDuration(
                                                  direction5.segments
                                                ),
                                                timeDuration(
                                                  direction5.segments[index]
                                                    .arrival,
                                                  direction5.segments[index + 1]
                                                    .departure
                                                ),
                                              ])
                                            : direction5.segments.length === 3
                                            ? addDurations([
                                                totalFlightDuration(
                                                  direction5.segments
                                                ),
                                                timeDuration(
                                                  direction5.segments[index]
                                                    .arrival,
                                                  direction5.segments[index + 1]
                                                    .departure
                                                ),
                                                timeDuration(
                                                  direction5.segments[index + 1]
                                                    .arrival,
                                                  direction5.segments[index + 2]
                                                    .departure
                                                ),
                                              ])
                                            : ""}
                                          {/* {addDurations([
                                          totalFlightDuration(direction5.segments),
                                          timeDuration(
                                            direction5.segments[index].arrival,
                                            direction5.segments[index + 1].departure
                                          ),
                                        ])} */}
                                        </span>
                                        {direction5.segments.length > 1 && (
                                          <Text
                                            fontSize={"xs"}
                                            fontWeight={200}
                                          >
                                            (including layover time)
                                          </Text>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                  {seg.details.length > 1 ? (
                                    seg.details.map((item, idx) => {
                                      return (
                                        <>
                                          {index === seg.details.length - 1 ? (
                                            <></>
                                          ) : seg.details.length > 1 ? (
                                            <>
                                              {idx === 0 ? (
                                                <></>
                                              ) : (
                                                <>
                                                  <div className="row my-2">
                                                    <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                                      {" "}
                                                      Layover : &nbsp;
                                                      {layOver(
                                                        seg.details[index + 1]
                                                          ?.departure,
                                                        seg.details[index]
                                                          ?.arrival
                                                      )}
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                          {index === 0 ? (
                                            <></>
                                          ) : (
                                            <div className="row my-2">
                                              <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                                {" "}
                                                Layover : &nbsp;
                                                {layOver(
                                                  seg.details[index]?.departure,
                                                  seg.details[index - 1]
                                                    ?.arrival
                                                )}
                                              </div>
                                            </div>
                                          )}
                                          <div className="row py-4 p-2 border mb-2 align-items-center shadow">
                                            <div className="col-lg-1">
                                              <img
                                                src={
                                                  environment.s3ArliensImage +
                                                  `${seg.airlineCode}.png`
                                                }
                                                alt=""
                                                width="40px"
                                                height="40px"
                                              />
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
                                      {/* <span>Segments</span> */}
                                      {index !== 0 ? (
                                        <div className="row my-2">
                                          <div className="text-center fw-bold button-secondary-color py-1 rounded-3 text-white">
                                            {" "}
                                            Layover :&nbsp;
                                            {layOver(
                                              direction5.segments[index]
                                                ?.departure,
                                              direction5.segments[index - 1]
                                                ?.arrival
                                            )}
                                          </div>
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                      <div className="row py-4 p-2 border align-items-center shadow">
                                        <div className="col-lg-1">
                                          <img
                                            src={
                                              environment.s3ArliensImage +
                                              `${seg.airlineCode}.png`
                                            }
                                            alt=""
                                            width="40px"
                                            height="40px"
                                          />
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
                                              {brandedFares !== null &&
                                              brandedFares !== undefined &&
                                              brandedFares?.length > 0
                                                ? brandedFares[
                                                    selectedBrandedFareIdx
                                                  ].bookingClasses
                                                : seg.bookingClass}
                                              ){" "}
                                              {seg.bookingCount > 0 && (
                                                <>Seats({seg.bookingCount})</>
                                              )}
                                            </span>
                                          </p>

                                          <p className="my-auto text-start">
                                            {seg.details[0].equipment}
                                          </p>
                                          <p className="my-auto text-start">
                                            <span
                                              style={{ fontSize: "13px" }}
                                              className="fw-bold"
                                            >
                                              {seg.cabinClass
                                                ? seg.cabinClass
                                                : seg.serviceClass}
                                            </span>
                                          </p>
                                        </div>
                                        <div className="col-lg-4">
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
                                        <div className="col-lg-4">
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
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                </div>
                <div
                  className="tab-pane fade"
                  id={"profile" + index}
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <>
                    <div className="">
                      <div className="container p-2 pb-5">
                        <div className="table-responsive-sm mt-1">
                          <table
                            className="table table-bordered border-dark p-2 table-sm bg-white rounded "
                            style={{ fontSize: "12px" }}
                          >
                            <thead className="text-center button-color fw-bold text-white">
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
                            {brandedFares !== null &&
                            brandedFares !== undefined &&
                            brandedFares?.length > 0 ? (
                              <tbody className="text-end">
                                {brandedFares[selectedBrandedFareIdx]
                                  ?.paxFareBreakDown.adt !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">Adult</td>
                                      <td className="left">
                                        {brandedFares[
                                          selectedBrandedFareIdx
                                        ]?.paxFareBreakDown.adt.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {brandedFares[
                                          selectedBrandedFareIdx
                                        ]?.paxFareBreakDown.adt.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {(brandedFares[
                                          selectedBrandedFareIdx
                                        ]?.paxFareBreakDown.adt.discountPrice).toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {brandedFares[
                                          selectedBrandedFareIdx
                                        ]?.paxFareBreakDown.adt.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCounts.adt}
                                      </td>
                                      <td className="right fw-bold">
                                        {currency !== undefined
                                          ? currency
                                          : "AED"}{" "}
                                        {(
                                          brandedFares[selectedBrandedFareIdx]
                                            ?.paxFareBreakDown.adt.totalPrice *
                                          passengerCounts.adt
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {brandedFares[selectedBrandedFareIdx]
                                  ?.paxFareBreakDown.chd !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">
                                        Child &gt; 5
                                      </td>
                                      <td className="left">
                                        {brandedFares[
                                          selectedBrandedFareIdx
                                        ]?.paxFareBreakDown.chd.basePrice.toLocaleString(
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
                                        ]?.paxFareBreakDown.chd.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCounts.chd}
                                      </td>
                                      <td className="right fw-bold">
                                        {currency !== undefined
                                          ? currency
                                          : "AED"}{" "}
                                        {(
                                          brandedFares[selectedBrandedFareIdx]
                                            ?.paxFareBreakDown.chd.totalPrice *
                                          passengerCounts.chd
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {brandedFares[selectedBrandedFareIdx]
                                  ?.paxFareBreakDown.cnn !== null ? (
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
                                        {brandedFares[
                                          selectedBrandedFareIdx
                                        ]?.paxFareBreakDown.cnn.basePrice.toLocaleString(
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
                                        ]?.paxFareBreakDown.cnn.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCounts.cnn}
                                      </td>
                                      <td className="right fw-bold">
                                        {currency !== undefined
                                          ? currency
                                          : "AED"}{" "}
                                        {(
                                          brandedFares[selectedBrandedFareIdx]
                                            ?.paxFareBreakDown.cnn.totalPrice *
                                          passengerCounts.cnn
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {brandedFares[selectedBrandedFareIdx]
                                  ?.paxFareBreakDown.inf !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">Infant</td>
                                      <td className="left">
                                        {brandedFares[
                                          selectedBrandedFareIdx
                                        ]?.paxFareBreakDown.inf.basePrice.toLocaleString(
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
                                        ]?.paxFareBreakDown.inf.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCounts.inf}
                                      </td>
                                      <td className="right fw-bold">
                                        {currency !== undefined
                                          ? currency
                                          : "AED"}{" "}
                                        {(
                                          brandedFares[selectedBrandedFareIdx]
                                            ?.paxFareBreakDown.inf.totalPrice *
                                          passengerCounts.inf
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
                                  <td className="text-end">
                                    {currency !== undefined ? currency : "AED"}{" "}
                                    {brandedFares[selectedBrandedFareIdx]
                                      ?.paxFareBreakDown.adt !== null &&
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
                                        {passengerFares.adt.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {passengerFares.adt.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFares.adt.discountPrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFares.adt.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCounts.adt}
                                      </td>
                                      <td className="right fw-bold">
                                        {currency !== undefined
                                          ? currency
                                          : "AED"}{" "}
                                        {(
                                          passengerFares.adt.totalPrice *
                                          passengerCounts.adt
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {passengerFares.chd !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">
                                        Child &gt; 5
                                      </td>
                                      <td className="left">
                                        {passengerFares.chd.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {passengerFares.chd.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFares.chd.discountPrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFares.chd.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCounts.chd}
                                      </td>
                                      <td className="right fw-bold">
                                        {currency !== undefined
                                          ? currency
                                          : "AED"}{" "}
                                        {(
                                          passengerFares.chd.totalPrice *
                                          passengerCounts.chd
                                        ).toLocaleString("en-US")}
                                      </td>
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
                                        {passengerFares.cnn.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {passengerFares.cnn.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFares.cnn.discountPrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFares.cnn.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCounts.cnn}
                                      </td>
                                      <td className="right fw-bold">
                                        {currency !== undefined
                                          ? currency
                                          : "AED"}{" "}
                                        {(
                                          passengerFares.cnn.totalPrice *
                                          passengerCounts.cnn
                                        ).toLocaleString("en-US")}
                                      </td>
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
                                        {passengerFares.inf.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {passengerFares.inf.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFares.inf.discountPrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFares.inf.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCounts.inf}
                                      </td>
                                      <td className="right fw-bold">
                                        {currency !== undefined
                                          ? currency
                                          : "AED"}{" "}
                                        {(
                                          passengerFares.inf.totalPrice *
                                          passengerCounts.inf
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
                                    {currency !== undefined ? currency : "AED"}{" "}
                                    {bookingComponents[0].totalPrice.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            )}
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                </div>
                <div
                  className="tab-pane fade"
                  id={"contact" + index}
                  role="tabpanel"
                  aria-labelledby="contact-tab"
                >
                  <>
                    <div className="">
                      <div className="container p-2">
                        <>
                          <div className="row px-2 pb-2">
                            <div className="col-lg-8 border-bottom button-color text-white shadow">
                              <div
                                className="row p-1"
                                // style={{ backgroundColor: "	white" }}
                              >
                                <div className="col-lg-5 text-start">
                                  <span className="d-inline fs-6 fw-bold ms-1">
                                    Departure,{" "}
                                    {airports
                                      .filter(
                                        (f) =>
                                          f.iata === direction0.segments[0].from
                                      )
                                      .map((item) => item.city)}
                                  </span>
                                </div>
                                <div className="col-lg-2">
                                  <i className="fas fa-plane"></i>
                                </div>
                                <div className="col-lg-5 text-end">
                                  <span className="d-inline fs-6 fw-bold">
                                    Arrival,{" "}
                                    {airports
                                      .filter(
                                        (f) =>
                                          f.iata ===
                                          direction0.segments[
                                            direction0.segments.length - 1
                                          ].to
                                      )
                                      .map((item) => item.city)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row px-2 pb-2">
                            <div className="col-lg-8">
                              <div className="row my-2">
                                <div className="col-lg-6">
                                  <span className="float-start">
                                    <i className="fas fa-briefcase fa-sm"></i>
                                  </span>
                                  <span className="d-inline fs-6 float-start ms-1">
                                    Cabin baggage
                                  </span>
                                </div>
                                <div className="col-lg-6">
                                  <span className="d-inline fs-6 float-end">
                                    {direction0?.segments[0]?.handBaggage
                                      ? direction0?.segments[0]?.handBaggage
                                      : "7KG (max 1 Bag)"}
                                  </span>
                                </div>
                              </div>
                              <div className="row my-2">
                                <div className="col-lg-6">
                                  <span className="float-start">
                                    <i className="fas fa-briefcase fa-sm"></i>
                                  </span>
                                  <span className="d-inline fs-6 float-start ms-1">
                                    Checked baggage
                                  </span>
                                </div>
                                <div className="col-lg-6 text-end">
                                  {brandedFares !== null &&
                                  brandedFares !== undefined &&
                                  brandedFares?.length > 0 ? (
                                    <div
                                      className="d-flex justify-content-end align-items-center gap-1"
                                      style={{
                                        fontSize: "12px",
                                      }}
                                    >
                                      {brandedFares[selectedBrandedFareIdx]
                                        ?.brandFeatures?.CheckedBaggage !==
                                        undefined &&
                                        Object.keys(
                                          brandedFares[selectedBrandedFareIdx]
                                            ?.brandFeatures?.CheckedBaggage
                                        ).map((itemKey) => {
                                          const item =
                                            brandedFares[selectedBrandedFareIdx]
                                              ?.brandFeatures?.CheckedBaggage[
                                              itemKey
                                            ];
                                          return (
                                            <React.Fragment key={itemKey}>
                                              <div
                                                key={index}
                                                className="d-flex align-items-center"
                                              >
                                                <>
                                                  {
                                                    <div className="text-center">
                                                      <div>
                                                        {passengerType(itemKey)}
                                                      </div>

                                                      <div
                                                        className="fw-bold"
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        (
                                                        {item[0] !==
                                                          undefined &&
                                                          item[0].weights}
                                                        )
                                                      </div>
                                                    </div>
                                                  }
                                                </>
                                              </div>
                                            </React.Fragment>
                                          );
                                        })}
                                    </div>
                                  ) : (
                                    <span className="d-inline fs-6 float-end">
                                      {direction0.segments[0].baggage[0] !==
                                      undefined ? (
                                        <>
                                          {direction0.segments[0].baggage[0]
                                            ?.amount +
                                            " " +
                                            direction0.segments[0].baggage[0]
                                              ?.units}
                                        </>
                                      ) : (
                                        <>N/A</>
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      </div>
                      {flightType === "Multi City" ? (
                        <>
                          {direction2.segments !== undefined ? (
                            <>
                              <div className="container p-2">
                                <div className="row px-2 pb-2">
                                  <div
                                    className="col-lg-8 p-2 border-bottom button-color text-white shadow"
                                    // style={{ backgroundColor: "	white" }}
                                  >
                                    <div className="row">
                                      <div className="col-lg-5">
                                        <span className="d-inline fs-6 fw-bold ms-1">
                                          Departure,{" "}
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                direction2.segments[0].from
                                            )
                                            .map((item) => item.city)}
                                        </span>
                                      </div>
                                      <div className="col-lg-2">
                                        <i className="fas fa-plane"></i>
                                      </div>
                                      <div className="col-lg-5 text-end">
                                        <span className="d-inline fs-6 fw-bold">
                                          Arrival,{" "}
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                direction2.segments[
                                                  direction2.segments.length - 1
                                                ].to
                                            )
                                            .map((item) => item.city)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row pb-2">
                                  <div className="col-lg-8">
                                    <div className="row my-2">
                                      <div className="col-lg-6">
                                        <span className="float-start">
                                          <i className="fas fa-briefcase fa-sm"></i>
                                        </span>
                                        <span className="d-inline fs-6 float-start ms-1">
                                          Cabin baggage
                                        </span>
                                      </div>
                                      <div className="col-lg-6">
                                        <span className="d-inline fs-6 float-end">
                                          {direction2?.segments[0]?.handBaggage
                                            ? direction2?.segments[0]
                                                ?.handBaggage
                                            : "7KG (max 1 Bag)"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="row my-2">
                                      <div className="col-lg-6">
                                        <span className="float-start">
                                          <i className="fas fa-briefcase fa-sm"></i>
                                        </span>
                                        <span className="d-inline fs-6 float-start ms-1">
                                          Checked baggage
                                        </span>
                                      </div>
                                      <div className="col-lg-6 text-end">
                                        {brandedFares !== null &&
                                        brandedFares !== undefined &&
                                        brandedFares?.length > 0 ? (
                                          <div
                                            className="d-flex justify-content-end align-items-center gap-1"
                                            style={{
                                              fontSize: "12px",
                                            }}
                                          >
                                            {brandedFares[
                                              selectedBrandedFareIdx
                                            ]?.brandFeatures?.CheckedBaggage !==
                                              undefined &&
                                              Object.keys(
                                                brandedFares[
                                                  selectedBrandedFareIdx
                                                ]?.brandFeatures?.CheckedBaggage
                                              ).map((itemKey, index) => {
                                                const item =
                                                  brandedFares[
                                                    selectedBrandedFareIdx
                                                  ]?.brandFeatures
                                                    ?.CheckedBaggage[itemKey];
                                                return (
                                                  <React.Fragment key={itemKey}>
                                                    <div
                                                      key={index}
                                                      className="d-flex align-items-center"
                                                    >
                                                      <>
                                                        {
                                                          <div className="text-center">
                                                            <div>
                                                              {passengerType(
                                                                itemKey
                                                              )}
                                                            </div>

                                                            <div
                                                              className="fw-bold"
                                                              style={{
                                                                fontSize:
                                                                  "10px",
                                                              }}
                                                            >
                                                              (
                                                              {item[2] !==
                                                                undefined &&
                                                                item[2].weights}
                                                              )
                                                            </div>
                                                          </div>
                                                        }
                                                      </>
                                                    </div>
                                                  </React.Fragment>
                                                );
                                              })}
                                          </div>
                                        ) : (
                                          <span className="d-inline fs-6 float-end">
                                            {direction2.segments[0]
                                              .baggage[0] !== undefined ? (
                                              <>
                                                {direction2.segments[0]
                                                  .baggage[0]?.amount +
                                                  " " +
                                                  direction2.segments[0]
                                                    .baggage[0]?.units}
                                              </>
                                            ) : (
                                              <>N/A</>
                                            )}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                          {direction3.segments !== undefined ? (
                            <>
                              <div className="container p-2">
                                <div className="row px-2 pb-2">
                                  <div
                                    className="col-lg-8 p-2 border-bottom button-color text-white shadow"
                                    // style={{ backgroundColor: "	white" }}
                                  >
                                    <div className="row">
                                      <div className="col-lg-5">
                                        <span className="d-inline fs-6 fw-bold ms-1">
                                          Departure,{" "}
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                direction3.segments[0].from
                                            )
                                            .map((item) => item.city)}
                                        </span>
                                      </div>
                                      <div className="col-lg-2">
                                        <i className="fas fa-plane"></i>
                                      </div>
                                      <div className="col-lg-5 text-end">
                                        <span className="d-inline fs-6 fw-bold">
                                          Arrival,{" "}
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                direction3.segments[
                                                  direction3.segments.length - 1
                                                ].to
                                            )
                                            .map((item) => item.city)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row pb-2">
                                  <div className="col-lg-8">
                                    <div className="row my-2">
                                      <div className="col-lg-6">
                                        <span className="float-start">
                                          <i className="fas fa-briefcase fa-sm"></i>
                                        </span>
                                        <span className="d-inline fs-6 float-start ms-1">
                                          Cabin baggage
                                        </span>
                                      </div>
                                      <div className="col-lg-6">
                                        <span className="d-inline fs-6 float-end">
                                          {direction3?.segments[0]?.handBaggage
                                            ? direction3?.segments[0]
                                                ?.handBaggage
                                            : "7KG (max 1 Bag)"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="row my-2">
                                      <div className="col-lg-6">
                                        <span className="float-start">
                                          <i className="fas fa-briefcase fa-sm"></i>
                                        </span>
                                        <span className="d-inline fs-6 float-start ms-1">
                                          Checked baggage
                                        </span>
                                      </div>
                                      <div className="col-lg-6 text-end">
                                        {brandedFares !== null &&
                                        brandedFares !== undefined &&
                                        brandedFares?.length > 0 ? (
                                          <div
                                            className="d-flex justify-content-end align-items-center gap-1"
                                            style={{
                                              fontSize: "12px",
                                            }}
                                          >
                                            {brandedFares[
                                              selectedBrandedFareIdx
                                            ]?.brandFeatures?.CheckedBaggage !==
                                              undefined &&
                                              Object.keys(
                                                brandedFares[
                                                  selectedBrandedFareIdx
                                                ]?.brandFeatures?.CheckedBaggage
                                              ).map((itemKey, index) => {
                                                const item =
                                                  brandedFares[
                                                    selectedBrandedFareIdx
                                                  ]?.brandFeatures
                                                    ?.CheckedBaggage[itemKey];
                                                return (
                                                  <React.Fragment key={itemKey}>
                                                    <div
                                                      key={index}
                                                      className="d-flex align-items-center"
                                                    >
                                                      <>
                                                        {
                                                          <div className="text-center">
                                                            <div>
                                                              {passengerType(
                                                                itemKey
                                                              )}
                                                            </div>

                                                            <div
                                                              className="fw-bold"
                                                              style={{
                                                                fontSize:
                                                                  "10px",
                                                              }}
                                                            >
                                                              (
                                                              {item[3] !==
                                                                undefined &&
                                                                item[3].weights}
                                                              )
                                                            </div>
                                                          </div>
                                                        }
                                                      </>
                                                    </div>
                                                  </React.Fragment>
                                                );
                                              })}
                                          </div>
                                        ) : (
                                          <span className="d-inline fs-6 float-end">
                                            {direction3.segments[0]
                                              .baggage[0] !== undefined ? (
                                              <>
                                                {direction3.segments[0]
                                                  .baggage[0]?.amount +
                                                  " " +
                                                  direction3.segments[0]
                                                    .baggage[0]?.units}
                                              </>
                                            ) : (
                                              <>N/A</>
                                            )}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          {direction4.segments !== undefined ? (
                            <>
                              <div className="container p-2">
                                <div className="row px-2 pb-2">
                                  <div className="col-lg-8 border-bottom button-color text-white shadow">
                                    <div className="row">
                                      <div className="col-lg-5">
                                        <span className="d-inline fs-6 fw-bold ms-1">
                                          Departure,{" "}
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                direction4.segments[0].from
                                            )
                                            .map((item) => item.city)}
                                        </span>
                                      </div>
                                      <div className="col-lg-2">
                                        <i className="fas fa-plane"></i>
                                      </div>
                                      <div className="col-lg-5 text-end">
                                        <span className="d-inline fs-6 fw-bold">
                                          Arrival,{" "}
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                direction4.segments[
                                                  direction4.segments.length - 1
                                                ].to
                                            )
                                            .map((item) => item.city)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row pb-2">
                                  <div className="col-lg-8">
                                    <div className="row my-2">
                                      <div className="col-lg-6">
                                        <span className="float-start">
                                          <i className="fas fa-briefcase fa-sm"></i>
                                        </span>
                                        <span className="d-inline fs-6 float-start ms-1">
                                          Cabin baggage
                                        </span>
                                      </div>
                                      <div className="col-lg-6">
                                        <span className="d-inline fs-6 float-end">
                                          {direction4?.segments[0]?.handBaggage
                                            ? direction4?.segments[0]
                                                ?.handBaggage
                                            : "7KG (max 1 Bag)"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="row my-2">
                                      <div className="col-lg-6">
                                        <span className="float-start">
                                          <i className="fas fa-briefcase fa-sm"></i>
                                        </span>
                                        <span className="d-inline fs-6 float-start ms-1">
                                          Checked baggage
                                        </span>
                                      </div>
                                      <div className="col-lg-6 text-end">
                                        {brandedFares !== null &&
                                        brandedFares !== undefined &&
                                        brandedFares?.length > 0 ? (
                                          <div
                                            className="d-flex justify-content-end align-items-center gap-1"
                                            style={{
                                              fontSize: "12px",
                                            }}
                                          >
                                            {brandedFares[
                                              selectedBrandedFareIdx
                                            ]?.brandFeatures?.CheckedBaggage !==
                                              undefined &&
                                              Object.keys(
                                                brandedFares[
                                                  selectedBrandedFareIdx
                                                ]?.brandFeatures?.CheckedBaggage
                                              ).map((itemKey, index) => {
                                                const item =
                                                  brandedFares[
                                                    selectedBrandedFareIdx
                                                  ]?.brandFeatures
                                                    ?.CheckedBaggage[itemKey];
                                                return (
                                                  <React.Fragment key={itemKey}>
                                                    <div
                                                      key={index}
                                                      className="d-flex align-items-center"
                                                    >
                                                      <>
                                                        {
                                                          <div className="text-center">
                                                            <div>
                                                              {passengerType(
                                                                itemKey
                                                              )}
                                                            </div>

                                                            <div
                                                              className="fw-bold"
                                                              style={{
                                                                fontSize:
                                                                  "10px",
                                                              }}
                                                            >
                                                              (
                                                              {item[4] !==
                                                                undefined &&
                                                                item[4].weights}
                                                              )
                                                            </div>
                                                          </div>
                                                        }
                                                      </>
                                                    </div>
                                                  </React.Fragment>
                                                );
                                              })}
                                          </div>
                                        ) : (
                                          <span className="d-inline fs-6 float-end">
                                            {direction4.segments[0]
                                              .baggage[0] !== undefined ? (
                                              <>
                                                {direction4.segments[0]
                                                  .baggage[0]?.amount +
                                                  " " +
                                                  direction4.segments[0]
                                                    .baggage[0]?.units}
                                              </>
                                            ) : (
                                              <>N/A</>
                                            )}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                          {direction5.segments !== undefined ? (
                            <>
                              <div className="container p-2">
                                <div className="row px-2 pb-2">
                                  <div className="col-lg-8 border-bottom button-color text-white shadow">
                                    <div className="row">
                                      <div className="col-lg-5">
                                        <span className="d-inline fs-6 fw-bold ms-1">
                                          Departure,{" "}
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                direction5.segments[0].from
                                            )
                                            .map((item) => item.city)}
                                        </span>
                                      </div>
                                      <div className="col-lg-2">
                                        <i className="fas fa-plane"></i>
                                      </div>
                                      <div className="col-lg-5 text-end">
                                        <span className="d-inline fs-6 fw-bold">
                                          Arrival,{" "}
                                          {airports
                                            .filter(
                                              (f) =>
                                                f.iata ===
                                                direction5.segments[
                                                  direction5.segments.length - 1
                                                ].to
                                            )
                                            .map((item) => item.city)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row pb-2">
                                  <div className="col-lg-8">
                                    <div className="row my-2">
                                      <div className="col-lg-6">
                                        <span className="float-start">
                                          <i className="fas fa-briefcase fa-sm"></i>
                                        </span>
                                        <span className="d-inline fs-6 float-start ms-1">
                                          Cabin baggage
                                        </span>
                                      </div>
                                      <div className="col-lg-6">
                                        <span className="d-inline fs-6 float-end">
                                          {direction5?.segments[0]?.handBaggage
                                            ? direction5?.segments[0]
                                                ?.handBaggage
                                            : "7KG (max 1 Bag)"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="row my-2">
                                      <div className="col-lg-6">
                                        <span className="float-start">
                                          <i className="fas fa-briefcase fa-sm"></i>
                                        </span>
                                        <span className="d-inline fs-6 float-start ms-1">
                                          Checked baggage
                                        </span>
                                      </div>
                                      <div className="col-lg-6">
                                        <span className="d-inline fs-6 float-end">
                                          {direction5.segments[0].baggage[0]
                                            .amount +
                                            " " +
                                            direction5.segments[0].baggage[0]
                                              .units}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}

                      <>
                        {Object.keys(direction1).length > 0 ? (
                          <>
                            <div className="container">
                              <div className="row px-2 pb-2">
                                <div className="col-lg-8 border-bottom button-color text-white shadow">
                                  <div
                                    className="row p-1"
                                    // style={{ backgroundColor: "	white" }}
                                  >
                                    <div className="col-lg-5 text-start">
                                      <span className="d-inline fs-6 fw-bold ms-1">
                                        Departure,{" "}
                                        {airports
                                          .filter(
                                            (f) =>
                                              f.iata ===
                                              direction1.segments[0].from
                                          )
                                          .map((item) => item.city)}
                                      </span>
                                    </div>
                                    <div className="col-lg-2">
                                      <i className="fas fa-plane"></i>
                                    </div>
                                    <div className="col-lg-5 text-end">
                                      <span className="d-inline fs-6 fw-bold">
                                        Arrival,{" "}
                                        {airports
                                          .filter(
                                            (f) =>
                                              f.iata ===
                                              direction1.segments[
                                                direction1.segments.length - 1
                                              ].to
                                          )
                                          .map((item) => item.city)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row px-2 pb-2">
                                <div className="col-lg-8">
                                  <div className="row my-2">
                                    <div className="col-lg-6">
                                      <span className="float-start">
                                        <i className="fas fa-briefcase fa-sm"></i>
                                      </span>
                                      <span className="d-inline fs-6 float-start ms-1">
                                        Cabin baggage
                                      </span>
                                    </div>
                                    <div className="col-lg-6">
                                      <span className="d-inline fs-6 float-end">
                                        {direction1?.segments[0]?.handBaggage
                                          ? direction1?.segments[0]?.handBaggage
                                          : "7KG (max 1 Bag)"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="row my-2">
                                    <div className="col-lg-6">
                                      <span className="float-start">
                                        <i className="fas fa-briefcase fa-sm"></i>
                                      </span>
                                      <span className="d-inline fs-6 float-start ms-1">
                                        Checked baggage
                                      </span>
                                    </div>
                                    <div className="col-lg-6 text-end">
                                      {brandedFares !== null &&
                                      brandedFares !== undefined &&
                                      brandedFares?.length > 0 ? (
                                        <div
                                          className="d-flex justify-content-end align-items-center gap-1"
                                          style={{
                                            fontSize: "12px",
                                          }}
                                        >
                                          {brandedFares[selectedBrandedFareIdx]
                                            ?.brandFeatures?.CheckedBaggage !==
                                            undefined &&
                                            Object.keys(
                                              brandedFares[
                                                selectedBrandedFareIdx
                                              ]?.brandFeatures?.CheckedBaggage
                                            ).map((itemKey, index) => {
                                              const item =
                                                brandedFares[
                                                  selectedBrandedFareIdx
                                                ]?.brandFeatures
                                                  ?.CheckedBaggage[itemKey];
                                              return (
                                                <React.Fragment key={itemKey}>
                                                  <div
                                                    key={index}
                                                    className="d-flex align-items-center"
                                                  >
                                                    <>
                                                      {
                                                        <div className="text-center">
                                                          <div>
                                                            {passengerType(
                                                              itemKey
                                                            )}
                                                          </div>

                                                          <div
                                                            className="fw-bold"
                                                            style={{
                                                              fontSize: "10px",
                                                            }}
                                                          >
                                                            (
                                                            {item[1] !==
                                                              undefined &&
                                                              item[1].weights}
                                                            )
                                                          </div>
                                                        </div>
                                                      }
                                                    </>
                                                  </div>
                                                </React.Fragment>
                                              );
                                            })}
                                        </div>
                                      ) : (
                                        <span className="d-inline fs-6 float-end">
                                          {direction1.segments[0].baggage[0] !==
                                          undefined ? (
                                            <>
                                              {direction1.segments[0].baggage[0]
                                                ?.amount +
                                                " " +
                                                direction1.segments[0]
                                                  .baggage[0]?.units}
                                            </>
                                          ) : (
                                            <>N/A</>
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    </div>
                  </>
                </div>
                <div
                  className="tab-pane fade"
                  id={"about" + index}
                  role="tabpanel"
                  aria-labelledby="about-tab"
                >
                  <>
                    <div className="text-start py-3 px-1">
                      <h6 className="fw-bold button-color text-white p-1">
                        Refund or Date Change can be done as per the following
                        policies:
                      </h6>
                      <hr></hr>• Refund Amount= Received amount from customer -
                      Refund Charge (As per Airline Policy + Triplover LLC
                      Convenience Fee).<br></br>• Date Change Amount= Date
                      change fee as per Airline + Difference of fare if any +
                      Triplover LLC Convenience Fee.
                    </div>
                  </>
                </div>
                {/* //info */}
                <div
                  className="tab-pane fade"
                  id={"info" + index}
                  role="tabpanel"
                  aria-labelledby="info-tab"
                >
                  <>
                    <div className="text-start py-3 px-1">
                      <h6 className="fw-bold button-color text-white p-1">
                        Important Information
                      </h6>
                      <hr></hr>
                      <div className="pt-2">
                        {notes?.map((note, index) => (
                          <span>
                            <p key={index}>
                              • ({note?.sequentialAirportCodes}) {note?.message}
                            </p>
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowModal;
