import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  getAgentCancellationSummaryByID,
  getSupplierLists,
} from "../../common/allApi";
import ReactPaginate from "react-paginate";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import NoDataFound from "../noDataFound";
import TableLoader from "../tableLoader";
import { useNavigate } from "react-router-dom";

const now = new Date();

const tableHeaders = [
  // { label: "AGENT ID" },
  // { label: "SUPPLIER NAME" },
  { label: "PLATING CARRIER" },
  { label: "TOTAL BOOKING COUNT" },
  { label: "CANCELLED BOOKING COUNT" },
  { label: "CANCELLATION RATIO" },
];

const HighCancellation = () => {
  const agentID = JSON.parse(sessionStorage.getItem("agentId"));
  const isAgent = JSON.parse(sessionStorage.getItem("isAgent"));
  const navigate = useNavigate();

  const [sendObj, setSendObj] = useState({
    fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    toDate: moment(now).format("YYYY-MM-DD"),
    apiId: "",
    airlineCode: "",
  });

  const [response, setResponse] = useState({});
  const [filterData, setfilterData] = useState({
    fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    toDate: moment(now).format("YYYY-MM-DD"),
    apiId: "",
    airlineCode: "",
  });
  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize] = useState(10);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [optionsData, setOptionsData] = useState([]);

  useEffect(() => {
    getSelectsData();
  }, []);

  useEffect(() => {
    if (isAgent) {
      const payload = {
        ...filterData,
        pageSize,
        pageNumber: currentPageNumber,
        agentId: agentID,
      };
      getAgentCancellationData(payload);
    } else {
      navigate("/search");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearch, currentPageNumber, pageSize, filterData, isAgent]);

  const getAgentCancellationData = async (payload) => {
    try {
      setLoading(true);
      const res = await getAgentCancellationSummaryByID(payload);

      setResponse(res?.data?.data);
      setPageCount(res.data?.data?.totalPages);
      // if (process.env.NODE_ENV === "development") console.log(res, "from success response");
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.log(` from error response`, error);
    } finally {
      // if (process.env.NODE_ENV === "development") setResponse(DATA.data);
      setLoading(false);
    }
  };

  const getSelectsData = async () => {
    try {
      const res = await getSupplierLists();
      const { data = [] } = res;
      setOptionsData(data || []);
    } catch (error) {}
  };

  const handleResetForm = () => {
    setCurrentPageNumber(1);
    setSendObj({
      fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      toDate: moment(now).format("YYYY-MM-DD"),
      apiId: "",
      airlineCode: "",
    });
    setfilterData({
      fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      toDate: moment(now).format("YYYY-MM-DD"),
      apiId: "",
      airlineCode: "",
    });
  };

  const handlePageClick = async (data) => {
    const currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
  };

  const handleBookingClickMethod = (isCancellationList = true, item = {}) => {
    const { agentId, platingCarrier, supplierName } = item || {};
    const { toDate, fromDate } = sendObj;

    const url =
      `/cancellation-lists?isCancellationList=${isCancellationList}` +
      `&agentId=${agentId}` +
      `&platingCarrier=${platingCarrier}` +
      `&supplierName=${encodeURIComponent(supplierName || "")}` +
      `&fromDate=${fromDate || ""}` +
      `&toDate=${toDate || ""}`;

    return window.open(url, "_blank");
  };

  // console.log(sendObj, "sendObj", filterData);

  return (
    <div>
      <div className="row p-2 py-3">
        <div className="container-fluid bg-white">
          <div className="row my-3">
            <div className="col-sm-2 mb-3 mb-lg-0">
              <input
                type={"text"}
                value={sendObj?.airlineCode}
                onChange={(e) =>
                  setSendObj({
                    ...sendObj,
                    airlineCode: e.target.value,
                  })
                }
                className="form-control border-radius"
                placeholder="Airline code (Plating carrier)"
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
            {/* <div className="col-sm-2 mb-3 mb-lg-0">
                            <select
                                name="apiId"
                                value={sendObj?.apiId}
                                className="form-select border-radius"
                                placeholder="Select supplier"
                                defaultValue={""}
                                onChange={(event) => {
                                    setSendObj({
                                        ...sendObj,
                                        [event.target.name]: event.target.value,
                                    });
                                }}
                            >
                                <option value="" selected disabled>
                                    Select supplier
                                </option>
                                {optionsData?.map((option) => (
                                    <option key={option.value} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}

            <div className="col-lg-4 d-flex align-items-center justify-content-center">
              <div className="col-sm-12 pt-0">
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
                  onClick={() => handleResetForm()}
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
                {tableHeaders?.map(({ label }) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="tbody">
              {!isLoading && response?.data?.length
                ? response?.data.map((item, index) => {
                    const {
                      //   agentId,
                      //   supplierName,
                      platingCarrier,
                      totalBookingCount,
                      cancelledBookingCount,
                      cancellationRatio,
                    } = item;
                    return (
                      <tr
                        key={index}
                        className="text-start fw-bold text-secondary"
                      >
                        {/* <td>{agentId}</td>
                                              <td>{supplierName}</td> */}
                        <td>{platingCarrier}</td>
                        <td>
                          <div
                            style={{
                              cursor: totalBookingCount ? "pointer" : "default",
                              display: "inline-block",
                              color: "#068b9f",
                            }}
                            onClick={() =>
                              totalBookingCount
                                ? handleBookingClickMethod(false, item)
                                : null
                            }
                          >
                            {totalBookingCount}
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              cursor: cancelledBookingCount
                                ? "pointer"
                                : "default",
                              display: "inline-block",
                              color: "#068b9f",
                            }}
                            onClick={() =>
                              cancelledBookingCount
                                ? handleBookingClickMethod(true, item)
                                : null
                            }
                          >
                            {cancelledBookingCount}
                          </div>
                        </td>

                        <td>{cancellationRatio}</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>

          {!response?.data?.length && !isLoading ? <NoDataFound /> : null}
          {isLoading ? <TableLoader /> : null}
        </div>

        <div className="d-flex justify-content-end">
          {response?.data?.length && !isLoading ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HighCancellation;
