import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { passengerType } from "../../../common/functions";
import airports from "../../../JSON/airports.json";
import SegmentInfo from "./segmentInfo";
import { totalComboFare } from "../../../common/comboFare/normalFunction";

const FlightDetails = ({
  direction0,
  direction1,
  isOpen,
  onClose,
  brandedFaresDepature,
  brandedFaresReturn,
  selectedBrandedFareDepartureIdx,
  selectedBrandedFareReturnIdx,
  passengerCountsDeparture,
  passengerCountsReturn,
  passengerFaresDeparture,
  passengerFaresReturn,
  bookingComponentsDeparture,
  bookingComponentsReturn,
  comboFare,
}) => {
  return (
    <div>
      <Modal
        size={"4xl"}
        isOpen={isOpen}
        // trapFocus={false}
        onClose={onClose}
        // closeOnOverlayClick={false}
        // isCentered
      >
        <ModalOverlay />
        <ModalContent w="1000px">
          <ModalHeader>Details</ModalHeader>
          <ModalCloseButton />

          <ModalBody borderTop="1px solid #ededed">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target={"#home"}
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
                  data-bs-target={"#profile"}
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
                  data-bs-target={"#contact"}
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
                  data-bs-target={"#about"}
                  type="button"
                  role="tab"
                  aria-controls="about"
                  aria-selected="false"
                >
                  Fare Policy
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id={"home"}
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <>
                  <div className="p-2">
                    <div className="container">
                      <SegmentInfo
                        direction={direction0}
                        brandedFares={brandedFaresDepature}
                        selectedBrandedFareIdx={selectedBrandedFareDepartureIdx}
                      />
                    </div>
                    <div className="container my-1">
                      <SegmentInfo
                        direction={direction1}
                        brandedFares={brandedFaresReturn}
                        selectedBrandedFareIdx={selectedBrandedFareReturnIdx}
                      />
                    </div>
                  </div>
                </>
              </div>
              <div
                className="tab-pane fade"
                id={"profile"}
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
                          {passengerFaresDeparture !== null &&
                            passengerFaresDeparture !== undefined && (
                              <>
                                <tbody className="text-end">
                                  {passengerFaresDeparture.adt !== null ? (
                                    <>
                                      <tr>
                                        <td className="text-center">Adult</td>
                                        <td className="left">
                                          {passengerFaresDeparture.adt.basePrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="center">
                                          {passengerFaresDeparture.adt.taxes.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerFaresDeparture.adt.discountPrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerFaresDeparture.adt.ait.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerCountsDeparture.adt}
                                        </td>
                                        <td className="right fw-bold">
                                          AED{" "}
                                          {(
                                            passengerFaresDeparture.adt
                                              .totalPrice *
                                            passengerCountsDeparture.adt
                                          ).toLocaleString("en-US")}
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {passengerFaresDeparture.chd !== null ? (
                                    <>
                                      <tr>
                                        <td className="text-center">
                                          Child &gt; 5
                                        </td>
                                        <td className="left">
                                          {passengerFaresDeparture.chd.basePrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="center">
                                          {passengerFaresDeparture.chd.taxes.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerFaresDeparture.chd.discountPrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerFaresDeparture.chd.ait.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerCountsDeparture.chd}
                                        </td>
                                        <td className="right fw-bold">
                                          AED{" "}
                                          {(
                                            passengerFaresDeparture.chd
                                              .totalPrice *
                                            passengerCountsDeparture.chd
                                          ).toLocaleString("en-US")}
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {passengerFaresDeparture.cnn !== null ? (
                                    <>
                                      <tr>
                                        <td className="text-center">
                                          Child{" "}
                                          {passengerFaresDeparture.chd ===
                                          null ? (
                                            <></>
                                          ) : (
                                            <> &#60; 5</>
                                          )}
                                        </td>
                                        <td className="left">
                                          {passengerFaresDeparture.cnn.basePrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="center">
                                          {passengerFaresDeparture.cnn.taxes.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerFaresDeparture.cnn.discountPrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerFaresDeparture.cnn.ait.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerCountsDeparture.cnn}
                                        </td>
                                        <td className="right fw-bold">
                                          AED{" "}
                                          {(
                                            passengerFaresDeparture.cnn
                                              .totalPrice *
                                            passengerCountsDeparture.cnn
                                          ).toLocaleString("en-US")}
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {passengerFaresDeparture.inf !== null ? (
                                    <>
                                      <tr>
                                        <td className="text-center">Infant</td>
                                        <td className="left">
                                          {passengerFaresDeparture.inf.basePrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="center">
                                          {passengerFaresDeparture.inf.taxes.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerFaresDeparture.inf.discountPrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerFaresDeparture.inf.ait.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerCountsDeparture.inf}
                                        </td>
                                        <td className="right fw-bold">
                                          AED{" "}
                                          {(
                                            passengerFaresDeparture.inf
                                              .totalPrice *
                                            passengerCountsDeparture.inf
                                          ).toLocaleString("en-US")}
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  <tr className="fw-bold">
                                    <td colSpan={6} className="border-none">
                                      {direction0?.from} - {direction0?.to}
                                    </td>
                                    {/* <td>Total</td> */}
                                    <td>
                                      AED{" "}
                                      {bookingComponentsDeparture[0].totalPrice.toLocaleString(
                                        "en-US"
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </>
                            )}
                          {brandedFaresDepature !== null &&
                            brandedFaresDepature !== undefined &&
                            brandedFaresDepature?.length > 0 && (
                              <>
                                <tbody className="text-end">
                                  {brandedFaresDepature[
                                    selectedBrandedFareDepartureIdx
                                  ]?.paxFareBreakDown.adt !== null ? (
                                    <>
                                      <tr>
                                        <td className="text-center">Adult</td>
                                        <td className="left">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.adt.basePrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="center">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.adt.taxes.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {(brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.adt.discountPrice).toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.adt.ait.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerCountsDeparture.adt}
                                        </td>
                                        <td className="right fw-bold">
                                          AED{" "}
                                          {(
                                            brandedFaresDepature[
                                              selectedBrandedFareDepartureIdx
                                            ]?.paxFareBreakDown.adt.totalPrice *
                                            passengerCountsDeparture.adt
                                          ).toLocaleString("en-US")}
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {brandedFaresDepature[
                                    selectedBrandedFareDepartureIdx
                                  ]?.paxFareBreakDown.chd !== null ? (
                                    <>
                                      <tr>
                                        <td className="text-center">
                                          Child &gt; 5
                                        </td>
                                        <td className="left">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.chd.basePrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="center">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.chd.taxes.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {(brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.chd.discountPrice).toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.chd.ait.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerCountsDeparture.chd}
                                        </td>
                                        <td className="right fw-bold">
                                          AED{" "}
                                          {(
                                            brandedFaresDepature[
                                              selectedBrandedFareDepartureIdx
                                            ]?.paxFareBreakDown.chd.totalPrice *
                                            passengerCountsDeparture.chd
                                          ).toLocaleString("en-US")}
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {brandedFaresDepature[
                                    selectedBrandedFareDepartureIdx
                                  ]?.paxFareBreakDown.cnn !== null ? (
                                    <>
                                      <tr>
                                        <td className="text-center">
                                          Child{" "}
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.chd === null ? (
                                            <></>
                                          ) : (
                                            <> &#60; 5</>
                                          )}
                                        </td>
                                        <td className="left">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.cnn.basePrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="center">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.cnn.taxes.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {(brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.cnn.discountPrice).toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.cnn.ait.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerCountsDeparture.cnn}
                                        </td>
                                        <td className="right fw-bold">
                                          AED{" "}
                                          {(
                                            brandedFaresDepature[
                                              selectedBrandedFareDepartureIdx
                                            ]?.paxFareBreakDown.cnn.totalPrice *
                                            passengerCountsDeparture.cnn
                                          ).toLocaleString("en-US")}
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {brandedFaresDepature[
                                    selectedBrandedFareDepartureIdx
                                  ]?.paxFareBreakDown.inf !== null ? (
                                    <>
                                      <tr>
                                        <td className="text-center">Infant</td>
                                        <td className="left">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.inf.basePrice.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="center">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.inf.taxes.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {(brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.inf.discountPrice).toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.inf.ait.toLocaleString(
                                            "en-US"
                                          )}
                                        </td>
                                        <td className="right">
                                          {passengerCountsDeparture.inf}
                                        </td>
                                        <td className="right fw-bold">
                                          AED{" "}
                                          {(
                                            brandedFaresDepature[
                                              selectedBrandedFareDepartureIdx
                                            ]?.paxFareBreakDown.inf.totalPrice *
                                            passengerCountsDeparture.inf
                                          ).toLocaleString("en-US")}
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  <tr className="fw-bold">
                                    <td colSpan={6} className="border-none">
                                      {direction0?.from} - {direction0?.to}
                                    </td>
                                    {/* <td>Total</td> */}
                                    <td className="text-end">
                                      AED{" "}
                                      {brandedFaresDepature[
                                        selectedBrandedFareDepartureIdx
                                      ]?.paxFareBreakDown.adt !== null &&
                                        (
                                          brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.adt.totalPrice *
                                            passengerCountsDeparture.adt +
                                          (brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.chd !== null &&
                                            brandedFaresDepature[
                                              selectedBrandedFareDepartureIdx
                                            ]?.paxFareBreakDown.chd.totalPrice *
                                              passengerCountsDeparture.chd) +
                                          (brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.cnn !== null &&
                                            brandedFaresDepature[
                                              selectedBrandedFareDepartureIdx
                                            ]?.paxFareBreakDown.cnn.totalPrice *
                                              passengerCountsDeparture.cnn) +
                                          (brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.paxFareBreakDown.inf !== null &&
                                            brandedFaresDepature[
                                              selectedBrandedFareDepartureIdx
                                            ]?.paxFareBreakDown.inf.totalPrice *
                                              passengerCountsDeparture.inf)
                                        ).toLocaleString("en-US")}
                                    </td>
                                  </tr>
                                </tbody>
                              </>
                            )}
                          {passengerFaresReturn !== null &&
                            passengerFaresReturn !== undefined && (
                              <tbody className="text-end">
                                {passengerFaresReturn.adt !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">Adult</td>
                                      <td className="left">
                                        {passengerFaresReturn.adt.basePrice?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {passengerFaresReturn.adt.taxes?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFaresReturn.adt.discountPrice?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFaresReturn.adt.ait?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCountsReturn.adt}
                                      </td>
                                      <td className="right fw-bold">
                                        AED{" "}
                                        {(
                                          passengerFaresReturn.adt.totalPrice *
                                          passengerCountsReturn.adt
                                        )?.toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {passengerFaresReturn.chd !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">
                                        Child &gt; 5
                                      </td>
                                      <td className="left">
                                        {passengerFaresReturn.chd.basePrice?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {passengerFaresReturn.chd.taxes?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFaresReturn.chd.discountPrice?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFaresReturn.chd.ait?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCountsReturn.chd}
                                      </td>
                                      <td className="right fw-bold">
                                        AED{" "}
                                        {(
                                          passengerFaresReturn.chd.totalPrice *
                                          passengerCountsReturn.chd
                                        )?.toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {passengerFaresReturn.cnn !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">
                                        Child{" "}
                                        {passengerFaresReturn.chd === null ? (
                                          <></>
                                        ) : (
                                          <> &#60; 5</>
                                        )}
                                      </td>
                                      <td className="left">
                                        {passengerFaresReturn.cnn.basePrice?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {passengerFaresReturn.cnn.taxes?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFaresReturn.cnn.discountPrice?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFaresReturn.cnn.ait?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCountsReturn.cnn}
                                      </td>
                                      <td className="right fw-bold">
                                        AED{" "}
                                        {(
                                          passengerFaresReturn.cnn.totalPrice *
                                          passengerCountsReturn.cnn
                                        )?.toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {passengerFaresReturn.inf !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">Infant</td>
                                      <td className="left">
                                        {passengerFaresReturn.inf.basePrice?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {passengerFaresReturn.inf.taxes?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFaresReturn.inf.discountPrice?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerFaresReturn.inf.ait?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCountsReturn.inf}
                                      </td>
                                      <td className="right fw-bold">
                                        AED{" "}
                                        {(
                                          passengerFaresReturn.inf.totalPrice *
                                          passengerCountsReturn.inf
                                        )?.toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}
                                <tr className="fw-bold">
                                  <td colSpan={6} className="border-none">
                                    {direction1.from} - {direction1.to}
                                  </td>
                                  {/* <td>Grand Total</td> */}
                                  <td>
                                    AED{" "}
                                    {bookingComponentsReturn[0]?.totalPrice?.toLocaleString(
                                      "en-US"
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            )}

                          {brandedFaresReturn !== null &&
                            brandedFaresReturn !== undefined &&
                            brandedFaresReturn?.length > 0 && (
                              <tbody className="text-end">
                                {brandedFaresReturn[
                                  selectedBrandedFareReturnIdx
                                ]?.paxFareBreakDown.adt !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">Adult</td>
                                      <td className="left">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.adt.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.adt.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {(brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.adt.discountPrice).toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.adt.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCountsDeparture.adt}
                                      </td>
                                      <td className="right fw-bold">
                                        AED{" "}
                                        {(
                                          brandedFaresReturn[
                                            selectedBrandedFareReturnIdx
                                          ]?.paxFareBreakDown.adt.totalPrice *
                                          passengerCountsDeparture.adt
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {brandedFaresReturn[
                                  selectedBrandedFareReturnIdx
                                ]?.paxFareBreakDown.chd !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">
                                        Child &gt; 5
                                      </td>
                                      <td className="left">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.chd.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.chd.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {(brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.chd.discountPrice).toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.chd.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCountsDeparture.chd}
                                      </td>
                                      <td className="right fw-bold">
                                        AED{" "}
                                        {(
                                          brandedFaresReturn[
                                            selectedBrandedFareReturnIdx
                                          ]?.paxFareBreakDown.chd.totalPrice *
                                          passengerCountsDeparture.chd
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {brandedFaresReturn[
                                  selectedBrandedFareReturnIdx
                                ]?.paxFareBreakDown.cnn !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">
                                        Child{" "}
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.chd === null ? (
                                          <></>
                                        ) : (
                                          <> &#60; 5</>
                                        )}
                                      </td>
                                      <td className="left">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.cnn.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.cnn.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {(brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.cnn.discountPrice).toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.cnn.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCountsDeparture.cnn}
                                      </td>
                                      <td className="right fw-bold">
                                        AED{" "}
                                        {(
                                          brandedFaresReturn[
                                            selectedBrandedFareReturnIdx
                                          ]?.paxFareBreakDown.cnn.totalPrice *
                                          passengerCountsDeparture.cnn
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {brandedFaresReturn[
                                  selectedBrandedFareReturnIdx
                                ]?.paxFareBreakDown.inf !== null ? (
                                  <>
                                    <tr>
                                      <td className="text-center">Infant</td>
                                      <td className="left">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.inf.basePrice.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="center">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.inf.taxes.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {(brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.inf.discountPrice).toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.inf.ait.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td className="right">
                                        {passengerCountsDeparture.inf}
                                      </td>
                                      <td className="right fw-bold">
                                        AED{" "}
                                        {(
                                          brandedFaresReturn[
                                            selectedBrandedFareReturnIdx
                                          ]?.paxFareBreakDown.inf.totalPrice *
                                          passengerCountsDeparture.inf
                                        ).toLocaleString("en-US")}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <></>
                                )}
                                <tr className="fw-bold">
                                  <td colSpan={6} className="border-none">
                                    {direction1?.from} - {direction1?.to}
                                  </td>
                                  {/* <td>Total</td> */}
                                  <td className="text-end">
                                    AED{" "}
                                    {brandedFaresReturn[
                                      selectedBrandedFareReturnIdx
                                    ]?.paxFareBreakDown.adt !== null &&
                                      (
                                        brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.adt.totalPrice *
                                          passengerCountsDeparture.adt +
                                        (brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.chd !== null &&
                                          brandedFaresReturn[
                                            selectedBrandedFareReturnIdx
                                          ]?.paxFareBreakDown.chd.totalPrice *
                                            passengerCountsDeparture.chd) +
                                        (brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.cnn !== null &&
                                          brandedFaresReturn[
                                            selectedBrandedFareReturnIdx
                                          ]?.paxFareBreakDown.cnn.totalPrice *
                                            passengerCountsDeparture.cnn) +
                                        (brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.paxFareBreakDown.inf !== null &&
                                          brandedFaresReturn[
                                            selectedBrandedFareReturnIdx
                                          ]?.paxFareBreakDown.inf.totalPrice *
                                            passengerCountsDeparture.inf)
                                      ).toLocaleString("en-US")}
                                  </td>
                                </tr>
                                <tr className="fw-bold">
                                  <td colSpan={5} className="border-none"></td>
                                  <td>Total Payable</td>
                                  <td className="text-end">
                                    AED{" "}
                                    {comboFare?.item[0]?.brandedFares !==
                                      null &&
                                    comboFare?.item[1]?.brandedFares !== null
                                      ? (
                                          comboFare?.item[0]?.brandedFares?.[
                                            comboFare?.departureInx
                                          ]?.totalFare +
                                          comboFare?.item[1]?.brandedFares?.[
                                            comboFare?.returnIdx
                                          ]?.totalFare
                                        ).toLocaleString("en-US")
                                      : comboFare?.item[0]?.brandedFares ===
                                          null &&
                                        comboFare?.item[1]?.brandedFares !==
                                          null
                                      ? (
                                          comboFare?.item[0]
                                            ?.bookingComponents[0]?.totalPrice +
                                          comboFare?.item[1]?.brandedFares?.[
                                            comboFare?.returnIdx
                                          ]?.totalFare
                                        ).toLocaleString("en-US")
                                      : comboFare?.item[0]?.brandedFares !==
                                          null &&
                                        comboFare?.item[1]?.brandedFares ===
                                          null
                                      ? (
                                          comboFare?.item[1]
                                            ?.bookingComponents[0]?.totalPrice +
                                          comboFare?.item[0]?.brandedFares?.[
                                            comboFare?.departureInx
                                          ]?.totalFare
                                        ).toLocaleString("en-US")
                                      : comboFare?.item[0]?.brandedFares ===
                                          null &&
                                        comboFare?.item[1]?.brandedFares ===
                                          null &&
                                        (
                                          comboFare?.item[1]
                                            ?.bookingComponents[0]?.totalPrice +
                                          comboFare?.item[0]
                                            ?.bookingComponents[0]?.totalPrice
                                        ).toLocaleString("en-US")}
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
                id={"contact"}
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
                                {brandedFaresDepature !== null &&
                                brandedFaresDepature !== undefined &&
                                brandedFaresDepature?.length > 0 ? (
                                  <div
                                    className="d-flex justify-content-end align-items-center gap-1"
                                    style={{
                                      fontSize: "12px",
                                    }}
                                  >
                                    {brandedFaresDepature[
                                      selectedBrandedFareDepartureIdx
                                    ]?.brandFeatures?.CheckedBaggage !==
                                      undefined &&
                                      Object.keys(
                                        brandedFaresDepature[
                                          selectedBrandedFareDepartureIdx
                                        ]?.brandFeatures?.CheckedBaggage
                                      ).map((itemKey, index) => {
                                        const item =
                                          brandedFaresDepature[
                                            selectedBrandedFareDepartureIdx
                                          ]?.brandFeatures?.CheckedBaggage[
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
                                                      {item[0] !== undefined &&
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
                                    {brandedFaresReturn !== null &&
                                    brandedFaresReturn !== undefined &&
                                    brandedFaresReturn?.length > 0 ? (
                                      <div
                                        className="d-flex justify-content-end align-items-center gap-1"
                                        style={{
                                          fontSize: "12px",
                                        }}
                                      >
                                        {brandedFaresReturn[
                                          selectedBrandedFareReturnIdx
                                        ]?.brandFeatures?.CheckedBaggage !==
                                          undefined &&
                                          Object.keys(
                                            brandedFaresReturn[
                                              selectedBrandedFareReturnIdx
                                            ]?.brandFeatures?.CheckedBaggage
                                          ).map((itemKey, index) => {
                                            const item =
                                              brandedFaresReturn[
                                                selectedBrandedFareReturnIdx
                                              ]?.brandFeatures?.CheckedBaggage[
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
                                        {direction1.segments[0].baggage[0] !==
                                        undefined ? (
                                          <>
                                            {direction1.segments[0].baggage[0]
                                              ?.amount +
                                              " " +
                                              direction1.segments[0].baggage[0]
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
                id={"about"}
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
                    Refund Charge (As per Airline Policy + Triplover
                    Convenience Fee).
                    <br></br>• Date Change Amount= Date change fee as per
                    Airline + Difference of fare if any + Triplover
                    Convenience Fee.
                  </div>
                </>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FlightDetails;
