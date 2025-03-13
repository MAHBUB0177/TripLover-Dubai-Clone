import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Icon,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import { toast, ToastContainer } from "react-toastify";
import {
  getBasicInfoForReissueRequest,
  requestReissue,
  requestVoid,
} from "../../common/allApi";
import { FaChevronCircleDown, FaRegAddressCard } from "react-icons/fa";
import { FaChevronCircleUp } from "react-icons/fa";
import moment from "moment";
import { parse } from "date-fns";
import { use } from "react";

const GetReissue = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let [reissueTicketingList, setReissueTicketingList] = useState([]);
  let [reissueSegmentList, setReissueSegmentList] = useState([]);
  let [basicInfo, setBasicInfo] = useState();
  const [loader, setLoader] = useState(false);
  const [isReissue, setIsReissue] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [legWisetoggle, setLegWiseToggle] = useState(true);
  const passengerSelectRefs = useRef([]);
  const segmentsSelectRefs = useRef([]);
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [cabinClassType, setCabinClassType] = useState([]);
  const [resissueType, setResissueType] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllSegments, setSelectAllSegments] = useState(false);
  const [selectedReason, setSelectedReason] = useState();
  const [selectedCabinClass, setSelectedSelectedCabinClass] = useState();

  const getReissueTicketingList = async () => {
    setLoader(true);
    try {
      const response = await getBasicInfoForReissueRequest(
        searchParams.get("uniqueTransId")
      );
      if (response?.data?.isSuccess) {
        setReissueTicketingList(response?.data?.data?.ticketInfos);
        const segmentList = response?.data?.data?.segmentInfos.map(
          (segment) => ({
            ...segment,
            expectedFlightDate: null, // Initialize with null or default value
          })
        );
        setReissueSegmentList(segmentList);
        setBasicInfo(response?.data?.data?.bookingInfo);
        setCabinClassType(response?.data?.data?.allowedCabinClassTypes);
        setResissueType(response?.data?.data?.reissueReasons);
        // setSelectedReason(response?.data?.data?.reissueReasons[0]?.reasonId);
        setSelectedSelectedCabinClass(
          response?.data?.data?.bookingInfo?.cabinClassId
        );
        setLoader(false);
      }
      setLoader(false);
    } catch (error) {
      toast.error("Please try again.");
      setLoader(false);
    }
  };

  useEffect(() => {
    getReissueTicketingList();
  }, []);

  useEffect(() => {
    if (basicInfo?.selectAllPax) {
      setSelectAll(true);
      const newSelectedPassengers = reissueTicketingList.filter(
        (item) => item.canRequest
      );
      setSelectedPassengers(newSelectedPassengers);
      passengerSelectRefs.current.forEach((ref, index) => {
        if (ref.current) {
          ref.current.checked = reissueTicketingList[index]?.canRequest;
        }
      });
    }
  }, [basicInfo?.selectAllPax, reissueTicketingList]);

  const handleCheckboxChange = (item, index) => {
    const isSelected = selectedPassengers.includes(item);
    const newSelectedPassengers = isSelected
      ? selectedPassengers.filter((passenger) => passenger !== item)
      : [...selectedPassengers, item];

    setSelectedPassengers(newSelectedPassengers);
    if (newSelectedPassengers.length === reissueTicketingList.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    if (passengerSelectRefs.current[index]?.current) {
      passengerSelectRefs.current[index].current.checked = !isSelected;
    }
  };

  const handleCheckboxChangeForSegment = (item, index, groupName) => {
    const isSelected = selectedSegments.some(
      (item) => item.groupName === groupName
    );
    const newSelectedSegments = isSelected
      ? selectedSegments.filter((segment) => segment.groupName !== groupName)
      : [...selectedSegments, item];

    setSelectedSegments(newSelectedSegments);

    // if (newSelectedSegments.length === reissueSegmentList.length) {
    //   setSelectAllSegments(true);
    // } else {
    //   setSelectAllSegments(false);
    // }
    if (segmentsSelectRefs.current[index]?.current) {
      segmentsSelectRefs.current[index].current.checked = !selectAllSegments;
    }
  };

  useEffect(() => {
    passengerSelectRefs.current = reissueTicketingList.map(
      (_, index) => passengerSelectRefs.current[index] || React.createRef()
    );
  }, [reissueTicketingList]);

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    const newSelectedPassengers = e.target.checked
      ? reissueTicketingList.filter((item) => item.canRequest)
      : [];
    setSelectedPassengers(newSelectedPassengers);
    passengerSelectRefs.current.forEach((ref, index) => {
      if (ref.current) {
        ref.current.checked =
          e.target.checked && reissueTicketingList[index]?.canRequest;
      }
    });
  };

  const handleSelectAllSegments = (e) => {
    setSelectAllSegments(e.target.checked);
    const newSelectedSegments = e.target.checked
      ? reissueSegmentList.filter((item) => item)
      : [];
    setSelectedSegments(newSelectedSegments);
    segmentsSelectRefs.current.forEach((ref, index) => {
      if (ref.current) {
        ref.current.checked =
          e.target.checked && reissueSegmentList[index]?.groupName;
      }
    });
  };

  const [btnLoader, setBtnLoader] = useState(false);
  let [value, setValue] = React.useState("");
  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };

  const handleDateChange = (index, value, groupName) => {
    setReissueSegmentList((prev) => {
      const updatedList = [...prev];
      updatedList[index] = {
        ...updatedList[index],
        expectedFlightDate: value, // Add or update the property
      };
      return updatedList;
    });
    if (selectedSegments.some((item) => item.groupName === groupName)) {
      setSelectedSegments((prev) => {
        const updatedList = [...prev];
        const segmentToUpdate = updatedList.find(
          (segment) => segment.groupName === groupName
        );
        if (segmentToUpdate) {
          segmentToUpdate.expectedFlightDate = value; // Update the property if the segment is found
        }
        return updatedList;
      });
    }
  };

  const handelnavigate = async () => {
    setBtnLoader(true);
    let payload = {
      reissueTicketIds: [],
      segmentInfos: [],
      bookingId: basicInfo?.bookingId,
      cabinClass: selectedCabinClass,
      reasonId: Number(selectedReason),
      agentRemarks: value,
    };

    if (selectedPassengers?.length === 0) {
      setBtnLoader(false);
      return toast.error("Please select passenger.");
    } else if (selectedSegments?.length === 0) {
      setBtnLoader(false);
      return toast.error("Please select segment.");
    } else if (
      selectedSegments.every(
        (item) =>
          item.expectedFlightDate === null || item.expectedFlightDate === ""
      )
    ) {
      setBtnLoader(false);
      return toast.error("Please select reissue flight date.");
    } else if (!selectedReason) {
      setBtnLoader(false);
      return toast.error("Please select reason type.");
    } else {
      selectedPassengers?.map((item) =>
        payload.reissueTicketIds.push(item?.ticketId)
      );

      selectedSegments?.map((item) =>
        payload.segmentInfos.push({
          destination: item.destination,
          expectedFlightDate: moment(item.expectedFlightDate).format(),
          groupName: item?.groupName,
          origin: item?.origin,
        })
      );
      await requestReissue(payload)
        .then((res) => {
          if (res?.data?.isSuccess) {
            setBtnLoader(false);
            sessionStorage.setItem("reissueData", JSON.stringify(res?.data));
            navigate(
              "/reissue-request?reissueRequestId=" +
                res?.data?.data?.reissueRequestId +
                "&editCount=" +
                0 +
                "&failedAuto=" +
                res?.data?.data?.isAutoReissueEligible,
              "_blank"
            );
          } else {
            setBtnLoader(false);
            toast.error(res?.data?.message);
          }
        })
        .catch((r) => {
          setBtnLoader(false);
          toast.error("Please try again.");
        });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <ToastContainer position="bottom-right" autoClose={1500} />
      <div className="content-wrapper search-panel-bg pb-5 pt-5 px-5">
        <div className="container-fluid">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-white shadow rounded">
                <span className="fw-bold">Reissue Ticket</span>
              </div>
            </div>
          </div>

          <div className="mb-3 card card-body rounded ">
            <div className="table-responsive">
              <table
                className="table table-bordered my-2 mb-3 table-sm"
                style={{ fontSize: "11px" }}
              >
                <thead>
                  <tr>
                    <th
                      colspan="4"
                      className="fw-bold py-2 bg-light"
                      style={{ fontSize: "15px" }}
                    >
                      BOOKING INFO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="py-2" style={{ fontSize: "15px" }}>
                      Booking ID
                    </th>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.uniqueTransId}
                    </td>
                    <td className="py-2 fw-bold" style={{ fontSize: "15px" }}>
                      PNR
                    </td>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.pnr}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 fw-bold" style={{ fontSize: "15px" }}>
                      Fly Date
                    </th>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.flyDate}
                    </td>
                    <td className="py-2 fw-bold" style={{ fontSize: "15px" }}>
                      Airline Code
                    </td>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.airlineCode}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 fw-bold" style={{ fontSize: "15px" }}>
                      Route
                    </th>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.route}
                    </td>
                    <td className="py-2 fw-bold" style={{ fontSize: "15px" }}>
                      Number Of PAX
                    </td>
                    <td className="py-2" style={{ fontSize: "15px" }}>
                      {basicInfo?.numberOfPax}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 rounded">
              {loader ? (
                <div className="d-flex align-items-center justify-content-center my-3">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="px-2  bg-white rounded border my-2">
                    <div className="d-flex justify-content-between align-items-center pt-3 px-2">
                      <div className="fw-bold">Select Passenger</div>
                      <div>
                        <Box
                          display={"flex"}
                          justifyContent={"start"}
                          alignItems={"center"}
                          gap={2}
                          px={1}
                        >
                          {reissueTicketingList.some(
                            (item) => item.canRequest
                          ) && (
                            <>
                              <input
                                type="checkbox"
                                checked={
                                  selectAll ||
                                  selectedPassengers?.length ===
                                    reissueTicketingList?.length
                                }
                                onChange={(e) => handleSelectAll(e)}
                              />
                              <Text fontWeight={700} fontSize={"14px"}>
                                Select All
                              </Text>
                            </>
                          )}

                          {toggle ? (
                            <FaChevronCircleUp
                              onClick={() => setToggle((pre) => !pre)}
                            />
                          ) : (
                            <FaChevronCircleDown
                              onClick={() => setToggle((pre) => !pre)}
                            />
                          )}
                        </Box>
                      </div>
                    </div>
                    <div className="p-2 table-responsive px-2  bg-white">
                      {toggle && (
                        <table
                          className="table text-start table-bordered  table-sm"
                          style={{ width: "100%", fontSize: "13px" }}
                        >
                          <thead className="text-start fw-bold bg-secondary">
                            <tr>
                              <th>Select</th>
                              <th>Reason</th>
                              <th>Name</th>
                              <th>Ticket Number</th>
                              <th>Type</th>
                            </tr>
                          </thead>

                          <tbody>
                            {reissueTicketingList?.length > 0 &&
                              reissueTicketingList?.map((item, index) => (
                                <tr key={index} className="border-none">
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <input
                                        type="checkbox"
                                        ref={passengerSelectRefs.current[index]}
                                        disabled={!item?.canRequest && true}
                                        checked={selectedPassengers.includes(
                                          item
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(item, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    {!item?.canRequest && (
                                      <span className="text-danger ms-1 fw-bold">
                                        {item?.reason}
                                      </span>
                                    )}
                                  </td>
                                  <td>{item.passengerName}</td>
                                  <td>{item.ticketNumber}</td>
                                  <td>{item.passengerType}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  <div className="px-2  bg-white rounded border my-2">
                    <div className="d-flex justify-content-between align-items-center pt-3 px-2">
                      <div className="fw-bold">Segments</div>
                      <div>
                        <Box
                          display={"flex"}
                          justifyContent={"start"}
                          alignItems={"center"}
                          gap={2}
                          px={1}
                        >
                          {/* <>
                            {parseInt(selectedReason) !== 1 && (
                              <>
                                <input
                                  type="checkbox"
                                  checked={
                                    // selectAllSegments ||
                                    selectedSegments?.length ===
                                    reissueSegmentList?.length
                                  }
                                  onChange={(e) => handleSelectAllSegments(e)}
                                />
                                <Text fontWeight={700} fontSize={"14px"}>
                                  Select All
                                </Text>
                              </>
                            )}
                          </> */}
                          <>
                            <input
                              type="checkbox"
                              checked={
                                // selectAllSegments ||
                                selectedSegments?.length ===
                                reissueSegmentList?.length
                              }
                              onChange={(e) => handleSelectAllSegments(e)}
                            />
                            <Text fontWeight={700} fontSize={"14px"}>
                              Select All
                            </Text>
                          </>

                          {legWisetoggle ? (
                            <FaChevronCircleUp
                              onClick={() => setLegWiseToggle((pre) => !pre)}
                            />
                          ) : (
                            <FaChevronCircleDown
                              onClick={() => setLegWiseToggle((pre) => !pre)}
                            />
                          )}
                        </Box>
                      </div>
                    </div>
                    <div className="p-2 table-responsive px-2  bg-white">
                      {legWisetoggle && (
                        <table
                          className="table text-start table-bordered  table-sm"
                          style={{ width: "100%", fontSize: "13px" }}
                        >
                          <thead className="text-start fw-bold bg-secondary">
                            <tr>
                              <th>Select</th>
                              <th>Segment</th>
                              <th>Flight Date</th>
                              <th>Reissue Flight Date</th>
                            </tr>
                          </thead>

                          <tbody>
                            {reissueSegmentList?.length > 0 &&
                              reissueSegmentList?.map((item, index) => (
                                <tr key={index} className="border-none">
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <input
                                        type="checkbox"
                                        ref={segmentsSelectRefs.current[index]}
                                        checked={selectedSegments.some(
                                          (itm) =>
                                            itm.groupName === item.groupName
                                        )}
                                        onChange={() =>
                                          handleCheckboxChangeForSegment(
                                            item,
                                            index,
                                            item.groupName
                                          )
                                        }
                                        // disabled={
                                        //   parseInt(selectedReason) === 1 &&
                                        //   index === 0
                                        //     ? true
                                        //     : false
                                        // }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    {!item?.canRequest && (
                                      <span className=" ms-1 fw-bold">
                                        {item?.origin}- {item?.destination}
                                      </span>
                                    )}
                                  </td>
                                  <td>{item.flightDate}</td>
                                  <td>
                                    <input
                                      type="date"
                                      pattern="\d{4}-\d{2}-\d{2}"
                                      max="9999-12-31"
                                      min={
                                        index === 0
                                          ? moment().format("YYYY-MM-DD") // First segment: today’s date
                                          : reissueSegmentList[index - 1]
                                              ?.expectedFlightDate // Next segments: previous segment’s selected date
                                          ? reissueSegmentList[index - 1]
                                              .expectedFlightDate
                                          : moment().format("YYYY-MM-DD") // Default to today if no previous date selected
                                      }
                                      onChange={(e) =>
                                        handleDateChange(
                                          index,
                                          e.target.value,
                                          item.groupName
                                        )
                                      }
                                      id={"reissueFlightDate" + index}
                                      className="px-2 form-control border-radius"
                                      placeholder="From Date"
                                      style={{
                                        border:
                                          selectedSegments.some(
                                            (itm) =>
                                              itm.groupName ===
                                                item.groupName &&
                                              (!itm.expectedFlightDate ||
                                                itm.expectedFlightDate === "")
                                          ) &&
                                          selectedReason !== 1 &&
                                          "1px solid red",
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                  <div className="card card-body rounded mt-4">
                    <Box>
                      <Grid
                        h="auto"
                        templateRows="repeat(1, 1fr)" /* Single row for a 2-column layout */
                        templateColumns="repeat(2, 1fr)" /* Two equal-width columns */
                        gap={4}
                      >
                        <GridItem>
                          <div className=" mt-2">
                            <label>Cabin Class </label>
                            <select
                              className="form-select border-radius"
                              value={selectedCabinClass}
                              onChange={(e) =>
                                setSelectedSelectedCabinClass(e.target.value)
                              }
                            >
                              {cabinClassType.map((cabin) => (
                                <option key={cabin.id} value={cabin.id}>
                                  {cabin.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </GridItem>
                        <GridItem>
                          <div className="mt-2">
                            <label>
                              Reason Type <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select border-radius"
                              value={selectedReason}
                              onChange={(e) => {
                                setSelectedReason(e.target.value);
                                // if (parseInt(e.target.value) === 1) {
                                //   document.getElementById(
                                //     "reissueFlightDate0"
                                //   ).value = "";
                                //   let updatedSegments = selectedSegments.filter(
                                //     (segment) => segment.groupName !== 0
                                //   );
                                //   setSelectedSegments(updatedSegments);
                                //   setReissueSegmentList((prev) => {
                                //     const updatedList = [...prev];
                                //     updatedList[0] = {
                                //       ...updatedList[0],
                                //       expectedFlightDate: null,
                                //     };
                                //     return updatedList;
                                //   });
                                // }
                              }}
                            >
                              <option value="" selected>
                                Select a reason
                              </option>
                              {resissueType.map((reason) => (
                                <option
                                  key={reason.reasonId}
                                  value={reason.reasonId}
                                >
                                  {reason.reasonName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </GridItem>
                      </Grid>
                    </Box>
                  </div>
                  <div className="card card-body rounded mt-4">
                    <Box pb={4}>
                      <Text mb="8px" fontWeight={700}>
                        Remarks
                      </Text>
                      <Textarea
                        value={value}
                        onChange={handleInputChange}
                        placeholder="Remarks"
                        size="sm"
                        className="border-radius"
                      />
                    </Box>
                    <Box display={"flex"} justifyContent={"flex-start"} gap={3}>
                      {" "}
                      <input
                        type="checkbox"
                        onChange={(e) => setIsReissue(e.target.checked)}
                      />
                      <Text fontWeight={700}>
                        I acknowledge the{" "}
                        <Link to={"/termandcondition"} target="_blank">
                          <u style={{ color: "#7c04c0" }} className="fw-bold">
                            Terms & Conditions
                          </u>
                        </Link>
                      </Text>
                    </Box>
                    <Box
                      pointerEvents={isReissue ? "auto" : "none"}
                      opacity={isReissue ? 1 : 0.5}
                    >
                      <Button
                        onClick={handelnavigate}
                        bg={"#7c04c0"}
                        color={"white"}
                        _hover={"none"}
                        mt={3}
                        disabled={
                          btnLoader
                            ? true
                            : reissueTicketingList.every(
                                (item) => item.canRequest === false
                              )
                        }
                      >
                        Go Quotation
                      </Button>
                    </Box>
                  </div>
                </>
              )}
            </div>

            {/* <div
              className="card card-body rounded col-lg-4"
              style={{ height: "240px" }}
            >
              <Box>
                <Box fontSize={"20px"} fontWeight={700}>
                  Fare Policy
                </Box>

                <Box my={5}>
                  <Text
                    display={"flex"}
                    justifyContent={"center"}
                    fontWeight={700}
                    color={"#7c04c0"}
                  >
                    <Icon as={FaRegAddressCard} boxSize="50px" />
                  </Text>
                  <Text
                    display={"flex"}
                    justifyContent={"center"}
                    fontWeight={700}
                    color={"#7c04c0"}
                    fontSize={"30px"}
                  >
                    Coming Soon...
                  </Text>
                </Box>
              </Box>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GetReissue;
