import React, { useState } from "react";
import Footer from "../SharePages/Footer/Footer";
import {
  Box,
  Center,
  Flex,
  Image,
  Hide,
  Text,
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
  Spacer,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import logo from "../../images/logo/logo-combined.png";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { environment } from "../SharePages/Utility/environment";
import { preventNegativeValues } from "../../common/functions";
import { Link } from "react-router-dom";

const VarifyAccount = () => {
  const { loading, setLoading } = useAuth();
  const tokenData = JSON.parse(localStorage.getItem("OTP"));
  const [oTPNumber, setOTPNumber] = useState();

  const handleSubmitOTP = (e) => {
    e.preventDefault();
    const regexPattern = /^\d{7}$/;
    const onClickOTPButton = async () => {
      setLoading(true);
      await axios
        .get(
          environment.LoginWithOTP +
            "?otp=" +
            oTPNumber +
            "&tracker=" +
            tokenData?.tracker,
          {
            headers: {
              'XLocation': sessionStorage.getItem("full_details") ?? null,
            },
          }
        )
        .then((response) => {
          if (response.data.isSuccess == true) {
            localStorage.setItem("token", JSON.stringify(response.data.data));
            localStorage.setItem("popup", JSON.stringify(true));
            // localStorage.setItem("build_version", environment.build_version);
            window.location.href = "/search";
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((err) => {
          if (err?.response?.data?.status===428 && err.response?.data?.actionType===2){
            toast.error('Please allow your location and try again');
          }else{
            toast.error("Please try again");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };
    if (regexPattern.test(oTPNumber)) {
      onClickOTPButton();
    } else {
      toast.error("OTP length must be 7");
    }
  };

  return (
    <div>
      <Center
        w="100%"
        h="640px"
        mb="-40px"
        // backgroundImage={{ base: "", xl: `url(${bg})` }}
        // style={{ backgroundImage: `url(${bgImage[0]?.imageUrl})`, backgroundRepeat: 'no-repeat', backgroundSize: ' 100% 100%' }}
        backgroundSize="contain"
        bg="backgroundVariant"
      >
        <Flex
          borderRadius="5px"
          overflow="hidden"
          boxShadow="0px 4px 67px rgba(156, 156, 156, 0.25)"
          zIndex={2}
          bg="white"
        >
          <div className="login-box">
            <ToastContainer position="bottom-right" autoClose={1500} />
            <div>
              <Center className="text-center">
                <Link to="/">
                  <Image
                    src={logo}
                    alt="Triplover"
                    w="160px"
                    h="30px"
                    mt={10}
                    mb={2}
                  />
                </Link>
              </Center>
              <div className="card-body login-card-body">
                {/* <p className="login-box-msg">Sign in to start your session</p> */}
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
                    OTP
                  </Text>
                </VStack>
                <VStack>
                  <p className="text-danger">{tokenData?.message}</p>
                </VStack>

                <form onSubmit={handleSubmitOTP}>
                  <InputGroup my={3}>
                    {/* <InputRightElement
                                            pointerEvents="none"
                                            children={<MdOutlineEmail color="#B8B8B8" />}
                                        /> */}
                    <Input
                      border="1px solid #dddddd"
                      focusBorderColor="primary"
                      id="otp"
                      name="otp"
                      type="number"
                      className="form-control rounded"
                      placeholder="please enter otp"
                      required
                      pattern="^(\d{0}|\d{7})$"
                      onKeyDown={preventNegativeValues}
                      value={oTPNumber}
                      onChange={(e) => {
                        if (e.target.value.length < 8) {
                          setOTPNumber(e.target.value);
                        } else {
                          e.preventDefault();
                        }
                      }}
                    />
                  </InputGroup>
                  <div className="row my-2">
                    <button
                      type="submit"
                      className="btn text-white fw-bold btn-block rounded btn-sm mt-2"
                      disabled={loading ? true : false}
                    >
                      <Center
                        bg="#7C04C0"
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
                          <>
                            <Text color="white">Submit OTP</Text>
                          </>
                        )}
                      </Center>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Flex>
      </Center>
      <Footer />
    </div>
  );
};

export default VarifyAccount;
