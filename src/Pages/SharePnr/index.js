import React, { useEffect, useState } from 'react'
import Navbar from '../SharePages/Navbar/Navbar'
import SideNavBar from '../SharePages/SideNavBar/SideNavBar'
import { ToastContainer, toast } from 'react-toastify'
import Footer from '../SharePages/Footer/Footer'
import airports from '../../JSON/airports.json'
import moment from 'moment'
import Loading from '../Loading/Loading'
import $ from "jquery";
import { useNavigate } from 'react-router-dom'
import { filterAndSumWeights } from '../../common/functions'
import { Box } from '@chakra-ui/react'
import { b2BTicketImportSettings, fetchTicketingVendor, importPnr, saveImportPnr } from '../../common/allApi'
const SharePnr = () => {
    const navigate = useNavigate();
    const agentBalance = sessionStorage.getItem('agentBalance');
    const [obj, sentObj] = useState({});
    const [fatchData, setFactchData] = useState();
    const [fatchDataItem2, setFactchDataItem2] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingTicket, setLoadingTicket] = useState(false);
    const [payment, setPayment] = useState({
        partialPayment: false,
        fullPayment: true,
    });
    const servicelist = [
        {
            name: "Select",
            value: ''
        },
        {
            name: "Galileo",
            value: 'UApiGalileo'
        },
        {
            name: "Sabre",
            value: 'Sabre'
        }
        ,
        {
            name: "Amadeus",
            value: 'Amadeus'
        }
    ]



    //passengercount
    function calculateTotalPassengerCount(data) {
        let sum = 0;

        if (data && data.fareBreakdowns) {
            data.fareBreakdowns.forEach(fare => {
                sum += fare.passengerCount;
            });
        }

        return sum;
    }
    const [totalTicketImportServiceCharge, setTotalTicketImportServiceCharge] = useState(0)
    const [extraServiceData, setExtraServiceData] = useState(0)
    const [totalPassenger, setTotalPassenger] = useState(0);
    useEffect(() => {
        fatchData !== undefined && setTotalPassenger(calculateTotalPassengerCount(fatchData))
        if (totalPassenger > 0 && extraServiceData !== null) {
            setTotalTicketImportServiceCharge(totalPassenger * extraServiceData);
        }
    }, [totalPassenger, extraServiceData, fatchData]);

    const getimportpnrSettings = async () => {
        await b2BTicketImportSettings()
            .then((res) => {
                setExtraServiceData(res?.data?.data[0]?.serviceCharge)
            })
            .catch((err) => {
                //alert('Invalid login')
            });
    };

    useEffect(() => {
        getimportpnrSettings()
    }, [])




    const handleFatchPnr = (e) => {
        e.preventDefault();
        if (!obj?.apiCode || obj?.apiCode === "Select") {
            setFactchData();
            setFactchDataItem2();
            return toast.error("Please Select Supplier")
        }

        setLoading(true);
        let payload = {
            pnr: obj?.pnr,
            apiCode: obj?.apiCode,
            apiSubCode: "",
            ledPaxFullName: ""
        }

        const facthPnr = async () => {
            await fetchTicketingVendor(payload)
                .then((res) => {
                    if (res?.data?.item2?.isSuccess === true) {
                        setFactchData(res?.data?.item1);
                        setFactchDataItem2(res?.data?.item2)
                        setLoading(false);
                    } else {
                        setLoading(false);
                        setFactchData();
                        setFactchDataItem2();
                        if (res?.data?.data === null) {
                            toast.error(res?.data?.message);
                        } else {
                            toast.error("Please try again!");
                        }
                    }
                })
                .catch((error) => {
                    setFactchData();
                    setFactchDataItem2();
                    toast.error("Please try again!");
                    setLoading(false);
                });
        }
        facthPnr();
        // e.target.reset();
    }

    // const importData = JSON.parse(localStorage.getItem("importPnr"))

    const handleGenarateTicket = async () => {
        let flightOWnward = [];
        let flightReturn = [];
        fatchData?.segmentInfos?.map((segment => segment?.map(item => {
            let obj = {
                ...item,
                bagPerPerson: filterAndSumWeights(item?.bagPerPerson)
            }
            if (fatchData?.journeyType === 1) {
                flightOWnward.push(obj)
            } else if (fatchData?.journeyType === 2) {
                if (item?.group === 1) {
                    flightReturn.push(obj)
                } else {
                    flightOWnward.push(obj)
                }
            } else {
                flightOWnward.push(obj)
            }
        })))
        let savePayload = {
            bookingId: 0,
            agentId: sessionStorage.getItem("agentId") ?? 0,
            apiCode: fatchData?.apiCode,
            apiSubCode: "",
            flightInfo: {
                journeyType: fatchData?.journeyType === 1 ? "One Way" : fatchData?.journeyType === 2 ? "Round Trip" : "Multi City",
                issueDate: null,
                agentId: sessionStorage.getItem("agentId") ?? 0,
                IsWithPayment: true
            },
            passengerInfoes: fatchData?.passengerInfo,
            segmentInfos: flightReturn.length > 0
                ? {
                    flightOnward: flightOWnward,
                    flightReturn: flightReturn
                }
                : {
                    flightOnward: flightOWnward
                },
            fareBreakdownList: fatchData?.fareBreakdowns,
            basePriceBuying: fatchData?.basePriceBuying,
            basePriceSelling: fatchData?.basePriceSelling,
            taxesBuying: fatchData?.taxesBuying,
            grossBuying: fatchData?.grossBuying,
            totalPriceBuying: fatchData?.totalPriceBuying,
            ait: fatchData?.ait,
            discount: fatchData?.discount,
            status: fatchData?.status,
            taxesSelling: fatchData?.taxesSelling,
            grossSelling: fatchData?.grossSelling,
            totalPriceSelling: fatchData?.totalPriceSelling,
            markupComValue: fatchData?.markupComValue,
            claimedCommission: fatchData?.claimedCommission,
            airlinePnr: fatchData?.airlinePnr.toString(),
            pnr: fatchData?.pnr,
            uniqueTransID: fatchDataItem2?.uniqueTransID,
            timeTicks: fatchDataItem2?.timeTicks,
            remarks: "import",
            isTicketed: true
        }

        const ticketPayload = {
            importPNRRefCode: fatchData?.importPNRRefCode,
            pnr: fatchData?.pnr,
            uniqueTransID: fatchDataItem2?.uniqueTransID,
            bookingRefNumber: fatchData?.bookingRef,
            apiCode: fatchData?.apiCode,
            apiSubCode: "",
            totalPrice: fatchData?.totalPriceSelling,
            isPriceDeductionEnable: true,
            apiRefId: fatchDataItem2.apiRef,
            isPartialPayment: payment?.partialPayment === true ? true : false,
            passengerName: {
                title: fatchData?.passengerInfo[0]?.nameElement?.title,
                firstName: fatchData?.passengerInfo[0]?.nameElement?.firstName,
                lastName: fatchData?.passengerInfo[0]?.nameElement?.lastName,
                middleName: fatchData?.passengerInfo[0]?.nameElement?.middleName
            },
            fromB2B: true
        }

        const savePnrData = async () => {
            setLoadingTicket(true)
            await saveImportPnr(savePayload)
                .then((res) => {
                    if (res?.data?.isSuccess) {
                        ticketPnr()
                    } else {
                        toast.error(res?.data?.message);
                        setLoadingTicket(false)
                        $(".modal-backdrop").remove();
                        $("body").removeClass("modal-open");
                        $("body").removeAttr("style");
                    }
                })
                .catch((error) => {
                    if (error.response.status === 429 || error.response.status === 400) {
                        toast.error(error.request.responseText);
                      }
                      setLoadingTicket(false)
                    $(".modal-backdrop").remove();
                    $("body").removeClass("modal-open");
                    $("body").removeAttr("style");
                    setFactchData();
                    setFactchDataItem2();
                });
        }
        savePnrData();

        const ticketPnr = async () => {
            setLoadingTicket(true)
            await importPnr(ticketPayload)
                .then((res) => {
                    if (res?.data?.item2?.isSuccess) {
                        setLoadingTicket(false)
                        $(".modal-backdrop").remove();
                        $("body").removeClass("modal-open");
                        $("body").removeAttr("style");
                        localStorage.setItem("ismail", JSON.stringify(true));
                        navigate("/ticket?utid=" + res?.data?.item2?.uniqueTransID + "&sts=Confirmed");
                    }
                    else if (res.data.item2?.isSuccess === false && res.data.item2?.isMessageShow) {
                        setLoadingTicket(false)
                        $(".modal-backdrop").remove();
                        $("body").removeClass("modal-open");
                        $("body").removeAttr("style");
                        toast.error(res.data.item2?.message);
                    }
                    else {
                        setLoadingTicket(false)
                        $(".modal-backdrop").remove();
                        $("body").removeClass("modal-open");
                        $("body").removeAttr("style");
                        // toast.error(res?.data?.item2?.message);
                        navigate("/processticket");
                    }
                })
                .catch((error) => {
                    toast.error("Please try again!");
                    setLoadingTicket(false)
                    setLoadingTicket(false)
                    $(".modal-backdrop").remove();
                    $("body").removeClass("modal-open");
                    $("body").removeAttr("style");
                });
        }
    }
    return (
        <div>
            {loadingTicket && <Loading flag={2} loading={loadingTicket} ></Loading>}
            <Navbar></Navbar>
            <SideNavBar></SideNavBar>

            <div className="content-wrapper search-panel-bg">
                <section className="content-header"></section>
                <section className="content">
                    <ToastContainer position="bottom-right" autoClose={1500} />
                    <form
                        className="mx-5 mt-3"
                        encType="multipart/form-data"
                        onSubmit={handleFatchPnr}
                    >
                        <div className="card">
                            <div
                                className="card-header fw-bold"
                                style={{ color: "#02046a" }}
                            >
                                Share PNR
                            </div>
                            <div className="card-body">
                                <div className="m-4">
                                    <hr className="my-3" />
                                    <div className="row align-items-center">
                                        <div className="col-sm-4">
                                            <label>
                                                Supplier
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <select
                                                className="form-select border-radius"
                                                // value={depositTypeId}
                                                placeholder="Supplier"
                                                required
                                                name="apiCode"
                                                onChange={(e) => {
                                                    sentObj({
                                                        ...obj,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}

                                            >
                                                {servicelist?.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.value}>
                                                            {item.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div className="col-sm-4">
                                            <label>
                                                PNR
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                type={"text"}
                                                className="form-control border-radius"
                                                placeholder="PNR"
                                                name="pnr"
                                                required
                                                onChange={(e) => {
                                                    sentObj({
                                                        ...obj,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}
                                            ></input>
                                        </div>
                                        <div className="col-sm-4">
                                            {
                                                obj?.apiCode === "UApiGalileo" ? <p style={{ marginTop: '20px' }}> "Please find the shared PNR code
                                                    QEB/6FJ/80+85"</p> : obj?.apiCode === "Sabre" ? <p style={{ marginTop: '20px' }}>"Please find the shared PNR code
                                                        W/GS/A/F0YL/ALLOTH/PNRU/L-GDS PNR
                                                        "</p> : obj?.apiCode === "Amadeus" ? <p style={{ marginTop: '20px' }}>"Please find the shared PNR code<br></br>
                                                            ESDACVS33KV-B;RFS;ER;ER"</p> : <></>
                                            }
                                        </div>
                                        <div className="col-sm-12 text-center">
                                            <button
                                                className="btn button-color col-sm-1 mt-3 text-white fw-bold border-radius"
                                                type="submit"
                                                disabled={loading && true}
                                            >
                                                {loading ? (
                                                    <span
                                                        class="spinner-border spinner-border-sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                ) : (
                                                    <span>Fetch</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </section>

                {
                    !loading && fatchData && <>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 py-3">
                                    <h4 className="fw-bold text-center text-dark p-2">
                                        Thank you for your booking
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="container pb-5">
                            <div id="ui-view" data-select2-id="ui-view">
                                <div >
                                    <div className="card box-shadow py-5">
                                        <div
                                            className="card-body"
                                            id="sendEmailDiv"
                                        >
                                            <div className="mx-1 px-1">
                                                <div className="table-responsive-sm">
                                                    <table
                                                        class="table table-bordered my-2 mb-3 table-sm"
                                                        style={{ fontSize: "11px" }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th colspan="4" className="fw-bold py-2 bg-light">
                                                                    BOOKING CONFIRMED
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="fw-bold">Booking ID:</td>
                                                                <td>{fatchDataItem2?.uniqueTransID}</td>
                                                                <td className="fw-bold">PNR</td>
                                                                <td>{fatchData?.pnr}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Booking Status:</th>
                                                                <td>
                                                                    {fatchData?.status}
                                                                </td>
                                                                <td className="fw-bold">Booked By:</td>
                                                                <td>{sessionStorage.getItem("agentName")}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>AirlinePnr:</th>
                                                                <td>
                                                                    {fatchData?.airlinePnr?.map((item, index, array) => {
                                                                        return (
                                                                            <> {item}
                                                                                {index !== array?.length - 1 && ','}</>
                                                                        )
                                                                    }
                                                                    )}
                                                                </td>

                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="table-responsive-sm">
                                                    <table
                                                        className="table table-bordered table-sm"
                                                        style={{ fontSize: "11px" }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th colspan="5" className="fw-bold py-2 bg-light">
                                                                    PASSENGER DETAILS
                                                                </th>
                                                            </tr>
                                                            <tr className="text-center">
                                                                <th>Name</th>
                                                                <th>Type</th>
                                                                <th>Gender</th>
                                                                <th>DOB</th>
                                                                <th>Passport No</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-center">
                                                            {fatchData?.passengerInfo.map(
                                                                (item, index) => (
                                                                    <tr key={index}>
                                                                        <td>
                                                                            {item.nameElement.title}{" "}
                                                                            {item.nameElement.firstName}{" "}
                                                                            {item.nameElement.lastName}
                                                                        </td>
                                                                        <td>
                                                                            {item.passengerType === "ADT"
                                                                                ? "Adult"
                                                                                : item.passengerType === "CNN"
                                                                                    ? "Child"
                                                                                    : item.passengerType === "CHD"
                                                                                        ? "Child"
                                                                                        : item.passengerType === "INF"
                                                                                            ? "Infant"
                                                                                            : ""}
                                                                        </td>
                                                                        <td>{item.gender}</td>
                                                                        <td>
                                                                            {
                                                                                item.dateOfBirth === null
                                                                                    ? "N/A"
                                                                                    : moment(item.dateOfBirth).format(
                                                                                        "DD-MMMM-yyyy"
                                                                                    )
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item?.documentInfo?.documentNumber === null
                                                                                    ? "N/A"
                                                                                    : item?.documentInfo?.documentNumber
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="table-responsive-sm">
                                                    <table
                                                        className="table table-bordered table-sm"
                                                        style={{ fontSize: "11px" }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th colspan="8" className="fw-bold py-2 bg-light">
                                                                    TRAVEL SEGMENTS
                                                                </th>
                                                            </tr>
                                                            <tr className="text-center">
                                                                <th>Airline</th>
                                                                <th>Flight</th>
                                                                <th>Departs</th>
                                                                <th>Date/Time</th>
                                                                <th>Arrives</th>
                                                                <th>Date/Time</th>
                                                                <th>Fare Basis</th>
                                                                <th>Cabin</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-center">
                                                            {fatchData?.segmentInfos?.map(segment => segment?.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>
                                                                            {item.airline}
                                                                            <br></br>
                                                                            <span style={{ fontSize: "12px" }}>
                                                                                {/* {item.plane[0]} */}
                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            {item.flightNo}
                                                                        </td>
                                                                        <td>
                                                                            {item.origin}
                                                                            <br></br>
                                                                            <span style={{ fontSize: "12px" }}>
                                                                                {airports
                                                                                    .filter((f) => f.iata === item.origin)
                                                                                    .map((item) => item.city)}

                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            {moment(item.depature).format(
                                                                                "DD-MM-YYYY"
                                                                            )}
                                                                            <br></br>
                                                                            {moment(item.depature).format(
                                                                                "HH:mm:ss"
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {item.destination}
                                                                            <br></br>
                                                                            <span style={{ fontSize: "12px" }}>
                                                                                {airports
                                                                                    .filter((f) => f.iata === item.destination)
                                                                                    .map((item) => item.city)}

                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            {moment(item.arrival).format(
                                                                                "DD-MM-YYYY"
                                                                            )}
                                                                            <br></br>
                                                                            {moment(item.arrival).format("HH:mm:ss")}
                                                                        </td>
                                                                        <td>{item.fareBasisCode}</td>
                                                                        <td>
                                                                            {" "}
                                                                            {item.bookingCode}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }))}

                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="table-responsive-sm">
                                                    <table
                                                        className="table table-bordered table-sm"
                                                        style={{ fontSize: "11px" }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th colspan="7" className="fw-bold py-2 bg-light">
                                                                    FARE DETAILS
                                                                </th>
                                                            </tr>
                                                            <tr className="text-end">
                                                                <th className="text-center">Type</th>
                                                                <th>Base</th>
                                                                <th>Tax</th>
                                                                <th>Commission</th>
                                                                <th>AIT</th>
                                                                <th>Pax</th>
                                                                <th>Total Pax Fare</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-end">
                                                            {fatchData?.fareBreakdowns?.map((item) => {
                                                                return (
                                                                    <tr>
                                                                        <td className="text-center">{item.passengerType === "ADT"
                                                                            ? "Adult"
                                                                            : item.passengerType === "CNN"
                                                                                ? "Child"
                                                                                : item.passengerType === "CHD"
                                                                                    ? "Child"
                                                                                    : item.passengerType === "INF"
                                                                                        ? "Infant"
                                                                                        : ""}</td>
                                                                        <td className="left">
                                                                            {item.basePrice.toLocaleString(
                                                                                "en-US"
                                                                            )}
                                                                        </td>
                                                                        <td className="center">
                                                                            {item.tax.toLocaleString(
                                                                                "en-US"
                                                                            )}
                                                                        </td>
                                                                        <td className="right">
                                                                            {item.discount.toLocaleString(
                                                                                "en-US"
                                                                            )}
                                                                        </td>
                                                                        <td className="right">
                                                                            {item.ait.toLocaleString(
                                                                                "en-US"
                                                                            )}
                                                                        </td>
                                                                        <td className="right">
                                                                            {
                                                                                item.passengerCount
                                                                            }
                                                                        </td>
                                                                        <td className="right fw-bold">
                                                                            AED{" "}
                                                                            {(
                                                                                item.totalPrice * item.passengerCount
                                                                            ).toLocaleString("en-US")}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}

                                                            <tr className="fw-bold">
                                                                <td colSpan={5} className="border-none"></td>
                                                                <td>Total Ticket Import Service Charge</td>
                                                                <td>
                                                                    AED{" "}
                                                                    {(totalTicketImportServiceCharge).toLocaleString(
                                                                        "en-US"
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr className="fw-bold">
                                                                <td colSpan={5} className="border-none"></td>
                                                                <td>Grand Total</td>
                                                                <td>
                                                                    AED{" "}
                                                                    {(fatchData?.totalPriceSelling + totalTicketImportServiceCharge).toLocaleString(
                                                                        "en-US"
                                                                    )}
                                                                </td>
                                                            </tr>



                                                        </tbody>
                                                    </table>

                                                    {fatchData?.partialPaymentEligibilityRsp?.isEligible && (
                                                        <Box className='my-2'>
                                                            <fieldset
                                                                className="border rounded"
                                                                style={{
                                                                    marginBottom: "2%",
                                                                    paddingLeft: "2%",
                                                                }}
                                                            >
                                                                <legend
                                                                    className="float-none w-auto fw-bold "
                                                                    style={{ fontSize: "14px" }}
                                                                >
                                                                    {" Payments Options"}
                                                                </legend>
                                                                <Box className="d-flex justify-content-start gap-4">

                                                                    <Box gap={2} fontSize={"14px"} onClick={() =>
                                                                        setPayment({
                                                                            partialPayment: true,
                                                                            fullPayment: false,
                                                                        })}>
                                                                        <input
                                                                            type="radio"
                                                                            checked={payment.partialPayment}
                                                                            value={payment.partialPayment}
                                                                            name="flexRadioDefault"
                                                                            id="flexRadioDefault1"
                                                                        />
                                                                        <label className="pl-2">
                                                                            Partial Payment{" "}
                                                                            <span style={{ fontSize: "12px" }} className="text-danger">
                                                                                (InstantPay - {fatchData?.partialPaymentEligibilityRsp?.instantPay?.toLocaleString("en-US")})
                                                                            </span>

                                                                        </label>
                                                                        {
                                                                            payment?.partialPayment ? <>
                                                                                <p className="text-end fw-bold text-danger pb-2" style={{ fontSize: "12px" }}><span >Settlement Days : </span> {moment(new Date()).add(fatchData?.partialPaymentEligibilityRsp?.settlementDays, 'days').format("DD MMM,yyyy, ddd")}({fatchData?.partialPaymentEligibilityRsp?.settlementDays}days)</p></> : <></>
                                                                        }


                                                                    </Box>

                                                                    <Box gap={4} fontSize={"14px"} onClick={() =>
                                                                        setPayment({
                                                                            partialPayment: false,
                                                                            fullPayment: true,
                                                                        })}>
                                                                        <input
                                                                            type="radio"
                                                                            value={payment.fullPayment}
                                                                            checked={payment.fullPayment && true}
                                                                            name="flexRadioDefault"
                                                                            id="flexRadioDefault2"
                                                                        />
                                                                        <label className="pl-2">
                                                                            Full Payment{" "}
                                                                            <span
                                                                                style={{ fontSize: "12px" }}
                                                                                className="text-danger"
                                                                            >
                                                                                (Totalpay -{" "}
                                                                                {fatchData?.totalPriceSelling?.toLocaleString("en-US")})
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Box>
                                                            </fieldset>
                                                        </Box>
                                                    )}
                                                </div>
                                            </div>

                                        </div>

                                        {
                                            fatchData?.partialPaymentEligibilityRsp?.isEligible ? <>
                                                {
                                                    payment.partialPayment ? <>
                                                        {agentBalance <
                                                            fatchData?.partialPaymentEligibilityRsp?.instantPay ? (
                                                            <>
                                                                <div className="row mb-5 mt-2">
                                                                    <div className="col-lg-12 text-center text-danger">
                                                                        <p>
                                                                            You don't have available balance to generate Ticket!
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) :
                                                            <div className="row mb-1 mt-2">
                                                                <div className="col-lg-12 text-center">
                                                                    <button
                                                                        className="btn button-color text-white fw-bold w-25 mt-2 border-radius"
                                                                        onClick={handleGenarateTicket}
                                                                    >
                                                                        Issue Ticket
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        }
                                                    </>
                                                        :
                                                        <>
                                                            {agentBalance <
                                                                fatchData?.totalPriceSelling ? (
                                                                <>
                                                                    <div className="row mb-5 mt-2">
                                                                        <div className="col-lg-12 text-center text-danger">
                                                                            <p>
                                                                                You don't have available balance to generate Ticket!
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) :
                                                                <div className="row mb-1 mt-2">
                                                                    <div className="col-lg-12 text-center">
                                                                        <button
                                                                            className="btn button-color text-white fw-bold w-25 mt-2 border-radius"
                                                                            onClick={handleGenarateTicket}
                                                                        >
                                                                            Issue Ticket
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </>
                                                }
                                            </>
                                                :
                                                <>
                                                    {agentBalance <
                                                        fatchData?.totalPriceSelling ? (
                                                        <>
                                                            <div className="row mb-5 mt-2">
                                                                <div className="col-lg-12 text-center text-danger">
                                                                    <p>
                                                                        You don't have available balance to generate Ticket!
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) :
                                                        <div className="row mb-1 mt-2">
                                                            <div className="col-lg-12 text-center">
                                                                <button
                                                                    className="btn button-color text-white fw-bold w-25 mt-2 rounded btn-sm"
                                                                    onClick={handleGenarateTicket}
                                                                >
                                                                    Issue Ticket
                                                                </button>
                                                            </div>
                                                        </div>
                                                    }
                                                </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
            <Footer></Footer>
        </div>
    )
}

export default SharePnr