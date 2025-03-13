import React, { useEffect, useState } from "react";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavbar from "../SharePages/SideNavBar/SideNavBar";
import currentYear from "../SharePages/Utility/currentYear";
import { environment } from "../SharePages/Utility/environment";
import moment from "moment";
import ReactPaginate from "react-paginate";
import Footer from "../SharePages/Footer/Footer";
import { Center, Spinner } from "@chakra-ui/react";
import { GetcreditnoteList } from "../../common/allApi";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import TableLoader from "../../component/tableLoader";
import NoDataFound from "../../component/noDataFound";

const CreditNotes = () => {
  const [creditNoteList, setCreditNoteList] = useState([]);
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [isTimeOut, setIsTimeOut] = useState(false);

  const getCreditNotes = async (currentPageNumber) => {
    setIsTimeOut(true);
    GetcreditnoteList(
      sessionStorage.getItem("agentId") ?? 0,
      currentPageNumber,
      pageSize
    ).then((response) => {
      setCreditNoteList(response.data.data);
      setPageCount(response.data.totalPages);
      setIsTimeOut(false);
    });
  };
  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
    getCreditNotes(currentPage);
  };
  const handleViewTicket = (utid) => {
    window.open("/ticket?utid=" + utid + "&sts=Cancelled", "_blank");
  };
  useEffect(() => {
    getCreditNotes(currentPageNumber);
  }, [currentPageNumber]);
  return (
    <div>
      <div className="table-responsive pt-2">
        <table
          className="table table-lg"
          style={{ width: "100%", fontSize: "13px" }}
        >
          <thead className="text-start fw-bold bg-secondary">
            <tr>
              <th>PNR</th>
              <th className="text-end">AMOUNT</th>
              <th>REFERENCE</th>
              <th>CREATE DATE</th>
              <th>ADJUSTMENT DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          {!isTimeOut && (
            <tbody className="tbody text-center">
              {creditNoteList.map((item, index) => {
                return (
                  <tr className="text-start fw-bold text-secondary">
                    <td
                      style={{
                        color: "#7c04c0",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {item.pnr}
                    </td>
                    <td className="text-end text-dark">
                      {item.currencyName}{" "}
                      {item.refundAmount?.toLocaleString("en-US")}
                    </td>
                    <td
                      style={{
                        color: "#7c04c0",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {item.uniqueTransID ?? "N/A"}
                    </td>
                    <td>{moment(item.createdDate).format("DD-MM-yyyy")}</td>
                    <td>{moment(item.adjustmentDate).format("DD-MM-yyyy")}</td>
                    <td>
                      <div className="mb-2">
                        <span
                          style={{
                            backgroundColor: "#ecfdf3",
                            color: "#26a36a",
                            fontWeight: 600,
                          }}
                          className="px-3 py-2 rounded"
                        >
                          {item.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
      {isTimeOut && <TableLoader />}

      {creditNoteList?.length === 0 && !isTimeOut && <NoDataFound />}
      <div className="d-flex justify-content-end">
        {creditNoteList?.length > 0 && !isTimeOut && (
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
  );
};

export default CreditNotes;
