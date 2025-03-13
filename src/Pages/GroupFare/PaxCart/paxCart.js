import React, { useEffect, useState } from "react";
import Navbar from "../../SharePages/Navbar/Navbar";
import SideNavBar from "../../SharePages/SideNavBar/SideNavBar";
import Footer from "../../SharePages/Footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import SummaryCard from "./summaryCard";
import { calculateFullAge, createList } from "../../../common/groupFare";
import AdultForm from "../component/adultForm";
import ChildForm from "../component/childForm";
import moment from "moment";
import {
  addFlightPassengerInfo,
  downloadexceldemo,
  groupFareUploadFile,
} from "../../../common/allApi";
import produce from "immer";
import { environment } from "../../SharePages/Utility/environment";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { ISODateFormatter } from "../../../common/functions";
import { add } from "date-fns";

const PaxCart = () => {
  const navigate = useNavigate();
  const selectedFlightData = JSON.parse(
    sessionStorage.getItem("group-fare-selected-flight")
  );
  const [passenger, setPassenger] = useState({
    adult:
      selectedFlightData.passengerCount.adult > 0
        ? createList(selectedFlightData.passengerCount.adult, "ADT")
        : [],
    child:
      selectedFlightData.passengerCount.child > 0
        ? createList(selectedFlightData.passengerCount.child, "CHD")
        : [],
  });
  const [submitBtnClick, setSubmitBtnClick] = useState(false);

  const [bookingBtnLoader, setBookingBtnLoader] = useState(false);
  const [agentRemarks, setAgentRemarks] = useState("");

  const [payment, setPayment] = useState({
    partialPayment: false,
    fullPayment: true,
  });

  const handleButtonClick = async () => {
    setSubmitBtnClick(true);
    let passengerArr = [];
    if (passenger?.adult?.length > 0) {
      passenger?.adult.map((item, i) => {
        passengerArr.push({
          ...item,
          isLeadPax: i === 0 ? true : false,
          dateOfBirth: moment(item?.dateOfBirth).format("yyyy-MM-DD"),
          groupFareId: selectedFlightData?.seclectedFlight?.groupFareFlight?.id,
        });
      });
    }
    if (passenger?.child?.length > 0) {
      passenger?.child?.map((item) => {
        passengerArr.push({
          ...item,
          isLeadPax: false,
          dateOfBirth: moment(item?.dateOfBirth).format("yyyy-MM-DD"),
          groupFareId: selectedFlightData?.seclectedFlight?.groupFareFlight?.id,
        });
      });
    }
    let payload = {
      agentRemarks: agentRemarks,
      farePassengerInfo: passengerArr,
      groupFareId: selectedFlightData?.seclectedFlight?.groupFareFlight?.id,
      hr: selectedFlightData?.hr,
      isPartialPayment: payment?.partialPayment === true ? true : false,
    };

    const bookingApiCall = async () => {
      try {
        setBookingBtnLoader(true);
        const response = await addFlightPassengerInfo(payload);
        if (response.data.isSuccess) {
          navigate("/booking-success");
        } else {
          setBookingBtnLoader(false);
          toast.error(response.data.message);
        }
      } catch (e) {
        setBookingBtnLoader(false);
        toast.error("Please try agein.");
      }
    };

    const allPassengerInfoValid = payload.farePassengerInfo.every((item) => {
      const {
        first,
        last,
        dateOfBirth,
        email,
        documentNumber,
        expireDate,
        phone,
        passportCopy,
        visaCopy,
      } = item;
      const thresholdDate = ISODateFormatter(
        add(
          new Date(
            selectedFlightData?.seclectedFlight?.flightSegments[0]
              .journeyType === "Round Trip"
              ? moment(
                  selectedFlightData?.seclectedFlight?.flightSegments[1]
                    ?.arrival
                ).format("yyyy-MM-DD")
              : moment(
                  selectedFlightData?.seclectedFlight?.flightSegments[0]
                    ?.departure
                ).format("yyyy-MM-DD")
          ),
          { years: -12 }
        )
      );

      if (selectedFlightData?.domestic) {
        // Validate for domestic flight
        return first !== "" &&
          last !== "" &&
          dateOfBirth !== "" &&
          email !== "" &&
          phone !== "" &&
          dateOfBirth !== null &&
          email !== null &&
          item.passengerType === "ADT"
          ? !moment(dateOfBirth).isAfter(thresholdDate)
          : !moment(dateOfBirth).isAfter(
              ISODateFormatter(
                add(
                  new Date(
                    selectedFlightData?.seclectedFlight?.flightSegments[0]
                      ?.journeyType === "Round Trip" &&
                    calculateFullAge(
                      selectedFlightData?.seclectedFlight?.flightSegments[0]
                        ?.departure,
                      selectedFlightData?.seclectedFlight?.flightSegments[1]
                        ?.arrival
                    )
                      ? moment(
                          selectedFlightData?.seclectedFlight?.flightSegments[1]
                            ?.arrival
                        ).format("yyyy-MM-DD")
                      : moment(
                          selectedFlightData?.seclectedFlight?.flightSegments[0]
                            ?.departure
                        ).format("yyyy-MM-DD")
                  ),
                  {
                    years: -2,
                  }
                )
              )
            ) &&
              !moment(dateOfBirth).isBefore(
                ISODateFormatter(
                  add(
                    new Date(
                      selectedFlightData?.seclectedFlight?.flightSegments[0]
                        ?.journeyType === "Round Trip" &&
                      calculateFullAge(
                        selectedFlightData?.seclectedFlight?.flightSegments[0]
                          ?.departure,
                        selectedFlightData?.seclectedFlight?.flightSegments[1]
                          ?.arrival
                      )
                        ? moment(
                            selectedFlightData?.seclectedFlight
                              ?.flightSegments[1]?.arrival
                          ).format("yyyy-MM-DD")
                        : moment(
                            selectedFlightData?.seclectedFlight
                              ?.flightSegments[0]?.departure
                          ).format("yyyy-MM-DD")
                    ),
                    {
                      years: -12,
                      days: 1,
                    }
                  )
                )
              );
      } else {
        // Validate for international flight
        return (
          first !== "" &&
          last !== "" &&
          dateOfBirth !== "" &&
          email !== "" &&
          documentNumber !== "" &&
          expireDate !== "" &&
          dateOfBirth !== null &&
          expireDate !== null &&
          phone !== "" &&
          email !== null &&
          passportCopy !== "" &&
          visaCopy !== "" &&
          (item.passengerType === "ADT"
            ? !moment(dateOfBirth).isAfter(thresholdDate)
            : !moment(dateOfBirth).isAfter(
                ISODateFormatter(
                  add(
                    new Date(
                      selectedFlightData?.seclectedFlight?.flightSegments[0]
                        ?.journeyType === "Round Trip" &&
                      calculateFullAge(
                        selectedFlightData?.seclectedFlight?.flightSegments[0]
                          ?.departure,
                        selectedFlightData?.seclectedFlight?.flightSegments[1]
                          ?.arrival
                      )
                        ? moment(
                            selectedFlightData?.seclectedFlight
                              ?.flightSegments[1]?.arrival
                          ).format("yyyy-MM-DD")
                        : moment(
                            selectedFlightData?.seclectedFlight
                              ?.flightSegments[0]?.departure
                          ).format("yyyy-MM-DD")
                    ),
                    {
                      years: -2,
                    }
                  )
                )
              ) &&
              !moment(dateOfBirth).isBefore(
                ISODateFormatter(
                  add(
                    new Date(
                      selectedFlightData?.seclectedFlight?.flightSegments[0]
                        ?.journeyType === "Round Trip" &&
                      calculateFullAge(
                        selectedFlightData?.seclectedFlight?.flightSegments[0]
                          ?.departure,
                        selectedFlightData?.seclectedFlight?.flightSegments[1]
                          ?.arrival
                      )
                        ? moment(
                            selectedFlightData?.seclectedFlight
                              ?.flightSegments[1]?.arrival
                          ).format("yyyy-MM-DD")
                        : moment(
                            selectedFlightData?.seclectedFlight
                              ?.flightSegments[0]?.departure
                          ).format("yyyy-MM-DD")
                    ),
                    {
                      years: -12,
                      days: 1,
                    }
                  )
                )
              )) &&
          !moment(expireDate).isBefore(
            ISODateFormatter(
              add(
                new Date(
                  selectedFlightData?.seclectedFlight?.flightSegments[0]
                    .journeyType === "Round Trip"
                    ? moment(
                        selectedFlightData?.seclectedFlight?.flightSegments[
                          selectedFlightData?.seclectedFlight?.flightSegments
                            .length - 1
                        ]?.departure
                      ).format("yyyy-MM-DD")
                    : moment(
                        selectedFlightData?.seclectedFlight?.flightSegments[0]
                          ?.departure
                      ).format("yyyy-MM-DD")
                ),
                { months: 6 }
              )
            )
          )
        );
      }
    });

    if (allPassengerInfoValid) {
      bookingApiCall();
    } else {
      toast.error("Form validation failed!");
    }
  };

  const handlePassportFileUpload = (flag, index, file) => {
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
    } else {
      var formData = new FormData();
      formData.append(`file`, file);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          // Authorization: "Bearer " + tokenData?.token,
        },
      };
      const postData = async () => {
        const response = await groupFareUploadFile(
          formData,
          config,
          "passport"
        );
        if (response.data.isSuccess === true) {
          if (flag === 1) {
            setPassenger((ob) =>
              produce(ob, (v) => {
                if (v.adult.length > 0) {
                  v.adult[index].passportCopy = response.data.data;
                }
              })
            );
          } else if (flag === 2) {
            setPassenger((ob) =>
              produce(ob, (v) => {
                if (v.child.length > 0) {
                  v.child[index].passportCopy = response.data.data;
                }
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

  const handleVisaFileUpload = (flag, index, file) => {
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
    } else {
      var formData = new FormData();
      formData.append(`file`, file);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          // Authorization: "Bearer " + tokenData?.token,
        },
      };
      const postData = async () => {
        const response = await groupFareUploadFile(formData, config, "visa");
        if (response.data.isSuccess === true) {
          if (flag === 1) {
            setPassenger((ob) =>
              produce(ob, (v) => {
                if (v.adult.length > 0) {
                  v.adult[index].visaCopy = response.data.data;
                }
              })
            );
          } else if (flag === 2) {
            setPassenger((ob) =>
              produce(ob, (v) => {
                if (v.child.length > 0) {
                  v.child[index].visaCopy = response.data.data;
                }
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

  const handleExcelFileChange = (event) => {
    const file = event.target.files[0];
    const validExtensions = ["xlsx", "xls"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (validExtensions.includes(fileExtension)) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const excelDateToJSDate = (serial) => {
            if (serial) {
              const utcDays = serial - 25569;
              const utcDate = utcDays * 86400;
              return new Date(utcDate * 1000);
            }
            return null;
          };

          const processPassengerData = (passengerType) =>
            jsonData
              .filter((row) => row["Passenger Type"] === passengerType)
              .map((row) => {
                const baseData = {
                  passengerType: row["Passenger Type"],
                  title: row["Title"],
                  first: row["First Name"],
                  last: row["Last Name"],
                  gender: row["Gender"],
                  dateOfBirth: row["Date Of Birth (MM/DD/YYYY)"]
                    ? excelDateToJSDate(row["Date Of Birth (MM/DD/YYYY)"])
                    : null,
                  nationality: row["Nationality"],
                  frequentFlayerNumber: row["Frequent Flayer Number"],
                  email: row["Email"],
                  phone: row["Phone"],
                  expireDate: row["Passport Expiry Date  (MM/DD/YYYY)"]
                    ? excelDateToJSDate(
                        row["Passport Expiry Date  (MM/DD/YYYY)"]
                      )
                    : null,
                  documentNumber: row["Passport Number"],
                  documentIssuingCountry: row["Passport Issuing Country"],
                  groupFareId:
                    selectedFlightData?.seclectedFlight?.groupFareFlight?.id,
                  isLeadPax: true,
                  passportCopy: "",
                  visaCopy: "",
                  isPassportS3: null,
                  isVisaS3: null,
                  isQuickPassenger: false,
                  cityName: "",
                  documentType: null,
                  phoneCountryCode: "+" + row["Country Code"],
                };
                return baseData;
              });

          const adultDataFromExcel = processPassengerData("ADT");
          const childDataFromExcel = processPassengerData("CHD");

          setPassenger((prevState) => {
            const currentAdultData = prevState.adult;
            const currentChildData = prevState.child;

            const updatedAdults =
              currentAdultData.length > adultDataFromExcel.length
                ? [
                    ...adultDataFromExcel,
                    ...currentAdultData.slice(adultDataFromExcel.length),
                  ]
                : adultDataFromExcel.slice(0, currentAdultData.length);

            const updatedChildren =
              currentChildData.length > childDataFromExcel.length
                ? [
                    ...childDataFromExcel,
                    ...currentChildData.slice(childDataFromExcel.length),
                  ]
                : childDataFromExcel.slice(0, currentChildData.length);

            return {
              ...prevState,
              adult: updatedAdults,
              child: updatedChildren,
            };
          });
        } catch (error) {
          console.error("Error processing file:", error);
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      console.error("Invalid file type. Please upload an Excel file.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="search-panel-bg">
        <section className="content-header"></section>
        <div className="content-wrapper search-panel-bg">
          <ToastContainer position="bottom-right" autoClose={1500} />
          <section className="content">
            <div className="container-fluid pt-2 pb-5">
              <div className="row mx-lg-4 mx-md-4 mx-sm-1 pb-5">
                <div className="col-lg-8">
                  <div className="col-lg-12">
                    <div className="card box-shadow">
                      <div className="card-body border">
                        <div style={{ fontSize: "small" }}>
                          <div className="d-flex justify-content-between">
                            <div className="form-group">
                              <label htmlFor="excelUpload" className="fw-bold">
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
                            <div className="form-group">
                              <label htmlFor="excelUpload" className="fw-bold">
                                Upload Excel File
                              </label>
                              <input
                                type="file"
                                id="excelUpload"
                                className="form-control border-radius"
                                accept=".xls,.xlsx"
                                onChange={handleExcelFileChange} // handle the file upload
                              />
                            </div>
                          </div>
                          <div className="text-center my-2">
                            <p>
                              You can fillup PAX info manually otherwise fillup
                              with excel file.
                            </p>
                            <p className="text-danger">
                              Tickets are NON-REFUNDABLE, NON-CHANGABLE.
                            </p>
                          </div>
                          <h5 className="text-color fw-bold text-start pb-3">
                            Enter passenger details
                          </h5>
                          <form>
                            <div
                              class="accordion"
                              id="accordionPanelsStayOpenExample"
                            >
                              {passenger.adult.length > 0 &&
                                passenger.adult.map((item, index) => {
                                  return (
                                    <React.Fragment key={index}>
                                      <AdultForm
                                        index={index}
                                        item={item}
                                        setPassenger={setPassenger}
                                        passenger={passenger.adult ?? []}
                                        submitBtnClick={submitBtnClick}
                                        isDomestic={
                                          selectedFlightData?.domestic
                                        }
                                        flightSegments={
                                          selectedFlightData?.seclectedFlight
                                            ?.flightSegments ?? []
                                        }
                                        handlePassportFileUpload={
                                          handlePassportFileUpload
                                        }
                                        handleVisaFileUpload={
                                          handleVisaFileUpload
                                        }
                                      />
                                    </React.Fragment>
                                  );
                                })}
                              {passenger.child.length > 0 &&
                                passenger.child.map((item, index) => {
                                  return (
                                    <React.Fragment key={index}>
                                      <ChildForm
                                        index={index}
                                        item={item}
                                        setPassenger={setPassenger}
                                        passenger={passenger.child ?? []}
                                        submitBtnClick={submitBtnClick}
                                        isDomestic={selectedFlightData.domestic}
                                        flightSegments={
                                          selectedFlightData?.seclectedFlight
                                            ?.flightSegments ?? []
                                        }
                                        handlePassportFileUpload={
                                          handlePassportFileUpload
                                        }
                                        handleVisaFileUpload={
                                          handleVisaFileUpload
                                        }
                                        adultCount={passenger.adult.length}
                                      />
                                    </React.Fragment>
                                  );
                                })}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <SummaryCard
                    selectedFlightData={selectedFlightData}
                    onClick={handleButtonClick}
                    bookingBtnLoader={bookingBtnLoader}
                    setPayment={setPayment}
                    payment={payment}
                    setAgentRemarks={setAgentRemarks}
                    agentRemarks={agentRemarks}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default PaxCart;
