import {
  Box,
  Center,
  Circle,
  Flex,
  HStack,
  Icon,
  Image,
  VStack,
  Text,
  Divider,
  Show,
} from "@chakra-ui/react";
import React from "react";
import logo from "../../../images/logo/logo-combined.png";
import paymentOptions from "../../../images/footer/payment.png";
import fotterlogo from "../../../../src/images/footer/Triplover-LLC.png";

import {
  FaTwitter,
  FaYoutube,
  FaFacebookF,
  FaLinkedinIn,
  FaPhoneAlt,
} from "react-icons/fa";
import { GrMail } from "react-icons/gr";
import { BsFillHouseFill } from "react-icons/bs";
import Contact from "../../Optional/Contact/Contact";
import { map } from "jquery";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";

const socialData = [
  { icon: FaTwitter },
  { icon: FaYoutube },
  { icon: FaFacebookF },
  { icon: FaLinkedinIn },
];

const quickLinksData = [
  { text: "Contact", to: "contact" },
  // { text: "Bank Details", to: "bankdetail" },
  { text: "Privacy Policy", to: "privacypolicy" },
  { text: "Terms And Conditions", to: "termandcondition" },
  { text: "Refund & Cancellation", to: "refundandcancellation" },
];

const addressData = [
  {
    text: `Al Muhairi 113-127, Al Dhagaya, Deira, Dubai, United Arab Emirates`,
    icon: BsFillHouseFill,
  },
  {
    text: "+97143375728",
    icon: FaPhoneAlt,
  },
  {
    text: "help.dxb@triplover.ae",
    icon: GrMail,
  },
];

const Footer = () => {
  return (
    <Box
      border="1px"
      borderColor="gray.200"
      boxShadow="xs"
      style={{ backgroundColor: "white", position: "relative" }}
    >
      <Box className="container bg-white" boxShadow={"large"}>
        <Flex
          w="100%"
          pt="80px"
          mb="30px"
          px={{ base: "6px", md: "0" }}
          justifyContent={{ base: "center", md: "space-between" }}
          flexWrap={"wrap"}
          flexDirection={{ base: "column", md: "row" }}
          paddingX={{ lg: "40px" }}
        >
          <Box mb={"50px"}>
            <Image src={logo} alt="Triplover" w="160px" mb="24px" />
            <HStack gap="10px">
              {socialData.map((item, idx) => (
                <Circle bg="#E0ECFB" size="45px" key={idx}>
                  <Icon as={item.icon} h="22px" w="22px" color="inactiveText" />
                </Circle>
              ))}
            </HStack>
          </Box>

          <>
            <Show above="md">
              <Box borderRight="1px" color="#ECECEC" my={2} />
            </Show>
          </>

          <Box>
            <Text fontSize="18px" fontWeight={500} mb="24px">
              Quick Links
            </Text>
            {quickLinksData.map((item, idx) => (
              <Link to={`/${item.to}`} key={idx}>
                <Text fontSize="14px" fontWeight={400} mb="17px">
                  {item.text}
                </Text>
              </Link>
            ))}
          </Box>

          <>
            <Show above="md">
              <Box borderRight="1px" color="#ECECEC" my={2} />
            </Show>
          </>

          <Box>
            <Text fontSize="18px" fontWeight={500} mb="24px">
              Address
            </Text>
            {addressData.map((item, idx) => (
              <HStack gap="8px" mb="18px" key={idx}>
                <Icon
                  as={item.icon}
                  h="26px"
                  w="24px"
                  color="rgba(28, 25, 55, 0.72)"
                />
                <Text fontSize="14px" fontWeight={400} maxW="240px">
                  {item.text}
                </Text>
              </HStack>
            ))}
          </Box>
        </Flex>

        <Box bg={"white"}>
          <Center className="text-center">
            <Image src={fotterlogo} alt="payment options" />
          </Center>
        </Box>

        <>
          <Show above="md">
            <Box borderRight="1px" color="#ECECEC" my={2} />
          </Show>
        </>

        <Text
          fontSize="14px"
          fontWeight={400}
          color="#908DAB"
          textAlign="center"
          mt="25px"
          mb="30px"
        >
          Copyright © 2021 <span className="fw-bold ">Triplover</span>. All
          rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;
