import { Box, Button, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import $ from "jquery";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isValidEmail } from "../../common/functions";
import ModalForm from "../../common/modalForm";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import { RiLockPasswordLine } from "react-icons/ri";
import "./Staff.css";
import { BiEdit } from "react-icons/bi";
import StaffHistory from "./StaffHistory";
import { FaHistory } from "react-icons/fa";
import {
  addB2BStaff,
  editB2BStaff,
  getAgentSettings,
  getAgentStaffs,
  resetPasswordUser,
} from "../../common/allApi";
import PasswordInput from "../../common/passwordInput";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import NoDataFound from "../../component/noDataFound";
import TableLoader from "../../component/tableLoader";

const Staff = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  let [userName, setUserName] = useState("");
  let [userEmail, setUserEmail] = useState("");
  let [userMobileNo, setUserMobileNo] = useState("");
  let [balanceLimit, setBalanceLimit] = useState("");
  let [password, setPassword] = useState("");
  let [ConfirmPassword, setConfirmPassword] = useState("");
  let [userRole, setUserRole] = useState(1);
  let [restpassword, setRestpassword] = useState("");
  let [restconfirmpassword, setRestconfirmpassword] = useState("");
  let [isActive, setIsActive] = useState(true);
  let [currentItem, setCurrentItem] = useState({});
  let [staffList, setStaffList] = useState([]);
  let [settingItem, setSettingItem] = useState({});
  let [loading, setLoading] = useState(false);
  let [userCredential, setUserCredential] = useState();
  const [limit, setLimit] = useState(
    parseInt(sessionStorage?.getItem("agentBalance"))
  );

  let sendObj = {
    id: currentItem === null ? 0 : currentItem.id,
    userId: currentItem === null ? 0 : currentItem.userId,
    agentId: sessionStorage.getItem("agentId") ?? 0,
    userName: userName,
    userMobileNo: userMobileNo,
    userEmail: userEmail,
    balanceLimit: balanceLimit,
    password: password,
    isActive: isActive,
    b2BRoleID: userRole,
  };

  const handleSubmit = () => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,32}$/;
    if (userName === "") {
      toast.error("Sorry! User name is empty..");
      return;
    }
    if (userEmail === "") {
      toast.error("Sorry! Email is empty..");
      return;
    }
    if (!isValidEmail(userEmail)) {
      toast.error("You have entered an invalid email address!");
      return;
    }

    if (userMobileNo === "") {
      toast.error("Sorry! Mobile no is empty..");
      return;
    }

    if ((balanceLimit == "" ? 0 : balanceLimit) === 0) {
      toast.error("Sorry! Balance limit is zero..");
      return;
    }
    if (balanceLimit > limit) {
      toast.error(`Transaction limit exceeded. Maximum limit is ${limit}`);
      return;
    }

    //password add
    if (password == "" && currentItem === null) {
      toast.error("Sorry! Password is empty");
      return;
    }

    if (re.test(password) === false && currentItem === null) {
      toast.error(
        "Passwprd must one uppercase letter, lowercase letter, number, special character and 8 length",
        {
          className: "toast-message",
        }
      );
      return;
    }
    if (ConfirmPassword == "" && currentItem === null) {
      toast.error("Sorry! Confirm password is empty");
      return;
    }
    if (re.test(ConfirmPassword) === false && currentItem === null) {
      toast.error(
        "ConfirmPassword must one uppercase letter, lowercase letter, number, special character and 8 length",
        {
          className: "toast-message",
        }
      );
      return;
    }
    if (password !== ConfirmPassword && currentItem === null) {
      toast.error("Sorry! Password does not same");
      return;
    }

    if (sendObj.id > 0) {
      const putData = async () => {
        setLoading(true);
        const response = await editB2BStaff(sendObj).catch((error) => {});

        if (
          response?.data?.isSuccess ||
          (response !== undefined && response.data.item1 === true)
        ) {
          toast.success("User updated successfully..");
          handleGetStaffs(1);
          setLoading(false);
          $("#modal-close").click();
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
        } else {
          toast.error(response?.data?.message);
          setLoading(false);
        }
      };
      putData();
    } else {
      if (staffList.length >= settingItem.maxStaff) {
        toast.error(
          "Sorrry! Max staff limit " + settingItem.maxStaff + " has been over"
        );
      } else {
        const postData = async () => {
          setLoading(true);
          const response = await addB2BStaff(sendObj).catch((error) => {});
          if (
            response?.data?.isSuccess ||
            (response !== undefined && response.data.item1 === true)
          ) {
            setUserCredential({
              username: sendObj?.userEmail,
              password: password,
            });
            handleGetStaffs(1);
            setUserName("");
            setUserEmail("");
            setUserMobileNo("");
            setBalanceLimit("");
            setIsActive(true);
            setPassword("");
            setConfirmPassword("");
            setUserRole(1);
            toast.success("User added successfully..");
            onOpen();
            $("#modal-close").click();
            $(".modal-backdrop").remove();
            $("body").removeClass("modal-open");
            $("body").removeAttr("style");
            setLoading(false);
          } else {
            toast.error(response?.data?.message);
            setLoading(false);
          }
        };
        postData();
      }
    }
  };

  //reset password cahnge option
  let [userid, setUserId] = useState();
  let [loader, setloader] = useState(false);

  const handlePasswordChange = () => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,32}$/;

    if (restpassword == "") {
      toast.error("Sorry! Password is empty");
      return;
    }

    if (re.test(restpassword) === false) {
      toast.error(
        "Passwprd must one uppercase letter, lowercase letter, number, special character and 8 length",
        {
          className: "toast-message",
        }
      );
      return;
    }
    if (restconfirmpassword == "") {
      toast.error("Sorry! Confirm password is empty");
      return;
    }
    if (re.test(restconfirmpassword) === false) {
      toast.error(
        "ConfirmPassword must one uppercase letter, lowercase letter, number, special character and 8 length",
        {
          className: "toast-message",
        }
      );
      return;
    }
    if (restpassword !== restconfirmpassword) {
      toast.error("Sorry! Password does not same");
      return;
    }

    let payload = {
      agentId: parseInt(sessionStorage.getItem("agentId")) ?? 0,
      password: restpassword,
      id: userid,
    };
    const postPasswardChange = async () => {
      setloader(true);
      const response = await resetPasswordUser(payload).catch((error) => {});

      if (response?.data?.isSuccess) {
        setRestpassword("");
        setRestconfirmpassword("");
        toast.success(response?.data?.message);
        setloader(false);
        onClose1();
      } else {
        toast.error(response.data.message);
        setloader(false);
      }
    };
    postPasswardChange();
  };

  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [isLoading, setIsloading] = useState(false);

  const handleGetStaffs = (currentPageNumber) => {
    const agentId = sessionStorage.getItem("agentId") ?? 0;
    const getData = async () => {
      setIsloading(true);
      const response = await getAgentStaffs(
        agentId,
        currentPageNumber,
        pageSize
      );
      setStaffList(response.data.data);
      setPageCount(response.data.totalPages);
      setIsloading(false);
    };
    getData();
    const getSetting = async () => {
      const response = await getAgentSettings(agentId);
      setSettingItem(response.data);
    };
    getSetting();
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
    handleGetStaffs(currentPage);
  };

  const handleCreateItem = () => {
    setCurrentItem(null);
    setUserName("");
    setUserEmail("");
    setUserMobileNo("");
    setBalanceLimit("");
    setPassword("");
    setConfirmPassword("");

    setIsActive(true);
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setUserName(item.userName);
    setUserEmail(item.userEmail);
    setUserMobileNo(item.userMobileNo);
    setBalanceLimit(item.balanceLimit);
    setIsActive(item.isActive);
    setUserRole(item.b2BRoleID);
    setPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    handleGetStaffs(currentPageNumber);
  }, [currentPageNumber]);

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg px-4 pb-5">
        <section className="content-header"></section>
        <section className="content">
          <ToastContainer position="bottom-right" autoClose={1500} />
          <div className="mx-lg-5 mx-md-5 mx-sm-1">
            <div className="container-fluid bg-white">
              <div className="row">
                <div
                  className="col-lg-12 border-bottom d-flex justify-content-start p-0 ms-2 ms-lg-0"
                  style={{
                    whiteSpace: "nowrap",
                    overflowX: "auto",
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                    msOverflowStyle: "none",
                  }}
                >
                  <div
                    className="custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="custom-border-selected-tab pb-3">
                      Users
                    </span>
                  </div>
                </div>
              </div>

              <div className="row p-2 py-3">
                <div className="text-end pb-3">
                  <a
                    href="javascript:void(0)"
                    className="btn button-color float-right d-print-none text-white fw-bold border-radius filter-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#accountModal"
                    onClick={() => handleCreateItem()}
                  >
                    <span className="me-1">
                      <i className="fas fa-user-plus"></i>
                    </span>{" "}
                    Add new user
                  </a>
                </div>
                <div className="table-responsive">
                  <table className="table table-lg">
                    <thead className="text-start fw-bold bg-secondary">
                      <tr>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ROLE</th>
                        <th>MOBILE</th>
                        <th className="text-end">TRANSACTION LIMIT</th>
                        <th>MEMBER SINCE</th>
                        <th>IS ACTIVE?</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    {!isLoading && (
                      <tbody className="tbody">
                        {staffList.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="text-start fw-bold text-secondary"
                            >
                              <td>{item.userName}</td>
                              <td>{item.userEmail}</td>
                              <td>
                                {item.b2BRoleID === 1
                                  ? "Searching"
                                  : item.b2BRoleID === 2
                                  ? "Booking"
                                  : item.b2BRoleID === 3
                                  ? "Ticketing"
                                  : "N/A"}
                              </td>
                              <td>{item.userMobileNo}</td>
                              <td className="text-end text-dark">
                                AED {item.balanceLimit.toLocaleString("en-US")}
                              </td>
                              <td>
                                {moment(item.createdDate).format("DD-MM-yyyy")}
                              </td>
                              <td>
                                {item.isActive === true ? (
                                  <span className="px-3 py-2 rounded active-status-color ">
                                    Active
                                  </span>
                                ) : (
                                  <span className="px-3 py-2 rounded inactive-status-color">
                                    Inactive
                                  </span>
                                )}
                              </td>
                              <td>
                                <div className="d-flex justify-content-start gap-3">
                                  <a
                                    onClick={() => handleEditItem(item)}
                                    href="#"
                                    className="text-white shadow p-1 rounded-3 button-color"
                                    data-bs-toggle="modal"
                                    title="Edit"
                                    data-bs-target="#accountModal"
                                  >
                                    <HStack justifyContent="center">
                                      <Icon
                                        as={BiEdit}
                                        h="18px"
                                        w="18px"
                                        color={"logoGreen"}
                                      />
                                    </HStack>
                                  </a>

                                  <button
                                    onClick={() => {
                                      onOpen1();
                                      setUserId(item?.userId);
                                    }}
                                    title="Password Change"
                                    className="shadow p-1 rounded-3 text-white"
                                    style={{ backgroundColor: "#ed7f22" }}
                                  >
                                    <Icon
                                      as={RiLockPasswordLine}
                                      h="18px"
                                      w="18px"
                                    />
                                  </button>

                                  <button
                                    onClick={() => {
                                      onOpen2();
                                      setUserId(item?.userId);
                                    }}
                                    title="User History"
                                    className="shadow p-1 rounded-3 button-color text-white"
                                  >
                                    <Icon as={FaHistory} h="18px" w="18px" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    )}
                  </table>
                  {isLoading && <TableLoader />}
                  {staffList?.length === 0 && !isLoading && <NoDataFound />}
                </div>
                <div className="d-flex justify-content-end">
                  {staffList.length > 0 && !isLoading && (
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
            </div>
          </div>

          <div
            className="modal fade"
            id="accountModal"
            tabIndex={-1}
            aria-labelledby="accountModalLabel"
            data-bs-backdrop="static"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="accountModalLabel">
                    {currentItem === null ? "Add" : "Edit"} Staff
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    id="modal-close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row my-3">
                    <input type={"hidden"}></input>
                    <div className="col-sm-3">
                      <label>
                        Name<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type={"text"}
                        value={userName}
                        className="form-control border-radius"
                        placeholder="Name"
                        onChange={(e) => setUserName(e.target.value)}
                      ></input>
                    </div>
                    <div className="col-sm-3">
                      <label>
                        Email<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type={"email"}
                        value={userEmail}
                        className="form-control border-radius"
                        placeholder="Email"
                        onChange={(e) => setUserEmail(e.target.value)}
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        readOnly={currentItem === null ? false : true}
                      ></input>
                    </div>
                    <div className="col-sm-3">
                      <label>
                        Mobile No<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type={"number"}
                        value={userMobileNo}
                        className="form-control border-radius"
                        placeholder="Mobile No"
                        onChange={(e) => setUserMobileNo(e.target.value)}
                      ></input>
                    </div>
                    <div className="col-sm-3">
                      <label>
                        Transaction Limit
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type={"number"}
                        value={balanceLimit}
                        className="form-control border-radius"
                        placeholder="Balance Limit"
                        onChange={(e) => setBalanceLimit(e.target.value)}
                      ></input>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3">
                      <label>
                        User Role<span style={{ color: "red" }}>*</span>
                      </label>
                      <select
                        className="custom-select border-radius"
                        value={userRole}
                        required
                        onChange={(e) => setUserRole(e.target.value)}
                      >
                        <option value={1}>Searching</option>
                        <option value={2}>Booking</option>
                        <option value={3}>Ticketing</option>
                      </select>
                    </div>

                    {currentItem !== null ? (
                      <></>
                    ) : (
                      <div className="col-sm-3">
                        <label>
                          Password <span style={{ color: "red" }}>*</span>
                        </label>

                        <PasswordInput
                          value={password}
                          setValue={setPassword}
                          placeholder={"Password"}
                        />
                      </div>
                    )}

                    {currentItem !== null ? (
                      <></>
                    ) : (
                      <div className="col-sm-3">
                        <label>
                          Confirm Password{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <PasswordInput
                          value={ConfirmPassword}
                          setValue={setConfirmPassword}
                          placeholder={"Confirm Password"}
                        />
                      </div>
                    )}

                    <div className="col-sm-3 ">
                      <label></label>
                      <div className="d-flex gap-3 justify-content-start align-items-center">
                        <label className="pt-2">
                          Is Active?<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="rounded-3">
                          <input
                            type={"checkbox"}
                            checked={isActive ?? true}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="form-check"
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn button-secondary-color text-white shadow border-radius fw-bold"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn button-color text-white shadow border-radius fw-bold"
                    onClick={() => handleSubmit()}
                    disabled={loading ? true : false}
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <span>Submit</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ModalForm
            isOpen={isOpen}
            onClose={onClose}
            title={"User Credential, keep it for login."}
            size={"sm"}
          >
            <Box bgColor={"#f1eded"} p={3} m={2} borderRadius={"20px"}>
              <Box fontSize={"20px"} fontWeight={700}>
                Email:{" "}
              </Box>
              <Box
                fontSize={"20px"}
                border={"2px solid #f1eded"}
                bgColor={"white"}
                borderRadius={"20px"}
                p={2}
                mb={4}
              >
                {userCredential?.username}
              </Box>
              <Box fontSize={"20px"} fontWeight={700}>
                User Password:{" "}
              </Box>
              <Box
                fontSize={"20px"}
                border={"2px solid #f1eded"}
                borderRadius={"20px"}
                p={2}
                mb={4}
                bgColor={"white"}
              >
                {" "}
                {userCredential?.password}
              </Box>
              <Box fontSize={"14px"} color={"red"} p={2}>
                {" "}
                N.B: Your password won't be visible later.
              </Box>
            </Box>
          </ModalForm>

          <ModalForm
            isOpen={isOpen2}
            onClose={onClose2}
            title={"User History List"}
          >
            <StaffHistory userId={userid} />
          </ModalForm>

          <ModalForm
            isOpen={isOpen1}
            onClose={onClose1}
            title={"Reseat Password"}
            size={"md"}
          >
            <Box pb={"20px"}>
              <div className="mb-3">
                <label>
                  Password <span style={{ color: "red" }}>*</span>
                </label>
                <PasswordInput
                  value={restpassword}
                  setValue={setRestpassword}
                  placeholder={"Password"}
                />
              </div>

              <div className="mb-3">
                <label>
                  Confirm Password <span style={{ color: "red" }}>*</span>
                </label>
                <PasswordInput
                  value={restconfirmpassword}
                  setValue={setRestconfirmpassword}
                  placeholder={"Confirm Password"}
                />
              </div>

              <Box
                display={"flex"}
                justifyContent={"end"}
                mt={"10px"}
                gap={"2"}
              >
                <Button
                  onClick={onClose1}
                  style={{ borderRadius: "8px", backgroundColor: "#ed7f22" }}
                  className="text-white"
                >
                  Close
                </Button>
                <Button
                  style={{ borderRadius: "8px", backgroundColor: "#7c04c0" }}
                  className="text-white"
                  onClick={() => handlePasswordChange()}
                  disabled={loader ? true : false}
                >
                  {loader ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <span>Submit</span>
                  )}
                </Button>
              </Box>
            </Box>
          </ModalForm>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Staff;
