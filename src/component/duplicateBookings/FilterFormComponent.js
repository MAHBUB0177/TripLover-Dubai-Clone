import React from "react";

const FilterFormComponent = ({
    filterData = {},
    setFilterData = null,
    setSearchData = null,
    handleResetForm = null,
    handleDownload = null,
    isDisabledBtn = false,
    isDownload = false,
}) => {
    return (
        <>
            <div className="row mt-2 mb-3 gy-2">
                <div className="col-sm-2 mb-3 mb-lg-0">
                    <input
                        name="pnr"
                        type={"text"}
                        value={filterData?.pnr}
                        onChange={(e) => setFilterData((prv) => ({ ...prv, [e.target.name]: e.target.value }))}
                        className="form-control border-radius"
                        placeholder="GDS PNR"
                    ></input>
                </div>

                <div className="col-sm-2 mb-3 mb-lg-0">
                    <input
                        name="uniqueTransId"
                        type={"text"}
                        value={filterData?.uniqueTransId}
                        onChange={(e) => setFilterData((prv) => ({ ...prv, [e.target.name]: e.target.value }))}
                        className="form-control border-radius"
                        placeholder="Booking ID"
                    ></input>
                </div>

                <div className="col-sm-2 mb-3 mb-lg-0">
                    <input
                        name="paxName"
                        type={"text"}
                        value={filterData?.paxName}
                        onChange={(e) => setFilterData((prv) => ({ ...prv, [e.target.name]: e.target.value }))}
                        className="form-control border-radius"
                        placeholder="Passenger Name"
                    ></input>
                </div>

                <div className="col-sm-2 mb-3 mb-lg-0">
                    <input
                        name="flightNumber"
                        type={"text"}
                        value={filterData?.flightNumber}
                        onChange={(e) => setFilterData((prv) => ({ ...prv, [e.target.name]: e.target.value }))}
                        className="form-control border-radius"
                        placeholder="Flight Number"
                    ></input>
                </div>

                <div className="col-lg-4 d-flex align-items-center justify-content-center">
                    <div className="col-sm-12 pt-0 d-flex lg:flex-wrap">
                        <button
                            type="button"
                            class="btn button-color fw-bold text-white border-radius filter-btn"
                            onClick={() => setSearchData(filterData)}
                        >
                            Apply Filter
                        </button>
                        <button
                            type="button"
                            style={{ backgroundColor: "#ED7F22" }}
                            class="btn  fw-bold text-white border-radius mx-2 filter-btn"
                            onClick={() => handleResetForm()}
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            className="btn button-color text-white fw-bold border-radius filter-btn "
                            onClick={handleDownload}
                            disabled={isDisabledBtn}
                        >
                            {isDownload ? (
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
                    </div>
                </div>

                {/* Start Select Booking Date */}
                <div className="col-sm-2 mb-3 mb-lg-0">
                    <label htmlFor="" className="text-sm font-weight-normal">
                        Select Booking Start Date
                    </label>
                    <input
                        type={"date"}
                        name="bookingDateFrom"
                        pattern="\d{4}-\d{2}-\d{2}"
                        max={new Date().toISOString().split("T")[0]}
                        value={filterData?.bookingDateFrom}
                        onChange={(e) => setFilterData((prv) => ({ ...prv, [e.target.name]: e.target.value }))}
                        className="form-control border-radius"
                        placeholder="From Date"
                    ></input>
                </div>
                <div className="col-sm-2 mb-3 mb-lg-0">
                    <label htmlFor="" className="text-sm font-weight-normal">
                        Select Booking End Date
                    </label>
                    <input
                        type={"date"}
                        name="bookingDateTo"
                        pattern="\d{4}-\d{2}-\d{2}"
                        max={new Date().toISOString().split("T")[0]}
                        value={filterData?.bookingDateTo}
                        onChange={(e) => setFilterData((prv) => ({ ...prv, [e.target.name]: e.target.value }))}
                        className="form-control border-radius"
                        placeholder="To Date"
                    ></input>
                </div>

                {/* Start Select Flight Date */}
                <div className="col-sm-2 mb-3 mb-lg-0">
                    <label htmlFor="" className="text-sm font-weight-normal">
                        Select Flight Start Date
                    </label>
                    <input
                        type={"date"}
                        name="flightDateFrom"
                        pattern="\d{4}-\d{2}-\d{2}"
                        // max={new Date().toISOString().split("T")[0]}
                        value={filterData?.flightDateFrom}
                        onChange={(e) => setFilterData((prv) => ({ ...prv, [e.target.name]: e.target.value }))}
                        className="form-control border-radius"
                        placeholder="From Date"
                    ></input>
                </div>
                <div className="col-sm-2 mb-3 mb-lg-0">
                    <label htmlFor="" className="text-sm font-weight-normal">
                        Select Flight End Date
                    </label>
                    <input
                        type={"date"}
                        name="flightDateTo"
                        pattern="\d{4}-\d{2}-\d{2}"
                        // max={new Date().toISOString().split("T")[0]}
                        value={filterData?.flightDateTo}
                        onChange={(e) => setFilterData((prv) => ({ ...prv, [e.target.name]: e.target.value }))}
                        className="form-control border-radius"
                        placeholder="To Date"
                    ></input>
                </div>
            </div>
        </>
    );
};

export default FilterFormComponent;
