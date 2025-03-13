import { useEffect, useState } from "react";
import { BsGlobe } from "react-icons/bs";
import { FaFacebookSquare, FaPhoneSquareAlt } from "react-icons/fa";
import { TbMailOpened } from "react-icons/tb";
import {
  CheckInTimeFormatter,
  DateFormatterWithMonth,
  formatAmount,
  ISODateFormatterTicketView,
  timeFormatter,
} from "../../common/functions";
import "./viewticket.css";
import usbanglalogo from "../../images/pdfimg/usbanglalogo.png";
import warning from "../../images/pdfimg/warning.png";
import pdfFooter from "../../images/pdfimg/pdfFooter.png";
const OriginalPdfBS = ({ totalResponse, originalPDFFareData }) => {
  const { ticketInfo, passengerInfo, segments, fareBreakdown } = totalResponse;
  const originalPDFFareRules = originalPDFFareData?.fareRules;
  const originalPDFFareBaggage = originalPDFFareData?.baggageFareDetail || [];
  const taxBreakdown = originalPDFFareData?.taxInfo;
  const [baggageInfo, setBaggageInfo] = useState([]);

  const [totalBaseFare, setTotalBaseFare] = useState(0);
  const [totalTax, setTotalTax] = useState(0);

  // font load
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    return () => {
      document.head.removeChild(fontLink);
    };
  }, []);

  const checkIsDomestic = (origin, destination) => {
    const bangladeshAirports = [
      "DAC",
      "CGP",
      "ZYL",
      "SPD",
      "JSR",
      "RJH",
      "CXB",
      "BZL",
      "IRD",
    ];

    return (
      bangladeshAirports.includes(origin) &&
      bangladeshAirports.includes(destination)
    );
  };

  const getPassengerType = (input) => {
    if (input === "ADT") return "Adult(s)";
    else if (input === "CHD") return "Child(ren)";
    else if (input === "CNN") return "Child(ren)";
    else if (input === "INF") return "Infant(s)";
    else return "Adult(s)";
  };

  const calculationTotal = () => {
    var baseFare = 0;
    var tax = 0;

    var totalADT = 0;
    var totalINF = 0;
    var totalCHD = 0;
    var totalCNN = 0;

    passengerInfo?.forEach((passenger) => {
      switch (passenger?.passengerType) {
        case "ADT":
          totalADT++;
          break;
        case "INF":
          totalINF++;
          break;
        case "CHD":
          totalCHD++;
          break;
        case "CNN":
          totalCNN++;
          break;
        default:
          break;
      }
    });

    fareBreakdown?.forEach((item) => {
      switch (item?.passengerType) {
        case "ADT":
          baseFare += item?.basePrice * totalADT || 0;
          tax += item?.tax * totalADT || 0;
          break;
        case "INF":
          baseFare += item?.basePrice * totalINF || 0;
          tax += item?.tax * totalINF || 0;
          break;
        case "CHD":
          baseFare += item?.basePrice * totalCHD || 0;
          tax += item?.tax * totalCHD || 0;
          break;
        case "CNN":
          baseFare += item?.basePrice * totalCNN || 0;
          tax += item?.tax * totalCNN || 0;
          break;
        default:
          break;
      }
    });

    setTotalBaseFare(baseFare);
    setTotalTax(tax);
  };

  const totalSum = (passengers) => {
    let total = 0;

    for (let i = 0; i < passengers.length; i++) {
      total += passengers[i]?.totalFare || 0;
    }

    return formatAmount(total);
  };

  const groupSegmentsByTripSegment = () => {
    if (!originalPDFFareBaggage?.segmentDetails) {
      return;
    }

    const groupedSegments = [];

    originalPDFFareBaggage.segmentDetails.forEach((segment) => {
      const { tripSegment, baggageDetails } = segment;

      let existingSegment = groupedSegments.find(
        (s) => s.segment === tripSegment
      );

      if (!existingSegment) {
        existingSegment = { segment: tripSegment, fares: [] };
        groupedSegments.push(existingSegment);
      }

      baggageDetails.forEach((detail) => {
        const { passengerType } = detail;

        let passengerGroup = existingSegment.fares.find(
          (fareGroup) => fareGroup.passengerType === passengerType
        );

        if (!passengerGroup) {
          passengerGroup = { passengerType, passengers: [] };
          existingSegment.fares.push(passengerGroup);
        }

        passengerGroup.passengers.push(detail);
      });
    });

    setBaggageInfo(groupedSegments);
  };

  useEffect(() => {
    calculationTotal();
    if (originalPDFFareBaggage.segmentDetails) {
      groupSegmentsByTripSegment();
    }
  }, [totalResponse, originalPDFFareBaggage]);

  const [grandTotal, setGrandTotal] = useState({});

  useEffect(() => {
    let grandTotalBaseFare = 0;
    let totalTaxAndServiceCharge = 0;

    originalPDFFareBaggage?.segmentDetails?.forEach((segment) => {
      segment.baggageDetails.forEach((detail) => {
        grandTotalBaseFare += detail.baseFare;
        totalTaxAndServiceCharge += detail.taxAndServiceCharge;
      });
    });

    setGrandTotal({
      grandTotalBaseFare,
      totalTaxAndServiceCharge,
    });
  }, [originalPDFFareBaggage]);

  const Title = ({ title }) => (
    <p
      style={{
        marginTop: "12px",
        marginBottom: "12px",
        fontSize: "11.25pt",
        fontWeight: "700",
        color: "#042359",
        display: "inline-block",
        borderBottom: "1px solid #042359",
        fontFamily: "Arial",
        lineHeight: "9pt",
      }}
    >
      {title}
    </p>
  );

  const TravelItinerary = () => (
    <div className="break-avoid">
      <Title title="Travel Itinerary" />
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontSize: "8.25pt",
          fontFamily: "Arial",
        }}
      >
        <thead>
          <tr
            style={{
              borderTop: "none",
              border: "1px solid #000000",
              fontWeight: 400,
              backgroundColor: "#f0f0f0",
            }}
          >
            <th
              style={{
                paddingLeft: "7px",
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "left",
                fontWeight: 400,
              }}
            >
              Flight
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              <span style={{ whiteSpace: "nowrap" }}>Check-in</span>
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              From
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              To
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Departure
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Arrival
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Terminal
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Cabin
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Status
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Fleet Info
            </th>
          </tr>
        </thead>
        <tbody style={{ border: "1px solid #000", borderTop: 0 }}>
          {segments?.map((sub, index) => (
            <tr
              key={index}
              style={{
                fontSize: "7.5pt",
                borderTop: index === 0 ? "none" : "1px solid #000",
              }}
            >
              <td
                style={{
                  paddingRight: "7px",
                  paddingLeft: "7px",
                  textAlign: "left",
                  fontSize: "11.25pt",
                  fontWeight: 500,
                }}
              >
                BS{sub?.flightNumber}
              </td>
              <td
                style={{
                  paddingRight: "7px",
                  paddingLeft: "7px",
                  textAlign: "center",
                }}
              >
                {CheckInTimeFormatter(
                  sub?.departure,
                  checkIsDomestic(sub?.origin, sub?.destination)
                    ? "1:00"
                    : "3:0"
                )}
              </td>
              <td
                style={{
                  paddingRight: "7px",
                  paddingLeft: "7px",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: 600 }}>{sub?.originCity}</span> (
                {sub?.origin})
              </td>
              <td
                style={{
                  paddingRight: "7px",
                  paddingLeft: "7px",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: 600 }}>{sub?.destinationCity}</span>{" "}
                ({sub?.destination})
              </td>
              <td
                style={{
                  paddingRight: "7px",
                  paddingLeft: "7px",
                  textAlign: "center",
                  fontSize: "9.75pt",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ whiteSpace: "nowrap", fontWeight: 400 }}>
                    {DateFormatterWithMonth(sub?.departure)}
                  </span>
                  <span>{timeFormatter(sub?.departure)}</span>
                </div>
              </td>
              <td
                style={{
                  paddingRight: "7px",
                  paddingLeft: "7px",
                  textAlign: "center",
                  fontSize: "9.75pt",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ whiteSpace: "nowrap", fontWeight: 400 }}>
                    {DateFormatterWithMonth(sub?.arrival)}
                  </span>
                  <span>{timeFormatter(sub?.arrival)}</span>
                </div>
              </td>
              <td
                style={{
                  paddingRight: "7px",
                  paddingLeft: "7px",
                  textAlign: "center",
                }}
              >
                {sub?.originTerminal}
              </td>
              <td
                style={{
                  paddingRight: "7px",
                  paddingLeft: "7px",
                  textAlign: "center",
                  fontSize: "9.75pt",
                }}
              >
                {sub?.cabinClass}
              </td>
              <td
                style={{
                  paddingRight: "7px",
                  paddingLeft: "7px",
                  textAlign: "center",
                }}
              >
                OK
              </td>
              <td
                style={{
                  paddingRight: "7px",
                  paddingLeft: "7px",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ whiteSpace: "nowrap" }}>{sub?.equipment}</span>
                  <span>Non-stop</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const BaggageAndFareDetails = () => (
    <div className="break-avoid">
      <Title title="Baggage and Fare Details" />
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontSize: "8.25pt",
          fontFamily: "Arial",
        }}
      >
        <thead>
          <tr
            style={{
              borderTop: "none",
              border: "1px solid #000000",
              fontWeight: 400,
              backgroundColor: "#f0f0f0",
            }}
          >
            <th
              style={{
                paddingLeft: "7px",
                fontWeight: 400,
                paddingBottom: "5px",
                paddingTop: "5px",
                whiteSpace: "nowrap",
              }}
            >
              Trip segment
            </th>
            <th
              style={{
                fontWeight: 400,
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Pax. type
            </th>
            <th
              style={{
                fontWeight: 400,
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Pax. name
            </th>
            <th
              style={{
                fontWeight: 400,
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Bag.allowance
            </th>
            <th
              style={{
                fontWeight: 400,
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Fare code
            </th>
            <th
              style={{
                fontWeight: 400,
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Curr.
            </th>
            <th
              style={{
                fontWeight: 400,
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Base fare
            </th>
            <th
              style={{
                fontWeight: 400,
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Tax & s/c
            </th>
            <th
              style={{
                fontWeight: 400,
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Tkt. fare
            </th>
            <th
              style={{
                fontWeight: 400,
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Total fare
            </th>
          </tr>
        </thead>
        <tbody style={{ border: "1px solid #000", borderTop: 0 }}>
          {baggageInfo?.map((sub, index) =>
            sub?.fares?.map((fare, i) =>
              fare?.passengers?.map((item, k) => (
                <tr
                  key={`${index}-${i}`}
                  style={{
                    fontSize: "6.75pt",
                  }}
                >
                  {k === 0 && i === 0 && (
                    <td
                      rowSpan={passengerInfo?.length}
                      style={{
                        textAlign: "center",
                        fontSize: "7.5pt",
                        borderBottom:
                          index + 1 <= segments?.length - 1
                            ? "1px solid #000"
                            : "none",
                      }}
                    >
                      {sub?.segment}
                    </td>
                  )}
                  {k == 0 && (
                    <td
                      rowSpan={fare?.passengers?.length}
                      style={{
                        paddingRight: "7px",
                        paddingLeft: "7px",
                        textAlign: "center",
                        borderRight: "1px dashed #000",
                        borderLeft: "1px dashed #000",
                        borderBottom:
                          i + 1 <= sub?.fares?.length - 1 ||
                          index + 1 <= segments?.length - 1
                            ? "1px solid #000"
                            : "none",
                      }}
                    >
                      {getPassengerType(fare?.passengerType) || "N/A"}
                    </td>
                  )}
                  <td
                    style={{
                      paddingRight: "7px",
                      paddingLeft: "7px",
                      textAlign: "left",
                      borderRight: "1px dashed #000",
                      fontSize: "6.75pt",
                      borderBottom:
                        i + 1 <= sub?.fares?.length - 1 ||
                        index + 1 <= segments?.length - 1 ||
                        k + 1 < fare?.passengers?.length
                          ? "1px solid #000"
                          : "none",
                    }}
                  >
                    {item?.passengerName || "N/A"}
                  </td>
                  <td
                    style={{
                      paddingRight: "7px",
                      paddingLeft: "7px",
                      textAlign: "center",
                      fontWeight: 700,
                      borderRight: "1px dashed #000",
                      borderBottom:
                        i + 1 <= sub?.fares?.length - 1 ||
                        index + 1 <= segments?.length - 1 ||
                        k + 1 < fare?.passengers?.length
                          ? "1px solid #000"
                          : "none",
                    }}
                  >
                    {item?.baggageAllowance}
                  </td>
                  {k === 0 && i === 0 && (
                    <td
                      rowSpan={passengerInfo?.length}
                      style={{
                        textAlign: "center",
                        borderRight: "1px dashed #000",
                        borderBottom:
                          index + 1 <= segments?.length - 1
                            ? "1px solid #000"
                            : "none",
                      }}
                    >
                      {item?.fareCode || "N/A"}
                    </td>
                  )}

                  {k === 0 && (
                    <td
                      rowSpan={fare?.passengers?.length}
                      style={{
                        paddingRight: "7px",
                        paddingLeft: "7px",
                        textAlign: "center",
                        borderRight: "1px dashed #000",
                        borderBottom:
                          i + 1 <= sub?.fares?.length - 1 ||
                          index + 1 <= segments?.length - 1
                            ? "1px solid #000"
                            : "none",
                      }}
                    >
                      AED
                    </td>
                  )}
                  <td
                    style={{
                      paddingRight: "7px",
                      paddingLeft: "7px",
                      textAlign: "center",
                      borderRight: "1px dashed #000",
                      borderBottom:
                        i + 1 <= sub?.fares?.length - 1 ||
                        index + 1 <= segments?.length - 1 ||
                        k + 1 < fare?.passengers?.length
                          ? "1px solid #000"
                          : "none",
                    }}
                  >
                    {formatAmount(item?.baseFare ?? 0) || "N/A"}
                  </td>
                  <td
                    style={{
                      paddingRight: "7px",
                      paddingLeft: "7px",
                      textAlign: "center",
                      borderRight: "1px dashed #000",
                      borderBottom:
                        i + 1 <= sub?.fares?.length - 1 ||
                        index + 1 <= segments.length - 1 ||
                        k + 1 < fare?.passengers?.length
                          ? "1px solid #000"
                          : "none",
                    }}
                  >
                    {formatAmount(item?.taxAndServiceCharge ?? 0) || "N/A"}
                  </td>
                  <td
                    style={{
                      paddingRight: "7px",
                      paddingLeft: "7px",
                      textAlign: "center",
                      borderRight: "1px dashed #000",
                      borderBottom:
                        i + 1 <= sub?.fares?.length - 1 ||
                        index + 1 <= segments.length - 1 ||
                        k + 1 < fare?.passengers?.length
                          ? "1px solid #000"
                          : "none",
                    }}
                  >
                    {formatAmount(item?.ticketFare ?? 0) || "N/A"}
                  </td>
                  {k === 0 && (
                    <td
                      rowSpan={fare?.passengers?.length}
                      style={{
                        paddingRight: "7px",
                        paddingLeft: "7px",
                        textAlign: "center",
                        borderRight: "1px dashed #000",
                        borderBottom:
                          i + 1 <= sub?.fares?.length - 1 ||
                          index + 1 <= segments.length - 1
                            ? "1px solid #000"
                            : "none",
                      }}
                    >
                      {totalSum(fare?.passengers)}
                    </td>
                  )}
                </tr>
              ))
            )
          )}
          <tr style={{ borderTop: "1px solid #000" }}>
            <td
              // colSpan={9}
              colSpan={9}
              style={{
                textAlign: "right",
                paddingRight: "10px",
                borderRight: "1px dashed #000",
                fontSize: "9pt",
                paddingTop: "3px",
                paddingBottom: "3px",
              }}
            >
              Total amount
            </td>
            <td
              style={{ textAlign: "center", fontSize: "9pt", fontWeight: 400 }}
            >
              {formatAmount(originalPDFFareBaggage?.totalAmount)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const FareRules = () => (
    <div className="break-avoid">
      <Title title="Fare Rules" />
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontSize: "8.25pt",
          fontFamily: "Arial",
        }}
      >
        <thead>
          <tr
            style={{
              borderTop: "none",
              border: "1px solid #000000",
              fontWeight: 400,
              backgroundColor: "#f0f0f0",
              fontSize: "8.25pt",
            }}
          >
            <th
              style={{
                paddingLeft: "20px",
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "left",
                fontWeight: 400,
              }}
            >
              Trip segment
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Fare validity{" "}
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Change fees **{" "}
            </th>
            <th
              style={{
                paddingBottom: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Refund fees **
            </th>
          </tr>
        </thead>
        <tbody style={{ border: "1px solid #000", borderTop: 0 }}>
          {originalPDFFareRules?.map((sub, index) => (
            <tr
              key={index}
              style={{
                fontSize: "6pt",
                borderBottom: "1px solid #000",
              }}
            >
              <td
                style={{
                  paddingLeft: "20px",
                  textAlign: "left",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                  fontSize: "9px",
                }}
              >
                {sub?.tripSegment}
              </td>
              <td
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #000",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                  padding: "3px",
                }}
              >
                <div className="flex flex-col">
                  {sub?.fareValidity?.map((fare, i) => (
                    <div key={i}>{fare}</div>
                  ))}
                </div>{" "}
              </td>
              <td
                style={{
                  textAlign: "center",
                  borderRight: "1px solid #000",
                  borderLeft: "1px solid #000",
                  padding: "3px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {sub?.refundFees?.map((fare, i) => (
                    <span key={i}>{fare}</span>
                  ))}
                </div>
              </td>
              <td
                style={{
                  textAlign: "center",
                  borderRight: "1px solid #000",
                  borderLeft: "1px solid #000",
                  padding: "3px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {sub?.refundFees?.map((fare, i) => (
                    <span key={i}>{fare}</span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          gap: "4px",
          paddingTop: "4px",
          fontSize: "6.75pt",
          fontFamily: "Arial",
        }}
      >
        <span style={{ fontWeight: "600", whiteSpace: "nowrap" }}>
          Endorsement :{" "}
        </span>
        <span>
          Non Endorsable / Non Re-Routable / Valid on BS only / In case of
          partial refund (other than Non-Refundable tickets), same or immediate
          higher PRBD&apos;s <br />
          One Way fare plus REFUND charge will be applicable. Any kind of EMI
          converted ticket amount is Non Refundable.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: "16px",
          fontSize: "9pt",
          fontFamily: "Arial",
        }}
      >
        <span>(*) Please note this is a total amount for all passengers.</span>
        <span>
          (**) In the case of modification of several trips, the highest penalty
          on all trips will be applied
          {totalResponse?.ticketInfo?.journeyType !== "One Way" && (
            <>
              <br />
              <span className="ml-5">
                Please note that if you do not show up for your outbound flight,
                your return flight will be canceled
              </span>
            </>
          )}
        </span>
      </div>
    </div>
  );

  const PaymentReceipt = () => (
    <div className="break-avoid">
      <Title title="Payment Receipt" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            gridColumn: "span 1",
            padding: "1.25rem 0 1.25rem 1.25rem",
            border: "1px solid #CBCBCB",
            display: "flex",
            flexDirection: "column",
            fontSize: "8.25pt",
          }}
        >
          <div style={{ display: "grid", rowGap: "5px", fontSize: "8.25pt" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 20px 1fr",
              }}
            >
              <div style={{ fontWeight: 600 }}>Payment mode</div>
              <div style={{ textAlign: "center" }}>:</div>
              <div>In account</div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 20px 1fr",
              }}
            >
              <div style={{ fontWeight: 600 }}>Date of issue</div>
              <div style={{ textAlign: "center" }}>:</div>
              <div>
                {ticketInfo?.issueDate
                  ? ISODateFormatterTicketView(ticketInfo?.issueDate) + " LT"
                  : "N/A"}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 20px 1fr",
              }}
            >
              <div style={{ fontWeight: 600 }}>Place of issue</div>
              <div style={{ textAlign: "center" }}>:</div>
              <div>Triplover Limited</div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 20px 1fr",
              }}
            >
              <div style={{ fontWeight: 600 }}>Ticket issued by</div>
              <div style={{ textAlign: "center" }}>:</div>
              <div></div>
            </div>
          </div>
        </div>
        <div
          style={{
            gridColumn: "span 2",
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            padding: "1.25rem",
            border: "1px solid #CBCBCB",
            borderLeft: 0,
            position: "relative",
          }}
        >
          <div
            style={{
              gridColumn: "span 5",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                }}
              >
                <div style={{ fontWeight: 600 }}>Base fare total amount</div>
                <div>{formatAmount(grandTotal?.grandTotalBaseFare)} AED</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  Tax & surcharges total fees
                </div>
                <div>
                  {formatAmount(grandTotal?.totalTaxAndServiceCharge)} AED
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "330px",
                }}
              >
                <div
                  style={{
                    fontSize: "6.1875pt",
                    lineHeight: "8pt",
                    color: "rgb(87 88 91)",
                  }}
                >
                  {taxBreakdown &&
                    Object.entries(taxBreakdown).map(([key, value], index) => (
                      <span key={index}>
                        {key}: {value}; &nbsp;
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "9.75pt",
                    lineHeight: "18pt",
                  }}
                >
                  Total ticket fare amount
                </p>
                <p style={{ fontWeight: 800, fontSize: "12pt" }}>
                  {formatAmount(originalPDFFareBaggage?.totalAmount)} AED
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "8.25pt",
                }}
              >
                <div style={{ fontWeight: 600 }}>Other fees*</div>
                <div>0 AED</div>
              </div>
            </div>
            <div style={{ fontSize: "8.25pt", paddingBottom: "20px" }}>
              * not included in the total ticket fare amount
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "18px",
              height: "18px",
              background: "linear-gradient(135deg, #808080 50%, #000000 50%)",
            }}
          />
        </div>
      </div>
    </div>
  );

  const TravelerInfo = () => (
    <table
      className="break-avoid"
      style={{
        borderCollapse: "collapse",
        width: "100%",
        fontSize: "7.5px",
      }}
    >
      <tbody style={{ border: "1px solid #CBCBCB" }}>
        <tr style={{ border: "1px solid #CBCBCB", borderBottom: 0 }}>
          <td colSpan={6}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                padding: "0 20px",
              }}
            >
              <img
                src={usbanglalogo}
                alt="US Bangla Logo"
                style={{ paddingBottom: "20px" }}
                width={277}
                height={66.24}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "9pt",
                }}
              >
                <span
                  style={{
                    fontSize: "24pt",
                    fontWeight: "600",
                    color: "#0073bb",
                    fontFamily: "'Calibri', 'Arial', sans-serif",
                    lineHeight: "24pt",
                  }}
                >
                  e-ticket
                </span>
                <span
                  style={{
                    fontSize: "6.75pt",
                    color: "#000000",
                    fontFamily: "Arial",
                  }}
                >
                  Booking reference #
                  <span
                    style={{
                      fontSize: "22.5pt",
                      fontWeight: "700",
                      color: "#000000",
                      paddingLeft: "3px",
                      lineHeight: "24pt",
                    }}
                  >
                    {totalResponse?.ticketInfo?.pnr}
                  </span>
                </span>
              </div>
            </div>
          </td>
        </tr>

        <tr
          style={{
            border: "1px solid #CBCBCB",
            fontSize: "7.5pt",
            fontFamily: "Arial",
          }}
        >
          <th
            style={{
              paddingRight: "20px",
              paddingLeft: "20px",
              paddingBottom: "5px",
              paddingTop: "5px",
              textAlign: "left",
              fontWeight: 400,
            }}
          >
            Passenger Name
          </th>
          <th
            style={{
              paddingRight: "20px",
              paddingLeft: "20px",
              paddingBottom: "5px",
              paddingTop: "5px",
              textAlign: "center",
              fontWeight: 400,
            }}
          >
            Ticket Number
          </th>
          <th
            style={{
              paddingRight: "20px",
              paddingLeft: "20px",
              paddingBottom: "5px",
              paddingTop: "5px",
              textAlign: "center",
              fontWeight: 400,
            }}
          >
            SSR Code / Passenger Info
          </th>
          <th
            style={{
              paddingRight: "20px",
              paddingLeft: "20px",
              paddingBottom: "5px",
              paddingTop: "5px",
              textAlign: "center",
              fontWeight: 400,
            }}
          >
            Pax. type
          </th>
          <th
            style={{
              paddingRight: "20px",
              paddingLeft: "20px",
              paddingBottom: "5px",
              paddingTop: "5px",
              textAlign: "center",
              fontWeight: 400,
            }}
          >
            Contact
          </th>
          <th
            style={{
              paddingRight: "20px",
              paddingLeft: "20px",
              paddingBottom: "5px",
              paddingTop: "5px",
              textAlign: "right",
              fontWeight: 400,
            }}
          >
            Passport Number
          </th>
        </tr>
        {passengerInfo?.map((passenger, index) => (
          <tr
            key={index}
            style={{
              fontSize: "7.5pt",
              fontFamily: "Arial",
            }}
          >
            <td
              style={{
                paddingBottom: "1.5px",
                paddingTop: "1.5px",
                paddingLeft: "20px",
                fontSize: "8.25pt",
              }}
            >
              {passenger.fullName}
            </td>
            <td
              style={{
                textAlign: "center",
                color: "#000000",
                fontWeight: "300",
                fontFamily: "'Calibri', 'Arial', sans-serif",
              }}
            >
              {passenger.ticketNumbers}
            </td>
            <td
              style={{
                textAlign: "center",
              }}
            >
              {/* {row.ssrCode} */}
            </td>
            <td
              style={{
                textAlign: "center",
              }}
            >
              {getPassengerType(passenger?.passengerType)}
            </td>
            <td
              style={{
                textAlign: "center",
              }}
            >
              {passenger.phone}
            </td>
            <td
              style={{
                textAlign: "center",
              }}
            >
              {passenger.documentNumber}
            </td>
          </tr>
        ))}

        <tr style={{ border: "1px solid #CBCBCB", borderBottom: 0 }}>
          <td colSpan={6}>
            <div
              className="break-avoid"
              style={{
                padding: "5px 20px",
                background: "linear-gradient(to top, #e2e2e2, #fff)",
                fontSize: "8.25pt",
                display: "flex",
                flexDirection: "column",
                gap: "1px",
                fontFamily: "Arial",
              }}
            >
              <span style={{ fontWeight: 600 }}> Travel Note: </span>
              <span>
                - Check­in counter will open before 1.30 hours of domestic and 3
                hours of international flight departure.
              </span>
              <span>
                - Passenger reporting late for check­in may be refused to board
                on flight. Please bring a valid photo ID.
              </span>
              <span>
                - Check­in counter will be closed before 30 minutes of domestic
                and 60 minutes of international flight departure.
              </span>
              <span>
                - Check­in Bag (if applicable) allowance maximum two pieces
                within free baggage limit. Hand carry bag weight is maximum 7
                Kg.
              </span>
              <span>
                - Boarding gate will be closed before 20 minutes of domestic and
                30 minutes of international flight departure.
              </span>
              <span>
                - After taking a boarding pass, if the passenger fails to report
                at the boarding gate without any valid reason,
              </span>
              <span style={{ paddingLeft: "4px" }}>
                their tickets will be treated as nonrefundable & non­changeable.
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );

  const TermsAndConditions = () => (
    <div
      style={{
        width: "98.3%",
        minHeight: "1065px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Roboto",
        lineHeight: "10px",
      }}
      className="break-avoid page-break"
    >
      <div>
        <h5
          style={{
            fontSize: "17.2848pt",
            padding: "0px",
            margin: "0px 0px 5px 0px",
            textAlign: "center",
            color: "#58595b",
            fontWeight: "500",
            paddingTop: "6px",
            paddingBottom: "5px",
          }}
        >
          Terms and Conditions
        </h5>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "7pt",
            color: "#58595b",
            textAlign: "center",
          }}
        >
          <thead>
            <tr>
              <th
                rowSpan="2"
                style={{
                  border: "1px solid #757679",
                  backgroundColor: "#f0f0f0",
                  fontWeight: "normal",
                  color: "#757679",
                }}
              >
                Flight Type
              </th>
              <th
                colSpan={2}
                style={{
                  borderTop: "1px solid #757679",
                  borderRight: "1px solid #757679",
                  borderBottom: "1px solid #757679",
                  backgroundColor: "#f0f0f0",
                  fontWeight: "normal",
                  color: "#757679",
                }}
              >
                Check-In Counter
              </th>
            </tr>
            <tr>
              <th
                style={{
                  borderRight: "1px solid #757679",
                  fontWeight: "normal",
                  color: "#757679",
                  borderBottom: "1px solid #757679",
                }}
              >
                Open
              </th>
              <th
                style={{
                  color: "#757679",
                  fontWeight: "normal",
                  borderRight: "1px solid #757679",
                  borderBottom: "1px solid #757679",
                }}
              >
                Close
              </th>
            </tr>
          </thead>
          <tbody style={{ border: "1px solid #757679", borderTop: "0px" }}>
            <tr>
              <td
                style={{
                  borderRight: "1px solid #757679",
                  borderTop: "0px",
                  borderBottom: "1px solid #757679",
                }}
              >
                International
              </td>
              <td
                style={{
                  borderRight: "1px solid #757679",
                  borderTop: "0px",
                  borderBottom: "1px solid #757679",
                }}
              >
                3 Hours Before Departure (STD)
              </td>
              <td
                style={{
                  borderTop: "0px",
                  borderBottom: "1px solid #757679",
                }}
              >
                60 Minutes Before Departure (STD)
              </td>
            </tr>
            <tr style={{ border: "1px solid #757679", borderTop: "0px" }}>
              <td style={{ borderRight: "1px solid #757679" }}>Domestic</td>
              <td style={{ borderRight: "1px solid #757679" }}>
                1 Hour Before Departure (STD)
              </td>
              <td>30 Minutes Before Departure (STD)</td>
            </tr>
          </tbody>
        </table>
        <p
          style={{
            textAlign: "right",
            padding: "0px 0px 5px 0px",
            margin: "0px",
            fontSize: "6pt",
            color: "#58595b",
          }}
        >
          STD: Standard time of Depature
        </p>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "6pt",
            fontWeight: "normal",
            color: "#58595b",
            textAlign: "center",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #757679",
                  fontWeight: "normal",
                  backgroundColor: "#f0f0f0",
                  color: "#58595b",
                }}
                rowSpan="5"
              >
                Dimensions and Weights of Baggage on all ticket classes
              </th>
              <th
                style={{
                  borderTop: "1px solid #757679",
                  borderRight: "1px solid #757679",
                  borderBottom: "1px solid #757679",
                  fontWeight: "normal",
                  backgroundColor: "#F2F2F2",
                  color: "#58595b",
                }}
                rowSpan="4"
              >
                Cabin Bag
              </th>
            </tr>
            <tr>
              <th
                style={{
                  borderTop: "1px solid #757679",
                  fontWeight: "normal",
                  backgroundColor: "#F2F2F2",
                  color: "#58595b",
                }}
              >
                Boeing 737-800
              </th>
              <th
                style={{
                  border: "1px solid #757679",
                  borderBottom: "none",
                  fontWeight: "normal",
                }}
              >
                The sum of all dimensions (L+B+H) must not exit 115 cm or 46
                inches/ Max weight 7 kgs
              </th>
            </tr>
            <tr>
              <th
                style={{
                  borderTop: "1px solid #757679",
                  fontWeight: "normal",
                  backgroundColor: "#F2F2F2",
                  color: "#58595b",
                }}
              >
                Dash8-Q400
              </th>
              <th
                style={{
                  border: "1px solid #757679",
                  borderBottom: "none",
                  fontWeight: "normal",
                }}
              >
                The sum of all dimensions (L+B+H) must not exit 72 cm or 28
                inches/ Max weight 7 kgs
              </th>
            </tr>
            <tr>
              <th
                style={{
                  borderTop: "1px solid #757679",
                  borderBottom: "1px solid #757679",
                  fontWeight: "normal",
                  backgroundColor: "#F2F2F2",
                  color: "#58595b",
                }}
              >
                ATR 72-600
              </th>
              <th
                style={{
                  border: "1px solid #757679",
                  fontWeight: "normal",
                }}
              >
                The sum of all dimensions (L+B+H) must not exit 72 cm or 28
                inches/ Max weight 7 kgs
              </th>
            </tr>
            <tr>
              <th
                style={{
                  borderRight: "1px solid #757679",
                  borderBottom: "1px solid #757679",
                  fontWeight: "normal",
                  backgroundColor: "#F2F2F2",
                  color: "#58595b",
                }}
              >
                Check-in Bag
              </th>
              <th
                style={{
                  borderBottom: "1px solid #757679",
                  fontWeight: "normal",
                  backgroundColor: "#F2F2F2",
                  color: "#58595b",
                }}
              >
                All Fleets
              </th>
              <th
                style={{
                  border: "1px solid #757679",
                  borderTop: "none",
                  fontWeight: "normal",
                }}
              >
                The sum of all dimensions (L+B+H) must not exit 158 cm or 62
                inches/ Max weight 30 kgs
              </th>
            </tr>
          </thead>
        </table>

        <div style={{ width: "100%", paddingTop: "5px" }}>
          <div style={{ width: "49%", float: "left", color: "#939598" }}>
            <div
              style={{
                paddingRight: "0px",
                fontSize: "5.8pt",
              }}
            >
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span style={{ color: "#231f20" }}>1. </span>
                As used in this contract ‘ticket’ means this passenger ticket
                and baggage checks, or the itinerary/receipt if applicable, in
                the case of an electronic ticket, of which these conditions and
                the notices form part, “carriage” is equivalent to
                ‘transportation’, ‘carrier’ means all air carriers that carry or
                undertake to carry you or your baggage under this ticket or
                perform any other service incidental to such air carriage,
                ‘electronic ticket’ means the Itinerary/Receipt issued by or on
                behalf of Carrier, the Electronic Coupons and, if applicable, a
                boarding document ‘We’ or ‘us’ means US-BANGLA AIRLINES. If your
                journey involves an ultimate destination or stop in a country
                other than the country of departure, international treaties,
                known as the Warsaw Convention and the Montreal Convention, may
                be applicable.
                <br /> <br />
                ‘Warsaw Convention’ means the Convention for the Unification of
                certain Rules Relating to international carriage by Air signed
                at Warsaw. 12th October 1929, or that convention as amended at
                The Hague, 28th September 1955, whichever may be applicable.
                These conventions govern and, in some cases, limit the liability
                of carriers
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span style={{ color: "#231f20" }}>2. </span>
                Baggage that has been checked during boarding will be delivered
                to the bearer of the baggage check. If your baggage is damaged
                or lost, you must report in writing to us immediately on
                arrival. No complaints will be deemed valid otherwise.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span style={{ color: "#231f20" }}>3. </span>
                This ticket is good for carriage for 90 days/mentioned for
                domestic travels and for international travels 180
                days/mentioned in the ticket from the date of issue, in
                carrier’s tariffs conditions of carriage, or related
                regulations. The fare for carriage hereunder is subject to
                change prior to commencement of carriage. Carrier may refuse
                transportation if the applicable fare has not been paid.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span style={{ color: "#231f20" }}>4. </span>
                We undertake to ensure our best effort to carry you and your
                baggage with reasonable dispatch. Times shown in timetables or
                elsewhere are not guaranteed and form no part of this contract.
                We may without notice substitute alternate carriers or aircraft,
                and may alter or omit stopping places shown on the ticket in
                case of necessity. Schedules are subject to change without any
                prior notice.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span style={{ color: "#231f20" }}>5. </span>
                You are solely responsible for complying with all government
                travel requirements to undertake such transportation. You shall
                arrive at the airport by the time fixed by us (check-in counter
                will be closed 15 minutes before domestic flight departure and
                60 minutes before international flight departure) to complete
                departure formalities. We would deny to aboard you if you fail
                to report/ finish check-in within the time mentioned above.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span style={{ color: "#231f20" }}>6. </span>
                None of our agents, employees or representatives, has the
                authority to alter, modify or waive any provision contained on
                the ticket and the conditions of this Contract of Carriage.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span style={{ color: "#231f20" }}>7. </span>
                Liability for loss, delay or damage to baggage is strictly
                limited for domestic journey unless a higher value is declared
                in advance and additional charges are paid, the applicable
                liability limit is USD 20.00 per Kg for International and AED
                1000.00 per kg for domestic only for checked baggage. We shall
                not be liable for any baggage which is improperly or
                inadequately packed. We assume no liability for fragile,
                valuable or perishable articles.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span
                  style={{
                    color: "#231f20",
                    display: "block",
                    fontWeight: "400",
                  }}
                >
                  8. CABIN BAGGAGE ALLOWANCE
                </span>
                Your cabin baggage may be weighed and measured and if necessary,
                charged for in accordance with valid tariffs. You may carry on
                board the articles listed below free of charge over and above
                your free baggage allowance
                <ul
                  style={{
                    marginLeft: "0px",
                    paddingLeft: "13px",
                    marginTop: "0px",
                    marginTop: "0px",
                    listStyleType: "disc",
                  }}
                >
                  <li>
                    A lady’s hand bag, pocket books or purse, which is
                    appropriate to normal travelling Dress and is not being used
                    as a container for the transportation of articles which
                    would otherwise be regarded as baggage
                  </li>
                  <li>An umbrella or walking stick</li>
                  <li>A laptop or notebook computer</li>
                  <li>A small camera</li>
                  <li>
                    A reasonable amount of reading material for the flight
                  </li>
                  <li>
                    Infant’s food for consumption in flight and infants carrying
                    basket
                  </li>
                  <li>
                    A fully collapsible wheelchair and/or a pair of crutches
                    and/or other prosthetic devices for the passenger’s use
                    provided the passenger is dependent upon them will be
                    carried only in the luggage hold
                  </li>
                  <li>No pets allowed</li>
                  <li>
                    nfant’s carrying basket and wheelchairs may be used until
                    boarding the aircraft, then will be stowed in the aircraft
                    hold
                  </li>
                  <li>
                    Infant’s stroller provided the infant is on board the
                    aircraft will go in the luggage hold.
                  </li>
                </ul>
              </p>
            </div>
          </div>
          <div style={{ width: "49%", float: "right", color: "#939598" }}>
            <div style={{ paddingLeft: "0px", fontSize: "5.8pt" }}>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span
                  style={{
                    color: "#231f20",
                    display: "block",
                    fontWeight: "400",
                  }}
                >
                  9. GENERAL INFORMATION
                </span>
                Please remember to lock your baggage to prevent it from falling
                open and to help prevent pilferage of its contents. We are not
                liable for loss, damage to or delay in the delivery of fragile
                or perishable items, money, jewellery, precious metals,
                electronic devices, silverware, negotiable papers, securities
                and other valuables, business documents, passports and other
                identification documents, samples. Medicines or drugs which are
                included in your checked and carry on baggage, whether with or
                without our knowledge.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span
                  style={{
                    color: "#231f20",
                    display: "block",
                    fontWeight: "400",
                    marginTop: 0,
                  }}
                >
                  10. IDENTIFICATION OF PASSENGERS
                </span>
                You may be required to produce appropriate identification at the
                time of check-in. Appropriate photo identification required to
                avail any special discount/ services.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span
                  style={{
                    color: "#231f20",
                    display: "block",
                    fontWeight: "400",
                  }}
                >
                  11. IMPORTANT CHANGE OF ITINERARY
                </span>
                We do not require our passengers to reconfirm their onward or
                return journey on our services unless we advise you otherwise.
                However, please contact your agent or our reservations/
                ticketing office if you wish to change your travel plans.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span
                  style={{
                    color: "#231f20",
                    display: "block",
                    fontWeight: "400",
                  }}
                >
                  12. IMPORTANT NOTICE REGARDING UNAUTHORIZED TICKETS
                </span>
                US-BANGLA AIRLINES will not recognize for purposes of carriage
                any ticket purchased from or resold to any source other than
                US-BANGLA AIRLINES or its authorized travel agents. Passengers
                should carefully examine their tickets, particularly the
                conditions of contract and notices contained therein.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span
                  style={{
                    color: "#231f20",
                    display: "block",
                    fontWeight: "400",
                  }}
                >
                  13. REFUNDS
                </span>
                USBA reserves the right to make a refund only to the person
                named in the ticket or to the person who originally paid for the
                ticket. Refund will not be entertained if any claim done after
                the date of ticket expiry. Ticket issued through any agent must
                be processed refund by the issuing agent only. After check-in
                coupon price shall be fully forfeited and considered as
                &quot;used coupon&quot; which can not be used further
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span
                  style={{
                    color: "#231f20",
                    display: "block",
                    fontWeight: "400",
                  }}
                >
                  14. CREDIT/DEBIT CARD PAYMENT:
                </span>
                Please be aware that for domestic and cross border
                transactions*, you may be charged an additional fee by your
                credit card/debit card issuing bank on top of the total online
                transaction fee. This policy is imposed by certain banks on
                their customers for domestic cross-border transactions and shall
                be reflected in your upcoming credit card/debit card statement
                from your issuing bank. For more information, please contact
                your issuing bank.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  marginBottom: "5px",
                  marginTop: 0,
                }}
              >
                <span
                  style={{
                    color: "#231f20",
                    display: "block",
                    fontWeight: "400",
                  }}
                >
                  15. IMPORTANT LABEL YOUR BAG
                </span>
                For the purpose of easy identification, please label all baggage
                inside and outside with your name and address.
              </p>
              <p style={{ textAlign: "justify" }}>
                <span
                  style={{
                    color: "#231f20",
                    display: "block",
                    fontWeight: "400",
                    marginTop: 0,
                  }}
                >
                  16. RIGHT TO REFUSE CARRIAGE
                </span>
                We may refuse to carry you and/ or your baggage from a flight,
                if this is determined to be necessary or appropriate for safety
                reasons, or for the comfort and convenience of passengers. You
                or any other passenger will also be refused carriage, or removed
                from a flight, if your or their behaviour is such as to threaten
                safety, good order, or discipline on board the aircraft, or to
                cause discomfort, inconvenience, or annoyance to passengers or
                crew members.
              </p>
              <p style={{ textAlign: "justify" }}>
                <span
                  style={{
                    color: "#231f20",
                    display: "block",
                    fontWeight: "400",
                  }}
                >
                  17. NOTICE OF GOVERNMENT IMPOSED TAXES, FEES AND SURCHARGES
                </span>
                The price of this ticket may include taxes, fees and charges
                which are imposed on air transportation by the government,
                concern authorities and the carrier. These taxes, fees and
                charges which may represent as significant portion of the cost
                of air travel, are either included in the fare or shown
                separately in the “TAX” box(es) of this ticket. You may also be
                required to pay taxes, fees and charges which were not collected
                at the time of issuance.
              </p>
              <p style={{ textAlign: "justify" }}>
                <span
                  style={{
                    color: "#231f20",
                    display: "block",
                    fontWeight: "400",
                    marginTop: 0,
                  }}
                >
                  18. WEATHER ADVISORY
                </span>
                At times flights are disrupted due to weather conditions that
                are beyond control. We always try our level best to ensure that
                our customers do not suffer waiting for their flights at the
                airports due to any flight disruption and we try to inform them
                in advance but at times it is not possible to reach customers
                due to last minute constrains. As such we would like to
                recommend to our valued customers to call flight information
                prior to proceeding for the airport.
              </p>
            </div>
          </div>
          <div
            style={{
              padding: "5px 10px",
              height: "188px",
              clear: "both",
              border: "1px solid #757679",
            }}
          >
            <div style={{ width: "50%", float: "left" }}>
              <div style={{ paddingRight: "10px", color: "#939598" }}>
                <p
                  style={{
                    textAlign: "justify",
                    fontSize: "6.8pt",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <span
                    style={{
                      color: "#231f20",
                      display: "block",
                      fontWeight: "400",
                    }}
                  >
                    19.RESTRICTED AND DANGEROUS ARTICLES IN BAGGAGE
                  </span>
                  For safety reasons. dangerous goods as defined in the
                  International Air Transport Association (IATA) Dangerous Goods
                  Regulations such as those listed below shall not be carried
                  as, within or as part of your baggage:
                  <ul
                    style={{
                      padding: 0,
                      margin: 0,
                      paddingLeft: "13px",
                      listStyleType: "disc",
                    }}
                  >
                    <li>
                      Briefcases and attach cases with installed alarm or
                      pyrotechnic devices
                    </li>
                    <li>
                      Explosives, munitions, fireworks, flares, firearms,
                      handguns or any other weapons
                    </li>
                    <li>
                      Gases (flammable, non-flammable and poisonous) such as
                      camping gas
                    </li>
                    <li>Flammable liquids such as lighter or heating fuels</li>
                    <li>
                      Flammable solids, such as matches and articles which are
                      easily ignited, substances liable to spontaneous
                      combustion, substances which emit flammable gases on
                      contact with wate
                    </li>
                    <li>
                      Oxidizing substances (such as bleaching powder and
                      peroxides)
                    </li>
                    <li>
                      Poisonous (toxic) and infectious substances • Radioactive
                      materials
                    </li>
                    <li>
                      Corrosives (such as mercury, acids, alkalis and wet cell
                      batteries)
                    </li>
                    <li>
                      Magnetized materials and miscellaneous dangerous goods as
                      listed in the IATA Dangerous Goods Regulations
                    </li>
                  </ul>
                </p>
              </div>
            </div>
            <div style={{ width: "50%", float: "right", alignItems: "center" }}>
              <div
                style={{
                  paddingLeft: "10px",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "15px",
                }}
              >
                <img src={warning} width="100%" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <img src={pdfFooter} alt="pdffooter" width="100%" height="60px" />
        <p style={{ fontSize: "6.7pt", margin: "0px", textAlign: "justify" }}>
          <span style={{ color: "#ed1d24" }}>SALES OFFICES:</span>
          <span style={{ color: "#0054a6" }}> DHAKA:</span>01777777810-821,
          <span style={{ color: "#0054a6" }}> CHATTOGRAM:</span>{" "}
          01777777822-828,
          <span style={{ color: "#0054a6" }}> COX’S BAZAR:</span>{" "}
          01777777841-842,
          <span style={{ color: "#0054a6" }}> SYLHET:</span> 01777777829-830,
          <span style={{ color: "#0054a6" }}> JASHORE:</span>01777777833-834
          <span style={{ color: "#0054a6" }}> KHULNA:</span> 01777777838-839,
          <span style={{ color: "#0054a6" }}> SAIDPUR:</span> 01777777844-845,
          <span style={{ color: "#0054a6" }}> RANGPUR:</span> 01777777847,
          <span style={{ color: "#0054a6" }}> RAJSHAHI:</span> 01777777850-851,
          <span style={{ color: "#0054a6" }}> BARISHAL:</span>01777777848-849
        </p>
        <p
          style={{
            textAlign: "center",
            fontSize: "8px",
            position: "flex",
            justifyContent: "space-around",
            justifyItems: "center",
            alignItems: "center",
            flexDirection: "row",
            margin: "10px 0px 0px 0px",
          }}
        >
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TbMailOpened
              style={{ fontSize: "10px", fontWeight: "bold", color: "#0054a6" }}
            />
            &nbsp; reservation@usbair.com &nbsp;&nbsp;
            <FaPhoneSquareAlt
              style={{ fontSize: "10px", fontWeight: "bold", color: "#0054a6" }}
            />
            &nbsp; Hotline: 13605 or 01777777800-806 &nbsp;&nbsp;
            <BsGlobe
              style={{ fontSize: "10px", fontWeight: "bold", color: "#0054a6" }}
            />
            &nbsp; usbair.com &nbsp;&nbsp;
            <FaFacebookSquare
              style={{ fontSize: "10px", fontWeight: "bold", color: "#0054a6" }}
            />
            &nbsp; usbair &nbsp;&nbsp;
          </span>
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <p
            style={{
              padding: "0px",
              margin: "0px",
              height: "12px",
              width: "69%",
              backgroundColor: "#0054a6",
            }}
          ></p>
          <p
            style={{
              padding: "0px",
              margin: "0px",
              height: "12px",
              width: "30%",
              backgroundColor: "#ed1d24",
            }}
          ></p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white mx-auto" style={{ width: "754px" }}>
      <div
        style={{
          width: "98.3%",
          minHeight: "1065px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ borderTop: "15px solid #0074bc" }}>
          <TravelerInfo />
          <TravelItinerary />
          <BaggageAndFareDetails />
          <FareRules />
          <PaymentReceipt />
        </div>
      </div>
      <TermsAndConditions />
    </div>
  );
};

export default OriginalPdfBS;
