import React, { useEffect, useState } from "react";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../SharePages/Footer/Footer";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import RefundableFlightInfo from "./components/refundableFlightInfo";
import {
  getDataForQuotationView,
  getRefundRequestAccept,
} from "../../common/allApi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import CountdownTimerRefund from "./countdown";
import RefundableSegmentInfo from "./components/refundableSegments";

const RefundRequest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [refund, setRefund] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  let [quotationRefundTicketingView, setQuotationRefundTicketingView] =
    useState([]);
  let [quotationRefundSegmentView, setQuotationRefundSegmentView] = useState(
    []
  );
  const [summary, setSummary] = useState();
  const [basicInfo, setBasicInfo] = useState();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const ItemState = searchParams.get("failedAuto");
    if (ItemState === "true") {
      onOpen1();
    }
  }, [searchParams, onOpen1]);

  const getQuotationRefundTicketingView = async () => {
    setLoader(true);
    try {
      const response = await getDataForQuotationView(
        searchParams.get("groupId"),
        searchParams.get("editCount")
      );
      if (response?.data?.isSuccess && response?.data?.data === null) {
        sessionStorage.setItem("rejectedList", true);
        // navigate("/all-refund-request");
      }
      if (response?.data?.isSuccess) {
        setQuotationRefundTicketingView(response?.data?.data?.quotations);
        setQuotationRefundSegmentView(response?.data?.data?.legInfo);
        setBasicInfo(response?.data?.data?.basicInfo);
        setSummary(response?.data?.data?.summery);
        setLoader(false);
      }
      setLoader(false);
    } catch (error) {
      toast.error("Please try again.");
      setLoader(false);
    }
  };

  const [desabled, setIsdesabled] = useState(false);
  const handelRefundRequestAccept = async () => {
    setIsdesabled(true);
    try {
      const response = await getRefundRequestAccept(
        summary?.groupId,
        "true",
        summary?.editCount
      );
      if (response?.data?.isSuccess) {
        onClose();
        if (response.data?.data?.failedAuto) {
          onOpen2();
        } else {
          // if (response?.data?.data?.auto) {
          //   navigate("/my-bookings", {
          //     state: {
          //       navigate: "refund",
          //       status: "Agent_Accepted",
          //     },
          //   });
          // } else {
          //   navigate("/my-bookings", {
          //     state: {
          //       navigate: "refund",
          //       status: "Quoted",
          //     },
          //   });
          // }

          navigate("/my-bookings", {
            state: {
              navigate: "refund",
              status: "Agent_Accepted",
            },
          });
          toast.success(response?.data?.message);
        }

        setIsdesabled(false);
      } else {
        toast.error(response?.data?.message);
        setIsdesabled(false);
      }
    } catch (error) {
      toast.error("Please try again.");
      setIsdesabled(false);
    }
  };

  const [isRejecet, setIsReject] = useState(false);
  const handelRefundRequestReject = async () => {
    setIsReject(true);
    try {
      const response = await getRefundRequestAccept(
        summary?.groupId,
        "false",
        summary?.editCount
      );
      if (response?.data?.isSuccess) {
        onClose();
        getQuotationRefundTicketingView();
        navigate("/my-bookings", {
          state: {
            navigate: "refund",
            status: "Admin_Rejected",
          },
        });
        toast.success(response?.message);
      } else {
        setIsReject(false);
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setIsReject(false);
      toast.error("Please try again.");
    }
  };
  useEffect(() => {
    getQuotationRefundTicketingView();
  }, []);

  let result=quotationRefundSegmentView.filter((item)=>item?.isLegRefundRequested)

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg">
        <ToastContainer position="bottom-right" autoClose={1500} />
        <section className="content-header"></section>
        <section className="content pb-5">
          <div className="container-fluid pt-2">
            <div className="row mx-lg-4 mx-md-4 mx-sm-1">
              <div className="col-lg-12 px-0">
                <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-white shadow rounded">
                  <span className="fw-bold">Refund Ticket</span>
                </div>
              </div>
            </div>
            <div className="row mx-lg-4 mx-md-4 mx-sm-1 my-3">
              <div className="col-lg-8 box-shadow bg-white rounded">
                <div className="row bg-light rounded">
                  <div className="d-flex justify-content-start align-items-center py-2 gap-3">
                    <div className="fw-bold">Refund For {basicInfo?.route}</div>
                    <button
                      type="button"
                      className="btn text-white fw-bold border-radius"
                      style={{ background: "#7c04c0" }}
                    >
                      {summary?.status}
                    </button>
                  </div>
                </div>
                <div className="pb-5">
                  <div className="row bg-light m-2 rounded">
                    <div className="py-2">
                      <div>
                        Quotation expire in :{" "}
                        {summary?.expiresInMs ? (
                          <button
                            type="button"
                            className="btn btn-danger text-white fw-bold rounded-pill px-3"
                            style={{ fontSize: "12px" }}
                          >
                            {summary?.status == "Quoted" ? (
                              <CountdownTimerRefund
                                expireDate={summary && summary?.expiresInMs}
                              />
                            ) : (
                              <>{summary?.status}</>
                            )}
                          </button>
                        ) : (
                          <span className="fw-bold">N/A</span>
                        )}
                      </div>
                      <div>
                        <p style={{ color: "red" }}>
                          Please check the following quotation
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row m-2">
                    <div className="table-responsive px-0">
                      <table
                        className="table table-bordered my-2 mb-3"
                        style={{ fontSize: "14px" }}
                      >
                        <tbody>
                          <tr>
                            <th>booking Id</th>
                            <td>{summary?.uniqueTransId}</td>
                            <td className="fw-bold">PNR</td>
                            <td>{summary?.pnr}</td>
                          </tr>

                          <tr>
                            <th>Requested Status</th>
                            <td>{summary?.status ? summary.status : "N/A"}</td>
                            <td className="fw-bold">Agency Name</td>
                            <td>
                              {summary?.agencyName ? summary.agencyName : "N/A"}
                            </td>
                          </tr>

                          <tr>
                            <th>Fly Date</th>
                            <td>
                              {basicInfo?.flyDate !== null
                                ? moment(result[0]?.departure).format(
                                    "DD-MMMM-yyyy"
                                  )
                                : "N/A"}
                            </td>
                            <td className="fw-bold">Quotation Created Date</td>
                            <td>
                              {summary?.quotationCreatedDate !== null
                                ? moment(summary?.quotationCreatedDate).format(
                                    "DD-MMMM-yyyy"
                                  )
                                : "N/A"}
                            </td>
                          </tr>

                          <tr>
                            <th>Airline Code</th>
                            <td>{basicInfo?.airlineCode}</td>

                            <td className="fw-bold">Latest Update On</td>
                            <td>
                              {moment(summary?.lastUpdatedOn).format(
                                "DD-MMMM-yyyy"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Requested By</td>
                            <td colSpan={3}>{summary?.requestedByName}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {loader ? (
                    <div className="d-flex align-items-center justify-content-center my-3">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {quotationRefundTicketingView?.length > 0 && (
                        <RefundableFlightInfo
                          item={quotationRefundTicketingView}
                        />
                      )}

                      {quotationRefundSegmentView?.length > 0 && (
                        <RefundableSegmentInfo
                          item={quotationRefundSegmentView}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className=" box-shadow bg-white rounded">
                  <Box
                    style={{ background: "#F8F9FA" }}
                    p={3}
                    fontWeight={700}
                    fontSize={"20px"}
                  >
                    Quotation Quoted
                  </Box>
                  <div className="container row pt-3 pb-2 px-2">
                    <div style={{ color: "#67696a" }}>
                      <>
                        <div className="row mt-2" style={{ fontSize: "14px" }}>
                          <Flex
                            justifyContent={"space-between"}
                            color={"#7c04c0"}
                            lineHeight="1.8"
                          >
                            <Text fontWeight={600}>Total Ticket Price</Text>
                            {summary?.hasQuotation ? (
                              <Text>{summary?.totalPrice}AED</Text>
                            ) : (
                              <Text color={"red"}>Waiting for Quotation</Text>
                            )}
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "14px" }}>
                          <Flex
                            justifyContent={"space-between"}
                            lineHeight="1.8"
                          >
                            <Text fontWeight={600}>Airlines Penalty</Text>

                            {summary?.hasQuotation ? (
                              <Text>{summary?.totalAirlineFee}AED</Text>
                            ) : (
                              <Text color={"red"}>Waiting for Quotation</Text>
                            )}
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "14px" }}>
                          <Flex
                            justifyContent={"space-between"}
                            lineHeight="1.8"
                          >
                            <Text fontWeight={600}>Service Charge</Text>

                            {summary?.hasQuotation ? (
                              <Text>{summary?.totalServiceCharge}AED</Text>
                            ) : (
                              <Text color={"red"}>Waiting for Quotation</Text>
                            )}
                          </Flex>
                        </div>
                        <div className="row" style={{ fontSize: "14px" }}>
                          <Flex
                            justifyContent={"space-between"}
                            color={"#7c04c0"}
                            lineHeight="1.8"
                          >
                            <Text fontWeight={600}>Total Refund Charge</Text>

                            {summary?.hasQuotation ? (
                              <Text>{summary?.totalRefundCharge}AED</Text>
                            ) : (
                              <Text color={"red"}>Waiting for Quotation</Text>
                            )}
                          </Flex>
                        </div>
                        {summary?.totalNonRefundable > 0 && (
                          <div className="row" style={{ fontSize: "14px" }}>
                            <Flex
                              justifyContent={"space-between"}
                              color={"#7c04c0"}
                              lineHeight="1.8"
                            >
                              <Text fontWeight={600}>
                                Total Non Refundable Amount
                              </Text>

                              <Text>{summary?.totalNonRefundable}AED</Text>
                            </Flex>
                          </div>
                        )}
                        <div className="row" style={{ fontSize: "14px" }}>
                          <Flex
                            justifyContent={"space-between"}
                            color={"#7c04c0"}
                            lineHeight="1.8"
                          >
                            <Text fontWeight={600}>Acc. Refundable</Text>

                            {summary?.hasQuotation ? (
                              <Text>{summary?.totalRefundable}AED</Text>
                            ) : (
                              <Text color={"red"}>Waiting for Quotation</Text>
                            )}
                          </Flex>
                        </div>{" "}
                      </>
                    </div>
                  </div>

                  <Box pb={4} px={3}>
                    <Text mb="8px">
                      Remarks:
                      <span style={{ color: "red" }}>
                        {" "}
                        {summary?.adminRemarks ? summary?.adminRemarks : "N/A"}
                      </span>
                    </Text>
                    <Box display={"flex"} justifyContent={"flex-start"} gap={3}>
                      {" "}
                      <input
                        type="checkbox"
                        onChange={(e) => setRefund(e.target.checked)}
                      />
                      <Text fontWeight={700}>
                        I acknowledge the{" "}
                        <Link to={"/termandcondition"} target="_blank">
                          <u style={{ color: "#7c04c0" }} className="fw-bold">
                            Terms & Conditions{" "}
                          </u>{" "}
                        </Link>
                      </Text>
                    </Box>
                  </Box>

                  <div className="row pb-3 px-3">
                    <button
                      onClick={() => onOpen()}
                      disabled={
                        !(
                          summary?.acceptedByAgent === null &&
                          refund === true &&
                          summary?.hasQuotation == true
                        )
                      }
                      type="button"
                      className="btn button-color text-white fw-bold border-radius w-100"
                    >
                      Refund Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AlertDialog
          motionPreset="slideInBottom"
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader> Confirm Refund Action?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Do you want to Accept or Reject the refund request?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                isDisabled={desabled}
                onClick={handelRefundRequestAccept}
                style={{ backgroundColor: "#7c04c0", color: "white" }}
              >
                Accept
              </Button>
              <Button
                isDisabled={isRejecet}
                colorScheme="orange"
                ml={3}
                onClick={handelRefundRequestReject}
              >
                Reject
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          motionPreset="slideInBottom"
          onClose={onClose1}
          isOpen={isOpen1}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogCloseButton />
            <AlertDialogBody padding={5}>
              <Text
                color={"red"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                fontSize={"20px"}
                pt={5}
                pb={4}
                fontWeight={500}
              >
                Attention!!{" "}
              </Text>
              <Text className="text-justify">
                We regret to inform you that due to technical issues with the
                Supplier API, the automated refund process is currently
                unavailable. However, we are proceeding with your request
                through our Manual Refund process.
              </Text>
              <Text pt={2}>Thank you for your patience and understanding.</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={onClose1}
                bg={"#7c04c0"}
                _hover={"none"}
                color={"white"}
              >
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          motionPreset="slideInBottom"
          onClose={onClose2}
          isOpen={isOpen2}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogCloseButton />
            <AlertDialogBody padding={5}>
              <Text
                color={"red"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                fontSize={"20px"}
                pt={5}
                pb={4}
                fontWeight={500}
              >
                Attention!!{" "}
              </Text>
              <Text className="text-justify">
                We&apos;re facing a technical issue with the Supplier API but
                our team is working to complete your refund. Please wait or
                contact support if needed.
              </Text>
              <Text pt={2}>Thank you for your patience.</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={onClose2}
                bg={"#7c04c0"}
                _hover={"none"}
                color={"white"}
              >
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default RefundRequest;
