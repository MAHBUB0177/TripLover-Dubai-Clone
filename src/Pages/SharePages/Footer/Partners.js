import { Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
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
      <Flex mb={"60px"} justifyContent="space-between" key={nanoid()}>
        {airlines.map((item) => {
          return (
            <Box bg="pink" minW="170px" maxW="282px" h="80px">
              <Image
                src={item.image}
                alt="logo"
                objectFit="cover"
                width={"100%"}
                height={"100%"}
              />
            </Box>
          );
        })}
      </Flex>
      <Divider orientation="horizontal" color={"gray"} w="100%" />
    </Box>
  );
};
