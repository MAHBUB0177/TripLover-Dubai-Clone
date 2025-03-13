import React, { useEffect, useState } from "react";
import { brandedFareTitleList } from "../../../common/customArr";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FaPlaneDeparture } from "react-icons/fa";
import airports from "../../../JSON/airports.json";
import CustomCarousel from "./customCarousel";
import { environment } from "../../SharePages/Utility/environment";
import moment from "moment";
import { BsDot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const BrandedFareForCombo = ({
  brandedFaresDepature,
  brandedFaresReturn,
  handleSelectDeparture,
  handleSelectReturn,
  selectedBrandedFareDepartureIdx,
  selectedBrandedFareReturnIdx,
  isOpen,
  onClose,
  amountChange,
  direction0,
  direction1,
  comboFare,
}) => {
  const [customTab, setCustomTab] = useState("OnWard");
  const searchData = JSON.parse(sessionStorage.getItem("Database"));
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 864 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 864, min: 0 },
      items: 2,
    },
  };
  const navigate = useNavigate();
  const handleContinueBtnClick = () => {
    sessionStorage.setItem(
      "direction0",
      JSON.stringify(comboFare?.departure[comboFare?.groupDepartIndex])
    );
    sessionStorage.setItem("direction1", JSON.stringify(comboFare?.return[comboFare?.groupReturnIndex]));
    sessionStorage.setItem("direction2", JSON.stringify([]));
    sessionStorage.setItem("direction3", JSON.stringify([]));
    sessionStorage.setItem("direction4", JSON.stringify([]));
    sessionStorage.setItem("direction5", JSON.stringify([]));
    sessionStorage.setItem("comboFare", JSON.stringify(comboFare));
    sessionStorage.setItem(
      "bookable",
      JSON.stringify(comboFare?.item[0]?.bookable)
    );
    navigate("/travellcartcombofare");
  };

  const baggageObject = {};
  const baggageObjectReturn = {};

  let brandedFaresDepatureObj = {
    name: "Economy Light",
    totalFare: comboFare?.item[0]?.bookingComponents[0]?.totalPrice,
    baseFare: comboFare?.item[0]?.bookingComponents[0]?.basePrice,
    tax: comboFare?.item[0]?.bookingComponents[0]?.tax,
    bookingClasses: {
      [`${direction0.from}-${direction0.to}`]:
        direction0?.segments[0]?.bookingClass,
    },
    cabinClasses: {
      [`${direction0.from}-${direction0.to}`]:
        direction0?.segments[0]?.cabinClass ?? searchData?.travelClass,
    },
    paxFareBreakDown: comboFare?.item[0]?.passengerFares,
    brandFeatures: {
      HandBaggage: [
        {
          desc: "not more than 7 Kg",
          chargesApplicable: false,
          weights: "7Kg",
          direction: "CXB-DAC",
          isRefundable: false,
        },
      ],
      Refundable: {
        desc: "Refundable",
        chargesApplicable: true,
        weights: "",
        direction: "",
        isRefundable: comboFare?.item[0]?.refundable,
      },
      Meal: {
        desc: "Complementary Meal",
        chargesApplicable: false,
        weights: "",
        direction: "",
        isRefundable: false,
      },
    },
    discount: comboFare?.item[0]?.bookingComponents[0]?.discountPrice,
    ait: comboFare?.item[0]?.bookingComponents[0]?.ait,
  };

  if (direction0?.segments[0].baggage?.length > 0) {
    direction0?.segments[0].baggage?.forEach((item) => {
      const passengerType = item.passengerTypeCode;
      const baggageDetails = {
        desc: "CheckedBaggage",
        chargesApplicable: false,
        weights: `${item.amount}${item.units}`,
        direction: `${direction0.from}-${direction0.to}`,
        isRefundable: false,
      };

      // Initialize an array for each passenger type if it doesn't exist yet
      if (!baggageObject[passengerType]) {
        baggageObject[passengerType] = [];
      }

      // Add baggage details to the corresponding passenger type
      baggageObject[passengerType].push(baggageDetails);
      brandedFaresDepatureObj.brandFeatures["CheckedBaggage"] = baggageObject;
    });
  }

  let brandedFaresReturnObj = {
    name: "Economy Light",
    totalFare: comboFare?.item[1]?.bookingComponents[0]?.totalPrice,
    baseFare: comboFare?.item[1]?.bookingComponents[0]?.basePrice,
    tax: comboFare?.item[1]?.bookingComponents[0]?.tax,
    bookingClasses: {
      [`${direction1.from}-${direction1.to}`]:
        direction1?.segments[0]?.bookingClass,
    },
    cabinClasses: {
      [`${direction1.from}-${direction0.to}`]:
        direction1?.segments[0]?.cabinClass ?? searchData?.travelClass,
    },
    paxFareBreakDown: comboFare?.item[1]?.passengerFares,
    brandFeatures: {
      HandBaggage: [
        {
          desc: "not more than 7 Kg",
          chargesApplicable: false,
          weights: "7Kg",
          direction: "CXB-DAC",
          isRefundable: false,
        },
      ],
      Refundable: {
        desc: "Refundable",
        chargesApplicable: true,
        weights: "",
        direction: "",
        isRefundable: comboFare?.item[1]?.refundable,
      },
      Meal: {
        desc: "Complementary Meal",
        chargesApplicable: false,
        weights: "",
        direction: "",
        isRefundable: false,
      },
    },
    discount: comboFare?.item[1]?.bookingComponents[0]?.discountPrice,
    ait: comboFare?.item[1]?.bookingComponents[0]?.ait,
  };
  if (direction1?.segments[0].baggage?.length > 0) {
    direction1?.segments[0].baggage?.forEach((item) => {
      const passengerType = item.passengerTypeCode;
      const baggageDetails = {
        desc: "CheckedBaggage",
        chargesApplicable: false,
        weights: `${item.amount}${item.units}`,
        direction: `${direction1.from}-${direction1.to}`,
        isRefundable: false,
      };

      // Initialize an array for each passenger type if it doesn't exist yet
      if (!baggageObjectReturn[passengerType]) {
        baggageObjectReturn[passengerType] = [];
      }

      // Add baggage details to the corresponding passenger type
      baggageObjectReturn[passengerType].push(baggageDetails);
      brandedFaresReturnObj.brandFeatures["CheckedBaggage"] =
        baggageObjectReturn;
    });
  }

  return (
    <Modal
      size="1000px"
      isOpen={isOpen}
      trapFocus={false}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent w="1000px">
        <ModalHeader>
          MORE FARE OPTIONS available for your round trip.
        </ModalHeader>
        <ModalCloseButton onClick={() => setCustomTab("OnWard")} />

        <ModalBody borderTop="1px solid #ededed">
          <div className="d-flex justify-content-evenly align-items-center gap-3 pt-3 border-bottom">
            <p
              className={
                customTab === "OnWard"
                  ? "custom-selected-tab custom-border-selected-tab p-2 px-5 rounded-top w-50 text-center fw-bold"
                  : "p-2 px-5 w-50 text-center fw-bold"
              }
              style={{ cursor: "pointer" }}
              onClick={() => setCustomTab("OnWard")}
            >
              ONWARD
            </p>
            <p
              className={
                customTab === "Return"
                  ? "custom-selected-tab custom-border-selected-tab p-2 px-5 rounded-top w-50 text-center fw-bold"
                  : "p-2 px-5 w-50 text-center fw-bold"
              }
              style={{ cursor: "pointer" }}
              onClick={() => setCustomTab("Return")}
            >
              RETURN
            </p>
          </div>
          {customTab === "OnWard" ? (
            <div
              className="my-2 d-flex justify-content-start align-items-center gap-2 fw-bold"
              style={{ fontSize: "14px" }}
            >
              <p>
                {airports
                  .filter((f) => f.iata === direction0.from)
                  .map((item) => item.city)}
              </p>
              <FaPlaneDeparture />
              <p>
                {airports
                  .filter((f) => f.iata === direction0.to)
                  .map((item) => item.city)}
              </p>
              <img
                src={
                  environment.s3ArliensImage +
                  `${direction0.platingCarrierCode}.png`
                }
                alt=""
                width="40px"
                height="40px"
              />
              <p>|</p>
              <p>{direction0.platingCarrierName}</p>
              <BsDot style={{ fontSize: "18px" }} />
              <p>
                {moment(direction0.segments[0]?.departure).format(
                  "DD MMM,yyy, ddd"
                )}
              </p>
              <BsDot style={{ fontSize: "18px" }} />
              <p>
                {" "}
                Departure at :{" "}
                {moment(direction0.segments[0]?.departure).format("h:mm a")} -
                Arrival at{" "}
                {moment(
                  direction0.segments[direction0.segments?.length - 1]?.arrival
                ).format("h:mm a")}
              </p>
            </div>
          ) : (
            <div
              className="my-2 d-flex justify-content-start align-items-center gap-2 fw-bold"
              style={{ fontSize: "14px" }}
            >
              <p>
                {airports
                  .filter((f) => f.iata === direction1.from)
                  .map((item) => item.city)}
              </p>
              <FaPlaneDeparture />
              <p>
                {airports
                  .filter((f) => f.iata === direction1.to)
                  .map((item) => item.city)}
              </p>
              <img
                src={
                  environment.s3ArliensImage +
                  `${direction1.platingCarrierCode}.png`
                }
                alt=""
                width="40px"
                height="40px"
              />
              <p>|</p>
              <p>{direction1.platingCarrierName}</p>
              <p>|</p>
              <p>
                {moment(direction1.segments[0]?.departure).format(
                  "DD MMM,yyy, dddd"
                )}
              </p>
              <BsDot style={{ fontSize: "18px" }} />
              <p>
                {" "}
                Departure at :{" "}
                {moment(direction1.segments[0]?.departure).format("h:mm a")} -
                Arrival at{" "}
                {moment(
                  direction1.segments[direction0.segments?.length - 1]?.arrival
                ).format("h:mm a")}
              </p>
            </div>
          )}

          <section className="bg-light p-2">
            <div className="container">
              <div className="row">
                <div className="col-lg-2">
                  <div
                    className="py-2"
                    style={{ width: "full", cursor: "pointer" }}
                  >
                    <div
                      className={
                        "card border-0 border-bottom border-primary shadow-sm  rounded"
                      }
                    >
                      <div className="button-secondary-color px-3 py-2 rounded-top">
                        <Text
                          fontSize={"10px"}
                          className="text-white text-center"
                        >
                          Fare Type
                        </Text>
                      </div>
                      <div
                        className="card-body px-3 py-1 p-xxl-5"
                        style={{ height: "275px" }}
                      >
                        <ul className="list-group list-group-flush mb-4">
                          {brandedFareTitleList?.map((item, index) => (
                            <div
                              className="d-flex gap-2 justify-content-start align-items-center border-bottom py-2 fw-bold"
                              style={{
                                fontSize: "10px",
                                height: "40px",
                              }}
                              key={index}
                            >
                              {item?.icon}
                              {item?.name}
                            </div>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {/* </div> */}
                  </div>
                </div>
                <div className="col-lg-10">
                  {customTab === "OnWard" ? (
                    <CustomCarousel
                      responsive={responsive}
                      brandedFares={
                        brandedFaresDepature !== null
                          ? brandedFaresDepature
                          : [brandedFaresDepatureObj]
                      }
                      selectedBrandedFareIdx={selectedBrandedFareDepartureIdx}
                      handleChange={handleSelectDeparture}
                      amountChange={amountChange}
                      customTab={customTab}
                    />
                  ) : (
                    customTab === "Return" && (
                      <CustomCarousel
                        responsive={responsive}
                        brandedFares={
                          brandedFaresReturn !== null
                            ? brandedFaresReturn
                            : [brandedFaresReturnObj]
                        }
                        selectedBrandedFareIdx={selectedBrandedFareReturnIdx}
                        handleChange={handleSelectReturn}
                        amountChange={amountChange}
                        customTab={customTab}
                      />
                    )
                  )}
                </div>
                {customTab === "Return" ? (
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-danger border-radius text-white mb-3 fw-bold"
                      style={{ width: "100px" }}
                      onClick={() => setCustomTab("OnWard")}
                    >
                      BACK
                    </button>
                    <button
                      className="btn button-color border-radius w-25 text-white mb-3 fw-bold"
                      onClick={() => handleContinueBtnClick()}
                    >
                      CONTINUE
                    </button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn button-color border-radius w-25 text-white mb-3 fw-bold"
                      onClick={() => setCustomTab("Return")}
                    >
                      CONTINUE
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BrandedFareForCombo;
