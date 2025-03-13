import { Button } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import { getBookingData, getsototicketData } from "../../common/allApi";
import TableLoader from "../../component/tableLoader";
import NoDataFound from "../../component/noDataFound";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { ToastContainer } from "react-toastify";

const SotoTicket = () => {
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(50);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  let [ticketingList, setTicketingList] = useState([]);

  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [isTimeOut, setIsTimeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsTimeOut(true), 10000);
  }, []);

  const now = new Date();
  const [sendObj, setSendObj] = useState({
    fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    toDate: moment(now).format("YYYY-MM-DD"),
    uniqueTransId: "",
    pnr: "",
    DateType: "0",
    origin: null,
    destination: null,
  });

  const [filterData, setfilterData] = useState({
    fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    toDate: moment(now).format("YYYY-MM-DD"),
    DateType: "0",
    origin: null,
    destination: null,
  });
  useEffect(() => {
    const getTicketingList = async () => {
      try {
        setLoading(true);
        const response = await getsototicketData(
          {
            status: null,
            ...filterData,
          },
          currentPageNumber,
          pageSize
        );
        setTicketingList(await response.data.data);
        setPageCount(await response.data.totalPages);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    getTicketingList();
  }, [isSearch, currentPageNumber, pageSize, filterData]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
  };

  const handleClearTicketing = () => {
    setCurrentPageNumber(1);
    setSendObj({
      uniqueTransId: "",
      fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      toDate: moment(now).format("YYYY-MM-DD"),
      pnr: "",
      DateType: "0",
      origin: null,
      destination: null,
    });
    setfilterData({
      fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      toDate: moment(now).format("YYYY-MM-DD"),
    });
  };

  const handleViewTicket = (utid, sts) => {
    let status =
      sts === "Confirmed"
        ? "Confirmed"
        : sts === "Ordered"
        ? "Ordered"
        : sts === "Void"
        ? "Cancelled"
        : sts === "Cancelled"
        ? "Cancelled"
        : sts;

    const page =
      status === "Confirmed"
        ? "ticket"
        : status === "Ordered"
        ? "bookedview"
        : status === "Void"
        ? "ticket"
        : status === "Cancelled"
        ? "ticket"
        : "unknown";

    window.open(`/${page}?utid=${utid}&sts=${status}`, "_blank");
  };
  const [idxD, setIdxD] = useState("SotoTicket");
  let onStatusChange = (statusId) => {
    setIdxD(statusId);
  };
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg px-4 pb-5">
        <section className="content-header"></section>
        <section className="content">
          <ToastContainer position="bottom-right" autoClose={1500} />
          <form
            className="mx-lg-5 mx-md-5 mx-sm-1 mt-3"
            // encType="multipart/form-data"
            // style={{ minHeight: "500px" }}
          >
            <div className="container-fluid bg-white">
              <div className="row">
                <div
                  className="col-lg-12 border-bottom d-flex justify-content-start p-0 ms-2 ms-lg-0"
                  style={{
                    whiteSpace: "nowrap",
                    overflowX: "auto",
                    scrollbarWidth: "none", // For Firefox
                    WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                    msOverflowStyle: "none", // For IE and Edge
                  }}
                >
                  <div
                    className={
                      idxD === "SotoTicket"
                        ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onStatusChange("SotoTicket")}
                  >
                    <span
                      className={
                        idxD === "SotoTicket" &&
                        "custom-border-selected-tab pb-3"
                      }
                    >
                      Ticket Alert
                    </span>
                  </div>
                </div>
              </div>

              <div className="row p-2 py-3">
                <div className="container-fluid bg-white">
                  <div className="row my-3">
                    <div className="col-sm-2 mb-3 mb-lg-0">
                      <input
                        type={"text"}
                        value={sendObj?.pnr}
                        onChange={(e) =>
                          setSendObj({
                            ...sendObj,
                            pnr: e.target.value,
                          })
                        }
                        className="form-control border-radius"
                        placeholder="GDS PNR"
                      ></input>
                    </div>
                    <div className="col-sm-2 mb-3 mb-lg-0">
                      <input
                        type={"text"}
                        value={sendObj?.uniqueTransId}
                        onChange={(e) =>
                          setSendObj({
                            ...sendObj,
                            uniqueTransId: e.target.value,
                          })
                        }
                        className="form-control border-radius"
                        placeholder="Booking ID"
                      ></input>
                    </div>
                    <div className="col-sm-2 mb-3 mb-lg-0">
                      <input
                        type={"date"}
                        pattern="\d{4}-\d{2}-\d{2}"
                        max={new Date().toISOString().split("T")[0]}
                        value={sendObj?.fromDate}
                        onChange={(e) =>
                          setSendObj({
                            ...sendObj,
                            fromDate: e.target.value,
                          })
                        }
                        className="form-control border-radius"
                        placeholder="From Date"
                      ></input>
                    </div>
                    <div className="col-sm-2 mb-3 mb-lg-0">
                      <input
                        type={"date"}
                        pattern="\d{4}-\d{2}-\d{2}"
                        max={new Date().toISOString().split("T")[0]}
                        value={sendObj?.toDate}
                        onChange={(e) =>
                          setSendObj({
                            ...sendObj,
                            toDate: e.target.value,
                          })
                        }
                        className="form-control border-radius"
                        placeholder="To Date"
                      ></input>
                    </div>
                    <div className="col-sm-2 mb-3 mb-lg-0">
                      <select
                        value={sendObj?.DateType}
                        className="form-select border-radius"
                        placeholder="Upcoming Day"
                        onChange={(e) =>
                          setSendObj({
                            ...sendObj,
                            DateType: e.target.value,
                          })
                        }
                      >
                        <option value="0"> Booking Date</option>
                        <option value="1"> Ticketing Date</option>
                      </select>
                    </div>

                    <div className="col-lg-4">
                      <div className="col-sm-12 pt-2">
                        <button
                          type="button"
                          class="btn button-color fw-bold text-white border-radius filter-btn"
                          onClick={() => {
                            setIsSearch((old) => !old);
                            setCurrentPageNumber(1);
                            setfilterData(sendObj);
                          }}
                        >
                          Apply Filter
                        </button>
                        <button
                          type="button"
                          style={{ backgroundColor: "#ED7F22" }}
                          class="btn  fw-bold text-white border-radius ms-2 filter-btn"
                          onClick={() => handleClearTicketing()}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <table
                    className="table  table-lg"
                    style={{ width: "100%", fontSize: "13px" }}
                  >
                    <thead className="text-start fw-bold bg-secondary">
                      <tr>
                        <th>ISSUE DATE</th>
                        <th>BOOKING DATE</th>
                        <th>BOOKING ID</th>
                        <th className="text-start">PASSENGER NAME</th>
                        <th>FLIGHT DATE</th>
                        <th>ROUTE</th>
                        <th>PNR</th>
                        <th>TICKET NUMBER</th>
                        <th className="text-end">TOTAL PRICE</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="tbody">
                      {isLoading ? (
                        <tr>
                          <td colSpan="11" style={{ textAlign: "center" }}>
                            <TableLoader />
                          </td>
                        </tr>
                      ) : ticketingList.length > 0 ? (
                        ticketingList.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="text-start fw-bold text-secondary"
                            >
                              <td>
                                {item.issueDate != null ? (
                                  moment(item.issueDate).format(
                                    "DD-MM-YYYY HH:mm"
                                  )
                                ) : (
                                  <></>
                                )}
                              </td>
                              <td>
                                {moment(item.bookingDate).format(
                                  "DD-MM-YYYY HH:mm"
                                )}
                              </td>
                              <td
                                style={{
                                  color: "#7c04c0",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                }}
                              >
                                <a
                                  href="javascript:void(0)"
                                  onClick={() =>
                                    handleViewTicket(
                                      item.bookingId,
                                      item.status
                                    )
                                  }
                                >
                                  {item.bookingId}
                                </a>
                              </td>
                              <td>{item.passengerName}</td>
                              {/* <td></td> */}
                              <td>
                                {item.departure != null ? (
                                  moment(item.departure).format("DD-MMM-YYYY")
                                ) : (
                                  <></>
                                )}
                              </td>
                              <td>{item?.route ?? ""}</td>

                              <td
                                style={{
                                  color: "#7c04c0",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                }}
                              >
                                <a
                                  href="javascript:void(0)"
                                  onClick={() =>
                                    handleViewTicket(
                                      item.bookingId,
                                      item.status
                                    )
                                  }
                                >
                                  {item.pnr}
                                </a>
                              </td>
                              <td
                                style={{
                                  color: "#7c04c0",
                                  fontWeight: 800,
                                }}
                              >
                                {item.ticketNumber}
                              </td>
                              <td className="text-end text-dark">
                                AED {item.totalPrice?.toLocaleString("en-US")}
                              </td>
                              <td>
                                <div className="mb-2">
                                  <span
                                    style={{
                                      backgroundColor:
                                        item.status === "Confirmed"
                                          ? "#ecfdf3"
                                          : item.status === "Ordered"
                                          ? "#fdecea" // Red background for "Ordered"
                                          : "#f1f1f1", // Default background
                                      color:
                                        item.status === "Confirmed"
                                          ? "#26a36a"
                                          : item.status === "Ordered"
                                          ? "#d93025" // Red text for "Ordered"
                                          : "#000", // Default text color
                                      fontWeight: 600,
                                    }}
                                    className="px-3 py-2 rounded"
                                  >
                                    {item.status === "Confirmed"
                                      ? "Ticketed"
                                      : item.status === "Ordered"
                                      ? "Processing"
                                      : item.status}{" "}
                                    <br />{" "}
                                    {item.refundStatus != null
                                      ? "Refund " + item.refundStatus
                                      : ""}
                                  </span>
                                </div>
                              </td>
                              {/* <td className="text-center">
                                      <>
                                        <a
                                          href="javascript:void(0)"
                                          title="View Ticket"
                                          onClick={() =>
                                            handleViewTicket(
                                              item.bookingId,
                                              item.status
                                            )
                                          }
                                        >
                                          <Button
                                            border="2px solid"
                                            colorScheme="messenger"
                                            variant="outline"
                                            size="xsm"
                                            borderRadius="16px"
                                            p="1"
                                          >
                                            <span style={{ fontSize: "10px" }}>
                                              VT
                                            </span>
                                          </Button>
                                        </a>
                                        &nbsp; &nbsp;
                                      </>
                                    </td> */}
                            </tr>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </table>

                  {ticketingList?.length === 0 && !isLoading && <NoDataFound />}
                </div>

                <div className="d-flex justify-content-end">
                  {ticketingList?.length > 0 && !isLoading && (
                    <ReactPaginate
                      previousLabel={
                        <div className="d-flex align-items-center gap-1">
                          <MdOutlineSkipPrevious
                            style={{ fontSize: "18px" }}
                            color="#ed8226"
                          />{" "}
                          Prev
                        </div>
                      }
                      nextLabel={
                        <div className="d-flex align-items-center gap-1">
                          <MdOutlineSkipNext
                            style={{ fontSize: "18px" }}
                            color="#ed8226"
                          />
                          Next
                        </div>
                      }
                      breakLabel={"..."}
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      forcePage={currentPageNumber - 1}
                      pageRangeDisplayed={3}
                      onPageChange={handlePageClick}
                      containerClassName={
                        "pagination justify-content-center py-2 border rounded"
                      }
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      breakClassName={"page-item"}
                      breakLinkClassName={"page-link"}
                      activeClassName={"active"}
                    />
                  )}
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default SotoTicket;
