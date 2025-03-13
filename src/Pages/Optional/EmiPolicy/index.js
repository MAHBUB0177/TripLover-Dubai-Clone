import { Box, Text } from "@chakra-ui/react";
import React from "react";
import Footer from "../../SharePages/Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { nanoid } from "nanoid";

const condition = [
  {
    title:
      "➢ The payment amount must be at least AED 10,000 in order to be eligible for the EMI facility.",
  },
  { title: "➢ EMI facilities are available for Flight, Hotel & Tour." },
  {
    title:
      "➢	Only eligible credit cards from the approved banks can be used for the EMI facility.",
  },
  {
    title:
      "➢	Depending on the bank that issued your card, you may receive a term of up to 12 months.",
  },
  {
    title:
      "➢	Depending on the tenure, a non-refundable nominal service charge known as a Service Fee may be applicable.",
  },
];

const EmiPolicy = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="hold-transition login-page search-panel-bg ">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 " pb={"10px"}>
              <Text fontWeight={700} fontSize="20px">
                EMI Policy
              </Text>
            </div>

            <Box pb={"40px"}>
              <Text pb={"20px"}>
                Equated Monthly Installment is referred as EMI. We provide a
                monthly installment option for all of our services using your
                credit card if you do not prefer to make a full payment in
                advance.
              </Text>

              <Text fontWeight={700} fontSize="20px" pb={"5px"}>
                Terms Conditions for EMI:
              </Text>
              {condition.map((item) => {
                return (
                  <Box key={nanoid()}>
                    <Text
                      fontWeight={500}
                      fontSize="md"
                      color={"text"}
                      key={nanoid()}
                      pt="1px"
                    >
                      {item.title}
                    </Text>
                  </Box>
                );
              })}
            </Box>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default EmiPolicy;
