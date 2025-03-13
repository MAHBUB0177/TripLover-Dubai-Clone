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
import {
  getDataForReissueQuotationView,
  getDataForVoidQuotationView,
  getReissueRequestAccept,
  getVoidRequestAccept,
} from "../../common/allApi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import CountdownTimerReissue from "./countDown";

const ReissueRequest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isReissue, setIsReissue] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [reissueSegmentList, setReissueSegmentList] = useState([]);
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

  let [quotationVoidTicketingView, setQuotationVoidTicketingView] = useState(
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

  const getQuotationVoidTicketingView = async () => {
    setLoader(true);
    try {
      const response = await getDataForReissueQuotationView(
        searchParams.get("reissueRequestId"),
        searchParams.get("editCount")
      );
      if (response?.data?.isSuccess && response?.data?.data === null) {
        sessionStorage.setItem("rejectedList", true);
        // navigate("/reissue-all-request");
      }
      if (response?.data?.isSuccess) {
        setQuotationVoidTicketingView(response?.data?.data?.quotations);
        setReissueSegmentList(response?.data?.data?.segmentInformation);
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
  const handelReissueRequestAccept = async () => {
    setIsdesabled(true);
    try {
      const response = await getReissueRequestAccept(
        summary?.reissueRequestId,
        "true",
        summary?.editCount
      );
      if (response?.data?.isSuccess) {
        onClose();
        if (response.data?.data?.failedAuto) {
          onOpen2();
        } else {
           navigate("/my-bookings", {
              state: {
                navigate: "reissue",
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
  const handelReissueRequestReject = async () => {
    setIsReject(true);
    try {
      const response = await getReissueRequestAccept(
        summary?.reissueRequestId,
        "false",
        summary?.editCount
      );
      if (response?.data?.isSuccess) {
        onClose();
        getQuotationVoidTicketingView();
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
    getQuotationVoidTicketingView();
    window.scrollTo(0, 0);
  }, []);

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
                  <span className="fw-bold">Reissue Ticket</span>
                </div>
              </div>
            </div>

            <div className=" row mx-lg-4 mx-md-4 mx-sm-1 my-3">
              <div className="col-lg-8 ">
                <div className=" box-shadow bg-white rounded">
                  <div className="row bg-light rounded mx-1">
                    <div className="d-flex justify-content-start align-items-center py-2 gap-3">
                      <div className="fw-bold">Reissue For {basicInfo?.route}</div>
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
                                <CountdownTimerReissue
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
                              <td>
                                {summary?.status ? summary.status : "N/A"}
                              </td>
                              <td className="fw-bold">Agency Name</td>
                              <td>
                                {summary?.agencyName
                                  ? summary.agencyName
                                  : "N/A"}
                              </td>
                            </tr>

                            <tr>
                              <th>Fly Date</th>
                              <td>
                                {basicInfo?.flyDate !== null
                                  ? moment(basicInfo?.flyDate).format(
                                      "DD-MMMM-yyyy"
                                    )
                                  : "N/A"}
                              </td>
                              <td className="fw-bold">
                                Quotation Created Date
                              </td>
                              <td>
                                {summary?.quotationCreatedDate !== null
                                  ? moment(
                                      summary?.quotationCreatedDate
                                    ).format("DD-MMMM-yyyy")
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
                        {/* {quotationVoidTicketingView?.length > 0 &&
                        quotationVoidTicketingView?.map((item, index) => {
                          return <VoidableFlightInfo item={item} key={index} />;
                        })} */}
                      </>
                    )}
                  </div>
                </div>

                <div className="px-2 bg-white rounded border my-3 pb-3">
                  <div className="d-flex justify-content-between align-items-center pt-3 px-2">
                    <div className="fw-bold">Passengers Informations</div>
                  </div>
                  <div className="p-2 table-responsive px-2 bg-white">
                    <table
                      className="table text-start table-bordered table-sm"
                      style={{
                        width: "100%",
                        fontSize: "13px",
                        marginBottom: 0,
                      }}
                    >
                      <thead className="text-start fw-bold bg-secondary">
                        <tr>
                          <th>Name</th>
                          <th>Airline Code</th>
                          <th>PNR</th>
                          <th>Ticket Number</th>
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotationVoidTicketingView?.length > 0 &&
                          quotationVoidTicketingView?.map((item, index) => (
                            <tr key={index} className="border-none">
                              <td>
                                <span className="ms-1 fw-bold">
                                  {item?.passengerName}
                                </span>
                              </td>
                              <td>{item.airlineCode}</td>
                              <td>{item.pnr}</td>
                              <td>{item.ticketNumbers}</td>
                              <td>{item.passengerType}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="px-2 bg-white rounded border pb-3">
                  <div className="d-flex justify-content-between align-items-center pt-3 px-2">
                    <div className="fw-bold">Segments Informations</div>
                  </div>
                  <div className="p-2 table-responsive px-2 bg-white">
                    <table
                      className="table text-start table-bordered table-sm"
                      style={{
                        width: "100%",
                        fontSize: "13px",
                        marginBottom: 0,
                      }}
                    >
                      <thead className="text-start fw-bold bg-secondary">
                        <tr>
                          <th>Route</th>
                          <th>Flight Date</th>
                          <th>Expected Flight Date</th>
                          {
                            reissueSegmentList[0]?.departureDate !==null && 
                          <th>Reissue Flight Date</th>

                          }
                        </tr>
                      </thead>
                      <tbody>
                        {reissueSegmentList?.length > 0 &&
                          reissueSegmentList?.map((item, index) => (
                            <tr key={index} className="border-none">
                              <td>
                                <span className="ms-1 fw-bold">
                                  {item?.route}
                                </span>
                              </td>
                              <td>{item.flightDate}</td>
                              <td>{item.expectedFlightDate}</td>
                              {
                                item?.departureDate !== null && 
                                <td>{item.departureDate}</td>
                              }
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

               {summary?.hasQuotation && <div className="px-2 bg-white rounded border my-3 pb-3">
                  <div className="d-flex justify-content-between align-items-center pt-3 px-2">
                    <div className="fw-bold">Fare Difference Informations</div>
                  </div>
                  <div className="p-2 table-responsive px-2 bg-white">
                    <table
                      className="table text-start table-bordered table-sm"
                      style={{
                        width: "100%",
                        fontSize: "13px",
                        marginBottom: 0,
                      }}
                    >
                      <thead className="text-start fw-bold bg-secondary">
                        <tr>
                          <th>Name</th>
                          <th className="text-right">Base Diff.</th>
                          <th className="text-right">Tax Diff.</th>
                          <th className="text-right">Airline Fee </th>
                          <th className="text-right">Service Charge</th>
                          <th className="text-right"> Fare Diff.</th>
                          <th className="text-right"> Reissue Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotationVoidTicketingView?.length > 0 &&
                          quotationVoidTicketingView?.map((item, index) => (
                            <tr key={index} className="border-none">
                              <td>
                                <span className="ms-1 fw-bold">
                                  {item?.passengerName}
                                </span>
                              </td>
                              <td className="text-right">{item.basePriceDifference}</td>
                              <td className="text-right">{item.taxPriceDifference}</td>
                              <td className="text-right">{item.airlineFee}</td>
                              <td className="text-right">{item.serviceCharge}</td>

                              <td className="text-right">{item.fareDifference}</td>
                              <td className="text-right">{item.totalReissueAmount}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>}
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
                  <div className=" container row pt-3 pb-2 px-2">
                    <div
                      // className="col-lg-12 border py-1 mb-1 rounded"
                      style={{ color: "#67696a" }}
                    >
                      <>
                        <div className="row mt-2" style={{ fontSize: "14px" }}>
                          <Flex
                            justifyContent={"space-between"}
                            color={"#7c04c0"}
                            lineHeight="1.8"
                          >
                            <Text fontWeight={600}>Fare Difference</Text>
                            {summary?.hasQuotation ? (
                              <Text>{summary?.totalFareDifference}AED</Text>
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
                              <Text fontWeight={600}>
                              Tax Difference
                              </Text>

                              {/* <Text>{summary?.totalTaxPriceDifference}AED</Text> */}
                              {summary?.hasQuotation ? (
                              <Text>{summary?.totalTaxPriceDifference}AED</Text>
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
                            <Text fontWeight={600}>Airline's Fee</Text>

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
                            <Text fontWeight={600}>Amount to be Paid</Text>

                            {summary?.hasQuotation ? (
                              <Text>{summary?.totalReissueAmount}AED</Text>
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
                        onChange={(e) => setIsReissue(e.target.checked)}
                      />
                      <Text fontWeight={700}>
                        I acknowledge the{" "}
                        <Link to="/termandcondition" style={{ color: "#7c04c0" }} className="fw-bold" target="_blank">
                          <u>Terms & Conditions{" "}
                            </u>
                        </Link>{" "}
                      </Text>
                    </Box>
                  </Box>

                  <div className="row pb-3 px-3">
                    <button
                      onClick={() => onOpen()}
                      disabled={
                        !(
                          summary?.acceptedByAgent === null &&
                          isReissue === true &&
                          summary?.hasQuotation == true
                        )
                      }
                      type="button"
                      className="btn button-color text-white fw-bold border-radius w-100"
                    >
                      Reissue Now
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
            <AlertDialogHeader> Confirm Reissue Action?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Do you want to Accept or Reject the Reissue request?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                isDisabled={desabled}
                onClick={handelReissueRequestAccept}
                style={{ backgroundColor: "#7c04c0", color: "white" }}
              >
                Accept
              </Button>
              <Button
                isDisabled={isRejecet}
                colorScheme="orange"
                ml={3}
                onClick={handelReissueRequestReject}
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
                Supplier API, the automated reissue process is currently
                unavailable. However, we are proceeding with your request
                through our Manual reissue process.
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
                our team is working to complete your void. Please wait or
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

export default ReissueRequest;
