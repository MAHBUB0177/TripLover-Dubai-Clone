import React from "react";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import { MdOutlineError } from "react-icons/md";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const FailPayment = () => {
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div>
        <div className="content-wrapper search-panel-bg">
          <section className="content-header"></section>
          <section className="content content-panel">
            <div className="container bg-white w-25 py-5 position-relative">
              <div className="row">
                <div className="col-lg-12 text-center">
                  <div className="my-3">
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MdOutlineError
                        style={{
                          color: "red",
                          height: "70px",
                          width: "70px",
                          fontWeight: "bold",
                        }}
                      />
                    </p>
                  </div>
                  <p style={{ paddingBottom: "10px" }}>Transaction Failed!</p>
                  <p>WE COULDN'T PROCESS YOUR PAYMENT</p>
                  <Link to="/balance">
                    <Button
                      bg="#7c04c0"
                      _hover={"#7c04c0"}
                      marginBottom={5}
                      marginTop={2}
                      type="button"
                      className="border-radius text-white"
                    >
                      Try Again
                    </Button>
                  </Link>

                  <hr></hr>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default FailPayment;
