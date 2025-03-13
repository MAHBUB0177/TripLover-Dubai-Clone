import React, { useEffect, useMemo, useState } from "react";
import CustomRadioButton from "../../common/CustomRadioButton";
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { numberWithCommas } from "../../common/functions";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { getGatewayCharges, usbpayCheckout } from "../../common/allApi";
import { IoMdWarning } from "react-icons/io";
import { environment } from "../SharePages/Utility/environment";
import logo from "../../images/download.png";
import { BsCheckLg } from "react-icons/bs";

const UsbPay = ({
  uspPayApiCall,
  setOnlineDepositClick,
  onlineChargeBrck,
  onlineChargessl,
  setBrackBankCheckedIndex,
  brackBankCheckedIndex,
  onlineDepositClick,
  setOnlineCharge,
  setOnlineAmount,
  onlineAmount,
  setRemarkForBrackSSL,
  remarkForBrackSSl,
  handleOnlineDepositSubmit,
  isDownloading,
  setSslChecked,
  sslChecked,
  handleOnlineSSLCommerz,
  setOnlineChargeBrac,
  data,
  sslData,
  brackData,
  indexId,
}) => {
  let agentId = sessionStorage.getItem("agentId") ?? 0;
  const [chanel, setChanel] = useState(0);
  const [cardType, setCardType] = useState(0);
  const [inputAmount, setInputAmount] = useState(0);
  const [isInputValid, setIsInputValid] = useState(false);
  const [seletedGatewayCharge, setSelectedGatewayCharge] = useState(0);
  const [selectedBank, setSelectedBank] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [remarksrest, setRemarksreset] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [checkedId, setCheckedId] = useState(0);
  const [gatewayChargeList, setGatewayChargeList] = useState([]);

  useEffect(() => {
    setOnlineChargeBrac(
      onlineAmount
        ? numberWithCommas(
            (
              parseFloat(brackBankGatewayList[0]?.charge / 100) *
              parseFloat(onlineAmount)
            ).toFixed(2)
          )
        : numberWithCommas(parseFloat(0).toFixed(2))
    );
  }, [onlineAmount]);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = await getGatewayCharges(2);
        setGatewayChargeList(result?.data?.data?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    if (uspPayApiCall) {
      fetchData();
    }
  }, [uspPayApiCall]);

  //Generate Unique ID
  const generateUniqueID = () => {
    return `TC-${uuidv4().split("-")[0]}`;
  };

  const handleDepositTypeChange = (card) => {
    setChanel(card?.channelId);
    setCheckedId(card.id);
    setCardType(card?.cardId);
    setSelectedBank(card?.id);
    setSelectedGatewayCharge(card?.chargePercentage);
    setAmount("");
    setInputAmount("");
    setRemarksreset("");
    setRemarks("");
    setOnlineCharge(0);
    setOnlineAmount(0);
    setRemarkForBrackSSL("");
  };

  useEffect(() => {
    setSelectedGatewayCharge(
      gatewayChargeList.find((item) => item?.id === selectedBank)
    );
  }, [selectedBank, gatewayChargeList]);

  useEffect(() => {
    setIsInputValid(inputAmount > 0);
  }, [inputAmount]);

  useEffect(() => {
    generateUniqueID();
  }, [cardType]);

  const totalAmount = useMemo(() => {
    if (!!inputAmount) {
      const charge = seletedGatewayCharge?.chargePercentage ?? 0;
      const calculatedAmount =
        parseFloat(inputAmount) -
        parseFloat(charge / 100) * parseFloat(inputAmount);
      return calculatedAmount.toFixed(2);
    } else {
      return parseFloat(0).toFixed(2);
    }
  }, [inputAmount, seletedGatewayCharge, amount]);

  const discountAmount = useMemo(() => {
    if (!!inputAmount) {
      const charge = seletedGatewayCharge?.chargePercentage ?? 0;
      const calculatedAmount =
        parseFloat(charge / 100) * parseFloat(inputAmount);
      return calculatedAmount.toFixed(2);
    } else {
      return parseFloat(0).toFixed(2);
    }
  }, [inputAmount, seletedGatewayCharge, amount]);

  const handleOnlineDeposit = async () => {
    setIsLoading(true);
    const payload = {
      remarks,
      requestedAmount: inputAmount,
      gatewayChargePercent: seletedGatewayCharge?.chargePercentage ?? 0,
      approvalAmount: totalAmount,
      chargeAmount: (
        (inputAmount * seletedGatewayCharge?.chargePercentage) /
        100
      ).toFixed(2),
      isApp: false,
      chanel,
      cardType,
      checkOuturl: environment?.paymentGatewayLink,
    };

    await usbpayCheckout(payload)
      .then((res) => {
        if (res.data?.isSuccess) {
          if (typeof window !== "undefined") {
            window.open(res.data?.data?.url, "_self");
          }
        } else {
          toast.error(res?.data?.message);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setInputAmount(null); // Reset the inputAmount when component mounts
    setRemarks(""); //Reset Remaks
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

  useEffect(() => {
    if (data) {
      setBrackBankCheckedIndex();
      handleDepositTypeChange(data);
      setOnlineDepositClick(false);
      setSslChecked(false);
    }
  }, [data]);

  useEffect(() => {
    if (brackData) {
      setBrackBankCheckedIndex(indexId);
      setChanel(0);
      setCheckedId(0);
      setCardType(0);
      setSelectedBank(0);
      setSelectedGatewayCharge(0);
      setAmount("");
      setInputAmount("");
      setRemarksreset("");
      setRemarks("");
      setOnlineDepositClick(true);
      setOnlineCharge(brackData[0]?.chargePercentage);
      setSslChecked(false);
      setOnlineAmount(0);
    }
  }, [brackData]);

  useEffect(() => {
    if (sslData) {
      setBrackBankCheckedIndex("");
      setChanel(0);
      setCheckedId(0);
      setCardType(0);
      setSelectedBank(0);
      setSelectedGatewayCharge(0);
      setAmount("");
      setInputAmount("");
      setRemarksreset("");
      setRemarks("");
      setOnlineDepositClick(false);
      setOnlineCharge(sslData[0]?.chargePercentage);
      setSslChecked(true);
      setOnlineAmount(0);
    }
  }, [sslData]);

  return (
    <div className="d-flex justify-content-center">
      {loading ? (
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="d-flex align-items-center justify-content-center my-3">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className={`pb-2 font-semibold`}>Select your payment method </h2>
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={3}
          >
            {gatewayChargeList.length > 0 &&
              gatewayChargeList.map((card) => (
                <GridItem key={card.id}>
                  <CustomRadioButton
                    id={`channel-${card.id}`}
                    value={card.id}
                    checked={checkedId === card.id}
                    onChange={() => {
                      handleDepositTypeChange(card);
                      setOnlineDepositClick(false);
                      setSslChecked(false);
                    }}
                    imageSrc={card.gatewayImageName ?? ""}
                    alt={card?.name}
                  />
                </GridItem>
              ))}
            {onlineChargeBrck.length > 0 && (
              <>
                {brackBankGatewayList?.map((item, idx) => {
                  return (
                    <label className="shadow border-radius border-2 border-primary">
                      <input
                        type="radio"
                        onClick={() => {
                          setBrackBankCheckedIndex(idx);
                          setChanel(0);
                          setCheckedId(0);
                          setCardType(0);
                          setSelectedBank(0);
                          setSelectedGatewayCharge(0);
                          setAmount("");
                          setInputAmount("");
                          setRemarksreset("");
                          setRemarks("");
                          setOnlineDepositClick(true);
                          setOnlineCharge(
                            onlineChargeBrck[0]?.chargePercentage
                          );
                          setSslChecked(false);
                          setOnlineAmount(0);
                        }}
                        className="d-none"
                      />
                      <div
                        className={`d-flex justify-content-center align-items-center position-relative`}
                        style={{
                          width: "100px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                      >
                        {checkedId === 0 && brackBankCheckedIndex === idx && (
                          <span className="w-5 h-5 border position-absolute top-0 start-0">
                            <BsCheckLg className="w-3 h-3 text-primary" />
                          </span>
                        )}

                        <img
                          src={item.image}
                          alt="Logo"
                          style={{
                            width: "70px",
                            height: "40px",
                            objectFit: "contain",
                          }}
                          className="img-fluid"
                        />
                      </div>
                    </label>
                  );
                })}
              </>
            )}
            {onlineChargessl.length > 0 && (
              <>
                {sslGatewayList?.map((item, idx) => {
                  return (
                    <label className="shadow border-radius border-2 border-primary">
                      <input
                        type="radio"
                        onClick={() => {
                          setBrackBankCheckedIndex("");
                          setChanel(0);
                          setCheckedId(0);
                          setCardType(0);
                          setSelectedBank(0);
                          setSelectedGatewayCharge(0);
                          setAmount("");
                          setInputAmount("");
                          setRemarksreset("");
                          setRemarks("");
                          setOnlineDepositClick(false);
                          setOnlineCharge(onlineChargessl[0]?.chargePercentage);
                          setSslChecked(true);
                          setOnlineAmount(0);
                        }}
                        className="d-none"
                      />
                      <div
                        className={`d-flex justify-content-center align-items-center position-relative`}
                        style={{
                          width: "100px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                      >
                        {checkedId === 0 && sslChecked && (
                          <span className="w-5 h-5 border position-absolute top-0 start-0">
                            <BsCheckLg className="w-3 h-3 text-primary" />
                          </span>
                        )}

                        <img
                          src={item.image}
                          alt="Logo"
                          style={{
                            width: "70px",
                            height: "40px",
                            objectFit: "contain",
                          }}
                          className="img-fluid"
                        />
                      </div>
                    </label>
                  );
                })}
              </>
            )}
          </Grid>
          {gatewayChargeList.length > 0 &&
            !onlineDepositClick &&
            !sslChecked && (
              <>
                <Box
                  className="border my-2 overflow-hidden border-radius"
                  width={{
                    base: "100%",
                    sm: "50%",
                    md: "100%",
                    lg: "100%",
                    xl: "100%",
                    "2xl": "100%",
                  }}
                >
                  <div className="py-3 pl-2 font-semibold border">
                    Top-up Summary
                  </div>
                  <div className="py-5 px-2 ">
                    <VStack className={"ml-3 mt-2"}>
                      <Text fontWeight={"semibold"}>Enter Amount</Text>
                      <HStack>
                        <input
                          placeholder="Enter here"
                          type="text" // Change the input type to "text"
                          onChange={(e) => {
                            const input = e.target.value;
                            const filteredInput = input.replace(/\D/g, ""); // Remove any non-digit characters
                            const sevenDigitInput = filteredInput.slice(0, 7); // Keep only the first 7 digits
                            setInputAmount(sevenDigitInput);
                            setAmount(sevenDigitInput);
                          }}
                          value={amount === 0 ? "" : amount}
                          className="text-center text-[20px] border-bottom w-100"
                        />
                        <span className="font-semibold">AED</span>
                      </HStack>
                    </VStack>
                    <VStack className={"ml-3 mt-2"} textColor={"primary"}>
                      <Text fontWeight={"semibold"}>
                        Charge ({seletedGatewayCharge?.chargePercentage ?? 0}%)
                      </Text>
                      <HStack>
                        <Text fontWeight={"semibold"} fontSize={"20px"}>
                          {numberWithCommas(discountAmount) ?? 0}
                        </Text>
                        <span className="font-normal text-[12px] ">AED</span>
                      </HStack>
                    </VStack>
                    <VStack className={"ml-3 mt-2"} textColor={"primary"}>
                      <Text fontWeight={"semibold"}>Payable Amount</Text>
                      <HStack>
                        <Text fontWeight={"semibold"} fontSize={"20px"}>
                          {numberWithCommas(totalAmount)}{" "}
                        </Text>
                        <span className="font-normal text-[12px] ">AED</span>
                      </HStack>
                    </VStack>
                  </div>
                </Box>
                <div className={"mt-4"}>
                  <Text className="font-semibold">Remarks</Text>
                  <div className="mt-2">
                    <textarea
                      placeholder="Enter here"
                      onChange={(e) => {
                        setRemarks(e.target.value);
                        setRemarksreset(e.target.value);
                      }}
                      value={remarksrest}
                      className="border rounded-lg w-100 h-[112px] p-2 border-solid border-radius"
                    />
                  </div>
                </div>
                <Button
                  className={" text-[#703E97] mt-4 border-radius"}
                  style={{ backgroundColor: "#7c04c0", color: "white" }}
                  w="140px"
                  isDisabled={chanel === 0 || !isInputValid || cardType == 0}
                  onClick={handleOnlineDeposit}
                  isLoading={isLoading}
                  loadingText="Submitting"
                >
                  Submit
                </Button>
              </>
            )}

          {checkedId === 0 && onlineDepositClick && !sslChecked && (
            <>
              <Box
                className="border my-2 overflow-hidden border-radius"
                width={{
                  base: "100%",
                  sm: "50%",
                  md: "100%",
                  lg: "100%",
                  xl: "100%",
                  "2xl": "100%",
                }}
              >
                <div className="py-3 pl-2 font-semibold border">
                  Top-up Summary
                </div>
                <div className="py-5 px-2 ">
                  <VStack className={"ml-3 mt-2"}>
                    <Text fontWeight={"semibold"}>Enter Amount</Text>
                    <HStack>
                      <input
                        placeholder="Enter here"
                        type="text" // Change the input type to "text"
                        onChange={(e) => {
                          const input = e.target.value;
                          const filteredInput = input.replace(/\D/g, ""); // Remove any non-digit characters
                          const sevenDigitInput = filteredInput.slice(0, 7); // Keep only the first 7 digits
                          setInputAmount(sevenDigitInput);
                          setOnlineAmount(sevenDigitInput);
                        }}
                        value={onlineAmount === 0 ? "" : onlineAmount}
                        className="text-center text-[20px] border-bottom w-100"
                      />
                      <span className="font-semibold">AED</span>
                    </HStack>
                  </VStack>
                  <VStack className={"ml-3 mt-2"} textColor={"primary"}>
                    <Text fontWeight={"semibold"}>
                      Charge ({brackBankGatewayList[0]?.charge ?? 0}%)
                    </Text>
                    <HStack>
                      <Text fontWeight={"semibold"} fontSize={"20px"}>
                        {onlineAmount
                          ? numberWithCommas(
                              (
                                parseFloat(
                                  brackBankGatewayList[0]?.charge / 100
                                ) * parseFloat(onlineAmount)
                              ).toFixed(2)
                            )
                          : numberWithCommas(parseFloat(0).toFixed(2))}
                      </Text>
                      <span className="font-normal text-[12px] ">AED</span>
                    </HStack>
                  </VStack>
                  <VStack className={"ml-3 mt-2"} textColor={"primary"}>
                    <Text fontWeight={"semibold"}>Payable Amount</Text>
                    <HStack>
                      <Text fontWeight={"semibold"} fontSize={"20px"}>
                        {onlineAmount === ""
                          ? numberWithCommas(parseFloat(0).toFixed(2))
                          : (
                              parseInt(onlineAmount) -
                              (onlineAmount * brackBankGatewayList[0]?.charge) /
                                100
                            ).toFixed(2)}
                      </Text>
                      <span className="font-normal text-[12px] ">AED</span>
                    </HStack>
                  </VStack>
                </div>
              </Box>
              <div className={"mt-4"}>
                <Text className="font-semibold">Remarks</Text>
                <div className="mt-2">
                  <textarea
                    placeholder="Enter here"
                    onChange={(e) => {
                      setRemarkForBrackSSL(e.target.value);
                    }}
                    value={remarkForBrackSSl}
                    className="border rounded-lg w-100 h-[112px] p-2 border-solid border-radius"
                  />
                </div>
              </div>
              <Button
                className={" text-[#703E97] mt-4 border-radius"}
                style={{ backgroundColor: "#7c04c0", color: "white" }}
                w="140px"
                isDisabled={
                  brackBankCheckedIndex === undefined || !onlineAmount
                }
                onClick={handleOnlineDepositSubmit}
                isLoading={isDownloading}
                loadingText="Submitting"
              >
                Submit
              </Button>
            </>
          )}

          {checkedId === 0 && !onlineDepositClick && sslChecked && (
            <>
              <Box
                className="border my-2 overflow-hidden border-radius"
                width={{
                  base: "100%",
                  sm: "50%",
                  md: "100%",
                  lg: "100%",
                  xl: "100%",
                  "2xl": "100%",
                }}
              >
                <div className="py-3 pl-2 font-semibold border">
                  Top-up Summary
                </div>
                <div className="py-5 px-2 ">
                  <VStack className={"ml-3 mt-2"}>
                    <Text fontWeight={"semibold"}>Enter Amount</Text>
                    <HStack>
                      <input
                        placeholder="Enter here"
                        type="text" // Change the input type to "text"
                        onChange={(e) => {
                          const input = e.target.value;
                          const filteredInput = input.replace(/\D/g, ""); // Remove any non-digit characters
                          const sevenDigitInput = filteredInput.slice(0, 7); // Keep only the first 7 digits
                          setInputAmount(sevenDigitInput);
                          setOnlineAmount(sevenDigitInput);
                        }}
                        value={onlineAmount === 0 ? "" : onlineAmount}
                        className="text-center text-[20px] border-bottom w-100"
                      />
                      <span className="font-semibold">AED</span>
                    </HStack>
                  </VStack>
                  <VStack className={"ml-3 mt-2"} textColor={"primary"}>
                    <Text fontWeight={"semibold"}>
                      Charge ({sslGatewayList[0]?.charge ?? 0}%)
                    </Text>
                    <HStack>
                      <Text fontWeight={"semibold"} fontSize={"20px"}>
                        {onlineAmount
                          ? numberWithCommas(
                              (
                                parseFloat(sslGatewayList[0]?.charge / 100) *
                                parseFloat(onlineAmount)
                              ).toFixed(2)
                            )
                          : numberWithCommas(parseFloat(0).toFixed(2))}
                      </Text>
                      <span className="font-normal text-[12px] ">AED</span>
                    </HStack>
                  </VStack>
                  <VStack className={"ml-3 mt-2"} textColor={"primary"}>
                    <Text fontWeight={"semibold"}>Payable Amount</Text>
                    <HStack>
                      <Text fontWeight={"semibold"} fontSize={"20px"}>
                        {onlineAmount === ""
                          ? numberWithCommas(parseFloat(0).toFixed(2))
                          : (
                              parseInt(onlineAmount) -
                              (onlineAmount * sslGatewayList[0]?.charge) / 100
                            ).toFixed(2)}
                      </Text>
                      <span className="font-normal text-[12px] ">AED</span>
                    </HStack>
                  </VStack>
                </div>
              </Box>
              <div className={"mt-4"}>
                <Text className="font-semibold">Remarks</Text>
                <div className="mt-2">
                  <textarea
                    placeholder="Enter here"
                    onChange={(e) => {
                      setRemarkForBrackSSL(e.target.value);
                    }}
                    value={remarkForBrackSSl}
                    className="border rounded-lg w-100 h-[112px] p-2 border-solid border-radius"
                  />
                </div>
              </div>
              <Button
                className={" text-[#703E97] mt-4 border-radius"}
                style={{ backgroundColor: "#7c04c0", color: "white" }}
                w="140px"
                isDisabled={!sslChecked || !onlineAmount}
                onClick={handleOnlineSSLCommerz}
                isLoading={isDownloading}
                loadingText="Submitting"
              >
                Submit
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UsbPay;
