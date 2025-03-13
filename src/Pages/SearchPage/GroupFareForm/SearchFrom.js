import { toast, ToastContainer } from "react-toastify";
import GroupFareCard from "./groupFareCard";
import { useEffect, useState } from "react";
import {
  downloadexceldemo,
  groupFareDropdownData,
  seachFlight,
} from "../../../common/allApi";
import ReactPaginate from "react-paginate";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import { environment } from "../../SharePages/Utility/environment";

const SearchFrom = () => {
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [dropDownData, setDropdownData] = useState({});
  const [searchState, setSearchState] = useState({
    groupFareRoute: "",
    groupFareDepartureDate: "",
    preferredCarriers: [],
  });
  const [filterObj, setFliterObj] = useState({
    groupFareRoute: "",
    groupFareDepartureDate: "",
    preferredCarriers: [],
  });
  const [loader, setLoader] = useState(false);

  const [searchData, setSearchData] = useState([]);

  const getDropDownData = async () => {
    try {
      await groupFareDropdownData()
        .then((res) => {
          setDropdownData(res.data.data);
        })
        .catch((error) => {
          toast.error("Please try again");
        });
    } catch (error) {
      toast.error("Please try again");
    }
  };

  useEffect(() => {
    getDropDownData();
  }, []);

  useEffect(() => {
    if (
      filterObj.groupFareRoute === "" &&
      filterObj.groupFareDepartureDate === "" &&
      filterObj.preferredCarriers.length === 0
    )
      searchFlightData({
        groupFareRoute: null,
        groupFareDepartureDate: null,
        preferredCarriers: [],
        pageSize: pageSize,
        pageNumber: currentPageNumber,
      });
  }, [currentPageNumber]);

  useEffect(() => {
    if (
      filterObj.groupFareRoute !== "" ||
      filterObj.groupFareDepartureDate !== "" ||
      filterObj.preferredCarriers.length > 0
    )
      searchFlightData({
        groupFareRoute: filterObj.groupFareRoute
          ? filterObj.groupFareRoute
          : null,
        groupFareDepartureDate: filterObj.groupFareDepartureDate
          ? filterObj.groupFareDepartureDate
          : null,
        preferredCarriers: filterObj.preferredCarriers
          ? filterObj.preferredCarriers
          : [],
        pageSize: pageSize,
        pageNumber: currentPageNumber,
      });
  }, [currentPageNumber, filterObj]);

  const handleSearchClick = async () => {
    let payload = {
      groupFareRoute: searchState.groupFareRoute
        ? searchState.groupFareRoute
        : null,
      groupFareDepartureDate: searchState.groupFareDepartureDate
        ? searchState.groupFareDepartureDate
        : null,
      preferredCarriers: searchState.preferredCarriers
        ? searchState.preferredCarriers
        : [],
      pageSize: pageSize,
      pageNumber: 1,
    };

    setFliterObj(payload);
    setSearchState(payload);
    setCurrentPageNumber(1);
  };

  const searchFlightData = async (payload) => {
    try {
      setLoader(true);
      await seachFlight(payload)
        .then((res) => {
          setSearchData(res?.data?.data);
          setPageCount(res?.data?.totalPages);
          setLoader(false);
        })
        .catch((e) => {
          setSearchData([]);
          setPageCount(0);
          toast.error("Please try again");
          setLoader(false);
        });
    } catch (e) {
      setSearchData([]);
      setPageCount(0);
      toast.error("Please try again");
      setLoader(false);
    }
  };

  const handleClearRequest = () => {
    let payload = {
      groupFareRoute: "",
      groupFareDepartureDate: "",
      preferredCarriers: [],
      pageSize: pageSize,
      pageNumber: 1,
    };
    setFliterObj(payload);
    setSearchState(payload);
    setCurrentPageNumber(1);
    searchFlightData({
      groupFareRoute: null,
      groupFareDepartureDate: null,
      preferredCarriers: [],
      pageSize: pageSize,
      pageNumber: 1,
    });
  };

  const handlePageClick = async (data) => {
    window.scrollTo(0, 0);
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
  };

  const [downloadBtnLoader, setDownloadBtnLoader] = useState(false);
  const handelDownload = async () => {
    try {
      setDownloadBtnLoader(true);

      // Fetch the file metadata
      const fileResponse = await downloadexceldemo();

      if (fileResponse?.data?.isSuccess) {
        let fileUrl;
        if (fileResponse?.data?.data?.isExcelS3) {
          fileUrl = environment.s3URL + fileResponse?.data?.data?.excelFileName;
        } else {
          fileUrl =
            environment.baseApiURL +
            "/wwwroot/Uploads/GroupFare/SampleExcelFiles/" +
            fileResponse?.data?.data?.excelFileName;
        }

        const fileExtension = fileResponse?.data?.data?.excelFileName
          .split(".")
          .pop(); // Get file extension
        const fileName = `Group Pax Information_Upload.${fileExtension}`;

        const response = await fetch(fileUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch the file.");
        }

        const blob = await response.blob();

        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", fileName);

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      } else {
        throw new Error("File data not valid or download failed.");
      }
    } catch (err) {
      setDownloadBtnLoader(false);
      toast.error("fetch-error", "error", "Failed to download sample file!");
      console.error(err);
    } finally {
      setDownloadBtnLoader(false);
    }
  };
  return (
    <div>
      <ToastContainer position="bottom-right" autoClose={1500} />
      <section className="content pb-5">
        <div
          className="mx-lg-5 mx-md-5 mx-sm-1 mt-3"
          encType="multipart/form-data"
          style={{ minHeight: "500px" }}
        >
          <div className="card pb-5">
            <div className="card-body pb-5">
              <div className="m-4">
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="tp1">
                    <span className="fs-4">Special Fare List</span>
                    <hr className="mb-3" />
                    <div
                      className="row"
                      style={{ width: "100%", paddingBottom: "5px" }}
                    >
                      <div className="card card-body">
                        <div className="row my-3">
                          <div className="col-lg-3">
                            <label>Date</label>
                            <select
                              value={searchState?.groupFareDepartureDate}
                              className="form-select border-radius"
                              placeholder="Status Type"
                              onChange={(e) =>
                                setSearchState({
                                  ...searchState,
                                  groupFareDepartureDate: e.target.value,
                                })
                              }
                            >
                              <option value="">Select Date</option>
                              {dropDownData?.flightDates?.map((item, idx) => (
                                <option value={item} key={idx}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-lg-3">
                            <label>Airlines</label>
                            <select
                              value={searchState?.preferredCarriers}
                              className="form-select border-radius"
                              placeholder="Upcoming Day"
                              onChange={(e) => {
                                if (e.target.value !== "") {
                                  setSearchState({
                                    ...searchState,
                                    preferredCarriers: [e.target.value],
                                  });
                                } else {
                                  setSearchState({
                                    ...searchState,
                                    preferredCarriers: [],
                                  });
                                }
                              }}
                            >
                              <option value="">Select Airlines</option>
                              {dropDownData?.airlines?.map((item, idx) => (
                                <option value={item.airlineCode} key={idx}>
                                  {item.airlineCode} ({item.airlineName})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-lg-3">
                            <label>Route</label>
                            <select
                              value={searchState?.groupFareRoute}
                              className="form-select border-radius"
                              placeholder="Upcoming Day"
                              onChange={(e) =>
                                setSearchState({
                                  ...searchState,
                                  groupFareRoute: e.target.value,
                                })
                              }
                            >
                              <option value="">Select Route</option>
                              {dropDownData?.routes?.map((item, idx) => (
                                <option value={item} key={idx}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-sm-2">
                            <div
                              className="col-sm-12 text-start"
                              style={{ paddingTop: "2em" }}
                            >
                              <button
                                type="button"
                                className="btn button-color fw-bold text-white me-2 border-radius"
                                onClick={() => {
                                  handleSearchClick();
                                }}
                                // disabled={
                                //   searchState.groupFareRoute ||
                                //   searchState.groupFareDepartureDate ||
                                //   searchState.preferredCarriers.length > 0
                                //     ? false
                                //     : true
                                // }
                              >
                                Search
                              </button>
                              <button
                                type="button"
                                className="btn button-secondary-color fw-bold text-white border-radius"
                                onClick={() => handleClearRequest()}
                                disabled={
                                  searchState.groupFareRoute ||
                                  searchState.groupFareDepartureDate ||
                                  searchState.preferredCarriers.length > 0
                                    ? false
                                    : true
                                }
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                          <div className="col-sm-1">
                            <div className="d-flex justify-content-between">
                              <div className="form-group">
                                <label
                                  htmlFor="excelUpload"
                                  className="fw-bold "
                                  style={{ fontSize: "12px" }}
                                >
                                  Excel Sample File
                                </label>
                                <br></br>
                                <button
                                  type="button"
                                  class="btn button-color text-white fw-bold border-radius"
                                  onClick={handelDownload}
                                  disabled={downloadBtnLoader && true}
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <GroupFareCard searchData={searchData} loader={loader} />
                </div>
                {searchData?.length > 0 && !loader && (
                  <ReactPaginate
                    previousLabel={
                      <MdOutlineSkipPrevious
                        style={{ fontSize: "18px" }}
                        color="#ed8226"
                      />
                    }
                    nextLabel={
                      <MdOutlineSkipNext
                        style={{ fontSize: "18px" }}
                        color="#ed8226"
                      />
                    }
                    breakLabel={"..."}
                    pageCount={pageCount}
                    forcePage={currentPageNumber - 1}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={
                      "pagination justify-content-center py-2"
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
      </section>
    </div>
  );
};

export default SearchFrom;
