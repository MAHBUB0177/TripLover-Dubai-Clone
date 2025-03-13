import $ from "jquery";
import React, { useEffect } from "react";
import {
  cityWithIata,
  getFullPassengerType,
  passengerType,
  totalBaggageCost,
} from "../../../common/functions";
import { environment } from "../../SharePages/Utility/environment";
import "../RightSide/RightSide.css";
import moment from "moment";
import tllLogo from "../../../images/logo/logo-combined.png";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";

const BookConfirmModal = ({
  partialPaymentData,
  loader,
  adultValue,
  childValue,
  infantValue,
  hasExtraService,
}) => {
  let passengerFaresList = [...adultValue, ...childValue, ...infantValue];
  const searchData = JSON.parse(sessionStorage.getItem("Database"));
  const agentInfo = JSON.parse(sessionStorage.getItem("agentInfoData"));
  const currency = JSON.parse(sessionStorage.getItem("currency"));
  const directionList = [];
  const direction0 = JSON.parse(sessionStorage.getItem("direction0"));
  const direction1 = JSON.parse(sessionStorage.getItem("direction1"));
  const direction2 = JSON.parse(sessionStorage.getItem("direction2"));
  const direction3 = JSON.parse(sessionStorage.getItem("direction3"));
  const direction4 = JSON.parse(sessionStorage.getItem("direction4"));
  const direction5 = JSON.parse(sessionStorage.getItem("direction5"));
  directionList.push(direction0);
  directionList.push(direction1);
  directionList.push(direction2);
  directionList.push(direction3);
  directionList.push(direction4);
  directionList.push(direction5);

  const passengerFares = JSON.parse(sessionStorage.getItem("passengerFares"));
  const passengerCounts = JSON.parse(sessionStorage.getItem("passengerCounts"));
  const bookingComponents = JSON.parse(
    sessionStorage.getItem("bookingComponents")
  );
  const brandedFareSelectedIdx = JSON.parse(
    sessionStorage.getItem("brandedFareSelectedIdx")
  );
  const brandedFareList = JSON.parse(sessionStorage.getItem("brandedFareList"));

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
  return (
    <div style={{ width: "100%" }}>
      <div className="text-center fs-5 fw-bold mb-4 mt-4">Preview</div>

      <div className="table-responsive mt-2">
        <table class="table table-borderless table-sm">
          <tbody>
            <tr>
              {/* FIXED COMPANY LOGO */}
              {/* CHANGE THIS LATER */}
              <td className="text-start">
                {agentInfo?.logoName !== null ? (
                  <>
                    <img
                      alt="img01"
                      src={environment.s3URL + `${agentInfo?.logoName}`}
                      // crossOrigin="true"
                      style={{ width: "160px" }}
                    ></img>
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
                  <span className="fw-bold fs-6">{agentInfo.name}</span>
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
                    <span style={{ fontSize: "8px" }}>
                      <i class="fas fa-phone fa-rotate-90"></i>
                    </span>{" "}
                    Phone: {agentInfo.mobileNo}
                    <br></br>
                    <span className="me-1">
                      <i class="fa fa-envelope" aria-hidden="true"></i>
                    </span>{" "}
                    Email: {agentInfo.email}
                  </div>
                </address>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="table-responsive mt-2 style={{width:'100%'}}">
        <table
          class="table table-bordered table-sm mt-1"
          style={{ fontSize: "14px" }}
        >
          <thead>
            <tr>
              <th
                colspan="5"
                className="fw-bold py-2 bg-light"
                style={{ fontSize: "14px" }}
              >
                Passenger Information
              </th>
            </tr>
            <tr className="text-center">
              <th className="text-start">Name</th>
              <th>Type</th>
              <th>Date Of Birth</th>
              <th>Passport Number</th>
              <th>Passport Expire date</th>
            </tr>
          </thead>
          <tbody>
            {passengerFaresList &&
              passengerFaresList?.map((item, index) => {
                return (
                  <tr
                    className="text-center"
                    style={{ lineHeight: "14px" }}
                    key={index}
                  >
                    <td className="text-start" style={{ fontSize: "15px" }}>
                      {item?.title?.toUpperCase()}{" "}
                      {item?.firstName?.toUpperCase()}{" "}
                      {item?.lastName?.toUpperCase()}
                    </td>
                    <td>
                      {item?.type === "adt"
                        ? "Adult"
                        : item?.type === "chd"
                        ? "Child"
                        : item?.type === "cnn"
                        ? "Child"
                        : item?.type === "inf"
                        ? "Infant"
                        : ""}
                    </td>
                    <td>
                      {item?.dateOfBirth
                        ? moment(item?.dateOfBirth).format("ddd, DD MMM,YY")
                        : "N/A"}
                    </td>
                    <td>
                      {" "}
                      {item?.passportNumber ? item?.passportNumber : "N/A"}
                    </td>
                    <td>
                      {" "}
                      {item?.passportExDate
                        ? moment(item?.passportExDate).format("ddd, DD MMM,YY")
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="table-responsive mt-3">
        <div
          className="ps-1 py-2 fw-bold text-start bg-light border"
          style={{
            fontSize: "14px",
          }}
        >
          Flight Details
        </div>
        <div className="">
          <div className="border p-1" style={{ fontSize: "14px" }}>
            {directionList &&
              directionList.map((item, index) => {
                if (Object.keys(item).length > 0) {
                  return (
                    <div className="border my-1" key={index}>
                      {item?.segments.map((item, idx) => {
                        return (
                          <>
                            {item.details.length > 1 ? (
                              <>
                                {item.details.map((itm, idx) => (
                                  <div className="p-1" key={idx}>
                                    <span style={{ fontSize: "18px" }}>
                                      <span className="fw-bold">
                                        {cityWithIata(itm?.origin)}({itm.origin}
                                        )
                                      </span>
                                      <span className="mx-2 fw-bold">
                                        <i class="fas fa-arrow-right"></i>
                                      </span>
                                      <span className="fw-bold">
                                        {cityWithIata(itm?.destination)}(
                                        {itm.destination})
                                      </span>
                                    </span>
                                    <span className="d-flex align-items-center fw-bold">
                                      <img
                                        src={
                                          environment.s3ArliensImage +
                                          `${item?.airlineCode}.png`
                                        }
                                        className="me-2"
                                        alt=""
                                        width="30px"
                                        height="30px"
                                      ></img>
                                      {item.airline} ({item.airlineCode}-
                                      {item.flightNumber})
                                    </span>
                                    <table
                                      class="table table-borderless table-sm mt-1 table-responsive"
                                      style={{ fontSize: "14px" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th className="p-0">
                                            <p
                                              className="py-1 ps-1"
                                              style={{
                                                backgroundColor: "#ededed",
                                              }}
                                            >
                                              Date
                                            </p>
                                          </th>
                                          <th className="p-0">
                                            <p
                                              className="py-1 ps-1"
                                              style={{
                                                backgroundColor: "#ededed",
                                              }}
                                            >
                                              Time
                                            </p>
                                          </th>
                                          <th className="p-0">
                                            <p
                                              className="py-1 ps-1"
                                              style={{
                                                backgroundColor: "#ededed",
                                              }}
                                            >
                                              Flight Info
                                            </p>
                                          </th>
                                          <th className="p-0">
                                            <p
                                              className="py-1 ps-1"
                                              style={{
                                                backgroundColor: "#ededed",
                                              }}
                                            >
                                              Flight Time
                                            </p>
                                          </th>
                                          <th className="p-0">
                                            <p
                                              className="py-1 ps-1"
                                              style={{
                                                backgroundColor: "#ededed",
                                              }}
                                            >
                                              Cabin
                                            </p>
                                          </th>
                                          <th className="p-0">
                                            <p
                                              className="py-1 ps-1"
                                              style={{
                                                backgroundColor: "#ededed",
                                              }}
                                            >
                                              Baggage
                                            </p>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>
                                            {moment(itm.departure).format(
                                              "ddd DD MMM,YY "
                                            )}
                                            <br></br>
                                            {moment(itm.arrival).format(
                                              "ddd DD MMM,YY "
                                            )}
                                          </td>
                                          <td>
                                            {moment(itm.departure).format(
                                              "HH:mm"
                                            )}
                                            <br></br>
                                            {moment(itm.arrival).format(
                                              "HH:mm"
                                            )}
                                          </td>
                                          <td>
                                            <table
                                              className="p-0"
                                              style={{
                                                fontSize: "14px",
                                              }}
                                            >
                                              <tr className="p-0">
                                                <td className="p-0">Departs</td>
                                                <td className="py-0 fw-bold">
                                                  {cityWithIata(itm?.origin)}(
                                                  {itm.origin}){" "}
                                                  {itm.originTerminal !==
                                                    null &&
                                                  itm.originTerminal !== "" ? (
                                                    <>
                                                      Terminal-(
                                                      {itm.originTerminal})
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                              </tr>
                                              <tr className="p-0">
                                                <td className="p-0">Arrives</td>
                                                <td className="py-0 fw-bold">
                                                  {cityWithIata(
                                                    itm?.destination
                                                  )}
                                                  ({itm.destination}){" "}
                                                  {itm.destinationTerminal !==
                                                    null &&
                                                  itm.destinationTerminal !==
                                                    "" ? (
                                                    <>
                                                      Terminal-(
                                                      {itm.destinationTerminal})
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                              </tr>
                                            </table>
                                          </td>

                                          <td className="align-middle">
                                            {itm.flightTime}
                                          </td>
                                          <td className="align-middle">
                                            {brandedFareList !== null &&
                                            brandedFareList.length > 0 ? (
                                              <></>
                                            ) : (
                                              <>
                                                {item?.cabinClass
                                                  ? item?.cabinClass
                                                  : item.serviceClass}{" "}
                                                {"(" + item.bookingClass + ")"}
                                              </>
                                            )}
                                          </td>
                                          <td className="align-middle">
                                            {brandedFareList !== null &&
                                            brandedFareList.length > 0 ? (
                                              <>
                                                <div
                                                  style={{
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  {brandedFareList[
                                                    brandedFareSelectedIdx
                                                  ]?.brandFeatures
                                                    ?.CheckedBaggage !==
                                                    undefined &&
                                                    Object.keys(
                                                      brandedFareList[
                                                        brandedFareSelectedIdx
                                                      ]?.brandFeatures
                                                        ?.CheckedBaggage
                                                    ).map((itemKey) => {
                                                      const item =
                                                        brandedFareList[
                                                          brandedFareSelectedIdx
                                                        ]?.brandFeatures
                                                          ?.CheckedBaggage[
                                                          itemKey
                                                        ];
                                                      return (
                                                        <div
                                                          key={itemKey}
                                                          className="d-flex flex-wrap justify-content-start align-items-center gap-2"
                                                        >
                                                          {Object.keys(item)
                                                            .reverse()
                                                            .map(
                                                              (
                                                                innerKey,
                                                                index
                                                              ) => (
                                                                <div
                                                                  key={innerKey}
                                                                  className="d-flex justify-content-center align-items-center"
                                                                >
                                                                  <>
                                                                    {index /
                                                                      2 ===
                                                                      0 && (
                                                                      <div className="d-flex justify-content-center align-items-center gap-1">
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
                                                                          {
                                                                            item.weights
                                                                          }
                                                                          )
                                                                        </div>
                                                                      </div>
                                                                    )}
                                                                  </>
                                                                </div>
                                                              )
                                                            )}
                                                        </div>
                                                      );
                                                    })}
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                {item?.baggage?.map(
                                                  (item, idx) => {
                                                    return (
                                                      <div key={idx}>
                                                        <span>
                                                          {getFullPassengerType(
                                                            item.passengerTypeCode
                                                          )}{" "}
                                                          : {item?.amount}{" "}
                                                          {item?.units}{" "}
                                                          <br></br>
                                                        </span>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="p-1">
                                <span style={{ fontSize: "18px" }}>
                                  <span className="fw-bold">
                                    {cityWithIata(item?.from)}({item.from})
                                  </span>
                                  <span className="mx-2 fw-bold">
                                    <i class="fas fa-arrow-right"></i>
                                  </span>
                                  <span className="fw-bold">
                                    {cityWithIata(item?.to)}({item.to})
                                  </span>
                                </span>
                                <span className="d-flex align-items-center fw-bold">
                                  <img
                                    src={
                                      environment.s3ArliensImage +
                                      `${item?.airlineCode}.png`
                                    }
                                    className="me-2"
                                    alt=""
                                    width="30px"
                                    height="30px"
                                  ></img>
                                  {item.airline} ({item.airlineCode}-
                                  {item.flightNumber})
                                </span>
                                <table
                                  class="table table-borderless table-sm mt-1 table-responsive"
                                  style={{ fontSize: "14px" }}
                                >
                                  <thead>
                                    <tr>
                                      <th className="p-0">
                                        <p
                                          className="py-1 ps-1"
                                          style={{
                                            backgroundColor: "#ededed",
                                          }}
                                        >
                                          Date
                                        </p>
                                      </th>
                                      <th className="p-0">
                                        <p
                                          className="py-1 ps-1"
                                          style={{
                                            backgroundColor: "#ededed",
                                          }}
                                        >
                                          Time
                                        </p>
                                      </th>
                                      <th className="p-0">
                                        <p
                                          className="py-1 ps-1"
                                          style={{
                                            backgroundColor: "#ededed",
                                          }}
                                        >
                                          Flight Info
                                        </p>
                                      </th>
                                      <th className="p-0">
                                        <p
                                          className="py-1 ps-1"
                                          style={{
                                            backgroundColor: "#ededed",
                                          }}
                                        >
                                          Flight Time
                                        </p>
                                      </th>
                                      <th className="p-0">
                                        <p
                                          className="py-1 ps-1"
                                          style={{
                                            backgroundColor: "#ededed",
                                          }}
                                        >
                                          Cabin
                                        </p>
                                      </th>
                                      <th className="p-0">
                                        <p
                                          className="py-1 ps-1"
                                          style={{
                                            backgroundColor: "#ededed",
                                          }}
                                        >
                                          Baggage
                                        </p>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        {moment(item.departure).format(
                                          "ddd DD MMM,YY "
                                        )}
                                        <br></br>
                                        {moment(item.arrival).format(
                                          "ddd DD MMM,YY "
                                        )}
                                      </td>
                                      <td>
                                        {moment(item.departure).format("HH:mm")}
                                        <br></br>
                                        {moment(item.arrival).format("HH:mm")}
                                      </td>
                                      <td>
                                        <table
                                          className="p-0"
                                          style={{
                                            fontSize: "14px",
                                          }}
                                        >
                                          <tr className="p-0">
                                            <td className="p-0">Departs</td>
                                            <td className="py-0 fw-bold">
                                              {cityWithIata(item?.from)}(
                                              {item.from}){" "}
                                              {item.details[0]
                                                .originTerminal !== null &&
                                              item.details[0].originTerminal !==
                                                "" ? (
                                                <>
                                                  Terminal-(
                                                  {
                                                    item.details[0]
                                                      .originTerminal
                                                  }
                                                  )
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                            </td>
                                          </tr>
                                          <tr className="p-0">
                                            <td className="p-0">Arrives</td>
                                            <td className="py-0 fw-bold">
                                              {cityWithIata(item?.to)}({item.to}
                                              ){" "}
                                              {item.details[0]
                                                .destinationTerminal !== null &&
                                              item.details[0]
                                                .destinationTerminal !== "" ? (
                                                <>
                                                  Terminal-(
                                                  {
                                                    item.details[0]
                                                      .destinationTerminal
                                                  }
                                                  )
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>

                                      <td className="align-middle">
                                        {item.details[0].flightTime}
                                      </td>
                                      <td className="align-middle">
                                        {brandedFareList !== null &&
                                        brandedFareList.length > 0 ? (
                                          <>
                                            {Object.keys(
                                              brandedFareList[
                                                brandedFareSelectedIdx
                                              ].bookingClasses
                                            ).map((innerKey, i) => {
                                              return (
                                                <React.Fragment key={i}>
                                                  {innerKey ===
                                                    item?.from +
                                                      "-" +
                                                      item?.to && (
                                                    <span>
                                                      {
                                                        brandedFareList[
                                                          brandedFareSelectedIdx
                                                        ].bookingClasses[
                                                          innerKey
                                                        ]
                                                      }
                                                      (
                                                      {brandedFareList[
                                                        brandedFareSelectedIdx
                                                      ].cabinClasses[
                                                        innerKey
                                                      ] !== ""
                                                        ? brandedFareList[
                                                            brandedFareSelectedIdx
                                                          ].cabinClasses[
                                                            innerKey
                                                          ]
                                                        : searchData?.travelClass}
                                                      )
                                                    </span>
                                                  )}
                                                </React.Fragment>
                                              );
                                            })}
                                          </>
                                        ) : (
                                          <>
                                            {item?.cabinClass
                                              ? item?.cabinClass
                                              : item.serviceClass}{" "}
                                            {"(" + item.bookingClass + ")"}
                                          </>
                                        )}
                                      </td>
                                      <td className="align-middle">
                                        {brandedFareList !== null &&
                                        brandedFareList.length > 0 ? (
                                          <>
                                            <div
                                              style={{
                                                fontSize: "12px",
                                              }}
                                            >
                                              {brandedFareList[
                                                brandedFareSelectedIdx
                                              ]?.brandFeatures
                                                ?.CheckedBaggage !==
                                                undefined &&
                                                Object.keys(
                                                  brandedFareList[
                                                    brandedFareSelectedIdx
                                                  ]?.brandFeatures
                                                    ?.CheckedBaggage
                                                ).map((itemKey) => {
                                                  const item =
                                                    brandedFareList[
                                                      brandedFareSelectedIdx
                                                    ]?.brandFeatures
                                                      ?.CheckedBaggage[itemKey];
                                                  return (
                                                    <div
                                                      key={itemKey}
                                                      className="d-flex justify-content-start align-items-center gap-1"
                                                    >
                                                      {Object.keys(item[index])
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
                                                                  )}
                                                                </div>
                                                              )}

                                                              {innerKey ===
                                                                "weights" && (
                                                                <div
                                                                  className="fw-bold"
                                                                  style={{
                                                                    fontSize:
                                                                      "10px",
                                                                  }}
                                                                >
                                                                  (
                                                                  {
                                                                    item[index][
                                                                      innerKey
                                                                    ]
                                                                  }
                                                                  )
                                                                </div>
                                                              )}
                                                            </div>
                                                          </div>
                                                        ))}
                                                    </div>
                                                  );
                                                })}
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            {item?.baggage?.map((item, idx) => {
                                              return (
                                                <div key={idx}>
                                                  <span>
                                                    {getFullPassengerType(
                                                      item.passengerTypeCode
                                                    )}{" "}
                                                    : {item?.amount}{" "}
                                                    {item?.units} <br></br>
                                                  </span>
                                                </div>
                                              );
                                            })}
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </>
                        );
                      })}
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>

      <div className="table-responsive-sm mt-1">
        <table
          className="table table-bordered border-dark p-2 table-sm bg-white rounded "
          style={{ fontSize: "12px" }}
        >
          <thead className="text-center fw-bold ">
            <tr>
              <th
                colspan="8"
                className="fw-bold text-start py-2 bg-light"
                style={{
                  fontSize: "14px",
                }}
              >
                Fare Details
              </th>
            </tr>
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
          {brandedFareList !== null && brandedFareList.length > 0 ? (
            <tbody className="text-end">
              {brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown.adt !==
              null ? (
                <>
                  <tr className="text-end">
                    <td className="text-center">Adult</td>
                    <td className="left">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.adt.basePrice.toLocaleString("en-US")}
                    </td>
                    <td className="center">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.adt.taxes.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.adt.discountPrice.toLocaleString(
                        "en-US"
                      )}
                    </td>
                    <td className="right">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.adt.ait.toLocaleString("en-US")}
                    </td>
                    <td className="right">{passengerCounts.adt}</td>
                    <td className="right fw-bold">
                      {currency !== undefined ? currency : "AED"}{" "}
                      {(
                        brandedFareList[brandedFareSelectedIdx]
                          ?.paxFareBreakDown.adt.totalPrice *
                        passengerCounts.adt
                      ).toLocaleString("en-US")}
                    </td>
                  </tr>
                </>
              ) : (
                <></>
              )}

              {brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown.chd !==
              null ? (
                <>
                  <tr>
                    <td className="text-center">Child &gt; 5</td>
                    <td className="left">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.chd.basePrice.toLocaleString("en-US")}
                    </td>
                    <td className="center">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.chd.taxes.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.chd.discountPrice.toLocaleString(
                        "en-US"
                      )}
                    </td>
                    <td className="right">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.chd.ait.toLocaleString("en-US")}
                    </td>
                    <td className="right">{passengerCounts.chd}</td>
                    <td className="right fw-bold">
                      {currency !== undefined ? currency : "AED"}{" "}
                      {(
                        brandedFareList[brandedFareSelectedIdx]
                          ?.paxFareBreakDown.chd.totalPrice *
                        passengerCounts.chd
                      ).toLocaleString("en-US")}
                    </td>
                  </tr>
                </>
              ) : (
                <></>
              )}

              {brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown.cnn !==
              null ? (
                <>
                  <tr>
                    <td className="text-center">
                      Child{" "}
                      {brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown
                        .chd === null ? (
                        <></>
                      ) : (
                        <> &#60; 5</>
                      )}
                    </td>
                    <td className="left">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.cnn.basePrice.toLocaleString("en-US")}
                    </td>
                    <td className="center">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.cnn.taxes.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.cnn.discountPrice.toLocaleString(
                        "en-US"
                      )}
                    </td>
                    <td className="right">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.cnn.ait.toLocaleString("en-US")}
                    </td>
                    <td className="right">{passengerCounts.cnn}</td>
                    <td className="right fw-bold">
                      {currency !== undefined ? currency : "AED"}{" "}
                      {(
                        brandedFareList[brandedFareSelectedIdx]
                          ?.paxFareBreakDown.cnn.totalPrice *
                        passengerCounts.cnn
                      ).toLocaleString("en-US")}
                    </td>
                  </tr>
                </>
              ) : (
                <></>
              )}

              {brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown.inf !==
              null ? (
                <>
                  <tr>
                    <td className="text-center">Infant</td>
                    <td className="left">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.inf.basePrice.toLocaleString("en-US")}
                    </td>
                    <td className="center">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.inf.taxes.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.inf.discountPrice.toLocaleString(
                        "en-US"
                      )}
                    </td>
                    <td className="right">
                      {brandedFareList[
                        brandedFareSelectedIdx
                      ]?.paxFareBreakDown.inf.ait.toLocaleString("en-US")}
                    </td>
                    <td className="right">{passengerCounts.inf}</td>
                    <td className="right fw-bold">
                      {currency !== undefined ? currency : "AED"}{" "}
                      {(
                        brandedFareList[brandedFareSelectedIdx]
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
                  {/* {ticketingList.passengerInfo[0]?.currencyName}{" "} */}
                  {brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown
                    .adt !== null &&
                    (
                      brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown
                        .adt.totalPrice *
                        passengerCounts.adt +
                      (brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown
                        .chd !== null &&
                        brandedFareList[brandedFareSelectedIdx]
                          ?.paxFareBreakDown.chd.totalPrice *
                          passengerCounts.chd) +
                      (brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown
                        .cnn !== null &&
                        brandedFareList[brandedFareSelectedIdx]
                          ?.paxFareBreakDown.cnn.totalPrice *
                          passengerCounts.cnn) +
                      (brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown
                        .inf !== null &&
                        brandedFareList[brandedFareSelectedIdx]
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
                      {passengerFares.adt.basePrice.toLocaleString("en-US")}
                    </td>
                    <td className="center">
                      {passengerFares.adt.taxes.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {passengerFares.adt.discountPrice.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {passengerFares.adt.ait.toLocaleString("en-US")}
                    </td>
                    <td className="right">{passengerCounts.adt}</td>
                    <td className="right fw-bold">
                      {currency !== undefined ? currency : "AED"}{" "}
                      {(
                        passengerFares.adt.totalPrice * passengerCounts.adt
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
                    <td className="text-center">Child &gt; 5</td>
                    <td className="left">
                      {passengerFares.chd.basePrice.toLocaleString("en-US")}
                    </td>
                    <td className="center">
                      {passengerFares.chd.taxes.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {passengerFares.chd.discountPrice.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {passengerFares.chd.ait.toLocaleString("en-US")}
                    </td>
                    <td className="right">{passengerCounts.chd}</td>
                    <td className="right fw-bold">
                      {currency !== undefined ? currency : "AED"}{" "}
                      {(
                        passengerFares.chd.totalPrice * passengerCounts.chd
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
                      {passengerFares.chd === null ? <></> : <> &#60; 5</>}
                    </td>
                    <td className="left">
                      {passengerFares.cnn.basePrice.toLocaleString("en-US")}
                    </td>
                    <td className="center">
                      {passengerFares.cnn.taxes.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {passengerFares.cnn.discountPrice.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {passengerFares.cnn.ait.toLocaleString("en-US")}
                    </td>
                    <td className="right">{passengerCounts.cnn}</td>
                    <td className="right fw-bold">
                      {currency !== undefined ? currency : "AED"}{" "}
                      {(
                        passengerFares.cnn.totalPrice * passengerCounts.cnn
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
                      {passengerFares.inf.basePrice.toLocaleString("en-US")}
                    </td>
                    <td className="center">
                      {passengerFares.inf.taxes.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {passengerFares.inf.discountPrice.toLocaleString("en-US")}
                    </td>
                    <td className="right">
                      {passengerFares.inf.ait.toLocaleString("en-US")}
                    </td>
                    <td className="right">{passengerCounts.inf}</td>
                    <td className="right fw-bold">
                      {currency !== undefined ? currency : "AED"}{" "}
                      {(
                        passengerFares.inf.totalPrice * passengerCounts.inf
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
                  {/* {ticketingList.passengerInfo[0]?.currencyName}{" "} */}
                  {bookingComponents[0].totalPrice.toLocaleString("en-US")}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <div>
        {hasExtraService && (
          <div
            className="col-lg-12 border py-1 mb-1"
            style={{ color: "#4e4e4e" }}
          >
            <div className="row  py-2">
              <div className="col-lg-6">
                <h6 style={{ fontSize: "14px" }} className="text-start fw-bold">
                  Extra Baggage payable
                </h6>
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

        {hasExtraService && (
          <div
            className="col-lg-12 border py-1 mb-1"
            style={{ color: "#4e4e4e" }}
          >
            <div className="row  py-2">
              <div className="col-lg-6">
                <h6 style={{ fontSize: "14px" }} className="text-start fw-bold">
                  Grand Total
                </h6>
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

        {loader ? (
          <div className="d-flex align-items-center justify-content-center my-3">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {partialPaymentData?.isEligible && (
              <div
                className="col-lg-12 border py-1 mb-1"
                style={{ color: "#4e4e4e" }}
              >
                <div className="row  py-2">
                  <div className="col-lg-6">
                    <h6 className="text-start fw-bold">Partial Payment</h6>
                  </div>
                  <div className="col-lg-6">
                    <h6 className="text-end fw-bold">
                      {currency !== undefined ? currency : "AED"}{" "}
                      {partialPaymentData?.instantPay.toLocaleString("en-US")}
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookConfirmModal;
