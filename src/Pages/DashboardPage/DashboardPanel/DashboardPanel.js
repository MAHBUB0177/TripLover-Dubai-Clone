import React, { useEffect, useState } from "react";
import $ from "jquery";
import { environment } from "../../SharePages/Utility/environment";
import currentYear from "../../SharePages/Utility/currentYear";
import Chart from "../Chart";
import Footer from "../../SharePages/Footer/Footer";
import { Box, Text } from "@chakra-ui/react";

import calanderOneMonthRes from "../../../JSON/calanderOneMonthRes";
import RevoCalendar from "revo-calendar";
import { PartialPaymenteligiblestatus, getEventBookingCalender, getPartialinfo, getTicketedAirlines, gettotalbooking, gettotalsales, totalBookingData } from "../../../common/allApi";

const DashboardPanel = () => {
  const [date, setDate] = useState({
    day: new Date().getDay(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [eventList, setEventList] = useState([]);
  const getEventBooking = async () => {
    const response= await getEventBookingCalender(date.year,date.month)
    setEventList(
      await response.data.map((obj) => {
        var date = new Date(obj.date);
        var timestamp = +date;
        return {
          id: obj.id,
          name: obj.name,
          date: timestamp,
        };
      })
    );
  };

  const handleViewTicket = (index) => {
    let obj = [];
    obj = eventList.filter((item, idx) => {
      if (idx === index) {
        return item;
      }
    });
    window.open("/ticket?utid=" + obj[0].id + "&sts=Confirmed", "_blank");
    //navigate("/ticket?utid="+utid,'_blank');
  };

  const [highestTicktedAirlines, setHighestTicktedAirlines] = useState([]);
  const [labelList, setLabelList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [chartData, setChartData] = useState({});
  useEffect(() => {
    const fetchPrices = async () => {
      setChartData({
        labels: highestTicktedAirlines.map((crypto) => crypto.airLineCode),
        datasets: [
          {
            label: "",
            data: highestTicktedAirlines.map((crypto) => crypto.ticketCount),
            backgroundColor: [
              "#ffbb11",
              "#C0C0C0",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
          },
        ],
      });
    };
    fetchPrices();
  }, [highestTicktedAirlines]);

  // useEffect(() => {
  //   $(document).ready(function () {
  //     Chart.register(...registerables);

  //     // var areaChartData = {
  //     //       labels  : labelList,
  //     //       datasets: [
  //     //         {
  //     //           label               : 'Highest Tickted Airlines',
  //     //           backgroundColor     : 'rgba(60,141,188,0.9)',
  //     //           borderColor         : 'rgba(60,141,188,0.8)',
  //     //           pointRadius          : false,
  //     //           pointColor          : '#3b8bba',
  //     //           pointStrokeColor    : 'rgba(60,141,188,1)',
  //     //           pointHighlightFill  : '#fff',
  //     //           pointHighlightStroke: 'rgba(60,141,188,1)',
  //     //           data                : dataList
  //     //         }
  //     //       ]
  //     //     }

  //     //   var barChartCanvas = $("#barChart").get(0).getContext("2d");

  //     //         var barChartData = $.extend(true, {}, areaChartData)
  //     //       var temp0 = areaChartData.datasets[0]
  //     //       barChartData.datasets[0] = temp0;
  //     //         var barChartOptions = {
  //     //       responsive              : true,
  //     //       maintainAspectRatio     : false,
  //     //       datasetFill             : false
  //     //     }
  //     //     new Chart(barChartCanvas, {
  //     //       type: 'bar',
  //     //       data: barChartData,
  //     //       options: barChartOptions
  //     //     })
  //     var areaChartData = {
  //       labels: [""],
  //       datasets: [
  //         {
  //           label: 'Highest Tickted Airlines',
  //           backgroundColor: 'rgba(60,141,188,0.9)',
  //           borderColor: 'rgba(60,141,188,0.8)',
  //           pointRadius: false,
  //           pointColor: '#3b8bba',
  //           pointStrokeColor: 'rgba(60,141,188,1)',
  //           pointHighlightFill: '#fff',
  //           pointHighlightStroke: 'rgba(60,141,188,1)',
  //           data: [0]
  //         }
  //       ]
  //     }
  //     var barChartCanvas = $('#barChart').get(0).getContext('2d')
  //     var barChartData = $.extend(true, {}, areaChartData)
  //     var temp0 = areaChartData.datasets[0]
  //     barChartData.datasets[0] = temp0

  //     var barChartOptions = {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       datasetFill: false
  //     }

  //     var chart = new Chart(barChartCanvas, {
  //       type: 'bar',
  //       data: barChartData,
  //       options: barChartOptions
  //     })

  //   })
  //   $(document).ready(function () {

  //   })

  // }, [labelList, dataList]);
  const [totalBooking, setTotalBokking] = useState(0);
  const [totalTicket, setTotalTicket] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const handleCount = () => {
    const current = new Date();
    const currentDate = `${current.getFullYear()}-${current.getMonth() + 1
      }-${current.getDate()}`;
    let obj = {
      agentId: sessionStorage.getItem("agentId"),
      fromDate: currentDate,
      toDate: currentDate,
    };

    const getTotalBooking = async () => {
      const response = await totalBookingData(obj)
      setTotalBokking(response.data);
    };
    getTotalBooking();

    const getTotalTicket = async () => {
      gettotalbooking(obj).then((response)=>{
        setTotalTicket(response.data);
      })
    };
    getTotalTicket();

    const getTotalSales = async () => {
      gettotalsales(obj).then((response)=>{
        setTotalSales(response.data);
      })
    };
    getTotalSales();

    const getHighestTicktedAirlines = async () => {
      const response = await getTicketedAirlines(obj)
      let labelList = [];
      let dataList = [];
      setHighestTicktedAirlines(response.data);
      response.data.map((item) => {
        labelList.push(item.airLineCode);
        dataList.push(item.ticketCount);
      });
      setLabelList(labelList);
      setDataList(dataList);
    };
    getHighestTicktedAirlines();
  };

  useEffect(() => {
    handleCount();
    getEventBooking();
  }, [date.month]);


  //partial ayment part

  const [getPartialDatainfo, setgetPartialDatainfo] = useState({});
  const [partialStatus, setpartialStatus] = useState({})
  const [loader, setLoader] = useState(false);

  const getPartialPaymentinfo = async () => {
    setLoader(true);
    await getPartialinfo()
      .then((res) => {
        if (res?.data) {
          setLoader(false)
          setgetPartialDatainfo(res?.data?.data);
        }
      })
      .catch((err) => {
        // toast.error("Please try again!");
        setLoader(false)
      });
  };
  
  const getPartialPaymenteligiblestatus = async () => {
   await PartialPaymenteligiblestatus()
      .then((res) => {
        if (res?.data) {
          setpartialStatus(res?.data?.data);
        }
      })
      .catch((err) => {
        // toast.error("Please try again!");
      });
  };
  useEffect(() => {
    getPartialPaymentinfo()
    getPartialPaymenteligiblestatus()
  }, [])

  return (
    <>
      <div
        className="content-wrapper search-panel-bg pb-5"
      >
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 fw-bold">Dashboard</h1>
              </div>
            </div>
          </div>
        </section>
        
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-6">
                <div className="small-box bg-info pb-3">
                  <div className="inner">
                    <h3>{totalBooking}</h3>
                    <p>Total Booking</p>
                  </div>
                 
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box bg-success pb-3">
                  <div className="inner">
                    <h3>{totalTicket}</h3>

                    <p>Total Ticket</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box  pb-3" style={{background:'#f28735'}}>
                  <div className="inner">
                    <h3 className="text-white">AED {totalSales.toLocaleString("en-US")}</h3>
                    <p className="text-white">Total Sales</p>
                  </div>
                 
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box bg-danger pb-3">
                  <div className="inner">
                    <h3>
                      {highestTicktedAirlines[0]?.ticketCount > 0 ? highestTicktedAirlines[0]?.ticketCount : 0 }{" "}
                      <span style={{ fontSize: "15px" }}>
                        {highestTicktedAirlines[0]?.airLineName}
                      </span>
                    </h3>
                    <p>Highest Tickted Airline</p>
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* //partial payment information */}
        {
          loader ? <div className="d-flex align-items-center justify-content-center my-3">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div> : <>
            {partialStatus?.status === "Approved" && <section className="content">
              <div className="container-fluid">
                <h2 className=" p-2" style={{ fontSize: "20px", fontWeight: "bold" }}>Partial Payment</h2>
                <div className="card card-body rounded">
                  <div className="row">
                    <div className="col-lg-12">

                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-3 col-6">
                      <div className="small-box  pb-3" style={{ background: '#cf5d11' }} >
                        <div className="inner">
                          <h3 style={{ color: 'white' }}>{getPartialDatainfo?.paymentDueToday}</h3>

                          <p style={{ color: 'white' }}>Due Today(Count)</p>
                        </div>
                       
                      </div>
                    </div>

                    <div className="col-lg-3 col-6 ">
                      <div className="small-box pb-3" style={{ background: '#cf5d11' }}>
                        <div className="inner">
                          <h3 className="text-white">{getPartialDatainfo?.paymentDueUpcoming}</h3>

                          <p className="text-white">Due UpComing(Count)</p>
                        </div>
                        
                      </div>
                    </div>

                    <div className="col-lg-3 col-6">
                      <div className="small-box pb-3" style={{ background: '#cf5d11' }}>
                        <div className="inner">
                          <h3 className="text-white">{getPartialDatainfo?.paymentDueExpired}</h3>
                          <p className="text-white">Due Expired(Count)</p>
                        </div>
                       
                      </div>
                    </div>

                    <div className="col-lg-3 col-6">
                      <div className="small-box pb-3" style={{ background: '#cf5d11' }}>
                        <div className="inner">
                          <h3 className="text-white">
                            {getPartialDatainfo?.paymentDueTodayAmount}
                          </h3>
                          <p className="text-white">Due Today(Amount)</p>
                        </div>
                       
                      </div>
                    </div>

                    <div className="col-lg-3 col-6">
                      <div className="small-box pb-3" style={{ background: '#cf5d11' }}>
                        <div className="inner">
                          <h3 className="text-white"> {getPartialDatainfo?.paymentDueUpcomingAmount}</h3>
                          <p className="text-white">Due UpComing(Amount)</p>
                        </div>
                       
                      </div>
                    </div>


                    <div className="col-lg-3 col-6">
                      <div className="small-box pb-3" style={{ background: '#cf5d11' }}>
                        <div className="inner">
                          <h3 className="text-white">{getPartialDatainfo?.paymentDueExpiredAmount}</h3>
                          <p className="text-white">Due Expired(Amount)</p>
                        </div>
                       
                      </div>
                    </div>

                    <div className="col-lg-3 col-6">
                      <div className="small-box pb-3" style={{ background: '#cf5d11' }} >
                        <div className="inner">
                          <h3 className="text-white">{partialStatus?.agentLimit}/{partialStatus?.unpaid}</h3>
                          <p className="text-white">Agent Limit</p>
                        </div>
                       
                      </div>
                    </div>

                    <div className="col-lg-3 col-6">
                      <div className="small-box pb-3" style={{ background: '#cf5d11' }}>
                        <div className="inner">
                          <h3 className="text-white">{(partialStatus?.agentLimit - partialStatus?.unpaid)}</h3>
                          <p className="text-white">Available Limit</p>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>}
          </>
        }


        <div className="container-fluid">
          <div className="row hero">
            <div className="col-md-6">
              {/* <div id="calendar2"></div> */}

              <Box
                mx="10px"
                mb={2}
                borderRadius="4px"
                boxShadow="md"
                overflow="hidden"
              >
                <Box w="100%" bg="#1e88e5">
                  <Text
                    fontSize="lg"
                    color="white"
                    fontWeight={400}
                    py="12px"
                    px="20px"
                  >
                    Event Calender
                  </Text>
                </Box>
                <RevoCalendar
                  events={eventList}
                  highlightToday={true}
                  lang="en"
                  primaryColor="#4F6995"
                  secondaryColor="#fff"
                  todayColor="#0083fc"
                  textColor="#1e1e1e"
                  indicatorColor="#ff0000"
                  animationSpeed={300}
                  sidebarWidth={180}
                  detailWidth={280}
                  showDetailToggler={true}
                  showSidebarToggler={true}
                  onePanelAtATime={true}
                  allowDeleteEvent={false}
                  allowAddEvent={false}
                  openDetailsOnDateSelection={true}
                  timeFormat24={true}
                  showAllDayLabel={true}
                  detailDateFormat="DD/MM/YYYY"
                  eventSelected={(index) => {
                    handleViewTicket(index);
                  }}
                  dateSelected={(date) => {
                    setDate(date);
                  }}
                />
              </Box>
            </div>

            <div className="col-md-6">
              {/* <div id="calendar1"></div>   */}
              <div className="card card-success">
                <div className="card-header">
                  <h3 className="card-title">Highest Ticketed Airlines</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="remove"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {/* <div className="chart"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className=""></div></div><div className="chartjs-size-monitor-shrink"><div className=""></div></div></div>
                    <canvas id="barChart" style={{ minHeight: '250px', height: '250px', maxHeight: '250px', maxWidth: '100%', display: 'block', width: '572px' }} width="715" height="312" className="chartjs-render-monitor"></canvas>
                  </div> */}
                  <Chart chartData={chartData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardPanel;
