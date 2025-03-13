import React from "react";
import Navbar from "./Navbar";
import SideNavBar from "../SideNavBar/SideNavBar";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { Box, CircularProgress, Text } from "@chakra-ui/react";

const SearchList = () => {
  const location = useLocation();
  const myArray = location.state?.myArray || []; // Get the passed array
  const pnr = location.state?.pnr || ""; // Get the passed `sendObj`

  const getTicketingData = (utid, type, status) => {
    if (type === "Booking") {
      window.open("/bookedview?utid=" + utid + "&sts=" + status, "_blank");
    } else if (type === "Ticket") {
      window.open("/ticket?utid=" + utid + "&sts=" + status, "_blank");
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg px-4 pb-5">
        <section className="content-header"></section>
        <section className="content">
          <ToastContainer position="bottom-right" autoClose={1500} />
          <div className="mx-lg-5 mx-md-5 mx-sm-1">
            <div className="container-fluid bg-white">
              <Box pt={4}>
                <Text
                  rounded={"sm"}
                  fontSize="15px"
                  fontWeight={700}
                  p={1}
                  mb={2}
                  bg="#5DB3C1"
                  color="white"
                  w="auto"
                  display="inline-block"
                >
                  Search Result For [{pnr}]
                </Text>

                {myArray?.length > 0 ? (
                  <div className="table-responsive">
                    <table
                      className="table table-lg"
                      style={{ width: "100%", fontSize: "13px" }}
                    >
                      <thead className="text-start fw-bold bg-secondary">
                        <tr>
                          <th>TYPE </th>
                          <th>STATUS</th>
                          <th>REISSUE</th>
                          <th>REFUND</th>
                          <th>VOID</th>
                          <th>BOOKING ID</th>
                          <th>PNR</th>
                          <th>AIRELINE PNR </th>
                          <th>TICKET NUMBER</th>
                          <th>PAX DETAILS</th>
                          <th>SOURCE</th>
                          <th>BOOKING DATE</th>
                        </tr>
                      </thead>
                      <tbody className="tbody ">
                        {myArray?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item?.type}</td>
                              <td>{item.status}</td>
                              <td>{item.isReissued}</td>
                              <td>{item.refundStatus}</td>
                              <td>{item.voidStatus}</td>
                              <td
                                onClick={() =>
                                  getTicketingData(
                                    item?.uniqueTransID,
                                    item?.type,
                                    item?.status
                                  )
                                }
                                style={{
                                  color: "#7c04c0",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                }}
                              >
                                {item.uniqueTransID}
                              </td>
                              <td
                                onClick={() =>
                                  getTicketingData(
                                    item?.uniqueTransID,
                                    item?.type,
                                    item?.status
                                  )
                                }
                                style={{
                                  color: "#7c04c0",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                }}
                              >
                                {item.pnr}
                              </td>
                              <td>{item.airlinePNR}</td>
                              <td
                                onClick={() =>
                                  getTicketingData(
                                    item?.uniqueTransID,
                                    item?.type,
                                    item?.status
                                  )
                                }
                                style={{
                                  color: "#7c04c0",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                }}
                              >
                                {item.ticketNumber}
                              </td>
                              <td>{item.passengerName}</td>
                              <td>{item.airline}</td>
                              <td>
                                {" "}
                                {moment(item.createdDate).format(
                                  "DD-MMMM-yyyy"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="300px"
                    >
                      <Box ml={2}>No data found</Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SearchList;
