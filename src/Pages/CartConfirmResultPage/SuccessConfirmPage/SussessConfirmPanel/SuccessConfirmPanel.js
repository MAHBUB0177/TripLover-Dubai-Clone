import React from "react";
import { useNavigate } from "react-router-dom";
import DurationFormat from "../../../SharePages/Utility/DurationFormat";
import { environment } from "../../../SharePages/Utility/environment";
import { ticketIssue } from "../../../../common/allApi";

const SuccessConfirmPanel = () => {
  const navigate = useNavigate();
  const filterParam = JSON.parse(sessionStorage.getItem("Database"));
  const flightType = filterParam.flightType;
  const direction0 = JSON.parse(localStorage.getItem("direction0"));
  const direction1 = JSON.parse(localStorage.getItem("direction1"));
  const direction2 = JSON.parse(localStorage.getItem("direction2"));
  const direction3 = JSON.parse(localStorage.getItem("direction3"));
  const direction4 = JSON.parse(localStorage.getItem("direction4"));
  const direction5 = JSON.parse(localStorage.getItem("direction5"));
  const flightConfirm = JSON.parse(localStorage.getItem("flightConfirm"));
  const passengerPack = JSON.parse(localStorage.getItem("passengerPack"));
  const ImageUrlD = `https://tjwlcdn.com/img/air/${direction0.PlatingCarrier}.png`;
  const ImageUrlR =
    Object.keys(direction1).length > 0
      ? `https://tjwlcdn.com/img/air/${direction1.PlatingCarrier}.png`
      : ``;

  const handleGenarateTicket = () => {
    const sendObjTicket = {
      pnr: flightConfirm.item1.pnr,
      bookingRefNumber: flightConfirm.item1.bookingRefNumber,
      priceCodeRef: flightConfirm.item1.priceCodeRef,
      uniqueTransID: flightConfirm.item1.uniqueTransID,
      itemCodeRef: flightConfirm.item1.itemCodeRef,
      bookingCodeRef: flightConfirm.item1.bookingCodeRef,
      commission: 0,
    };

    async function fetchOptions() {
      ticketIssue(sendObjTicket)
        .then((response) => {
          if (response.data.item2.isSuccess === true) {
            localStorage.setItem(
              "ticketConfirm",
              JSON.stringify(response.data)
            );
            navigate("/successticket");
          } else {
            navigate("/failticket");
          }
        });
    }
    fetchOptions();
  };

  return (
    <div>
      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-12">
            <h4 className="fw-bold">
              Thank You! Your Booking Is Successfully!
            </h4>
            <p className="fs-5 fw-bold">
              Reservation Reference - {flightConfirm.item1.pnr}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <button className="btn btn-danger" onClick={handleGenarateTicket}>
              Generate Ticket
            </button>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row mx-5 mt-5 mb-3">
          <table className="table table-borderless table-sm">
            <tr>
              <th className="fw-bold">PASSENGER NAME</th>
              <th className="fw-bold">TYPE</th>
              <th className="fw-bold">Date of birth</th>
              <th className="fw-bold">Passport Number</th>
            </tr>
            {passengerPack.passengerInfoes.map((item, index) => (
              <tbody key={index}>
                <tr>
                  <td>
                    {item.nameElement.title} {item.nameElement.firstName}{" "}
                    {item.nameElement.lastName}
                  </td>
                  <td>{item.passengerType}</td>
                  <td>{item.dateOfBirth}</td>
                  <td>{item.documentInfo.documentNumber}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>

        <div className="row mx-5 mt-2">
          <h5 className="bg-dark text-white py-1">FLIGHT DETAILS</h5>
          {flightType > 2 ? (
            <>
              <>
                <div className="col-lg-1 my-auto me-3">
                  <img src={ImageUrlD} alt="" width="40px" height="40px" />
                </div>

                <div className="col-lg-2 my-auto">
                  <span className="fw-bold">
                    {direction0.segments[0].departure.substr(11, 5)}
                  </span>
                  <p className="my-auto">{direction0.from}</p>
                </div>
                <div className="col-lg-6 my-auto">
                  <div className="row">
                    <div className="col-lg-12 text-center">
                      <span className="text-danger fw-bold font-size">
                        {direction0.stops === 0
                          ? "Direct"
                          : direction0.stops + " Stop(s)"}
                      </span>
                    </div>
                    <div className="col-lg-12">
                      <span className="text-black-50">
                        -----------------------------
                        <i className="fas fa-plane fa-sm"></i>
                      </span>
                    </div>
                    <div className="col-lg-12 text-center ms-4">
                      <span className="text-black-50 me-5">
                        <i className="fas fa-clock fa-sm"></i>
                        <span className="ms-1 font-size">
                          {DurationFormat(
                            direction0.segments[0].details[0].travelTime
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 my-auto">
                  <span className="fw-bold">
                    {direction0.segments[
                      direction0.segments.length - 1
                    ].arrival.substr(11, 5)}
                  </span>
                  <p className="my-auto">{direction0.to}</p>
                </div>
              </>
              <>
                <div className="col-lg-1 my-auto me-3">
                  <img src={ImageUrlD} alt="" width="40px" height="40px" />
                </div>

                <div className="col-lg-2 my-auto">
                  <span className="fw-bold">
                    {direction1.segments[0].departure.substr(11, 5)}
                  </span>
                  <p className="my-auto">{direction1.from}</p>
                </div>
                <div className="col-lg-6 my-auto">
                  <div className="row">
                    <div className="col-lg-12 text-center">
                      <span className="text-danger fw-bold font-size">
                        {direction1.stops === 0
                          ? "Direct"
                          : direction1.stops + " Stop"}
                      </span>
                    </div>
                    <div className="col-lg-12">
                      <span className="text-black-50">
                        -----------------------------
                        <i className="fas fa-plane fa-sm"></i>
                      </span>
                    </div>
                    <div className="col-lg-12 text-center ms-4">
                      <span className="text-black-50 me-5">
                        <i className="fas fa-clock fa-sm"></i>
                        <span className="ms-1 font-size">
                          {DurationFormat(
                            direction1.segments[0].details[0].travelTime
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 my-auto">
                  <span className="fw-bold">
                    {direction1.segments[
                      direction1.segments.length - 1
                    ].arrival.substr(11, 5)}
                  </span>
                  <p className="my-auto">{direction1.to}</p>
                </div>
              </>
              {direction2.segments !== undefined ? (
                <>
                  <div className="col-lg-1 my-auto me-3">
                    <img src={ImageUrlD} alt="" width="40px" height="40px" />
                  </div>

                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold">
                      {direction2.segments[0].departure.substr(11, 5)}
                    </span>
                    <p className="my-auto">{direction2.from}</p>
                  </div>
                  <div className="col-lg-6 my-auto">
                    <div className="row">
                      <div className="col-lg-12 text-center">
                        <span className="text-danger fw-bold font-size">
                          {direction2.stops === 0
                            ? "Direct"
                            : direction2.stops + " Stop"}
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <span className="text-black-50">
                          -----------------------------
                          <i className="fas fa-plane fa-sm"></i>
                        </span>
                      </div>
                      <div className="col-lg-12 text-center ms-4">
                        <span className="text-black-50 me-5">
                          <i className="fas fa-clock fa-sm"></i>
                          <span className="ms-1 font-size">
                            {DurationFormat(
                              direction2.segments[0].details[0].travelTime
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold">
                      {direction2.segments[
                        direction2.segments.length - 1
                      ].arrival.substr(11, 5)}
                    </span>
                    <p className="my-auto">{direction2.to}</p>
                  </div>
                </>
              ) : (
                <></>
              )}

              {direction3.segments !== undefined ? (
                <>
                  <div className="col-lg-1 my-auto me-3">
                    <img src={ImageUrlD} alt="" width="40px" height="40px" />
                  </div>

                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold">
                      {direction3.segments[0].departure.substr(11, 5)}
                    </span>
                    <p className="my-auto">{direction3.from}</p>
                  </div>
                  <div className="col-lg-6 my-auto">
                    <div className="row">
                      <div className="col-lg-12 text-center">
                        <span className="text-danger fw-bold font-size">
                          {direction3.stops === 0
                            ? "Direct"
                            : direction3.stops + " Stop"}
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <span className="text-black-50">
                          -----------------------------
                          <i className="fas fa-plane fa-sm"></i>
                        </span>
                      </div>
                      <div className="col-lg-12 text-center ms-4">
                        <span className="text-black-50 me-5">
                          <i className="fas fa-clock fa-sm"></i>
                          <span className="ms-1 font-size">
                            {DurationFormat(
                              direction3.segments[0].details[0].travelTime
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold">
                      {direction3.segments[
                        direction3.segments.length - 1
                      ].arrival.substr(11, 5)}
                    </span>
                    <p className="my-auto">{direction3.to}</p>
                  </div>
                </>
              ) : (
                <></>
              )}

              {direction4.segments !== undefined ? (
                <>
                  <div className="col-lg-1 my-auto me-3">
                    <img src={ImageUrlD} alt="" width="40px" height="40px" />
                  </div>

                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold">
                      {direction4.segments[0].departure.substr(11, 5)}
                    </span>
                    <p className="my-auto">{direction4.from}</p>
                  </div>
                  <div className="col-lg-6 my-auto">
                    <div className="row">
                      <div className="col-lg-12 text-center">
                        <span className="text-danger fw-bold font-size">
                          {direction4.stops === 0
                            ? "Direct"
                            : direction4.stops + " Stop"}
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <span className="text-black-50">
                          -----------------------------
                          <i className="fas fa-plane fa-sm"></i>
                        </span>
                      </div>
                      <div className="col-lg-12 text-center ms-4">
                        <span className="text-black-50 me-5">
                          <i className="fas fa-clock fa-sm"></i>
                          <span className="ms-1 font-size">
                            {DurationFormat(
                              direction4.segments[0].details[0].travelTime
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold">
                      {direction4.segments[
                        direction4.segments.length - 1
                      ].arrival.substr(11, 5)}
                    </span>
                    <p className="my-auto">{direction4.to}</p>
                  </div>
                </>
              ) : (
                <></>
              )}

              {direction5.segments !== undefined ? (
                <>
                  <div className="col-lg-1 my-auto me-3">
                    <img src={ImageUrlD} alt="" width="40px" height="40px" />
                  </div>

                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold">
                      {direction5.segments[0].departure.substr(11, 5)}
                    </span>
                    <p className="my-auto">{direction5.from}</p>
                  </div>
                  <div className="col-lg-6 my-auto">
                    <div className="row">
                      <div className="col-lg-12 text-center">
                        <span className="text-danger fw-bold font-size">
                          {direction5.stops === 0
                            ? "Direct"
                            : direction5.stops + " Stop"}
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <span className="text-black-50">
                          -----------------------------
                          <i className="fas fa-plane fa-sm"></i>
                        </span>
                      </div>
                      <div className="col-lg-12 text-center ms-4">
                        <span className="text-black-50 me-5">
                          <i className="fas fa-clock fa-sm"></i>
                          <span className="ms-1 font-size">
                            {DurationFormat(
                              direction5.segments[0].details[0].travelTime
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold">
                      {direction5.segments[
                        direction5.segments.length - 1
                      ].arrival.substr(11, 5)}
                    </span>
                    <p className="my-auto">{direction5.to}</p>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              <div className="container mt-2">
                <div className="row mb-1">
                  <div className="col-lg-4 my-auto">
                    <img src={ImageUrlD} alt="" width="40px" height="40px" />
                    <span>{direction0.platingCarrierName}</span>
                  </div>
                  <div className="col-lg-3 my-auto"></div>
                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold d-block fs-5">
                      {direction0.segments[0].details[0].equipment}
                    </span>
                    <span>DEPARTS</span>
                  </div>
                  <div className="col-lg-3 my-auto">
                    <span className="fw-bold d-block fs-5">
                      {filterParam.travelerClass}
                    </span>
                    <span>
                      {direction0.fromAirport} ({direction0.from})
                    </span>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold fs-5 d-block">
                      {direction0.from}
                    </span>
                    <span className="d-block">
                      {direction0.segments[0].departure.substr(11, 5)}
                    </span>
                    <span>
                      {direction0.segments[0].departure.substr(0, 10)}
                    </span>
                  </div>
                  <div className="col-lg-2 my-auto">
                    <span className="text-black-50">
                      -------------------------
                      <i className="fas fa-plane fa-sm"></i>
                    </span>
                  </div>
                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold fs-5 d-block">
                      {direction0.to}
                    </span>
                    <span className="d-block">
                      {" "}
                      {direction0.segments[
                        direction0.segments.length - 1
                      ].arrival.substr(11, 5)}
                    </span>
                    <span>{direction0.segments[0].arrival.substr(0, 10)}</span>
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-lg-2 my-auto">
                    <span className="fw-bold fs-6 d-block">ARRIVAL</span>
                  </div>
                  <div className="col-lg-3 my-auto">
                    <span className="fw-bold fs-6 d-block">
                      {direction0.toAirport} ({direction0.to})
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
          {flightType > 2 ? (
            <></>
          ) : (
            <>
              {Object.keys(direction1).length > 0 ? (
                <>
                  <hr />{" "}
                  <div className="container mt-2">
                    <div className="row mb-1">
                      <div className="col-lg-4 my-auto">
                        <img
                          src={ImageUrlR}
                          alt=""
                          width="40px"
                          height="40px"
                        />
                        <span>{direction1.platingCarrierName}</span>
                      </div>
                      <div className="col-lg-3 my-auto"></div>
                      <div className="col-lg-2 my-auto">
                        <span className="fw-bold d-block fs-5">
                          {direction1.segments[0].details[0].equipment}
                        </span>
                        <span>DEPARTS</span>
                      </div>
                      <div className="col-lg-3 my-auto">
                        <span className="fw-bold d-block fs-5">
                          {filterParam.travelerClass}
                        </span>
                        <span>
                          {direction1.fromAirport} ({direction1.from})
                        </span>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-2 my-auto">
                        <span className="fw-bold fs-5 d-block">
                          {direction1.from}
                        </span>
                        <span className="d-block">
                          {direction1.segments[0].departure.substr(11, 5)}
                        </span>
                        <span>
                          {direction1.segments[0].departure.substr(0, 10)}
                        </span>
                      </div>
                      <div className="col-lg-2 my-auto">
                        <span className="text-black-50">
                          -------------------------
                          <i className="fas fa-plane fa-sm"></i>
                        </span>
                      </div>
                      <div className="col-lg-2 my-auto">
                        <span className="fw-bold fs-5 d-block">
                          {direction1.to}
                        </span>
                        <span className="d-block">
                          {" "}
                          {direction1.segments[
                            direction1.segments.length - 1
                          ].arrival.substr(11, 5)}
                        </span>
                        <span>
                          {direction1.segments[0].arrival.substr(0, 10)}
                        </span>
                      </div>
                      <div className="col-lg-1"></div>
                      <div className="col-lg-2 my-auto">
                        <span className="fw-bold fs-6 d-block">ARRIVAL</span>
                      </div>
                      <div className="col-lg-3 my-auto">
                        <span className="fw-bold fs-6 d-block">
                          {direction1.toAirport} ({direction1.to})
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>

        <div className="row mx-5 mt-5">
          <h5 className="bg-dark text-white py-1">FARE DETAILS</h5>
          <table className="table table-borderless table-sm">
            <thead>
              <tr>
                <th className="fw-bold">Pax Type</th>
                <th className="fw-bold">Base Fare</th>
                <th className="fw-bold">Tax/Surcharges</th>
                <th className="fw-bold">Other Fees</th>
                <th className="fw-bold">No. of Pax</th>
                <th className="fw-bold text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Adult</td>
                <td>7000.00</td>
                <td>500.00</td>
                <td>0</td>
                <td>1</td>
                <td className="fw-bold text-end">7500</td>
              </tr>
              <tr>
                <td colSpan="5" className="text-end">
                  Total
                </td>
                <td className="text-end">7500</td>
              </tr>
              <tr>
                <td colSpan="5" className="text-end">
                  (-) Commission
                </td>
                <td className="text-end">0</td>
              </tr>
              <tr>
                <td colSpan="5" className="text-end fw-bold">
                  Grand Total
                </td>
                <td className="text-end fw-bold">7500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuccessConfirmPanel;
