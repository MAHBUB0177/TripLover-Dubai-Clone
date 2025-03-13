import React from "react";
import Footer from "../../SharePages/Footer/Footer";
import FooterLR from "../FooterLR/FooterLR";
import Navbar from "../Navbar/Navbar";

const RefundAndCancellation = () => {
  window.scrollTo(0, 0);
  return (
    <>
      <Navbar></Navbar>
      <div
        className="hold-transition login-page search-panel-bg py-4"
        style={{ height: "100%", background: "white ", position: "relative" }}
      >
        <div className="container mt-3">
          <div className="row">
            <div className="col-md-12">
              <h3 style={{ fontWeight: "bold", fontSize: "20px" }}>
                Refund &amp; Cancellation
              </h3>
            </div>

            <div className="col-md-12">
              <p>
                Most of our airline tickets, hotels, pre-paid car rentals,
                vacation packages and service fees are non-refundable after the
                booking. All cancellations must be done through email used at
                the time of booking and over the phone only.We can accept refund
                requests only if the following conditions have been met:
              </p>
              <ul
                className=""
                style={{
                  listStyleType: "disc",
                  listStylePosition: "inside",
                  marginLeft: "20px",
                }}
              >
                <li>
                  You have applied for a cancellation and refund with us and if
                  the fare rules accepts for cancellation and refunds;
                </li>
                <li>
                  You are not a "no show" (most "no show" bookings are
                  in-eligible for any waiver from suppliers for refund
                  processing); and
                </li>
                <li>
                  We are able to secure waivers from suppliers to process this
                  requested cancellation and refund.
                </li>
              </ul>
              <h5 className="my-2">Our Fees And Exceptions</h5>
              <p>
                In addition to each Travel Supplier's cost and fees including
                Bank/Payment Gateway Charges, Triplover will charge a service
                fee as described below. All Triplover fees are charged on a
                per-person or per-ticket basis and are non-refundable.
              </p>
              {/* <h5 className="text-center py-2">Cancellation &amp; Refunds</h5> */}
              <h5 className="text-start my-2">
                Agent Assisted Cancellation/ Refund
              </h5>
              {/* <h5 className="py-2">Airline Economy Class </h5> */}
              <table className="table table-bordered text-dark">
                <tbody>
                  <tr>
                    <td style={{ width: "50%" }}>Economy Class</td>
                    <td>Free</td>
                  </tr>
                  <tr>
                    <td>Business/First Class</td>
                    <td>Free</td>
                  </tr>
                </tbody>
              </table>
              {/* <h5 className="py-2">Airline Business/First Class</h5>
            <table className="table table-bordered text-dark">
              <tbody>
                <tr>
                  <td style={{width:'50%'}}>Domestic</td>
                  <td>AED 18</td>
                </tr>
                <tr>
                  <td>International</td>
                  <td>AED 80</td>
                </tr>
              </tbody>
            </table>
            <h5 className="text-center py-2">
              Changes To Existing Tickets (Exchange)
            </h5>
            <h5 className="text-center">Agent Assisted Re-issue</h5>
            <h5 className="py-2">Airline Economy Class </h5>
            <table className="table table-bordered text-dark">
              <tbody>
                <tr>
                  <td style={{width:'50%'}}>Domestic</td>
                  <td>AED 12</td>
                </tr>
                <tr>
                  <td>International</td>
                  <td>AED 18</td>
                </tr>
              </tbody>
            </table>
            <h5 className="py-2">Airline Business/First Class</h5>
            <table className="table table-bordered text-dark">
              <tbody>
                <tr>
                  <td style={{width:'50%'}}>Domestic</td>
                  <td>AED 18</td>
                </tr>
                <tr>
                  <td>International</td>
                  <td>AED 80</td>
                </tr>
              </tbody>
            </table> */}
              <h5 className="py-2">
                Airlines schedule changes/flight cancellations
              </h5>
              <p>
                All Airlines have differing rules and policies regarding
                schedule changes, which are beyond our control.Due to the
                operational needs of each airline, changes are often made to the
                flights that they are currently operating.Often these changes
                are a prediction of travel needs for a future dates but can also
                reflect same day changes. Types of changes could be: flight
                number changes, time changes, routing, date changes and or
                cancellations. Cancellations include when an airline has stopped
                or temporarily canceled service to certain cities, or stopped
                service on certain daysof the week.
              </p>
              <h5 className="py-2">Refund payment</h5>
              <p>
                Refund will only be reversed to the cardholder's account that
                has been used for transaction. In case of cash refund, gateway
                charge or processing will be deducted
              </p>
              <p>
                Triplover will process refund requests to gateway providers or
                to the card issuing bank only after receiving refund payment
                from airlines.
              </p>
              <h5 className="py-2">
                Reasons for cancellations or schedule changes may include
              </h5>
              <ul
                style={{
                  listStyleType: "disc",
                  listStylePosition: "inside",
                  marginLeft: "20px",
                }}
              >
                <li>Aircraft Technical Problem;</li>
                <li>Low/High Travel Season;</li>
                <li>Airport Terminal Or Gate Changes;</li>
                <li>Natural Disasters</li>
                <li>Civil Unrest;</li>
                <li>Bankruptcy.</li>
              </ul>
              <p>
                Triplover does not assume any liability whatsoever for cancelled
                flights, flights that are missed, or flights not connecting due
                to any scheduled changes made by the airlines.
              </p>
              <h5 className="py-2">Our policy on schedule changes</h5>
              <p>
                We make every attempt to notify the customer of any schedule
                changes. It is always best to contact the airline to reconfirm
                you flights within 72 hours of departure.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default RefundAndCancellation;
