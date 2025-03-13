import React, { useEffect, useState } from "react";
import "./SearchPanel.css";
import $ from "jquery";
import SearchFrom from "../SearchFrom/SearchFrom";
import GroupFareForm from "../GroupFareForm/SearchFrom";
import AddPanel from "../AddPanel/AddPanel";
import Marquee from "react-fast-marquee";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Footer from "../../SharePages/Footer/Footer";
import {
  Box,
  Center,
  HStack,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { MdFlight } from "react-icons/md";
import { MdSupervisedUserCircle } from "react-icons/md";
import { marqueeList } from "../../../common/allApi";
import { showHideController } from "../../../common/normal";

const SearchPanel = ({ bgImage }) => {
  const { setId } = useAuth();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  useEffect(() => {
    // filght panel click color chenge
    $("#flight-panal").addClass("bottom-border");

    $("#flight-panal").click(function () {
      $("#flight-panal").addClass("bottom-border");
      $("#hotel-panal").removeClass("bottom-border");
      $("#car-panal").removeClass("bottom-border");
    });

    $("#hotel-panal").click(function () {
      $("#hotel-panal").addClass("bottom-border");
      $("#flight-panal").removeClass("bottom-border");
      $("#car-panal").removeClass("bottom-border");
    });

    $("#car-panal").click(function () {
      $("#car-panal").addClass("bottom-border");
      $("#flight-panal").removeClass("bottom-border");
      $("#hotel-panal").removeClass("bottom-border");
    });
  }, []);

  const [text, setText] = useState();
  const getMarqueeText = async () => {
    const response = await marqueeList();
    setText(response.data.data);
  };
  const handleClick = (idx) => {
    setId(idx);
    navigate("/details");
  };
  useEffect(() => {
    getMarqueeText();
  }, []);
  useEffect(() => {
    if (tabIndex === 1) {
      navigate("/groupfarelist");
    }
  }, [tabIndex]);

  return (
    <div>
      <div
        className="content-wrapper search-panel-bg"
        style={{
          backgroundImage: `url(${bgImage[0]?.imageUrl})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: " 100% 100%",
        }}
      >
        {/* <Marquee
          className="my-auto"
          pauseOnHover
          gradient={false}
          style={{ backgroundColor: "#7c04c0" }}
          speed={50}
        >
          {text?.map((item, index) => {
            return (
              <p
                style={{ fontSize: "15pt", cursor: "pointer" }}
                className="text-white py-2 me-5"
                // onClick={() => handleClick(index + 1)}
                key={index}
              >
                {item?.description}
              </p>
            );
          })}
        </Marquee> */}
        <section className="content-header"></section>
        {/* Main content  */}
        <section className="content">
          {/* main section start  */}
          <div className="container mt-5">
            <div className="position-relative">
              <div
                className="row position-absolute top-0 start-50 translate-middle"
                id="travel-type-panel"
              >
                {/* <Center
                  mb="20px"
                  h="40px"
                  w="250px"
                  bg="white"
                  border="1px solid #d3d3d3"
                  borderRadius="25px"
                >
                  <HStack>
                    <Icon
                      as={MdFlight}
                      h="25px"
                      w="25px"
                      color="primary"
                      transform="rotate(45deg)"
                    />
                    <Text color="gray" fontWeight={600}>
                      Flights
                    </Text>
                  </HStack>
                </Center> */}
                <Tabs
                  defaultIndex={tabIndex}
                  onChange={(index) => setTabIndex(index)}
                >
                  <TabList borderBottom="none">
                    {showHideController?.groupFare ? (
                      <Tab
                        bg="white"
                        border="1px solid #d3d3d3"
                        borderTopLeftRadius=" 25px"
                        borderBottomLeftRadius=" 25px"
                      >
                        <Center>
                          <HStack>
                            <Icon
                              as={MdFlight}
                              h="25px"
                              w="25px"
                              color="primary"
                              transform="rotate(45deg)"
                            />
                            <Text color="gray" fontWeight={600}>
                              Flights
                            </Text>
                          </HStack>
                        </Center>
                      </Tab>
                    ) : (
                      <Tab
                        bg="white"
                        border="1px solid #d3d3d3"
                        borderRadius=" 25px"
                      >
                        <Center>
                          <HStack>
                            <Icon
                              as={MdFlight}
                              h="25px"
                              w="25px"
                              color="primary"
                              transform="rotate(45deg)"
                            />
                            <Text color="gray" fontWeight={600}>
                              Flights
                            </Text>
                          </HStack>
                        </Center>
                      </Tab>
                    )}

                    {showHideController?.groupFare && (
                      <Tab
                        bg="white"
                        border="1px solid #d3d3d3"
                        borderTopRightRadius=" 25px"
                        borderBottomRightRadius=" 25px"
                      >
                        <Center>
                          <HStack>
                            <Icon
                              as={MdSupervisedUserCircle}
                              h="25px"
                              w="25px"
                              color="primary"
                              // transform="rotate(45deg)"
                            />
                            <Text color="gray" fontWeight={600}>
                              Group Fare
                            </Text>
                          </HStack>
                        </Center>
                      </Tab>
                    )}
                  </TabList>

                  <TabPanels>
                    <TabPanel></TabPanel>
                    <TabPanel></TabPanel>
                    <TabPanel></TabPanel>
                  </TabPanels>
                </Tabs>
              </div>
            </div>
          </div>
          {tabIndex === 0 ? (
            <SearchFrom></SearchFrom>
          ) : tabIndex === 1 ? (
            // <GroupFareForm></GroupFareForm>
            <></>
          ) : (
            <></>
          )}
          <div className="py-5">
            <AddPanel></AddPanel>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default SearchPanel;
