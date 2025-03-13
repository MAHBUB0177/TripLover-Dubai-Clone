import React, { useEffect, useRef } from "react";
import { isNestedObject, passengerType } from "../../../common/functions";
import { GiWaterRecycling } from "react-icons/gi";
import { TbBrandBooking } from "react-icons/tb";
import Carousel from "react-multi-carousel";
import { MdOutlineClose } from "react-icons/md";
import { Text, Tooltip } from "@chakra-ui/react";

const CustomCarousel = ({
  brandedFares,
  selectedBrandedFareIdx,
  responsive,
  handleChange,
  amountChange,
  customTab
}) => {
  const carouselRef = useRef(null);
  const searchData = JSON.parse(sessionStorage.getItem("Database"));
  const handelIndexChange = (idx) => {
    handleChange(idx);
  };
  useEffect(()=>{
    resetCarousel()
  },[customTab])
  const resetCarousel = () => {
    if (carouselRef?.current) {
      carouselRef?.current?.goToSlide(0); // This resets to the first item
    }
  };
  return (
    <Carousel responsive={responsive} ref={carouselRef}>
      {brandedFares !== null &&
        brandedFares !== undefined &&
        brandedFares.length > 0 &&
        brandedFares?.map((item, index) => (
          <div className="p-2" style={{ width: "full", cursor: "pointer" }}>
            <div
              className={
                index === selectedBrandedFareIdx
                  ? "card border-0 border-bottom border-primary shadow-sm  rounded selected-bg-color"
                  : "card border-0 border-bottom border-primary shadow-sm  rounded"
              }
              onClick={() => {
                handelIndexChange(index ?? 0);
              }}
            >
              <div className="button-secondary-color px-3 py-2 rounded-top">
                <Text fontSize={"10px"} className="text-white text-center">
                  {item?.name}
                </Text>
              </div>
              <div
                className="card-body px-3 py-1 p-xxl-5"
                style={{ height: "275px" }}
              >
                <ul className="list-group list-group-flush mb-2">
                  {(() => {
                    const brandFeatures = {
                      HandBaggage: "7Kg",
                      CheckedBaggage:
                        item?.brandFeatures?.CheckedBaggage !== undefined
                          ? item.brandFeatures.CheckedBaggage
                          : null,

                      Changeable:
                        item?.brandFeatures?.Changeable !== undefined
                          ? item.brandFeatures.Changeable
                          : null,
                      Refundable:
                        item?.brandFeatures?.Refundable !== undefined
                          ? item.brandFeatures.Refundable
                          : null,

                      BookingClass:
                        item?.bookingClasses !== undefined
                          ? item.bookingClasses
                          : null,
                    };

                    return Object.keys(brandFeatures).map((key) => {
                      const value = brandFeatures[key];

                      if (value === null || value === undefined) {
                        return (
                          <div
                            className="border-bottom py-2 d-flex justify-content-center align-items-center"
                            style={{
                              fontSize: "10px",
                              height: "40px",
                            }}
                            key={key}
                          >
                            <MdOutlineClose
                              className="text-danger rounded-circle shadow"
                              style={{
                                backgroundColor: "white",
                                width: "15px",
                                height: "15px",
                                fontSize: "12px",
                                padding: "2px",
                              }}
                            />
                          </div>
                        );
                      }

                      if (Array.isArray(value)) {
                        const allObjects = value.every(
                          (item) => typeof item === "object" && item !== null
                        );

                        if (allObjects) {
                          return (
                            <div
                              key={key}
                              className="d-flex justify-content-center align-items-center border-bottom py-2 fw-bold"
                              style={{
                                fontSize: "10px",
                                height: "40px",
                              }}
                            >
                              <Tooltip
                                bg="#ed7f22"
                                p={"5px"}
                                label={
                                  <div
                                    style={{
                                      overflowY: "auto",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <table
                                      className="table-bordered"
                                      style={{
                                        width: "100%",
                                      }}
                                    >
                                      <thead className="text-center thead text-white fw-bold">
                                        <tr>
                                          <th className="py-1">Direction</th>
                                          <th className="py-1">
                                            Charges Applicable
                                          </th>
                                          <th className="py-1">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-center">
                                        {value.map((obj, index) => (
                                          <tr
                                            key={index}
                                            className="text-dark fw-bold"
                                            style={{
                                              fontSize: "10px",
                                            }}
                                          >
                                            {Object.keys(obj)
                                              .reverse()
                                              .map((objKey, idx) => (
                                                <React.Fragment key={idx}>
                                                  {objKey === "direction" && (
                                                    <td className="py-1">
                                                      {obj[objKey]}
                                                    </td>
                                                  )}
                                                  {objKey ===
                                                    "chargesApplicable" && (
                                                    <td className="py-1">
                                                      {obj[objKey] === true
                                                        ? "Yes"
                                                        : "No"}
                                                    </td>
                                                  )}
                                                  {objKey === "desc" && (
                                                    <td className="py-1">
                                                      <span
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        {obj[objKey]}
                                                      </span>
                                                    </td>
                                                  )}
                                                </React.Fragment>
                                              ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                }
                                aria-label="Changeable Details"
                                hasArrow
                                placement="bottom"
                                openDelay={500} // optional, delay before showing tooltip
                              >
                                <span
                                  className="button-color rounded-pill px-3 py-1 text-white d-flex align-items-center"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                >
                                  Changeable
                                  <i
                                    className="fa fa-calendar mx-1"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  Details
                                </span>
                              </Tooltip>
                            </div>
                          );
                        }
                      } else if (isNestedObject(value)) {
                        return (
                          <div
                            key={key}
                            className="d-flex justify-content-center align-items-center border-bottom py-2 fw-bold"
                            style={{
                              fontSize: "10px",
                              height: "40px",
                            }}
                          >
                            <Tooltip
                              bg="#ed7f22"
                              p={"5px"}
                              label={
                                <div
                                  style={{
                                    overflowY: "auto",
                                    fontSize: "12px",
                                  }}
                                >
                                  <table
                                    className="table-bordered"
                                    style={{
                                      width: "auto",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <thead className="text-center thead text-white fw-bold">
                                      <tr>
                                        <th className="py-1">Type</th>
                                        <th className="py-1">Baggage</th>
                                        <th className="py-1">Direction</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-center">
                                      {Object.keys(value).map((itemKey) => {
                                        const item = value[itemKey];
                                        return item.map((obj, index) => (
                                          <tr
                                            key={index}
                                            className="text-dark fw-bold"
                                            style={{
                                              fontSize: "10px",
                                            }}
                                          >
                                            {index === 0 && (
                                              <td
                                                rowSpan={item?.length}
                                                className="align-middle py-1"
                                              >
                                                {passengerType(itemKey)}
                                              </td>
                                            )}
                                            {Object.keys(obj).map(
                                              (objKey, idx) => (
                                                <React.Fragment key={idx}>
                                                  {objKey === "direction" && (
                                                    <td className="py-1">
                                                      {obj[objKey]}
                                                    </td>
                                                  )}
                                                  {objKey === "weights" && (
                                                    <td className="py-1">
                                                      {obj[objKey]}
                                                    </td>
                                                  )}
                                                </React.Fragment>
                                              )
                                            )}
                                          </tr>
                                        ));
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              }
                              aria-label="Baggage Details"
                              hasArrow
                              placement="bottom"
                              openDelay={500} // optional, to show the tooltip after delay
                            >
                              <span
                                className="button-color rounded-pill px-3 py-1 text-white"
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                View{" "}
                                <i className="fas fa-luggage-cart mx-1"></i>{" "}
                                Details
                              </span>
                            </Tooltip>
                          </div>
                        );
                      } else if (typeof value === "object") {
                        return (
                          <div
                            key={key}
                            className="d-flex justify-content-center align-items-center border-bottom py-2 fw-bold"
                            style={{
                              fontSize: "10px",
                              height: "40px",
                            }}
                          >
                            <Tooltip
                              bg="#ed7f22"
                              p={"5px"}
                              label={
                                <div
                                  style={{
                                    overflowY: "auto",
                                    fontSize: "12px",
                                  }}
                                >
                                  <table
                                    style={{ width: "100%" }}
                                    className="table-bordered"
                                  >
                                    <thead className="text-center thead text-white fw-bold">
                                      {key === "Refundable" ? (
                                        <tr>
                                          <th className="py-1">Status</th>
                                          <th className="py-1">
                                            Charges Applicable
                                          </th>
                                        </tr>
                                      ) : key === "BookingClass" ? (
                                        <tr>
                                          <th className="py-1">Direction</th>
                                          <th className="py-1">
                                            Booking Class
                                          </th>
                                          {item.cabinClasses && (
                                            <th className="py-1">
                                              Cabin Class
                                            </th>
                                          )}
                                        </tr>
                                      ) : null}
                                    </thead>
                                    <tbody className="text-center">
                                      {key === "BookingClass" && (
                                        <>
                                          {Object.keys(value).map(
                                            (innerKey) => (
                                              <tr
                                                key={innerKey}
                                                className="text-dark fw-bold"
                                                style={{
                                                  fontSize: "10px",
                                                }}
                                              >
                                                <td className="py-1">
                                                  <span
                                                    style={{
                                                      fontSize: "10px",
                                                    }}
                                                  >
                                                    {innerKey}
                                                  </span>
                                                </td>
                                                <td className="py-1">
                                                  <span
                                                    style={{
                                                      fontSize: "10px",
                                                    }}
                                                  >{` ${value[innerKey]}`}</span>
                                                </td>
                                                <td className="py-1">
                                                  <span
                                                    style={{
                                                      fontSize: "10px",
                                                    }}
                                                  >
                                                    {item.cabinClasses &&
                                                    item.cabinClasses[
                                                      innerKey
                                                    ] !== undefined &&
                                                    item.cabinClasses[
                                                      innerKey
                                                    ] !== ""
                                                      ? item.cabinClasses[
                                                          innerKey
                                                        ]
                                                      : searchData?.travelClass}
                                                  </span>
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </>
                                      )}

                                      {key === "Refundable" && (
                                        <tr
                                          className="text-dark fw-bold"
                                          style={{
                                            fontSize: "10px",
                                          }}
                                        >
                                          {Object.keys(value).map(
                                            (innerKey) => (
                                              <React.Fragment key={innerKey}>
                                                {innerKey === "desc" && (
                                                  <td className="py-1">
                                                    <span
                                                      style={{
                                                        fontSize: "10px",
                                                      }}
                                                    >
                                                      {value[innerKey]}
                                                    </span>
                                                  </td>
                                                )}
                                                {innerKey ===
                                                  "chargesApplicable" && (
                                                  <td className="py-1">
                                                    <span
                                                      style={{
                                                        fontSize: "10px",
                                                      }}
                                                    >
                                                      {value[innerKey] === true
                                                        ? "Yes"
                                                        : "No"}
                                                    </span>
                                                  </td>
                                                )}
                                              </React.Fragment>
                                            )
                                          )}
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              }
                              aria-label="Changeable Details"
                              hasArrow
                              placement="bottom"
                              openDelay={500} // Optional delay before the tooltip opens
                            >
                              <span
                                className="button-color rounded-pill px-3 py-1 text-white d-flex align-items-center"
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                {key === "Refundable"
                                  ? "Cancellation"
                                  : key === "BookingClass" && "Booking Class"}
                                {key === "Refundable" ? (
                                  <GiWaterRecycling className="mx-1" />
                                ) : (
                                  <TbBrandBooking className="mx-1" />
                                )}
                                Details
                              </span>
                            </Tooltip>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className="border-bottom py-2 d-flex align-items-center justify-content-center fw-bold"
                            style={{
                              fontSize: "10px",
                              height: "40px",
                            }}
                            key={key}
                          >
                            {value}
                          </div>
                        );
                      }
                    });
                  })()}
                  {amountChange === "Invoice Amount" ? (
                    <>
                      <div
                        className="text-center  pt-1"
                        style={{ fontSize: "12px" }}
                      >
                        Agent Fare:{" "}
                        <span className="fw-bold">
                          AED{" "}
                          {brandedFares?.[index].totalFare.toLocaleString(
                            "en-US"
                          )}
                        </span>
                      </div>

                      <div
                        className="text-center pt-1"
                        style={{ fontSize: "12px" }}
                      >
                        Gross Fare:{" "}
                        <del className="fw-bold">
                          AED{" "}
                          {(
                            brandedFares?.[index].totalFare -
                            brandedFares?.[index]?.discount
                          ).toLocaleString("en-US")}
                        </del>
                      </div>
                    </>
                  ) : (
                    <div
                      className="text-center pt-1"
                      style={{ fontSize: "12px" }}
                    >
                      Gross Fare:{" "}
                      <span className="fw-bold">
                        AED{" "}
                        {(
                          brandedFares?.[index]?.totalFare -
                          brandedFares?.[index]?.discount
                        ).toLocaleString("en-US")}
                      </span>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
    </Carousel>
  );
};

export default CustomCarousel;
