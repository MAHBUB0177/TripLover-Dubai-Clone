import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { getAllQuotationForReissue } from "../../common/allApi";
import TableLoader from "../../component/tableLoader";
import NoDataFound from "../../component/noDataFound";
import ReactPaginate from "react-paginate";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import moment from "moment";

const ReissueExpired = () => {
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  let [quotationList, setQuotationList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const now = new Date();
  const [sendObj, setSendObj] = useState({
    dateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    dateTo: moment(now).format("YYYY-MM-DD"),
    status: "Expired",
    uniqueTransId: "",
    pnr: "",
  });
  const [filterData, setfilterData] = useState({
    dateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    dateTo: moment(now).format("YYYY-MM-DD"),
    status: "Expired",
  });
  const handleClearTicketing = () => {
    setCurrentPageNumber(1);
    setSendObj({
      dateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      dateTo: moment(now).format("YYYY-MM-DD"),
      status: "Expired",
      uniqueTransId: "",
      pnr: "",
    });
    setfilterData({
      dateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      dateTo: moment(now).format("YYYY-MM-DD"),
      status: "Expired",
    });
  };

  const getquotationList = async () => {
    try {
      setLoading(true);
      const response = await getAllQuotationForReissue({
        ...filterData,
        pageSize: pageSize,
        pageNo: currentPageNumber,
      });
      setQuotationList(
        response?.data?.data?.data 
        &&
          response?.data?.data?.data.filter(
            (item) => item.reissueStatus !== "Reissued" && item.reissueStatus !== "Adjusted"
          )
      );
      setPageCount(response?.data?.data?.totalPages);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };
  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
  };
  useEffect(() => {
    getquotationList();
  }, [isSearch, currentPageNumber, pageSize, filterData]);

  const handleReissuedView = (groupId, editCount) => {
    window.open(
      "/reissue-request?reissueRequestId=" +
        groupId +
        "&editCount=" +
        editCount,
      "_blank"
    );
  };

  const handleViewStatus = (sts) => {
    return sts === "Requested"
      ? "Quotation Requested"
      : sts === "Quoted"
      ? "Quoted"
      : sts === "Agent_Rejected"
      ? "Rejected by Agent"
      : sts === "Admin_Rejected"
      ? "Rejected by Admin"
      : sts === "Expired"
      ? "Quotation Expired"
      : sts === "Reissued"
      ? "Reissued"
      : sts === "Adjusted"
      ? "Completed"
      : sts;
  };

  return (
    <div className="">
      <section className=""></section>
      <section className="content pb-5">
        <ToastContainer position="bottom-right" autoClose={1500} />
        <form encType="multipart/form-data" style={{ minHeight: "500px" }}>
          <div className="container-fluid bg-white">
            <div className="">
              <div className="row p-2 py-3">
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
                <div className="col-lg-2">
                  <input
                    type={"date"}
                    pattern="\d{4}-\d{2}-\d{2}"
                    // max="9999-12-31"
                    max={new Date().toISOString().split("T")[0]}
                    value={sendObj?.dateFrom}
                    onChange={(e) =>
                      setSendObj({
                        ...sendObj,
                        dateFrom: e.target.value,
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
                    // max="9999-12-31"
                    max={new Date().toISOString().split("T")[0]}
                    value={sendObj?.dateTo}
                    onChange={(e) =>
                      setSendObj({
                        ...sendObj,
                        dateTo: e.target.value,
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
                      className="btn button-color fw-bold text-white border-radius filter-btn"
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
                      className="btn  fw-bold text-white border-radius ms-2 filter-btn"
                      onClick={() => handleClearTicketing()}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <div className="row"></div>
            </div>
          </div>

          <div className="table-responsive">
            <table
              className="table table-lg"
              style={{ width: "100%", fontSize: "13px" }}
            >
              <thead className="text-start fw-bold bg-secondary">
                <tr>
                  <th>PNR </th>
                  <th>BOOKING ID</th>
                  <th>TICKET NUMBER</th>
                  <th>STATUS</th>
                  <th>REMARKS</th>
                  <th>CREATED AT</th>
                  <th>EXPIRE AT</th>
                  <th className="text-end">BASE PRICE DIFFERENCE</th>
                  <th className="text-end">TAX PRICE DIFFERENCE</th>
                  <th className="text-end">AIRLINE FEE</th>
                  <th className="text-end">SERVICE CHARGE</th>
                  <th className="text-end">FARE DIFFERENCE</th>
                  <th className="text-end">TOTAL REISSUE AMOUNT</th>
                </tr>
              </thead>
              {!isLoading && (
                <tbody className="tbody">
                  {quotationList?.length > 0 ? (
                    quotationList?.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="text-start fw-bold text-secondary"
                        >
                          <td
                            style={{
                              color: "#7c04c0",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleReissuedView(item.requestId, item.editCount)
                            }
                          >
                            {item?.supplierPNR}
                          </td>
                          <td
                            style={{
                              color: "#7c04c0",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleReissuedView(item.requestId, item.editCount)
                            }
                          >
                            {item.bookingId}
                          </td>
                          <td
                            style={{
                              color: "#7c04c0",
                              fontWeight: 800,
                            }}
                          >
                            {item.ticketNumbers}
                          </td>
                          <td>
                            {" "}
                            <div className="mb-2">
                              <span
                                style={{
                                  backgroundColor: "#ecfdf3",
                                  color: "#26a36a",
                                  fontWeight: 600,
                                }}
                                className="px-3 py-2 rounded"
                              >
                                {handleViewStatus(
                                  item?.reissueStatus,
                                  quotationList
                                )}
                              </span>
                            </div>
                          </td>
                          <td>
                            {" "}
                            {item?.adminRemarks
                              ? item?.adminRemarks
                              : "N/A"}
                          </td>
                          <td>
                            {moment(item.createdDate).format("DD-MM-YYYY")}
                          </td>

                          <td>
                            {moment(item.expireDate).format("DD-MM-YYYY")}
                          </td>

                          <td className="text-end fw-bold text-dark">
                            AED{" "}
                            {item?.basePriceDifference.toLocaleString("en-US")}
                          </td>
                          <td className="text-end fw-bold text-dark">
                            AED{" "}
                            {item?.taxPriceDifference.toLocaleString("en-US")}
                          </td>

                          <td className="text-end fw-bold text-dark">
                            AED {item?.airlineFee.toLocaleString("en-US")}
                          </td>
                          <td className="text-end fw-bold text-dark">
                            AED {item?.serviceCharge.toLocaleString("en-US")}
                          </td>
                          <td className="text-end fw-bold text-dark">
                            AED {item?.fareDifference.toLocaleString("en-US")}
                          </td>
                          <td className="text-end fw-bold text-dark">
                            AED{" "}
                            {item?.totalReissueAmount.toLocaleString("en-US")}
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
            {quotationList?.length === 0 && !isLoading && <NoDataFound />}
          </div>

          <div className="d-flex justify-content-end">
            {quotationList?.length > 0 && !isLoading && (
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
        </form>
      </section>
    </div>
  );
};

export default ReissueExpired;
