import { useEffect, useState } from "react";
import {
  CheckInTimeFormatter,
  DateFormatterWithMonth,
  formatAmount,
  ISODateFormatterTicketView,
  timeFormatter,
} from "../../common/functions";
import airastralogo from "../../images/pdfimg/airastralogo.svg";
import pdgscanner from "../../images/pdfimg/qrcode.png";
import safetypromis from "../../images/pdfimg/2ASafetyLogo.jpg";
import footerairastra from "../../images/pdfimg/airastralogobn.svg";
const OriginalPdf2A = ({ totalResponse, originalPDFFareData }) => {
  const { ticketInfo, passengerInfo, segments, fareBreakdown } = totalResponse;
  const originalPDFFareRules = originalPDFFareData?.fareRules;
  const originalPDFFareBaggage = originalPDFFareData?.baggageFareDetail || [];
  const taxBreakdown = originalPDFFareData?.taxInfo;
  const [baggageInfo, setBaggageInfo] = useState([]);

  const [totalBaseFare, setTotalBaseFare] = useState(0);
  const [totalTax, setTotalTax] = useState(0);

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

    passengerInfo.forEach((passenger) => {
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

    fareBreakdown.forEach((item) => {
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

  const groupSegmentsByTripSegment = () => {
    if (!originalPDFFareBaggage?.segmentDetails) {
      console.error("segmentDetails is undefined");
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

  const Title = ({ style, title }) => (
    <div
      style={{
        paddingTop: "10px",
        paddingBottom: "5px",
        fontSize: "11.25pt",
        fontWeight: "bold",
        color: "#b8b4b3",
        textDecoration: "underline",
        ...style,
      }}
    >
      {title}
    </div>
  );

  const TravelItinerary = () => (
    <div className="break-avoid">
      <Title
        style={{
          paddingTop: "2px",
          paddingBottom: "5px",
        }}
        title="Travel Itinerary"
      />
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontSize: "8.25pt",
        }}
      >
        <thead>
          <tr
            style={{
              borderTop: "none",
              border: "1px solid #000",
              fontWeight: 400,
              backgroundColor: "#f0f0f0",
            }}
          >
            <th
              style={{
                paddingLeft: "20px",
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "left",
                fontWeight: 400,
              }}
            >
              Flight
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              <span style={{ whiteSpace: "nowrap" }}>Check-in</span>
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              From
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              To
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Departure
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Arrival
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Terminal
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Cabin
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Status
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Note
            </th>
          </tr>
        </thead>
        <tbody style={{ border: "1px solid #000", borderTop: 0 }}>
          {segments?.map((sub, index) => (
            <tr
              key={index}
              style={{
                fontSize: "7.5pt",
                fontWeight: 600,
                borderBottom: "1px solid #000",
              }}
            >
              <td
                style={{
                  paddingRight: "13px",
                  paddingLeft: "13px",
                  textAlign: "center",
                  fontSize: "10.5pt",
                  fontWeight: 700,
                }}
              >
                2A{sub?.flightNumber}
              </td>
              <td
                style={{
                  paddingRight: "13px",
                  paddingLeft: "13px",
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
                  paddingRight: "13px",
                  paddingLeft: "13px",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: 600 }}>{sub?.originCity}</span>(
                {sub?.origin})
              </td>
              <td
                style={{
                  paddingRight: "13px",
                  paddingLeft: "13px",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                  {sub?.destinationCity}
                </span>
                ({sub?.destination})
              </td>
              <td
                style={{
                  paddingRight: "13px",
                  paddingLeft: "13px",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                    {DateFormatterWithMonth(sub?.departure)}
                  </span>
                  <span>{timeFormatter(sub?.departure)}</span>
                </div>
              </td>
              <td
                style={{
                  paddingRight: "13px",
                  paddingLeft: "13px",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                    {DateFormatterWithMonth(sub?.arrival)}
                  </span>
                  <span>{timeFormatter(sub?.arrival)}</span>
                </div>
              </td>
              <td
                style={{
                  paddingRight: "13px",
                  paddingLeft: "13px",
                  textAlign: "center",
                }}
              >
                {sub?.originTerminal}
              </td>
              <td
                style={{
                  paddingRight: "13px",
                  paddingLeft: "13px",
                  textAlign: "center",
                }}
              >
                {sub?.cabinClass}
              </td>
              <td
                style={{
                  paddingRight: "13px",
                  paddingLeft: "13px",
                  textAlign: "center",
                }}
              >
                OK
              </td>
              <td
                style={{
                  paddingRight: "13px",
                  paddingLeft: "13px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingBottom: "3px",
                  }}
                >
                  <span>Non-stop</span>
                  <span style={{ whiteSpace: "nowrap" }}>{sub?.equipment}</span>
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
      <Title title="Fare Details" />
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead>
          <tr
            style={{
              borderTop: "none",
              border: "1px solid #000",
              backgroundColor: "#f0f0f0",
              textAlign: "left",
            }}
          >
            <th
              style={{
                paddingLeft: "20px",
                paddingBottom: "3px",
                paddingTop: "3px",
                whiteSpace: "nowrap",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Trip segment
            </th>
            <th
              style={{
                paddingLeft: "20px",
                paddingBottom: "3px",
                paddingTop: "3px",
                whiteSpace: "nowrap",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Fare Basis
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                whiteSpace: "nowrap",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Type
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                whiteSpace: "nowrap",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Passenger Name
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                whiteSpace: "nowrap",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Baggage
              <br />
              allowance
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                whiteSpace: "nowrap",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Seat
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                whiteSpace: "nowrap",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Currency
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                whiteSpace: "nowrap",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Base fare
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                whiteSpace: "nowrap",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Tax & surcharges
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                whiteSpace: "nowrap",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Ticket fare
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
                    fontSize: "7.5pt",
                    fontWeight: 600,
                  }}
                >
                  {k === 0 && i === 0 && (
                    <td
                      rowSpan={passengerInfo?.length}
                      style={{
                        paddingRight: "13px",
                        paddingLeft: "13px",
                        textAlign: "left",
                        paddingBottom: "3px",
                        paddingTop: "3px",
                        borderBottom:
                          index + 1 <= segments.length - 1
                            ? "1px solid #000"
                            : "none",
                      }}
                    >
                      {sub?.segment}
                    </td>
                  )}
                  {k === 0 && i === 0 && (
                    <td
                      rowSpan={passengerInfo?.length}
                      style={{
                        paddingRight: "13px",
                        paddingLeft: "13px",
                        paddingTop: "3px",
                        paddingBottom: "3px",
                        textAlign: "center",
                        borderLeft: "1px dashed #000",
                        borderBottom:
                          index + 1 <= segments.length - 1
                            ? "1px solid #000"
                            : "none",
                      }}
                    >
                      {item?.fareCode || "N/A"}
                    </td>
                  )}
                  {k == 0 && (
                    <td
                      rowSpan={fare?.passengers?.length}
                      style={{
                        paddingRight: "13px",
                        paddingLeft: "13px",
                        paddingTop: "3px",
                        paddingBottom: "3px",
                        textAlign: "center",
                        borderRight: "1px dashed #000",
                        borderLeft: "1px dashed #000",
                        borderBottom:
                          i + 1 <= sub?.fares?.length - 1 ||
                          index + 1 <= segments.length - 1
                            ? "1px solid #000"
                            : "none",
                      }}
                    >
                      {getPassengerType(fare?.passengerType) || "N/A"}
                    </td>
                  )}
                  <td
                    style={{
                      paddingRight: "13px",
                      paddingLeft: "13px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
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
                    {item?.passengerName || "N/A"}
                  </td>
                  <td
                    style={{
                      paddingRight: "13px",
                      paddingLeft: "13px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      textAlign: "center",
                      fontSize: "11px",
                      borderRight: "1px dashed #000",
                      fontWeight: 700,
                      borderBottom:
                        i + 1 <= sub?.fares?.length - 1 ||
                        index + 1 <= segments.length - 1 ||
                        k + 1 < fare?.passengers?.length
                          ? "1px solid #000"
                          : "none",
                    }}
                  >
                    {item?.baggageAllowance}
                  </td>
                  <td
                    style={{
                      paddingRight: "13px",
                      paddingLeft: "13px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      textAlign: "center",
                      borderRight: "1px dashed #000",
                      borderBottom:
                        index + 1 <= segments.length - 1 ||
                        i === passengerInfo.length - 1 ||
                        k + 1 < fare?.passengers?.length
                          ? "1px solid #000"
                          : "none",
                    }}
                  ></td>
                  {k === 0 && (
                    <td
                      rowSpan={fare?.passengers?.length}
                      style={{
                        paddingRight: "13px",
                        paddingLeft: "13px",
                        paddingTop: "3px",
                        paddingottom: "3px",
                        textAlign: "center",
                        borderRight: "1px dashed #000",
                        borderBottom:
                          i + 1 <= sub?.fares?.length - 1 ||
                          index + 1 <= segments.length - 1
                            ? "1px solid #000"
                            : "none",
                      }}
                    >
                      AED
                    </td>
                  )}
                  <td
                    style={{
                      paddingRight: "13px",
                      paddingLeft: "13px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      textAlign: "right",
                      borderRight: "1px dashed #000",
                      borderBottom:
                        i + 1 <= sub?.fares?.length - 1 ||
                        index + 1 <= segments.length - 1 ||
                        k + 1 < fare?.passengers?.length
                          ? "1px solid #000"
                          : "none",
                    }}
                  >
                    {formatAmount(item?.baseFare ?? 0) || "N/A"}
                  </td>
                  <td
                    style={{
                      paddingRight: "13px",
                      paddingLeft: "13px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
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
                      paddingRight: "13px",
                      paddingLeft: "13px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      textAlign: "right",
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
                </tr>
              ))
            )
          )}
          <tr style={{ borderTop: "1px solid #000" }}>
            <td
              colSpan={9}
              style={{
                textAlign: "right",
                paddingRight: "10px",
                borderRight: "1px dashed #000",
                fontSize: "9pt",
                fontWeight: 700,
                paddingTop: "3px",
                paddingBottom: "3px",
              }}
            >
              Total amount :
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
        }}
      >
        <thead>
          <tr
            style={{
              borderTop: "none",
              border: "1px solid #000",

              backgroundColor: "#f0f0f0",
            }}
          >
            <th
              style={{
                paddingLeft: "20px",
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "left",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Trip segment
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Fare validity{" "}
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Type
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Change fees **{" "}
            </th>
            <th
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
                fontSize: "8.25pt",
                fontWeight: 400,
              }}
            >
              Refund fees **
            </th>
          </tr>
        </thead>
        <tbody style={{ border: "1px solid #000", borderTop: 0 }}>
          {originalPDFFareRules?.map((sub) => {
            const uniquePassengerTypes = [...new Set(sub.passengerType)];
            return uniquePassengerTypes?.map((type, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #000" }}>
                {i === 0 && (
                  <td
                    rowSpan={uniquePassengerTypes.length}
                    style={{
                      paddingLeft: "20px",
                      textAlign: "left",
                      paddingBottom: "5px",
                      paddingTop: "5px",
                      fontSize: "9pt",
                      fontWeight: 600,
                      borderBottom:
                        i + 1 <= segments.length - 1
                          ? "1px solid #000"
                          : "none",
                    }}
                  >
                    {sub?.tripSegment}
                  </td>
                )}
                <td
                  style={{
                    textAlign: "center",
                    borderLeft: "1px solid #000",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                    fontSize: "6pt",
                    fontWeight: 600,
                  }}
                >
                  {sub?.fareValidity?.map((fare, i) => (
                    <div key={i}>{fare}</div>
                  ))}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderLeft: "1px solid #000",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                    fontSize: "6pt",
                    fontWeight: 600,
                  }}
                >
                  {getPassengerType(type)}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                    borderRight: "1px solid #000",
                    borderLeft: "1px solid #000",
                    fontSize: "6pt",
                    fontWeight: 600,
                  }}
                >
                  {sub?.changeFees?.map((refund, i) => (
                    <div key={i}>{refund}</div>
                  ))}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                    fontSize: "6pt",
                    fontWeight: 600,
                  }}
                >
                  {sub?.refundFees?.map((data, i) => (
                    <div key={i}>{data}</div>
                  ))}
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          gap: "4px",
          paddingTop: "4px",
          fontSize: "6.75pt",
          fontWeight: 600,
        }}
      >
        <span>Endorsement :</span>
        <span>
          Non-Endorsable / Non-Reroutable / Non-Transferable / Valid on 2A only
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: "10px",
          fontSize: "9pt",
          fontWeight: 600,
        }}
      >
        <span style={{ display: "flex" }}>
          <span style={{ minWidth: "30px" }}>(*)</span>
          <span>
            days are divided in increments of 24 hours and governed by the
            flight departure time
          </span>
        </span>
        <span style={{ display: "flex" }}>
          <span style={{ minWidth: "30px" }}>(**)</span>
          <span>Please note this is a total amount per passenger type.</span>
        </span>
        <span style={{ display: "flex" }}>
          <span style={{ minWidth: "30px" }}>(***)</span>
          <span>
            in the case of modification of several trips, the highest penalty on all trips
            will be applied
          </span>
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
        }}
      >
        <div
          style={{
            gridColumn: "span 1",
            padding: "1.25rem 0 1.25rem 1.25rem",
            border: "1px solid #CBCBCB",
            display: "flex",
            flexDirection: "column",
            fontSize: "11px",
          }}
        >
          <div style={{ display: "grid", rowGap: "8px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 20px 1fr",
                fontWeight: 600,
                fontSize: "8.25pt",
              }}
            >
              <div>Payment mode</div>
              <div style={{ textAlign: "center" }}>:</div>
              <div>In account</div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 20px 1fr",
                fontWeight: 600,
                fontSize: "8.25pt",
              }}
            >
              <div>Date of issue</div>
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
                fontWeight: 600,
                fontSize: "8.25pt",
                gridTemplateColumns: "90px 20px 1fr",
              }}
            >
              <div>Place of issue</div>
              <div style={{ textAlign: "center" }}>:</div>
              <div>Triplover Limited</div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 20px 1fr",
                fontWeight: 600,
                fontSize: "8.25pt",
              }}
            >
              <div>Ticket issued by</div>
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
                gap: "0.375rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "8.25pt",
                  fontWeight: 600,
                }}
              >
                <div>Base fare amount</div>
                <div>{formatAmount(grandTotal?.grandTotalBaseFare)} AED</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "8.25pt",
                  fontWeight: 600,
                }}
              >
                <div>Tax & surcharges</div>
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
                    lineHeight: "0.45rem",
                    color: "rgb(87 88 91 / 55%)",
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
                gap: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "9.75pt" }}>
                  Total amount
                </div>
                <div style={{ fontWeight: "700", fontSize: "12pt" }}>
                  {formatAmount(originalPDFFareBaggage?.totalAmount)} AED
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "8.25pt",
                  fontWeight: 600,
                  marginTop: "-3px",
                }}
              >
                <div>Other fees*</div>
                <div>0 AED</div>
              </div>
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
        borderBottom: "2px solid #cccccc",
      }}
    >
      <tbody style={{ border: "1px solid #CBCBCB" }}>
        <tr
          style={{
            border: "1px solid #CBCBCB",
            borderBottom: 0,
          }}
        >
          <td colSpan={6}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                padding: "0px 20px 5px 20px",
              }}
            >
              <img
                src={airastralogo}
                alt="Air Astra Logo"
                style={{ paddingBottom: "15px" }}
                width={297}
                height={57.24}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "24pt",
                    fontWeight: "400",
                    color: "#f8b300",
                    fontFamily: "'Calibri', 'Arial', sans-serif",
                  }}
                >
                  e-ticket
                </span>
                <span style={{ fontSize: "6.75pt", color: "#000" }}>
                  Booking reference #
                  <span
                    style={{
                      fontSize: "22.5pt",
                      fontWeight: "700",
                      color: "#000",
                      paddingLeft: "3px",
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
            Information / Service request
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
            Type
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
          <tr key={index}>
            <td
              style={{
                paddingBottom: "3px",
                paddingTop: "2.5px",
                paddingLeft: "20px",
                fontSize: "7.5pt",
                fontWeight: 600,
              }}
            >
              {passenger?.fullName}
            </td>
            <td
              style={{
                textAlign: "center",
                paddingBottom: "3px",
                paddingTop: "2.5px",
                paddingLeft: "20px",
                fontSize: "7.5pt",
                fontWeight: 600,
                fontFamily: "'Calibri', 'Arial', sans-serif",
              }}
            >
              {passenger.ticketNumbers}
            </td>
            <td
              style={{
                textAlign: "center",
                paddingBottom: "3px",
                paddingTop: "2.5px",
                paddingLeft: "20px",
                fontSize: "7.5pt",
                fontWeight: 600,
              }}
            ></td>
            <td
              style={{
                textAlign: "center",
                paddingBottom: "3px",
                paddingTop: "2.5px",
                paddingLeft: "20px",
                fontSize: "7.5pt",
                fontWeight: 600,
              }}
            >
              {getPassengerType(passenger?.passengerType)}
            </td>
            <td
              style={{
                textAlign: "center",
                paddingBottom: "3px",
                paddingTop: "2.5px",
                paddingLeft: "20px",
                fontSize: "7.5pt",
                fontWeight: 600,
              }}
            >
              {passenger?.phone}
            </td>
            <td
              style={{
                textAlign: "left",
                paddingBottom: "3px",
                paddingTop: "2.5px",
                paddingLeft: "20px",
                fontSize: "7.5pt",
                fontWeight: 600,
              }}
            >
              {passenger?.documentNumber}
            </td>
          </tr>
        ))}
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
        fontFamily: "Arial, sans-serif",
        lineHeight: "9pt",
      }}
      className="break-avoid page-break"
    >
      <div>
        <h5
          style={{
            fontSize: "20px",
            padding: "0px",
            margin: "0px 0px 5px 0px",
            textAlign: "center",
            color: "#000",
            paddingTop: "6px",
            paddingBottom: "5px",
          }}
        >
          GENERAL CONDITIONS OF CARRIAGE
        </h5>
        <table
          style={{
            width: "80%",
            borderCollapse: "collapse",
            fontSize: "10px",
            color: "#939598",
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          <thead>
            <tr>
              <th
                rowSpan="2"
                style={{
                  border: "1px solid #757679",
                  fontWeight: "normal",
                  color: "#000",
                  backgroundColor: "#C1C1C1",
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
                  fontWeight: "normal",
                  color: "#000",
                  backgroundColor: "#C1C1C1",
                  paddingTop: "2px",
                  paddingBottom: "2px",
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
                  color: "#000",
                  borderBottom: "1px solid #757679",
                  backgroundColor: "#C1C1C1",
                }}
              >
                Open
              </th>
              <th
                style={{
                  color: "#000",
                  fontWeight: "normal",
                  borderRight: "1px solid #757679",
                  borderBottom: "1px solid #757679",
                  backgroundColor: "#C1C1C1",
                  paddingTop: "2px",
                  paddingBottom: "2px",
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
                  backgroundColor: "#C1C1C1",
                  color: "#000",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                }}
              >
                International
              </td>
              <td
                style={{
                  borderRight: "1px solid #757679",
                  borderTop: "0px",
                  borderBottom: "1px solid #757679",
                  backgroundColor: "#CBDBBA",
                  color: "#000",
                  fontSize: "8px",
                }}
              >
                3 Hours Before Departure (STD)
              </td>
              <td
                style={{
                  borderTop: "0px",
                  borderBottom: "1px solid #757679",
                  backgroundColor: "#CBDBBA",
                  color: "#000",
                  fontSize: "8px",
                }}
              >
                60 Minutes Before Departure (STD)
              </td>
            </tr>
            <tr style={{ border: "1px solid #757679", borderTop: "0px" }}>
              <td
                style={{
                  borderRight: "1px solid #757679",
                  backgroundColor: "#C1C1C1",
                  color: "#000",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                }}
              >
                Domestic
              </td>
              <td
                style={{
                  borderRight: "1px solid #757679",
                  backgroundColor: "#CBDBBA",
                  color: "#000",
                  fontSize: "8px",
                }}
              >
                1 Hour Before Departure (STD)
              </td>
              <td
                style={{
                  backgroundColor: "#CBDBBA",
                  color: "#000",
                  fontSize: "8px",
                }}
              >
                30 Minutes Before Departure (STD)
              </td>
            </tr>
            <tr style={{ border: "1px solid #757679", borderTop: "0px" }}>
              <td
                colSpan={3}
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  fontSize: "8px",
                  fontWeight: 600,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                }}
              >
                PASSENGERS REPORTING LATE FOR CHECK-IN MAY BE DENIED BOARDING.
              </td>
            </tr>
          </tbody>
        </table>
        <p
          style={{
            textAlign: "center",
            fontSize: "8.5px",
            padding: 0,
            margin: 0,
            paddingTop: "8px",
            paddingBottom: "8px",
            fontWeight: 500,
          }}
        >
          <div style={{ color: "#000" }}>BAGGAGE ALLOWANCE & DIMENSIONS</div>
          <div style={{ color: "#000" }}>
            Checked Baggage: Adult & Child-20 kg: Infant-10 kg: Maximum size 40
            x 60 x 100 cm.
          </div>
          <div style={{ color: "#000" }}>
            Cabin Baggage: 7 kg for all passengers: 1 piece maximum per person:
            Maximum size: 35 x 30 x 20 cm (length x width x height).
          </div>
        </p>
        <p
          style={{
            textAlign: "justify",
            fontSize: "8.5px",
            padding: 0,
            margin: 0,
          }}
        >
          <div style={{ color: "#000", fontWeight: 500 }}>DEFINITIONS </div>
          <ul
            style={{
              marginLeft: "0px",
              paddingLeft: "13px",
              color: "#757679",
            }}
          >
            <li>We refers to Astra Airways Limited (Air Astra)</li>
            <li>
              You or Passenger refers to any person in possession of a ticket
              carried or to be carried in an aircraft with our consent.
            </li>
            <li>
              Carrier is the carrier who transports the passenger and/or the
              passenger&apos;s baggage as stated on the ticket
            </li>
            <li>
              Electronic Ticket is a ticket saved in our booking system, either
              by us or on our behalf, verifiable with the Itinerary Receipt
              issued to the passenger
            </li>
            <li>
              Fare is the payment charged for transporting the passenger on a
              specified route approved by or made known to the competent
              aeronautical authorities
            </li>
            <li>
              Ticket is a document for the carrier issued by us or on our behalf
              marked as a ticket and baggage receipt or as an electronic ticket
              the Conditions of Carriage and notices, as well as the fight and
              passenger coupons contained within it are components of the
              ticket.
            </li>
            <li>
              Baggage are all items that are intended for your own use, and
              includes both checked and unchecked baggage.
            </li>
          </ul>
        </p>
        <div style={{ width: "100%" }}>
          <div style={{ width: "49%", float: "left", color: "grey" }}>
            <div style={{ paddingRight: "0px" }}>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <span style={{ color: "#000" }}>1. </span>
                If your journey involves an ultimate destination or stop in a
                country other than the country of departure, following
                international treaties may be applicable
                <ul style={{ marginLeft: "0px", paddingLeft: "13px" }}>
                  <li>
                    The Convention for the Unification of Certain Rules relating
                    to International Carriage by Air signed in Warsaw on 12
                    October 1929
                  </li>
                  <li>The Warsaw Convention as amended on 28 September 1955</li>
                  <li>
                    The Warsaw Convention as amended by the Additional Protocol
                    No. 1 of Montreal (1975)
                  </li>
                  <li>
                    The Warsaw Convention as amended in The Hague Protocol and
                    by the Additional Protocol No. 2 of Montreal (1975)
                  </li>
                  <li>
                    The Convention for the Unification of Certain Rules for
                    International Carriage by Air signed in Montreal on 28 May
                    1998 (referred to as the Montreal Convention) as
                    incorporated into Bangladesh law by the Carriage by Air
                    (Montreal Convention) Act, 2020
                  </li>
                </ul>
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <span style={{ color: "#000" }}>2. </span>
                Baggage that has been checked during boarding will be delivered
                to the bearer of the baggage check your baggage is damaged or
                lost, you must report in writing to us immediately on arrival.
                No complaints will be deemed valid otherwise.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <span style={{ color: "#000" }}>3. </span>
                This ticket is good for carriage for 90 days/as mentioned for
                domestic travels and for international travels 180 days/as
                mentioned in the ticket from the date of issue in carrier&apos;s
                tariffs, conditions of carriage, or related regulations. The
                fore for carriage hereunder is subject to change prior to
                commencement of carriage. Corrier may refuse transportation if
                the applicable fare has not been paid.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <span style={{ color: "#000" }}>4. </span>
                We undertake to ensure our best effort to carry you and your
                baggage with reasonable dispatch. Times shown in timetables or
                elsewhere are not guaranteed and form no port of this contract.
                We may without notice substitute alternate carriers or aircraft,
                and may alter or omit stopping places shown on the ticket in
                case of necessity Schedules are subject to change without any
                prior notice.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <span style={{ color: "#000" }}>5. </span>
                You are solely responsible for complying with all government
                travel requirements to be transported by the carrier. You shall
                arrive at the airport by the time specified on your
                ticket/electronic ticket/itinerary receipt or as notified to you
                electronically by SMS to your mobile phone or to your email
                address registered with us. We would deny you to board the
                flight for other passengers&apos; convenience & safety, or for
                regulatory reasons, if you fail to report/ finish check-in
                within the time mentioned above.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <span style={{ color: "#000" }}>6. </span>
                Liability for loss, delay or damage to baggage is strictly
                limited for domestic journey unless a higher value is declared
                in advance and additional charges are pold. The applicable
                liability limit for checked baggage is 1000 Special Drawing
                Rights per passenger for domestic carriage and any other
                applicable liability limit as may be stated in the Montreal
                Convention 1999 for international carriage. We shall not be
                lable for any baggage which is improperly or inadequately
                packed. We assume no lability for fragile, valuable or
                perishable articles.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <div style={{ color: "#000" }}>
                  7. IMPORTANT NOTICE REGARDING UNAUTHORIZED TICKETS
                </div>
                None of our agents employees or representatives, has the
                authority to alter, modify or wolve any provision contained on
                the ticket and the conditions of this General Conditions of
                Carriage. Air Astro will not recognize for purposes of carriage
                any ticket purchased from or resold to any source other than Air
                Astra or its authorized travel agents. Passengers should
                carefully examine their tickets, particularly the General
                Conditions of Carriage and notices contained therein.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <div style={{ color: "#000" }}>8. CABIN BAGGAGE ALLOWANCE </div>
                Your cabin baggage may be weighed and measured and if necessary,
                charged for in accordance with valid tariffs. You may carry on
                board the articles listed below free-of- charge over and above
                your free baggage allowance:
                <ul
                  style={{
                    marginLeft: "0px",
                    paddingLeft: "4px",
                    listStyleType: "none",
                  }}
                >
                  <li
                    style={{
                      position: "relative",
                      paddingLeft: "8px",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <span
                      style={{
                        content: "✓",
                        color: "#000",
                        position: "absolute",
                        left: "0",
                      }}
                    >
                      ✓
                    </span>
                    A lady&apos;s hand bag/purse appropriate for travelling
                  </li>
                  <li
                    style={{
                      position: "relative",
                      paddingLeft: "8px",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <span
                      style={{
                        content: "✓",
                        color: "#000",
                        position: "absolute",
                        left: "0",
                      }}
                    >
                      ✓
                    </span>
                    An umbrella or walking stick
                  </li>
                  <li
                    style={{
                      position: "relative",
                      paddingLeft: "8px",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <span
                      style={{
                        content: "✓",
                        color: "#000",
                        position: "absolute",
                        left: "0",
                      }}
                    >
                      ✓
                    </span>
                    Laptop/notebook ok computer, a compact camera
                  </li>
                  <li
                    style={{
                      position: "relative",
                      paddingLeft: "8px",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <span
                      style={{
                        content: "✓",
                        color: "#000",
                        position: "absolute",
                        left: "0",
                      }}
                    >
                      ✓
                    </span>
                    Reasonable amount of reading materials for the fight
                  </li>
                  <li
                    style={{
                      position: "relative",
                      paddingLeft: "8px",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <span
                      style={{
                        content: "✓",
                        color: "#000",
                        position: "absolute",
                        left: "0",
                      }}
                    >
                      ✓
                    </span>
                    Infant&apos;s food for consumption in fight and
                    infant&apos;s carrying basket (carrying basket shall be
                    stowed in the aircraft hold at boarding)
                  </li>
                  <li
                    style={{
                      position: "relative",
                      paddingLeft: "8px",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <span
                      style={{
                        content: "✓",
                        color: "#000",
                        position: "absolute",
                        left: "0",
                      }}
                    >
                      ✓
                    </span>
                    A fully collapsible wheelchair and/or a pair of crutches
                    and/or other prosthetic devices for the passenger&apos;s use
                    provided he/she is dependent upon them and will be carried
                    only in the luggage hold
                  </li>
                  <li
                    style={{
                      position: "relative",
                      paddingLeft: "8px",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <span
                      style={{
                        content: "✓",
                        color: "#000",
                        position: "absolute",
                        left: "0",
                      }}
                    >
                      ✓
                    </span>
                    Infant stroller, provided the infant is on-board the
                    aircraft will go in the luggage hold
                  </li>
                </ul>
              </p>
            </div>
          </div>
          <div style={{ width: "49%", float: "right", color: "grey" }}>
            <div style={{ paddingLeft: "0px" }}>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <div style={{ color: "#000" }}>9. GENERAL DISCLAIMER</div>
                Please remember to lock your baggage to prevent it from falling
                open and to help prevent pilferage of its contents. We are not
                liable for loss, damage to or delay in the delivery of fragile
                or perishable items, money, jewellery, precious metals,
                electronic devices, silverware, negotiable instruments,
                securities and other valuables, business documents, passports
                and other identification documents, samples, medicines or drugs
                which are included in your checked and carry-on baggage, whether
                with or without our knowledge. For the purpose of easy
                identification, please label all baggage inside and outside with
                your name and address.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <div style={{ color: "#000" }}>
                  10.IDENTIFICATION OF PASSENGERS{" "}
                </div>
                By Government order, you are required to produce appropriate
                identification at the time of check-in, as well as in order to
                avail any special discount/services.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <div style={{ color: "#000" }}>
                  11.IMPORTANT CHANGE OF ITINERARY{" "}
                </div>
                We do not require our passengers to reconfirm their onward or
                return journey on our services unless we advise you otherwise.
                However, please contact your agent or our reservations/ticketing
                office if you wish to change your travel plans.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <div style={{ color: "#000" }}>
                  12. RIGHT TO REFUSE CARRIAGE{" "}
                </div>
                We may refuse to carry you and/or your baggage from a fight, if
                this is determined to be necessary or appropriate for safety
                reasons, or for the comfort and convenience of passengers. You
                or any other passenger will also be refused carriage, or removed
                from a fight, if your or their behaviour is such as to threaten
                safety, good order, or discipline on board the aircraft, or to
                cause discomfort, inconvenience, or annoyance to passengers or
                crew members
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <div style={{ color: "#000" }}>13. REFUNDS </div>
                Air Astra reserves the right to make a refund only to the person
                named in the ticket or to the person who originally paid for the
                ticket. Refund will not be entertained if any claim is mode
                after the date of ticket expiry. Ticket issued through any agent
                must be processed for refund by the issuing agent only.
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <div style={{ color: "#000" }}>
                  14. NOTICE OF STATUTORY TAXES, FEES, AND SURCHARGES{" "}
                </div>
                The price of this ticket may include taxes, fees and charges
                which are imposed on air transportation by the government,
                related authorities and the carrier. These taxes, fees and
                charges which may represent as significant portion of the cost
                for air travel are either included in the fare or shown
                separately in the &quot;TAX&quot; boxes) of this ticket. You may
                also be required to pay taxes, fees and charges which were not
                collected at the time of issuance of the ticket/electronic
                ticket
              </p>
              <p
                style={{
                  textAlign: "justify",
                  fontSize: "8.5px",
                }}
              >
                <div style={{ color: "#000" }}>15. WEATHER ADVISORY </div>
                At times fights are disrupted due to weather conditions that are
                beyond our control We always try our level best to ensure that
                our customers do not suffer waiting for their fights at the
                airports due to any fight disruption and we try to inform them
                in advance However, sometimes it is not possible to reach
                customers due to lost-minute constraints. As such we would like
                to recommend to our valued customers to call fight information
                prior to proceeding for the airport.
              </p>
              <div
                style={{
                  border: "2px solid red",
                  padding: "5px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "flex-end",
                }}
              >
                <p
                  style={{
                    textAlign: "justify",
                    fontSize: "8.5px",
                    padding: 0,
                    margin: 0,
                    width: "70%",
                  }}
                >
                  <div style={{ color: "#000" }}>
                    16. RESTRICTED AND DANGEROUS ARTICLES IN BAGGAGE
                  </div>
                  For the safety of yours and other passengers, items defined as
                  &quot;dangerous goods&quot; in the International Air Transport
                  Association&apos;s (ATA) Dangerous Goods Regulations such as
                  those listed below shall not be carried in your baggage, or on
                  your person:
                  <ul style={{ marginLeft: "0px", paddingLeft: "13px" }}>
                    <li>Explosives & firearms</li>
                    <li>Radioactive materials </li>
                    <li>Compressed gases</li>
                    <li>Flammable liquids & solds</li>
                    <li>Oxidizing materials and organic peroxides</li>
                    <li>Poisonous materials </li>
                    <li>Infectious substances</li>
                    <li>Corrosive materials </li>
                    <li>Miscelaneous dangerous goods</li>
                  </ul>
                  <div style={{ color: "#000" }}>
                    To learn more about the restricted items for carriage in
                    your baggage, scan the QR Code on the right using your
                    smartphone{" "}
                  </div>
                </p>
                <img
                  src={pdgscanner}
                  alt="pdffooter"
                  width="25%"
                  height="80px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          borderBottom: "2px solid #000",
          borderTop: "2px solid #000",
          padding: "3px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <img
          src={safetypromis}
          alt="pdffooter"
          style={{
            width: "372px",
            height: "75px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <img
            src={footerairastra}
            alt="pdffooter"
            style={{
              width: "80%",
              height: "37px",
            }}
          />
          <img
            src={airastralogo}
            alt="pdffooter"
            style={{
              width: "80%",
              height: "37px",
            }}
          />
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
        <div style={{ borderTop: "15px solid #f8b300" }}>
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

export default OriginalPdf2A;
