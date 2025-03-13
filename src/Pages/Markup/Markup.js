import React, { useEffect, useState } from "react";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import axios from "axios";
import { environment } from "../SharePages/Utility/environment";
import moment from "moment";
import "./Markup.css";
import { MultiSelectComponent } from "@syncfusion/ej2-react-dropdowns";
import $ from "jquery";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
const Markup = () => {
  useEffect(() => {
    $("#js-licensing").remove();
    $(document).ready(function () {
      $("#js-licensing").remove();
    });
  }, []);

  let [airlineList, setAirlineList] = useState([]);
  let [countryList, setCountryList] = useState([]);
  let [agentMarkupList, setAgentMarkupList] = useState([]);
  let [airportList, setAirportList] = useState([]);
  let cabinclassList = [
    { id: 0, name: "ALL" },
    { id: 1, name: "Economy" },
    { id: 2, name: "Primary Economy" },
    { id: 3, name: "Business" },
  ];
  let markuptypeList = [
    { id: 1, name: "Percent" },
    { id: 2, name: "Flat" },
  ];
  let commissiontypeList = [
    { id: 1, name: "Percent" },
    { id: 2, name: "Flat" },
  ];
  let currencyList = [
    { id: 1, name: "Taka" },
    { id: 2, name: "Doller" },
    { id: 3, name: "Indian Rupee" },
    { id: 4, name: "Euro" },
    { id: 5, name: "Ringgit" },
  ];
  let applyonList = [
    { id: 1, name: "Total Price" },
    { id: 2, name: "Base Price" },
  ];
  let applyforList = [
    { id: 1, name: "Booking" },
    { id: 2, name: "Per Passenger" },
  ];
  let faretypeList = [
    { id: 1, name: "Private" },
    { id: 2, name: "Public" },
  ];
  let triptypeList = [
    { id: 1, name: "One Way" },
    { id: 2, name: "Round Trip" },
    { id: 3, name: "Multi City" },
  ];

  let [currentItem, setCurrentItem] = useState({});

  let [airlineId, setAirlineId] = useState(0);
  let [originCountryId, setOriginCountryId] = useState(0);
  let [destinationCountryId, setDestinationCountryId] = useState(0);
  let [validFrom, setValidFrom] = useState("");
  let [validTo, setValidTo] = useState("");
  let [rbDs, setRBDs] = useState("");
  let [cabinClassId, setCabinClassId] = useState(1);
  let [isActive, setIsActive] = useState(true);

  let [currencyId, setCurrencyId] = useState(1);
  let [markupTypeId, setMarkupTypeId] = useState(1);
  let [markupValue, setMarkupValue] = useState(0);
  let [commissionTypeId, setCommissionTypeId] = useState(1);
  let [commissionValue, setCommissionValue] = useState(0);
  let [markupApplyOn, setMarkupApplyOn] = useState(1);
  let [commissionApplyOn, setCommissionApplyOn] = useState(1);
  let [applyForId, setApplyForId] = useState(1);
  let [originAirportCode, setOriginAirportCode] = useState(null);
  let [destinationAirportCode, setDestinationAirportCode] = useState(null);
  let [fareTypeId, setFareTypeId] = useState(0);
  let [tripTypeId, setTripTypeId] = useState(0);
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  const fieldIds = { text: "name", value: "id" };
  const fieldCodes = { text: "name", value: "code" };
  const handleGetAgentMarkups = (currentPageNumber) => {
    const getData = async () => {
      const response = await axios.get(
        environment.markupsByAgent +
          "/" +
          (sessionStorage.getItem("agentId") ?? 0) +
          `?pageNumber=${currentPageNumber}&pageSize=${pageSize}`,
        environment.headerToken
      );
      setAgentMarkupList(response.data.data);
      setPageCount(response.data.totalPages);
    };
    getData();
  };
  const handleCreateItem = () => {
    const getAirlines = async () => {
      const response = await axios.get(environment.getairlineList);

      airlineList = response.data;
      airlineList.push({ code: "ALL" });
      setAirlineList(airlineList);
    };

    getAirlines();
    const getCountries = async () => {
      const response = await axios.get(environment.getcountryList);
      setCountryList(response.data);
    };
    getCountries();
    const getAirlports = async () => {
      const response = await axios.get(environment.getairportList);

      setAirportList(response.data);
    };
    getAirlports();
    clearForm();
  };
  const clearForm = () => {
    setCurrentItem(null);
    setAirlineId(0);
    setOriginCountryId(0);
    setDestinationCountryId(0);
    setValidFrom("");
    setValidTo("");
    setRBDs("");
    setCabinClassId(1);
    setIsActive(true);
    setCurrencyId(1);
    setMarkupTypeId(1);
    setMarkupValue(0);
    setCommissionTypeId(1);
    setCommissionValue(0);
    setMarkupApplyOn(1);
    setCommissionApplyOn(1);
    setApplyForId(1);
    setOriginAirportCode(null);
    setDestinationAirportCode(null);
    setFareTypeId(null);
    setTripTypeId(null);
  };
  const handleEditItem = (item) => {
    const getAirlines = async () => {
      const response = await axios.get(environment.getairlineList);
      setAirlineList(response.data);
    };
    getAirlines();
    const getCountries = async () => {
      const response = await axios.get(environment.getcountryList);
      setCountryList(response.data);
    };
    getCountries();
    const getAirlports = async () => {
      const response = await axios.get(environment.getairportList);
      setAirportList(response.data);
    };
    getAirlports();
    clearForm();
    setCurrentItem(item);
    setAirlineId(item.airlineIds?.split(","));
    setOriginCountryId(item.originCountryIds?.split(","));
    setDestinationCountryId(item.destinationCountryIds?.split(","));
    setValidFrom(item.validFrom);
    setValidTo(item.validTo);
    setRBDs(item.rbDs);
    setCabinClassId(item.cabinClass);
    setIsActive(item.isActive);
    setCurrencyId(item.currencyId);
    setMarkupTypeId(item.markupTypeId);
    setMarkupValue(item.markupValue);
    setCommissionTypeId(item.commissionTypeId);
    setCommissionValue(item.commissionValue);
    setMarkupApplyOn(item.markupApplyOn);
    setCommissionApplyOn(item.commissionApplyOn);
    setApplyForId(item.applyFor);
    setOriginAirportCode(item.originAirportCodes?.split(","));
    setDestinationAirportCode(item.destinationAirportCodes?.split(","));
    setFareTypeId(item.fareTypeId);
    setTripTypeId(item.tripTypeId);
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
    handleGetAgentMarkups(currentPage);
  };

  const handleMarkupSubmit = () => {
    let originAirportAll = false;
    if (
      originAirportCode !== undefined &&
      originAirportCode !== null &&
      originAirportCode !== ""
    ) {
      originAirportCode?.map((item, index) => {
        if (item === "ALL Airports") {
          originAirportAll = true;
        }
      });
    }
    let destinationAirportAll = false;
    if (
      destinationAirportCode !== undefined &&
      destinationAirportCode !== null &&
      destinationAirportCode !== ""
    ) {
      destinationAirportCode?.map((item, index) => {
        if (item === "ALL Airports") {
          destinationAirportAll = true;
        }
      });
    }

    let markupObj = {
      id: currentItem == null ? 0 : currentItem.id,
      agentId: sessionStorage.getItem("agentId") ?? 0,
      airlineIds: airlineId.toString(),
      originCountryIds: originCountryId.toString(),
      destinationCountryIds: destinationCountryId.toString(),
      validFrom: validFrom,
      validTo: validTo,
      rbDs: rbDs,
      cabinClass: cabinClassId,
      currencyId: currencyId,
      markupTypeId: markupTypeId,
      markupValue: markupValue,
      commissionTypeId: commissionTypeId,
      commissionValue: commissionValue,
      markupApplyOn: markupApplyOn,
      commissionApplyOn: commissionApplyOn,
      applyFor: applyForId,
      originAirportCodes:
        originAirportAll === false
          ? originAirportCode?.toString()
          : "ALL Airports",
      destinationAirportCodes:
        destinationAirportAll === false
          ? destinationAirportCode?.toString()
          : "ALL Airports",
      fareType: fareTypeId,
      tripType: tripTypeId,
      isActive: isActive,
    };

    if ((currentItem == null ? 0 : currentItem.id) > 0) {
      const putData = async () => {
        const response = await axios.put(
          environment.markup,
          markupObj,
          environment.headerToken
        );
        if (response.data > 0) {
          handleGetAgentMarkups(currentPageNumber);
          toast.success("Thanks! Markup updated successfully..");
          clearForm();
        } else {
          toast.error("Sorry! Markup not updated..");
        }
      };
      putData();
    } else {
      const postData = async () => {
        const response = await axios.post(
          environment.markup,
          markupObj,
          environment.headerToken
        );
        if (response.data > 0) {
          toast.success("Thanks! Markup created successfully..");
          clearForm();
        } else {
          toast.error("Sorry! Markup not created..");
        }
      };
      postData();
    }
  };
  useEffect(() => {
    handleGetAgentMarkups(currentPageNumber);
    handleCreateItem();
  }, [currentPageNumber]);

  const handleDeleteItem = (item) => {
    let result = window.confirm("Are you sure");
    if (result) {
      const deleteMarkup = async () => {
        const response = await axios
          .put(
            environment.markupsDelete + "/" + item.id,
            null,
            environment.headerToken
          )
          .catch((error) => {});
        if (response !== undefined && response.data > 0) {
          handleGetAgentMarkups(currentPageNumber);
          toast.success("Thanks! Data deleted successfully..");
        } else {
          toast.error("Sorry! Data not deleted..");
        }
      };
      deleteMarkup();
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content">
          <ToastContainer position="bottom-right" autoClose={1500} />
          <form
            className="mx-5 my-3"
            encType="multipart/form-data"
            style={{ minHeight: "500px" }}
          >
            <div className="card">
              <div className="card-header fw-bold" style={{ color: "#02046a" }}>
                Markup
              </div>
              <div className="card-body">
                <div className="m-4">
                  <ul className="nav nav-tabs" id="balanceTab">
                    <li className="nav-item">
                      <a
                        href="#newmarkup"
                        className="nav-link active"
                        data-bs-toggle="tab"
                        onClick={handleCreateItem}
                      >
                        New Markup
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#existing"
                        className="nav-link"
                        data-bs-toggle="tab"
                        onClick={() => handleGetAgentMarkups(1)}
                      >
                        Existing
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="newmarkup">
                      {/* <h4 className="mt-4">New Markup</h4>
                      <hr className="mb-3" /> */}
                      <h3 className="mt-4">Markup Configuration</h3>
                      <hr />
                      <div className="row my-3">
                        <div className="col-sm-3">
                          <label>Airline</label>
                          <MultiSelectComponent
                            id="mtselement"
                            value={airlineId}
                            dataSource={airlineList}
                            fields={fieldIds}
                            placeholder="Select Airline"
                            onChange={(e) => setAirlineId(e.target.value)}
                          />
                        </div>
                        <div className="col-sm-3">
                          <label>Origin Country</label>
                          <MultiSelectComponent
                            id="mtselement"
                            value={originCountryId}
                            dataSource={countryList}
                            fields={fieldIds}
                            placeholder="Select Origin Country"
                            onChange={(e) => setOriginCountryId(e.target.value)}
                          />
                        </div>
                        <div className="col-sm-3">
                          <label>Destination Country</label>
                          <MultiSelectComponent
                            id="mtselement"
                            value={destinationCountryId}
                            dataSource={countryList}
                            fields={fieldIds}
                            placeholder="Select Destination Country"
                            onChange={(e) =>
                              setDestinationCountryId(e.target.value)
                            }
                          />
                        </div>
                        <div className="col-sm-3">
                          <label>Valid From</label>
                          <input
                            type={"date"}
                            max="9999-12-31"
                            pattern="\d{4}-\d{2}-\d{2}"
                            value={validFrom?.split("T")[0]}
                            className="form-control"
                            onChange={(e) => setValidFrom(e.target.value)}
                          ></input>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <label>Valid To</label>
                          <input
                            type={"date"}
                            max="9999-12-31"
                            pattern="\d{4}-\d{2}-\d{2}"
                            value={validTo?.split("T")[0]}
                            className="form-control"
                            onChange={(e) => setValidTo(e.target.value)}
                          ></input>
                        </div>
                        <div className="col-sm-3">
                          <label>RBD</label>
                          <input
                            type={"text"}
                            value={rbDs}
                            className="form-control"
                            placeholder="RBD"
                            onChange={(e) => setRBDs(e.target.value)}
                          ></input>
                        </div>
                        <div className="col-sm-3">
                          <label>
                            Cabin Class<span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            className="form-select"
                            value={null}
                            placeholder="Cabin Class"
                            onChange={(e) => setCabinClassId(e.target.value)}
                          >
                            {cabinclassList.map((item, index) => {
                              return (
                                <option key={index + 1} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="col-sm-3">
                          <label>
                            Is Active?<span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type={"checkbox"}
                            checked={isActive ?? true}
                            className="form-check"
                            onChange={(e) => setIsActive(e.target.checked)}
                          ></input>
                        </div>
                      </div>
                      <h3>Markup Value</h3>
                      <hr />
                      <div className="row my-3">
                        <div className="col-sm-3">
                          <label>
                            Currency<span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            className="form-select"
                            value={null}
                            placeholder="Currency"
                            onChange={(e) => setCurrencyId(e.target.value)}
                          >
                            {currencyList.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="col-sm-3">
                          <label>Markup Type</label>
                          <select
                            className="form-select"
                            value={null}
                            placeholder="Markup Type"
                            onChange={(e) => setMarkupTypeId(e.target.value)}
                          >
                            {markuptypeList.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="col-sm-3">
                          <label>Markup Value</label>
                          <input
                            type={"number"}
                            value={markupValue}
                            className="form-control"
                            onChange={(e) => setMarkupValue(e.target.value)}
                            placeholder="Markup Value"
                          ></input>
                        </div>
                        <div className="col-sm-3">
                          <label>
                            Markup Apply On
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            className="form-select"
                            value={null}
                            placeholder="Apply On"
                            onChange={(e) => setMarkupApplyOn(e.target.value)}
                          >
                            {applyonList.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="col-sm-3">
                          <label>Commission Type</label>
                          <select
                            className="form-select"
                            value={commissionTypeId}
                            placeholder="Commission Type"
                            onChange={(e) =>
                              setCommissionTypeId(e.target.value)
                            }
                          >
                            {commissiontypeList.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="col-sm-3">
                          <label>Commission Value</label>
                          <input
                            type={"number"}
                            value={commissionValue}
                            className="form-control"
                            onChange={(e) => setCommissionValue(e.target.value)}
                            placeholder="Commission Value"
                          ></input>
                        </div>
                        <div className="col-sm-3">
                          <label>
                            Commission Apply On
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            className="form-select"
                            value={null}
                            placeholder="Apply On"
                            onChange={(e) =>
                              setCommissionApplyOn(e.target.value)
                            }
                          >
                            {applyonList.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="col-sm-3">
                          <label>
                            Apply For<span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            className="form-select"
                            value={null}
                            placeholder="Apply On"
                            onChange={(e) => setApplyForId(e.target.value)}
                          >
                            {applyforList.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <label>Origin Airport</label>
                          <MultiSelectComponent
                            id="mtselement"
                            value={originAirportCode}
                            dataSource={airportList}
                            fields={fieldCodes}
                            placeholder="Select Origin Airport"
                            onChange={(e) =>
                              setOriginAirportCode(e.target.value)
                            }
                          />
                          {/* <select
                            className="form-select"
                            value={null}
                            placeholder="Origin Airport"
                            onChange={(e) => setOriginAirportCode(e.target.value)}
                          >
                            <option key={0}>Select Origin Airport</option>
                            {airportList.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.code}
                                </option>
                              );
                            })}
                          </select> */}
                        </div>
                        <div className="col-sm-3">
                          <label>Destination Airport</label>
                          <MultiSelectComponent
                            id="mtselement"
                            value={destinationAirportCode}
                            dataSource={airportList}
                            fields={fieldCodes}
                            placeholder="Select Destination Airport"
                            onChange={(e) =>
                              setDestinationAirportCode(e.target.value)
                            }
                          />
                          {/* <select
                            className="form-select"
                            value={null}
                            placeholder="Destination Airport"
                            onChange={(e) =>
                              setDestinationAirportCode(e.target.value)
                            }
                          >
                            <option key={0}>Select Destination Airport</option>
                            {airportList.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.code}
                                </option>
                              );
                            })}
                          </select> */}
                        </div>
                        <div className="col-sm-3">
                          <label>Fare Type</label>
                          <select
                            className="form-select"
                            value={null}
                            placeholder="Fare Type"
                            onChange={(e) => setFareTypeId(e.target.value)}
                          >
                            <option key={0}>Select Fare Type</option>
                            {faretypeList.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="col-sm-3">
                          <label>Trip Type</label>
                          <select
                            className="form-select"
                            value={null}
                            placeholder="Trip Type"
                            onChange={(e) => setTripTypeId(e.target.value)}
                          >
                            <option key={0}>Select Trip Type</option>
                            {triptypeList.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div
                        className="content text-center"
                        style={{ marginTop: "5px" }}
                      >
                        <button
                          type="button"
                          className="btn button-color fw-bold text-white col-sm-1 rounded"
                          onClick={() => handleMarkupSubmit()}
                        >
                          Submit
                        </button>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="existing">
                      <h4 className="mt-4">Existing</h4>
                      <hr className="mb-3" />
                      {/* <button onClick={() => handleCreateItem()} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#accountModal">
                                            Add
                                        </button> */}

                      <div
                        className="modal fade"
                        id="accountModal"
                        tabIndex={-1}
                        aria-labelledby="accountModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="modal-title"
                                id="accountModalLabel"
                              >
                                {currentItem === null ? "Add" : "Edit"} Markup
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <h3>Required Fields</h3>
                              <hr />
                              <div className="row my-3">
                                {/* <div className='col-sm-3'>
                                                                <label>Airline<span style={{ color: 'red' }}>*</span></label>
                                                                <select className="form-select" value={''} placeholder='Airline' onChange={(e) => setAirlineId(e.target.value)}>
                                                                    {
                                                                        airlineList.map((item, index) => {
                                                                            return <option key={index} value={item.id} >{item.code}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className='col-sm-3'>
                                                                <label>Origin Country<span style={{ color: 'red' }}>*</span></label>
                                                                <select className="form-select" value={''} placeholder='Origin Country' onChange={(e) => setOriginCountryId(e.target.value)}>
                                                                    {
                                                                        countryList.map((item, index) => {
                                                                            return <option key={index} value={item.id} >{item.code}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className='col-sm-3'>
                                                                <label>Destination Country<span style={{ color: 'red' }}>*</span></label>
                                                                <select className="form-select" value={''} placeholder='Destination Country' onChange={(e) => setDestinationCountryId(e.target.value)}>
                                                                    {
                                                                        countryList.map((item, index) => {
                                                                            return <option key={index} value={item.id} >{item.code}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div> */}
                                <div className="col-sm-3">
                                  <label>Airline</label>
                                  <MultiSelectComponent
                                    id="mtselement"
                                    value={airlineId}
                                    dataSource={airlineList}
                                    fields={fieldIds}
                                    placeholder="Select Airline"
                                    onChange={(e) =>
                                      setAirlineId(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-sm-3">
                                  <label>Origin Country</label>
                                  <MultiSelectComponent
                                    id="mtselement"
                                    value={originCountryId}
                                    dataSource={countryList}
                                    fields={fieldIds}
                                    placeholder="Select Origin Country"
                                    onChange={(e) =>
                                      setOriginCountryId(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-sm-3">
                                  <label>Destination Country</label>
                                  <MultiSelectComponent
                                    id="mtselement"
                                    value={destinationCountryId}
                                    dataSource={countryList}
                                    fields={fieldIds}
                                    placeholder="Select Destination Country"
                                    onChange={(e) =>
                                      setDestinationCountryId(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-sm-3">
                                  <label>Valid From</label>
                                  <input
                                    type={"date"}
                                    max="9999-12-31"
                                    pattern="\d{4}-\d{2}-\d{2}"
                                    value={validFrom?.split("T")[0]}
                                    className="form-control"
                                    onChange={(e) =>
                                      setValidFrom(e.target.value)
                                    }
                                  ></input>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <div className="col-sm-3">
                                  <label>Valid To</label>
                                  <input
                                    type={"date"}
                                    pattern="\d{4}-\d{2}-\d{2}"
                                    max="9999-12-31"
                                    value={validTo?.split("T")[0]}
                                    className="form-control"
                                    onChange={(e) => setValidTo(e.target.value)}
                                  ></input>
                                </div>
                                <div className="col-sm-3">
                                  <label>RBD</label>
                                  <input
                                    type={"text"}
                                    value={rbDs}
                                    className="form-control"
                                    placeholder="RBD"
                                    onChange={(e) => setRBDs(e.target.value)}
                                  ></input>
                                </div>
                                <div className="col-sm-3">
                                  <label>
                                    Cabin Class
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <select
                                    className="form-select"
                                    value={cabinClassId}
                                    placeholder="Cabin Class"
                                    onChange={(e) =>
                                      setCabinClassId(e.target.value)
                                    }
                                  >
                                    {cabinclassList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                <div className="col-sm-3">
                                  <label>
                                    Is Active?
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <input
                                    type={"checkbox"}
                                    checked={isActive ?? true}
                                    className="form-check"
                                    onChange={(e) =>
                                      setIsActive(e.target.checked)
                                    }
                                  ></input>
                                </div>
                              </div>
                              <h3>Markup Configuration</h3>
                              <hr />
                              <div className="row my-3">
                                <div className="col-sm-3">
                                  <label>
                                    Currency
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <select
                                    className="form-select"
                                    value={currencyId}
                                    placeholder="Currency"
                                    onChange={(e) =>
                                      setCurrencyId(e.target.value)
                                    }
                                  >
                                    {currencyList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                <div className="col-sm-3">
                                  <label>Markup Type</label>
                                  <select
                                    className="form-select"
                                    value={markupTypeId}
                                    placeholder="Markup Type"
                                    onChange={(e) =>
                                      setMarkupTypeId(e.target.value)
                                    }
                                  >
                                    {markuptypeList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                <div className="col-sm-3">
                                  <label>Markup Value</label>
                                  <input
                                    type={"number"}
                                    value={markupValue}
                                    className="form-control"
                                    onChange={(e) =>
                                      setMarkupValue(e.target.value)
                                    }
                                    placeholder="Markup Value"
                                  ></input>
                                </div>
                                <div className="col-sm-3">
                                  <label>
                                    Markup Apply On
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <select
                                    className="form-select"
                                    value={markupApplyOn}
                                    placeholder="Apply On"
                                    onChange={(e) =>
                                      setMarkupApplyOn(e.target.value)
                                    }
                                  >
                                    {applyonList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                <div className="col-sm-3">
                                  <label>Commission Type</label>
                                  <select
                                    className="form-select"
                                    value={commissionTypeId}
                                    placeholder="Commission Type"
                                    onChange={(e) =>
                                      setCommissionTypeId(e.target.value)
                                    }
                                  >
                                    {commissiontypeList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                <div className="col-sm-3">
                                  <label>Commission Value</label>
                                  <input
                                    type={"number"}
                                    value={commissionValue}
                                    className="form-control"
                                    onChange={(e) =>
                                      setCommissionValue(e.target.value)
                                    }
                                    placeholder="Commission Value"
                                  ></input>
                                </div>
                                <div className="col-sm-3">
                                  <label>
                                    Commission Apply On
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <select
                                    className="form-select"
                                    value={commissionApplyOn}
                                    placeholder="Apply On"
                                    onChange={(e) =>
                                      setCommissionApplyOn(e.target.value)
                                    }
                                  >
                                    {applyonList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                <div className="col-sm-3">
                                  <label>
                                    Apply For
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <select
                                    className="form-select"
                                    value={null}
                                    placeholder="Apply On"
                                    onChange={(e) =>
                                      setApplyForId(e.target.value)
                                    }
                                  >
                                    <option key={0}>Select Apply For</option>
                                    {applyforList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </div>

                              <div className="row mb-3">
                                <div className="col-sm-3">
                                  <label>Origin Airport</label>
                                  <MultiSelectComponent
                                    id="mtselement"
                                    value={originAirportCode}
                                    dataSource={airportList}
                                    fields={fieldCodes}
                                    placeholder="Select Origin Airport"
                                    onChange={(e) =>
                                      setOriginAirportCode(e.target.value)
                                    }
                                  />
                                  {/* <select
                                    className="form-select"
                                    value={originAirportCode}
                                    placeholder="Origin Airport"
                                    onChange={(e) =>
                                      setOriginAirportCode(e.target.value)
                                    }
                                  >
                                    {airportList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>
                                          {item.code}
                                        </option>
                                      );
                                    })}
                                  </select> */}
                                </div>
                                <div className="col-sm-3">
                                  <label>Destination Airport</label>
                                  <MultiSelectComponent
                                    id="mtselement"
                                    value={destinationAirportCode}
                                    dataSource={airportList}
                                    fields={fieldCodes}
                                    placeholder="Select Destination Airport"
                                    onChange={(e) =>
                                      setDestinationAirportCode(e.target.value)
                                    }
                                  />
                                  {/* <select
                                    className="form-select"
                                    value={destinationAirportCode}
                                    placeholder="Destination Airport"
                                    onChange={(e) =>
                                      setDestinationAirportCode(e.target.value)
                                    }
                                  >
                                    {airportList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>
                                          {item.code}
                                        </option>
                                      );
                                    })}
                                  </select> */}
                                </div>
                                <div className="col-sm-3">
                                  <label>Fare Type</label>
                                  <select
                                    className="form-select"
                                    value={fareTypeId}
                                    placeholder="Fare Type"
                                    onChange={(e) =>
                                      setFareTypeId(e.target.value)
                                    }
                                  >
                                    {faretypeList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                <div className="col-sm-3">
                                  <label>Trip Type</label>
                                  <select
                                    className="form-select"
                                    value={tripTypeId}
                                    placeholder="Trip Type"
                                    onChange={(e) =>
                                      setTripTypeId(e.target.value)
                                    }
                                  >
                                    {triptypeList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Close
                              </button>
                              <button
                                type="button"
                                className="btn button-color text-white fw-bold rounded"
                                onClick={() => handleMarkupSubmit()}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <table
                        className="table table-striped table-bordered"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Code</th>
                            <th>Status</th>
                            <th>Origin</th>
                            <th>Destination</th>
                            <th>Airline</th>
                            <th>Travell Validity From</th>
                            <th>Travell Validity To</th>
                            <th>Created On</th>
                            <th>Markup Value</th>
                            <th>Discount Value</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agentMarkupList.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  {(currentPageNumber - 1) * pageSize +
                                    index +
                                    1}
                                </td>
                                <td>
                                  {/* <a
                                    href="#"
                                    data-bs-toggle="modal"
                                    onClick={() => handleEditItem(item)}
                                    data-bs-target="#accountModal"
                                  >
                                    {item.code}
                                  </a> */}
                                  {item.code}
                                </td>
                                <td>
                                  {item.isActive === true
                                    ? "Active"
                                    : "Inactive"}
                                </td>
                                <td>{item.originCountryCodes}</td>
                                <td>{item.destinationCountryCodes}</td>
                                <td>{item.airlineNames}</td>
                                <td>
                                  {item.validFrom !== null
                                    ? moment(item.validFrom).format(
                                        "yyyy-MM-DD"
                                      )
                                    : ""}
                                </td>
                                <td>
                                  {item.validFrom !== null
                                    ? moment(item.validTo).format("yyyy-MM-DD")
                                    : ""}
                                </td>
                                <td>
                                  {moment(item.createdDate).format(
                                    "yyyy-MM-DD"
                                  )}
                                </td>
                                <td>
                                  {item.markupTypeId === 1 ? "Flat" : "Percent"}{" "}
                                  {item.markupValue}
                                </td>
                                <td>
                                  {item.commissionTypeId === 1
                                    ? "Flat"
                                    : "Percent"}{" "}
                                  {item.commissionValue}
                                </td>
                                <td>
                                  <span
                                    onClick={() => handleDeleteItem(item)}
                                    className="text-danger me-2"
                                  >
                                    <i
                                      class="fa fa-trash"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                  <span
                                    data-bs-target="#accountModal"
                                    data-bs-toggle="modal"
                                    onClick={() => handleEditItem(item)}
                                    className="text-danger"
                                  >
                                    <i class="fas fa-edit"></i>
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <ReactPaginate
                        previousLabel={"previous"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination justify-content-center"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Markup;
