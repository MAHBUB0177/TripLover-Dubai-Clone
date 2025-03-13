import {
  Box,
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdOutlineNotifications } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { environment } from "../../../../src/Pages/SharePages/Utility/environment";
import useNotification from "../../../hooks/useNotification";
import logo from "../../../images/logo/logo-combined.png";
import "./Navbar.css";
import { Transition } from "@headlessui/react";
import { FaUser, FaUserAlt } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import {
  _get2FAInfo,
  getAirTicketingInfo,
  getGetCurrentUser,
  getSupportNoticeByAgent,
  getSupportNoticeCountByAgent,
  getTicketData,
  getTop20LatestNotification,
  marknotificationasread,
} from "../../../common/allApi";
import { useIdleTimer } from "react-idle-timer";
import axios from "axios";

const Navbar = () => {
  let [noticeCount, setNoticeCount] = useState(0);
  let [noticeList, setNoticeList] = useState([]);
  const [topnotification, setTopNotification] = useState();
  let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  let isAgent = JSON.parse(sessionStorage.getItem("isAgent"));
  let agentInfo = JSON.parse(sessionStorage.getItem("agentInfoData"));
  let accountManager = JSON.parse(sessionStorage.getItem("accountManager"));
  let [serchText, setSearchText] = useState("");
  // let version = JSON.parse(localStorage.getItem('build_version'));
  const [get2FAData, setGet2FAData] = useState({});

  const navigate = useNavigate();
  const getUserData = async () => {
    try {
      await getGetCurrentUser().catch((err) => {
        if (err.message === "Request failed with status code 428") {
          navigate("/profile");
          sessionStorage.setItem("passwordChange", true);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const get2FAInfo = async () => {
    await _get2FAInfo()
      .then((res) => {
        if (res?.data) setGet2FAData(res?.data);
      })
      .catch((err) => {
        setGet2FAData({});
        toast.error("Please try again!");
      });
  };

  useEffect(() => {
    getUserData();
    get2FAInfo();
  }, []);

  let s3URL = "https://fstuploaddocument.s3.ap-southeast-1.amazonaws.com/";
  let localURL = "wwwroot/Uploads/Agent/";
  let location = useLocation();

  const handelLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
    sessionStorage.setItem("popup", JSON.stringify(false));
  };

  // useEffect(() => {
  //   const clearCookiesAndAddEventListener = () => {
  //     if (!version || version !== environment.build_version) {
  //       document.cookie.split(";").forEach(cookie => {
  //         document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  //       });
  //       const beforeUnloadHandler = ()=> {
  //         localStorage.clear();
  //         sessionStorage.clear();
  //         window.location.href = "/";
  //         sessionStorage.setItem("popup", JSON.stringify(false));
  //       };
  //       window.addEventListener("DOMContentLoaded",beforeUnloadHandler);
  //       return () => {
  //         window.removeEventListener("DOMContentLoaded",beforeUnloadHandler);
  //       };
  //     }
  //   };
  //   return clearCookiesAndAddEventListener();
  // }, []);

  useEffect(() => {
    isAgent === false &&
      (location?.pathname === "/balance" ||
        location?.pathname === "/staff" ||
        location?.pathname === "/partial-due" ||
        location?.pathname === "/partial-paid" ||
        location?.pathname === "/ledger" ||
        location?.pathname === "/partial-request" ||
        location?.pathname === "/share-pnr") &&
      navigate("/search");
  }, [isAgent, location?.pathname]);

  const getTicketingData = (utid, bookingStatus, ticketStatus, type) => {
    if (ticketStatus !== null && type === true) {
      getTicketData(utid, ticketStatus).then((res) => {
        if (res?.data === "user id not match") {
          toast.error("Data not found!");
        } else {
          window.open(
            "/ticket?utid=" + utid + "&sts=" + ticketStatus,
            "_blank"
          );
        }
      });
    } else if (bookingStatus !== null && type === false) {
      getTicketData(utid, bookingStatus).then((res) => {
        if (res?.data === "user id not match") {
          toast.error("Data not found!");
        } else {
          window.open(
            "/bookedview?utid=" + utid + "&sts=" + bookingStatus,
            "_blank"
          );
        }
      });
    }
  };

  const handleViewTicket = async (e) => {
    e.preventDefault();
    let sendObj=serchText.trim()
    await getAirTicketingInfo(sendObj)
      .then((res) => {
        if (res?.data?.isSuccess === true) {
          navigate("/global-search", {
            state: { myArray: res?.data?.data?.searchResult, pnr: sendObj },
          });
        } else {
          toast.error("Data not found!");
        }
      })
      .catch((err) => {});
  };

  const handleInit = () => {
    getSupportNoticeCountByAgent(sessionStorage.getItem("agentId") ?? 0, true)
      .then((supportRes) => {
        setNoticeCount(supportRes.data.noticeCount);
      })
      .catch((err) => {});
    getSupportNoticeByAgent(sessionStorage.getItem("agentId") ?? 0, true)
      .then((noticeRes) => {
        setNoticeList(noticeRes.data);
      })
      .catch((err) => {
        //alert('Invalid login')
      });
  };

  useEffect(() => {
    handleInit();
  }, []);

  const { setNotificationCount, notificationCount } = useNotification();
  const GetTopNotificationList = async () => {
    await getTop20LatestNotification()
      .then((res) => {
        setTopNotification(res?.data?.data?.unreadNotifications);
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

  useEffect(() => {
    GetTopNotificationList();
  }, []);

  const handelViewTicket = (item) => {
    if (item?.isRead === false) {
      marknotificationasread(item.id).then((res) => {
        GetTopNotificationList();
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
      });
    }
  };
  const notificate = JSON.parse(localStorage.getItem("notificationCount"));

  const [isOpenM, setIsOpenM] = useState(false);

  const tokenData = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    if (tokenData === undefined || tokenData === null) {
      handelLogout();
    }
  }, []);

  const [state, setState] = useState("Active");
  const [count, setCount] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const onIdle = () => {
    setState("Idle");
  };

  const onActive = () => {
    setState("Active");
  };

  const onAction = () => {
    setCount(count + 1);
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    onActive,
    timeout: 10_000,
    crossTab: true,
    leaderElection: true,
    syncTimers: 200,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 0);

    return () => {
      clearInterval(interval);
    };
  });

  const [seconds, setSeconds] = useState(1800); // 10 minutes in seconds

  useEffect(() => {
    if (state === "Idle") {
      const timer = setTimeout(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setSeconds(1800);
    }
  }, [seconds, state]);

  useEffect(() => {
    if (seconds === 0) {
      handelLogout();
    }
    if (seconds === 1600) {
      let sendobj = {
        token: tokenData?.token,
        refreshToken: tokenData?.refreshToken,
      };
      const refreshTokenResponse = async () => {
        const refreshTokenResponse = await axios.post(
          environment.refreshTokenUrl,
          sendobj
        );
        const newAccessToken = refreshTokenResponse.data.data;
        if (newAccessToken) {
          localStorage.setItem("token", JSON.stringify(newAccessToken));
        }
      };
      if (tokenData) {
        refreshTokenResponse();
      }
    }
  }, [seconds]);

  return (
    <nav
      className="navbar-white"
      style={{ position: "sticky", top: "0", zIndex: "1010" }}
    >
      <div className="main-header navbar navbar-expand navbar-white navbar-light d-flex justify-content-between">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
          <li className="nav-item my-auto">
            <Link to="/search">
              <Image src={logo} alt="Triplover" w="100px" />
            </Link>
          </li>
        </ul>
        <div className="nav-item me-2 d-none d-md-block">
          <form className="form-inline" onSubmit={handleViewTicket}>
            <div className=" d-flex align-items-center">
              <input
                className="form-control search-input"
                type="search"
                aria-label="Search"
                placeholder="PNR/Ticket No/Booking ID"
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  borderStartStartRadius: "8px",
                  borderEndStartRadius: "8px",
                }}
              />
              <button
                className="btn button-color text-white fw-bold my-2 my-sm-0"
                type="submit"
                disabled={serchText === "" ? true : false}
                style={{
                  borderEndEndRadius: "8px",
                  borderStartEndRadius: "8px",
                }}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>

        <span className="d-none d-md-block">
          <ul className="navbar-nav ml-auto d-flex flex-wrap justify-content-end align-items-center">
            {accountManager === "" ? (
              <> </>
            ) : (
              <>
                <li className="nav-item dropdown me-1">
                <a className="nav-link" data-toggle="dropdown" href="#">
                    <span className="fw-bold">
                      <i className="fa fa-cog"></i>
                    </span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                    <div className="dropdown-divider"></div>
                    <span className="dropdown-item fw-bold">
                      Your Account Manager
                    </span>
                    <div className="dropdown-divider"></div>
                    <span className="dropdown-item account-manager">
                      Name: {accountManager?.name}
                    </span>
                    <span className="dropdown-item account-manager">
                      Email: {accountManager?.email}
                    </span>
                    <span className="dropdown-item account-manager">
                      Mobile: {accountManager?.mobileNo}
                    </span>
                    <div className="dropdown-divider"></div>
                  </div>
                </li>
              </>
            )}

            <li className="nav-item dropdown me-1">
            <a
                className="nav-link pt-1 px-2 mt-1"
                data-toggle="dropdown"
                href="#"
                style={{
                  color: "white",
                  background: "#7C04C0",
                  height: "30px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                AED
                {/* <TbCurrencyTaka style={{ color: 'white', background: '#7C04C0', padding: '3px', height: '30px', width: '30px', borderRadius: '5px' }} /> */}
              </a>
              <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-right"
                style={{ minWidth: "250px" }}
              >
                <div className="dropdown-divider"></div>
                <div className="p-3 text-end">
                  <p>
                    Your Account Balance (
                    {agentInfo?.currencyName !== undefined
                      ? agentInfo?.currencyName
                      : ""}{" "}
                    {isAgent
                      ? agentInfo?.currentBalance
                      : agentInfo?.balanceLimit}
                    )
                  </p>
                </div>
                <div className="dropdown-divider"></div>
                {isAgent && (
                  <Link to="/balance" className="dropdown-item text-end">
                    Deposit Request
                  </Link>
                )}
              </div>
            </li>
            <li className="nav-item dropdown mx-1" title="My Account">
              <a
                className="nav-link d-flex justify-content-center align-items-center gap-1 px-0"
                data-toggle="dropdown"
                href="#"
              >
                <span>
                  {agentInfo?.logoName !== undefined ||
                  agentInfo?.logoName !== null ? (
                    <img
                      alt="img01"
                      src={environment.s3URL + `${agentInfo?.logoName}`}
                      style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </span>
                <span>
                  <p style={{ fontSize: "12px" }} className="fw-bold text-end">
                    {agentInfo?.name}
                  </p>
                  <p
                    style={{ fontSize: "10px" }}
                    className="fw-bold text-center"
                  >
                    ({agentInfo?.code})
                  </p>
                </span>
              </a>

              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item">
                  <i className="fas fa-user mr-2"></i> Profile{" "}
                  <span style={{ fontSize: "10px" }} className="text-center">
                    ({agentInfo?.name} {agentInfo?.code})
                  </span>
                </Link>
                <div className="dropdown-divider"></div>
                <div className="dropdown-divider"></div>
                <div
                  className="dropdown-item"
                  onClick={handelLogout}
                  id="logOut"
                  style={{ cursor: "pointer" }}
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>Logout
                </div>
              </div>
            </li>
            <li className="me-1">
              <Menu padding={0}>
                <MenuButton
                  padding={0}
                  as={Button}
                  onClick={() => {
                    GetTopNotificationList();
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  <span>
                    <span>
                      {" "}
                      <MdOutlineNotifications
                        style={{
                          height: "25px",
                          width: "25px",
                          color: "purple",
                        }}
                      />
                    </span>
                    <span className="badge badge-warning navbar-badge">
                      {notificationCount > 100
                        ? "99+"
                        : notificationCount ?? notificate}
                    </span>
                  </span>
                </MenuButton>

                <MenuList padding={0}>
                  <MenuItem padding={0}>
                    <div
                      style={{
                        padding: "0px",
                        height: "auto",
                        maxHeight: "300px",
                        overflowX: "hidden",
                      }}
                    >
                      {topnotification?.map((item, index) => {
                        return (
                          <div
                            onClick={() => {
                              handelViewTicket(item);
                            }}
                            key={index}
                          >
                            <Link to="#" className="dropdown-item">
                              <div className="d-flex justify-content-start gap-2">
                                <div className="">
                                  <p style={{ marginTop: "3px" }}>
                                    <MdOutlineNotifications
                                      style={{
                                        background: "#7c04c0",
                                        height: "35px",
                                        width: "35px",
                                        color: "white",
                                        borderRadius: "5px",
                                      }}
                                    />
                                  </p>
                                </div>
                                <div>
                                  <p title={item.title}>
                                    {" "}
                                    {item.title.substring(0, 40)}...{" "}
                                  </p>
                                  <p style={{ fontSize: "12px" }}>
                                    {item.message.substring(0, 40)}...{" "}
                                  </p>
                                </div>
                              </div>
                            </Link>
                            <div className="dropdown-divider"></div>
                          </div>
                        );
                      })}
                      <Link to={"/notification"}>
                        <div
                          className="mb-0  text-center p-3  shadow-lg"
                          style={{
                            position: "sticky",
                            bottom: "-1px",
                            backgroundColor: "white",
                          }}
                        >
                          {notificationCount ?? notificate} Notifications
                        </div>
                      </Link>
                    </div>
                  </MenuItem>
                </MenuList>
              </Menu>
            </li>
          </ul>
        </span>

        <Box display={{ lg: "none", md: "none", sm: "block" }}>
          <button onClick={() => setIsOpenM(!isOpenM)}>
            <span className="sr-only">Open main menu</span>
            {!isOpenM ? (
              <FaUserAlt
                style={{
                  color: "white",
                  background: "#7c04c0",
                  padding: "8px",
                  height: "30px",
                  width: "30px",
                  borderRadius: "5px",
                }}
              />
            ) : (
              <FaUserAlt
                style={{
                  color: "white",
                  background: "#7c04c0",
                  padding: "8px",
                  height: "30px",
                  width: "30px",
                  borderRadius: "5px",
                }}
              />
            )}
          </button>
        </Box>
      </div>
      {(get2FAData?.data?.is2FAActive === null || get2FAData?.data?.is2FAActive === false)  && (
        <li
          className="nav-item me-1 text-white fw-bold  p-1 d-flex justify-content-center text-center"
          style={{ fontSize: "12px" ,background:'#7C04C0'}}
        >
          Your Two-Factor Authentication (2FA) is currently inactive. Please
          activate 2FA for security reasons
        </li>
      )}

      <Transition
        show={isOpenM}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {() => (
          <div className="d-lg-none d-md-none" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 bg-white">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item d-flex justify-content-center">
                  <form className="form-inline" onSubmit={handleViewTicket}>
                    <div className=" d-flex align-items-center">
                      <input
                        className="form-control search-input rounded-start"
                        type="search"
                        aria-label="Search"
                        placeholder="PNR/Ticket No/Booking ID"
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                      <button
                        className="btn button-color text-white fw-bold my-2 my-sm-0 rounded-end"
                        type="submit"
                        disabled={serchText === "" ? true : false}
                      >
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </form>
                </li>
                <Flex
                  gap={5}
                  justifyContent={"center"}
                  alignItems={"center"}
                  mt={2}
                >
                  <li className="text-center my-1">
                    <Menu padding={0}>
                      <MenuButton
                        padding={0}
                        as={Button}
                        onClick={() => {
                          GetTopNotificationList();
                        }}
                      >
                        <span>
                          <span>
                            {" "}
                            <MdOutlineNotifications
                              style={{
                                height: "25px",
                                width: "25px",
                                color: "purple",
                              }}
                            />
                          </span>
                          <span className="badge badge-warning navbar-badge">
                            {notificationCount > 100
                              ? "99+"
                              : notificationCount ?? notificate}
                          </span>
                        </span>
                      </MenuButton>

                      <MenuList padding={0}>
                        <MenuItem padding={0}>
                          <div
                            style={{
                              padding: "0px",
                              height: "auto",
                              maxHeight: "300px",
                              overflowX: "hidden",
                            }}
                          >
                            {topnotification?.map((item, index) => {
                              return (
                                <div
                                  onClick={() => {
                                    handelViewTicket(item);
                                  }}
                                  key={index}
                                >
                                  <Link to="#" className="dropdown-item">
                                    <div className="d-flex">
                                      <p style={{ marginTop: "3px" }}>
                                        <MdOutlineNotifications
                                          style={{
                                            height: "20px",
                                            width: "20px",
                                            color: "purple",
                                          }}
                                        />
                                      </p>
                                      <p title={item.title}>
                                        {" "}
                                        {item.title.substring(0, 40)}...{" "}
                                      </p>
                                    </div>

                                    <p
                                      style={{
                                        paddingLeft: "28px",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {item.message.substring(0, 40)}...{" "}
                                    </p>
                                  </Link>
                                  <div className="dropdown-divider"></div>
                                </div>
                              );
                            })}
                            <Link to={"/notification"}>
                              <div
                                className="mb-0  text-center p-3  shadow-lg"
                                style={{
                                  position: "sticky",
                                  bottom: "-1px",
                                  backgroundColor: "white",
                                }}
                              >
                                {notificationCount ?? notificate} Notifications
                              </div>
                            </Link>
                          </div>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </li>
                  <li className="nav-item dropdown text-center my-1">
                  <a
                className="nav-link pt-1 px-2 mt-1"
                data-toggle="dropdown"
                href="#"
                style={{
                  color: "white",
                  background: "#7C04C0",
                  height: "30px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                AED
                {/* <TbCurrencyTaka style={{ color: 'white', background: '#7C04C0', padding: '3px', height: '30px', width: '30px', borderRadius: '5px' }} /> */}
              </a>
                    <div
                      className="dropdown-menu dropdown-menu-lg dropdown-menu-right"
                      style={{ minWidth: "225px" }}
                    >
                      <div className="dropdown-divider"></div>
                      <div className="p-3 text-end">
                        <p>
                          Your Account Balance (
                          {agentInfo?.currencyName !== undefined
                            ? agentInfo?.currencyName
                            : ""}{" "}
                          {isAgent
                            ? agentInfo?.currentBalance
                            : agentInfo?.balanceLimit}
                          )
                        </p>
                      </div>
                      <div className="dropdown-divider"></div>
                      {isAgent && (
                        <Link to="/balance" className="dropdown-item text-end">
                          Deposit Request
                        </Link>
                      )}
                    </div>
                  </li>

                  {accountManager === "" ? (
                    <> </>
                  ) : (
                    <>
                      <li className="nav-item dropdown text-center my-1">
                        <a className="nav-link" data-toggle="dropdown" href="#">
                          <IoMdSettings
                            style={{
                              color: "white",
                              background: "#7c04c0",
                              padding: "3px",
                              height: "35px",
                              width: "35px",
                              borderRadius: "5px",
                            }}
                          />
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                          <div className="dropdown-divider"></div>
                          <span className="dropdown-item fw-bold">
                            Your Account Manager
                          </span>
                          <div className="dropdown-divider"></div>
                          <span className="dropdown-item account-manager">
                            Name: {accountManager?.name}
                          </span>
                          <span className="dropdown-item account-manager">
                            Email: {accountManager?.email}
                          </span>
                          <span className="dropdown-item account-manager">
                            Mobile: {accountManager?.mobileNo}
                          </span>
                          <div className="dropdown-divider"></div>
                        </div>
                      </li>
                    </>
                  )}

                  <li
                    className="nav-item dropdown text-center my-1"
                    title="My Account"
                  >
                    <a className="nav-link" data-toggle="dropdown" href="#">
                      <FaUser
                        style={{
                          color: "white",
                          background: "#7c04c0",
                          padding: "7px",
                          height: "35px",
                          width: "35px",
                          borderRadius: "5px",
                        }}
                      />
                    </a>
                    <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                      <div className="dropdown-divider"></div>
                      <Link to="/profile" className="dropdown-item">
                        <i className="fas fa-user mr-2"></i> Profile{" "}
                        <span
                          style={{ fontSize: "10px" }}
                          className="text-center"
                        >
                          ({agentInfo?.name} {agentInfo?.code})
                        </span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-divider"></div>
                      <div
                        className="dropdown-item"
                        onClick={handelLogout}
                        id="logOut"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>Logout
                      </div>
                    </div>
                  </li>
                </Flex>
              </ul>
            </div>
          </div>
        )}
      </Transition>
    </nav>
  );
};

export default Navbar;
