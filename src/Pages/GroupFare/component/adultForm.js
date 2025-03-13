import produce from "immer";
import React from "react";
import CustomInput from "./customInput";
import { Box } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import CustomSelect from "./customSelect";
import { ISODateFormatter } from "../../../common/functions";
import { calculateFullAge, checkValidation } from "../../../common/groupFare";
import { add } from "date-fns";
import moment from "moment";
import courtries from "../../../JSON/countries.json";

const AdultForm = ({
  index,
  item,
  setPassenger,
  submitBtnClick,
  passenger,
  isDomestic,
  flightSegments,
  handlePassportFileUpload,
  handleVisaFileUpload,
}) => {
  const isUnderage = (dateOfBirth, journeyType) => {
    const thresholdDate = ISODateFormatter(
      add(
        new Date(
          journeyType === "Round Trip"
            ? moment(flightSegments[1]?.arrival).format("yyyy-MM-DD")
            : moment(flightSegments[0]?.departure).format("yyyy-MM-DD")
        ),
        { years: -12 }
      )
    );
    return moment(dateOfBirth).isAfter(thresholdDate);
  };

  const isPassportExpiringSoon = (expireDate, journeyType) => {
    const thresholdDate = ISODateFormatter(
      add(
        new Date(
          journeyType === "Round Trip"
            ? moment(
                flightSegments[flightSegments.length - 1]?.departure
              ).format("yyyy-MM-DD")
            : moment(flightSegments[0]?.departure).format("yyyy-MM-DD")
        ),
        { months: 6 }
      )
    );
    return moment(expireDate).isBefore(thresholdDate);
  };
  const renderWarningIcon = () => (
    <span className="text-danger ms-2">
      <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
    </span>
  );

  const ValidationWarnings = () => {
    if (!submitBtnClick) return null;

    if (!checkValidation(passenger, index, isDomestic)) {
      return renderWarningIcon();
    }

    if (isUnderage(item.dateOfBirth, flightSegments[0]?.journeyType)) {
      return renderWarningIcon();
    }

    if (
      !isDomestic &&
      isPassportExpiringSoon(item?.expireDate, flightSegments[0]?.journeyType)
    ) {
      return renderWarningIcon();
    }

    return null;
  };

  return (
    <div className="accordion-item">
      <h2
        className="accordion-header"
        id={"panelsStayOpen-headingOne-adult" + index}
      >
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={"#panelsStayOpen-collapseOne-adult" + index}
          aria-expanded="true"
          aria-controls="panelsStayOpen-collapseOne"
        >
          Adult {index + 1} {submitBtnClick}
          <ValidationWarnings />
        </button>
      </h2>
      <div
        id={"panelsStayOpen-collapseOne-adult" + index}
        className={
          index == 0
            ? "accordion-collapse collapse show"
            : "accordion-collapse collapse"
        }
        aria-labelledby={"panelsStayOpen-headingOne-adult" + index}
      >
        <div className="accordion-body">
          <div className="row">
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="form-group">
                <label className="form-label float-start fw-bold">
                  First name <span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="firstName"
                    className="form-control w-25"
                    value={item.title}
                    disabled
                    autocomplete="none"
                    style={{
                      borderStartStartRadius: "8px",
                      borderEndStartRadius: "8px",
                    }}
                  />
                  <input
                    type="text"
                    name="firstName"
                    className="form-control w-75"
                    onChange={(e) => {
                      const first = e.target.value;
                      const re = /^[a-zA-Z ]*$/;
                      if (re.test(first)) {
                        setPassenger((ob) =>
                          produce(ob, (v) => {
                            if (v.adult.length > 0) {
                              v.adult[index].first = first;
                            }
                          })
                        );
                      } else {
                      }
                    }}
                    value={item.first}
                    required
                    autocomplete="none"
                    spellcheck="false"
                    placeholder="first name"
                    style={{
                      borderStartEndRadius: "8px",
                      borderEndEndRadius: "8px",
                    }}
                  />
                  {item.first === "" && submitBtnClick && (
                    <span className="text-danger" style={{ fontSize: "12px" }}>
                      please enter first name
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12">
              <CustomInput
                labelName={"Last name"}
                name={"lastName"}
                type={"text"}
                placeholder={"last name"}
                onChange={(e) => {
                  const last = e.target.value;
                  const re = /^[a-zA-Z ]*$/;
                  if (re.test(last)) {
                    setPassenger((ob) =>
                      produce(ob, (v) => {
                        if (v.adult.length > 0) {
                          v.adult[index].last = last;
                        }
                      })
                    );
                  } else {
                  }
                }}
                value={item.last}
                require={true}
                submitBtnClick={submitBtnClick}
                message={"please enter last name"}
              />
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="form-group">
                <label
                  className={
                    item.gender === "Female"
                      ? "form-label float-start fw-bold mb-0"
                      : "form-label float-start fw-bold"
                  }
                  type=""
                >
                  Gender <span className="text-danger">*</span>
                  {item.gender === "Female" ? (
                    <>
                      <span className="ms-4">
                        <span className="me-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={"inlineRadioOptions2" + index}
                            id={"radio1" + index}
                            value="option1"
                            defaultChecked
                            onClick={(e) => {
                              setPassenger((ob) =>
                                produce(ob, (v) => {
                                  if (v.adult.length > 0) {
                                    v.adult[index].title = "Ms";
                                  }
                                })
                              );
                            }}
                          />
                          <label
                            className="ms-1"
                            style={{
                              fontWeight: "400",
                            }}
                            for={"radio1" + index}
                          >
                            Ms
                          </label>
                        </span>
                        <span className="ms-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={"inlineRadioOptions2" + index}
                            id={"radio2" + index}
                            value="option2"
                            onClick={(e) => {
                              setPassenger((ob) =>
                                produce(ob, (v) => {
                                  if (v.adult.length > 0) {
                                    v.adult[index].title = "Mrs";
                                  }
                                })
                              );
                            }}
                          />
                          <label
                            className="ms-1"
                            style={{
                              fontWeight: "400",
                            }}
                            for={"radio2" + index}
                          >
                            Mrs
                          </label>
                        </span>
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </label>
                <div className="input-group mb-3">
                  <select
                    name="gender"
                    className="form-select border-radius"
                    onChange={(e) => {
                      const gender = e.target.value;
                      setPassenger((ob) =>
                        produce(ob, (v) => {
                          if (v.adult.length > 0) {
                            v.adult[index].gender = gender;
                          }
                        })
                      );
                      setPassenger((ob) =>
                        produce(ob, (v) => {
                          if (v.adult.length > 0) {
                            v.adult[index].title = "Male" ? "Mr" : "Ms";
                          }
                        })
                      );
                    }}
                    value={item.gender}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {isDomestic ? (
            <>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="form-label float-start fw-bold" type="">
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
                            item.dateOfBirth && new Date(item.dateOfBirth)
                          }
                          onChange={(date, e) => {
                            if (e.target.value?.length === 10) {
                              setPassenger((ob) =>
                                produce(ob, (v) => {
                                  if (v.adult.length > 0) {
                                    v.adult[index].dateOfBirth = date;
                                  }
                                })
                              );
                            } else if (
                              e.target.value?.length === undefined ||
                              e.target.value?.length === 0
                            ) {
                              date !== "" &&
                                setPassenger((ob) =>
                                  produce(ob, (v) => {
                                    if (v.adult.length > 0) {
                                      v.adult[index].dateOfBirth = date;
                                    }
                                  })
                                );
                            }
                          }}
                          maxDate={add(
                            new Date(
                              flightSegments[0]?.journeyType === "Round Trip" &&
                              calculateFullAge(
                                flightSegments[0]?.departure,
                                flightSegments[1]?.arrival
                              )
                                ? moment(flightSegments[1]?.arrival).format(
                                    "yyyy-MM-DD"
                                  )
                                : moment(flightSegments[0]?.departure).format(
                                    "yyyy-MM-DD"
                                  )
                            ),
                            {
                              years: -12,
                            }
                          )}
                          placeholderText="dd/mm/yyyy"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          onKeyDown={(e) =>
                            ["-"].includes(e.key) && e.preventDefault()
                          }
                        />
                      </Box>
                      {!item.dateOfBirth && submitBtnClick && (
                        <span
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          Please enter DOB
                        </span>
                      )}
                      {moment(item.dateOfBirth).isAfter(
                        ISODateFormatter(
                          add(
                            new Date(
                              flightSegments[0]?.journeyType === "Round Trip" &&
                              calculateFullAge(
                                flightSegments[0]?.departure,
                                flightSegments[1]?.arrival
                              )
                                ? moment(flightSegments[1]?.arrival).format(
                                    "yyyy-MM-DD"
                                  )
                                : moment(flightSegments[0]?.departure).format(
                                    "yyyy-MM-DD"
                                  )
                            ),
                            { years: -12 }
                          )
                        )
                      ) && (
                        <span
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          Date of birth not valid!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <CustomInput
                    name={"email"}
                    type={"email"}
                    labelName={"Email"}
                    value={item.email}
                    onChange={(e) => {
                      const email = e.target.value;
                      setPassenger((ob) =>
                        produce(ob, (v) => {
                          if (v.adult.length > 0) {
                            v.adult[index].email = email;
                          }
                        })
                      );
                    }}
                    placeholder={"email address"}
                    require={true}
                    submitBtnClick={submitBtnClick}
                    message={"please enter email"}
                  />
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="form-label float-start fw-bold" type="">
                      {"Country Code"}
                      {require && <span className="text-danger">*</span>}
                    </label>
                    <div className="input-group mb-3">
                      <select
                        name={"dialCode"}
                        className="form-select border-radius"
                        onChange={(e) => {
                          const phoneCountryCode = e.target.value;
                          setPassenger((ob) =>
                            produce(ob, (v) => {
                              if (v.adult.length > 0) {
                                v.adult[index].phoneCountryCode =
                                  phoneCountryCode;
                              }
                            })
                          );
                        }}
                        value={item.phoneCountryCode}
                        required
                      >
                        <option value="+88">+88</option>
                        {courtries.map((item, index) => {
                          return (
                            <option key={index} value={item.dial_code}>
                              {item.dial_code}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <CustomInput
                    name={"phone"}
                    type={"number"}
                    labelName={"Phone"}
                    value={item.phone}
                    onChange={(e) => {
                      const phone = e.target.value;
                      setPassenger((ob) =>
                        produce(ob, (v) => {
                          if (v.adult.length > 0) {
                            v.adult[index].phone = phone;
                          }
                        })
                      );
                    }}
                    placeholder={"phone number"}
                    require={true}
                    submitBtnClick={submitBtnClick}
                    message={"please enter phone"}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="form-label float-start fw-bold" type="">
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
                            item.dateOfBirth && new Date(item.dateOfBirth)
                          }
                          onChange={(date, e) => {
                            if (e.target.value?.length === 10) {
                              setPassenger((ob) =>
                                produce(ob, (v) => {
                                  if (v.adult.length > 0) {
                                    v.adult[index].dateOfBirth = date;
                                  }
                                })
                              );
                            } else if (
                              e.target.value?.length === undefined ||
                              e.target.value?.length === 0
                            ) {
                              date !== "" &&
                                setPassenger((ob) =>
                                  produce(ob, (v) => {
                                    if (v.adult.length > 0) {
                                      v.adult[index].dateOfBirth = date;
                                    }
                                  })
                                );
                            }
                          }}
                          maxDate={add(
                            new Date(
                              flightSegments[0]?.journeyType === "Round Trip" &&
                              calculateFullAge(
                                flightSegments[0]?.departure,
                                flightSegments[1]?.arrival
                              )
                                ? moment(flightSegments[1]?.arrival).format(
                                    "yyyy-MM-DD"
                                  )
                                : moment(flightSegments[0]?.departure).format(
                                    "yyyy-MM-DD"
                                  )
                            ),
                            {
                              years: -12,
                            }
                          )}
                          placeholderText="dd/mm/yyyy"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          onKeyDown={(e) =>
                            ["-"].includes(e.key) && e.preventDefault()
                          }
                        />
                      </Box>
                      {!item.dateOfBirth && submitBtnClick && (
                        <span
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          Please enter DOB
                        </span>
                      )}
                      {moment(item.dateOfBirth).isAfter(
                        ISODateFormatter(
                          add(
                            new Date(
                              flightSegments[0]?.journeyType === "Round Trip" &&
                              calculateFullAge(
                                flightSegments[0]?.departure,
                                flightSegments[1]?.arrival
                              )
                                ? moment(flightSegments[1]?.arrival).format(
                                    "yyyy-MM-DD"
                                  )
                                : moment(flightSegments[0]?.departure).format(
                                    "yyyy-MM-DD"
                                  )
                            ),
                            { years: -12 }
                          )
                        )
                      ) && (
                        <span
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          Date of birth not valid!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <CustomInput
                    name={"flyerNumber"}
                    type={"text"}
                    labelName={"Frequent flyer number(If any)"}
                    placeholder={"frequent flyer number"}
                    onChange={(e) => {
                      const frequentFlayerNumber = e.target.value;
                      setPassenger((ob) =>
                        produce(ob, (v) => {
                          if (v.adult.length > 0) {
                            v.adult[index].frequentFlayerNumber =
                              frequentFlayerNumber;
                          }
                        })
                      );
                    }}
                    value={item.frequentFlayerNumber}
                  />
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <CustomSelect
                    name={"nationality"}
                    labelName={"Nationality"}
                    value={item.nationality}
                    onChange={(e) => {
                      const nationality = e.target.value;
                      setPassenger((ob) =>
                        produce(ob, (v) => {
                          if (v.adult.length > 0) {
                            v.adult[index].nationality = nationality;
                          }
                        })
                      );
                    }}
                    require={true}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <CustomInput
                    name={"email"}
                    type={"email"}
                    labelName={"Email"}
                    value={item.email}
                    onChange={(e) => {
                      const email = e.target.value;
                      setPassenger((ob) =>
                        produce(ob, (v) => {
                          if (v.adult.length > 0) {
                            v.adult[index].email = email;
                          }
                        })
                      );
                    }}
                    placeholder={"email address"}
                    require={true}
                    submitBtnClick={submitBtnClick}
                    message={"please enter email"}
                  />
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="form-label float-start fw-bold" type="">
                      {"Country Code"}
                      {require && <span className="text-danger">*</span>}
                    </label>
                    <div className="input-group mb-3">
                      <select
                        name={"dialCode"}
                        className="form-select border-radius"
                        onChange={(e) => {
                          const phoneCountryCode = e.target.value;
                          setPassenger((ob) =>
                            produce(ob, (v) => {
                              if (v.adult.length > 0) {
                                v.adult[index].phoneCountryCode =
                                  phoneCountryCode;
                              }
                            })
                          );
                        }}
                        value={item.phoneCountryCode}
                        required
                      >
                        <option value="+88">+88</option>
                        {courtries.map((item, index) => {
                          return (
                            <option key={index} value={item.dial_code}>
                              {item.dial_code}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <CustomInput
                    name={"phone"}
                    type={"number"}
                    labelName={"Phone"}
                    value={item.phone}
                    onChange={(e) => {
                      const phone = e.target.value;
                      setPassenger((ob) =>
                        produce(ob, (v) => {
                          if (v.adult.length > 0) {
                            v.adult[index].phone = phone;
                          }
                        })
                      );
                    }}
                    placeholder={"phone number"}
                    require={true}
                    submitBtnClick={submitBtnClick}
                    message={"please enter phone"}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <CustomInput
                    name={"passportNumber"}
                    type={"text"}
                    labelName={"Passport Number"}
                    value={item.documentNumber}
                    onChange={(e) => {
                      const documentNumber = e.target.value;
                      setPassenger((ob) =>
                        produce(ob, (v) => {
                          if (v.adult.length > 0) {
                            v.adult[index].documentNumber = documentNumber;
                          }
                        })
                      );
                    }}
                    require={true}
                    placeholder={"passport number"}
                    submitBtnClick={submitBtnClick}
                    message={"please enter passport number"}
                  />
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
                          item.expireDate &&
                          new Date(ISODateFormatter(item.expireDate))
                        }
                        onChange={(date) =>
                          date !== "" &&
                          setPassenger((ob) =>
                            produce(ob, (v) => {
                              if (v.adult.length > 0) {
                                v.adult[index].expireDate = date;
                              }
                            })
                          )
                        }
                        maxDate={new Date("2199-12-30")}
                        minDate={add(
                          new Date(
                            flightSegments[0]?.journeyType === "Round Trip"
                              ? moment(
                                  flightSegments[flightSegments?.length - 1]
                                    ?.departure
                                ).format("yyyy-MM-DD")
                              : moment(flightSegments[0]?.departure).format(
                                  "yyyy-MM-DD"
                                )
                          ),
                          { months: 6 }
                        )}
                        placeholderText="dd/mm/yyyy"
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
                    {!item.expireDate && submitBtnClick && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "12px" }}
                      >
                        Please enter expiry date
                      </span>
                    )}
                    {moment(item?.expireDate).isBefore(
                      ISODateFormatter(
                        add(
                          new Date(
                            flightSegments[0]?.journeyType === "Round Trip"
                              ? moment(
                                  flightSegments[flightSegments?.length - 1]
                                    ?.departure
                                ).format("yyyy-MM-DD")
                              : moment(flightSegments[0]?.departure).format(
                                  "yyyy-MM-DD"
                                )
                          ),
                          { months: 6 }
                        )
                      )
                    ) && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "12px" }}
                      >
                        Your passport expiry date is less than 6 months
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <CustomSelect
                    name={"issuingCountry"}
                    labelName={"Issuing country"}
                    value={item.documentIssuingCountry}
                    onChange={(e) => {
                      const issuingCountry = e.target.value;
                      setPassenger((ob) =>
                        produce(ob, (v) => {
                          if (v.adult.length > 0) {
                            v.adult[index].documentIssuingCountry =
                              issuingCountry;
                          }
                        })
                      );
                    }}
                    require={true}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label
                      className="form-label float-start fw-bold"
                      htmlFor=""
                    >
                      Passport Copy <span className="text-danger">*</span>
                    </label>
                    <input
                      type={"file"}
                      className={
                        item.passportCopy
                          ? "form-control mr-1 border-radius"
                          : "form-control border-radius"
                      }
                      id={"adultpassport" + index}
                      onChange={(e) =>
                        handlePassportFileUpload(1, index, e.target.files[0])
                      }
                      accept=".jpg, .jpeg, .png, .pdf"
                      required
                    />
                    {!item.passportCopy && submitBtnClick && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "12px" }}
                      >
                        Please enter passport copy
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
                      Visa Copy <span className="text-danger">*</span>
                    </label>
                    <input
                      type={"file"}
                      className={
                        item.visaCopy
                          ? "form-control mr-1 border-radius"
                          : "form-control border-radius"
                      }
                      id={"adultpassport" + index}
                      accept=".jpg, .jpeg, .png, .pdf"
                      onChange={(e) =>
                        handleVisaFileUpload(1, index, e.target.files[0])
                      }
                      required
                    />
                    {!item.visaCopy && submitBtnClick && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "12px" }}
                      >
                        Please enter visa copy
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdultForm;
