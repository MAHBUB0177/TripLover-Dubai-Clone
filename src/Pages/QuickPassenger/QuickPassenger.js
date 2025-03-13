import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { add } from "date-fns";
import $ from "jquery";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiEdit, BiTrash } from "react-icons/bi";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAge,
  getCountryNameFomCountryCode,
  ISODateFormatter,
  isValidEmail,
} from "../../common/functions";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import courtries from "../../JSON/countries.json";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";

import { environment } from "../SharePages/Utility/environment";
import {
  SaveAgentPassengers,
  deletePassenger,
  getAgentPassengerSearch,
  getAgentPassengers,
  uploadPassport,
  uploadVisaCopy,
} from "../../common/allApi";
import { GiCancel } from "react-icons/gi";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import NoDataFound from "../../component/noDataFound";
import TableLoader from "../../component/tableLoader";

const QuickPassenger = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  let [currentItem, setCurrentItem] = useState({});
  let [passengerList, setPassengerList] = useState([]);
  let [passengerType, setPassengerType] = useState("ADT");
  let [passportExDate, setpassportExDate] = useState();
  let [title, setTitle] = useState("");
  let [firstName, setFirstName] = useState("");
  let [middleName, setMiddleName] = useState("");
  let [lastName, setLastName] = useState("");
  let [dob, setDOB] = useState(new Date());
  let [dobMinMax, setDobMinMax] = useState({ min: "", max: "" });
  let [nationality, setNationality] = useState("BD");
  let [gender, setGender] = useState("Male");
  let [passportNo, setPassportNo] = useState("");
  let [issuingCountry, setIssuingCountry] = useState("BD");
  let [phone, setPhone] = useState("");
  let [email, setEmail] = useState("");
  let [phoneCountryCode, setPhoneCountryCode] = useState("+88");
  let [cityList, setCityList] = useState([]);
  let [cityName, setCityName] = useState("");
  let [passportFileName, setPassportFileName] = useState("");
  let [visaFileName, setVisaFileName] = useState("");
  let [loading, setLoading] = useState(false);
  const [progressForPass, setProgressForPass] = useState(0);
  const [progressForVisa, setProgressForVisa] = useState(0);
  const passCopy = useRef();
  const visaCopy = useRef();
  const formReset = useRef();
  const [fileError, setFileError] = useState(false);
  const handleClickOutside = () => {
    formReset.current?.reset();
  };
  const outSideClick = useOutsideClick(handleClickOutside);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const [editItem, setEdititem] = useState();
  const handleRestrict = () => {
    if (passportNo === "" || passportNo === null || passportNo === undefined) {
      setFileError(true);
      toast.error("Please select passport number then try again.");
      passCopy.current.disabled = true;
      visaCopy.current.disabled = true;
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (passportNo.length > 0) {
      setFileError(false);
      passCopy.current.disabled = false;
      visaCopy.current.disabled = false;
    }
  }, [passportNo]);
  const handlePassportFileUpload = (file) => {
    setProgressForPass(0);
    let fileExt = file.name.split(".").pop().toLowerCase();
    if (
      fileExt === "jpg" ||
      fileExt === "jpeg" ||
      fileExt === "png" ||
      fileExt === "pdf"
    ) {
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
          setProgressForPass(percentCompleted); // Update progress state
        },
      };
      const postData = async () => {
        const response = await uploadPassport(passportNo, formData, config);
        setPassportFileName(response.data.fileName);
      };
      postData();
    } else {
      toast.error("Sorry! file format not valid..");
    }
  };
  const handleVisaFileUpload = (file) => {
    setProgressForVisa(0);
    let fileExt = file.name.split(".").pop().toLowerCase();
    if (
      fileExt === "jpg" ||
      fileExt === "jpeg" ||
      fileExt === "png" ||
      fileExt === "pdf"
    ) {
      setVisaFileName(file.name);
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
          setProgressForVisa(percentCompleted); // Update progress state
        },
      };
      const postData = async () => {
        const response = await uploadVisaCopy(passportNo, formData, config);
        setVisaFileName(response.data.fileName);
      };
      postData();
    } else {
      toast.error("Sorry! file format not valid..");
    }
  };

  const [searchObj, setSearchObj] = useState({
    AgentId: sessionStorage.getItem("agentId") ?? 0,
    SearchText: "",
    documentNumber: "",
  });

  const [loader, setLoader] = useState(false);
  const handleGetPassengers = (currentPage) => {
    setSearchObj((prevSearchObj) => {
      let obj = {
        AgentId: sessionStorage.getItem("agentId") ?? 0,
        SearchText: prevSearchObj.SearchText,
        documentNumber: prevSearchObj.documentNumber,
      };
      const getData = async () => {
        setLoader(true);
        const response = await getAgentPassengers(currentPage, pageSize, obj);
        setPassengerList(response.data.data);
        setPageCount(await response.data.totalPages);
        setCurrentPageNumber(await response.data.currentPageNumber);
        setLoader(false);
      };
      getData();
      return obj;
    });
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
  };
  const clearForm = () => {
    setCurrentItem(null);
    setTitle("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setDOB("");
    setNationality("BD");
    setGender("Male");
    setPassportNo("");
    setIssuingCountry("");
    setpassportExDate("");
    setPhone("");
    setEmail("");
    setPhoneCountryCode("+88");
    setCityName("");
    setPassengerType("ADT");
    setPassportFileName("");
    setVisaFileName("");
  };
  const handleCreateItem = () => {
    clearForm();
  };
  const handleEditItem = (item) => {
    setCurrentItem(item);
    setTitle(item.title);
    setFirstName(item.first);
    setMiddleName(item.middle);
    setLastName(item.last);
    setDOB(
      item.dateOfBirth === null ? null : ISODateFormatter(item.dateOfBirth)
    );
    setNationality(item.nationality);
    setGender(item.gender);
    setPassportNo(item.documentNumber);
    setpassportExDate(
      item.expireDate === null ? null : ISODateFormatter(item.expireDate)
    );
    setIssuingCountry(item.documentIssuingCountry);
    setPhone(item.phone);
    setEmail(item.email);
    setPhoneCountryCode(item.phoneCountryCode);
    setCityName(item.cityName);
    setPassengerType(item.passengerType);
  };

  let sendObj = {
    id: currentItem === null ? 0 : currentItem.id,
    agentId: sessionStorage.getItem("agentId") ?? 0,
    passengerType: passengerType,
    title: title,
    first: firstName.trim().replace(/\s+/g, " "),
    middle: middleName,
    last: lastName.trim().replace(/\s+/g, " "),
    dateOfBirth: moment(dob).format("yyyy-MM-DD"),
    nationality: nationality,
    gender: gender,
    documentNumber: passportNo,
    documentIssuingCountry: issuingCountry,
    expireDate: passportExDate
      ? moment(passportExDate).format("yyyy-MM-DD")
      : "",
    phone: phone,
    email: email,
    phoneCountryCode: phoneCountryCode,
    cityName: cityName,
    passportCopy: passportFileName,
    visaCopy: visaFileName,
  };

  const handleSubmit = () => {
    if (title === "") {
      toast.error("Sorry! Title is empty..");
      return;
    }
    if (firstName === "") {
      toast.error("Sorry! First Name is empty..");
      return;
    }
    if (lastName === "") {
      toast.error("Sorry! Last Name is empty..");
      return;
    }
    if (email === "") {
      toast.error("Sorry! Email is empty..");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("You have entered an invalid email address!");
      return;
    }
    if (dob === "") {
      toast.error("Sorry! DOB is not selected..");
      return;
    }

    if (passengerType === "ADT" && getAge(dob) < 12) {
      toast.error("Adult DOB is not valid..");
      return;
    }
    if (passengerType === "CNN" && (getAge(dob) > 12 || getAge(dob) < 2)) {
      toast.error("Child DOB is not valid..");
      return;
    }
    if (passengerType === "INF" && getAge(dob) > 2) {
      toast.error("Infant DOB is not valid..");
      return;
    }

    if (sendObj.id > 0) {
      const putData = async () => {
        setLoading(true);
        const response = await SaveAgentPassengers(sendObj).catch(
          (error) => {}
        );
        if (response !== undefined && response.data.data > 0) {
          handleGetPassengers(currentPageNumber);
          clearForm();
          toast.success("Passenger updated successfully..");
          $("#modal-close").click();
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
          setLoading(false);
        } else {
          toast.error(response.data.message);
          setLoading(false);
        }
      };
      putData();
    } else {
      const postData = async () => {
        setLoading(true);
        const response = await SaveAgentPassengers(sendObj).catch(
          (error) => {}
        );
        if (response !== undefined && response.data.data > 0) {
          handleGetPassengers(1);
          clearForm();
          toast.success("Passenger added successfully..");
          $("#modal-close").click();
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
          setLoading(false);
        } else {
          toast.error(response.data.message);
          setLoading(false);
        }
      };
      postData();
    }
  };
  const handleClear = () => {
    setProgressForPass(0);
    setProgressForVisa(0);
  };
  const passengerTypeFuc = (passengerType) => {
    switch (passengerType) {
      case "ADT":
        setDobMinMax({
          min: "01/01/1900",
          max: ISODateFormatter(
            add(new Date(), {
              years: -12,
            })
          ),
        });
        break;
      case "CHD":
        setDobMinMax({
          min: ISODateFormatter(
            add(new Date(), {
              years: -12,
            })
          ),
          max: ISODateFormatter(
            add(new Date(), {
              years: -5,
            })
          ),
        });
        break;
      case "CNN":
        setDobMinMax({
          min: ISODateFormatter(
            add(new Date(), {
              years: -5,
            })
          ),
          max: ISODateFormatter(
            add(new Date(), {
              years: -2,
            })
          ),
        });
        break;
      case "INF":
        setDobMinMax({
          min: ISODateFormatter(
            add(new Date(), {
              years: -2,
            })
          ),
          max: ISODateFormatter(new Date()),
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleGetPassengers(currentPageNumber);
  }, [currentPageNumber]);

  useEffect(() => {
    passengerTypeFuc(passengerType);
  }, [passengerType]);

  const getCityData = async (countryName) => {
    const response = await axios.get(
      environment.getcityListbycountryName + "/" + countryName
    );
    if (response.data.length > 0) {
      setCityList(response.data);
    }
  };
  useEffect(() => {
    getCityData("Bangladesh");
  }, []);

  const handleCountryChange = (e) => {
    const country = getCountryNameFomCountryCode(e.target.value);
    setNationality(e.target.value);
    getCityData(country);
  };

  const handleSearhPassenger = async (currentPageNumber) => {
    handleGetPassengers(currentPageNumber);
  };

  const handelClearPassenger = async (currenpage) => {
    setSearchObj((prevSearchObj) => {
      const updatedSearchObj = {
        SearchText: "",
        AgentId: sessionStorage.getItem("agentId") ?? 0,
        documentNumber: "",
      };
      return updatedSearchObj;
    });
    handleGetPassengers(currenpage);
  };

  const handledeleteItem = async () => {
    setLoading(true);
    const response = await deletePassenger(editItem.id);
    if (response !== undefined) {
      handleGetPassengers(currentPageNumber);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg px-4 pb-5">
        <section className="content-header"></section>
        <section className="content">
          <ToastContainer position="bottom-right" autoClose={1500} />
          <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader
                  fontSize="lg"
                  fontWeight="bold"
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <GiCancel
                    color="red"
                    style={{ height: "50px", width: "50px" }}
                  />
                </AlertDialogHeader>

                <AlertDialogBody
                  fontWeight="bold"
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <VStack>
                    <Text>
                      Are you sure? You Want To Edit this Passenger !!
                    </Text>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "red",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      N.B: This Passenger Will be deleted.<br></br> And new
                      Passenger will be created.
                    </p>
                  </VStack>
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    onClick={onClose}
                    style={{ backgroundColor: "#ed7f22", color: "white" }}
                    className="border-radius"
                  >
                    Cancel
                  </Button>

                  <a
                    onClick={() => {
                      handleEditItem(editItem);
                      onClose();
                    }}
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#accountModal"
                  >
                    <Button
                      ml={3}
                      style={{ backgroundColor: "#7c04c0", color: "white" }}
                      className="border-radius"
                    >
                      Submit
                    </Button>
                  </a>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
          <AlertDialog isOpen={isOpen1} onClose={onClose1} isCentered>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader
                  fontSize="lg"
                  fontWeight="bold"
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <GiCancel
                    color="red"
                    style={{ height: "50px", width: "50px" }}
                  />
                </AlertDialogHeader>

                <AlertDialogBody
                  fontWeight="bold"
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <VStack>
                    <Text>Are you sure to delete this Passenger?</Text>
                  </VStack>
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    onClick={onClose1}
                    style={{ backgroundColor: "#6c757d", color: "white" }}
                    className="border-radius"
                  >
                    Cancel
                  </Button>

                  <a
                    onClick={() => {
                      handledeleteItem();
                      onClose();
                    }}
                  >
                    <Button
                      ml={3}
                      style={{ backgroundColor: "#7c04c0", color: "white" }}
                      className="border-radius"
                    >
                      Confirm
                    </Button>
                  </a>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          <div
            className="mx-lg-5 mx-md-5 mx-sm-1 mt-3"
            style={{ minHeight: "500px" }}
          >
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
                      Passengers
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 py-3 ">
                <div className="row pb-3">
                  <div className="col-lg-3">
                    <input
                      type={"text"}
                      value={searchObj?.SearchText}
                      onChange={(e) =>
                        setSearchObj({
                          ...searchObj,
                          SearchText: e.target.value,
                        })
                      }
                      className="form-control border-radius"
                      placeholder="Full Name"
                    ></input>
                  </div>
                  <div className="col-lg-3">
                    <input
                      type={"text"}
                      value={searchObj?.documentNumber}
                      onChange={(e) =>
                        setSearchObj({
                          ...searchObj,
                          documentNumber: e.target.value,
                        })
                      }
                      className="form-control border-radius"
                      placeholder="Passport Number"
                    ></input>
                  </div>
                  <div className="col-lg-3">
                    <button
                      type="button"
                      className="btn button-color text-white fw-bold border-radius me-2 filter-btn"
                      onClick={() => {
                        handleSearhPassenger(1);
                      }}
                    >
                      Apply Filter
                    </button>

                    <button
                      type="button"
                      className="btn button-secondary-color text-white fw-bold border-radius filter-btn"
                      onClick={() => {
                        handelClearPassenger(1);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="col-lg-3">
                    <div
                      className="btn button-color float-right text-white fw-bold border-radius filter-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#accountModal"
                      onClick={() => handleCreateItem()}
                    >
                      <span className="me-1">
                        <i className="fas fa-user-plus"></i>
                      </span>{" "}
                      Add Passenger
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
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>DOB</th>
                        <th>GENDER</th>
                        <th>PASSPORT NUMBER</th>
                        <th>PASSPORT EXPIRY DATE</th>
                        <th>PASSPORT COPY</th>
                        <th>VISA COPY</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    {!loader && (
                      <tbody className="tbody">
                        {passengerList.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="text-start fw-bold text-secondary"
                            >
                              <td>
                                {item.title +
                                  " " +
                                  item.first +
                                  " " +
                                  item.middle +
                                  " " +
                                  item.last}{" "}
                                ({item.passengerType})
                              </td>
                              <td>{item.email}</td>
                              <td>
                                {item.dateOfBirth === null
                                  ? "N/A"
                                  : moment(item.dateOfBirth).format(
                                      "DD-MMMM-yyyy"
                                    )}
                              </td>
                              <td>{item.gender}</td>
                              <td>
                                {item.documentNumber === ""
                                  ? "N/A"
                                  : item.documentNumber}
                              </td>
                              <td>
                                {item.expireDate === null
                                  ? "N/A"
                                  : moment(item.expireDate).format(
                                      "DD-MMMM-yyyy"
                                    )}
                              </td>

                              <td>
                                {item.passportCopy !== null &&
                                item.passportCopy !== "" ? (
                                  <a
                                    href={
                                      environment.s3URL + `${item.passportCopy}`
                                    }
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Passport Copy
                                  </a>
                                ) : (
                                  <>N/A</>
                                )}
                              </td>
                              <td>
                                {item.visaCopy != null &&
                                item.visaCopy != "" ? (
                                  <a
                                    href={
                                      environment.s3URL + `${item.visaCopy}`
                                    }
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Visa Copy
                                  </a>
                                ) : (
                                  <>N/A</>
                                )}
                              </td>

                              <td>
                                <div className="d-flex gap-2 justify-content-start">
                                  <a
                                    onClick={() => {
                                      onOpen();
                                      setEdititem(item);
                                    }}
                                  >
                                    <HStack justifyContent="center">
                                      <div className="shadow p-1 rounded-3 button-color text-white">
                                        <Icon
                                          as={BiEdit}
                                          h="18px"
                                          w="18px"
                                          color={"logoGreen"}
                                        />
                                      </div>
                                    </HStack>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    )}
                  </table>
                  {loader && <TableLoader />}
                  {passengerList?.length === 0 && !loader && <NoDataFound />}
                </div>

                <div className="d-flex justify-content-end">
                  {passengerList?.length > 0 && !loader && (
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

            <div
              ref={outSideClick}
              className="modal fade"
              id="accountModal"
              tabIndex={-1}
              aria-labelledby="accountModalLabel"
              aria-hidden="true"
              data-bs-backdrop="static"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <form id="from_reset">
                    <div className="modal-header">
                      <h5 className="modal-title" id="accountModalLabel">
                        {currentItem === null ? "Add" : "Edit"} Passenger
                      </h5>
                      <button
                        onClick={() => {
                          document.getElementById("from_reset").reset();
                          handleClear();
                        }}
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        id="modal-close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="border p-2 my-3">
                        <div className="row">
                          <div className="col-lg-12 col-sm-12">
                            <div className="form-group">
                              <select
                                id="name"
                                placeholder="Passenger Type"
                                className="form-select border-radius"
                                onChange={(e) => {
                                  setPassengerType(e.target.value);
                                  setGender("Male");
                                  setTitle("");
                                }}
                                required
                                value={passengerType}
                              >
                                <option value="ADT"> Adult</option>
                                <option value="CHD"> Child &ge; 5</option>
                                <option value="CNN"> Child &lt; 5</option>
                                <option value="INF"> Infant</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label className="form-label float-start fw-bold">
                                First name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-group mb-3">
                                <div className="input-group">
                                  <select
                                    id="name"
                                    placeholder="Title"
                                    className="form-select titel-width"
                                    onChange={(e) => {
                                      if (
                                        e.target.value === "Mr" ||
                                        e.target.value === "Mstr" ||
                                        e.target.value === ""
                                      ) {
                                        setTitle(e.target.value);
                                        setGender("Male");
                                      } else {
                                        setTitle(e.target.value);
                                        setGender("Female");
                                      }
                                    }}
                                    value={title}
                                    required
                                    style={{
                                      borderStartStartRadius: "8px",
                                      borderEndStartRadius: "8px",
                                    }}
                                  >
                                    <option value=""> Title</option>
                                    {passengerType === "ADT" ? (
                                      <>
                                        <option value="Mr"> Mr</option>
                                        <option value="Ms"> Ms</option>
                                        <option value="Mrs"> Mrs</option>
                                      </>
                                    ) : (
                                      <>
                                        <option value="Mstr">Mstr</option>
                                        <option value="Miss">Miss</option>
                                      </>
                                    )}
                                  </select>
                                  <input
                                    name="firstName"
                                    className="form-control"
                                    onChange={(e) => {
                                      const firstName = e.target.value;
                                      const re = /^[a-zA-Z ]*$/;
                                      if (re.test(firstName)) {
                                        setFirstName(firstName);
                                      } else {
                                      }
                                    }}
                                    value={firstName}
                                    required
                                    autoComplete="off"
                                    placeholder="First Name"
                                    style={{
                                      borderEndEndRadius: "8px",
                                      borderStartEndRadius: "8px",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                type=""
                              >
                                Last name <span className="text-danger">*</span>
                              </label>
                              <input
                                name="lastName"
                                className="form-control border-radius"
                                onChange={(e) => {
                                  const lastName = e.target.value;
                                  const re = /^[a-zA-Z ]*$/;
                                  if (re.test(lastName)) {
                                    setLastName(lastName);
                                  } else {
                                  }
                                }}
                                value={lastName}
                                required
                                autoComplete="off"
                                placeholder="Last Name"
                              />
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                type=""
                              >
                                Gender <span className="text-danger">*</span>
                              </label>
                              <div className="input-group mb-3">
                                <select
                                  name="date"
                                  className="form-select border-radius"
                                  onChange={(e) => setGender(e.target.value)}
                                  value={gender}
                                  required
                                  disabled
                                >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label className="float-start fw-bold" type="">
                                Date of birth
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-group mb-3 d-flex">
                                <Box
                                  border="1px solid #ced4da"
                                  w="100%"
                                  h="40px"
                                  pt="6px"
                                  pl="8px"
                                  className="border-radius"
                                >
                                  <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={
                                      dob?.length === 10 ? new Date(dob) : dob
                                    }
                                    onChange={(date) =>
                                      date !== "" && setDOB(date)
                                    }
                                    placeholderText="dd/mm/yyyy"
                                    minDate={new Date(dobMinMax?.min)}
                                    maxDate={new Date(dobMinMax?.max)}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                  />
                                </Box>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label className="float-start fw-bold" type="">
                                Nationality{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-group mb-3">
                                <select
                                  name="nationality"
                                  className="form-select border-radius"
                                  onChange={(e) => handleCountryChange(e)}
                                  value={nationality}
                                  required
                                >
                                  <option value="BD" selected>
                                    Bangladesh
                                  </option>
                                  {courtries.map((item, index) => {
                                    return (
                                      <option key={index} value={item.code}>
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                City
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <select
                                className="form-select border-radius"
                                aria-label="City"
                                onChange={(e) => setCityName(e.target.value)}
                              >
                                <option selected>Select City</option>
                                {cityList.map((item, index) => {
                                  return (
                                    <option key={index} value={item.name}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label className="float-start fw-bold" htmlFor="">
                                Email
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className=" mb-3">
                              <input
                                type="email"
                                className="form-control border-radius"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                autoComplete="off"
                                placeholder="Email"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                              />
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Passport number{" "}
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <input
                                type="text"
                                className="form-control border-radius"
                                name="passport-number"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const passNumber = e.target.value;
                                    const re = /^[0-9a-zA-Z]+$/;
                                    if (re.test(passNumber)) {
                                      setPassportNo(passNumber);
                                    }
                                  } else {
                                    setPassportNo("");
                                  }
                                }}
                                value={passportNo}
                                autoComplete="off"
                                placeholder="Passport Number"
                                pattern="^[a-zA-Z0-9]+$"
                              />
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Issuing country{" "}
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <select
                                className="form-select border-radius"
                                onChange={(e) =>
                                  setIssuingCountry(e.target.value)
                                }
                                value={issuingCountry}
                              >
                                <option value="">Issuing Country</option>
                                {courtries.map((item, index) => {
                                  return (
                                    <option key={index} value={item.code}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Passport Expiry Date{" "}
                              </label>
                            </div>
                            <div className="input-group mb-3 d-flex">
                              <Box
                                border="1px solid #ced4da"
                                w="100%"
                                h="40px"
                                pt="6px"
                                pl="8px"
                                className="border-radius"
                              >
                                <DatePicker
                                  dateFormat="dd/MM/yyyy"
                                  selected={
                                    passportExDate !== null &&
                                    passportExDate?.length === 10
                                      ? new Date(passportExDate)
                                      : passportExDate
                                  }
                                  onChange={(date) =>
                                    date !== "" && setpassportExDate(date)
                                  }
                                  placeholderText="dd/mm/yyyy"
                                  minDate={new Date()}
                                  maxDate={new Date("2199-12-30")}
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                />
                              </Box>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Passport Copy
                              </label>
                            </div>
                            <div className="mb-3">
                              <input
                                ref={passCopy}
                                onClick={() => handleRestrict()}
                                type={"file"}
                                accept=".jpg, .jpeg, .png, .pdf"
                                className="form-control border-radius"
                                onChange={(e) =>
                                  handlePassportFileUpload(e.target.files[0])
                                }
                              />
                              {fileError && (
                                <p style={{ color: "red", fontSize: "12px" }}>
                                  Please select passport number then try again.
                                </p>
                              )}
                              {progressForPass > 0 && (
                                <div className="progress-container mt-1">
                                  <div
                                    className="progress-bar"
                                    style={{ width: `${progressForPass}%` }}
                                  >
                                    {/* <span className="progress-text">{progress}%</span> */}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Visa Copy
                              </label>
                            </div>
                            <div className="mb-3 ">
                              <input
                                ref={visaCopy}
                                type={"file"}
                                accept=".jpg, .jpeg, .png, .pdf"
                                className="form-control border-radius"
                                onClick={() => handleRestrict()}
                                onChange={(e) =>
                                  handleVisaFileUpload(e.target.files[0])
                                }
                              />
                              {fileError && (
                                <p style={{ color: "red", fontSize: "12px" }}>
                                  Please select passport number then try again.
                                </p>
                              )}
                              {progressForVisa > 0 && (
                                <div className="progress-container mt-1">
                                  <div
                                    className="progress-bar"
                                    style={{ width: `${progressForVisa}%` }}
                                  >
                                    {/* <span className="progress-text">{progress}%</span> */}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="reset"
                        className="btn button-secondary-color border-radius fw-bold text-white"
                        data-bs-dismiss="modal"
                        onClick={() => handleClear()}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn button-color text-white border-radius fw-bold"
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
                          <span>
                            {" "}
                            {currentItem === null ? "Submit" : "Update"}
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default QuickPassenger;
