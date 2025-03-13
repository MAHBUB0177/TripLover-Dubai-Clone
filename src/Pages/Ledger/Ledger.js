import { Box, Button, Center, Spinner, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { utils, writeFileXLSX } from "xlsx";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import {
  getAccountLedger,
  getAgentStaffs,
  getGetCurrentUser,
} from "../../common/allApi";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import TableLoader from "../../component/tableLoader";
import NoDataFound from "../../component/noDataFound";
import { sumTotal } from "../../common/functions";

const Ledger = () => {
  const [ledgerData, setLedgerData] = useState();
  const [grandTotal, setGrandTotal] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  let [fromDate, setFromDate] = useState(
    new Date(moment().subtract(6, "days")).toJSON().slice(0, 10)
  );
  let [toDate, setToDate] = useState(new Date().toJSON().slice(0, 10));
  let [balanceType, setBalanceType] = useState(null);
  let [currencyName, setCurrencyName] = useState("");
  let [staffList, setStaffList] = useState([]);
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  const newArr = [];
  const [isTimeOut, setIsTimeOut] = useState(false);

  const getUserData = async () => {
    try {
      const response = await getGetCurrentUser();
      setCurrentUser(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    const response = await getAgentStaffs(
      sessionStorage.getItem("agentId") ?? 0,
      1,
      2147483647
    );
    setStaffList(response.data.data);
  };

  useEffect(() => {
    getUserData();
    getData();
  }, []);

  // useEffect(() => {
  //   setTimeout(() => setIsTimeOut(true), 10000);
  // }, []);

  staffList.map((item) => newArr.push(item.userEmail));
  newArr.push(currentUser?.email);

  const getLedgerData = async (currentPageNumber) => {
    const obj = {
      agentId: sessionStorage.getItem("agentId") ?? 0,
      fromDate: fromDate,
      toDate: toDate,
      balanceType: balanceType,
    };
    setIsLoading(true);
    const response = await getAccountLedger(obj, currentPageNumber, pageSize);

    setCurrencyName(response.data.data[0]?.currencyName);
    setLedgerData(response.data.data);
    setGrandTotal(response.data.grandTotal);
    setPageCount(response.data.totalPages);
    setIsLoading(false);
  };

  const [isSearch, setIsSearch] = useState(false);
  useEffect(() => {
    getLedgerData(currentPageNumber);
  }, [isSearch, currentPageNumber, pageSize]);

  const handleFromDate = (e) => {
    setFromDate(e.target.value);
  };
  const handleToDate = (e) => {
    setToDate(e.target.value);
  };
  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
  };

  const handleViewTicket = (utid) => {
    window.open("/ticket?utid=" + utid + "&sts=Confirmed", "_blank");
  };

  const handleInvoice = (utid) => {
    window.open("/invoice?tnxNumber=" + utid, "_blank");
  };

  const handleViewInvoice = (id) => {
    window.open("/invoiceview?utid=" + id, "_blank");
  };

  const csvHeaders = [
    { label: "Date", key: "date" },
    { label: "Invoice Number	", key: "invoiceNumber" },
    { label: "Booking ID", key: "bookingId" },
    { label: "PNR", key: "pnr" },
    { label: "Ticket Number	", key: "ticketNumbers" },
    { label: "Description", key: "description" },
    { label: "Type", key: "transactionType" },
    { label: "Debit (AED)", key: "debitAmount" },
    { label: "Credit (AED)", key: "creditAmount" },
    { label: "Running Balance (AED)", key: "balanceAmount" },
    { label: "Created By", key: "createdByName" },
  ];

  const [isDownLoader, setIsDownLoader] = useState(false);
  const excelDownload = (body) => {
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(body, { origin: "A2", skipHeader: true });
    utils.sheet_add_aoa(ws, [csvHeaders.map((arr) => [arr.label])]); //heading: array of arrays
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, `Ledger.xlsx`);
    setIsDownLoader(false);
  };
  const handleDownload = () => {
    setIsDownLoader(true);
    const obj = {
      agentId: sessionStorage.getItem("agentId") ?? 0,
      fromDate: fromDate,
      toDate: toDate,
      balanceType: balanceType,
    };
    getAccountLedger(obj, 1, 2147483647)
      .then((response) => {
        const csvArr = response?.data?.data?.map((item) => ({
          date: moment(item.createdDate).format("DD-MMM-yyyy HH:mm:ss"),
          invoiceNumber: item.tnxNumber,
          bookingId: item.uniqueTransID,
          pnr: item.pnr,
          ticketNumbers: item.ticketNumbers,
          description: item.description,
          transactionType: item.transactionType,
          debitAmount: item.debitAmount,
          creditAmount: item.creditAmount,
          balanceAmount: item.balanceAmount,
          createdByName: newArr?.some((itm) => itm === item.createdByName)
            ? item.createdByName
            : "Triplover Admin",
        }));

        csvArr && excelDownload(csvArr);
      })
      .catch((err) => {
        setIsDownLoader(false);
      });
  };

  return (
    <div>
      <form encType="multipart/form-data" style={{ minHeight: "500px" }}>
        <div className="container-fluid bg-white">
          <div className="row">
            <div className="col-lg-12 px-0 pb-3">
              <div className="d-flex flex-wrap justify-content-start gap-2">
                <Box>
                  <button
                    className="btn button-color text-white fw-bold border-radius filter-btn"
                    onClick={handleDownload}
                    disabled={
                      isDownLoader ||
                      isLoading ||
                      ledgerData?.length < 1 ||
                      ledgerData === undefined
                    }
                    style={{ fontSize: "13px", height: "37px" }}
                  >
                    {isDownLoader ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>{" "}
                        Downloading
                      </>
                    ) : (
                      <>Download Excel File</>
                    )}
                  </button>
                </Box>
                <div className="dropdown">
                  <button
                    className="btn button-color dropdown-toggle fw-bold text-white border-radius filter-btn"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      fontSize: "12px",
                      height: "100%",
                      width: "150px",
                    }}
                  >
                    {balanceType === null ? (
                      "All"
                    ) : balanceType === 0 ? (
                      "Debit"
                    ) : balanceType === 1 ? (
                      "Credit"
                    ) : (
                      <></>
                    )}
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li
                      className="dropdown-item"
                      onClick={() => setBalanceType(null)}
                      style={{ fontSize: "12px" }}
                    >
                      All
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => setBalanceType(0)}
                      style={{ fontSize: "12px" }}
                    >
                      Debit
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => setBalanceType(1)}
                      style={{ fontSize: "12px" }}
                    >
                      Credit
                    </li>
                  </ul>
                </div>
                <input
                  type="date"
                  pattern="\d{4}-\d{2}-\d{2}"
                  className="form-control border-radius"
                  name="from"
                  value={fromDate}
                  onChange={(e) => handleFromDate(e)}
                  style={{ width: "250px" }}
                  max={new Date().toISOString().split("T")[0]}
                />
                <input
                  type="date"
                  pattern="\d{4}-\d{2}-\d{2}"
                  className="form-control border-radius"
                  name="to"
                  value={toDate}
                  onChange={(e) => handleToDate(e)}
                  style={{ width: "250px" }}
                  max={new Date().toISOString().split("T")[0]}
                />
                <button
                  type="button"
                  className="btn button-color fw-bold text-white border-radius filter-btn"
                  onClick={() => {
                    setIsSearch((old) => !old);
                    setCurrentPageNumber(1);
                  }}
                  style={{ width: "150px" }}
                >
                  Apply Filter
                </button>
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
                  <th>DATE</th>
                  <th>INVOICE NUMBER</th>
                  <th>BOOKING ID</th>
                  <th>PNR</th>
                  <th>DESCRIPTION</th>
                  <th>TYPE</th>
                  <th className="text-end">
                    DEBIT {currencyName ? "(" + currencyName + ")" : ""}
                  </th>
                  <th className="text-end">
                    CREDIT {currencyName ? "(" + currencyName + ")" : ""}
                  </th>
                  <th className="text-end">
                    RUNNING BALANCE{" "}
                    {currencyName ? "(" + currencyName + ")" : ""}
                  </th>
                  <th>CREATED BY</th>
                </tr>
              </thead>
              {!isLoading && (
                <>
                  <tbody className="tbody">
                    {ledgerData !== undefined ? (
                      ledgerData?.map((item, index) => {
                        return (
                          <>
                            <tr className="text-start fw-bold text-secondary">
                              <td>
                                {moment(item.createdDate).format(
                                  "DD-MMM-yyyy HH:mm:ss"
                                )}
                              </td>
                              <td>
                                <a
                                  href="javascript:void(0)"
                                  style={{
                                    cursor:
                                      item.transactionType === "Invoice"
                                        ? "pointer"
                                        : "none",
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                  onClick={() =>
                                    item.ticketNumbers !== null &&
                                    item.transactionType === "Invoice"
                                      ? handleInvoice(item.tnxNumber)
                                      : item.ticketNumbers === null &&
                                        item.transactionType === "Invoice"
                                      ? handleViewInvoice(item.tnxNumber)
                                      : ""
                                  }
                                >
                                  {item.tnxNumber}
                                </a>
                              </td>
                              <td>
                                <a
                                  style={{
                                    color: "#7c04c0",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                  href="javascript:void(0)"
                                  onClick={() =>
                                    handleViewTicket(item.uniqueTransID)
                                  }
                                >
                                  {item.uniqueTransID}
                                </a>
                              </td>
                              <td
                                className="fw-bold"
                                style={{
                                  color: "#7c04c0",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                  borderRadius: "50%",
                                }}
                              >
                                {item.pnr}
                              </td>

                              <td title={item.description}>
                                {item.description?.substr(0, 20)}
                                {item.description?.length > 20 ? (
                                  <>...</>
                                ) : (
                                  <></>
                                )}{" "}
                              </td>
                              <td>{item.transactionType}</td>
                              <td className="fw-bold text-dark text-end">
                                AED {item.debitAmount?.toLocaleString("en-US")}
                              </td>
                              <td className="fw-bold text-dark text-end">
                                AED {item.creditAmount?.toLocaleString("en-US")}
                              </td>
                              <td className="fw-bold text-dark text-end">
                                AED{" "}
                                {item.balanceAmount?.toLocaleString("en-US")}
                              </td>
                              <td>
                                {newArr?.some(
                                  (itm) => itm === item.createdByName
                                )
                                  ? item.createdByName
                                  : "Triplover Admin"}
                              </td>
                            </tr>
                          </>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </tbody>
                  <tfoot>
                    {ledgerData !== undefined && ledgerData?.length > 0 ? (
                      <>
                        {" "}
                        <tr className="fw-bold">
                          <td colSpan={6} style={{ textAlign: "right" }}>
                            Grand Total (AED)
                          </td>
                          <td
                            style={{ textAlign: "right" }}
                            className="fw-bold text-end"
                          >
                            AED{" "}
                            {grandTotal?.totalDebitAmount?.toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td
                            style={{ textAlign: "right" }}
                            className="fw-bold text-end"
                          >
                            AED{" "}
                            {grandTotal?.totalCreditAmount?.toLocaleString(
                              "en-US"
                            )}
                          </td>
                          <td></td>
                          <td></td>
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}
                  </tfoot>
                </>
              )}
            </table>

            {isLoading && <TableLoader />}

            {ledgerData?.length === 0 && !isLoading && <NoDataFound />}
          </div>
          <div className="d-flex justify-content-end">
            {ledgerData?.length > 0 && !isLoading && (
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
                forcePage={currentPageNumber - 1}
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
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={
                  "pagination justify-content-center py-2  border rounded"
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
      </form>
    </div>
  );
};

export default Ledger;
