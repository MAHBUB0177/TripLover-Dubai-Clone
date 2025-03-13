import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registration.css";
import logo from "../../../images/logo/logo-combined.png";
import courtries from "../../../JSON/countries.json";
import axios from "axios";
import { environment } from "../../SharePages/Utility/environment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Center, Divider, Text } from "@chakra-ui/react";
import Footer from "../../SharePages/Footer/Footer";
import { Flex, Image, VStack, Circle } from "@chakra-ui/react";
import flightsImg from "../../../images/landing/flights.png";
import hotlelsImg from "../../../images/landing/hotels.png";
import holidaysImg from "../../../images/landing/holidays.png";
import visaProcessingImg from "../../../images/landing/visa-processing.png";
import airlines1 from "../../../images/landing/airlines-1.png";
import airlines2 from "../../../images/landing/airlines-2.png";
import airlines3 from "../../../images/landing/airlines-3.png";
import airlines4 from "../../../images/landing/airlines-4.png";
import airlines5 from "../../../images/landing/airlines-5.png";
import airlines6 from "../../../images/landing/airlines-6.png";
import { nanoid } from "nanoid";
import { fileUpload } from "../../../common/allApi";
import { Partners } from "../../SharePages/Footer/Partners";
import Service from "../../SharePages/Footer/Service";

const Registration = () => {
  const navigate = useNavigate();
  let [countryName, setCountryName] = useState("United Arab Emirates");
  let [zoneList, setZoneList] = useState([]);
  let [agentDialCode, setAgentDialCode] = useState("+971");
  let [agentName, setAgentName] = useState("");
  const [lastName, setLastName] = useState("");
  let [agentPhoneNo, setAgentPhoneNo] = useState("");
  let [agentEmail, setAgentEmail] = useState("");
  let [agentAddress, setAgentAddress] = useState("");
  let [userDialCode, setUserDialCode] = useState("+971");
  let [userFullName, setUserFullName] = useState("");
  let [userPhoneNo, setUserPhoneNo] = useState("");
  let [userEmail, setUserEmail] = useState("");
  let [userPassword, setUserPassword] = useState("");
  let [userConfirmPassword, setUserConfirmPassword] = useState("");
  let [postalCode, setPostalCode] = useState("");
  let [zoneId, setZoneId] = useState(null);
  let [cityList, setCityList] = useState([]);
  let [cityId, setCityId] = useState(null);
  let [loading, setLoading] = useState(false);
  const [nid, setNid] = useState("");
  const [tradeLisence, setTradeLisence] = useState("");
  const [ownerPicture, setOwnerPicture] = useState("");
  const [civilAviation, setCivilAviation] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordCanShown, setPasswordCanShown] = useState(false);
  const getZoneData = async (countryName) => {
    const responseZ = await axios.get(
      environment.getzoneListbycountryName + "/" + countryName
    );
    if (responseZ.data.length > 0) {
      setZoneList(responseZ.data);
    }
  };
  const getCityData = async (countryName) => {
    const response = await axios.get(
      environment.getcityListbycountryName + "/" + countryName
    );
    if (response.data.length > 0) {
      setCityList(response.data);
    }
  };
  // useEffect(() => {
  //   getZoneData("Bangladesh");
  //   getCityData("Bangladesh");
  // }, []);

  useEffect(() => {
    getZoneData("United Arab Emirates");
    getCityData("United Arab Emirates");
  }, []);
  const handleCountryChange = (e) => {
    setCountryName(e.target.value);
    setAgentDialCode(
      courtries.find((i) => i.name === e.target.value).dial_code
    );
    setUserDialCode(courtries.find((i) => i.name === e.target.value).dial_code);
    getZoneData(e.target.value);
    getCityData(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,32}$/;
    const regexForEmail = /[a-zA-Z0-9_\.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/;
    if (countryName === "") {
      toast.error("Sorry! Country is not selected");
      return;
    }
    if (postalCode === "") {
      toast.error("Sorry! Postal Code is empty");
      return;
    }
    if (cityId === null) {
      toast.error("Sorry! City is not selected");
      return;
    }
    if (agentName == "") {
      toast.error("Sorry! Agency Name (as per MoCAT Licence) is empty");
      return;
    }
    if (userFullName == "") {
      toast.error("Sorry! Agency Owner's first name is empty");
      return;
    }
    if (lastName == "") {
      toast.error("Sorry! Agency Owner's last name is empty");
      return;
    }
    if (userEmail == "") {
      toast.error("Sorry! Email is empty");
      return;
    }
    if (!regexForEmail.test(userEmail)) {
      toast.error("Invalid Email address");
      return;
    }
    if (agentEmail == "") {
      toast.error("Sorry! Owner's email is empty");
      return;
    }
    if (!regexForEmail.test(agentEmail)) {
      toast.error("Invalid Owner's email address");
      return;
    }
    if (userPassword == "") {
      toast.error("Sorry! Password is empty");
      return;
    }
    if (re.test(userPassword) === false) {
      toast.error(
        "Passwprd must one uppercase letter, lowercase letter, number, special character and 8 length",
        {
          className: "toast-message",
        }
      );
      return;
    }
    if (userConfirmPassword == "") {
      toast.error("Sorry! Confirm password is empty");
      return;
    }
    if (userPassword !== userConfirmPassword) {
      toast.error("Sorry! Password does not same");
      return;
    }

    let registerObj = {
      CountryName: countryName,
      ZoneId: zoneId,
      CityId: cityId,
      PostalCode: postalCode,
      FullName:
        userFullName.trim().replace(/\s+/g, " ") +
        " " +
        lastName.trim().replace(/\s+/g, " "),
      DialCode: userDialCode,
      Mobile: userPhoneNo,
      Email: userEmail.toLowerCase(),
      Password: userPassword,
      ConfirmPassword: userConfirmPassword,
      RoleId: 2,
      AgentName: agentName,
      AgentDialCode: agentDialCode,
      AlternativeMobileNo: agentPhoneNo,
      AlternativeEmail: agentEmail.toLowerCase(),
      AgentAddress: agentAddress,
      IsActive: false,
      UploadedFileTradeLisenceName: tradeLisence,
      UploadedNidFrontName: nid,
      OwnersProfilePicture: ownerPicture,
      AviationLicense: civilAviation,
    };
    const postData = async () => {
      setLoading(true);
      const response = await axios.post(environment.register, registerObj);
      if (response.data.isSuccess == true) {
        toast.success("Thanks! Registration successfully submited..");
        document.getElementById("reset").reset();
        navigate("/regsuccess");
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    };
    postData();
    e.preventDefault();
  };

  const ourServiceData = [
    { text: "Flights", img: flightsImg },
    { text: "Hotels", img: hotlelsImg },
    { text: "Holiday", img: holidaysImg },
    { text: "Visa Processing", img: visaProcessingImg },
  ];

  const topAirlinesData = [
    { img: airlines1 },
    { img: airlines2 },
    { img: airlines3 },
    { img: airlines4 },
    { img: airlines5 },
    { img: airlines6 },
  ];

  // file upload function
  const registrationUploadFile = async (file, uploadType) => {
    const formData = new FormData();
    const fileExt = file?.name.split(".").pop().toLowerCase();
    if (
      !(
        fileExt === "jpg" ||
        fileExt === "jpeg" ||
        fileExt === "png" ||
        fileExt === "pdf"
      )
    ) {
      toast.error("Sorry! Invalid file type..");
    } else {
      formData.append("file", file);
      setLoading(true);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      try {
        const res = await fileUpload(formData, config, uploadType); // Corrected await usage
        if (uploadType === "TradeLisence") {
          setTradeLisence(res?.data?.data);
        } else if (uploadType === "NidFront") {
          setNid(res?.data?.data);
        } else if (uploadType === "OwnerPicture") {
          setOwnerPicture(res?.data?.data);
        } else if (uploadType === "CivilAviationCertificate") {
          setCivilAviation(res?.data?.data);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <VStack>
        <div className="hold-transition py-5  mb-5">
          <Box
            className="container"
            // ml={{ base: "0px", lg: "180px" }}
            // mr={{ base: "0px", lg: "180px" }}
          >
            <div
              className="row justify-content-center"
              style={{ minWidth: "80%" }}
            >
              <ToastContainer position="bottom-right" autoClose={1500} />

              <div className="card">
                <div className="card-header text-center">
                  <div className="row">
                    <div className="col-lg-2">
                      <Link to="/">
                        <img src={logo} alt="Triplover" width="160px" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-body login-card-body">
                  <form onSubmit={handleSubmit} id="reset">
                    <div className="container-fluid">
                      <div className="card">
                        <Box
                          className="card-header text-dark fw-bold text-white"
                          bg="#7c04c0"
                        >
                          Account Information
                        </Box>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-lg-6">
                              <p className="text-start">
                                {/* Name of the company  */}
                                Agency Name (as per MoCAT Licence)
                                <span className="text-danger">*</span>
                              </p>
                              <input
                                type="text"
                                className="form-control border-radius"
                                placeholder="Agency Name (as per MoCAT Licence)"
                                onChange={(e) => setAgentName(e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-lg-3">
                              <p className="text-start">
                                Agency Owner's First Name{" "}
                                <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="First Name"
                                  onChange={(e) =>
                                    setUserFullName(e.target.value)
                                  }
                                  required
                                  style={{
                                    borderStartStartRadius: "8px",
                                    borderEndStartRadius: "8px",
                                  }}
                                />
                                <div className="input-group-append">
                                  <div className="input-group-text">
                                    <span className="fas fa-user"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <p className="text-start">
                                Agency Owner's Last Name{" "}
                                <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Last Name"
                                  onChange={(e) => setLastName(e.target.value)}
                                  required
                                  style={{
                                    borderStartStartRadius: "8px",
                                    borderEndStartRadius: "8px",
                                  }}
                                />
                                <div className="input-group-append">
                                  <div className="input-group-text">
                                    <span className="fas fa-user"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <p className="text-start">
                                {" "}
                                Email <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="Email"
                                  onChange={(e) => setUserEmail(e.target.value)}
                                  required
                                  pattern="[a-zA-Z0-9_\.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$"
                                  style={{
                                    borderStartStartRadius: "8px",
                                    borderEndStartRadius: "8px",
                                  }}
                                />
                                <div className="input-group-append">
                                  <div className="input-group-text">
                                    <span className="fas fa-envelope"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <p className="text-start">
                                Mobile <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <select
                                  className="form-select col-lg-3"
                                  value={userDialCode}
                                  disabled="true"
                                  onChange={(e) =>
                                    setUserDialCode(e.target.value)
                                  }
                                  style={{
                                    borderStartStartRadius: "8px",
                                    borderEndStartRadius: "8px",
                                  }}
                                  aria-label="Country"
                                >
                                  {courtries.map((item, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={item.dial_code}
                                      >
                                        {item.dial_code}
                                      </option>
                                    );
                                  })}
                                </select>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Mobile Number"
                                  onChange={(e) =>
                                    setUserPhoneNo(e.target.value)
                                  }
                                  required
                                />
                                <div className="input-group-append">
                                  <div className="input-group-text">
                                    <span className="fas fa-phone"></span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <p className="text-start">
                                Owner's Email{" "}
                                <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="Email"
                                  onChange={(e) =>
                                    setAgentEmail(e.target.value)
                                  }
                                  style={{
                                    borderStartStartRadius: "8px",
                                    borderEndStartRadius: "8px",
                                  }}
                                  required
                                  pattern="[a-zA-Z0-9_\.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$"
                                />
                                <div className="input-group-append">
                                  <div className="input-group-text">
                                    <span className="fas fa-envelope"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <p className="text-start">
                                Owner's Mobile{" "}
                                <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <select
                                  className="form-select col-lg-3"
                                  value={agentDialCode}
                                  disabled="true"
                                  onChange={(e) =>
                                    setAgentDialCode(e.target.value)
                                  }
                                  aria-label="Country"
                                  style={{
                                    borderStartStartRadius: "8px",
                                    borderEndStartRadius: "8px",
                                  }}
                                >
                                  {courtries.map((item, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={item.dial_code}
                                      >
                                        {item.dial_code}
                                      </option>
                                    );
                                  })}
                                </select>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Mobile Number"
                                  onChange={(e) =>
                                    setAgentPhoneNo(e.target.value)
                                  }
                                  required
                                />

                                <div className="input-group-append">
                                  <div
                                    className="input-group-text"
                                    style={{
                                      borderStartEndRadius: "8px",
                                      borderEndEndRadius: "8px",
                                    }}
                                  >
                                    <span className="fas fa-phone"></span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-3">
                              <p className="text-start">
                                Password <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <input
                                  type={passwordShown ? "text" : "password"}
                                  className="form-control"
                                  placeholder="Password"
                                  onChange={(e) =>
                                    setUserPassword(e.target.value)
                                  }
                                  style={{
                                    borderStartStartRadius: "8px",
                                    borderEndStartRadius: "8px",
                                  }}
                                  required
                                />
                                <div className="input-group-append">
                                  <div className="input-group-text">
                                    <span
                                      className="fas fa-lock"
                                      onClick={() =>
                                        setPasswordShown(!passwordShown)
                                      }
                                    ></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <p className="text-start">
                                Confirm Password{" "}
                                <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <input
                                  type={passwordCanShown ? "text" : "password"}
                                  className="form-control"
                                  placeholder="Confirm Password"
                                  onChange={(e) =>
                                    setUserConfirmPassword(e.target.value)
                                  }
                                  style={{
                                    borderStartStartRadius: "8px",
                                    borderEndStartRadius: "8px",
                                  }}
                                  required
                                />
                                <div className="input-group-append">
                                  <div className="input-group-text">
                                    <span
                                      className="fas fa-lock"
                                      onClick={() =>
                                        setPasswordCanShown(!passwordCanShown)
                                      }
                                    ></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <p className="text-start">
                                Address <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Address"
                                  onChange={(e) =>
                                    setAgentAddress(e.target.value)
                                  }
                                  required
                                  style={{
                                    borderStartStartRadius: "8px",
                                    borderEndStartRadius: "8px",
                                  }}
                                />
                                <div className="input-group-append">
                                  <div className="input-group-text">
                                    <span className="fas fa-address-card"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <p className="text-start">
                                Country <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <select
                                  className="form-select border-radius"
                                  value={countryName}
                                  onChange={(e) => handleCountryChange(e)}
                                  aria-label="Country"
                                  disabled="true"
                                >
                                  {courtries.map((item, index) => {
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
                              <p className="text-start">
                                City <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <select
                                  className="form-select border-radius"
                                  aria-label="City"
                                  onChange={(e) => setCityId(e.target.value)}
                                >
                                  <option selected>Select City</option>
                                  {cityList.map((item, index) => {
                                    return (
                                      <option key={index} value={item.id}>
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <p className="text-start">
                                Postal Code{" "}
                                <span className="text-danger">*</span>
                              </p>
                              <div className="input-group mb-3">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Postal Code"
                                  onChange={(e) =>
                                    setPostalCode(e.target.value)
                                  }
                                  style={{
                                    borderStartStartRadius: "8px",
                                    borderEndStartRadius: "8px",
                                  }}
                                  required
                                />
                                <div className="input-group-append">
                                  <div className="input-group-text">
                                    <span className="fas fa-user"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-lg-1"></div> */}

                      <div className="card">
                        <Box
                          className="card-header text-dark text-white fw-bold"
                          bg="#7c04c0"
                        >
                          Required Documents
                        </Box>
                        <div className="card-body pb-3">
                          <div className="row">
                            <div className="col-lg-6 mb-3">
                              <p className="text-start">
                                Owner's Picture{" "}
                                <span className="text-danger">*</span>
                              </p>
                              <input
                                accept=".png, .jpg, .jpeg"
                                id=""
                                type="file"
                                name="File"
                                className="form-control border-radius"
                                required
                                onChange={(e) =>
                                  registrationUploadFile(
                                    e.target.files[0],
                                    "OwnerPicture"
                                  )
                                }
                              />
                            </div>
                            <div className="col-lg-6 mb-3">
                              <p className="text-start">
                                NID (Front & Back){" "}
                                <span className="text-danger">*</span>
                              </p>
                              <input
                                id=""
                                type="file"
                                name="File"
                                required
                                className="form-control border-radius"
                                onChange={(e) =>
                                  registrationUploadFile(
                                    e.target.files[0],
                                    "NidFront"
                                  )
                                }
                              />
                            </div>
                            <div className="col-lg-6 mb-3">
                              <p className="text-start">
                                Trade Licence{" "}
                                <span className="text-danger">*</span>
                              </p>
                              <input
                                id=""
                                type="file"
                                name="File"
                                className="form-control border-radius"
                                required
                                onChange={(e) =>
                                  registrationUploadFile(
                                    e.target.files[0],
                                    "TradeLisence"
                                  )
                                }
                              />
                            </div>

                            <div className="col-lg-6 mb-3">
                              <p className="text-start">
                                Ministry of Civil Aviation & Tourism Licence{" "}
                                <span className="text-danger">*</span>
                              </p>
                              <input
                                id=""
                                type="file"
                                name="File"
                                className="form-control border-radius"
                                required
                                onChange={(e) =>
                                  registrationUploadFile(
                                    e.target.files[0],
                                    "CivilAviationCertificate"
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-4 mt-4"></div>
                      <div className="col-lg-4 mt-4">
                        <button
                          type="submit"
                          className="btn text-white fw-bold btn-block mx-auto btn-sm w-lg-74 w-sm-50 "
                          disabled={loading ? true : false}
                        >
                          <Center
                            bg="gradient"
                            borderRadius="8px"
                            h="55px"
                            _hover={{ opacity: 0.9 }}
                          >
                            {loading ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : (
                              <Text color="white">Sign Up</Text>
                            )}
                          </Center>
                        </button>
                      </div>
                      <div className="col-lg-4 mt-4"></div>
                    </div>

                    <p className="my-2 font-size text-center">
                      Already have account?
                      <Link to="/">
                        <span
                          className="fw-bold ms-1"
                          style={{ color: "#7c04c0" }}
                        >
                          Sign In
                        </span>
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </Box>
        </div>

        <div className="arrow-container">
          <div className="arrow-down"></div>
        </div>

        <Text fontSize="21px" fontWeight={500} pt="60px">
          Our Services
        </Text>

        <Flex gap="60px" py="50px" flexWrap={"wrap"} justifyContent={"center"}>
          {ourServiceData.map((item) => (
            <VStack gap={"22px"} key={nanoid()}>
              <Circle
                bg="backgroundVariant"
                boxShadow=" 0px 11px 20px rgba(224, 239, 255, 0.32)"
                border="1px solid #ededed"
              >
                <Image
                  src={item.img}
                  alt="flights"
                  w="60px"
                  h="60px"
                  m="45px"
                />
              </Circle>
              <Text fontWeight={400} fontSize="16px" color="text">
                {item.text}
              </Text>
            </VStack>
          ))}
        </Flex>

        <Flex
        justifyContent={"center"}
        alignItems="center"
        gap={5}
        key={nanoid()}
      >
        
      </Flex>

           <Partners />
           <Service />
      </VStack>
      <Footer></Footer>
    </>
  );
};

export default Registration;
