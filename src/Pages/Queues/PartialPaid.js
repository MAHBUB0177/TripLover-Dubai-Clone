import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { partialpaidinfoB2B } from "../../common/allApi";
import NoDataFound from "../../component/noDataFound";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import TableLoader from "../../component/tableLoader";

const PartialPaid = () => {
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  let [ticketingList, setTicketingList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsTimeOut(true), 10000);
  }, []);

  const now = new Date();
  let [sendObj, setSendObj] = useState({
    fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    toDate: moment(now).format("YYYY-MM-DD"),
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
      const response = await partialpaidinfoB2B({ params: payload });
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

  const handleClearTicketing = async () => {
    setCurrentPageNumber(1);
    setSendObj({
      fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      toDate: moment(now).format("YYYY-MM-DD"),
      airlinecode: "",
      uniqueTransID: "",
    });
    sendObj = {
      fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      toDate: moment(now).format("YYYY-MM-DD"),
      airlinecode: "",
      uniqueTransID: "",
    };
    getTicketingList();
  };

  const handleViewTicket = (utid, sts) => {
    window.open("/ticket?utid=" + utid + "&sts=Confirm", "_blank");
  };

  return (
    <div>
      <form encType="multipart/form-data">
        <div className="tab-content pb-3">
          <div className="tab-pane fade show active" id="tp1">
            <div className="container-fluid bg-white">
              <div className="row my-3">
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
                <div className="col-lg-2 mb-3 mb-lg-0">
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
                <div className="col-lg-2 mb-3 mb-lg-0">
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
                <div className="col-lg-2 mb-3 mb-lg-0">
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
                <div className="col-lg-4">
                  <div className="col-sm-12 ">
                    <button
                      type="button"
                      class="btn button-color fw-bold text-white  border-radius filter-btn"
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
                    <th>AGENT NAME</th>
                    <th>AGENT CODE</th>
                    <th>BOOKING ID</th>
                    <th>PNR</th>
                    <th>BOOKING DATE</th>
                    <th>AIRLINE</th>
                    <th className="text-end">TOTAL PRICE</th>
                    <th className="text-end">PERCENTAGE</th>
                    <th className="text-end">PAID AMOUNT</th>
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

              {ticketingList.data?.length === 0 && !isLoading && (
                <NoDataFound />
              )}
            </div>

            <div className="d-flex justify-content-end">
              {ticketingList.data?.length > 0 && !isLoading && (
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
    </div>
  );
};

export default PartialPaid;
