import React, { useEffect, useState } from "react";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import { toast, ToastContainer } from "react-toastify";
import {
  getAllRefundRequest,
  getRefundRequestReject,
} from "../../common/allApi";
import TableLoader from "../../component/tableLoader";
import NoDataFound from "../../component/noDataFound";
import ReactPaginate from "react-paginate";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import moment from "moment";
import Footer from "../SharePages/Footer/Footer";
import {
  Box,
  Button,
  color,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getPassengerType } from "../../common/functions";
import { RiLockPasswordLine } from "react-icons/ri";
import ModalForm from "../../common/modalForm";
import PasswordInput from "../../common/passwordInput";
import { IoEyeSharp } from "react-icons/io5";

const RefundRequstList = () => {
  const navigate = useNavigate();
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  let [refundRequestList, setRefundRequestList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  let [groupID, setGroupID] = useState();
  const now = new Date();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sendObj, setSendObj] = useState({
    dateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    dateTo: moment(now).format("YYYY-MM-DD"),
    uniqueTransId: "",
    pnr: "",
    status: sessionStorage.getItem("rejectedList") ? "Rejected" : "Requested",
  });

  const [filterData, setfilterData] = useState({
    dateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    dateTo: moment(now).format("YYYY-MM-DD"),
    status: sessionStorage.getItem("rejectedList") ? "Rejected" : "Requested",
  });
  const handleClearTicketing = () => {
    sessionStorage.removeItem("rejectedList");
    setCurrentPageNumber(1);
    setSendObj({
      dateFrom: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      dateTo: moment(now).format("YYYY-MM-DD"),
      uniqueTransId: "",
      pnr: "",
      status: "Requested",
    });
    setfilterData({
      fromDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
        "YYYY-MM-DD"
      ),
      toDate: moment(now).format("YYYY-MM-DD"),
    });
  };

  const getRefundRequestList = async () => {
    try {
      setLoading(true);
      const response = await getAllRefundRequest({
        ...filterData,
        pageSize: pageSize,
        pageNo: currentPageNumber,
      });
      setRefundRequestList(response?.data?.data?.data);
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
    getRefundRequestList();
  }, [isSearch, currentPageNumber, pageSize, filterData]);

  const handleViewStatus = (sts) => {
    return sts === "Requested"
      ? "Refund Requested"
      : sts === "Quoted"
      ? "Quoted"
      : sts === "Agent_Rejected"
      ? "Rejected by Agent"
      : sts === "Admin_Rejected"
      ? "Rejected by Admin"
      : sts === "Expired"
      ? "Quotation Expired"
      : sts === "Refunded"
      ? "Refunded"
      : sts === "Adjusted"
      ? "Completed"
      : sts; // Default case: return the status if it doesn't match any condition
  };

  const [value, setValue] = React.useState("");

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };

  const handleRefundReject = async (groupID) => {
    if (!value) {
      toast.error("Remarks value cannot be empty.");
      return;
    }

    // Proceed with encoding if value is not empty
    let encodedString1 = btoa(value);
    let encodedString2 = btoa(encodedString1);
    let encodedString3 = btoa(encodedString2);

    try {
      const response = await getRefundRequestReject(groupID, encodedString3);
      if (response?.data?.isSuccess) {
        onClose();
        toast.success(response?.data?.message);
        getRefundRequestList();
        setValue(""); // Reset the input value to an empty string
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  const handelNavigate = (groupId, editCount) => {
    navigate(
      "/refund-request?groupId=" +
        groupId +
        "&editCount=" +
        editCount +
        "&failedAuto=" +
        false,
      "_blank"
    );
  };

  return (
    <div className="">
      <section className=""></section>
      <section className="content pb-5">
        <ToastContainer position="bottom-right" autoClose={1500} />
        <form encType="multipart/form-data">
          <div className="row" style={{ width: "100%", paddingBottom: "5px" }}>
            <div className="row p-2 py-3">
              <div className="col-lg-2 mb-3 mb-lg-0">
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
                />
              </div>
              <div className="col-lg-2 mb-3 mb-lg-0">
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
                />
              </div>
              <div className="col-lg-2 mb-3 mb-lg-0">
                <input
                  type={"date"}
                  pattern="\d{4}-\d{2}-\d{2}"
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
                />
              </div>
              <div className="col-lg-2 mb-3 mb-lg-0">
                <input
                  type={"date"}
                  pattern="\d{4}-\d{2}-\d{2}"
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
                />
              </div>
              <div className="col-lg-4">
                <div className="col-sm-12">
                  <button
                    type="button"
                    className="btn button-color fw-bold text-white border-radius mb-2 mb-lg-0 filter-btn"
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
                    className="btn fw-bold text-white border-radius ms-2 filter-btn"
                    onClick={() => handleClearTicketing()}
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
                  <th>PNR</th>
                  <th>BOOKING ID</th>
                  <th>TICKET NUMBER</th>
                  <th>STATUS</th>
                  <th>PASSENGER NAME</th>
                  <th>PASSENGER TYPE</th>
                  <th>CREATED AT</th>
                  <th>CREATED BY</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              {!isLoading && (
                <tbody className="tbody">
                  {refundRequestList?.length > 0 ? (
                    refundRequestList?.map((item, index) => {
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
                              handelNavigate(item?.groupId, item?.editCount)
                            }
                          >
                            {item.pnr}
                          </td>
                          <td
                            style={{
                              color: "#7c04c0",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handelNavigate(item?.groupId, item?.editCount)
                            }
                          >
                            {item?.uniqueTransId}
                          </td>
                          <td
                            style={{
                              color: "#7c04c0",
                              fontWeight: 800,
                            }}
                          >
                            {item.ticketNumbers}
                          </td>

                          <td className="align-middle">
                            <div className="mb-2">
                              <span
                                style={{
                                  backgroundColor: "#ecfdf3",
                                  color: "#26a36a",
                                  fontWeight: 600,
                                }}
                                className="px-3 py-2 rounded"
                              >
                                {handleViewStatus(item?.status)}
                              </span>
                            </div>
                          </td>
                          <td>{item.passengerName}</td>
                          <td>
                            {getPassengerType(
                              item.passengerType,
                              refundRequestList
                            )}
                          </td>
                          <td>
                            {moment(item.createdDate).format("DD-MM-YYYY")}
                          </td>
                          <td>{item?.createdByName}</td>

                          <td>
                            {item?.status == "Requested" && (
                              <div className="d-flex justify-content-start gap-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  px="3"
                                  py="1"
                                  className="shadow"
                                  style={{ backgroundColor: "#ED7F22" }}
                                  onClick={() => {
                                    onOpen();
                                    setGroupID(item?.groupId);
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      color: "white",
                                      width: "55px",
                                    }}
                                  >
                                    Cancel
                                  </span>
                                </Button>
                              </div>
                            )}
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
            {refundRequestList?.length === 0 && !isLoading && <NoDataFound />}
          </div>
          <div className="d-flex justify-content-end">
            {refundRequestList?.length > 0 && !isLoading && (
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

      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Refund Request</ModalHeader>
          <ModalCloseButton onClick={() => setValue(" ")} />
          <ModalBody>
            <Box pb={"20px"}>
              <div className="mb-3">
                <label>
                  Remarks <span style={{ color: "red" }}>*</span>
                </label>
                <Textarea
                  required={true}
                  value={value}
                  onChange={handleInputChange}
                  placeholder="Remarks"
                  size="sm"
                />
              </div>

              <Box
                display={"flex"}
                justifyContent={"end"}
                mt={"10px"}
                gap={"2"}
              >
                <Button
                  onClick={() => {
                    onClose();
                    setValue(" ");
                  }}
                  style={{ borderRadius: "8px", backgroundColor: "#ed7f22" }}
                  className="text-white"
                >
                  Close
                </Button>
                <Button
                  style={{ borderRadius: "8px", backgroundColor: "#7c04c0" }}
                  className="text-white"
                  onClick={() => handleRefundReject(groupID)}
                >
                  Reject
                </Button>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RefundRequstList;
