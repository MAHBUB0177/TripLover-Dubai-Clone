import { Button, Center, Spinner } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import "./Queues.css";
import { addticketRefundRequest, getBookingData } from "../../common/allApi";
import NoDataFound from "../../component/noDataFound";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import TableLoader from "../../component/tableLoader";
import { useNavigate } from "react-router-dom";

const Queues = () => {
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  let [statusId, setStatusId] = useState(0);
  let [ticketingList, setTicketingList] = useState([]);
  const [idxD, setIdxD] = useState(0);
  const [isSearch, setIsSearch] = useState(false);
  const [isRefund, setIsRefund] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  let isAgent = JSON.parse(sessionStorage.getItem("isAgent"));

  useEffect(() => {
    setTimeout(() => setIsTimeOut(true), 10000);
  }, []);

  const now = new Date();
  const [sendObj, setSendObj] = useState({
    fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    toDate: moment(now).format("YYYY-MM-DD"),
    uniqueTransID: "",
    pnr: "",
  });

  const [filterData, setfilterData] = useState({
    fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    toDate: moment(now).format("YYYY-MM-DD"),
  });

  useEffect(() => {
    let status =
      statusId === 1
        ? "Hold"
        : statusId === 2
        ? "Pending"
        : statusId === 3
        ? "Booked"
        : statusId === 4
        ? "Booking Cancelled"
        : statusId === 5
        ? "Ticket Cancelled"
        : statusId === 6
        ? "Issued"
        : statusId === 7
        ? "Ticket Ordered"
        : statusId === 8
        ? "Issued"
        : "";
    const getTicketingList = async () => {
      try {
        setLoading(true);
        const response = await getBookingData(
          {
            agentId: sessionStorage.getItem("agentId") ?? 0,
            status: status,
            ...filterData,
          },
          currentPageNumber,
          pageSize
        );
        //ticketingList= response.data;
        setTicketingList(await response.data.data);
        setPageCount(await response.data.totalPages);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    getTicketingList();
  }, [isSearch, currentPageNumber, pageSize, statusId, isRefund, filterData]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  let onStatusChange = (statusId) => {
    setIdxD(statusId);
    setStatusId(statusId);
    // handleGetList(statusId);
  };

  const handleClearTicketing = () => {
    setCurrentPageNumber(1);
    setSendObj({
      uniqueTransID: "",
      fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      toDate: moment(now).format("YYYY-MM-DD"),
      pnr: "",
      //  status: "Booked",
    });
    setfilterData({
      fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      toDate: moment(now).format("YYYY-MM-DD"),
    });
  };

  const handleRaiseSupport = (status, utid, pnr, ticketno) => {
    if (status === "Issued") {
      window.open(
        "/support?typeid=2&subjectid=0&utid=" +
          utid +
          "&pnr=" +
          pnr +
          "&ticketno=" +
          (ticketno == undefined ? "" : ticketno),
        "_blank"
      );
    } else {
      window.open(
        "/support?typeid=1&subjectid=0&utid=" +
          utid +
          "&pnr=" +
          pnr +
          "&ticketno=" +
          (ticketno == undefined ? "" : ticketno),
        "_blank"
      );
    }
  };
  const handleCancel = (status, utid, pnr, ticketno) => {
    if (status === "Issued") {
      window.open(
        "/support?typeid=2&subjectid=1&utid=" +
          utid +
          "&pnr=" +
          pnr +
          "&ticketno=" +
          ticketno,
        "_blank"
      );
    } else {
      window.open(
        "/support?typeid=1&subjectid=10&utid=" +
          utid +
          "&pnr=" +
          pnr +
          "&ticketno=" +
          ticketno,
        "_blank"
      );
    }
  };

  const handleViewTicket = (utid, sts) => {
    let status =
      sts === "Issued"
        ? "Confirmed"
        : sts === "Ticket Cancelled"
        ? "Cancelled"
        : sts;
    window.open("/ticket?utid=" + utid + "&sts=" + status, "_blank");
    //navigate("/ticket?utid="+utid,'_blank');
  };

  const handleBookedView = (utid, sts) => {
    let status =
      sts === "Booked"
        ? "Confirmed"
        : sts === "Booking Expired"
        ? "Expired"
        : sts === "Booking Cancelled"
        ? "Cancelled"
        : sts === "Ticket Ordered"
        ? "Ordered"
        : "Cancelled";
    window.open("/bookedview?utid=" + utid + "&sts=" + status, "_blank");
    //navigate("/ticket?utid="+utid,'_blank');
  };

  const handleViewInvoice = (utid) => {
    window.open("/invoice?tnxNumber=" + utid, "_blank");
  };

  const handleRefundReq = (utid, ticketNumber) => {
    var result = window.confirm("Are you sure to request refund");
    if (result) {
      const refundReq = async () => {
        addticketRefundRequest(utid, ticketNumber).then((res) => {
          if (res.data?.isSuccess === true) {
            // window.location.reload();
            toast.success(res.data?.message);
            setIsRefund((old) => !old);
          } else {
            toast.error(res.data?.message);
          }
        });
      };
      refundReq();
    }
  };

  return (
    <div>
      {/* <Navbar></Navbar>
      <SideNavBar></SideNavBar> */}
      <ToastContainer position="bottom-right" autoClose={1500} />
      <div className=" search-panel-bg">
        <section className=""></section>
        <section className="content pb-5">
          {/* <Loading loading={loading}></Loading> */}
          <form
            className="mx-lg-5 mx-md-5 mx-sm-1 "
            encType="multipart/form-data"
            style={{ minHeight: "500px" }}
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
                    pointerEvents: isLoading ? "none" : "auto",
                  }}
                >
                  <div
                    className={
                      idxD === 0
                        ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => !isLoading && onStatusChange(0)}
                  >
                    <span
                      className={
                        idxD === 0 && "custom-border-selected-tab pb-3"
                      }
                    >
                      ALL
                    </span>
                  </div>
                  <div
                    className={
                      idxD === 6
                        ? "custom-selected-tab px-3 rounded-top py-3 fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => !isLoading && onStatusChange(6)}
                  >
                    <span
                      className={
                        idxD === 6 && "custom-border-selected-tab pb-3"
                      }
                    >
                      Ticketed
                    </span>
                  </div>
                  <div
                    className={
                      idxD === 3
                        ? "custom-selected-tab px-3 rounded-top py-3 fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    onClick={() => !isLoading && onStatusChange(3)}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={
                        idxD === 3 && "custom-border-selected-tab pb-3"
                      }
                    >
                      Booked
                    </span>
                  </div>
                  <div
                    className={
                      idxD === 4
                        ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    onClick={() => !isLoading && onStatusChange(4)}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={
                        idxD === 4 && "custom-border-selected-tab pb-3"
                      }
                    >
                      Booking Cancelled
                    </span>
                  </div>
                  <div
                    className={
                      idxD === 5
                        ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    onClick={() => !isLoading && onStatusChange(5)}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={
                        idxD === 5 && "custom-border-selected-tab pb-3"
                      }
                    >
                      Ticket Cancelled
                    </span>
                  </div>
                  <div
                    className={
                      idxD === 7
                        ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    onClick={() => !isLoading && onStatusChange(7)}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={
                        idxD === 7 && "custom-border-selected-tab pb-3"
                      }
                    >
                      Ticket Processing
                    </span>
                  </div>
                </div>
              </div>

              <div className="row p-2 py-3">
                <div className="row pb-3 gap-2">
                  <div className="col-lg-2">
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
                  <div className="col-lg-2">
                    <input
                      type={"text"}
                      value={sendObj?.uniqueTransID}
                      onChange={(e) =>
                        setSendObj({
                          ...sendObj,
                          uniqueTransID: e.target.value,
                        })
                      }
                      className="form-control border-radius"
                      placeholder="Booking ID"
                    ></input>
                  </div>
                  <div className="col-lg-2">
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
                  <div className="col-lg-2">
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
                  <div className="col-lg-3">
                    <button
                      type="button"
                      className="btn button-color fw-bold text-white border-radius filter-btn"
                      onClick={() => {
                        setIsSearch((old) => !old);
                        setCurrentPageNumber(1);
                        setfilterData(sendObj);
                        setStatusId(statusId);
                      }}
                    >
                      Apply Filter
                    </button>
                    <button
                      type="button"
                      className="btn button-secondary-color fw-bold text-white border-radius ms-2 filter-btn"
                      onClick={() => handleClearTicketing()}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table
                    className="table table-lg"
                    style={{ width: "100%", fontSize: "13px" }}
                  >
                    <thead className="text-start fw-bold bg-secondary">
                      <tr>
                        <th>REFERENCE NO</th>
                        <th>PNR</th>
                        <th>AIRLINE</th>
                        <th>ROUTE</th>
                        <th>PAX DETAILS</th>
                        <th className="text-end">AGENT PAY</th>
                        <th>UPDATED ON</th>
                        <th>STATUS</th>
                        {(idxD === 0 || idxD === 6 || idxD === 3) && (
                          <th>ACTION</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="tbody">
                      {!isLoading && ticketingList.length > 0 ? (
                        ticketingList.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="text-start fw-bold text-secondary"
                            >
                              <td className="align-middle">
                                {item.status === "Booked" ||
                                item.status === "Ticket Ordered" ||
                                item.status === "Booking Cancelled" ? (
                                  <>
                                    <a
                                      onClick={() =>
                                        handleBookedView(
                                          item.uniqueTransID,
                                          item.status
                                        )
                                      }
                                      style={{
                                        color: "#7c04c0",
                                        fontWeight: 800,
                                        cursor: "pointer",
                                      }}
                                    >
                                      {item.uniqueTransID}
                                    </a>
                                  </>
                                ) : (
                                  <>
                                    <a
                                      onClick={() =>
                                        handleViewTicket(
                                          item.uniqueTransID,
                                          item.status
                                        )
                                      }
                                      style={{
                                        color: "#7c04c0",
                                        fontWeight: 800,
                                        cursor: "pointer",
                                      }}
                                    >
                                      {item.uniqueTransID}
                                    </a>
                                  </>
                                )}
                              </td>
                              <td className="align-middle">
                                {item.status === "Booked" ||
                                item.status === "Ticket Ordered" ||
                                item.status === "Booking Cancelled" ? (
                                  <>
                                    <a
                                      href="javascript:void(0)"
                                      onClick={() =>
                                        handleBookedView(
                                          item.uniqueTransID,
                                          item.status
                                        )
                                      }
                                      style={{
                                        color: "#7c04c0",
                                        fontWeight: 800,
                                        cursor: "pointer",
                                      }}
                                    >
                                      {item.pnr}
                                    </a>
                                  </>
                                ) : (
                                  <>
                                    <a
                                      href="javascript:void(0)"
                                      onClick={() =>
                                        handleViewTicket(
                                          item.uniqueTransID,
                                          item.status
                                        )
                                      }
                                      style={{
                                        color: "#7c04c0",
                                        fontWeight: 800,
                                        cursor: "pointer",
                                      }}
                                    >
                                      {item.pnr}
                                    </a>
                                  </>
                                )}
                              </td>
                              <td className="align-middle">
                                {item?.airlineCode ?? ""}
                              </td>
                              <td className="align-middle">
                                {item?.routes ?? ""}
                              </td>
                              <td className="align-middle">
                                {item.leadPaxName}
                              </td>
                              <td className="text-end fw-bold align-middle text-dark">
                                AED{" "}
                                {item.ticketingPrice?.toLocaleString("en-US")}
                              </td>
                              <td className="align-middle">
                                {item.modifiedDate
                                  ? moment(item.modifiedDate).format(
                                      "DD-MM-YYYY HH:mm"
                                    )
                                  : "N/A"}
                              </td>
                              <td className="align-middle">
                                {item.status === "Issued" ? (
                                  <div className="mb-2">
                                    <span
                                      style={{
                                        backgroundColor: "#ecfdf3",
                                        color: "#26a36a",
                                        fontWeight: 600,
                                      }}
                                      className="px-3 py-2 rounded"
                                    >
                                      Ticketed
                                    </span>
                                  </div>
                                ) : item.status === "Booked" ? (
                                  <div className="mb-2">
                                    <span
                                      style={{
                                        backgroundColor: "#58b1bf2e",
                                        color: "#7c04c0",
                                        fontWeight: 600,
                                      }}
                                      className="px-3 py-2 rounded"
                                    >
                                      On Hold
                                    </span>
                                  </div>
                                ) : item.status === "Ticket Ordered" ? (
                                  <div className="mb-2">
                                    <span
                                      style={{
                                        backgroundColor: "#58b1bf2e",
                                        color: "#7c04c0",
                                        fontWeight: 600,
                                      }}
                                      className="px-3 py-2 rounded"
                                    >
                                      Ticket Processing
                                    </span>
                                  </div>
                                ) : (
                                  <div className="mb-2">
                                    <span
                                      style={{
                                        backgroundColor: "#fef3f2",
                                        color: "#de4639",
                                        fontWeight: 600,
                                      }}
                                      className="px-3 py-2 rounded"
                                    >
                                      {item.status}
                                    </span>
                                  </div>
                                )}{" "}
                                <div>
                                  {" "}
                                  {item.refundStatus != null
                                    ? item.refundStatus
                                    : ""}
                                </div>
                              </td>

                              {(idxD === 0 || idxD === 6 || idxD === 3) && (
                                <td className="text-left">
                                  {item.status === "Booked" ? (
                                    <>
                                      <a
                                        href="javascript:void(0)"
                                        title="Raise Support"
                                        onClick={() =>
                                          handleCancel(
                                            item.status,
                                            item.uniqueTransID,
                                            item.pnr,
                                            item.ticketNumber
                                          )
                                        }
                                      >
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          px="3"
                                          py="1"
                                          className="shadow"
                                          style={{ backgroundColor: "#444ce7" }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "10px",
                                              color: "white",
                                              width: "55px",
                                            }}
                                          >
                                            Support
                                          </span>
                                        </Button>
                                      </a>
                                    </>
                                  ) : item?.status === "Booking Expired" ? (
                                    <></>
                                  ) : item.status === "Issued" ? (
                                    <>
                                      <div
                                        style={{ width: "270px" }}
                                        className="d-flex flex-wrap justify-content-start align-items-center gap-1"
                                      >
                                        <a
                                          href="javascript:void(0)"
                                          title="View Ticket"
                                          onClick={() => {
                                            window.open(
                                              "/create-refund?uniqueTransId=" +
                                                item.uniqueTransID
                                            );
                                          }}
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            px="3"
                                            py="1"
                                            className="shadow"
                                            style={{
                                              backgroundColor: "#00b8d9",
                                            }}
                                          >
                                            <span
                                              style={{
                                                fontSize: "10px",
                                                color: "white",
                                                width: "55px",
                                              }}
                                            >
                                              Refund
                                            </span>
                                          </Button>
                                        </a>
                                        <a
                                          href="javascript:void(0)"
                                          onClick={() => {
                                            window.open(
                                              "/create-void?uniqueTransId=" +
                                                item?.uniqueTransID
                                            );
                                          }}
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            px="3"
                                            py="1"
                                            className="shadow"
                                            style={{
                                              backgroundColor: "#ed7f22",
                                            }}
                                          >
                                            <span
                                              style={{
                                                fontSize: "10px",
                                                color: "white",
                                                width: "55px",
                                              }}
                                            >
                                              Void
                                            </span>
                                          </Button>
                                        </a>
                                        {/* <a
                                          href="javascript:void(0)"
                                          title="Invoice"
                                          onClick={() => {
                                            window.open(
                                              "/create-reissue?uniqueTransId=" +
                                                item?.uniqueTransID
                                            );
                                          }}
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            px="3"
                                            py="1"
                                            className="shadow"
                                            style={{
                                              backgroundColor: "#079455",
                                            }}
                                          >
                                            <span
                                              style={{
                                                fontSize: "10px",
                                                color: "white",
                                                width: "55px",
                                              }}
                                            >
                                              Re-issue
                                            </span>
                                          </Button>
                                        </a> */}
                                        <a
                                          href="javascript:void(0)"
                                          title="Invoice"
                                          onClick={() =>
                                            handleViewInvoice(item.tnxNumber)
                                          }
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            px="3"
                                            py="1"
                                            className="shadow"
                                            style={{
                                              backgroundColor: "#7c04c0",
                                            }}
                                          >
                                            <span
                                              style={{
                                                fontSize: "10px",
                                                color: "white",
                                                width: "55px",
                                              }}
                                            >
                                              Invoice
                                            </span>
                                          </Button>
                                        </a>
                                        <a
                                          href="javascript:void(0)"
                                          title="Raise Support"
                                          onClick={() =>
                                            handleRaiseSupport(
                                              item.status,
                                              item.uniqueTransID,
                                              item.pnr,
                                              item.ticketNumber
                                            )
                                          }
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            px="3"
                                            py="1"
                                            className="shadow"
                                            style={{
                                              backgroundColor: "#444ce7",
                                            }}
                                          >
                                            <span
                                              style={{
                                                fontSize: "10px",
                                                color: "white",
                                                width: "55px",
                                              }}
                                            >
                                              Support
                                            </span>
                                          </Button>
                                        </a>
                                      </div>
                                    </>
                                  ) : item.status === "Booking Cancelled" ? (
                                    <></>
                                  ) : item.status === "Ticket Ordered" ? (
                                    <></>
                                  ) : item.status === "Ticket Cancelled" &&
                                    item.refundStatus == null ? (
                                    <></>
                                  ) : (
                                    <></>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </table>
                  {isLoading && <TableLoader />}
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
                      forcePage={currentPageNumber - 1}
                      marginPagesDisplayed={2}
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
    </div>
  );
};

export default Queues;
