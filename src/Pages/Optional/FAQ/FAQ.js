import React from "react";
import FooterLR from "../FooterLR/FooterLR";
import Navbar from "../Navbar/Navbar";

const FAQ = () => {
  window.scrollTo(0,0);
  return (
    <>
    <Navbar></Navbar>
    <div className="hold-transition login-page search-panel-bg" style={{height:"100%"}}>
      <div className="container mt-3 text-white">
        <div className="row">
          <div className="col-md-12 margin-top margin-bottom">
            <h4>Frequently Asked Questions</h4>
          </div>

          <div className="col-md-12">
            <div className="faq-item mb-5">
              <ul className="toggle-menu list-items list--items-2 pt-4">
                <li>
                  <a
                    href="#"
                    className="toggle-menu-icon d-flex justify-content-between align-items-center fw-bold text-dark"
                  >
                    How do I know my reservation was booked?
                    <i className="la la-angle-down"></i>
                  </a>
                  <ul className="toggle-drop-menu pt-2">
                    <li className="line-height-26">
                      We'll send you an email or a SMS to confirm your flight
                      booking.
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#"
                    className="toggle-menu-icon d-flex justify-content-between align-items-center fw-bold text-dark"
                  >
                    I did not receive any confirmation email what should I do?
                    <i className="la la-angle-down"></i>
                  </a>
                  <ul className="toggle-drop-menu pt-2">
                    <li className="line-height-26">
                      Please check your spam folder for confirmation email if
                      not found contact Triplover support center.
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#"
                    className="toggle-menu-icon d-flex justify-content-between align-items-center fw-bold text-dark"
                  >
                    How do I get a boarding pass for an e-ticket?
                    <i className="la la-angle-down"></i>
                  </a>
                  <ul className="toggle-drop-menu pt-2">
                    <li className="line-height-26">
                      You need to show your e-ticket confirmation email and your
                      e-ticket number at the check-in counter. The airline
                      representative will issue your boarding pass at that time.
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#"
                    className="toggle-menu-icon d-flex justify-content-between align-items-center fw-bold text-dark"
                  >
                    Do I have to show my e-ticket confirmation email at the
                    airline check-in counter?
                    <i className="la la-angle-down"></i>
                  </a>
                  <ul className="toggle-drop-menu pt-2">
                    <li className="line-height-26">
                      Yes, you do. Some airports don't allow you inside without
                      a printout of your e-ticket, so be sure to carry one with
                      you.{" "}
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#"
                    className="toggle-menu-icon d-flex justify-content-between align-items-center fw-bold text-dark"
                  >
                    What is your refund policy for flight?
                    <i className="la la-angle-down"></i>
                  </a>
                  <ul className="toggle-drop-menu pt-2">
                    <li className="line-height-26">
                      We follow the airlines refund policy. And airlines have
                      different policies for different flights and booking
                      classes. We'll be able to let you know the refund policy
                      when ticket booked on a particular flight.
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#"
                    className="toggle-menu-icon d-flex justify-content-between align-items-center fw-bold text-dark"
                  >
                    When will I get my refund?
                    <i className="la la-angle-down"></i>
                  </a>
                  <ul className="toggle-drop-menu pt-2">
                    <li className="line-height-26">
                      Refunds, if applicable, will immediately be submitted to
                      our bank. From the submission/refund date banks generally
                      take up to 10 business days to process the refund payment
                      and transfer the funds into a customer’s account. Please
                      note, some banks can take up to 15-30 days, or until the
                      next billing cycle. The refund should be converted to your
                      local currency by your credit card company.
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#"
                    className="toggle-menu-icon d-flex justify-content-between align-items-center fw-bold text-dark"
                  >
                    How do I change my password?
                    <i className="la la-angle-down"></i>
                  </a>
                  <ul className="toggle-drop-menu pt-2">
                    <li className="line-height-26">
                      Sign in to your triplover.com account. In the{" "}
                      <b>Manage Subagent Employees</b> section under the My
                      Accounts Administration tab, click on the (Change your
                      password) option. Then hit the (Save profile) button on
                      the bottom.
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#"
                    className="toggle-menu-icon d-flex justify-content-between align-items-center fw-bold text-dark"
                  >
                    I've forgotten my password. What do I do?
                    <i className="la la-angle-down"></i>
                  </a>
                  <ul className="toggle-drop-menu pt-2">
                    <li className="line-height-26">
                      Don’t worry; Click, follow the on–screen instructions and
                      we’ll send you an email telling you what to do.
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#"
                    className="toggle-menu-icon d-flex justify-content-between align-items-center fw-bold text-dark"
                  >
                    What if my password is not recognized?
                    <i className="la la-angle-down"></i>
                  </a>
                  <ul className="toggle-drop-menu pt-2">
                    <li className="line-height-26">
                      Check your username and password again. And again.
                      Passwords are case sensitive; make sure your caps lock
                      isn't on. If you've forgotten your password, use the
                      (Forget password?) link and type in your email address or
                      account name. We'll then send you the password.
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#"
                    className="toggle-menu-icon d-flex justify-content-between align-items-center fw-bold text-dark"
                  >
                    How do I edit my account information?
                    <i className="la la-angle-down"></i>
                  </a>
                  <ul className="toggle-drop-menu pt-2">
                    <li className="line-height-26">
                      Sign in to your triplover.com account and get to the
                      (Profile) tab. You can edit your information here and just
                      be sure to hit the (Save profile) button when you are
                      done.
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <FooterLR></FooterLR>
    </div>
    </>
  );
};

export default FAQ;
