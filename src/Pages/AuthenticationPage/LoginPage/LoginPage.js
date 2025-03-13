import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import logo from "../../../images/logo/logo-combined.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";
import {
  Box,
  Center,
  Flex,
  Image,
  Text,
  Divider,
  VStack,
  Switch,
  HStack,
  InputGroup,
  InputRightElement,
  Input,
  Circle,
  useDisclosure,
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";
import { FcNext, FcPrevious } from "react-icons/fc";
import flightsImg from "../../../images/landing/flights.png";
import hotlelsImg from "../../../images/landing/hotels.png";
import holidaysImg from "../../../images/landing/holidays.png";
import visaProcessingImg from "../../../images/landing/visa-processing.png";
import airlines1 from "../../../images/landing/airlines-5.png";
import airlines2 from "../../../images/landing/airlines-6.png";
import airlines3 from "../../../images/landing/airlines-7.png";
import airlines4 from "../../../images/landing/airlines-8.png";

import { MdOutlineEmail } from "react-icons/md";
import { BsEyeSlash } from "react-icons/bs";
import { nanoid } from "nanoid";
import Footer from "../../SharePages/Footer/Footer";
import axios from "axios";
import { environment } from "../../SharePages/Utility/environment";
import ModalForm from "../../../common/modalForm";
import "react-multi-carousel/lib/styles.css";
import { AiOutlineClose } from "react-icons/ai";
import Slider from "react-slick";

const LoginPage = () => {
  const { onClickLoginButton, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);

  const handleLoginUser = (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;

    const encodedString1 = btoa(password);
    const encodedString2 = btoa(encodedString1);
    const encodedString3 = btoa(encodedString2);

    let loginData = {
      email: document.getElementById("email").value.toLowerCase(),
      // password: document.getElementById("password").value,
      password: encodedString3,
    };
    const re = /[a-zA-Z0-9_\.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/;
    if (re.test(loginData.email)) {
      onClickLoginButton(loginData, navigate, location, toast);
    } else {
      toast.error("Invalid email address");
    }
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
  ];
  const [popupdata, setPopupdata] = useState([]);
  useEffect(() => {
    axios.get(environment.baseApiURL + "PopUpMassage/1").then(async (res) => {
      await setPopupdata(res.data.data);
    });
  }, []);

  const [isPaused, setIsPaused] = useState(false);
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    if (sessionStorage.length === 0 && popupdata.length > 0) {
      // onOpen();
    }
  }, [popupdata]);

  const [bgImage, setBgImage] = useState([]);
  useEffect(() => {
    axios.get(environment.baseApiURL + "PopUpMassage/8").then(async (res) => {
      await setBgImage(res.data.data);
    });
  }, []);

  const settings = {
    dots: true,
    infinite: popupdata.length === 1 ? false : true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
  };
  const [slider, setSlider] = useState(null);
  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "10px" });

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <VStack>
        <Center
          w="100%"
          h="640px"
          mb="-40px"
          style={{
            backgroundImage: `url(${bgImage[0]?.imageUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: " 100% 100%",
          }}
          backgroundSize="contain"
          bg="backgroundVariant"
        >
          <Flex
            borderRadius="8px"
            overflow="hidden"
            boxShadow="0px 4px 67px rgba(156, 156, 156, 0.25)"
            zIndex={2}
            bg="white"
            justifyContent="center"
            width={popupdata?.length > 0 && screenSize.width >768 && "800px"}
          >
            {popupdata?.length > 0 && (
              <Box overflow="hidden" style={{ width: "500px" }} className="d-none d-lg-block">
                <Box
                  position={"relative"}
                  height={"450px"}
                  width={"full"}
                  overflow={"hidden"}
                >
                  <IconButton
                    aria-label="left-arrow"
                    variant="plain"
                    borderRadius="full"
                    position="absolute"
                    left={side}
                    top={top}
                    transform={"translate(0%, -50%)"}
                    zIndex={2}
                    onClick={() => slider?.slickPrev()}
                    className="bg-white"
                  >
                    <FcPrevious />
                  </IconButton>
                  <IconButton
                    aria-label="right-arrow"
                    variant="plain"
                    borderRadius="full"
                    position="absolute"
                    right={side}
                    top={top}
                    transform={"translate(0%, -50%)"}
                    zIndex={2}
                    className="bg-white"
                    onClick={() => slider?.slickNext()}
                  >
                    <FcNext />
                  </IconButton>
                  <Slider {...settings} ref={(slider) => setSlider(slider)}>
                    {popupdata.map((item, index) => (
                      <div key={index}>
                        <img
                          src={item.imageUrl}
                          alt={index}
                          style={{
                            width: "500px",
                            height: "450px",
                            objectFit: "fill",
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                </Box>
              </Box>
            )}

            <div
              className="login-box"
              style={{ backgroundColor: "#FFF", height: "450px" }}
            >
              <ToastContainer position="bottom-right" autoClose={1500} />
              <div>
                <Center className="text-center">
                  <Image
                    src={logo}
                    alt="image"
                    w="160px"
                    h="30px"
                    mt={10}
                    mb={2}
                  />
                </Center>
                <div className="card-body login-card-body">
                  <VStack spacing="0px" my={4}>
                    <Divider h="1px" color="#dddddd" mb="-12px" />
                    <Text
                      zIndex={1}
                      bg="white"
                      display="inline-block"
                      px="16px"
                      fontSize="16px"
                      fontWeight={400}
                    >
                      Sign in
                    </Text>
                  </VStack>

                  <form onSubmit={handleLoginUser}>
                    <InputGroup my={3}>
                      <InputRightElement
                        children={<MdOutlineEmail color="#B8B8B8" />}
                      />
                      <Input
                        border="1px solid #dddddd"
                        focusBorderColor="primary"
                        id="email"
                        name="email"
                        type="email"
                        className="form-control border-radius"
                        placeholder="Email"
                        required
                        pattern="[a-zA-Z0-9_\.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$"
                      />
                    </InputGroup>

                    <InputGroup my={2} mb={6}>
                      <InputRightElement
                        children={<BsEyeSlash color="#B8B8B8" />}
                        onClick={() => setPasswordShown(!passwordShown)}
                        style={{ cursor: "pointer", zIndex: "1000" }}
                      />
                      <Input
                        border="1px solid #dddddd"
                        focusBorderColor="primary"
                        id="password"
                        name="password"
                        type={passwordShown ? "text" : "password"}
                        className="form-control border-radius"
                        placeholder="Password"
                        required
                      />
                    </InputGroup>

                    <div className="row">
                      <div className="col-12">
                        <div className="icheck-primary">
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <HStack>
                              <Switch
                                pt={2}
                                colorScheme="facebook"
                                size="sm"
                                type="checkbox"
                                id="remember"
                              />
                              <Text fontWeight={400} fontSize="12px">
                                Remember me
                              </Text>
                            </HStack>

                            <Link to="/forgotpassword">
                              <Text
                                fontWeight={300}
                                fontSize="13px"
                                color="secondary"
                              >
                                Forgot Password
                              </Text>
                            </Link>
                          </Flex>
                        </div>
                      </div>
                    </div>
                    <div className="row my-2">
                      <button
                        type="submit"
                        className="btn text-white fw-bold btn-block btn-sm mt-2"
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
                            <>
                              <Text color="white">Sign In</Text>
                            </>
                          )}
                        </Center>
                      </button>
                    </div>
                  </form>

                  <HStack spacing={1} alignItems="baseline">
                    <Text fontSize="12px" fontWeight={400}>
                      New user?
                    </Text>
                    <Link to="/registration">
                      <Text
                        fontSize="13px"
                        fontWeight={500}
                        color="primary"
                        _hover={{ fontWeight: 600 }}
                      >
                        Sign Up
                      </Text>
                    </Link>
                  </HStack>
                </div>
              </div>
            </div>
          </Flex>
        </Center>

        <ModalForm
          isOpen={isOpen}
          onClose={onClose}
          size={"3xl"}
          bg={"none"}
          boxShadow={"none"}
        >
          <Box overflow="hidden">
            <Box
              display={"flex"}
              justifyContent={"end"}
              cursor={"pointer"}
              mb={1}
              ml={5}
            >
              <AiOutlineClose
                size={24}
                color="white"
                onClick={onClose}
                fontWeight={700}
                style={{ border: "2px solid white", borderRadius: "8px" }}
              />
            </Box>

            <div className="slider-container px-4 mx-0">
              {popupdata?.length > 0 && (
                <Slider {...settings}>
                  {popupdata?.map((item, i) => (
                    <>
                      <Box
                        key={i}
                        display="flex"
                        justifyContent={"center"}
                        textAlign="center"
                        width={{
                          base: "100%",
                          sm: "100%",
                          md: "670px",
                          lg: "670px",
                        }}
                        height={{
                          base: "100%",
                          sm: "100%",
                          md: "450px",
                          lg: "450px",
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt="company logo"
                          fill="layout"
                          className="img-fluid"
                          style={{
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                        />
                      </Box>
                    </>
                  ))}
                </Slider>
              )}
            </div>
          </Box>
        </ModalForm>

        <div className="arrow-container">
          <div className="arrow-down"></div>
        </div>

        <Text fontSize="21px" fontWeight={500} pt="60px">
          Our Services
        </Text>

        <Flex gap="60px" flexWrap={"wrap"} py="50px" justifyContent={"center"}>
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

        <Text fontSize="21px" fontWeight={500} pt="100px">
          Top Airlines Are With Us
        </Text>

        <Center pb="60px">
          <Flex py="50px" gap={8} flexWrap={"wrap"} justifyContent={"center"}>
            {topAirlinesData.map((item) => (
              <Center
                key={nanoid()}
                border="1px solid #E8E8E8"
                borderRadius="8px"
                h="100px"
                w="200px"
                bg="backgroundVariant"
              >
                <Image src={item.img} alt="airlines1" w="150px" />
              </Center>
            ))}
          </Flex>
        </Center>
      </VStack>
      <Footer />
    </>
  );
};

export default LoginPage;
