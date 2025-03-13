import axios from "axios";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import { environment } from "../SharePages/Utility/environment";
import { MarqueeTextDetails } from "../../common/allApi";

const Description = () => {
  const { id } = useAuth();
  const [textDetails, setTextDetails] = useState();
  const getMarqueeTextDetails = async () => {
    // const response = await axios.get(
    //   environment.marqueeList + `/${id}`,
    //   environment.headerToken
    // );

    const response=await MarqueeTextDetails(id)
    console.log(response,'response======')
    setTextDetails(response.data);
  };

  useEffect(() => {
    getMarqueeTextDetails();
  }, []);
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div>
        <div className="content-wrapper search-panel-bg">
          <section className="content-header"></section>
          <section className="content">
            <p className="text-white fw-bold text-center pt-5 fs-5">
              {textDetails?.title}
            </p>
            <p className="text-white fw-bold text-center pt-2 fs-5">
              {textDetails?.description}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Description;
