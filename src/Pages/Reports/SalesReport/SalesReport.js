import { Box, Button, Center, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";
import { utils, writeFileXLSX } from "xlsx";
import { getPassengerType, sumTotal } from "../../../common/functions";
import useAuth from "../../../hooks/useAuth";
import Footer from "../../SharePages/Footer/Footer";
import Navbar from "../../SharePages/Navbar/Navbar";
import SideNavBar from "../../SharePages/SideNavBar/SideNavBar";
import { environment } from "../../SharePages/Utility/environment";
import { getSalesReport, getSalesReportApi } from "../../../common/allApi";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { IoMdWarning } from "react-icons/io";
import TableLoader from "../../../component/tableLoader";
import NoDataFound from "../../../component/noDataFound";

const SalesReport = () => {
  const { setLoading, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  let [fromDate, setFromDate] = useState(new Date().toJSON().slice(0, 10));
  let [toDate, setToDate] = useState(new Date().toJSON().slice(0, 10));
  let [totalBuyingBasePrice, setTotalBuyingBasePrice] = useState(0);
  let [totalBuyingTax, setTotalBuyingTax] = useState(0);
  let [totalBuyingPrice, setTotalBuyingPrice] = useState(0);
  let [totalSellingBasePrice, setTotalSellingBasePrice] = useState(0);
  let [totalSellingTax, setTotalSellingTax] = useState(0);
  let [totalSellingPrice, setTotalSellingPrice] = useState(0);
  let [totalProfit, setTotalProfit] = useState(0);
  let [currencyName, setCurrencyName] = useState("");
  const [page, setPage] = useState(false);
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [isSearch, setIsSearch] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const obj = {
      agentId: sessionStorage.getItem("agentId") ?? 0,
      fromDate: fromDate,
      toDate: toDate,
    };
    getSalesReportApi(obj, currentPageNumber, pageSize).then((res) => {
      setReportData(res.data.data);
      setPageCount(res.data.totalPages);
      res.data.data.map((item, index) => {
        setCurrencyName(item.currencyName);
        setTotalBuyingBasePrice(
          (totalBuyingBasePrice += Number(item.basePriceBuying))
        );

        setTotalBuyingTax((totalBuyingTax += Number(item.taxesBuying)));
        setTotalBuyingPrice((totalBuyingPrice += Number(item.priceBuying)));
        setTotalSellingBasePrice(
          (totalSellingBasePrice += Number(item.basePriceSelling))
        );
        setTotalSellingTax((totalSellingTax += Number(item.taxesSelling)));
        setTotalSellingPrice((totalSellingPrice += Number(item.priceSelling)));
        setTotalProfit((totalProfit += Number(item.profit)));
      });
      setIsLoading(false);
    });
  }, [isSearch, currentPageNumber, pageSize]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
  };

  const handleFromDate = (e) => {
    setFromDate(e.target.value);
  };
  const handleToDate = (e) => {
    setToDate(e.target.value);
  };

  const handleViewTicket = (utid) => {
    window.open("/ticket?utid=" + utid + "&sts=Confirmed", "_blank");
  };

  const csvHeaders = [
    { label: "Date Time", key: "createdDate" },
    { label: "Booking ID", key: "uniqueTransID" },
    { label: "PNR", key: "pnr" },
    { label: "Ticket Number", key: "ticketNumbers" },
    { label: "Passenger Name", key: "paxNames" },
    { label: "Passenger Type", key: "passengerType" },
    { label: "Base Fare", key: "basePriceSelling" },
    { label: "Tax", key: "taxesSelling" },
    { label: "Commission", key: "discount" },
    { label: "Ait", key: "ait" },
    { label: "Total Price", key: "priceSelling" },
  ];

  const [csvData, setCsvData] = useState([]);

  const [isDownLoader, setIsDownLoader] = useState(false);
  const excelDownload = (body) => {
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(body, { origin: "A2", skipHeader: true });
    utils.sheet_add_aoa(ws, [csvHeaders.map((arr) => [arr.label])]); //heading: array of arrays
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, `sales.xlsx`);
    setIsDownLoader(false);
  };
  const handleDownload = () => {
    setIsDownLoader(true);
    const obj = {
      agentId: sessionStorage.getItem("agentId") ?? 0,
      fromDate: fromDate,
      toDate: toDate,
    };
    getSalesReport(obj)
      .then((response) => {
        const csvArr = response?.data?.data?.map((item) => ({
          createdDate: moment(item.createdDate).format("DD-MMM-yyyy hh:mm"),
          uniqueTransID: item.uniqueTransID,
          pnr: item.pnr,
          ticketNumbers: item.ticketNumbers,
          paxNames: item.paxNames,
          passengerType: getPassengerType(item.passengerType),
          basePriceSelling: item.basePriceSelling,
          taxesSelling: item.taxesSelling,
          commission: item.discount,
          ait: item.ait,
          priceSelling: item.priceSelling,
        }));

        csvArr.push({
          createdDate: "",
          uniqueTransID: "",
          pnr: "",
          ticketNumbers: "",
          paxNames: "",
          passengerType: `Grand Total (AED)`,
          basePriceSelling: sumTotal(response?.data?.data, "sellingBasePrice"),
          taxesSelling: sumTotal(response?.data?.data, "taxesSelling"),
          commission: sumTotal(response?.data?.data, "commission"),
          ait: sumTotal(response?.data?.data, "ait"),
          priceSelling: sumTotal(response?.data?.data, "priceSelling"),
        });

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
              <div className="d-flex  flex-wrap justify-content-start gap-2 ">
                <Box>
                  <button
                    className="btn button-color text-white fw-bold border-radius filter-btn "
                    onClick={handleDownload}
                    disabled={
                      isDownLoader ||
                      isLoading ||
                      reportData?.length < 1 ||
                      reportData === undefined
                    }
                    style={{ fontSize: "13px", height: "37px" }}
                  >
                    {isDownLoader ? (
                      <>
                        <span
                          class="spinner-border spinner-border-sm"
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

                <input
                  type="date"
                  pattern="\d{4}-\d{2}-\d{2}"
                  class="form-control border-radius"
                  name="from"
                  value={fromDate}
                  onChange={(e) => handleFromDate(e)}
                  style={{ width: "250px" }}
                  max={new Date().toISOString().split("T")[0]}
                />
                <input
                  type="date"
                  pattern="\d{4}-\d{2}-\d{2}"
                  class="form-control border-radius"
                  name="to"
                  value={toDate}
                  onChange={(e) => handleToDate(e)}
                  style={{ width: "250px" }}
                  max={new Date().toISOString().split("T")[0]}
                />
                <button
                  type="button"
                  className="btn button-color fw-bold text-white border-radius filter-btn "
                  onClick={() => {
                    setIsSearch((old) => !old);
                    setCurrentPageNumber(1);
                  }}
                  style={{ width: "120px" }}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table
            className="table  table-lg"
            style={{ width: "100%", fontSize: "13px" }}
          >
            <thead className="text-start fw-bold bg-secondary">
              <tr>
                <th>DATE TIME</th>
                <th>BOOKING ID</th>
                <th>PNR</th>
                <th>TICKET NUMBER</th>
                <th className="text-start">PASSENGER NAME</th>
                <th>PASSENGER TYPE</th>
                <th className="text-end">BASE FARE</th>
                <th className="text-end">TAX</th>
                <th className="text-end">COMMISSION</th>
                <th className="text-end">AIT</th>
                <th className="text-end">TOTAL PRICE</th>
              </tr>
            </thead>
            {!isLoading && (
              <>
                <tbody className="tbody">
                  {reportData !== undefined ? (
                    reportData?.map((item, index) => {
                      return (
                        <>
                          <tr
                            key={index}
                            className="text-start fw-bold text-secondary"
                          >
                            <td>
                              {moment(item.createdDate).format(
                                "DD-MMM-yyyy hh:mm"
                              )}
                            </td>
                            <td>
                              <a
                                // style={{ borderRadius: "50%" }}
                                href="javascript:void(0)"
                                title="Ticket"
                                onClick={() =>
                                  handleViewTicket(item.uniqueTransID)
                                }
                                style={{
                                  color: "#7c04c0",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                  borderRadius: "50%",
                                }}
                              >
                                {item.uniqueTransID}
                              </a>
                            </td>
                            <td>
                              &nbsp;{" "}
                              <a
                                style={{
                                  color: "#7c04c0",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                  borderRadius: "50%",
                                }}
                                href="javascript:void(0)"
                                title="Ticket"
                                onClick={() =>
                                  handleViewTicket(item.uniqueTransID)
                                }
                                // className="text-danger fw-bold"
                              >
                                {item.pnr}
                              </a>
                            </td>
                            <td
                              style={{
                                color: "#7c04c0",
                                fontWeight: 800,
                                cursor: "pointer",
                                borderRadius: "50%",
                              }}
                            >
                              {" "}
                              <span
                                key={index}
                                data-tip={
                                  item.paxNames !== undefined ? (
                                    item.paxNames
                                      .split(",")
                                      .map((item, index) => {
                                        return (
                                          index +
                                          1 +
                                          ". " +
                                          item.replace(",", " ") +
                                          "<br/>"
                                        );
                                      })
                                  ) : (
                                    <></>
                                  )
                                }
                              >
                                &nbsp;{" "}
                                <a
                                  style={{ borderRadius: "50%" }}
                                  href="javascript:void(0)"
                                  title="Ticket"
                                  onClick={() =>
                                    handleViewTicket(item.uniqueTransID)
                                  }
                                  // className="text-danger fw-bold"
                                >
                                  {item.ticketNumbers}
                                </a>
                              </span>{" "}
                            </td>
                            <td className="text-start">{item.paxNames}</td>
                            <td>{getPassengerType(item.passengerType)}</td>
                            <td
                              style={{ textAlign: "right" }}
                              className="text-dark"
                            >
                              AED{" "}
                              {item.basePriceSelling?.toLocaleString("en-US")}
                            </td>
                            <td
                              style={{ textAlign: "right" }}
                              className="text-dark"
                            >
                              AED {item.taxesSelling?.toLocaleString("en-US")}
                            </td>
                            <td
                              style={{ textAlign: "right" }}
                              className="text-dark"
                            >
                              AED {item?.discount?.toLocaleString("en-US")}
                            </td>

                            <td
                              style={{ textAlign: "right" }}
                              className="text-dark"
                            >
                              AED {item.ait?.toLocaleString("en-US")}
                            </td>
                            <td
                              style={{ textAlign: "right" }}
                              className="text-dark"
                            >
                              AED {item.priceSelling?.toLocaleString("en-US")}
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
                  {reportData !== undefined && reportData?.length > 0 ? (
                    <>
                      {" "}
                      <tr className="text-dark fw-bold">
                        <td colSpan={6} style={{ textAlign: "right" }}>
                          Grand Total
                        </td>
                        <td style={{ textAlign: "right" }}>
                          AED{" "}
                          {sumTotal(
                            reportData,
                            "sellingBasePrice"
                          )?.toLocaleString("en-US")}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          AED{" "}
                          {sumTotal(reportData, "taxesSelling")?.toLocaleString(
                            "en-US"
                          )}
                        </td>

                        <td style={{ textAlign: "right" }}>
                          AED{" "}
                          {sumTotal(reportData, "commission")?.toLocaleString(
                            "en-US"
                          )}
                        </td>

                        <td style={{ textAlign: "right" }}>
                          AED{" "}
                          {sumTotal(reportData, "ait")?.toLocaleString("en-US")}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          AED{" "}
                          {sumTotal(reportData, "priceSelling")?.toLocaleString(
                            "en-US"
                          )}
                        </td>
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
          {reportData?.length === 0 && !isLoading && <NoDataFound />}
        </div>
        <div className="d-flex justify-content-end">
          {reportData?.length > 0 && !isLoading && (
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
      </form>
    </div>
  );
};

export default SalesReport;
