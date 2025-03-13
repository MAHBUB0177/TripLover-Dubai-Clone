import { Box, Center, Divider, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { nanoid } from "nanoid";

import air1 from "../../../../src/images/footer/partners/air1.png";
import air2 from "../../../../src/images/footer/partners/air2.png";
import air3 from "../../../../src/images/footer/partners/air3.png";
import air4 from "../../../../src/images/footer/partners/air4.png";
import air5 from "../../../../src/images/footer/partners/air5.png";
import air6 from "../../../../src/images/footer/partners/air6.png";

let airlines = [
  {
    image: air1,
  },
  {
    image: air2,
  },
  {
    image: air3,
  },
  {
    image: air4,
  },
  {
    image: air5,
  },
  {
    image: air6,
  },
];

export const Partners = () => {
  return (
    <Box key={nanoid()} pt="100px">
      <Flex
        justifyContent={"center"}
        alignItems="center"
        gap={5}
        key={nanoid()}
      >
        <Divider orientation="horizontal" color={"gray"} w="500px" />
        <Text fontSize={"18px"} fontWeight="700px">
          Key Airline Partner
        </Text>
        <Divider orientation="horizontal" color={"gray"} w="500px" />
      </Flex>
        <Center pb="60px">
                <Flex py="50px" flexWrap={"wrap"} justifyContent={"center"} gap={8}>
                  {airlines.map((item) => (
                    <Center
                      key={nanoid()}
                      border="1px solid #E8E8E8"
                      borderRadius="8px"
                      h="100px"
                      w="200px"
                      bg="backgroundVariant"
                    >
                      <Image src={item.image} alt="airlines1" w="150px" />
                  
                    </Center>
                  ))}
                </Flex>
              </Center>
      <Divider orientation="horizontal" color={"gray"} w="100%" />
    </Box>
  );
};
