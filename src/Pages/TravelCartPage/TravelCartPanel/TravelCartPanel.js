import React from "react";
import { ToastContainer, toast } from "react-toastify";
import LeftSide from "../LeftSide/LeftSide";
import RightSide from "../RightSide/RightSide";
import { useState } from "react";
import { useEffect } from "react";
import {
  checkPartialPaymentEligibility,
  serviceRequest,
} from "../../../common/allApi";

const TravelCartPanel = () => {
  const fullObj = JSON.parse(sessionStorage.getItem("fullObj"));
  const hasExtraService = JSON.parse(sessionStorage.getItem("hasExtraService"));
  const direction0 = JSON.parse(sessionStorage.getItem("direction0"));
  const direction1 = JSON.parse(sessionStorage.getItem("direction1"));
  const direction2 = JSON.parse(sessionStorage.getItem("direction2"));
  const direction3 = JSON.parse(sessionStorage.getItem("direction3"));
  const direction4 = JSON.parse(sessionStorage.getItem("direction4"));
  const direction5 = JSON.parse(sessionStorage.getItem("direction5"));
  const uniqueTransID = JSON.parse(sessionStorage.getItem("uniqueTransID"));
  const itemCodeRef = JSON.parse(sessionStorage.getItem("itemCodeRef"));
  const brandedFareSelectedIdx = JSON.parse(
    sessionStorage.getItem("brandedFareSelectedIdx")
  );
  const brandedFareList = JSON.parse(sessionStorage.getItem("brandedFareList"));

  const [partialPaymentData, setPartialPaymentData] = useState({});
  const [loader, setLoader] = useState(false);

  const requestPartialPayments = async () => {
    let obj = {
      ...fullObj,
      passengerFares:
        brandedFareList !== null &&
        brandedFareList.length > 0 &&
        brandedFareList[brandedFareSelectedIdx]?.paxFareBreakDown,
      totalPrice:
        brandedFareList !== null &&
        brandedFareList.length > 0 &&
        brandedFareList[brandedFareSelectedIdx]?.totalFare,
        refundable : brandedFareList !== null &&
        brandedFareList.length > 0 && brandedFareList[brandedFareSelectedIdx]?.brandFeatures?.Refundable !== undefined &&
        brandedFareList[brandedFareSelectedIdx]?.brandFeatures?.Refundable?.isRefundable,
    };
    setLoader(true);
    await checkPartialPaymentEligibility(
      brandedFareList !== null && brandedFareList.length > 0 ? obj : fullObj
    )
      .then((res) => {
        setPartialPaymentData(res?.data);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  useEffect(() => {
    requestPartialPayments();
  }, []);

  //EXTRA BAGGAGE STATE
  const [extraServices, SetExtraServices] = useState([]);
  const [extraServicesLoader, SetExtraServicesLoader] = useState(false);
  const [adultValue, setAdultValue] = useState();
  const [childValue, setChildValue] = useState();
  const [infantValue, setInfanttValue] = useState();

  const apiServiceRequest = async () => {
    SetExtraServicesLoader(true);
    let payload = {
      uniqueTransID: uniqueTransID,
      itemCodeRef: itemCodeRef,
      taxRedemptions: [],
      segmentCodeRefs: [],
      isRefundable: false,
    };
    if (Object.keys(direction0).length > 0) {
      direction0.segments.map((i) =>
        payload.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (Object.keys(direction1).length > 0) {
      direction1.segments.map((i) =>
        payload.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (Object.keys(direction2).length > 0) {
      direction2.segments.map((i) =>
        payload.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (Object.keys(direction3).length > 0) {
      direction3.segments.map((i) =>
        payload.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (Object.keys(direction4).length > 0) {
      direction4.segments.map((i) =>
        payload.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    if (Object.keys(direction5).length > 0) {
      direction5.segments.map((i) =>
        payload.segmentCodeRefs.push(i.segmentCodeRef)
      );
    }
    //RESQUEST TO PRICE
    await serviceRequest(payload)
      .then((res) => {
        SetExtraServices(res?.data?.item1);
        SetExtraServicesLoader(false);
      })
      .catch((err) => {
        SetExtraServicesLoader(false);
      });
  };

  useEffect(() => {
    if (hasExtraService) {
      apiServiceRequest();
    }
  }, []);

  return (
    <div className="content-wrapper search-panel-bg">
      <ToastContainer position="bottom-right" autoClose={1500} />
      <section className="content-header"></section>
      <section className="content">
        <div className="container-fluid pt-2">
          <div className="row mx-lg-4 mx-md-4 mx-sm-1">
            <div className="col-lg-8">
              <LeftSide
                partialPaymentData={partialPaymentData}
                adultValue={adultValue}
                childValue={childValue}
                infantValue={infantValue}
                setAdultValue={setAdultValue}
                setChildValue={setChildValue}
                setInfanttValue={setInfanttValue}
                hasExtraService={hasExtraService}
                loader={loader}
                extraServices={extraServices}
                extraServicesLoader={extraServicesLoader}
              ></LeftSide>
            </div>
            <div className="col-lg-4">
              <RightSide
                partialPaymentData={partialPaymentData}
                adultValue={adultValue}
                childValue={childValue}
                infantValue={infantValue}
                hasExtraService={hasExtraService}
                loader={loader}
                extraServices={extraServices}
                extraServicesLoader={extraServicesLoader}
              ></RightSide>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelCartPanel;
