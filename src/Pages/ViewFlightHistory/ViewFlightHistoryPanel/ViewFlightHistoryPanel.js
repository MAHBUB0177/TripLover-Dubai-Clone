import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../images/logo/logo-combined.png";

const ViewFlightHistoryPanel = () => {
  const print = () => {
    window.print();
  };
  return (
    <div>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content">
          <div className="container my-2 py-2">
            <div id="ui-view" data-select2-id="ui-view">
              <div>
                <div className="card box-shadow">
                  <div className="card-header">
                    <img
                      src={logo}
                      alt="FirstTrip logo"
                      style={{ width: "100px" }}
                    />
                    <span className="ms-3">
                      FirstTrip Reference :&nbsp;
                      <strong> STFLB1643699665766 (DAC - DXB)</strong>
                    </span>
                    <Link
                      className="btn btn-sm btn-secondary float-right mr-1 d-print-none"
                      to="#"
                      onClick={print}
                      data-abc="true"
                    >
                      <i className="fa fa-print"></i> Print
                    </Link>
                  </div>
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-3">
                        <h6 className="mb-3">From:</h6>
                        <div>
                          <strong>
                            Hazrat Shahjalal International Airport, Dhaka,
                            Bangladesh
                          </strong>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <h6 className="mb-3">To:</h6>
                        <div>
                          <strong>Dubai Intl, Dubai</strong>
                        </div>
                      </div>
                      <div className="col-sm-1"></div>
                      <div className="col-sm-5">
                        <h6 className="mb-3">Details:</h6>
                        <div>
                          FirstTrip Reference :
                          <strong> STFLB1643699665766</strong>
                        </div>
                        <div>
                          Booking Created : <strong>April 30, 2019</strong>
                        </div>
                        <div>
                          Reservation PNR :<strong> NYC09090390</strong>
                        </div>
                        <div>
                          Airline PNR : <strong>BBBootstrap Inc</strong>
                        </div>
                        <div>
                          Time Limit : <strong>Before 03 Feb,2022 19:14</strong>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive-sm">
                      <table className="table table-striped">
                        <thead className="text-center">
                          <tr>
                            <th>#</th>
                            <th>AirLines</th>
                            <th>Departure</th>
                            <th>Arrival</th>
                            <th>Duration</th>
                            <th>Passenger</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          <tr>
                            <td className="center">1</td>
                            <td className="left">
                              Saudi Airlines
                              <br />
                              BOEING 777-300 RBD: K
                            </td>
                            <td className="left">Mon, 14 March 2022, 12:35</td>
                            <td className="center">
                              Mon, 14 March 2022, 17:25
                            </td>
                            <td className="right">07 hrs,50 mins</td>
                            <td>ADT 1</td>
                            <td className="right">AED 999,00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-sm-5">
                        <div className="table-responsive-sm">
                          <table className="table table-striped">
                            <thead className="text-center">
                              <tr>
                                <th colSpan={3}>Passenger Information</th>
                              </tr>
                            </thead>
                            <tbody className="text-center">
                              <tr>
                                <td>Ratul Islam</td>
                                <td>ratul@gmail.com</td>
                                <td>01625001500</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-5 ml-auto">
                        <table className="table table-clear">
                          <tbody>
                            <tr>
                              <td className="left">
                                <strong>Subtotal</strong>
                              </td>
                              <td className="right">AED 8.497,00</td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong>Commission (20%)</strong>
                              </td>
                              <td className="right">AED 1,699,40</td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong>VAT (10%)</strong>
                              </td>
                              <td className="right"> AED 679,76</td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong>Total</strong>
                              </td>
                              <td className="right">
                                <strong>AED 7.477,36</strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="text-center text-white py-2">
          <strong>Copyright &copy; 2020-2022 All rights reserved.</strong>
        </div>
      </div>
    </div>
  );
};

export default ViewFlightHistoryPanel;
