import { Box, Tag } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getAgentDepositSts, getGatewayCharges } from "../../../common/allApi";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const DirectTopUp = () => {
  const [gatewayChargeList, setGatewayChargeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  let [onlineChargeBrck, setOnlineChargeBrck] = useState([]);
  let [gatewaycharges, setGatewaycharges] = useState([]);

  let [onlineChargessl, setOnlineChargessl] = useState([]);
  let [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setIsShow(false);
  }, [location]);

  useEffect(() => {
    setGatewayChargeList([]);
    setOnlineChargeBrck([]);
    setOnlineChargessl([]);
    let data = [];
    async function fetchData() {
      setLoading(true);
      try {
        const response = await getGatewayCharges(1);
        if (response?.data?.isSuccess && response?.data?.data !== null) {
          setGatewaycharges(response.data?.data?.data);
        }
        const result = await getGatewayCharges(2);
        // setGatewayChargeList(result?.data?.data?.data);
        data.push(...result.data?.data?.data);

        const response3 = await getGatewayCharges(3);
        if (response3?.data?.isSuccess && response3?.data?.data !== null) {
          setOnlineChargessl(response3.data?.data?.data);
        }

        const response4 = await getGatewayCharges(4);
        if (response4?.data?.isSuccess && response4?.data?.data !== null) {
          setOnlineChargeBrck(response4.data?.data?.data);
        }

        setGatewayChargeList(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  const brackBankGatewayList = [
    {
      name: "Visa",
      charge: onlineChargeBrck ? onlineChargeBrck[0]?.chargePercentage : 0,
      image:
        "https://fstuploaddocument.s3.ap-southeast-1.amazonaws.com/payment-logo/Visa.png",
    },
    {
      name: "Master",
      charge: onlineChargeBrck ? onlineChargeBrck[0]?.chargePercentage : 0,
      image:
        "https://fstuploaddocument.s3.ap-southeast-1.amazonaws.com/payment-logo/Master_Card.png",
    },
    // {
    //   name : "International",
    //   charge : onlineChargeBrck ? onlineChargeBrck : 0,
    //   image :
    // }
  ];

  const sslGatewayList = [
    {
      name: "SSL",
      charge: onlineChargessl ? onlineChargessl[0]?.chargePercentage : 0,
      image: "https://sslcommerz.com/wp-content/uploads/2021/11/logo.png",
    },
  ];

  const [onlineDeposite, setOnlineDeposite] = useState();
  const getAgentDepositStatus = async () => {
    getAgentDepositSts()
      .then((res) => {
        if (res?.data?.isSuccess) {
          setOnlineDeposite(res?.data?.data[0]?.onlineDeposit);
        }
      })
      .catch((err) => {
        setOnlineDeposite();
      });
  };

  useEffect(() => {
    getAgentDepositStatus();
  }, []);
  return (
    <>
      {location?.pathname !== "/balance" &&
        onlineDeposite === true &&
        gatewayChargeList.length +
          onlineChargeBrck.length +
          onlineChargessl.length >
          0 && (
          <div
            style={{
              position: "fixed",
              top: "35%",
              right: 0,
              zIndex: 30,
              height: "130px",
              width: "65px",
              color: "white",
            }}
          >
            <Box style={{ marginTop: "40%" }} className="position-relative">
              <div
                onClick={() => setIsShow(!isShow)}
                className="fw-bold d-flex align-items-center"
              >
                <IoIosArrowBack
                  style={{
                    color: "#ed7f22",
                    fontWeight: 700,
                    visibility: isShow && "hidden",
                    fontSize: "20px",
                  }}
                />
                <span
                  style={{
                    writingMode: "vertical-lr",
                    backgroundColor: "#ed7f22",
                    color: "#FFF",
                    cursor: "pointer",
                    padding: "12px 5px",
                    borderRadius: "50px",
                    transform: "rotate(180deg)",
                  }}
                >
                  DIRECT&nbsp;&nbsp;TOPUP
                </span>
              </div>
              <Box
                style={{
                  width: "80px",
                  height: "auto",
                  // position: "absolute",
                  right: "30%",
                  // top: "10%",
                  display: isShow ? "block" : "none",
                  backgroundColor: "#7c04c0",
                  padding: "10px 5px",
                  borderRadius: "5px",
                  transition: "all 1s ease", // Apply transition to all properties
                  transitionDelay: "1s",
                }}
                className="position-absolute top-50 translate-middle"
                onClick={() => setIsShow(false)}
              >
                {gatewayChargeList.length > 0 &&
                  gatewayChargeList.map((card, id) => (
                    <Link
                      to="/balance"
                      state={{
                        data: card,
                        idx: id,
                      }}
                    >
                      <div
                        key={id}
                        className={`d-flex justify-content-center align-items-center  position-relative`}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={card.gatewayImageName ?? ""}
                          alt="Logo"
                          style={{
                            width: "65px",
                            height: "32px",
                            backgroundColor: "#FFF",
                            margin: "4px",
                            objectFit: "contain",
                            padding: "2px",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    </Link>
                  ))}
                {onlineChargeBrck.length > 0 &&
                  brackBankGatewayList.map((card, id) => (
                    <Link
                      to="/balance"
                      state={{ brackData: onlineChargeBrck, idx: id }}
                    >
                      <div
                        key={id}
                        className={`d-flex justify-content-center align-items-center  position-relative`}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={card.image ?? ""}
                          alt="Logo"
                          style={{
                            width: "65px",
                            height: "32px",
                            backgroundColor: "#FFF",
                            margin: "4px",
                            objectFit: "contain",
                            padding: "2px",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    </Link>
                  ))}
                {onlineChargessl.length > 0 &&
                  sslGatewayList.map((card, id) => (
                    <Link
                      to="/balance"
                      state={{ sslData: onlineChargessl, idx: id }}
                    >
                      <div
                        key={id}
                        className={`d-flex justify-content-center align-items-center  position-relative`}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={card.image ?? ""}
                          alt="Logo"
                          style={{
                            width: "65px",
                            height: "32px",
                            backgroundColor: "#FFF",
                            margin: "4px",
                            objectFit: "contain",
                            padding: "2px",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    </Link>
                  ))}
              </Box>
            </Box>
          </div>
        )}
    </>
  );
};

export default DirectTopUp;
