import React, { useEffect, useState } from "react";
import img from "../../images/icon/Spinner-1s-200px.gif";
import "./Loading.css";
// import airports from "../../JSON/airports.json";
import $ from "jquery";
import { formateTime } from "../../common/functions";
// import loader from '../../images/loader.gif'
import loderbg from "../../images/Background.png";
import loderwithbg from "../../images/Elements.gif";
import animation from "../../images/one-way-sign.png";
import animationTwo from "../../images/Round-trip-sign.png";
import newLoader from "../../images/loader.gif";

const Loading = ({
  flag,
  loading,
  originCode,
  destinationCode,
  originCode1,
  destinationCode1,
  originCode2,
  destinationCode2,
  originCode3,
  destinationCode3,
  originCode4,
  destinationCode4,
  originCode5,
  destinationCode5,
  tripType,
}) => {
  const searchData = JSON.parse(sessionStorage.getItem("Database"));
  //   const originCode = airports
  //   .filter((f) => f.city + " - " + f.country + ", " + f.name === searchData.origin)
  //   .map((item) => item.iata);
  // const destinationCode = airports
  //   .filter((f) => f.city + " - " + f.country + ", " + f.name === searchData.destination)
  //   .map((item) => item.iata);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let timeid;
    if (loading) {
      timeid = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      return () => clearInterval(timeid);
    }
  }, [loading]);

  useEffect(() => {
    if (loading) {
      $("#modal-open").click();
    } else {
      $(".modal-backdrop").remove();
      $("body").removeClass("modal-open");
      $("body").removeAttr("style");
    }
  }, [loading]);
  return (
    <div>
      <span
        data-toggle="modal"
        data-target="#staticBackdrop"
        id="modal-open"
      ></span>
      <div
        class="modal fade"
        id="staticBackdrop"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-dialog-centered "
          style={{ maxWidth: "350px" }}
        >
          <div
            class="modal-content"
            style={{
              position: "relative",
              minHeight: "300px",
              // backgroundImage: `url(${loderbg})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: " 100% 100%",
              backgroundColor: "#fdfdfd",
            }}
          >
            <div class="modal-body">
              <div class="text-center">
                {flag === 0 ? (
                  <>
                    <p
                      className="fw-bold text-center pt-2"
                      style={{ fontSize: "12px", color: "#7c04c0" }}
                    >
                      Getting The Best Deals From Airlines...
                    </p>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <img src={newLoader} />
                    </div>
                    <div className="text-center fw-bold ">
                      {tripType === "One Way" ? (
                        <div
                          style={{ color: "#7c04c0" }}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <div>{originCode[0]}</div>
                          <div>
                            {/* <i class="fas fa-arrow-right"></i> */}
                            <img
                              src={animation}
                              alt="animation"
                              style={{ width: "120px", height: "60px" }}
                            />
                          </div>
                          <div>{destinationCode[0]}</div>
                        </div>
                      ) : tripType === "Round Trip" ? (
                        <div
                          style={{ color: "#7c04c0" }}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <div>{originCode[0]}</div>
                          <div>
                            <img
                              src={animationTwo}
                              alt="animation"
                              style={{ width: "120px", height: "60px" }}
                            />
                          </div>
                          <div>{destinationCode[0]}</div>
                        </div>
                      ) : (
                        <></>
                      )}{" "}
                      {tripType === "Multi City" ? (
                        <div style={{ color: "#7c04c0" }}>
                          <div className="d-flex justify-content-center align-items-center">
                            <div>{originCode[0] && originCode[0]} </div>
                            <div>
                              <img
                                src={animation}
                                alt="animation"
                                style={{ width: "80px", height: "30px" }}
                              />
                            </div>
                            <div>
                              {destinationCode[0] && destinationCode[0]}
                            </div>
                          </div>

                          {originCode1[0] &&
                          destinationCode1[0] !== undefined ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <div>{originCode1[0] && originCode1[0]} </div>
                              <div>
                                <img
                                  src={animation}
                                  alt="animation"
                                  style={{ width: "80px", height: "30px" }}
                                />
                              </div>
                              <div>
                                {destinationCode1[0] && destinationCode1[0]}
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                          {originCode2[0] &&
                          destinationCode2[0] !== undefined ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <div>{originCode2[0] && originCode2[0]} </div>
                              <div>
                                <img
                                  src={animation}
                                  alt="animation"
                                  style={{ width: "80px", height: "30px" }}
                                />
                              </div>
                              <div>
                                {destinationCode2[0] && destinationCode2[0]}
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                          {originCode3[0] &&
                          destinationCode3[0] !== undefined ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <div>{originCode3[0] && originCode3[0]} </div>
                              <div>
                                <img
                                  src={animation}
                                  alt="animation"
                                  style={{ width: "80px", height: "30px" }}
                                />
                              </div>
                              <div>
                                {destinationCode3[0] && destinationCode3[0]}
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                          {originCode4[0] &&
                          destinationCode4[0] !== undefined ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <div>{originCode4[0] && originCode4[0]} </div>
                              <div>
                                <img
                                  src={animation}
                                  alt="animation"
                                  style={{ width: "80px", height: "30px" }}
                                />
                              </div>
                              <div>
                                {destinationCode4[0] && destinationCode4[0]}
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                          {originCode5[0] &&
                          destinationCode5[0] !== undefined ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <div>{originCode5[0] && originCode5[0]} </div>
                              <div>
                                <img
                                  src={animation}
                                  alt="animation"
                                  style={{ width: "80px", height: "30px" }}
                                />
                              </div>
                              <div>
                                {destinationCode5[0] && destinationCode5[0]}
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}
                      <span
                        className="text-center my-2"
                        style={{ fontSize: "12px", color: "#7c04c0" }}
                      >
                        {searchData.qtyList.Adult > 0
                          ? "Adults " + searchData.qtyList.Adult
                          : " "}{" "}
                        {searchData.qtyList.Children > 0
                          ? "Children " + searchData.qtyList.Children
                          : " "}{" "}
                        {searchData.qtyList.Infant > 0
                          ? "Infants " + searchData.qtyList.Infant
                          : " "}
                        <span className="mx-1">|</span>
                        {searchData.tripTypeModify}
                      </span>
                    </div>
                  </>
                ) : flag === 1 ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img src={newLoader} />
                    </div>
                  </>
                ) : flag === 2 ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img src={newLoader} />
                    </div>
                  </>
                ) : flag === 3 ? (
                  <>
                    <p
                      className="fw-bold text-center pt-1"
                      style={{ color: "#7c04c0" }}
                    ></p>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
