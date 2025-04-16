import React, { useEffect, useState } from "react";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { ISODateFormatter } from "../../common/functions";
import { getHighCancellationBookingLists } from "../../common/allApi";
import ReactPaginate from "react-paginate";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import NoDataFound from "../../component/noDataFound";
import TableLoader from "../../component/tableLoader";
import moment from "moment";

const tableHeaders = [
    { label: "CREATED AT" },
    { label: "JOURNEY TYPE" },
    { label: "ROUTES" },
    { label: "BOOKING ID" },
    // { label: "UNIQUE TRANSITION ID" },
    { label: "PNR" },
    { label: "SECTOR" },
];

const now = new Date();

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const CancellationLists = () => {
    // const agentID = JSON.parse(sessionStorage.getItem("agentId"));
    const isAgent = JSON.parse(sessionStorage.getItem("isAgent"));
    const navigate = useNavigate();
    const query = useQuery();

    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({});
    const [pageCount, setPageCount] = useState(0);
    const [pageSize] = useState(10);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);

    useEffect(() => {
        const isCancellationList = query.get("isCancellationList");
        const agentId = query.get("agentId");
        const platingCarrier = query.get("platingCarrier");
        const supplierName = query.get("supplierName");
        const fromDate = query.get("fromDate");
        const toDate = query.get("toDate");

        if (!isCancellationList || !["true", "false"].includes(isCancellationList)) {
            console.error("Invalid or missing 'isCancellationList' query parameter.");
            return;
        }

        const isCancelledBookingList = isCancellationList === "true";

        if (!agentId || isNaN(Number(agentId))) {
            console.error("Invalid or missing 'agentId' query parameter.");
            return;
        }

        if (isAgent) {
            const payload = {
                agentId: agentId ?? null,
                supplierName: supplierName || "",
                platingCarrier: platingCarrier || "",
                fromDate: fromDate || ISODateFormatter(new Date(now.getFullYear(), now.getMonth(), 1)),
                toDate: toDate || ISODateFormatter(now),
                IsCancellationList: isCancelledBookingList,
                pageNumber: currentPageNumber || 1,
                pageSize: pageSize || 10,
            };

            getCancellationBookingLists(payload);
        } else {
            navigate(`/search`);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAgent, currentPageNumber, query.toString()]);

    const getCancellationBookingLists = async (payload = {}) => {
        try {
            setLoading(true);
            const res = await getHighCancellationBookingLists(payload);
            setResponse(res.data?.data);
            setPageCount(res.data?.data?.totalPages);
            // if (process.env.NODE_ENV === "development") console.log(res, "from success response");
        } catch (error) {
            console.log(` from error response`, error);
        } finally {
            // if (process.env.NODE_ENV === "development") setResponse(DATA.data);
            setLoading(false);
        }
    };

    const handlePageClick = async (data) => {
        const currentPage = data.selected + 1;
        setCurrentPageNumber(currentPage);
    };

    return (
        <>
            <div>
                <Navbar></Navbar>
                <SideNavBar></SideNavBar>
                <div className="content-wrapper search-panel-bg px-4 pb-5">
                    <section className="content-header"></section>
                    <section className="content">
                        <ToastContainer position="bottom-right" autoClose={1500} />
                        <form className="mx-lg-5 mx-md-5 mx-sm-1 mt-3 shadow-sm bg-white px-3 py-3">
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
                                        {!loading && response?.data?.length
                                            ? response?.data.map((item, index) => {
                                                  const {
                                                      createdDate,
                                                      journeyType,
                                                      route,
                                                      id,
                                                      uniqueTransactionId,
                                                      pnr,
                                                      sector,
                                                  } = item;
                                                  return (
                                                      <tr key={index} className="text-start fw-bold text-secondary">
                                                          <td>
                                                              {createdDate
                                                                  ? moment(createdDate).format("DD-MM-YYYY HH:mm")
                                                                  : "N/A"}
                                                          </td>
                                                          <td>{journeyType}</td>
                                                          <td>{route}</td>
                                                          {/* <td>{id}</td> */}
                                                          <td>{uniqueTransactionId}</td>
                                                          <td>{pnr}</td>
                                                          <td>{sector}</td>
                                                      </tr>
                                                  );
                                              })
                                            : null}
                                    </tbody>
                                </table>

                                {!response?.data?.length && !loading ? <NoDataFound /> : null}
                                {loading ? <TableLoader /> : null}
                            </div>

                            <div className="d-flex justify-content-end">
                                {response?.data?.length && !loading ? (
                                    <ReactPaginate
                                        previousLabel={
                                            <div className="d-flex align-items-center gap-1">
                                                <MdOutlineSkipPrevious style={{ fontSize: "18px" }} color="#ed8226" />{" "}
                                                Prev
                                            </div>
                                        }
                                        nextLabel={
                                            <div className="d-flex align-items-center gap-1">
                                                <MdOutlineSkipNext style={{ fontSize: "18px" }} color="#ed8226" />
                                                Next
                                            </div>
                                        }
                                        breakLabel={"..."}
                                        pageCount={pageCount}
                                        forcePage={currentPageNumber - 1}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handlePageClick}
                                        containerClassName={"pagination justify-content-center py-2 border rounded"}
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
                        </form>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default CancellationLists;
