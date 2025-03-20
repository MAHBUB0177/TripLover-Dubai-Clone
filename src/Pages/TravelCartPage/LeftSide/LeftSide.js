import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  add,
  differenceInYears,
  format,
  intervalToDuration,
  parse,
} from "date-fns";
import produce from "immer";
import $ from "jquery";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  domestic,
  isValidEmail,
  preventNegativeValues,
  removeExtraSpaces,
  validateNameForPax,
} from "../../../common/functions";
import ModalForm from "../../../common/modalForm";
import useAuth from "../../../hooks/useAuth";
import courtries from "../../../JSON/countries.json";
import {
  airlinesCode,
  environment,
} from "../../SharePages/Utility/environment";
import BookConfirmModal from "./BookConfirmModal";
import "./LeftSide.css";
import Loading from "../../Loading/Loading";
import {
  getAgentPassengers,
  getTicketUnlockOtp,
  getUserAllInfo,
  requestBook,
  requestExtraServiceRePrice,
  requestPrice,
  uploadPassport,
  uploadVisaCopy,
  verifyIfUnlockedForTicket,
  verifyTicketUnlockOtp,
} from "../../../common/allApi";
import * as XLSX from "xlsx";
import LeftSideModal from "../../Optional/BookingPolicy/leftSideModal";
import LeftSideModalTC from "../../Optional/TermCondition/leftSideModalTC";
import passportimg from "../../../images/firstName_sample.jpg";
import passportimglast from "../../../images/lastName_sample.jpg";

const LeftSide = ({
  partialPaymentData,
  adultValue,
  childValue,
  infantValue,
  loader,
  extraServices,
  extraServicesLoader,
  hasExtraService,
  setAdultValue,
  setChildValue,
  setInfanttValue,
}) => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const userRole =
    localStorage.getItem("userRole") &&
    atob(atob(atob(localStorage.getItem("userRole"))));
  const [validityError, setValidityError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const { setBookData, setLoading, loading } = useAuth();
  const data = sessionStorage.getItem("Database");
  const searchData = JSON.parse(data);
  const direction0 = JSON.parse(sessionStorage.getItem("direction0"));
  const direction1 = JSON.parse(sessionStorage.getItem("direction1"));
  const direction2 = JSON.parse(sessionStorage.getItem("direction2"));
  const direction3 = JSON.parse(sessionStorage.getItem("direction3"));
  const direction4 = JSON.parse(sessionStorage.getItem("direction4"));
  const direction5 = JSON.parse(sessionStorage.getItem("direction5"));
  const totalPrice = JSON.parse(sessionStorage.getItem("totalPrice"));
  const bookable = JSON.parse(sessionStorage.getItem("bookable"));
  const uniqueTransID = JSON.parse(sessionStorage.getItem("uniqueTransID"));
  const itemCodeRef = JSON.parse(sessionStorage.getItem("itemCodeRef"));
  const extraBaggageAllowedPTC = JSON.parse(
    sessionStorage.getItem("extraBaggageAllowedPTC")
  );
  const fullObj = JSON.parse(sessionStorage.getItem("fullObj"));
  const brandedFareSelectedIdx = JSON.parse(
    sessionStorage.getItem("brandedFareSelectedIdx")
  );
  const brandedFareList = JSON.parse(sessionStorage.getItem("brandedFareList"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen4,
    onOpen: onOpen4,
    onClose: onClose4,
  } = useDisclosure();
  const {
    isOpen: isOpen5,
    onOpen: onOpen5,
    onClose: onClose5,
  } = useDisclosure();

  const origin = searchData.origin;
  const destination = searchData.destination;

  const qtyList = searchData.qtyList;
  const adultNumber = searchData.qtyList.Adult;
  const childrenNumber = searchData.qtyList.Children;
  const infantNumber = searchData.qtyList.Infant;
  const [firstname, setFirstname] = useState("");
  const [message, setMessage] = useState("");
  let [passengerADTList, setPassengerADTList] = useState([]);
  let [passengerCHDList, setPassengerCHDList] = useState([]);
  let [passengerCNNList, setPassengerCNNList] = useState([]);
  let [passengerINFList, setPassengerINFList] = useState([]);
  const [click, setClick] = useState(false);
  const Database = JSON.parse(sessionStorage.getItem("Database"));
  const [childAgeList, setChildAgeList] = useState(Database.childAgeList);
  function calculateMonth(from, to) {
    const dateFrom = parse(from, "dd/MM/yyyy", new Date());
    const dateTo = parse(to, "dd/MM/yyyy", new Date());

    const age = differenceInYears(dateFrom, dateTo);

    return age;
  }
  function calculateFullAge(dobFrom, dobTo) {
    const dob1 = format(new Date(dobFrom), "dd/MM/yyyy");
    const dob2 = format(new Date(dobTo), "dd/MM/yyyy");
    const birthDateStart = parse(dob1, "dd/MM/yyyy", new Date());
    const birthDateEnd = parse(dob2, "dd/MM/yyyy", new Date());

    const { years, months, days } = intervalToDuration({
      start: birthDateStart,
      end: birthDateEnd,
    });
    if (years < 1 && months < 6 && days <= 31) {
      return true;
    } else return false;
  }

  const handlePassportFileUpload = (flag, index, file, passportNo) => {
    if (flag === 1) {
      setAdult((ob) =>
        produce(ob, (v) => {
          v[index].progress = 0;
        })
      );
    } else if (flag === 2) {
      setChild((ob) =>
        produce(ob, (v) => {
          v[index].progress = 0;
        })
      );
    } else if (flag === 3) {
      setInfant((ob) =>
        produce(ob, (v) => {
          v[index].progress = 0;
        })
      );
    }
    let fileExt = file.name.split(".").pop().toLowerCase();
    if (
      !(
        fileExt === "jpg" ||
        fileExt === "jpeg" ||
        fileExt === "png" ||
        fileExt === "pdf"
      )
    ) {
      toast.error("sorry! invalid file type..");
      if (flag === 1) {
        setAdult((ob) =>
          produce(ob, (v) => {
            v[index].passportCopy = "";
          })
        );
      } else if (flag === 2) {
        setChild((ob) =>
          produce(ob, (v) => {
            v[index].passportCopy = "";
          })
        );
      } else if (flag === 3) {
        setInfant((ob) =>
          produce(ob, (v) => {
            v[index].passportCopy = "";
          })
        );
      }
    } else {
      var formData = new FormData();
      formData.append(`file`, file);
      // if (file) {
      //   const reader = new FileReader();
      //   reader.onloadend = () => {
      //     if (flag === 1) {
      //       setAdult((ob) =>
      //         produce(ob, (v) => {
      //           v[index].showPassportCopy = reader.result;
      //         })
      //       );
      //     } else if (flag === 2) {
      //       setChild((ob) =>
      //         produce(ob, (v) => {
      //           v[index].showPassportCopy = reader.result;
      //         })
      //       );
      //     } else if (flag === 3) {
      //       setInfant((ob) =>
      //         produce(ob, (v) => {
      //           v[index].showPassportCopy = reader.result;
      //         })
      //       );
      //     }
      //   };
      //   reader.readAsDataURL(file);
      // }
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          // Authorization: "Bearer " + tokenData?.token,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          if (flag === 1) {
            setAdult((ob) =>
              produce(ob, (v) => {
                v[index].progress = percentCompleted;
              })
            );
          } else if (flag === 2) {
            setChild((ob) =>
              produce(ob, (v) => {
                v[index].progress = percentCompleted;
              })
            );
          } else if (flag === 3) {
            setInfant((ob) =>
              produce(ob, (v) => {
                v[index].progress = percentCompleted;
              })
            );
          }
        },
      };
      const postData = async () => {
        const response = await uploadPassport(passportNo, formData, config);
        if (response.data.isUploaded === true) {
          if (flag === 1) {
            setAdult((ob) =>
              produce(ob, (v) => {
                v[index].passportCopy = response.data.fileName;
              })
            );
          } else if (flag === 2) {
            setChild((ob) =>
              produce(ob, (v) => {
                v[index].passportCopy = response.data.fileName;
              })
            );
          } else if (flag === 3) {
            setInfant((ob) =>
              produce(ob, (v) => {
                v[index].passportCopy = response.data.fileName;
              })
            );
          }
        } else {
          toast.error("Please try again..");
        }
      };
      postData();
    }
  };


    const handleVisaFileUpload = (flag, index, file, passportNo) => {
    if (flag === 1) {
      setAdult((ob) =>
        produce(ob, (v) => {
          v[index].progress = 0;
        })
      );
    } else if (flag === 2) {
      setChild((ob) =>
        produce(ob, (v) => {
          v[index].progress = 0;
        })
      );
    } else if (flag === 3) {
      setInfant((ob) =>
        produce(ob, (v) => {
          v[index].progress = 0;
        })
      );
    }
    let fileExt = file.name.split(".").pop().toLowerCase();
    if (
      !(
        fileExt === "jpg" ||
        fileExt === "jpeg" ||
        fileExt === "png" ||
        fileExt === "pdf"
      )
    ) {
      toast.error("sorry! invalid file type..");
      if (flag === 1) {
        setAdult((ob) =>
          produce(ob, (v) => {
            v[index].visaCopy = "";
          })
        );
      } else if (flag === 2) {
        setChild((ob) =>
          produce(ob, (v) => {
            v[index].visaCopy = "";
          })
        );
      } else if (flag === 3) {
        setInfant((ob) =>
          produce(ob, (v) => {
            v[index].visaCopy = "";
          })
        );
      }
    } else {
      var formData = new FormData();
      formData.append(`file`, file);
      // if (file) {
      //   const reader = new FileReader();
      //   reader.onloadend = () => {
      //     if (flag === 1) {
      //       setAdult((ob) =>
      //         produce(ob, (v) => {
      //           v[index].showvisaCopy = reader.result;
      //         })
      //       );
      //     } else if (flag === 2) {
      //       setChild((ob) =>
      //         produce(ob, (v) => {
      //           v[index].showvisaCopy = reader.result;
      //         })
      //       );
      //     } else if (flag === 3) {
      //       setInfant((ob) =>
      //         produce(ob, (v) => {
      //           v[index].showvisaCopy = reader.result;
      //         })
      //       );
      //     }
      //   };
      //   reader.readAsDataURL(file);
      // }
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          // Authorization: "Bearer " + tokenData?.token,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          if (flag === 1) {
            setAdult((ob) =>
              produce(ob, (v) => {
                v[index].visaProgress = percentCompleted;
              })
            );
          } else if (flag === 2) {
            setChild((ob) =>
              produce(ob, (v) => {
                v[index].visaProgress = percentCompleted;
              })
            );
          } else if (flag === 3) {
            setInfant((ob) =>
              produce(ob, (v) => {
                v[index].visaProgress = percentCompleted;
              })
            );
          }
        },
      };
      const postData = async () => {
        const response = await uploadVisaCopy(passportNo, formData, config);
        if (response.data.isUploaded === true) {
          if (flag === 1) {
            setAdult((ob) =>
              produce(ob, (v) => {
                v[index].visaCopy = response.data.fileName;
              })
            );
          } else if (flag === 2) {
            setChild((ob) =>
              produce(ob, (v) => {
                v[index].visaCopy = response.data.fileName;
              })
            );
          } else if (flag === 3) {
            setInfant((ob) =>
              produce(ob, (v) => {
                v[index].visaCopy = response.data.fileName;
              })
            );
          }
        } else {
          toast.error("Please try again..");
        }
      };
      postData();
    }
  };

  const newDataItem = {
    title: "",
    first: "New",
    middle: "",
    last: "",
    id: "",
  };

  const handleGetPassengers = () => {
    const getData = async () => {
      let sendObj = {
        AgentId: sessionStorage.getItem("agentId") ?? 0,
        SearchText: "",
      };
      const response = await getAgentPassengers(1, 500, sendObj);

      setPassengerADTList([
        newDataItem,
        ...response.data.data.filter((f) => f.passengerType === "ADT"),
      ]);
      setPassengerCNNList([
        newDataItem,
        ...response.data.data.filter((f) => f.passengerType === "CNN"),
      ]);
      setPassengerCHDList([
        newDataItem,
        ...response.data.data.filter((f) => f.passengerType === "CHD"),
      ]);
      setPassengerINFList([
        newDataItem,
        ...response.data.data.filter((f) => f.passengerType === "INF"),
      ]);
    };
    getData();
  };
  const ISODateFormatter = (input) => {
    return format(new Date(input), "yyyy-MM-dd");
  };

  const [getuser, setGetuser] = useState();
  let contactDetail = [
    {
      id: 0,
      title: "",
      firstName: "",
      lastName: "",
      email: currentUser.email,
      mobailCode: "",
      mobailNumber: currentUser.mobile,
      nationality: "",
    },
  ];
  const [contact, setContact] = useState(contactDetail);
  const getAgentData = async () => {
    getUserAllInfo()
      .then((agentRes) => {
        setGetuser(agentRes?.data);
        let contactDetail = [
          {
            id: 0,
            title: "",
            firstName: "",
            lastName: "",
            email: currentUser.email,
            mobailCode: courtries.filter(
              (item) => item.code === agentRes?.data.countryCode
            )[0].dial_code,
            mobailNumber: currentUser.mobile,
            nationality: agentRes?.data.countryCode ?? "BD",
          },
        ];
        setContact(contactDetail);
      })
      .catch((err) => {
        //alert('Invalid login')
      });
  };
  useEffect(() => {
    getAgentData();
    handleGetPassengers();
    $(document).ready(function () {});
  }, []);
  const handleClick = (e) => {
    if (e.target.checked) {
      setClick(true);
    } else {
      setClick(false);
    }
  };

  const handleOnChange = (e) => {
    const re = /^[a-zA-Z,]*$/;
    let name = e.target.value;
    if (re.test(name)) {
      setFirstname(name);
      setMessage();
    } else {
      setMessage("Please Enter only alphabet");
    }
  };

  $("#name").on("input", function () {
    var input = $(this);
    var is_name = input.val();
    if (is_name) {
      input.removeClass("invalid").addClass("valid");
    } else {
      input.removeClass("valid").addClass("invalid");
    }
  });

  let adultYearList = [];
  let childYearList = [];
  let infantYearList = [];

  var thisYear = new Date().getFullYear();

  for (var i = 12; i <= 100; i++) {
    var year = thisYear - i;
    adultYearList.push(year);
  }

  for (var i = 2; i <= 12; i++) {
    var year = thisYear - i;
    childYearList.push(year);
  }

  for (var i = 1; i <= 2; i++) {
    var year = thisYear - i;
    infantYearList.push(year);
  }

  const togglebaggagea = (id) => {
    $("#toggle-baggagea" + id).toggle();
  };
  const togglebaggagec = (id) => {
    $("#toggle-baggagec" + id).toggle();
  };

  useEffect(() => {
    for (var i = 0; i < adultNumber; i++) {
      $("#toggle-baggagea" + i).hide();
    }

    for (var j = 0; j < childrenNumber; j++) {
      $("#toggle-baggagec" + j).hide();
    }
  }, [adultNumber, childrenNumber]);

  let adultList = [];
  for (var i = 0; i < adultNumber; i++) {
    let newObj = {
      id: 0,
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "BD",
      document: "",
      passportNumber: "",
      issuingCountry: "BD",
      passportExDate: "",
      gender: "Male",
      countryCode: "BD",
      frequentFlyerNumber: "",
      passportCopy: "",
      visaCopy: "",
      showvisaCopy: "",
      showPassportCopy: "",
      isDisabled: false,
      IsWheelchair: false,
      aCMExtraServices: hasExtraService
        ? fullObj?.directions?.map((item) => [])
        : [],
      type: "adt",
      isQuickPassenger: false,
      progress: 0,
      visaProgress:0
    };
    adultList.push(newObj);
  }

  const [adult, setAdult] = useState(adultList);

  let dataObj = courtries.find((i) => i.name === adult[0].nationality);
  let childList = [];
  for (var i = 0; i < childrenNumber; i++) {
    let newObj = {
      id: 0,
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "BD",
      document: "",
      passportNumber: "",
      issuingCountry: "BD",
      passportExDate: "",
      gender: "Male",
      countryCode: "BD",
      frequentFlyerNumber: "",
      passportCopy: "",
      visaCopy: "",
      showvisaCopy: "",
      showPassportCopy: "",
      isDisabled: false,
      aCMExtraServices: hasExtraService
        ? fullObj?.directions?.map((item) => [])
        : [],
      type: "cnn",
      isQuickPassenger: false,
      progress: 0,
      visaProgress:0
    };
    childList.push(newObj);
  }

  const [child, setChild] = useState(childList);

  const [isExDateValidAdt, setisExDateValidAdt] = useState(true);
  const [isExDateValidCnn, setisExDateValidCnn] = useState(true);
  const [isExDateValidInf, setisExDateValidInf] = useState(true);
  const [isAdultValid, setAdultValid] = useState(false);
  const [isChildValid, setChildValid] = useState(false);
  const [isInfantValid, setInfantValid] = useState(false);

  useEffect(() => {
    let arr = adult.map((p) => {
      if (!p.dateOfBirth) {
        return false;
      } else {
        return !moment(p.dateOfBirth).isAfter(
          ISODateFormatter(
            add(
              new Date(
                Database?.tripTypeModify === "Round Trip" &&
                calculateFullAge(Database?.journeyDate, Database?.returnDate)
                  ? direction0.platingCarrierCode === "BS"
                    ? Database?.journeyDate
                    : Database?.returnDate
                  : Database?.tripTypeModify === "One Way"
                  ? Database?.journeyDate
                  : Database?.destination5 !== ""
                  ? Database?.inputDateMulti5
                  : Database?.destination4 !== ""
                  ? Database?.inputDateMulti4
                  : Database?.destination3 !== ""
                  ? Database?.inputDateMulti3
                  : Database?.destination2 !== ""
                  ? Database?.inputDateMulti2
                  : Database?.destination1 !== ""
                  ? Database?.inputDateMulti1
                  : Database?.journeyDate
              ),
              { years: -12 }
            )
          ) ||
            p.dateOfBirth === "" ||
            (isDomestic ? false : p.passportExDate === "")
        );
      }
    });
    setAdultValid(arr.every((element) => element === true));
  }, [adult]);

  useEffect(() => {
    let arr = child.map((p, idx) => {
      return !moment(p.dateOfBirth).isBefore(
        ISODateFormatter(
          add(
            new Date(
              Database?.tripTypeModify === "Round Trip" &&
              calculateFullAge(Database?.journeyDate, Database?.returnDate)
                ? direction0.platingCarrierCode === "BS"
                  ? Database?.journeyDate
                  : Database?.returnDate
                : Database?.tripTypeModify === "One Way"
                ? Database?.journeyDate
                : Database?.destination5 !== ""
                ? Database?.inputDateMulti5
                : Database?.destination4 !== ""
                ? Database?.inputDateMulti4
                : Database?.destination3 !== ""
                ? Database?.inputDateMulti3
                : Database?.destination2 !== ""
                ? Database?.inputDateMulti2
                : Database?.destination1 !== ""
                ? Database?.inputDateMulti1
                : Database?.journeyDate
            ),
            {
              years:
                2 <= childAgeList[idx].age && childAgeList[idx].age < 5
                  ? -5
                  : -12,
            }
          )
        ) ||
          p.dateOfBirth === "" ||
          (isDomestic ? false : p.passportExDate === "")
      );
    });
    setChildValid(arr.every((element) => element === true));
  }, [child]);

  let infantList = [];
  for (var i = 0; i < infantNumber; i++) {
    let newObj = {
      id: 0,
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "BD",
      document: "",
      passportNumber: "",
      issuingCountry: "BD",
      passportExDate: "",
      gender: "Male",
      countryCode: "BD",
      frequentFlyerNumber: "",
      passportCopy: "",
      visaCopy: "",
      showvisaCopy: "",
      showPassportCopy: "",
      isDisabled: false,
      aCMExtraServices: hasExtraService
        ? fullObj?.directions?.map((item) => [])
        : [],
      type: "inf",
      isQuickPassenger: false,
      progress: 0,
      visaProgress:0
    };
    infantList.push(newObj);
  }

  const [infant, setInfant] = useState(infantList);

  useEffect(() => {
    let arr = infant.map((p) => {
      return !moment(p.dateOfBirth).isBefore(
        ISODateFormatter(
          add(
            new Date(
              Database?.tripTypeModify === "Round Trip" &&
              calculateFullAge(Database?.journeyDate, Database?.returnDate)
                ? direction0.platingCarrierCode === "BS"
                  ? Database?.journeyDate
                  : Database?.returnDate
                : Database?.tripTypeModify === "One Way"
                ? Database?.journeyDate
                : Database?.destination5 !== ""
                ? Database?.inputDateMulti5
                : Database?.destination4 !== ""
                ? Database?.inputDateMulti4
                : Database?.destination3 !== ""
                ? Database?.inputDateMulti3
                : Database?.destination2 !== ""
                ? Database?.inputDateMulti2
                : Database?.destination1 !== ""
                ? Database?.inputDateMulti1
                : Database?.journeyDate
            ),
            { years: -2, days: 2 }
          )
        ) ||
          p.dateOfBirth === "" ||
          (isDomestic ? false : p.passportExDate === "")
      );
    });
    setInfantValid(arr.every((element) => element === true));
  }, [infant]);

  const [priceChangedData, setPriceChangedData] = useState();
  const [messageForExtra, setMessageForExtra] = useState();
  const [sameName, setSameName] = useState([]);

  //additional phone added

  const [optionalPhone, setOptionalPhone] = useState({
    sentToEmail: "",
    sentToPhone: "",
  });


  const [additionalPhoneadd, setAdditionalPhoneadd] = useState(false);
  const aditionalphoneClick = (e) => {
    if (e.target.checked) {
      setAdditionalPhoneadd(true);
    } else {
      setAdditionalPhoneadd(false);
      setOptionalPhone({
        sentToEmail: "",
        sentToPhone: "",
      });
    }
  };


  const bookingData = (e) => {
    // e.preventDefault();
    setExtraServiceConfirm(false);

    let sendObj = {
      passengerInfoes: [],
      taxRedemptions: [],
      uniqueTransID: "",
      itemCodeRef: "",
      PriceCodeRef: "",
      bookingWiseContactInfo: optionalPhone,
    };

    adult.map((item) => {
      let idObj = passengerADTList.find(
        (f) =>
          f.title + " " + f.first + " " + f.middle + " " + f.last ===
          item.title +
            " " +
            item.firstName +
            " " +
            item.middleName +
            " " +
            item.lastName
      );
      let passengerObj = {
        nameElement: {
          title: item.title,
          firstName: item.firstName,
          lastName: item.lastName,
          middleName: item.middleName,
        },
        contactInfo: {
          email: contact[0].email,
          phone: contact[0].mobailNumber,
          phoneCountryCode: contact[0].mobailCode,
          countryCode: contact[0].nationality,
          cityName: "",
        },
        documentInfo: {
          documentType: item.document,
          documentNumber: item.passportNumber,
          expireDate:
            domestic(origin, destination) &&
            domestic(searchData.origin1, searchData.destination1) &&
            domestic(searchData.origin2, searchData.destination2) &&
            domestic(searchData.origin3, searchData.destination3) &&
            domestic(searchData.origin4, searchData.destination4) &&
            domestic(searchData.origin5, searchData.destination5)
              ? ""
              : moment(item?.passportExDate).format("yyyy-MM-DD"),
          frequentFlyerNumber: item.frequentFlyerNumber,
          issuingCountry: item.issuingCountry,
          nationality: item.nationality,
        },
        passengerType: "ADT",
        gender: item.gender,
        dateOfBirth:
          domestic(origin, destination) &&
          domestic(searchData.origin1, searchData.destination1) &&
          domestic(searchData.origin2, searchData.destination2) &&
          domestic(searchData.origin3, searchData.destination3) &&
          domestic(searchData.origin4, searchData.destination4) &&
          domestic(searchData.origin5, searchData.destination5)
            ? moment(item.dateOfBirth).format("yyyy-MM-DD")
            : moment(item.dateOfBirth).format("yyyy-MM-DD"),
        passengerKey: idObj !== undefined ? String(idObj.id) : "0",
        isLeadPassenger: true,
        isQuickPassenger: item.isQuickPassenger,
        passportCopy: item.passportCopy,
        visaCopy: item.visaCopy,
        aCMExtraServices: hasExtraService === true ? item.aCMExtraServices : [],
        IsWheelchair: item.IsWheelchair === "" ? null : item.IsWheelchair,
      };
      sendObj.passengerInfoes.push(passengerObj);
    });

    child.map((item) => {
      let passengerObj = {
        nameElement: {
          title: item.title,
          firstName: item.firstName,
          lastName: item.lastName,
          middleName: item.middleName,
        },
        contactInfo: {
          email: contact[0].email,
          phone: contact[0].mobailNumber,
          phoneCountryCode: contact[0].mobailCode,
          countryCode: contact[0].nationality,
          cityName: "",
        },
        documentInfo: {
          documentType: item.document,
          documentNumber: item.passportNumber,
          expireDate:
            domestic(origin, destination) &&
            domestic(searchData.origin1, searchData.destination1) &&
            domestic(searchData.origin2, searchData.destination2) &&
            domestic(searchData.origin3, searchData.destination3) &&
            domestic(searchData.origin4, searchData.destination4) &&
            domestic(searchData.origin5, searchData.destination5)
              ? ""
              : moment(item?.passportExDate).format("yyyy-MM-DD"),
          frequentFlyerNumber: item.frequentFlyerNumber,
          issuingCountry: item.issuingCountry,
          nationality: item.nationality,
        },
        passengerType: "CNN",
        gender: item.gender,
        dateOfBirth: moment(item.dateOfBirth).format("yyyy-MM-DD"),
        passengerKey: "0",
        isLeadPassenger: true,
        isQuickPassenger: item.isQuickPassenger,
        passportCopy: item.passportCopy,
        visaCopy: item.visaCopy,
        aCMExtraServices: hasExtraService === true ? item.aCMExtraServices : [],
      };
      sendObj.passengerInfoes.push(passengerObj);
    });

    infant.map((item) => {
      let passengerObj = {
        nameElement: {
          title: item.title,
          firstName: item.firstName,
          lastName: item.lastName,
          middleName: item.middleName,
        },
        contactInfo: {
          email: contact[0].email,
          phone: contact[0].mobailNumber,
          phoneCountryCode: contact[0].mobailCode,
          countryCode: contact[0].nationality,
          cityName: "",
        },
        documentInfo: {
          documentType: item.document,
          documentNumber: item.passportNumber,
          expireDate:
            domestic(origin, destination) &&
            domestic(searchData.origin1, searchData.destination1) &&
            domestic(searchData.origin2, searchData.destination2) &&
            domestic(searchData.origin3, searchData.destination3) &&
            domestic(searchData.origin4, searchData.destination4) &&
            domestic(searchData.origin5, searchData.destination5)
              ? ""
              : moment(item?.passportExDate).format("yyyy-MM-DD"),
          frequentFlyerNumber: item.frequentFlyerNumber,
          issuingCountry: item.issuingCountry,
          nationality: item.nationality,
        },
        passengerType: "INF",
        gender: item.gender,
        dateOfBirth: moment(item.dateOfBirth).format("yyyy-MM-DD"),
        passengerKey: "0",
        isLeadPassenger: true,
        isQuickPassenger: item.isQuickPassenger,
        passportCopy: item.passportCopy,
        visaCopy: item.visaCopy,
        aCMExtraServices: hasExtraService === true ? item.aCMExtraServices : [],
      };
      sendObj.passengerInfoes.push(passengerObj);
    });
    sessionStorage.setItem("passengerPack", JSON.stringify(sendObj));
    const priceCheck = {
      itemCodeRef: itemCodeRef,
      uniqueTransID: uniqueTransID,
      taxRedemptions: [],
      segmentCodeRefs: [],
      brandedFareRefs:
        brandedFareList !== null && brandedFareList?.length > 0
          ? brandedFareList[brandedFareSelectedIdx]?.ref
          : "",
    };
    if (Object.keys(direction0).length > 0) {
      direction0.segments.map((i) =>
        priceCheck.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (Object.keys(direction1).length > 0) {
      direction1.segments.map((i) =>
        priceCheck.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (Object.keys(direction2).length > 0) {
      direction2.segments.map((i) =>
        priceCheck.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (Object.keys(direction3).length > 0) {
      direction3.segments.map((i) =>
        priceCheck.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (Object.keys(direction4).length > 0) {
      direction4.segments.map((i) =>
        priceCheck.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (Object.keys(direction5).length > 0) {
      direction5.segments.map((i) =>
        priceCheck.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }

    const duplicateArr = sendObj.passengerInfoes
      .map(
        (item) =>
          `${item.nameElement?.firstName
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase()} ${item.nameElement?.lastName
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase()}`
      )
      .filter((item) => item !== " ");

    const isDuplicateArr = new Set(duplicateArr).size !== duplicateArr.length;

    const duplicatePassportArr = sendObj.passengerInfoes
      .map((item) => item.documentInfo.documentNumber)
      .filter((item) => item !== " ");

    const isDublicatePassportArr =
      new Set(duplicatePassportArr).size != duplicatePassportArr.length;

    function findDuplicateNames(passengers) {
      const duplicateIndices = {};
      let i = 0;
      let j = 0;
      passengers.forEach((passenger, index) => {
        const key = `${passenger.nameElement.firstName
          .trim()
          .replace(/\s+/g, " ")
          .toLowerCase()} ${passenger.nameElement.lastName
          .trim()
          .replace(/\s+/g, " ")
          .toLowerCase()}`;
        if (!duplicateIndices[key]) {
          duplicateIndices[key] = [];
        }
        if (passenger.passengerType === "ADT") {
          duplicateIndices[key].push({
            type: passenger.passengerType,
            index: index,
          });
        } else if (passenger.passengerType === "CNN") {
          duplicateIndices[key].push({
            type: passenger.passengerType,
            index: i,
          });
          i++;
        } else if (passenger.passengerType === "INF") {
          duplicateIndices[key].push({
            type: passenger.passengerType,
            index: j,
          });
          j++;
        }
      });

      const duplicates = [];
      for (const key in duplicateIndices) {
        if (duplicateIndices[key].length > 1) {
          duplicates.push({ indices: duplicateIndices[key] });
        }
      }

      return duplicates;
    }
    const duplicateNames = findDuplicateNames(sendObj.passengerInfoes);
    setSameName(duplicateNames && duplicateNames);

    const VlidateName = sendObj.passengerInfoes.map((item) =>
      validateNameForPax(item.nameElement.firstName, item.nameElement.lastName)
    );

    // Filter invalid names
    const invalidNames = VlidateName.filter((item) => !item.isValid);

    if (invalidNames.length > 0) {
      return toast.error(invalidNames?.[0]?.message);
    }

    const emptyName = sendObj.passengerInfoes.map((v) => {
      if (
        !v.nameElement.firstName.trim().replace(/\s+/g, " ").toLowerCase()
          .length ||
        !v.nameElement.lastName.trim().replace(/\s+/g, " ").toLowerCase().length
      ) {
        return true;
      } else {
        return false;
      }
    });
    if (!emptyName.every((arr) => arr === false)) {
      toast.error(`Name should be valid`);
      return;
    }

    if (isDuplicateArr) {
      toast.error(`Name should be different!`);
      return;
    }

    if (
      domestic(origin, destination) &&
      domestic(searchData.origin1, searchData.destination1) &&
      domestic(searchData.origin2, searchData.destination2) &&
      domestic(searchData.origin3, searchData.destination3) &&
      domestic(searchData.origin4, searchData.destination4) &&
      domestic(searchData.origin5, searchData.destination5)
    ) {
    } else {
      if (isDublicatePassportArr) {
        toast.error(`Passport number should be different!`);
        return;
      }
    }

    setLoading(true);
    async function fetchOptions() {
      await requestPrice(priceCheck, {
        timeout: 600000,
      })
        .then((response) => {
          if (response.data.item1 !== null) {
            if (
              response.data.item1?.isPriceChanged === false &&
              response.data.item1?.isPriceChanged !== undefined
            ) {
              if (
                hasExtraService &&
                sendObj?.passengerInfoes
                  .map((obj, idx) =>
                    obj?.aCMExtraServices?.some((item) => item.length !== 0)
                  )
                  .some((item) => item === true)
              ) {
                apiRequestExtraServiceRePrice(
                  response.data.item1?.priceCodeRef,
                  response.data.item1?.uniqueTransID,
                  response.data.item1?.itemCodeRef
                );
              } else if (bookable === true) {
                booking(
                  response.data.item1?.priceCodeRef,
                  response.data.item1?.uniqueTransID,
                  response.data.item1?.itemCodeRef
                );
              } else {
                directTicket(
                  response.data.item1?.priceCodeRef,
                  response.data.item1?.uniqueTransID,
                  response.data.item1?.itemCodeRef
                );
              }
            } else if (response.data.item1?.isPriceChanged === true) {
              setLoading(false);
              document.getElementsByClassName("modal-backdrop")[0].remove();
              // sessionStorage.setItem(
              //   "totalPrice",
              //   JSON.stringify(response.data.item1?.totalPrice)
              // );
              // sessionStorage.setItem(
              //   "passengerFares",
              //   JSON.stringify(response.data.item1?.passengerFares)
              // );
              // sessionStorage.setItem(
              //   "passengerCounts",
              //   JSON.stringify(response.data.item1?.passengerCounts)
              // );
              // sessionStorage.setItem(
              //   "bookingComponents",
              //   JSON.stringify(response.data.item1?.bookingComponents)
              // );
              onOpen1();
              setBookData(response);
              setPriceChangedData(response);
              // sessionStorage.setItem("reprice", JSON.stringify(response));
              // navigate("/bookingmodal");
            }
          } else {
            setLoading(false);
            toast.error(response.data.item2.message);
            navigate("/farechange");
          }
        })
        .catch((err) => {
          setLoading(false);
          navigate("/farechange");
        });
    }
    fetchOptions();
    async function booking(price, uniqueTransID, itemCodeRef) {
      sendObj.uniqueTransID = uniqueTransID;
      sendObj.itemCodeRef = itemCodeRef;
      sendObj.PriceCodeRef = price;
      await requestBook(sendObj, {
        timeout: 600000,
      })
        .then((response) => {
          if (response.data.item1 !== null) {
            if (response.data.item2?.isSuccess === true) {
              setBookData(response);
              sessionStorage.setItem("bookData", JSON.stringify(response));
              setLoading(false);
              localStorage.setItem("ismailbook", JSON.stringify(true));
              $(".modal-backdrop").remove();
              $("body").removeClass("modal-open");
              $("body").removeAttr("style");
              navigate(
                "/bookedview?utid=" +
                  response.data.item2?.uniqueTransID +
                  "&sts=Confirm"
              );
            } else {
              setLoading(false);
              navigate("/failedbooking");
            }
          } else if (
            response.data.item1 === null &&
            response.data.item2?.isSuccess === false &&
            response.data.item2?.isMessageShow
          ) {
            setLoading(false);
            $(".modal-backdrop").remove();
            $("body").removeClass("modal-open");
            $("body").removeAttr("style");
            toast.error(response.data.item2?.message);
          } else {
            setLoading(false);
            toast.error("Booking Failed! please try again.");
            navigate("/failedbooking");
          }
        })
        .catch((err) => {
          setLoading(false);
          navigate("/failedbooking");
        });
    }
    async function directTicket(price, uniqueTransID, itemCodeRef) {
      sendObj.uniqueTransID = uniqueTransID;
      sendObj.itemCodeRef = itemCodeRef;
      sendObj.PriceCodeRef = price;
      await requestBook(sendObj, {
        timeout: 600000,
      })
        .then((response) => {
          if (response.data.item1 !== null) {
            if (response.data.item2?.isSuccess === true) {
              setBookData(response.data);
              sessionStorage.setItem(
                "ticketData",
                JSON.stringify(response.data)
              );
              setLoading(false);
              // navigate("/successticket");
              $(".modal-backdrop").remove();
              $("body").removeClass("modal-open");
              $("body").removeAttr("style");
              navigate(
                "/ticket?utid=" +
                  response.data.item2?.uniqueTransID +
                  "&sts=Confirm"
              );
            } else {
              setLoading(false);
              navigate("/processticket");
            }
          } else if (
            response.data.item1 === null &&
            response.data.item2?.isSuccess === false &&
            response.data.item2?.isMessageShow
          ) {
            setLoading(false);
            $(".modal-backdrop").remove();
            $("body").removeClass("modal-open");
            $("body").removeAttr("style");
            toast.error(response.data.item2?.message);
          } else {
            setLoading(false);
            // toast.error("Booking Failed! please try again.");
            navigate("/processticket");
          }
        })
        .catch((err) => {
          setLoading(false);
          navigate("/processticket");
        });
    }
    async function apiRequestExtraServiceRePrice(
      price,
      uniqueTransID,
      itemCodeRef
    ) {
      sendObj.uniqueTransID = uniqueTransID;
      sendObj.itemCodeRef = itemCodeRef;
      sendObj.PriceCodeRef = price;
      await requestExtraServiceRePrice(sendObj, {
        timeout: 600000,
      })
        .then((response) => {
          if (response.data.item1 !== null) {
            if (response?.data.item1?.isPriceChanged === true) {
              document.getElementsByClassName("modal-backdrop")[0].remove();
              // sessionStorage.setItem(
              //   "totalPrice",
              //   JSON.stringify(response.data.item1?.totalPrice)
              // );
              // sessionStorage.setItem(
              //   "passengerFares",
              //   JSON.stringify(response.data.item1?.passengerFares)
              // );
              // sessionStorage.setItem(
              //   "passengerCounts",
              //   JSON.stringify(response.data.item1?.passengerCounts)
              // );
              // sessionStorage.setItem(
              //   "bookingComponents",
              //   JSON.stringify(response.data.item1?.bookingComponents)
              // );
              onOpen1();
              setBookData(response);
              setPriceChangedData(response);
            } else if (response.data.item2?.isSuccess === true) {
              directTicketArabia(
                response.data.item1?.priceCodeRef,
                response.data.item1?.uniqueTransID,
                response.data.item1?.itemCodeRef,
                response.data.item1?.extraServicePriceCodeRef
              );
            } else {
              setLoading(false);
              // navigate("/failedbooking");
              document.getElementsByClassName("modal-backdrop")[0].remove();
              if (
                response?.data?.item2?.message.includes(
                  "Selected Baggages are not available at the moment"
                ) ||
                response?.data?.item2?.message.includes("Invalid baggage")
              ) {
                setMessageForExtra(response?.data?.item2?.message);
                onClose1();
                onOpen2();
              }
            }
          } else {
            setLoading(false);
            toast.error("Booking Failed! please try again.");
            navigate("/failedbooking");
          }
        })
        .catch((err) => {
          setLoading(false);
          navigate("/failedbooking");
        });
    }
    async function directTicketArabia(
      price,
      uniqueTransID,
      itemCodeRef,
      extraServicePriceCodeRef
    ) {
      sendObj.uniqueTransID = uniqueTransID;
      sendObj.itemCodeRef = itemCodeRef;
      sendObj.PriceCodeRef = price;
      sendObj.extraServicePriceCodeRef = extraServicePriceCodeRef;
      await requestBook(sendObj, {
        timeout: 600000,
      })
        .then((response) => {
          if (response.data.item1 !== null) {
            if (response.data.item2?.isSuccess === true) {
              setBookData(response.data);
              sessionStorage.setItem(
                "ticketData",
                JSON.stringify(response.data)
              );
              setLoading(false);
              // navigate("/successticket");
              $(".modal-backdrop").remove();
              $("body").removeClass("modal-open");
              $("body").removeAttr("style");
              navigate(
                "/ticket?utid=" +
                  response.data.item2?.uniqueTransID +
                  "&sts=Confirm"
              );
            } else {
              setLoading(false);
              navigate("/processticket");
            }
          } else {
            setLoading(false);
            // toast.error("Booking Failed! please try again.");
            navigate("/processticket");
          }
        })
        .catch((err) => {
          setLoading(false);
          navigate("/processticket");
        });
    }

    e.preventDefault();
  };

  const handleChange = (event) => {
    if (event.target.checked) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  $('input[type="date"]')
    .on("change", function () {
      this.setAttribute(
        "data-date",
        moment(this.value, "YYYY-MM-DD").format(
          this.getAttribute("data-date-format")
        )
      );
    })
    .trigger("change");

  useEffect(() => {
    let arr = adult.map((p) => {
      return !(
        moment(p?.passportExDate).isBefore(
          ISODateFormatter(
            add(
              new Date(
                Object.keys(direction5).length
                  ? direction5?.segments[direction5?.segments?.length - 1]
                      .departure
                  : Object.keys(direction4).length
                  ? direction4?.segments[direction4?.segments?.length - 1]
                      .departure
                  : Object.keys(direction3).length
                  ? direction3?.segments[direction3?.segments?.length - 1]
                      .departure
                  : Object.keys(direction2).length
                  ? direction2?.segments[direction2?.segments?.length - 1]
                      .departure
                  : Object.keys(direction1).length
                  ? direction1?.segments[direction1?.segments?.length - 1]
                      .departure
                  : Object.keys(direction0).length &&
                    direction0?.segments[direction0?.segments?.length - 1]
                      .departure
              ),
              { months: 2 }
            )
          )
        ) ||
        p.dateOfBirth === "" ||
        (isDomestic ? false : p.passportExDate === "")
      );
    });
    setisExDateValidAdt(arr.every((element) => element === true));
  }, [adult]);

  useEffect(() => {
    let arr = child.map((p, idx) => {
      return !(
        moment(p?.passportExDate).isBefore(
          ISODateFormatter(
            add(
              new Date(
                Object.keys(direction5).length
                  ? direction5?.segments[direction5?.segments?.length - 1]
                      .departure
                  : Object.keys(direction4).length
                  ? direction4?.segments[direction4?.segments?.length - 1]
                      .departure
                  : Object.keys(direction3).length
                  ? direction3?.segments[direction3?.segments?.length - 1]
                      .departure
                  : Object.keys(direction2).length
                  ? direction2?.segments[direction2?.segments?.length - 1]
                      .departure
                  : Object.keys(direction1).length
                  ? direction1?.segments[direction1?.segments?.length - 1]
                      .departure
                  : Object.keys(direction0).length &&
                    direction0?.segments[direction0?.segments?.length - 1]
                      .departure
              ),
              { months: 2 }
            )
          )
        ) ||
        moment(p.dateOfBirth).isBefore(
          ISODateFormatter(
            add(
              new Date(
                Database?.tripTypeModify === "Round Trip" &&
                calculateFullAge(Database?.journeyDate, Database?.returnDate)
                  ? direction0.platingCarrierCode === "BS"
                    ? Database?.journeyDate
                    : Database?.returnDate
                  : Database?.tripTypeModify === "One Way"
                  ? Database?.journeyDate
                  : Database?.destination5 !== ""
                  ? Database?.inputDateMulti5
                  : Database?.destination4 !== ""
                  ? Database?.inputDateMulti4
                  : Database?.destination3 !== ""
                  ? Database?.inputDateMulti3
                  : Database?.destination2 !== ""
                  ? Database?.inputDateMulti2
                  : Database?.destination1 !== ""
                  ? Database?.inputDateMulti1
                  : Database?.journeyDate
              ),
              {
                years:
                  2 <= childAgeList[idx].age && childAgeList[idx].age < 5
                    ? -5
                    : -12,
              }
            )
          )
        ) ||
        moment(p.dateOfBirth).isAfter(
          ISODateFormatter(
            add(
              new Date(
                Database?.tripTypeModify === "Round Trip" &&
                calculateFullAge(Database?.journeyDate, Database?.returnDate)
                  ? direction0.platingCarrierCode === "BS"
                    ? Database?.journeyDate
                    : Database?.returnDate
                  : Database?.tripTypeModify === "One Way"
                  ? Database?.journeyDate
                  : Database?.destination5 !== ""
                  ? Database?.inputDateMulti5
                  : Database?.destination4 !== ""
                  ? Database?.inputDateMulti4
                  : Database?.destination3 !== ""
                  ? Database?.inputDateMulti3
                  : Database?.destination2 !== ""
                  ? Database?.inputDateMulti2
                  : Database?.destination1 !== ""
                  ? Database?.inputDateMulti1
                  : Database?.journeyDate
              ),
              {
                years:
                  2 <= childAgeList[idx].age && childAgeList[idx].age < 5
                    ? -2
                    : -5,
              }
            )
          )
        ) ||
        p.dateOfBirth === "" ||
        (isDomestic ? false : p.passportExDate === "")
      );
    });
    setisExDateValidCnn(arr.every((element) => element === true));
  }, [child]);

  useEffect(() => {
    let arr = infant.map((p) => {
      return !(
        moment(p?.passportExDate).isBefore(
          ISODateFormatter(
            add(
              new Date(
                Object.keys(direction5).length
                  ? direction5?.segments[direction5?.segments?.length - 1]
                      .departure
                  : Object.keys(direction4).length
                  ? direction4?.segments[direction4?.segments?.length - 1]
                      .departure
                  : Object.keys(direction3).length
                  ? direction3?.segments[direction3?.segments?.length - 1]
                      .departure
                  : Object.keys(direction2).length
                  ? direction2?.segments[direction2?.segments?.length - 1]
                      .departure
                  : Object.keys(direction1).length
                  ? direction1?.segments[direction1?.segments?.length - 1]
                      .departure
                  : Object.keys(direction0).length &&
                    direction0?.segments[direction0?.segments?.length - 1]
                      .departure
              ),
              { months: 2 }
            )
          )
        ) ||
        moment(p.dateOfBirth).isBefore(
          ISODateFormatter(
            add(
              new Date(
                Database?.tripTypeModify === "Round Trip" &&
                calculateFullAge(Database?.journeyDate, Database?.returnDate)
                  ? direction0.platingCarrierCode === "BS"
                    ? Database?.journeyDate
                    : Database?.returnDate
                  : Database?.tripTypeModify === "One Way"
                  ? Database?.journeyDate
                  : Database?.destination5 !== ""
                  ? Database?.inputDateMulti5
                  : Database?.destination4 !== ""
                  ? Database?.inputDateMulti4
                  : Database?.destination3 !== ""
                  ? Database?.inputDateMulti3
                  : Database?.destination2 !== ""
                  ? Database?.inputDateMulti2
                  : Database?.destination1 !== ""
                  ? Database?.inputDateMulti1
                  : Database?.journeyDate
              ),
              {
                years: -2,
                days: 2,
              }
            )
          )
        ) ||
        p.dateOfBirth === "" ||
        (isDomestic ? false : p.passportExDate === "")
      );
    });
    setisExDateValidInf(arr.every((element) => element === true));
    
  }, [infant]);

  const [isDomestic, setIsDomestic] = useState(false);

  useEffect(() => {
    setIsDomestic(
      origin.split(",")[0].split("- ")[1] === "Bangladesh" &&
        destination.split(",")[0].split("- ")[1] === "Bangladesh"
        ? true
        : false
    );
  }, [origin, destination]);

  const [isExDateEmptyAdt, setIsExDateEmptyAdt] = useState(true);
  const [isExDateEmptyCnn, setIsExDateEmptyCnn] = useState(true);
  const [isExDateEmptyInf, setIsExDateEmptyInf] = useState(true);

  useEffect(() => {
    let arr = adult.map(
      (obj) =>
        obj.passportExDate === "" ||
        obj.passportExDate === null ||
        obj.passportNumber === "" ||
        obj.passportNumber === null 
        // ||
        // obj.passportCopy === "" ||
        // obj.passportCopy === null
    );
    setIsExDateEmptyAdt(arr.some((val) => val === true));
    if (!bookable) {
      let arr = adult.map(
        (obj) => obj.passportCopy === "" || obj.passportCopy === null
      );
      setIsExDateEmptyAdt(arr.some((val) => val === true));
    }
  }, [adult]);

  useEffect(() => {
    let arr = child.map((obj) =>
      isDomestic
        ? obj.dateOfBirth === "" || obj.dateOfBirth === null
        : obj.passportExDate === "" ||
          obj.passportExDate === null ||
          obj.passportNumber === "" ||
          obj.passportNumber === null ||
          obj.dateOfBirth === "" ||
          obj.dateOfBirth === null 
          // ||
          // obj.passportCopy === "" ||
          // obj.passportCopy === null
    );
    setIsExDateEmptyCnn(arr.some((val) => val === true));
    if (!bookable) {
      let arr = child.map(
        (obj) => obj.passportCopy === "" || obj.passportCopy === null
      );
      setIsExDateEmptyCnn(arr.some((val) => val === true));
    }
  }, [child]);

  useEffect(() => {
    let arr = infant.map((obj) =>
      isDomestic
        ? obj.dateOfBirth === "" || obj.dateOfBirth === null
        : obj.passportExDate === "" ||
          obj.passportExDate === null ||
          obj.passportNumber === "" ||
          obj.passportNumber === null ||
          obj.dateOfBirth === "" ||
          obj.dateOfBirth === null 
          // ||
          // obj.passportCopy === "" ||
          // obj.passportCopy === null
    );
    setIsExDateEmptyInf(arr.some((val) => val === true));
    if (!bookable) {
      let arr = infant.map(
        (obj) => obj.passportCopy === "" || obj.passportCopy === null
      );
      setIsExDateEmptyInf(arr.some((val) => val === true));
    }
  }, [infant]);

  const [isCommonFieldValid, setsCommonFieldValid] = useState(false);

  useEffect(() => {
    let adultValid = adult.map(
      (obj) => obj.firstName === "" || obj.lastName === ""
    );
    let childValid = child.map(
      (obj) => obj.firstName === "" || obj.lastName === ""
    );
    let infantValid = infant.map(
      (obj) => obj.firstName === "" || obj.lastName === ""
    );
    if (
      !adultValid.some((val) => val === true) &&
      !childValid.some((val) => val === true) &&
      !infantValid.some((val) => val === true) &&
      contact[0].email !== "" &&
      isValidEmail(contact[0].email) &&
      contact[0].mobailNumber !== ""
    ) {
      setsCommonFieldValid(true);
    } else setsCommonFieldValid(false);
  }, [adult, child, contact, infant]);

  useEffect(() => {
    sessionStorage.setItem("adult", JSON.stringify(adult));
    setAdultValue(adult);
    sessionStorage.setItem("child", JSON.stringify(child));
    setChildValue(child);
    sessionStorage.setItem("infant", JSON.stringify(infant));
    setInfanttValue(infant);
  }, [adult, child, infant]);

  useEffect(() => {
    sessionStorage.setItem("adult", JSON.stringify(adult));
    sessionStorage.setItem("child", JSON.stringify(child));
    sessionStorage.setItem("infant", JSON.stringify(infant));
  }, []);

  const [extraServiceConfirm, setExtraServiceConfirm] = useState(false);

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

  const handleCancle = () => {
    navigate("/");
  };

  const handleBooking = () => {
    const sendObj = JSON.parse(sessionStorage.getItem("passengerPack"));
    async function booking() {
      onClose1();
      setLoading(true);
      sendObj.uniqueTransID = priceChangedData?.data?.item1?.uniqueTransID;
      sendObj.itemCodeRef = priceChangedData?.data?.item1?.itemCodeRef;
      sendObj.PriceCodeRef = priceChangedData?.data?.item1?.priceCodeRef;
      await requestBook(sendObj, {
        timeout: 600000,
      }).then((response) => {
        if (response.data.item2.isSuccess === true) {
          sessionStorage.setItem("bookData", JSON.stringify(response));
          document.getElementsByClassName("modal-backdrop")[0].remove();
          setLoading(false);
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $("body").removeAttr("style");
          if (!response.data.item1.ticketInfoes) {
            navigate(
              "/bookedview?utid=" +
                response.data.item2?.uniqueTransID +
                "&sts=Confirm"
            );
          } else {
            navigate(
              "/ticket?utid=" +
                response.data.item2?.uniqueTransID +
                "&sts=Confirm"
            );
          }
        } else {
          document.getElementsByClassName("modal-backdrop")[0].remove();
          setLoading(false);
          navigate("/failedbooking");
        }
      });
    }
    booking();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: false,
        dateNF: "yyyy-mm-dd",
      });

      let passengerListObj = {
        adt: [],
        cnn: [],
        inf: [],
      };

      parsedData
        .slice(1)
        .map((row, index) =>
          row.map((_, idx) =>
            _ === "ADT"
              ? passengerListObj.adt.push(row)
              : _ === "CNN"
              ? passengerListObj.cnn.push(row)
              : _ === "INF"
              ? passengerListObj.inf.push(row)
              : null
          )
        );

      if (passengerListObj.adt.length !== adult.length) {
        toast.error(
          "Count of adult from excel does not match with adult pax count in you select."
        );
        return;
      }
      if (passengerListObj.cnn.length !== child.length) {
        toast.error(
          "Count of child from excel does not match with child pax count in you select."
        );
        return;
      }
      if (passengerListObj.inf.length !== infant.length) {
        toast.error(
          "Count of infant pax from excel does not match with infant pax count in you select."
        );
        return;
      }

      passengerListObj.adt.length > 0 &&
        passengerListObj.adt.map((row, index) =>
          row.map((_, idx) => {
            setAdult((ob) =>
              produce(ob, (v) => {
                v[index].title = row[0] ?? "Mr";
                v[index].firstName = row[1] ?? "";
                v[index].middleName = "";
                v[index].lastName = row[2] ?? "";
                v[index].dateOfBirth =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[4] ?? "";
                v[index].nationality =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[6] ?? "BD";
                v[index].passportNumber =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[12] ?? "";
                v[index].issuingCountry =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[13] ?? "BD";
                v[index].passportExDate =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[14] ?? "";
                v[index].gender = row[5] ?? "Male";
                v[index].phoneNumber = "";
                v[index].passportCopy = "";
                v[index].visaCopy = "";
                v[index].isDisabled = false;
              })
            );
          })
        );

      passengerListObj.cnn.length > 0 &&
        passengerListObj.cnn.map((row, index) =>
          row.map((_, idx) => {
            setChild((ob) =>
              produce(ob, (v) => {
                v[index].title = row[0] ?? "Mstr";
                v[index].firstName = row[1] ?? "";
                v[index].middleName = "";
                v[index].lastName = row[2] ?? "";
                v[index].dateOfBirth = row[4] ?? "";
                v[index].nationality =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[6] ?? "BD";
                v[index].passportNumber =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[12] ?? "";
                v[index].issuingCountry =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[13] ?? "BD";
                v[index].passportExDate =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[14] ?? "";
                v[index].gender = row[5] ?? "Male";
                v[index].phoneNumber = "";
                v[index].passportCopy = "";
                v[index].visaCopy = "";
                v[index].isDisabled = false;
              })
            );
          })
        );

      passengerListObj.inf.length > 0 &&
        passengerListObj.inf.map((row, index) =>
          row.map((_, idx) => {
            setInfant((ob) =>
              produce(ob, (v) => {
                v[index].title = row[0] ?? "Mstr";
                v[index].firstName = row[1] ?? "";
                v[index].middleName = "";
                v[index].lastName = row[2] ?? "";
                v[index].dateOfBirth = row[4] ?? "";
                v[index].nationality =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[6] ?? "BD";
                v[index].passportNumber =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[12] ?? "";
                v[index].issuingCountry =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[13] ?? "BD";
                v[index].passportExDate =
                  domestic(origin, destination) &&
                  domestic(searchData.origin1, searchData.destination1) &&
                  domestic(searchData.origin2, searchData.destination2) &&
                  domestic(searchData.origin3, searchData.destination3) &&
                  domestic(searchData.origin4, searchData.destination4) &&
                  domestic(searchData.origin5, searchData.destination5)
                    ? ""
                    : row[14] ?? "";
                v[index].gender = row[5] ?? "Male";
                v[index].phoneNumber = "";
                v[index].passportCopy = "";
                v[index].visaCopy = "";
                v[index].isDisabled = false;
              })
            );
          })
        );
    };
    reader.readAsArrayBuffer(file);
  };

  const agentInfo = JSON.parse(sessionStorage.getItem("agentInfoData"));

  const [verifyIfUnlockedForTicketState, setVerifyIfUnlockedForTicketState] =
    useState(true);
  const [desableotp, setdesableotp] = useState("");

  const handleVerifyIfUnlockedForTicket = async () => {
    try {
      const response = await verifyIfUnlockedForTicket(
        JSON.parse(sessionStorage.getItem("uniqueTransID"))
      );
      if (!response?.data?.data) {
        setVerifyIfUnlockedForTicketState(response?.data?.data);
      } else if (response?.data?.data) {
        setVerifyIfUnlockedForTicketState(response?.data?.data);
      }
    } catch (e) {
      toast.error("Please try again");
    }
  };

  const [otpMessage, setOtpMessage] = useState("");
  const handlegetTicketUnlockOtp = async () => {
    try {
      const response = await getTicketUnlockOtp(
        JSON.parse(sessionStorage.getItem("uniqueTransID"))
      );
      if (response.data.isSuccess) {
        setOtpMessage(response.data.message);
        onOpen3();
      } else if (!response.data.isSuccess) {
        setOtpMessage(response.data.message);
        toast.error(response.data.message);
        onOpen3();
      }
    } catch (e) {
      toast.error("Please try again");
    }
  };

  const handleVerifyTicketUnlockOtp = async () => {
    try {
      const response = await verifyTicketUnlockOtp(
        desableotp,
        JSON.parse(sessionStorage.getItem("uniqueTransID"))
      );
      if (response.data.isSuccess) {
        handleVerifyIfUnlockedForTicket();
        onClose3();
        toast.success(response.data.message);
      } else if (!response.data.isSuccess) {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error("Please try again");
    }
  };

  useEffect(() => {
    if (!bookable) {
      handleVerifyIfUnlockedForTicket();
    }
  }, []);

  const [activeIndex, setActiveIndex] = useState(null);

  const [activeField, setActiveField] = useState({ index: null, field: null });

  const [activeFieldforChild, setActiveFieldforChild] = useState({
    index: null,

    field: null,
  });

  const [activeFieldforinf, setActiveFieldforinf] = useState({
    index: null,

    field: null,
  });


  const clearPassPortImage = (flag,index) => {

    if (flag === 1) {
      document.getElementById(`adultpassport${index}`).value = "";
      setAdult((ob) =>
        produce(ob, (v) => {
          v[index].showPassportCopy = "";
        })
      );
    } else if (flag === 2) {
      document.getElementById(`childpassport${index}`).value = "";
      setChild((ob) =>
        produce(ob, (v) => {
          v[index].showPassportCopy = "";
        })
      );
    } else if (flag === 3) {
      document.getElementById(`infantpassport${index}`).value = "";
      setInfant((ob) =>
        produce(ob, (v) => {
          v[index].showPassportCopy = "";
        })
      );
    }
    
  };
  

  const clearVisaCopyImage = (flag,index) => {

    if (flag === 1) {
      document.getElementById(`adultVisa${index}`).value = "";
      setAdult((ob) =>
        produce(ob, (v) => {
          v[index].showvisaCopy = "";
        })
      );
    } else if (flag === 2) {
      document.getElementById(`childVisa${index}`).value = "";
      setChild((ob) =>
        produce(ob, (v) => {
          v[index].showvisaCopy = "";
        })
      );
    } else if (flag === 3) {
      document.getElementById(`infantVisa${index}`).value = "";
      setInfant((ob) =>
        produce(ob, (v) => {
          v[index].showvisaCopy = "";
        })
      );
    }
    
  };

  return (
    <form onSubmit={bookingData}>
      {loading && <Loading flag={2} loading={loading}></Loading>}
      <div className="col-lg-12">
        <div className="card box-shadow">
          <div className="card-body border">
            <div style={{ fontSize: "small" }}>
              <h5 className="text-color fw-bold text-start">
                Enter passenger details
              </h5>
              {/* <div className="form-group p1-2 d-flex justify-content-end">
                <div>
                  <label htmlFor="fileInput" className="text-end text-danger">Upload Excel File For Fill The Form:</label>
                  <input
                    type="file"
                    className="form-control-file bg-secondary rounded"
                    id="fileInput"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />
                </div>

              </div> */}

              {adult.map((p, index) => {
                return (
                  <div key={index} className="border p-2 my-3">
                    <div className="row">
                      <h3 className="form-label fw-bold">
                        <span>Adult ({index + 1})</span>{" "}
                        {sameName &&
                          sameName?.map((item) =>
                            item?.indices?.map(
                              (item) =>
                                item.type === p.type.toUpperCase() &&
                                item.index === index && (
                                  <span
                                    className="text-danger ps-2"
                                    style={{ fontSize: "10px" }}
                                  >
                                    Name sould be different
                                  </span>
                                )
                            )
                          )}
                      </h3>
                      <div className="col-lg-12 my-2">
                        {" "}
                        <Select
                          isClearable={true}
                          options={passengerADTList.map((item) => ({
                            label:
                              item.title +
                              " " +
                              item.first +
                              " " +
                              item.middle +
                              " " +
                              item.last,
                            value: item.id,
                          }))}
                          onChange={(e) => {
                            if (e == null) {
                              clearPassPortImage(1, index); 
                              clearVisaCopyImage(1, index);
                              setAdult((ob) =>
                                produce(ob, (v) => {
                                  v[index].title = "";
                                  v[index].firstName = "";
                                  v[index].middleName = "";
                                  v[index].lastName = "";
                                  v[index].dateOfBirth = "";
                                  v[index].nationality =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : "BD";
                                  v[index].passportNumber = "";
                                  v[index].issuingCountry =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : "BD";
                                  // v[index].passportDate = "";
                                  // v[index].passportMonth = "";
                                  // v[index].passportYear = "";
                                  v[index].passportExDate = "";
                                  v[index].gender = "Male";
                                  v[index].phoneNumber = "";
                                  v[index].passportCopy = "";
                                  v[index].visaCopy = "";
                                  v[index].isDisabled = false;
                                  v[index].isQuickPassenger = false;
                                })
                              );
                              return;
                            }
                            const id = Number(e.value);
                            const item = passengerADTList.find(
                              (f) => f.id === id
                            );
                            if (item !== undefined) {
                              setAdult((ob) =>
                                produce(ob, (v) => {
                                  v[index].title = item.title;
                                  v[index].firstName = item.first;
                                  v[index].middleName = item.middle;
                                  v[index].lastName = item.last;
                                  v[index].dateOfBirth =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ISODateFormatter(item?.dateOfBirth)
                                      : ISODateFormatter(item?.dateOfBirth);
                                  v[index].nationality =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : item.nationality;
                                  v[index].passportNumber =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : item.documentNumber;
                                  v[index].issuingCountry =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : item.documentIssuingCountry !== null &&
                                        item.documentIssuingCountry !== ""
                                      ? item.documentIssuingCountry
                                      : "BD";
                                  v[index].passportExDate =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : ISODateFormatter(item?.expireDate);
                                  v[index].gender = item.gender;
                                  v[index].phoneNumber = item.phone;
                                  v[index].passportCopy = item.passportCopy;
                                  v[index].visaCopy = item.visaCopy;
                                  v[index].showvisaCopy = "";
                                  v[index].showPassportCopy = "";
                                  v[index].isDisabled = true;
                                  v[index].isQuickPassenger = false;
                                })
                              );
                            } else {
                              setAdult((ob) =>
                                produce(ob, (v) => {
                                  v[index].title = "";
                                  v[index].firstName = "";
                                  v[index].middleName = "";
                                  v[index].lastName = "";
                                  v[index].dateOfBirth = "";
                                  v[index].nationality = "BD";
                                  v[index].passportNumber = "";
                                  v[index].issuingCountry = "";
                                  v[index].passportExDate = "";
                                  v[index].gender = "Male";
                                  v[index].phoneNumber = "";
                                  v[index].passportCopy = "";
                                  v[index].visaCopy = "";
                                  v[index].isDisabled = false;
                                  v[index].isQuickPassenger = false;
                                })
                              );
                            }
                          }}
                        />
                      </div>

                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label
                            className="form-label float-start fw-bold"
                            type=""
                          >
                            Title
                          </label>

                          <div className="input-group mb-3">
                            <select
                              name="title"
                              className="form-select border-radius"
                              onChange={(e) => {
                                const title = e.target.value;

                                setAdult((ob) =>
                                  produce(ob, (v) => {
                                    v[index].title = title;
                                  })
                                );

                                setAdult((ob) =>
                                  produce(ob, (v) => {
                                    v[index].gender =
                                      title === "Mr" ? "Male" : "Female";
                                  })
                                );
                              }}
                              value={p.title}
                              required
                            >
                              <option value="">Select</option>
                              <option value="Mr">Mr</option>
                              <option value="Ms">Ms</option>
                              <option value="Mrs">Mrs</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-12 col-sm-12 position-relative">
                        <div
                          className="form-group"
                          onMouseEnter={() =>
                            setActiveField({ index, field: "firstNameadt" })
                          }
                          onMouseLeave={() =>
                            setActiveField({ index: null, field: null })
                          }
                        >
                          <label className="form-label float-start fw-bold">
                            First name <span className="text-danger">*</span>
                          </label>

                          <input
                            type="text"
                            name="firstName"
                            className="form-control border-radius"
                            onChange={(e) => {
                              const firstName = e.target.value;

                              const re = /^[a-zA-Z ]*$/;

                              if (re.test(firstName)) {
                                setAdult((ob) =>
                                  produce(ob, (v) => {
                                    v[index].firstName = firstName;
                                  })
                                );
                              } else {
                              }
                            }}
                            value={p.firstName}
                            // onBlur={handleOnChange}

                            required
                            autocomplete="none"
                            spellcheck="false"
                            disabled={p.isDisabled ? true : false}
                            placeholder="first name"
                            style={{
                              borderStartEndRadius: "8px",
                              borderEndEndRadius: "8px",
                            }}
                          />

                          {validityError && <div className="validation"></div>}

                          {p.firstName === "" && (
                            <span
                              className="text-danger"
                              style={{ fontSize: "12px" }}
                            >
                              Please enter first name
                            </span>
                          )}

                          {activeField.index === index &&
                            activeField.field === "firstNameadt" && (
                              <div className="popup-info d-none d-lg-block">
                                <p>Enter as mentioned in your passport</p>

                                <img
                                  src={passportimg}
                                  style={{ height: "auto", width: "100%" }}
                                  alt="passport"
                                />
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12 position-relative">
                        <div
                          className="form-group"
                          onMouseEnter={() =>
                            setActiveField({ index, field: "lastNameadt" })
                          }
                          onMouseLeave={() =>
                            setActiveField({ index: null, field: null })
                          }
                        >
                          <label
                            className="form-label float-start fw-bold"
                            type=""
                          >
                            Last name <span className="text-danger">*</span>
                          </label>

                          <input
                            type="text"
                            name="lastName"
                            className="form-control border-radius"
                            onChange={(e) => {
                              const lastName = e.target.value;

                              const re = /^[a-zA-Z ]*$/;

                              if (re.test(lastName)) {
                                setAdult((ob) =>
                                  produce(ob, (v) => {
                                    v[index].lastName = lastName;
                                  })
                                );
                              } else {
                              }
                            }}
                            value={p.lastName}
                            // onBlur={handleOnChange}

                            required
                            disabled={p.isDisabled ? true : false}
                            autocomplete="none"
                            spellcheck="false"
                            placeholder="last name"
                          />

                          {validityError && <div className="validation"></div>}

                          {p.lastName === "" && (
                            <span
                              className="text-danger"
                              style={{ fontSize: "12px" }}
                            >
                              Please enter last name
                            </span>
                          )}

                          {activeField.index === index &&
                            activeField.field === "lastNameadt" && (
                              <div className="popup-info d-none d-lg-block">
                                <p>Enter as mentioned in your passport</p>

                                <img
                                  src={passportimglast}
                                  style={{ height: "auto", width: "100%" }}
                                  alt="passport"
                                />
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label
                            className="form-label float-start fw-bold"
                            type=""
                          >
                            Gender <span className="text-danger">*</span>
                          </label>

                          <div className="input-group mb-3">
                            <select
                              name="gender"
                              className="form-select border-radius"
                              onChange={(e) => {
                                const gender = e.target.value;

                                setAdult((ob) =>
                                  produce(ob, (v) => {
                                    v[index].gender = gender;
                                  })
                                );
                              }}
                              value={p.gender}
                              required
                              disabled={adult[index].title ? true : false}
                            >
                              <option value="Male">Male</option>

                              <option value="Female">Female</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {domestic(origin, destination) &&
                      domestic(searchData.origin1, searchData.destination1) &&
                      domestic(searchData.origin2, searchData.destination2) &&
                      domestic(searchData.origin3, searchData.destination3) &&
                      domestic(searchData.origin4, searchData.destination4) &&
                      domestic(searchData.origin5, searchData.destination5) ? (
                        <>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                type=""
                              >
                                Frequent flyer number(If any)
                              </label>
                              <input
                                type="text"
                                name="frequentFlyerNumber"
                                className="form-control border-radius"
                                onChange={(e) => {
                                  const frequentFlyerNumber = e.target.value;
                                  setAdult((ob) =>
                                    produce(ob, (v) => {
                                      v[index].frequentFlyerNumber =
                                        frequentFlyerNumber;
                                    })
                                  );
                                }}
                                value={p.frequentFlyerNumber}
                                autocomplete="none"
                                spellcheck="false"
                                placeholder="frequent flyer number"
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor="dateOfBirth"
                              >
                                Date of birth
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-group mb-3">
                                <Box
                                  border="1px solid #ced4da"
                                  w="100%"
                                  h="40px"
                                  pt="8px"
                                  pl="8px"
                                  fontSize="md"
                                  className="border-radius"
                                >
                                  <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={
                                      p.dateOfBirth && new Date(p.dateOfBirth)
                                    }
                                    onChange={(date, e) => {
                                      if (e.target.value?.length === 10) {
                                        // toast.error("Please enter full date")
                                        setAdult((ob) =>
                                          produce(ob, (v) => {
                                            v[index].dateOfBirth = date;
                                          })
                                        );
                                      } else if (
                                        e.target.value?.length === undefined ||
                                        e.target.value?.length === 0
                                      ) {
                                        date !== "" &&
                                          setAdult((ob) =>
                                            produce(ob, (v) => {
                                              v[index].dateOfBirth = date;
                                            })
                                          );
                                      }
                                    }}
                                    placeholderText="dd/mm/yyyy"
                                    // minDate={new Date(dobMinMax?.min)}
                                    maxDate={add(
                                      new Date(
                                        Database?.tripTypeModify ===
                                          "Round Trip" &&
                                        calculateFullAge(
                                          Database?.journeyDate,
                                          Database?.returnDate
                                        )
                                          ? direction0.platingCarrierCode ===
                                            "BS"
                                            ? Database?.journeyDate
                                            : Database?.returnDate
                                          : Database?.tripTypeModify ===
                                            "One Way"
                                          ? Database?.journeyDate
                                          : Database?.destination5 !== ""
                                          ? Database?.inputDateMulti5
                                          : Database?.destination4 !== ""
                                          ? Database?.inputDateMulti4
                                          : Database?.destination3 !== ""
                                          ? Database?.inputDateMulti3
                                          : Database?.destination2 !== ""
                                          ? Database?.inputDateMulti2
                                          : Database?.destination1 !== ""
                                          ? Database?.inputDateMulti1
                                          : Database?.journeyDate
                                      ),
                                      {
                                        years: -12,
                                      }
                                    )}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    onKeyDown={(e) =>
                                      ["-"].includes(e.key) &&
                                      e.preventDefault()
                                    }
                                    minDate={new Date("1900-01-01")}
                                  />
                                </Box>

                                {moment(p.dateOfBirth).isAfter(
                                  ISODateFormatter(
                                    add(
                                      new Date(
                                        Database?.tripTypeModify ===
                                          "Round Trip" &&
                                        calculateFullAge(
                                          Database?.journeyDate,
                                          Database?.returnDate
                                        )
                                          ? direction0.platingCarrierCode ===
                                            "BS"
                                            ? Database?.journeyDate
                                            : Database?.returnDate
                                          : Database?.tripTypeModify ===
                                            "One Way"
                                          ? Database?.journeyDate
                                          : Database?.destination5 !== ""
                                          ? Database?.inputDateMulti5
                                          : Database?.destination4 !== ""
                                          ? Database?.inputDateMulti4
                                          : Database?.destination3 !== ""
                                          ? Database?.inputDateMulti3
                                          : Database?.destination2 !== ""
                                          ? Database?.inputDateMulti2
                                          : Database?.destination1 !== ""
                                          ? Database?.inputDateMulti1
                                          : Database?.journeyDate
                                      ),
                                      { years: -12 }
                                    )
                                  )
                                ) && (
                                  <Text color="red" pl="4px">
                                    Date of birth not valid!{" "}
                                  </Text>
                                )}

                                {validityError && p.dateOfBirth === "" && (
                                  <Text pl="2px" color="red">
                                    Date of birth is required
                                  </Text>
                                )}
                                {validityError && (
                                  <div className="validation"></div>
                                )}
                                {!p.dateOfBirth && (
                                  <span
                                    className="text-danger"
                                    style={{ fontSize: "12px" }}
                                  >
                                    Please enter DOB
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {!airlinesCode.some(
                            (item) => item === direction0.platingCarrierCode
                          ) && (
                            <div className="col-lg-4 col-md-12 col-sm-12">
                              <div className="form-group ml-2">
                                <label
                                  className="form-label float-start fw-bold"
                                  htmlFor=""
                                >
                                  WheelChair (If needed)
                                </label>
                              </div>
                              <div className="input-group mb-3 ml-3">
                                <span className="ms-2">
                                  <span className="me-3">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      name={"wheel" + index}
                                      id={"iswheel" + index}
                                      value="option1"
                                      onClick={(e) => {
                                        setAdult((ob) =>
                                          produce(ob, (v) => {
                                            v[index].IsWheelchair = true;
                                          })
                                        );
                                      }}
                                    />
                                    <label
                                      class="ms-1"
                                      style={{ fontWeight: "400" }}
                                      for={"radio1" + index}
                                    >
                                      Yes
                                    </label>
                                  </span>
                                  <span className="ms-3">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      name={"wheel" + index}
                                      id={"iswheel" + index}
                                      value="option2"
                                      defaultChecked
                                      onClick={(e) => {
                                        setAdult((ob) =>
                                          produce(ob, (v) => {
                                            v[index].IsWheelchair = false;
                                          })
                                        );
                                      }}
                                    />
                                    <label
                                      class="ms-1"
                                      style={{ fontWeight: "400" }}
                                      for={"radio2" + index}
                                    >
                                      No
                                    </label>
                                  </span>
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor="dateOfBirth"
                              >
                                Date of birth
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-group mb-3">
                                <Box
                                  border="1px solid #ced4da"
                                  w="100%"
                                  h="40px"
                                  pt="8px"
                                  pl="8px"
                                  fontSize="md"
                                  className="border-radius"
                                >
                                  <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={
                                      p.dateOfBirth && new Date(p.dateOfBirth)
                                    }
                                    onChange={(date, e) => {
                                      if (e.target.value?.length === 10) {
                                        // toast.error("Please enter full date")
                                        setAdult((ob) =>
                                          produce(ob, (v) => {
                                            v[index].dateOfBirth = date;
                                          })
                                        );
                                      } else if (
                                        e.target.value?.length === undefined ||
                                        e.target.value?.length === 0
                                      ) {
                                        date !== "" &&
                                          setAdult((ob) =>
                                            produce(ob, (v) => {
                                              v[index].dateOfBirth = date;
                                            })
                                          );
                                      }
                                    }}
                                    placeholderText="dd/mm/yyyy"
                                    // minDate={new Date(dobMinMax?.min)}
                                    maxDate={add(
                                      new Date(
                                        Database?.tripTypeModify ===
                                          "Round Trip" &&
                                        calculateFullAge(
                                          Database?.journeyDate,
                                          Database?.returnDate
                                        )
                                          ? direction0.platingCarrierCode ===
                                            "BS"
                                            ? Database?.journeyDate
                                            : Database?.returnDate
                                          : Database?.tripTypeModify ===
                                            "One Way"
                                          ? Database?.journeyDate
                                          : Database?.destination5 !== ""
                                          ? Database?.inputDateMulti5
                                          : Database?.destination4 !== ""
                                          ? Database?.inputDateMulti4
                                          : Database?.destination3 !== ""
                                          ? Database?.inputDateMulti3
                                          : Database?.destination2 !== ""
                                          ? Database?.inputDateMulti2
                                          : Database?.destination1 !== ""
                                          ? Database?.inputDateMulti1
                                          : Database?.journeyDate
                                      ),
                                      {
                                        years: -12,
                                      }
                                    )}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    onKeyDown={(e) =>
                                      ["-"].includes(e.key) &&
                                      e.preventDefault()
                                    }
                                    minDate={new Date("1900-01-01")}
                                  />
                                </Box>

                                {moment(p.dateOfBirth).isAfter(
                                  ISODateFormatter(
                                    add(
                                      new Date(
                                        Database?.tripTypeModify ===
                                          "Round Trip" &&
                                        calculateFullAge(
                                          Database?.journeyDate,
                                          Database?.returnDate
                                        )
                                          ? direction0.platingCarrierCode ===
                                            "BS"
                                            ? Database?.journeyDate
                                            : Database?.returnDate
                                          : Database?.tripTypeModify ===
                                            "One Way"
                                          ? Database?.journeyDate
                                          : Database?.destination5 !== ""
                                          ? Database?.inputDateMulti5
                                          : Database?.destination4 !== ""
                                          ? Database?.inputDateMulti4
                                          : Database?.destination3 !== ""
                                          ? Database?.inputDateMulti3
                                          : Database?.destination2 !== ""
                                          ? Database?.inputDateMulti2
                                          : Database?.destination1 !== ""
                                          ? Database?.inputDateMulti1
                                          : Database?.journeyDate
                                      ),
                                      { years: -12 }
                                    )
                                  )
                                ) && (
                                  <Text color="red" pl="4px">
                                    Date of birth not valid!{" "}
                                  </Text>
                                )}

                                {validityError && p.dateOfBirth === "" && (
                                  <Text pl="2px" color="red">
                                    Date of birth is required
                                  </Text>
                                )}
                                {validityError && (
                                  <div className="validation"></div>
                                )}
                                {!p.dateOfBirth && (
                                  <span
                                    className="text-danger"
                                    style={{ fontSize: "12px" }}
                                  >
                                    Please enter DOB
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                type=""
                              >
                                Nationality{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-group mb-3">
                                <select
                                  name="nationality"
                                  className="form-select border-radius"
                                  required
                                  onChange={(e) => {
                                    const nationality = e.target.value;
                                    setAdult((ob) =>
                                      produce(ob, (v) => {
                                        v[index].nationality = nationality;
                                        v[index].countryCode = nationality;
                                      })
                                    );
                                  }}
                                  value={p.nationality}
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

                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                type=""
                              >
                                Frequent flyer number(If any)
                              </label>
                              <input
                                type="text"
                                name="frequentFlyerNumber"
                                className="form-control border-radius"
                                onChange={(e) => {
                                  const frequentFlyerNumber = e.target.value;
                                  setAdult((ob) =>
                                    produce(ob, (v) => {
                                      v[index].frequentFlyerNumber =
                                        frequentFlyerNumber;
                                    })
                                  );
                                }}
                                value={p.frequentFlyerNumber}
                                autocomplete="none"
                                spellcheck="false"
                                placeholder="frequent flyer number"
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Passport number{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control border-radius"
                                name="passport-number"
                                required
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const passportNumber = e.target.value;
                                    const re = /^[0-9a-zA-Z]+$/;
                                    if (re.test(passportNumber)) {
                                      setAdult((ob) =>
                                        produce(ob, (v) => {
                                          v[index].passportNumber =
                                            passportNumber;
                                        })
                                      );
                                    }
                                  } else {
                                    setAdult((ob) =>
                                      produce(ob, (v) => {
                                        v[index].passportNumber = "";
                                      })
                                    );
                                  }
                                }}
                                value={p.passportNumber}
                                autocomplete="none"
                                spellcheck="false"
                                placeholder="passport number"
                              />
                              {validityError && (
                                <div className="validation"></div>
                              )}
                              {p.passportNumber === "" && (
                                <span
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  Please enter passport number
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Issuing country{" "}
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <select
                                className="form-select border-radius"
                                onChange={(e) => {
                                  const issuingCountry = e.target.value;
                                  setAdult((ob) =>
                                    produce(ob, (v) => {
                                      v[index].issuingCountry = issuingCountry;
                                    })
                                  );
                                }}
                                value={p.issuingCountry}
                                required
                              >
                                <option value="BD">Bangladesh</option>
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
                          <div className="col-lg-4 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor="pasDate"
                              >
                                Passport Expiry Date{" "}
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <Box
                                border="1px solid #ced4da"
                                w="100%"
                                h="40px"
                                pt="8px"
                                pl="8px"
                                fontSize="md"
                                className="border-radius"
                              >
                                <DatePicker
                                  dateFormat="dd/MM/yyyy"
                                  selected={
                                    p.passportExDate &&
                                    new Date(ISODateFormatter(p.passportExDate))
                                  }
                                  onChange={(date) =>
                                    date !== "" &&
                                    setAdult((ob) =>
                                      produce(ob, (v) => {
                                        v[index].passportExDate = date;
                                      })
                                    )
                                  }
                                  placeholderText="dd/mm/yyyy"
                                  minDate={
                                    add(
                                      new Date(
                                        Object.keys(direction5).length
                                          ? direction5?.segments[
                                              direction5?.segments?.length - 1
                                            ].departure
                                          : Object.keys(direction4).length
                                          ? direction4?.segments[
                                              direction4?.segments?.length - 1
                                            ].departure
                                          : Object.keys(direction3).length
                                          ? direction3?.segments[
                                              direction3?.segments?.length - 1
                                            ].departure
                                          : Object.keys(direction2).length
                                          ? direction2?.segments[
                                              direction2?.segments?.length - 1
                                            ].departure
                                          : Object.keys(direction1).length
                                          ? direction1?.segments[
                                              direction1?.segments?.length - 1
                                            ].departure
                                          : Object.keys(direction0).length &&
                                            direction0?.segments[
                                              direction0?.segments?.length - 1
                                            ].departure
                                      ),
                                      { months: 2 }
                                    )
                                    // new Date()
                                  }
                                  maxDate={new Date("2199-12-30")}
                                  error
                                  helperText="Your error message"
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  onKeyDown={(e) =>
                                    ["-"].includes(e.key) && e.preventDefault()
                                  }
                                />
                              </Box>
                              {validityError &&
                                p.passportExDate ===
                                  ""(
                                    <Text pl="2px" color="red">
                                      Passport expiry date is required
                                    </Text>
                                  )}

                              {moment(p?.passportExDate).isBefore(
                                ISODateFormatter(
                                  add(
                                    new Date(
                                      Object.keys(direction5).length
                                        ? direction5?.segments[
                                            direction5?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction4).length
                                        ? direction4?.segments[
                                            direction4?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction3).length
                                        ? direction3?.segments[
                                            direction3?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction2).length
                                        ? direction2?.segments[
                                            direction2?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction1).length
                                        ? direction1?.segments[
                                            direction1?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction0).length &&
                                          direction0?.segments[
                                            direction0?.segments?.length - 1
                                          ].departure
                                    ),
                                    { months: 2 }
                                  )
                                )
                              ) && (
                                <Text color="red" pl="4px">
                                  Your passport expiry date is less than 2
                                  months{" "}
                                </Text>
                              )}

                              {validityError && (
                                <div className="validation"></div>
                              )}
                              {!p.passportExDate && (
                                <span
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  Please enter passport expiry date
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      <>
                        {domestic(origin, destination) &&
                        domestic(searchData.origin1, searchData.destination1) &&
                        domestic(searchData.origin2, searchData.destination2) &&
                        domestic(searchData.origin3, searchData.destination3) &&
                        domestic(searchData.origin4, searchData.destination4) &&
                        domestic(
                          searchData.origin5,
                          searchData.destination5
                        ) ? (
                          <></>
                        ) : (
                          <>
                            <div className="col-lg-4 col-md-12 col-sm-12">
                              <div className="form-group">
                                <label
                                  className="form-label float-start fw-bold"
                                  htmlFor=""
                                >
                                  Passport Copy{" "}
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                              </div>
                              <div className="input-group">
                                <input
                                  type={"file"}
                                  className={
                                    p.showPassportCopy
                                      ? "form-control mr-1 border-radius"
                                      : "form-control border-radius"
                                  }
                                  id={"adultpassport" + index}
                                  accept=".jpg, .jpeg, .png, .pdf"
                                  onChange={(e) =>
                                    handlePassportFileUpload(
                                      1,
                                      index,
                                      e.target.files[0],
                                      p.passportNumber
                                    )
                                  }
                                  // required
                                  disabled={
                                    p.passportNumber === "" ? true : false
                                  }
                                />
                                {/* {p.showPassportCopy && (
                                  <img
                                    src={p.showPassportCopy}
                                    alt="Uploaded"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      boxShadow:
                                        "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                    }}
                                  />
                                )}
                                {p.passportCopy && !p.showPassportCopy && (
                                  <img
                                    src={
                                      environment.s3URL + `${p.passportCopy}`
                                    }
                                    alt="Uploaded"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      boxShadow:
                                        "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                    }}
                                  />
                                )} */}
                                {adult[index].progress > 0 && (
                                  <div className="progress-container mt-1">
                                    <div
                                      className="progress-bar"
                                      style={{
                                        width: `${adult[index].progress}%`,
                                      }}
                                    >
                                      {/* <span className="progress-text">{progress}%</span> */}
                                    </div>
                                  </div>
                                )}
                              </div>
                              {p.passportNumber === "" && (
                                <span
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  Please enter passport number first
                                </span>
                              )}
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
                            <div className="input-group ">
                             
                                <input
                                 type={"file"}
                                   className={
                                    p.showvisaCopy
                                      ? "form-control mr-1 border-radius"
                                      : "form-control border-radius"
                                  }
                                  // id="customFile"
                                  id={"adultVisa" + index}
                                 
                                  accept=".jpg, .jpeg, .png, .pdf"
                                  onChange={(e) =>
                                    handleVisaFileUpload(
                                      1,
                                      index,
                                      e.target.files[0],
                                      p.passportNumber
                                    )
                                  }
                                  disabled={
                                    p.passportNumber === "" ? true : false
                                  }
                                />
                             

                             {/* {p.showvisaCopy && (
                                  <img
                                    src={p.showvisaCopy}
                                    alt="Uploaded"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      boxShadow:
                                        "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                    }}
                                  />
                                )}
                                {p.visaCopy && !p.showvisaCopy && (
                                  <img
                                    src={
                                      environment.s3URL + `${p.visaCopy}`
                                    }
                                    alt="Uploaded"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      boxShadow:
                                        "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                    }}
                                  />
                                )} */}

                              {adult[index].visaProgress > 0 && (
                                  <div className="progress-container mt-1">
                                    <div
                                      className="progress-bar"
                                      style={{
                                        width: `${adult[index].visaProgress}%`,
                                      }}
                                    >
                                      {/* <span className="progress-text">{progress}%</span> */}
                                    </div>
                                  </div>
                                )}
                            </div>
                            {p.passportNumber === "" && (
                              <span
                                className="text-danger"
                                style={{ fontSize: "12px" }}
                              >
                                Please enter passport number first
                              </span>
                            )}
                          </div>


                            {extraServicesLoader ? (
                              <div className="col-lg-4 col-md-12 col-sm-12 d-flex align-items-center justify-content-center w-100">
                                <div class="spinner-border" role="status">
                                  <span class="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                              </div>
                            ) : (
                              hasExtraService &&
                              extraBaggageAllowedPTC.some(
                                (item) => item === "ADT"
                              ) &&
                              fullObj?.directions?.map((direction, idx) => (
                                <div
                                  className="col-lg-4 col-md-12 col-sm-12"
                                  key={idx}
                                >
                                  <div className="form-group">
                                    <label
                                      className="form-label float-start fw-bold"
                                      type=""
                                    >
                                      {direction[0]?.from} - {direction[0]?.to}{" "}
                                      (Add Extra Baggage)
                                    </label>
                                    <div className="input-group mb-3">
                                      <select
                                        name="nationality"
                                        className="form-select border-radius"
                                        // required
                                        onChange={(e) => {
                                          if (e.target.value === "select") {
                                            setAdult((ob) =>
                                              produce(ob, (v) => {
                                                v[index].aCMExtraServices[idx] =
                                                  [];
                                              })
                                            );
                                          } else {
                                            setAdult((ob) =>
                                              produce(ob, (v) => {
                                                v[index].aCMExtraServices[idx] =
                                                  [JSON.parse(e.target.value)];
                                              })
                                            );
                                          }
                                        }}
                                      >
                                        <option value={"select"}>Select</option>
                                        {extraServices[0]?.map((item, idx) => (
                                          <option
                                            value={JSON.stringify(item)}
                                            key={idx}
                                          >
                                            {item.name} {item.price}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                            {!airlinesCode.some(
                              (item) => item === direction0.platingCarrierCode
                            ) && (
                              <div className="col-lg-4 col-md-12 col-sm-12">
                                <div className="form-group ml-2">
                                  <label
                                    className="form-label float-start fw-bold"
                                    htmlFor=""
                                  >
                                    WheelChair (If needed)
                                  </label>
                                </div>
                                <div className="input-group mb-3 ml-3">
                                  <span className="ms-2">
                                    <span className="me-3">
                                      <input
                                        class="form-check-input"
                                        type="radio"
                                        name={"wheel" + index}
                                        id={"iswheel" + index}
                                        value="option1"
                                        onClick={(e) => {
                                          setAdult((ob) =>
                                            produce(ob, (v) => {
                                              v[index].IsWheelchair = true;
                                            })
                                          );
                                        }}
                                      />
                                      <label
                                        class="ms-1"
                                        style={{ fontWeight: "400" }}
                                        for={"radio1" + index}
                                      >
                                        Yes
                                      </label>
                                    </span>
                                    <span className="ms-3">
                                      <input
                                        class="form-check-input"
                                        type="radio"
                                        name={"wheel" + index}
                                        id={"iswheel" + index}
                                        value="option2"
                                        defaultChecked
                                        onClick={(e) => {
                                          setAdult((ob) =>
                                            produce(ob, (v) => {
                                              v[index].IsWheelchair = false;
                                            })
                                          );
                                        }}
                                      />
                                      <label
                                        class="ms-1"
                                        style={{ fontWeight: "400" }}
                                        for={"radio2" + index}
                                      >
                                        No
                                      </label>
                                    </span>
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>

                      {!p.isDisabled && (
                        <div className="col-lg-12">
                          <div class="form-check ">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              style={{ cursor: "pointer" }}
                              id={"defaultAdult" + index}
                              onChange={(e) => {
                                setAdult((ob) =>
                                  produce(ob, (v) => {
                                    v[index].isQuickPassenger =
                                      e.target.checked;
                                  })
                                );
                              }}
                            />
                            <label
                              class="form-check-label fw-bold align-middle"
                              for={"defaultAdult" + index}
                            >
                              Add this person to passenger quick pick list
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {child.map((p, index) => {
                return (
                  <div key={index} className="border p-2 my-3">
                    <div className="row">
                      <h3 className="form-label fw-bold">
                        <span>Child ({index + 1})</span>{" "}
                        {sameName &&
                          sameName?.map((item) =>
                            item?.indices?.map(
                              (item) =>
                                item.type === p.type.toUpperCase() &&
                                item.index === index && (
                                  <span
                                    className="text-danger ps-2"
                                    style={{ fontSize: "10px" }}
                                  >
                                    Name sould be different
                                  </span>
                                )
                            )
                          )}
                      </h3>
                      <div className="col-lg-12 my-2">
                        <Select
                          isClearable={true}
                          options={
                            2 <= childAgeList[index].age &&
                            childAgeList[index].age < 5
                              ? passengerCNNList.map((item) => ({
                                  label:
                                    item.title +
                                    " " +
                                    item.first +
                                    " " +
                                    item.middle +
                                    " " +
                                    item.last,
                                  value: item.id,
                                }))
                              : passengerCHDList.map((item) => ({
                                  label:
                                    item.title +
                                    " " +
                                    item.first +
                                    " " +
                                    item.middle +
                                    " " +
                                    item.last,
                                  value: item.id,
                                }))
                          }
                          onChange={(e) => {
                            if (e == null) {
                              clearPassPortImage(2, index); 
                              clearVisaCopyImage(2, index);
                              setChild((ob) =>
                                produce(ob, (v) => {
                                  v[index].title = "";
                                  v[index].firstName = "";
                                  v[index].middleName = "";
                                  v[index].lastName = "";
                                  v[index].dateOfBirth = "";
                                  v[index].nationality =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : "BD";
                                  v[index].passportNumber = "";
                                  v[index].issuingCountry =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : "BD";
                                  // v[index].passportDate = "";
                                  // v[index].passportMonth = "";
                                  // v[index].passportYear = "";
                                  v[index].passportExDate = "";
                                  v[index].gender = "Male";
                                  v[index].phoneNumber = "";
                                  v[index].passportCopy = "";
                                  v[index].visaCopy = "";
                                  v[index].isDisabled = false;
                                  v[index].isQuickPassenger = false;
                                })
                              );
                              return;
                            }
                            const id = Number(e.value);

                            const item =
                              2 <= childAgeList[index].age &&
                              childAgeList[index].age < 5
                                ? passengerCNNList.find((f) => f.id === id)
                                : passengerCHDList.find((f) => f.id === id);
                            if (item !== undefined) {
                              setChild((ob) =>
                                produce(ob, (v) => {
                                  v[index].title = item.title;
                                  v[index].firstName = item.first;
                                  v[index].middleName = item.middle;
                                  v[index].lastName = item.last;
                                  v[index].dateOfBirth = ISODateFormatter(
                                    item?.dateOfBirth
                                  );
                                  v[index].nationality =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : item.nationality;
                                  v[index].passportNumber =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : item.documentNumber;
                                  v[index].issuingCountry =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : item.documentIssuingCountry !== null &&
                                        item.documentIssuingCountry !== ""
                                      ? item.documentIssuingCountry
                                      : "BD";
                                  v[index].passportExDate =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : ISODateFormatter(item?.expireDate);
                                  v[index].gender = item.gender;
                                  v[index].phoneNumber = item.phone;
                                  v[index].passportCopy = item.passportCopy;
                                  v[index].visaCopy = item.visaCopy;
                                  v[index].showvisaCopy = "";
                                  v[index].showPassportCopy = "";
                                  v[index].isDisabled = true;
                                  v[index].isQuickPassenger = false;
                                })
                              );
                            } else {
                              setChild((ob) =>
                                produce(ob, (v) => {
                                  v[index].title = "";
                                  v[index].firstName = "";
                                  v[index].middleName = "";
                                  v[index].lastName = "";
                                  v[index].dateOfBirth = "";
                                  v[index].nationality = "BD";
                                  v[index].passportNumber = "";
                                  v[index].issuingCountry = "";
                                  v[index].passportExDate = "";
                                  v[index].gender = "Male";
                                  v[index].phoneNumber = "";
                                  v[index].passportCopy = "";
                                  v[index].visaCopy = "";
                                  v[index].isDisabled = false;
                                  v[index].isQuickPassenger = false;
                                })
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label
                            className="form-label float-start fw-bold"
                            type=""
                          >
                            Title
                          </label>

                          <div className="input-group mb-3">
                            <select
                              name="title"
                              className="form-select border-radius"
                              onChange={(e) => {
                                const title = e.target.value;

                                setChild((ob) =>
                                  produce(ob, (v) => {
                                    v[index].title = title;
                                  })
                                );

                                setChild((ob) =>
                                  produce(ob, (v) => {
                                    v[index].gender =
                                      title === "Mstr" ? "Male" : "Female";
                                  })
                                );
                              }}
                              value={p.title}
                              required
                            >
                              <option value="">Select</option>

                              <option value="Mstr">Mstr</option>

                              <option value="Miss">Miss</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12 position-relative">
                        <div
                          className="form-group"
                          onMouseEnter={() =>
                            setActiveFieldforChild({
                              index,

                              field: "firstNamechd",
                            })
                          }
                          onMouseLeave={() =>
                            setActiveFieldforChild({
                              index: null,

                              field: null,
                            })
                          }
                        >
                          <label className="form-label float-start fw-bold">
                            First name <span className="text-danger">*</span>
                          </label>

                          <input
                            type="text"
                            name="firstName"
                            className="form-control border-radius"
                            onChange={(e) => {
                              const firstName = e.target.value;

                              const re = /^[a-zA-Z ]*$/;

                              if (re.test(firstName)) {
                                setChild((ob) =>
                                  produce(ob, (v) => {
                                    v[index].firstName = firstName;
                                  })
                                );
                              } else {
                              }
                            }}
                            value={p.firstName}
                            required
                            disabled={p.isDisabled ? true : false}
                            autocomplete="none"
                            spellcheck="false"
                            placeholder="first name"
                          />

                          {validityError && <div className="validation"></div>}

                          {p.firstName === "" && (
                            <span
                              className="text-danger"
                              style={{ fontSize: "12px" }}
                            >
                              Please enter first name
                            </span>
                          )}

                          {activeFieldforChild.index === index &&
                            activeFieldforChild.field === "firstNamechd" && (
                              <div className="popup-info d-none d-lg-block">
                                <p>Enter as mentioned in your passport</p>

                                <img
                                  src={passportimg}
                                  style={{ height: "auto", width: "100%" }}
                                  alt="passport"
                                />
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12 position-relative">
                        <div
                          className="form-group"
                          onMouseEnter={() =>
                            setActiveFieldforChild({
                              index,

                              field: "lastNamechd",
                            })
                          }
                          onMouseLeave={() =>
                            setActiveFieldforChild({
                              index: null,

                              field: null,
                            })
                          }
                        >
                          <label className="form-label float-start fw-bold">
                            Last name <span className="text-danger">*</span>
                          </label>

                          <input
                            type="text"
                            name="lastName"
                            className="form-control border-radius"
                            onChange={(e) => {
                              const lastName = e.target.value;

                              const re = /^[a-zA-Z ]*$/;

                              if (re.test(lastName)) {
                                setChild((ob) =>
                                  produce(ob, (v) => {
                                    v[index].lastName = lastName;
                                  })
                                );
                              } else {
                              }
                            }}
                            value={p.lastName}
                            required
                            disabled={p.isDisabled ? true : false}
                            autocomplete="none"
                            spellcheck="false"
                            placeholder="last name"
                          />

                          {validityError && <div className="validation"></div>}

                          {p.lastName === "" && (
                            <span
                              className="text-danger"
                              style={{ fontSize: "12px" }}
                            >
                              Please enter last name
                            </span>
                          )}

                          {activeFieldforChild.index === index &&
                            activeFieldforChild.field === "lastNamechd" && (
                              <div className="popup-info d-none d-lg-block">
                                <p>Enter as mentioned in your passport</p>

                                <img
                                  src={passportimglast}
                                  style={{ height: "auto", width: "100%" }}
                                  alt="passport"
                                />
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12">
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
                              onChange={(e) => {
                                const gender = e.target.value;

                                setChild((ob) =>
                                  produce(ob, (v) => {
                                    v[index].gender = gender;
                                  })
                                );
                              }}
                              value={p.gender}
                              required
                              disabled={child[index].title ? true : false}
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label
                            className="form-label float-start fw-bold"
                            type=""
                          >
                            Date of birth
                            <span className="text-danger">*</span>
                          </label>
                          <div className="input-group mb-3">
                            <Box
                              border="1px solid #ced4da"
                              w="100%"
                              h="40px"
                              pt="8px"
                              pl="8px"
                              fontSize="md"
                              className="border-radius"
                            >
                              <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={
                                  p.dateOfBirth && new Date(p.dateOfBirth)
                                }
                                onChange={(date, e) => {
                                  if (e.target.value?.length === 10) {
                                    setChild((ob) =>
                                      produce(ob, (v) => {
                                        v[index].dateOfBirth = date;
                                      })
                                    );
                                  } else if (
                                    e.target.value?.length === undefined ||
                                    e.target.value?.length === 0
                                  ) {
                                    date !== "" &&
                                      setChild((ob) =>
                                        produce(ob, (v) => {
                                          v[index].dateOfBirth = date;
                                        })
                                      );
                                  }
                                }}
                                placeholderText="dd/mm/yyyy"
                                minDate={add(
                                  new Date(
                                    Database?.tripTypeModify === "Round Trip" &&
                                    calculateFullAge(
                                      Database?.journeyDate,
                                      Database?.returnDate
                                    )
                                      ? direction0.platingCarrierCode === "BS"
                                        ? Database?.journeyDate
                                        : Database?.returnDate
                                      : Database?.tripTypeModify === "One Way"
                                      ? Database?.journeyDate
                                      : Database?.destination5 !== ""
                                      ? Database?.inputDateMulti5
                                      : Database?.destination4 !== ""
                                      ? Database?.inputDateMulti4
                                      : Database?.destination3 !== ""
                                      ? Database?.inputDateMulti3
                                      : Database?.destination2 !== ""
                                      ? Database?.inputDateMulti2
                                      : Database?.destination1 !== ""
                                      ? Database?.inputDateMulti1
                                      : Database?.journeyDate
                                  ),
                                  {
                                    years:
                                      2 <= childAgeList[index].age &&
                                      childAgeList[index].age < 5
                                        ? -5
                                        : -12,
                                    days: 1,
                                  }
                                )}
                                maxDate={add(
                                  new Date(
                                    Database?.tripTypeModify === "Round Trip" &&
                                    calculateFullAge(
                                      Database?.journeyDate,
                                      Database?.returnDate
                                    )
                                      ? direction0.platingCarrierCode === "BS"
                                        ? Database?.journeyDate
                                        : Database?.returnDate
                                      : Database?.tripTypeModify === "One Way"
                                      ? Database?.journeyDate
                                      : Database?.destination5 !== ""
                                      ? Database?.inputDateMulti5
                                      : Database?.destination4 !== ""
                                      ? Database?.inputDateMulti4
                                      : Database?.destination3 !== ""
                                      ? Database?.inputDateMulti3
                                      : Database?.destination2 !== ""
                                      ? Database?.inputDateMulti2
                                      : Database?.destination1 !== ""
                                      ? Database?.inputDateMulti1
                                      : Database?.journeyDate
                                  ),
                                  {
                                    years:
                                      2 <= childAgeList[index].age &&
                                      childAgeList[index].age < 5
                                        ? -2
                                        : -5,
                                  }
                                )}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                onKeyDown={(e) =>
                                  ["-"].includes(e.key) && e.preventDefault()
                                }
                              />
                            </Box>

                            {moment(p.dateOfBirth).isBefore(
                              ISODateFormatter(
                                add(
                                  new Date(
                                    Database?.tripTypeModify === "Round Trip" &&
                                    calculateFullAge(
                                      Database?.journeyDate,
                                      Database?.returnDate
                                    )
                                      ? direction0.platingCarrierCode === "BS"
                                        ? Database?.journeyDate
                                        : Database?.returnDate
                                      : Database?.tripTypeModify === "One Way"
                                      ? Database?.journeyDate
                                      : Database?.destination5 !== ""
                                      ? Database?.inputDateMulti5
                                      : Database?.destination4 !== ""
                                      ? Database?.inputDateMulti4
                                      : Database?.destination3 !== ""
                                      ? Database?.inputDateMulti3
                                      : Database?.destination2 !== ""
                                      ? Database?.inputDateMulti2
                                      : Database?.destination1 !== ""
                                      ? Database?.inputDateMulti1
                                      : Database?.journeyDate
                                  ),
                                  {
                                    years:
                                      2 <= childAgeList[index].age &&
                                      childAgeList[index].age < 5
                                        ? -5
                                        : -12,
                                  }
                                )
                              )
                            ) && (
                              <Text color="red" pl="4px">
                                Date of birth not valid!{" "}
                              </Text>
                            )}

                            {moment(p.dateOfBirth).isAfter(
                              ISODateFormatter(
                                add(
                                  new Date(
                                    Database?.tripTypeModify === "Round Trip" &&
                                    calculateFullAge(
                                      Database?.journeyDate,
                                      Database?.returnDate
                                    )
                                      ? direction0.platingCarrierCode === "BS"
                                        ? Database?.journeyDate
                                        : Database?.returnDate
                                      : Database?.tripTypeModify === "One Way"
                                      ? Database?.journeyDate
                                      : Database?.destination5 !== ""
                                      ? Database?.inputDateMulti5
                                      : Database?.destination4 !== ""
                                      ? Database?.inputDateMulti4
                                      : Database?.destination3 !== ""
                                      ? Database?.inputDateMulti3
                                      : Database?.destination2 !== ""
                                      ? Database?.inputDateMulti2
                                      : Database?.destination1 !== ""
                                      ? Database?.inputDateMulti1
                                      : Database?.journeyDate
                                  ),
                                  {
                                    years:
                                      2 <= childAgeList[index].age &&
                                      childAgeList[index].age < 5
                                        ? -2
                                        : -5,
                                  }
                                )
                              )
                            ) && (
                              <Text color="red" pl="4px">
                                Date of birth not valid!{" "}
                              </Text>
                            )}

                            {validityError && p.dateOfBirth === "" && (
                              <Text pl="2px" color="red">
                                Date of birth is required
                              </Text>
                            )}
                            {validityError && (
                              <div className="validation"></div>
                            )}
                            {!p.dateOfBirth && (
                              <span
                                className="text-danger"
                                style={{ fontSize: "12px" }}
                              >
                                Please enter DOB
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label
                            className="form-label float-start fw-bold"
                            type=""
                          >
                            Frequent flyer number(If any)
                          </label>
                          <input
                            type="text"
                            name="frequentFlyerNumber"
                            className="form-control border-radius"
                            onChange={(e) => {
                              const frequentFlyerNumber = e.target.value;
                              setChild((ob) =>
                                produce(ob, (v) => {
                                  v[index].frequentFlyerNumber =
                                    frequentFlyerNumber;
                                })
                              );
                            }}
                            value={p.frequentFlyerNumber}
                            autocomplete="none"
                            spellcheck="false"
                            placeholder="frequent flyer number"
                          />
                        </div>
                      </div>
                      {domestic(origin, destination) &&
                      domestic(searchData.origin1, searchData.destination1) &&
                      domestic(searchData.origin2, searchData.destination2) &&
                      domestic(searchData.origin3, searchData.destination3) &&
                      domestic(searchData.origin4, searchData.destination4) &&
                      domestic(searchData.origin5, searchData.destination5) ? (
                        <></>
                      ) : (
                        <>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                type=""
                              >
                                Nationality
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-group mb-3">
                                <select
                                  name="nationality"
                                  className="form-select border-radius"
                                  onChange={(e) => {
                                    const nationality = e.target.value;
                                    setChild((ob) =>
                                      produce(ob, (v) => {
                                        v[index].nationality = nationality;
                                        v[index].countryCode = nationality;
                                      })
                                    );
                                  }}
                                  value={p.nationality}
                                  required
                                >
                                  <option value="BD">Bangladesh</option>
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
                        </>
                      )}

                      {domestic(origin, destination) &&
                      domestic(searchData.origin1, searchData.destination1) &&
                      domestic(searchData.origin2, searchData.destination2) &&
                      domestic(searchData.origin3, searchData.destination3) &&
                      domestic(searchData.origin4, searchData.destination4) &&
                      domestic(searchData.origin5, searchData.destination5) ? (
                        <></>
                      ) : (
                        <>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Passport number{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control border-radius"
                                name="passport-number"
                                required
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const passportNumber = e.target.value;
                                    const re = /^[0-9a-zA-Z]+$/;
                                    if (re.test(passportNumber)) {
                                      setChild((ob) =>
                                        produce(ob, (v) => {
                                          v[index].passportNumber =
                                            passportNumber;
                                        })
                                      );
                                    }
                                  } else {
                                    setChild((ob) =>
                                      produce(ob, (v) => {
                                        v[index].passportNumber = "";
                                      })
                                    );
                                  }
                                }}
                                value={p.passportNumber}
                                autocomplete="none"
                                spellcheck="false"
                                placeholder="passport number"
                              />
                              {validityError && (
                                <div className="validation"></div>
                              )}
                              {p.passportNumber === "" && (
                                <span
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  Please enter passport number
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Issuing country{" "}
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <select
                                className="form-select border-radius"
                                onChange={(e) => {
                                  const issuingCountry = e.target.value;
                                  setChild((ob) =>
                                    produce(ob, (v) => {
                                      v[index].issuingCountry = issuingCountry;
                                    })
                                  );
                                }}
                                value={p.issuingCountry}
                                required
                              >
                                <option value="BD">Bangladesh</option>
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
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Passport Expiry Date{" "}
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <Box
                                border="1px solid #ced4da"
                                w="100%"
                                h="40px"
                                pt="8px"
                                pl="8px"
                                fontSize="md"
                                className="border-radius"
                              >
                                <DatePicker
                                  dateFormat="dd/MM/yyyy"
                                  selected={
                                    p.passportExDate &&
                                    new Date(ISODateFormatter(p.passportExDate))
                                  }
                                  onChange={(date) =>
                                    date !== "" &&
                                    setChild((ob) =>
                                      produce(ob, (v) => {
                                        v[index].passportExDate = date;
                                      })
                                    )
                                  }
                                  placeholderText="dd/mm/yyyy"
                                  // minDate={new Date()}
                                  minDate={add(
                                    new Date(
                                      Object.keys(direction5).length
                                        ? direction5?.segments[
                                            direction5?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction4).length
                                        ? direction4?.segments[
                                            direction4?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction3).length
                                        ? direction3?.segments[
                                            direction3?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction2).length
                                        ? direction2?.segments[
                                            direction2?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction1).length
                                        ? direction1?.segments[
                                            direction1?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction0).length &&
                                          direction0?.segments[
                                            direction0?.segments?.length - 1
                                          ].departure
                                    ),
                                    { months: 2 }
                                  )}
                                  maxDate={new Date("2199-12-30")}
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  onKeyDown={(e) =>
                                    ["-"].includes(e.key) && e.preventDefault()
                                  }
                                />
                              </Box>

                              {validityError && p.passportExDate === "" && (
                                <Text pl="2px" color="red">
                                  Passport expiry date is required
                                </Text>
                              )}

                              {/* CHECK THIS AGAIN IN BOOK NOW VALIDATION */}
                              {/* {moment(p?.passportExDate).isBefore(
                                ISODateFormatter(add(new Date(), { months: 0 }))
                              ) && (
                                  <Text color="red" pl="4px">
                                    Expiry Date not valid!{" "}
                                  </Text>
                                )} */}
                              {moment(p?.passportExDate).isBefore(
                                ISODateFormatter(
                                  add(
                                    new Date(
                                      Object.keys(direction5).length
                                        ? direction5?.segments[
                                            direction5?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction4).length
                                        ? direction4?.segments[
                                            direction4?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction3).length
                                        ? direction3?.segments[
                                            direction3?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction2).length
                                        ? direction2?.segments[
                                            direction2?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction1).length
                                        ? direction1?.segments[
                                            direction1?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction0).length &&
                                          direction0?.segments[
                                            direction0?.segments?.length - 1
                                          ].departure
                                    ),
                                    { months: 2 }
                                  )
                                )
                              ) && (
                                <Text color="red" pl="4px">
                                  Your passport expiry date is less than 2
                                  months{" "}
                                </Text>
                              )}

                              {validityError && (
                                <div className="validation"></div>
                              )}
                              {!p.passportExDate && (
                                <span
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  Please enter passport expiry date
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {domestic(origin, destination) &&
                      domestic(searchData.origin1, searchData.destination1) &&
                      domestic(searchData.origin2, searchData.destination2) &&
                      domestic(searchData.origin3, searchData.destination3) &&
                      domestic(searchData.origin4, searchData.destination4) &&
                      domestic(searchData.origin5, searchData.destination5) ? (
                        <></>
                      ) : (
                        <>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Passport Copy{" "}
                                {/* <span className="text-danger">*</span> */}
                              </label>
                            </div>
                            <div className="input-group">
                              <input
                                type={"file"}
                                className={
                                  p.showPassportCopy
                                    ? "form-control mr-1 border-radius"
                                    : "form-control border-radius"
                                }
                                id={"childpassport" + index}
                                accept=".jpg, .jpeg, .png, .pdf"
                                onChange={(e) =>
                                  handlePassportFileUpload(
                                    2,
                                    index,
                                    e.target.files[0],
                                    p.passportNumber
                                  )
                                }
                                // required
                                disabled={
                                  p.passportNumber === "" ? true : false
                                }
                              />

                              {/* {p.showPassportCopy && (
                                <img
                                  src={p.showPassportCopy}
                                  alt="Uploaded"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    boxShadow:
                                      "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                  }}
                                />
                              )}

                              {p.passportCopy && !p.showPassportCopy && (
                                <img
                                  src={environment.s3URL + `${p.passportCopy}`}
                                  alt="Uploaded"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    boxShadow:
                                      "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                  }}
                                />
                              )} */}
                              {child[index].progress > 0 && (
                                <div className="progress-container mt-1">
                                  <div
                                    className="progress-bar"
                                    style={{
                                      width: `${child[index].progress}%`,
                                    }}
                                  >
                                    {/* <span className="progress-text">{progress}%</span> */}
                                  </div>
                                </div>
                              )}
                            </div>
                            {p.passportNumber === "" && (
                              <span
                                className="text-danger"
                                style={{ fontSize: "12px" }}
                              >
                                Please enter passport number first
                              </span>
                            )}
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
                            <div className="input-group ">
                             
                                <input
                                 type={"file"}
                                   className={
                                    p.showvisaCopy
                                      ? "form-control mr-1 border-radius"
                                      : "form-control border-radius"
                                  }
                                  // id="customFile"
                                  id={"childVisa" + index}
                                 
                                  accept=".jpg, .jpeg, .png, .pdf"
                                  onChange={(e) =>
                                    handleVisaFileUpload(
                                      2,
                                      index,
                                      e.target.files[0],
                                      p.passportNumber
                                    )
                                  }
                                  disabled={
                                    p.passportNumber === "" ? true : false
                                  }
                                />
                             

                             {/* {p.showvisaCopy && (
                                  <img
                                    src={p.showvisaCopy}
                                    alt="Uploaded"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      boxShadow:
                                        "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                    }}
                                  />
                                )}
                                {p.visaCopy && !p.showvisaCopy && (
                                  <img
                                    src={
                                      environment.s3URL + `${p.visaCopy}`
                                    }
                                    alt="Uploaded"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      boxShadow:
                                        "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                    }}
                                  />
                                )} */}

                              {child[index].visaProgress > 0 && (
                                  <div className="progress-container mt-1">
                                    <div
                                      className="progress-bar"
                                      style={{
                                        width: `${child[index].visaProgress}%`,
                                      }}
                                    >
                                      {/* <span className="progress-text">{progress}%</span> */}
                                    </div>
                                  </div>
                                )}
                            </div>
                            {p.passportNumber === "" && (
                              <span
                                className="text-danger"
                                style={{ fontSize: "12px" }}
                              >
                                Please enter passport number first
                              </span>
                            )}
                          </div>

                          {extraServicesLoader ? (
                            <div className="col-lg-4 col-md-12 col-sm-12 d-flex align-items-center justify-content-center w-100">
                              <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                              </div>
                            </div>
                          ) : (
                            hasExtraService &&
                            extraBaggageAllowedPTC.some(
                              (item) => item === "CNN"
                            ) &&
                            fullObj?.directions?.map((direction, idx) => (
                              <div
                                className="col-lg-4 col-md-12 col-sm-12"
                                key={idx}
                              >
                                <div className="form-group">
                                  <label
                                    className="form-label float-start fw-bold"
                                    type=""
                                  >
                                    {direction[0]?.from} - {direction[0]?.to}{" "}
                                    (Add Extra Baggage)
                                  </label>
                                  <div className="input-group mb-3">
                                    <select
                                      name="nationality"
                                      className="form-select border-radius"
                                      // required
                                      onChange={(e) => {
                                        if (e.target.value === "select") {
                                          setChild((ob) =>
                                            produce(ob, (v) => {
                                              v[index].aCMExtraServices[idx] =
                                                [];
                                            })
                                          );
                                        } else {
                                          setChild((ob) =>
                                            produce(ob, (v) => {
                                              v[index].aCMExtraServices[idx] = [
                                                JSON.parse(e.target.value),
                                              ];
                                            })
                                          );
                                        }
                                      }}
                                    >
                                      <option value={"select"}>Select</option>
                                      {extraServices[0]?.map((item, idx) => (
                                        <option
                                          value={JSON.stringify(item)}
                                          key={idx}
                                        >
                                          {item.name} {item.price}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </>
                      )}
                      {!p.isDisabled && (
                        <div className="col-lg-12">
                          <div class="form-check ">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              style={{ cursor: "pointer" }}
                              id={"defaultChild" + index}
                              onChange={(e) => {
                                setChild((ob) =>
                                  produce(ob, (v) => {
                                    v[index].isQuickPassenger =
                                      e.target.checked;
                                  })
                                );
                              }}
                            />
                            <label
                              class="form-check-label fw-bold align-middle"
                              for={"defaultChild" + index}
                            >
                              Add this person to passenger quick pick list
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {infant.map((p, index) => {
                return (
                  <div key={index} className="border p-2 my-3">
                    <div className="row">
                      <h3 className="form-label fw-bold">
                        <span>Infant ({index + 1})</span>{" "}
                        {sameName &&
                          sameName?.map((item) =>
                            item?.indices?.map(
                              (item) =>
                                item.type === p.type.toUpperCase() &&
                                item.index === index && (
                                  <span
                                    className="text-danger ps-2"
                                    style={{ fontSize: "10px" }}
                                  >
                                    Name sould be different
                                  </span>
                                )
                            )
                          )}
                      </h3>
                      <div className="col-lg-12  my-2">
                        <Select
                          isClearable={true}
                          options={passengerINFList.map((item) => ({
                            label:
                              item.title +
                              " " +
                              item.first +
                              " " +
                              item.middle +
                              " " +
                              item.last,
                            value: item.id,
                          }))}
                          onChange={(e) => {
                            if (e == null) {
                              clearPassPortImage(3, index); 
                              clearVisaCopyImage(3, index);
                              setInfant((ob) =>
                                produce(ob, (v) => {
                                  v[index].title = "";
                                  v[index].firstName = "";
                                  v[index].middleName = "";
                                  v[index].lastName = "";
                                  v[index].dateOfBirth = "";
                                  v[index].nationality =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : "BD";
                                  v[index].passportNumber = "";
                                  v[index].issuingCountry =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : "BD";
                                  // v[index].passportDate = "";
                                  // v[index].passportMonth = "";
                                  // v[index].passportYear = "";
                                  v[index].passportExDate = "";
                                  v[index].gender = "Male";
                                  v[index].phoneNumber = "";
                                  v[index].passportCopy = "";
                                  v[index].visaCopy = "";
                                  v[index].isDisabled = false;
                                  v[index].isQuickPassenger = false;
                                })
                              );
                              return;
                            }
                            const id = Number(e.value);
                            const item = passengerINFList.find(
                              (f) => f.id === id
                            );
                            if (item !== undefined) {
                              setInfant((ob) =>
                                produce(ob, (v) => {
                                  v[index].title = item.title;
                                  v[index].firstName = item.first;
                                  v[index].middleName = item.middle;
                                  v[index].lastName = item.last;
                                  v[index].dateOfBirth = ISODateFormatter(
                                    item?.dateOfBirth
                                  );
                                  v[index].nationality =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : item.nationality;
                                  v[index].passportNumber =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : item.documentNumber;
                                  v[index].issuingCountry =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : item.documentIssuingCountry !== null &&
                                        item.documentIssuingCountry !== ""
                                      ? item.documentIssuingCountry
                                      : "BD";
                                  v[index].passportExDate =
                                    domestic(origin, destination) &&
                                    domestic(
                                      searchData.origin1,
                                      searchData.destination1
                                    ) &&
                                    domestic(
                                      searchData.origin2,
                                      searchData.destination2
                                    ) &&
                                    domestic(
                                      searchData.origin3,
                                      searchData.destination3
                                    ) &&
                                    domestic(
                                      searchData.origin4,
                                      searchData.destination4
                                    ) &&
                                    domestic(
                                      searchData.origin5,
                                      searchData.destination5
                                    )
                                      ? ""
                                      : ISODateFormatter(item?.expireDate);
                                  v[index].gender = item.gender;
                                  v[index].phoneNumber = item.phone;
                                  v[index].passportCopy = item.passportCopy;
                                  v[index].visaCopy = item.visaCopy;
                                  v[index].showvisaCopy = "";
                                  v[index].showPassportCopy = "";
                                  v[index].isDisabled = true;
                                  v[index].isQuickPassenger = false;
                                })
                              );
                            } else {
                              setInfant((ob) =>
                                produce(ob, (v) => {
                                  v[index].title = "";
                                  v[index].firstName = "";
                                  v[index].middleName = "";
                                  v[index].lastName = "";
                                  v[index].dateOfBirth = "";
                                  v[index].nationality = "BD";
                                  v[index].passportNumber = "";
                                  v[index].issuingCountry = "";
                                  v[index].passportExDate = "";
                                  v[index].gender = "Male";
                                  v[index].phoneNumber = "";
                                  v[index].passportCopy = "";
                                  v[index].visaCopy = "";
                                  v[index].isDisabled = false;
                                  v[index].isQuickPassenger = false;
                                })
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label
                            className="form-label float-start fw-bold"
                            type=""
                          >
                            Title
                          </label>

                          <div className="input-group mb-3">
                            <select
                              name="title"
                              className="form-select border-radius"
                              onChange={(e) => {
                                const title = e.target.value;

                                setInfant((ob) =>
                                  produce(ob, (v) => {
                                    v[index].title = title;
                                  })
                                );

                                setInfant((ob) =>
                                  produce(ob, (v) => {
                                    v[index].gender =
                                      title === "Mstr" ? "Male" : "Female";
                                  })
                                );
                              }}
                              value={p.title}
                              required
                            >
                              <option value="">Select</option>

                              <option value="Mstr">Mstr</option>

                              <option value="Miss">Miss</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12 position-relative">
                        <div
                          className="form-group"
                          onMouseEnter={() =>
                            setActiveFieldforinf({
                              index,

                              field: "firstNameinf",
                            })
                          }
                          onMouseLeave={() =>
                            setActiveFieldforinf({
                              index: null,

                              field: null,
                            })
                          }
                        >
                          <label className="form-label float-start fw-bold">
                            First name <span className="text-danger">*</span>
                          </label>

                          <input
                            type="text"
                            name="firstName"
                            className="form-control border-radius"
                            onChange={(e) => {
                              const firstName = e.target.value;

                              const re = /^[a-zA-Z ]*$/;

                              if (re.test(firstName)) {
                                setInfant((ob) =>
                                  produce(ob, (v) => {
                                    v[index].firstName = firstName;
                                  })
                                );
                              } else {
                              }
                            }}
                            value={p.firstName}
                            required
                            disabled={p.isDisabled ? true : false}
                            autocomplete="none"
                            spellcheck="false"
                            placeholder="first name"
                          />

                          {validityError && <div className="validation"></div>}

                          {p.firstName === "" && (
                            <span
                              className="text-danger"
                              style={{ fontSize: "12px" }}
                            >
                              Please enter first name
                            </span>
                          )}

                          {activeFieldforinf.index === index &&
                            activeFieldforinf.field === "firstNameinf" && (
                              <div className="popup-info d-none d-lg-block">
                                <p>Enter as mentioned in your passport</p>

                                <img
                                  src={passportimg}
                                  style={{ height: "auto", width: "100%" }}
                                  alt="passport"
                                />
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12 position-relative">
                        <div
                          className="form-group"
                          onMouseEnter={() =>
                            setActiveFieldforinf({
                              index,

                              field: "lastNameinf",
                            })
                          }
                          onMouseLeave={() =>
                            setActiveFieldforinf({
                              index: null,

                              field: null,
                            })
                          }
                        >
                          <label className="form-label float-start fw-bold">
                            Last name <span className="text-danger">*</span>
                          </label>

                          <input
                            type="text"
                            name="lastName"
                            className="form-control border-radius"
                            onChange={(e) => {
                              const lastName = e.target.value;

                              const re = /^[a-zA-Z ]*$/;

                              if (re.test(lastName)) {
                                setInfant((ob) =>
                                  produce(ob, (v) => {
                                    v[index].lastName = lastName;
                                  })
                                );
                              } else {
                              }
                            }}
                            value={p.lastName}
                            required
                            disabled={p.isDisabled ? true : false}
                            autocomplete="none"
                            spellcheck="false"
                            placeholder="last name"
                          />

                          {validityError && <div className="validation"></div>}

                          {p.lastName === "" && (
                            <span
                              className="text-danger"
                              style={{ fontSize: "12px" }}
                            >
                              Please enter last name
                            </span>
                          )}

                          {activeFieldforinf.index === index &&
                            activeFieldforinf.field === "lastNameinf" && (
                              <div className="popup-info d-none d-lg-block">
                                <p>Enter as mentioned in your passport</p>

                                <img
                                  src={passportimglast}
                                  style={{ height: "auto", width: "100%" }}
                                  alt="passport"
                                />
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12">
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
                              onChange={(e) => {
                                const gender = e.target.value;

                                setInfant((ob) =>
                                  produce(ob, (v) => {
                                    v[index].gender = gender;
                                  })
                                );
                              }}
                              value={p.gender}
                              required
                              disabled={infant[index].title ? true : false}
                            >
                              <option value="Male">Male</option>

                              <option value="Female">Female</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label
                            className="form-label float-start fw-bold"
                            type=""
                          >
                            Date of birth
                            <span className="text-danger">*</span>
                          </label>
                          <div className="input-group mb-3 d-flex">
                            <Box
                              border="1px solid #ced4da"
                              w="100%"
                              h="40px"
                              pt="8px"
                              pl="8px"
                              fontSize="md"
                              className="border-radius"
                            >
                              <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={
                                  p.dateOfBirth && new Date(p.dateOfBirth)
                                }
                                onChange={(date, e) => {
                                  if (e.target.value?.length === 10) {
                                    // toast.error("Please enter full date")
                                    setInfant((ob) =>
                                      produce(ob, (v) => {
                                        v[index].dateOfBirth = date;
                                      })
                                    );
                                  } else if (
                                    e.target.value?.length === undefined ||
                                    e.target.value?.length === 0
                                  ) {
                                    date !== "" &&
                                      setInfant((ob) =>
                                        produce(ob, (v) => {
                                          v[index].dateOfBirth = date;
                                        })
                                      );
                                  }
                                }}
                                placeholderText="dd/mm/yyyy"
                                minDate={add(
                                  new Date(
                                    Database?.tripTypeModify === "Round Trip" &&
                                    calculateFullAge(
                                      Database?.journeyDate,
                                      Database?.returnDate
                                    )
                                      ? direction0.platingCarrierCode === "BS"
                                        ? Database?.journeyDate
                                        : Database?.returnDate
                                      : Database?.tripTypeModify === "One Way"
                                      ? Database?.journeyDate
                                      : Database?.destination5 !== ""
                                      ? Database?.inputDateMulti5
                                      : Database?.destination4 !== ""
                                      ? Database?.inputDateMulti4
                                      : Database?.destination3 !== ""
                                      ? Database?.inputDateMulti3
                                      : Database?.destination2 !== ""
                                      ? Database?.inputDateMulti2
                                      : Database?.destination1 !== ""
                                      ? Database?.inputDateMulti1
                                      : Database?.journeyDate
                                  ),
                                  {
                                    years: -2,
                                    days: 2,
                                  }
                                )}
                                maxDate={new Date()}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                onKeyDown={(e) =>
                                  ["-"].includes(e.key) && e.preventDefault()
                                }
                              />
                            </Box>

                            {/* INFANT SAVED PROFILE */}
                            {moment(p.dateOfBirth).isBefore(
                              ISODateFormatter(
                                add(
                                  new Date(
                                    Database?.tripTypeModify === "Round Trip" &&
                                    calculateFullAge(
                                      Database?.journeyDate,
                                      Database?.returnDate
                                    )
                                      ? direction0.platingCarrierCode === "BS"
                                        ? Database?.journeyDate
                                        : Database?.returnDate
                                      : Database?.tripTypeModify === "One Way"
                                      ? Database?.journeyDate
                                      : Database?.destination5 !== ""
                                      ? Database?.inputDateMulti5
                                      : Database?.destination4 !== ""
                                      ? Database?.inputDateMulti4
                                      : Database?.destination3 !== ""
                                      ? Database?.inputDateMulti3
                                      : Database?.destination2 !== ""
                                      ? Database?.inputDateMulti2
                                      : Database?.destination1 !== ""
                                      ? Database?.inputDateMulti1
                                      : Database?.journeyDate
                                  ),
                                  {
                                    years: -2,
                                    days: 2,
                                  }
                                )
                              )
                            ) && (
                              <Text color="red" pl="4px">
                                Date of birth not valid!{" "}
                              </Text>
                            )}

                            {validityError && p.dateOfBirth === "" && (
                              <Text pl="2px" color="red">
                                Date of birth is required
                              </Text>
                            )}
                            {validityError && (
                              <div className="validation"></div>
                            )}
                            {!p.dateOfBirth && (
                              <span
                                className="text-danger"
                                style={{ fontSize: "12px" }}
                              >
                                Please enter DOB
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label
                            className="form-label float-start fw-bold"
                            type=""
                          >
                            Frequent flyer number(If any)
                          </label>
                          <input
                            type="text"
                            name="frequentFlyerNumber"
                            className="form-control border-radius"
                            onChange={(e) => {
                              const frequentFlyerNumber = e.target.value;
                              setInfant((ob) =>
                                produce(ob, (v) => {
                                  v[index].frequentFlyerNumber =
                                    frequentFlyerNumber;
                                })
                              );
                            }}
                            value={p.frequentFlyerNumber}
                            autocomplete="none"
                            spellcheck="false"
                            placeholder="frequent flyer number"
                          />
                        </div>
                      </div>
                      {domestic(origin, destination) &&
                      domestic(searchData.origin1, searchData.destination1) &&
                      domestic(searchData.origin2, searchData.destination2) &&
                      domestic(searchData.origin3, searchData.destination3) &&
                      domestic(searchData.origin4, searchData.destination4) &&
                      domestic(searchData.origin5, searchData.destination5) ? (
                        <></>
                      ) : (
                        <>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                type=""
                              >
                                Nationality
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-group mb-3">
                                <select
                                  name="nationality"
                                  className="form-select border-radius"
                                  onChange={(e) => {
                                    const nationality = e.target.value;
                                    setInfant((ob) =>
                                      produce(ob, (v) => {
                                        v[index].nationality = nationality;
                                        v[index].countryCode = nationality;
                                      })
                                    );
                                  }}
                                  value={p.nationality}
                                  required
                                >
                                  <option value="BD">Bangladesh</option>
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
                        </>
                      )}

                      {domestic(origin, destination) &&
                      domestic(searchData.origin1, searchData.destination1) &&
                      domestic(searchData.origin2, searchData.destination2) &&
                      domestic(searchData.origin3, searchData.destination3) &&
                      domestic(searchData.origin4, searchData.destination4) &&
                      domestic(searchData.origin5, searchData.destination5) ? (
                        <></>
                      ) : (
                        <>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Passport number{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control border-radius"
                                name="passport-number"
                                required
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const passportNumber = e.target.value;
                                    const re = /^[0-9a-zA-Z]+$/;
                                    if (re.test(passportNumber)) {
                                      setInfant((ob) =>
                                        produce(ob, (v) => {
                                          v[index].passportNumber =
                                            passportNumber;
                                        })
                                      );
                                    }
                                  } else {
                                    setInfant((ob) =>
                                      produce(ob, (v) => {
                                        v[index].passportNumber = "";
                                      })
                                    );
                                  }
                                }}
                                value={p.passportNumber}
                                autocomplete="none"
                                spellcheck="false"
                                placeholder="passport number"
                              />
                              {validityError && (
                                <div className="validation"></div>
                              )}
                              {p.passportNumber === "" && (
                                <span
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  Please enter passport number
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Issuing country{" "}
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <select
                                className="form-select border-radius"
                                onChange={(e) => {
                                  const issuingCountry = e.target.value;
                                  setInfant((ob) =>
                                    produce(ob, (v) => {
                                      v[index].issuingCountry = issuingCountry;
                                    })
                                  );
                                }}
                                value={p.issuingCountry}
                                required
                              >
                                <option value="BD">Bangladesh</option>
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
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Passport Expiry Date{" "}
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <Box
                                border="1px solid #ced4da"
                                w="100%"
                                h="40px"
                                pt="8px"
                                pl="8px"
                                fontSize="md"
                                className="border-radius"
                              >
                                <DatePicker
                                  dateFormat="dd/MM/yyyy"
                                  selected={
                                    p.passportExDate &&
                                    new Date(p.passportExDate)
                                  }
                                  onChange={(date) =>
                                    date !== "" &&
                                    setInfant((ob) =>
                                      produce(ob, (v) => {
                                        v[index].passportExDate = date;
                                      })
                                    )
                                  }
                                  placeholderText="dd/mm/yyyy"
                                  minDate={add(
                                    new Date(
                                      Object.keys(direction5).length
                                        ? direction5?.segments[
                                            direction5?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction4).length
                                        ? direction4?.segments[
                                            direction4?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction3).length
                                        ? direction3?.segments[
                                            direction3?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction2).length
                                        ? direction2?.segments[
                                            direction2?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction1).length
                                        ? direction1?.segments[
                                            direction1?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction0).length &&
                                          direction0?.segments[
                                            direction0?.segments?.length - 1
                                          ].departure
                                    ),
                                    { months: 2 }
                                  )}
                                  maxDate={new Date("2199-12-30")}
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  onKeyDown={(e) =>
                                    ["-"].includes(e.key) && e.preventDefault()
                                  }
                                />
                              </Box>

                              {moment(p?.passportExDate).isBefore(
                                ISODateFormatter(
                                  add(
                                    new Date(
                                      Object.keys(direction5).length
                                        ? direction5?.segments[
                                            direction5?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction4).length
                                        ? direction4?.segments[
                                            direction4?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction3).length
                                        ? direction3?.segments[
                                            direction3?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction2).length
                                        ? direction2?.segments[
                                            direction2?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction1).length
                                        ? direction1?.segments[
                                            direction1?.segments?.length - 1
                                          ].departure
                                        : Object.keys(direction0).length &&
                                          direction0?.segments[
                                            direction0?.segments?.length - 1
                                          ].departure
                                    ),
                                    { months: 2 }
                                  )
                                )
                              ) && (
                                <Text color="red" pl="4px">
                                  Your passport expiry date is less than 2
                                  months{" "}
                                </Text>
                              )}
                              {validityError && (
                                <div className="validation"></div>
                              )}
                              {!p.passportExDate && (
                                <span
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  Please enter passport expiry date
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {domestic(origin, destination) &&
                      domestic(searchData.origin1, searchData.destination1) &&
                      domestic(searchData.origin2, searchData.destination2) &&
                      domestic(searchData.origin3, searchData.destination3) &&
                      domestic(searchData.origin4, searchData.destination4) &&
                      domestic(searchData.origin5, searchData.destination5) ? (
                        <></>
                      ) : (
                        <>
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="form-group">
                              <label
                                className="form-label float-start fw-bold"
                                htmlFor=""
                              >
                                Passport Copy{" "}
                                {/* <span className="text-danger">*</span> */}
                              </label>
                            </div>
                            <div className="input-group">
                              <input
                                type={"file"}
                                className={
                                  p.showPassportCopy
                                    ? "form-control mr-1 border-radius"
                                    : "form-control border-radius"
                                }
                                id={"infantpassport" + index}
                                accept=".jpg, .jpeg, .png, .pdf"
                                onChange={(e) =>
                                  handlePassportFileUpload(
                                    3,
                                    index,
                                    e.target.files[0],
                                    p.passportNumber
                                  )
                                }
                                // required
                                disabled={
                                  p.passportNumber === "" ? true : false
                                }
                              />

                              {/* {p.showPassportCopy && (
                                <img
                                  src={p.showPassportCopy}
                                  alt="Uploaded"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    boxShadow:
                                      "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                  }}
                                />
                              )}

                              {p.passportCopy && !p.showPassportCopy && (
                                <img
                                  src={environment.s3URL + `${p.passportCopy}`}
                                  alt="Uploaded"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    boxShadow:
                                      "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                  }}
                                />
                              )} */}
                              {infant[index].progress > 0 && (
                                <div className="progress-container mt-1">
                                  <div
                                    className="progress-bar"
                                    style={{
                                      width: `${infant[index].progress}%`,
                                    }}
                                  >
                                    {/* <span className="progress-text">{progress}%</span> */}
                                  </div>
                                </div>
                              )}
                            </div>
                            {p.passportNumber === "" && (
                              <span
                                className="text-danger"
                                style={{ fontSize: "12px" }}
                              >
                                Please enter passport number first
                              </span>
                            )}
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
                            <div className="input-group">
                             
                                <input
                                 type={"file"}
                                   className={
                                    p.showvisaCopy
                                      ? "form-control mr-1 border-radius"
                                      : "form-control border-radius"
                                  }
                                  // id="customFile"
                                  id={"infantVisa" + index}
                                 
                                  accept=".jpg, .jpeg, .png, .pdf"
                                  onChange={(e) =>
                                    handleVisaFileUpload(
                                      3,
                                      index,
                                      e.target.files[0],
                                      p.passportNumber
                                    )
                                  }
                                  disabled={
                                    p.passportNumber === "" ? true : false
                                  }
                                />
                             

                             {/* {p.showvisaCopy && (
                                  <img
                                    src={p.showvisaCopy}
                                    alt="Uploaded"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      boxShadow:
                                        "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                    }}
                                  />
                                )}
                                {p.visaCopy && !p.showvisaCopy && (
                                  <img
                                    src={
                                      environment.s3URL + `${p.visaCopy}`
                                    }
                                    alt="Uploaded"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      boxShadow:
                                        "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                    }}
                                  />
                                )} */}

                              {infant[index].visaProgress > 0 && (
                                  <div className="progress-container mt-1">
                                    <div
                                      className="progress-bar"
                                      style={{
                                        width: `${infant[index].visaProgress}%`,
                                      }}
                                    >
                                      {/* <span className="progress-text">{progress}%</span> */}
                                    </div>
                                  </div>
                                )}
                            </div>
                            {p.passportNumber === "" && (
                              <span
                                className="text-danger"
                                style={{ fontSize: "12px" }}
                              >
                                Please enter passport number first
                              </span>
                            )}
                          </div>

                          {extraServicesLoader ? (
                            <div className="col-lg-4 col-md-12 col-sm-12 d-flex align-items-center justify-content-center w-100">
                              <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                              </div>
                            </div>
                          ) : (
                            hasExtraService &&
                            extraBaggageAllowedPTC.some(
                              (item) => item === "INF"
                            ) &&
                            fullObj?.directions?.map((direction, idx) => (
                              <div
                                className="col-lg-4 col-md-12 col-sm-12"
                                key={idx}
                              >
                                <div className="form-group">
                                  <label
                                    className="form-label float-start fw-bold"
                                    type=""
                                  >
                                    {direction[0]?.from} - {direction[0]?.to}{" "}
                                    (Add Extra Baggage)
                                  </label>
                                  <div className="input-group mb-3">
                                    <select
                                      name="nationality"
                                      className="form-select border-radius"
                                      onChange={(e) => {
                                        if (e.target.value === "select") {
                                          setInfant((ob) =>
                                            produce(ob, (v) => {
                                              v[index].aCMExtraServices[idx] =
                                                [];
                                            })
                                          );
                                        } else {
                                          setInfant((ob) =>
                                            produce(ob, (v) => {
                                              v[index].aCMExtraServices[idx] = [
                                                JSON.parse(e.target.value),
                                              ];
                                            })
                                          );
                                        }
                                      }}
                                    >
                                      <option value={"select"}>Select</option>
                                      {extraServices[0]?.map((item, idx) => (
                                        <option
                                          value={JSON.stringify(item)}
                                          key={idx}
                                        >
                                          {item.name} {item.price}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </>
                      )}
                      {!p.isDisabled && (
                        <div className="col-lg-12">
                          <div class="form-check ">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              style={{ cursor: "pointer" }}
                              id={"defaultInfant" + index}
                              onChange={(e) => {
                                setInfant((ob) =>
                                  produce(ob, (v) => {
                                    v[index].isQuickPassenger =
                                      e.target.checked;
                                  })
                                );
                              }}
                            />
                            <label
                              class="form-check-label fw-bold align-middle"
                              for={"defaultInfant" + index}
                            >
                              Add this person to passenger quick pick list
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="card my-5">
          <div className="card-body border py-4">
            <h5 className="from-label fw-bold text-start">
              Enter contact details
            </h5>
            {contact.map((p, index) => {
              return (
                <div key={index} style={{ marginBottom: "5px" }}>
                  <div className="row">
                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label className="form-label float-start fw-bold">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          name="lastName"
                          className="form-control border-radius"
                          onChange={(e) => {
                            const email = e.target.value;
                            setContact((ob) =>
                              produce(ob, (v) => {
                                v[index].email = email;
                              })
                            );
                          }}
                          value={p.email}
                          placeholder="email"
                          required
                          autocomplete="none"
                          spellcheck="false"
                          pattern="[a-zA-Z0-9_\.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$"
                        />
                        {validityError && <div className="validation"></div>}
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <h5
                        className="from-label fw-bold  text-start  "
                        style={{ marginTop: "10px" }}
                      >
                        Phone Number <span className="text-danger">*</span>
                      </h5>
                      <div className="">
                        <div className="">
                          <VStack padding={0}>
                            <Flex direction={{ base: "column", md: "row" }}>
                              <select
                                id="name"
                                placeholder="Title"
                                className="form-select"
                                onChange={(e) => {
                                  const nationality = e.target.value;
                                  setContact((ob) =>
                                    produce(ob, (v) => {
                                      v[index].nationality = nationality;
                                      v[index].mobailCode = courtries.filter(
                                        (item) => item.code === nationality
                                      )[0].dial_code;
                                    })
                                  );
                                }}
                                value={p.nationality}
                                required
                                style={{
                                  borderStartStartRadius: "8px",
                                  borderEndStartRadius: "8px",
                                }}
                              >
                                <option>{getuser?.countryName}</option>
                                {courtries.map((item, index) => {
                                  return (
                                    <option key={index} value={item.code}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </select>

                              <select
                                id="name"
                                placeholder="Title"
                                className="px-1"
                                style={{
                                  appearance: "none",
                                  WebkitAppearance: "none",
                                  MozAppearance: "none",
                                  backgroundColor: "#e9ecef",
                                  border: "1px solid #e9ecef",
                                }}
                                value={p.mobailCode}
                                required
                                disabled
                              >
                                <option
                                  value={
                                    courtries.filter(
                                      (item) =>
                                        item.code === contact[0].nationality
                                    )[0]?.dial_code
                                  }
                                >
                                  {
                                    courtries.filter(
                                      (item) =>
                                        item.code === contact[0].nationality
                                    )[0]?.dial_code
                                  }
                                </option>
                              </select>
                              <input
                                type="number"
                                name="phoneNumber"
                                className="form-control"
                                onChange={(e) => {
                                  const mobailNumber = e.target.value;
                                  setContact((ob) =>
                                    produce(ob, (v) => {
                                      v[index].mobailNumber = mobailNumber;
                                    })
                                  );
                                }}
                                value={p.mobailNumber}
                                placeholder="phone number"
                                required
                                autocomplete="none"
                                style={{
                                  borderEndEndRadius: "8px",
                                  borderStartEndRadius: "9px",
                                }}
                              />
                            </Flex>
                          </VStack>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

<div className="row">
              <div className="col-lg-12">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault1"
                    onChange={aditionalphoneClick}
                  />
                  <label
                    class="form-check-label font-size-checkbok"
                    for="flexCheckDefault1"
                  >
                    Send Additional Phone or Email{" "}
                  </label>
                </div>
              </div>
            </div>

            {additionalPhoneadd && (
              <div className="row mt-2">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label float-start fw-bold">
                      Additional Email
                    </label>
                    <input
                      type="email"
                      name="lastName"
                      className="form-control form-rounded"
                      onChange={(e) => {
                        setOptionalPhone({
                          ...optionalPhone,
                          sentToEmail: e.target.value,
                        });
                      }}
                      value={optionalPhone.sentToEmail}
                      placeholder="Additional Email"
                      autocomplete="none"
                      spellcheck="false"
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label float-start fw-bold">
                      Additional Number
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="phoneNumber"
                      className="form-control form-rounded"
                      onChange={(e) => {
                        const additionalNumber = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 11);
                        setOptionalPhone({
                          ...optionalPhone,
                          sentToPhone: additionalNumber,
                        });
                      }}
                      value={optionalPhone.sentToPhone}
                      placeholder="Additional Number"
                      maxLength={11}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            )}


            {bookable === false &&
            agentInfo?.activeCredit + agentInfo?.currentBalance <
              totalPrice ? null : (
              <div className="row">
                <div className="col-lg-12">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      onChange={handleClick}
                    />
                    <label
                      class="form-check-label font-size-checkbok"
                      for="flexCheckDefault"
                    >
                      By Booking/Issuing this Ticket I agree to Triplover{" "}
                      <span  role="button">
                        <u style={{ color: "#7c04c0" }} className="fw-bold">
                          Booking Policy
                        </u>
                      </span>
                      <span className="mx-1">and</span>
                      <span  role="button">
                        <u style={{ color: "#7c04c0" }} className="fw-bold">
                          Terms & Conditions
                        </u>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            <Modal
              size="1000px"
              isOpen={isOpen4}
              trapFocus={false}
              onClose={onClose4}
            >
              <ModalOverlay />
              <ModalContent w="1000px">
                <ModalHeader>Booking Policy : Triplover Ltd</ModalHeader>
                <ModalCloseButton />

                <ModalBody borderTop="1px solid #ededed">
                  <LeftSideModal />
                </ModalBody>
              </ModalContent>
            </Modal>
            <Modal
              size="1000px"
              isOpen={isOpen5}
              trapFocus={false}
              onClose={onClose5}
            >
              <ModalOverlay />
              <ModalContent w="1000px">
                <ModalHeader>Terms & Conditions</ModalHeader>
                <ModalCloseButton />

                <ModalBody borderTop="1px solid #ededed">
                  <LeftSideModalTC />
                </ModalBody>
              </ModalContent>
            </Modal>

            <>
              {bookable === false &&
              agentInfo?.activeCredit + agentInfo?.currentBalance <
                totalPrice ? (
                <div className="text-red py-3 text-center">
                  You don't have available balance to generate Ticket!
                </div>
              ) : (
                <div className="row mt-2">
                  <div className="col-lg-4"></div>
                  <div className="col-lg-4 text-center">
                    {verifyIfUnlockedForTicketState ? (
                      <button
                        type="button"
                        className="btn button-color text-white fw-bold mt-2 border-radius"
                        onClick={() => {
                          if (!isDomestic) {
                            (!isExDateValidAdt ||
                              !isAdultValid ||
                              !isChildValid ||
                              !isExDateValidCnn ||
                              !isExDateValidInf ||
                              isExDateEmptyAdt ||
                              isExDateEmptyCnn ||
                              isExDateEmptyInf ||
                              !click ||
                              isCommonFieldValid) &&
                              onOpen();
                          } else if (isDomestic) {
                            isCommonFieldValid && click && onOpen();
                          }
                        }}
                        disabled={
                          isDomestic
                            ? isExDateEmptyCnn ||
                              isExDateEmptyInf ||
                              !isChildValid ||
                              !isInfantValid ||
                              !click ||
                              !isAdultValid ||
                              !isCommonFieldValid ||
                              (userRole > 1 || userRole === "null"
                                ? false
                                : true)
                            : !isExDateValidAdt ||
                              !isAdultValid ||
                              !isChildValid ||
                              !isExDateValidCnn ||
                              !isExDateValidInf ||
                              isExDateEmptyAdt ||
                              isExDateEmptyCnn ||
                              isExDateEmptyInf ||
                              !click ||
                              (userRole > 1 || userRole === "null"
                                ? false
                                : true) ||
                              !isCommonFieldValid
                        }
                      >
                        {bookable === true ? "Book Now" : "Generate Ticket"}
                      </button>
                    ) : (
                      !bookable && (
                        <button
                          type="button"
                          className="btn button-color text-white fw-bold mt-2 border-radius"
                          onClick={() => {
                            if (!isDomestic) {
                              (!isExDateValidAdt ||
                                !isAdultValid ||
                                !isChildValid ||
                                !isExDateValidCnn ||
                                !isExDateValidInf ||
                                isExDateEmptyAdt ||
                                isExDateEmptyCnn ||
                                isExDateEmptyInf ||
                                !click ||
                                isCommonFieldValid) &&
                                handlegetTicketUnlockOtp();
                            } else if (isDomestic) {
                              isCommonFieldValid &&
                                click &&
                                handlegetTicketUnlockOtp();
                            }
                          }}
                          disabled={
                            isDomestic
                              ? isExDateEmptyCnn ||
                                isExDateEmptyInf ||
                                !isChildValid ||
                                !isInfantValid ||
                                !click ||
                                !isAdultValid ||
                                !isCommonFieldValid ||
                                (userRole > 1 || userRole === "null"
                                  ? false
                                  : true)
                              : !isExDateValidAdt ||
                                !isAdultValid ||
                                !isChildValid ||
                                !isExDateValidCnn ||
                                !isExDateValidInf ||
                                isExDateEmptyAdt ||
                                isExDateEmptyCnn ||
                                isExDateEmptyInf ||
                                !click ||
                                (userRole > 1 || userRole === "null"
                                  ? false
                                  : true) ||
                                !isCommonFieldValid
                          }
                        >
                          Get OTP
                        </button>
                      )
                    )}

                    {userRole > 1 || userRole === "null" ? (
                      <></>
                    ) : (
                      <div className="text-red">
                        N.B: Your permission to book is denied.
                      </div>
                    )}
                  </div>
                  <div className="col-lg-4"></div>

                  {bookable === false && (
                    <div className="text-red py-3 text-center">
                      "By clicking "Generate Ticket," tickets will be{" "}
                      <span className="fw-bold">ISSUED</span>. Booking options
                      are NOT available for{" "}
                      <span className="fw-bold">
                        {" "}
                        {direction0.platingCarrierName}
                      </span>
                      ."
                    </div>
                  )}
                </div>
              )}
            </>

            <Modal isOpen={isOpen} onClose={onClose} size={"4xl"}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader> </ModalHeader>
                <ModalCloseButton
                  onClick={() => setExtraServiceConfirm(false)}
                />
                <ModalBody>
                  <BookConfirmModal
                    partialPaymentData={partialPaymentData}
                    loader={loader}
                    adultValue={adultValue}
                    childValue={childValue}
                    infantValue={infantValue}
                    hasExtraService={hasExtraService}
                    extraServices={extraServices}
                  />
                  <div className="row my-3">
                    <div className="col-lg-12">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="confirmForService"
                          onChange={() =>
                            setExtraServiceConfirm((previous) => !previous)
                          }
                        />
                        <label
                          class="form-check-label font-size-checkbok"
                          for="confirmForService"
                        >
                          I agree and confirm that, all the passenger
                          information provided here is correct.
                        </label>
                      </div>
                    </div>
                  </div>
                  <Flex justify={"center"} gap={2} className="pb-4">
                    <Button
                      onClick={() => {
                        onClose();
                        setExtraServiceConfirm(false);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      type="button"
                      bg={"#7c04c0"}
                      colorScheme="green"
                      onClick={() => {
                        onClose();
                        bookingData();
                      }}
                      disabled={extraServiceConfirm ? false : true}
                    >
                      Confirm
                    </Button>
                  </Flex>
                </ModalBody>
              </ModalContent>
            </Modal>

            <ModalForm isOpen={isOpen1} onClose={onClose1} size={"sm"}>
              <Center>
                <div className="row">
                  <div className="col-lg-12 text-center m-2 p-3">
                    <h5 class="button-color p-2 text-white my-1 border-radius">
                      Your selected price has been changed!
                    </h5>
                    <p className="py-2">
                      Reference number :{" "}
                      {JSON.parse(sessionStorage.getItem("uniqueTransID"))}{" "}
                    </p>
                    <h5 className="text-success pb-1">
                      New Price is AED{" "}
                      {priceChangedData?.data?.item1?.totalPrice}
                    </h5>
                    <h5 className="text-success pb-3">
                      Old Price is AED {totalPrice}
                    </h5>
                    <hr></hr>
                    <div className="mt-4">
                      <button
                        type="button"
                        class="btn button-color text-white me-2 border-radius"
                        data-bs-dismiss="modal"
                        onClick={handleCancle}
                      >
                        Search Again
                      </button>
                      <button
                        type="button"
                        class="btn button-color text-white border-radius"
                        onClick={handleBooking}
                      >
                        {bookable === true ? "Book Now" : "Generate Ticket"}
                      </button>
                    </div>
                  </div>
                </div>
              </Center>
            </ModalForm>

            <ModalForm isOpen={isOpen2} onClose={onClose2} size={"sm"}>
              <Center>
                <div className="row">
                  <div className="col-lg-12 text-center m-2 p-3">
                    <h5 class="text-danger p-2 rounded text-white my-3">
                      {messageForExtra}
                    </h5>
                    <p className="py-2">
                      Reference number :{" "}
                      {JSON.parse(sessionStorage.getItem("uniqueTransID"))}{" "}
                    </p>

                    <hr></hr>
                    <div className="mt-4">
                      <button
                        type="button"
                        class="btn button-color rounded text-white me-2"
                        data-bs-dismiss="modal"
                        onClick={handleCancle}
                      >
                        Search Again
                      </button>
                      <button
                        type="button"
                        class="btn button-color rounded text-white"
                        onClick={() => onClose2()}
                      >
                        Modify Again
                      </button>
                    </div>
                  </div>
                </div>
              </Center>
            </ModalForm>

            <Modal
              isCentered
              isOpen={isOpen3}
              onClose={onOpen3}
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
                      p={1}
                    >
                      {otpMessage}
                    </Text>
                    <Text
                      htmlFor="otpInput"
                      display={"flex"}
                      justifyContent={"center"}
                      textAlign={"center"}
                      fontSize={"15px"}
                      color={"red"}
                      p={1}
                    >
                      Please provide the 6 digits OTP
                    </Text>
                    <Input
                      id="otpInput"
                      type="number"
                      value={desableotp}
                      pattern="^(\d{0}|\d{6})$"
                      onChange={(e) => {
                        if (e.target.value.length < 7) {
                          setdesableotp(e.target.value);
                        } else {
                          e.preventDefault();
                        }
                      }}
                      onKeyDown={preventNegativeValues}
                      placeholder="Enter OTP"
                    />

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      mt="10px"
                      gap="2"
                    >
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
                        disabled={desableotp.length < 6 && true}
                        onClick={() => handleVerifyTicketUnlockOtp()}
                      >
                        Submit
                      </button>
                    </Box>
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LeftSide;
