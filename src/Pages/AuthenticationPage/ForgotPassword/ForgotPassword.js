import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../images/logo/logo-combined.png";
import axios from "axios";
import { environment } from "../../../Pages/SharePages/Utility/environment.js";
import { toast, ToastContainer } from "react-toastify";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMail, setSuccessMail] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    const sendEmail = async () => {
      setLoading(true);
      let sendObj = { email: email };
      const response = await axios.post(
        environment.sendEmailWithResetLink,
        sendObj
      );
      if (response.data.isSuccess === true) {
        setSuccessMail(true);
      } else {
        setSuccessMail(false);
        toast.error(response.data.message);
      }
      setLoading(false);
    };
    sendEmail();
    e.preventDefault();
  };

  return (
    <div className="hold-transition login-page search-panel-bg">
      <ToastContainer position="bottom-right" autoClose={1500} />
      <div className="login-box">
        {/* <div className="login-logo">
          <img src={logo} alt="Triplover" />
          <Link to="/"></Link>
        </div> */}

        <div className="card">
          <div className="card-header text-center">
            <Link to="/">
              <img src={logo} alt="Triplover" />
            </Link>
          </div>
          <div className="card-body login-card-body">
            {successMail ? (
              <p className="login-box-msg">Please check your email.</p>
            ) : (
              <p className="login-box-msg">
                Provide your registered email with Triplover to reset your
                password.
              </p>
            )}

            {successMail ? (
              <></>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control rounded"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    pattern="[a-zA-Z0-9_\.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope"></span>
                    </div>
                  </div>
                </div>
                <div className="row pb-4">
                  <div className="col-6">
                    <button
                      type="submit"
                      className="btn button-color text-white fw-bold btn-block rounded btn-sm"
                      disabled={loading ? true : false}
                    >
                      Send Mail
                    </button>
                  </div>
                  <div className="col-6">
                    <Link
                      to="/"
                      className="btn text-white fw-bold btn-block rounded btn-sm"
                      style={{ backgroundColor: "#5c5c65" }}
                    >
                      Back
                    </Link>
                  </div>
                </div>
              </form>
            )}

            {/* <p className="mt-3 mb-1 font-size">
              <Link to="/">
                <span className="fw-bold" style={{ color: "#1d94e4" }}>
                  Sign In
                </span>
              </Link>
            </p> */}
            {/* <p className="mb-0">
              <a href="register.html" className="text-center">
                Register a new membership
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
