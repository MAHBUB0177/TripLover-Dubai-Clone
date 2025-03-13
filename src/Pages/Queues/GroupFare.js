import { Button, useDisclosure } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import {
  fulfillPartialPaymentB2b,
  getBookingData,
  getGroupfarelistData,
  getsototicketData,
} from "../../common/allApi";
import TableLoader from "../../component/tableLoader";
import NoDataFound from "../../component/noDataFound";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import ModalForm from "../../common/modalForm";
import FarePassengerList from "./farePassengerList";
import { toast, ToastContainer } from "react-toastify";

const GroupFare = () => {
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(50);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  let [ticketingList, setTicketingList] = useState([]);

  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [isTimeOut, setIsTimeOut] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [passengerData, setPassengerData] = useState([]);

  useEffect(() => {
    setTimeout(() => setIsTimeOut(true), 10000);
  }, []);

  const now = new Date();
  const [sendObj, setSendObj] = useState({
    fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    toDate: moment(now).format("YYYY-MM-DD"),
    bookingId: "",
    pnr: "",
  });

  const [filterData, setfilterData] = useState({
    fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    toDate: moment(now).format("YYYY-MM-DD"),
    bookingId: "",
    pnr: "",
  });

  const getTicketingList = async () => {
    const params = {
      fromDate: filterData?.fromDate,
      toDate: filterData?.toDate,
      bookingId: filterData?.bookingId,
      pnr: filterData?.pnr,
    };
    try {
      setLoading(true);
      const response = await getGroupfarelistData(
        params,
        currentPageNumber,
        pageSize
      );
      if (response?.data?.isSuccess) {
        setTicketingList(await response?.data?.data);
        setPageCount(await response?.data?.totalPages);
        setLoading(false);
      } else {
        setTicketingList([]);
        setPageCount(0);
        setLoading(false);
      }
    } catch {
      setTicketingList([]);
      setPageCount(0);
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
      bookingId: "",
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
      pnr: "",
      bookingId: "",
    });
  };

  const statusFilter = (status) => {
    return status === 0
      ? "On Hold"
      : status === 1
      ? "Cancelled"
      : status === 2
      ? "Ticketed"
      : status === 3
      ? "Partially Paid"
      : status;
  };
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const [paymentData, setPaymentData] = useState({});

  const handelConfirmedPayment = (item) => {
    setPaymentData(item);
    onOpen1();
  };
  const [loader, setLoader] = useState(false);

  const handlePayment = async () => {
    try {
      setLoader(true);
      const response = await fulfillPartialPaymentB2b({
        bookingId: paymentData?.bookingId,
      });
      if (response.data?.isSuccess) {
        toast.success(response.data?.message);
        getTicketingList();
        onClose1();

        setLoader(false);
      } else {
        setLoader(false);
        toast.error(response.data?.message);
      }
    } catch {
      setLoader(false);
      toast.error("Please try again!");
    }
  };
  const [idxD, setIdxD] = useState("GroupFare");
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
          <form className="mx-lg-5 mx-md-5 mx-sm-1 ">
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
                      idxD === "GroupFare"
                        ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        : "fs-6 px-3 py-3 fw-bold text-black"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onStatusChange("GroupFare")}
                  >
                    <span
                      className={
                        idxD === "GroupFare" &&
                        "custom-border-selected-tab pb-3"
                      }
                    >
                      Group Fare
                    </span>
                  </div>
                </div>
              </div>

              <div className="row p-2 py-3">
                <div className="container-fluid bg-white ms-1">
                  <div class="">
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
                          value={sendObj?.bookingId}
                          onChange={(e) =>
                            setSendObj({
                              ...sendObj,
                              bookingId: e.target.value,
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
                      <div className="col-lg-4">
                        <div className="col-sm-12 ">
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
                </div>

                <div
                // style={{ overflowX: "scroll", marginBottom: "16px" }}
                >
                  <table
                    className="table table-responsive  table-lg"
                    style={{ width: "100%", fontSize: "13px" }}
                  >
                    <thead className="text-start fw-bold bg-secondary">
                      <tr>
                        <th>BOOKING DATE</th>
                        <th>BOOKING ID</th>
                        <th className="text-start">PASSENGER NAME</th>
                        <th>TRIP TYPE</th>
                        <th>FLIGHT DATE</th>
                        <th>ROUTE</th>
                        <th>PNR</th>
                        <th>TOTAL PASSENGER</th>
                        <th className="text-end">TOTAL PRICE</th>
                        <th>REMARKS</th>
                        <th>STATUS</th>
                        <th>PASSENGER LIST</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="tbody">
                      {isLoading ? (
                        <tr>
                          <td colSpan="13" style={{ textAlign: "center" }}>
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
                                {moment(item.bookingTime).format("DD-MM-YYYY")}
                              </td>
                              <td className="text-center text-danger">
                                <a href="javascript:void(0)">
                                  {item.bookingId}
                                </a>
                              </td>
                              <td className="text-start">
                                {item.passengers[0]?.title}{" "}
                                {item.passengers[0]?.first}{" "}
                                {item.passengers[0]?.last}
                              </td>

                              <td className="text-center text-danger">
                                {item.tripType}
                              </td>
                              <td className="text-center">
                                {moment(item.departureTimes[0]).format(
                                  "DD-MM-YYYY"
                                )}
                              </td>
                              <td className="text-center">
                                {item.simplifiedRoute}
                              </td>
                              <td className="text-center">{item?.pnr}</td>
                              <td className="text-center">
                                {item?.totalNumberOfPassengers}
                              </td>
                              <td className="text-end fw-bold">
                                {item?.totalPrice?.toLocaleString("en-US")}
                              </td>
                              <td className="text-center">
                                {item?.agentRemarks ?? "N/A"}
                              </td>
                              <td className="text-center">
                                {statusFilter(item?.status)}
                              </td>
                              <td className="text-center">
                                <div className="d-flex justify-content-center">
                                  {/* <IoEye
                                          style={{
                                            color: "green",
                                            height: "20px",
                                            width: "20px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            onOpen();
                                            setPassengerData(item?.passengers);
                                          }}
                                        /> */}
                                  <Button
                                    onClick={() => {
                                      onOpen();
                                      setPassengerData(item?.passengers);
                                    }}
                                    variant="outline"
                                    size="sm"
                                    // borderRadius="16px"
                                    p="2"
                                    className="shadow"
                                    style={{
                                      backgroundColor: "#00B8D9",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "white",
                                      }}
                                    >
                                      View Details
                                    </span>
                                  </Button>
                                </div>
                              </td>
                              <td className="text-center">
                                {item?.status === 3 ? (
                                  <>
                                    <a
                                      href="javascript:void(0)"
                                      title="Adjust Payment"
                                      onClick={() => {
                                        handelConfirmedPayment(item);
                                      }}
                                    >
                                      <Button
                                        variant="outline"
                                        size="xsm"
                                        borderRadius="16px"
                                        p="1"
                                        className="shadow"
                                        style={{
                                          backgroundColor: "#7c04c0",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: "10px",
                                            color: "white",
                                          }}
                                        >
                                          Adjust Payment
                                        </span>
                                      </Button>
                                    </a>
                                  </>
                                ) : (
                                  <>N/A</>
                                )}
                              </td>
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
          <ModalForm isOpen={isOpen} onClose={onClose} title={"Passenger List"}>
            <FarePassengerList passengerData={passengerData} />
          </ModalForm>
          <ModalForm
            isOpen={isOpen1}
            onClose={onClose1}
            title={"Partial Payment"}
            size={"2xl"}
          >
            <div>
              <p
                style={{ fontSize: "13px ", padding: "5px" }}
                className="text-center"
              >
                Please Proceed Forward If You Want To Adjust The Pending Payment
                Of {paymentData?.agentName}({paymentData?.agentCode}) |{" "}
                <br></br> Amount:{" "}
                <sapn className="fw-bold fs-6">
                  {paymentData?.totalPrice - (paymentData?.paidPrice ?? 0)}
                </sapn>{" "}
                | Booking Id:{" "}
                <span className="fw-bold">{paymentData?.bookingId}</span>
              </p>
              <div className=" pt-2 pb-4 d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-secondary fw-bold text-white  ms-4 border-radius"
                  onClick={() => onClose1()}
                  disabled={loader === true ? true : false}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn button-color fw-bold text-white ms-1 border-radius"
                  onClick={() => handlePayment()}
                  disabled={loader === true ? true : false}
                >
                  Submit
                </button>
              </div>
            </div>
          </ModalForm>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default GroupFare;
