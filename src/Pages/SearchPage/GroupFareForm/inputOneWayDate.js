import {
  Box,
  Input,
  InputGroup,
  useOutsideClick,
  Text,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";

import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import { format } from "date-fns";
const InputOneWayDate = (props) => {
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);
  const calenderBox = useRef();

  useOutsideClick({
    ref: calenderBox,
    handler: () => setIsCalenderOpen(false),
  });

  //const [date, setDate] = useState(new Date());

  return (
    <InputGroup position="relative">
      {/* <Text
        pointerEvents="none"
        position="absolute"
        top="16px"
        left="18px"
        zIndex="2"
        fontSize="sm"
      >
        Depart
      </Text> */}
      <Input
        pt="2px"
        fontWeight={500}
        h="60px"
        // minW="132px"
        size="md"
        placeholder="Departing"
        _placeholder={{ color: "gray" }}
        focusBorderColor="primary"
        borderColor={props.error ? "error" : "#ced4da"}
        border="1px solid #ced4da"
        color="text"
        bg="#F7FBFC"
        cursor="pointer"
        value={`${format(props.date, "dd MMM','yy")}`}
        readOnly
        onClick={() =>
          setIsCalenderOpen((oldIsCalenderOpen) => !oldIsCalenderOpen)
        }
        className="border-radius"
      />
      {/* <Text
        pointerEvents="none"
        position="absolute"
        bottom="16px"
        left="18px"
        zIndex="2"
        fontSize="sm"
        noOfLines={1}
      >
        {`${format(props.date, "eeee")}`}
      </Text> */}

      {isCalenderOpen && (
        <Box
          ref={calenderBox}
          position="absolute"
          top="50px"
          right={{base: '-5%', sm: '0%', md: '0px', lg: '0px'}}
          zIndex={1100}
          boxShadow="md"
          borderRadius="0px 0px 4px 4px"
          overflow="hidden"
        >
          <Calendar color="#7c04c0" style={{width:"280px"}}
            date={props.date}
            minDate={props.minDate}
            onChange={(date) => {
              //SETS THE UI STATE
              props.setDate(date);
              //CLOSE THE CALENDER
              setIsCalenderOpen(false);
              // SET THE STATE ON PARENT COMPONENT
              // props.setValue(date);
            }}
            className="calendarElements"
          />

        </Box>
      )}
    </InputGroup>
  );
};

export default InputOneWayDate;
