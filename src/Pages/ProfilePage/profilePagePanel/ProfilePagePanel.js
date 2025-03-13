import React, { useEffect, useRef, useState } from "react";
import "./ProfilePagePanel.css";
import { environment } from "../../../../src/Pages/SharePages/Utility/environment";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import ModalForm from "../../../common/modalForm";
import logo from "../../../images/logo/logo-combined.png";
import {
  _2FARequestEmailVerification,
  _applyForPartialPayment,
  _get2FAInfo,
  _getPartialPaymentStatus,
  _reuestForEmailVerificationOtp,
  _toggle2FA,
  _toggle2FAEL,
  _verifyEmail,
  desabled2FA,
  getGetCurrentUser,
  getUserAllInfo,
  resetPassword,
  updateUser,
  uploadB2BLogo,
} from "../../../common/allApi";
import PasswordInput from "../../../common/passwordInput";
import { preventNegativeValues } from "../../../common/functions";
const ProfilePagePanel = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  let [currentUser, setCurrentUser] = useState({});
  let [fullName, setFullName] = useState("");
  let [email, setEmail] = useState("");
  let [mobile, setMobile] = useState("");
  let [fullNameCom, setFullNameCom] = useState("");
  let [emailCom, setEmailCom] = useState("");
  let [mobileCom, setMobileCom] = useState("");
  let [userId, setUserId] = useState();
  let [logoName, setLogoName] = useState();
  let [agentInfo, setAgentInfo] = useState(0);
  let [previousPassword, setPreviousPassword] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleGetUser = () => {
    const getData = async () => {
      const response = await getGetCurrentUser();
      setCurrentUser(response.data);
      setUserId(response.data.id);
      setFullName(response.data.fullName);
      setEmail(response.data.email);
      setMobile(response.data.mobile);
      setLogoName(response.data.logoName);
    };
    getData();
    const getAgentData = async () => {
      getUserAllInfo()
        .then((agentRes) => {
          sessionStorage.setItem("agentId", agentRes.data.id);
          sessionStorage.setItem("agentName", agentRes.data.name);
          sessionStorage.setItem("logoName", agentRes.data.logoName);
          sessionStorage.setItem("agentAddress", agentRes.data.address);
          setAgentInfo(agentRes.data);
          setFullNameCom(agentRes.data.name);
          setEmailCom(agentRes.data.email);
          setMobileCom(agentRes.data.mobileNo);
        })
        .catch((err) => {
          //alert('Invalid login')
        });
    };
    getAgentData();
  };

  const handlePasswordSubmit = () => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,32}$/;
    if (previousPassword === "") {
      toast.error("Please enter previous password..");
      return;
    }

    if (password === "") {
      toast.error("Please enter password..");
      return;
    }
    if (re.test(password) === false) {
      toast.error(
        "Passwprd must one uppercase letter, lowercase letter, number, special character and 8 length",
        {
          className: "toast-message",
        }
      );
      return;
    }
    if (confirmPassword === "") {
      toast.error("Please enter confirm password..");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm password must be same.");
      return;
    }
    let sendObj = {
      previousPassword: previousPassword,
      password: password,
      confirmPassword: confirmPassword,
    };
    const putPasswordData = async () => {
      await resetPassword(sendObj)
        .then((res) => {
          if (res.data.isSuccess == true) {
            toast.success("Thanks! Password changed successfully");
            changePassword();
            document.getElementById("closeModal").click();
            const handelLogout = () => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = "/";
              sessionStorage.setItem("popup", JSON.stringify(false));
            };
            setTimeout(() => {
              handelLogout();
            }, 2000);
          } else {
            toast.error("Sorry! " + res.data.message);
          }
        })
        .catch((err) => {
          toast.error("Sorry! Password not changed..");
        });
    };
    putPasswordData();
  };

  const changePassword = () => {
    setPreviousPassword("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = () => {
    if (fullNameCom === "") {
      toast.error("Sorry! Company Name is empty");
      return;
    }
    if (emailCom === "") {
      toast.error("Sorry! Company Email is empty");
      return;
    }
    if (mobileCom === "") {
      toast.error("Sorry! Company Mobile is empty");
      return;
    }
    currentUser.fullName = fullNameCom;
    currentUser.email = emailCom;
    currentUser.mobile = mobileCom;

    const putData = async () => {
      const response = await updateUser(currentUser).catch((err) => {
        toast.error("Sorry! Profile not updated..");
      });
      if (response.data.isSuccess == true) {
        sessionStorage.setItem("agentName", fullName);

        window.location.reload();
        toast.success("Thanks! Profile updated successfully");
      } else {
        toast.error("Sorry! Profile not updated..");
      }
    };
    putData();
  };

  const logoFileUpload = (file) => {
    setProgress(0);
    let fileExt = file.name.split(".").pop().toLowerCase();
    if (!(fileExt === "jpg" || fileExt === "jpeg" || fileExt === "png")) {
      toast.error("Sorry! Invalid file type..");
    } else {
      var formData = new FormData();
      formData.append(`file`, file);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: "Bearer " + tokenData?.token,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setProgress(percentCompleted); // Update progress state
        },
      };
      const postData = async () => {
        await uploadB2BLogo(userId, formData, config).then((res) => {
          if (res?.data?.isUploaded) {
            setLogoName(file.name);
            sessionStorage.setItem("logoName", file.name);
            window.location.reload();
          } else {
            setProgress(0);
            setLogoName("");
            toast.error("Please try again!");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        });
      };
      postData();
    }
  };
  useEffect(() => {
    handleGetUser();
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

  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();

  const requestEmailVerification = async () => {
    await _2FARequestEmailVerification()
      .then((res) => {
        if (res?.data?.isSuccess) {
          get2FAInfo();
        }
      })
      .catch((err) => {
        toast.error("Please try again!");
      });
  };

  const [get2FAData, setGet2FAData] = useState({});

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

  const [message, setMessage] = useState();
  const [desableotp, setdesableotp] = useState("");
  const [desable2fa, setdesable2fa] = useState();

  const reuestForEmailVerificationOtp = async () => {
    await _reuestForEmailVerificationOtp()
      .then((res) => {
        if (res?.data) {
          setMessage(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error("Please try again!");
      });
  };

  const [userUTP, setUserOTP] = useState();

  const handleSubmitOTP = (e) => {
    e.preventDefault();
    const regexPattern = /^\d{7}$/;

    setUserOTP();
    const verifyEmail = async () => {
      await _verifyEmail(userUTP)
        .then((res) => {
          if (res?.data?.isSuccess) {
            get2FAInfo();
          } else {
            setUserOTP("");
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          setUserOTP("");
          toast.error("Please try again!");
        });
    };

    if (regexPattern.test(userUTP)) {
      verifyEmail();
    } else {
      toast.error("OTP length must be 7");
    }
  };

  const [loader, setLoader] = useState(false);

  const toggle2FA = async () => {
    try {
      setLoader(true);
      await _toggle2FA()
        .then((res) => {
          if (res?.data) {
            setUserOTP("");
            toast.success(res?.data?.message);
            if (res?.data?.data?.tracker) {
              setdesable2fa(res?.data?.data || null);
              onOpen3();
              get2FAInfo();
              setLoader(false);
            } else {
              get2FAInfo();
              setLoader(false);
            }
          }
        })
        .catch((err) => {
          setUserOTP("");
          toast.error("Please try again!");
          setLoader(false);
        });
    } catch (e) {
      setLoader(false);
    }
  };

  const toggle2FAEL = async () => {
    await _toggle2FAEL()
      .then((res) => {
        if (res?.data) {
          setUserOTP("");
          toast.success(res?.data?.message);
          get2FAInfo();
        }
      })
      .catch((err) => {
        setUserOTP("");
        toast.error("Please try again!");
      });
  };

  const handleClear = () => {
    setMessage("");
    setUserOTP("");
  };

  //partial ayment part
  const [getPartialData, setGetPartialData] = useState({});
  const getPartialPaymentStatus = async () => {
    await _getPartialPaymentStatus()
      .then((res) => {
        if (res?.data) {
          onOpen();
          setGetPartialData(res?.data);
        }
      })
      .catch((err) => {
        toast.error("Please try again!");
      });
  };

  const requestPartialPayments = async () => {
    await _applyForPartialPayment()
      .then((res) => {
        if (res?.data?.isSuccess) {
          getPartialPaymentStatus();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error("Please try again!");
      });
  };

  useEffect(() => {
    if (sessionStorage.getItem("passwordChange")) {
      onOpen1();
    }
  }, []);

  const senddesableotp = async () => {
    try {
      await desabled2FA(desableotp, desable2fa?.tracker).then((res) => {
        if (res?.data?.isSuccess) {
          setdesableotp("");
          onClose2();
          onClose3();
        } else {
          toast.error(res?.data?.message);
        }
      });
    } catch (err) {
      toast.error("please try again");
    }
  };

  return (
    <div>
      <div className="content-wrapper search-panel-bg">
        <ToastContainer position="bottom-right" autoClose={1500} />
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2"></div>
          </div>
        </section>

        <section className="content">
          <div className="container-fluid" style={{ minHeight: "500px" }}>
            <div className="row">
              <div className="col-md-3">
                <div className="card card-primary ">
                  <div className="card-body ">
                    <div className="text-center">
                      {!logoName ? (
                        <>
                          <img
                            alt="img01"
                            className="mx-auto mb-3"
                            src={logo}
                            style={{ width: "120px", height: "40px" }}
                          ></img>
                        </>
                      ) : (
                        <>
                          <img
                            alt="companay_logo"
                            className="mx-auto mb-3"
                            src={environment.s3URL + "" + logoName}
                            style={{ width: "150px", height: "80px" }}
                          ></img>
                        </>
                      )}

                      <input
                        disabled={!currentUser?.isAgent}
                        type={"file"}
                        ref={fileInputRef}
                        className="form-control border-radius"
                        accept=".jpg, .jpeg, .png"
                        onChange={(e) => logoFileUpload(e.target.files[0])}
                      ></input>
                      {progress > 0 && (
                        <div className="progress-container mt-1">
                          <div
                            className="progress-bar"
                            style={{ width: `${progress}%` }}
                          >
                            {/* <span className="progress-text">{progress}%</span> */}
                          </div>
                        </div>
                      )}
                    </div>

                    <h5 className="profile-username text-center fw-bold">
                      {currentUser.fullName}
                    </h5>

                    <p className="text-muted text-center">
                      Member Of {sessionStorage.getItem("agentName")}
                    </p>

                    <button
                      disabled={!currentUser?.isAgent}
                      type="button"
                      className="btn button-color text-white fw-bold btn-block border-radius"
                      data-bs-toggle="modal"
                      data-bs-target="#profileModal"
                    >
                      Edit
                    </button>

                    <div
                      className="modal fade"
                      id="profileModal"
                      tabIndex={-1}
                      aria-labelledby="profileModalLabel"
                      aria-hidden="true"
                      data-bs-backdrop="static"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="profileModalLabel">
                              Edit Profile
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="row text-center">
                              <div className="col-sm-4"></div>
                            </div>
                            <div className="row">
                              <div className="col-sm-6">
                                <label>
                                  Company Name
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                  type={"text"}
                                  value={fullNameCom}
                                  className="form-control border-radius"
                                  placeholder="Name"
                                  onChange={(e) =>
                                    setFullNameCom(e.target.value)
                                  }
                                  required
                                ></input>
                              </div>
                              {/* <div className="col-sm-4">
                                <label>
                                  Company Email
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                  type={"email"}
                                  value={emailCom}
                                  className="form-control border-radius"
                                  placeholder="Email"
                                  onChange={(e) => setEmailCom(e.target.value)}
                                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                  required
                                ></input>
                              </div> */}
                              <div className="col-sm-6">
                                <label>
                                  Company Mobile
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                  type={"number"}
                                  value={mobileCom}
                                  className="form-control border-radius"
                                  placeholder="Mobile"
                                  onChange={(e) => setMobileCom(e.target.value)}
                                  required
                                  disabled
                                ></input>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary border-radius"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              className="btn button-color text-white fw-bold border-radius"
                              onClick={() => handleSubmit()}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="modal fade"
                      id="staticBackdrop"
                      data-bs-backdrop="static"
                      data-bs-keyboard="false"
                      tabIndex="-1"
                      aria-labelledby="staticBackdropLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Change Password</h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              onClick={() => changePassword()}
                            ></button>
                          </div>
                          <form onSubmit={handlePasswordSubmit}>
                            <div className="modal-body">
                              <div className="row">
                                <div className="col-sm-4">
                                  <label>
                                    Previous Password
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <PasswordInput
                                    value={previousPassword}
                                    setValue={setPreviousPassword}
                                    placeholder={"Previous Password"}
                                  />
                                </div>
                                <div className="col-sm-4">
                                  <label>
                                    New Password
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <PasswordInput
                                    value={password}
                                    setValue={setPassword}
                                    placeholder={"New Password"}
                                  />
                                </div>
                                <div className="col-sm-4">
                                  <label>
                                    Confirm Password
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <PasswordInput
                                    value={confirmPassword}
                                    setValue={setConfirmPassword}
                                    placeholder={"Confirm Password"}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                id="closeModal"
                                type="button"
                                className="btn btn-secondary border-radius"
                                data-bs-dismiss="modal"
                                onClick={() => changePassword()}
                              >
                                Close
                              </button>
                              <button
                                type="button"
                                className="btn button-color text-white fw-bold border-radius"
                                onClick={() => handlePasswordSubmit()}
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-9">
                <div className="card">
                  <div className="card-header p-2">
                    <ul className="nav nav-pills">
                      <li className="nav-item">
                        <span className="text-color fs-5 fw-bold">
                          Profile Status
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <div className="tab-content">
                      <div className="active tab-pane" id="activity">
                        <form className="">
                          <div className="table-responsive">
                            <table className="table table-borderless align-middle table-striped text-start fw-bold ">
                              <tbody>
                                <tr>
                                  <td>Username</td>
                                  <td>:</td>
                                  <td>{currentUser.fullName}</td>
                                </tr>
                                <tr>
                                  <td>Email</td>
                                  <td>:</td>
                                  <td>{currentUser.email}</td>
                                </tr>
                                <tr>
                                  <td>Company Mobile</td>
                                  <td>:</td>
                                  <td>{currentUser.mobile}</td>
                                </tr>
                                <tr>
                                  <td>Company Name</td>
                                  <td>:</td>
                                  <td>{agentInfo.name}</td>
                                </tr>
                                <tr>
                                  <td>Company Email</td>
                                  <td>:</td>
                                  <td>{agentInfo.email}</td>
                                </tr>
                                <tr>
                                  <td>Company Address</td>
                                  <td>:</td>
                                  <td>
                                    {sessionStorage.getItem("agentAddress")}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Member Since</td>
                                  <td>:</td>
                                  <td>
                                    {moment(agentInfo?.createdDate).format(
                                      "DD-MMMM-yyyy"
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </form>
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn button-color text-white fw-bold btn-block w-auto me-2 mt-0 border-radius"
                            id="changePassword"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop"
                            onClick={() => changePassword()}
                          >
                            Change Password
                          </button>
                          <button
                            type="button"
                            className="btn button-color text-white fw-bold btn-block w-auto mt-0 me-2 border-radius"
                            onClick={() => {
                              get2FAInfo();
                              onOpen2();
                            }}
                          >
                            Two Step Verification
                          </button>
                          {currentUser?.isAgent && (
                            <button
                              type="button"
                              className="btn button-color text-white fw-bold btn-block w-auto mt-0 border-radius"
                              onClick={() => getPartialPaymentStatus()}
                            >
                              Partial Payment
                            </button>
                          )}
                        </div>

                        <ModalForm
                          isOpen={isOpen}
                          onClose={onClose}
                          title={"Partial Payment"}
                          size={"4xl"}
                        >
                          {getPartialData?.data?.status === "Not Requested" ? (
                            <Box>
                              <Text
                                color={"red"}
                                display={"flex"}
                                justifyContent={"center"}
                                justifyItems={"center"}
                                textAlign={"center"}
                              >
                                N/B : Please send your Up-to-Date Trade License,
                                NID, Valid Visiting Card at
                                mailto:sales@Triplover.com for availing
                                Partial Payments. Please mention - 'Partial
                                Payment' in the Email Subject.
                              </Text>
                            </Box>
                          ) : (
                            <></>
                          )}

                          <div className="m-5">
                            <h4 className="text-center border p-1 rounded">
                              Partial Payments
                            </h4>
                            {getPartialData?.data?.status ===
                            "Not Requested" ? (
                              <div className="d-flex border p-3 align-items-center">
                                <p className="me-2">
                                  Partial Payments Status:{" "}
                                  <span className="text-success">
                                    Not Requested Yet
                                  </span>
                                </p>
                                <button
                                  type="button"
                                  className="btn button-color text-white fw-bold btn-block w-auto mt-0 border-radius"
                                  onClick={() => requestPartialPayments()}
                                >
                                  Request Partial Payments
                                </button>
                              </div>
                            ) : (
                              <div className="border p-3">
                                <p className="me-2">
                                  Partial Payment Status:{" "}
                                  <span className="text-success">
                                    {getPartialData?.data?.status}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </ModalForm>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Modal
          isOpen={isOpen1}
          onClose={onClose1}
          isCentered
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <p className="pt-3 text-danger">
                You need to change password. Please change your password.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose1}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isOpen2}
          onClose={onClose2}
          size={"4xl"}
          trapFocus={false}
          isCentered
          closeOnOverlayClick={false}
          autoFocus={false}
        >
          <ModalOverlay />
          <ModalContent>
            <Box borderBottom="2px solid #bbc5d3">
              <ModalHeader>Two Step Verification</ModalHeader>
              <ModalCloseButton />
            </Box>
            <ModalBody>
              <div className="m-4">
                <h4 className="text-center border p-1 rounded">Security</h4>
                {!get2FAData?.data?.requestedEmailVerification && (
                  <div className="d-flex border p-3 align-items-center">
                    <p className="me-2">
                      Email Verification Status:{" "}
                      <span className="text-success">Not Requested Yet</span>
                    </p>
                    <button
                      type="button"
                      className="btn button-color text-white fw-bold btn-block w-50 mt-0 border-radius"
                      onClick={() => requestEmailVerification()}
                    >
                      Request Email Verification
                    </button>
                  </div>
                )}

                {get2FAData?.data?.emailVerified ? (
                  <div className="border p-3">
                    <p className="me-2">
                      Email Verification Status:{" "}
                      <span className="text-success">Verified</span>
                    </p>
                    {get2FAData?.data?.is2FAActive ? (
                      <div className="d-flex align-items-center my-2">
                        <p className="me-2">
                          Two Factor Authentication Status:{" "}
                          <span className="text-success">Enable</span>
                        </p>
                        <button
                          type="button"
                          className="btn button-color text-white fw-bold btn-block w-25 mt-0 border-radius"
                          disabled={loader && true}
                          onClick={() => toggle2FA()}
                        >
                          Disable
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center">
                        <p className="me-2">
                          Two Factor Authentication Status:{" "}
                          <span className="text-success">Disable</span>
                        </p>
                        <button
                          type="button"
                          className="btn button-color text-white fw-bold btn-block w-25 mt-0 border-radius"
                          disabled={loader && true}
                          onClick={() => toggle2FA()}
                        >
                          Enable
                        </button>
                      </div>
                    )}

                    <p className="text-danger my-2">
                      [Note]: Two Factor Authentication Configuration Status:
                      'Auto' means, if identity verification by OTP is required
                      for a particular login will be decided by the 'System'. On
                      the contrary, 'Every Time' means, you will have to verify
                      your identity with OTP every time you login.
                    </p>

                    {get2FAData?.data?.everyLogin2FA ? (
                      <div className="d-flex align-items-center my-2">
                        <p className="me-2">
                          Two Factor Authentication Configuration Status:{" "}
                          <span className="text-success">Every Time</span>
                        </p>
                        <button
                          type="button"
                          className="btn button-color text-white fw-bold btn-block w-25 mt-0 border-radius"
                          onClick={() => toggle2FAEL()}
                        >
                          Make Auto
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center">
                        <p className="me-2">
                          Two Factor Authentication Configuration Status:{" "}
                          <span className="text-success">Auto</span>
                        </p>
                        <button
                          type="button"
                          className="btn button-color text-white fw-bold btn-block w-25 mt-0 border-radius"
                          onClick={() => toggle2FAEL()}
                        >
                          Every Time
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  get2FAData?.data?.requestedEmailVerification && (
                    <div className="border p-3">
                      <p className="me-2">
                        Email Verification Status:{" "}
                        <span className="text-success">
                          {!get2FAData?.data?.is2FAActive && "Requested"}
                        </span>
                      </p>
                      <p className="text-danger">
                        [Note]: Please be notified that, to verify your email
                        you need to get a OTP by clicking 'GET OTP' button
                        bellow. You will receive a 7 digit OTP on your account
                        email. Your Account email will be verified after
                        submitting the OTP. Don't share the OTP with others. If
                        You Already Have a verification OTP, type it on the OTP
                        box and submit.
                      </p>
                      {message && <p className="text-danger my-2">{message}</p>}

                      <div className="d-flex justify-content-start align-items-center gap-1 flex-wrap  my-3">
                        {!message && (
                          <button
                            type="button"
                            className="btn button-color text-white fw-bold btn-block mt-0 mr-2 border-radius"
                            onClick={() => reuestForEmailVerificationOtp()}
                            style={{ width: "100px" }}
                          >
                            Get OTP
                          </button>
                        )}

                        <p className="">
                          If you already have the otp, please submit.
                        </p>
                        <div>
                          <form onSubmit={handleSubmitOTP} className="d-flex">
                            <input
                              type={"number"}
                              className="form-control mr-1 border-radius"
                              placeholder="Please enter otp"
                              value={userUTP}
                              onChange={(e) => {
                                if (e.target.value.length < 8) {
                                  setUserOTP(e.target.value);
                                } else {
                                  e.preventDefault();
                                }
                              }}
                              required
                            ></input>
                            <button
                              type="submit"
                              className="btn button-color text-white fw-bold btn-block w-50 mt-0 border-radius"
                            >
                              Submit
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isCentered
          isOpen={isOpen3}
          onClose={onClose3}
          trapFocus={false}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <Box borderBottom="2px solid #bbc5d3">
              <ModalHeader>OTP</ModalHeader>
              {/* <ModalCloseButton /> */}
            </Box>
            <ModalBody>
              <Box pb="20px">
                <Text
                  htmlFor="otpInput"
                  display={"flex"}
                  justifyContent={"center"}
                  textAlign={"center"}
                  fontSize={"15px"}
                  color={"red"}
                  p={3}
                >
                  Please check your email provide the 7 digits OTP
                </Text>
                <Input
                  id="otpInput"
                  type="number"
                  value={desableotp}
                  pattern="^(\d{0}|\d{7})$"
                  onChange={(e) => {
                    if (e.target.value.length < 8) {
                      setdesableotp(e.target.value);
                    } else {
                      e.preventDefault();
                    }
                  }}
                  onKeyDown={preventNegativeValues}
                  placeholder="Enter OTP"
                />

                <Box display="flex" justifyContent="flex-end" mt="10px" gap="2">
                  <button
                    className="btn btn-secondary border-radius"
                    onClick={() => {
                      setdesableotp("");
                      onClose3();
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="btn button-color border-radius text-white"
                    disabled={desableotp.length < 7 && true}
                    onClick={() => senddesableotp()}
                  >
                    Send
                  </button>
                </Box>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePagePanel;
