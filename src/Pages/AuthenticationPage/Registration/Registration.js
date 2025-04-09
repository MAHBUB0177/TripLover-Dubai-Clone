import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registration.css";
import logo from "../../../images/logo/logo-combined.png";
import courtries from "../../../JSON/countries.json";
import axios from "axios";
import { environment } from "../../SharePages/Utility/environment";
import FooterLR from "../../Optional/FooterLR/FooterLR";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import { Box, Center, Text } from "@chakra-ui/react";
import Footer from "../../SharePages/Footer/Footer";
import {
  Flex,
  Image,
  Hide,
  Divider,
  VStack,
  Switch,
  Button,
  HStack,
  InputGroup,
  InputRightElement,
  Input,
  Heading,
  Circle,
} from "@chakra-ui/react";
import cardImage from "../../../images/landing/card.png";
import flightsImg from "../../../images/landing/flights.png";
import hotlelsImg from "../../../images/landing/hotels.png";
import holidaysImg from "../../../images/landing/holidays.png";
import visaProcessingImg from "../../../images/landing/visa-processing.png";
import airlines1 from "../../../images/landing/airlines-5.png";
import airlines2 from "../../../images/landing/airlines-6.png";
import airlines3 from "../../../images/landing/airlines-7.png";
import airlines4 from "../../../images/landing/airlines-8.png";
import { nanoid } from "nanoid";
import { Partners } from "../../SharePages/Footer/Partners";
import Service from "../../SharePages/Footer/Service";

const Registration = () => {
  const fullDetails = sessionStorage.getItem("full_details");
  const navigate = useNavigate();
  let [countryName, setCountryName] = useState("United Arab Emirates");
  let [zoneList, setZoneList] = useState([]);
  let [agentDialCode, setAgentDialCode] = useState("+971");
  let [agentName, setAgentName] = useState("");
  let [agentPhoneNo, setAgentPhoneNo] = useState("");
  let [agentEmail, setAgentEmail] = useState("");
  let [agentAddress, setAgentAddress] = useState("");
  let [agentContactPerson, setAgentContactPerson] = useState("");
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
  let [captchaValue, setCaptchaValue] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordCanShown, setPasswordCanShown] = useState(false);
  const getZoneData = async (countryName) => {
    const responseZ = await axios.get(
      environment.getzoneListbycountryName + "/" + countryName
    );
    if (responseZ.data.length > 0) {
      setZoneList(responseZ.data);

      console.log(zoneList);
    }
  };
  const getCityData = async (countryName) => {
    const response = await axios.get(
      environment.getcityListbycountryName + "/" + countryName
    );
    if (response.data.length > 0) {
      setCityList(response.data);

      console.log(cityList);
    }
  };
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
  // const location = useLocation();
  // const navigate = useNavigate();
  // const [loginData, setLoginData] = useState({});

  const handleSubmit = () => {
   
    const re =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,32}$/;
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
      toast.error("Sorry! Company name is empty");
      return;
    }
    if (userFullName == "") {
      toast.error("Sorry! Account name is empty");
      return;
    }
    if (!regexForEmail.test(userEmail)) {
      toast.error("Invalid user email address");
      return;
    }

    if (userEmail == "") {
      toast.error("Sorry! Account email is empty");
      return;
    }
    if (agentEmail == "") {
      toast.error("Sorry! Company email is empty");
      return;
    }

    if (!regexForEmail.test(agentEmail)) {
      toast.error("Invalid company email address");
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
    // if (captchaValue === "") {
    //   toast.error("Please selecte captcha");
    //   return;
    // }
    let registerObj = {
      CountryName: countryName,
      ZoneId: zoneId,
      CityId: cityId,
      PostalCode: postalCode,
      FullName: userFullName,
      DialCode: userDialCode,
      Mobile: userPhoneNo,
      Email: userEmail.toLowerCase(),
      Password: userPassword,
      ConfirmPassword: userConfirmPassword,
      RoleId: 2,
      AgentName: agentName,
      AgentDialCode: agentDialCode,
      AgentMobileNo: agentPhoneNo,
      AgentEmail: agentEmail.toLowerCase(),
      AgentAddress: agentAddress,
      IsActive: false,
    };
    const postData = async () => {
      setLoading(true);
      const response = await axios.post(environment.register, registerObj, {
        headers: {
            XLatitude: fullDetails ?? null
        }
    });
      if (response.data.isSuccess == true) {
        toast.success("Thanks! Registration successfully submited..");
        navigate("/regsuccess");
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    };
    postData();
  };



  return (
    <div>
      <VStack bg={'white'} position={'relative'}>
        <div className="hold-transition py-5 w-100 mb-5">
          <div
            className="login-box"
            style={{ minWidth: "70%", marginLeft: "15%" }}
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
                <form>
                  <div className="container-fluid">
                    <div className="row" style={{ paddingBottom: "10px" }}>
                      <div className="col-lg-3">
                        <select
                          class="form-select rounded"
                          value={countryName}
                          onChange={(e) => handleCountryChange(e)}
                          aria-label="Country"
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
                    <div className="row">
                      <div className="col-lg-6">
                        <div class="card">
                          <Box className="card-header text-dark" bg="pink">
                            Company Information
                          </Box>
                          <div class="card-body">
                            <div className="row">
                              <div className="col-lg-12 pb-3">
                                <input
                                  type="text"
                                  className="form-control rounded"
                                  placeholder="Name of the company"
                                  onChange={(e) => setAgentName(e.target.value)}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-lg-12">
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control rounded"
                                    placeholder="Address"
                                    onChange={(e) =>
                                      setAgentAddress(e.target.value)
                                    }
                                    required
                                  />
                                  <div className="input-group-append">
                                    <div className="input-group-text">
                                      <span className="fas fa-address-card"></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="input-group mb-3">
                                  <select
                                    class="form-select rounded"
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
                            </div>
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="input-group mb-3">
                                  <input
                                    type="number"
                                    className="form-control rounded"
                                    placeholder="Postal Code"
                                    required
                                    onChange={(e) =>
                                      setPostalCode(e.target.value)
                                    }
                                  />
                                  <div className="input-group-append">
                                    <div className="input-group-text">
                                      <span className="fas fa-user"></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="input-group mb-3">
                                  <input
                                    type="email"
                                    className="form-control rounded"
                                    placeholder="Email"
                                    onChange={(e) =>
                                      setAgentEmail(e.target.value)
                                    }
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
                            </div>

                           

                            <div className="row">
                              <div className="col-lg-12">
                                <div className="input-group mb-3">
                                  <select
                                    class="form-select col-lg-3 rounded-start"
                                    value={agentDialCode}
                                    onChange={(e) =>
                                      setAgentDialCode(e.target.value)
                                    }
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
                                    className="form-control rounded-end"
                                    placeholder="Phone Number"
                                    onChange={(e) =>
                                      setAgentPhoneNo(e.target.value)
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
                            </div>

                         
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-lg-1"></div> */}
                      <div className="col-lg-6">
                        <div class="card">
                          <Box className="card-header text-dark" bg="pink">
                            User Information
                          </Box>
                          <div class="card-body">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control rounded"
                                    placeholder="Full Name"
                                    onChange={(e) =>
                                      setUserFullName(e.target.value)
                                    }
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

                            <div className="row">
                              <div className="col-lg-12">
                                <div className="input-group mb-3">
                                  <input
                                    type="email"
                                    className="form-control rounded"
                                    placeholder="Email"
                                    onChange={(e) =>
                                      setUserEmail(e.target.value)
                                    }
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
                            </div>

                            <div className="row">
                              <div className="col-lg-6">
                                <div className="input-group mb-3">
                                  <input
                                    type={passwordShown ? "text" : "password"}
                                    className="form-control rounded"
                                    placeholder="Password"
                                    onChange={(e) =>
                                      setUserPassword(e.target.value)
                                    }
                                    required
                                  />
                                  <div className="input-group-append">
                                    <div className="input-group-text">
                                      <span className="fas fa-lock" onClick={() => setPasswordShown(!passwordShown)}></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="input-group mb-3">
                                  <input
                                    type={passwordCanShown ? "text" : "password"}
                                    className="form-control rounded"
                                    placeholder="Confirm Password"
                                    onChange={(e) =>
                                      setUserConfirmPassword(e.target.value)
                                    }
                                    required
                                  />
                                  <div className="input-group-append">
                                    <div className="input-group-text">
                                      <span className="fas fa-lock" onClick={() => setPasswordCanShown(!passwordCanShown)}></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="input-group mb-3">
                                  <select
                                    class="form-select col-lg-3 rounded-start"
                                    value={userDialCode}
                                    onChange={(e) =>
                                      setUserDialCode(e.target.value)
                                    }
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
                                    className="form-control rounded-end"
                                    placeholder="Phone Number"
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
                            </div>

                            {/* <div className="row">
                              <div className="col-lg-12">
                                <div
                                  className="input-group"
                                  style={{ marginBottom: "1.8rem" }}
                                >
                                  <ReCAPTCHA
                                    sitekey="6LeG91EiAAAAAA9WieRYE-UzIgTpkV11PDab8uxB"
                                    onChange={onChange}
                                  />
                                </div>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 mt-4">
                      <button
                        type="button"
                        className="btn text-white fw-bold btn-block w-25 mx-auto rounded btn-sm"
                        onClick={() => handleSubmit()}
                        disabled={loading ? true : false}
                      >
                        <Center
                          bg="gradient"
                          borderRadius="6px"
                          h="55px"
                          _hover={{ opacity: 0.9 }}
                        >
                          {loading ? (
                            <span
                              class="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            <Text color="white">Sign Up</Text>
                          )}
                        </Center>
                      </button>
                    </div>
                  </div>

                  <p className="my-2 font-size text-center">
                    Already have account?
                    <Link to="/">
                      <span
                        className="fw-bold ms-1"
                        style={{ color: "#1d94e4" }}
                      >
                        Sign In
                      </span>
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
          {/* <div className="login-form">
        <FooterLR></FooterLR>
      </div> */}
        </div>

        <Partners />
        <Service />

        
      </VStack>
      <Footer></Footer>
      
    </div>
  );
};

export default Registration;
