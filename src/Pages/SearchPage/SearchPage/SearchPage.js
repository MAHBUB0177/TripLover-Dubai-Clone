import React, { useEffect, useState } from "react";
import Navbar from "../../SharePages/Navbar/Navbar";
import SideNavBar from "../../SharePages/SideNavBar/SideNavBar";
import SearchPanel from "../SearchPanel/SearchPanel";
import $ from "jquery";
import { Box, Button, Center, Icon, useDisclosure } from "@chakra-ui/react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { environment } from "../../SharePages/Utility/environment";
import "react-multi-carousel/lib/styles.css";
import { AiOutlineClose } from "react-icons/ai";
import ModalForm from "../../../common/modalForm";
import Slider from "react-slick";

const SearchPage = () => {
  sessionStorage.removeItem("checkList");
  const { loading, setCount } = useAuth();
  useEffect(() => {
    setCount(0);
  });
  useEffect(() => {
    $(document).ready(function () {});
    window.scrollTo(0, 0);
  }, []);
  const [popupdata, setPopupdata] = useState([]);
  useEffect(() => {
    axios.get(environment.baseApiURL + "PopUpMassage/2").then(async (res) => {
      await setPopupdata(res.data.data);
    });
  }, []);
  const message = JSON.parse(localStorage.getItem("popup"));

  const handleClose = () => {
    localStorage.setItem("popup", JSON.stringify(false));
    onClose();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    if (message === true && popupdata.length > 0) {
      setTimeout(() => {
        $("#modal-login-open").click();
        onOpen();
      }, 1000);
    }
  }, [popupdata]);

  const [bgImage, setBgImage] = useState([]);
  useEffect(() => {
    axios.get(environment.baseApiURL + "PopUpMassage/9").then(async (res) => {
      await setBgImage(res.data.data);
    });
  }, []);

  const [isPaused, setIsPaused] = useState(false);
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  useEffect(() => {
    if (sessionStorage.length === 0 && popupdata.length > 0) {
      onOpen();
    }
  }, [popupdata]);

  const settings = {
    dots: true,
    infinite: popupdata.length === 1 ? false : true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
  };

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <SearchPanel bgImage={bgImage}></SearchPanel>

      <ModalForm
        isOpen={isOpen}
        onClose={onClose}
        size={"3xl"}
        bg={"none"}
        boxShadow={"none"}
      >
        <Box overflow="hidden" position={"relative"}>
          <Box
            display={"flex"}
            justifyContent={"end"}
            cursor={"pointer"}
            position={"relative"}
            mb={1}
            ml={5}
          >
            <AiOutlineClose
              size={24}
              color="white"
              onClick={handleClose}
              fontWeight={700}
              style={{ border: "2px solid white", borderRadius: "5px" }}
            />
          </Box>
          <div className="slider-container px-4 mx-0">
            {popupdata?.length > 0 && (
              <Slider {...settings}>
                {popupdata?.map((item, i) => (
                  <>
                    <Box
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
    </div>
  );
};

export default SearchPage;
