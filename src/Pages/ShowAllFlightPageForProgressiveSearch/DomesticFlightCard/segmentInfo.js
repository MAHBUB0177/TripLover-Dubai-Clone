import React from "react";
import { environment } from "../../SharePages/Utility/environment";
import layOver from "../../SharePages/Utility/layOver";
import moment from "moment";
import {
  addDurations,
  timeDuration,
  totalFlightDuration,
} from "../../../common/functions";
import airports from "../../../JSON/airports.json";
import { Text } from "@chakra-ui/react";

const SegmentInfo = ({ direction, brandedFares, selectedBrandedFareIdx }) => {
  const searchData = JSON.parse(sessionStorage.getItem("Database"));
  return (
    <>
      {direction.segments.map((seg, index) => (
        <div key={index}>
          {index === 0 ? (
            <div className="row py-2 px-0 border button-color text-white">
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
                        direction.segments[direction.segments.length - 1].to
                    )
                    .map((item) => item.city)}
                </span>
              </div>
              <div className="col-lg-3 fs-6 fw-bold">
                <span>
                  Duration :{" "}
                  {direction.segments.length === 1
                    ? totalFlightDuration(direction.segments)
                    : direction.segments.length === 2
                    ? addDurations([
                        totalFlightDuration(direction.segments),
                        timeDuration(
                          direction.segments[index].arrival,
                          direction.segments[index + 1].departure
                        ),
                      ])
                    : direction.segments.length === 3
                    ? addDurations([
                        totalFlightDuration(direction.segments),
                        timeDuration(
                          direction.segments[index].arrival,
                          direction.segments[index + 1].departure
                        ),
                        timeDuration(
                          direction.segments[index + 1].arrival,
                          direction.segments[index + 2].departure
                        ),
                      ])
                    : ""}
                </span>
                {direction.segments.length > 1 && (
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
                                seg.details[index + 1]?.departure,
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
                              direction.segments[index]?.departure,
                              direction.segments[index - 1]?.arrival
                            )}
                          </>
                        ) : (
                          <>
                            {layOver(
                              seg.details[index]?.departure,
                              seg.details[index - 1]?.arrival
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
                          environment.s3ArliensImage + `${seg.airlineCode}.png`
                        }
                        alt=""
                        width="40px"
                        height="40px"
                      />
                    </div>
                    <div className="col-lg-3 d-block">
                      <p className="my-auto text-start">{seg.airline}</p>
                      <p className="my-auto text-start">{item.equipment}</p>
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
                        {moment(item.departure).format("DD MMMM,yyyy, dddd")}
                      </span>
                      <br></br>
                      <h6 className="text-start">{item.originName}</h6>
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
                        {moment(item.arrival).format("DD MMMM,yyyy, dddd")}
                      </span>
                      <br></br>
                      <h6 className="text-start">{item.destinationName}</h6>
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
                      direction.segments[index]?.departure,
                      direction.segments[index - 1]?.arrival
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="row py-4 p-2 border align-items-center shadow">
                <div className="col-lg-1">
                  <img
                    src={environment.s3ArliensImage + `${seg.airlineCode}.png`}
                    alt=""
                    width="40px"
                    height="40px"
                  />
                </div>
                <div className="col-lg-3 d-block">
                  <p className="my-auto text-start">{seg.airline}</p>
                  <p className="my-auto text-start">
                    {seg.airlineCode}-{seg.flightNumber}{" "}
                    <span style={{ fontSize: "13px" }} className="fw-bold">
                      Class(
                      {brandedFares !== null &&
                      brandedFares !== undefined &&
                      brandedFares?.length > 0 ? (
                        <>
                          {Object.keys(
                            brandedFares[selectedBrandedFareIdx]?.bookingClasses
                          ).map((innerKey, idex) => {
                            return (
                              <>
                                {index === idex && (
                                  <span>
                                    {
                                      brandedFares[selectedBrandedFareIdx]
                                        .bookingClasses[innerKey]
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
                      ) {seg.bookingCount > 0 && <>Seats({seg.bookingCount})</>}
                    </span>
                  </p>
                  <p className="my-auto text-start">
                    {seg.details[0].equipment}
                  </p>
                  <p className="my-auto text-start">
                    <span style={{ fontSize: "13px" }} className="fw-bold">
                      {brandedFares !== null &&
                      brandedFares !== undefined &&
                      brandedFares?.length > 0 ? (
                        <>
                          {Object.keys(
                            brandedFares[selectedBrandedFareIdx].cabinClasses
                          ).map((innerKey, idex) => {
                            return (
                              <>
                                {index === idex && (
                                  <span>
                                    {brandedFares[selectedBrandedFareIdx]
                                      .cabinClasses[innerKey] !== ""
                                      ? brandedFares[selectedBrandedFareIdx]
                                          .cabinClasses[innerKey]
                                      : searchData?.travelClass}
                                  </span>
                                )}
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          {seg.cabinClass ? seg.cabinClass : seg.serviceClass}
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
                    {moment(seg.departure).format("DD MMMM,yyyy, dddd")}
                  </span>
                  <br></br>
                  <h6 className="text-start">{seg.fromAirport}</h6>
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
                    {moment(seg.arrival).format("DD MMMM,yyyy, dddd")}
                  </span>
                  <br></br>
                  <h6 className="text-start">{seg.toAirport}</h6>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default SegmentInfo;
