import moment from "moment";
import React, { useEffect } from "react";
import { useState } from "react";
import Footer from "../Footer/Footer";
import SideNavBar from "../SideNavBar/SideNavBar";
import Navbar from "./Navbar";
import ReactPaginate from "react-paginate";
import { BiTimeFive } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import {
  getNotificationAll,
  getTop20LatestNotification,
  marknotificationasread,
} from "../../../common/allApi";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import NoDataFound from "../../../component/noDataFound";
import TableLoader from "../../../component/tableLoader";

const Shownotification = () => {
  const [notificationList, setNotificationList] = useState([]);
  let [pageCount, setPageCount] = useState(1);
  let [pageSize, setPageSize] = useState(20);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [type, setType] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
  };

  const { setNotificationCount, notificationCount } = useAuth();
  const GetTopNotificationList = async () => {
    await getTop20LatestNotification()
      .then((res) => {
        (async () =>
          await localStorage.setItem(
            "notificationCount",
            JSON.stringify(res?.data?.data?.unreadCount)
          ))();
        setNotificationCount(
          JSON.parse(localStorage.getItem("notificationCount"))
        );
      })
      .catch((error) => {});
  };
  const getNotificationList = async (currentPageNumber) => {
    let obj = {
      type: type === "true" ? true : false,
      pageNo: currentPageNumber,
      pageSize: pageSize,
    };
    setIsloading(true);
    await getNotificationAll({ ...obj }).then((res) => {
      setNotificationList(res?.data?.data?.data);
      setPageCount(res?.data?.data?.totalPages);
      setIsloading(false);
    });
  };

  useEffect(() => {
    getNotificationList(currentPageNumber);
  }, [currentPageNumber]);

  const handelSearch = async () => {
    setCurrentPageNumber(1);
    let obj = {
      type: type === "true" ? true : false,
      pageNo: currentPageNumber,
      pageSize: pageSize,
    };
    setIsloading(true);
    await getNotificationAll({ ...obj }).then((res) => {
      setNotificationList(res?.data?.data?.data);
      setPageCount(res?.data?.data?.totalPages);
      setIsloading(false);
    });
  };

  const handelViewTicket = (item) => {
    if (item?.isRead === false) {
      marknotificationasread(item.id).then((res) => {
        GetTopNotificationList();
        getNotificationList(currentPageNumber);
      });
    }
    if (item?.noticeType === 4) {
      navigate(
        "/bookedview?utid=" + item?.reference + "&sts=" + "Confirmed",
        "_blank"
      );
    } else if (item?.noticeType === 10) {
      navigate(
        "/ticket?utid=" + item?.reference + "&sts=" + "Confirmed",
        "_blank"
      );
    } else if (
      item?.noticeType === 1 ||
      item?.noticeType === 2 ||
      item?.noticeType === 3
    ) {
      navigate("/balance");
    } else if (item?.noticeType === 18 || item?.noticeType === 19) {
      navigate("/support");
    } else if (
      item?.noticeType === 23 ||
      item?.noticeType === 25 ||
      item?.noticeType === 26
    ) {
      navigate("/ledger");
    } else if (item?.noticeType === 24) {
      navigate("/invoiceview?utid=" + item?.reference, "_blank");
    }
  };
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div>
        <div className="content-wrapper search-panel-bg">
          <section className="content-header pb-5"></section>
          <section className="content pb-5">
            <div className=" search-panel-bg  mt-10">
              <div
                className="shadow container py-5 pb-4 py-2 d-flex rounded  bg-white"
                style={{ position: "relative" }}
              >
                <div className="col-lg-4">
                  <div className="form-group">
                    <label className="form-label float-start fw-bold" type="">
                      Notification Type
                    </label>
                    <div className="input-group mb-3">
                      <select
                        id="type"
                        name="date"
                        className="form-select"
                        onChange={(e) => {
                          setType(e.target.value);
                        }}
                        style={{ borderRadius: "8px" }}
                      >
                        <option value={false}>Unread</option>
                        <option value={true}>Read</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="form-group">
                    <label className="form-label float-start fw-bold" type="">
                      Item Per page
                    </label>
                    <div className="input-group mb-3">
                      <select
                        id="pagesize"
                        name="date"
                        className="form-select"
                        onChange={(e) => setPageSize(parseInt(e.target.value))}
                        style={{ borderRadius: "8px" }}
                      >
                        <option value="">Select</option>
                        <option value="5">5</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 form-group mt-4">
                  <button
                    // colorScheme="whatsapp"
                    className="btn btn-sm button-color mt-1 p-2 text-white fw-bold"
                    style={{ width: "100px", borderRadius: "8px" }}
                    onClick={() => {
                      handelSearch();
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="shadow-lg container mt-3 pb-4 py-2 my-3 rounded position-relative bg-white">
                <div
                  className="mx-4"
                  style={{
                    maxHeight: "550px",
                    overflowX: "hidden",
                    borderRadius: "5px",
                    backgroundColor: "white",
                  }}
                >
                  {notificationList?.map((item, index) => {
                    return (
                      <div
                        className="card box-shadow  me-2 ms-2"
                        style={{
                          marginTop: "20px",
                          backgroundColor: "#f7f5f5",
                          borderRadius: "5px",
                          padding: "10px",
                          cursor: "pointer",
                          backgroundColor: item.isRead ? "#e1f3ee" : "#f0e7e8",
                        }}
                        onClick={() => handelViewTicket(item)}
                      >
                        <div className="d-flex justify-content-between">
                          <div>
                            <p
                              style={{
                                fontSize: "15px",
                              }}
                            >
                              {item?.title}
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                color: "gary",
                              }}
                            >
                              {item?.message}
                            </p>
                          </div>

                          <div>
                            <div className="d-flex">
                              <BiTimeFive />
                              <p
                                style={{
                                  fontSize: "10px",
                                }}
                              >
                                {moment(item?.createdDate).format(
                                  "DD-MMM-yyyy HH:mm:ss"
                                )}
                              </p>
                            </div>
                            <div className="d-flex">
                              {item?.readTime && (
                                <AiFillEye style={{ color: "purple" }} />
                              )}
                              {item?.readTime && (
                                <p
                                  style={{
                                    marginTop: "3px",
                                    fontSize: "10px",
                                  }}
                                >
                                  {moment(item?.readTime).format(
                                    "DD-MMM-yyyy HH:mm:ss"
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {isLoading && <TableLoader />}
                {notificationList?.length === 0 && !isLoading && (
                  <NoDataFound />
                )}
                {notificationList?.length > 0 && !isLoading && (
                  <div className="mt-4">
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
                      containerClassName={"pagination justify-content-center"}
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
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shownotification;
