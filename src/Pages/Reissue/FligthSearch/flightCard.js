import { useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableLoader from "../../../component/tableLoader";
import NoDataFound from "../../../component/noDataFound";
import { toast } from "react-toastify";
import {
  isGroupFareDomesticPassenger,
  reserveSeats,
} from "../../../common/allApi";
import { environment } from "../../SharePages/Utility/environment";
import airports from "../../../JSON/airports.json";
import { GiHotMeal } from "react-icons/gi";
import moment from "moment";

const FlightCard = ({ loader, searchData }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [btnClick, setBtnClick] = useState(false);
  const [passengerCount, setPassengerCount] = useState({
    adult: 0,
    child: 0,
  });
  const [seclectedFlight, setSelectedFlight] = useState({
    groupFareFlight: {},
    flightSegments: [],
  });

  const handleClickButton = () => {
    if (passengerCount.adult === 0) {
      return toast.error("You must need at least one adult");
    }
    let obj = {
      passengerCount: passengerCount,
      seclectedFlight: seclectedFlight,
    };
    const checkDomesticFlight = async () => {
      setBtnClick(true);
      try {
        const response = await isGroupFareDomesticPassenger(
          seclectedFlight?.groupFareFlight?.id
        );
        const reserveSeats = await reserveSeatsFnc();
        if (reserveSeats?.data?.isSuccess) {
          let payload = {
            ...obj,
            domestic: response?.data?.data ?? false,
            hr: reserveSeats?.data?.data?.hr,
          };
          sessionStorage.setItem(
            "group-fare-selected-flight",
            JSON.stringify(payload)
          );
          setBtnClick(false);
          navigate("/groupfare-pax-cart");
        } else {
          setBtnClick(false);
          toast.error(reserveSeats?.data?.message);
        }
      } catch (e) {
        setBtnClick(false);
        toast.error("please try again.");
      }
    };
    const reserveSeatsFnc = async () => {
      let reserveSeatsObj = {
        groupFareId: seclectedFlight?.groupFareFlight?.id,
        adultCount: passengerCount.adult,
        childCount: passengerCount.child,
      };
      try {
        const response = await reserveSeats(reserveSeatsObj);
        return response;
      } catch (e) {
        toast.error("please try again.");
      }
    };
    checkDomesticFlight();
  };
  return (
    <div className="table-responsive">
      {loader ? (
        <TableLoader />
      ) : (
        <>
          {searchData?.length === 0 && !loader ? (
            <NoDataFound />
          ) : (
            <div className="container-fluid px-3 bg-white">
              {searchData?.map((itm) => (
                <div
                  className="row my-4 py-4 px-3 rounded border box-shadow bg-light fw-bold justify-content-start align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <div className="col-lg-1">
                    <span
                      className="button-color p-1 px-2 border-radius text-white fw-bold"
                      style={{ fontSize: "10px" }}
                    >
                      {itm.flightSegments.length > 0 &&
                        itm.flightSegments[0]?.journeyType}
                    </span>
                    <div className="my-1"></div>
                    {/* <span
                  className="fw-bold text-secondary"
                  style={{ fontSize: "12px" }}
                >
                  {itm.flightSegments.length > 0 &&
                    moment(itm.flightSegments[0]?.departure).format(
                      "DD MMM YYYY"
                    )}
                </span> */}
                  </div>
                  <div className="col-lg-8">
                    {itm?.flightSegments.map((item, index) => {
                      return (
                        <>
                          <div
                            className="row align-items-center my-3"
                            style={{ fontSize: "12px" }}
                            key={index}
                          >
                            <div className="col-lg-1 fw-bold text-secondary">
                              {moment(item?.departure).format("DD MMM YYYY")}
                            </div>
                            <div
                              className="col-lg-2 text-secondary fw-bold text-center"
                              style={{ fontSize: "12px" }}
                            >
                              <img
                                width={"50px"}
                                height={"50px"}
                                src={
                                  environment.s3ArliensImage +
                                  `${item?.airLineCode}.png`
                                }
                                alt="Airline"
                                className="shadow rounded mx-auto mb-2"
                              />
                              <p>{item?.airLineName}</p>
                              <p>({item?.airLineCode})</p>
                              <p>{item?.flightType}</p>
                            </div>
                            <div className="col-lg-9">
                              <div className="d-flex flex-wrap justify-content-evenly align-items-center gap-1 w-100">
                                <div
                                  className="my-auto text-end"
                                  style={{ width: "160px" }}
                                >
                                  <h6 className="group-fare-text-color">
                                    {item.departure.substr(11, 5)}
                                  </h6>
                                  <h6
                                    style={{ fontSize: "14px" }}
                                    className="fw-bold text-secondary"
                                  >
                                    From -{" "}
                                    {airports
                                      .filter((f) => f.iata === item.origin)
                                      .map((item) => item.city)}{" "}
                                    ({item.origin})
                                  </h6>
                                  <h6 style={{ fontSize: "12px" }}>
                                    {airports
                                      .filter((f) => f.iata === item.origin)
                                      .map((item) =>
                                        item.name.substring(0, 20)
                                      )}
                                  </h6>
                                </div>
                                <div className="my-auto text-center text-secondary">
                                  <h6 className="">
                                    <i className="fas fa-plane fa-sm pb-2"></i>
                                  </h6>
                                  <h6 className="">
                                    <div className="position-relative">
                                      <i className="fas fa-circle fa-xs"></i>
                                      ---------------------------------
                                      <i className="fas fa-circle fa-xs"></i>
                                      <div
                                        class="position-absolute top-50 start-50 translate-middle"
                                        style={{
                                          fontSize: "10px",
                                          width: "51%",
                                        }}
                                      >
                                        <div className="button-color p-1 px-2 rounded-pill text-white fw-bold">
                                          <i className="fas fa-clock fa-sm me-1"></i>{" "}
                                          {item.travelTime}
                                        </div>
                                      </div>
                                    </div>
                                  </h6>
                                  <div>
                                    <div
                                      style={{
                                        fontSize: "13px",
                                        marginTop: "5px",
                                      }}
                                    >
                                      <i
                                        className="fa fa-suitcase me-1"
                                        aria-hidden="true"
                                      ></i>
                                      Baggage {item.baggage}
                                    </div>
                                  </div>
                                  {item?.meal && (
                                    <div
                                      className="d-flex justify-content-center align-items-center gap-1 text-secondary"
                                      style={{ fontSize: "11px" }}
                                    >
                                      <GiHotMeal />{" "}
                                      <div style={{ marginTop: "2px" }}>
                                        Meal Included
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className="my-auto text-start"
                                  style={{ width: "160px" }}
                                >
                                  <h6 className="group-fare-text-color">
                                    {item.arrival.substr(11, 5)}
                                  </h6>
                                  <h6
                                    style={{ fontSize: "14px" }}
                                    className="fw-bold text-secondary"
                                  >
                                    To -{" "}
                                    {airports
                                      .filter(
                                        (f) => f.iata === item.destination
                                      )
                                      .map((item) => item.city)}{" "}
                                    ({item.destination})
                                  </h6>
                                  <h6 style={{ fontSize: "12px" }}>
                                    {airports
                                      .filter(
                                        (f) => f.iata === item.destination
                                      )
                                      .map((item) =>
                                        item.name.substring(0, 20)
                                      )}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          {index !== itm?.flightSegments?.length - 1 && (
                            <hr className="my-4"></hr>
                          )}
                        </>
                      );
                    })}
                  </div>
                  <div className="col-lg-3 text-center align-self-center">
                    <div className="row align-items-center">
                      <div className="col-lg-6 group-fare-text-color">
                        <div>
                          <span className="fs-5">
                            {itm.groupFareFlight.noOfSeatAvailable}
                          </span>
                        </div>
                        <div style={{ fontSize: "12px" }}>Seats Available</div>
                      </div>
                      <div className="col-lg-6">
                        <div className="text-end text-secondary">
                          AED{" "}
                          {itm.groupFareFlight.price.toLocaleString("en-US")}
                        </div>
                        <button
                          type="button"
                          className="btn button-color fw-bold text-white me-2 border-radius w-100"
                          onClick={() => {
                            setSelectedFlight({
                              ...seclectedFlight,
                              groupFareFlight: itm.groupFareFlight,
                              flightSegments: itm?.flightSegments,
                            });
                            onOpen();
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FlightCard;
