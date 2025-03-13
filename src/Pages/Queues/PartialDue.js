import { Button, Center, Spinner, useDisclosure } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import ModalForm from "../../common/modalForm";
import {
  dueAmountSettlement,
  getPartialPaymentDueB2B,
} from "../../common/allApi";
import NoDataFound from "../../component/noDataFound";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import TableLoader from "../../component/tableLoader";

const PartialPaymentDue = () => {
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  let [ticketingList, setTicketingList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);

  const [idxD, setIdxD] = useState("PartialDue");
  const [status, setStatus] = useState("PartialPaid");
  let onStatusChange = (statusId) => {
    setIdxD(statusId);
    setStatus(statusId);
  };

  useEffect(() => {
    setTimeout(() => setIsTimeOut(true), 10000);
  }, []);

  let [sendObj, setSendObj] = useState({
    status: "All",
    upcomingDayCount: "800",
    airlinecode: "",
    uniqueTransID: "",
  });

  const getTicketingList = async () => {
    try {
      setLoading(true);
      const payload = { ...sendObj, pageSize, currentPageNumber };
      Object.entries(payload).map(([key, value], i) => {
        if (!value) {
          delete payload[key];
        }
      });
      const response = await getPartialPaymentDueB2B({
        params: payload,
      });
      setTicketingList(await response.data.data);
      setPageCount(await response.data.data.totalPages);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTicketingList();
  }, [currentPageNumber, pageSize]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
  };

  const handleClearTicketing = () => {
    setCurrentPageNumber(1);
    setSendObj({
      status: "All",
      upcomingDayCount: "800",
      airlinecode: "",
      uniqueTransID: "",
    });

    sendObj = {
      status: "All",
      upcomingDayCount: "800",
      airlinecode: "",
      uniqueTransID: "",
    };
    getTicketingList();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentData, setPaymentData] = useState({});

  const handelConfirmedPayment = (item) => {
    setPaymentData(item);
    onOpen();
  };

  const [loader, setLoader] = useState(false);

  const handlePayment = async () => {
    try {
      setLoader(true);
      const response = await dueAmountSettlement(
        paymentData?.uniqueTransId,
        paymentData?.dueAmount
      );
      if (response.data?.isSuccess) {
        toast.success(response.data?.message);
        getTicketingList();
        onClose();

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

  const handleViewTicket = (utid, sts) => {
    window.open("/ticket?utid=" + utid + "&sts=Confirm", "_blank");
  };

  return (
    <div>
      <form encType="multipart/form-data">
        <div className="">
          <div className="tab-content pb-3">
            <div className="tab-pane fade show active" id="tp1">
              <div classNaclassName="container-fluid bg-white">
                <div className="row my-3">
                  <div className="col-lg-2 mb-3 mb-lg-0">
                    <select
                      value={sendObj?.status}
                      className="form-select border-radius"
                      placeholder="Status Type"
                      onChange={(e) =>
                        setSendObj({
                          ...sendObj,
                          status: e.target.value,
                          upcomingDayCount: 800,
                        })
                      }
                    >
                      <option value="All"> All</option>
                      <option value="Today"> Today</option>
                      <option value="UpComing"> UpComing</option>
                      <option value="Expired"> Expired</option>
                    </select>
                  </div>
                  <div className="col-lg-2 mb-3 mb-lg-0">
                    <select
                      value={sendObj?.upcomingDayCount}
                      className="form-select border-radius"
                      placeholder="Upcoming Day"
                      disabled={sendObj?.status !== "UpComing" ? true : false}
                      onChange={(e) =>
                        setSendObj({
                          ...sendObj,
                          upcomingDayCount: e.target.value,
                        })
                      }
                    >
                      <option value=""> Select Day</option>
                      <option value="1"> 1</option>
                      <option value="2"> 2</option>
                      <option value="3"> 3</option>
                      <option value="4"> 4</option>
                      <option value="5"> 5</option>
                      <option value="6"> 6</option>
                      <option value="7"> 7</option>
                      <option value="8"> 8</option>
                    </select>
                  </div>

                  <div className="col-lg-2 mb-3 mb-lg-0">
                    <input
                      type={"text"}
                      value={sendObj?.airlinecode}
                      onChange={(e) =>
                        setSendObj({
                          ...sendObj,
                          airlinecode: e.target.value,
                        })
                      }
                      className="form-control border-radius"
                      placeholder="Enter Airline Code"
                    ></input>
                  </div>
                  <div className="col-sm-2 mb-3 mb-lg-0">
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
                  <div className="col-lg-4 ">
                    <div className="col-sm-12 ">
                      <button
                        type="button"
                        class="btn button-color fw-bold text-white border-radius filter-btn"
                        onClick={() => {
                          setCurrentPageNumber(1);
                          getTicketingList();
                        }}
                      >
                        Apply Filter
                      </button>
                      <button
                        type="button"
                        style={{ backgroundColor: "#ED7F22" }}
                        class="btn fw-bold text-white border-radius ms-2 filter-btn"
                        onClick={() => handleClearTicketing()}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table
                  className="table table-lg"
                  style={{ width: "100%", fontSize: "13px" }}
                >
                  <thead className="text-start fw-bold bg-secondary">
                    <tr>
                      <th>AGENT NAME</th>
                      <th>AGENT CODE</th>
                      <th>BOOKING ID</th>
                      <th>PNR</th>
                      <th>BOOKING DATE</th>
                      <th>AIRLINE</th>
                      <th className="text-end">TOTAL PRICE</th>
                      <th className="text-end">PERCENTAGE</th>
                      <th className="text-end">PAID AMOUNT</th>
                      <th className="text-end">DUE AMOUNT</th>
                      <th className="text-end">REMAINING DAY</th>
                      <th>LAST PAYMENT DATE</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  {!isLoading && (
                    <tbody className="tbody">
                      {ticketingList.data?.length > 0 ? (
                        ticketingList.data?.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="text-start fw-bold text-secondary"
                            >
                              <td>{item.agentName}</td>
                              <td>{item.agentCode}</td>
                              <td>
                                <a
                                  style={{
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                  }}
                                  href="javascript:void(0)"
                                  // className="text-danger fw-bold"
                                  onClick={() =>
                                    handleViewTicket(item.uniqueTransId)
                                  }
                                >
                                  {item.uniqueTransId}
                                </a>
                              </td>
                              <td
                                style={{
                                  color: "#7c04c0",
                                  fontWeight: 800,
                                }}
                              >
                                {item.pnr !== null ? item.pnr : "N/A"}
                              </td>
                              <td>
                                {moment(item.createdDate).format("DD-MM-YYYY")}
                              </td>
                              <td>{item.airlineCode}</td>
                              <td className="text-end fw-bold text-dark">
                                AED {item.totalTicketFare}
                              </td>

                              <td className="text-end fw-bold text-dark">
                                {item.percentage}%
                              </td>
                              <td className="text-end fw-bold text-dark">
                                AED {item.paidAmount?.toLocaleString("en-US")}
                              </td>
                              <td className="text-end fw-bold text-dark">
                                AED {item.dueAmount?.toLocaleString("en-US")}
                              </td>
                              <td
                                className="text-end fw-bold"
                                style={{ color: "red" }}
                              >
                                {/* {remainingDay((item.lastSettlementDate)) < 0 ? "Time expired" : remainingDay((item.lastSettlementDate))} */}
                                {moment(
                                  moment(item.lastSettlementDate).format(
                                    "DD-MMMM-YYYY"
                                  )
                                ).diff(
                                  moment().format("DD-MMMM-YYYY"),
                                  "days"
                                ) >= 0 ? (
                                  moment(
                                    moment(item.lastSettlementDate).format(
                                      "DD-MMMM-YYYY"
                                    )
                                  ).diff(
                                    moment().format("DD-MMMM-YYYY"),
                                    "days"
                                  )
                                ) : (
                                  <>Time expired</>
                                )}
                              </td>
                              <td className="fw-bold">
                                {moment(item.lastSettlementDate).format(
                                  "DD-MM-YYYY"
                                )}
                              </td>
                              <td className="text-left">
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
                                        Adjust Payment
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
                  )}
                </table>
                {isLoading && <TableLoader />}
                {ticketingList?.data?.length === 0 && !isLoading && (
                  <NoDataFound />
                )}
              </div>

              <div className="d-flex justify-content-end">
                {ticketingList?.data?.length > 0 && !isLoading && (
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
        </div>
        {/* </div>
            </div> */}
      </form>

      <ModalForm
        isOpen={isOpen}
        onClose={onClose}
        title={"Partial Payment"}
        size={"2xl"}
      >
        <div>
          <p
            style={{ fontSize: "13px ", padding: "5px" }}
            className="text-center"
          >
            Please Proceed Forward If You Want To Adjust The Pending Payment Of{" "}
            {paymentData?.agentName}({paymentData?.agentCode}) | <br></br>{" "}
            Amount:{" "}
            <sapn className="fw-bold fs-6">{paymentData?.dueAmount}</sapn> |
            Booking Id:{" "}
            <span className="fw-bold">{paymentData?.uniqueTransId}</span>
          </p>
          <div className=" pt-2 pb-4 d-flex justify-content-end">
            <button
              type="button"
              style={{ backgroundColor: "#ED7F22" }}
              class="btn  fw-bold text-white  ms-4 border-radius"
              onClick={() => onClose()}
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
    </div>
  );
};

export default PartialPaymentDue;
