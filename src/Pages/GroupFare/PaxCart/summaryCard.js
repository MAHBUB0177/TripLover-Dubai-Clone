import React, { useEffect, useState } from "react";
import airports from "../../../JSON/airports.json";
import moment from "moment";
import { environment } from "../../SharePages/Utility/environment";
import { Flex, Text, Textarea } from "@chakra-ui/react";
import Countdown from "react-countdown";
import { BsClockHistory } from "react-icons/bs";
import { Box, Button, HStack, VStack, useDisclosure } from "@chakra-ui/react";
import ModalForm from "../../../common/modalForm";
import { Link } from "react-router-dom";
import { checkPartiallyEligibility } from "../../../common/allApi";
import { toast } from "react-toastify";
const CountdownWrapper = () => {
  const selectedFlightData = JSON.parse(
    sessionStorage.getItem("group-fare-selected-flight")
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  // COUNT DOWN TIMER
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (!completed) {
      // Render a completed state
      return (
        <Box
          bg={"#7c04c0"}
          h={"100px"}
          w={"100%"}
          borderRadius={5}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={2}
        >
          <HStack>
            {hours > 0 && (
              <>
                <VStack color={"white"}>
                  <Text fontWeight={700} fontSize={"25px"}>
                    {hours}
                  </Text>
                  <Text>Hour</Text>
                </VStack>
                <Text fontWeight={700} fontSize={"25px"} pb={8} color={"white"}>
                  :
                </Text>
              </>
            )}

            <VStack color={"white"}>
              <Text fontWeight={700} fontSize={"25px"}>
                {minutes}
              </Text>
              <Text>Min</Text>
            </VStack>
            <Text fontWeight={700} fontSize={"25px"} pb={8} color={"white"}>
              :
            </Text>
            <VStack color={"white"}>
              <Text fontWeight={700} fontSize={"25px"}>
                {seconds}{" "}
              </Text>
              <Text>Sec</Text>
            </VStack>
          </HStack>
        </Box>
      );
    } else {
      return onOpen();
    }
  };

  const rendererClose = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <Box
          bg={"#7c04c0"}
          h={"100px"}
          w={"100%"}
          borderRadius={5}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={2}
        >
          <HStack>
            <VStack color={"white"}>
              <Text fontWeight={700} fontSize={"25px"}>
                0
              </Text>
              <Text>Min</Text>
            </VStack>
            <Text fontWeight={700} fontSize={"25px"} pb={8} color={"white"}>
              :
            </Text>
            <VStack color={"white"}>
              <Text fontWeight={700} fontSize={"25px"}>
                0{" "}
              </Text>
              <Text>Sec</Text>
            </VStack>
          </HStack>
        </Box>
      );
    }
  };
  return (
    <>
      {isOpen ? (
        <Countdown date={Date.now()} renderer={rendererClose} />
      ) : (
        <Countdown
          date={
            Date.now() +
            parseInt(
              selectedFlightData?.seclectedFlight?.groupFareFlight
                .lastPassengerInsertionTimeHours *
                60 *
                60 +
                selectedFlightData?.seclectedFlight?.groupFareFlight
                  .lastPassengerInsertionTimeMinutes *
                  60 <
                selectedFlightData?.seclectedFlight?.groupFareFlight
                  ?.timeOutInSeconds
                ? selectedFlightData?.seclectedFlight?.groupFareFlight
                    .lastPassengerInsertionTimeHours *
                    60 *
                    60 *
                    1000 +
                    selectedFlightData?.seclectedFlight?.groupFareFlight
                      .lastPassengerInsertionTimeMinutes *
                      60 *
                      1000
                : selectedFlightData?.seclectedFlight?.groupFareFlight
                    ?.timeOutInSeconds * 1000
            )
          }
          renderer={renderer}
        />
      )}

      <ModalForm isOpen={isOpen} onClose={onClose} size={"lg"}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          h={"300px"}
        >
          <VStack>
            <BsClockHistory
              style={{
                color: "#044954",
                height: "30px",
                width: "30px",
                fontWeight: "bold",
              }}
            />
            <Text fontSize={"25px"} fontWeight={500} textAlign={"center"}>
              Your current Session is over due to inactivity.
            </Text>
            <Link to="/groupfarelist">
              <Button
                color={"white"}
                bg={"#7c04c0"}
                _hover={"#7c04c0"}
                className="border-radius"
              >
                Search Again
              </Button>
            </Link>
          </VStack>
        </Box>
      </ModalForm>
    </>
  );
};
const MemoCountdown = React.memo(CountdownWrapper);
const SummaryCard = ({
  selectedFlightData,
  onClick,
  bookingBtnLoader,
  setPayment,
  payment,
  setAgentRemarks,
  agentRemarks,
}) => {
  const [click, setClick] = useState(false);
  const [partialPaymentData, setPartialPaymentData] = useState({});
  const [loader, setLoader] = useState(false);

  const getPartialPaymentInformation = async () => {
    setLoader(true);
    await checkPartiallyEligibility(
      selectedFlightData?.seclectedFlight?.groupFareFlight?.id
    )
      .then((res) => {
        if (res?.data?.isSuccess) {
          setPartialPaymentData(res?.data?.data);
          setLoader(false);
        } else {
          setPartialPaymentData({});
          setLoader(false);
        }
      })
      .catch((err) => {
        toast.error("Please try again!");
        setLoader(false);
      });
  };

  useEffect(() => {
    getPartialPaymentInformation();
  }, []);
  const handleClick = (e) => {
    if (e.target.checked) {
      setClick(true);
    } else {
      setClick(false);
    }
  };
  return (
    <div className="col-lg-12">
      <div className="container box-shadow  bg-white">
        <div className="row pt-3 pb-1 m-1">
          <div className="col-lg-12 px-0 my-2">
            <MemoCountdown />
          </div>
          <div
            className="col-lg-12 text-start border"
            style={{ color: "#4e4e4e" }}
          >
            <span className="card-title fw-bold">Flight summary</span>
          </div>
          {selectedFlightData?.seclectedFlight?.flightSegments?.map(
            (item, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="col-lg-12 fw-bold">
                    <div className="row border text-color p-2">
                      <div className="col-lg-2 my-auto">
                        <img
                          src={
                            environment.s3ArliensImage +
                            `${item?.airLineCode}.png`
                          }
                          alt=""
                          width="50px"
                          height="50px"
                        />
                      </div>

                      <div className="col-lg-10 my-auto text-center lh-1">
                        <div className="d-flex justify-content-between align-items-center gap-2">
                          <div className="my-auto">
                            <h6 className="">{item.origin}</h6>
                            <h6 className="flighttime">
                              {moment(item.departure).format("DD MMM, yyyy")}
                            </h6>
                            <h6 className="flighttime">
                              {airports
                                .filter((f) => f.iata === item.origin)
                                .map((item) => item.city)}
                            </h6>
                          </div>
                          <div className="my-auto text-center">
                            <h6 className="text-color">
                              <i className="fas fa-clock fa-sm"></i>
                              <span className="ms-1 font-size">
                                {item.travelTime}
                              </span>
                            </h6>
                            <h6 className="text-color">
                              <i className="fas fa-circle fa-xs"></i>
                              ----------------------
                              <i className="fas fa-plane fa-sm"></i>
                            </h6>
                          </div>
                          <div className="my-auto">
                            <h6 className="">{item.destination}</h6>
                            <h6 className="flighttime">
                              {moment(item.arrival).format("DD MMM, yyyy")}
                            </h6>
                            <h6 className="flighttime">
                              {airports
                                .filter((f) => f.iata === item.destination)
                                .map((item) => item.city)}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            }
          )}
        </div>

        <div className="row py-1 m-1">
          {selectedFlightData.passengerCount.adult !== 0 ? (
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
                      Fare ({selectedFlightData.passengerCount.adult} &#215;{" "}
                      {selectedFlightData.seclectedFlight.groupFareFlight.price.toLocaleString(
                        "en-US"
                      )}
                      ){" "}
                    </Text>

                    <Text>
                      {" "}
                      {(
                        selectedFlightData.passengerCount.adult *
                        selectedFlightData.seclectedFlight.groupFareFlight.price
                      ).toLocaleString("en-US")}{" "}
                    </Text>
                  </Flex>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          {selectedFlightData.passengerCount.child !== 0 ? (
            <>
              <div
                className="col-lg-12 border py-1 mb-1"
                style={{ color: "#67696a" }}
              >
                <h6
                  className="fw-bold"
                  style={{ fontSize: "14px", color: "#4e4e4e" }}
                >
                  <u>Child Fare</u>
                </h6>
                <div className="row mt-2" style={{ fontSize: "12px" }}>
                  <Flex justifyContent={"space-between"}>
                    <Text>
                      Fare ({selectedFlightData.passengerCount.child} &#215;{" "}
                      {selectedFlightData.seclectedFlight.groupFareFlight.price.toLocaleString(
                        "en-US"
                      )}
                      ){" "}
                    </Text>

                    <Text>
                      {" "}
                      {(
                        selectedFlightData.passengerCount.child *
                        selectedFlightData.seclectedFlight.groupFareFlight.price
                      ).toLocaleString("en-US")}{" "}
                    </Text>
                  </Flex>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          <div
            className="col-lg-12 border py-1 mb-2"
            style={{ color: "#4e4e4e" }}
          >
            <div className="row  py-2">
              <Flex justifyContent={"space-between"}>
                <Text> Total payable</Text>
                <Text className="fw-bold">
                  {" "}
                  {"AED"}{" "}
                  {(
                    (selectedFlightData.passengerCount?.adult +
                      selectedFlightData.passengerCount?.child) *
                    selectedFlightData?.seclectedFlight.groupFareFlight?.price
                  ).toLocaleString("en-US")}
                </Text>
              </Flex>
            </div>
          </div>
        </div>
        <div className="row mx-1 pb-1">
          {loader ? (
            <div className="d-flex align-items-center justify-content-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {partialPaymentData?.isEligible ? (
                <Box className="px-0">
                  <fieldset
                    className="border rounded"
                    style={{
                      marginBottom: "2%",
                      paddingLeft: "2%",
                    }}
                  >
                    <legend
                      className="float-none w-auto fw-bold "
                      style={{ fontSize: "14px" }}
                    >
                      {" Payments Options"}
                    </legend>
                    <Box className="d-flex justify-content-start flex-column">
                      <Box
                        gap={2}
                        fontSize={"14px"}
                        onClick={() => {
                          setPayment({
                            partialPayment: true,
                            fullPayment: false,
                          });
                          setClick(false);
                          document.getElementById(
                            "flexCheckDefault"
                          ).checked = false;
                        }}
                      >
                        <div className="d-flex align-items-center gap-1">
                          <input
                            type="radio"
                            checked={payment.partialPayment}
                            value={payment.partialPayment}
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                          />
                          <label className="pt-2">
                            Partial Payment{" "}
                            <span
                              style={{
                                fontSize: "12px",
                              }}
                              className="text-danger"
                            >
                              (InstantPay -{" "}
                              {(selectedFlightData.passengerCount?.adult +
                                selectedFlightData.passengerCount?.child) *
                                selectedFlightData?.seclectedFlight
                                  .groupFareFlight?.price *
                                (partialPaymentData?.percentage / 100)}
                              )
                            </span>
                          </label>
                        </div>
                        {payment?.partialPayment ? (
                          <>
                            <p
                              className="text-start fw-bold text-danger"
                              style={{
                                fontSize: "12px",
                              }}
                            >
                              <span>Settlement Days : </span>{" "}
                              {moment()
                                .add(partialPaymentData?.settlementDays, "days")
                                .format("DD MMM, YYYY, ddd")}
                              ({partialPaymentData?.settlementDays} days)
                            </p>
                          </>
                        ) : (
                          <></>
                        )}
                      </Box>

                      <Box
                        gap={4}
                        fontSize={"14px"}
                        onClick={() => {
                          setPayment({
                            partialPayment: false,
                            fullPayment: true,
                          });
                          setClick(false);
                          document.getElementById(
                            "flexCheckDefault"
                          ).checked = false;
                        }}
                      >
                        <div className="d-flex align-items-center gap-1">
                          <input
                            type="radio"
                            value={payment.fullPayment}
                            checked={payment.fullPayment && true}
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                          />
                          <label className="pt-2">
                            Full Payment{" "}
                            <span
                              style={{
                                fontSize: "12px",
                              }}
                              className="text-danger"
                            >
                              (Totalpay -{" "}
                              {(
                                (selectedFlightData.passengerCount?.adult +
                                  selectedFlightData.passengerCount?.child) *
                                selectedFlightData?.seclectedFlight
                                  .groupFareFlight?.price
                              ).toLocaleString("en-US")}
                              )
                            </span>
                          </label>
                        </div>
                      </Box>
                    </Box>
                  </fieldset>
                </Box>
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
        </div>
        <div className="row mx-1 pb-3">
          <Text fontWeight={700} className="ps-0">
            Remarks
          </Text>
          <Textarea
            value={agentRemarks}
            onChange={(e) => setAgentRemarks(e.target.value)}
            placeholder="Remarks"
            size="sm"
          />
        </div>
        <div className="row mx-1 pb-1">
          <div className="col-lg-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                onChange={handleClick}
              />
              <label
                className="form-check-label font-size-checkbok"
                for="flexCheckDefault"
              >
                By Booking/Issuing this Ticket I agree to Triplover{" "}
                <Link to="/bookingpolicy">
                  <u style={{ color: "#7c04c0" }} className="fw-bold">
                    Booking Policy
                  </u>
                </Link>
                <span className="mx-1">and</span>
                <Link to="/termandcondition">
                  <u style={{ color: "#7c04c0" }} className="fw-bold">
                    Terms & Conditions
                  </u>
                </Link>
              </label>
            </div>
          </div>
        </div>

        <div className="row my-2 pb-3">
          <div className="col-lg-12 text-center">
            <button
              type="button"
              className="btn button-color text-white fw-bold border-radius w-100"
              onClick={() => onClick()}
              disabled={!click || bookingBtnLoader ? true : false}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
