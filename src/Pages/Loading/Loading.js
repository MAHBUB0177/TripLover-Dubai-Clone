import React, { useEffect } from "react";
import "./Loading.css";
import img from "../../images/icon/loading.gif";
// import airports from "../../JSON/airports.json";
import $ from "jquery";

const Loading = ({ flag, loading,originCode,destinationCode,tripType }) => {
  const searchData = JSON.parse(sessionStorage.getItem('Database'));
//   const originCode = airports
//   .filter((f) => f.city + " - " + f.country + ", " + f.name === searchData.origin)
//   .map((item) => item.iata);
// const destinationCode = airports
//   .filter((f) => f.city + " - " + f.country + ", " + f.name === searchData.destination)
//   .map((item) => item.iata);
  useEffect(() => {
    if(loading){
      $("#modal-open").click();
    }else{
      $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $("body").removeAttr("style");
    }
  }, []);
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
          style={{ maxWidth: "300px" }}
        >
          <div class="modal-content" style={{ minHeight: "300px" }}>
            <div class="modal-body">
              <div class="text-center my-4">
                {flag === 0 ? (
                  <>
                    <p className="fw-bold text-center pt-2" style={{fontSize:"12px"}}>
                      Getting The Best Deals From Airlines...
                    </p>
                    <img
                      src={img}
                      className="img-fluid my-2 mx-auto"
                      alt="fly plan"
                      width={"60%"}
                    />
                    <h6 className="text-center fw-bold my-3">
                      {originCode[0]}
                      {tripType === "One Way" ? (
                        <span class="mx-2">
                          <i class="fas fa-arrow-right"></i>
                        </span>
                      ) : (
                        <span class="mx-2">
                          <i class="fas fa-exchange-alt"></i>
                        </span>
                      )}{" "}
                      {destinationCode[0]}
                    </h6>
                    <span
                      className="text-center my-2"
                      style={{ fontSize: "12px" }}
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
                  </>
                ) : flag === 1 ? (
                  <>
                    <p className="fw-bold text-center pt-2">
                      Please wait for booking
                    </p>
                    <img
                      src={img}
                      className="img-fluid my-2 mx-auto"
                      alt="fly plan"
                      width={"60%"}
                    />
                  </>
                ) : flag === 2 ? (
                  <>
                    <p className="fw-bold text-center pt-2">
                      Please wait for ticketing
                    </p>
                    <img
                      src={img}
                      className="img-fluid my-2 mx-auto"
                      alt="fly plan"
                      width={"60%"}
                    />
                  </>
                ) : flag === 3 ? (
                  <>
                    <p className="fw-bold text-center pt-2"></p>
                    <img
                      src={img}
                      className="img-fluid my-2 mx-auto"
                      alt="fly plan"
                      width={"60%"}
                    />
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
