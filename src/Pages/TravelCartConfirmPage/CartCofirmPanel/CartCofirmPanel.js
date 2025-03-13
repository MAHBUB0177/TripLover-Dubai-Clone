import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { environment } from "../../SharePages/Utility/environment";
import $ from "jquery";
import ShowModal from "../../ShowAllFlightPage/ShowModal/ShowModal";
import useAuth from "../../../hooks/useAuth";

const CartCofirmPanel = () => {
  const { setBookData } = useAuth();
  const navigate = useNavigate();
  const filterParam = JSON.parse(sessionStorage.getItem("Database"));
  const flightType = filterParam.flightType;
  const direction0 = JSON.parse(localStorage.getItem("direction0"));
  const direction1 = JSON.parse(localStorage.getItem("direction1"));
  const direction2 = JSON.parse(localStorage.getItem("direction2"));
  const direction3 = JSON.parse(localStorage.getItem("direction3"));
  const direction4 = JSON.parse(localStorage.getItem("direction4"));
  const direction5 = JSON.parse(localStorage.getItem("direction5"));

  const passengerFares = JSON.parse(localStorage.getItem("passengerFares"));
  const passengerCounts = JSON.parse(localStorage.getItem("passengerCounts"));
  const bookingComponents = JSON.parse(
    localStorage.getItem("bookingComponents")
  );

  const adult = JSON.parse(localStorage.getItem("adult"));
  const child = JSON.parse(localStorage.getItem("child"));
  const infant = JSON.parse(localStorage.getItem("infant"));
  const contact = JSON.parse(localStorage.getItem("contact"));
  const refundable = JSON.parse(localStorage.getItem("refundable"));
  const uniqueTransID = JSON.parse(localStorage.getItem("uniqueTransID"));
  const itemCodeRef = JSON.parse(localStorage.getItem("itemCodeRef"));
  const origin = filterParam.origin;
  const departure = origin.split(",");
  const destination = filterParam.destination;
  const arrival = destination.split(",");

  const bookingData = () => {
    let sendObj = {
      passengerInfoes: [],
      taxRedemptions: [],
      uniqueTransID: "",
      itemCodeRef: "",
      PriceCodeRef: "",
    };

    adult.map((item) => {
      let passengerObj = {
        nameElement: {
          title: item.title,
          firstName: item.firstName,
          lastName: item.lastName,
          middleName: item.middleName,
        },
        contactInfo: {
          email: contact[0].email,
          phone: contact[0].mobailNumber,
          phoneCountryCode: "+880",
          countryCode: "BD",
          cityName: "Dhaka",
        },
        documentInfo: {
          documentType: item.document,
          documentNumber: item.passportNumber,
          expireDate:
            item.passportYear +
            "-" +
            item.passportMonth.split("-")[0].trim() +
            "-" +
            item.passportDate,
          frequentFlyerNumber: "",
          issuingCountry: "BD",
          nationality: "BD",
        },
        passengerType: "ADT",
        gender: "Male",
        dateOfBirth:
          item.year + "-" + item.month.split("-")[0].trim() + "-" + item.date,
        passengerKey: "01",
        isLeadPassenger: true,
      };
      sendObj.passengerInfoes.push(passengerObj);
    });
    child.map((item) => {
      let passengerObj = {
        nameElement: {
          title: item.title,
          firstName: item.firstName,
          lastName: item.lastName,
          middleName: item.middleName,
        },
        contactInfo: {
          email: contact[0].email,
          phone: contact[0].mobailNumber,
          phoneCountryCode: contact[0].mobailCode,
          countryCode: "BD",
          cityName: "Dhaka",
        },
        documentInfo: {
          documentType: item.document,
          documentNumber: item.passportNumber,
          expireDate:
            item.passportYear +
            "-" +
            item.passportMonth.split("-")[0].trim() +
            "-" +
            item.passportDate,
          frequentFlyerNumber: "",
          issuingCountry: "BD",
          nationality: "BD",
        },
        passengerType: "CNN",
        gender: "Male",
        dateOfBirth: "1990-03-14",
        passengerKey: "01",
        isLeadPassenger: true,
      };
      sendObj.passengerInfoes.push(passengerObj);
    });
    infant.map((item) => {
      let passengerObj = {
        nameElement: {
          title: item.title,
          firstName: item.firstName,
          lastName: item.lastName,
          middleName: item.middleName,
        },
        contactInfo: {
          email: contact[0].email,
          phone: contact[0].mobailNumber,
          phoneCountryCode: contact[0].mobailCode,
          countryCode: "BD",
          cityName: "Dhaka",
        },
        documentInfo: {
          documentType: item.document,
          documentNumber: item.passportNumber,
          expireDate:
            item.passportYear +
            "-" +
            item.passportMonth.split("-")[0].trim() +
            "-" +
            item.passportDate,
          frequentFlyerNumber: "",
          issuingCountry: "BD",
          nationality: "BD",
        },
        passengerType: "INF",
        gender: "Male",
        dateOfBirth: "1990-03-14",
        passengerKey: "01",
        isLeadPassenger: true,
      };
      sendObj.passengerInfoes.push(passengerObj);
    });

    localStorage.setItem("passengerPack", JSON.stringify(sendObj));
    const priceCheck = {
      itemCodeRef: itemCodeRef,
      uniqueTransID: uniqueTransID,
      taxRedemptions: [],
      segmentCodeRefs: [],
    };
    if (Object.keys(direction0).length > 0) {
      direction0.segments.map((i) =>
        priceCheck.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (Object.keys(direction1).length > 0) {
      direction1.segments.map((i) =>
        priceCheck.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (direction2.length > 0) {
      priceCheck.segmentCodeRefs.push(direction2.segments[0].segmentCodeRef);
    }
    if (direction3.length > 0) {
      priceCheck.segmentCodeRefs.push(direction3.segments[0].segmentCodeRef);
    }
    if (direction4.length > 0) {
      priceCheck.segmentCodeRefs.push(direction4.segments[0].segmentCodeRef);
    }
    if (direction5.length > 0) {
      priceCheck.segmentCodeRefs.push(direction5.segments[0].segmentCodeRef);
    }

    async function fetchOptions() {
      await axios
        .post(environment.priceCheck, priceCheck, environment.headerToken)
        .then((response) => {
          if (response.data.item1 !== null) {
            if (
              response.data.item1?.isPriceChanged === false &&
              response.data.item1?.isPriceChanged !== undefined
            ) {
              booking(
                response.data.item1?.priceCodeRef,
                response.data.item1?.uniqueTransID,
                response.data.item1?.itemCodeRef
              );
            } else if (response.data.item1?.isPriceChanged === true) {
              setBookData(response);
              navigate("/bookingmodal");
            }
          } else {
            alert(response.data.item2.message);
            navigate("/failedbooking");
          }
        });
    }
    fetchOptions();

    async function booking(price, uniqueTransID, itemCodeRef) {
      sendObj.uniqueTransID = uniqueTransID;
      sendObj.itemCodeRef = itemCodeRef;
      sendObj.PriceCodeRef = price;
      await axios
        .post(environment.bookFlight, sendObj, environment.headerToken)
        .then((response) => {
          if (response.data.item1 !== null) {
            if (response.data.item2.isSuccess === true) {
              setBookData(response);
              // localStorage.setItem('flightConfirm',JSON.stringify(response.data));
              navigate("/successbooking");
            } else {
              navigate("/failedbooking");
            }
          } else {
            alert(response.data.item2.message);
          }
        });
    }
  };

  const ImageUrlD = `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${direction0.platingCarrierCode}.png`;
  const ImageUrlR =
    Object.keys(direction1).length > 0
      ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${direction1.platingCarrierCode}.png`
      : ``;
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
    <div className="content-wrapper search-panel-bg">
      <section className="content-header"></section>
      <section className="content">
        <div className="container-fluid pt-2">
          {/* <Header flag={3}></Header> */}
          <div className="row mx-4">
            <div className="col-lg-8">
              <div className="accordion" id="accordionPanelsStayOpenExample">
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingOne"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseOne"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                    >
                      Adult ({adult.length})
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-headingOne"
                  >
                    <div className="accordion-body">
                      {adult.map((p, index) => {
                        return (
                          <div key={index}>
                            <h5 className="text-warning text-start">
                              Adult {index + 1} detail
                              <hr></hr>
                            </h5>
                            <div className="row">
                              <div className="row">
                                <h5 className="text-start">
                                  <u>Traveller details</u>
                                  <br />
                                </h5>
                              </div>
                              <div className="col-md-12">
                                <table className="table table-hover table-bordered">
                                  <thead>
                                    <tr>
                                      <th scope="col">Full name</th>
                                      <th scope="col">Date of birth</th>
                                      <th scope="col">Nationality</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        {" "}
                                        {p.title +
                                          " " +
                                          p.firstName +
                                          " " +
                                          p.middleName +
                                          " " +
                                          p.lastName}
                                      </td>
                                      <td>
                                        {p.date + " " + p.month + " " + p.year}
                                      </td>
                                      <td>{p.nationality}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div className="my-4">
                              <h5 className="text-start">
                                <u>Passport Document</u>
                              </h5>
                            </div>

                            <div className="row">
                              <div className="col-lg-12">
                                <table className="table table-hover table-bordered">
                                  <thead>
                                    <tr>
                                      <th scope="col">Document Type</th>
                                      <th scope="col">Passport Number</th>
                                      <th scope="col">Issuing Country</th>
                                      <th scope="col">Passport Expiry Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td> {p.document}</td>
                                      <td>{p.passportNumber}</td>
                                      <td>{p.issuingCountry}</td>
                                      <td>
                                        {p.passportDate +
                                          " " +
                                          p.passportMonth +
                                          " " +
                                          p.passportYear}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <hr></hr>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {child.length > 0 ? (
                  <div className="accordion-item">
                    <h2
                      className="accordion-header"
                      id="panelsStayOpen-headingTwo"
                    >
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseTwo"
                        aria-expanded="false"
                        aria-controls="panelsStayOpen-collapseTwo"
                      >
                        Child ({child.length})
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="panelsStayOpen-headingTwo"
                    >
                      <div className="accordion-body">
                        {child.map((p, index) => {
                          return (
                            <div key={index}>
                              <h5 className="text-warning text-start">
                                Child {index + 1} detail
                                <hr></hr>
                              </h5>
                              <div className="row">
                                <div className="row">
                                  <h5 className="text-start">
                                    <u>Traveller details</u>
                                    <br />
                                  </h5>
                                </div>
                                <div className="col-md-12">
                                  <table className="table table-hover table-bordered">
                                    <thead>
                                      <tr>
                                        <th scope="col">Full name</th>
                                        <th scope="col">Date of birth</th>
                                        <th scope="col">Nationality</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          {" "}
                                          {p.title +
                                            " " +
                                            p.firstName +
                                            " " +
                                            p.middleName +
                                            " " +
                                            p.lastName}
                                        </td>
                                        <td>
                                          {p.date +
                                            " " +
                                            p.month +
                                            " " +
                                            p.year}
                                        </td>
                                        <td>{p.nationality}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              <div className="my-4">
                                <h5 className="text-start">
                                  <u>Passport Document</u>
                                </h5>
                              </div>

                              <div className="row">
                                <div className="col-lg-12">
                                  <table className="table table-hover table-bordered">
                                    <thead>
                                      <tr>
                                        <th scope="col">Document Type</th>
                                        <th scope="col">Passport Number</th>
                                        <th scope="col">Issuing Country</th>
                                        <th scope="col">
                                          Passport Expiry Date
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td> {p.document}</td>
                                        <td>{p.passportNumber}</td>
                                        <td>{p.issuingCountry}</td>
                                        <td>
                                          {p.passportDate +
                                            " " +
                                            p.passportMonth +
                                            " " +
                                            p.passportYear}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <hr></hr>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {infant.length > 0 ? (
                  <div className="accordion-item">
                    <h2
                      className="accordion-header"
                      id="panelsStayOpen-headingThree"
                    >
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseThree"
                        aria-expanded="false"
                        aria-controls="panelsStayOpen-collapseThree"
                      >
                        Infant ({infant.length})
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapseThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="panelsStayOpen-headingThree"
                    >
                      <div className="accordion-body">
                        {infant.map((p, index) => {
                          return (
                            <div key={index}>
                              <h5 className="text-warning text-start">
                                Infant {index + 1} detail
                                <hr></hr>
                              </h5>
                              <div className="row">
                                <div className="row">
                                  <h5 className="text-start">
                                    <u>Traveller details</u>
                                    <br />
                                  </h5>
                                </div>
                                <div className="col-md-12">
                                  <table className="table table-hover table-bordered">
                                    <thead>
                                      <tr>
                                        <th scope="col">Full name</th>
                                        <th scope="col">Date of birth</th>
                                        <th scope="col">Nationality</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          {" "}
                                          {p.title +
                                            " " +
                                            p.firstName +
                                            " " +
                                            p.middleName +
                                            " " +
                                            p.lastName}
                                        </td>
                                        <td>
                                          {p.date +
                                            " " +
                                            p.month +
                                            " " +
                                            p.year}
                                        </td>
                                        <td>{p.nationality}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              <div className="my-4">
                                <h5 className="text-start">
                                  <u>Passport Document</u>
                                </h5>
                              </div>

                              <div className="row">
                                <div className="col-lg-12">
                                  <table className="table table-hover table-bordered">
                                    <thead>
                                      <tr>
                                        <th scope="col">Document Type</th>
                                        <th scope="col">Passport Number</th>
                                        <th scope="col">Issuing Country</th>
                                        <th scope="col">
                                          Passport Expiry Date
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td> {p.document}</td>
                                        <td>{p.passportNumber}</td>
                                        <td>{p.issuingCountry}</td>
                                        <td>
                                          {p.passportDate +
                                            " " +
                                            p.passportMonth +
                                            " " +
                                            p.passportYear}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <hr></hr>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="card my-5">
                <div className="card-body">
                  <div className="card-title h5">
                    <u>Contact details</u>
                  </div>
                  <br></br>
                  {contact.map((p, index) => {
                    return (
                      <div key={index}>
                        <div className="row">
                          <div className="col-md-12">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th scope="col">Full name</th>
                                  <th scope="col">Email</th>
                                  <th scope="col">Phone number</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    {" "}
                                    {p.title +
                                      " " +
                                      p.firstName +
                                      " " +
                                      p.lastName}
                                  </td>
                                  <td>{p.email}</td>
                                  <td>{p.mobailCode + " " + p.mobailNumber}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* <div>{JSON.stringify(contact, null, 2)}</div> */}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="col-lg-12">
                <div className="container box-shadow  bg-white">
                  <div className="row border ps-3 py-3">
                    <div className="col-lg-6 text-start">
                      <span className="card-title fw-bold">Flight summary</span>
                    </div>
                    <div className="col-lg-6 text-end">
                      <Link
                        to=""
                        className="my-auto text-color text-center ms-4"
                        data-bs-toggle="modal"
                        data-bs-target={"#exampleModal" + 0}
                      >
                        Flight Details
                      </Link>
                    </div>

                    <div className="row p-2">
                      {flightType > 2 ? (
                        <>
                          <>
                            <div
                              className="col-lg-1 my-auto me-3"
                              style={{ padding: "0px" }}
                            >
                              <img
                                src={ImageUrlD}
                                alt=""
                                width="40px"
                                height="40px"
                              />
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
                                  <span className="text-color fw-bold font-size">
                                    {direction0.stops === 0
                                      ? "Direct"
                                      : direction0.stops + " Stop(s)"}
                                  </span>
                                </div>
                                <div className="col-lg-12">
                                  <span className="text-color">
                                    -----------------
                                    <i className="fas fa-plane fa-sm"></i>
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center ms-4">
                                  <span className="text-color me-5">
                                    <i className="fas fa-clock fa-sm"></i>
                                    <span className="ms-1 font-size">
                                      {direction0.segments[0].duration[0]}
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
                            <div
                              className="col-lg-1 my-auto me-3"
                              style={{ padding: "0px" }}
                            >
                              <img
                                src={ImageUrlD}
                                alt=""
                                width="40px"
                                height="40px"
                              />
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
                                  <span className="text-color fw-bold font-size">
                                    {direction1.stops === 0
                                      ? "Direct"
                                      : direction1.stops + " Stop"}
                                  </span>
                                </div>
                                <div className="col-lg-12">
                                  <span className="text-color">
                                    -----------------
                                    <i className="fas fa-plane fa-sm"></i>
                                  </span>
                                </div>
                                <div className="col-lg-12 text-center ms-4">
                                  <span className="text-color me-5">
                                    <i className="fas fa-clock fa-sm"></i>
                                    <span className="ms-1 font-size">
                                      {direction1.segments[0].duration[0]}
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
                              <div
                                className="col-lg-1 my-auto me-3"
                                style={{ padding: "0px" }}
                              >
                                <img
                                  src={ImageUrlD}
                                  alt=""
                                  width="40px"
                                  height="40px"
                                />
                              </div>

                              <div className="col-lg-2 my-auto">
                                <span className="fw-bold">
                                  {direction2.segments[0].departure.substr(
                                    11,
                                    5
                                  )}
                                </span>
                                <p className="my-auto">{direction2.from}</p>
                              </div>
                              <div className="col-lg-6 my-auto">
                                <div className="row">
                                  <div className="col-lg-12 text-center">
                                    <span className="text-color fw-bold font-size">
                                      {direction2.stops === 0
                                        ? "Direct"
                                        : direction2.stops + " Stop"}
                                    </span>
                                  </div>
                                  <div className="col-lg-12">
                                    <span className="text-color">
                                      -----------------
                                      <i className="fas fa-plane fa-sm"></i>
                                    </span>
                                  </div>
                                  <div className="col-lg-12 text-center ms-4">
                                    <span className="text-color me-5">
                                      <i className="fas fa-clock fa-sm"></i>
                                      <span className="ms-1 font-size">
                                        {direction2.segments[0].duration[0]}
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
                              <div
                                className="col-lg-1 my-auto me-3"
                                style={{ padding: "0px" }}
                              >
                                <img
                                  src={ImageUrlD}
                                  alt=""
                                  width="40px"
                                  height="40px"
                                />
                              </div>

                              <div className="col-lg-2 my-auto">
                                <span className="fw-bold">
                                  {direction3.segments[0].departure.substr(
                                    11,
                                    5
                                  )}
                                </span>
                                <p className="my-auto">{direction3.from}</p>
                              </div>
                              <div className="col-lg-6 my-auto">
                                <div className="row">
                                  <div className="col-lg-12 text-center">
                                    <span className="text-color fw-bold font-size">
                                      {direction3.stops === 0
                                        ? "Direct"
                                        : direction3.stops + " Stop"}
                                    </span>
                                  </div>
                                  <div className="col-lg-12">
                                    <span className="text-color">
                                      -----------------
                                      <i className="fas fa-plane fa-sm"></i>
                                    </span>
                                  </div>
                                  <div className="col-lg-12 text-center ms-4">
                                    <span className="text-color me-5">
                                      <i className="fas fa-clock fa-sm"></i>
                                      <span className="ms-1 font-size">
                                        {direction3.segments[0].duration[0]}
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
                              <div
                                className="col-lg-1 my-auto me-3"
                                style={{ padding: "0px" }}
                              >
                                <img
                                  src={ImageUrlD}
                                  alt=""
                                  width="40px"
                                  height="40px"
                                />
                              </div>

                              <div className="col-lg-2 my-auto">
                                <span className="fw-bold">
                                  {direction4.segments[0].departure.substr(
                                    11,
                                    5
                                  )}
                                </span>
                                <p className="my-auto">{direction4.from}</p>
                              </div>
                              <div className="col-lg-6 my-auto">
                                <div className="row">
                                  <div className="col-lg-12 text-center">
                                    <span className="text-color fw-bold font-size">
                                      {direction4.stops === 0
                                        ? "Direct"
                                        : direction4.stops + " Stop"}
                                    </span>
                                  </div>
                                  <div className="col-lg-12">
                                    <span className="text-color">
                                      -----------------
                                      <i className="fas fa-plane fa-sm"></i>
                                    </span>
                                  </div>
                                  <div className="col-lg-12 text-center ms-4">
                                    <span className="text-color me-5">
                                      <i className="fas fa-clock fa-sm"></i>
                                      <span className="ms-1 font-size">
                                        {direction4.segments[0].duration[0]}
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
                              <div
                                className="col-lg-1 my-auto me-3"
                                style={{ padding: "0px" }}
                              >
                                <img
                                  src={ImageUrlD}
                                  alt=""
                                  width="40px"
                                  height="40px"
                                />
                              </div>

                              <div className="col-lg-2 my-auto">
                                <span className="fw-bold">
                                  {direction5.segments[0].departure.substr(
                                    11,
                                    5
                                  )}
                                </span>
                                <p className="my-auto">{direction5.from}</p>
                              </div>
                              <div className="col-lg-6 my-auto">
                                <div className="row">
                                  <div className="col-lg-12 text-center">
                                    <span className="text-color fw-bold font-size">
                                      {direction5.stops === 0
                                        ? "Direct"
                                        : direction5.stops + " Stop"}
                                    </span>
                                  </div>
                                  <div className="col-lg-12">
                                    <span className="text-color">
                                      -----------------
                                      <i className="fas fa-plane fa-sm"></i>
                                    </span>
                                  </div>
                                  <div className="col-lg-12 text-center ms-4">
                                    <span className="text-color me-5">
                                      <i className="fas fa-clock fa-sm"></i>
                                      <span className="ms-1 font-size">
                                        {direction5.segments[0].duration[0]}
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
                          <div
                            className="col-lg-1 my-auto me-3"
                            style={{ padding: "0px" }}
                          >
                            <img
                              src={ImageUrlD}
                              alt=""
                              width="40px"
                              height="40px"
                            />
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
                                <span className="text-color fw-bold font-size">
                                  {direction0.stops === 0
                                    ? "Direct"
                                    : direction0.stops + " Stop"}
                                </span>
                              </div>
                              <div className="col-lg-12">
                                <span className="text-color">
                                  -----------------
                                  <i className="fas fa-plane fa-sm"></i>
                                </span>
                              </div>
                              <div className="col-lg-12 text-center ms-4">
                                <span className="text-color me-5">
                                  <i className="fas fa-clock fa-sm"></i>
                                  <span className="ms-1 font-size">
                                    {direction0.segments[0].duration[0]}
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
                      )}
                      <div></div>
                      {flightType > 2 ? (
                        <></>
                      ) : (
                        <>
                          {Object.keys(direction1).length > 0 ? (
                            <>
                              <hr />{" "}
                              <div
                                className="col-lg-1 my-auto me-3"
                                style={{ padding: "0px" }}
                              >
                                <img
                                  src={ImageUrlR}
                                  alt=""
                                  width="40px"
                                  height="40px"
                                />
                              </div>
                              <div className="col-lg-2 my-auto">
                                <span className="fw-bold">
                                  {direction1.segments[0].departure.substr(
                                    11,
                                    5
                                  )}
                                </span>
                                <p className="my-auto">{direction1.from}</p>
                              </div>
                              <div className="col-lg-6 my-auto">
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
                                      -----------------
                                      <i className="fas fa-plane fa-sm"></i>
                                    </span>
                                  </div>
                                  <div className="col-lg-12 text-center ms-4">
                                    <span className="text-color me-5">
                                      <i className="fas fa-clock fa-sm"></i>
                                      <span className="ms-1 font-size">
                                        {direction1.segments[0].duration[0]}
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
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="row border ps-3 py-3">
                    <h5 className="fw-bold">Fare details</h5>
                    <div className="row mt-2">
                      <div className="col-lg-6">
                        <h6 className="text-start">{adult.length} Adult</h6>
                      </div>
                      <div className="col-lg-6">
                        <h6 className="text-end">
                          AED {adult.length * passengerFares.adt.basePrice}
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <h6 className="text-start">Taxes & fees</h6>
                      </div>
                      <div className="col-lg-6">
                        <h6 className="text-end">
                          AED {passengerFares.adt.taxes}
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <h6 className="text-start">VAT</h6>
                      </div>
                      <div className="col-lg-6">
                        <h6 className="text-end">AED 0</h6>
                      </div>
                    </div>
                    <div className="row border-top mt-2">
                      <div className="col-lg-6 my-2">
                        <h6 className="text-start fw-bold">Total(incl. VAT)</h6>
                      </div>
                      <div className="col-lg-6">
                        <h6 className="text-end fw-bold my-2">
                          AED {adult.length * passengerFares.adt.totalPrice}
                        </h6>
                      </div>
                      <button
                        type="submit"
                        className="btn button-color fw-bold text-white w-100"
                        onClick={bookingData}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
                {/* <button type="submit" className="btn btn-success w-100" onClick={submitFlight}>Submit</button> */}
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
                  passengerFares={passengerFares}
                  bookingComponents={bookingComponents}
                  passengerCounts={passengerCounts}
                  refundable={refundable}
                ></ShowModal>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="text-center text-white pt-5 pb-2 mt-1">
        {/* <b>Version</b> 3.1.0 */}
        <strong>Copyright &copy; 2020-2022 All rights reserved.</strong>
      </div>
    </div>
  );
};

export default CartCofirmPanel;
