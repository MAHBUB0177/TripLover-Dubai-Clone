/* eslint-disable jsx-a11y/anchor-is-valid */
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import { getDuplicateBookingData } from "../../common/allApi";
import { utils, writeFileXLSX } from "xlsx";
import FilterFormComponent from "./FilterFormComponent";
import TableDataView from "./TableDataView";

const now = new Date();

const tableHeaders = [
    { label: "BOOKING DATE" },
    { label: "FLIGHT NO" },
    { label: "PAX NAME" },
    { label: "FLIGHT DATE" },
    { label: "PNR" },
    { label: "TRIP TYPE" },
    { label: "STATUS" },
];

const handleViewTicket = (utid, sts) => {
    let status = sts === "Issued" ? "Confirmed" : sts === "Ticket Cancelled" ? "Cancelled" : sts;
    window.open("/ticket?utid=" + utid + "&sts=" + status, "_blank");
};

const handleBookedView = (utid, sts) => {
    let status = sts === "Confirmed" ? "Confirmed" : "Cancelled";
    window.open("/bookedview?utid=" + utid + "&sts=" + status, "_blank");
};

const DuplicateBookings = () => {
    const [response, setResponse] = useState();
    const [searchData, setSearchData] = useState({
        pnr: "",
        uniqueTransId: "",
        paxName: "",
        flightNumber: "",
        bookingDateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format("YYYY-MM-DD"),
        bookingDateTo: moment(now).format("YYYY-MM-DD"),
        flightDateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format("YYYY-MM-DD"),
        flightDateTo: moment(now).format("YYYY-MM-DD"),
    });
    const [filterData, setFilterData] = useState({
        pnr: "",
        uniqueTransId: "",
        paxName: "",
        flightNumber: "",
        bookingDateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format("YYYY-MM-DD"),
        bookingDateTo: moment(now).format("YYYY-MM-DD"),
        flightDateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format("YYYY-MM-DD"),
        flightDateTo: moment(now).format("YYYY-MM-DD"),
    });
    const [isLoading, setLoading] = useState(false);
    const [pageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [isDownload, setIsDownLoader] = useState(false);

    // API CALL
    useEffect(() => {
        const initializeDates = () => {
            const initialDateFrom = moment(new Date(now.getFullYear(), now.getMonth(), 1));
            const initialDateTo = moment(now);

            if (!searchData.bookingDateFrom || !searchData.flightDateFrom) {
                setSearchData((prevState) => ({
                    ...prevState,
                    bookingDateFrom: prevState.bookingDateFrom || initialDateFrom,
                    bookingDateTo: prevState.bookingDateTo || initialDateTo,
                    flightDateFrom: prevState.flightDateFrom || initialDateFrom,
                    flightDateTo: prevState.flightDateTo || initialDateTo,
                }));
            }
        };

        const fetchData = async () => {
            if (searchData.bookingDateFrom && searchData.flightDateFrom) {
                try {
                    setLoading(true);
                    const res = await getDuplicateBookingData({ ...searchData }, currentPageNumber, pageSize);
                    setResponse(res?.data?.data);
                    setPageCount(res.data?.data?.totalPages);
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setTimeout(() => setLoading(false), 1000);
                }
            }
        };

        initializeDates();
        fetchData();
    }, [currentPageNumber, pageSize, searchData]);

    const handlePageClick = async (data) => {
        const currentPage = data.selected + 1;
        setCurrentPageNumber(currentPage);
    };

    const handleResetForm = () => {
        setCurrentPageNumber(1);
        setSearchData({
            pnr: "",
            uniqueTransId: "",
            paxName: "",
            flightNumber: "",
            bookingDateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format("YYYY-MM-DD"),
            bookingDateTo: moment(now).format("YYYY-MM-DD"),
            flightDateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format("YYYY-MM-DD"),
            flightDateTo: moment(now).format("YYYY-MM-DD"),
        });
        setFilterData({
            pnr: "",
            uniqueTransId: "",
            paxName: "",
            flightNumber: "",
            bookingDateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format("YYYY-MM-DD"),
            bookingDateTo: moment(now).format("YYYY-MM-DD"),
            flightDateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format("YYYY-MM-DD"),
            flightDateTo: moment(now).format("YYYY-MM-DD"),
        });
    };

    const excelDownload = (body) => {
        const wb = utils.book_new();
        const ws = utils.json_to_sheet(body, { origin: "A2", skipHeader: true });
        utils.sheet_add_aoa(ws, [tableHeaders.map((arr) => [arr.label])]);
        utils.book_append_sheet(wb, ws, "Data");
        writeFileXLSX(wb, `sales.xlsx`);
        setIsDownLoader(false);
    };

    const handleDownload = () => {
        setIsDownLoader(true);

        getDuplicateBookingData({ ...searchData }, 1, 2147483647)
            .then((response) => {
                const csvArr = response?.data?.data?.data?.map((item) => ({
                    bookingDate: item?.bookedDateTime ? moment(item?.bookedDateTime).format("DD-MM-YYYY HH:mm") : "N/A",
                    flightNumber: item.flightNumber,
                    passengerName: item.passengerName,
                    flightDate: item.flightDate ? moment(item.flightDate).format("DD-MM-YYYY HH:mm") : "N/A",

                    pnr: item.pnr,
                    isInternational: item?.isInternational,
                    currentStatus:
                        item.currentStatus === "Ordered"
                            ? "Processing"
                            : item.currentStatus === "Confirmed"
                            ? "Ticketed"
                            : item.currentStatus === "Booked"
                            ? "On Hold"
                            : item.currentStatus,
                }));

                csvArr && excelDownload(csvArr);
            })

            .catch((err) => {
                setIsDownLoader(false);
            });
    };

    return (
        <div>
            <div className="row p-2 py-3">
                <div className="container-fluid bg-white">
                    <div className="container-fluid bg-white">
                        <FilterFormComponent
                            filterData={filterData}
                            setFilterData={setFilterData}
                            setSearchData={setSearchData}
                            handleResetForm={handleResetForm}
                            handleDownload={handleDownload}
                            isDisabledBtn={Boolean(!response?.data?.length || isLoading || isDownload)}
                            isDownload={isDownload}
                        />
                    </div>
                </div>

                <>
                    <TableDataView
                        tableHeaders={tableHeaders}
                        response={response}
                        isLoading={isLoading}
                        handleBookedView={handleBookedView}
                        handleViewTicket={handleViewTicket}
                    />
                </>

                <div className="d-flex justify-content-end">
                    {response?.data?.length && !isLoading ? (
                        <ReactPaginate
                            previousLabel={
                                <div className="d-flex align-items-center gap-1">
                                    <MdOutlineSkipPrevious style={{ fontSize: "18px" }} color="#ed8226" /> Prev
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
            </div>
        </div>
    );
};

export default DuplicateBookings;
