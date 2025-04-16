/* eslint-disable jsx-a11y/anchor-is-valid */
import moment from "moment";
import React from "react";
import NoDataFound from "../noDataFound";
import TableLoader from "../tableLoader";

const TableDataView = ({
    tableHeaders = [],
    response = {},
    isLoading = false,
    handleBookedView = null,
    handleViewTicket = null,
}) => {
    return (
        <div className="table-responsive">
            <table className="table table-lg" style={{ width: "100%", fontSize: "13px" }}>
                <thead className="text-start fw-bold bg-secondary">
                    <tr>
                        {tableHeaders?.map(({ label }) => (
                            <th key={label}>{label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="tbody">
                    {!isLoading && response?.data?.length
                        ? response?.data.map((item, index) => {
                              const {
                                  bookedDateTime,
                                  currentStatus,
                                  flightDate,
                                  flightNumber,
                                  isInternational,
                                  pnr,
                                  passengerName,
                                  uniqueTransId,
                              } = item;
                              return (
                                  <tr key={index} className="text-start fw-bold text-secondary">
                                      <td>
                                          {bookedDateTime ? moment(bookedDateTime).format("DD-MM-YYYY HH:mm") : "N/A"}
                                      </td>
                                      <td>{flightNumber}</td>
                                      <td>{passengerName}</td>
                                      <td>{flightDate ? moment(flightDate).format("DD-MM-YYYY HH:mm") : "N/A"}</td>
                                      <td className="align-middle">
                                          {currentStatus === "Confirmed" ? (
                                              <>
                                                  <a
                                                      onClick={() => handleBookedView(uniqueTransId, currentStatus)}
                                                      style={{
                                                          color: "#068b9f",
                                                          fontWeight: 800,
                                                          cursor: "pointer",
                                                      }}
                                                  >
                                                      {pnr}
                                                  </a>
                                              </>
                                          ) : (
                                              <>
                                                  <a
                                                      onClick={() => handleViewTicket(item.uniqueTransID, item.status)}
                                                      style={{
                                                          color: "#068b9f",
                                                          fontWeight: 800,
                                                          cursor: "pointer",
                                                      }}
                                                  >
                                                      {item.uniqueTransID}
                                                  </a>
                                              </>
                                          )}
                                      </td>
                                      <td>{isInternational && isInternational ? "International" : "Domestics"}</td>
                                      <td className="align-middle">
                                          <div className="mb-2">
                                              <span
                                                  style={{
                                                      backgroundColor: currentStatus === "Confirmed" ? "#58b1bf2e" : "#fff4ef",
                                                      color: currentStatus === "Confirmed" ? "#068b9f" : "#f5802d",
                                                      fontWeight: 600,
                                                  }}
                                                  className="px-3 py-2 rounded"
                                              >
                                                  {currentStatus}
                                              </span>
                                          </div>
                                      </td>
                                  </tr>
                              );
                          })
                        : null}
                </tbody>
            </table>

            {!response?.data?.length && !isLoading ? <NoDataFound /> : null}
            {isLoading ? <TableLoader /> : null}
        </div>
    );
};

export default TableDataView;
