import React, { useState } from "react";
import airports from "../../../JSON/airports.json";
import { environment } from "../../SharePages/Utility/environment";
import moment from "moment";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";

const Card = ({
  item,
  totalPrice,
  name,
  index,
  onClick,
  selected,
  groupIndex,
  data,
  handleGroupFlightSelect,
  amountChange,
}) => {
  return (
    <div
      className="row mx-3 p-1 rounded box-shadow mb-4 position-relative"
      style={{
        border: selected === index ? "2px solid #068b9f" : "2px solid white",
        backgroundColor: selected === index ? "#badfe461" : "white",
      }}
      key={index}
    >
      <div class="position-absolute" style={{ marginTop: "-20px" }}>
        {selected === index && (
          <span
            style={{ fontSize: "12px" }}
            className="p-1 bg-danger rounded w-auto fw-bold"
          >
            Selected
          </span>
        )}
      </div>
      <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
        <div className="d-flex justify-content-start align-items-center gap-1 fw-bold">
          <h6
            className="text-start"
            style={{ fontSize: "12px", color: "#7c04c0" }}
          >
            {item[0]?.segments[0].airline}
          </h6>
          <p>|</p>
          <p style={{ fontSize: "10px" }}>
            {item[0]?.segments[0]?.details[0]?.equipment}
          </p>
          <p>|</p>
          <p style={{ fontSize: "10px" }}>
            {item[0]?.segments[0]?.airlineCode} -{" "}
            {item[0]?.segments[0]?.flightNumber}
          </p>
          <p>|</p>
          <img
            src={
              environment.s3ArliensImage + `${item[0]?.platingCarrierCode}.png`
            }
            alt=""
            width={"50px"}
            height={"50px"}
            className={"mb-1 rounded-2"}
          />
        </div>
        <div className="d-flex justify-content-end align-items-center gap-1 text-danger">
          {item[0]?.segments[0]?.bookingCount && (
            <>
              <MdOutlineAirlineSeatReclineExtra />
              <p style={{ fontSize: "10px" }} className="fw-bold">
                {item[0]?.segments[0]?.bookingCount} LEFT
              </p>
            </>
          )}

          {item[0]?.segments[0]?.bookingClass && (
            <p
              style={{
                fontSize: "12px",
                backgroundColor: "#7c04c0",
              }}
              className="fw-bold rounded px-3 py-1 ms-1 text-white"
            >
              {item[0]?.segments[0]?.bookingClass}
            </p>
          )}
        </div>
      </div>
      <div className="container-fluid">
        {item?.map((itm, idx) => (
          <>
            <div
              className="row px-3 fw-bold justify-content-between align-items-center p-1 rounded"
              key={index}
              style={{
                backgroundColor:
                  idx === groupIndex && selected === index
                    ? "#badfe5e0"
                    : "white",
                cursor: "pointer",
                zIndex: 1000,
              }}
              onClick={() => {
                handleGroupFlightSelect(idx);
                onClick(index);
              }}
            >
              <div className="col-lg-3">
                <p>{itm?.segments[0].departure.substr(11, 5)}</p>
                <p style={{ fontSize: "12px" }}>
                  {moment(itm?.segments[0].departure).format("DD MMM,yyyy")}
                </p>
                <p className="fw-bold" style={{ fontSize: "12px" }}>
                  {airports
                    .filter((f) => f.iata === itm?.from)
                    .map((itm) => itm.city)}
                </p>
              </div>
              <div
                className="col-lg-3 text-center lh-1"
                style={{ fontSize: "10px" }}
              >
                <div>{itm?.segments[0].details[0].travelTime}</div>
                <span className="text-color">
                  <i className="fas fa-circle fa-xs"></i>
                  ---------------
                  <i className="fas fa-plane fa-sm"></i>
                </span>
                <div className="text-black-50">
                  {itm?.segments.length === 1
                    ? "Direct"
                    : itm?.segments.length - 1 + " Stop"}
                </div>
              </div>
              <div className="col-lg-3 text-end">
                <p>
                  {itm?.segments[itm?.segments.length - 1].arrival.substr(
                    11,
                    5
                  )}
                </p>
                <p style={{ fontSize: "12px" }}>
                  {moment(itm?.segments[0].arrival).format("DD MMM,yyyy")}
                </p>
                <p className="fw-bold" style={{ fontSize: "12px" }}>
                  {airports
                    .filter((f) => f.iata === itm?.to)
                    .map((itm) => itm.city)}
                </p>
              </div>
              <div className="col-lg-3 text-end">
                <span className="fw-bold" style={{ fontSize: "15px" }}>
                  <span className="fw-bold" style={{ fontSize: "15px" }}>
                    {amountChange === "Invoice Amount" ? (
                      <>
                        <div style={{ fontSize: "13px" }}>
                          <span className="fw-bold">
                            AED{" "}
                            {data?.brandedFares !== null
                              ? data.brandedFares?.[0]?.totalFare.toLocaleString(
                                  "en-US"
                                )
                              : data?.bookingComponents[0]?.totalPrice?.toLocaleString(
                                  "en-US"
                                )}
                          </span>
                        </div>

                        <div>
                          <del className="fw-bold" style={{ fontSize: "12px" }}>
                            AED{" "}
                            {data.brandedFares !== null
                              ? (
                                  data?.brandedFares?.[0]?.totalFare -
                                  data?.brandedFares?.[0]?.discount
                                ).toLocaleString("en-US")
                              : (
                                  data?.bookingComponents[0]?.totalPrice -
                                  data?.bookingComponents[0]?.discountPrice
                                )?.toLocaleString("en-US")}
                          </del>
                        </div>
                      </>
                    ) : (
                      <div>
                        <span className="fw-bold">
                          AED{" "}
                          {data.brandedFares !== null
                            ? (
                                data.brandedFares?.[0]?.totalFare -
                                data?.brandedFares?.[0]?.discount
                              ).toLocaleString("en-US")
                            : (
                                data?.bookingComponents[0]?.totalPrice -
                                data?.bookingComponents[0]?.discountPrice
                              )?.toLocaleString("en-US")}
                        </span>
                      </div>
                    )}
                  </span>
                </span>
              </div>
              {/* <div className="col-lg-1 d-flex justify-content-end align-items-center">
                <input
                  className="form-check-input"
                  type="radio"
                  name={name + index}
                  id={name + index}
                  value={index}
                  onChange={() => {
                    handleGroupFlightSelect(idx);
                    onClick(index);
                  }}
                  checked={
                    idx === groupIndex && selected === index ? true : false
                  }
                  style={{
                    border: "2px solid #068b9f",
                    transition: "all 0.3s ease",
                  }}
                />
              </div> */}
            </div>
          </>
        ))}
      </div>
      <div className="text-end py-0">
        <span style={{ color: data?.avlSrc, fontSize: "10px" }}>
          <i className="fas fa-circle fa-sm"></i>
        </span>
        {data?.refundable === true ? (
          <>
            <span style={{ fontSize: "10px" }} className="ms-1">
              {(data?.brandedFares === null ||
                data?.brandedFares === undefined ||
                data?.brandedFares?.length === 0) && (
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
            <span style={{ fontSize: "10px" }} className="ms-1">
              {(data?.brandedFares === null ||
                data?.brandedFares === undefined ||
                data?.brandedFares?.length === 0) && (
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
      </div>
    </div>
  );
};

export default Card;
