import { Button, Center, Spinner } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import Footer from "../SharePages/Footer/Footer";
import { getBookingData, getLimit } from "../../common/allApi";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import NoDataFound from "../../component/noDataFound";
import TableLoader from "../../component/tableLoader";

const Booked = () => {
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(50);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  let [ticketingList, setTicketingList] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

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

  const getTicketingList = async () => {
    try {
      setLoading(true);
      const response = await getBookingData({
        agentId: sessionStorage.getItem("agentId") ?? 0,
        status: "Booked",
        ...filterData,
      }, currentPageNumber, pageSize)
      //ticketingList= response.data;
      setTicketingList(await response.data.data);
      setPageCount(await response.data.totalPages);

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };
  useEffect(() => {

    getTicketingList();
  }, [isSearch, currentPageNumber, pageSize, filterData]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
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
    });
    setfilterData({
      fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      toDate: moment(now).format("YYYY-MM-DD"),
    });
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
        "/support?typeid=1&subjectid=1&utid=" +
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
    let status = sts === "Booked" ? "Confirmed" : "Cancelled";
    window.open("/bookedview?utid=" + utid + "&sts=" + status, "_blank");
  };

  const handleBookedView = (utid, sts) => {
    let status = sts === "Booked" ? "Confirmed" : "Cancelled";
    window.open("/bookedview?utid=" + utid + "&sts=" + status, "_blank");
  };

  const [isLoad, setIsLoad] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);



  const handleGetTime = (referenceLog, index) => {
    setIsLoad(true);
    setLoadingIndex(index);
    const getTimeReq = async () => {
      try {
        const res = await getLimit(JSON.parse(referenceLog));
        if (
          res.data.item1 &&
          (res.data.item1.lastTicketTime || res.data.item1.remarks)
        ) {
          getTicketingList();
        } else {
          toast.error("Please try again after five minutes.");
          setTimeout(() => {
            setIsLoad(false);

          }, 2000)
        }
      } catch (error) {
        toast.error("Please try again after five minutes.");
        setTimeout(() => {
          setIsLoad(false);

        }, 2000)
      }
    };
    getTimeReq();
  };


  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content pb-5">
          <ToastContainer position="bottom-right" autoClose={1500} />
          <form
            className="mx-lg-5 mx-md-5 mx-sm-1 mt-3"
            encType="multipart/form-data"
            style={{ minHeight: "500px" }}
          >
            <div className="card">
              <div className="card-body">
                <div className="m-4">
                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="tp1">
                      <span className="fs-4">On Hold Bookings</span>
                      <hr className="mb-3" />

                      {/* //filter start */}

                      <div
                        className="row"
                        style={{ width: "100%", paddingBottom: "5px" }}
                      >
                        <div className="card card-body">
                          <div className="row my-3">
                            <div className="col-lg-3">
                              <label>GDS PNR</label>
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
                            <div className="col-lg-3">
                              <label>Booking ID</label>
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
                            <div className="col-lg-3">
                              <label>From Date</label>
                              <input
                                type={"date"}
                                pattern="\d{4}-\d{2}-\d{2}"
                                max="9999-12-31"
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
                            <div className="col-lg-3">
                              <label>To Date</label>
                              <input
                                type={"date"}
                                pattern="\d{4}-\d{2}-\d{2}"
                                max="9999-12-31"
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
                          </div>

                          <div className="row">
                            <div
                              className="col-sm-12 text-right"
                              style={{ paddingTop: "2em" }}
                            >
                              <button
                                type="button"
                                className="btn bg-secondary fw-bold text-white border-radius"
                                onClick={() => handleClearTicketing()}
                              >
                                Clear
                              </button>
                              <button
                                type="button"
                                className="btn button-color fw-bold text-white ms-2 border-radius"
                                onClick={() => {
                                  setIsSearch((old) => !old);
                                  setCurrentPageNumber(1);
                                  setfilterData(sendObj);
                                }}
                              >
                                Search
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* //filter end */}
                      <div
                        style={{ overflowX: "scroll", marginBottom: "16px" }}
                      >
                        <table
                          className="table text-center table-bordered  table-sm"
                          style={{ width: "100%", fontSize: "13px" }}
                        >
                          <thead className="text-center fw-bold bg-secondary">
                            <tr>
                              <th>Booking Date</th>
                              <th>Booking ID</th>
                              <th className="text-start">Passenger Name</th>
                              <th>Flight Date</th>
                              <th>Route</th>
                              <th>PNR</th>
                              <th>Issue Before</th>
                              <th className="text-end">Total Price</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          {
                            !isLoading && <tbody className="tbody">
                              {ticketingList.length > 0 ? (
                                ticketingList.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        {moment(item.bookingDate).format(
                                          "DD-MM-YYYY HH:mm"
                                        )}
                                      </td>
                                      <td>
                                        <a
                                          href="javascript:void(0)"
                                          onClick={() =>
                                            handleViewTicket(
                                              item.uniqueTransID,
                                              item.status
                                            )
                                          }
                                          className="text-danger"
                                        >
                                          {item.uniqueTransID}
                                        </a>
                                      </td>
                                      <td className="text-start">
                                        {item.leadPaxName}
                                      </td>
                                      <td>
                                        {item.departure != null ? (
                                          moment(item.departure).format(
                                            "DD-MM-YYYY HH:mm"
                                          )
                                        ) : (
                                          <></>
                                        )}
                                      </td>
                                      <td>
                                        {item?.routes ?? ""}
                                      </td>

                                      <td>
                                        <a
                                          href="javascript:void(0)"
                                          onClick={() =>
                                            handleViewTicket(
                                              item.uniqueTransID,
                                              item.status
                                            )
                                          }
                                          className="text-danger"
                                        >
                                          {item.pnr}
                                        </a>
                                      </td>
                                      <td style={{ color: "red" }} >
                                        {item.lastTicketTimeNote !==
                                          undefined &&
                                          item.lastTicketTimeNote !== null ? (
                                          item.lastTicketTimeNote
                                        ) : (
                                          <Button
                                            isLoading={
                                              isLoad && loadingIndex === index
                                            }
                                            onClick={() =>
                                              handleGetTime(
                                                item.referenceLog,
                                                index
                                              )
                                            }
                                            loadingText="Loading"
                                            _hover={"none"}
                                            className="text-white shadow fw-bold"
                                            style={{
                                              background: "#7c04c0",
                                              fontSize: "10px",
                                              height: "25px",
                                              borderRadius: "20px"
                                            }}
                                            variant="outline"
                                            spinnerPlacement="start"
                                          >
                                            Time Limit
                                          </Button>
                                        )}
                                      </td>

                                      <td className="text-end fw-bold">
                                        {item.ticketingPrice?.toLocaleString(
                                          "en-US"
                                        )}
                                      </td>
                                      <td>
                                        {item.status === "Booked"
                                          ? "On Hold"
                                          : " "}{" "}
                                        <br />{" "}
                                        {item.refundStatus != null
                                          ? "Refund " + item.refundStatus
                                          : ""}
                                      </td>
                                      <td className="text-center">
                                        <>
                                          <a
                                            href="javascript:void(0)"
                                            title="View Booking"
                                            onClick={() =>
                                              handleBookedView(
                                                item.uniqueTransID,
                                                item.status
                                              )
                                            }
                                          >
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              borderRadius="16px"
                                              p="1"
                                              className="shadow"
                                              style={{ backgroundColor: "#7c04c0" }}
                                            >
                                              <span
                                                style={{ fontSize: "10px", color: "white" }}
                                              >
                                                VB
                                              </span>
                                            </Button>
                                          </a>
                                          &nbsp;{" "}
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
                                              borderRadius="16px"
                                              p="1"
                                              className="shadow"
                                              style={{ backgroundColor: "#ed7f22" }}
                                            >
                                              <span
                                                style={{ fontSize: "10px", color: "white" }}
                                              >
                                                RS
                                              </span>
                                            </Button>
                                          </a>

                                        </>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <></>
                              )}
                            </tbody>
                          }

                        </table>
                        {
                          isLoading && <TableLoader />
                        }
                        {
                          ticketingList?.length === 0 && !isLoading && <NoDataFound />
                        }
                      </div>
                      {
                        ticketingList?.length > 0 && !isLoading && <ReactPaginate
                          previousLabel={<MdOutlineSkipPrevious style={{ fontSize: "18px" }} color="#ed8226" />}
                          nextLabel={<MdOutlineSkipNext style={{ fontSize: "18px" }} color="#ed8226" />}
                          breakLabel={"..."}
                          pageCount={pageCount}
                          forcePage={currentPageNumber - 1}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={3}
                          onPageChange={handlePageClick}
                          containerClassName={"pagination justify-content-center py-2"}
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
                      }
                    </div>
                  </div>
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

export default Booked;
