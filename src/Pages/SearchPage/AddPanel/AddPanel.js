import { Box, Center, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import "./AddPanel.css";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useState } from "react";
import axios from "axios";
import { environment } from "../../SharePages/Utility/environment";
import Slider from "react-slick";

const AddPanel = () => {
  const [popupdata, setPopupdata] = useState([]);
  useEffect(() => {
    axios.get(environment.baseApiURL + "PopUpMassage/10").then(async (res) => {
      await setPopupdata(res.data.data);
    });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div>
      <div className="container py-3 rounded pb-5 ">
        <div className="slider-container px-3 mx-0">

          {popupdata?.length > 0 && <Slider {...settings}>
            {popupdata?.map((item, i) => (
              <>
                <Box
                  display="flex"
                  justifyContent={"center"}
                  textAlign="center"
                >
                  <img
                    src={item.imageUrl}
                    alt="company logo"
                    fill="layout"
                    style={{
                      borderRadius: "10px",
                      cursor: "pointer",
                      height: "250px",
                      width: "540px",
                    }}
                    className="shadow-sm p-2"
                  />
                </Box>
              </>
            ))}
          </Slider>}
        </div>
      </div>
    </div>
  );
};

export default AddPanel;
