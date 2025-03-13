import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { nanoid } from "nanoid";
import logo from "../../../images/logo/logo-combined.png";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { AiFillGift } from "react-icons/ai";
import { HiOutlineChatAlt2, HiOutlineColorSwatch } from "react-icons/hi";

const Service = () => {
  return (
    <Center py="100px">
      <Container maxW={"6xl"} bg="" mb={"30px"} key={nanoid()}>
        <Box justifyContent={"center"} mb="20px" key={nanoid()}>
          <HStack
            justifyContent={"center"}
            display="flex"
            mb="16px"
            key={nanoid()}
          >
            <Text height={"18px"} fontWeight={700} fontSize="20px">
              Why
            </Text>
            <img src={logo} alt="" width="100px" height={"10px"} />
          </HStack>
          <Text
            textAlign={"center"}
            display="flex"
            ml={"50px"}
            mr="50px"
            key={nanoid()}
          >
            First Trip is one of the leading online travel agencies in the country. First Trip is revolutionizing the way you book travel services to make travel easier for people of all ages.
          </Text>
        </Box>

        <Flex mt={"10px"} mb="30px" key={nanoid()}>
          <Box
            borderRadius="5px"
            w={"400px"}
            height="80px"
            bg="#7800be"
            mx="4px"
            key={nanoid()}
          >
            <VStack pt={"3px"} key={nanoid()}>
              <Icon
                as={HiOutlineColorSwatch}
                height="40px"
                w={"40px"}
                color="white"
              ></Icon>
              <Text color="white" fontSize={"18px"} fontWeight={700}>
                Easy Booking
              </Text>
            </VStack>
          </Box>
          <Box
            borderRadius="5px"
            w={"400px"}
            height="80px"
            bg="#009f70"
            mx="4px"
            key={nanoid()}
          >
            <VStack pt={"3px"} key={nanoid()}>
              <Icon
                as={HiOutlineChatAlt2}
                height="40px"
                w={"40px"}
                color="white"
              ></Icon>
              <Text color="white" fontSize={"18px"} fontWeight={700}>
                24/7 Support
              </Text>
            </VStack>
          </Box>
          <Box
            borderRadius="5px"
            w={"400px"}
            height="80px"
            bg="#fbbc05"
            mx="4px"
            key={nanoid()}
          >
            <VStack mt={"3px"}>
              <Icon
                as={AiFillGift}
                height="40px"
                w={"40px"}
                color="white"
              ></Icon>
              <Text color="white" fontSize={"18px"} fontWeight={700}>
                Great Rewards
              </Text>
            </VStack>
          </Box>
          <Box
            borderRadius="5px"
            w={"400px"}
            height="80px"
            bg="#ff2e74"
            mx="4px"
            key={nanoid()}
          >
            <VStack pt="3px" key={nanoid()}>
              <Icon
                as={MdOutlineFavoriteBorder}
                height="40px"
                w={"40px"}
                color="white"
              ></Icon>
              <Text color="white" fontSize={"18px"} fontWeight={700}>
                We Care
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Center>
  );
};

export default Service;
